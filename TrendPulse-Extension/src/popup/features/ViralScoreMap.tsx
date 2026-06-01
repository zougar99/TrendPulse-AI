import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Hotspot {
  country: string
  score: number
  growth: number
  volume: number
  x: number
  y: number
}

interface AgeData {
  range: string
  value: number
}

interface DeviceData {
  type: string
  percentage: number
  color: string
}

interface ViralMapData {
  hotspots: Hotspot[]
  demographics: { age: AgeData[]; device: DeviceData[] }
}

export function ViralScoreMap() {
  const [data, setData] = useState<ViralMapData | null>(null)

  useEffect(() => {
    const demo: ViralMapData = {
      hotspots: [
        { country: "USA", score: 94, growth: 12.4, volume: 28400, x: 22, y: 32 },
        { country: "India", score: 91, growth: 18.7, volume: 45200, x: 58, y: 42 },
        { country: "Brazil", score: 87, growth: 15.2, volume: 18300, x: 38, y: 55 },
        { country: "UK", score: 82, growth: 8.9, volume: 12100, x: 48, y: 25 },
        { country: "Japan", score: 79, growth: 6.3, volume: 9400, x: 72, y: 28 },
        { country: "Germany", score: 76, growth: 7.1, volume: 8700, x: 50, y: 22 },
        { country: "Australia", score: 74, growth: 5.8, volume: 5200, x: 80, y: 58 },
        { country: "Canada", score: 71, growth: 4.2, volume: 4800, x: 18, y: 18 },
      ],
      demographics: {
        age: [
          { range: "13-17", value: 12 },
          { range: "18-24", value: 35 },
          { range: "25-34", value: 28 },
          { range: "35-44", value: 15 },
          { range: "45+", value: 10 },
        ],
        device: [
          { type: "Mobile", percentage: 68, color: "#00BFFF" },
          { type: "Desktop", percentage: 21, color: "#8A5CFF" },
          { type: "Tablet", percentage: 11, color: "#00FFF0" },
        ],
      },
    }
    setData(demo)
    chrome.runtime.sendMessage({ type: "GET_VIRAL_MAP" }, (response) => {
      if (response?.map) {
        setData(response.map)
      }
    })
  }, [])

  if (!data) {
    return <div className="trendpulse-empty">Loading viral map...</div>
  }

  return (
    <div className="trendpulse-viral-score-map">
      <style>{`
        @keyframes pulse-wave {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
          100% { transform: translate(-50%,-50%) scale(3); opacity: 0; }
        }
        @keyframes globe-spin {
          from { background-position: 0 0; }
          to { background-position: 200% 0; }
        }
        .trendpulse-globe {
          position: relative;
          width: 100%;
          height: 180px;
          border-radius: 50%;
          background:
            radial-gradient(ellipse at 30% 30%, rgba(0,191,255,0.05), transparent 60%),
            radial-gradient(ellipse at 70% 40%, rgba(138,92,255,0.05), transparent 60%),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,191,255,0.03) 40px, rgba(0,191,255,0.03) 41px),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(138,92,255,0.03) 40px, rgba(138,92,255,0.03) 41px);
          background-color: rgba(11,11,15,0.9);
          border: 1px solid rgba(0,191,255,0.15);
          overflow: hidden;
          margin-bottom: 12px;
        }
        .trendpulse-globe-overlay {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, transparent 40%, rgba(11,11,15,0.8) 100%);
        }
        .trendpulse-globe-grid {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,255,240,0.04) 20px, rgba(0,255,240,0.04) 21px);
          animation: globe-spin 20s linear infinite;
        }
        .trendpulse-hotspot {
          position: absolute;
          transform: translate(-50%, -50%);
          cursor: pointer;
        }
        .trendpulse-hotspot-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FF2D95;
          box-shadow: 0 0 12px rgba(255,45,149,0.6);
        }
        .trendpulse-hotspot-ring {
          position: absolute;
          top: 50%; left: 50%;
          width: 12px; height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255,45,149,0.3);
          animation: pulse-wave 2s ease-out infinite;
        }
        .trendpulse-hotspot-label {
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 7px;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 0 8px rgba(0,0,0,0.9);
          white-space: nowrap;
          letter-spacing: 0.5px;
        }
        .trendpulse-map-stats {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }
        .trendpulse-map-stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 10px;
          background: rgba(255,255,255,0.02);
          border-radius: 6px;
          border-left: 2px solid;
        }
        .trendpulse-map-stat-country {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          width: 56px;
        }
        .trendpulse-map-stat-score {
          font-family: "Orbitron", monospace;
          font-size: 12px;
          color: #00FFF0;
          width: 28px;
          text-align: center;
        }
        .trendpulse-map-stat-growth {
          font-size: 10px;
          width: 44px;
          text-align: center;
        }
        .trendpulse-map-stat-volume {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          width: 52px;
          text-align: right;
        }
        .trendpulse-demographics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 0;
        }
        .trendpulse-demo-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 10px;
        }
        .trendpulse-demo-title {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.3);
          margin-bottom: 8px;
        }
        .trendpulse-age-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 3px;
        }
        .trendpulse-age-label {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          width: 30px;
        }
        .trendpulse-age-bar {
          flex: 1;
          height: 6px;
          background: rgba(255,255,255,0.04);
          border-radius: 3px;
          overflow: hidden;
        }
        .trendpulse-age-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #8A5CFF, #00BFFF);
        }
        .trendpulse-age-value {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          width: 20px;
          text-align: right;
          color: rgba(255,255,255,0.4);
        }
        .trendpulse-device-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }
        .trendpulse-device-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .trendpulse-device-label {
          font-size: 9px;
          color: rgba(255,255,255,0.5);
          flex: 1;
        }
        .trendpulse-device-bar {
          width: 40px;
          height: 4px;
          background: rgba(255,255,255,0.04);
          border-radius: 2px;
          overflow: hidden;
        }
        .trendpulse-device-fill {
          height: 100%;
          border-radius: 2px;
        }
        .trendpulse-device-value {
          font-family: "Orbitron", monospace;
          font-size: 9px;
          width: 26px;
          text-align: right;
          color: rgba(255,255,255,0.4);
        }
      `}</style>
      <div className="trendpulse-section-title">🌍 Viral Score Map</div>
      <div className="trendpulse-globe">
        <div className="trendpulse-globe-overlay" />
        <div className="trendpulse-globe-grid" />
        {data.hotspots.map((h) => (
          <div
            key={h.country}
            className="trendpulse-hotspot"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            <div className="trendpulse-hotspot-label">{h.country}</div>
            <div className="trendpulse-hotspot-ring" />
            <motion.div
              className="trendpulse-hotspot-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>
      <div className="trendpulse-section-title">Regional Stats</div>
      <div className="trendpulse-map-stats">
        {data.hotspots.map((h, i) => (
          <motion.div
            key={h.country}
            className="trendpulse-map-stat-row"
            style={{ borderLeftColor: h.score > 85 ? "#00FF88" : h.score > 75 ? "#FFD700" : "#FF2D95" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <span className="trendpulse-map-stat-country">{h.country}</span>
            <span className="trendpulse-map-stat-score">{h.score}</span>
            <span className="trendpulse-map-stat-growth" style={{ color: h.growth > 0 ? "#00FF88" : "#FF2D95" }}>
              {h.growth > 0 ? "+" : ""}{h.growth}%
            </span>
            <span className="trendpulse-map-stat-volume">{h.volume.toLocaleString()}</span>
          </motion.div>
        ))}
      </div>
      <div className="trendpulse-demographics">
        <div className="trendpulse-demo-card">
          <div className="trendpulse-demo-title">Age Targeting</div>
          {data.demographics.age.map((a) => (
            <div className="trendpulse-age-row" key={a.range}>
              <span className="trendpulse-age-label">{a.range}</span>
              <div className="trendpulse-age-bar">
                <motion.div
                  className="trendpulse-age-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${a.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="trendpulse-age-value">{a.value}%</span>
            </div>
          ))}
        </div>
        <div className="trendpulse-demo-card">
          <div className="trendpulse-demo-title">Device Analytics</div>
          {data.demographics.device.map((d) => (
            <div className="trendpulse-device-row" key={d.type}>
              <div className="trendpulse-device-dot" style={{ background: d.color }} />
              <span className="trendpulse-device-label">{d.type}</span>
              <div className="trendpulse-device-bar">
                <motion.div
                  className="trendpulse-device-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${d.percentage}%` }}
                  transition={{ duration: 0.5 }}
                  style={{ background: d.color }}
                />
              </div>
              <span className="trendpulse-device-value">{d.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
