import { storage } from "./storage"

export interface AuthState {
  apiKey: string
  geminiKey: string
  connected: boolean
  userId?: string
  email?: string
}

export async function getAuth(): Promise<AuthState> {
  const data = await storage.sync.get<any>("trendpulse_auth")
  return (
    data || {
      apiKey: "",
      geminiKey: "",
      connected: false,
    }
  )
}

export async function setAuth(auth: Partial<AuthState>): Promise<void> {
  const current = await getAuth()
  await storage.sync.set("trendpulse_auth", { ...current, ...auth })
}

export async function isConnected(): Promise<boolean> {
  const auth = await getAuth()
  return auth.connected && !!auth.apiKey
}
