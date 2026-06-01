import { clamp, generateId } from "./utils"

interface CalendarEntry {
  date: string
  dayName: string
  title: string
  contentType: string
  platform: string
  bestTime: string
  predictedPerformance: number
  tags: string[]
  notes: string
}

interface ScheduleResult {
  niche: string
  entries: CalendarEntry[]
  totalEntries: number
  idealFrequency: string
  strategy: string
}

interface BestTimeSlot {
  platform: string
  day: string
  time: string
  engagement: number
  rationale: string
}

interface ViralOpportunity {
  window: string
  topic: string
  predictedPeak: string
  estimatedTraffic: string
  preparationDeadline: string
  confidence: number
}

interface ForecastDay {
  date: string
  predictedTraffic: number
  trend: "up" | "down" | "stable"
  topic: string
}

export class ContentCalendar {
  async generateSchedule(
    niche: string,
    startDate = new Date(),
    days = 30
  ): Promise<ScheduleResult> {
    const entries: CalendarEntry[] = []
    const contentTypes = [
      "Tutorial",
      "Listicle",
      "Review",
      "Comparison",
      "News/Analysis",
      "Case Study",
      "How-To Guide",
      "Opinion Piece",
      "Tips & Tricks",
      "Deep Dive",
      "Beginner Guide",
      "Expert Interview",
    ]

    const platforms = ["YouTube", "TikTok", "Blog", "Instagram"]

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      const dayName = dayNames[date.getDay()]

      const contentType = contentTypes[i % contentTypes.length]
      const platform = platforms[i % platforms.length]
      const bestTime = this.getBestTimeForDay(dayName, platform)

      entries.push({
        date: date.toISOString().split("T")[0],
        dayName,
        title: this.generateContentTitle(niche, contentType, i),
        contentType,
        platform,
        bestTime: `${bestTime.time} ${bestTime.time.includes(":") ? "" : ""}`,
        predictedPerformance: Math.round(clamp(50 + Math.random() * 40 - (i % 7 === 0 ? 0 : 5), 0, 100)),
        tags: this.generateTags(niche, contentType),
        notes: this.getContentNote(contentType, niche, i),
      })
    }

    const frequency =
      days >= 30
        ? "3-4 times per week"
        : days >= 14
          ? "Every other day"
          : "Daily"

    return {
      niche,
      entries,
      totalEntries: entries.length,
      idealFrequency: frequency,
      strategy: `Publish content about ${niche} ${frequency.toLowerCase()} focusing on ${entries[0]?.contentType || "varied formats"} to build momentum.`,
    }
  }

  async getBestTimes(niche: string): Promise<BestTimeSlot[]> {
    const slots: BestTimeSlot[] = [
      {
        platform: "YouTube",
        day: "Weekdays",
        time: "14:00-16:00 UTC",
        engagement: Math.round(80 + Math.random() * 15),
        rationale: "Peak afternoon viewing time when users browse after work/school",
      },
      {
        platform: "YouTube",
        day: "Saturday",
        time: "10:00-12:00 UTC",
        engagement: Math.round(75 + Math.random() * 15),
        rationale: "Weekend morning browsing - higher watch time and retention",
      },
      {
        platform: "TikTok",
        day: "Weekdays",
        time: "07:00-09:00 UTC",
        engagement: Math.round(85 + Math.random() * 10),
        rationale: "Morning commute and breakfast browsing - high engagement",
      },
      {
        platform: "TikTok",
        day: "Sunday",
        time: "18:00-21:00 UTC",
        engagement: Math.round(82 + Math.random() * 12),
        rationale: "Sunday evening relaxation - peak content consumption",
      },
      {
        platform: "Instagram",
        day: "Monday-Thursday",
        time: "11:00-13:00 UTC",
        engagement: Math.round(72 + Math.random() * 15),
        rationale: "Lunch break browsing - high story engagement",
      },
      {
        platform: "Blog",
        day: "Tuesday-Thursday",
        time: "08:00-10:00 UTC",
        engagement: Math.round(70 + Math.random() * 15),
        rationale: "Morning work hours - professional audience reading time",
      },
    ]

    return slots
  }

  async getViralOpportunities(niche: string): Promise<ViralOpportunity[]> {
    const now = new Date()
    const opportunities: ViralOpportunity[] = []

    const topics = [
      `${niche} trends for ${now.getFullYear()}`,
      `Best ${niche} tools and resources`,
      `${niche} mistakes to avoid`,
      `Future of ${niche}: predictions for ${now.getFullYear() + 1}`,
      `${niche} case studies that will inspire you`,
      `${niche} for beginners: complete guide`,
    ]

    for (let i = 0; i < 4; i++) {
      const windowStart = new Date(now)
      windowStart.setDate(windowStart.getDate() + 3 + i * 7)

      const peakDate = new Date(windowStart)
      peakDate.setDate(peakDate.getDate() + 2 + Math.floor(Math.random() * 5))

      const prepDate = new Date(windowStart)
      prepDate.setDate(prepDate.getDate() - 3)

      opportunities.push({
        window: `${windowStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${peakDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
        topic: topics[i % topics.length],
        predictedPeak: peakDate.toISOString().split("T")[0],
        estimatedTraffic: `${Math.round(5000 + Math.random() * 95000).toLocaleString()} - ${Math.round(100000 + Math.random() * 400000).toLocaleString()} views`,
        preparationDeadline: prepDate.toISOString().split("T")[0],
        confidence: Math.round(60 + Math.random() * 35),
      })
    }

    return opportunities
  }

  async getForecast(niche: string, days = 14): Promise<ForecastDay[]> {
    const forecast: ForecastDay[] = []
    const now = new Date()
    let baseTraffic = 1000 + Math.random() * 4000

    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)

      const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.0
      const noise = (Math.random() - 0.5) * 0.4
      const trend = 1 + i * 0.02

      baseTraffic = baseTraffic * (1 + noise) * trend * weekendFactor
      const traffic = Math.round(baseTraffic)

      const topics = [
        `${niche} basics everyone should know`,
        `Advanced ${niche} strategies`,
        `${niche} tools comparison`,
        `Why ${niche} matters in ${now.getFullYear()}`,
        `${niche} success stories`,
        `Common ${niche} myths debunked`,
        `${niche} future predictions`,
        `${niche} expert roundup`,
      ]

      forecast.push({
        date: date.toISOString().split("T")[0],
        predictedTraffic: traffic,
        trend:
          i > 0 && traffic > forecast[i - 1].predictedTraffic
            ? "up"
            : i > 0 && traffic < forecast[i - 1].predictedTraffic
              ? "down"
              : "stable",
        topic: topics[i % topics.length],
      })
    }

    return forecast
  }

  private getBestTimeForDay(day: string, platform: string): { time: string } {
    const isWeekend = day === "Saturday" || day === "Sunday"

    const timeMap: Record<string, string[]> = {
      YouTube: isWeekend ? ["09:00", "11:00", "15:00"] : ["14:00", "16:00", "20:00"],
      TikTok: isWeekend ? ["10:00", "19:00"] : ["07:00", "12:00", "18:00"],
      Instagram: isWeekend ? ["09:00", "17:00"] : ["11:00", "13:00", "17:00"],
      Blog: isWeekend ? ["08:00"] : ["06:00", "08:00", "12:00"],
    }

    const times = timeMap[platform] || ["12:00"]
    const time = times[Math.floor(Math.random() * times.length)]
    return { time }
  }

  private generateContentTitle(niche: string, type: string, index: number): string {
    const titles: Record<string, string[]> = {
      Tutorial: [
        `How to Master ${this.capitalize(niche)}: Step-by-Step Guide`,
        `${this.capitalize(niche)} Tutorial for Beginners`,
        `Advanced ${this.capitalize(niche)} Techniques You Need to Know`,
      ],
      Listicle: [
        `10 ${this.capitalize(niche)} Tips That Will Change Everything`,
        `5 ${this.capitalize(niche)} Mistakes Costing You Success`,
        `Top 7 ${this.capitalize(niche)} Resources for 2024`,
      ],
      Review: [
        `${this.capitalize(niche)}: Comprehensive Review and Analysis`,
        `Is ${this.capitalize(niche)} Worth It? An Honest Review`,
        `Best ${this.capitalize(niche)} Tools Compared`,
      ],
      "How-To Guide": [
        `Complete ${this.capitalize(niche)} Guide: From Zero to Hero`,
        `The Ultimate ${this.capitalize(niche)} Playbook`,
        `${this.capitalize(niche)} 101: Everything You Need`,
      ],
    }

    const possible = titles[type] || [
      `${this.capitalize(niche)}: What You Need to Know`,
      `${this.capitalize(niche)} Insights and Strategies`,
    ]

    return possible[index % possible.length]
  }

  private generateTags(niche: string, contentType: string): string[] {
    const base = [niche.toLowerCase(), niche.toLowerCase() + " tips", niche.toLowerCase() + " guide"]
    const typeTags = [contentType.toLowerCase(), contentType.toLowerCase() + " " + niche.toLowerCase()]
    const extras = ["trending", "viral", "how to", "tutorial", "beginner", "advanced"]

    const tags = [...base, ...typeTags]
    for (let i = 0; i < 3; i++) {
      tags.push(extras[Math.floor(Math.random() * extras.length)])
    }

    return [...new Set(tags)]
  }

  private getContentNote(type: string, niche: string, index: number): string {
    const notes = [
      `Focus on ${niche} fundamentals - keep it accessible for beginners`,
      `Include real-world examples and case studies about ${niche}`,
      `Add data visualizations and statistics to support ${niche} claims`,
      `Create a compelling hook addressing common ${niche} pain points`,
      `End with actionable takeaways viewers can apply to ${niche}`,
      `Use storytelling to make ${niche} concepts more relatable`,
    ]
    return notes[index % notes.length]
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
}

export const contentCalendar = new ContentCalendar()
