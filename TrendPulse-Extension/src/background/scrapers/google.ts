export interface GoogleSearchResult {
  title: string
  url: string
  snippet: string
  position: number
  domain: string
}

export interface GooglePageData {
  query: string
  results: GoogleSearchResult[]
  totalResults?: number
  relatedSearches: string[]
  autocompleteSuggestions: string[]
}

export function scrapeGooglePage(): GooglePageData | null {
  const url = window.location.href
  if (!/google\.com\/search/.test(url)) return null

  const query = new URLSearchParams(window.location.search).get("q") || ""
  const results: GoogleSearchResult[] = []

  document.querySelectorAll("#search .g").forEach((el, index) => {
    const titleEl = el.querySelector("h3")
    const linkEl = el.querySelector("a")
    const snippetEl = el.querySelector(".VwiC3b, .lEBKkf, span.aCOpRe")
    const href = linkEl?.getAttribute("href") || ""

    results.push({
      title: titleEl?.textContent?.trim() || "",
      url: href,
      snippet: snippetEl?.textContent?.trim() || "",
      position: index + 1,
      domain: extractDomain(href),
    })
  })

  const relatedSearches: string[] = []
  document.querySelectorAll(".s75CSd, .nVHYUb, .brKmxb").forEach((el) => {
    const text = el.textContent?.trim()
    if (text) relatedSearches.push(text)
  })

  return {
    query,
    results,
    totalResults: results.length,
    relatedSearches,
    autocompleteSuggestions: [],
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "")
  } catch {
    return url
  }
}

export function fetchGoogleAutocomplete(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    const callback = `_autocomplete_${Date.now()}`
    ;(window as any)[callback] = (data: any) => {
      delete (window as any)[callback]
      const suggestions: string[] = []
      if (data && data[1]) {
        data[1].forEach((item: any) => {
          if (typeof item === "string") suggestions.push(item)
          else if (item[0]) suggestions.push(item[0])
        })
      }
      resolve(suggestions)
    }

    script.src = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&callback=${callback}`
    document.head.appendChild(script)

    setTimeout(() => {
      document.head.removeChild(script)
      resolve([])
    }, 3000)
  })
}

export function observeGoogleSearch(callback: (data: GooglePageData) => void) {
  const observer = new MutationObserver(() => {
    const data = scrapeGooglePage()
    if (data && data.results.length > 0) callback(data)
  })

  observer.observe(document.getElementById("search") || document.body, {
    childList: true,
    subtree: true,
  })

  return () => observer.disconnect()
}
