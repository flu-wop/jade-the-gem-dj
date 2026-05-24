import type { Metadata } from "next";
import { Instagram, Music, Twitter, Mail } from "lucide-react";
import { socialLinks } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet DJ Jade the Gem — New Orleans born event curator bringing fire mixes and electrifying live energy to clubs and events worldwide.",
};

const iconMap: Record<string, React.ElementType> = {
  Instagram,
  SoundCloud: Music,
  X: Twitter,
};

const photos = [
  { src: "/images/about-placeholder-1.svg", span: "row-span-2", aspect: "aspect-[3/4]" },
  { src: "/images/about-placeholder-2.svg", span: "", aspect: "aspect-square" },
  { src: "/images/about-placeholder-3.svg", span: "", aspect: "aspect-square" },
  { src: "/images/about-placeholder-4.svg", span: "col-span-2", aspect: "aspect-video" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <p className="section-label">Event Curator</p>
          <h1 className="section-title">
            About <span className="text-jade-light">Jade</span>
          </h1>
        </header>

        {/* ── Bio + photos grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Bio copy */}
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="font-display text-3xl text-jade-light mb-4">
                Bio
              </h2>
              <div className="neon-divider" />
              <div className="space-y-4 text-mist/60 leading-relaxed text-sm mt-4">
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

            {/* Socials */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-gold-muted mb-5">
                Connect
              </h3>
              <div className="space-y-3">
                {socialLinks.map((s) => {
                  const Icon = iconMap[s.platform] ?? Music;
                  return (
                    <a
                      key={s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 hover:border-jade/30 transition-colors group"
                    >
                      <Icon
                        size={18}
                        className="text-jade-light group-hover:scale-110 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cream">{s.platform}</p>
                        <p className="text-xs text-mist/40">{s.handle}</p>
                      </div>
                      <span className="text-jade-light opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                        →
                      </span>
                    </a>
                  );
                })}
                <a
                  href="mailto:jadedwheeler8@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-white/5 hover:border-jade/30 transition-colors group"
                >
                  <Mail
                    size={18}
                    className="text-jade-light group-hover:scale-110 transition-transform"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-cream">Email</p>
                    <p className="text-xs text-mist/40">jadedwheeler8@gmail.com</p>
                  </div>
                  <span className="text-jade-light opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 gap-4 auto-rows-min">
            {photos.map(({ src, aspect }, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden bg-surface-2 border border-white/5 ${aspect} ${i === 0 ? "row-span-2" : ""} ${i === 3 ? "col-span-2" : ""}`}
                style={{
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Book CTA ── */}
        <div className="text-center">
          <p className="text-mist/40 text-sm mb-4">
            Ready to bring the energy to your event?
          </p>
          <a href="/bookings" className="btn-primary">
            Book DJ Jade →
          </a>
        </div>

      </div>
    </div>
  );
}
