import type { PlasmoCSConfig } from "plasmo"
import { scrapeYouTubePage, observeYouTubePage } from "../background/scrapers/youtube"

export const config: PlasmoCSConfig = {
  matches: ["*://*.youtube.com/*"],
  run_at: "document_idle",
  css: ["../styles/content.css"],
}

function injectAnalyticsPanel(data: any) {
  const existing = document.getElementById("trendpulse-panel")
  if (existing) existing.remove()

  const panel = document.createElement("div")
  panel.id = "trendpulse-panel"
  panel.className = "trendpulse-fab trendpulse-slide-in"
  panel.innerHTML = `
    <div class="trendpulse-panel-header">
      <span class="trendpulse-logo">TP</span>
      <span class="trendpulse-title">TrendPulse AI</span>
      <button id="trendpulse-close" class="trendpulse-close-btn">&times;</button>
    </div>
    <div class="trendpulse-panel-body">
      <div class="trendpulse-score-ring">
        <svg viewBox="0 0 36 36" class="trendpulse-ring">
          <path class="trendpulse-ring-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <path class="trendpulse-ring-fill"
            stroke-dasharray="${data?.seo?.total || 70}, 100"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
          <text x="18" y="20.5" class="trendpulse-ring-text">${data?.seo?.total || 70}%</text>
        </svg>
        <div class="trendpulse-ring-label">SEO Score</div>
      </div>
      <div class="trendpulse-metrics">
        <div class="trendpulse-metric">
          <span class="trendpulse-metric-label">Viral</span>
          <span class="trendpulse-metric-value" style="color:#FF2D95">${data?.viral?.viralScore || 0}%</span>
        </div>
        <div class="trendpulse-metric">
          <span class="trendpulse-metric-label">Keyword</span>
          <span class="trendpulse-metric-value" style="color:#00BFFF">${data?.keywordScore?.score || 0}</span>
        </div>
        <div class="trendpulse-metric">
          <span class="trendpulse-metric-label">Momentum</span>
          <span class="trendpulse-metric-value" style="color:#00FFF0">${data?.viral?.momentum || 0}</span>
        </div>
        <div class="trendpulse-metric">
          <span class="trendpulse-metric-label">Grade</span>
          <span class="trendpulse-metric-value" style="color:#8A5CFF">${data?.seo?.grade || "B"}</span>
        </div>
      </div>
      ${data?.tags?.length ? `
        <div class="trendpulse-tags">
          <div class="trendpulse-section-title">Auto Tags</div>
          <div class="trendpulse-tag-cloud">
            ${data.tags.slice(0, 8).map((t: string) => `<span class="trendpulse-tag">${t}</span>`).join("")}
          </div>
        </div>
      ` : ""}
      <div class="trendpulse-actions">
        <button class="trendpulse-btn trendpulse-btn-primary" id="trendpulse-analyze">
          ⚡ Analyze Page
        </button>
        <button class="trendpulse-btn trendpulse-btn-secondary" id="trendpulse-compare">
          ⇆ Compare
        </button>
      </div>
    </div>
  `

  document.body.appendChild(panel)

  document.getElementById("trendpulse-close")?.addEventListener("click", () => {
    panel.remove()
  })

  document.getElementById("trendpulse-analyze")?.addEventListener("click", async () => {
    chrome.runtime.sendMessage(
      { type: "ANALYZE_PAGE", payload: { url: window.location.href, title: document.title } },
      (response) => {
        if (response) {
          panel.remove()
          injectAnalyticsPanel(response)
        }
      }
    )
  })
}

async function analyzeCurrentPage() {
  const pageData = scrapeYouTubePage()
  if (!pageData) return

  const video = pageData.videos[0]
  if (!video) return

  const result = await chrome.runtime.sendMessage({
    type: "ANALYZE_PAGE",
    payload: {
      url: window.location.href,
      title: video.title,
      description: video.description,
      tags: video.tags.join(", "),
    },
  })

  if (result) {
    injectAnalyticsPanel({ ...result, tags: video.tags })
  }
}

function waitForElement(selector: string): Promise<Element> {
  return new Promise((resolve) => {
    const el = document.querySelector(selector)
    if (el) return resolve(el)
    const obs = new MutationObserver(() => {
      const el = document.querySelector(selector)
      if (el) {
        obs.disconnect()
        resolve(el)
      }
    })
    obs.observe(document.body, { childList: true, subtree: true })
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup)
} else {
  setup()
}

async function setup() {
  await waitForElement("body")

  if (/youtube\.com\/watch\?v=/.test(window.location.href)) {
    setTimeout(analyzeCurrentPage, 2000)
  }

  observeYouTubePage((data) => {
    if (data.type === "search" && data.searchQuery) {
      chrome.runtime.sendMessage(
        {
          type: "ANALYZE_KEYWORD",
          payload: { keyword: data.searchQuery, source: "youtube" },
        },
        (result) => {
          if (result?.local) {
            injectKeywordBadge(result.local)
          }
        }
      )
    }
  })
}

function injectKeywordBadge(score: { score: number; competition: string }) {
  const existing = document.getElementById("trendpulse-kw-badge")
  if (existing) existing.remove()

  const badge = document.createElement("div")
  badge.id = "trendpulse-kw-badge"
  badge.className = "trendpulse-kw-badge"
  badge.innerHTML = `
    <div class="trendpulse-kw-score">${score.score}</div>
    <div class="trendpulse-kw-comp">${score.competition}</div>
  `
  const searchBox = document.querySelector("ytd-searchbox")
  if (searchBox) {
    searchBox.parentElement?.appendChild(badge)
  }
}
