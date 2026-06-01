# YouTube Growth Toolkit

A free, legitimate YouTube growth toolkit with 4 powerful tools:

1. **SEO Analyzer** - Analyze top-ranking videos and get title, description & tag suggestions
2. **Trending Topics** - See what's trending on YouTube in any region/category
3. **Thumbnail & Title Generator** - Get click-worthy title ideas, thumbnail text & color schemes
4. **Channel Analytics** - Deep-dive into any channel's performance metrics

## Setup

### 1. Install Python
Download from https://python.org (3.10+ recommended)

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Get a YouTube API Key (free)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Go to **Credentials** > **Create Credentials** > **API Key**
5. Copy your API key

### 4. Configure
Edit the `.env` file and replace `your_api_key_here` with your actual API key:
```
YOUTUBE_API_KEY=AIzaSy...your_key_here
```

### 5. Run
```bash
python app.py
```

Open http://localhost:3000 in your browser.

## Features

- **SEO Analysis**: Scores top videos for SEO quality, extracts common tags, gives optimization tips
- **Trending Scanner**: Browse trending videos by region and category, extract their tags
- **Title Generator**: 35+ title templates across 5 styles (curiosity, listicle, emotional, how-to, versus)
- **Thumbnail Ideas**: Color schemes, overlay text suggestions, and pro tips
- **Channel Analytics**: Subscriber count, engagement rate, upload frequency, best videos
- **Click-to-copy**: Click any tag, title, or text to copy it instantly
