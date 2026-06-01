import { generateId, clamp, average } from "./utils"

interface TrendSignal {
  keyword: string
  platform: string
  velocity: number
  uploadRate: number
  searchAcceleration: number
  socialSpike: number
  timestamp: number
}

interface TrendEvent {
  type: "trend_emerging" | "trend_spiking" | "trend_peaking" | "trend_declining"
  keyword: string
  platform: string
  score: number
  signal: TrendSignal
  timestamp: number
}

type TrendHandler = (event: TrendEvent) => void

interface TrackedTrend {
  keyword: string
  platform: string
  history: number[]
  velocity: number
  uploadRate: number
  searchAcceleration: number
  socialSpike: number
  lastUpdate: number
}

const THRESHOLDS = {
  EMERGING: 30,
  SPIKING: 55,
  PEAKING: 75,
  DECLINING_DROP: -20,
}

export class TrendEngine {
  private trends = new Map<string, TrackedTrend>()
  private handlers = new Map<string, Set<TrendHandler>>()
  private interval: ReturnType<typeof setInterval> | null = null
  private isRunning = false

  start(intervalMs = 5000): void {
    if (this.isRunning) return
    this.isRunning = true

    this.seedInitialTrends()

    this.interval = setInterval(() => {
      this.tick()
    }, intervalMs)
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isRunning = false
  }

  onTrend(handler: TrendHandler): () => void {
    if (!this.handlers.has("all")) {
      this.handlers.set("all", new Set())
    }
    this.handlers.get("all")!.add(handler)
    return () => this.handlers.get("all")?.delete(handler)
  }

  on(type: string, handler: TrendHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
    return () => this.handlers.get(type)?.delete(handler)
  }

  getActiveTrends(minScore = 20): TrendSignal[] {
    const active: TrendSignal[] = []
    for (const [, trend] of this.trends) {
      const score = this.calculateCompositeScore(trend)
      if (score >= minScore) {
        active.push({
          keyword: trend.keyword,
          platform: trend.platform,
          velocity: trend.velocity,
          uploadRate: trend.uploadRate,
          searchAcceleration: trend.searchAcceleration,
          socialSpike: trend.socialSpike,
          timestamp: trend.lastUpdate,
        })
      }
    }
    return active.sort((a, b) => {
      const sa = this.calculateCompositeScoreFromSignal(a)
      const sb = this.calculateCompositeScoreFromSignal(b)
      return sb - sa
    })
  }

  addDataPoint(keyword: string, platform: string, values: Partial<TrendSignal>): void {
    const key = `${keyword}:${platform}`
    let trend = this.trends.get(key)

    if (!trend) {
      trend = {
        keyword,
        platform,
        history: [],
        velocity: 0,
        uploadRate: 0,
        searchAcceleration: 0,
        socialSpike: 0,
        lastUpdate: Date.now(),
      }
      this.trends.set(key, trend)
    }

    if (values.velocity !== undefined) trend.velocity = values.velocity
    if (values.uploadRate !== undefined) trend.uploadRate = values.uploadRate
    if (values.searchAcceleration !== undefined) trend.searchAcceleration = values.searchAcceleration
    if (values.socialSpike !== undefined) trend.socialSpike = values.socialSpike

    const score = this.calculateCompositeScore(trend)
    trend.history.push(score)
    if (trend.history.length > 50) trend.history.splice(0, trend.history.length - 50)
    trend.lastUpdate = Date.now()
  }

  private seedInitialTrends(): void {
    const seeds = [
      { keyword: "AI tutorials", platform: "youtube" },
      { keyword: "side hustle", platform: "youtube" },
      { keyword: "productivity tips", platform: "youtube" },
      { keyword: "machine learning", platform: "google" },
      { keyword: "digital marketing", platform: "google" },
      { keyword: "home workout", platform: "youtube" },
      { keyword: "recipe ideas", platform: "tiktok" },
      { keyword: "travel hacks", platform: "tiktok" },
      { keyword: "coding for beginners", platform: "youtube" },
      { keyword: "self improvement", platform: "google" },
    ]

    for (const seed of seeds) {
      this.addDataPoint(seed.keyword, seed.platform, {
        velocity: Math.random() * 60 + 10,
        uploadRate: Math.random() * 40 + 5,
        searchAcceleration: Math.random() * 50 + 5,
        socialSpike: Math.random() * 30 + 5,
      })
    }
  }

  private tick(): void {
    for (const [, trend] of this.trends) {
      const oldScore = this.calculateCompositeScore(trend)

      const walk = (current: number, maxStep = 5): number => {
        return clamp(current + (Math.random() - 0.48) * maxStep * 2, 0, 100)
      }

      trend.velocity = walk(trend.velocity, 4)
      trend.uploadRate = walk(trend.uploadRate, 3)
      trend.searchAcceleration = walk(trend.searchAcceleration, 5)
      trend.socialSpike = walk(trend.socialSpike, 6)

      const newScore = this.calculateCompositeScore(trend)
      trend.history.push(newScore)
      if (trend.history.length > 50) trend.history.splice(0, trend.history.length - 50)
      trend.lastUpdate = Date.now()

      const signal: TrendSignal = {
        keyword: trend.keyword,
        platform: trend.platform,
        velocity: trend.velocity,
        uploadRate: trend.uploadRate,
        searchAcceleration: trend.searchAcceleration,
        socialSpike: trend.socialSpike,
        timestamp: trend.lastUpdate,
      }

      if (newScore >= THRESHOLDS.PEAKING && oldScore < THRESHOLDS.PEAKING) {
        this.emit("trend_peaking", { type: "trend_peaking", keyword: trend.keyword, platform: trend.platform, score: newScore, signal, timestamp: Date.now() })
      } else if (newScore >= THRESHOLDS.SPIKING && oldScore < THRESHOLDS.SPIKING) {
        this.emit("trend_spiking", { type: "trend_spiking", keyword: trend.keyword, platform: trend.platform, score: newScore, signal, timestamp: Date.now() })
      } else if (newScore >= THRESHOLDS.EMERGING && oldScore < THRESHOLDS.EMERGING) {
        this.emit("trend_emerging", { type: "trend_emerging", keyword: trend.keyword, platform: trend.platform, score: newScore, signal, timestamp: Date.now() })
      } else if (newScore - oldScore < THRESHOLDS.DECLINING_DROP) {
        this.emit("trend_declining", { type: "trend_declining", keyword: trend.keyword, platform: trend.platform, score: newScore, signal, timestamp: Date.now() })
      }
    }
  }

  private emit(type: string, event: TrendEvent): void {
    this.handlers.get(type)?.forEach((h) => h(event))
    this.handlers.get("all")?.forEach((h) => h(event))
  }

  private calculateCompositeScore(trend: TrackedTrend): number {
    return Math.round(
      trend.velocity * 0.35 +
      trend.searchAcceleration * 0.3 +
      trend.uploadRate * 0.2 +
      trend.socialSpike * 0.15
    )
  }

  private calculateCompositeScoreFromSignal(signal: TrendSignal): number {
    return Math.round(
      signal.velocity * 0.35 +
      signal.searchAcceleration * 0.3 +
      signal.uploadRate * 0.2 +
      signal.socialSpike * 0.15
    )
  }
}

export const trendEngine = new TrendEngine()
