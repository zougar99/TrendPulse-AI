import type { Manifest } from "@plasmo/constants"

export const manifest: Manifest = {
  name: "TrendPulse AI",
  description: "AI-Powered Keyword & Trend Intelligence for YouTube, Google & TikTok",
  version: "3.0.0",
  action: {
    default_title: "TrendPulse AI",
    default_popup: "popup/index.html"
  },
  side_panel: {
    default_path: "sidepanel/index.html"
  },
  permissions: [
    "alarms",
    "storage",
    "activeTab",
    "tabs",
    "notifications",
    "scripting",
    "sidePanel"
  ],
  host_permissions: [
    "*://*.youtube.com/*",
    "*://*.google.com/*",
    "*://*.tiktok.com/*",
    "http://localhost:3000/*"
  ],
  background: {
    service_worker: "background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: ["*://*.youtube.com/*"],
      js: ["content/youtube.ts"],
      css: ["styles/content.css"],
      run_at: "document_idle"
    },
    {
      matches: ["*://*.google.com/*"],
      js: ["content/google.ts"],
      css: ["styles/content.css"],
      run_at: "document_idle"
    },
    {
      matches: ["*://*.tiktok.com/*"],
      js: ["content/tiktok.ts"],
      css: ["styles/content.css"],
      run_at: "document_idle"
    }
  ],
  web_accessible_resources: [
    {
      resources: ["assets/*", "fonts/*", "styles/*"],
      matches: ["*://*/*"]
    }
  ]
}
