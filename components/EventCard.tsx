import { Calendar, MapPin, Ticket } from "lucide-react";
import type { Event } from "@/lib/data";

interface Props {
  event: Event;
}

const MONTH_SHORT = [
  "JAN","FEB","MAR","APR","MAY","JUN",
  "JUL","AUG","SEP","OCT","NOV","DEC",
];

export default function EventCard({ event }: Props) {
  const d = new Date(`${event.date}T12:00:00`);
  const month = MONTH_SHORT[d.getMonth()];
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return (
    <article className="card overflow-hidden hover:border-neon-green/30 transition-colors group">
      {/* Flyer image */}
      <div
        className="relative w-full h-52 bg-surface-2 flex items-center justify-center overflow-hidden"
        style={
          event.flyerImage
            ? {
                backgroundImage: `url(${event.flyerImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-2/90 via-surface-2/30 to-transparent" />

        {/* Fallback emoji if no image */}
        {!event.flyerImage && (
          <span className="text-5xl relative z-10">🎵</span>
        )}

        {/* Past badge */}
        {event.isPast && (
          <span className="absolute top-3 right-3 z-10 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-black/70 text-white/50">
            Past
          </span>
        )}

        {/* Date chip */}
        <div className="absolute bottom-3 left-3 z-10 text-center bg-black/80 rounded-lg px-3 py-2 leading-tight">
          <p className="text-neon-green font-bold text-xs tracking-widest">{month}</p>
          <p className="font-display text-3xl text-white leading-none">{day}</p>
          <p className="text-white/40 text-[10px]">{year}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-2xl text-white group-hover:text-neon-green transition-colors leading-tight mb-3">
          {event.title}
        </h3>

        <div className="space-y-1.5 mb-5">
          <p className="flex items-center gap-2 text-sm text-white/60">
            <MapPin size={13} className="text-neon-purple flex-shrink-0" />
            {event.venue} · {event.city}, {event.state}
          </p>
          <p className="flex items-center gap-2 text-sm text-white/60">
            <Calendar size={13} className="text-neon-green flex-shrink-0" />
            {d.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {!event.isPast && (
          <>
            {event.ticketLink ? (
              <a
                href={event.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-xs py-2.5"
              >
                <Ticket size={13} />
                Get Tickets
              </a>
            ) : (
              <a
                href="https://instagram.com/jluhvv"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full text-xs py-2.5"
              >
                Tickets via DM @jluhvv
              </a>
            )}
          </>
        )}
      </div>
    </article>
  );
}
