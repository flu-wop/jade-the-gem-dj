import type { Metadata } from "next";
import { Download, Mail, Instagram, Music, Twitter } from "lucide-react";
import { socialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Press Kit",
  description: "DJ Jade the Gem press kit — bio, booking info, genres, and press photos for media and promoters.",
};

const iconMap: Record<string, React.ElementType> = {
  Instagram,
  SoundCloud: Music,
  X: Twitter,
};

const photos = [
  { src: "/images/about-placeholder-1.svg", aspect: "aspect-[3/4]", row: "row-span-2" },
  { src: "/images/about-placeholder-2.svg", aspect: "aspect-square", row: "" },
  { src: "/images/about-placeholder-3.svg", aspect: "aspect-square", row: "" },
  { src: "/images/about-placeholder-4.svg", aspect: "aspect-video",  row: "col-span-2" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        <header className="text-center mb-16">
          <p className="section-label">Event Curator</p>
          <h1 className="section-title">
            Press <span className="text-gold">Kit</span>
          </h1>
          <p className="text-mist/40 font-body text-sm mt-4">
            Everything you need to book and promote DJ Jade the Gem.
          </p>
        </header>

        {/* ── Bio + photos ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          <div className="space-y-6">
            {/* Bio */}
            <div className="card p-8">
              <h2 className="font-display text-2xl text-jade-light tracking-wider uppercase mb-4">Bio</h2>
              <div className="neon-divider" />
              <div className="space-y-4 text-mist/60 font-body leading-relaxed text-sm mt-4">
                <p>
                  Jade has been setting dance floors on fire across the Gulf
                  Coast and beyond. With a sound rooted in the 504 — bounce,
                  hip-hop, R&amp;B, and club bangers — she creates an atmosphere
                  where the music does the talking and the crowd never wants it
                  to stop.
                </p>
                <p>
                  Off the decks you&apos;ll find her in the studio crafting new
                  mixes, hunting for the next new record to break on her
                  playlist, or building Hidden Gem — her brand dedicated to
                  celebrating New Orleans talent and culture on a world stage.
                </p>
              </div>
            </div>

            {/* Connect */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-gold-muted mb-5">Connect</h3>
              <div className="space-y-3">
                {socialLinks.map((s) => {
                  const Icon = iconMap[s.platform] ?? Music;
                  return (
                    <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 hover:border-jade/30 transition-colors group">
                      <Icon size={18} className="text-jade-light group-hover:scale-110 transition-transform" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cream">{s.platform}</p>
                        <p className="text-xs text-mist/40">{s.handle}</p>
                      </div>
                      <span className="text-jade-light opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                    </a>
                  );
                })}
                <a href="mailto:jadedwheeler8@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 hover:border-jade/30 transition-colors group">
                  <Mail size={18} className="text-jade-light group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cream">Email</p>
                    <p className="text-xs text-mist/40">jadedwheeler8@gmail.com</p>
                  </div>
                  <span className="text-jade-light opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-min">
            {photos.map(({ src, aspect, row }, i) => (
              <div key={i}
                className={`rounded-2xl overflow-hidden bg-surface-2 border border-white/5 ${aspect} ${row}`}
                style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
              />
            ))}
          </div>
        </div>

        {/* ── Press info grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

          <div className="md:col-span-2 space-y-6">

            {/* Genres */}
            <div className="card p-8">
              <h2 className="font-display text-2xl text-jade-light tracking-wider uppercase mb-4">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {["Bounce", "Hip-Hop", "R&B", "Club", "New Orleans", "Top 40", "Afrobeats"].map((g) => (
                  <span key={g} className="px-3 py-1 bg-surface-2 border border-plum/20 text-mist/60 text-xs font-sub tracking-wider uppercase">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Available for */}
            <div className="card p-8">
              <h2 className="font-display text-2xl text-jade-light tracking-wider uppercase mb-4">Available For</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Clubs & Nightlife", "Private Parties", "Festivals", "Corporate Events", "Birthdays & Celebrations", "Pop-Ups & Activations", "Weddings", "Brand Events"].map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm font-body text-mist/50">
                    <div className="w-1 h-1 bg-jade-light rounded-full shrink-0" />{t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Booking */}
            <div className="card p-6">
              <h2 className="font-display text-xl text-cream tracking-wider uppercase mb-4">Booking</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-sub text-[10px] tracking-[0.2em] uppercase text-mist/30 mb-1">Rate</p>
                  <p className="text-jade-light font-display text-3xl">$150/hr</p>
                  <p className="text-mist/30 text-xs font-body">2 hour minimum</p>
                </div>
                <div className="border-t border-plum/20 pt-3">
                  <p className="font-sub text-[10px] tracking-[0.2em] uppercase text-mist/30 mb-1">Contact</p>
                  <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline text-xs font-body">
                    jadedwheeler8@gmail.com
                  </a>
                </div>
              </div>
              <a href="/bookings" className="btn-primary w-full justify-center mt-5 text-xs py-2.5">
                Book Online
              </a>
            </div>

            {/* EPK */}
            <div className="card p-6">
              <h2 className="font-display text-xl text-cream tracking-wider uppercase mb-2">EPK</h2>
              <p className="text-mist/30 text-xs font-body mb-4">Full press kit PDF</p>
              <button disabled className="btn-ghost w-full justify-center text-xs py-2.5 opacity-30 cursor-not-allowed">
                <Download size={14} /> Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* Press photos */}
        <div>
          <h2 className="font-display text-2xl text-cream tracking-wider uppercase mb-6">Press Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-square card flex flex-col items-center justify-center gap-2 group hover:border-jade/30 transition-all cursor-pointer">
                <div className="w-10 h-10 bg-surface-2 flex items-center justify-center">
                  <svg className="w-5 h-5 text-mist/20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
                <p className="text-mist/20 text-xs font-body">Photo {i}</p>
              </div>
            ))}
          </div>
          <p className="text-mist/20 text-xs font-body mt-4">
            Press photos coming soon. Contact{" "}
            <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
              jadedwheeler8@gmail.com
            </a>{" "}
            for immediate access.
          </p>
        </div>

      </div>
    </div>
  );
}
