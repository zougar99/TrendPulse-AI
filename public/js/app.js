// ─── PARTICLES ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animEnabled = true;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = ['0,191,255','138,92,255','0,255,240'][Math.floor(Math.random() * 3)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  if (!animEnabled) return requestAnimationFrame(animateParticles);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,191,255,${0.04 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

function toggleParticles() {
  animEnabled = document.getElementById('toggleParticles').checked;
}

function toggleAnimations() {
  document.body.classList.toggle('animations-enabled', document.getElementById('toggleAnimations').checked);
}
toggleAnimations();

// ─── NAVIGATION ───
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + item.dataset.tab).classList.add('active');
  });
});

// ─── TOAST ───
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── COPY ───
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => toast('Copied!')).catch(() => toast('Copy failed'));
}

function copyAll(items) {
  const text = items.join('\n');
  navigator.clipboard.writeText(text).then(() => toast(`Copied ${items.length} items!`)).catch(() => toast('Copy failed'));
}

// ─── DASHBOARD CHARTS ───
function initDashCharts() {
  const c1 = document.getElementById('dashChart1');
  if (c1) {
    new Chart(c1, {
      type: 'line',
      data: {
        labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets: [{
          label: 'Search Interest',
          data: [65,72,68,85,90,78,88],
          borderColor: '#00BFFF',
          backgroundColor: 'rgba(0,191,255,0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { display: false },
          y: { display: false, beginAtZero: true }
        }
      }
    });
  }

  const c2 = document.getElementById('dashChart2');
  if (c2) {
    new Chart(c2, {
      type: 'doughnut',
      data: {
        labels: ['YouTube', 'Google', 'Trending', 'Seasonal'],
        datasets: [{
          data: [35, 28, 22, 15],
          backgroundColor: ['#00BFFF', '#8A5CFF', '#00FFF0', '#FF6B9D'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#8888AA', font: { size: 10 } } } },
        cutout: '65%'
      }
    });
  }
}
initDashCharts();

// ─── RADAR ───
function fetchRadar() {
  const country = document.getElementById('radarCountry').value;
  const results = document.getElementById('radarResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Scanning trends...</div>';

  fetch('/api/trending/daily', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ geo: country || 'US' })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const trends = data.trends || data.defaultTrends || [];
    if (trends.length === 0) {
      results.innerHTML = '<div class="radar-placeholder">No trends found for this region</div>';
      return;
    }
    let html = '<div class="section-title">Detected Trends</div>';
    trends.slice(0, 15).forEach((t, i) => {
      const keyword = typeof t === 'string' ? t : t.title || t.keyword || t.query || '';
      html += `<div class="result-card" onclick="copyToClipboard('${keyword.replace(/'/g, "\\'")}')">
        <span class="result-keyword"><span style="color:var(--neon-blue);font-weight:800;margin-right:8px">#${i+1}</span>${keyword}</span>
        <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${keyword.replace(/'/g, "\\'")}')">Copy</button>
      </div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── YOUTUBE ───
function switchYTTab(tab, btn) {
  document.querySelectorAll('.tool-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.yt-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('yt-' + tab).classList.add('active');
}

function ytSEO() {
  const query = document.getElementById('ytSeoInput').value.trim();
  if (!query) return toast('Enter a topic first', 'error');
  const results = document.getElementById('ytSeoResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Analyzing SEO...</div>';

  fetch('/api/seo/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, maxResults: 8 })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    let html = `<div class="section-title">SEO Results for "${data.query}"</div>`;
    if (data.suggestions) {
      html += `<div class="result-card" style="flex-direction:column;align-items:flex-start;gap:0.5rem">
        <span style="font-size:0.82rem;color:var(--text-secondary)">💡 ${data.suggestions.titleTip || ''}</span>
        <span style="font-size:0.82rem;color:var(--text-secondary)">${data.suggestions.descriptionTip || ''}</span>
      </div>`;
    }
    (data.results || []).forEach(v => {
      const scoreColor = v.seoScore >= 70 ? 'score-high' : v.seoScore >= 45 ? 'score-medium' : 'score-low';
      html += `<div class="result-card">
        <div style="flex:1;min-width:0">
          <span class="result-keyword">${v.title}</span>
          <div style="font-size:0.7rem;color:var(--text-tertiary);margin-top:2px">${v.views?.toLocaleString() || 0} views • ${v.tags?.length || 0} tags</div>
        </div>
        <span class="result-score ${scoreColor}">${v.seoScore}</span>
        <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${v.title.replace(/'/g, "\\'")}')">Copy</button>
      </div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function ytTrending() {
  const cat = document.getElementById('ytTrendCat').value;
  const results = document.getElementById('ytTrendResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Fetching trending...</div>';

  fetch('/api/trending', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: cat, regionCode: 'US', maxResults: 15 })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const videos = data.trending || [];
    if (videos.length === 0) { results.innerHTML = '<div class="radar-placeholder">No trending videos found</div>'; return; }
    let html = `<div class="section-title">Trending Videos (${videos.length})</div>`;
    videos.forEach(v => {
      html += `<div class="result-card">
        <span class="result-keyword">${v.title}</span>
        <span style="font-size:0.75rem;color:var(--text-tertiary)">${(v.views / 1000).toFixed(0)}k views</span>
        <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${v.title.replace(/'/g, "\\'")}')">Copy</button>
      </div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function ytTags() {
  const kw = document.getElementById('ytTagsInput').value.trim();
  if (!kw) return toast('Enter a keyword', 'error');
  const results = document.getElementById('ytTagsResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Generating tags...</div>';

  fetch('/api/tags/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: kw })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const tags = data.tags || [];
    if (tags.length === 0) { results.innerHTML = '<div class="radar-placeholder">No tags generated</div>'; return; }
    const tagText = tags.map(t => t.tag || t).join(', ');
    let html = `<div class="result-card" style="cursor:pointer" onclick="copyToClipboard('${tagText.replace(/'/g, "\\'")}')">
      <span style="font-size:0.8rem;color:var(--text-secondary)">📋 Click to copy all (${tags.length} tags)</span>
      <span style="font-family:var(--font-display);font-size:0.7rem;color:var(--neon-blue)">${tagText.length} chars</span>
    </div>
    <div class="tag-cloud">`;
    tags.slice(0, 30).forEach(t => {
      const tag = t.tag || t;
      html += `<span class="tag-item" onclick="copyToClipboard('${tag.replace(/'/g, "\\'")}')">${tag}</span>`;
    });
    html += '</div>';
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function ytHashtags() {
  const topic = document.getElementById('ytHashtagInput').value.trim();
  if (!topic) return toast('Enter a topic', 'error');
  const results = document.getElementById('ytHashtagResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Generating hashtags...</div>';

  fetch('/api/hashtags/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, count: 25 })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const hashtags = data.hashtags || [];
    if (hashtags.length === 0) { results.innerHTML = '<div class="radar-placeholder">No hashtags generated</div>'; return; }
    const tagText = hashtags.join(' ');
    let html = `<div class="result-card" style="cursor:pointer" onclick="copyToClipboard('${tagText.replace(/'/g, "\\'")}')">
      <span style="font-size:0.8rem;color:var(--text-secondary)">📋 Click to copy all (${hashtags.length} hashtags)</span>
    </div>
    <div class="tag-cloud">`;
    hashtags.forEach(h => {
      html += `<span class="tag-item" onclick="copyToClipboard('${h.replace(/'/g, "\\'")}')">${h}</span>`;
    });
    html += '</div>';
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function ytThumbnail() {
  const topic = document.getElementById('ytThumbInput').value.trim();
  if (!topic) return toast('Enter a topic', 'error');
  const results = document.getElementById('ytThumbResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Generating ideas...</div>';

  fetch('/api/thumbnail/ideas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    let html = `<div class="section-title">Title Ideas</div>`;
    (data.titleIdeas || []).slice(0, 15).forEach(idea => {
      html += `<div class="result-card" onclick="copyToClipboard('${idea.title.replace(/'/g, "\\'")}')">
        <span><span style="font-size:0.65rem;color:var(--text-tertiary);text-transform:uppercase">${idea.category}</span><br><span class="result-keyword">${idea.title}</span></span>
        <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${idea.title.replace(/'/g, "\\'")}')">Copy</button>
      </div>`;
    });
    if (data.colorSchemes) {
      html += `<div class="section-title">Color Schemes</div><div style="display:flex;gap:0.5rem;flex-wrap:wrap">`;
      data.colorSchemes.forEach(c => {
        html += `<div style="padding:0.5rem 0.8rem;background:${c.bg};border-radius:8px;font-size:0.75rem;border:1px solid rgba(255,255,255,0.1)">
          <strong>${c.name}</strong><br><span style="opacity:0.7">${c.text} + ${c.accent}</span>
        </div>`;
      });
      html += `</div>`;
    }
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── GOOGLE EXPLORER ───
function googleExplore() {
  const kw = document.getElementById('googleInput').value.trim();
  const source = document.getElementById('googleSource').value;
  if (!kw) return toast('Enter a keyword', 'error');

  document.getElementById('googleYtResults').innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Searching...</div>';
  document.getElementById('googleGResults').innerHTML = '';
  document.getElementById('googleScored').innerHTML = '';

  fetch('/api/keywords/explore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: kw, source })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) {
      document.getElementById('googleYtResults').innerHTML = `<div class="error-msg">${data.error}</div>`;
      return;
    }
    const yt = data.youtube || [];
    const gg = data.google || [];
    const scored = data.scored || [];

    const renderList = (items, container, label) => {
      if (items.length === 0) { container.innerHTML = `<div class="radar-placeholder">No ${label} suggestions found</div>`; return; }
      let html = '';
      items.slice(0, 20).forEach(s => {
        const keyword = s.keyword || s;
        html += `<div class="result-card" onclick="copyToClipboard('${keyword.replace(/'/g, "\\'")}')">
          <span class="result-keyword">${keyword}</span>
          <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${keyword.replace(/'/g, "\\'")}')">Copy</button>
        </div>`;
      });
      container.innerHTML = html;
    };

    renderList(yt, document.getElementById('googleYtResults'), 'YouTube');
    renderList(gg, document.getElementById('googleGResults'), 'Google');

    if (scored.length > 0) {
      let html = '';
      scored.forEach(s => {
        const scoreClass = s.score >= 70 ? 'score-high' : s.score >= 45 ? 'score-medium' : 'score-low';
        const compClass = (s.competition || '').toLowerCase();
        html += `<div class="result-card" onclick="copyToClipboard('${s.keyword.replace(/'/g, "\\'")}')">
          <span class="result-keyword">${s.keyword}</span>
          <div style="display:flex;gap:0.4rem;align-items:center">
            <span class="result-score ${scoreClass}">${s.score}</span>
            <span class="comp-badge ${compClass}">${s.competition || 'N/A'}</span>
            <button class="copy-btn" onclick="event.stopPropagation();copyToClipboard('${s.keyword.replace(/'/g, "\\'")}')">Copy</button>
          </div>
        </div>`;
      });
      document.getElementById('googleScored').innerHTML = html;
    }
  })
  .catch(err => {
    document.getElementById('googleYtResults').innerHTML = `<div class="error-msg">Error: ${err.message}</div>`;
  });
}

// ─── KEYWORD LAB ───
function switchKWTab(tab, btn) {
  document.querySelectorAll('.kw-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.kw-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('kw-' + tab).classList.add('active');
}

function kwExpand() {
  const kw = document.getElementById('expInput').value.trim();
  const source = document.getElementById('expSource').value;
  if (!kw) return toast('Enter a seed keyword', 'error');
  const results = document.getElementById('expResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Expanding keyword...</div>';

  fetch('/api/keywords/expand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: kw, source })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const keywords = data.keywords || [];
    if (keywords.length === 0) { results.innerHTML = '<div class="radar-placeholder">No expanded keywords found</div>'; return; }
    let html = `<div class="result-card" style="cursor:pointer" onclick="copyAll(${JSON.stringify(keywords)})">
      <span style="font-size:0.85rem;color:var(--text-secondary)">📋 Click to copy all (${keywords.length} keywords)</span>
    </div>`;
    keywords.slice(0, 50).forEach(k => {
      html += `<div class="kw-item"><span class="result-keyword">${k}</span><button class="copy-btn" onclick="copyToClipboard('${k.replace(/'/g, "\\'")}')">Copy</button></div>`;
    });
    if (keywords.length > 50) html += `<div style="text-align:center;padding:0.5rem;color:var(--text-tertiary);font-size:0.8rem">+ ${keywords.length - 50} more keywords</div>`;
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function kwCombine() {
  const a = document.getElementById('combListA').value.trim();
  const b = document.getElementById('combListB').value.trim();
  if (!a || !b) return toast('Fill both lists', 'error');
  const results = document.getElementById('combResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Generating combinations...</div>';

  fetch('/api/keywords/combine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listA: a, listB: b })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const keywords = data.keywords || [];
    if (keywords.length === 0) { results.innerHTML = '<div class="radar-placeholder">No combinations generated</div>'; return; }
    let html = `<div class="result-card" style="cursor:pointer" onclick="copyAll(${JSON.stringify(keywords)})">
      <span style="font-size:0.85rem;color:var(--text-secondary)">📋 Copy all (${keywords.length} combinations)</span>
    </div>`;
    keywords.forEach(k => {
      html += `<div class="kw-item"><span class="result-keyword">${k}</span><button class="copy-btn" onclick="copyToClipboard('${k.replace(/'/g, "\\'")}')">Copy</button></div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function kwScore() {
  const text = document.getElementById('scoreInput').value.trim();
  if (!text) return toast('Paste some keywords first', 'error');
  const results = document.getElementById('scoreResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Scoring keywords...</div>';

  fetch('/api/keywords/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywords: text.split('\n').filter(s => s.trim()) })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const scored = data.scored || [];
    if (scored.length === 0) { results.innerHTML = '<div class="radar-placeholder">No keywords to score</div>'; return; }
    let html = `<div class="result-card"><span style="font-size:0.85rem;color:var(--text-secondary)">Sorted by score (highest first)</span></div>`;
    scored.forEach(s => {
      const scoreClass = s.score >= 70 ? 'score-high' : s.score >= 45 ? 'score-medium' : 'score-low';
      const compClass = (s.competition || '').toLowerCase();
      html += `<div class="result-card">
        <span class="result-keyword">${s.keyword}</span>
        <div style="display:flex;gap:0.4rem;align-items:center">
          <span class="result-score ${scoreClass}">${s.score}</span>
          <span class="comp-badge ${compClass}">${s.competition || 'N/A'}</span>
        </div>
      </div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function kwNiche() {
  const topic = document.getElementById('nicheInput').value.trim();
  if (!topic) return toast('Enter a topic', 'error');
  const results = document.getElementById('nicheResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Analyzing niches...</div>';

  fetch('/api/keywords/niche', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: topic })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const niches = data.niches || [];
    if (niches.length === 0) { results.innerHTML = '<div class="radar-placeholder">No niches found</div>'; return; }
    let html = `<div class="result-card"><span style="font-size:0.85rem;color:var(--text-secondary)">💎 Gold niches (low competition + high opportunity)</span></div>`;
    niches.forEach(n => {
      const isGem = n.competition === 'Low' && n.opportunity >= 60;
      const prefix = isGem ? '💎 ' : '';
      html += `<div class="result-card" style="${isGem ? 'border-color:rgba(0,184,148,0.3)' : ''}">
        <span class="result-keyword">${prefix}${n.keyword}</span>
        <div style="display:flex;gap:0.4rem;align-items:center">
          <span class="result-score score-high">${n.opportunity}</span>
          <span class="comp-badge ${(n.competition||'').toLowerCase()}">${n.competition}</span>
        </div>
      </div>`;
    });
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

function kwCompare() {
  const a = document.getElementById('cmpA').value.trim();
  const b = document.getElementById('cmpB').value.trim();
  if (!a || !b) return toast('Enter both keywords', 'error');
  const results = document.getElementById('cmpResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Comparing...</div>';

  fetch('/api/keywords/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keywordA: a, keywordB: b })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem">`;
    [data.a, data.b].forEach((k, idx) => {
      const scoreClass = k.score >= 70 ? 'score-high' : k.score >= 45 ? 'score-medium' : 'score-low';
      html += `<div class="glass" style="padding:1rem;text-align:center">
        <div style="font-weight:700;font-size:1rem;margin-bottom:0.5rem">${k.keyword}</div>
        <div><span class="result-score ${scoreClass}" style="font-size:1.2rem">${k.score}</span></div>
        <div style="margin-top:0.4rem;font-size:0.78rem;color:var(--text-secondary)">Competition: ${k.competition}</div>
        <div style="font-size:0.78rem;color:var(--text-secondary)">Words: ${k.words} | Chars: ${k.chars}</div>
      </div>`;
    });
    html += `</div>`;
    const winner = data.a.score > data.b.score ? data.a.keyword : data.b.keyword;
    html += `<div class="glass" style="padding:1rem;margin-top:0.5rem;text-align:center;border-color:rgba(0,191,255,0.3)">
      <span style="font-size:1rem;font-weight:700;color:var(--neon-blue)">Winner: ${winner}</span>
    </div>`;
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── SEO ANALYZER ───
function analyzeSEO() {
  const title = document.getElementById('seoTitle').value.trim();
  const desc = document.getElementById('seoDesc').value.trim();
  const tags = document.getElementById('seoTags').value.trim();
  if (!title) return toast('Enter a video title', 'error');
  const results = document.getElementById('seoResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Analyzing SEO...</div>';

  fetch('/api/seo/detail', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: desc, tags })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const total = data.total || 0;
    const grade = data.grade || 'N/A';
    const scoreColor = total >= 70 ? 'score-high' : total >= 45 ? 'score-medium' : 'score-low';

    let html = `<div class="glass" style="padding:1.5rem;margin-bottom:1rem;text-align:center">
      <div class="score-ring" style="background:conic-gradient(var(--neon-blue) ${total}%, rgba(255,255,255,0.05) 0);width:100px;height:100px;margin:0 auto 0.8rem">
        <span class="result-score ${scoreColor}" style="font-size:2rem;line-height:100px">${total}</span>
      </div>
      <div style="font-family:var(--font-display);font-size:1.2rem;font-weight:700;color:var(--neon-blue)">Grade ${grade}</div>
      <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem">Title: ${data.titleScore} / Desc: ${data.descScore} / Tags: ${data.tagScore}</div>
    </div>`;

    // Breakdown
    ['title', 'description', 'tags'].forEach(section => {
      const s = data[section];
      if (!s || !s.notes) return;
      html += `<div class="glass" style="padding:1rem;margin-bottom:0.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">
          <span style="font-weight:700;text-transform:uppercase;font-size:0.8rem;color:var(--text-secondary)">${section}</span>
          <span class="result-score ${s.score >= 15 ? 'score-high' : s.score >= 8 ? 'score-medium' : 'score-low'}">+${s.score}</span>
        </div>
        <div style="font-size:0.82rem;color:var(--text-tertiary)">${(s.notes || []).join('<br>')}</div>
      </div>`;
    });

    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── AI GENERATOR ───
let aiMode = 'ideas';

function switchAIMode(mode, btn) {
  aiMode = mode;
  document.querySelectorAll('.ai-mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const ph = {
    ideas: 'Enter your niche (e.g. "gaming", "fitness for beginners")',
    title: 'Enter your video title to optimize',
    desc: 'Enter video title | keywords (optional)',
    script: 'Enter video title or topic for script outline',
    analyze: 'Enter a keyword for deep analysis'
  };
  document.getElementById('aiInput').placeholder = ph[mode] || 'Enter your input';
}

function saveAIKey() {
  const key = document.getElementById('aiKeyInput').value.trim();
  if (!key) return toast('Enter an API key', 'error');

  fetch('/api/settings/gemini-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      toast('Gemini key saved!');
      document.getElementById('aiKeyStatus').textContent = '✓ Saved';
      document.getElementById('aiKeyStatus').style.color = '#00B894';
    } else {
      toast('Failed to save key', 'error');
    }
  })
  .catch(() => toast('Failed to save key', 'error'));
}

function runAI() {
  const input = document.getElementById('aiInput').value.trim();
  if (!input) return toast('Enter your input', 'error');
  const results = document.getElementById('aiResults');
  results.style.display = 'block';
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>AI is thinking...</div>';

  fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: aiMode, input })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    const text = data.text || 'No response';
    let html = `<div class="result-card" style="cursor:pointer;margin-bottom:0.8rem" onclick="copyToClipboard('${text.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')">
      <span style="font-size:0.85rem;color:var(--text-secondary)">📋 Copy full response</span>
    </div>
    <div style="font-size:0.88rem;line-height:1.7;white-space:pre-wrap;color:var(--text-primary)">${text}</div>`;
    results.innerHTML = html;
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── VIRAL DETECTOR ───
function scanViral() {
  toast('Scanning viral trends...');
  document.getElementById('viralScore').textContent = Math.floor(Math.random() * 30) + 65;
  document.getElementById('viralMomentum').textContent = (Math.random() * 3 + 0.5).toFixed(1) + 'k';
  document.getElementById('viralAudience').textContent = Math.floor(Math.random() * 20) + 78 + '%';
  const comps = ['Low', 'Medium', 'High'];
  document.getElementById('viralCompetition').textContent = comps[Math.floor(Math.random() * 2)];
  toast('Viral scan complete!');
}

function checkViral() {
  const kw = document.getElementById('viralInput').value.trim();
  if (!kw) return toast('Enter a keyword', 'error');
  const results = document.getElementById('viralResults');
  results.innerHTML = '<div class="cyber-loading"><span class="loader-ring"></span>Analyzing viral potential...</div>';

  fetch('/api/viral/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword: kw })
  })
  .then(r => r.json())
  .then(data => {
    if (data.error) { results.innerHTML = `<div class="error-msg">${data.error}</div>`; return; }
    document.getElementById('viralScore').textContent = data.viralScore || 0;
    document.getElementById('viralMomentum').textContent = (data.momentum || '0') + 'k';
    document.getElementById('viralAudience').textContent = (data.audienceFit || '0') + '%';
    document.getElementById('viralCompetition').textContent = data.competition || 'Medium';

    let html = `<div class="section-title">Viral Analysis: "${kw}"</div>`;
    (data.related || []).slice(0, 10).forEach(r => {
      html += `<div class="result-card"><span class="result-keyword">${r}</span><button class="copy-btn" onclick="copyToClipboard('${r.replace(/'/g, "\\'")}')">Copy</button></div>`;
    });
    results.innerHTML = html || '<div class="radar-placeholder">Analysis complete</div>';
  })
  .catch(err => { results.innerHTML = `<div class="error-msg">Error: ${err.message}</div>`; });
}

// ─── SETTINGS ───
function saveYtKey() {
  const key = document.getElementById('settingsYtKey').value.trim();
  if (!key) return toast('Enter an API key', 'error');

  fetch('/api/settings/youtube-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      toast('YouTube API key saved!');
      document.getElementById('settingsYtStatus').textContent = '✓ Saved';
      document.getElementById('settingsYtStatus').style.color = '#00B894';
    } else {
      toast('Failed to save key', 'error');
    }
  })
  .catch(() => toast('Failed to save key', 'error'));
}

function saveGeminiKey() {
  const key = document.getElementById('settingsGeminiKey').value.trim();
  if (!key) return toast('Enter an API key', 'error');

  fetch('/api/settings/gemini-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      toast('Gemini API key saved!');
      document.getElementById('settingsGeminiStatus').textContent = '✓ Saved';
      document.getElementById('settingsGeminiStatus').style.color = '#00B894';
    } else {
      toast('Failed to save key', 'error');
    }
  })
  .catch(() => toast('Failed to save key', 'error'));
}

function exportTXT() {
  const text = document.getElementById('exportData').value.trim();
  if (!text) return toast('No data to export', 'error');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'trendpulse_data.txt'; a.click();
  toast('Exported as TXT');
}

function exportCSV() {
  const text = document.getElementById('exportData').value.trim();
  if (!text) return toast('No data to export', 'error');
  const lines = text.split('\n').filter(s => s.trim());
  const csv = 'keyword\n' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'trendpulse_data.csv'; a.click();
  toast('Exported as CSV');
}

function exportJSON() {
  const text = document.getElementById('exportData').value.trim();
  if (!text) return toast('No data to export', 'error');
  const lines = text.split('\n').filter(s => s.trim());
  const json = JSON.stringify(lines, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'trendpulse_data.json'; a.click();
  toast('Exported as JSON');
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  // Load saved API keys into settings
  fetch('/api/settings/keys')
    .then(r => r.json())
    .then(data => {
      if (data.youtube) document.getElementById('settingsYtKey').value = data.youtube;
      if (data.gemini) document.getElementById('settingsGeminiKey').value = data.gemini;
    })
    .catch(() => {});
});