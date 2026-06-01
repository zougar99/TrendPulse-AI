import sys, json, urllib.request, urllib.parse, re, string

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

data = json.loads(sys.stdin.read())
action = data['action']

if action == 'explore':
    kw, src = data['keyword'], data.get('source', 'both')
    results = []
    if src in ('youtube','both'):
        for s in youtube_suggest(kw): results.append({'source':'YouTube','keyword':s})
    if src in ('google','both'):
        for s in google_suggest(kw): results.append({'source':'Google','keyword':s})
    seen = set(); unique = []
    for r in results:
        if r['keyword'].lower() not in seen:
            seen.add(r['keyword'].lower())
            unique.append({'keyword':r['keyword'],'source':r['source'],
                          'score':score_keyword(r['keyword']),'competition':estimate_competition(r['keyword'])})
    unique.sort(key=lambda x: x['score'], reverse=True)
    yt = [r for r in results if r['source']=='YouTube']
    gg = [r for r in results if r['source']=='Google']
    print(json.dumps({'youtube': yt, 'google': gg, 'scored': unique}))

elif action == 'expand':
    kw, src = data['keyword'], data.get('source', 'youtube')
    suffixes = list(string.ascii_lowercase) + [str(i) for i in range(10)]
    q_prefixes = ['how to', 'what is', 'why', 'best', 'top', 'vs']
    all_kw = set()
    for s in suffixes:
        q = f'{kw} {s}'
        if src in ('youtube','both'): all_kw.update(youtube_suggest(q))
        if src in ('google','both'): all_kw.update(google_suggest(q))
    for p in q_prefixes:
        q = f'{p} {kw}'
        if src in ('youtube','both'): all_kw.update(youtube_suggest(q))
        if src in ('google','both'): all_kw.update(google_suggest(q))
    print(json.dumps({'keywords': sorted(all_kw)}))

elif action == 'combine':
    la = [x.strip() for x in data['listA'].split(',') if x.strip()]
    lb = [x.strip() for x in data['listB'].split(',') if x.strip()]
    print(json.dumps({'keywords': [f'{a} {b}' for a in la for b in lb]}))

elif action == 'score':
    scored = [{'keyword':kw,'score':score_keyword(kw),'competition':estimate_competition(kw)} for kw in data['keywords']]
    scored.sort(key=lambda x: x['score'], reverse=True)
    print(json.dumps({'scored': scored}))

elif action == 'niche':
    seed = data['keyword']
    mods = ['for beginners','tutorial','tips','in 2026','at home','without experience','step by step','on budget','for free','alternatives','vs','mistakes','ideas','examples']
    sugs = set()
    for m in mods: sugs.update(youtube_suggest(f'{seed} {m}'))
    for l in 'abcdefghij': sugs.update(youtube_suggest(f'{seed} {l}'))
    scored = [{'keyword':kw,'opportunity':score_keyword(kw),'competition':estimate_competition(kw)} for kw in sugs]
    scored.sort(key=lambda x: x['opportunity'], reverse=True)
    print(json.dumps({'niches': scored[:100]}))

elif action == 'compare':
    a, b = data['keywordA'], data['keywordB']
    print(json.dumps({
        'a':{'keyword':a,'score':score_keyword(a),'competition':estimate_competition(a),'words':len(a.split()),'chars':len(a)},
        'b':{'keyword':b,'score':score_keyword(b),'competition':estimate_competition(b),'words':len(b.split()),'chars':len(b)}
    }))

elif action == 'tags':
    kw = data['keyword']
    tags = set()
    tags.update(youtube_suggest(kw)); tags.update(google_suggest(kw))
    for l in 'abcdefghij': tags.update(youtube_suggest(f'{kw} {l}'))
    for p in ['how to','best','top','what is','why']: tags.update(youtube_suggest(f'{p} {kw}'))
    scored = [{'tag':t,'score':score_keyword(t),'competition':estimate_competition(t)} for t in tags]
    scored.sort(key=lambda x: x['score'], reverse=True)
    print(json.dumps({'tags': scored}))

elif action == 'hashtags':
    topic = data['topic']; count = data.get('count', 25)
    tags = {f'#{topic.lower().replace(" ","")}'}
    for w in topic.lower().split():
        if len(w) > 2: tags.add(f'#{w}')
    for s in youtube_suggest(topic)[:10]:
        t = s.lower().strip().replace(' ','')
        if len(t) <= 30: tags.add(f'#{t}')
    for s in google_suggest(topic)[:10]:
        t = s.lower().strip().replace(' ','')
        if len(t) <= 30: tags.add(f'#{t}')
    for mod in ['tips','tutorial','guide','howto','2026','best','viral','trending','fyp']:
        c = f'#{topic.lower().replace(" ","")}{mod}'
        if len(c) <= 30: tags.add(c)
    print(json.dumps({'hashtags': sorted(tags)[:count]}))

elif action == 'seo_detail':
    title = data['title']; desc = data.get('description',''); tags_raw = data.get('tags','')
    hl_score = score_keyword(title)
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
    total = max(0, min(100, int(hl_score * 0.5 + ds + ts)))
    grade = 'A' if total >= 80 else 'B' if total >= 60 else 'C' if total >= 40 else 'D' if total >= 25 else 'F'
    print(json.dumps({
        'total':total,'grade':grade,'titleScore':hl_score,'descScore':ds,'tagScore':ts,
        'title':{'score':hl_score,'notes':[]},'description':{'score':ds,'notes':dn},'tags':{'score':ts,'notes':tn}
    }))

elif action == 'viral':
    kw = data['keyword']
    s = score_keyword(kw); comp = estimate_competition(kw)
    related = list(set(list(youtube_suggest(kw))[:10] + list(google_suggest(kw))[:10]))
    vs = min(100, s + 10)
    m = round((100 - (50 if comp == 'Low' else 70 if comp == 'Medium' else 90)) * 1.5, 1)
    a = min(100, s + 15)
    print(json.dumps({'viralScore':vs,'momentum':m,'audienceFit':a,'competition':comp,'related':related[:15]}))

else:
    print(json.dumps({'error': 'Unknown action'}))
