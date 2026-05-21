import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:    "#0e0b14",
        surface:       "#16121f",
        "surface-2":   "#1e1829",
        plum:          "#4a3f8f",
        "plum-light":  "#6355b8",
        jade:          "#2a7a6f",
        "jade-light":  "#3aa898",
        gold:          "#d4af37",
        "gold-muted":  "#b8a7d9",
        mist:          "#c4b8e0",
        cream:         "#f0ebe8",
        // Legacy aliases so existing pages don't break
        "neon-green":  "#3aa898",
        "neon-purple": "#b8a7d9",
        "neon-gold":   "#d4af37",
      },
      fontFamily: {
        display: ["var(--font-bebas)", "var(--font-bungee)", "Impact", "sans-serif"],
        sub:     ["var(--font-anton)", "Arial Narrow", "sans-serif"],
        body:    ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gem-glow":  "radial-gradient(ellipse 80% 60% at 50% 0%, #4a3f8f33, transparent)",
        "jade-glow": "radial-gradient(ellipse 60% 40% at 50% 100%, #2a7a6f22, transparent)",
      },
      animation: {
        "holo-shift": "holoShift 4s ease infinite",
        "float":      "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "fade-up":    "fadeUp 0.7s ease forwards",
      },
      keyframes: {
        holoShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px #4a3f8f66, 0 0 40px #2a7a6f33" },
          "50%":      { boxShadow: "0 0 40px #4a3f8faa, 0 0 80px #2a7a6f55" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
