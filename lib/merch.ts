// lib/merch.ts
// ─────────────────────────────────────────────────────────────
// Single source of truth for the merch store.
// MerchSection (UI) and /api/merch/checkout (server) both read this.
// ─────────────────────────────────────────────────────────────

// ── Store on/off switch ───────────────────────────────────────
// Flip to `true` once mockup images are added to public/images/merch/
export const MERCH_LIVE = false;

export type Gender = "Unisex" | "Women's";
export type ShirtStyle =
  | "Oversized Tee"
  | "Heavyweight Tee"
  | "Cropped Tee"
  | "Hoodie"
  | "Tote Bag"
  | "Trucker Hat"
  | "Art Print";
export type Size = "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "OS";

export interface StyleOption {
  label: ShirtStyle;
  forGenders: Gender[];
  sizes: Size[];
  priceModifier: number;
}

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number; // USD retail (what the customer pays)
  mockups: [string, string, string];
  styles: StyleOption[];
  tag?: string;
  printifyProductId?: string;
}

export const PRODUCTS: MerchProduct[] = [
  {
    id: "hidden-gem-airbrush",
    name: "Hidden Gem Air Brush",
    tag: "New Drop",
    description: "Airbrush graphic tee. Limited run, heavy energy.",
    basePrice: 39,
    mockups: [
      "/images/merch/airbrush-1.jpg",
      "/images/merch/airbrush-2.jpg",
      "/images/merch/airbrush-3.jpg",
    ],
    styles: [
      {
        label: "Oversized Tee",
        forGenders: ["Unisex"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        priceModifier: 0,
      },
    ],
    printifyProductId: "29595105",
  },
  {
    id: "hidden-gem-tee",
    name: "Hidden Gem Tee",
    tag: "Best Seller",
    description: "The classic. Hidden Gem on your chest.",
    basePrice: 46,
    mockups: [
      "/images/merch/tee-1.jpg",
      "/images/merch/tee-2.jpg",
      "/images/merch/tee-3.jpg",
    ],
    styles: [
      {
        label: "Heavyweight Tee",
        forGenders: ["Unisex", "Women's"],
        sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
        priceModifier: 0,
      },
    ],
    printifyProductId: "28889240",
  },
  {
    id: "hidden-vintage-trucker",
    name: "Hidden Vintage Trucker",
    description: "Mesh back, structured front. NOLA-coded.",
    basePrice: 34,
    mockups: [
      "/images/merch/trucker-1.jpg",
      "/images/merch/trucker-2.jpg",
      "/images/merch/trucker-3.jpg",
    ],
    styles: [
      {
        label: "Trucker Hat",
        forGenders: ["Unisex"],
        sizes: ["OS"],
        priceModifier: 0,
      },
    ],
    printifyProductId: "28887077",
  },
  {
    id: "hidden-poster",
    name: "Hidden Poster",
    description: "Limited edition art print. Frame it.",
    basePrice: 18,
    mockups: [
      "/images/merch/poster-1.jpg",
      "/images/merch/poster-2.jpg",
      "/images/merch/poster-3.jpg",
    ],
    styles: [
      {
        label: "Art Print",
        forGenders: ["Unisex"],
        sizes: ["OS"],
        priceModifier: 0,
      },
    ],
    printifyProductId: "28886775",
  },
];

// ── Printify variant mapping ─────────────────────────────────
// Maps (style, size, gender) → Printify variant_id for auto-fulfillment.
// Without these, orders still go through but require manual fulfillment.
//
// To fill these in:
//   1. Hit /api/printify/products?key=YOUR_ADMIN_PASSWORD in your browser
//   2. Each product returns variants[] with id + title
//   3. Paste the variant IDs below
//
// Key format: `${style}|${size}|${gender}`
export const PRINTIFY_VARIANTS: Record<string, Record<string, number>> = {
  // "hidden-gem-airbrush": { "Oversized Tee|S|Unisex": 00000, ... },
  // "hidden-gem-tee":      { "Heavyweight Tee|S|Unisex": 00000, ... },
  // "hidden-vintage-trucker": { "Trucker Hat|OS|Unisex": 00000 },
  // "hidden-poster":       { "Art Print|OS|Unisex": 00000 },
};

export function variantKey(style: string, size: string, gender: string): string {
  return `${style}|${size}|${gender}`;
}

export function getPrintifyVariant(
  productId: string,
  style: string,
  size: string,
  gender: string
): number | null {
  const map = PRINTIFY_VARIANTS[productId];
  if (!map) return null;
  return map[variantKey(style, size, gender)] ?? null;
}

export function findProduct(id: string): MerchProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
