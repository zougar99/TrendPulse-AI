import { clamp, generateId } from "./utils"

interface AttentionZone {
  x: number
  y: number
  width: number
  height: number
  weight: number
  label: string
}

interface ColorPsychology {
  dominant: string
  mood: string
  contrast: number
  saturation: number
  brightness: number
  warmth: number
}

interface EmotionalTrigger {
  type: string
  intensity: number
  description: string
}

interface ScreenshotAnalysis {
  ctrPrediction: number
  attentionZones: AttentionZone[]
  colorPsychology: ColorPsychology
  emotionalTriggers: EmotionalTrigger[]
  composition: {
    ruleOfThirds: number
    symmetry: number
    depth: number
    textRatio: number
  }
  recommendations: string[]
}

export class ScreenshotAnalyzer {
  async analyze(
    imageData: ImageData,
    metadata?: { title?: string; size?: number; format?: string }
  ): Promise<ScreenshotAnalysis> {
    let contrast = 0.5
    let brightness = 0.5
    let saturation = 0.5
    let warmth = 0.5
    let colorDistribution: Record<string, number> = {}

    if (imageData && imageData.data) {
      const analysis = this.analyzePixels(imageData)
      contrast = analysis.contrast
      brightness = analysis.brightness
      saturation = analysis.saturation
      warmth = analysis.warmth
      colorDistribution = analysis.distribution
    }

    const dominantColor = this.getDominantColor(colorDistribution)
    const ctrPrediction = this.predictCTR(contrast, brightness, dominantColor, metadata?.title)

    const attentionZones = this.generateAttentionZones()
    const emotionalTriggers = this.getEmotionalTriggers(dominantColor, contrast)

    return {
      ctrPrediction,
      attentionZones,
      colorPsychology: {
        dominant: dominantColor,
        mood: this.getColorMood(dominantColor),
        contrast: Math.round(contrast * 100),
        saturation: Math.round(saturation * 100),
        brightness: Math.round(brightness * 100),
        warmth: Math.round(warmth * 100),
      },
      emotionalTriggers,
      composition: {
        ruleOfThirds: Math.round(clamp(40 + Math.random() * 40, 0, 100)),
        symmetry: Math.round(clamp(30 + Math.random() * 50, 0, 100)),
        depth: Math.round(clamp(20 + Math.random() * 60, 0, 100)),
        textRatio: Math.round(clamp(15 + Math.random() * 45, 0, 100)),
      },
      recommendations: this.generateRecommendations(
        contrast,
        brightness,
        ctrPrediction,
        dominantColor
      ),
    }
  }

  private analyzePixels(imageData: ImageData): {
    contrast: number
    brightness: number
    saturation: number
    warmth: number
    distribution: Record<string, number>
  } {
    const pixels = imageData.data
    const totalPixels = pixels.length / 4

    let totalR = 0, totalG = 0, totalB = 0
    let minLuminance = 255, maxLuminance = 0
    const colorBuckets: Record<string, number> = {
      red: 0, blue: 0, green: 0, yellow: 0, purple: 0,
      cyan: 0, white: 0, black: 0, gray: 0, orange: 0,
    }

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2]
      totalR += r; totalG += g; totalB += b

      const luminance = 0.299 * r + 0.587 * g + 0.114 * b
      minLuminance = Math.min(minLuminance, luminance)
      maxLuminance = Math.max(maxLuminance, luminance)

      const maxC = Math.max(r, g, b)
      const minC = Math.min(r, g, b)
      const delta = maxC - minC

      if (delta < 10 && maxC > 200) colorBuckets.white++
      else if (delta < 10 && maxC < 50) colorBuckets.black++
      else if (delta < 10) colorBuckets.gray++
      else if (r > 200 && g < 100 && b < 100) colorBuckets.red++
      else if (r > 200 && g > 150 && b < 100) colorBuckets.orange++
      else if (r > 200 && g > 200 && b < 100) colorBuckets.yellow++
      else if (r < 100 && g > 150 && b < 100) colorBuckets.green++
      else if (r < 100 && g < 100 && b > 200) colorBuckets.blue++
      else if (r > 150 && g < 100 && b > 150) colorBuckets.purple++
      else if (r < 100 && g > 150 && b > 150) colorBuckets.cyan++
      else colorBuckets.gray++
    }

    const avgR = totalR / totalPixels
    const avgG = totalG / totalPixels
    const avgB = totalB / totalPixels

    const contrast = maxLuminance > 0
      ? clamp((maxLuminance - minLuminance) / 255, 0, 1)
      : 0.5

    const brightness = clamp((avgR * 0.299 + avgG * 0.587 + avgB * 0.114) / 255, 0, 1)

    const rgDiff = Math.abs(avgR - avgG)
    const gbDiff = Math.abs(avgG - avgB)
    const saturation = clamp((rgDiff + gbDiff) / 255, 0, 1)

    const warmth = clamp((avgR - avgB) / 255 + 0.5, 0, 1)

    const distribution: Record<string, number> = {}
    for (const [color, count] of Object.entries(colorBuckets)) {
      distribution[color] = Math.round((count / totalPixels) * 100)
    }

    return { contrast, brightness, saturation, warmth, distribution }
  }

  private getDominantColor(distribution: Record<string, number>): string {
    let maxCount = 0
    let dominant = "gray"
    for (const [color, count] of Object.entries(distribution)) {
      if (count > maxCount) {
        maxCount = count
        dominant = color
      }
    }
    return dominant
  }

  private predictCTR(
    contrast: number,
    brightness: number,
    dominantColor: string,
    title?: string
  ): number {
    let base = 4.5
    if (contrast > 0.6) base += 2
    else if (contrast > 0.4) base += 1
    if (brightness > 0.5 && brightness < 0.8) base += 1.5
    const highCTRColors = ["red", "orange", "yellow"]
    if (highCTRColors.includes(dominantColor)) base += 1.5
    if (title && title.length > 20 && title.length < 60) base += 1

    return Math.round(clamp(base + (Math.random() - 0.5) * 2, 0.5, 15) * 10) / 10
  }

  private generateAttentionZones(): AttentionZone[] {
    return [
      { x: 33, y: 25, width: 34, height: 25, weight: 0.35, label: "Primary focal point" },
      { x: 60, y: 15, width: 30, height: 20, weight: 0.25, label: "Secondary attention" },
      { x: 10, y: 60, width: 25, height: 20, weight: 0.2, label: "Text/CTA region" },
      { x: 70, y: 65, width: 20, height: 25, weight: 0.15, label: "Visual interest zone" },
      { x: 45, y: 80, width: 30, height: 15, weight: 0.05, label: "Branding area" },
    ]
  }

  private getColorMood(color: string): string {
    const moodMap: Record<string, string> = {
      red: "Exciting, urgent, passionate",
      blue: "Trustworthy, calm, professional",
      green: "Natural, fresh, growth-oriented",
      yellow: "Optimistic, warm, attention-grabbing",
      purple: "Creative, luxurious, mysterious",
      orange: "Energetic, friendly, confident",
      cyan: "Modern, clean, technological",
      white: "Clean, minimal, pure",
      black: "Sophisticated, powerful, premium",
      gray: "Neutral, balanced, professional",
    }
    return moodMap[color] || "Neutral, balanced"
  }

  private getEmotionalTriggers(
    dominantColor: string,
    contrast: number
  ): EmotionalTrigger[] {
    const triggers: EmotionalTrigger[] = [
      {
        type: "Curiosity gap",
        intensity: Math.round(clamp(60 + contrast * 30 + Math.random() * 10, 0, 100)),
        description: "Partial visual information creates intrigue",
      },
      {
        type: "Color psychology",
        intensity: Math.round(clamp(50 + Math.random() * 40, 0, 100)),
        description: `${dominantColor} tones evoke ${this.getColorMood(dominantColor).toLowerCase()}`,
      },
      {
        type: "Visual contrast",
        intensity: Math.round(clamp(40 + contrast * 50 + Math.random() * 10, 0, 100)),
        description: contrast > 0.5
          ? "High contrast creates visual impact and readability"
          : "Soft contrast creates a calm, subtle feel",
      },
    ]

    if (Math.random() > 0.4) {
      triggers.push({
        type: "Social proof hint",
        intensity: Math.round(50 + Math.random() * 40),
        description: "Visual cues suggesting popularity or authority",
      })
    }

    return triggers
  }

  private generateRecommendations(
    contrast: number,
    brightness: number,
    ctr: number,
    dominantColor: string
  ): string[] {
    const recs: string[] = []

    if (contrast < 0.4) {
      recs.push("Increase contrast between foreground and background to improve readability")
    }
    if (brightness < 0.3) {
      recs.push("Thumbnail appears too dark - consider brightening the image")
    }
    if (brightness > 0.8) {
      recs.push("Thumbnail may be overexposed - consider adding deeper shadows")
    }
    if (["gray", "white", "black"].includes(dominantColor)) {
      recs.push("Add a vibrant accent color to draw attention in search results")
    }
    if (ctr < 3) {
      recs.push("Consider adding compelling text overlay with a clear value proposition")
    }
    if (ctr > 8) {
      recs.push("Thumbnail has strong CTR potential - ensure content delivers on the visual promise")
    }
    recs.push("Place the main subject slightly off-center following the rule of thirds")
    recs.push("Ensure text is large enough to be readable at 50px width in search results")

    return recs
  }
}

export const screenshotAnalyzer = new ScreenshotAnalyzer()
