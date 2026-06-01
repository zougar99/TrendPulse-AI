import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dashboard } from "./components/Dashboard"
import { CompetitorSpy } from "./components/CompetitorSpy"
import { ViralHeatmap } from "./components/ViralHeatmap"
import { Settings } from "./components/Settings"
import { SmartAlertEngine } from "./features/SmartAlertEngine"
import { TitlePsychology } from "./features/TitlePsychology"
import { AIContentCalendar } from "./features/AIContentCalendar"
import { TrendPulseCloud } from "./features/TrendPulseCloud"
import { CommunityIntel } from "./features/CommunityIntel"
import { ScreenshotAnalyzer } from "./features/ScreenshotAnalyzer"
import { RealTimeTrendEngine } from "./features/RealTimeTrendEngine"
import { FacelessContent } from "./features/FacelessContent"
import { CompetitorIntelligence } from "./features/CompetitorIntelligence"
import "../styles/global.css"

type Section = "dashboard" | "spy" | "heatmap" | "settings" | "alerts" | "titles" | "calendar" | "cloud" | "community" | "screenshot" | "realtime" | "faceless" | "competitor"

export default function SidePanel() {
  const [section, setSection] = useState<Section>("dashboard")
  const [isCompact, setIsCompact] = useState(false)

  const nav: { id: Section; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "◎" },
    { id: "spy", label: "Spy", icon: "🕵" },
    { id: "heatmap", label: "Heatmap", icon: "🔥" },
    { id: "alerts", label: "Alerts", icon: "🔔" },
    { id: "titles", label: "Titles", icon: "📝" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "cloud", label: "Cloud", icon: "☁" },
    { id: "community", label: "Community", icon: "👥" },
    { id: "screenshot", label: "Screenshot", icon: "📸" },
    { id: "realtime", label: "Real-Time", icon: "⚡" },
    { id: "faceless", label: "Faceless", icon: "🎭" },
    { id: "competitor", label: "Competitor", icon: "🏆" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ]

  return (
    <div className={`trendpulse-sidepanel ${isCompact ? "compact" : ""}`}>
      <style>{`
        .trendpulse-sidepanel {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #0B0B0F;
          color: #fff;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .trendpulse-sidepanel-nav {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 8px;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.04);
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex-shrink: 0;
          max-height: 50vh;
        }
        .trendpulse-sidepanel-nav::-webkit-scrollbar {
          display: none;
        }
        .trendpulse-sidepanel-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          margin-bottom: 4px;
        }
        .trendpulse-sidepanel-logo {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: linear-gradient(135deg, #00BFFF, #8A5CFF);
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: 12px;
          color: #fff;
          flex-shrink: 0;
        }
        .trendpulse-sidepanel-title {
          font-family: 'Orbitron', monospace;
          font-size: 13px;
          font-weight: 700;
          background: linear-gradient(90deg, #00BFFF, #00FFF0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .trendpulse-sidepanel-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 11px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          text-align: left;
          width: 100%;
        }
        .trendpulse-sidepanel-nav-btn:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.03);
        }
        .trendpulse-sidepanel-nav-btn.active {
          color: #00FFF0;
          background: rgba(0,255,240,0.06);
          border-left: 2px solid #00FFF0;
        }
        .trendpulse-nav-icon { font-size: 13px; width: 20px; text-align: center; flex-shrink: 0; }
        .trendpulse-nav-label { white-space: nowrap; }
        .trendpulse-sidepanel-content {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
        }
        .trendpulse-sidepanel.compact .trendpulse-sidepanel-nav-btn {
          justify-content: center;
          padding: 8px;
        }
        .trendpulse-sidepanel.compact .trendpulse-nav-icon {
          margin: 0;
        }
      `}</style>
      <div className="trendpulse-sidepanel-nav">
        <div className="trendpulse-sidepanel-brand">
          <div className="trendpulse-sidepanel-logo">TP</div>
          {!isCompact && <span className="trendpulse-sidepanel-title">TrendPulse AI</span>}
        </div>
        {nav.map((n) => (
          <button
            key={n.id}
            className={`trendpulse-sidepanel-nav-btn ${section === n.id ? "active" : ""}`}
            onClick={() => setSection(n.id)}
            title={n.label}
          >
            <span className="trendpulse-nav-icon">{n.icon}</span>
            {!isCompact && <span className="trendpulse-nav-label">{n.label}</span>}
          </button>
        ))}
        <button
          className="trendpulse-sidepanel-nav-btn"
          onClick={() => setIsCompact(!isCompact)}
          title={isCompact ? "Expand" : "Compact"}
        >
          <span className="trendpulse-nav-icon">{isCompact ? "◰" : "◱"}</span>
          {!isCompact && <span className="trendpulse-nav-label">{isCompact ? "Expand" : "Compact"}</span>}
        </button>
      </div>
      <div className="trendpulse-sidepanel-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            {section === "dashboard" && <Dashboard />}
            {section === "spy" && <CompetitorSpy />}
            {section === "heatmap" && <ViralHeatmap />}
            {section === "settings" && <Settings />}
            {section === "alerts" && <SmartAlertEngine />}
            {section === "titles" && <TitlePsychology />}
            {section === "calendar" && <AIContentCalendar />}
            {section === "cloud" && <TrendPulseCloud />}
            {section === "community" && <CommunityIntel />}
            {section === "screenshot" && <ScreenshotAnalyzer />}
            {section === "realtime" && <RealTimeTrendEngine />}
            {section === "faceless" && <FacelessContent />}
            {section === "competitor" && <CompetitorIntelligence />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
