import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import { upcomingEvents, pastEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Catch DJ Jade the Gem live — upcoming club nights, festivals, and private events in New Orleans and beyond.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <header className="text-center mb-16">
          <p className="section-label">Where You'll Find Me</p>
          <h1 className="section-title">
            Live <span className="text-neon-purple">Events</span>
          </h1>
          <p className="text-white/50 text-sm mt-4 max-w-xl mx-auto">
            Come experience the energy in person. Check back often — the
            schedule fills fast.
          </p>
        </header>

        {/* ── Upcoming ── */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-4xl text-neon-green">
              Upcoming Events
            </h2>
            <span className="px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green text-xs font-bold">
              {upcomingEvents.length} Shows
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-white/40 text-sm">
                No shows scheduled yet — stay tuned or{" "}
                <a href="/bookings" className="text-neon-green hover:underline">
                  book me
                </a>{" "}
                for your next event.
              </p>
            </div>
          )}
        </section>

        {/* ── Past Events ── */}
        <section className="mb-20">
          <h2 className="font-display text-4xl text-white/60 mb-8">
            Past Performances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* ── Book CTA banner ── */}
        <div className="card p-10 sm:p-14 text-center border-neon-purple/20">
          <h3 className="font-display text-4xl md:text-5xl text-neon-purple mb-3">
            Want Me at Your Event?
          </h3>
          <p className="text-white/50 text-sm mb-8 max-w-md mx-auto">
            Clubs, festivals, private parties, corporate events — let's make it
            a night people talk about for years.
          </p>
          <a href="/bookings" className="btn-primary">
            Get a Quote
          </a>
        </div>

      </div>
    </div>
  );
}
