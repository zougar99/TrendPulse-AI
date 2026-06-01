import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"

interface TitleAnalysis {
  curiosityGap: number
  emotionalImpact: number
  urgency: number
  clickbaitIntensity: number
  engagementPotential: number
  retentionPotential: number
  psychologicalScore: number
  emotionalIntensity: number
  curiosityOverTime: number[]
  optimizedTitles: { title: string; score: number }[]
}

const DEMO_ANALYSIS: TitleAnalysis = {
  curiosityGap: 82,
  emotionalImpact: 76,
  urgency: 64,
  clickbaitIntensity: 45,
  engagementPotential: 88,
  retentionPotential: 71,
  psychologicalScore: 78,
  emotionalIntensity: 72,
  curiosityOverTime: [15, 35, 55, 70, 82, 88, 85, 90, 92, 88],
  optimizedTitles: [
    { title: "You Won't Believe What AI Just Did — The Future Is Here", score: 94 },
    { title: "Why Every Developer Is Switching to This New Framework", score: 91 },
    { title: "This Simple Trick Boosts Productivity by 300% Instantly", score: 88 },
    { title: "The Hidden Algorithm That's Controlling Your Feed", score: 85 },
    { title: "I Tried This Viral Strategy for 30 Days — Results Shocked Me", score: 82 },
  ],
}

const emotionLabels = ["Neutral", "Curious", "Excited", "Urgent", "Viral"]

function AnimatedBar({ value, color, label }: { value: number; color: string; label?: string }) {
  return (
    <div className="trendpulse-score-item">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="trendpulse-score-item-label">{label}</span>
        <span className="trendpulse-score-item-value" style={{ color }}>{value}%</span>
      </div>
      <div className="trendpulse-score-item-bar">
        <motion.div
          className="trendpulse-score-item-fill"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, width: 0 }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}

export function TitlePsychology() {
  const [title, setTitle] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<TitleAnalysis | null>(null)

  const analyze = useCallback(() => {
    if (!title.trim()) return
    setAnalyzing(true)
    chrome.runtime.sendMessage({ type: "ANALYZE_TITLE", payload: { title } }, (response) => {
      if (response && response.psychologicalScore) {
        setAnalysis(response)
      } else {
        setAnalysis(DEMO_ANALYSIS)
      }
      setAnalyzing(false)
    })
    setTimeout(() => {
      if (analyzing) {
        setAnalysis(DEMO_ANALYSIS)
        setAnalyzing(false)
      }
    }, 2000)
  }, [title])

  return (
    <div className="trendpulse-title-psych">
      <h2 className="trendpulse-dash-title">🧠 Title Psychology Engine</h2>
      <p className="trendpulse-dash-subtitle">AI-powered psychological analysis of your titles</p>

      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Paste your title here..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyze}
          disabled={analyzing || !title.trim()}
        >
          {analyzing ? "Analyzing..." : "Analyze"}
        </motion.button>
      </div>

      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            style={{
              textAlign: "center",
              margin: "16px 0",
              padding: 16,
              background: "var(--glass-light)",
              border: "1px solid var(--glass-border)",
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
              Psychological Score
            </div>
            <motion.div
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: 48,
                fontWeight: 700,
                background: "linear-gradient(135deg, #00BFFF, #8A5CFF, #FF2D95)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              {analysis.psychologicalScore}
            </motion.div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>out of 100</div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Psychology Dashboard</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <AnimatedBar value={analysis.curiosityGap} color="#00BFFF" label="Curiosity Gap" />
              <AnimatedBar value={analysis.emotionalImpact} color="#FF2D95" label="Emotional Impact" />
              <AnimatedBar value={analysis.urgency} color="#FFD700" label="Urgency Meter" />
              <AnimatedBar value={analysis.clickbaitIntensity} color="#FF6B35" label="Clickbait Intensity" />
              <AnimatedBar value={analysis.engagementPotential} color="#00FF88" label="Engagement Potential" />
              <AnimatedBar value={analysis.retentionPotential} color="#8A5CFF" label="Retention Potential" />
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Emotional Intensity Meter</div>
            <div
              style={{
                height: 160,
                display: "flex",
                alignItems: "flex-end",
                gap: 4,
                padding: "8px 4px",
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
              }}
            >
              {emotionLabels.map((label, i) => {
                const segmentHeight = [15, 35, 55, 75, 95][i]
                const isActive = analysis.emotionalIntensity >= segmentHeight
                const hue = 200 + i * 40
                return (
                  <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                    <motion.div
                      style={{
                        width: "100%",
                        maxWidth: 40,
                        height: isActive ? `${segmentHeight}%` : "8%",
                        borderRadius: "6px 6px 0 0",
                        background: isActive
                          ? `linear-gradient(to top, hsl(${hue}, 80%, 60%), hsl(${hue + 20}, 90%, 70%))`
                          : "rgba(255,255,255,0.05)",
                        boxShadow: isActive ? `0 0 12px hsla(${hue}, 80%, 60%, 0.4)` : "none",
                      }}
                      animate={{ height: isActive ? `${segmentHeight}%` : "8%" }}
                      transition={{ duration: 0.6 }}
                    />
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 6, writingMode: "vertical-lr", textOrientation: "mixed" }}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Curiosity Graph (over time)</div>
            <div
              style={{
                height: 100,
                display: "flex",
                alignItems: "flex-end",
                gap: 3,
                padding: "8px 4px",
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
              }}
            >
              {analysis.curiosityOverTime.map((val, i) => (
                <motion.div
                  key={i}
                  style={{
                    flex: 1,
                    background: `linear-gradient(to top, #00BFFF${Math.floor(val * 0.6).toString(16).padStart(2, "0")}, #8A5CFF${Math.floor(val * 0.4).toString(16).padStart(2, "0")})`,
                    borderRadius: "3px 3px 0 0",
                    minHeight: 4,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Optimized Title Variants</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {analysis.optimizedTitles.map((opt, i) => (
                <motion.div
                  key={i}
                  className="trendpulse-suggestion-card"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className="trendpulse-suggestion-card-text">{opt.title}</span>
                  <span
                    className="trendpulse-suggestion-score"
                    style={{
                      color: opt.score >= 90 ? "#00FF88" : opt.score >= 80 ? "#00BFFF" : "#FFD700",
                    }}
                  >
                    {opt.score}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
