import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface RadarItem {
  label: string
  value: number
  trend: "up" | "down" | "stable"
  platform: string
}

export function TrendRadar() {
  const [items, setItems] = useState<RadarItem[]>([])

  useEffect(() => {
    const demo: RadarItem[] = [
      { label: "AI Tutorials", value: 92, trend: "up", platform: "YouTube" },
      { label: "Python Tips", value: 85, trend: "up", platform: "YouTube" },
      { label: "Web3", value: 78, trend: "down", platform: "Google" },
      { label: "No-Code", value: 88, trend: "up", platform: "TikTok" },
      { label: "Machine Learning", value: 76, trend: "stable", platform: "YouTube" },
      { label: "React.js", value: 71, trend: "down", platform: "Google" },
      { label: "TypeScript", value: 82, trend: "up", platform: "YouTube" },
      { label: "DevOps", value: 65, trend: "stable", platform: "Google" },
    ]
    setItems(demo)

    chrome.runtime.sendMessage({ type: "GET_TRENDING" }, (response) => {
      if (response?.results) {
        const mapped: RadarItem[] = response.results.slice(0, 8).map((v: any, i: number) => ({
          label: v.title?.split(" ").slice(0, 4).join(" ") || v.title || "Topic",
          value: Math.max(50, 100 - i * 8),
          trend: i < 3 ? "up" : i < 6 ? "stable" : "down",
          platform: "YouTube",
        }))
        setItems(mapped)
      }
    })
  }, [])

  return (
    <div className="trendpulse-radar">
      <div className="trendpulse-radar-header">
        <span className="trendpulse-section-title">🔍 Trend Radar</span>
        <span className="trendpulse-radar-badge">LIVE</span>
      </div>
      <div className="trendpulse-radar-grid">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            className="trendpulse-radar-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="trendpulse-radar-item-header">
              <span className="trendpulse-radar-label">{item.label}</span>
              <span
                className={`trendpulse-radar-trend ${item.trend}`}
              >
                {item.trend === "up" ? "▲" : item.trend === "down" ? "▼" : "◆"}
              </span>
            </div>
            <div className="trendpulse-radar-bar">
              <motion.div
                className="trendpulse-radar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                style={{
                  background: `linear-gradient(90deg, #8A5CFF, ${item.value > 80 ? "#00FF88" : item.value > 60 ? "#00BFFF" : "#FFD700"})`,
                }}
              />
            </div>
            <div className="trendpulse-radar-meta">
              <span className="trendpulse-radar-value">{item.value}</span>
              <span className="trendpulse-radar-platform">{item.platform}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
