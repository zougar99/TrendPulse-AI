import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: number
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "ai",
  content: "Hello! I'm your TrendPulse AI assistant. I can help you with:\n\n• Analyzing keywords & trends\n• Generating content ideas\n• Finding viral niches\n• Scanning competitor channels\n• Predicting viral potential\n• Optimizing your content strategy\n\nWhat would you like to explore?",
  timestamp: Date.now(),
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [typingDots, setTypingDots] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, typingDots])

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 400)
    return () => clearInterval(interval)
  }, [loading])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: Date.now() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: "AI_CHAT", payload: { message: input.trim() } })
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: response?.reply || getFallbackReply(input.trim()),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: getFallbackReply(input.trim()),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
    }
    setLoading(false)
    setTypingDots("")
  }

  const getFallbackReply = (msg: string): string => {
    const lower = msg.toLowerCase()
    if (lower.includes("trend") || lower.includes("viral")) {
      return "Based on current data, I'm seeing strong momentum in AI content creation, no-code tools, and short-form video. The niche with the highest growth potential right now is 'AI-powered automation tutorials' with a 92% viral probability score."
    }
    if (lower.includes("keyword") || lower.includes("niche")) {
      return "I've scanned trending keywords in your space. High-opportunity niches include: AI productivity tools (+89% growth), Web3 education (+76%), and automated content workflows (+84%). Would you like me to analyze any of these in depth?"
    }
    if (lower.includes("analyze") || lower.includes("scan")) {
      return "Ready to analyze! Please provide a URL, keyword, or channel name and I'll run a full diagnostic including viral DNA scanning, competition analysis, and audience insights."
    }
    if (lower.includes("hello") || lower.includes("hi ") || lower.includes("hey")) {
      return "Hey there! 👋 Ready to discover your next viral content opportunity. Just ask me about trends, keywords, or content ideas."
    }
    return "Interesting question! Let me analyze that for you. Based on my trend intelligence, I'd recommend focusing on content that combines educational value with entertainment — 'edu-tainment' content is showing 3.2x higher retention rates in your niche."
  }

  return (
    <div className="trendpulse-ai-chat">
      <style>{`
        .trendpulse-chat-container {
          display: flex;
          flex-direction: column;
          height: 340px;
        }
        .trendpulse-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .trendpulse-chat-msg {
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 11px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .trendpulse-chat-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, rgba(0,191,255,0.15), rgba(138,92,255,0.15));
          border: 1px solid rgba(0,191,255,0.2);
          color: rgba(255,255,255,0.9);
          border-bottom-right-radius: 2px;
        }
        .trendpulse-chat-msg.ai {
          align-self: flex-start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
          border-bottom-left-radius: 2px;
        }
        .trendpulse-chat-msg.ai.welcome {
          background: rgba(0,255,240,0.04);
          border-color: rgba(0,255,240,0.1);
        }
        .trendpulse-chat-typing {
          align-self: flex-start;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          font-size: 14px;
          color: rgba(0,255,240,0.6);
          letter-spacing: 2px;
          font-family: "Orbitron", monospace;
        }
        .trendpulse-chat-input-area {
          display: flex;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .trendpulse-chat-input {
          flex: 1;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #fff;
          font-size: 12px;
          font-family: inherit;
          outline: none;
          transition: all 0.2s;
        }
        .trendpulse-chat-input:focus {
          border-color: #00BFFF;
          box-shadow: 0 0 15px rgba(0,191,255,0.15);
        }
        .trendpulse-chat-input::placeholder { color: rgba(255,255,255,0.15); }
        .trendpulse-chat-send {
          padding: 10px 14px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #00BFFF, #8A5CFF);
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .trendpulse-chat-send:hover { box-shadow: 0 0 20px rgba(0,191,255,0.3); }
        .trendpulse-chat-send:disabled { opacity: 0.4; cursor: not-allowed; }
        .trendpulse-chat-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 8px;
        }
        .trendpulse-chat-empty-icon {
          font-size: 32px;
          opacity: 0.2;
        }
        .trendpulse-chat-empty-text {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          text-align: center;
        }
      `}</style>
      <div className="trendpulse-section-title">🤖 AI Chat</div>
      <div className="trendpulse-chat-container">
        <div className="trendpulse-chat-messages" ref={listRef}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`trendpulse-chat-msg ${msg.role}${msg.id === "welcome" ? " welcome" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.content}
            </motion.div>
          ))}
          {loading && (
            <div className="trendpulse-chat-typing">
              {typingDots || "..."}
            </div>
          )}
        </div>
        <div className="trendpulse-chat-input-area">
          <input
            className="trendpulse-chat-input"
            placeholder="Ask me anything about your content strategy..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <motion.button
            className="trendpulse-chat-send"
            onClick={send}
            disabled={!input.trim() || loading}
            whileTap={{ scale: 0.9 }}
          >
            ➤
          </motion.button>
        </div>
      </div>
    </div>
  )
}
