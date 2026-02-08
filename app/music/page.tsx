import type { Metadata } from "next";
import SoundCloudPlayer from "@/components/SoundCloudPlayer";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Music & Mixes | DJ Jade the Gem",
  description:
    "Listen to the latest mixes and tracks from DJ Jade the Gem. Subscribe on SoundCloud for fresh releases.",
};

const tracks = [
  {
    id: "1",
    title: "Summer Vibes Mix 2024",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/YOUR_TRACK_ID_1&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
  },
  {
    id: "2",
    title: "Club Heat Vol. 3",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/YOUR_TRACK_ID_2&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
  },
  {
    id: "3",
    title: "504 Bounce Session",
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/YOUR_TRACK_ID_3&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
  },
];

export default function MusicPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Music & Mixes</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore my latest tracks, mixes, and live recordings. Hit that
            follow button on SoundCloud to never miss a drop.
          </p>
        </div>

        {/* Featured/New Release Section */}
        <div className="glass-card mb-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-green/20"></div>
          <div className="relative z-10 p-8">
            <div className="inline-block px-4 py-2 bg-neon-gold/20 border border-neon-gold rounded-full mb-4">
              <span className="text-neon-gold font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                COMING SOON
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-neon-green mb-4">
              NEW RELEASE
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Exclusive new mix dropping this month
            </p>
            <div className="max-w-md mx-auto">
              <div
                className="w-full h-64 bg-surface rounded-lg mb-6 flex items-center justify-center"
                style={{
                  backgroundImage: "url('/images/placeholder-album-art.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="text-6xl">🎵</div>
              </div>
              <p className="text-gray-400 mb-4">
                Be the first to know when it drops
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="input-field flex-1"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  Notify Me
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mixes Grid */}
        <h2 className="text-3xl md:text-4xl font-display text-white mb-8">
          Recent Mixes
        </h2>
        <div className="grid grid-cols-1 gap-8">
          {tracks.map((track) => (
            <div key={track.id} className="glass-card">
              <h3 className="text-2xl font-display text-neon-green mb-4">
                {track.title}
              </h3>
              <SoundCloudPlayer embedUrl={track.embedUrl} />
            </div>
          ))}
        </div>

        {/* More on SoundCloud */}
        <div className="text-center mt-16">
          <a
            href="https://soundcloud.com/jadethegem888"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-block"
          >
            View All on SoundCloud →
          </a>
        </div>
      </div>
    </div>
  );
}
