export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "S"
  if (score >= 80) return "A"
  if (score >= 65) return "B"
  if (score >= 45) return "C"
  if (score >= 25) return "D"
  return "F"
}

export function scoreToColor(score: number): string {
  if (score >= 80) return "#00FF88"
  if (score >= 60) return "#00BFFF"
  if (score >= 40) return "#FFD700"
  if (score >= 20) return "#FF6B35"
  return "#FF2D95"
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K"
  return n.toString()
}

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function extractSearchQuery(url: string): string | null {
  const m = url.match(/[?&]q=([^&]+)/)
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null
}

export function isYouTubeWatchPage(url: string): boolean {
  return /youtube\.com\/(watch\?v=|shorts\/)/.test(url)
}

export function isGoogleSearchPage(url: string): boolean {
  return /google\.com\/search/.test(url)
}

export function isTikTokPage(url: string): boolean {
  return /tiktok\.com\/@/.test(url)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function average(arr: number[]): number {
  if (!arr.length) return 0
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
