import type { Metadata } from "next";
import EventCard from "@/components/EventCard";
import type { Event } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events | DJ Jade the Gem",
  description:
    "Catch DJ Jade the Gem live at upcoming events and festivals. Check out past performances and book for your next event.",
};

const upcomingEvents: Event[] = [
  {
    id: "1",
    title: "Club Frequency - Saturday Night Heat",
    date: "2026-02-15",
    venue: "Club Frequency",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/event-flyer-1.jpg",
    ticketLink: "https://example.com/tickets",
  },
  {
    id: "2",
    title: "Mardi Gras Weekend Special",
    date: "2026-02-28",
    venue: "Bourbon Street Venue",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/event-flyer-2.jpg",
  },
  {
    id: "3",
    title: "Spring Festival",
    date: "2026-03-20",
    venue: "City Park",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/event-flyer-3.jpg",
    ticketLink: "https://example.com/tickets",
  },
];

const pastEvents: Event[] = [
  {
    id: "4",
    title: "New Year's Eve Bash 2025",
    date: "2025-12-31",
    venue: "The Metropolitan",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/past-event-1.jpg",
    isPast: true,
  },
  {
    id: "5",
    title: "Halloween Spooktacular",
    date: "2025-10-31",
    venue: "Ghost Bar",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/past-event-2.jpg",
    isPast: true,
  },
  {
    id: "6",
    title: "Summer Rooftop Sessions",
    date: "2025-08-15",
    venue: "Sky Lounge",
    city: "New Orleans",
    state: "LA",
    flyerImage: "/images/past-event-3.jpg",
    isPast: true,
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="section-title">Events</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Come experience the energy live. Check out where I'll be spinning
            next and relive past performances.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-4xl md:text-5xl font-display text-neon-green">
              Upcoming Events
            </h2>
            <span className="px-4 py-2 bg-neon-green/20 border border-neon-green rounded-full text-neon-green font-bold">
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
            <div className="glass-card text-center py-12">
              <p className="text-xl text-gray-400">
                No upcoming events scheduled yet. Check back soon or{" "}
                <a href="/bookings" className="text-neon-green hover:underline">
                  book me
                </a>{" "}
                for your event!
              </p>
            </div>
          )}
        </section>

        {/* Past Events Gallery */}
        <section>
          <h2 className="text-4xl md:text-5xl font-display text-white mb-8">
            Past Performances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="mt-16 text-center glass-card p-12">
          <h3 className="text-3xl font-display text-neon-purple mb-4">
            Want Me at Your Event?
          </h3>
          <p className="text-gray-300 mb-6 text-lg">
            Available for clubs, festivals, private parties, and corporate
            events
          </p>
          <a href="/bookings" className="btn-primary">
            Get a Quote
          </a>
        </div>
      </div>
    </div>
  );
}
