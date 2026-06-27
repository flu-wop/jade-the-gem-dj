"use client";
import { useState } from "react";
import { CheckCircle, Tag, Clock, DollarSign, Shield, Music2, Star, Users, Building, ListMusic } from "lucide-react";

const RATE = 150;
const HOUR_OPTIONS = [2, 3, 4, 5, 6];
const EVENT_TYPES = ["Club Night", "Private Party", "Birthday / Celebration", "Wedding", "Festival", "Corporate Event", "Pop-Up / Activation", "Other"];

const services = [
  { icon: Music2, title: "Club Nights",    desc: "Residencies, guest sets, late-night headliners", color: "text-jade-light" },
  { icon: Star,   title: "Festivals",      desc: "Outdoor stages, multi-day events, brand activations", color: "text-gold-muted" },
  { icon: Users,  title: "Private Events", desc: "Weddings, birthdays, milestone celebrations", color: "text-gold" },
  { icon: Building, title: "Corporate",   desc: "Launches, galas, team events, rooftop parties", color: "text-jade-light" },
];

export default function BookingsPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", eventDate: "",
    eventType: "", hours: 2, location: "", message: "", discountCode: "",
  });
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError]     = useState("");
  const [agreed, setAgreed]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const subtotal = form.hours * RATE;
  const discount = discountApplied ? form.hours * 50 : 0;
  const total    = subtotal - discount;

  function update(field: string, value: string | number) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function applyDiscount() {
    if (form.discountCode.trim().toUpperCase() === "HIDDEN50") {
      setDiscountApplied(true);
      setDiscountError("");
    } else {
      setDiscountError("Invalid code");
      setDiscountApplied(false);
    }
  }

  async function handleCheckout() {
    if (!agreed)        { setError("You must agree to the booking terms."); return; }
    if (!form.name || !form.email || !form.eventDate || !form.eventType || !form.location) {
      setError("Please fill in all required fields."); return;
    }
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, discountCode: discountApplied ? "HIDDEN50" : "", total }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else          { setError(data.error || "Something went wrong."); }
    } catch { setError("Something went wrong. Please try again."); }
    finally   { setLoading(false); }
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="text-center mb-16">
          <p className="section-label">Let&apos;s Work Together</p>
          <h1 className="section-title">
            Book <span className="text-jade-light">DJ Jade</span>
          </h1>
          <p className="text-mist/50 text-sm mt-4 max-w-xl mx-auto">
            Bring the 504 energy to your event. Available for clubs, festivals,
            private parties, and corporate bookings nationwide.
          </p>
        </header>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {services.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-6 text-center">
              <Icon className={`${color} mx-auto mb-3`} size={28} />
              <h3 className="font-sub text-sm tracking-wider uppercase text-cream mb-1">{title}</h3>
              <p className="text-mist/40 text-xs leading-relaxed font-body">{desc}</p>
            </div>
          ))}
        </div>

        {/* ── Playlist Curation ── */}
        <div className="card p-8 mb-20">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ListMusic size={16} className="text-jade-light" />
                <p className="section-label" style={{ marginBottom: 0 }}>Digital Service</p>
              </div>
              <h2 className="font-display text-3xl text-jade-light">
                Custom Playlist Curation
              </h2>
              <p className="text-mist/50 text-sm font-body mt-2 max-w-lg leading-relaxed">
                Your taste, elevated. Jade hand-builds a fully curated playlist around
                your vibe — delivered as a Spotify or Apple Music link within 48–72 hours.
                No filler, no random shuffle. Just the right songs in the right order.
              </p>
            </div>
            <a
              href="mailto:jadedwheeler8@gmail.com?subject=Playlist%20Curation%20Request"
              className="btn-primary whitespace-nowrap self-start shrink-0"
            >
              Request a Playlist →
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {([
              {
                tier: "Vibe Check",
                songs: "20–25 songs",
                price: "$35",
                desc: "Perfect for a mood, a drive, or a low-key gathering. Tell her the vibe and she'll handle the rest.",
                featured: false,
              },
              {
                tier: "Full Experience",
                songs: "40–50 songs",
                price: "$65",
                desc: "A full journey. Built for parties, pre-games, events, or deep listening sessions that need to hit different.",
                featured: true,
              },
              {
                tier: "Event Package",
                songs: "3 playlists",
                price: "$125",
                desc: "Three custom playlists — open, peak, and close. Everything you need to run a full event start to finish.",
                featured: false,
              },
            ] as { tier: string; songs: string; price: string; desc: string; featured: boolean }[]).map(
              ({ tier, songs, price, desc, featured }) => (
                <div
                  key={tier}
                  className={`rounded-xl p-6 border ${
                    featured
                      ? "border-jade/50 bg-jade/5"
                      : "border-white/5 bg-surface-2"
                  }`}
                >
                  <p
                    className={`font-sub text-xs tracking-widest uppercase mb-1 ${
                      featured ? "text-jade-light" : "text-mist/40"
                    }`}
                  >
                    {tier}
                  </p>
                  <p className="font-display text-4xl text-cream mb-1">{price}</p>
                  <p className="text-mist/40 text-xs font-body mb-3">{songs}</p>
                  <p className="text-mist/60 text-sm font-body leading-relaxed">{desc}</p>
                </div>
              )
            )}
          </div>

          <p className="text-mist/30 text-xs font-body mt-6 text-center">
            Delivered via Spotify or Apple Music · 48–72 hr turnaround · Email{" "}
            <a
              href="mailto:jadedwheeler8@gmail.com"
              className="text-jade-light hover:underline"
            >
              jadedwheeler8@gmail.com
            </a>{" "}
            to get started
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: Booking form */}
          <div className="lg:col-span-3">
            <div className="card p-7 sm:p-10">
              <h2 className="font-display text-3xl text-jade-light mb-1">Booking Form</h2>
              <p className="text-mist/30 text-xs font-body mb-8">
                $150/hr · 2 hour minimum · Full payment at booking
              </p>

              <div className="space-y-5">
                {/* Rate cards */}
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {[
                    { icon: DollarSign, val: "$150", sub: "per hour" },
                    { icon: Clock,      val: "2 hr",  sub: "minimum" },
                    { icon: Shield,     val: "Full",  sub: "pay at booking" },
                  ].map(({ icon: Icon, val, sub }) => (
                    <div key={sub} className="bg-surface-2 border border-plum/20 rounded-lg p-3 text-center">
                      <Icon size={14} className="text-jade-light mx-auto mb-1" />
                      <p className="font-sub text-sm text-cream">{val}</p>
                      <p className="text-mist/30 text-[10px] font-body">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Name / Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name"
                      className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 focus:outline-none focus:border-plum transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Email *</label>
                    <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com"
                      className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 focus:outline-none focus:border-plum transition-colors" />
                  </div>
                </div>

                {/* Phone / Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (504) 000-0000"
                      className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 focus:outline-none focus:border-plum transition-colors" />
                  </div>
                  <div>
                    <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Event Date *</label>
                    <input type="date" required value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)}
                      className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 focus:outline-none focus:border-plum transition-colors" />
                  </div>
                </div>

                {/* Event type */}
                <div>
                  <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Event Type *</label>
                  <select required value={form.eventType} onChange={(e) => update("eventType", e.target.value)}
                    className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 focus:outline-none focus:border-plum transition-colors">
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Location / Venue *</label>
                  <input type="text" required value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Venue name, city"
                    className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 focus:outline-none focus:border-plum transition-colors" />
                </div>

                {/* Hours */}
                <div>
                  <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-3">How Many Hours? *</label>
                  <div className="flex gap-3 flex-wrap">
                    {HOUR_OPTIONS.map((h) => (
                      <button key={h} type="button" onClick={() => update("hours", h)}
                        className={`w-14 h-14 font-display text-xl tracking-wider transition-all duration-150 border ${
                          form.hours === h
                            ? "bg-plum border-plum text-cream shadow-[0_0_16px_#4a3f8f66]"
                            : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist bg-transparent"
                        }`}>
                        {h}
                      </button>
                    ))}
                  </div>
                  <p className="text-mist/30 text-xs font-body mt-2">Minimum 2 hours · $150/hr</p>
                </div>

                {/* Message */}
                <div>
                  <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Message (optional)</label>
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={3}
                    placeholder="Tell Jade about your event..."
                    className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 resize-none focus:outline-none focus:border-plum transition-colors" />
                </div>

                {/* Discount code */}
                <div>
                  <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-2">Discount Code</label>
                  <div className="flex gap-3">
                    <input type="text" value={form.discountCode} onChange={(e) => update("discountCode", e.target.value)}
                      placeholder="Word of mouth only" onKeyDown={(e) => e.key === "Enter" && applyDiscount()}
                      className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-4 py-3 placeholder:text-mist/20 focus:outline-none focus:border-plum transition-colors flex-1" />
                    <button type="button" onClick={applyDiscount} className="btn-secondary py-2 px-4 text-xs whitespace-nowrap">Apply</button>
                  </div>
                  {discountApplied && (
                    <p className="text-jade-light text-xs mt-2 flex items-center gap-1 font-body">
                      <Tag size={12} /> HIDDEN50 applied — $50 off per hour
                    </p>
                  )}
                  {discountError && <p className="text-red-400 text-xs mt-2 font-body">{discountError}</p>}
                </div>

                {/* Price summary */}
                <div className="bg-surface-2 border border-plum/20 p-5 space-y-3">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-mist/50">{form.hours} hours × $150</span>
                    <span className="text-cream">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-jade-light">HIDDEN50 discount</span>
                      <span className="text-jade-light">−${discount}</span>
                    </div>
                  )}
                  <div className="border-t border-plum/20 pt-3 flex justify-between">
                    <span className="text-cream font-body font-medium">Total Due Now</span>
                    <span className="text-jade-light font-display text-2xl">${total}</span>
                  </div>
                </div>

                {/* Agreement */}
                <div className="bg-surface-2 border border-plum/20 p-5">
                  <label className="flex gap-4 cursor-pointer" onClick={() => setAgreed(!agreed)}>
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                        agreed ? "bg-plum border-plum" : "border-plum/30 bg-transparent"
                      }`}>
                        {agreed && <CheckCircle size={14} className="text-cream" />}
                      </div>
                    </div>
                    <p className="text-mist/50 text-sm font-body leading-relaxed">
                      I agree to the booking terms. Full payment of{" "}
                      <span className="text-cream">${total}</span> is due at time of booking.
                      This payment is non-refundable. By completing checkout, I confirm
                      the event details above are accurate.
                    </p>
                  </label>
                </div>

                {error && <p className="text-red-400 text-sm font-body text-center">{error}</p>}

                {/* Checkout button */}
                <button onClick={handleCheckout}
                  disabled={loading || !agreed || !form.name || !form.email || !form.eventDate || !form.eventType || !form.location}
                  className="w-full py-4 font-sub text-sm tracking-[0.25em] uppercase bg-plum hover:bg-plum-light text-cream transition-all duration-300 shadow-[0_0_20px_#4a3f8f55] hover:shadow-[0_0_40px_#4a3f8f88] disabled:opacity-30 disabled:cursor-not-allowed">
                  {loading ? "Redirecting to payment..." : `Pay $${total} — Book Now`}
                </button>

                <p className="text-center text-mist/20 text-xs font-body">
                  Secured by Stripe · Questions?{" "}
                  <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
                    jadedwheeler8@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-2 space-y-6">

            {/* How it works */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-gold-muted mb-6">How It Works</h3>
              <ol className="space-y-5">
                {[
                  { n: "01", title: "Fill Out the Form",       desc: "Submit your event details and preferred hours." },
                  { n: "02", title: "Review & Pay",            desc: "Checkout securely via Stripe. Full payment locks your date." },
                  { n: "03", title: "Confirmation",            desc: "You'll receive a confirmation email + calendar invite." },
                  { n: "04", title: "Experience the Heat",     desc: "Show up and let the energy take over." },
                ].map(({ n, title, desc }) => (
                  <li key={n} className="flex gap-4">
                    <span className="font-display text-2xl text-jade-light/60 leading-none w-8 shrink-0">{n}</span>
                    <div>
                      <p className="font-sub text-sm tracking-wider uppercase text-cream">{title}</p>
                      <p className="text-mist/40 text-xs leading-relaxed mt-0.5 font-body">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* What's included */}
            <div className="card p-6">
              <h3 className="font-display text-2xl text-jade-light mb-4">What&apos;s Included</h3>
              <ul className="space-y-2">
                {["Professional DJ gear & setup", "Custom curated playlist", "MC services & crowd hype", "Pre-event planning call", "Travel within NOLA region"].map((item) => (
                  <li key={item} className="flex gap-3 text-mist/60 text-sm font-body">
                    <span className="text-jade-light mt-0.5">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* DM note */}
            <div className="border border-plum/20 bg-plum/10 p-5 text-center">
              <p className="text-mist/40 text-xs font-body mb-2">Prefer to chat first?</p>
              <a href="https://instagram.com/jluhvv" target="_blank" rel="noopener noreferrer"
                className="text-gold-muted font-sub text-sm tracking-wider hover:underline">
                DM @jluhvv on Instagram →
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
