import { clamp, average, generateId } from "./utils"

interface HookAnalysis {
  hookSpeed: number
  hookType: string
  effectiveness: number
  suggestion: string
}

interface PacingAnalysis {
  overall: number
  sceneChanges: number
  informationDensity: number
  energyCurve: string
  suggestion: string
}

interface RetentionAnalysis {
  predictedRetention: number
  dropOffPoints: { second: number; probability: number }[]
  optimalLength: number
  replayProbability: number
}

interface EmotionalImpact {
  curiosity: number
  surprise: number
  excitement: number
  trust: number
  urgency: number
  dominant: string
}

interface ShortsAnalysis {
  hook: HookAnalysis
  pacing: PacingAnalysis
  retention: RetentionAnalysis
  emotionalImpact: EmotionalImpact
  viralStructure: {
    usesPatternInterrupt: boolean
    hasLoopableEnding: boolean
    textOverlayEffectiveness: number
    audioSync: number
  }
  overallScore: number
  recommendations: string[]
}

interface GeneratedHook {
  text: string
  type: string
  predictedCTR: number
  length: number
}

export class ShortsAnalyzer {
  async analyze(topic: string): Promise<ShortsAnalysis> {
    const hook = this.analyzeHook(topic)
    const pacing = this.analyzePacing()
    const retention = this.analyzeRetention()
    const emotionalImpact = this.analyzeEmotionalImpact(topic)

    const viralStructure = {
      usesPatternInterrupt: Math.random() > 0.3,
      hasLoopableEnding: Math.random() > 0.4,
      textOverlayEffectiveness: Math.round(clamp(50 + Math.random() * 40, 0, 100)),
      audioSync: Math.round(clamp(40 + Math.random() * 50, 0, 100)),
    }

    const overallScore = Math.round(
      hook.effectiveness * 0.3 +
      pacing.overall * 0.25 +
      retention.predictedRetention * 0.25 +
      emotionalImpact.curiosity * 0.2
    )

    return {
      hook,
      pacing,
      retention,
      emotionalImpact,
      viralStructure,
      overallScore,
      recommendations: this.getRecommendations(hook, pacing, retention, viralStructure),
    }
  }

  analyzeHook(topic: string): HookAnalysis {
    const lower = topic.toLowerCase()
    const hookSpeed = Math.round(clamp(60 + Math.random() * 35, 0, 100))
    const questionWords = ["how", "what", "why", "where", "when", "do you", "did you", "are you"]
    const commandWords = ["stop", "watch", "look", "try", "imagine", "guess", "never"]

    let hookType = "statement"
    if (questionWords.some((w) => lower.includes(w))) hookType = "question"
    else if (commandWords.some((w) => lower.includes(w))) hookType = "command"
    else if (/[0-9]/.test(lower)) hookType = "number"

    let effectiveness = 50
    if (hookType === "question") effectiveness += 25
    else if (hookType === "command") effectiveness += 20
    else if (hookType === "number") effectiveness += 15

    if (hookSpeed > 70) effectiveness += 10

    effectiveness = Math.round(clamp(effectiveness, 0, 100))

    return {
      hookSpeed,
      hookType: hookType as "question" | "command" | "number" | "statement",
      effectiveness,
      suggestion: this.getHookSuggestion(hookType as string, effectiveness),
    }
  }

  analyzePacing(): PacingAnalysis {
    const sceneChanges = Math.round(2 + Math.random() * 6)
    const informationDensity = Math.round(clamp(40 + Math.random() * 45, 0, 100))

    let overall = 50
    if (sceneChanges >= 3 && sceneChanges <= 7) overall += 25
    else if (sceneChanges < 3) overall += 10
    else overall += 15

    if (informationDensity > 40 && informationDensity < 80) overall += 15
    else if (informationDensity >= 80) overall += 5

    const curveOptions = ["Rising", "Wavy", "Steady", "Climactic"]
    const energyCurve = curveOptions[Math.floor(Math.random() * curveOptions.length)]

    return {
      overall: Math.round(clamp(overall, 0, 100)),
      sceneChanges,
      informationDensity,
      energyCurve,
      suggestion: `Aim for 3-7 scene changes in a 60-second short with ${energyCurve.toLowerCase()} energy curve for optimal retention`,
    }
  }

  analyzeRetention(): RetentionAnalysis {
    const predictedRetention = Math.round(clamp(50 + Math.random() * 35, 0, 100))
    const replayProbability = Math.round(clamp(15 + Math.random() * 50, 0, 100))
    const optimalLength = Math.round(clamp(30 + (100 - predictedRetention) * 0.5, 15, 60))

    const dropOffPoints = [
      { second: 3, probability: Math.round(10 + Math.random() * 20) },
      { second: 8, probability: Math.round(15 + Math.random() * 15) },
      { second: 15, probability: Math.round(20 + Math.random() * 15) },
      { second: 25, probability: Math.round(10 + Math.random() * 15) },
      { second: 40, probability: Math.round(5 + Math.random() * 10) },
    ]

    return { predictedRetention, dropOffPoints, optimalLength, replayProbability }
  }

  analyzeEmotionalImpact(topic: string): EmotionalImpact {
    const lower = topic.toLowerCase()
    const emotions = {
      curiosity: Math.round(clamp(50 + Math.random() * 40, 0, 100)),
      surprise: Math.round(clamp(30 + Math.random() * 50, 0, 100)),
      excitement: Math.round(clamp(40 + Math.random() * 45, 0, 100)),
      trust: Math.round(clamp(30 + Math.random() * 35, 0, 100)),
      urgency: Math.round(clamp(20 + Math.random() * 50, 0, 100)),
    }

    if (lower.includes("secret") || lower.includes("hidden") || lower.includes("truth")) {
      emotions.curiosity = Math.min(100, emotions.curiosity + 20)
    }
    if (lower.includes("shocking") || lower.includes("crazy") || lower.includes("unbelievable")) {
      emotions.surprise = Math.min(100, emotions.surprise + 20)
    }
    if (lower.includes("best") || lower.includes("top") || lower.includes("amazing")) {
      emotions.excitement = Math.min(100, emotions.excitement + 15)
    }

    const dominant = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0][0]

    return { ...emotions, dominant }
  }

  async generateHooks(topic: string, count = 5): Promise<GeneratedHook[]> {
    const hooks: GeneratedHook[] = []
    const templates = [
      { template: `You won't believe what ${topic} can do...`, type: "curiosity gap" },
      { template: `${topic} is NOT what you think`, type: "twist" },
      { template: `Stop doing ${topic} wrong — watch this`, type: "command" },
      { template: `How ${topic} actually works (simple explanation)`, type: "how-to" },
      { template: `I tried ${topic} for 30 days and this happened`, type: "experiment" },
      { template: `What nobody tells you about ${topic}`, type: "secret" },
      { template: `The ${topic} secret that changed everything`, type: "curiosity gap" },
      { template: `${topic} experts don't want you to know this`, type: "forbidden knowledge" },
      { template: `This ${topic} hack will save you hours`, type: "value" },
      { template: `Why everyone is talking about ${topic} right now`, type: "trending" },
    ]

    const shuffled = [...templates].sort(() => Math.random() - 0.5)
    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const t = shuffled[i]
      const hookText = t.template
      hooks.push({
        text: hookText,
        type: t.type,
        predictedCTR: Math.round(clamp(35 + Math.random() * 50, 0, 100)),
        length: hookText.length,
      })
    }

    return hooks.sort((a, b) => b.predictedCTR - a.predictedCTR)
  }

  private getHookSuggestion(type: string, effectiveness: number): string {
    if (effectiveness >= 80) return "Hook is strong - leads with curiosity and value proposition"
    if (type === "statement") {
      return "Convert to a question or command for higher engagement — statements have 40% lower retention"
    }
    if (effectiveness >= 60) {
      return "Good hook — consider adding a pattern interrupt in the first 3 seconds"
    }
    return "Open with a surprising fact or provocative question to capture attention immediately"
  }

  private getRecommendations(
    hook: HookAnalysis,
    pacing: PacingAnalysis,
    retention: RetentionAnalysis,
    viralStructure: { usesPatternInterrupt: boolean; hasLoopableEnding: boolean; textOverlayEffectiveness: number; audioSync: number }
  ): string[] {
    const recs: string[] = []

    if (hook.effectiveness < 60) {
      recs.push("Rewrite hook to start with a question or surprising statement within the first 1-2 seconds")
    }
    if (pacing.sceneChanges < 3) {
      recs.push("Add more scene changes (aim for 4-6 in 60 seconds) to maintain visual interest")
    }
    if (retention.predictedRetention < 60) {
      recs.push(`Shorten video to ${retention.optimalLength}s to match viewer attention span`)
    }
    if (!viralStructure.usesPatternInterrupt) {
      recs.push("Add a pattern interrupt (visual cut, text pop-up, or sound effect) within first 3 seconds")
    }
    if (!viralStructure.hasLoopableEnding) {
      recs.push("Create a loopable ending to encourage replay views and boost retention metrics")
    }
    if (viralStructure.textOverlayEffectiveness < 50) {
      recs.push("Add bold, high-contrast text overlays with 3-5 words max for silent viewing")
    }
    if (viralStructure.audioSync < 40) {
      recs.push("Sync scene changes to the beat of background music for professional feel")
    }
    recs.push("Keep the first 3 seconds information-dense — viewers decide to stay or scroll in that window")

    return recs
  }
}

export const shortsAnalyzer = new ShortsAnalyzer()
