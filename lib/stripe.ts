import Stripe from "stripe";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });
  return _stripe;
}
export const stripe = new Proxy({} as Stripe, {
  get: (_, prop) => getStripe()[prop as keyof Stripe],
});

export const RATE = 150;
export const MIN_HOURS = 2;

export const PLAYLIST_TIERS = [
  { id: "vibe-check",      name: "Vibe Check",      price: 35,  songs: "20–25 songs" },
  { id: "full-experience", name: "Full Experience", price: 65,  songs: "40–50 songs" },
  { id: "event-package",   name: "Event Package",   price: 125, songs: "3 playlists (open, peak, close)" },
] as const;

export function findPlaylistTier(id: string) {
  return PLAYLIST_TIERS.find((t) => t.id === id);
}

// ── Merch Build (Jade's productized merch-store design service) ──
// Base fee covers store setup/Printify listing work (fixed per project);
// per-item fee covers design time and scales with catalog size — true
// sliding scale, not fixed presets, so any item count in range works.
export const MERCH_BUILD_BASE = 275;
export const MERCH_BUILD_PER_ITEM = 55;
export const MERCH_BUILD_REVISION_ROUND_PRICE = 40;
export const MERCH_BUILD_MIN_ITEMS = 3;
export const MERCH_BUILD_MAX_ITEMS = 12;

// Labels are descriptive only (shown on the slider + stored for admin
// readability) — they don't gate pricing, which is computed continuously.
export function merchBuildTierLabel(itemCount: number): string {
  if (itemCount <= 4) return "Capsule";
  if (itemCount <= 7) return "Full Line";
  return "Brand Package";
}

export function calculateMerchBuildTotal(itemCount: number) {
  const clamped = Math.min(MERCH_BUILD_MAX_ITEMS, Math.max(MERCH_BUILD_MIN_ITEMS, itemCount));
  const perItemTotal = clamped * MERCH_BUILD_PER_ITEM;
  const total = MERCH_BUILD_BASE + perItemTotal;
  return { itemCount: clamped, base: MERCH_BUILD_BASE, perItemTotal, total };
}

export function calculateBookingTotal(hours: number, code?: string) {
  const subtotal = hours * RATE;
  const discountApplied = code?.toUpperCase() === "HIDDEN50";
  const discount = discountApplied ? hours * 50 : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total, discountApplied };
}

export function calculatePlaylistTotal(price: number, code?: string) {
  const discountApplied = code?.toUpperCase() === "PLAY30";
  const discount = discountApplied ? Math.round(price * 0.3 * 100) / 100 : 0;
  const total = price - discount;
  return { subtotal: price, discount, total, discountApplied };
}