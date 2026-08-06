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
  /** Display time, e.g. "10:00 PM" */
  time?: string;
  /** Address is private and only shared with confirmed guests via RSVP form */
  rsvpRequired?: boolean;
  /** Max total guests (summed across all RSVPs) before the event shows as sold out */
  rsvpCapacity?: number;
  /** Paid-ticket event: price in whole dollars */
  ticketPrice?: number;
  /** Max tickets sold before the event shows as sold out */
  ticketCapacity?: number;
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
export const upcomingEvents: Event[] = [
  {
    id: "after-white-linen-aug-2026",
    title: "After White Linen",
    date: "2026-08-01",
    venue: "RSVP for Address",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/flyer-aug-2026-after-white-linen.jpg",
    time: "10:00 PM",
    rsvpRequired: true,
    rsvpCapacity: 40,
  },
  {
    id: "dirty-laundry-aug-2026",
    title: "Dirty Laundry",
    date: "2026-08-08",
    venue: "530 S Norman C Francis Pkwy",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/flyer-aug-2026-dirty-laundry.jpg",
    time: "10:00 PM",
    ticketPrice: 10,
    ticketCapacity: 20,
  },
];

/* ── Past events ─────────────────────────────────────── */
export const pastEvents: Event[] = [
  {
    id: "p2",
    title: "Hidden Gem",
    date: "2025-04-20",
    venue: "513 Dumaine St",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/flyer-apr-2025-hidden-gem.jpg",
    time: "8:00 PM",
    isPast: true,
  },
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
  title: "Sunset Playlist",
  embedSrc:
    "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jadethegem888/sets/interstate-sunset&color=%237c8c84&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
};

export const tracks: Track[] = [
  {
    id: "t0",
    title: "SUNSET PLAYLIST",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/jadethegem888/sets/interstate-sunset&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  },
  {
    id: "t1",
    title: "UNCUT VOL. 1",
    embedSrc:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1982508040&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
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
export const FORMSPREE_NEWSLETTER =
  process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER ??
  "https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID";
