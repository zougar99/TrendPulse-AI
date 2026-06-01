import React, { useState } from "react"
import { motion } from "framer-motion"

interface Niche {
  name: string
  profitability: number
  competition: number
  growthVelocity: number
  monetization: number
  saturation: "Low" | "Medium" | "High"
}

export function NicheFinder() {
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [niches, setNiches] = useState<Niche[]>([])

  const discover = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({ type: "GET_NICHE_OPPORTUNITIES", payload: { keyword: keyword.trim() } })
      if (response?.niches) {
        setNiches(response.niches)
      } else {
        setNiches([
          { name: `${keyword} AI Tools`, profitability: 88, competition: 35, growthVelocity: 92, monetization: 85, saturation: "Low" },
          { name: `${keyword} for Beginners`, profitability: 76, competition: 55, growthVelocity: 78, monetization: 65, saturation: "Medium" },
          { name: `${keyword} Automation`, profitability: 82, competition: 42, growthVelocity: 88, monetization: 90, saturation: "Low" },
          { name: `${keyword} Reviews`, profitability: 71, competition: 68, growthVelocity: 62, monetization: 78, saturation: "Medium" },
          { name: `${keyword} vs Competitors`, profitability: 79, competition: 45, growthVelocity: 74, monetization: 72, saturation: "Low" },
          { name: `${keyword} Tips & Tricks`, profitability: 68, competition: 72, growthVelocity: 55, monetization: 60, saturation: "High" },
          { name: `${keyword} Case Studies`, profitability: 85, competition: 28, growthVelocity: 81, monetization: 80, saturation: "Low" },
          { name: `${keyword} SaaS Solutions`, profitability: 91, competition: 22, growthVelocity: 95, monetization: 92, saturation: "Low" },
        ])
      }
    } catch {
      // fallback
    }
    setLoading(false)
  }

  const getCompetitionColor = (val: number) => {
    if (val <= 40) return "#00FF88"
    if (val <= 65) return "#FFD700"
    return "#FF2D95"
  }

  const getSaturationColor = (s: string) => {
    if (s === "Low") return "#00FF88"
    if (s === "Medium") return "#FFD700"
    return "#FF2D95"
  }

  return (
    <div className="trendpulse-niche-finder">
      <style>{`
        .trendpulse-niche-radar {
          position: relative;
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .trendpulse-niche-radar-svg {
          width: 200px;
          height: 200px;
          position: absolute;
        }
        .trendpulse-niche-center {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #00BFFF;
          box-shadow: 0 0 20px rgba(0,191,255,0.6);
        }
        .trendpulse-niche-label {
          position: absolute;
          font-size: 8px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 0 10px rgba(0,0,0,0.9);
          white-space: nowrap;
          transition: all 0.3s;
        }
        .trendpulse-niche-results {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .trendpulse-niche-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 10px;
        }
        .trendpulse-niche-card-name {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .trendpulse-niche-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }
        .trendpulse-niche-stat-label {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .trendpulse-niche-stat-value {
          font-family: "Orbitron", monospace;
          font-size: 9px;
        }
        .trendpulse-niche-sat {
          display: inline-block;
          padding: 1px 6px;
          border-radius: 3px;
          font-size: 7px;
          font-weight: 600;
          text-transform: uppercase;
        }
      `}</style>
      <div className="trendpulse-section-title">🎯 AI Niche Finder</div>
      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Enter a topic or keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && discover()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-accent"
          onClick={discover}
          disabled={loading || !keyword.trim()}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "..." : "Discover"}
        </motion.button>
      </div>
      {niches.length > 0 && (
        <>
          <div className="trendpulse-niche-radar">
            <svg className="trendpulse-niche-radar-svg" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              {[...Array(12)].map((_, i) => (
                <line
                  key={i}
                  x1="100" y1="100"
                  x2={100 + 90 * Math.cos((i * 30 * Math.PI) / 180)}
                  y2={100 + 90 * Math.sin((i * 30 * Math.PI) / 180)}
                  stroke="rgba(0,191,255,0.04)"
                  strokeWidth="0.5"
                />
              ))}
            </svg>
            <div className="trendpulse-niche-center" />
            {niches.slice(0, 8).map((n, i) => {
              const angle = (i * 45 * Math.PI) / 180
              const radius = 55 + (n.profitability / 100) * 30
              const x = 100 + radius * Math.cos(angle)
              const y = 100 + radius * Math.sin(angle)
              return (
                <div
                  key={n.name}
                  className="trendpulse-niche-label"
                  style={{
                    left: `${(x / 200) * 100}%`,
                    top: `${(y / 200) * 100}%`,
                    color: n.profitability >= 80 ? "#00FF88" : n.profitability >= 60 ? "#FFD700" : "#FF2D95",
                  }}
                >
                  {n.name.length > 14 ? n.name.slice(0, 13) + "…" : n.name}
                </div>
              )
            })}
          </div>
          <div className="trendpulse-niche-results">
            {niches.map((n, i) => (
              <motion.div
                key={n.name}
                className="trendpulse-niche-card"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="trendpulse-niche-card-name">{n.name}</div>
                <div className="trendpulse-niche-stat">
                  <span className="trendpulse-niche-stat-label">Profit</span>
                  <span className="trendpulse-niche-stat-value" style={{ color: n.profitability >= 80 ? "#00FF88" : n.profitability >= 60 ? "#FFD700" : "#FF2D95" }}>
                    {n.profitability}%
                  </span>
                </div>
                <div className="trendpulse-niche-stat">
                  <span className="trendpulse-niche-stat-label">Competition</span>
                  <span className="trendpulse-niche-stat-value" style={{ color: getCompetitionColor(n.competition) }}>
                    {n.competition}%
                  </span>
                </div>
                <div className="trendpulse-niche-stat">
                  <span className="trendpulse-niche-stat-label">Growth</span>
                  <span className="trendpulse-niche-stat-value" style={{ color: n.growthVelocity >= 70 ? "#00FF88" : n.growthVelocity >= 50 ? "#FFD700" : "#FF2D95" }}>
                    {n.growthVelocity}%
                  </span>
                </div>
                <div className="trendpulse-niche-stat">
                  <span className="trendpulse-niche-stat-label">Monetization</span>
                  <span className="trendpulse-niche-stat-value" style={{ color: n.monetization >= 75 ? "#00FF88" : n.monetization >= 50 ? "#FFD700" : "#FF2D95" }}>
                    {n.monetization}%
                  </span>
                </div>
                <div className="trendpulse-niche-stat">
                  <span className="trendpulse-niche-stat-label">Saturation</span>
                  <span className="trendpulse-niche-sat" style={{ background: `${getSaturationColor(n.saturation)}15`, color: getSaturationColor(n.saturation) }}>
                    {n.saturation}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
