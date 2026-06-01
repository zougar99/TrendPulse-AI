import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function LiveScore() {
  const [scores, setScores] = useState([
    { label: "YouTube SEO", value: 78, prev: 72 },
    { label: "Keyword Density", value: 65, prev: 60 },
    { label: "Viral Potential", value: 82, prev: 70 },
    { label: "Tag Coverage", value: 55, prev: 58 },
    { label: "Title Strength", value: 71, prev: 65 },
    { label: "Engagement", value: 88, prev: 80 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setScores((prev) =>
        prev.map((s) => ({
          ...s,
          prev: s.value,
          value: Math.min(100, Math.max(0, s.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="trendpulse-live-score">
      <div className="trendpulse-section-title">◆ Live Performance Scores</div>
      <div className="trendpulse-score-grid">
        {scores.map((s, i) => {
          const change = s.value - s.prev
          return (
            <motion.div
              key={s.label}
              className="trendpulse-score-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="trendpulse-score-item-label">{s.label}</div>
              <div className="trendpulse-score-item-bar">
                <motion.div
                  className="trendpulse-score-item-fill"
                  initial={false}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{
                    background: `linear-gradient(90deg, #8A5CFF, ${s.value >= 80 ? "#00FF88" : s.value >= 60 ? "#00BFFF" : "#FFD700"})`,
                  }}
                />
              </div>
              <div className="trendpulse-score-item-footer">
                <span className="trendpulse-score-item-value">{s.value}</span>
                <span
                  className="trendpulse-score-item-change"
                  style={{ color: change >= 0 ? "#00FF88" : "#FF2D95" }}
                >
                  {change >= 0 ? `+${change}` : change}
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
