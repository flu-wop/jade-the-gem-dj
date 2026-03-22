"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Gender = "Male" | "Female" | "Unisex";
type Style  = "Crew" | "V-Neck" | "Oversized" | "Tank" | "Unisex";
type Size   = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL";

interface Product {
  id: string;
  name: string;
  price: number;
  mockupSrc: string;
  altText: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_BY_GENDER: Record<Gender, Style[]> = {
  Male:   ["Crew", "V-Neck", "Oversized", "Tank"],
  Female: ["V-Neck", "Crew", "Tank"],
  Unisex: ["Unisex", "Crew", "Oversized"],
};

const SIZES: Size[] = ["XS","S","M","L","XL","2XL","3XL","4XL","5XL"];

const PRODUCTS: Product[] = [
  {
    id: "hidden-gem-gypsy",
    name: "Hidden Gem Gypsy",
    price: 30,
    mockupSrc: "/images/merch/hidden-gem-gypsy.png",
    altText:   "Hidden Gem Gypsy Tee",
  },
  {
    id: "hidden-gem-bubble",
    name: "Hidden Gem Bubble",
    price: 30,
    mockupSrc: "/images/merch/hidden-gem-bubble.png",
    altText:   "Hidden Gem Bubble Tee",
  },
  {
    id: "mash-ups-vol-1",
    name: "Mash-Ups Vol. 1",
    price: 30,
    mockupSrc: "/images/merch/mash-ups-vol-1.png",
    altText:   "Mash-Ups Vol. 1 Tee",
  },
];

// ─── SVG placeholder (shown if image 404s) ────────────────────────────────────
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%230e0b14'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%234a3f8f' font-size='16' font-family='monospace'%3EMOCKUP SOON%3C/text%3E%3C/svg%3E";

// ─── Single product card ──────────────────────────────────────────────────────

function MerchCard({ product }: { product: Product }) {
  const [gender,   setGender]   = useState<Gender | "">("");
  const [style,    setStyle]    = useState<Style  | "">("");
  const [size,     setSize]     = useState<Size   | "">("");
  const [quantity, setQuantity] = useState(1);
  const [alert,    setAlert]    = useState(false); // "select all" nudge

  function handleGenderChange(val: Gender | "") {
    setGender(val); setStyle(""); setSize("");
  }

  const availableStyles = gender ? STYLE_BY_GENDER[gender] : [];
  const isComplete      = gender !== "" && style !== "" && size !== "";
  const variantLabel    = isComplete ? `${gender} / ${style} / ${size}` : "";

  function handleAddClick() {
    if (!isComplete) { setAlert(true); setTimeout(() => setAlert(false), 2500); }
  }

  return (
    <div className="mc-card">
      {/* ── Mockup image ── */}
      <div className="mc-img-wrap">
        <img
          src={product.mockupSrc}
          alt={product.altText}
          className="mc-img"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <span className="mc-badge">${product.price}</span>
      </div>

      {/* ── Title — Anton font + drip shadow ── */}
      <h3 className="mc-title">{product.name}</h3>

      {/* ── Gender ── */}
      <div className="mc-field">
        <label className="mc-label">Gender</label>
        <select
          className="mc-select"
          value={gender}
          onChange={(e) => handleGenderChange(e.target.value as Gender | "")}
        >
          <option value="">— Select —</option>
          {(["Male","Female","Unisex"] as Gender[]).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* ── Style (filtered by gender) ── */}
      <div className="mc-field">
        <label className="mc-label">Style</label>
        <select
          className="mc-select"
          value={style}
          disabled={!gender}
          onChange={(e) => { setStyle(e.target.value as Style | ""); setSize(""); }}
        >
          <option value="">— Select —</option>
          {availableStyles.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ── Size ── */}
      <div className="mc-field">
        <label className="mc-label">Size</label>
        <select
          className="mc-select"
          value={size}
          disabled={!style}
          onChange={(e) => setSize(e.target.value as Size | "")}
        >
          <option value="">— Select —</option>
          {SIZES.map((sz) => (
            <option key={sz} value={sz}>{sz}</option>
          ))}
        </select>
      </div>

      {/* ── Quantity ── */}
      <div className="mc-field mc-qty-row">
        <label className="mc-label">Qty</label>
        <div className="mc-qty-wrap">
          <button
            className="mc-qty-btn"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >−</button>
          <span className="mc-qty-num">{quantity}</span>
          <button
            className="mc-qty-btn"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
          >+</button>
        </div>
      </div>

      {/* ── Alert nudge ── */}
      {alert && (
        <p className="mc-alert" role="alert">
          ↑ Select gender, style &amp; size first
        </p>
      )}

      {/* ── Snipcart Add to Cart ──────────────────────────────────────────────
           data-item-* attrs update reactively via React state.
           data-item-url hits /api/products/[id] for Snipcart price validation.
      ─────────────────────────────────────────────────────────────────────── */}
      <button
        onClick={handleAddClick}
        className={`mc-btn snipcart-add-item ${!isComplete ? "mc-btn--off" : ""}`}
        disabled={!isComplete}
        data-item-id={`${product.id}__${variantLabel.replace(/[\s/]+/g,"-")}`}
        data-item-name={`${product.name} (${variantLabel})`}
        data-item-price={product.price}
        data-item-url={`/api/products/${product.id}`}
        data-item-description={variantLabel}
        data-item-image={product.mockupSrc}
        data-item-quantity={quantity}
        data-item-custom1-name="Variant"
        data-item-custom1-value={variantLabel}
      >
        {isComplete ? `Add ${quantity > 1 ? `×${quantity} ` : ""}to Cart →` : "Select Options"}
      </button>

      {/* ── Trust badge ── */}
      <p className="mc-trust">
        ✦ Premium Shaka Wear blanks — Printed fresh, ships direct USA
      </p>

      {/* ── Scoped styles ── */}
      <style jsx>{`
        .mc-card {
          background: #151020;
          border: 1px solid #2a1f4a;
          border-radius: 6px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .mc-card:hover {
          border-color: #4a3f8f;
          box-shadow: 0 0 20px rgba(74,63,143,0.15);
        }
        .mc-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #0e0b14;
          border-radius: 4px;
          overflow: hidden;
        }
        .mc-img {
          width: 100%; height: 100%;
          object-fit: contain;
          display: block;
          padding: 0.5rem;
        }
        .mc-badge {
          position: absolute; top: 0.6rem; right: 0.6rem;
          background: #d4af37; color: #0e0b14;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.08em;
          padding: 0.18rem 0.45rem; border-radius: 3px;
        }
        /* Anton font + drip shadow on title */
        .mc-title {
          font-family: var(--font-anton, sans-serif);
          font-size: 1rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #b8a7d9;
          margin: 0.2rem 0 0;
          text-shadow: 2px 2px 0px #4a3f8f, 3px 3px 6px rgba(42,122,111,0.35);
        }
        .mc-field { display: flex; flex-direction: column; gap: 0.2rem; }
        .mc-label {
          font-size: 0.6rem; letter-spacing: 0.14em;
          text-transform: uppercase; color: #4a3f8f;
        }
        .mc-select {
          background: #1e1830; border: 1px solid #2a1f4a; color: #e0d8f0;
          font-size: 0.78rem; padding: 0.4rem 0.55rem; border-radius: 3px;
          outline: none; cursor: pointer; transition: border-color 0.15s;
        }
        .mc-select:focus  { border-color: #2a7a6f; }
        .mc-select:disabled { opacity: 0.3; cursor: not-allowed; }
        /* Qty row */
        .mc-qty-row { flex-direction: row; align-items: center; gap: 0.6rem; }
        .mc-qty-wrap { display: flex; align-items: center; gap: 0; }
        .mc-qty-btn {
          background: #1e1830; border: 1px solid #2a1f4a; color: #b8a7d9;
          width: 28px; height: 28px; font-size: 1rem; cursor: pointer;
          transition: background 0.15s;
          border-radius: 3px;
        }
        .mc-qty-btn:hover { background: #2a1f4a; }
        .mc-qty-num {
          min-width: 32px; text-align: center;
          font-size: 0.85rem; color: #f5f5f5;
          border-top: 1px solid #2a1f4a; border-bottom: 1px solid #2a1f4a;
          padding: 0.2rem 0.4rem;
        }
        /* Alert nudge */
        .mc-alert {
          font-size: 0.68rem; color: #d4af37;
          letter-spacing: 0.06em; margin: 0;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        /* CTA button */
        .mc-btn {
          margin-top: 0.25rem;
          background: linear-gradient(135deg, #4a3f8f, #2a7a6f);
          color: #f5f5f5;
          border: none; padding: 0.7rem 1rem;
          font-family: var(--font-bungee, sans-serif);
          font-size: 0.72rem; letter-spacing: 0.12em;
          text-transform: uppercase; border-radius: 3px; cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          box-shadow: 0 0 14px rgba(74,63,143,0.3);
        }
        .mc-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .mc-btn--off {
          background: #1e1830; color: #3a3050;
          box-shadow: none; cursor: not-allowed;
        }
        /* Trust badge */
        .mc-trust {
          font-size: 0.6rem; color: #4a3f8f;
          letter-spacing: 0.07em; text-align: center;
          margin-top: 0.25rem; line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

export default function MerchSection() {
  return (
    <section id="merch" className="ms-section">
      {/* Bungee font on section header */}
      <h2 className="ms-heading">## Drip ∞</h2>
      <p className="ms-sub">
        Shaka Wear blanks · Ships via Printify · Drop ships to your door
      </p>

      <div className="ms-grid">
        {PRODUCTS.map((p) => <MerchCard key={p.id} product={p} />)}
      </div>

      <style jsx>{`
        .ms-section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .ms-heading {
          font-family: var(--font-bungee, monospace);
          font-size: clamp(1.2rem, 2.8vw, 1.8rem);
          color: #d4af37;
          letter-spacing: 0.04em;
          margin-bottom: 0.3rem;
          text-shadow: 2px 2px 0px #4a3f8f;
        }
        .ms-sub {
          font-size: 0.7rem; color: #4a3f8f;
          letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2.5rem;
        }
        .ms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </section>
  );
}
