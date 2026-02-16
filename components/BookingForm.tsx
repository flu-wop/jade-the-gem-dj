"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FORMSPREE_BOOKING } from "@/lib/data";

type Status = "idle" | "loading" | "ok" | "error";

const EVENT_TYPES = [
  "Club Night",
  "Festival",
  "Private Party",
  "Wedding",
  "Corporate Event",
  "Other",
];

const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000+",
  "Let's Talk",
];

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    try {
      const res = await fetch(FORMSPREE_BOOKING, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 size={48} className="text-neon-green" />
        <h3 className="font-display text-3xl text-neon-green">
          Inquiry Received!
        </h3>
        <p className="text-white/60 text-sm max-w-sm">
          I'll get back to you within 24–48 hours. If it's urgent, DM me on
          Instagram{" "}
          <a
            href="https://instagram.com/jluhvv"
            className="text-neon-purple hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @jluhvv
          </a>
          .
        </p>
      </div>
    );
  }

  const disabled = status === "loading";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Your Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="Jane Smith"
            className="field"
            disabled={disabled}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="jane@example.com"
            className="field"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Phone (optional) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/50">
          Phone{" "}
          <span className="normal-case text-white/30 font-normal">
            (optional)
          </span>
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="(504) 555-0100"
          className="field"
          disabled={disabled}
        />
      </div>

      {/* Event date + type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Event Date *
          </label>
          <input
            type="date"
            name="eventDate"
            required
            className="field"
            disabled={disabled}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Event Type *
          </label>
          <select name="eventType" required className="field" disabled={disabled}>
            <option value="">Select type…</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Budget + Location */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Budget Range
          </label>
          <select name="budget" className="field" disabled={disabled}>
            <option value="">Select range…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-white/50">
            Event Location *
          </label>
          <input
            type="text"
            name="location"
            required
            placeholder="New Orleans, LA"
            className="field"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-widest text-white/50">
          Details *
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about your event — guest count, venue, vibe, special requests…"
          className="field resize-none"
          disabled={disabled}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={disabled}
        className="btn-primary w-full py-4 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {disabled ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <Send size={15} />
            Send Inquiry
          </>
        )}
      </button>

      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={15} />
          Something went wrong. Please try again or email directly.
        </div>
      )}
    </form>
  );
}
