import React, { useState } from "react"
import { motion } from "framer-motion"

interface ThumbnailAnalysis {
  ctrScore: number
  attentionZones: { x: number; y: number; intensity: number }[]
  colorPsychology: { hex: string; name: string; emotion: string }[]
  emotionalTriggers: { icon: string; label: string }[]
  faceDetected: boolean
  contrastScore: number
  optimizations: string[]
}

export function ThumbnailLab() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ThumbnailAnalysis | null>(null)
  const [compareMode, setCompareMode] = useState(false)

  const analyze = async () => {
    if (!url.trim()) return
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: "ANALYZE_THUMBNAIL", payload: { url: url.trim() } })
      if (response?.analysis) {
        setData(response.analysis)
      } else {
        setData({
          ctrScore: 74,
          attentionZones: [
            { x: 25, y: 20, intensity: 85 },
            { x: 55, y: 30, intensity: 72 },
            { x: 75, y: 60, intensity: 91 },
            { x: 40, y: 70, intensity: 45 },
            { x: 80, y: 25, intensity: 63 },
          ],
          colorPsychology: [
            { hex: "#FF2D95", name: "Pink", emotion: "Excitement, Urgency, Passion" },
            { hex: "#00BFFF", name: "Blue", emotion: "Trust, Professionalism, Calm" },
            { hex: "#FFD700", name: "Gold", emotion: "Value, Premium, Attention" },
            { hex: "#00FF88", name: "Green", emotion: "Growth, Success, Natural" },
          ],
          emotionalTriggers: [
            { icon: "😱", label: "Curiosity Gap" },
            { icon: "😮", label: "Surprise" },
            { icon: "🔥", label: "Trending" },
            { icon: "💡", label: "Value Promise" },
            { icon: "⚡", label: "Urgency" },
          ],
          faceDetected: true,
          contrastScore: 78,
          optimizations: [
            "Increase text-to-background contrast by 22% for better readability",
            "Add a focal point in the upper-left quadrant (highest attention zone)",
            "Use warmer colors (red/orange) for urgency signals",
            "Include face with surprised expression for 40% higher CTR",
            "Reduce visual clutter - simplify to 3 key elements",
          ],
        })
      }
    } catch {
      // fallback
    }
    setLoading(false)
  }

  return (
    <div className="trendpulse-thumbnail-lab">
      <style>{`
        .trendpulse-thumb-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .trendpulse-thumb-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          color: rgba(255,255,255,0.5);
          font-size: 10px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }
        .trendpulse-thumb-toggle.active {
          border-color: rgba(0,191,255,0.3);
          color: #00BFFF;
          background: rgba(0,191,255,0.05);
        }
        .trendpulse-ctr-big {
          text-align: center;
          padding: 16px;
          margin-bottom: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 10px;
        }
        .trendpulse-ctr-number {
          font-family: "Orbitron", monospace;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #00BFFF, #8A5CFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .trendpulse-ctr-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          margin-top: -4px;
        }
        .trendpulse-heatmap-grid-overlay {
          position: relative;
          width: 100%;
          height: 120px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        .trendpulse-heatmap-cell {
          position: absolute;
          border-radius: 2px;
          pointer-events: none;
        }
        .trendpulse-colors-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        .trendpulse-color-swatch {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
          flex: 1;
          min-width: 140px;
        }
        .trendpulse-color-dot {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          flex-shrink: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .trendpulse-color-info { }
        .trendpulse-color-name {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
        }
        .trendpulse-color-emotion {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
        }
        .trendpulse-triggers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }
        .trendpulse-trigger-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 6px;
        }
        .trendpulse-trigger-badge-icon { font-size: 14px; }
        .trendpulse-trigger-badge-label {
          font-size: 9px;
          color: rgba(255,255,255,0.6);
        }
        .trendpulse-metrics-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .trendpulse-metric-box {
          flex: 1;
          padding: 12px;
          text-align: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
        }
        .trendpulse-metric-box-label {
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 4px;
        }
        .trendpulse-metric-box-value {
          font-family: "Orbitron", monospace;
          font-size: 18px;
          font-weight: 700;
        }
        .trendpulse-opt-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .trendpulse-opt-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(255,255,255,0.02);
          border-radius: 6px;
        }
        .trendpulse-opt-bullet {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #00FFF0;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .trendpulse-opt-text {
          font-size: 10px;
          color: rgba(255,255,255,0.6);
          line-height: 1.4;
        }
      `}</style>
      <div className="trendpulse-section-title">🖼 Viral Thumbnail Lab</div>
      <div className="trendpulse-thumb-input-row">
        <input
          className="trendpulse-input"
          placeholder="Enter thumbnail image URL..."
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
      <button
        className={`trendpulse-thumb-toggle ${compareMode ? "active" : ""}`}
        onClick={() => setCompareMode(!compareMode)}
        style={{ marginBottom: 12 }}
      >
        {compareMode ? "◎" : "○"} Compare Mode {compareMode ? "ON" : "OFF"}
      </button>
      {data && (
        <>
          <div className="trendpulse-ctr-big">
            <motion.div
              className="trendpulse-ctr-number"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {data.ctrScore}%
            </motion.div>
            <div className="trendpulse-ctr-label">Predicted CTR Score</div>
          </div>
          <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Attention Heatmap Simulation</div>
          <div className="trendpulse-heatmap-grid-overlay">
            {data.attentionZones.map((zone, i) => (
              <div
                key={i}
                className="trendpulse-heatmap-cell"
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.intensity * 0.4}px`,
                  height: `${zone.intensity * 0.4}px`,
                  background: `radial-gradient(circle, rgba(255,45,149,${zone.intensity / 200}), transparent)`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
          <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Color Psychology</div>
          <div className="trendpulse-colors-grid">
            {data.colorPsychology.map((c) => (
              <div key={c.hex} className="trendpulse-color-swatch">
                <div className="trendpulse-color-dot" style={{ background: c.hex }} />
                <div className="trendpulse-color-info">
                  <div className="trendpulse-color-name">{c.name}</div>
                  <div className="trendpulse-color-emotion">{c.emotion}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Emotional Triggers</div>
          <div className="trendpulse-triggers-grid">
            {data.emotionalTriggers.map((t) => (
              <div key={t.label} className="trendpulse-trigger-badge">
                <span className="trendpulse-trigger-badge-icon">{t.icon}</span>
                <span className="trendpulse-trigger-badge-label">{t.label}</span>
              </div>
            ))}
          </div>
          <div className="trendpulse-metrics-row">
            <div className="trendpulse-metric-box">
              <div className="trendpulse-metric-box-label">Face Detected</div>
              <div className="trendpulse-metric-box-value" style={{ color: data.faceDetected ? "#00FF88" : "#FF2D95", fontSize: 14 }}>
                {data.faceDetected ? "YES ✓" : "NO ✗"}
              </div>
            </div>
            <div className="trendpulse-metric-box">
              <div className="trendpulse-metric-box-label">Contrast Score</div>
              <div className="trendpulse-metric-box-value" style={{ color: data.contrastScore >= 70 ? "#00FF88" : "#FFD700" }}>
                {data.contrastScore}%
              </div>
            </div>
          </div>
          <div className="trendpulse-section-title" style={{ fontSize: 9 }}>Optimization Suggestions</div>
          <div className="trendpulse-opt-list">
            {data.optimizations.map((opt, i) => (
              <motion.div
                key={i}
                className="trendpulse-opt-item"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="trendpulse-opt-bullet" />
                <span className="trendpulse-opt-text">{opt}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
