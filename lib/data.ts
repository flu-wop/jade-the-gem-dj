/* ─────────────────────────────────────────────────────────
   Site content — edit this file to update events, mixes, etc.
   ───────────────────────────────────────────────────────── */

export interface Event {
  id: string;
  title: string;
  date: string; // ISO: YYYY-MM-DD
  venue: string;
  city: string;
  state: string;
  flyerImage: string;
  ticketLink?: string;
  isPast?: boolean;
}

export interface Track {
  id: string;
  title: string;
  /** Full SoundCloud player src URL */
  embedSrc: string;
  /** visual=true makes it the tall waveform player */
  visual?: boolean;
}

export interface SocialLink {
  platform: string;
  handle: string;
  url: string;
}

/* ── Upcoming events ─────────────────────────────────── */
export const upcomingEvents: Event[] = [];

/* ── Past events ─────────────────────────────────────── */
export const pastEvents: Event[] = [
  {
    id: "p1",
    title: "Hidden Gem Feb 2026",
    date: "2026-02-15",
    venue: "Fish Pot Studios",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/flyer-feb-2026.jpg",
    isPast: true,
  },
];

/* ── SoundCloud tracks ───────────────────────────────── */
/*
  HOW TO GET YOUR EMBED URL:
  1. Go to a track/set on soundcloud.com/jadethegem888
  2. Click ··· → Share → Embed
  3. Copy just the "src" value from the <iframe> tag
  4. Paste it into embedSrc below
*/
export const featuredTrack: Track = {
  id: "featured",
  title: "UNCUT VOL. 1",
  embedSrc:
    "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%253Aplaylists%253A1982508040&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  visual: true,
};

export const tracks: Track[] = [
  {
    id: "t1",
    title: "Fire Mix Vol. 1",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/jadethegem888&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
  },
  {
    id: "t2",
    title: "Club Heat Vol. 2",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/jadethegem888&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
  },
  {
    id: "t3",
    title: "504 Bounce Session",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/jadethegem888&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=false&show_user=true&show_reposts=false&show_teaser=false",
  },
];

/* ── Social links ────────────────────────────────────── */
export const socialLinks: SocialLink[] = [
  {
    platform: "Instagram",
    handle: "@jluhvv",
    url: "https://instagram.com/jluhvv",
  },
  {
    platform: "SoundCloud",
    handle: "jadethegem888",
    url: "https://soundcloud.com/jadethegem888",
  },
  {
    platform: "X",
    handle: "@jluhvv",
    url: "https://twitter.com/jluhvv",
  },
];

/* ── Formspree endpoints (override via env vars) ─────── */
export const FORMSPREE_BOOKING =
  process.env.NEXT_PUBLIC_FORMSPREE_BOOKING ??
  "https://formspree.io/f/YOUR_BOOKING_FORM_ID";

export const FORMSPREE_NEWSLETTER =
  process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER ??
  "https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID";
