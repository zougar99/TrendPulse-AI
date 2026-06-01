import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"

interface TrendCard {
  id: string
  name: string
  category: string
  velocity: number
  momentum: number
  mentions: number
  accelerating: boolean
}

const CATEGORIES = ["Breaking", "AI", "Crypto", "Gaming", "Celebrity", "Finance"]

const DEMO_TRENDS: TrendCard[] = [
  { id: "1", name: "AI Agents", category: "AI", velocity: 94, momentum: 88, mentions: 28500, accelerating: true },
  { id: "2", name: "BTC Halving", category: "Crypto", velocity: 91, momentum: 76, mentions: 22300, accelerating: true },
  { id: "3", name: "Rust 2.0", category: "Breaking", velocity: 87, momentum: 82, mentions: 19400, accelerating: false },
  { id: "4", name: "Edge AI Chips", category: "AI", velocity: 85, momentum: 79, mentions: 16700, accelerating: true },
  { id: "5", name: "Web3 Gaming", category: "Gaming", velocity: 78, momentum: 71, mentions: 14200, accelerating: false },
  { id: "6", name: "Taylor Swift AI", category: "Celebrity", velocity: 82, momentum: 65, mentions: 32100, accelerating: false },
  { id: "7", name: "DeFi 2.0", category: "Crypto", velocity: 76, momentum: 73, mentions: 12800, accelerating: true },
  { id: "8", name: "Quantum Finance", category: "Finance", velocity: 72, momentum: 68, mentions: 9600, accelerating: false },
]

function generateRandomTrends(): TrendCard[] {
  const names = ["AI Agents", "BTC Halving", "Rust 2.0", "Edge AI Chips", "Web3 Gaming", "Taylor Swift AI", "DeFi 2.0", "Quantum Finance", "Neural Interfaces", "Green Mining", "AI Music", "Space Tourism", "Robotaxis", "BioPrinting", "Dark Web AI"]
  return names.slice(0, 8).map((name, i) => ({
    id: `${i}`,
    name,
    category: CATEGORIES[i % CATEGORIES.length],
    velocity: 50 + Math.floor(Math.random() * 45),
    momentum: 50 + Math.floor(Math.random() * 40),
    mentions: 5000 + Math.floor(Math.random() * 30000),
    accelerating: Math.random() > 0.5,
  }))
}

export function RealTimeTrendEngine() {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [trends, setTrends] = useState<TrendCard[]>(DEMO_TRENDS)
  const [loading, setLoading] = useState(true)

  const fetchTrends = useCallback(() => {
    chrome.runtime.sendMessage({ type: "GET_REALTIME_TRENDS", payload: { category: activeCategory === "All" ? undefined : activeCategory } }, (response) => {
      if (Array.isArray(response)) {
        setTrends(response)
      }
    })
  }, [activeCategory])

  useEffect(() => {
    fetchTrends()
    setLoading(false)
    const interval = setInterval(() => {
      setTrends((prev) =>
        prev.map((t) => ({
          ...t,
          velocity: Math.min(99, Math.max(40, t.velocity + Math.floor(Math.random() * 10 - 5))),
          momentum: Math.min(99, Math.max(30, t.momentum + Math.floor(Math.random() * 8 - 4))),
          mentions: t.mentions + Math.floor(Math.random() * 500 - 200),
          accelerating: Math.random() > 0.6,
        }))
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [fetchTrends])

  const filtered = activeCategory === "All" ? trends : trends.filter((t) => t.category === activeCategory)

  return (
    <div className="trendpulse-realtime">
      <h2 className="trendpulse-dash-title">📡 Real-Time Trend Engine</h2>
      <p className="trendpulse-dash-subtitle">Live trend velocity and momentum tracking</p>

      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 100,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        {[40, 70, 100].map((size, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid rgba(0,191,255,${0.3 - i * 0.08})`,
              opacity: 0.6,
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#00FF88",
            boxShadow: "0 0 20px rgba(0,255,136,0.6)",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {["All", ...CATEGORIES].map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              background: activeCategory === cat
                ? "linear-gradient(135deg, #00BFFF, #8A5CFF)"
                : "var(--glass-light)",
              color: activeCategory === cat ? "#fff" : "rgba(255,255,255,0.5)",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              padding: 10,
              background: trend.accelerating
                ? "linear-gradient(135deg, rgba(255,45,149,0.08), rgba(255,215,0,0.05))"
                : "var(--glass-light)",
              border: `1px solid ${trend.accelerating ? "rgba(255,45,149,0.2)" : "var(--glass-border)"}`,
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <motion.div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: trend.accelerating ? "#FF2D95" : "#00BFFF",
                  boxShadow: `0 0 8px ${trend.accelerating ? "rgba(255,45,149,0.5)" : "rgba(0,191,255,0.5)"}`,
                  flexShrink: 0,
                }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{trend.name}</span>
                  <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                    {trend.category}
                  </span>
                  {trend.accelerating && (
                    <span
                      style={{
                        fontSize: 8,
                        padding: "1px 5px",
                        borderRadius: 3,
                        background: "rgba(255,45,149,0.15)",
                        color: "#FF2D95",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                      }}
                    >
                      ACCELERATING
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                    Velocity: <span style={{ color: "#00FF88", fontFamily: "Orbitron, monospace" }}>{trend.velocity}</span>
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                    Momentum: <span style={{ color: "#00BFFF", fontFamily: "Orbitron, monospace" }}>{trend.momentum}</span>
                  </span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
                    Mentions: <span style={{ color: "#8A5CFF", fontFamily: "Orbitron, monospace" }}>{trend.mentions.toLocaleString()}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
