import type { Metadata } from "next";
import Link from "next/link";
import { Music, ArrowRight, Disc3, Mic2, SlidersHorizontal, PenLine } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";
import NewsletterForm from "@/components/NewsletterForm";
import EventCard from "@/components/EventCard";
import MerchSection from "@/components/MerchSection";
import VideoSection from "@/components/VideoSection";
import Reveal from "@/components/Reveal";
import { featuredTrack, upcomingEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "DJ Jade the Gem | 504 Creative | Fire Mixes & Live Energy",
  description:
    "New Orleans DJ bringing fire mixes and electrifying live energy to clubs, festivals, and private events.",
};

export default function HomePage() {
  const nextThree = upcomingEvents.slice(0, 3);

  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <HeroSection />

      {/* ══════════════ FEATURED IN ══════════════ */}
      <Reveal>
        <VideoSection />
      </Reveal>

      {/* ══════════════ LATEST MIX ══════════════ */}
      <Reveal>
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-surface/70">
          <div className="max-w-3xl mx-auto">
            <p className="section-label text-center mb-2">Now Playing</p>
            <h2 className="section-title text-center mb-10">
              Latest <span className="text-holo">Mix</span>
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
      </Reveal>

      {/* ══════════════ MERCH ══════════════ */}
      <Reveal>
        <MerchSection />
      </Reveal>

      {/* ══════════════ UPCOMING EVENTS ══════════════ */}
      <Reveal>
        <section className="py-24 px-6 bg-surface/65">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="section-label">Live &amp; In Person</p>
                <h2 className="section-title">
                  Upcoming <span className="text-gold-muted">Events</span>
                </h2>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 font-sub text-xs tracking-[0.2em] uppercase text-jade-light hover:text-jade transition-colors shrink-0"
              >
                All Events <ArrowRight size={14} />
              </Link>
            </div>

            {nextThree.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nextThree.map((event, i) => (
                  <Reveal key={event.id} delay={i * 90}>
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-plum/20 bg-surface-2">
                <div className="w-16 h-16 border border-jade/20 bg-jade/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-7 h-7 text-jade-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-display text-2xl text-cream tracking-wider mb-2">More Dates Coming</p>
                <p className="text-mist/30 text-sm font-body mb-6">Follow on Instagram for announcements</p>
                <a href="https://instagram.com/jluhvv" target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-2.5">
                  @jluhvv on Instagram
                </a>
              </div>
            )}
          </div>
        </section>
      </Reveal>

      {/* ══════════════ NOLA ROOTS ══════════════ */}
      <Reveal>
        <section className="py-24 px-6 bg-transparent">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label">Where It Started</p>
              <h2 className="section-title mb-6">
                New Orleans <span className="text-gold">Born</span>
              </h2>
              <div className="neon-divider" />
              <p className="text-mist/60 leading-relaxed mt-4 font-body text-sm md:text-base max-w-lg">
                Born and raised in the 504, DJ Jade the Gem brings the raw energy
                of New Orleans nightlife to every set. From bounce to hip-hop, R&amp;B
                to club bangers — the only rule is the crowd never stops moving.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/about"    className="btn-ghost text-xs py-2.5">Read the Story</Link>
                <Link href="/bookings" className="btn-primary text-xs py-2.5">Book for Your Event</Link>
              </div>
            </div>

            {/* Roles */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { Icon: Disc3,             label: "DJ",         desc: "Live sets & club energy", color: "text-jade-light" },
                { Icon: SlidersHorizontal, label: "Producer",   desc: "Beats & original mixes",  color: "text-gold-muted" },
                { Icon: Mic2,              label: "Vocalist",   desc: "Voice on every track",     color: "text-gold"       },
                { Icon: PenLine,           label: "Songwriter", desc: "Words behind the sound",   color: "text-jade-light" },
              ].map(({ Icon, label, desc, color }) => (
                <div key={label} className="card p-6 text-center">
                  <Icon size={28} className={`${color} mx-auto mb-3`} strokeWidth={1.5} />
                  <p className="font-sub text-sm text-cream uppercase tracking-widest mb-1">{label}</p>
                  <p className="font-body text-[11px] text-mist/40 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ══════════════ STAY CONNECTED ══════════════ */}
      <Reveal>
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-surface/70">
          <div className="max-w-xl mx-auto text-center">
            <p className="section-label mb-2">Mailing List</p>
            <h2 className="section-title mb-3">
              Stay <span className="text-gold-muted">Connected</span>
            </h2>
            <p className="font-body text-mist/50 text-sm mb-8">
              Events, new music, and exclusive content — straight to your inbox. No spam, ever.
            </p>
            <NewsletterForm cta="Subscribe" />
          </div>
        </section>
      </Reveal>
    </>
  );
}
