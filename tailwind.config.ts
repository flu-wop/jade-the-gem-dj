import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Deep Jewel Mystic ─────────────────────────────
        background:   "#0e0b14", // obsidian black
        surface:      "#151020", // deep charcoal-plum
        "surface-2":  "#1e1830", // lifted surface
        // primary accent — deep plum
        "neon-green":     "#b8a7d9", // muted lavender-gold (replaces neon-green)
        "neon-green-dim": "#9b8ec4", // dimmed variant
        // secondary accent — smoky jade
        "neon-purple":    "#2a7a6f", // smoky jade/teal (replaces purple)
        // gold highlight
        "neon-gold":      "#d4af37", // antique gold
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        display: ["var(--font-bebas)", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(14,11,20,0.6) 0%, rgba(14,11,20,0.88) 60%, #0e0b14 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
