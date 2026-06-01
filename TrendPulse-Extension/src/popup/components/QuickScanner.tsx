import React, { useState } from "react"
import { motion } from "framer-motion"

interface Props {
  onAnalyze: (v: boolean) => void
  isAnalyzing: boolean
}

export function QuickScanner({ onAnalyze, isAnalyzing }: Props) {
  const [keyword, setKeyword] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleScan = async () => {
    if (!keyword.trim()) return
    onAnalyze(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: "ANALYZE_KEYWORD",
        payload: { keyword: keyword.trim(), source: "youtube" },
      })
      setResult(response)
    } catch {
      // fallback
    }
    onAnalyze(false)
  }

  return (
    <div className="trendpulse-scanner">
      <div className="trendpulse-section-title">◈ Quick Keyword Scan</div>
      <div className="trendpulse-input-group">
        <input
          className="trendpulse-input"
          placeholder="Enter keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
        />
        <motion.button
          className="trendpulse-btn trendpulse-btn-primary"
          onClick={handleScan}
          disabled={isAnalyzing || !keyword.trim()}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? "..." : "Scan"}
        </motion.button>
      </div>

      {result && (
        <motion.div
          className="trendpulse-scan-result"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="trendpulse-scan-row">
            <span>Score</span>
            <span className="trendpulse-glow-text">{result.local?.score || 0}</span>
          </div>
          <div className="trendpulse-scan-row">
            <span>Competition</span>
            <span
              style={{
                color:
                  result.local?.competition === "Low"
                    ? "#00FF88"
                    : result.local?.competition === "Medium"
                      ? "#FFD700"
                      : "#FF2D95",
              }}
            >
              {result.local?.competition || "N/A"}
            </span>
          </div>
          <div className="trendpulse-scan-row">
            <span>Viral Score</span>
            <span style={{ color: "#FF2D95" }}>{result.viral?.viralScore || 0}%</span>
          </div>
          <div className="trendpulse-scan-row">
            <span>Momentum</span>
            <span style={{ color: "#00FFF0" }}>{result.viral?.momentum || 0}</span>
          </div>
          <div className="trendpulse-scan-row">
            <span>Audience Fit</span>
            <span style={{ color: "#8A5CFF" }}>{result.viral?.audienceFit || 0}%</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
