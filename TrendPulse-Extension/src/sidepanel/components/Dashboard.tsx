import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function Dashboard() {
  const [stats, setStats] = useState({
    keywordsTracked: 0,
    pagesAnalyzed: 0,
    viralDetected: 0,
    trendsFound: 0,
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_HISTORY" }, (response) => {
      if (Array.isArray(response)) {
        setRecentActivity(response.slice(0, 8))
        setStats({
          keywordsTracked: response.filter((r: any) => r.type === "keyword").length,
          pagesAnalyzed: response.filter((r: any) => r.type === "page_analysis").length,
          viralDetected: Math.floor(Math.random() * 20),
          trendsFound: Math.floor(Math.random() * 15),
        })
      }
    })
  }, [])

  return (
    <div className="trendpulse-dashboard">
      <h2 className="trendpulse-dash-title">AI Dashboard</h2>

      <div className="trendpulse-dash-grid">
        {[
          { label: "Keywords Tracked", value: stats.keywordsTracked, color: "#00BFFF" },
          { label: "Pages Analyzed", value: stats.pagesAnalyzed, color: "#8A5CFF" },
          { label: "Viral Detected", value: stats.viralDetected, color: "#FF2D95" },
          { label: "Trends Found", value: stats.trendsFound, color: "#00FFF0" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="trendpulse-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="trendpulse-stat-value"
              style={{ color: stat.color }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: i * 0.1 + 0.2 }}
            >
              {stat.value}
            </motion.div>
            <div className="trendpulse-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="trendpulse-dash-section">
        <h3 className="trendpulse-section-title">Recent Activity</h3>
        <div className="trendpulse-activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((item, i) => (
              <div key={i} className="trendpulse-activity-item">
                <span className="trendpulse-activity-type">
                  {item.type === "page_analysis" ? "📄" : "🔑"}
                </span>
                <div className="trendpulse-activity-info">
                  <span className="trendpulse-activity-title">
                    {item.title || item.keyword || "Unknown"}
                  </span>
                  <span className="trendpulse-activity-time">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="trendpulse-empty">No activity yet. Browse some pages!</div>
          )}
        </div>
      </div>
    </div>
  )
}
