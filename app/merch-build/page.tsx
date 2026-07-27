"use client";
import { useState } from "react";
import { ShoppingBag, Sparkles, Palette } from "lucide-react";

const TIERS = [
  {
    id: "capsule",
    name: "Capsule",
    itemCount: 4,
    price: "$495",
    desc: "A focused starter line — perfect for testing merch as a new revenue stream.",
    featured: false,
  },
  {
    id: "full-line",
    name: "Full Line",
    itemCount: 6,
    price: "$605",
    desc: "A complete catalog across apparel and accessories, with room to grow.",
    featured: true,
  },
  {
    id: "brand-package",
    name: "Brand Package",
    itemCount: 9,
    price: "$770",
    desc: "The full build — maximum catalog depth and design direction for an established brand.",
    featured: false,
  },
];

export default function MerchBuildPage() {
  const [loading, setLoading] = useState<string | null>(null);

  async function buyTier(tierId: string) {
    setLoading(tierId);
    try {
      const res = await fetch("/api/merch-build/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tierId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(null);
        alert("Something went wrong starting checkout — try again.");
      }
    } catch {
      setLoading(null);
      alert("Something went wrong starting checkout — try again.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <header className="text-center mb-16">
          <p className="section-label">For Corporate &amp; Creative Clients</p>
          <h1 className="section-title">
            Merch Store <span className="text-jade-light">Build</span>
          </h1>
          <p className="text-mist/50 text-sm mt-4 max-w-xl mx-auto">
            Jade designs a custom merch line for your brand — logos, mockups, and a
            ready-to-sell product catalog, built from the ground up.
          </p>
        </header>

        {/* What's included */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {[
            { icon: Palette, title: "Custom Design", desc: "Original logo and mockup concepts built around your brand" },
            { icon: ShoppingBag, title: "Full Catalog Setup", desc: "Products sourced, sized, and listed — ready to sell" },
            { icon: Sparkles, title: "2 Revision Rounds", desc: "Included on every tier, so the direction lands right" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center">
              <Icon className="text-jade-light mx-auto mb-3" size={28} />
              <h3 className="font-sub text-sm tracking-wider uppercase text-cream mb-1">{title}</h3>
              <p className="text-mist/40 text-xs leading-relaxed font-body">{desc}</p>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map(({ id, name, itemCount, price, desc, featured }) => (
            <div
              key={id}
              className={`rounded-xl p-6 border flex flex-col ${
                featured ? "border-jade/50 bg-jade/5" : "border-white/5 bg-surface-2"
              }`}
            >
              <p className={`font-sub text-xs tracking-widest uppercase mb-1 ${featured ? "text-jade-light" : "text-mist/40"}`}>
                {name}
              </p>
              <p className="font-display text-4xl text-cream mb-1">{price}</p>
              <p className="text-mist/40 text-xs font-body mb-3">{itemCount} products</p>
              <p className="text-mist/60 text-sm font-body leading-relaxed mb-5 flex-1">{desc}</p>
              <button
                onClick={() => buyTier(id)}
                disabled={loading !== null}
                className={`w-full text-center font-sub text-sm tracking-wider uppercase py-2.5 transition-colors disabled:opacity-50 ${
                  featured ? "btn-primary" : "btn-secondary"
                }`}
              >
                {loading === id ? "Redirecting…" : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-mist/30 text-xs font-body mt-6 text-center">
          Additional revision rounds are $40 each · Questions?{" "}
          <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
            jadedwheeler8@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
