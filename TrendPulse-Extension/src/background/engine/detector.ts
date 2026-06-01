interface TrendSignal {
  keyword: string
  platform: string
  velocity: number
  volume: number
  timestamp: number
}

interface ViralAlert {
  type: "rising_keyword" | "viral_trend" | "competitor_upload" | "trend_spike"
  platform: string
  keyword?: string
  channel?: string
  score: number
  message: string
}

class TrendDetector {
  private signals: TrendSignal[] = []
  private history: Map<string, number[]> = new Map()
  private listeners: Array<(alert: ViralAlert) => void> = []

  addSignal(keyword: string, platform: string, volume: number) {
    const signal: TrendSignal = {
      keyword: keyword.toLowerCase(),
      platform,
      velocity: 0,
      volume,
      timestamp: Date.now(),
    }
    this.signals.push(signal)
    this.updateHistory(signal.keyword, volume)

    const velocity = this.calculateVelocity(signal.keyword)
    signal.velocity = velocity

    if (velocity > 0.5) {
      this.emitAlert({
        type: "rising_keyword",
        platform,
        keyword: signal.keyword,
        score: Math.round(velocity * 100),
        message: `Keyword "${signal.keyword}" is rising fast on ${platform}`,
      })
    }
  }

  private updateHistory(keyword: string, volume: number) {
    if (!this.history.has(keyword)) {
      this.history.set(keyword, [])
    }
    const h = this.history.get(keyword)!
    h.push(volume)
    if (h.length > 20) h.shift()
  }

  private calculateVelocity(keyword: string): number {
    const h = this.history.get(keyword)
    if (!h || h.length < 3) return 0

    const recent = h.slice(-3)
    const growth = (recent[2] - recent[0]) / (recent[0] || 1)
    return Math.max(0, Math.min(1, growth))
  }

  onAlert(listener: (alert: ViralAlert) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private emitAlert(alert: ViralAlert) {
    this.listeners.forEach((l) => l(alert))
  }

  getTrendingKeywords(): string[] {
    const scored = this.signals
      .filter((s) => s.velocity > 0.3)
      .sort((a, b) => b.velocity - a.velocity)
    return [...new Set(scored.map((s) => s.keyword))].slice(0, 10)
  }

  getKeywordVelocity(keyword: string): number {
    return this.calculateVelocity(keyword.toLowerCase())
  }

  clear() {
    this.signals = []
    this.history.clear()
  }
}

export const trendDetector = new TrendDetector()
