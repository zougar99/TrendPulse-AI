import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"

interface FacelessData {
  nicheIdeas: { niche: string; profitability: number; difficulty: "Easy" | "Medium" | "Hard"; automation: number }[]
  script: { timestamp: string; text: string }[]
  stockFootage: { title: string; description: string }[]
  avatarConcepts: { name: string; style: string; description: string }[]
  workflow: { step: number; action: string; tool: string }[]
}

const DEMO_FACELESS: Record<string, FacelessData> = {
  "AI Tools": {
    nicheIdeas: [
      { niche: "AI Tutorials", profitability: 92, difficulty: "Easy", automation: 88 },
      { niche: "AI Tool Reviews", profitability: 88, difficulty: "Easy", automation: 85 },
      { niche: "AI News Coverage", profitability: 85, difficulty: "Medium", automation: 78 },
      { niche: "AI vs Human", profitability: 90, difficulty: "Easy", automation: 82 },
    ],
    script: [
      { timestamp: "0:00", text: "Welcome to today's deep dive into the most powerful AI tools reshaping our workflow." },
      { timestamp: "0:15", text: "First up, we have the game-changing GPT-5 integration that's taking productivity to new heights." },
      { timestamp: "0:30", text: "What makes this truly revolutionary is its ability to understand context across multiple documents." },
      { timestamp: "0:45", text: "Let me show you a live demonstration of how this saves 10+ hours per week." },
      { timestamp: "1:00", text: "The key insight here is that AI isn't replacing us — it's augmenting our capabilities." },
    ],
    stockFootage: [
      { title: "AI Neural Network Animation", description: "Abstract visualization of neural connections firing, perfect for tech backgrounds" },
      { title: "Futuristic Server Room", description: "Blue-lit server racks with data streams, establishing authority" },
      { title: "AI Interface Demo", description: "Screen recordings of AI tools in action with keyboard overlays" },
      { title: "Data Visualization", description: "Animated charts and graphs showing AI adoption rates" },
    ],
    avatarConcepts: [
      { name: "Neural Host", style: "Cyberpunk", description: "Blue neon humanoid with data-stream background" },
      { name: "AI Mentor", style: "Professional", description: "Clean, minimalist avatar in modern office setting" },
      { name: "Digital Presenter", style: "Futuristic", description: "Holographic presenter with animated infographics" },
    ],
    workflow: [
      { step: 1, action: "Research trending AI topics on TrendPulse", tool: "TrendPulse AI" },
      { step: 2, action: "Generate voiceover script using AI", tool: "Script Generator" },
      { step: 3, action: "Create AI voiceover with ElevenLabs or similar", tool: "Voice AI" },
      { step: 4, action: "Gather stock footage from library", tool: "Stock Library" },
      { step: 5, action: "Edit video with automated AI editing tools", tool: "Video Editor" },
      { step: 6, action: "Generate thumbnail with AI art", tool: "Thumbnail AI" },
    ],
  },
  Default: {
    nicheIdeas: [
      { niche: "Faceless Storytelling", profitability: 86, difficulty: "Easy", automation: 82 },
      { niche: "Finance Tips", profitability: 90, difficulty: "Medium", automation: 76 },
      { niche: "Top 10 Lists", profitability: 82, difficulty: "Easy", automation: 90 },
      { niche: "Motivational Content", profitability: 78, difficulty: "Easy", automation: 84 },
    ],
    script: [
      { timestamp: "0:00", text: "Here's something most creators won't tell you about building a faceless channel." },
      { timestamp: "0:15", text: "The secret isn't in the voice or the face — it's in the value you provide." },
      { timestamp: "0:30", text: "By automating the right parts of your workflow, you can scale to 10 videos per week." },
      { timestamp: "0:45", text: "Let's break down the exact system that top faceless creators use." },
      { timestamp: "1:00", text: "Step one: Find a trending niche with high search volume but low competition." },
    ],
    stockFootage: [
      { title: "Abstract Motion Backgrounds", description: "Smooth flowing gradients and particle systems" },
      { title: "Nature Time-Lapses", description: "Calming nature scenes for ambient background" },
      { title: "City Life Montage", description: "Urban footage for lifestyle and finance content" },
      { title: "Technology Interface", description: "HUD-style overlays for tech content" },
    ],
    avatarConcepts: [
      { name: "Minimalist Icon", style: "Flat Design", description: "Simple, clean icon avatar with brand colors" },
      { name: "Animated Character", style: "2D Animation", description: "Cartoon-style character with expressive animations" },
      { name: "Abstract Logo", style: "Motion Graphics", description: "Animated logo that serves as channel identity" },
    ],
    workflow: [
      { step: 1, action: "Choose a niche and research keywords", tool: "TrendPulse" },
      { step: 2, action: "Write script using AI writing assistant", tool: "AI Writer" },
      { step: 3, action: "Generate AI voiceover", tool: "Text-to-Speech" },
      { step: 4, action: "Source or generate background footage", tool: "Asset Library" },
      { step: 5, action: "Edit and compile video", tool: "Video Editor" },
      { step: 6, action: "Schedule and publish", tool: "Content Calendar" },
    ],
  },
}

export function FacelessContent() {
  const [niche, setNiche] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("Default")
  const [data, setData] = useState<FacelessData>(DEMO_FACELESS["Default"])
  const [generating, setGenerating] = useState(false)

  const generate = useCallback(() => {
    const nicheKey = niche.trim() || "Default"
    setSelectedNiche(nicheKey)
    setGenerating(true)

    chrome.runtime.sendMessage({ type: "GENERATE_FACELESS", payload: { niche: nicheKey } }, (response) => {
      if (response && response.nicheIdeas) {
        setData(response)
      } else {
        setData(DEMO_FACELESS[nicheKey] || DEMO_FACELESS["Default"])
      }
      setGenerating(false)
    })
    setTimeout(() => {
      if (generating) {
        setData(DEMO_FACELESS[nicheKey] || DEMO_FACELESS["Default"])
        setGenerating(false)
      }
    }, 2000)
  }, [niche])

  return (
    <div className="trendpulse-faceless">
      <h2 className="trendpulse-dash-title">🎭 Faceless Content Mode</h2>
      <p className="trendpulse-dash-subtitle">Automated content creation without showing your face</p>

      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Enter a niche (e.g. AI Tools, Finance, Storytelling)..."
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={generate}
          disabled={generating}
        >
          {generating ? "Generating..." : "Generate"}
        </motion.button>
      </div>

      {generating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: 20, fontSize: 12, color: "rgba(255,255,255,0.5)" }}
        >
          <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            Generating faceless content strategy...
          </motion.span>
        </motion.div>
      )}

      {!generating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Faceless Niche Ideas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.nicheIdeas.map((n, i) => (
                <motion.div
                  key={n.niche}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    background: "var(--glass-light)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 8,
                  }}
                >
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{n.niche}</span>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Profit</span>
                    <span style={{ fontSize: 11, fontFamily: "Orbitron, monospace", color: "#00FF88" }}>{n.profitability}%</span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: n.difficulty === "Easy" ? "rgba(0,255,136,0.1)" : n.difficulty === "Medium" ? "rgba(255,215,0,0.1)" : "rgba(255,45,149,0.1)",
                        color: n.difficulty === "Easy" ? "#00FF88" : n.difficulty === "Medium" ? "#FFD700" : "#FF2D95",
                      }}
                    >
                      {n.difficulty}
                    </span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Auto: {n.automation}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Script Generator — "{selectedNiche}"</div>
            <div
              style={{
                padding: 12,
                background: "var(--glass-light)",
                border: "1px solid var(--glass-border)",
                borderRadius: 8,
              }}
            >
              {data.script.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "6px 0",
                    borderBottom: i < data.script.length - 1 ? "1px solid var(--glass-border)" : "none",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ fontFamily: "Orbitron, monospace", fontSize: 9, color: "#00BFFF", flexShrink: 0, width: 35 }}>
                    {s.timestamp}
                  </span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Stock Footage Ideas</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.stockFootage.map((sf, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    padding: "8px 10px",
                    background: "var(--glass-light)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{sf.title}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sf.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">AI Avatar Concepts</div>
            <div style={{ display: "flex", gap: 8 }}>
              {data.avatarConcepts.map((av, i) => (
                <motion.div
                  key={av.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    flex: 1,
                    padding: 12,
                    background: `linear-gradient(135deg, rgba(0,191,255,${0.05 + i * 0.02}), rgba(138,92,255,${0.05 + i * 0.02}))`,
                    border: "1px solid var(--glass-border)",
                    borderRadius: 8,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, hsl(${i * 120}, 70%, 60%), hsl(${i * 120 + 50}, 80%, 50%))`,
                      margin: "0 auto 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    🎭
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{av.name}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", margin: "2px 0" }}>{av.style}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>{av.description}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="trendpulse-dash-section">
            <div className="trendpulse-section-title">Automation Workflow</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {data.workflow.map((w, i) => (
                <motion.div
                  key={w.step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 10px",
                    background: "var(--glass-light)",
                    borderRadius: 6,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #00BFFF, #8A5CFF)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      fontFamily: "Orbitron, monospace",
                      flexShrink: 0,
                    }}
                  >
                    {w.step}
                  </span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{w.action}</span>
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(0,191,255,0.1)",
                      color: "#00BFFF",
                    }}
                  >
                    {w.tool}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
