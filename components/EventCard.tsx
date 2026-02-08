import type { Event } from "@/lib/types";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="glass-card overflow-hidden group hover:scale-105 transition-all">
      {/* Flyer Image */}
      <div
        className="w-full h-64 bg-surface relative overflow-hidden"
        style={{
          backgroundImage: `url('${event.flyerImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {event.isPast && (
          <div className="absolute top-4 right-4 bg-gray-700 px-3 py-1 rounded-full text-xs font-bold">
            PAST EVENT
          </div>
        )}
        {!event.flyerImage.startsWith("http") && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🎵
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-6">
        <h3 className="text-2xl font-display text-neon-green mb-4 group-hover:text-neon-purple transition-colors">
          {event.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 text-gray-300">
            <Calendar className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-start gap-3 text-gray-300">
            <MapPin className="w-5 h-5 text-neon-green mt-0.5 flex-shrink-0" />
            <span>
              {event.venue} - {event.city}, {event.state}
            </span>
          </div>
        </div>

        {/* Ticket Link */}
        {event.ticketLink && !event.isPast ? (
          <a
            href={event.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            Get Tickets
          </a>
        ) : !event.isPast ? (
          <div className="text-center text-gray-400 italic">
            Tickets via DM
          </div>
        ) : null}
      </div>
    </div>
  );
}
