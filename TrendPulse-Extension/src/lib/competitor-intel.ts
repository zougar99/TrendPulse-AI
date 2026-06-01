import { clamp, average, generateId } from "./utils"

interface ChannelAnalysis {
  channelId: string
  name: string
  subscriberCount: number
  totalVideos: number
  avgViews: number
  avgEngagement: number
  uploadFrequency: string
  topPerformingContent: string[]
  keywordStrategy: KeywordStrategy
  contentStrategy: ContentStrategy
  growthTrend: GrowthData
}

interface KeywordStrategy {
  primaryKeywords: string[]
  longTailKeywords: string[]
  missedOpportunities: string[]
  keywordGaps: string[]
  avgKeywordDifficulty: number
}

interface ContentStrategy {
  preferredFormats: string[]
  avgVideoLength: string
  postingSchedule: string
  thumbnailStyle: string
  hookPatterns: string[]
  retentionStructure: string
}

interface GrowthData {
  monthlyGrowth: number
  weeklyTrend: number[]
  growthSpikes: { date: string; reason: string; magnitude: number }[]
  trajectory: "explosive" | "steady" | "stagnant" | "declining"
}

interface GrowthTracking {
  periodStart: string
  periodEnd: string
  subscriberGain: number
  viewGrowth: number
  engagementRate: number
  uploadCount: number
  topVideo: string
}

interface KeywordStrategyResult {
  channelId: string
  discoveredKeywords: string[]
  highOpportunityKeywords: string[]
  contentGaps: string[]
  strategy: string
}

interface ContentStrategyResult {
  channelId: string
  topFormats: string[]
  bestTiming: string
  avgLength: string
  engagementPattern: string
  thumbnailTrends: string[]
  recommendations: string[]
}

export class CompetitorIntel {
  private trackedChannels = new Map<string, any>()

  async analyzeChannel(
    channelId: string,
    channelName?: string
  ): Promise<ChannelAnalysis> {
    const name = channelName || `Channel ${channelId.slice(0, 8)}`
    const subscriberCount = Math.round(10000 + Math.random() * 500000)
    const totalVideos = Math.round(50 + Math.random() * 300)

    const keywordStrategy = this.generateKeywordStrategy()
    const contentStrategy = this.generateContentStrategy()
    const growthTrend = this.generateGrowthData()

    return {
      channelId,
      name,
      subscriberCount,
      totalVideos,
      avgViews: Math.round(1000 + Math.random() * 50000),
      avgEngagement: Math.round(clamp(2 + Math.random() * 8, 0, 100)),
      uploadFrequency: ["Daily", "3x weekly", "Weekly", "Bi-weekly"][Math.floor(Math.random() * 4)],
      topPerformingContent: [
        `${name} Ultimate Guide`,
        `Top 10 ${name} Tips`,
        `How to ${name} Like a Pro`,
        `${name} vs Competitor Comparison`,
        `${name} Beginner Tutorial`,
      ],
      keywordStrategy,
      contentStrategy,
      growthTrend,
    }
  }

  async trackGrowth(
    channelId: string,
    days = 30
  ): Promise<GrowthTracking> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const endDate = new Date()

    const weeklyData: number[] = []
    for (let i = 0; i < Math.ceil(days / 7); i++) {
      weeklyData.push(Math.round(100 + Math.random() * 900))
    }

    return {
      periodStart: startDate.toISOString().split("T")[0],
      periodEnd: endDate.toISOString().split("T")[0],
      subscriberGain: Math.round(500 + Math.random() * 5000),
      viewGrowth: Math.round(10000 + Math.random() * 100000),
      engagementRate: Math.round(clamp(3 + Math.random() * 7, 0, 100)),
      uploadCount: Math.round(4 + Math.random() * 12),
      topVideo: `channel_${channelId.slice(0, 6)}_trending_video`,
    }
  }

  async getKeywordStrategy(channelId: string): Promise<KeywordStrategyResult> {
    const kw = this.generateKeywordStrategy()
    return {
      channelId,
      discoveredKeywords: kw.primaryKeywords.slice(0, 5),
      highOpportunityKeywords: kw.missedOpportunities.slice(0, 4),
      contentGaps: kw.keywordGaps.slice(0, 3),
      strategy: `Target long-tail variations of ${kw.primaryKeywords[0] || "main topic"} with lower competition. Prioritize ${kw.missedOpportunities[0] || "rising keywords"} for next content cycle.`,
    }
  }

  async getContentStrategy(channelId: string): Promise<ContentStrategyResult> {
    const formats = ["Tutorial", "Review", "Comparison", "Listicle", "Case Study", "News/Analysis"]

    return {
      channelId,
      topFormats: formats.sort(() => Math.random() - 0.5).slice(0, 3),
      bestTiming: ["Weekdays 14:00-16:00", "Weekends 10:00-12:00", "Monday 18:00", "Thursday 15:00"][
        Math.floor(Math.random() * 4)
      ],
      avgLength: `${Math.round(8 + Math.random() * 15)}:${Math.round(Math.random() * 59).toString().padStart(2, "0")}`,
      engagementPattern: Math.random() > 0.5
        ? "High initial spike with steady tail"
        : "Gradual build with peak at 48 hours",
      thumbnailTrends: ["High contrast text overlay", "Close-up face with emotion", "Bold colored background", "Before/after split"],
      recommendations: [
        "Increase upload frequency to match top performers in niche",
        "Add pattern interrupts in first 15 seconds to boost retention",
        "Optimize thumbnail text for mobile viewing (3 words max)",
        "Include timestamps in description for longer videos",
      ],
    }
  }

  private generateKeywordStrategy(): KeywordStrategy {
    const mainTopic = this.randomTopic()
    return {
      primaryKeywords: [
        `${mainTopic} guide`,
        `best ${mainTopic}`,
        `${mainTopic} tutorial`,
        `${mainTopic} tips`,
        `how to ${mainTopic}`,
      ],
      longTailKeywords: [
        `best ${mainTopic} for beginners 2024`,
        `how to ${mainTopic} step by step`,
        `${mainTopic} vs alternatives comparison`,
        `${mainTopic} tips and tricks for experts`,
        `${mainTopic} complete guide free`,
      ],
      missedOpportunities: [
        `${mainTopic} for professionals`,
        `${mainTopic} statistics and data`,
        `${mainTopic} mistakes beginners make`,
        `${mainTopic} future trends`,
        `${mainTopic} case study success`,
      ],
      keywordGaps: [
        `${mainTopic} automation tools`,
        `${mainTopic} without experience`,
        `${mainTopic} cost analysis`,
        `${mainTopic} certification`,
      ],
      avgKeywordDifficulty: Math.round(30 + Math.random() * 45),
    }
  }

  private generateContentStrategy(): ContentStrategy {
    return {
      preferredFormats: ["Tutorial", "Comparison", "Review", "Listicle"],
      avgVideoLength: `${Math.round(8 + Math.random() * 12)}-${Math.round(20 + Math.random() * 20)} minutes`,
      postingSchedule: ["Mon/Wed/Fri", "Tue/Thu", "Daily", "Weekly"][Math.floor(Math.random() * 4)],
      thumbnailStyle: ["Bold text on gradient", "Face + expressive reaction", "Minimalist product shot", "Before/after comparison"][
        Math.floor(Math.random() * 4)
      ],
      hookPatterns: [
        "Curiosity gap: 'What if I told you...'",
        "Direct address: 'If you're struggling with...'",
        "Statistic opener: 'Studies show that 80%...'",
        "Question hook: 'Did you know that...'",
      ],
      retentionStructure: [
        "Pattern interrupt → Value delivery → CTA",
        "Story → Insight → Application",
        "Problem → Solution → Results",
      ][Math.floor(Math.random() * 3)],
    }
  }

  private generateGrowthData(): GrowthData {
    const weeklyTrend: number[] = []
    for (let i = 0; i < 8; i++) {
      weeklyTrend.push(Math.round(clamp(50 + i * 8 + (Math.random() - 0.5) * 40, 0, 200)))
    }

    const trajectories = ["explosive", "steady", "stagnant", "declining"] as const
    const trajectory = trajectories[Math.floor(Math.random() * 3)]

    return {
      monthlyGrowth: Math.round(clamp(trajectory === "explosive" ? 15 + Math.random() * 20 : 2 + Math.random() * 12, 0, 100)),
      weeklyTrend,
      growthSpikes: [
        {
          date: "2024-01-15",
          reason: "Viral video on main topic",
          magnitude: Math.round(50 + Math.random() * 50),
        },
        {
          date: "2024-02-20",
          reason: "Collaboration with larger channel",
          magnitude: Math.round(30 + Math.random() * 40),
        },
      ],
      trajectory,
    }
  }

  private randomTopic(): string {
    const topics = [
      "digital marketing", "video editing", "content creation", "social media growth",
      "SEO optimization", "keyword research", "youtube automation", "affiliate marketing",
      "online business", "productivity system", "freelancing", "personal branding",
      "email marketing", "funnel building", "course creation", "niche websites",
    ]
    return topics[Math.floor(Math.random() * topics.length)]
  }
}

export const competitorIntel = new CompetitorIntel()
