"use client";

// app/merch/[slug]/ProductDetail.tsx
// Full product view: color swatches, size select, front/back gallery,
// quantity, add to cart. Mirrors the MCS product page pattern.

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import type { MerchProduct } from "@/lib/printify";
import { useCart } from "@/lib/cart";
import { sortSizes, defaultSize, optionValue } from "@/lib/sizes";
import { colorHex, isLightColor } from "@/lib/color-swatches";

export default function ProductDetail({ product }: { product: MerchProduct }) {
  const { addItem, open } = useCart();
  const variants = useMemo(() => product.variants ?? [], [product.variants]);

  const sizes = useMemo(() => {
    const seen = new Set<string>();
    const unsorted = variants
      .map((v) => optionValue(v, "size"))
      .filter((s): s is string => !!s && !seen.has(s) && (seen.add(s), true));
    return sortSizes(unsorted, (s) => s);
  }, [variants]);

  const availableSizes = useMemo(() => {
    const seen = new Set<string>();
    const unsorted = variants
      .filter((v) => v.isAvailable)
      .map((v) => optionValue(v, "size"))
      .filter((s): s is string => !!s && !seen.has(s) && (seen.add(s), true));
    return sortSizes(unsorted, (s) => s);
  }, [variants]);

  const colors = useMemo(() => {
    const seen = new Set<string>();
    return variants
      .filter((v) => v.isAvailable)
      .map((v) => optionValue(v, "color"))
      .filter((c): c is string => !!c && !seen.has(c) && (seen.add(c), true));
  }, [variants]);

  const colorInfo = useMemo(() => {
    return colors.map((color) => {
      const colorVariants = variants.filter((v) => optionValue(v, "color") === color);
      const withImages = colorVariants.find((v) => Object.keys(v.imagesByPosition).length > 0) ?? colorVariants[0];
      return {
        color,
        images: withImages?.imagesByPosition ?? {},
        available: colorVariants.some((v) => v.isAvailable),
      };
    });
  }, [colors, variants]);

  // Fallback gallery for products with no color variants (posters, etc.)
  const plainGallery = useMemo(() => {
    const urls = Array.from(new Set(variants.map((v) => v.imageUrl).filter(Boolean)));
    return urls.length ? urls : [product.thumbnailUrl];
  }, [variants, product.thumbnailUrl]);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    sizes.length > 10 ? undefined : defaultSize(availableSizes.length ? availableSizes : sizes)
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [activeSide, setActiveSide] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const currentColorImages = colorInfo.find((c) => c.color === selectedColor)?.images ?? {};
  const sides = Object.keys(currentColorImages);
  const resolvedSide = activeSide && currentColorImages[activeSide]
    ? activeSide
    : currentColorImages.front
    ? "front"
    : sides[0];

  const isSizeAvailable = useCallback(
    (size: string) => {
      return variants.some(
        (v) =>
          optionValue(v, "size") === size &&
          (!colors.length || optionValue(v, "color") === selectedColor) &&
          v.isAvailable
      );
    },
    [variants, colors, selectedColor]
  );

  const selectedVariant = useMemo(() => {
    const match = variants.find(
      (v) =>
        (!sizes.length || optionValue(v, "size") === selectedSize) &&
        (!colors.length || optionValue(v, "color") === selectedColor)
    );
    if (match) return match;
    if (sizes.length > 10 && !selectedSize) return undefined;
    return variants[0];
  }, [variants, sizes, colors, selectedSize, selectedColor]);

  const canAddToCart = !!selectedVariant?.isAvailable;
  const displayImage = colors.length > 1
    ? currentColorImages[resolvedSide ?? ""] ?? product.thumbnailUrl
    : plainGallery[activeImage] ?? product.thumbnailUrl;

  const handleAddToCart = useCallback(() => {
    if (!selectedVariant || !selectedVariant.isAvailable) return;
    addItem({
      variantId: selectedVariant.variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantName: selectedVariant.name,
      price: parseFloat(selectedVariant.retailPrice),
      qty,
      image: selectedVariant.imageUrl || product.thumbnailUrl,
    });
    setAdded(true);
    open();
    setTimeout(() => setAdded(false), 2000);
  }, [addItem, open, product, selectedVariant, qty]);

  const price = selectedVariant ? parseFloat(selectedVariant.retailPrice) : product.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* ── Gallery ── */}
      <div>
        <div className="relative aspect-square bg-surface-2 border border-plum/20 overflow-hidden">
          {!imgError && displayImage ? (
            <Image
              src={displayImage}
              alt={`${product.name}${resolvedSide ? ` — ${resolvedSide}` : ""}`}
              fill
              className="object-cover"
              priority
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-mist/20 text-5xl">◈</div>
          )}
        </div>

        {colors.length > 0 && sides.length > 1 && (
          <div className="flex gap-2 mt-3" role="group" aria-label="Select photo side">
            {sides.map((side) => (
              <button
                key={side}
                onClick={() => setActiveSide(side)}
                aria-pressed={resolvedSide === side}
                className={`px-3 py-1.5 text-[9px] tracking-[0.14em] uppercase font-sub border transition-colors capitalize ${
                  resolvedSide === side
                    ? "border-gold/60 text-gold"
                    : "border-plum/20 text-mist/40 hover:border-mist/30 hover:text-mist/70"
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        )}

        {colors.length === 0 && plainGallery.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {plainGallery.map((url, i) => (
              <button
                key={url + i}
                onClick={() => setActiveImage(i)}
                className={`relative w-16 h-16 shrink-0 border overflow-hidden bg-surface-2 ${
                  activeImage === i ? "border-gold/70" : "border-plum/20"
                }`}
              >
                <Image src={url} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}

        {colors.length > 1 && (
          <div className="mt-4" role="group" aria-label="Select color">
            <div className="flex flex-wrap gap-2">
              {colorInfo.map(({ color, available }) => {
                const hex = colorHex(color);
                const light = isLightColor(color);
                const selected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => { setSelectedColor(color); setActiveSide(undefined); }}
                    disabled={!available}
                    aria-pressed={selected}
                    aria-label={color}
                    title={available ? color : `${color} (sold out)`}
                    className={`relative w-8 h-8 rounded-full transition-all ${
                      light ? "border border-mist/30" : "border border-transparent"
                    } ${selected ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""} ${
                      !available ? "opacity-25 cursor-not-allowed" : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: hex }}
                  >
                    {!available && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-cream">✕</span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedColor && (
              <p className="text-[10px] tracking-[0.1em] uppercase text-mist/40 font-sub mt-2">
                {selectedColor}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Details ── */}
      <div className="flex flex-col">
        <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-2 text-cream">
          {product.name}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <span className="font-sub text-gold text-2xl">${price.toFixed(2)}</span>
          {!product.inStock && (
            <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 border border-mist/30 text-mist/60 font-sub">
              Sold Out
            </span>
          )}
        </div>

        {sizes.length > 1 && (
          <div className="mb-6">
            <p className="text-[9px] tracking-[0.14em] uppercase text-mist/40 font-sub mb-2">Size</p>
            {sizes.length > 10 ? (
              <select
                aria-label="Select size"
                value={selectedSize ?? ""}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full bg-surface-2 border border-plum/30 text-mist/70 text-[11px] tracking-wider uppercase px-3 py-2.5 font-sub focus:outline-none focus:border-gold/50"
              >
                <option value="" disabled>Select a size</option>
                {availableSizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Select size">
                {sizes.filter(isSizeAvailable).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    aria-pressed={selectedSize === s}
                    className={`min-w-[36px] px-3 py-1.5 font-sub text-[11px] uppercase tracking-wider border transition-colors ${
                      selectedSize === s
                        ? "bg-plum border-plum text-cream"
                        : "border-plum/30 text-mist/50 hover:border-plum/60 hover:text-mist"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center border border-plum/30">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-9 h-9 text-mist/60 hover:text-gold transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-cream font-sub text-sm">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-9 h-9 text-mist/60 hover:text-gold transition-colors"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className={`flex-1 py-3 font-sub text-xs tracking-[0.2em] uppercase transition-all duration-300 ${
              !canAddToCart
                ? "bg-plum/20 text-mist/30 cursor-not-allowed"
                : added
                ? "bg-jade text-cream"
                : "bg-plum hover:bg-plum-light text-cream"
            }`}
          >
            {added ? "✓ Added to Cart" : canAddToCart ? "Add to Cart" : sizes.length > 10 && !selectedSize ? "Select a Size" : "Out of Stock"}
          </button>
        </div>

        {product.description && (
          <div
            className="font-body text-sm text-mist/60 leading-relaxed [&_p]:mb-2 border-t border-plum/15 pt-6"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}
      </div>
    </div>
  );
}
