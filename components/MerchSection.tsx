"use client";

// ── MerchSection.tsx ─────────────────────────────────────────
// Catalog lives in lib/merch.ts (shared with /api/merch/checkout
// so prices can't be tampered with). "Add to Cart" uses the in-house
// cart — Snipcart has been removed.
// Mockups go in: public/images/merch/
//
// Layout matches midcitysound.com/merch: flat uniform grid, one
// static image per card, selectors always visible (no expand/collapse),
// single "Add" action. Every product here has exactly one style option,
// so it's auto-selected — no redundant style dropdown.

import Image from "next/image";
import { useState } from "react";
import {
  PRODUCTS,
  MERCH_LIVE,
  type MerchProduct,
  type Gender,
  type Size,
  formatSize,
} from "@/lib/merch";
import { useCart } from "@/lib/cart";

// ── ProductCard ──────────────────────────────────────────────
function ProductCard({ product }: { product: MerchProduct }) {
  const { addItem, open } = useCart();

  // Every product has exactly one style option — auto-select it,
  // no dropdown needed.
  const style = product.styles[0];

  const [gender, setGender] = useState<Gender>(style.forGenders[0]);
  const [size, setSize] = useState<Size | "">("");
  const [added, setAdded] = useState(false);

  const showGender = style.forGenders.length > 1;
  const sizeModifier = size && style.sizePriceModifiers ? (style.sizePriceModifiers[size] ?? 0) : 0;
  const finalPrice = product.basePrice + style.priceModifier + sizeModifier;
  const canAdd = !!size;

  function handleAdd() {
    if (!canAdd) return;
    addItem({
      productId: product.id,
      name: product.name,
      style: style.label,
      size: size as Size,
      gender,
      qty: 1,
      price: finalPrice,
      image: product.mockups[0],
    });
    setAdded(true);
    open();
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col">
      {/* Mockup image */}
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-gold text-background font-sub text-[10px] tracking-[0.2em] uppercase px-3 py-1">
            {product.tag}
          </span>
        )}
        <Image
          src={product.mockups[0]}
          alt={`${product.name} mockup`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info + selectors — always visible, uniform across every card */}
      <div className="pt-4 flex flex-col flex-1">
        <div className="flex justify-between items-baseline gap-2 mb-1">
          <h3 className="font-sub text-sm tracking-wider uppercase text-cream">{product.name}</h3>
          <span className="font-sub text-gold text-sm shrink-0">${finalPrice}</span>
        </div>
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-mist/40 mb-3">
          {style.label}
        </p>

        {showGender && (
          <div className="flex gap-2 mb-2">
            {style.forGenders.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-2.5 py-1 font-sub text-[10px] uppercase tracking-wider border transition-all ${
                  gender === g
                    ? "bg-plum border-plum text-cream"
                    : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-3">
          {style.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`min-w-[36px] px-2 py-1 font-sub text-[11px] uppercase tracking-wider border transition-all duration-150 ${
                size === s
                  ? "bg-plum border-plum text-cream"
                  : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist"
              }`}
            >
              {formatSize(s)}
            </button>
          ))}
        </div>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`mt-auto w-full py-2.5 font-sub text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
            !canAdd
              ? "bg-plum/20 text-mist/30 cursor-not-allowed"
              : added
              ? "bg-jade text-cream"
              : "bg-plum hover:bg-plum-light text-cream cursor-pointer"
          }`}
        >
          {!canAdd ? "Select a size" : added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

// ── MerchSection ─────────────────────────────────────────────
export default function MerchSection() {
  return (
    <section id="merch" className="relative bg-transparent py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-jade-glow pointer-events-none opacity-60" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Hidden Gem Collection</p>
          <h2 className="section-title drop-shadow-[0_0_20px_#4a3f8f66]">THE DRIP</h2>
          <p className="font-body text-sm text-mist/50 mt-4 max-w-sm mx-auto">
            Premium Shaka Wear · Printed via Printify · Ships direct to you
          </p>
        </div>

        {!MERCH_LIVE ? (
          /* ── Store being rebuilt — hide stale products ── */
          <div className="border border-plum/20 bg-surface py-20 px-6 text-center">
            <p className="font-display text-4xl sm:text-5xl text-holo mb-4">
              NEW COLLECTION DROPPING SOON
            </p>
            <p className="font-body text-sm text-mist/50 max-w-md mx-auto">
              The new Hidden Gem store is on the way. Join the list below and
              you&apos;ll be first to know when it goes live.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {PRODUCTS.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Trust bar */}
            <div className="mt-10 py-4 px-6 border border-plum/20 bg-surface flex flex-wrap justify-center gap-6 text-mist/40 font-sub text-[10px] tracking-[0.2em] uppercase">
              {["Premium Shaka Wear", "Printed via Printify", "Ships 5–10 Days", "Secure Checkout"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="text-jade-light">✦</span>{t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

