import sys, json, urllib.request, urllib.parse, re, string, os, html
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv

load_dotenv()
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
PORT = int(os.getenv('PORT', '3000'))
HAS_YT_KEY = bool(YOUTUBE_API_KEY)

# ─── Google API (lazy) ───
def get_youtube():
    if HAS_YT_KEY:
        from googleapiclient.discovery import build
        return build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)
    return None

# ─── Helpers ───
def http_get(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return resp.read().decode('utf-8', errors='replace')
    except: return ''

def json_resp(data, status=200):
    return (json.dumps(data, ensure_ascii=False, default=str).encode(), status, {'Content-Type': 'application/json'})

def error_resp(msg, status=400):
    return json_resp({'error': msg}, status)

def read_body(handler):
    length = int(handler.headers.get('Content-Length', 0))
    if length == 0: return {}
    raw = handler.rfile.read(length)
    return json.loads(raw.decode('utf-8'))

# ─── Python Engine Functions (from py_engine.py) ───
def youtube_suggest(keyword):
    try:
        url = 'https://suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=' + urllib.parse.quote(keyword)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            raw = resp.read().decode('latin-1')
            match = re.search(r'\((\[.+\])\)', raw)
            if match and len(json.loads(match.group(1))) > 1:
                return [item[0] for item in json.loads(match.group(1))[1]]
    except: pass
    return []

def google_suggest(keyword):
    try:
        url = 'https://suggestqueries.google.com/complete/search?client=chrome&q=' + urllib.parse.quote(keyword)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if len(data) > 1: return data[1]
    except: pass
    return []

def score_keyword(keyword):
    words = keyword.lower().split()
    wc = len(words)
    score = 50
    if wc >= 4: score += 20
    elif wc >= 3: score += 12
    elif wc >= 2: score += 5
    else: score -= 15
    if len(keyword) >= 30: score += 10
    elif len(keyword) >= 20: score += 5
    if any(c.isdigit() for c in keyword): score += 8
    if any(w in words for w in ['how','what','why','where','can','does','is']): score += 10
    if any(w in words for w in ['best','top','review','buy','cheap','price','vs','compare']): score += 10
    if any(w in words for w in ['free','online','download']): score -= 8
    return max(0, min(100, score))

def estimate_competition(keyword):
    wc = len(keyword.lower().split())
    cs = 50
    if wc <= 1: cs += 35
    elif wc == 2: cs += 15
    elif wc == 3: cs -= 5
    elif wc >= 4: cs -= 20
    cs = max(0, min(100, cs))
    return 'High' if cs >= 65 else 'Medium' if cs >= 35 else 'Low'

# ─── Gemini AI ───
def call_gemini(prompt):
    if not GEMINI_API_KEY: return None
    try:
        data = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"maxOutputTokens": 3000, "temperature": 0.8}
        }).encode()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            return {'text': text}
    except: return None

# ─── Route Handler ───
class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')
        params = parse_qs(parsed.query)

        if path == '/api/settings/keys':
            self._send(*json_resp({'youtube': YOUTUBE_API_KEY, 'gemini': GEMINI_API_KEY}))

        elif path == '/api/categories':
            if not HAS_YT_KEY:
                self._send(*error_resp('YouTube API key not configured.'))
                return
            try:
                yt = get_youtube()
                region = params.get('regionCode', ['US'])[0]
                resp = yt.videoCategories().list(part='snippet', regionCode=region).execute()
                cats = [{'id': c['id'], 'title': c['snippet']['title']} for c in resp.get('items', []) if c['snippet'].get('assignable')]
                self._send(*json_resp({'categories': cats}))
            except Exception as e:
                self._send(*error_resp(str(e), 500))

        elif path == '/' or path == '':
            self._send_static()

        else:
            # Try static file
            self._send_static()

    def do_POST(self):
        path = urlparse(self.path).path.rstrip('/')
        try:
            body = read_body(self)
        except:
            self._send(*error_resp('Invalid JSON body'))
            return

        try:
            handler = ROUTE_MAP.get(path)
            if handler:
                self._send(*handler(body))
            else:
                self._send(*error_resp(f'Not found: {path}', 404))
        except Exception as e:
            self._send(*error_resp(str(e), 500))

    def _send(self, data, status, headers_dict):
        self.send_response(status)
        for k, v in headers_dict.items():
            self.send_header(k, v)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        if isinstance(data, str):
            data = data.encode('utf-8')
        self.wfile.write(data)

    def _send_static(self):
        import mimetypes
        public_dir = os.path.join(os.path.dirname(__file__), 'public')
        req_path = urlparse(self.path).path.lstrip('/')
        if not req_path: req_path = 'index.html'
        file_path = os.path.join(public_dir, req_path)
        if os.path.isfile(file_path) and os.path.realpath(file_path).startswith(os.path.realpath(public_dir)):
            with open(file_path, 'rb') as f:
                content = f.read()
            mime, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header('Content-Type', mime or 'application/octet-stream')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(content)
        else:
            index_path = os.path.join(public_dir, 'index.html')
            if os.path.isfile(index_path):
                with open(index_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(content)
            else:
                self._send(*json_resp({'status': 'TrendPulse AI running', 'version': '3.0.0'}))

# ─── Route Implementations ───
def route_seo_analyze(body):
    if not HAS_YT_KEY: return error_resp('YouTube API key not configured.')
    query, max_results = body.get('query', ''), min(body.get('maxResults', 10), 25)
    if not query: return error_resp('Search query is required')
    yt = get_youtube()
    search = yt.search().list(part='snippet', q=query, type='video', order='relevance', maxResults=max_results).execute()
    video_ids = ','.join([item['id']['videoId'] for item in search.get('items', []) if item['id'].get('videoId')])
    details = yt.videos().list(part='snippet,statistics,contentDetails', id=video_ids).execute() if video_ids else {}
    analyzed = []
    all_tags = []
    for v in details.get('items', []):
        sn = v['snippet']; st = v.get('statistics', {})
        title = sn['title']; desc = sn.get('description', ''); tags = sn.get('tags', [])
        seo = 0
        if 40 <= len(title) <= 70: seo += 20
        elif len(title) > 0: seo += 10
        if len(desc) >= 200: seo += 20
        elif len(desc) >= 100: seo += 10
        if len(tags) >= 10: seo += 20
        elif len(tags) >= 5: seo += 10
        if query.lower() in title.lower(): seo += 20
        if query.lower() in desc.lower(): seo += 20
        all_tags.extend([t.lower() for t in tags])
        analyzed.append({
            'title': title, 'videoId': v['id'],
            'thumbnail': sn.get('thumbnails', {}).get('high', {}).get('url', sn.get('thumbnails', {}).get('default', {}).get('url', '')),
            'views': int(st.get('viewCount', 0)), 'likes': int(st.get('likeCount', 0)),
            'comments': int(st.get('commentCount', 0)), 'tags': tags[:20],
            'titleLength': len(title), 'descriptionLength': len(desc), 'tagCount': len(tags),
            'seoScore': seo, 'publishedAt': sn['publishedAt']
        })
    analyzed.sort(key=lambda x: x['seoScore'], reverse=True)
    freq = {}
    for t in all_tags: freq[t] = freq.get(t, 0) + 1
    suggested = [t for t, _ in sorted(freq.items(), key=lambda x: -x[1])][:30]
    avg_title = round(sum(v['titleLength'] for v in analyzed) / len(analyzed)) if analyzed else 0
    avg_desc = round(sum(v['descriptionLength'] for v in analyzed) / len(analyzed)) if analyzed else 0
    return json_resp({
        'query': query, 'results': analyzed,
        'suggestions': {
            'tags': suggested, 'avgTitleLength': avg_title, 'avgDescLength': avg_desc,
            'titleTip': f'Top videos use {avg_title} characters average. Include keyword in title.',
            'descriptionTip': f'Aim for {max(avg_desc, 200)}+ characters.',
            'tagTip': f'Use {", ".join(suggested[:5])} as primary tags.'
        }
    })

def route_trending(body):
    if not HAS_YT_KEY: return error_resp('YouTube API key not configured.')
    yt = get_youtube()
    category = body.get('category', '0'); region = body.get('regionCode', 'US'); mx = min(body.get('maxResults', 20), 50)
    resp = yt.videos().list(part='snippet,statistics,contentDetails', chart='mostPopular', regionCode=region, videoCategoryId=category, maxResults=mx).execute()
    trending = []
    for v in resp.get('items', []):
        sn = v['snippet']
        trending.append({
            'title': sn['title'], 'videoId': v['id'], 'channelTitle': sn['channelTitle'],
            'thumbnail': sn.get('thumbnails', {}).get('high', {}).get('url', sn.get('thumbnails', {}).get('default', {}).get('url', '')),
            'views': int(v.get('statistics', {}).get('viewCount', 0)),
            'likes': int(v.get('statistics', {}).get('likeCount', 0)),
            'tags': (sn.get('tags') or [])[:15], 'publishedAt': sn['publishedAt'], 'category': sn.get('categoryId', '0')
        })
    return json_resp({'regionCode': region, 'category': category, 'trending': trending})

def route_trending_daily(body):
    geo_map = {'us':'united_states','ma':'morocco','fr':'france','gb':'united_kingdom','de':'germany','in':'india',
               'jp':'japan','br':'brazil','sa':'saudi_arabia','eg':'egypt','tr':'turkey','it':'italy','es':'spain','mx':'mexico','ca':'canada'}
    country = geo_map.get(body.get('geo', 'US').lower(), 'united_states')
    xml = http_get(f'https://trends.google.com/trending/rss?geo={country}')
    titles = []
    for m in re.finditer(r'<title>(.*?)</title>', xml):
        t = m.group(1).strip()
        if t and not t.startswith('Daily trends'): titles.append(t)
    if not titles:
        titles = ['AI tools 2026', 'python programming', 'machine learning', 'digital marketing',
                  'youtube shorts', 'crypto news', 'iphone 16', 'chatgpt', 'seo tips', 'web development',
                  'data science', 'blockchain', 'react js', 'node.js', 'typescript', 'cloud computing',
                  'cybersecurity', 'docker', 'kubernetes', 'aws']
    return json_resp({'trends': titles[:20]})

def route_thumbnail_ideas(body):
    topic = body.get('topic', '')
    if not topic: return error_resp('Topic is required')
    templates = {
        'curiosity': [f'I Tried {topic} For 30 Days...', f'What Happens When You {topic}?', f'The Truth About {topic}', f'{topic}: What They Don\'t Tell You'],
        'listicle': [f'Top 10 {topic} Tips', f'5 {topic} Mistakes to Avoid', f'7 {topic} Hacks You Need', f'3 Ways to Master {topic}'],
        'emotional': [f'This {topic} Made Me Cry', f'The Most Insane {topic} Ever', f'{topic} Gone WRONG', f'Why I Quit {topic}'],
        'howto': [f'{topic} Tutorial (Step by Step)', f'How to {topic} in 2026', f'{topic} for Beginners (Complete Guide)', f'Learn {topic} in 10 Minutes'],
        'versus': [f'{topic} vs The Competition', f'Cheap vs Expensive {topic}', f'{topic}: Beginner vs Pro']
    }
    schemes = [
        {'name': 'High Energy', 'bg': '#FF0000', 'text': '#FFFFFF', 'accent': '#FFFF00'},
        {'name': 'Clean Pro', 'bg': '#1A1A2E', 'text': '#FFFFFF', 'accent': '#00D4FF'},
        {'name': 'Warm Trust', 'bg': '#FF6B35', 'text': '#FFFFFF', 'accent': '#004E89'},
        {'name': 'Growth Green', 'bg': '#2D6A4F', 'text': '#FFFFFF', 'accent': '#95D5B2'},
        {'name': 'Bold Purple', 'bg': '#7209B7', 'text': '#FFFFFF', 'accent': '#F72585'},
        {'name': 'Dark Mode', 'bg': '#000000', 'text': '#FFFFFF', 'accent': '#FFD700'}
    ]
    style = body.get('style', 'all')
    if style == 'all': ideas = [{'category': cat, 'title': t} for cat, items in templates.items() for t in items]
    else: ideas = [{'category': style, 'title': t} for t in templates.get(style, [])]
    return json_resp({'topic': topic, 'titleIdeas': ideas, 'colorSchemes': schemes})

def route_keywords_explore(body):
    kw = body.get('keyword', ''); src = body.get('source', 'both')
    if not kw: return error_resp('Keyword is required')
    results = []
    if src in ('youtube', 'both'):
        for s in youtube_suggest(kw): results.append({'source': 'YouTube', 'keyword': s})
    if src in ('google', 'both'):
        for s in google_suggest(kw): results.append({'source': 'Google', 'keyword': s})
    seen = set()
    scored = []
    for r in results:
        kl = r['keyword'].lower()
        if kl not in seen:
            seen.add(kl)
            scored.append({'keyword': r['keyword'], 'source': r['source'], 'score': score_keyword(r['keyword']), 'competition': estimate_competition(r['keyword'])})
    scored.sort(key=lambda x: x['score'], reverse=True)
    yt = [r for r in results if r['source'] == 'YouTube']
    gg = [r for r in results if r['source'] == 'Google']
    return json_resp({'youtube': yt, 'google': gg, 'scored': scored})

def route_keywords_expand(body):
    kw = body.get('keyword', ''); src = body.get('source', 'youtube')
    if not kw: return error_resp('Keyword is required')
    all_kw = set()
    for s in list(string.ascii_lowercase) + [str(i) for i in range(10)]:
        q = f'{kw} {s}'
        if src in ('youtube', 'both'): all_kw.update(youtube_suggest(q))
        if src in ('google', 'both'): all_kw.update(google_suggest(q))
    for p in ['how to', 'what is', 'why', 'best', 'top', 'vs']:
        q = f'{p} {kw}'
        if src in ('youtube', 'both'): all_kw.update(youtube_suggest(q))
        if src in ('google', 'both'): all_kw.update(google_suggest(q))
    return json_resp({'keywords': sorted(all_kw)})

def route_keywords_combine(body):
    la = [x.strip() for x in body.get('listA', '').split(',') if x.strip()]
    lb = [x.strip() for x in body.get('listB', '').split(',') if x.strip()]
    if not la or not lb: return error_resp('Both lists are required')
    return json_resp({'keywords': [f'{a} {b}' for a in la for b in lb]})

def route_keywords_score(body):
    kws = body.get('keywords', [])
    if not kws or not isinstance(kws, list): return error_resp('Keywords array is required')
    scored = [{'keyword': kw, 'score': score_keyword(kw), 'competition': estimate_competition(kw)} for kw in kws]
    scored.sort(key=lambda x: x['score'], reverse=True)
    return json_resp({'scored': scored})

def route_keywords_niche(body):
    seed = body.get('keyword', '')
    if not seed: return error_resp('Keyword is required')
    mods = ['for beginners', 'tutorial', 'tips', 'in 2026', 'at home', 'without experience', 'step by step', 'on budget', 'for free', 'alternatives', 'vs', 'mistakes', 'ideas', 'examples']
    sugs = set()
    for m in mods: sugs.update(youtube_suggest(f'{seed} {m}'))
    for l in 'abcdefghij': sugs.update(youtube_suggest(f'{seed} {l}'))
    scored = [{'keyword': kw, 'opportunity': score_keyword(kw), 'competition': estimate_competition(kw)} for kw in sugs]
    scored.sort(key=lambda x: x['opportunity'], reverse=True)
    return json_resp({'niches': scored[:100]})

def route_keywords_compare(body):
    a, b = body.get('keywordA', ''), body.get('keywordB', '')
    if not a or not b: return error_resp('Both keywords are required')
    return json_resp({
        'a': {'keyword': a, 'score': score_keyword(a), 'competition': estimate_competition(a), 'words': len(a.split()), 'chars': len(a)},
        'b': {'keyword': b, 'score': score_keyword(b), 'competition': estimate_competition(b), 'words': len(b.split()), 'chars': len(b)}
    })

def route_tags_generate(body):
    kw = body.get('keyword', '')
    if not kw: return error_resp('Keyword is required')
    tags = set()
    tags.update(youtube_suggest(kw)); tags.update(google_suggest(kw))
    for l in 'abcdefghij': tags.update(youtube_suggest(f'{kw} {l}'))
    for p in ['how to', 'best', 'top', 'what is', 'why']: tags.update(youtube_suggest(f'{p} {kw}'))
    scored = [{'tag': t, 'score': score_keyword(t), 'competition': estimate_competition(t)} for t in tags]
    scored.sort(key=lambda x: x['score'], reverse=True)
    return json_resp({'tags': scored})

def route_hashtags_generate(body):
    topic = body.get('topic', ''); count = body.get('count', 25)
    if not topic: return error_resp('Topic is required')
    tags = {f'#{topic.lower().replace(" ", "")}'}
    for w in topic.lower().split():
        if len(w) > 2: tags.add(f'#{w}')
    for s in youtube_suggest(topic)[:10]:
        t = s.lower().strip().replace(' ', '')
        if len(t) <= 30: tags.add(f'#{t}')
    for s in google_suggest(topic)[:10]:
        t = s.lower().strip().replace(' ', '')
        if len(t) <= 30: tags.add(f'#{t}')
    for mod in ['tips', 'tutorial', 'guide', 'howto', '2026', 'best', 'viral', 'trending', 'fyp']:
        c = f'#{topic.lower().replace(" ", "")}{mod}'
        if len(c) <= 30: tags.add(c)
    return json_resp({'hashtags': sorted(tags)[:count]})

def route_seo_detail(body):
    title = body.get('title', ''); desc = body.get('description', ''); tags_raw = body.get('tags', '')
    if not title: return error_resp('Title is required')
    hl = score_keyword(title)
    ds = 0; dn = []
    if len(desc) >= 200: ds += 20; dn.append('200+ characters (good)')
    elif len(desc) >= 100: ds += 10; dn.append('100+ characters (needs more)')
    else: dn.append('Too short, aim for 200+ chars')
    if title.lower() in desc.lower(): ds += 10; dn.append('Title keyword in description')
    tl = [t.strip() for t in tags_raw.split(',') if t.strip()]
    ts = 0; tn = []
    if len(tl) >= 15: ts += 20; tn.append(f'{len(tl)} tags (great)')
    elif len(tl) >= 10: ts += 15; tn.append(f'{len(tl)} tags (good)')
    elif len(tl) >= 5: ts += 8; tn.append(f'{len(tl)} tags (add more)')
    else: tn.append(f'{len(tl)} tags (need 10-20)')
    tc = len(', '.join(tl))
    if tc > 500: tn.append(f'({tc} chars, exceeds 500!)'); ts -= 15
    total = max(0, min(100, int(hl * 0.5 + ds + ts)))
    grade = 'A' if total >= 80 else 'B' if total >= 60 else 'C' if total >= 40 else 'D' if total >= 25 else 'F'
    return json_resp({'total': total, 'grade': grade, 'titleScore': hl, 'descScore': ds, 'tagScore': ts,
                      'title': {'score': hl, 'notes': []}, 'description': {'score': ds, 'notes': dn}, 'tags': {'score': ts, 'notes': tn}})

def route_viral_check(body):
    kw = body.get('keyword', '')
    if not kw: return error_resp('Keyword is required')
    s = score_keyword(kw); comp = estimate_competition(kw)
    related = list(set(youtube_suggest(kw)[:10] + google_suggest(kw)[:10]))
    vs = min(100, s + 10)
    m = round((100 - (50 if comp == 'Low' else 70 if comp == 'Medium' else 90)) * 1.5, 1)
    a = min(100, s + 15)
    return json_resp({'viralScore': vs, 'momentum': m, 'audienceFit': a, 'competition': comp, 'related': related[:15]})

def route_ai_generate(body):
    mode = body.get('mode', 'ideas'); inp = body.get('input', '')
    if not inp: return error_resp('Input is required')
    prompts = {
        'ideas': f'You are a YouTube content strategist. Generate 10 unique video ideas for the niche: "{inp}". For each, provide TITLE, CONCEPT, DIFFICULTY, and POTENTIAL.',
        'title': f'You are a YouTube SEO expert. Optimize this title: "{inp}". Provide 5 optimized variations, why each works, and recommend the best.',
        'script': f'Create a video script outline for "{inp}". Include HOOK, INTRO, MAIN CONTENT, B-ROLL, CTA, OUTRO, ESTIMATED LENGTH, THUMBNAIL IDEA.',
        'analyze': f'Provide deep analysis of keyword: "{inp}". Include search intent, audience, competition, content strategy, monetization, seasonal trends, related niches, video format, and 5 title ideas.',
    }
    if mode == 'desc':
        parts = inp.split('|')
        p0 = parts[0].strip(); p1 = parts[1].strip() if len(parts) > 1 else ''
        prompt = f'Write an optimized YouTube description for title: "{p0}"' + (f' with keywords: {p1}.' if p1 else '.') + ' Include hook, description, timestamps, CTA, hashtags.'
    else:
        prompt = prompts.get(mode, prompts['ideas'])
    result = call_gemini(prompt)
    if result: return json_resp(result)
    return error_resp('No Gemini API key configured. Add it in Settings.', 400)

def route_settings_gemini(body):
    global GEMINI_API_KEY
    key = body.get('key', '')
    if not key: return error_resp('Key is required')
    GEMINI_API_KEY = key
    _save_env('GEMINI_API_KEY', key)
    return json_resp({'success': True})

def route_settings_youtube(body):
    global YOUTUBE_API_KEY, HAS_YT_KEY
    key = body.get('key', '')
    if not key: return error_resp('Key is required')
    YOUTUBE_API_KEY = key
    HAS_YT_KEY = bool(key)
    _save_env('YOUTUBE_API_KEY', key)
    return json_resp({'success': True})

def _save_env(key, value):
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    content = ''
    try:
        with open(env_path, 'r') as f: content = f.read()
    except: pass
    lines = content.split('\n')
    found = False
    new_lines = []
    for line in lines:
        if line.startswith(key + '='):
            new_lines.append(f'{key}={value}')
            found = True
        else:
            new_lines.append(line)
    if not found: new_lines.append(f'{key}={value}')
    with open(env_path, 'w') as f: f.write('\n'.join(new_lines))

def route_channel_analytics(body):
    if not HAS_YT_KEY: return error_resp('YouTube API key not configured.')
    yt = get_youtube()
    cid = body.get('channelId', ''); cuser = body.get('channelUsername', '')
    if not cid and cuser:
        search = yt.search().list(part='snippet', q=cuser, type='channel', maxResults=1).execute()
        if search.get('items'): cid = search['items'][0]['snippet']['channelId']
    if not cid: return error_resp('Channel not found.')
    chan = yt.channels().list(part='snippet,statistics,brandingSettings,contentDetails', id=cid).execute()
    if not chan.get('items'): return error_resp('Channel not found', 404)
    c = chan['items'][0]; sn = c['snippet']
    ulid = c['contentDetails']['relatedPlaylists']['uploads']
    recent = yt.playlistItems().list(part='snippet,contentDetails', playlistId=ulid, maxResults=20).execute()
    vids = [v['contentDetails']['videoId'] for v in recent.get('items', [])]
    videos = []
    if vids:
        vdet = yt.videos().list(part='statistics,snippet', id=','.join(vids)).execute()
        for v in vdet.get('items', []):
            vsn = v['snippet']; vst = v.get('statistics', {})
            videos.append({'title': vsn['title'], 'videoId': v['id'],
                'thumbnail': vsn.get('thumbnails', {}).get('high', {}).get('url', vsn.get('thumbnails', {}).get('default', {}).get('url', '')),
                'views': int(vst.get('viewCount', 0)), 'likes': int(vst.get('likeCount', 0)),
                'comments': int(vst.get('commentCount', 0)), 'publishedAt': vsn['publishedAt']})
    return json_resp({
        'channel': {
            'id': c['id'], 'title': sn['title'], 'description': sn.get('description', '')[:300],
            'thumbnail': sn.get('thumbnails', {}).get('high', {}).get('url'),
            'subscribers': int(c.get('statistics', {}).get('subscriberCount', 0)),
            'totalViews': int(c.get('statistics', {}).get('viewCount', 0)),
            'totalVideos': int(c.get('statistics', {}).get('videoCount', 0)),
            'createdAt': sn['publishedAt']
        }, 'videos': videos
    })

ROUTE_MAP = {
    '/api/seo/analyze': route_seo_analyze,
    '/api/trending': route_trending,
    '/api/trending/daily': route_trending_daily,
    '/api/thumbnail/ideas': route_thumbnail_ideas,
    '/api/keywords/explore': route_keywords_explore,
    '/api/keywords/expand': route_keywords_expand,
    '/api/keywords/combine': route_keywords_combine,
    '/api/keywords/score': route_keywords_score,
    '/api/keywords/niche': route_keywords_niche,
    '/api/keywords/compare': route_keywords_compare,
    '/api/tags/generate': route_tags_generate,
    '/api/hashtags/generate': route_hashtags_generate,
    '/api/seo/detail': route_seo_detail,
    '/api/viral/check': route_viral_check,
    '/api/ai/generate': route_ai_generate,
    '/api/settings/gemini-key': route_settings_gemini,
    '/api/settings/youtube-key': route_settings_youtube,
    '/api/analytics/channel': route_channel_analytics,
}

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), Handler)
    print(f'\n  ⚡ TrendPulse AI (Python) running at http://localhost:{PORT}')
    if HAS_YT_KEY: print('  ✓ YouTube API key loaded')
    else: print('  ⚠  No YOUTUBE_API_KEY found. Add it in Settings or .env file.')
    if GEMINI_API_KEY: print('  ✓ Gemini API key loaded')
    else: print('  ⚠  No GEMINI_API_KEY found. Add it in Settings.')
    print('')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Shutting down...')
        server.server_close()
