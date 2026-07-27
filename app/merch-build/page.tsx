"use client";
import { useState, useMemo } from "react";
import { ShoppingBag, Sparkles, Palette } from "lucide-react";

const MIN_ITEMS = 3;
const MAX_ITEMS = 12;
const BASE = 275;
const PER_ITEM = 55;

function tierLabel(count: number) {
  if (count <= 4) return "Capsule";
  if (count <= 7) return "Full Line";
  return "Brand Package";
}

export default function MerchBuildPage() {
  const [itemCount, setItemCount] = useState(6);
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => BASE + itemCount * PER_ITEM, [itemCount]);
  const label = tierLabel(itemCount);

  async function buy() {
    setLoading(true);
    try {
      const res = await fetch("/api/merch-build/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemCount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert("Something went wrong starting checkout — try again.");
      }
    } catch {
      setLoading(false);
      alert("Something went wrong starting checkout — try again.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-4xl mx-auto">

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
            { icon: Sparkles, title: "2 Revision Rounds", desc: "Included on every build, so the direction lands right" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center">
              <Icon className="text-jade-light mx-auto mb-3" size={28} />
              <h3 className="font-sub text-sm tracking-wider uppercase text-cream mb-1">{title}</h3>
              <p className="text-mist/40 text-xs leading-relaxed font-body">{desc}</p>
            </div>
          ))}
        </div>

        {/* Sliding scale builder */}
        <div className="card p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="font-sub text-xs tracking-widest uppercase text-jade-light mb-1">{label}</p>
              <p className="font-display text-5xl text-cream">${total.toLocaleString()}</p>
              <p className="text-mist/40 text-xs font-body mt-1">
                ${BASE} base + ${PER_ITEM}/item × {itemCount} {itemCount === 1 ? "product" : "products"}
              </p>
            </div>
            <button
              onClick={buy}
              disabled={loading}
              className="btn-primary py-3 px-8 font-sub text-sm tracking-wider uppercase disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? "Redirecting…" : "Buy Now"}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-mist/40 text-xs font-body w-6 text-right">{MIN_ITEMS}</span>
            <input
              type="range"
              min={MIN_ITEMS}
              max={MAX_ITEMS}
              step={1}
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="flex-1 accent-jade-light"
            />
            <span className="text-mist/40 text-xs font-body w-6">{MAX_ITEMS}</span>
          </div>
          <p className="text-center text-cream font-sub text-sm tracking-wider uppercase mt-3">
            {itemCount} {itemCount === 1 ? "Product" : "Products"}
          </p>
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
