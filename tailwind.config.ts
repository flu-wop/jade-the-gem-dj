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
        // ── Deep Jewel Mystic palette ─────────────────────
        background:       "#0e0b14", // obsidian black
        surface:          "#151020", // deep charcoal-plum
        "surface-2":      "#1e1830", // lifted surface
        "neon-green":     "#b8a7d9", // muted lavender (primary accent)
        "neon-green-dim": "#9b8ec4", // dimmed lavender
        "neon-purple":    "#2a7a6f", // smoky jade/teal
        "neon-gold":      "#d4af37", // antique gold
        // semantic aliases used in new components
        plum:     "#4a3f8f",
        jade:     "#2a7a6f",
        gold:     "#d4af37",
        obsidian: "#0e0b14",
      },
      fontFamily: {
        sans:    ["var(--font-montserrat)", "sans-serif"], // body
        display: ["var(--font-bebas)",      "sans-serif"], // existing hero
        heading: ["var(--font-bungee)",     "sans-serif"], // new — bold urban headings
        sub:     ["var(--font-anton)",      "sans-serif"], // new — merch/subheadings
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(14,11,20,0.6) 0%, rgba(14,11,20,0.88) 60%, #0e0b14 100%)",
        "jewel-gradient":
          "linear-gradient(135deg, #4a3f8f 0%, #2a7a6f 100%)",
      },
      // text-shadow-drip, text-shadow-glow utilities (registered via plugin below)
      textShadow: {
        drip: "2px 2px 0px #4a3f8f, 4px 4px 8px rgba(42,122,111,0.4)",
        glow: "0 0 10px rgba(184,167,217,0.6), 0 0 24px rgba(74,63,143,0.4)",
      } as Record<string, string>,
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ matchUtilities, theme }: any) => {
      matchUtilities(
        { "text-shadow": (value: string) => ({ textShadow: value }) },
        { values: theme("textShadow") }
      );
    },
  ],
};

export default config;
