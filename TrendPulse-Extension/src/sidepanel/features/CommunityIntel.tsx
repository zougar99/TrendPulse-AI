import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CommunityData {
  heatmap: number[][] // 10x10 grid of 0-1 intensity
  risingKeywords: { keyword: string; direction: "up" | "down"; growth: number; users: number }[]
  hiddenOpportunities: { niche: string; score: number; competition: "Low" | "Medium" | "High" }[]
  nicheAcceleration: { niche: string; acceleration: number; momentum: "Rising" | "Stable" | "Cooling" }[]
  emergingCreators: { name: string; followers: number; growth: number }[]
}

const DEMO_DATA: CommunityData = {
  heatmap: Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => Math.random())
  ),
  risingKeywords: [
    { keyword: "AI Agents", direction: "up", growth: 340, users: 28500 },
    { keyword: "Rust Programming", direction: "up", growth: 215, users: 18200 },
    { keyword: "Edge Computing", direction: "up", growth: 178, users: 12400 },
    { keyword: "Web Assembly", direction: "up", growth: 145, users: 9800 },
    { keyword: "Quantum ML", direction: "up", growth: 112, users: 7600 },
  ],
  hiddenOpportunities: [
    { niche: "AI Video Editing", score: 92, competition: "Low" },
    { niche: "No-Code Automation", score: 88, competition: "Medium" },
    { niche: "Prompt Engineering", score: 85, competition: "Low" },
    { niche: "Digital Twins", score: 79, competition: "Low" },
    { niche: "Synthetic Data", score: 74, competition: "Medium" },
  ],
  nicheAcceleration: [
    { niche: "AI Content Creation", acceleration: 89, momentum: "Rising" },
    { niche: "DeFi Gaming", acceleration: 72, momentum: "Rising" },
    { niche: "Green Tech", acceleration: 58, momentum: "Stable" },
    { niche: "Metaverse Dev", acceleration: 45, momentum: "Cooling" },
    { niche: "Bio Hacking", acceleration: 63, momentum: "Rising" },
  ],
  emergingCreators: [
    { name: "TechVault AI", followers: 245000, growth: 12.4 },
    { name: "CodeCraft Labs", followers: 189000, growth: 9.8 },
    { name: "FutureScope", followers: 156000, growth: 8.2 },
    { name: "Neural Bytes", followers: 128000, growth: 6.7 },
    { name: "DataDriven", followers: 98000, growth: 5.3 },
  ],
}

function HeatmapCell({ value, delay }: { value: number; delay: number }) {
  const intensity = Math.floor(value * 100)
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.02, type: "spring", stiffness: 100 }}
      style={{
        aspectRatio: "1",
        borderRadius: 3,
        background: `rgba(255,45,149,${value * 0.5})`,
        boxShadow: value > 0.5 ? `0 0 6px rgba(255,45,149,${value * 0.3})` : "none",
      }}
    />
  )
}

function StaggerList({ children, baseDelay = 0 }: { children: React.ReactNode[]; baseDelay?: number }) {
  return (
    <>
      {children.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: baseDelay + i * 0.05 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  )
}

export function CommunityIntel() {
  const [data, setData] = useState<CommunityData>(DEMO_DATA)

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_COMMUNITY_INTEL" }, (response) => {
      if (response && response.heatmap) {
        setData(response)
      }
    })
  }, [])

  return (
    <div className="trendpulse-community">
      <h2 className="trendpulse-dash-title">🌐 Community Intelligence</h2>
      <p className="trendpulse-dash-subtitle">Collective trend insights from the TrendPulse network</p>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Collective Intelligence Heatmap</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 2,
            padding: 6,
            background: "var(--glass-light)",
            border: "1px solid var(--glass-border)",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          {data.heatmap.flat().map((val, i) => (
            <HeatmapCell key={i} value={val} delay={i} />
          ))}
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Rising Keywords</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StaggerList>
            {data.risingKeywords.map((kw, i) => (
              <div
                key={kw.keyword}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "var(--glass-light)",
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 11, fontFamily: "Orbitron, monospace", color: "rgba(255,255,255,0.3)", width: 24 }}>
                  #{i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{kw.keyword}</span>
                <span style={{ color: kw.direction === "up" ? "#00FF88" : "#FF2D95", fontSize: 10 }}>
                  {kw.direction === "up" ? "▲" : "▼"} {kw.growth}%
                </span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                  {kw.users.toLocaleString()} users
                </span>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Hidden Opportunities</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StaggerList baseDelay={0.3}>
            {data.hiddenOpportunities.map((opp, i) => (
              <div
                key={opp.niche}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "var(--glass-light)",
                  borderRadius: 6,
                }}
              >
                <span style={{ flex: 1, fontSize: 12 }}>{opp.niche}</span>
                <span style={{ fontSize: 10, fontFamily: "Orbitron, monospace", color: "#00BFFF" }}>
                  {opp.score}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: opp.competition === "Low"
                      ? "rgba(0,255,136,0.1)"
                      : opp.competition === "Medium"
                        ? "rgba(255,215,0,0.1)"
                        : "rgba(255,45,149,0.1)",
                    color: opp.competition === "Low"
                      ? "#00FF88"
                      : opp.competition === "Medium"
                        ? "#FFD700"
                        : "#FF2D95",
                  }}
                >
                  {opp.competition}
                </span>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Niche Acceleration</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StaggerList baseDelay={0.5}>
            {data.nicheAcceleration.map((n, i) => (
              <div
                key={n.niche}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "var(--glass-light)",
                  borderRadius: 6,
                }}
              >
                <span style={{ flex: 1, fontSize: 12 }}>{n.niche}</span>
                <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${n.acceleration}%` }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                    style={{
                      height: "100%",
                      borderRadius: 2,
                      background: `linear-gradient(90deg, #00BFFF, ${n.acceleration > 70 ? "#FF2D95" : "#FFD700"})`,
                    }}
                  />
                </div>
                <span style={{ fontSize: 10, fontFamily: "Orbitron, monospace", color: n.acceleration > 70 ? "#FF2D95" : "#FFD700" }}>
                  {n.acceleration}%
                </span>
                <span
                  style={{
                    fontSize: 9,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: n.momentum === "Rising"
                      ? "rgba(0,255,136,0.1)"
                      : n.momentum === "Stable"
                        ? "rgba(255,215,0,0.1)"
                        : "rgba(0,191,255,0.1)",
                    color: n.momentum === "Rising"
                      ? "#00FF88"
                      : n.momentum === "Stable"
                        ? "#FFD700"
                        : "#00BFFF",
                  }}
                >
                  {n.momentum}
                </span>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Emerging Creators</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <StaggerList baseDelay={0.7}>
            {data.emergingCreators.map((c, i) => (
              <div
                key={c.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "var(--glass-light)",
                  borderRadius: 6,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, hsl(${i * 72}, 70%, 60%), hsl(${i * 72 + 40}, 80%, 50%))`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {c.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>
                    {c.followers.toLocaleString()} followers
                  </div>
                </div>
                <span style={{ fontSize: 11, fontFamily: "Orbitron, monospace", color: "#00FF88" }}>
                  +{c.growth}%
                </span>
              </div>
            ))}
          </StaggerList>
        </div>
      </div>
    </div>
  )
}
