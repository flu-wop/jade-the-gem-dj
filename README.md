# DJ Jade the Gem — Artist Website v2

> **Live:** https://jade-the-gem-dj.vercel.app  
> Stack: Next.js 15 · App Router · TypeScript · Tailwind CSS · Static Export

---

## 🗂 Folder Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, Navbar/Footer
│   ├── globals.css         # Tailwind imports + global component classes
│   ├── page.tsx            # / Home
│   ├── music/page.tsx      # /music
│   ├── events/page.tsx     # /events
│   ├── bookings/page.tsx   # /bookings
│   └── about/page.tsx      # /about
├── components/
│   ├── Navbar.tsx          # Sticky top nav with mobile hamburger
│   ├── Footer.tsx          # Socials, links, copyright
│   ├── SoundCloudEmbed.tsx # iframe wrapper (visual or compact)
│   ├── EventCard.tsx       # Event flyer card with date/venue/CTA
│   ├── BookingForm.tsx     # Full inquiry form (Formspree)
│   └── NewsletterForm.tsx  # Email signup (Formspree)
├── lib/
│   └── data.ts             # ← ALL site content: events, tracks, social links
├── public/
│   ├── robots.txt          # Static — no dynamic route handler
│   ├── sitemap.xml         # Static — no dynamic route handler
│   └── images/             # Hero, flyers, about photos, OG image
├── next.config.mjs         # output: 'export', images: unoptimized
├── tailwind.config.ts
├── postcss.config.mjs
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
# → Edit .env.local with your real Formspree IDs

# 4. Run
npm run dev
# → Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel

### Via Dashboard (recommended)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "v2 — full multi-page build"
   git push origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import `flu-wop/jade-the-gem-dj`
4. Vercel auto-detects Next.js — click **Deploy**
5. In **Project → Settings → Environment Variables** add:
   - `NEXT_PUBLIC_FORMSPREE_BOOKING` → your Formspree booking form URL
   - `NEXT_PUBLIC_FORMSPREE_NEWSLETTER` → your Formspree newsletter URL
6. Redeploy (or push any change to trigger auto-deploy)

### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## ✏️ Customization Guide

### 1 — Update site content (events, mixes, social links)
Edit **`lib/data.ts`** — it's the single source of truth for all data.

### 2 — Replace placeholder images
Drop your real files into **`public/images/`**:

| File | Used In |
|------|---------|
| `hero-placeholder.svg` | Home hero background |
| `flyer-placeholder-1.jpg … 6.jpg` | Event cards |
| `about-placeholder-1 … 4.jpg` | About page photo grid |
| `og-image.jpg` | Social share preview (1200×630) |

### 3 — Real SoundCloud embeds
1. Open a track/set at [soundcloud.com/jadethegem888](https://soundcloud.com/jadethegem888)
2. Click **···** → **Share** → **Embed**
3. Copy the `src` value from the `<iframe>` tag
4. Paste into `lib/data.ts` → `featuredTrack.embedSrc` or `tracks[n].embedSrc`

### 4 — Formspree forms
1. Go to [formspree.io](https://formspree.io) → create two forms
2. Copy the form endpoint URLs
3. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_FORMSPREE_BOOKING=https://formspree.io/f/xxxxxxxx
   NEXT_PUBLIC_FORMSPREE_NEWSLETTER=https://formspree.io/f/yyyyyyyy
   ```
4. Also add to Vercel's Environment Variables panel

### 5 — Update the sitemap
Edit **`public/sitemap.xml`** — just find/replace the domain if it changes.

---

## 🎨 Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0a0a0a` | Page background |
| `surface` | `#111111` | Card/section backgrounds |
| `surface-2` | `#1a1a1a` | Input fields, nested cards |
| `neon-green` | `#00ff9d` | Primary accent, headings |
| `neon-purple` | `#a855f7` | Secondary accent |
| `neon-gold` | `#ffd700` | Tertiary / "coming soon" |
| Font: display | Bebas Neue | All headings (h1–h6) |
| Font: sans | Montserrat | Body text, UI labels |

---

## 🛠 Available Scripts

```bash
npm run dev     # Dev server → http://localhost:3000
npm run build   # Static export → /out
npm run lint    # ESLint
```

---

## ⚠️ Build Notes

- `output: 'export'` → site is fully static. No server-side code, no API routes.
- `robots.txt` and `sitemap.xml` are **static files in `/public/`** — do **not** add `app/robots.ts` or `app/sitemap.ts` (they cause build errors with static export).
- `images.unoptimized: true` — required for static export. Use Cloudinary/imgix for production image optimization if needed.

---

**Made with 💚 in New Orleans**
