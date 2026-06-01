import { ANALYSIS_THRESHOLDS } from "../../lib/constants"

export interface KeywordScore {
  keyword: string
  score: number
  competition: "Low" | "Medium" | "High"
  volume: number
  trend: "rising" | "stable" | "declining"
}

export interface SEOScore {
  total: number
  grade: string
  title: { score: number; notes: string[] }
  description: { score: number; notes: string[] }
  tags: { score: number; notes: string[] }
  thumbnail: { score: number; notes: string[] }
}

export interface ViralScore {
  viralScore: number
  momentum: number
  audienceFit: number
  competition: string
  probability: "Very High" | "High" | "Medium" | "Low"
  related: string[]
}

export function scoreKeyword(keyword: string): number {
  const words = keyword.toLowerCase().split(/\s+/)
  const wc = words.length
  let score = 50

  if (wc >= 4) score += 20
  else if (wc >= 3) score += 12
  else if (wc >= 2) score += 5
  else score -= 15

  if (keyword.length >= 30) score += 10
  else if (keyword.length >= 20) score += 5

  if (/\d/.test(keyword)) score += 8

  const questionWords = ["how", "what", "why", "where", "can", "does", "is"]
  const highValueWords = ["best", "top", "review", "buy", "cheap", "price", "vs", "compare"]
  const lowValueWords = ["free", "online", "download"]

  if (questionWords.some((w) => words.includes(w))) score += 10
  if (highValueWords.some((w) => words.includes(w))) score += 10
  if (lowValueWords.some((w) => words.includes(w))) score -= 8

  return Math.max(0, Math.min(100, score))
}

export function estimateCompetition(keyword: string): "Low" | "Medium" | "High" {
  const wc = keyword.toLowerCase().split(/\s+/).length
  let cs = 50

  if (wc <= 1) cs += 35
  else if (wc === 2) cs += 15
  else if (wc === 3) cs -= 5
  else if (wc >= 4) cs -= 20

  cs = Math.max(0, Math.min(100, cs))
  if (cs >= ANALYSIS_THRESHOLDS.COMPETITION_HIGH) return "High"
  if (cs >= ANALYSIS_THRESHOLDS.COMPETITION_MEDIUM) return "Medium"
  return "Low"
}

export function calculateSEOScore(params: {
  title: string
  description: string
  tags: string[]
  hasThumbnail?: boolean
}): SEOScore {
  const { title, description, tags, hasThumbnail = true } = params

  const titleScore = scoreKeyword(title)
  const titleNotes: string[] = []

  if (title.length >= 40 && title.length <= 70) {
    titleNotes.push("Ideal title length (40-70 chars)")
  } else if (title.length > 70) {
    titleNotes.push("Title is too long (>70 chars), may be truncated")
  } else {
    titleNotes.push("Title is too short, consider adding more keywords")
  }

  let descScore = 0
  const descNotes: string[] = []
  if (description.length >= 200) {
    descScore += 20
    descNotes.push("Good description length (200+ chars)")
  } else if (description.length >= 100) {
    descScore += 10
    descNotes.push("Description could be longer (aim for 200+ chars)")
  } else {
    descNotes.push("Description too short (aim for 200+ chars)")
  }

  if (title && description.toLowerCase().includes(title.toLowerCase())) {
    descScore += 10
    descNotes.push("Title keyword found in description")
  }

  let tagScore = 0
  const tagNotes: string[] = []
  if (tags.length >= 15) {
    tagScore += 20
    tagNotes.push(`${tags.length} tags (excellent)`)
  } else if (tags.length >= 10) {
    tagScore += 15
    tagNotes.push(`${tags.length} tags (good)`)
  } else if (tags.length >= 5) {
    tagScore += 8
    tagNotes.push(`${tags.length} tags (add more)`)
  } else {
    tagNotes.push(`Only ${tags.length} tags (need 10-20)`)
  }

  const tagChars = tags.join(", ").length
  if (tagChars > 500) {
    tagNotes.push(`Tags exceed 500 chars (${tagChars}), trim them`)
    tagScore -= 15
  }

  let thumbScore = 20
  const thumbNotes: string[] = []
  if (!hasThumbnail) {
    thumbScore = 0
    thumbNotes.push("No custom thumbnail detected")
  } else {
    thumbNotes.push("Custom thumbnail present (+20)")
  }

  const total = Math.max(
    0,
    Math.min(100, Math.round(titleScore * 0.3 + descScore + tagScore + thumbScore))
  )

  const grade =
    total >= 80 ? "A" : total >= 60 ? "B" : total >= 40 ? "C" : total >= 25 ? "D" : "F"

  return {
    total,
    grade,
    title: { score: titleScore, notes: titleNotes },
    description: { score: descScore, notes: descNotes },
    tags: { score: tagScore, notes: tagNotes },
    thumbnail: { score: thumbScore, notes: thumbNotes },
  }
}

export function calculateViralScore(keyword: string): ViralScore {
  const score = scoreKeyword(keyword)
  const comp = estimateCompetition(keyword)

  const viralScore = Math.min(100, score + 10)
  const momentum = Math.round(
    (100 - (comp === "Low" ? 50 : comp === "Medium" ? 70 : 90)) * 1.5
  )
  const audienceFit = Math.min(100, score + 15)

  let probability: "Very High" | "High" | "Medium" | "Low"
  if (viralScore >= 75) probability = "Very High"
  else if (viralScore >= 60) probability = "High"
  else if (viralScore >= 40) probability = "Medium"
  else probability = "Low"

  return {
    viralScore,
    momentum,
    audienceFit,
    competition: comp,
    probability,
    related: [],
  }
}
