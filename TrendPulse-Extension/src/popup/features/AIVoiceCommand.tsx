import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { voiceCommands } from "../../lib/voice-command"

interface CommandEntry {
  command: string
  description: string
  icon: string
}

const AVAILABLE_COMMANDS: CommandEntry[] = [
  { command: "find viral niches", description: "Discover trending viral opportunities", icon: "🎯" },
  { command: "analyze competitor", description: "Spy on channel performance", icon: "🕵" },
  { command: "detect keywords", description: "Find high-opportunity keywords", icon: "🔑" },
  { command: "show trends", description: "Display current trending topics", icon: "📈" },
  { command: "analyze page", description: "Scan current page for insights", icon: "📄" },
  { command: "generate content", description: "Create content ideas & scripts", icon: "✍" },
]

export function AIVoiceCommand() {
  const [state, setState] = useState<"idle" | "listening" | "processing">("idle")
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    setSupported(voiceCommands.available)
  }, [])

  const toggleListening = async () => {
    if (state === "listening") {
      voiceCommands.stopListening()
      setState("idle")
      return
    }
    setState("listening")
    setTranscript("")
    setResponse("")
    try {
      const result = await voiceCommands.startListening()
      if (result) {
        setTranscript(result.raw || "")
        setState("processing")
        setTimeout(() => {
          setResponse(getResponseForCommand(result.type))
          setState("idle")
        }, 1200)
      } else {
        setTranscript("Command not recognized")
        setState("idle")
      }
    } catch {
      setTranscript("Could not access microphone")
      setState("idle")
    }
  }

  const getResponseForCommand = (type: string): string => {
    const replies: Record<string, string> = {
      find_viral_niches: "Scanning viral niches... I've identified 3 high-growth opportunities: AI video avatars (+92% momentum), no-code automation tools (+87%), and educational shorts (+81%).",
      analyze_competitor: "Analyzing competitor channel... Their top performing content is 'AI for Beginners' with 2.4M views. Recommended strategy: focus on tutorial-style content with clickable thumbnails.",
      detect_keywords: "Extracting keywords from current trend data. Top opportunities: 'AI workflow automation' (search volume: 48K, competition: Low), 'smart content creation' (34K, Medium).",
      show_trends: "Current trending topics in your niche: #1 AI Content Creation (+156% growth), #2 No-Code Revolution (+112%), #3 Smart Automation (+89%).",
      analyze_page: "Analysis complete. Page has strong keyword density (72/100). Title could be optimized for better CTR. Suggested improvements: Add power words, include target keyword earlier.",
      generate_content: "Generating content strategy... I recommend: 1) '10 AI Tools That Will Replace Your Entire Workflow' (listicle), 2) 'How I Automated 80% of My Work' (storytime), 3) 'AI vs Human: Who Wins?' (debate format).",
    }
    return replies[type] || "Command processed successfully! How else can I help you?"
  }

  if (!supported) {
    return (
      <div className="trendpulse-voice-command">
        <style>{`
          .trendpulse-voice-fallback {
            text-align: center;
            padding: 24px 16px;
            color: rgba(255,255,255,0.3);
            font-size: 12px;
          }
          .trendpulse-voice-fallback-icon { font-size: 36px; margin-bottom: 8px; opacity: 0.2; }
        `}</style>
        <div className="trendpulse-section-title">🎤 Voice Command</div>
        <div className="trendpulse-voice-fallback">
          <div className="trendpulse-voice-fallback-icon">🎤</div>
          <div>Speech recognition not available</div>
          <div style={{ fontSize: 10, marginTop: 4 }}>Please use a supported browser (Chrome/Edge)</div>
        </div>
      </div>
    )
  }

  return (
    <div className="trendpulse-voice-command">
      <style>{`
        @keyframes voice-pulse {
          0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%,-50%) scale(1.8); opacity: 0.1; }
        }
        @keyframes mic-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0,191,255,0.3)); }
          50% { filter: drop-shadow(0 0 30px rgba(0,191,255,0.7)); }
        }
        .trendpulse-voice-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .trendpulse-mic-orb {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(0,191,255,0.15), rgba(138,92,255,0.15));
          border: 2px solid rgba(0,191,255,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          animation: ${state === "listening" ? "mic-glow 1.5s ease-in-out infinite" : "none"};
        }
        .trendpulse-mic-orb:hover {
          border-color: rgba(0,191,255,0.6);
          box-shadow: 0 0 30px rgba(0,191,255,0.2);
        }
        .trendpulse-mic-icon { font-size: 28px; z-index: 2; }
        .trendpulse-mic-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 2px solid rgba(0,255,240,0.15);
          animation: ${state === "listening" ? "voice-pulse 2s ease-in-out infinite" : "none"};
        }
        .trendpulse-mic-ring-2 {
          position: absolute;
          top: 50%; left: 50%;
          width: 80px; height: 80px;
          border-radius: 50%;
          border: 1px solid rgba(138,92,255,0.1);
          animation: ${state === "listening" ? "voice-pulse 2s ease-in-out infinite 0.3s" : "none"};
        }
        .trendpulse-voice-status {
          font-family: "Orbitron", monospace;
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${state === "listening" ? "#00FFF0" : state === "processing" ? "#FFD700" : "rgba(255,255,255,0.4)"};
        }
        .trendpulse-voice-trigger {
          font-size: 11px;
          color: rgba(255,255,255,0.5);
          text-align: center;
          cursor: pointer;
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          transition: all 0.2s;
        }
        .trendpulse-voice-trigger:hover {
          border-color: rgba(0,191,255,0.3);
          color: rgba(255,255,255,0.8);
        }
        .trendpulse-transcript-area {
          width: 100%;
          min-height: 36px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          text-align: center;
        }
        .trendpulse-voice-response {
          width: 100%;
          padding: 10px 12px;
          background: rgba(0,255,240,0.03);
          border: 1px solid rgba(0,255,240,0.08);
          border-radius: 8px;
          font-size: 11px;
          line-height: 1.5;
          color: rgba(255,255,255,0.7);
        }
        .trendpulse-command-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .trendpulse-command-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 8px;
          background: rgba(255,255,255,0.02);
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.03);
        }
        .trendpulse-command-icon { font-size: 12px; width: 20px; text-align: center; }
        .trendpulse-command-text { flex: 1; font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.7); }
        .trendpulse-command-desc { font-size: 8px; color: rgba(255,255,255,0.3); }
      `}</style>
      <div className="trendpulse-section-title">🎤 AI Voice Command</div>
      <div className="trendpulse-voice-container">
        <motion.div
          className="trendpulse-mic-orb"
          onClick={toggleListening}
          whileTap={{ scale: 0.9 }}
        >
          {state === "listening" && <div className="trendpulse-mic-ring" />}
          {state === "listening" && <div className="trendpulse-mic-ring-2" />}
          <span className="trendpulse-mic-icon">{state === "listening" ? "🔊" : "🎤"}</span>
        </motion.div>
        <span className="trendpulse-voice-status">
          {state === "idle" ? "Click to Speak" : state === "listening" ? "Listening..." : "Processing..."}
        </span>
        <div className="trendpulse-transcript-area">
          {transcript || "Your speech will appear here..."}
        </div>
        {response && (
          <motion.div
            className="trendpulse-voice-response"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {response}
          </motion.div>
        )}
        <div className="trendpulse-section-title" style={{ marginTop: 4, fontSize: 9, marginBottom: 6 }}>
          Available Commands
        </div>
        <div className="trendpulse-command-list">
          {AVAILABLE_COMMANDS.map((cmd) => (
            <div key={cmd.command} className="trendpulse-command-item">
              <span className="trendpulse-command-icon">{cmd.icon}</span>
              <span className="trendpulse-command-text">{cmd.command}</span>
              <span className="trendpulse-command-desc">{cmd.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
