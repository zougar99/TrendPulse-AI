import { WS_URL } from "./constants"

type MessageHandler = (data: any) => void

class TrendPulseWebSocket {
  private ws: WebSocket | null = null
  private handlers = new Map<string, Set<MessageHandler>>()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private isConnected = false

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return

    try {
      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = () => {
        this.isConnected = true
        this.handlers.get("connect")?.forEach((h) => h({ connected: true }))
      }

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data)
          const { type, payload } = msg
          if (type) {
            this.handlers.get(type)?.forEach((h) => h(payload))
          }
          this.handlers.get("message")?.forEach((h) => h(msg))
        } catch { }
      }

      this.ws.onclose = () => {
        this.isConnected = false
        this.handlers.get("disconnect")?.forEach((h) => h({ connected: false }))
        this.scheduleReconnect()
      }

      this.ws.onerror = () => {
        this.ws?.close()
      }
    } catch {
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, 5000)
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.ws?.close()
    this.ws = null
    this.isConnected = false
  }

  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
    return () => this.handlers.get(type)?.delete(handler)
  }

  get connected() {
    return this.isConnected
  }
}

export const wsClient = new TrendPulseWebSocket()
