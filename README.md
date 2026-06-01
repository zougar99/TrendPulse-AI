# ⚡ TrendPulse AI — Intelligence Engine

> **21 AI-powered features** — Viral detection, keyword research, SEO analysis, competitor intelligence, content generation, and more. A full-stack intelligence platform for content creators and digital strategists.

![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python) ![PyQt6](https://img.shields.io/badge/PyQt6-6.5-41CD52?logo=qt) ![GitHub repo size](https://img.shields.io/github/repo-size/zougar99/TrendPulse-AI) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Quick Start

```bash
pip install PyQt6 requests
python -m desktop.runner
```

Or just double-click **`START.bat`** 🖱️

---

## 🖥️ Desktop App (21 Features)

### 🔬 Analysis & Discovery
| Feature | Description |
|---------|-------------|
| 🧬 **Viral DNA Lab** | Score content viral potential, map psychological triggers, emotional heatmap |
| 🌍 **Viral Score Map** | Region-based viral scores, demographic targeting, device analytics |
| 🎯 **Niche Finder** | Discover profitable niches with competition & growth metrics |
| 📈 **Trend Timeline** | Visual trend lifecycle — rise → explosion → peak → decline |
| 📡 **Early Detection** | Real-time signal monitoring, breakout probability prediction |

### 📝 Content Optimization
| Feature | Description |
|---------|-------------|
| 🖼️ **Thumbnail Lab** | CTR prediction, attention heatmap, color psychology, contrast scoring |
| 📝 **Title Psychology** | Curiosity gap, emotional impact, urgency scoring, optimized title variants |
| 📱 **Shorts Analyzer** | Hook speed, retention, pacing, viral structure scoring |

### 🤖 AI & Automation
| Feature | Description |
|---------|-------------|
| 💬 **AI Chat** | Contextual AI assistant for trend research & strategy |
| 🎤 **Voice Command** | Hands-free voice control for all features |
| ✍️ **Content Generator** | AI titles, scripts, descriptions, hashtags, hooks, CTAs — 6 tone modes |
| 🎭 **Faceless Content** | Niche ideas, voiceover scripts, stock footage, AI avatars |

### 📊 Intelligence & Strategy
| Feature | Description |
|---------|-------------|
| 🔔 **Smart Alert Engine** | Priority-based trend alerts with multi-channel notifications |
| ☁️ **TrendPulse Cloud** | Cloud sync, backups, keyword history, team collaboration |
| 👥 **Community Intel** | Heatmap visualization, rising keywords, hidden opportunities |
| 📸 **Screenshot Analyzer** | Upload & analyze any thumbnail/image for CTR potential |
| ⚡ **Real-Time Trends** | Live trend feed with auto-refresh & AI acceleration detection |
| 🏆 **Competitor Intel** | Channel deep-dive, growth chart, keyword strategy, content pie |
| 📅 **Content Calendar** | Monthly calendar, best upload times, viral opportunity predictions |

### ⚙️ System
| Feature | Description |
|---------|-------------|
| ⚙️ **Settings** | API keys, theme selector, auto-analysis toggle |
| 📊 **Dashboard** | Live stats, activity feed, quick actions |

---

## 🌐 Browser Extension (Bonus)

A **Chrome/Firefox extension** built with Plasmo + React + TypeScript is also included:
- 📌 Floating assistant on YouTube, Google, TikTok
- 📊 Sidepanel with 13 intelligence sections
- ⚡ Popup with 14 tools & real-time alerts
- 🔌 Direct integration with the Python API backend

Build from source:
```bash
cd TrendPulse-Extension
npm install
npm run build
```

---

## 🏗️ Architecture

```
TrendPulse-AI/
├── desktop/                    # 🖥️ PyQt6 Desktop Application
│   ├── runner.py              #     Entry point (auto-launches server)
│   ├── main_window.py         #     Main window + sidebar navigation
│   ├── theme.py               #     Cyberpunk glassmorphism QSS theme
│   ├── api_client.py          #     HTTP client for all API endpoints
│   └── pages/                 #     21 feature widgets
│       ├── dashboard.py       #     📊 Dashboard
│       ├── viral_dna.py       #     🧬 Viral DNA Lab
│       ├── viral_map.py       #     🌍 Viral Score Map
│       ├── niche_finder.py    #     🎯 Niche Finder
│       ├── trend_timeline.py  #     📈 Trend Timeline
│       ├── smart_alerts.py    #     🔔 Smart Alert Engine
│       ├── thumbnail_lab.py   #     🖼️ Thumbnail Lab
│       ├── title_psychology.py#     📝 Title Psychology
│       ├── ai_chat.py         #     💬 AI Chat
│       ├── early_detection.py #     📡 Early Detection
│       ├── voice_command.py   #     🎤 Voice Command
│       ├── content_generator.py#    ✍️ Content Generator
│       ├── content_calendar.py#     📅 Content Calendar
│       ├── cloud.py           #     ☁️ TrendPulse Cloud
│       ├── community.py       #     👥 Community Intel
│       ├── screenshot.py      #     📸 Screenshot Analyzer
│       ├── real_time_trends.py#     ⚡ Real-Time Trends
│       ├── faceless_content.py#     🎭 Faceless Content
│       ├── competitor_intel.py#     🏆 Competitor Intel
│       ├── shorts_analyzer.py #     📱 Shorts Analyzer
│       └── settings.py        #     ⚙️ Settings
├── app.py                     # 🐍 Python API Server (port 3000)
├── py_engine.py               # 🧠 Core algorithms (integrated into app.py)
├── requirements.txt           # 📦 Python dependencies
├── START.bat                  # 🚀 Windows launcher
├── TrendPulse-Extension/      # 🌐 Chrome/Firefox extension (Plasmo + React + TS)
│   ├── src/
│   │   ├── popup/            #      Popup (14 tools)
│   │   ├── sidepanel/        #      Sidepanel (13 sections)
│   │   ├── background/       #      Service worker (25+ handlers)
│   │   ├── contents/         #      Content scripts (YouTube, Google, TikTok)
│   │   └── lib/              #      API client + utilities
│   └── build/                #     Built extensions
└── public/                    # 🌐 Legacy web app (HTML/CSS/JS)
```

---

## 🔧 API Backend

The Python HTTPServer (no Flask/FastAPI needed) runs on **port 3000**:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/keywords/explore` | POST | Keyword research & analysis |
| `/api/keywords/expand` | POST | Related keyword expansion |
| `/api/keywords/score` | POST | Bulk keyword scoring |
| `/api/keywords/niche` | POST | Niche profitability analysis |
| `/api/keywords/compare` | POST | Keyword A/B comparison |
| `/api/tags/generate` | POST | Smart tag generation |
| `/api/hashtags/generate` | POST | Hashtag suggestions |
| `/api/seo/analyze` | POST | Full SEO analysis |
| `/api/seo/detail` | POST | Detailed SEO audit |
| `/api/viral/check` | POST | Viral DNA scoring |
| `/api/trending/daily` | POST | Daily trending topics |
| `/api/thumbnail/ideas` | POST | Thumbnail concept generation |
| `/api/ai/generate` | POST | AI content generation |
| `/api/analytics/channel` | POST | Channel analytics |
| `/api/settings/keys` | GET | View configured API keys |
| `/api/settings/youtube-key` | POST | Set YouTube API key |
| `/api/settings/gemini-key` | POST | Set Gemini AI key |

---

## 🎨 Theme

**Cyberpunk Glassmorphism** — dark, premium, cinematic:
- Background: `#0B0B0F` (near-black with subtle noise)
- Primary: `#00BFFF` (neon blue)
- Secondary: `#8A5CFF` (cyber purple)
- Accent: `#00FFF0` (cyan)
- Highlight: `#FF2D95` (hot pink)
- Success: `#00FF88` (neon green)
- Warning: `#FFD700` (gold)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you'd like to change.

---

## ⚖️ License

[MIT](LICENSE)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/zougar99">zougar99</a>
</p>
