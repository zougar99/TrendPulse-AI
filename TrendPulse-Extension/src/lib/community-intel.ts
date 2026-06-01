import { clamp, generateId, average } from "./utils"

interface CommunityTrend {
  keyword: string
  platform: string
  userCount: number
  totalScore: number
  velocity: number
  momentum: number
  emerging: boolean
  timestamp: number
}

interface Hotspot {
  niche: string
  score: number
  growth: number
  keywordCount: number
  topKeywords: string[]
  platforms: string[]
}

interface MomentumEntry {
  keyword: string
  acceleration: number
  direction: "up" | "down" | "stable"
  socialBuzz: number
  creatorActivity: number
}

interface IntelHeatmap {
  zones: { label: string; intensity: number; keywords: string[] }[]
  risingStars: string[]
  hiddenOpportunities: string[]
  crossPlatformWinners: string[]
}

export class CommunityIntel {
  private trends = new Map<string, CommunityTrend>()
  private scanInterval: ReturnType<typeof setInterval> | null = null

  async aggregateTrends(
    signals: Array<{ keyword: string; platform: string; score: number }>
  ): Promise<CommunityTrend[]> {
    for (const signal of signals) {
      const key = `${signal.keyword}:${signal.platform}`
      const existing = this.trends.get(key)

      if (existing) {
        existing.userCount++
        existing.totalScore += signal.score
        existing.velocity = signal.score - existing.totalScore / existing.userCount
        existing.momentum = clamp(existing.momentum + signal.score * 0.1, 0, 100)
        existing.emerging = existing.velocity > 15 && existing.userCount > 1
        existing.timestamp = Date.now()
      } else {
        this.trends.set(key, {
          keyword: signal.keyword,
          platform: signal.platform,
          userCount: 1,
          totalScore: signal.score,
          velocity: 0,
          momentum: clamp(signal.score * 0.3, 0, 100),
          emerging: false,
          timestamp: Date.now(),
        })
      }
    }

    const storageKey = "trendpulse_community_trends"
    try {
      await chrome.storage.local.set({
        [storageKey]: Array.from(this.trends.values()),
      })
    } catch {
      // storage unavailable
    }

    return Array.from(this.trends.values()).sort(
      (a, b) => b.momentum - a.momentum
    )
  }

  async getHotspots(): Promise<Hotspot[]> {
    const allTrends = Array.from(this.trends.values())
    const nicheGroups = new Map<string, CommunityTrend[]>()

    for (const trend of allTrends) {
      const niche = this.inferNiche(trend.keyword)
      if (!nicheGroups.has(niche)) {
        nicheGroups.set(niche, [])
      }
      nicheGroups.get(niche)!.push(trend)
    }

    const hotspots: Hotspot[] = []
    for (const [niche, trends] of nicheGroups.entries()) {
      const avgScore = average(trends.map((t) => t.totalScore / t.userCount))
      const growth = average(trends.map((t) => t.velocity))
      const activeCount = trends.filter((t) => t.emerging).length

      if (activeCount > 0) {
        hotspots.push({
          niche,
          score: Math.round(clamp(avgScore * 10 + growth * 5, 0, 100)),
          growth: Math.round(clamp(growth, -100, 100)),
          keywordCount: trends.length,
          topKeywords: trends
            .sort((a, b) => b.momentum - a.momentum)
            .slice(0, 5)
            .map((t) => t.keyword),
          platforms: [...new Set(trends.map((t) => t.platform))],
        })
      }
    }

    return hotspots.sort((a, b) => b.score - a.score)
  }

  async getMomentum(): Promise<MomentumEntry[]> {
    const entries: MomentumEntry[] = []

    for (const [, trend] of this.trends) {
      const acceleration = trend.velocity + (Math.random() - 0.5) * 10
      entries.push({
        keyword: trend.keyword,
        acceleration: Math.round(acceleration * 10) / 10,
        direction:
          acceleration > 5 ? "up" : acceleration < -5 ? "down" : "stable",
        socialBuzz: Math.round(clamp(trend.momentum + (Math.random() - 0.5) * 20, 0, 100)),
        creatorActivity: Math.round(
          clamp(trend.userCount * 10 + (Math.random() - 0.5) * 20, 0, 100)
        ),
      })
    }

    return entries.sort((a, b) => b.acceleration - a.acceleration)
  }

  async getHeatmap(): Promise<IntelHeatmap> {
    const hotspots = await this.getHotspots()
    const allKeywords = Array.from(this.trends.values())

    const zones = hotspots.slice(0, 6).map((h) => ({
      label: h.niche,
      intensity: h.score,
      keywords: h.topKeywords,
    }))

    const risingStars = allKeywords
      .filter((t) => t.emerging && t.velocity > 20)
      .map((t) => t.keyword)
      .slice(0, 8)

    const hiddenOpportunities = allKeywords
      .filter((t) => t.userCount <= 2 && t.velocity > 10 && t.momentum > 30)
      .map((t) => t.keyword)
      .slice(0, 6)

    const platformSet = new Map<string, Set<string>>()
    for (const [, trend] of this.trends) {
      if (!platformSet.has(trend.platform)) {
        platformSet.set(trend.platform, new Set())
      }
      platformSet.get(trend.platform)!.add(trend.keyword)
    }

    const crossPlatformWinners: string[] = []
    for (const [, keywords] of platformSet) {
      for (const kw of keywords) {
        let platformsFound = 0
        for (const [, otherKeywords] of platformSet) {
          if (otherKeywords.has(kw)) platformsFound++
        }
        if (platformsFound >= 2 && !crossPlatformWinners.includes(kw)) {
          crossPlatformWinners.push(kw)
        }
      }
    }

    return {
      zones,
      risingStars,
      hiddenOpportunities,
      crossPlatformWinners: crossPlatformWinners.slice(0, 5),
    }
  }

  startAutoScan(intervalMs = 60000): void {
    if (this.scanInterval) return
    this.scanInterval = setInterval(async () => {
      try {
        const stored = await chrome.storage.local.get("trendpulse_community_trends")
        if (stored.trendpulse_community_trends) {
          for (const trend of stored.trendpulse_community_trends as CommunityTrend[]) {
            const key = `${trend.keyword}:${trend.platform}`
            this.trends.set(key, trend)
          }
        }
      } catch {
        // silent
      }
    }, intervalMs)
  }

  stopAutoScan(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval)
      this.scanInterval = null
    }
  }

  private inferNiche(keyword: string): string {
    const lower = keyword.toLowerCase()
    const nicheMap: [RegExp, string][] = [
      [/ai|machine learning|deep learning|neural|gpt|chatgpt/, "AI & Machine Learning"],
      [/cooking|recipe|food|baking|kitchen|meal/, "Food & Cooking"],
      [/fitness|workout|exercise|gym|yoga|run|running/, "Fitness & Health"],
      [/travel|vacation|hotel|flight|tourism/, "Travel & Tourism"],
      [/coding|programming|javascript|python|web dev|software/, "Programming & Tech"],
      [/marketing|seo|social media|content|brand/, "Marketing & Business"],
      [/gaming|game|minecraft|fortnite|fps|rpg/, "Gaming"],
      [/music|song|album|concert|playlist/, "Music & Entertainment"],
      [/fashion|style|outfit|clothing|beauty|makeup/, "Fashion & Beauty"],
      [/finance|invest|crypto|stock|trading|money/, "Finance & Investing"],
      [/edu|learn|course|tutorial|lesson|study/, "Education"],
      [/car|auto|vehicle|motor|bike|truck/, "Automotive"],
    ]

    for (const [pattern, niche] of nicheMap) {
      if (pattern.test(lower)) return niche
    }

    return "General"
  }
}

export const communityIntel = new CommunityIntel()
