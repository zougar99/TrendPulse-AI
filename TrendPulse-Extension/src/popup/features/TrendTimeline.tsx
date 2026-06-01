import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TimelinePhase {
  name: string
  duration: number
  color: string
}

interface TimelineData {
  phases: TimelinePhase[]
  currentKeyword: string
  momentum: number
  velocity: number
  predictedPeak: string
}

export function TrendTimeline() {
  const [data, setData] = useState<TimelineData | null>(null)
  const [particles, setParticles] = useState<{ id: number; x: number }[]>([])

  useEffect(() => {
    const demo: TimelineData = {
      phases: [
        { name: "Rise", duration: 20, color: "#00BFFF" },
        { name: "Explosion", duration: 15, color: "#FF2D95" },
        { name: "Peak", duration: 25, color: "#FFD700" },
        { name: "Decline", duration: 20, color: "#8A5CFF" },
        { name: "Future", duration: 20, color: "#00FFF0" },
      ],
      currentKeyword: "AI Content Creation",
      momentum: 84,
      velocity: 67,
      predictedPeak: "Jul 14, 2026",
    }
    setData(demo)
    chrome.runtime.sendMessage({ type: "GET_TREND_TIMELINE", payload: { keyword: "trend" } }, (response) => {
      if (response?.timeline) {
        setData(response.timeline)
      }
    })
  }, [])

  useEffect(() => {
    if (!data) return
    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParts = prev
          .map((p) => ({ ...p, x: p.x + Math.random() * 2 + 0.5 }))
          .filter((p) => p.x < 100)
        if (Math.random() > 0.6) {
          newParts.push({ id: Date.now(), x: -2 })
        }
        return newParts.slice(-20)
      })
    }, 200)
    return () => clearInterval(interval)
  }, [data])

  if (!data) {
    return <div className="trendpulse-empty">Loading timeline...</div>
  }

  return (
    <div className="trendpulse-trend-timeline">
      <style>{`
        .trendpulse-timeline-container {
          position: relative;
          height: 120px;
          margin-bottom: 12px;
          overflow: hidden;
          background: rgba(5,5,10,0.5);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.04);
        }
        .trendpulse-timeline-track {
          position: absolute;
          bottom: 24px;
          left: 10px;
          right: 10px;
          height: 28px;
          display: flex;
          border-radius: 6px;
          overflow: hidden;
        }
        .trendpulse-timeline-segment {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: rgba(255,255,255,0.7);
          position: relative;
          transition: width 1s ease;
          border-right: 1px solid rgba(0,0,0,0.3);
        }
        .trendpulse-timeline-segment:last-child { border-right: none; }
        .trendpulse-timeline-particle {
          position: absolute;
          bottom: 24px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00FFF0;
          box-shadow: 0 0 6px rgba(0,255,240,0.6);
        }
        .trendpulse-timeline-labels {
          position: absolute;
          bottom: 6px;
          left: 10px;
          right: 10px;
          display: flex;
        }
        .trendpulse-timeline-lbl {
          font-size: 6px;
          color: rgba(255,255,255,0.2);
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .trendpulse-predictive-wave {
          position: absolute;
          bottom: 56px;
          left: 10px;
          right: 10px;
          height: 40px;
          overflow: hidden;
        }
        .trendpulse-wave-svg {
          width: 100%;
          height: 100%;
        }
        .trendpulse-timeline-stats {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .trendpulse-timeline-stat {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 10px;
          text-align: center;
        }
        .trendpulse-timeline-stat-label {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 4px;
        }
        .trendpulse-timeline-stat-value {
          font-family: "Orbitron", monospace;
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
      <div className="trendpulse-section-title">⏳ AI Trend Timeline</div>
      <div className="trendpulse-timeline-container">
        <div className="trendpulse-predictive-wave">
          <svg className="trendpulse-wave-svg" viewBox="0 0 400 40" preserveAspectRatio="none">
            <path
              d="M0 30 Q 50 10 100 25 T 200 15 T 300 28 T 400 5"
              fill="none"
              stroke="rgba(0,255,240,0.2)"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            <path
              d="M0 35 Q 50 20 100 30 T 200 22 T 300 32 T 400 12"
              fill="none"
              stroke="rgba(0,191,255,0.15)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
          </svg>
        </div>
        <div className="trendpulse-timeline-track">
          {data.phases.map((phase) => (
            <div
              key={phase.name}
              className="trendpulse-timeline-segment"
              style={{ width: `${phase.duration}%`, background: `${phase.color}22`, borderBottom: `2px solid ${phase.color}` }}
            >
              {phase.name}
            </div>
          ))}
        </div>
        <div className="trendpulse-timeline-labels">
          {data.phases.map((phase) => (
            <div
              key={phase.name}
              className="trendpulse-timeline-lbl"
              style={{ width: `${phase.duration}%` }}
            >
              {phase.duration}%
            </div>
          ))}
        </div>
        {particles.map((p) => (
          <div
            key={p.id}
            className="trendpulse-timeline-particle"
            style={{ left: `${p.x}%` }}
          />
        ))}
      </div>
      <div className="trendpulse-timeline-stats">
        <div className="trendpulse-timeline-stat">
          <div className="trendpulse-timeline-stat-label">Momentum</div>
          <motion.div
            className="trendpulse-timeline-stat-value"
            style={{ color: data.momentum >= 70 ? "#00FF88" : data.momentum >= 50 ? "#FFD700" : "#FF2D95" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {data.momentum}%
          </motion.div>
        </div>
        <div className="trendpulse-timeline-stat">
          <div className="trendpulse-timeline-stat-label">Velocity</div>
          <motion.div
            className="trendpulse-timeline-stat-value"
            style={{ color: "#00BFFF" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {data.velocity}
          </motion.div>
        </div>
        <div className="trendpulse-timeline-stat">
          <div className="trendpulse-timeline-stat-label">Peak Date</div>
          <div className="trendpulse-timeline-stat-value" style={{ color: "#FFD700", fontSize: 12 }}>
            {data.predictedPeak}
          </div>
        </div>
      </div>
    </div>
  )
}
