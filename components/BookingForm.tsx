// 3. BOOKING CTA
// Replaces the old Formspree booking form with a
// higher-conversion layout. Swap action URL when ready.
// ════════════════════════════════════════════════════════════
export function BookingCTA() {
  return (
    <section id="bookings" className="relative bg-obsidian-2 py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gem-glow opacity-60 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <p className="section-eyebrow font-sub text-xs tracking-[0.4em] uppercase text-jade-light mb-4">
          Book a Set
        </p>
        <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none text-cream mb-4">
          LET'S <span className="text-holo">CREATE</span>
        </h2>
        <p className="font-body text-sm text-mist/50 mb-10 leading-relaxed">
          Club nights · Private events · Weddings · Festivals<br />
          NOLA and beyond.
        </p>

        {/* Booking form — replace action with Formspree/Resend endpoint */}
        <form
          action="https://formspree.io/f/YOUR_ID"
          method="POST"
          className="space-y-4 text-left"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "name",       placeholder: "Your Name",        type: "text"  },
              { name: "email",      placeholder: "Email Address",    type: "email" },
              { name: "phone",      placeholder: "Phone (optional)", type: "tel"   },
              { name: "event_date", placeholder: "Event Date",       type: "date"  },
            ].map((f) => (
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                className="
                  w-full bg-obsidian-3 border border-plum/30
                  text-cream font-body text-sm
                  px-4 py-3 placeholder:text-mist/30
                  focus:outline-none focus:border-plum
                  transition-colors
                "
              />
            ))}
          </div>

          <select
            name="event_type"
            className="
              w-full bg-obsidian-3 border border-plum/30
              text-cream font-body text-sm
              px-4 py-3
              focus:outline-none focus:border-plum
            "
          >
            <option value="">Event Type</option>
            {["Club Night", "Private Party", "Wedding", "Festival", "Corporate", "Pop-Up"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <textarea
            name="message"
            placeholder="Tell me about your event..."
            rows={4}
            className="
              w-full bg-obsidian-3 border border-plum/30
              text-cream font-body text-sm
              px-4 py-3 placeholder:text-mist/30 resize-none
              focus:outline-none focus:border-plum
              transition-colors
            "
          />

          <button
            type="submit"
            className="
              w-full py-4
              font-sub text-sm tracking-[0.25em] uppercase
              bg-plum hover:bg-plum-light text-cream
              transition-all duration-300
              shadow-[0_0_20px_#4a3f8f55]
              hover:shadow-[0_0_40px_#4a3f8f88]
            "
          >
            Send Inquiry
          </button>
        </form>

        <p className="font-body text-[11px] text-mist/30 mt-5">
          Or DM{" "}
          <a
            href="https://instagram.com/jluhvv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-jade-light hover:text-jade underline-offset-2 hover:underline"
          >
            @jluhvv
          </a>{" "}
          on Instagram
        </p>
      </div>
    </section>
  );
}
