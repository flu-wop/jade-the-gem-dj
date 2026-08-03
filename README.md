# DJ Jade the Gem — Artist Website v3

> **Live:** https://dahiddengem.com
> Stack: Next.js 15 · App Router · TypeScript · Tailwind CSS · Turso · Stripe · Resend

---

## 🗂 Folder Structure

```
.
├── app/
│   ├── layout.tsx                       # Root layout — fonts, metadata, Navbar/Footer
│   ├── globals.css                      # Tailwind imports + global component classes
│   ├── page.tsx                         # / Home
│   ├── music/page.tsx                   # /music
│   ├── events/page.tsx                  # /events
│   ├── bookings/page.tsx                # /bookings — event/session booking + curated playlists
│   ├── merch-build/page.tsx             # /merch-build — custom merch orders
│   ├── press/page.tsx                   # /press
│   ├── privacy/page.tsx                 # /privacy
│   ├── refund-shipping/page.tsx         # /refund-shipping
│   ├── about/page.tsx                   # /about
│   ├── admin/page.tsx                   # /admin — password-gated dashboard
│   └── api/
│       ├── checkout/route.ts            # Stripe checkout — bookings
│       ├── merch/checkout/route.ts      # Stripe checkout — merch
│       ├── merch-build/checkout/route.ts
│       ├── playlist/checkout/route.ts   # Stripe checkout — curated playlist commissions
│       ├── webhook/route.ts             # Stripe webhook (checkout.session.completed)
│       ├── newsletter/route.ts          # Newsletter signup → Turso + Resend welcome email
│       ├── newsletter-engine/
│       │   ├── cron/route.ts            # Vercel Cron — Claude drafts a weekly issue
│       │   ├── approve/route.ts         # Signed approve/reject link → confirm page → send
│       │   └── unsubscribe/route.ts     # One-click unsubscribe
│       ├── rsvp/route.ts                # Event RSVPs
│       ├── printify/products/route.ts
│       ├── debug-printify/route.ts
│       └── admin/
│           ├── login/route.ts
│           ├── orders/route.ts
│           ├── rsvp/route.ts
│           └── rsvp-broadcast/route.ts
├── components/
│   ├── Navbar.tsx                       # Sticky top nav with mobile hamburger
│   ├── Footer.tsx                       # Socials, links, copyright
│   ├── SoundCloudEmbed.tsx              # iframe wrapper (visual or compact)
│   ├── EventCard.tsx                    # Event flyer card with date/venue/CTA
│   ├── BookingForm.tsx                  # Booking inquiry form
│   └── NewsletterForm.tsx               # Email signup → posts to /api/newsletter
├── lib/
│   ├── data.ts                          # Site content: events, tracks, social links
│   ├── db.ts                            # Turso client (lazy-init) + table schema/migrations
│   ├── resend.ts                        # Resend client + booking/order email senders
│   ├── admin-auth.ts                    # Admin session/auth helpers
│   ├── rate-limit.ts                    # Turso-backed rate limiter
│   └── newsletter-engine/               # Automated newsletter (see below)
│       ├── config.ts                    # Brand voice, tone, guardrails — edit this per campaign
│       ├── db.ts                        # newsletter_issues + newsletter_subscribers tables
│       ├── generate.ts                  # Claude Sonnet + web_search → drafts issue + blog post
│       ├── template.ts                  # Email HTML rendering
│       └── tokens.ts                    # Signed approve/reject/unsubscribe tokens
├── public/
│   └── images/                          # Hero, flyers, about photos, OG image
├── vercel.json                          # Cron schedule for the newsletter engine
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.example
└── package.json
```

---

## 🚀 Quick Start (Local Dev)

```bash
# 1. Clone
git clone https://github.com/flu-wop/jade-the-gem-dj.git
cd jade-the-gem-dj

# 2. Install
npm install

# 3. Environment variables
cp .env.example .env.local
# → fill in real values (Turso, Stripe, Resend, Anthropic, Printify, admin password)

# 4. Run
npm run dev
# → Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "describe the change"
   git push origin main
   ```
2. Vercel auto-deploys on push (project already connected)
3. **Project → Settings → Environment Variables** — see the full checklist in `.env.example`
4. **Cron** — `vercel.json` registers the newsletter engine's weekly draft job automatically on deploy; no separate setup needed

---

## 📰 Newsletter Engine

Automated weekly newsletter: a Vercel Cron job asks Claude (Sonnet + live web search) to research
what's relevant to Jade's audience and draft an issue + matching content. Nothing sends without a
human clicking Approve. Full mechanics documented in the `newsletter-engine` skill — short version:

```
Cron → Claude drafts (or skips, if nothing genuinely good) → email to the approver with
Approve/Reject links → click opens a confirmation page (no side effects) → confirming sends
via Resend, batched, with proper List-Unsubscribe headers
```

- Edit **`lib/newsletter-engine/config.ts`** to change tone, topics, banned subjects, or the
  approver email.
- Cadence lives in **`vercel.json`** — currently weekly (Mondays, 9am UTC).
- Subscribers come from `NewsletterForm.tsx` → `/api/newsletter` → the `newsletter_subscribers`
  Turso table. (This table was renamed from a plain `newsletter` table in Aug 2026 — the
  migration in `lib/db.ts` runs automatically and is safe to re-run.)

---

## ✏️ Customization Guide

### 1 — Update site content (events, mixes, social links)
Edit **`lib/data.ts`** — single source of truth for event/track/social data.

### 2 — Replace placeholder images
Drop real files into **`public/images/`** (hero, event flyers, about-page photos, OG image).

### 3 — Real SoundCloud embeds
1. Open a track/set at [soundcloud.com/jadethegem888](https://soundcloud.com/jadethegem888)
2. **···** → **Share** → **Embed** → copy the `src` value from the `<iframe>`
3. Paste into `lib/data.ts` → `featuredTrack.embedSrc` or `tracks[n].embedSrc`

### 4 — Bookings, merch, and playlist commissions
All three go through Stripe Checkout (`/api/checkout`, `/api/merch/checkout`,
`/api/playlist/checkout`), confirmed via `/api/webhook`, logged to Turso, confirmed by email via
Resend. Discount codes are validated server-side — see the checkout routes, never trust a client-
sent amount.

### 5 — Update the sitemap
Edit **`public/sitemap.xml`** if the domain ever changes.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0e0b14` | Page background |
| `surface` | `#16121f` | Card/section backgrounds |
| `surface-2` | `#1e1829` | Input fields, nested cards |
| `jade` / `jade-light` | `#2a7a6f` / `#3aa898` | Primary accent |
| `plum` / `plum-light` | `#4a3f8f` / `#6355b8` | Secondary accent |
| `gold` | `#d4af37` | Tertiary accent |
| `gold-muted` | `#b8a7d9` | Muted highlight |
| `mist` | `#c4b8e0` | Body text on dark |
| `cream` | `#f0ebe8` | Light text/backgrounds |
| Font: display | Bebas Neue (Bungee/Impact fallback) | Headings |
| Font: sub | Anton | Secondary headings |
| Font: body | Montserrat | Body text, UI labels |

`neon-green` / `neon-purple` / `neon-gold` still exist in `tailwind.config.ts` as **legacy
aliases** pointing at `jade-light` / `gold-muted` / `gold` — old class names keep working, but
use the real token names above in new code.

---

## 🛠 Available Scripts

```bash
npm run dev     # Dev server → http://localhost:3000
npm run build   # Production build
npm run lint    # ESLint
```

---

## ⚠️ Build Notes

- This is a normal server-rendered Next.js app (API routes, Stripe webhooks, cron) — **not** a
  static export. An earlier version of this README described `output: 'export'`; that's no
  longer accurate and hasn't been for a while.
- `images.unoptimized: true` is still set in `next.config.mjs` — fine as-is, but worth revisiting
  if image optimization becomes a priority.
- Every write endpoint (checkout, newsletter signup, RSVP, admin login) is rate-limited via
  `lib/rate-limit.ts` — a Turso-backed fixed window, not in-memory, so it survives serverless
  cold starts. Follow the same pattern for any new POST route.

---

**Made with 💚 in New Orleans**
