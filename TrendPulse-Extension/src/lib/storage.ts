import { STORAGE_KEYS } from "./constants"

type StorageValue = Record<string, any>

async function get<T>(key: string): Promise<T | null> {
  try {
    const result = await chrome.storage.local.get(key)
    return (result[key] as T) ?? null
  } catch {
    return null
  }
}

async function set(key: string, value: any): Promise<void> {
  await chrome.storage.local.set({ [key]: value })
}

async function remove(key: string): Promise<void> {
  await chrome.storage.local.remove(key)
}

async function getSync<T>(key: string): Promise<T | null> {
  try {
    const result = await chrome.storage.sync.get(key)
    return (result[key] as T) ?? null
  } catch {
    return null
  }
}

async function setSync(key: string, value: any): Promise<void> {
  await chrome.storage.sync.set({ [key]: value })
}

export const storage = {
  // ─── Settings ───
  settings: {
    async get(): Promise<StorageValue | null> {
      return get<StorageValue>(STORAGE_KEYS.SETTINGS)
    },
    async set(settings: StorageValue): Promise<void> {
      return set(STORAGE_KEYS.SETTINGS, settings)
    },
  },

  // ─── History ───
  history: {
    async getAll(): Promise<any[]> {
      return (await get<any[]>(STORAGE_KEYS.HISTORY)) || []
    },
    async add(item: any): Promise<void> {
      const history = await this.getAll()
      history.unshift({ ...item, timestamp: Date.now() })
      if (history.length > 500) history.length = 500
      return set(STORAGE_KEYS.HISTORY, history)
    },
    async clear(): Promise<void> {
      return remove(STORAGE_KEYS.HISTORY)
    },
  },

  // ─── Cache ───
  cache: {
    async get<T>(key: string): Promise<T | null> {
      const cache = await get<Record<string, { data: T; expiry: number }>>(
        STORAGE_KEYS.CACHE
      )
      const entry = cache?.[key]
      if (!entry || Date.now() > entry.expiry) return null
      return entry.data
    },
    async set<T>(key: string, data: T, ttl = 120_000): Promise<void> {
      const cache =
        (await get<Record<string, { data: any; expiry: number }>>(
          STORAGE_KEYS.CACHE
        )) || {}
      cache[key] = { data, expiry: Date.now() + ttl }
      return set(STORAGE_KEYS.CACHE, cache)
    },
    async clear(): Promise<void> {
      return remove(STORAGE_KEYS.CACHE)
    },
  },

  // ─── Competitor Data ───
  competitors: {
    async getAll(): Promise<any[]> {
      return (await get<any[]>(STORAGE_KEYS.COMPETITOR_DATA)) || []
    },
    async save(data: any): Promise<void> {
      const competitors = await this.getAll()
      competitors.push(data)
      return set(STORAGE_KEYS.COMPETITOR_DATA, competitors)
    },
  },

  // ─── Sync Settings ───
  sync: {
    async get<T>(key: string): Promise<T | null> {
      return getSync<T>(key)
    },
    async set(key: string, value: any): Promise<void> {
      return setSync(key, value)
    },
  },
}
