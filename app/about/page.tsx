import type { Metadata } from "next";
import { Instagram, Music, Twitter } from "lucide-react";

export const metadata: Metadata = {
  title: "About | DJ Jade the Gem",
  description:
    "Learn about DJ Jade the Gem - New Orleans based DJ bringing fire mixes and live energy to clubs, festivals, and events worldwide.",
};

const socialLinks = [
  {
    platform: "Instagram",
    handle: "@jluhvv",
    url: "https://instagram.com/jluhvv",
    icon: Instagram,
  },
  {
    platform: "SoundCloud",
    handle: "jadethegem888",
    url: "https://soundcloud.com/jadethegem888",
    icon: Music,
  },
  {
    platform: "X (Twitter)",
    handle: "@jluhvv",
    url: "https://twitter.com/jluhvv",
    icon: Twitter,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">About Jade</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Bio */}
          <div className="space-y-6">
            <div className="glass-card">
              <h2 className="text-3xl font-display text-neon-green mb-6">
                The Story
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Born and raised in the vibrant heart of New Orleans (504), DJ
                  Jade the Gem has been bringing electrifying energy to dance
                  floors across the country. With a unique blend of hip-hop,
                  EDM, bounce, and everything in between, Jade creates an
                  unforgettable experience every time she steps behind the
                  decks.
                </p>
                <p>
                  What started as a passion for music and mixing has evolved
                  into a full-blown career, with performances at major clubs,
                  festivals, and private events. Known for reading the crowd
                  and creating seamless transitions that keep the energy high
                  all night long, Jade has become a sought-after name in the DJ
                  scene.
                </p>
                <p>
                  When she's not on stage, you can find Jade in the studio
                  crafting new mixes, collaborating with artists, or hunting for
                  the next track that will set dance floors on fire. The
                  mission is simple: bring the heat, spread the energy, and make
                  every night one to remember.
                </p>
              </div>
            </div>

            {/* Connect Section */}
            <div className="glass-card">
              <h2 className="text-3xl font-display text-neon-purple mb-6">
                Connect
              </h2>
              <div className="space-y-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface hover:border-neon-green border border-transparent transition-all group"
                  >
                    <social.icon className="w-6 h-6 text-neon-green group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-white">
                        {social.platform}
                      </div>
                      <div className="text-sm text-gray-400">
                        {social.handle}
                      </div>
                    </div>
                    <div className="ml-auto text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-6">
            <div className="glass-card overflow-hidden">
              <div
                className="w-full h-96 bg-surface flex items-center justify-center"
                style={{
                  backgroundImage: "url('/images/placeholder-about-1.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="text-6xl">🎧</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="glass-card overflow-hidden">
                <div
                  className="w-full h-48 bg-surface flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/images/placeholder-about-2.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="text-4xl">🎵</div>
                </div>
              </div>
              <div className="glass-card overflow-hidden">
                <div
                  className="w-full h-48 bg-surface flex items-center justify-center"
                  style={{
                    backgroundImage: "url('/images/placeholder-about-3.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="text-4xl">🔥</div>
                </div>
              </div>
            </div>

            <div className="glass-card overflow-hidden">
              <div
                className="w-full h-72 bg-surface flex items-center justify-center"
                style={{
                  backgroundImage: "url('/images/placeholder-about-4.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="text-5xl">💎</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Highlights */}
        <div className="glass-card p-12 text-center">
          <h2 className="text-3xl font-display text-neon-gold mb-8">
            Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-display text-neon-green mb-2">
                5+
              </div>
              <div className="text-gray-400">Years DJing</div>
            </div>
            <div>
              <div className="text-5xl font-display text-neon-purple mb-2">
                100+
              </div>
              <div className="text-gray-400">Events Performed</div>
            </div>
            <div>
              <div className="text-5xl font-display text-neon-gold mb-2">
                ∞
              </div>
              <div className="text-gray-400">Energy Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
