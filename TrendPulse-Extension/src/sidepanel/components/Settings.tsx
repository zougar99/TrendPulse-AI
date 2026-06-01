import React, { useState, useEffect } from "react"

export function Settings() {
  const [settings, setSettings] = useState({
    apiUrl: "http://localhost:3000/api",
    youtubeKey: "",
    geminiKey: "",
    notifications: { desktop: true, discord: false, discordWebhookUrl: "", telegram: false, telegramBotToken: "", telegramChatId: "" },
    theme: "cyberpunk",
    autoAnalyze: true,
    compactMode: false,
  })

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_SETTINGS" }, (response) => {
      if (response) setSettings({ ...settings, ...response })
    })
  }, [])

  const save = () => {
    chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", payload: settings })
  }

  return (
    <div className="trendpulse-settings">
      <h2 className="trendpulse-dash-title">⚙ Settings</h2>

      <div className="trendpulse-settings-group">
        <label className="trendpulse-settings-label">TrendPulse API URL</label>
        <input
          className="trendpulse-input"
          value={settings.apiUrl}
          onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
        />
      </div>

      <div className="trendpulse-settings-group">
        <label className="trendpulse-settings-label">YouTube API Key</label>
        <input
          className="trendpulse-input"
          type="password"
          placeholder="Enter YouTube API key..."
          value={settings.youtubeKey}
          onChange={(e) => setSettings({ ...settings, youtubeKey: e.target.value })}
        />
      </div>

      <div className="trendpulse-settings-group">
        <label className="trendpulse-settings-label">Gemini API Key</label>
        <input
          className="trendpulse-input"
          type="password"
          placeholder="Enter Gemini API key..."
          value={settings.geminiKey}
          onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
        />
      </div>

      <div className="trendpulse-settings-group">
        <label className="trendpulse-settings-label">Notifications</label>
        <div className="trendpulse-settings-toggle-row">
          <span>Desktop Notifications</span>
          <label className="trendpulse-toggle">
            <input
              type="checkbox"
              checked={settings.notifications.desktop}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, desktop: e.target.checked },
                })
              }
            />
            <span className="trendpulse-toggle-slider" />
          </label>
        </div>
        <div className="trendpulse-settings-toggle-row">
          <span>Discord Webhook</span>
          <label className="trendpulse-toggle">
            <input
              type="checkbox"
              checked={settings.notifications.discord}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, discord: e.target.checked },
                })
              }
            />
            <span className="trendpulse-toggle-slider" />
          </label>
        </div>
        {settings.notifications.discord && (
          <input
            className="trendpulse-input"
            placeholder="Discord webhook URL..."
            value={settings.notifications.discordWebhookUrl}
            onChange={(e) =>
              setSettings({
                ...settings,
                notifications: { ...settings.notifications, discordWebhookUrl: e.target.value },
              })
            }
          />
        )}
      </div>

      <div className="trendpulse-settings-group">
        <label className="trendpulse-settings-label">Auto Analyze Pages</label>
        <label className="trendpulse-toggle">
          <input
            type="checkbox"
            checked={settings.autoAnalyze}
            onChange={(e) => setSettings({ ...settings, autoAnalyze: e.target.checked })}
          />
          <span className="trendpulse-toggle-slider" />
        </label>
      </div>

      <button className="trendpulse-btn trendpulse-btn-primary" onClick={save}>
        Save Settings
      </button>
    </div>
  )
}
