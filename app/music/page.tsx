import type { Metadata } from "next";
import { Music } from "lucide-react";
import SoundCloudEmbed from "@/components/SoundCloudEmbed";
import NewsletterForm from "@/components/NewsletterForm";
import { featuredTrack, tracks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Music & Mixes",
  description:
    "Stream DJ Jade the Gem's fire mixes and club sets on SoundCloud. New drops dropping soon.",
};

export default function MusicPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <p className="section-label">Discography</p>
          <h1 className="section-title">
            Music &amp; <span className="text-neon-green">Mixes</span>
          </h1>
          <p className="text-white/50 text-sm mt-4 max-w-xl mx-auto">
            Fire sets, club mixes, and original edits. Follow on SoundCloud to
            catch every drop.
          </p>
        </header>

        {/* ── Featured track (big visual player) ── */}
        <section className="mb-20">
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-bold uppercase tracking-widest">
                ▶ Latest
              </span>
              <h2 className="font-display text-2xl text-white">
                {featuredTrack.title}
              </h2>
            </div>
            <SoundCloudEmbed
              src={featuredTrack.embedSrc}
              visual={true}
              title={featuredTrack.title}
            />
          </div>
        </section>

        {/* ── New drop teaser ── */}
        <section className="relative mb-20 overflow-hidden rounded-2xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/10 via-surface to-neon-green/10 p-8 sm:p-12 text-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-gold/10 border border-neon-gold/30 text-neon-gold text-xs font-bold uppercase tracking-widest mb-4">
              🔥 Coming Soon
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-3">
              New Drop <span className="text-neon-green">Loading…</span>
            </h2>
            <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
              Working on something exclusive. Sign up to be the very first to
              hear it when it drops.
            </p>
            {/* Fake album art placeholder */}
            <div className="w-44 h-44 mx-auto mb-8 rounded-2xl bg-surface-2 border border-white/10 flex items-center justify-center text-5xl">
              💎
            </div>
            <div className="max-w-sm mx-auto">
              <NewsletterForm cta="Alert Me First" />
            </div>
          </div>
        </section>

        {/* ── All mixes grid ── */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl text-white">
              Recent <span className="text-neon-purple">Mixes</span>
            </h2>
            <a
              href="https://soundcloud.com/jadethegem888/albums"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-2"
            >
              <Music size={13} />
              All Albums
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {tracks.map((track) => (
              <div key={track.id} className="card p-5 sm:p-6">
                <h3 className="font-display text-xl text-neon-green mb-4">
                  {track.title}
                </h3>
                <SoundCloudEmbed src={track.embedSrc} title={track.title} />
              </div>
            ))}
          </div>
        </section>

        {/* ── SC CTA ── */}
        <div className="mt-16 text-center">
          <a
            href="https://soundcloud.com/jadethegem888"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <Music size={16} />
            View All on SoundCloud →
          </a>
        </div>

      </div>
    </div>
  );
}
