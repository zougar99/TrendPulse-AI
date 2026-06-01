import React from "react"
import { motion } from "framer-motion"

export function ViralHeatmap() {
  const heatPoints = [
    { x: 20, y: 30, intensity: 0.9, label: "AI" },
    { x: 50, y: 20, intensity: 0.7, label: "Python" },
    { x: 75, y: 45, intensity: 0.85, label: "Web3" },
    { x: 35, y: 60, intensity: 0.6, label: "No-Code" },
    { x: 60, y: 70, intensity: 0.75, label: "ML" },
    { x: 80, y: 25, intensity: 0.5, label: "React" },
    { x: 15, y: 75, intensity: 0.65, label: "TypeScript" },
    { x: 45, y: 80, intensity: 0.55, label: "DevOps" },
    { x: 88, y: 60, intensity: 0.8, label: "Automation" },
    { x: 30, y: 40, intensity: 0.45, label: "Cloud" },
    { x: 65, y: 15, intensity: 0.7, label: "Security" },
    { x: 10, y: 50, intensity: 0.5, label: "Mobile" },
    { x: 92, y: 35, intensity: 0.6, label: "Blockchain" },
    { x: 55, y: 50, intensity: 0.9, label: "🔥 AI Agents" },
  ]

  return (
    <div className="trendpulse-heatmap">
      <h2 className="trendpulse-dash-title">◆ Viral Heatmap</h2>
      <p className="trendpulse-dash-subtitle">Attention intensity across topics</p>

      <div className="trendpulse-heatmap-container">
        <div className="trendpulse-heatmap-grid">
          {/* Background gradient */}
          <div className="trendpulse-heatmap-bg" />
          {/* Scan line */}
          <div className="trendpulse-heatmap-scan" />

          {heatPoints.map((p, i) => (
            <motion.div
              key={i}
              className="trendpulse-heatpoint"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.intensity * 80 + 20}px`,
                height: `${p.intensity * 80 + 20}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: p.intensity,
                boxShadow: [
                  `0 0 ${20 * p.intensity}px rgba(255,45,149,${p.intensity * 0.5})`,
                  `0 0 ${40 * p.intensity}px rgba(0,191,255,${p.intensity * 0.3})`,
                ],
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
              }}
            >
              <span className="trendpulse-heatpoint-label">{p.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="trendpulse-heatmap-legend">
        <span className="trendpulse-legend-item">
          <span className="trendpulse-legend-dot" style={{ background: "#FF2D95" }} /> High
        </span>
        <span className="trendpulse-legend-item">
          <span className="trendpulse-legend-dot" style={{ background: "#8A5CFF" }} /> Medium
        </span>
        <span className="trendpulse-legend-item">
          <span className="trendpulse-legend-dot" style={{ background: "#00BFFF" }} /> Low
        </span>
      </div>

      <div className="trendpulse-section-title">Predicted Rising Topics</div>
      <div className="trendpulse-prediction-list">
        {["AI Agents", "Rust Programming", "Edge Computing", "Web Assembly", "Quantum ML"].map(
          (topic, i) => (
            <div key={topic} className="trendpulse-prediction-item">
              <span className="trendpulse-prediction-rank">#{(i + 1).toString().padStart(2, "0")}</span>
              <span className="trendpulse-prediction-name">{topic}</span>
              <span className="trendpulse-prediction-up">▲</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
