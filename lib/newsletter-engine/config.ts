// lib/newsletter-engine/config.ts
// Per-client config for the newsletter engine. Copied from the Epoch Skin
// reference build (lib/newsletter-engine/) — this file's shape is the only
// thing that changes per client.

export const newsletterConfig = {
  client: 'jade-the-gem-dj',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dahiddengem.com',
  brandName: 'Jade the Gem',
  founderFirstName: 'Jade',

  niche: 'DJ and open-format artist based in New Orleans — clubs, festivals, private and corporate events, plus curated playlist commissions',
  audience:
    "Jade the Gem's newsletter subscribers — fans, past/prospective event clients, and people who booked a curated playlist. They follow her for the New Orleans DJ scene and for what she's spinning, not generic music-industry news.",

  tone:
    "DJ/artist energy — confident, high-vibe, first-person voice. Short punchy lines over long paragraphs. New Orleans pride comes through naturally (the '504 energy' framing already used on the site), never forced. Talk about music like someone who lives it, not like a press release. No corporate marketing-speak, no generic 'exciting news!' filler.",

  bannedTopics: [
    'medical, legal, or financial advice',
    'specific client names or private event details',
    'competitor DJs/venues by name',
    'pricing specifics beyond what is already public on the bookings page',
  ],

  // Brand colors reused from the site (tailwind.config.ts) for the email template.
  brand: {
    jade: '#2a7a6f',
    jadeLight: '#3aa898',
    plum: '#4a3f8f',
    gold: '#d4af37',
    cream: '#f0ebe8',
  },

  approverEmail: process.env.APPROVER_EMAIL ?? 'flu.wop@gmail.com',
  fromEmail: process.env.RESEND_FROM_EMAIL ?? 'hello@dahiddengem.com',

  // Content guardrails (hard rules — see newsletter-engine skill/spec)
  guardrails: {
    everyClaimNeedsSource: true,
    maxItems: 4,
    minItems: 2, // fewer than this → skip recommendation instead of padding
  },
} as const;

export type NewsletterConfig = typeof newsletterConfig;
