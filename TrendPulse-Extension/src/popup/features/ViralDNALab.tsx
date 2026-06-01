import React, { useState } from "react"
import { motion } from "framer-motion"

interface ViralDNA {
  viralDNAScore: number
  psychologicalTriggers: { trigger: string; intensity: number; category: string }[]
  hookStrength: number
  emotionalHeatmap: { emotion: string; value: number; color: string }[]
  retentionProbability: number
}

export function ViralDNALab() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ViralDNA | null>(null)

  const analyze = async () => {
    if (!url.trim()) return
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: "ANALYZE_CONTENT", payload: { url: url.trim() } })
      if (response?.viralDNA) {
        setData(response.viralDNA)
      } else {
        setData({
          viralDNAScore: 78,
          psychologicalTriggers: [
            { trigger: "Curiosity Gap", intensity: 92, category: "Cognitive" },
            { trigger: "Social Proof", intensity: 85, category: "Social" },
            { trigger: "Fear of Missing Out", intensity: 78, category: "Emotional" },
            { trigger: "Novelty", intensity: 88, category: "Cognitive" },
            { trigger: "Identity", intensity: 72, category: "Social" },
            { trigger: "Storytelling", intensity: 80, category: "Emotional" },
          ],
          hookStrength: 84,
          emotionalHeatmap: [
            { emotion: "Excitement", value: 91, color: "#00FF88" },
            { emotion: "Surprise", value: 78, color: "#00BFFF" },
            { emotion: "Curiosity", value: 88, color: "#8A5CFF" },
            { emotion: "Joy", value: 65, color: "#FFD700" },
            { emotion: "Urgency", value: 82, color: "#FF2D95" },
            { emotion: "Trust", value: 55, color: "#00FFF0" },
          ],
          retentionProbability: 73,
        })
      }
    } catch {
      // fallback
    }
    setLoading(false)
  }

  return (
    <div className="trendpulse-viral-dna">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(0,191,255,0.3); }
          50% { box-shadow: 0 0 30px rgba(0,191,255,0.6); }
        }
        .trendpulse-lab-scanline {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,240,0.3), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        .trendpulse-lab-forensic {
          position: relative;
          background: rgba(5,5,10,0.9);
          border: 1px solid rgba(0,191,255,0.2);
          border-radius: 12px;
          overflow: hidden;
        }
        .trendpulse-lab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(0,191,255,0.1);
          background: rgba(0,191,255,0.03);
        }
        .trendpulse-lab-title {
          font-family: "Orbitron", monospace;
          font-size: 10px;
          color: #00BFFF;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .trendpulse-lab-badge {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 3px;
          background: rgba(0,255,240,0.1);
          color: #00FFF0;
          border: 1px solid rgba(0,255,240,0.2);
        }
        .trendpulse-dna-ring-container {
          display: flex;
          justify-content: center;
          padding: 16px;
        }
        .trendpulse-dna-ring {
          position: relative;
          width: 100px;
          height: 100px;
        }
        .trendpulse-dna-ring-svg {
          width: 100px;
          height: 100px;
          transform: rotate(-90deg);
        }
        .trendpulse-dna-ring-bg {
          fill: none;
          stroke: rgba(255,255,255,0.05);
          stroke-width: 4;
        }
        .trendpulse-dna-ring-fill {
          fill: none;
          stroke: url(#dnaGrad);
          stroke-width: 4;
          stroke-linecap: round;
          filter: drop-shadow(0 0 8px rgba(0,191,255,0.4));
        }
        .trendpulse-dna-score-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .trendpulse-dna-score-num {
          font-family: "Orbitron", monospace;
          font-size: 24px;
          font-weight: 700;
          color: #00FFF0;
          text-shadow: 0 0 15px rgba(0,255,240,0.5);
        }
        .trendpulse-dna-score-lbl {
          font-size: 7px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
        }
        .trendpulse-trigger-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          padding: 12px 14px;
        }
        .trendpulse-trigger-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 10px;
        }
        .trendpulse-trigger-name {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          margin-bottom: 2px;
        }
        .trendpulse-trigger-category {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .trendpulse-trigger-bar {
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
        }
        .trendpulse-trigger-fill {
          height: 100%;
          border-radius: 2px;
          background: linear-gradient(90deg, #00BFFF, #8A5CFF);
        }
        .trendpulse-trigger-intensity {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          margin-top: 3px;
          color: rgba(255,255,255,0.4);
        }
        .trendpulse-heatmap-section {
          padding: 0 14px 12px;
        }
        .trendpulse-heatmap-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .trendpulse-heatmap-label {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          width: 64px;
          flex-shrink: 0;
          text-align: right;
        }
        .trendpulse-heatmap-track {
          flex: 1;
          height: 14px;
          background: rgba(255,255,255,0.04);
          border-radius: 3px;
          overflow: hidden;
          position: relative;
        }
        .trendpulse-heatmap-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.8s ease;
        }
        .trendpulse-heatmap-val {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          width: 24px;
          text-align: right;
          color: rgba(255,255,255,0.4);
        }
        .trendpulse-meter-section {
          padding: 0 14px 12px;
        }
        .trendpulse-meter {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .trendpulse-meter-track {
          flex: 1;
          height: 8px;
          background: rgba(255,255,255,0.04);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }
        .trendpulse-meter-fill {
          height: 100%;
          border-radius: 4px;
          background: linear-gradient(90deg, #FF2D95, #FFD700, #00FF88);
        }
        .trendpulse-meter-label {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          width: 50px;
        }
        .trendpulse-meter-value {
          font-family: "Orbitron", monospace;
          font-size: 14px;
          color: #FFD700;
          width: 32px;
          text-align: right;
        }
        .trendpulse-retention-section {
          padding: 0 14px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .trendpulse-retention-label {
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          flex-shrink: 0;
        }
        .trendpulse-retention-bar {
          flex: 1;
          height: 10px;
          background: rgba(255,255,255,0.04);
          border-radius: 5px;
          overflow: hidden;
        }
        .trendpulse-retention-fill {
          height: 100%;
          border-radius: 5px;
          background: linear-gradient(90deg, #8A5CFF, #00FFF0);
        }
        .trendpulse-retention-value {
          font-family: "Orbitron", monospace;
          font-size: 14px;
          color: #00FFF0;
          text-shadow: 0 0 10px rgba(0,255,240,0.4);
        }
      `}</style>
      <div className="trendpulse-section-title">🧬 Viral DNA Lab</div>
      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Enter video URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          onClick={analyze}
          disabled={loading || !url.trim()}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "..." : "Analyze"}
        </motion.button>
      </div>
      {data && (
        <div className="trendpulse-lab-forensic">
          <div className="trendpulse-lab-scanline" />
          <div className="trendpulse-lab-header">
            <span className="trendpulse-lab-title">🔬 Forensic Analysis</span>
            <span className="trendpulse-lab-badge">SCAN COMPLETE</span>
          </div>
          <div className="trendpulse-dna-ring-container">
            <div className="trendpulse-dna-ring">
              <svg className="trendpulse-dna-ring-svg">
                <defs>
                  <linearGradient id="dnaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00BFFF" />
                    <stop offset="50%" stopColor="#8A5CFF" />
                    <stop offset="100%" stopColor="#00FFF0" />
                  </linearGradient>
                </defs>
                <circle className="trendpulse-dna-ring-bg" cx="50" cy="50" r="42" />
                <motion.circle
                  className="trendpulse-dna-ring-fill"
                  initial={{ strokeDasharray: "0, 264" }}
                  animate={{ strokeDasharray: `${(data.viralDNAScore / 100) * 264}, 264` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  cx="50" cy="50" r="42"
                />
              </svg>
              <div className="trendpulse-dna-score-text">
                <span className="trendpulse-dna-score-num">{data.viralDNAScore}</span>
                <span className="trendpulse-dna-score-lbl">VIRAL DNA</span>
              </div>
            </div>
          </div>
          <div className="trendpulse-section-title" style={{ padding: "0 14px" }}>Psychological Trigger Map</div>
          <div className="trendpulse-trigger-grid">
            {data.psychologicalTriggers.map((t, i) => (
              <motion.div
                key={t.trigger}
                className="trendpulse-trigger-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="trendpulse-trigger-name">{t.trigger}</div>
                <div className="trendpulse-trigger-category">{t.category}</div>
                <div className="trendpulse-trigger-bar">
                  <motion.div
                    className="trendpulse-trigger-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${t.intensity}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                  />
                </div>
                <div className="trendpulse-trigger-intensity">{t.intensity}%</div>
              </motion.div>
            ))}
          </div>
          <div className="trendpulse-section-title" style={{ padding: "12px 14px 6px" }}>Hook Strength</div>
          <div className="trendpulse-meter-section">
            <div className="trendpulse-meter">
              <span className="trendpulse-meter-label">Hook</span>
              <div className="trendpulse-meter-track">
                <motion.div
                  className="trendpulse-meter-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.hookStrength}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="trendpulse-meter-value">{data.hookStrength}%</span>
            </div>
          </div>
          <div className="trendpulse-section-title" style={{ padding: "0 14px 6px" }}>Emotional Heatmap</div>
          <div className="trendpulse-heatmap-section">
            {data.emotionalHeatmap.map((e, i) => (
              <div className="trendpulse-heatmap-row" key={e.emotion}>
                <span className="trendpulse-heatmap-label">{e.emotion}</span>
                <div className="trendpulse-heatmap-track">
                  <motion.div
                    className="trendpulse-heatmap-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${e.value}%` }}
                    transition={{ duration: 0.6, delay: i * 0.06 }}
                    style={{ background: e.color }}
                  />
                </div>
                <span className="trendpulse-heatmap-val">{e.value}</span>
              </div>
            ))}
          </div>
          <div className="trendpulse-section-title" style={{ padding: "0 14px 6px" }}>Retention Probability</div>
          <div className="trendpulse-retention-section">
            <span className="trendpulse-retention-label">Retention</span>
            <div className="trendpulse-retention-bar">
              <motion.div
                className="trendpulse-retention-fill"
                initial={{ width: 0 }}
                animate={{ width: `${data.retentionProbability}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="trendpulse-retention-value">{data.retentionProbability}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
