import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendRadar } from "./components/TrendRadar"
import { QuickScanner } from "./components/QuickScanner"
import { AISuggestions } from "./components/AISuggestions"
import { LiveScore } from "./components/LiveScore"
import { ViralDNALab } from "./features/ViralDNALab"
import { AIChat } from "./features/AIChat"
import { EarlyDetection } from "./features/EarlyDetection"
import { AIVoiceCommand } from "./features/AIVoiceCommand"
import { NicheFinder } from "./features/NicheFinder"
import { TrendTimeline } from "./features/TrendTimeline"
import { ContentGenerator } from "./features/ContentGenerator"
import { ThumbnailLab } from "./features/ThumbnailLab"
import { ShortsDetector } from "./features/ShortsDetector"
import { ViralScoreMap } from "./features/ViralScoreMap"
import "../styles/global.css"

type Tab = "radar" | "scan" | "ai" | "score" | "viral" | "chat" | "early" | "voice" | "niche" | "timeline" | "content" | "thumb" | "shorts" | "map"

export default function Popup() {
  const [activeTab, setActiveTab] = useState<Tab>("radar")
  const [trendScore, setTrendScore] = useState(72)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_TRENDING" }, (response) => {
      if (response?.results) {
        setTrendScore(Math.round(Math.random() * 40 + 50))
      }
    })
  }, [])

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "radar", label: "Radar", icon: "◎" },
    { id: "scan", label: "Scan", icon: "◈" },
    { id: "ai", label: "AI", icon: "◇" },
    { id: "score", label: "Score", icon: "◆" },
    { id: "viral", label: "Viral", icon: "🧬" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "early", label: "Early", icon: "📡" },
    { id: "voice", label: "Voice", icon: "🎤" },
    { id: "niche", label: "Niche", icon: "🎯" },
    { id: "timeline", label: "Timeline", icon: "📈" },
    { id: "content", label: "Content", icon: "✍" },
    { id: "thumb", label: "Thumb", icon: "🖼" },
    { id: "shorts", label: "Shorts", icon: "📱" },
    { id: "map", label: "Map", icon: "🌍" },
  ]

  return (
    <div className="trendpulse-popup">
      <style>{`
        .trendpulse-popup-tabs {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 4px 6px;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .trendpulse-popup-tabs::-webkit-scrollbar {
          display: none;
        }
        .trendpulse-tab {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 5px 8px;
          border: none;
          border-radius: 6px;
          background: transparent;
          color: rgba(255,255,255,0.4);
          font-size: 9px;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .trendpulse-tab:hover {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
        }
        .trendpulse-tab.active {
          color: #00FFF0;
          background: rgba(0,255,240,0.08);
          text-shadow: 0 0 10px rgba(0,255,240,0.3);
        }
        .trendpulse-tab-icon { font-size: 11px; }
      `}</style>

      <div className="trendpulse-popup-header">
        <div className="trendpulse-popup-brand">
          <div className="trendpulse-popup-logo">TP</div>
          <div>
            <div className="trendpulse-popup-title">TrendPulse AI</div>
            <div className="trendpulse-popup-subtitle">Intelligence Engine</div>
          </div>
        </div>
        <div className="trendpulse-popup-status">
          <div className="trendpulse-live-dot" />
          <span className="trendpulse-status-text">LIVE</span>
        </div>
      </div>

      <div className="trendpulse-popup-score">
        <div className="trendpulse-popup-score-ring">
          <svg viewBox="0 0 36 36" className="trendpulse-score-svg">
            <path
              className="trendpulse-score-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="trendpulse-score-fill"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${trendScore}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.5" className="trendpulse-score-text">
              {trendScore}
            </text>
          </svg>
          <div className="trendpulse-score-label">TREND INDEX</div>
        </div>
        <div className="trendpulse-popup-quick-info">
          <div className="trendpulse-info-item">
            <span className="trendpulse-info-label">Keywords</span>
            <span className="trendpulse-info-value">1,284</span>
          </div>
          <div className="trendpulse-info-item">
            <span className="trendpulse-info-label">Analyzed</span>
            <span className="trendpulse-info-value">47</span>
          </div>
          <div className="trendpulse-info-item">
            <span className="trendpulse-info-label">Alerts</span>
            <span className="trendpulse-info-value trendpulse-alert">3</span>
          </div>
        </div>
      </div>

      <div className="trendpulse-popup-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`trendpulse-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="trendpulse-tab-icon">{tab.icon}</span>
            <span className="trendpulse-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="trendpulse-popup-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === "radar" && <TrendRadar />}
            {activeTab === "scan" && (
              <QuickScanner onAnalyze={setIsAnalyzing} isAnalyzing={isAnalyzing} />
            )}
            {activeTab === "ai" && <AISuggestions />}
            {activeTab === "score" && <LiveScore />}
            {activeTab === "viral" && <ViralDNALab />}
            {activeTab === "chat" && <AIChat />}
            {activeTab === "early" && <EarlyDetection />}
            {activeTab === "voice" && <AIVoiceCommand />}
            {activeTab === "niche" && <NicheFinder />}
            {activeTab === "timeline" && <TrendTimeline />}
            {activeTab === "content" && <ContentGenerator />}
            {activeTab === "thumb" && <ThumbnailLab />}
            {activeTab === "shorts" && <ShortsDetector />}
            {activeTab === "map" && <ViralScoreMap />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="trendpulse-popup-actions">
        <button
          className="trendpulse-action-btn"
          onClick={() => chrome.runtime.sendMessage({ type: "ANALYZE_PAGE", payload: {} })}
        >
          ⚡ Analyze
        </button>
        <button
          className="trendpulse-action-btn"
          onClick={() => {
            chrome.windows.getCurrent({}, (win) => {
              if (win.id) chrome.sidePanel.open({ windowId: win.id })
            })
          }}
        >
          📊 Side Panel
        </button>
        <button
          className="trendpulse-action-btn"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          ⚙ Settings
        </button>
      </div>

      <div className="trendpulse-popup-footer">
        <span>Connected to TrendPulse</span>
        <span className="trendpulse-version">v3.0.0</span>
      </div>
    </div>
  )
}
