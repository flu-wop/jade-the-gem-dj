import Link from "next/link";
import SoundCloudPlayer from "@/components/SoundCloudPlayer";
import NewsletterForm from "@/components/NewsletterForm";
import { Music, Calendar, Headphones } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/placeholder-hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display mb-4 neon-glow text-neon-green animate-float">
            DJ JADE THE GEM
          </h1>
          <p className="text-xl md:text-3xl text-neon-purple font-bold mb-8 tracking-wide">
            504 CREATIVE | FIRE MIXES & LIVE ENERGY
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/music" className="btn-primary inline-flex items-center gap-2">
              <Music className="w-5 h-5" />
              Listen Now
            </Link>
            <Link href="/bookings" className="btn-secondary inline-flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Book Me
            </Link>
            <Link href="/events" className="btn-ghost inline-flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-neon-green rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-neon-green rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Latest Mix Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-surface">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center">Latest Mix</h2>
          <SoundCloudPlayer embedUrl="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/YOUR_TRACK_ID&color=%2300ff9d&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true" />
          <p className="text-center text-gray-400 mt-6">
            Subscribe on SoundCloud for the latest drops
          </p>
        </div>
      </section>

      {/* Quick Stats/Features */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card text-center">
            <div className="text-5xl font-display text-neon-green mb-4">100+</div>
            <h3 className="text-xl font-bold mb-2">Live Events</h3>
            <p className="text-gray-400">Clubs, festivals & private parties</p>
          </div>
          <div className="glass-card text-center">
            <div className="text-5xl font-display text-neon-purple mb-4">504</div>
            <h3 className="text-xl font-bold mb-2">New Orleans Born</h3>
            <p className="text-gray-400">Bringing NOLA energy worldwide</p>
          </div>
          <div className="glass-card text-center">
            <div className="text-5xl font-display text-neon-gold mb-4">24/7</div>
            <h3 className="text-xl font-bold mb-2">Always Creating</h3>
            <p className="text-gray-400">Fresh mixes & original content</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 px-4 bg-gradient-to-b from-surface to-background">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title">Stay Connected</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get notified about new releases, upcoming events, and exclusive content
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
