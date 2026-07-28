"use client";

// components/merch/ProductCard.tsx
// One product tile in the merch grid. Image + name link through to the
// full product page (/merch/[slug]) for color selection, gallery, and
// description — this card only handles a quick size pick + add-to-cart,
// same split MCS uses.

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MerchProduct, PrintifyVariantDetail } from "@/lib/printify";
import { useCart } from "@/lib/cart";
import { sortSizes, defaultSize, optionValue } from "@/lib/sizes";

export default function ProductCard({ product }: { product: MerchProduct }) {
  const { addItem, open } = useCart();

  // One button per unique size (a variant exists per color x size combo,
  // so without dedup a multi-color tee would repeat each size once per color).
  const sizeVariants = (() => {
    const seen = new Set<string>();
    const deduped = product.variants.filter((v) => {
      if (!v.isAvailable) return false;
      const size = optionValue(v, "size");
      if (!size || seen.has(size)) return false;
      seen.add(size);
      return true;
    });
    return sortSizes(deduped, (v) => optionValue(v, "size") ?? "");
  })();

  const defaultVariant = (() => {
    if (!sizeVariants.length) return product.variants[0] ?? null;
    const sizes = sizeVariants.map((v) => optionValue(v, "size") ?? "");
    const preferred = defaultSize(sizes);
    return sizeVariants.find((v) => optionValue(v, "size") === preferred) ?? sizeVariants[0];
  })();

  const [selectedVariant, setSelectedVariant] = useState<PrintifyVariantDetail | null>(
    sizeVariants.length > 6 ? null : defaultVariant
  );
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (sizeVariants.length > 6 && !selectedVariant) return;
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;

    addItem({
      variantId: variant.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      price: parseFloat(variant.retailPrice),
      qty: 1,
      image: variant.imageUrl || product.thumbnailUrl,
    });
    setAdded(true);
    open();
    setTimeout(() => setAdded(false), 1500);
  }, [addItem, open, product, selectedVariant, sizeVariants.length]);

  const price = selectedVariant ? parseFloat(selectedVariant.retailPrice) : product.price;
  const canAdd = !product.inStock ? false : sizeVariants.length > 6 ? !!selectedVariant : true;

  return (
    <div className="flex flex-col">
      {/* Image + name link to full product page */}
      <Link
        href={`/merch/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-surface-2 block group"
      >
        {!product.inStock && (
          <span className="absolute top-3 left-3 z-10 bg-surface text-mist/60 border border-plum/30 font-sub text-[10px] tracking-[0.2em] uppercase px-3 py-1">
            Sold Out
          </span>
        )}
        {!imgError && product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-mist/20 text-3xl">
            ◈
          </div>
        )}
      </Link>

      {/* Info + size select */}
      <div className="pt-4 flex flex-col flex-1">
        <div className="flex justify-between items-baseline gap-2 mb-1">
          <Link href={`/merch/${product.slug}`} className="hover:text-gold transition-colors">
            <h3 className="font-sub text-sm tracking-wider uppercase text-cream">{product.name}</h3>
          </Link>
          <span className="font-sub text-gold text-sm shrink-0">${price.toFixed(2)}</span>
        </div>

        {sizeVariants.length > 1 && (
          sizeVariants.length > 6 ? (
            <select
              aria-label="Select size"
              value={selectedVariant?.variantId ?? ""}
              onChange={(e) => {
                const v = sizeVariants.find((sv) => sv.variantId === Number(e.target.value));
                if (v) setSelectedVariant(v);
              }}
              className="mb-3 w-full bg-surface border border-plum/30 text-mist/70 text-[11px] tracking-wider uppercase px-2 py-2 font-sub focus:outline-none focus:border-gold/50"
            >
              <option value="" disabled>Select a size</option>
              {sizeVariants.map((v) => {
                const size = optionValue(v, "size") ?? v.name;
                return (
                  <option key={v.variantId} value={v.variantId}>{size}</option>
                );
              })}
            </select>
          ) : (
            <div className="flex flex-wrap gap-1.5 mb-3" role="group" aria-label="Select size">
              {sizeVariants.map((v) => {
                const size = optionValue(v, "size") ?? v.name;
                const isSelected = selectedVariant?.variantId === v.variantId;
                return (
                  <button
                    key={v.variantId}
                    onClick={() => setSelectedVariant(v)}
                    aria-pressed={isSelected}
                    className={`min-w-[36px] px-2 py-1 font-sub text-[11px] uppercase tracking-wider border transition-all duration-150 ${
                      isSelected
                        ? "bg-plum border-plum text-cream"
                        : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          )
        )}

        <button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={`mt-auto w-full py-2.5 font-sub text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
            !canAdd
              ? "bg-plum/20 text-mist/30 cursor-not-allowed"
              : added
              ? "bg-jade text-cream"
              : "bg-plum hover:bg-plum-light text-cream cursor-pointer"
          }`}
        >
          {!product.inStock ? "Sold Out" : !canAdd ? "Select a size" : added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
