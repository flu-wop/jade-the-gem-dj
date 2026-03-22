"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Gender = "Male" | "Female" | "Unisex";
type Style = "Crew" | "V-Neck" | "Oversized" | "Tank" | "Unisex";
type Size = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "4XL" | "5XL";

interface Product {
  id: string;
  name: string;
  price: number;
  mockupSrc: string;
  altText: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_BY_GENDER: Record<Gender, Style[]> = {
  Male: ["Crew", "V-Neck", "Oversized", "Tank"],
  Female: ["V-Neck", "Crew", "Tank"],
  Unisex: ["Unisex", "Crew", "Oversized"],
};

const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

// ── Update mockupSrc paths once images are in /public/images/merch/ ──────────
const PRODUCTS: Product[] = [
  {
    id: "hidden-gem-gypsy",
    name: "Hidden Gem Gypsy",
    price: 30,
    mockupSrc: "/images/merch/hidden-gem-gypsy.png",
    altText: "Hidden Gem Gypsy Tee mockup",
  },
  {
    id: "hidden-gem-bubble",
    name: "Hidden Gem Bubble",
    price: 30,
    mockupSrc: "/images/merch/hidden-gem-bubble.png",
    altText: "Hidden Gem Bubble Tee mockup",
  },
  {
    id: "mash-ups-vol-1",
    name: "Mash-Ups Vol. 1",
    price: 30,
    mockupSrc: "/images/merch/mash-ups-vol-1.png",
    altText: "Mash-Ups Vol. 1 Tee mockup",
  },
];

// ─── Single product card ──────────────────────────────────────────────────────

function MerchCard({ product }: { product: Product }) {
  const [gender, setGender] = useState<Gender | "">("");
  const [style, setStyle] = useState<Style | "">("");
  const [size, setSize] = useState<Size | "">("");

  function handleGenderChange(val: Gender | "") {
    setGender(val);
    setStyle("");
    setSize("");
  }

  const availableStyles: Style[] = gender ? STYLE_BY_GENDER[gender] : [];
  const isComplete = gender !== "" && style !== "" && size !== "";
  const variantLabel = isComplete ? `${gender} / ${style} / ${size}` : "";

  return (
    <div className="merch-card">
      {/* Mockup image — falls back to placeholder SVG if file not yet added */}
      <div className="merch-img-wrap">
        <img
          src={product.mockupSrc}
          alt={product.altText}
          className="merch-img"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23444' font-size='18' font-family='monospace'%3EMOCKUP SOON%3C/text%3E%3C/svg%3E";
          }}
        />
        <span className="merch-badge">$30</span>
      </div>

      <h3 className="merch-title">{product.name}</h3>

      {/* Gender dropdown */}
      <div className="merch-select-group">
        <label className="merch-label">Gender</label>
        <select
          className="merch-select"
          value={gender}
          onChange={(e) => handleGenderChange(e.target.value as Gender | "")}
        >
          <option value="">— Select —</option>
          {(["Male", "Female", "Unisex"] as Gender[]).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Style dropdown — filtered by gender */}
      <div className="merch-select-group">
        <label className="merch-label">Style</label>
        <select
          className="merch-select"
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

      {/* Size dropdown */}
      <div className="merch-select-group">
        <label className="merch-label">Size</label>
        <select
          className="merch-select"
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

      {/* Snipcart button — all data-item-* attrs are reactive via state */}
      <button
        className={`merch-btn snipcart-add-item ${!isComplete ? "merch-btn--disabled" : ""}`}
        disabled={!isComplete}
        data-item-id={`${product.id}__${variantLabel.replace(/\s/g, "-")}`}
        data-item-name={`${product.name} (${variantLabel})`}
        data-item-price={product.price}
        data-item-url={`/api/products/${product.id}`}
        data-item-description={variantLabel}
        data-item-image={product.mockupSrc}
        data-item-custom1-name="Variant"
        data-item-custom1-value={variantLabel}
        data-item-quantity="1"
      >
        {isComplete ? "Add to Cart →" : "Select Options"}
      </button>

      <style jsx>{`
        .merch-card {
          background: #0a0a0a;
          border: 1px solid #1e1e1e;
          border-radius: 4px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: border-color 0.2s;
        }
        .merch-card:hover { border-color: #3a3a3a; }
        .merch-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #111;
          border-radius: 2px;
          overflow: hidden;
        }
        .merch-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .merch-badge {
          position: absolute; top: 0.75rem; right: 0.75rem;
          background: #00ff88; color: #000;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
          padding: 0.2rem 0.5rem; border-radius: 2px;
        }
        .merch-title {
          font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: #e0e0e0; margin: 0;
        }
        .merch-select-group { display: flex; flex-direction: column; gap: 0.25rem; }
        .merch-label {
          font-size: 0.65rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: #555;
        }
        .merch-select {
          background: #111; border: 1px solid #222; color: #ccc;
          font-size: 0.8rem; padding: 0.45rem 0.6rem; border-radius: 2px;
          outline: none; cursor: pointer; transition: border-color 0.15s;
        }
        .merch-select:focus { border-color: #00ff88; }
        .merch-select:disabled { opacity: 0.35; cursor: not-allowed; }
        .merch-btn {
          margin-top: 0.5rem; background: #00ff88; color: #000;
          border: none; padding: 0.7rem 1rem;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; border-radius: 2px; cursor: pointer;
          transition: background 0.15s;
        }
        .merch-btn:hover:not(:disabled) { background: #00e07a; }
        .merch-btn--disabled { background: #1a1a1a; color: #444; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MerchSection() {
  return (
    <section id="merch" className="merch-section">
      <h2 className="section-heading">## Drip ∞</h2>
      <p className="merch-sub">
        Shaka Wear blanks · Ships via Printify · Drop ships to your door
      </p>

      <div className="merch-grid">
        {PRODUCTS.map((p) => (
          <MerchCard key={p.id} product={p} />
        ))}
      </div>

      <style jsx>{`
        .merch-section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .section-heading {
          font-family: var(--font-bebas, monospace);
          font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: #00ff88; letter-spacing: 0.05em; margin-bottom: 0.4rem;
        }
        .merch-sub {
          font-size: 0.72rem; color: #444;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 2.5rem;
        }
        .merch-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </section>
  );
}
