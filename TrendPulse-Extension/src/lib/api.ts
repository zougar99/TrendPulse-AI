import { API_BASE } from "./constants"

interface RequestOptions {
  method?: string
  body?: any
  signal?: AbortSignal
  timeout?: number
}

async function request<T>(endpoint: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "POST", body, signal, timeout = 15000 } = opts

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || controller.signal,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }

    return (await res.json()) as T
  } finally {
    clearTimeout(timeoutId)
  }
}

export const api = {
  // ─── Keyword APIs ───
  keywords: {
    explore: (keyword: string, source = "both") =>
      request<any>("/keywords/explore", { body: { keyword, source } }),

    expand: (keyword: string, source = "youtube") =>
      request<any>("/keywords/expand", { body: { keyword, source } }),

    combine: (listA: string[], listB: string[]) =>
      request<any>("/keywords/combine", { body: { listA, listB } }),

    score: (keywords: string[]) =>
      request<any>("/keywords/score", { body: { keywords } }),

    niche: (keyword: string) =>
      request<any>("/keywords/niche", { body: { keyword } }),

    compare: (keywordA: string, keywordB: string) =>
      request<any>("/keywords/compare", { body: { keywordA, keywordB } }),

    reverse: (videoId: string) =>
      request<any>("/keywords/reverse", { body: { videoId } }),

    psychology: (keyword: string) =>
      request<any>("/keywords/psychology", { body: { keyword } }),
  },

  // ─── Tag APIs ───
  tags: {
    generate: (keyword: string) =>
      request<any>("/tags/generate", { body: { keyword } }),

    hashtags: (topic: string, count = 25) =>
      request<any>("/hashtags/generate", { body: { topic, count } }),

    analyze: (tags: string[]) =>
      request<any>("/tags/analyze", { body: { tags } }),

    optimize: (keyword: string, existingTags: string[]) =>
      request<any>("/tags/optimize", { body: { keyword, existingTags } }),
  },

  // ─── SEO APIs ───
  seo: {
    analyze: (query: string, maxResults = 10) =>
      request<any>("/seo/analyze", { body: { query, maxResults } }),

    detail: (title: string, description = "", tags = "") =>
      request<any>("/seo/detail", { body: { title, description, tags } }),

    forecast: (keyword: string) =>
      request<any>("/seo/forecast", { body: { keyword } }),
  },

  // ─── Viral API ───
  viral: {
    check: (keyword: string) =>
      request<any>("/viral/check", { body: { keyword } }),

    analyze: (url: string) =>
      request<any>("/viral/analyze", { body: { url } }),

    predict: (keyword: string) =>
      request<any>("/viral/predict", { body: { keyword } }),

    momentum: (keyword: string) =>
      request<any>("/viral/momentum", { body: { keyword } }),
  },

  // ─── Trending ───
  trending: {
    get: (category = "0", regionCode = "US", maxResults = 20) =>
      request<any>("/trending", { body: { category, regionCode, maxResults } }),

    daily: () => request<any>("/trending/daily"),

    realtime: () => request<any>("/trending/realtime"),

    early: () => request<any>("/trending/early"),

    velocity: (keyword: string) =>
      request<any>("/trending/velocity", { body: { keyword } }),
  },

  // ─── AI ───
  ai: {
    generate: (prompt: string, type = "title") =>
      request<any>("/ai/generate", { body: { prompt, type } }),

    chat: (message: string, context?: string) =>
      request<any>("/ai/chat", { body: { message, context } }),

    voice: (text: string, voice = "default") =>
      request<any>("/ai/voice", { body: { text, voice } }),

    calendar: (niche: string, count = 30) =>
      request<any>("/ai/calendar", { body: { niche, count } }),

    script: (topic: string, duration = 60) =>
      request<any>("/ai/script", { body: { topic, duration } }),

    thumbnail: (title: string, style = "modern") =>
      request<any>("/ai/thumbnail", { body: { title, style } }),

    shorts: (topic: string) =>
      request<any>("/ai/shorts", { body: { topic } }),
  },

  // ─── Content ───
  content: {
    reverse: (url: string) =>
      request<any>("/content/reverse", { body: { url } }),

    analyze: (contentId: string) =>
      request<any>("/content/analyze", { body: { contentId } }),

    generate: (niche: string, type = "article") =>
      request<any>("/content/generate", { body: { niche, type } }),

    calendar: (niche: string, startDate: string) =>
      request<any>("/content/calendar", { body: { niche, startDate } }),
  },

  // ─── Niche ───
  niche: {
    find: (seed: string) =>
      request<any>("/niche/find", { body: { seed } }),

    analyze: (niche: string) =>
      request<any>("/niche/analyze", { body: { niche } }),

    predict: (niche: string) =>
      request<any>("/niche/predict", { body: { niche } }),

    opportunities: () =>
      request<any>("/niche/opportunities"),
  },

  // ─── Competitor ───
  competitor: {
    analyze: (channelId: string) =>
      request<any>("/competitor/analyze", { body: { channelId } }),

    track: (channelId: string) =>
      request<any>("/competitor/track", { body: { channelId } }),

    intelligence: (channelIds: string[]) =>
      request<any>("/competitor/intelligence", { body: { channelIds } }),

    growth: (channelId: string) =>
      request<any>("/competitor/growth", { body: { channelId } }),
  },

  // ─── Shorts ───
  shorts: {
    analyze: (url: string) =>
      request<any>("/shorts/analyze", { body: { url } }),

    optimize: (topic: string) =>
      request<any>("/shorts/optimize", { body: { topic } }),

    generate: (niche: string) =>
      request<any>("/shorts/generate", { body: { niche } }),
  },

  // ─── Thumbnail ───
  thumbnail: {
    analyze: (imageUrl: string) =>
      request<any>("/thumbnail/analyze", { body: { imageUrl } }),

    compare: (urlA: string, urlB: string) =>
      request<any>("/thumbnail/compare", { body: { urlA, urlB } }),

    enhance: (imageUrl: string, style = "modern") =>
      request<any>("/thumbnail/enhance", { body: { imageUrl, style } }),

    generate: (title: string, style = "modern") =>
      request<any>("/thumbnail/generate", { body: { title, style } }),
  },

  // ─── Screenshot ───
  screenshot: {
    analyze: (imageData: string) =>
      request<any>("/screenshot/analyze", { body: { imageData } }),
  },

  // ─── Cloud ───
  cloud: {
    sync: (data: any) =>
      request<any>("/cloud/sync", { body: data }),

    save: (key: string, data: any) =>
      request<any>("/cloud/save", { body: { key, data } }),

    load: (key: string) =>
      request<any>("/cloud/load", { body: { key } }),

    backup: (data: any) =>
      request<any>("/cloud/backup", { body: data }),

    team: (action: string, payload: any) =>
      request<any>("/cloud/team", { body: { action, payload } }),
  },

  // ─── Community ───
  community: {
    trends: () =>
      request<any>("/community/trends"),

    hotspots: (platform = "youtube") =>
      request<any>("/community/hotspots", { body: { platform } }),

    momentum: () =>
      request<any>("/community/momentum"),
  },

  // ─── Channel ───
  channel: {
    analyze: (channelId: string) =>
      request<any>("/analytics/channel", { body: { channelId } }),
  },

  // ─── Alerts ───
  alerts: {
    create: (alert: any) =>
      request<any>("/alerts/create", { body: alert }),

    list: () =>
      request<any>("/alerts/list"),

    dismiss: (alertId: string) =>
      request<any>("/alerts/dismiss", { body: { alertId } }),

    config: (settings: any) =>
      request<any>("/alerts/config", { body: settings }),
  },
}
