import { clamp, generateId } from "./utils"

interface NicheIdea {
  title: string
  description: string
  targetAudience: string
  contentFormat: string
  difficulty: "Easy" | "Medium" | "Hard"
  potential: number
  estimatedViews: string
  monetizationAngle: string
}

interface ScriptSection {
  timestamp: string
  visual: string
  script: string
  duration: number
}

interface GeneratedScript {
  title: string
  sections: ScriptSection[]
  totalDuration: number
  tone: string
  hook: string
  callToAction: string
}

interface StockIdea {
  category: string
  searchTerms: string[]
  mood: string
  duration: string
  license: string
}

interface AvatarConcept {
  name: string
  style: string
  description: string
  voiceType: string
  useCase: string
}

export class FacelessContent {
  async generateNiche(keyword: string): Promise<NicheIdea[]> {
    const lower = keyword.toLowerCase()
    const ideas: NicheIdea[] = []

    const templates = [
      {
        title: `The Ultimate Guide to ${this.capitalize(keyword)} in 2024`,
        desc: `A comprehensive faceless video covering everything about ${keyword}. Use stock footage, screen recordings, and animated infographics to deliver value without showing your face.`,
        audience: `People searching for ${keyword} who want in-depth knowledge`,
        format: "Tutorial / Guide",
        difficulty: "Medium" as const,
        views: "10K-50K",
        monetization: "Affiliate links for related tools + AdSense",
      },
      {
        title: `10 Mind-Blowing ${this.capitalize(keyword)} Facts You Didn't Know`,
        desc: `Countdown-style video featuring surprising facts about ${keyword}. Perfect for faceless content - use stock footage, text overlays, and background music.`,
        audience: `Curious viewers interested in ${keyword} trivia`,
        format: "Listicle / Countdown",
        difficulty: "Easy" as const,
        views: "50K-200K",
        monetization: "High RPM from AdSense + Sponsorships",
      },
      {
        title: `How ${this.capitalize(keyword)} Is Changing Everything (Explained)`,
        desc: `Deep dive documentary-style video explaining the impact of ${keyword}. Use cinematic stock footage, data visualizations, and AI voiceover.`,
        audience: `Viewers wanting to understand ${keyword}'s broader impact`,
        format: "Documentary / Explainier",
        difficulty: "Hard" as const,
        views: "100K-500K",
        monetization: "Premium AdSense + Course/Product funnel",
      },
      {
        title: `The Truth About ${this.capitalize(keyword)} Nobody Talks About`,
        desc: `Controversial or eye-opening perspective on ${keyword}. Uses hidden truths and surprising revelations to drive engagement.`,
        audience: `Skeptical viewers looking for honest information about ${keyword}`,
        format: "Opinion / Commentary",
        difficulty: "Medium" as const,
        views: "20K-100K",
        monetization: "Viral growth → Affiliate + Digital products",
      },
      {
        title: `${this.capitalize(keyword)}: Beginner's Guide to Getting Started`,
        desc: `Step-by-step beginner tutorial for ${keyword}. Screen recordings, simple explanations, and actionable advice.`,
        audience: `Absolute beginners wanting to start with ${keyword}`,
        format: "Tutorial",
        difficulty: "Easy" as const,
        views: "5K-30K",
        monetization: "Lead magnet → Email list → Course sales",
      },
    ]

    return templates.map((t) => ({
      title: t.title,
      description: t.desc,
      targetAudience: t.audience,
      contentFormat: t.format,
      difficulty: t.difficulty,
      potential: Math.round(clamp(40 + Math.random() * 50, 0, 100)),
      estimatedViews: t.views,
      monetizationAngle: t.monetization,
    }))
  }

  async generateScript(keyword: string, duration = 60): Promise<GeneratedScript> {
    const numSections = Math.max(3, Math.floor(duration / 12))
    const sectionDuration = Math.floor(duration / numSections)

    const sections: ScriptSection[] = []
    for (let i = 0; i < numSections; i++) {
      const minutes = Math.floor((i * sectionDuration) / 60)
      const seconds = (i * sectionDuration) % 60
      const timestamp = `${minutes}:${seconds.toString().padStart(2, "0")}`

      sections.push({
        timestamp,
        visual: this.getRandomVisual(keyword, i),
        script: this.getRandomScriptSegment(keyword, i, numSections),
        duration: sectionDuration,
      })
    }

    const hooks = [
      `Did you know that ${keyword} is completely changing how we think about...`,
      `If you're serious about ${keyword}, you NEED to watch this...`,
      `I couldn't believe what I discovered about ${keyword}...`,
      `Stop wasting time — here's what actually works for ${keyword}...`,
      `This one ${keyword} secret will blow your mind...`,
    ]

    const ctas = [
      `If you found this helpful, make sure to subscribe for more ${keyword} content!`,
      `Like this video? Share it with someone who needs to know about ${keyword}!`,
      `Comment below: what's your biggest challenge with ${keyword}?`,
      `Follow for daily ${keyword} tips and strategies!`,
    ]

    return {
      title: `${this.capitalize(keyword)}: Everything You Need to Know`,
      sections,
      totalDuration: duration,
      tone: "Informative and engaging",
      hook: hooks[Math.floor(Math.random() * hooks.length)],
      callToAction: ctas[Math.floor(Math.random() * ctas.length)],
    }
  }

  async getStockIdeas(keyword: string): Promise<StockIdea[]> {
    const lower = keyword.toLowerCase()
    const moodOptions = ["professional", "cinematic", "energetic", "calm", "dramatic"]

    return [
      {
        category: "B-Roll",
        searchTerms: [`${lower} footage`, `${lower} stock video`, `${lower} 4k`],
        mood: moodOptions[Math.floor(Math.random() * moodOptions.length)],
        duration: "10-30 seconds",
        license: "Royalty-Free",
      },
      {
        category: "Background",
        searchTerms: [`${lower} background`, `${lower} abstract`, `${lower} animation`],
        mood: moodOptions[Math.floor(Math.random() * moodOptions.length)],
        duration: "30-60 seconds",
        license: "Royalty-Free",
      },
      {
        category: "Thumbnail",
        searchTerms: [`${lower} thumbnail`, `${lower} concept art`, `${lower} 3d render`],
        mood: "eye-catching",
        duration: "Static image",
        license: "Royalty-Free with attribution",
      },
      {
        category: "Transition",
        searchTerms: [`${lower} transition`, `smooth transition`, `motion graphics ${lower}`],
        mood: "smooth",
        duration: "1-3 seconds",
        license: "Royalty-Free",
      },
    ]
  }

  async getAvatarConcepts(keyword: string): Promise<AvatarConcept[]> {
    return [
      {
        name: "Expert Guide",
        style: "Professional 3D animated character",
        description: "A knowledgeable presenter avatar that explains complex topics with authority",
        voiceType: "Deep, authoritative male voice (ElevenLabs or similar)",
        useCase: "Educational content, tutorials, deep dives",
      },
      {
        name: "Energetic Host",
        style: "Stylized 2D cartoon character",
        description: "High-energy animated character with expressive animations and vibrant colors",
        voiceType: "Upbeat, energetic female voice",
        useCase: "Entertainment, listicles, reaction-style content",
      },
      {
        name: "Minimalist Narrator",
        style: "Simple abstract avatar with motion graphics",
        description: "Clean, modern aesthetic with subtle animations - keeps focus on content",
        voiceType: "Calm, neutral AI voice (ElevenLabs or WellSaid)",
        useCase: "Documentary-style, storytelling, explainers",
      },
      {
        name: "Tech Analyst",
        style: "Futuristic digital avatar with HUD overlays",
        description: "Cyberpunk-inspired avatar displaying data, charts, and analytics",
        voiceType: "Clear, precise neutral voice",
        useCase: "Tech reviews, data analysis, finance content",
      },
    ]
  }

  private capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  private getRandomVisual(keyword: string, index: number): string {
    const visuals = [
      `Stock footage of ${keyword} in action`,
      `Animated infographic explaining ${keyword} concepts`,
      `Screen recording demonstrating ${keyword} tools`,
      `Split-screen comparison related to ${keyword}`,
      `Motion graphics with ${keyword} statistics and data`,
      `Cinematic b-roll illustrating ${keyword} impact`,
      `3D visualization of ${keyword} processes`,
      `${keyword} timeline showing evolution and trends`,
      `${keyword} examples with text overlays and annotations`,
      `${keyword} case study visualization`,
    ]
    return visuals[index % visuals.length]
  }

  private getRandomScriptSegment(
    keyword: string,
    index: number,
    total: number
  ): string {
    const segments = [
      `When we look at ${keyword}, the first thing to understand is how it's transforming the landscape. Studies show that engagement with ${keyword} content has increased by over 300% in the last year alone.`,
      `Let's break down the key components of ${keyword}. First, consider how it addresses the core challenges that most people face. The data clearly shows that ${keyword} solves these problems more effectively than traditional approaches.`,
      `One of the most surprising findings about ${keyword} is how quickly it's being adopted across different industries. From small businesses to enterprise solutions, everyone is looking for ways to leverage ${keyword}.`,
      `Here's where most people get ${keyword} wrong. Instead of focusing on quantity, you need to prioritize quality and relevance. Let me show you what actually works based on real data and case studies.`,
      `The upcoming trends in ${keyword} are fascinating. Experts predict that within the next 12 months, we'll see major shifts in how ${keyword} is implemented and optimized for maximum results.`,
    ]

    if (index === 0) {
      return segments[0]
    } else if (index === total - 1) {
      return segments[segments.length - 1]
    }

    return segments[index % segments.length]
  }
}

export const facelessContent = new FacelessContent()
