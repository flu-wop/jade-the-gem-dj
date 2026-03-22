// data/weeklyMixes.ts
// ─────────────────────────────────────────────────────────────────────────────
// Add new drops here. The WeeklyMixes component reads this array directly.
// embedSrc: grab the iframe src from SoundCloud Share → Embed panel.
// ─────────────────────────────────────────────────────────────────────────────

export interface WeeklyMix {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  description: string;
  embedSrc: string; // SoundCloud iframe src URL
}

const weeklyMixes: WeeklyMix[] = [
  {
    id: "lab-drop-001",
    title: "Lab Drop 001 — 504 Frequencies",
    date: "2025-03-15",
    description:
      "Deep in the pocket. Second line rhythms meet 808s. NOLA never sleeps.",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/REPLACE_TRACK_ID_001&color=%2300ff88&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
  },
  {
    id: "lab-drop-002",
    title: "Lab Drop 002 — Jade Vibes",
    date: "2025-03-22",
    description:
      "Smooth, gem-cut frequencies. Late night studio energy, raw and unfiltered.",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/REPLACE_TRACK_ID_002&color=%2300ff88&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
  },
  // Add future drops below ↓
];

export default weeklyMixes;
