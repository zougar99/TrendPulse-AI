import { storage } from "../../lib/storage"

export interface YouTubeVideoData {
  title: string
  videoId: string
  channelName: string
  channelId?: string
  views: number
  likes: number
  comments: number
  tags: string[]
  description: string
  duration: string
  publishedAt: string
  thumbnailUrl?: string
  isShorts: boolean
}

export interface YouTubePageData {
  type: "watch" | "shorts" | "search" | "channel" | "trending"
  videos: YouTubeVideoData[]
  searchQuery?: string
  channelId?: string
}

export function scrapeYouTubePage(): YouTubePageData | null {
  const url = window.location.href

  if (/youtube\.com\/watch\?v=/.test(url)) {
    return scrapeWatchPage()
  }
  if (/youtube\.com\/shorts\//.test(url)) {
    return scrapeShortsPage()
  }
  if (/youtube\.com\/results/.test(url)) {
    return scrapeSearchPage()
  }
  if (/youtube\.com\/@/.test(url) || /youtube\.com\/channel\//.test(url)) {
    return scrapeChannelPage()
  }
  if (/youtube\.com\/feed\/trending/.test(url)) {
    return scrapeTrendingPage()
  }
  return null
}

function scrapeWatchPage(): YouTubePageData {
  const title =
    document.querySelector("h1 yt-formatted-string")?.textContent?.trim() || ""
  const channelName =
    document.querySelector("#owner #channel-name a")?.textContent?.trim() || ""
  const description =
    document.querySelector("#description-inner")?.textContent?.trim() || ""
  const viewsText =
    document.querySelector(".view-count")?.textContent?.trim() || ""
  const views = parseInt(viewsText.replace(/[^0-9]/g, "")) || 0

  const tags: string[] = []
  document
    .querySelectorAll('meta[name="keywords"]')
    .forEach((el) => {
      const content = el.getAttribute("content")
      if (content) tags.push(...content.split(",").map((t) => t.trim()))
    })

  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : ""

  return {
    type: "watch",
    videos: [
      {
        title,
        videoId,
        channelName,
        views,
        likes: 0,
        comments: 0,
        tags,
        description,
        duration: "",
        publishedAt: "",
        isShorts: false,
      },
    ],
  }
}

function scrapeShortsPage(): YouTubePageData {
  const title =
    document.querySelector("h1 yt-formatted-string")?.textContent?.trim() || ""
  const videoIdMatch = url.match(/shorts\/([a-zA-Z0-9_-]{11})/)
  const videoId = videoIdMatch ? videoIdMatch[1] : ""

  return {
    type: "shorts",
    videos: [
      {
        title,
        videoId,
        channelName: "",
        views: 0,
        likes: 0,
        comments: 0,
        tags: [],
        description: "",
        duration: "",
        publishedAt: "",
        isShorts: true,
      },
    ],
  }
}

function scrapeSearchPage(): YouTubePageData {
  const query =
    new URLSearchParams(window.location.search).get("search_query") || ""
  const videos: YouTubeVideoData[] = []

  document.querySelectorAll("ytd-video-renderer").forEach((el) => {
    const titleEl = el.querySelector("#video-title")
    const metaEl = el.querySelector("#metadata-line span")
    const channelEl = el.querySelector("#channel-name a")
    const videoId = titleEl
      ?.getAttribute("href")
      ?.match(/v=([a-zA-Z0-9_-]{11})/)?.[1]

    videos.push({
      title: titleEl?.textContent?.trim() || "",
      videoId: videoId || "",
      channelName: channelEl?.textContent?.trim() || "",
      views: parseInt(metaEl?.textContent?.replace(/[^0-9]/g, "") || "0") || 0,
      likes: 0,
      comments: 0,
      tags: [],
      description: "",
      duration: "",
      publishedAt: "",
      isShorts: false,
    })
  })

  return { type: "search", videos, searchQuery: query }
}

function scrapeChannelPage(): YouTubePageData {
  const channelId =
    document.querySelector('meta[itemprop="channelId"]')?.getAttribute("content") ||
    ""

  return {
    type: "channel",
    videos: [],
    channelId,
  }
}

function scrapeTrendingPage(): YouTubePageData {
  const videos: YouTubeVideoData[] = []
  document.querySelectorAll("ytd-video-renderer").forEach((el) => {
    const titleEl = el.querySelector("#video-title")
    const videoId = titleEl
      ?.getAttribute("href")
      ?.match(/v=([a-zA-Z0-9_-]{11})/)?.[1]
    videos.push({
      title: titleEl?.textContent?.trim() || "",
      videoId: videoId || "",
      channelName: "",
      views: 0,
      likes: 0,
      comments: 0,
      tags: [],
      description: "",
      duration: "",
      publishedAt: "",
      isShorts: false,
    })
  })
  return { type: "trending", videos }
}

export function observeYouTubePage(callback: (data: YouTubePageData) => void) {
  const observer = new MutationObserver(() => {
    const data = scrapeYouTubePage()
    if (data) callback(data)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  })

  return () => observer.disconnect()
}
