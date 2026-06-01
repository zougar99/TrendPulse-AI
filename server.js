require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const cors = require('cors');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

function hasApiKey() { return !!process.env.YOUTUBE_API_KEY; }

// ─── Helper: HTTP GET JSON ───
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

// ─── Helper: Call Python algorithm engine ───
function callPython(action, payload) {
  try {
    const input = JSON.stringify({ action, ...payload });
    const result = execSync(`python py_engine.py`, {
      input, timeout: 15000, encoding: 'utf-8'
    });
    return JSON.parse(result.trim());
  } catch (e) {
    return { error: e.message };
  }
}

// ─── 1. SEO ANALYZER ───
app.post('/api/seo/analyze', async (req, res) => {
  try {
    if (!hasApiKey()) return res.status(400).json({ error: 'YouTube API key not configured. Add it to Settings or .env file.' });
    const { query, maxResults = 10 } = req.body;
    if (!query) return res.status(400).json({ error: 'Search query is required' });
    const searchResponse = await youtube.search.list({
      part: 'snippet', q: query, type: 'video', order: 'relevance', maxResults: Math.min(maxResults, 25)
    });
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');
    const videoDetails = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails', id: videoIds
    });
    const analyzed = videoDetails.data.items.map(video => {
      const title = video.snippet.title;
      const description = video.snippet.description;
      const tags = video.snippet.tags || [];
      let seoScore = 0;
      if (title.length >= 40 && title.length <= 70) seoScore += 20; else if (title.length > 0) seoScore += 10;
      if (description.length >= 200) seoScore += 20; else if (description.length >= 100) seoScore += 10;
      if (tags.length >= 10) seoScore += 20; else if (tags.length >= 5) seoScore += 10;
      if (title.toLowerCase().includes(query.toLowerCase())) seoScore += 20;
      if (description.toLowerCase().includes(query.toLowerCase())) seoScore += 20;
      return {
        title, videoId: video.id,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        views: parseInt(video.statistics.viewCount || 0),
        likes: parseInt(video.statistics.likeCount || 0),
        comments: parseInt(video.statistics.commentCount || 0),
        tags: tags.slice(0, 20), titleLength: title.length,
        descriptionLength: description.length, tagCount: tags.length, seoScore,
        publishedAt: video.snippet.publishedAt
      };
    });
    analyzed.sort((a, b) => b.seoScore - a.seoScore);
    const allTags = analyzed.flatMap(v => v.tags);
    const tagFrequency = {};
    allTags.forEach(tag => { const l = tag.toLowerCase(); tagFrequency[l] = (tagFrequency[l] || 0) + 1; });
    const suggestedTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]).slice(0, 30).map(([tag]) => tag);
    const avgTitleLength = Math.round(analyzed.reduce((s, v) => s + v.titleLength, 0) / analyzed.length);
    const avgDescLength = Math.round(analyzed.reduce((s, v) => s + v.descriptionLength, 0) / analyzed.length);
    res.json({
      query, results: analyzed,
      suggestions: {
        tags: suggestedTags, avgTitleLength, avgDescLength,
        titleTip: `Top videos use ${avgTitleLength} characters on average. Include your keyword "${query}" in the title.`,
        descriptionTip: `Aim for ${Math.max(avgDescLength, 200)}+ characters. Front-load keywords in the first 2 lines.`,
        tagTip: `Use ${suggestedTags.length > 0 ? suggestedTags.slice(0, 5).join(', ') : 'relevant tags'} as primary tags.`
      }
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── 2. TRENDING VIDEOS ───
app.post('/api/trending', async (req, res) => {
  try {
    if (!hasApiKey()) return res.status(400).json({ error: 'YouTube API key not configured.' });
    const { category = '0', regionCode = 'US', maxResults = 20 } = req.body;
    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails', chart: 'mostPopular',
      regionCode, videoCategoryId: category, maxResults: Math.min(maxResults, 50)
    });
    const trending = response.data.items.map(video => ({
      title: video.snippet.title, videoId: video.id,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
      views: parseInt(video.statistics.viewCount || 0),
      likes: parseInt(video.statistics.likeCount || 0),
      tags: (video.snippet.tags || []).slice(0, 15),
      publishedAt: video.snippet.publishedAt,
      category: video.snippet.categoryId
    }));
    res.json({ regionCode, category, trending });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── 3. TRENDING DAILY (Google Trends) ───
app.post('/api/trending/daily', async (req, res) => {
  try {
    const { geo = 'US' } = req.body;
    const geoLower = geo.toLowerCase();
    const countryMap = {
      'us':'united_states','ma':'morocco','fr':'france','gb':'united_kingdom',
      'de':'germany','in':'india','jp':'japan','br':'brazil','sa':'saudi_arabia',
      'eg':'egypt','tr':'turkey','it':'italy','es':'spain','mx':'mexico','ca':'canada'
    };
    const country = countryMap[geoLower] || 'united_states';
    const url = `https://trends.google.com/trending/rss?geo=${country}`;
    const xml = await httpGet(url);
    const titles = [];
    const regex = /<title>(.*?)<\/title>/g;
    let match;
    while ((match = regex.exec(xml)) !== null && titles.length < 20) {
      const t = match[1].trim();
      if (t && !t.startsWith('Daily trends')) titles.push(t);
    }
    if (titles.length === 0) {
      const defaults = ['AI tools 2026', 'python programming', 'machine learning', 'digital marketing',
        'youtube shorts', 'crypto news', 'iphone 16', 'chatgpt', 'seo tips', 'web development',
        'data science', 'blockchain', 'react js', 'node.js', 'typescript', 'cloud computing',
        'cybersecurity', 'docker', 'kubernetes', 'aws'];
      res.json({ trends: defaults });
    } else {
      res.json({ trends: titles.slice(0, 20) });
    }
  } catch (err) { 
    const defaults = ['AI tools 2026', 'python programming', 'machine learning', 'digital marketing',
      'youtube shorts', 'crypto news', 'iphone 16', 'chatgpt'];
    res.json({ trends: defaults, note: 'fallback' });
  }
});

// ─── 4. THUMBNAIL IDEAS ───
app.post('/api/thumbnail/ideas', async (req, res) => {
  try {
    const { topic, style = 'all' } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });
    const templates = {
      curiosity: [`I Tried ${topic} For 30 Days...`,`What Happens When You ${topic}?`,`The Truth About ${topic}`,`${topic}: What They Don't Tell You`],
      listicle: [`Top 10 ${topic} Tips`,`5 ${topic} Mistakes to Avoid`,`7 ${topic} Hacks You Need`,`3 Ways to Master ${topic}`],
      emotional: [`This ${topic} Made Me Cry`,`The Most Insane ${topic} Ever`,`${topic} Gone WRONG`,`Why I Quit ${topic}`],
      howto: [`${topic} Tutorial (Step by Step)`,`How to ${topic} in 2026`,`${topic} for Beginners (Complete Guide)`,`Learn ${topic} in 10 Minutes`],
      versus: [`${topic} vs The Competition`,`Cheap vs Expensive ${topic}`,`${topic}: Beginner vs Pro`]
    };
    const colorSchemes = [
      { name: 'High Energy', bg: '#FF0000', text: '#FFFFFF', accent: '#FFFF00' },
      { name: 'Clean Pro', bg: '#1A1A2E', text: '#FFFFFF', accent: '#00D4FF' },
      { name: 'Warm Trust', bg: '#FF6B35', text: '#FFFFFF', accent: '#004E89' },
      { name: 'Growth Green', bg: '#2D6A4F', text: '#FFFFFF', accent: '#95D5B2' },
      { name: 'Bold Purple', bg: '#7209B7', text: '#FFFFFF', accent: '#F72585' },
      { name: 'Dark Mode', bg: '#000000', text: '#FFFFFF', accent: '#FFD700' }
    ];
    let titleIdeas;
    if (style === 'all') titleIdeas = Object.entries(templates).flatMap(([cat, items]) => items.map(t => ({ category: cat, title: t })));
    else titleIdeas = (templates[style] || []).map(t => ({ category: style, title: t }));
    res.json({ topic, titleIdeas, colorSchemes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── 5. KEYWORD EXPLORE ───
app.post('/api/keywords/explore', (req, res) => {
  const { keyword, source = 'both' } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  const result = callPython('explore', { keyword, source });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 6. KEYWORD EXPAND ───
app.post('/api/keywords/expand', (req, res) => {
  const { keyword, source = 'youtube' } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  const result = callPython('expand', { keyword, source });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 7. KEYWORD COMBINE ───
app.post('/api/keywords/combine', (req, res) => {
  const { listA, listB } = req.body;
  if (!listA || !listB) return res.status(400).json({ error: 'Both lists are required' });
  const result = callPython('combine', { listA, listB });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 8. KEYWORD SCORE ───
app.post('/api/keywords/score', (req, res) => {
  const { keywords } = req.body;
  if (!keywords || !Array.isArray(keywords) || keywords.length === 0) return res.status(400).json({ error: 'Keywords array is required' });
  const result = callPython('score', { keywords });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 9. NICHE FINDER ───
app.post('/api/keywords/niche', (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  const result = callPython('niche', { keyword });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 10. KEYWORD COMPARE ───
app.post('/api/keywords/compare', (req, res) => {
  const { keywordA, keywordB } = req.body;
  if (!keywordA || !keywordB) return res.status(400).json({ error: 'Both keywords are required' });
  const result = callPython('compare', { keywordA, keywordB });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 11. TAGS GENERATOR ───
app.post('/api/tags/generate', (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  const result = callPython('tags', { keyword });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 12. HASHTAGS GENERATOR ───
app.post('/api/hashtags/generate', (req, res) => {
  const { topic, count = 25 } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic is required' });
  const result = callPython('hashtags', { topic, count });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 13. SEO DETAIL ───
app.post('/api/seo/detail', (req, res) => {
  const { title, description = '', tags = '' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const result = callPython('seo_detail', { title, description, tags });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 14. VIRAL CHECK ───
app.post('/api/viral/check', (req, res) => {
  const { keyword } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword is required' });
  const result = callPython('viral', { keyword });
  if (result.error) return res.status(500).json(result);
  res.json(result);
});

// ─── 15. AI GENERATE (calls Gemini) ───
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { mode, input } = req.body;
    if (!input) return res.status(400).json({ error: 'Input is required' });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(400).json({ error: 'No Gemini API key configured. Add it in Settings.' });

    const prompts = {
      ideas: `You are a YouTube content strategist. Generate 10 unique video ideas for the niche: "${input}". For each, provide TITLE, CONCEPT, DIFFICULTY, and POTENTIAL.`,
      title: `You are a YouTube SEO expert. Optimize this title: "${input}". Provide 5 optimized variations, why each works, and recommend the best.`,
      desc: (() => { const parts = input.split('|'); return `Write an optimized YouTube description for title: "${parts[0].trim()}"${parts[1] ? ` with keywords: ${parts[1].trim()}` : ''}. Include hook, detailed description, timestamps, CTA, hashtags, and tags.`; })(),
      script: `Create a video script outline for "${input}". Include HOOK, INTRO, MAIN CONTENT (3-5 sections), B-ROLL, CTA, OUTRO, ESTIMATED LENGTH, THUMBNAIL IDEA.`,
      analyze: `Provide deep analysis of keyword: "${input}". Include search intent, audience, competition, content strategy, monetization, seasonal trends, related niches, video format, recommended tags, and 5 title ideas.`
    };

    const prompt = typeof prompts[mode] === 'function' ? prompts[mode]() : (prompts[mode] || prompts.ideas);

    const https = require('https');
    const url = new URL(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`);
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 3000, temperature: 0.8 }
    });

    const result = await new Promise((resolve, reject) => {
      const req2 = https.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (resp) => {
        let data = '';
        resp.on('data', c => data += c);
        resp.on('end', () => {
          try {
            const json = JSON.parse(data);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
            resolve({ text });
          } catch (e) { reject({ error: 'Failed to parse AI response' }); }
        });
      });
      req2.on('error', reject);
      req2.write(postData);
      req2.end();
    });

    res.json(result);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── 16. SETTINGS API ───
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

function saveEnvVar(key, value) {
  let content = '';
  try { content = fs.readFileSync(envPath, 'utf-8'); } catch (e) { /* file might not exist */ }
  const lines = content.split('\n');
  let found = false;
  const newLines = lines.map(line => {
    if (line.startsWith(key + '=')) { found = true; return `${key}=${value}`; }
    return line;
  });
  if (!found) newLines.push(`${key}=${value}`);
  fs.writeFileSync(envPath, newLines.join('\n'), 'utf-8');
  process.env[key] = value;
}

app.post('/api/settings/gemini-key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });
  saveEnvVar('GEMINI_API_KEY', key);
  res.json({ success: true });
});

app.post('/api/settings/youtube-key', (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: 'Key is required' });
  saveEnvVar('YOUTUBE_API_KEY', key);
  res.json({ success: true });
});

app.get('/api/settings/keys', (req, res) => {
  res.json({
    youtube: process.env.YOUTUBE_API_KEY || '',
    gemini: process.env.GEMINI_API_KEY || ''
  });
});

// ─── CHANNEL ANALYTICS ───
app.post('/api/analytics/channel', async (req, res) => {
  try {
    if (!hasApiKey()) return res.status(400).json({ error: 'YouTube API key not configured.' });
    const { channelId, channelUsername } = req.body;
    let resolvedChannelId = channelId;
    if (!resolvedChannelId && channelUsername) {
      const searchRes = await youtube.search.list({ part: 'snippet', q: channelUsername, type: 'channel', maxResults: 1 });
      if (searchRes.data.items.length > 0) resolvedChannelId = searchRes.data.items[0].snippet.channelId;
    }
    if (!resolvedChannelId) return res.status(400).json({ error: 'Channel not found.' });
    const channelResponse = await youtube.channels.list({ part: 'snippet,statistics,brandingSettings,contentDetails', id: resolvedChannelId });
    if (!channelResponse.data.items || channelResponse.data.items.length === 0) return res.status(404).json({ error: 'Channel not found' });
    const channel = channelResponse.data.items[0];
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads;
    const recentVideos = await youtube.playlistItems.list({ part: 'snippet,contentDetails', playlistId: uploadsPlaylistId, maxResults: 20 });
    const videoIds = recentVideos.data.items.map(v => v.contentDetails.videoId).join(',');
    let videoStats = [];
    if (videoIds) {
      const videoDetails = await youtube.videos.list({ part: 'statistics,contentDetails,snippet', id: videoIds });
      videoStats = videoDetails.data.items.map(v => ({
        title: v.snippet.title, videoId: v.id,
        thumbnail: v.snippet.thumbnails.high?.url || v.snippet.thumbnails.default?.url,
        views: parseInt(v.statistics.viewCount || 0),
        likes: parseInt(v.statistics.likeCount || 0),
        comments: parseInt(v.statistics.commentCount || 0),
        publishedAt: v.snippet.publishedAt
      }));
    }
    res.json({
      channel: {
        id: channel.id, title: channel.snippet.title,
        description: channel.snippet.description?.substring(0, 300),
        thumbnail: channel.snippet.thumbnails.high?.url,
        subscribers: parseInt(channel.statistics.subscriberCount || 0),
        totalViews: parseInt(channel.statistics.viewCount || 0),
        totalVideos: parseInt(channel.statistics.videoCount || 0),
        createdAt: channel.snippet.publishedAt
      },
      videos: videoStats
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── CATEGORIES ───
app.get('/api/categories', async (req, res) => {
  try {
    if (!hasApiKey()) return res.status(400).json({ error: 'YouTube API key not configured.' });
    const { regionCode = 'US' } = req.query;
    const response = await youtube.videoCategories.list({ part: 'snippet', regionCode });
    const categories = response.data.items.filter(c => c.snippet.assignable).map(c => ({ id: c.id, title: c.snippet.title }));
    res.json({ categories });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── SPIRE ───
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ TrendPulse AI running at http://localhost:${PORT}`);
  if (hasApiKey()) console.log('  ✓ YouTube API key loaded');
  else console.log('  ⚠  No YOUTUBE_API_KEY found. Add it in Settings or .env file.');
  if (process.env.GEMINI_API_KEY) console.log('  ✓ Gemini API key loaded');
  else console.log('  ⚠  No GEMINI_API_KEY found. Add it in Settings.');
  console.log('');
});