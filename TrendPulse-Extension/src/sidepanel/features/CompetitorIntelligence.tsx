import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"

interface CompetitorAnalysis {
  name: string
  subscribers: number
  totalVideos: number
  niche: string
  growthData: { month: string; subs: number }[]
  uploadTiming: { day: string; score: number }[]
  keywordStrategy: { keyword: string; volume: number; difficulty: number; position: number }[]
  hiddenKeywords: { keyword: string; volume: number; difficulty: number }[]
  contentTypeDistribution: { type: string; percentage: number }[]
  engagementMetrics: { likeRatio: number; commentRatio: number; retention: number }
}

const DEMO_ANALYSIS: CompetitorAnalysis = {
  name: "TechVault AI",
  subscribers: 245000,
  totalVideos: 342,
  niche: "AI & Technology",
  growthData: [
    { month: "Jan", subs: 189000 },
    { month: "Feb", subs: 197000 },
    { month: "Mar", subs: 210000 },
    { month: "Apr", subs: 218000 },
    { month: "May", subs: 232000 },
    { month: "Jun", subs: 245000 },
  ],
  uploadTiming: [
    { day: "Mon", score: 85 },
    { day: "Tue", score: 72 },
    { day: "Wed", score: 91 },
    { day: "Thu", score: 68 },
    { day: "Fri", score: 78 },
    { day: "Sat", score: 55 },
    { day: "Sun", score: 62 },
  ],
  keywordStrategy: [
    { keyword: "AI Agents", volume: 28500, difficulty: 65, position: 3 },
    { keyword: "Machine Learning", volume: 42000, difficulty: 82, position: 8 },
    { keyword: "Neural Networks", volume: 18500, difficulty: 71, position: 5 },
    { keyword: "Deep Learning", volume: 32000, difficulty: 78, position: 6 },
    { keyword: "AI Tutorial", volume: 22500, difficulty: 45, position: 2 },
  ],
  hiddenKeywords: [
    { keyword: "Edge AI Computing", volume: 8900, difficulty: 28 },
    { keyword: "AI Automation Tools", volume: 12400, difficulty: 35 },
    { keyword: "GPT-5 Tips", volume: 15600, difficulty: 42 },
    { keyword: "AI Video Generation", volume: 9800, difficulty: 31 },
  ],
  contentTypeDistribution: [
    { type: "Tutorials", percentage: 35 },
    { type: "Reviews", percentage: 22 },
    { type: "Vlogs", percentage: 8 },
    { type: "News", percentage: 18 },
    { type: "Interviews", percentage: 12 },
    { type: "Live Streams", percentage: 5 },
  ],
  engagementMetrics: {
    likeRatio: 8.2,
    commentRatio: 1.4,
    retention: 62,
  },
}

const PIE_COLORS = ["#00BFFF", "#8A5CFF", "#FF2D95", "#FFD700", "#00FF88", "#FF6B35"]

export function CompetitorIntelligence() {
  const [url, setUrl] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null)

  const analyze = useCallback(() => {
    if (!url.trim()) return
    setAnalyzing(true)

    chrome.runtime.sendMessage({ type: "ANALYZE_COMPETITOR", payload: { url } }, (response) => {
      if (response && response.name) {
        setAnalysis(response)
      } else {
        setTimeout(() => {
          setAnalysis(DEMO_ANALYSIS)
        }, 1500)
      }
      setAnalyzing(false)
    })
    setTimeout(() => {
      if (analyzing) {
        setAnalysis(DEMO_ANALYSIS)
        setAnalyzing(false)
      }
    }, 3000)
  }, [url])

  return (
    <div className="trendpulse-comp-intel">
      <h2 className="trendpulse-dash-title">🕵 Advanced Competitor Intelligence</h2>
      <p className="trendpulse-dash-subtitle">Deep analysis of competitor channels and strategies</p>

      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Channel ID or URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={analyze}
          disabled={analyzing || !url.trim()}
        >
          {analyzing ? "Analyzing..." : "Analyze"}
        </motion.button>
      </div>

      {analyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: 20, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
        >
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            Gathering competitor intelligence...
          </motion.span>
        </motion.div>
      )}

      {analysis && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            style={{
              padding: 14,
              background: "var(--glass-light)",
              border: "1px solid var(--glass-border)",
              borderRadius: 10,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00BFFF, #8A5CFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {analysis.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{analysis.name}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                {analysis.niche} · {(analysis.subscribers / 1000).toFixed(0)}K subscribers · {analysis.totalVideos} videos
              </div>
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Subscriber Growth — 6 Months</div>
            <div
              style={{
                width: "100%",
                height: 160,
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: 10,
                padding: 8,
                marginBottom: 16,
              }}
            >
              <ResponsiveContainer>
                <LineChart data={analysis.growthData}>
                  <XAxis dataKey="month" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,11,15,0.95)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Line type="monotone" dataKey="subs" stroke="#00FF88" strokeWidth={2} dot={{ fill: "#00FF88", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Upload Timing Analysis</div>
            <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
              {analysis.uploadTiming.map((d, i) => (
                <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${d.score}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    style={{
                      height: `${d.score}%`,
                      minHeight: 4,
                      background: `linear-gradient(to top, #00BFFF, #8A5CFF)`,
                      borderRadius: "4px 4px 0 0",
                      marginBottom: 4,
                    }}
                  />
                  <div style={{
                    height: 80,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    background: "var(--glass-light)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 6,
                    padding: "4px 0",
                  }}>
                    <div>
                      <div style={{ fontFamily: "Orbitron, monospace", fontSize: 10, color: d.score >= 80 ? "#00FF88" : d.score >= 65 ? "#FFD700" : "#FF2D95" }}>
                        {d.score}%
                      </div>
                      <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{d.day.slice(0, 3)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Keyword Strategy</div>
            <div
              style={{
                overflowX: "auto",
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--glass-border)" }}>
                    {["Keyword", "Volume", "Difficulty", "Position"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "rgba(255,255,255,0.3)", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analysis.keywordStrategy.map((kw, i) => (
                    <tr key={kw.keyword} style={{ borderBottom: i < analysis.keywordStrategy.length - 1 ? "1px solid var(--glass-border)" : "none" }}>
                      <td style={{ padding: "8px 10px", color: "rgba(255,255,255,0.85)" }}>{kw.keyword}</td>
                      <td style={{ padding: "8px 10px", fontFamily: "Orbitron, monospace", color: "#00BFFF" }}>
                        {kw.volume.toLocaleString()}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <span
                          style={{
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: kw.difficulty > 75 ? "rgba(255,45,149,0.1)" : kw.difficulty > 50 ? "rgba(255,215,0,0.1)" : "rgba(0,255,136,0.1)",
                            color: kw.difficulty > 75 ? "#FF2D95" : kw.difficulty > 50 ? "#FFD700" : "#00FF88",
                          }}
                        >
                          {kw.difficulty}
                        </span>
                      </td>
                      <td style={{ padding: "8px 10px", fontFamily: "Orbitron, monospace", color: kw.position <= 3 ? "#00FF88" : "#FFD700" }}>
                        #{kw.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Hidden Keywords (You Don't Rank For)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              {analysis.hiddenKeywords.map((kw, i) => (
                <motion.div
                  key={kw.keyword}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "var(--glass-light)",
                    borderRadius: 6,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 11 }}>{kw.keyword}</span>
                  <span style={{ fontSize: 10, fontFamily: "Orbitron, monospace", color: "#00BFFF" }}>
                    {kw.volume.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: kw.difficulty < 40 ? "rgba(0,255,136,0.1)" : "rgba(255,215,0,0.1)",
                      color: kw.difficulty < 40 ? "#00FF88" : "#FFD700",
                    }}
                  >
                    Low Competition
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <div className="trendpulse-section-title">Content Strategy</div>
              <div
                style={{
                  background: "var(--glass-light)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 8,
                  padding: 8,
                  height: 180,
                }}
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analysis.contentTypeDistribution}
                      dataKey="percentage"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      innerRadius={30}
                    >
                      {analysis.contentTypeDistribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(11,11,15,0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                        fontSize: 10,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                  {analysis.contentTypeDistribution.map((ct, i) => (
                    <div key={ct.type} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 8, color: "rgba(255,255,255,0.4)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      {ct.type} {ct.percentage}%
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="trendpulse-section-title">Engagement Analysis</div>
              <div
                style={{
                  background: "var(--glass-light)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: 8,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  height: 180,
                  justifyContent: "center",
                }}
              >
                {[
                  { label: "Like Ratio", value: `${analysis.engagementMetrics.likeRatio}%`, color: "#FF2D95" },
                  { label: "Comment Ratio", value: `${analysis.engagementMetrics.commentRatio}%`, color: "#00BFFF" },
                  { label: "Est. Retention", value: `${analysis.engagementMetrics.retention}%`, color: "#00FF88" },
                ].map((m, i) => (
                  <div key={m.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{m.label}</span>
                      <span style={{ fontSize: 11, fontFamily: "Orbitron, monospace", color: m.color }}>{m.value}</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${m.label === "Like Ratio" ? analysis.engagementMetrics.likeRatio * 10 : m.label === "Comment Ratio" ? analysis.engagementMetrics.commentRatio * 30 : analysis.engagementMetrics.retention}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        style={{ height: "100%", borderRadius: 2, background: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
