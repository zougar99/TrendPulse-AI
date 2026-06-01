import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Suggestion {
  type: "title" | "keyword" | "content" | "seo" | "hashtag"
  text: string
  score?: number
}

export default function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [input, setInput] = useState("")
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0 })

  useEffect(() => {
    const handleMessage = (msg: any) => {
      if (msg.type === "TRENDPULSE_SUGGESTIONS") {
        setSuggestions(msg.payload || [])
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = { startX: e.clientX - position.x, startY: e.clientY - position.y }
  }

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - dragRef.current.startX,
      y: e.clientY - dragRef.current.startY,
    })
  }

  const handleDragEnd = () => setIsDragging(false)

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMove)
      window.addEventListener("mouseup", handleDragEnd)
      return () => {
        window.removeEventListener("mousemove", handleDragMove)
        window.removeEventListener("mouseup", handleDragEnd)
      }
    }
  }, [isDragging])

  const analyzePage = async () => {
    const result = await chrome.runtime.sendMessage({
      type: "ANALYZE_PAGE",
      payload: { url: window.location.href, title: document.title },
    })
    if (result?.seo) {
      setSuggestions([
        { type: "seo", text: `SEO Score: ${result.seo.total}% (${result.seo.grade})`, score: result.seo.total },
        { type: "keyword", text: `Keyword Score: ${result.keywordScore?.score || 0}`, score: result.keywordScore?.score },
        { type: "seo", text: `Viral Probability: ${result.viral?.viralScore || 0}%`, score: result.viral?.viralScore },
      ])
    }
  }

  const generateTitles = async () => {
    if (!input.trim()) return
    const result = await chrome.runtime.sendMessage({
      type: "ANALYZE_KEYWORD",
      payload: { keyword: input, source: "youtube" },
    })
    if (result?.remote?.niche?.niches) {
      setSuggestions(
        result.remote.niche.niches.slice(0, 6).map((n: any) => ({
          type: "keyword",
          text: n.keyword,
          score: n.opportunity,
        }))
      )
    }
    setInput("")
  }

  return (
    <AnimatePresence>
      <motion.div
        className="trendpulse-fab-container"
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 2147483647,
          pointerEvents: "auto",
        }}
        drag
        dragMomentum={false}
        onDragStart={handleDragStart}
      >
        {/* Holographic Orb */}
        <motion.button
          className="trendpulse-orb"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,191,255,0.4), 0 0 40px rgba(138,92,255,0.2)",
              "0 0 30px rgba(0,191,255,0.6), 0 0 60px rgba(138,92,255,0.4)",
              "0 0 20px rgba(0,191,255,0.4), 0 0 40px rgba(138,92,255,0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="trendpulse-orb-icon">TP</span>
          <div className="trendpulse-orb-ring" />
          <div className="trendpulse-orb-ring-2" />
        </motion.button>

        {/* Assistant Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="trendpulse-assistant-card"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="trendpulse-assistant-header">
                <span className="trendpulse-assistant-title">AI Assistant</span>
                <button
                  className="trendpulse-assistant-close"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="trendpulse-assistant-body">
                <button className="trendpulse-btn trendpulse-btn-primary" onClick={analyzePage}>
                  ⚡ Analyze This Page
                </button>

                <div className="trendpulse-input-group">
                  <input
                    className="trendpulse-input"
                    placeholder="Enter a keyword..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateTitles()}
                  />
                  <button className="trendpulse-btn trendpulse-btn-accent" onClick={generateTitles}>
                    →
                  </button>
                </div>

                {suggestions.length > 0 && (
                  <div className="trendpulse-suggestions">
                    <div className="trendpulse-section-title">Suggestions</div>
                    {suggestions.slice(0, 5).map((s, i) => (
                      <div key={i} className="trendpulse-suggestion-item">
                        <span className="trendpulse-suggestion-text">{s.text}</span>
                        {s.score && (
                          <span
                            className="trendpulse-suggestion-score"
                            style={{
                              color:
                                s.score >= 70
                                  ? "#00FF88"
                                  : s.score >= 45
                                    ? "#FFD700"
                                    : "#FF2D95",
                            }}
                          >
                            {s.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="trendpulse-assistant-footer">
                  <button className="trendpulse-btn trendpulse-btn-ghost" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? "◱ Expand" : "◱ Minimize"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
