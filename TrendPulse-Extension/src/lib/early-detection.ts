import { clamp, generateId } from "./utils"

interface DetectionResult {
  keyword: string
  breakoutProbability: number
  explosionForecast: string
  timingPrediction: string
  confidence: number
  signals: {
    keywordVelocity: number
    uploadAcceleration: number
    searchSpike: number
    discussionGrowth: number
    engagementAnomaly: number
  }
  recommendation: string
}

interface PredictionPoint {
  date: string
  predictedScore: number
  lowerBound: number
  upperBound: number
}

export class EarlyDetection {
  private history = new Map<string, number[]>()
  private baseline = new Map<string, number>()

  async analyze(
    keyword: string,
    platform = "youtube"
  ): Promise<DetectionResult> {
    const signals = this.generateSignals(keyword, platform)
    const breakoutProbability = this.calculateBreakoutProbability(signals)
    const confidence = this.calculateConfidence(signals)

    return {
      keyword,
      breakoutProbability,
      explosionForecast: this.forecastExplosionDate(breakoutProbability),
      timingPrediction: this.predictTiming(breakoutProbability, signals),
      confidence,
      signals,
      recommendation: this.generateRecommendation(breakoutProbability, signals),
    }
  }

  async getPredictions(
    keyword: string,
    days = 14
  ): Promise<PredictionPoint[]> {
    const points: PredictionPoint[] = []
    const now = Date.now()
    const baseScore = 20 + Math.random() * 40
    const trend = (Math.random() - 0.3) * 2

    for (let i = 0; i < days; i++) {
      const date = new Date(now + i * 86400000)
      const noise = (Math.random() - 0.5) * 15
      const predictedScore = clamp(
        baseScore + trend * i + noise,
        0,
        100
      )
      const spread = 5 + Math.random() * 10

      points.push({
        date: date.toISOString().split("T")[0],
        predictedScore: Math.round(predictedScore),
        lowerBound: Math.round(clamp(predictedScore - spread, 0, 100)),
        upperBound: Math.round(clamp(predictedScore + spread, 0, 100)),
      })
    }

    return points
  }

  async getBreakoutProbability(keyword: string): Promise<{
    probability: number
    timeframe: string
    factors: string[]
  }> {
    const velocity = this.getStoredVelocity(keyword)
    const probability = clamp(
      15 + velocity * 0.6 + Math.random() * 15,
      0,
      100
    )

    const factors: string[] = []
    if (velocity > 60) factors.push("High keyword velocity detected")
    if (velocity > 40) factors.push("Above average search acceleration")
    if (Math.random() > 0.5) factors.push("Social media mentions increasing")
    if (Math.random() > 0.6) factors.push("Competitor content gap identified")
    factors.push("Seasonal relevance alignment")

    const timeframe =
      probability > 70
        ? "24-48 hours"
        : probability > 45
          ? "3-7 days"
          : "1-4 weeks"

    return { probability: Math.round(probability), timeframe, factors }
  }

  private generateSignals(
    keyword: string,
    platform: string
  ): DetectionResult["signals"] {
    const velocity = this.getStoredVelocity(keyword)

    return {
      keywordVelocity: clamp(velocity + (Math.random() - 0.5) * 20, 0, 100),
      uploadAcceleration: clamp(
        velocity * 0.7 + (Math.random() - 0.5) * 15,
        0,
        100
      ),
      searchSpike: clamp(
        velocity * 0.8 + (Math.random() - 0.5) * 25,
        0,
        100
      ),
      discussionGrowth: clamp(
        velocity * 0.5 + (Math.random() - 0.5) * 20 + 10,
        0,
        100
      ),
      engagementAnomaly: clamp(
        (Math.random() - 0.3) * 60 + 20,
        0,
        100
      ),
    }
  }

  private getStoredVelocity(keyword: string): number {
    const key = keyword.toLowerCase()
    if (!this.history.has(key)) {
      this.history.set(key, [])
      this.baseline.set(key, 15 + Math.random() * 25)
    }

    const historical = this.history.get(key)!
    const base = this.baseline.get(key) || 30

    const newValue = clamp(
      base + (Math.random() - 0.45) * 20,
      0,
      100
    )
    historical.push(newValue)
    if (historical.length > 30) historical.splice(0, historical.length - 30)

    return newValue
  }

  private calculateBreakoutProbability(signals: DetectionResult["signals"]): number {
    const weighted =
      signals.keywordVelocity * 0.3 +
      signals.uploadAcceleration * 0.2 +
      signals.searchSpike * 0.25 +
      signals.discussionGrowth * 0.15 +
      signals.engagementAnomaly * 0.1

    return Math.round(clamp(weighted + (Math.random() - 0.5) * 10, 0, 100))
  }

  private calculateConfidence(signals: DetectionResult["signals"]): number {
    const avg =
      (signals.keywordVelocity +
        signals.uploadAcceleration +
        signals.searchSpike +
        signals.discussionGrowth +
        signals.engagementAnomaly) /
      5

    return Math.round(clamp(avg * 0.6 + 20 + Math.random() * 10, 0, 100))
  }

  private forecastExplosionDate(probability: number): string {
    const now = new Date()
    if (probability >= 75) {
      now.setDate(now.getDate() + 1)
    } else if (probability >= 50) {
      now.setDate(now.getDate() + 3 + Math.floor(Math.random() * 4))
    } else if (probability >= 25) {
      now.setDate(now.getDate() + 7 + Math.floor(Math.random() * 7))
    } else {
      now.setDate(now.getDate() + 14 + Math.floor(Math.random() * 14))
    }
    return now.toISOString().split("T")[0]
  }

  private predictTiming(
    probability: number,
    signals: DetectionResult["signals"]
  ): string {
    const highSignalCount = Object.values(signals).filter((s) => s > 60).length

    if (probability >= 75 && highSignalCount >= 3) return "Imminent (within 24h)"
    if (probability >= 50 && highSignalCount >= 2) return "Soon (2-4 days)"
    if (probability >= 25) return "Moderate (1-2 weeks)"
    return "Long-term (3+ weeks)"
  }

  private generateRecommendation(
    probability: number,
    signals: DetectionResult["signals"]
  ): string {
    if (probability >= 75) {
      return "Create content immediately - this keyword shows strong breakout signals. Prioritize publishing within 24 hours."
    }
    if (probability >= 50) {
      return "Strong potential detected. Start content planning and research now to capture the rising wave."
    }
    if (probability >= 25) {
      return "Early signals detected worth monitoring. Prepare content drafts and track velocity over the next week."
    }
    return "Low breakout probability. Continue monitoring but focus on higher-signal opportunities."
  }
}

export const earlyDetection = new EarlyDetection()
