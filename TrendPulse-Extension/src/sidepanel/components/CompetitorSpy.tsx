import React, { useState } from "react"
import { motion } from "framer-motion"

export function CompetitorSpy() {
  const [competitors] = useState([
    { name: "Channel A", keywords: 45, tags: 128, growth: "+12%", score: 88 },
    { name: "Channel B", keywords: 32, tags: 94, growth: "+8%", score: 76 },
    { name: "Channel C", keywords: 28, tags: 76, growth: "+15%", score: 82 },
    { name: "Channel D", keywords: 51, tags: 156, growth: "+5%", score: 71 },
  ])

  return (
    <div className="trendpulse-spy">
      <h2 className="trendpulse-dash-title">◈ Smart Competitor Spy</h2>
      <p className="trendpulse-dash-subtitle">Tracking top creators and their strategies</p>

      <div className="trendpulse-spy-list">
        {competitors.map((c, i) => (
          <motion.div
            key={c.name}
            className="trendpulse-spy-card"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="trendpulse-spy-header">
              <div className="trendpulse-spy-avatar">
                {c.name.charAt(0)}
              </div>
              <div className="trendpulse-spy-info">
                <span className="trendpulse-spy-name">{c.name}</span>
                <span className="trendpulse-spy-growth" style={{ color: "#00FF88" }}>
                  {c.growth} growth
                </span>
              </div>
              <div
                className="trendpulse-spy-score"
                style={{
                  color: c.score >= 80 ? "#00FF88" : c.score >= 60 ? "#FFD700" : "#FF2D95",
                }}
              >
                {c.score}
              </div>
            </div>
            <div className="trendpulse-spy-details">
              <span className="trendpulse-chip" style={{ background: "rgba(0,191,255,0.15)", color: "#00BFFF" }}>
                {c.keywords} keywords
              </span>
              <span className="trendpulse-chip" style={{ background: "rgba(138,92,255,0.15)", color: "#8A5CFF" }}>
                {c.tags} tags
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
