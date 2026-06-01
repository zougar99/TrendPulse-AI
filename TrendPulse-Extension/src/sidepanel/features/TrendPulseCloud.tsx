import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface CloudStatus {
  connected: boolean
  lastSync: string
  deviceName: string
  keywordsSaved: number
  analyticsHistory: number
  backupSize: string
  teamMembers: { email: string; role: string }[]
}

const DEMO_CLOUD: CloudStatus = {
  connected: true,
  lastSync: new Date().toLocaleTimeString(),
  deviceName: "Desktop-PC",
  keywordsSaved: 1284,
  analyticsHistory: 567,
  backupSize: "2.4 GB",
  teamMembers: [
    { email: "alice@trendpulse.ai", role: "Editor" },
    { email: "bob@trendpulse.ai", role: "Viewer" },
  ],
}

export function TrendPulseCloud() {
  const [cloud, setCloud] = useState<CloudStatus>(DEMO_CLOUD)
  const [syncing, setSyncing] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [keywordHistory, setKeywordHistory] = useState("")
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "status" } }, (response) => {
      if (response && response.connected !== undefined) {
        setCloud(response)
      }
    })
  }, [])

  const syncNow = useCallback(() => {
    setSyncing(true)
    chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "sync" } }, (response) => {
      if (response && response.lastSync) {
        setCloud((prev) => ({ ...prev, lastSync: response.lastSync }))
      }
      setSyncing(false)
    })
    setTimeout(() => setSyncing(false), 2500)
  }, [])

  const showStatus = (msg: string) => {
    setStatusMessage(msg)
    setTimeout(() => setStatusMessage(""), 2500)
  }

  return (
    <div className="trendpulse-cloud">
      <h2 className="trendpulse-dash-title">☁ TrendPulse Cloud</h2>
      <p className="trendpulse-dash-subtitle">Sync, backup, and collaborate across devices</p>

      {statusMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            padding: "8px 12px",
            background: "rgba(0,255,136,0.1)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 8,
            fontSize: 11,
            color: "#00FF88",
            marginBottom: 12,
          }}
        >
          {statusMessage}
        </motion.div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          background: "var(--glass-light)",
          border: "1px solid var(--glass-border)",
          borderRadius: 10,
          marginBottom: 16,
        }}
      >
        <motion.div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: cloud.connected ? "#00FF88" : "#FF2D95",
            boxShadow: cloud.connected ? "0 0 12px rgba(0,255,136,0.5)" : "0 0 12px rgba(255,45,149,0.5)",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{cloud.connected ? "Connected" : "Disconnected"}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            Last sync: {cloud.lastSync} · Device: {cloud.deviceName}
          </div>
        </div>
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          style={{ fontSize: 10, padding: "6px 14px" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={syncNow}
          disabled={syncing}
        >
          {syncing ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              ↻
            </motion.span>
          ) : (
            "Sync Now"
          )}
        </motion.button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Keywords Saved", value: cloud.keywordsSaved.toLocaleString(), color: "#00BFFF" },
          { label: "Analytics History", value: cloud.analyticsHistory.toLocaleString(), color: "#8A5CFF" },
          { label: "Backup Size", value: cloud.backupSize, color: "#00FF88" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: 12,
              background: "var(--glass-light)",
              border: "1px solid var(--glass-border)",
              borderRadius: 8,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "Orbitron, monospace", fontSize: 16, fontWeight: 700, color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Keyword History</div>
        <div className="trendpulse-input-group">
          <input
            className="trendpulse-input"
            placeholder="Paste keywords (comma separated)..."
            value={keywordHistory}
            onChange={(e) => setKeywordHistory(e.target.value)}
          />
          <motion.button
            className="trendpulse-btn trendpulse-btn-primary"
            style={{ fontSize: 10, padding: "6px 12px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "save_keywords", data: keywordHistory } })
              showStatus("Keywords saved to cloud ✓")
            }}
          >
            Save
          </motion.button>
          <motion.button
            className="trendpulse-btn trendpulse-btn-secondary"
            style={{ fontSize: 10, padding: "6px 12px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "load_keywords" } }, (response) => {
                if (response) setKeywordHistory(response)
              })
              showStatus("Keywords loaded from cloud ✓")
            }}
          >
            Load
          </motion.button>
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Backup Management</div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button
            className="trendpulse-btn trendpulse-btn-accent"
            style={{ flex: 1, fontSize: 11 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "create_backup" } })
              showStatus("Backup created ✓")
            }}
          >
            Create Backup
          </motion.button>
          <motion.button
            className="trendpulse-btn trendpulse-btn-secondary"
            style={{ flex: 1, fontSize: 11 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "restore_backup" } })
              showStatus("Backup restored ✓")
            }}
          >
            Restore Backup
          </motion.button>
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Team Members</div>
        <div className="trendpulse-input-group">
          <input
            className="trendpulse-input"
            placeholder="Invite by email..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <motion.button
            className="trendpulse-btn trendpulse-btn-primary"
            style={{ fontSize: 10, padding: "6px 12px" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (inviteEmail) {
                chrome.runtime.sendMessage({ type: "CLOUD_SYNC", payload: { action: "invite", email: inviteEmail } })
                setCloud((prev) => ({
                  ...prev,
                  teamMembers: [...prev.teamMembers, { email: inviteEmail, role: "Viewer" }],
                }))
                setInviteEmail("")
                showStatus(`Invited ${inviteEmail} ✓`)
              }
            }}
          >
            Invite
          </motion.button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {cloud.teamMembers.map((m, i) => (
            <motion.div
              key={m.email}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                background: "var(--glass-light)",
                borderRadius: 6,
              }}
            >
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{m.email}</span>
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "rgba(0,191,255,0.1)",
                  color: "#00BFFF",
                }}
              >
                {m.role}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
