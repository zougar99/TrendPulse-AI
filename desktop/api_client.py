import json, urllib.request, urllib.parse

API_BASE = "http://localhost:3000/api"

def _request(endpoint, body=None):
    try:
        url = f"{API_BASE}{endpoint}"
        data = json.dumps(body).encode() if body else None
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'},
                                      method='POST' if body else 'GET')
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        return {'error': str(e)}

def keywords_explore(keyword, source="both"):
    return _request("/keywords/explore", {"keyword": keyword, "source": source})

def keywords_expand(keyword, source="youtube"):
    return _request("/keywords/expand", {"keyword": keyword, "source": source})

def keywords_score(keywords):
    return _request("/keywords/score", {"keywords": keywords})

def keywords_niche(keyword):
    return _request("/keywords/niche", {"keyword": keyword})

def keywords_compare(a, b):
    return _request("/keywords/compare", {"keywordA": a, "keywordB": b})

def tags_generate(keyword):
    return _request("/tags/generate", {"keyword": keyword})

def hashtags_generate(topic, count=25):
    return _request("/hashtags/generate", {"topic": topic, "count": count})

def seo_analyze(query, max_results=10):
    return _request("/seo/analyze", {"query": query, "maxResults": max_results})

def seo_detail(title, description="", tags=""):
    return _request("/seo/detail", {"title": title, "description": description, "tags": tags})

def viral_check(keyword):
    return _request("/viral/check", {"keyword": keyword})

def trending_daily(geo="US"):
    return _request("/trending/daily", {"geo": geo})

def thumbnail_ideas(topic, style="all"):
    return _request("/thumbnail/ideas", {"topic": topic, "style": style})

def ai_generate(mode, input_text):
    return _request("/ai/generate", {"mode": mode, "input": input_text})

def channel_analytics(channel_id="", username=""):
    return _request("/analytics/channel", {"channelId": channel_id, "channelUsername": username})

def settings_get():
    return _request("/settings/keys")

def settings_set_youtube(key):
    return _request("/settings/youtube-key", {"key": key})

def settings_set_gemini(key):
    return _request("/settings/gemini-key", {"key": key})
