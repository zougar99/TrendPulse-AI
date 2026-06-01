import { storage } from "../../lib/storage"

interface NotificationConfig {
  desktop: boolean
  discord: boolean
  discordWebhookUrl: string
  telegram: boolean
  telegramBotToken: string
  telegramChatId: string
}

interface TrendAlert {
  type: string
  platform: string
  keyword?: string
  channel?: string
  score: number
  message: string
}

class NotificationManager {
  private config: NotificationConfig = {
    desktop: true,
    discord: false,
    discordWebhookUrl: "",
    telegram: false,
    telegramBotToken: "",
    telegramChatId: "",
  }

  async init() {
    const settings = await storage.settings.get()
    if (settings?.notifications) {
      this.config = { ...this.config, ...settings.notifications }
    }
  }

  async send(alert: TrendAlert) {
    if (this.config.desktop) {
      this.sendDesktopNotification(alert)
    }
    if (this.config.discord && this.config.discordWebhookUrl) {
      await this.sendDiscordNotification(alert)
    }
    if (this.config.telegram && this.config.telegramBotToken && this.config.telegramChatId) {
      await this.sendTelegramNotification(alert)
    }
  }

  private sendDesktopNotification(alert: TrendAlert) {
    if (!("Notification" in globalThis)) return

    const iconMap: Record<string, string> = {
      rising_keyword: "🔺",
      viral_trend: "🔥",
      competitor_upload: "👀",
      trend_spike: "⚡",
    }
    const icon = iconMap[alert.type] || "📊"

    try {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "assets/icon.png",
        title: `TrendPulse AI — ${icon} ${alert.platform}`,
        message: alert.message,
        priority: alert.score > 70 ? 2 : 1,
      })
    } catch {
      // fallback: notification not supported
    }
  }

  private async sendDiscordNotification(alert: TrendAlert) {
    if (!this.config.discordWebhookUrl) return

    const colors: Record<string, number> = {
      rising_keyword: 0x00bfff,
      viral_trend: 0xff2d95,
      competitor_upload: 0x8a5cff,
      trend_spike: 0x00fff0,
    }

    const embed = {
      title: `TrendPulse AI Alert — ${alert.platform}`,
      description: alert.message,
      color: colors[alert.type] || 0x00bfff,
      timestamp: new Date().toISOString(),
      fields: [
        { name: "Type", value: alert.type, inline: true },
        { name: "Score", value: `${alert.score}/100`, inline: true },
        ...(alert.keyword ? [{ name: "Keyword", value: alert.keyword, inline: true }] : []),
      ],
    }

    try {
      await fetch(this.config.discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      })
    } catch {
      // silent fail
    }
  }

  private async sendTelegramNotification(alert: TrendAlert) {
    const emojiMap: Record<string, string> = {
      rising_keyword: "🔺",
      viral_trend: "🔥",
      competitor_upload: "👀",
      trend_spike: "⚡",
    }
    const emoji = emojiMap[alert.type] || "📊"

    const text = `${emoji} *TrendPulse AI — ${alert.platform}*\n${alert.message}\nScore: ${alert.score}/100`

    try {
      await fetch(
        `https://api.telegram.org/bot${this.config.telegramBotToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: this.config.telegramChatId,
            text,
            parse_mode: "Markdown",
          }),
        }
      )
    } catch {
      // silent fail
    }
  }
}

export const notificationManager = new NotificationManager()
