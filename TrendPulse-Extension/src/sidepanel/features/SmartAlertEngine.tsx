import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Priority = "urgent" | "high" | "medium" | "low"

interface Alert {
  id: string
  icon: string
  message: string
  timestamp: number
  priority: Priority
  type: string
}

const PRIORITY_CONFIG: Record<Priority, { color: string; label: string }> = {
  urgent: { color: "#FF2D95", label: "Urgent" },
  high: { color: "#FFD700", label: "High" },
  medium: { color: "#00BFFF", label: "Medium" },
  low: { color: "#8A5CFF", label: "Low" },
}

const ALERT_TYPES = [
  "Trend detected early",
  "Keyword growth acceleration",
  "Potential viral topic",
  "Competitor spike",
  "Ranking opportunity",
]

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const DEMO_ALERTS: Alert[] = [
  { id: "1", icon: "🔥", message: "AI Agents keyword trending +340% in last 2 hours", timestamp: Date.now() - 120000, priority: "urgent", type: "Trend detected early" },
  { id: "2", icon: "⚡", message: "Rust programming showing accelerated growth pattern", timestamp: Date.now() - 600000, priority: "high", type: "Keyword growth acceleration" },
  { id: "3", icon: "📈", message: "Edge Computing topic approaching viral threshold", timestamp: Date.now() - 1800000, priority: "medium", type: "Potential viral topic" },
  { id: "4", icon: "👀", message: "Competitor Channel A spiked in keyword coverage", timestamp: Date.now() - 3600000, priority: "high", type: "Competitor spike" },
  { id: "5", icon: "🎯", message: "Ranking opportunity: Web Assembly (low competition)", timestamp: Date.now() - 7200000, priority: "medium", type: "Ranking opportunity" },
  { id: "6", icon: "📊", message: "Quantum ML keyword difficulty dropped 15 points", timestamp: Date.now() - 14400000, priority: "low", type: "Ranking opportunity" },
]

export function SmartAlertEngine() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showConfig, setShowConfig] = useState(false)
  const [config, setConfig] = useState({
    desktop: true,
    email: false,
    telegram: false,
    discord: false,
  })

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_ALERTS" }, (response) => {
      if (Array.isArray(response)) {
        setAlerts(response)
      } else {
        setAlerts(DEMO_ALERTS)
      }
    })
  }, [])

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    chrome.runtime.sendMessage({ type: "DISMISS_ALERT", payload: { id } })
  }, [])

  return (
    <div className="trendpulse-alert-engine">
      <div className="trendpulse-dash-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 className="trendpulse-dash-title">⚠ Smart Alert Engine</h2>
        <motion.button
          className="trendpulse-btn trendpulse-btn-secondary"
          style={{ fontSize: 10, padding: "6px 12px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConfig(!showConfig)}
        >
          Configure Alerts
        </motion.button>
      </div>
      <p className="trendpulse-dash-subtitle">Real-time intelligence alerts ({alerts.length} active)</p>

      <AnimatePresence>
        {showConfig && (
          <motion.div
            className="trendpulse-alert-config"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden", marginBottom: 12 }}
          >
            <div style={{ background: "var(--glass-light)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: 12 }}>
              <div className="trendpulse-section-title">Notification Channels</div>
              {(["desktop", "email", "telegram", "discord"] as const).map((ch) => (
                <div key={ch} className="trendpulse-settings-toggle-row">
                  <span style={{ textTransform: "capitalize" }}>{ch}</span>
                  <label className="trendpulse-toggle">
                    <input
                      type="checkbox"
                      checked={config[ch]}
                      onChange={(e) => setConfig({ ...config, [ch]: e.target.checked })}
                    />
                    <span className="trendpulse-toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="trendpulse-alert-list" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <AnimatePresence>
          {alerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              className="trendpulse-alert-card"
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0, padding: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: "var(--glass-light)",
                border: `1px solid ${PRIORITY_CONFIG[alert.priority].color}22`,
                borderLeft: `3px solid ${PRIORITY_CONFIG[alert.priority].color}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <span style={{ fontSize: 16 }}>{alert.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", lineHeight: 1.3 }}>{alert.message}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: PRIORITY_CONFIG[alert.priority].color, fontWeight: 600 }}>
                    {PRIORITY_CONFIG[alert.priority].label}
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{timeAgo(alert.timestamp)}</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>{alert.type}</span>
                </div>
              </div>
              <motion.button
                className="trendpulse-btn-ghost"
                style={{ fontSize: 14, padding: "2px 6px", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}
                whileHover={{ color: "#FF2D95", scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dismissAlert(alert.id)}
              >
                ✕
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length === 0 && (
        <div className="trendpulse-empty">All clear! No active alerts.</div>
      )}
    </div>
  )
}
