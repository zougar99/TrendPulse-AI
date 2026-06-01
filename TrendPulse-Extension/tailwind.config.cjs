/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050505",
          dark: "#0B0B0F",
          mid: "#12121A",
          card: "rgba(18,18,26,0.85)",
          blue: "#00BFFF",
          purple: "#8A5CFF",
          cyan: "#00FFF0",
          pink: "#FF2D95",
          green: "#00FF88",
          orange: "#FF6B35",
          gold: "#FFD700",
        },
        glass: {
          light: "rgba(255,255,255,0.05)",
          mid: "rgba(255,255,255,0.08)",
          heavy: "rgba(255,255,255,0.12)",
          border: "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Inter", "sans-serif"],
        alt: ["Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 20px rgba(0,191,255,0.3)",
        "neon-lg": "0 0 40px rgba(0,191,255,0.2)",
        purple: "0 0 20px rgba(138,92,255,0.3)",
        cyan: "0 0 20px rgba(0,255,240,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "radar-spin": "radarSpin 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.3)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        radarSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,191,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,191,255,0.6)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
