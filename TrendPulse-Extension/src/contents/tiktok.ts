import type { PlasmoCSConfig } from "plasmo"
import { scrapeTikTokPage, observeTikTokPage } from "../background/scrapers/tiktok"

export const config: PlasmoCSConfig = {
  matches: ["*://*.tiktok.com/*"],
  run_at: "document_idle",
  css: ["../styles/content.css"],
}

function injectTikTokOverlay(data: any) {
  const existing = document.getElementById("trendpulse-tt")
  if (existing) existing.remove()

  const overlay = document.createElement("div")
  overlay.id = "trendpulse-tt"
  overlay.className = "trendpulse-tt-overlay trendpulse-slide-in"
  overlay.innerHTML = `
    <div class="trendpulse-tt-header">
      <span class="trendpulse-tt-icon">📊</span>
      <span>TrendPulse AI</span>
    </div>
    <div class="trendpulse-tt-body">
      <div class="trendpulse-tt-row">
        <span class="trendpulse-tt-label">Viral Score</span>
        <span class="trendpulse-tt-val" style="color:#FF2D95">${data?.viral?.viralScore || 0}%</span>
      </div>
      <div class="trendpulse-tt-row">
        <span class="trendpulse-tt-label">Momentum</span>
        <span class="trendpulse-tt-val" style="color:#00FFF0">${data?.viral?.momentum || 0}</span>
      </div>
      <div class="trendpulse-tt-row">
        <span class="trendpulse-tt-label">Audience Fit</span>
        <span class="trendpulse-tt-val" style="color:#8A5CFF">${data?.viral?.audienceFit || 0}%</span>
      </div>
      ${data?.hashtags?.length ? `
        <div class="trendpulse-tt-hashtags">
          <div class="trendpulse-tt-subtitle">Hashtags</div>
          <div class="trendpulse-tt-tags">
            ${data.hashtags.slice(0, 6).map((h: string) => `<span class="trendpulse-tt-tag">#${h}</span>`).join("")}
          </div>
        </div>
      ` : ""}
    </div>
  `

  const videoContainer =
    document.querySelector('[data-e2e="video-detail"]') ||
    document.querySelector(".tiktok-web-player") ||
    document.querySelector("video")?.closest("div")
  if (videoContainer) {
    videoContainer.parentElement?.appendChild(overlay)
  } else {
    document.body.appendChild(overlay)
    overlay.style.top = "100px"
    overlay.style.right = "20px"
  }
}

async function analyzeTikTok() {
  const pageData = scrapeTikTokPage()
  if (!pageData) return

  const video = pageData.videos[0]
  if (!video) return

  const result = await chrome.runtime.sendMessage({
    type: "ANALYZE_PAGE",
    payload: {
      url: window.location.href,
      title: video.description,
      tags: video.hashtags.join(", "),
    },
  })

  if (result) {
    injectTikTokOverlay({ ...result, hashtags: video.hashtags })
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup)
} else {
  setup()
}

function setup() {
  observeTikTokPage(() => {
    setTimeout(analyzeTikTok, 1000)
  })

  setTimeout(analyzeTikTok, 2000)
}
