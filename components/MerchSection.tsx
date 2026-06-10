"use client";

// ── MerchSection.tsx ─────────────────────────────────────────
// Catalog now lives in lib/merch.ts (shared with /api/merch/checkout
// so prices can't be tampered with). "Add to Cart" uses the in-house
// cart — Snipcart has been removed.
// Mockups go in: public/images/merch/

import Image from "next/image";
import { useState } from "react";
import {
  PRODUCTS,
  MERCH_LIVE,
  type MerchProduct,
  type Gender,
  type ShirtStyle,
  type Size,
} from "@/lib/merch";
import { useCart } from "@/lib/cart";

// ── ProductCard ──────────────────────────────────────────────
function ProductCard({ product }: { product: MerchProduct }) {
  const { addItem } = useCart();
  const [expanded, setExpanded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [gender, setGender] = useState<Gender>("Unisex");
  const [style, setStyle] = useState<ShirtStyle | "">("");
  const [size, setSize] = useState<Size | "">("");
  const [qty, setQty] = useState(1);

  const availableStyles = product.styles.filter((s) => s.forGenders.includes(gender));
  const selectedStyle = availableStyles.find((s) => s.label === style);
  const finalPrice = product.basePrice + (selectedStyle?.priceModifier ?? 0);
  const canAddToCart = !!(gender && style && size);

  function handleAdd() {
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      name: product.name,
      style: style as ShirtStyle,
      size: size as Size,
      gender,
      qty,
      price: finalPrice,
      image: product.mockups[0],
    });
    setExpanded(false);
    setStyle("");
    setSize("");
    setQty(1);
  }

  return (
    <div className="card group flex flex-col">
      {/* Mockup image */}
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 bg-gold text-background font-sub text-[10px] tracking-[0.2em] uppercase px-3 py-1">
            {product.tag}
          </span>
        )}
        <Image
          src={product.mockups[activeImg]}
          alt={`${product.name} mockup`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-t from-plum/20 to-transparent transition-opacity duration-300" />
        {/* Thumbnail dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {product.mockups.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`w-2 h-2 rounded-full transition-all ${activeImg === i ? "bg-gold scale-125" : "bg-mist/40 hover:bg-mist/70"}`}
              aria-label={`View mockup ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Info + variants */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-sub text-base tracking-wider uppercase text-cream">{product.name}</h3>
          <span className="font-sub text-gold text-sm">${finalPrice}</span>
        </div>
        <p className="font-body text-xs text-mist/50 mb-4 flex-1">{product.description}</p>

        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="w-full py-3 font-sub text-xs tracking-[0.2em] uppercase border border-plum/40 text-gold-muted hover:bg-plum/20 hover:border-plum transition-all duration-200"
          >
            Select Options
          </button>
        ) : (
          <div className="space-y-3">
            {/* Gender */}
            <div>
              <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => { setGender(e.target.value as Gender); setStyle(""); setSize(""); }}
                className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-3 py-2 focus:outline-none focus:border-plum transition-colors"
              >
                {(["Unisex", "Women's"] as Gender[]).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-1">Style</label>
              <select
                value={style}
                onChange={(e) => { setStyle(e.target.value as ShirtStyle); setSize(""); }}
                className="w-full bg-surface-2 border border-plum/30 text-cream font-body text-sm px-3 py-2 focus:outline-none focus:border-plum transition-colors"
              >
                <option value="">Choose style</option>
                {availableStyles.map((s) => (
                  <option key={s.label} value={s.label}>
                    {s.label}{s.priceModifier > 0 ? ` (+$${s.priceModifier})` : s.priceModifier < 0 ? ` (-$${Math.abs(s.priceModifier)})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            {selectedStyle && (
              <div>
                <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-1">Size</label>
                <div className="flex flex-wrap gap-2">
                  {selectedStyle.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[40px] px-3 py-1.5 font-sub text-xs uppercase tracking-wider border transition-all duration-150 ${
                        size === s ? "bg-plum border-plum text-cream" : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {size && (
              <div>
                <label className="block font-sub text-[10px] tracking-[0.2em] uppercase text-mist/40 mb-1">Qty</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 border border-plum/30 text-mist hover:border-plum hover:text-gold font-sub text-lg flex items-center justify-center transition-all">−</button>
                  <span className="font-sub text-cream w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-8 h-8 border border-plum/30 text-mist hover:border-plum hover:text-gold font-sub text-lg flex items-center justify-center transition-all">+</button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={handleAdd}
              disabled={!canAddToCart}
              className={`w-full py-3.5 font-sub text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
                canAddToCart
                  ? "bg-plum hover:bg-plum-light text-cream cursor-pointer shadow-[0_0_20px_#4a3f8f55] hover:shadow-[0_0_30px_#4a3f8f88]"
                  : "bg-plum/20 text-mist/30 cursor-not-allowed"
              }`}
            >
              {canAddToCart ? `Add to Cart — $${finalPrice * qty}` : "Select options above"}
            </button>

            <button onClick={() => setExpanded(false)} className="w-full text-center font-body text-[10px] text-mist/30 hover:text-mist/60 transition-colors">
              ← Collapse
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MerchSection ─────────────────────────────────────────────
export default function MerchSection() {
  return (
    <section id="merch" className="relative bg-background py-24 px-6 overflow-hidden">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-plum/10">
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
