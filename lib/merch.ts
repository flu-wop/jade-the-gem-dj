// lib/merch.ts
// ─────────────────────────────────────────────────────────────
// The single source of truth for the merch store.
// MerchSection (UI) and /api/merch/checkout (server) both read this,
// so the price a customer sees can never differ from the price charged.
// ─────────────────────────────────────────────────────────────

// ── Store on/off switch ───────────────────────────────────────
// While the new Printify store is being set up, keep this `false` so
// the old/stale products don't show or sell. Flip to `true` once the
// real lineup is in PRODUCTS below and the Printify IDs are wired.
export const MERCH_LIVE = false;

export type Gender = "Unisex" | "Women's";
export type ShirtStyle =
  | "Oversized Tee"
  | "Heavyweight Tee"
  | "Cropped Tee"
  | "Hoodie"
  | "Tote Bag";
export type Size = "S" | "M" | "L" | "XL" | "2XL" | "3XL" | "OS";

export interface StyleOption {
  label: ShirtStyle;
  forGenders: Gender[];
  sizes: Size[];
  priceModifier: number; // added to basePrice (USD)
}

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number; // USD retail (what the customer pays)
  mockups: [string, string, string];
  styles: StyleOption[];
  tag?: string;
  /** Printify product_id — fill from /api/printify/products once your
   *  Printify products exist. Leave undefined to take payment without
   *  auto-fulfillment (you'll get a "fulfill manually" email instead). */
  printifyProductId?: string;
}

export const STYLES: StyleOption[] = [
  { label: "Oversized Tee",   forGenders: ["Unisex"],            sizes: ["S", "M", "L", "XL", "2XL", "3XL"], priceModifier: 0 },
  { label: "Heavyweight Tee", forGenders: ["Unisex", "Women's"], sizes: ["S", "M", "L", "XL", "2XL"],        priceModifier: 0 },
  { label: "Cropped Tee",     forGenders: ["Women's"],           sizes: ["S", "M", "L", "XL"],               priceModifier: 0 },
  { label: "Hoodie",          forGenders: ["Unisex", "Women's"], sizes: ["S", "M", "L", "XL", "2XL", "3XL"], priceModifier: 20 },
  { label: "Tote Bag",        forGenders: ["Unisex"],            sizes: ["OS"],                              priceModifier: -10 },
];

export const PRODUCTS: MerchProduct[] = [
  {
    id: "hidden-gem-globe",
    name: "Hidden Gem Globe",
    tag: "New Drop",
    description: "Holographic chrome globe. Your drip, your era.",
    basePrice: 40,
    mockups: ["/images/merch/globe-model.jpg", "/images/merch/globe-flat.jpg", "/images/merch/globe-close.jpg"],
    styles: STYLES,
    // printifyProductId: "PASTE_FROM_PRINTIFY",
  },
  {
    id: "jade-wave",
    name: "Jade Wave",
    description: "Teal smoke wave. Calm the room.",
    basePrice: 38,
    mockups: ["/images/merch/wave-model.jpg", "/images/merch/wave-flat.jpg", "/images/merch/wave-close.jpg"],
    styles: STYLES,
  },
  {
    id: "504-crown",
    name: "504 Crown",
    tag: "Best Seller",
    description: "NOLA born. Crown on every fit.",
    basePrice: 38,
    mockups: ["/images/merch/crown-model.jpg", "/images/merch/crown-flat.jpg", "/images/merch/crown-close.jpg"],
    styles: STYLES,
  },
  {
    id: "all-seeing-gem",
    name: "All Seeing Gem",
    description: "Street-mystic energy. All eyes on you.",
    basePrice: 40,
    mockups: ["/images/merch/eye-model.jpg", "/images/merch/eye-flat.jpg", "/images/merch/eye-close.jpg"],
    styles: STYLES,
  },
];

// ── Printify variant mapping ─────────────────────────────────
// Maps a chosen (style, size, gender) combo to a Printify variant_id.
// Fill these once you've created the products in Printify:
//   1. Add PRINTIFY_API_TOKEN + PRINTIFY_SHOP_ID to Vercel
//   2. Visit /api/printify/products?key=YOUR_ADMIN_PASSWORD
//   3. Copy each variant's id + title into the map below
//
// Key format: `${style}|${size}|${gender}`  (see variantKey()).
// Example:
//   "hidden-gem-globe": { "Oversized Tee|L|Unisex": 38172, "Hoodie|XL|Unisex": 38244 }
export const PRINTIFY_VARIANTS: Record<string, Record<string, number>> = {
  // "hidden-gem-globe": {},
  // "jade-wave": {},
  // "504-crown": {},
  // "all-seeing-gem": {},
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

/** Authoritative price for a product + chosen style. Server uses this. */
export function priceFor(product: MerchProduct, style: string): number {
  const mod = product.styles.find((s) => s.label === style)?.priceModifier ?? 0;
  return product.basePrice + mod;
}

// ── Cart line shape (shared by cart UI + checkout) ──
export interface CartLine {
  productId: string;
  name: string;
  style: ShirtStyle;
  size: Size;
  gender: Gender;
  qty: number;
  price: number; // per-unit USD — re-validated server-side, never trusted from client
  image: string;
}

/** Stable id for a cart line so identical variants stack. */
export function lineId(l: Pick<CartLine, "productId" | "style" | "size" | "gender">): string {
  return `${l.productId}|${l.style}|${l.size}|${l.gender}`;
}
