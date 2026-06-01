import type { PlasmoCSConfig } from "plasmo"
import { scrapeGooglePage, observeGoogleSearch } from "../background/scrapers/google"

export const config: PlasmoCSConfig = {
  matches: ["*://*.google.com/*"],
  run_at: "document_idle",
  css: ["../styles/content.css"],
}

function injectSearchAnalytics(data: any) {
  const existing = document.getElementById("trendpulse-google-bar")
  if (existing) existing.remove()

  const bar = document.createElement("div")
  bar.id = "trendpulse-google-bar"
  bar.className = "trendpulse-google-bar trendpulse-slide-in"
  bar.innerHTML = `
    <div class="trendpulse-gbar-header">
      <span class="trendpulse-glogo">TP</span>
      <span>AI Analysis</span>
    </div>
    <div class="trendpulse-gbar-metrics">
      <div class="trendpulse-gmetric">
        <span class="trendpulse-glabel">Score</span>
        <span class="trendpulse-gvalue" style="color:#00BFFF">${data?.local?.score || 0}</span>
      </div>
      <div class="trendpulse-gmetric">
        <span class="trendpulse-glabel">Competition</span>
        <span class="trendpulse-gvalue" style="color:${data?.local?.competition === "Low" ? "#00FF88" : data?.local?.competition === "Medium" ? "#FFD700" : "#FF2D95"}">
          ${data?.local?.competition || "Medium"}
        </span>
      </div>
      <div class="trendpulse-gmetric">
        <span class="trendpulse-glabel">Intent</span>
        <span class="trendpulse-gvalue" style="color:#8A5CFF">${detectIntent(data?.keyword || "")}</span>
      </div>
    </div>
  `

  const searchBar = document.querySelector("#search")
  if (searchBar) {
    searchBar.parentElement?.insertBefore(bar, searchBar)
  }
}

function detectIntent(query: string): string {
  const q = query.toLowerCase()
  if (/how\s+to/.test(q)) return "How-to"
  if (/what\s+is/.test(q)) return "Informational"
  if (/best|top|review/.test(q)) return "Commercial"
  if (/buy|price|cheap/.test(q)) return "Transactional"
  if (/vs|versus|compare/.test(q)) return "Comparison"
  return "Mixed"
}

async function analyzeSearch() {
  const pageData = scrapeGooglePage()
  if (!pageData || !pageData.query) return

  const result = await chrome.runtime.sendMessage({
    type: "ANALYZE_KEYWORD",
    payload: { keyword: pageData.query, source: "google" },
  })

  if (result) {
    injectSearchAnalytics({ ...result, keyword: pageData.query })
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup)
} else {
  setup()
}

function setup() {
  observeGoogleSearch(() => {
    setTimeout(analyzeSearch, 500)
  })

  setTimeout(analyzeSearch, 1000)
}
