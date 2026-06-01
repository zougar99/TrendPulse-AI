export const API_BASE =
  process.env.NEXT_PUBLIC_TRENDPULSE_API || "http://localhost:3000/api"

export const WS_URL =
  process.env.NEXT_PUBLIC_TRENDPULSE_WS || "ws://localhost:3000/ws"

export const STORAGE_KEYS = {
  SETTINGS: "trendpulse_settings",
  HISTORY: "trendpulse_history",
  CACHE: "trendpulse_cache",
  COMPETITOR_DATA: "trendpulse_competitors",
  TREND_ALERTS: "trendpulse_alerts",
  KEYWORD_TRACKER: "trendpulse_keywords",
  AUTH: "trendpulse_auth",
} as const

export const ANALYSIS_THRESHOLDS = {
  SEO_GREAT: 80,
  SEO_GOOD: 60,
  SEO_OK: 40,
  VIRAL_HOT: 75,
  VIRAL_RISING: 50,
  COMPETITION_HIGH: 65,
  COMPETITION_MEDIUM: 35,
} as const

export const SCRAPE_INTERVALS = {
  AUTOCOMPLETE: 300_000,
  TRENDING: 600_000,
  COMPETITOR: 900_000,
  CACHE_TTL: 120_000,
} as const

export const PLATFORMS = ["youtube", "google", "tiktok"] as const
export type Platform = (typeof PLATFORMS)[number]

export const THEMES = {
  cyberpunk: {
    primary: "#00BFFF",
    secondary: "#8A5CFF",
    accent: "#00FFF0",
    bg: "#0B0B0F",
    card: "rgba(18,18,26,0.85)",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.6)",
  },
} as const
