import { useState, useEffect, useCallback } from "react"
import { storage } from "../lib/storage"
import { api } from "../lib/api"

interface TrendPulseState {
  connected: boolean
  analyzing: boolean
  lastAnalysis: any
  settings: Record<string, any>
  history: any[]
}

export function useTrendPulse() {
  const [state, setState] = useState<TrendPulseState>({
    connected: false,
    analyzing: false,
    lastAnalysis: null,
    settings: {},
    history: [],
  })

  useEffect(() => {
    loadSettings()
    loadHistory()
  }, [])

  const loadSettings = async () => {
    const s = await storage.settings.get()
    setState((prev) => ({ ...prev, settings: s || {} }))
  }

  const loadHistory = async () => {
    const h = await storage.history.getAll()
    setState((prev) => ({ ...prev, history: h }))
  }

  const analyzeKeyword = useCallback(async (keyword: string, source = "youtube") => {
    setState((prev) => ({ ...prev, analyzing: true }))
    try {
      const result = await chrome.runtime.sendMessage({
        type: "ANALYZE_KEYWORD",
        payload: { keyword, source },
      })
      setState((prev) => ({
        ...prev,
        analyzing: false,
        lastAnalysis: result,
      }))
      return result
    } catch {
      setState((prev) => ({ ...prev, analyzing: false }))
      return null
    }
  }, [])

  const analyzePage = useCallback(async () => {
    setState((prev) => ({ ...prev, analyzing: true }))
    try {
      const result = await chrome.runtime.sendMessage({
        type: "ANALYZE_PAGE",
        payload: { url: window.location.href, title: document.title },
      })
      setState((prev) => ({
        ...prev,
        analyzing: false,
        lastAnalysis: result,
      }))
      return result
    } catch {
      setState((prev) => ({ ...prev, analyzing: false }))
      return null
    }
  }, [])

  return {
    ...state,
    analyzeKeyword,
    analyzePage,
    refreshHistory: loadHistory,
    refreshSettings: loadSettings,
  }
}
