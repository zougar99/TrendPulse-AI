import { generateId } from "./utils"

interface SyncPayload {
  syncId: string
  deviceId: string
  timestamp: number
  data: any
}

interface BackupEntry {
  id: string
  name: string
  createdAt: number
  data: any
}

export class CloudSync {
  private deviceId: string
  private syncInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.deviceId = "device_" + generateId()
  }

  private async getStorage<T>(key: string): Promise<T | null> {
    try {
      const result = await chrome.storage.sync.get(key)
      return (result[key] as T) ?? null
    } catch {
      return null
    }
  }

  private async setStorage(key: string, value: any): Promise<void> {
    try {
      await chrome.storage.sync.set({ [key]: value })
    } catch {
      // quota exceeded or sync unavailable
    }
  }

  async syncDevice(data: any): Promise<{ success: boolean; syncId: string }> {
    const syncId = generateId()
    const payload: SyncPayload = {
      syncId,
      deviceId: this.deviceId,
      timestamp: Date.now(),
      data,
    }

    const existing = (await this.getStorage<any[]>("trendpulse_sync_log")) || []
    existing.push(payload)
    if (existing.length > 100) existing.splice(0, existing.length - 100)
    await this.setStorage("trendpulse_sync_log", existing)

    return { success: true, syncId }
  }

  async saveKeywords(keywords: any[]): Promise<{ success: boolean }> {
    const existing = (await this.getStorage<any[]>("trendpulse_cloud_keywords")) || []
    const merged = new Map<string, any>()

    for (const kw of existing) {
      merged.set(kw.keyword, kw)
    }
    for (const kw of keywords) {
      const existingEntry = merged.get(kw.keyword)
      if (!existingEntry || kw.timestamp > existingEntry.timestamp) {
        merged.set(kw.keyword, { ...kw, timestamp: kw.timestamp || Date.now() })
      }
    }

    await this.setStorage("trendpulse_cloud_keywords", Array.from(merged.values()))
    return { success: true }
  }

  async loadKeywords(): Promise<any[]> {
    return (await this.getStorage<any[]>("trendpulse_cloud_keywords")) || []
  }

  async saveAnalytics(analytics: any): Promise<{ success: boolean }> {
    const key = `trendpulse_analytics_${this.deviceId}`
    await this.setStorage(key, {
      ...analytics,
      deviceId: this.deviceId,
      updatedAt: Date.now(),
    })
    return { success: true }
  }

  async loadAnalytics(): Promise<any | null> {
    const key = `trendpulse_analytics_${this.deviceId}`
    return this.getStorage<any>(key)
  }

  async createBackup(name: string): Promise<{ success: boolean; backupId: string }> {
    const backupId = generateId()
    const keys = [
      "trendpulse_settings",
      "trendpulse_history",
      "trendpulse_cache",
      "trendpulse_competitors",
      "trendpulse_alerts",
      "trendpulse_keywords",
      "trendpulse_auth",
      "trendpulse_cloud_keywords",
    ]

    const data: Record<string, any> = {}
    for (const key of keys) {
      const val = await this.getStorage<any>(key)
      if (val) data[key] = val
    }

    const backups = (await this.getStorage<BackupEntry[]>("trendpulse_backups")) || []
    backups.push({ id: backupId, name, createdAt: Date.now(), data })
    if (backups.length > 20) backups.splice(0, backups.length - 20)
    await this.setStorage("trendpulse_backups", backups)

    return { success: true, backupId }
  }

  async restoreBackup(backupId: string): Promise<{ success: boolean; name: string }> {
    const backups = (await this.getStorage<BackupEntry[]>("trendpulse_backups")) || []
    const backup = backups.find((b) => b.id === backupId)
    if (!backup) throw new Error("Backup not found")

    for (const [key, value] of Object.entries(backup.data)) {
      await this.setStorage(key, value)
    }

    return { success: true, name: backup.name }
  }

  startAutoSync(intervalMs = 300000): void {
    if (this.syncInterval) return
    this.syncInterval = setInterval(() => {
      this.syncDevice({ type: "heartbeat", timestamp: Date.now() })
    }, intervalMs)
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}

export const cloudSync = new CloudSync()
