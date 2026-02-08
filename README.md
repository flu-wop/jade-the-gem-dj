# DJ Jade the Gem - Artist Website

A modern, fast, and SEO-optimized artist website built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

## 🚀 Features

- ⚡ Next.js 15 with App Router
- 🎨 Dark/club aesthetic with neon accents
- 📱 Mobile-first responsive design
- 🔍 SEO optimized with metadata, Open Graph, and sitemaps
- 🎵 SoundCloud embed integration
- 📧 Contact forms powered by Formspree
- 🎯 Static export ready for Vercel deployment
- 💎 TypeScript strict mode
- 🎭 Tailwind CSS for styling

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- A GitHub account
- A Vercel account (free tier works great)

## 🛠️ Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dj-jade-website.git
cd dj-jade-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FORMSPREE_BOOKING_FORM=https://formspree.io/f/YOUR_BOOKING_FORM_ID
NEXT_PUBLIC_FORMSPREE_NEWSLETTER_FORM=https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID
NEXT_PUBLIC_CONTACT_EMAIL=booking@djjadethegem.com
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Customization Guide

### Replace Placeholder Images

Add your images to the `public/images/` directory:

- `placeholder-hero.jpg` - Home page hero background
- `placeholder-album-art.jpg` - Music page featured release
- `event-flyer-1.jpg`, `event-flyer-2.jpg`, etc. - Event flyers
- `placeholder-about-1.jpg` through `placeholder-about-4.jpg` - About page photos
- `og-image.jpg` - Open Graph social share image (1200x630px recommended)

### Update SoundCloud Embeds

1. Go to your SoundCloud track
2. Click "Share" → "Embed"
3. Copy the embed code
4. Extract the `src` URL from the iframe
5. Update the `embedUrl` in:
   - `app/page.tsx` (home page)
   - `app/music/page.tsx` (music page tracks array)

### Update Event Data

Edit the events arrays in `app/events/page.tsx`:

```tsx
const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Your Event Name",
    date: "2026-03-15", // YYYY-MM-DD format
    venue: "Venue Name",
    city: "City",
    state: "ST",
    flyerImage: "/images/your-flyer.jpg",
    ticketLink: "https://ticketlink.com", // Optional
  },
];
```

### Set Up Formspree Forms

1. Go to [formspree.io](https://formspree.io)
2. Sign up for free
3. Create two forms:
   - Booking Form
   - Newsletter Form
4. Copy the form IDs and update your `.env.local` file

### Update Social Links

Update social media handles in:

- `components/Footer.tsx`
- `app/about/page.tsx`
- `app/contact/page.tsx`

## 🚀 Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/dj-jade-website.git
git push -u origin main
```

2. **Deploy on Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add your Formspree form IDs:
     - `NEXT_PUBLIC_FORMSPREE_BOOKING_FORM`
     - `NEXT_PUBLIC_FORMSPREE_NEWSLETTER_FORM`
     - `NEXT_PUBLIC_CONTACT_EMAIL`
   - Redeploy the project

### Method 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to deploy.

### Auto-Deployment

Once connected to Vercel:

- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Instant rollbacks if needed

## 📁 Project Structure

```
dj-jade-website/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles & Tailwind
│   ├── music/             # Music page
│   ├── events/            # Events page
│   ├── bookings/          # Bookings form page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/            # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SoundCloudPlayer.tsx
│   ├── BookingForm.tsx
│   ├── EventCard.tsx
│   └── NewsletterForm.tsx
├── lib/                   # TypeScript types & utilities
│   └── types.ts
├── public/                # Static assets
│   └── images/           # Image files
├── next.config.mjs       # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## 🎨 Design Tokens

### Colors

- Background: `#0a0a0a`
- Surface: `#111111`
- Neon Green: `#00ff9d`
- Neon Purple: `#a855f7`
- Neon Gold: `#ffd700`

### Fonts

- Display: Bebas Neue
- Body: Inter

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📱 Testing on Mobile

1. Get your local IP address:

```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

2. Access from mobile device on same network:

```
http://YOUR_IP_ADDRESS:3000
```

## 🐛 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### Formspree Not Working

- Check that form IDs are correct in `.env.local`
- Verify Formspree account is active
- Check browser console for errors

### Images Not Showing

- Ensure images are in `public/images/`
- Check file paths (case-sensitive)
- Try rebuilding: `npm run build`

## 📞 Support

For issues or questions:

- Email: booking@djjadethegem.com
- Instagram: [@jluhvv](https://instagram.com/jluhvv)

## 📄 License

© 2026 DJ Jade the Gem. All rights reserved.

---

**Built with 💚 in New Orleans**
