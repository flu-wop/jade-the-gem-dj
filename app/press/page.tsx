import Link from "next/link";
import { socialLinks } from "@/lib/data";

export const metadata = {
  title: "Press Kit | DJ Jade the Gem",
  description:
    "DJ Jade the Gem press kit — bio, booking info, genres, and press photos for media and promoters.",
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background text-cream">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 text-center border-b border-white/10">
        <p className="text-gold font-anton tracking-widest text-sm uppercase mb-3">
          Event Curator
        </p>
        <h1 className="font-bebas text-6xl md:text-8xl text-cream mb-4 leading-none">
          Press Kit
        </h1>
        <p className="text-mist font-montserrat text-lg max-w-xl mx-auto">
          Everything you need to book and promote DJ Jade the Gem.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20 space-y-24">

        {/* ── Bio ──────────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-bebas text-4xl text-gold mb-6 tracking-wide">Bio</h2>
            <div className="space-y-5 text-mist font-montserrat text-base leading-relaxed">
              <p>
                <span className="text-cream font-semibold">Jade the Gem</span> is a
                New Orleans-based DJ and the visionary behind Hidden Gem events. A
                true music lover with an intuitive ear, she approaches every set
                differently — blending hip-hop, afrobeats, R&amp;B, house, and more
                based on what she&apos;s feeling in the moment. Her timeless, soulful
                selections create atmospheres where the music does the talking and
                the energy stays high all night.
              </p>
              <p>
                Through Hidden Gem, Jade curates experiences that organically bring
                people together through timeless sound in carefree, soulful
                environments. You can feel her genuine love for music in every
                transition — it&apos;s what turns a regular night into something
                special and unforgettable.
              </p>
              <p>
                Off the decks, she&apos;s in the studio creating new mixes, searching
                for fresh sounds, or expanding Hidden Gem — her brand dedicated to
                bringing New Orleans talent and culture to new audiences.
              </p>
            </div>

            {/* Connect */}
            <div className="mt-10">
              <h3 className="font-bungee text-sm text-gold-muted tracking-widest uppercase mb-4">
                Connect
              </h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map((link) => (
                  
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-mist hover:text-jade-light transition-colors font-montserrat text-sm group"
                  >
                    <span className="text-gold font-semibold w-24 shrink-0">
                      {link.platform}
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {link.handle} →
                    </span>
                  </a>
                ))}
                
                  href="mailto:jadedwheeler8@gmail.com"
                  className="flex items-center gap-3 text-mist hover:text-jade-light transition-colors font-montserrat text-sm group"
                >
                  <span className="text-gold font-semibold w-24 shrink-0">Email</span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    jadedwheeler8@gmail.com →
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Side image */}
          <div className="rounded-2xl overflow-hidden aspect-[3/4] relative">
            <img
              src="/images/press-photo-3.jpg"
              alt="DJ Jade the Gem at the decks"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </section>

        {/* ── Press Photos ─────────────────────────────────── */}
        <section>
          <h2 className="font-bebas text-4xl text-gold mb-8 tracking-wide">
            Press Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "/images/press-photo-1.jpg", alt: "DJ Jade the Gem — street style" },
              { src: "/images/press-photo-2.jpg", alt: "DJ Jade the Gem — at the booth" },
              { src: "/images/press-photo-3.jpg", alt: "DJ Jade the Gem — studio session" },
              { src: "/images/press-photo-4.jpg", alt: "DJ Jade the Gem" },
            ].map((photo, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden aspect-[3/4] bg-surface group cursor-pointer"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          <p className="text-mist/60 font-montserrat text-sm mt-4">
            High-res versions available — contact{" "}
            
              href="mailto:jadedwheeler8@gmail.com"
              className="text-jade-light hover:underline"
            >
              jadedwheeler8@gmail.com
            </a>
          </p>
        </section>

        {/* ── Genres ───────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-bebas text-4xl text-gold mb-6 tracking-wide">Genres</h2>
            <div className="flex flex-wrap gap-3">
              {["Bounce", "Hip-Hop", "R&B", "Club", "New Orleans", "Top 40", "Afrobeats", "House"].map(
                (genre) => (
                  <span
                    key={genre}
                    className="px-4 py-2 rounded-full border border-jade/40 text-jade-light font-montserrat text-sm bg-jade/5"
                  >
                    {genre}
                  </span>
                )
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bebas text-4xl text-gold mb-6 tracking-wide">
              Available For
            </h2>
            <ul className="grid grid-cols-2 gap-2 text-mist font-montserrat text-sm">
              {[
                "Clubs & Nightlife",
                "Private Parties",
                "Festivals",
                "Corporate Events",
                "Birthdays & Celebrations",
                "Pop-Ups & Activations",
                "Weddings",
                "Brand Events",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-jade-light shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Booking ──────────────────────────────────────── */}
        <section className="bg-surface rounded-2xl p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8 border border-white/5">
          <div>
            <h2 className="font-bebas text-4xl text-gold mb-1 tracking-wide">Booking</h2>
            <p className="text-cream font-montserrat text-3xl font-bold mt-2">
              $150<span className="text-mist text-base font-normal">/hr</span>
            </p>
            <p className="text-mist font-montserrat text-sm mt-1">2-hour minimum</p>
          </div>
          <div className="flex flex-col gap-3">
            
              href="mailto:jadedwheeler8@gmail.com"
              className="text-mist hover:text-cream font-montserrat text-sm transition-colors"
            >
              jadedwheeler8@gmail.com
            </a>
            <Link
              href="/bookings"
              className="inline-block bg-jade hover:bg-jade-light text-cream font-bungee text-sm tracking-wide px-8 py-3 rounded-full transition-colors text-center"
            >
              Book Online
            </Link>
          </div>
        </section>

        {/* ── EPK ──────────────────────────────────────────── */}
        <section className="text-center py-8">
          <h2 className="font-bebas text-4xl text-gold mb-3 tracking-wide">EPK</h2>
          <p className="text-mist font-montserrat text-sm mb-4">Full press kit PDF</p>
          <span className="inline-block border border-white/20 text-mist font-montserrat text-sm px-6 py-3 rounded-full">
            Coming Soon
          </span>
        </section>
      </div>
    </main>
  );
}
