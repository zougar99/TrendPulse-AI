import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface SignalStrength {
  name: string
  value: number
  icon: string
}

interface EarlyTrend {
  name: string
  breakoutProbability: number
  timing: string
  category: string
}

interface EarlyDetectionData {
  signals: SignalStrength[]
  breakoutProbability: number
  forecastDate: string
  forecastConfidence: number
  trends: EarlyTrend[]
}

export function EarlyDetection() {
  const [data, setData] = useState<EarlyDetectionData | null>(null)
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    const demo: EarlyDetectionData = {
      signals: [
        { name: "Autocomplete Velocity", value: 88, icon: "⌨" },
        { name: "Upload Frequency", value: 76, icon: "📤" },
        { name: "Search Acceleration", value: 92, icon: "🔍" },
        { name: "Social Spikes", value: 71, icon: "📱" },
        { name: "Discussion Growth", value: 84, icon: "💬" },
        { name: "Engagement Anomalies", value: 79, icon: "📊" },
      ],
      breakoutProbability: 87,
      forecastDate: "Jun 12, 2026",
      forecastConfidence: 82,
      trends: [
        { name: "AI Video Avatars", breakoutProbability: 92, timing: "1-2 weeks", category: "Technology" },
        { name: "Retro Digital Art", breakoutProbability: 85, timing: "2-3 weeks", category: "Design" },
        { name: "No-Code AI Agents", breakoutProbability: 81, timing: "3-4 weeks", category: "Technology" },
        { name: "Mindfulness Tech", breakoutProbability: 74, timing: "1-2 weeks", category: "Wellness" },
        { name: "Synthetic Media", breakoutProbability: 78, timing: "2-3 weeks", category: "AI" },
      ],
    }

    const timeout = setTimeout(() => {
      setData(demo)
      setScanning(false)
    }, 1800)

    chrome.runtime.sendMessage({ type: "GET_EARLY_TRENDS" }, (response) => {
      if (response?.earlyTrends) {
        setData(response.earlyTrends)
        setScanning(false)
      }
    })

    return () => clearTimeout(timeout)
  }, [])

  if (scanning) {
    return (
      <div className="trendpulse-early-detection">
        <style>{`
          @keyframes radar-sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes scan-ping {
            0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-50%,-50%) scale(1.5); opacity: 0.2; }
          }
          .trendpulse-scanning-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 30px 0;
            gap: 12px;
          }
          .trendpulse-scanning-radar {
            position: relative;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid rgba(0,191,255,0.15);
            background: radial-gradient(circle, rgba(0,191,255,0.03), transparent);
          }
          .trendpulse-scanning-sweep {
            position: absolute;
            top: 50%; left: 50%;
            width: 50px; height: 1px;
            background: linear-gradient(90deg, #00BFFF, transparent);
            transform-origin: left center;
            animation: radar-sweep 2s linear infinite;
          }
          .trendpulse-scanning-dot {
            position: absolute;
            top: 50%; left: 50%;
            width: 6px; height: 6px;
            border-radius: 50%;
            background: #00FFF0;
            box-shadow: 0 0 10px rgba(0,255,240,0.5);
            animation: scan-ping 1.5s ease-in-out infinite;
          }
          .trendpulse-scanning-text {
            font-family: "Orbitron", monospace;
            font-size: 10px;
            color: rgba(0,255,240,0.5);
            letter-spacing: 2px;
            animation: pulse-dot 1.5s ease-in-out infinite;
          }
        `}</style>
        <div className="trendpulse-section-title">📡 Early Trend Detection</div>
        <div className="trendpulse-scanning-container">
          <div className="trendpulse-scanning-radar">
            <div className="trendpulse-scanning-sweep" />
            <div className="trendpulse-scanning-dot" />
          </div>
          <div className="trendpulse-scanning-text">SCANNING...</div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const getBreakoutColor = (val: number) => {
    if (val >= 85) return "#00FF88"
    if (val >= 70) return "#FFD700"
    return "#FF2D95"
  }

  return (
    <div className="trendpulse-early-detection">
      <style>{`
        @keyframes alert-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255,45,149,0.3), 0 0 20px rgba(255,45,149,0.1); }
          50% { box-shadow: 0 0 20px rgba(255,45,149,0.5), 0 0 40px rgba(255,45,149,0.2); }
        }
        .trendpulse-early-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          margin-bottom: 12px;
          background: rgba(255,45,149,0.06);
          border: 1px solid rgba(255,45,149,0.2);
          border-radius: 8px;
          animation: alert-pulse 2s ease-in-out infinite;
        }
        .trendpulse-early-alert-icon { font-size: 16px; }
        .trendpulse-early-alert-text {
          font-family: "Orbitron", monospace;
          font-size: 10px;
          color: #FF2D95;
          letter-spacing: 1px;
        }
        .trendpulse-signal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }
        .trendpulse-signal-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
        }
        .trendpulse-signal-icon { font-size: 14px; width: 20px; text-align: center; }
        .trendpulse-signal-info { flex: 1; }
        .trendpulse-signal-name { font-size: 9px; color: rgba(255,255,255,0.5); margin-bottom: 3px; }
        .trendpulse-signal-track { height: 3px; background: rgba(255,255,255,0.04); border-radius: 2px; overflow: hidden; }
        .trendpulse-signal-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #8A5CFF, #00BFFF); }
        .trendpulse-breakout-section {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .trendpulse-breakout-ring {
          position: relative;
          width: 64px;
          height: 64px;
          flex-shrink: 0;
        }
        .trendpulse-breakout-ring-svg {
          width: 64px;
          height: 64px;
          transform: rotate(-90deg);
        }
        .trendpulse-breakout-ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.04);
          stroke-width: 4;
        }
        .trendpulse-breakout-ring-fill {
          fill: none;
          stroke-width: 4;
          stroke-linecap: round;
          filter: drop-shadow(0 0 6px);
        }
        .trendpulse-breakout-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .trendpulse-breakout-pct {
          font-family: "Orbitron", monospace;
          font-size: 16px;
          font-weight: 700;
        }
        .trendpulse-breakout-lbl {
          font-size: 6px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
        }
        .trendpulse-breakout-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .trendpulse-breakout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .trendpulse-breakout-row-label {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
        }
        .trendpulse-breakout-row-value {
          font-family: "Orbitron", monospace;
          font-size: 10px;
          color: rgba(255,255,255,0.8);
        }
        .trendpulse-early-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .trendpulse-early-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.02);
          border-radius: 6px;
          border-left: 2px solid;
        }
        .trendpulse-early-item-name {
          flex: 1;
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
        }
        .trendpulse-early-item-bp {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          width: 28px;
          text-align: center;
        }
        .trendpulse-early-item-time {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          width: 48px;
          text-align: right;
        }
        .trendpulse-early-item-cat {
          font-size: 7px;
          padding: 1px 5px;
          border-radius: 3px;
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.3);
        }
      `}</style>
      <div className="trendpulse-section-title">📡 Early Trend Detection</div>
      <motion.div
        className="trendpulse-early-alert"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="trendpulse-early-alert-icon">🚨</span>
        <span className="trendpulse-early-alert-text">EARLY TREND DETECTED</span>
      </motion.div>
      <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Signal Strength</div>
      <div className="trendpulse-signal-grid">
        {data.signals.map((s, i) => (
          <motion.div
            key={s.name}
            className="trendpulse-signal-card"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="trendpulse-signal-icon">{s.icon}</span>
            <div className="trendpulse-signal-info">
              <div className="trendpulse-signal-name">{s.name}</div>
              <div className="trendpulse-signal-track">
                <motion.div
                  className="trendpulse-signal-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${s.value}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="trendpulse-breakout-section">
        <div className="trendpulse-breakout-ring">
          <svg className="trendpulse-breakout-ring-svg">
            <circle className="trendpulse-breakout-ring-bg" cx="32" cy="32" r="26" />
            <motion.circle
              className="trendpulse-breakout-ring-fill"
              initial={{ strokeDasharray: "0, 163" }}
              animate={{ strokeDasharray: `${(data.breakoutProbability / 100) * 163}, 163` }}
              transition={{ duration: 1 }}
              cx="32" cy="32" r="26"
              stroke={getBreakoutColor(data.breakoutProbability)}
              style={{ filter: `drop-shadow(0 0 6px ${getBreakoutColor(data.breakoutProbability)})` }}
            />
          </svg>
          <div className="trendpulse-breakout-center">
            <span className="trendpulse-breakout-pct" style={{ color: getBreakoutColor(data.breakoutProbability) }}>
              {data.breakoutProbability}%
            </span>
            <span className="trendpulse-breakout-lbl">BREAKOUT</span>
          </div>
        </div>
        <div className="trendpulse-breakout-details">
          <div className="trendpulse-breakout-row">
            <span className="trendpulse-breakout-row-label">Forecast</span>
            <span className="trendpulse-breakout-row-value" style={{ color: "#00FFF0" }}>{data.forecastDate}</span>
          </div>
          <div className="trendpulse-breakout-row">
            <span className="trendpulse-breakout-row-label">Confidence</span>
            <span className="trendpulse-breakout-row-value" style={{ color: getBreakoutColor(data.forecastConfidence) }}>
              {data.forecastConfidence}%
            </span>
          </div>
        </div>
      </div>
      <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Detected Early Trends</div>
      <div className="trendpulse-early-list">
        {data.trends.map((t, i) => (
          <motion.div
            key={t.name}
            className="trendpulse-early-item"
            style={{ borderLeftColor: getBreakoutColor(t.breakoutProbability) }}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="trendpulse-early-item-name">{t.name}</span>
            <span className="trendpulse-early-item-bp" style={{ color: getBreakoutColor(t.breakoutProbability) }}>
              {t.breakoutProbability}%
            </span>
            <span className="trendpulse-early-item-time">{t.timing}</span>
            <span className="trendpulse-early-item-cat">{t.category}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
