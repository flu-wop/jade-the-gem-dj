import type { Metadata } from "next";
import Link from "next/link";
import { Music, Calendar, Headphones, ArrowRight } from "lucide-react";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import MerchCard from "@/components/MerchCard";
import { featuredTrack, upcomingEvents, merchItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
  description:
    "New Orleans DJ bringing fire mixes and electrifying live energy to clubs, festivals, and private events.",
};

export default function HomePage() {
  const nextThree = upcomingEvents.slice(0, 3);

  return (
    <>
      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: "url('/images/hero-placeholder.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* bottom fade to site background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background pointer-events-none" />

        <div className="relative z-10 text-center px-4 py-32 max-w-5xl mx-auto w-full">
          {/* Tag */}
          <p className="section-label mb-6">504 Creative · New Orleans, LA</p>

          {/* Artist name */}
          <h1 className="font-display text-7xl sm:text-8xl md:text-[9rem] lg:text-[11rem] leading-none tracking-wide text-white mb-4 glow-green">
            DJ JADE
            <br />
            <span className="text-neon-green">THE GEM</span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-2xl font-bold uppercase tracking-[0.2em] text-neon-purple mb-10">
            Fire Mixes &amp; Live Energy
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <Link href="/music" className="btn-primary">
              <Music size={16} />
              Listen Now
            </Link>
            <Link href="/bookings" className="btn-secondary">
              <Headphones size={16} />
              Book Me
            </Link>
            <Link href="/events" className="btn-ghost">
              <Calendar size={16} />
              Upcoming Events
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          LATEST MIX
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-surface">
        <div className="max-w-3xl mx-auto">
          <p className="section-label text-center">Now Playing</p>
          <h2 className="section-title text-center mb-10">
            Latest{" "}
            <span className="text-neon-green">Mix</span>
          </h2>

          <SoundCloudEmbed
            src={featuredTrack.embedSrc}
            visual={true}
            title={featuredTrack.title}
          />

          <div className="mt-6 text-center">
            <a
              href="https://soundcloud.com/jadethegem888"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs"
            >
              <Music size={14} />
              Follow on SoundCloud
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          UPCOMING EVENTS (teaser — 3 cards)
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="section-label">Live &amp; In Person</p>
              <h2 className="section-title">
                Upcoming{" "}
                <span className="text-neon-purple">Events</span>
              </h2>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neon-green hover:text-white transition-colors shrink-0"
            >
              All Events <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextThree.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NOLA ROOTS + STATS
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <p className="section-label">Where It Started</p>
            <h2 className="section-title mb-6">
              New Orleans{" "}
              <span className="text-neon-gold">Born</span>
            </h2>
            <div className="neon-divider" />
            <p className="text-white/60 leading-relaxed mt-4 text-sm md:text-base max-w-lg">
              Born and raised in the 504, DJ Jade the Gem brings the raw energy
              of New Orleans nightlife to every set. From bounce to hip-hop, R&amp;B
              to club bangers — the only rule is the crowd never stops moving.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link href="/about" className="btn-ghost text-xs py-2.5">
                Read the Story
              </Link>
              <Link href="/bookings" className="btn-primary text-xs py-2.5">
                Book for Your Event
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "∞", label: "Live Sets" },
              { num: "504", label: "NOLA Roots", color: "text-neon-purple" },
              { num: "24/7", label: "Always Creating", color: "text-neon-gold" },
              { num: "∞", label: "Energy Delivered" },
            ].map(({ num, label, color = "text-neon-green" }) => (
              <div key={label} className="card p-6 text-center">
                <p className={`font-display text-5xl ${color} leading-none mb-2`}>
                  {num}
                </p>
                <p className="text-xs text-white/50 uppercase tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ALWAYS CREATING — new release teaser
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-surface border-y border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label">Coming Soon</p>
          <h2 className="section-title mb-3">
            New Drop{" "}
            <span className="text-neon-green">Loading…</span>
          </h2>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Something new is in the lab. Drop your email to be the first to
            know when it lands.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm cta="Alert Me" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MERCH
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label">504 Creative</p>
            <h2 className="section-title">
              <span className="text-neon-purple">Merch</span>
            </h2>
            <p className="text-white/50 text-sm mt-4">
              Rep the brand. New drops coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {merchItems.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://instagram.com/jluhvv"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
            >
              DM to Order
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STAY CONNECTED (newsletter)
      ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-surface">
        <div className="max-w-xl mx-auto text-center">
          <p className="section-label">Mailing List</p>
          <h2 className="section-title mb-3">
            Stay{" "}
            <span className="text-neon-purple">Connected</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Events, new music, and exclusive content — straight to your inbox.
            No spam, ever.
          </p>
          <NewsletterForm cta="Subscribe" />
        </div>
      </section>
    </>
  );
}
