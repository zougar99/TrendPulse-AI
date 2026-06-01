import React, { useState } from "react"
import { motion } from "framer-motion"

export function AISuggestions() {
  const [topic, setTopic] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const result = await chrome.runtime.sendMessage({
        type: "ANALYZE_KEYWORD",
        payload: { keyword: topic.trim(), source: "youtube" },
      })
      if (result?.remote?.niche?.niches) {
        setSuggestions(result.remote.niche.niches.slice(0, 8))
      } else {
        setSuggestions(
          [
            `${topic} for beginners`,
            `how to ${topic}`,
            `best ${topic} tools`,
            `${topic} tutorial`,
            `${topic} tips and tricks`,
            `advanced ${topic}`,
            `${topic} vs alternatives`,
            `why ${topic} matters in 2026`,
          ].map((t) => ({ keyword: t, opportunity: 50 + Math.random() * 30, competition: "Medium" }))
        )
      }
    } catch {
      setSuggestions([])
    }
    setLoading(false)
  }

  return (
    <div className="trendpulse-ai-suggestions">
      <div className="trendpulse-section-title">◇ AI Content Suggestions</div>
      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-accent"
          onClick={generate}
          disabled={loading || !topic.trim()}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "..." : "Generate"}
        </motion.button>
      </div>

      {suggestions.length > 0 && (
        <div className="trendpulse-suggestion-list">
          {suggestions.map((s, i) => (
            <motion.div
              key={i}
              className="trendpulse-suggestion-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="trendpulse-suggestion-card-text">{s.keyword || s}</div>
              <div className="trendpulse-suggestion-card-meta">
                <span
                  className="trendpulse-chip"
                  style={{
                    background:
                      (s.opportunity || 50) >= 70
                        ? "rgba(0,255,136,0.15)"
                        : "rgba(255,215,0,0.15)",
                    color:
                      (s.opportunity || 50) >= 70 ? "#00FF88" : "#FFD700",
                  }}
                >
                  {(s.opportunity || 50)}%
                </span>
                <span className="trendpulse-chip" style={{ background: "rgba(138,92,255,0.15)", color: "#8A5CFF" }}>
                  {s.competition || "Medium"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
