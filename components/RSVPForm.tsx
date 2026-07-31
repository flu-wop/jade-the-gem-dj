"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";

interface Props {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function RSVPForm({ eventId, eventTitle, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, eventTitle, name, email, phone, guests, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="card w-full max-w-md p-6 sm:p-8 relative bg-surface-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center mx-auto mb-5">
              <Check size={26} className="text-neon-green" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2">You&apos;re on the list</h3>
            <p className="text-white/50 text-sm">
              Check your email — the address goes out to confirmed guests closer to the date.
            </p>
            <button onClick={onClose} className="btn-ghost mt-6 text-xs py-2.5 px-5">
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="section-label mb-1">RSVP</p>
            <h3 className="font-display text-3xl text-white mb-6 leading-tight">
              {eventTitle}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-plum/30 text-white text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-neon-green transition-colors"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-plum/30 text-white text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-neon-green transition-colors"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-surface border border-plum/30 text-white text-sm px-4 py-3 placeholder:text-white/30 focus:outline-none focus:border-neon-green transition-colors"
                />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-surface border border-plum/30 text-white text-sm px-4 py-3 focus:outline-none focus:border-neon-green transition-colors"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                placeholder="Anything Jade should know? (optional)"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-surface border border-plum/30 text-white text-sm px-4 py-3 placeholder:text-white/30 resize-none focus:outline-none focus:border-neon-green transition-colors"
              />

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full text-xs py-3 justify-center">
                {loading ? "Sending…" : "RSVP"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
