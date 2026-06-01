import { generateId, sleep } from "./utils"

interface ParsedCommand {
  type: string
  raw: string
  confidence: number
  params: Record<string, string>
  timestamp: number
}

type CommandHandler = (command: ParsedCommand) => Promise<any> | any

interface CommandMapping {
  patterns: RegExp[]
  handler: CommandHandler
}

export class VoiceCommandSystem {
  private recognition: any = null
  private synthesis: SpeechSynthesis | null = null
  private isListening = false
  private commandMap = new Map<string, CommandMapping>()
  private isAvailable = false
  private onResultCallback: ((command: ParsedCommand) => void) | null = null

  constructor() {
    this.checkAvailability()
    this.registerDefaultCommands()
  }

  private checkAvailability(): void {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    this.isAvailable = !!SpeechRecognition || !!("speechSynthesis" in window)

    if ("speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis
    }

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = "en-US"
    }
  }

  private registerDefaultCommands(): void {
    this.registerCommand("find_viral_niches", [
      /find\s+viral\s+niches?/i,
      /discover\s+viral\s+niches?/i,
      /what'?s?\s+viral\s+now/i,
      /show\s+me\s+viral\s+(trends|niches)/i,
    ], async (cmd) => ({
      type: "find_viral_niches",
      action: "search_viral",
      params: { query: cmd.raw },
      confidence: cmd.confidence,
    }))

    this.registerCommand("analyze_competitor", [
      /analyze\s+(competitor|channel)\s+(.+)/i,
      /spy\s+on\s+(.+)/i,
      /check\s+(out\s+)?(this\s+)?channel\s+(.+)/i,
    ], async (cmd) => ({
      type: "analyze_competitor",
      action: "analyze_channel",
      params: { target: cmd.params.target || cmd.raw },
      confidence: cmd.confidence,
    }))

    this.registerCommand("detect_keywords", [
      /(find|detect|extract)\s+keywords\s+(from|for)\s+(.+)/i,
      /what\s+keywords?\s+(should\s+I\s+)?(use|target)/i,
      /suggest\s+keywords?\s+for\s+(.+)/i,
    ], async (cmd) => ({
      type: "detect_keywords",
      action: "keyword_discovery",
      params: { topic: cmd.params.topic || cmd.raw },
      confidence: cmd.confidence,
    }))

    this.registerCommand("show_trends", [
      /show\s+(me\s+)?(the\s+)?trends?/i,
      /what'?s?\s+trending/i,
      /trending\s+(now|today|this\s+week)/i,
      /get\s+trending/i,
    ], async () => ({
      type: "show_trends",
      action: "fetch_trends",
      params: {},
      confidence: 0.8,
    }))

    this.registerCommand("analyze_page", [
      /analyze\s+(this\s+)?page/i,
      /scan\s+(this\s+)?page/i,
      /what\s+do\s+you\s+think\s+about\s+this/i,
    ], async () => ({
      type: "analyze_page",
      action: "page_scan",
      params: {},
      confidence: 0.75,
    }))

    this.registerCommand("generate_content", [
      /generate\s+(content|ideas?|topics?)\s+(for|about)\s+(.+)/i,
      /create\s+(content|a\s+video|a\s+post)\s+(about|for)\s+(.+)/i,
      /give\s+me\s+content\s+ideas?\s+(for|about)\s+(.+)/i,
    ], async (cmd) => ({
      type: "generate_content",
      action: "content_gen",
      params: { topic: cmd.params.topic || cmd.raw },
      confidence: cmd.confidence,
    }))
  }

  registerCommand(type: string, patterns: RegExp[], handler: CommandHandler): void {
    this.commandMap.set(type, { patterns, handler })
  }

  private matchCommand(text: string): { type: string; confidence: number; params: Record<string, string> } | null {
    let bestMatch: { type: string; confidence: number; params: Record<string, string> } | null = null

    for (const [type, mapping] of this.commandMap.entries()) {
      for (const pattern of mapping.patterns) {
        const match = text.match(pattern)
        if (match) {
          const matchLen = match[0].length
          const confidence = Math.min(1, matchLen / text.length + 0.2)
          const params: Record<string, string> = {}
          if (match[2]) params.target = match[2].trim()
          if (match[3]) params.topic = match[3].trim()
          if (match[4]) params.topic = match[4].trim()

          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = { type, confidence, params }
          }
        }
      }
    }

    return bestMatch
  }

  async startListening(): Promise<ParsedCommand | null> {
    if (!this.isAvailable) {
      throw new Error("Speech recognition is not available in this browser")
    }

    if (!this.recognition) {
      throw new Error("SpeechRecognition API not found")
    }

    this.isListening = true

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error("SpeechRecognition not available"))
        return
      }

      this.recognition.onresult = async (event: any) => {
        this.isListening = false
        const transcript = event.results[0][0].transcript
        try {
          const command = await this.processCommand(transcript)
          if (this.onResultCallback && command) {
            this.onResultCallback(command)
          }
          resolve(command)
        } catch (e) {
          reject(e)
        }
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      try {
        this.recognition.start()
      } catch (e) {
        this.isListening = false
        reject(e)
      }
    })
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop()
      } catch {
        // already stopped
      }
    }
    this.isListening = false
  }

  async processCommand(text: string): Promise<ParsedCommand | null> {
    const match = this.matchCommand(text)
    if (!match) return null

    const parsed: ParsedCommand = {
      type: match.type,
      raw: text,
      confidence: match.confidence,
      params: match.params,
      timestamp: Date.now(),
    }

    const mapping = this.commandMap.get(match.type)
    if (mapping) {
      const result = await mapping.handler(parsed)
      return { ...parsed, ...result }
    }

    return parsed
  }

  speakResponse(text: string): void {
    if (!this.synthesis) return

    this.synthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    const voices = this.synthesis.getVoices()
    const preferred = voices.find((v) => v.lang.startsWith("en") && v.name.includes("Female"))
    if (preferred) utterance.voice = preferred

    this.synthesis.speak(utterance)
  }

  onResult(callback: (command: ParsedCommand) => void): void {
    this.onResultCallback = callback
  }

  get listening(): boolean {
    return this.isListening
  }

  get available(): boolean {
    return this.isAvailable
  }
}

export const voiceCommands = new VoiceCommandSystem()
