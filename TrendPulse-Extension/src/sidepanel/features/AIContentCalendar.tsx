import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface CalendarDay {
  date: number
  isPublishDay: boolean
  viralPotential?: number
  hasContent?: boolean
}

interface ContentCalendarData {
  month: string
  year: number
  days: CalendarDay[]
  bestUploadTimes: { platform: string; times: { label: string; score: number }[] }[]
  forecast: { day: string; traffic: number }[]
}

const DEMO_CALENDAR: ContentCalendarData = {
  month: "June",
  year: 2026,
  days: Array.from({ length: 30 }, (_, i) => ({
    date: i + 1,
    isPublishDay: [2, 5, 8, 12, 15, 19, 22, 26, 29].includes(i + 1),
    viralPotential: [0, 0, 45, 0, 0, 72, 0, 0, 38, 0, 0, 85, 0, 0, 62, 0, 0, 0, 91, 0, 0, 55, 0, 0, 0, 78, 0, 0, 43, 0][i],
    hasContent: [2, 5, 8, 12, 15, 19, 22, 26, 29].includes(i + 1),
  })),
  bestUploadTimes: [
    { platform: "YouTube", times: [{ label: "2-4 PM", score: 92 }, { label: "6-8 PM", score: 85 }, { label: "10-12 AM", score: 68 }] },
    { platform: "TikTok", times: [{ label: "7-9 AM", score: 88 }, { label: "11-1 PM", score: 79 }, { label: "7-10 PM", score: 94 }] },
    { platform: "Instagram", times: [{ label: "9-11 AM", score: 86 }, { label: "1-3 PM", score: 74 }, { label: "6-8 PM", score: 90 }] },
  ],
  forecast: Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    traffic: Math.floor(5000 + Math.sin(i * 0.5) * 3000 + Math.random() * 2000),
  })),
}

const VIRAL_COLORS = ["#FF2D95", "#FFD700", "#00BFFF", "#00FF88", "#8A5CFF"]

export function AIContentCalendar() {
  const [data, setData] = useState<ContentCalendarData>(DEMO_CALENDAR)
  const [selectedDates, setSelectedDates] = useState<number[]>(
    DEMO_CALENDAR.days.filter((d) => d.isPublishDay).map((d) => d.date)
  )

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_CONTENT_CALENDAR" }, (response) => {
      if (response && response.days) {
        setData(response)
        setSelectedDates(response.days.filter((d: CalendarDay) => d.isPublishDay).map((d: CalendarDay) => d.date))
      }
    })
  }, [])

  const toggleDate = (date: number) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev].sort((a, b) => a - b).includes(date) ? prev : [...prev, date].sort((a, b) => a - b)
    )
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date].sort((a, b) => a - b)
    )
  }

  const weeks: CalendarDay[][] = []
  let week: CalendarDay[] = []
  const firstDayOfWeek = 0 // Sunday
  for (let i = 0; i < new Date(data.year, new Date(`${data.month} 1, ${data.year}`).getMonth(), 1).getDay(); i++) {
    week.push({ date: 0, isPublishDay: false })
  }
  data.days.forEach((day) => {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: 0, isPublishDay: false })
    }
    weeks.push(week)
  }

  return (
    <div className="trendpulse-calendar">
      <h2 className="trendpulse-dash-title">📅 AI Content Calendar</h2>
      <p className="trendpulse-dash-subtitle">{data.month} {data.year} — Plan your publishing strategy</p>

      <div
        style={{
          background: "var(--glass-light)",
          border: "1px solid var(--glass-border)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div className="trendpulse-section-title">{data.month} {data.year}</div>
          <div style={{ display: "flex", gap: 8, fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
            <span>📌 {selectedDates.length} publishing days</span>
            <span>🔥 {data.days.filter((d) => d.viralPotential && d.viralPotential > 70).length} high-potential dates</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 4 }}>
              {d}
            </div>
          ))}
        </div>

        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {w.map((day, di) => {
              const isSelected = selectedDates.includes(day.date)
              const vp = day.viralPotential ?? 0
              return (
                <motion.button
                  key={`${wi}-${di}`}
                  whileHover={{ scale: day.date > 0 ? 1.1 : 1 }}
                  whileTap={{ scale: day.date > 0 ? 0.95 : 1 }}
                  onClick={() => day.date > 0 && toggleDate(day.date)}
                  style={{
                    aspectRatio: "1",
                    border: "none",
                    borderRadius: 6,
                    background: isSelected
                      ? "linear-gradient(135deg, #00BFFF, #8A5CFF)"
                      : vp > 70
                        ? "rgba(255,45,149,0.2)"
                        : vp > 30
                          ? "rgba(0,191,255,0.1)"
                          : "rgba(255,255,255,0.03)",
                    color: day.date > 0 ? "#fff" : "transparent",
                    fontSize: 10,
                    fontWeight: isSelected ? 700 : 400,
                    fontFamily: "Orbitron, monospace",
                    cursor: day.date > 0 ? "pointer" : "default",
                    position: "relative",
                    boxShadow: isSelected ? "0 0 10px rgba(0,191,255,0.3)" : "none",
                  }}
                >
                  {day.date > 0 && day.date}
                  {vp > 0 && (
                    <span style={{
                      position: "absolute",
                      bottom: 2,
                      right: 3,
                      fontSize: 6,
                      color: vp > 70 ? "#FF2D95" : "#00BFFF",
                    }}>
                      ●
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Best Upload Times</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.bestUploadTimes.map((platform) => (
            <div key={platform.platform} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{platform.platform}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {platform.times.map((t) => (
                  <div
                    key={t.label}
                    style={{
                      flex: 1,
                      padding: "6px 8px",
                      background: `linear-gradient(135deg, rgba(0,191,255,${t.score / 150}), rgba(138,92,255,${t.score / 150}))`,
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 6,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{t.label}</div>
                    <div style={{ fontSize: 10, fontFamily: "Orbitron, monospace", color: "#00FF88" }}>{t.score}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Viral Opportunities</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {data.days.filter((d) => d.viralPotential && d.viralPotential > 0).slice(0, 8).map((d, i) => (
            <motion.div
              key={d.date}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                background: "var(--glass-light)",
                borderRadius: 6,
                border: `1px solid ${d.viralPotential! > 70 ? "rgba(255,45,149,0.2)" : "var(--glass-border)"}`,
              }}
            >
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                {data.month} {d.date}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, #00BFFF, ${d.viralPotential! > 70 ? "#FF2D95" : "#FFD700"})`,
                      width: 0,
                    }}
                    animate={{ width: `${d.viralPotential}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span style={{ fontSize: 10, fontFamily: "Orbitron, monospace", color: d.viralPotential! > 70 ? "#FF2D95" : "#FFD700" }}>
                  {d.viralPotential}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="trendpulse-dash-section">
        <div className="trendpulse-section-title">Content Forecasting — 30-Day Traffic Prediction</div>
        <div style={{ width: "100%", height: 180, background: "var(--glass-light)", border: "1px solid var(--glass-border)", borderRadius: 10, padding: 8 }}>
          <ResponsiveContainer>
            <LineChart data={data.forecast}>
              <XAxis dataKey="day" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} interval={4} />
              <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
              <Tooltip
                contentStyle={{
                  background: "rgba(11,11,15,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              />
              <Line type="monotone" dataKey="traffic" stroke="#00BFFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
