import type { Metadata } from "next";
import { Music2, Users, Star, Building } from "lucide-react";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book DJ Jade",
  description:
    "Book DJ Jade the Gem for your club night, festival, private party, or corporate event. Professional DJ services in New Orleans and beyond.",
};

const services = [
  {
    icon: Music2,
    title: "Club Nights",
    desc: "Residencies, guest sets, late-night headliners",
    color: "text-neon-green",
  },
  {
    icon: Star,
    title: "Festivals",
    desc: "Outdoor stages, multi-day events, brand activations",
    color: "text-neon-purple",
  },
  {
    icon: Users,
    title: "Private Events",
    desc: "Weddings, birthdays, milestone celebrations",
    color: "text-neon-gold",
  },
  {
    icon: Building,
    title: "Corporate",
    desc: "Launches, galas, team events, rooftop parties",
    color: "text-neon-green",
  },
];

const steps = [
  { n: "01", title: "Submit Inquiry", desc: "Fill out the form below with your event details." },
  { n: "02", title: "Receive a Quote", desc: "I'll reply with availability and pricing within 48 hrs." },
  { n: "03", title: "Confirm & Deposit", desc: "Sign the agreement and lock in your date." },
  { n: "04", title: "Experience the Heat", desc: "Show up and let the energy take over." },
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <p className="section-label">Let's Work Together</p>
          <h1 className="section-title">
            Book <span className="text-neon-green">DJ Jade</span>
          </h1>
          <p className="text-white/50 text-sm mt-4 max-w-xl mx-auto">
            Bring the 504 energy to your event. Available for clubs, festivals,
            private parties, and corporate bookings nationwide.
          </p>
        </header>

        {/* ── Services grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-6 text-center hover:border-neon-green/20 transition-colors">
              <Icon className={`${color} mx-auto mb-3`} size={28} />
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Left: form ── */}
          <div className="lg:col-span-3">
            <div className="card p-7 sm:p-10">
              <h2 className="font-display text-3xl text-neon-green mb-1">
                Inquiry Form
              </h2>
              <p className="text-white/40 text-xs mb-8">
                * required · typically replied within 24–48 hrs
              </p>
              <BookingForm />
            </div>
          </div>

          {/* ── Right: process + what's included ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Process */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-neon-purple mb-6">
                How It Works
              </h3>
              <ol className="space-y-5">
                {steps.map(({ n, title, desc }) => (
                  <li key={n} className="flex gap-4">
                    <span className="font-display text-2xl text-neon-green/60 leading-none w-8 shrink-0">
                      {n}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-white">{title}</p>
                      <p className="text-white/40 text-xs leading-relaxed mt-0.5">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Included */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-neon-green mb-4">
                What's Included
              </h3>
              <ul className="space-y-2 text-sm">
                {[
                  "Professional DJ gear & setup",
                  "Custom curated playlist",
                  "MC services & crowd hype",
                  "Pre-event planning call",
                  "Travel within NOLA region",
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-white/60">
                    <span className="text-neon-green mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct DM note */}
            <div className="rounded-xl bg-neon-purple/10 border border-neon-purple/20 p-5 text-center">
              <p className="text-white/50 text-xs mb-2">
                Prefer to chat first?
              </p>
              <a
                href="https://instagram.com/jluhvv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-purple font-bold text-sm hover:underline"
              >
                DM @jluhvv on Instagram →
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
