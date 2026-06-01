export interface TikTokVideoData {
  id: string
  description: string
  author: string
  likes: number
  comments: number
  shares: number
  plays: number
  hashtags: string[]
  sound: string
  isTrending: boolean
}

export interface TikTokPageData {
  type: "profile" | "video" | "search" | "trending"
  videos: TikTokVideoData[]
  searchQuery?: string
  trendingSounds?: string[]
  trendingHashtags?: string[]
}

export function scrapeTikTokPage(): TikTokPageData | null {
  const url = window.location.href

  if (/tiktok\.com\/@[\w.]+\/video\//.test(url)) {
    return scrapeVideoPage()
  }
  if (/tiktok\.com\/@/.test(url)) {
    return scrapeProfilePage()
  }
  if (/tiktok\.com\/search/.test(url)) {
    return scrapeSearchPage()
  }
  if (/tiktok\.com\/trending/.test(url)) {
    return scrapeTrendingPage()
  }
  return null
}

function scrapeVideoPage(): TikTokPageData {
  const descEl = document.querySelector('[data-e2e="video-desc"]')
  const authorEl = document.querySelector('[data-e2e="video-author-uniqueid"]')

  const hashtags: string[] = []
  descEl?.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || ""
    if (href.includes("tag")) {
      const tag = a.textContent?.trim().replace("#", "")
      if (tag) hashtags.push(tag)
    }
  })

  return {
    type: "video",
    videos: [
      {
        id: "",
        description: descEl?.textContent?.trim() || "",
        author: authorEl?.textContent?.trim() || "",
        likes: 0,
        comments: 0,
        shares: 0,
        plays: 0,
        hashtags,
        sound: "",
        isTrending: false,
      },
    ],
  }
}

function scrapeProfilePage(): TikTokPageData {
  const username = window.location.pathname.split("/")[1]?.replace("@", "") || ""
  return {
    type: "profile",
    videos: [],
  }
}

function scrapeSearchPage(): TikTokPageData {
  const query = new URLSearchParams(window.location.search).get("q") || ""
  return {
    type: "search",
    videos: [],
    searchQuery: query,
  }
}

function scrapeTrendingPage(): TikTokPageData {
  return {
    type: "trending",
    videos: [],
    trendingHashtags: [],
    trendingSounds: [],
  }
}

export function observeTikTokPage(callback: (data: TikTokPageData) => void) {
  const observer = new MutationObserver(() => {
    const data = scrapeTikTokPage()
    if (data) callback(data)
  })

  observer.observe(document.body, { childList: true, subtree: true })
  return () => observer.disconnect()
}
