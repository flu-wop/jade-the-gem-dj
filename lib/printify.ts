// lib/printify.ts
// ─────────────────────────────────────────────────────────────
// Printify REST client. Handles order fulfillment after Stripe
// confirms payment. No customer payment happens here — Stripe
// collects the money, Printify only prints & ships.
//
// Env vars (add in Vercel → Settings → Environment Variables):
//   PRINTIFY_API_TOKEN   — Printify → My Account → Connections → API
//   PRINTIFY_SHOP_ID     — run GET /api/printify/products?key=ADMIN to find it
// ─────────────────────────────────────────────────────────────

const BASE = "https://api.printify.com/v1";

function token() {
  return process.env.PRINTIFY_API_TOKEN?.replace(/\s+/g, "");
}
function shopId() {
  return process.env.PRINTIFY_SHOP_ID;
}

/** True only when both env vars are present. The webhook checks this
 *  so the store still takes payment even before Printify is wired. */
export function printifyConfigured(): boolean {
  return !!(token() && shopId());
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      "User-Agent": "jade-the-gem-dj/1.0",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Printify ${res.status} ${path}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string; // ISO-2, e.g. "US"
  region: string; // state code, e.g. "LA"
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

/** Create an order in Printify (draft — not yet in production). */
export async function createOrder(args: {
  externalId: string;
  label: string;
  lineItems: PrintifyLineItem[];
  address: PrintifyAddress;
}): Promise<{ id: string }> {
  return req(`/shops/${shopId()}/orders.json`, {
    method: "POST",
    body: JSON.stringify({
      external_id: args.externalId,
      label: args.label,
      line_items: args.lineItems,
      shipping_method: 1, // 1 = standard
      send_shipping_notification: true,
      address_to: args.address,
    }),
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Push an existing order to production (this is what actually prints it).
 *
 *  A freshly-created Printify order briefly sits in status "pending" while
 *  Printify calculates costs / validates it. Calling send_to_production
 *  before that settles gets rejected with code 8502 ("not allowed to send
 *  order to production with status pending") even though the order was
 *  created successfully — createOrder() and sendToProduction() are called
 *  back-to-back in the webhook with no gap. Retry with backoff on that
 *  specific error instead of giving up after one try. */
export async function sendToProduction(orderId: string): Promise<unknown> {
  const delaysMs = [1500, 3000, 6000, 10000]; // ~20s total across 4 retries
  for (let attempt = 0; attempt <= delaysMs.length; attempt++) {
    try {
      return await req(`/shops/${shopId()}/orders/${orderId}/send_to_production.json`, {
        method: "POST",
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const stillPending = msg.includes("8502") || msg.includes("status pending");
      if (!stillPending || attempt === delaysMs.length) throw e;
      await sleep(delaysMs[attempt]);
    }
  }
  // Unreachable — loop always returns or throws.
  throw new Error("sendToProduction: exhausted retries");
}

// ── Helpers used by the /api/printify/products admin route ──
// They let you read your real product_id + variant_id values directly.

export async function listShops(): Promise<Array<{ id: number; title: string }>> {
  return req(`/shops.json`);
}

export async function listProducts(): Promise<{
  data: Array<{
    id: string;
    title: string;
    variants: Array<{ id: number; title: string; is_enabled: boolean }>;
  }>;
}> {
  return req(`/shops/${shopId()}/products.json`);
}

// ─────────────────────────────────────────────────────────────
// Live storefront catalog — the actual product/merch pages fetch
// this directly instead of reading a hand-maintained static list,
// so colors/sizes/availability always match what's really in
// Printify. Same pattern as the MCS site's lib/printify.ts.
// ─────────────────────────────────────────────────────────────

interface PrintifyImage {
  src: string;
  variant_ids: number[];
  position: string;
  is_default: boolean;
}

interface PrintifyOptionValue {
  id: number;
  title: string;
}

interface PrintifyOption {
  name: string; // e.g. "Colors", "Sizes"
  type: string;
  values: PrintifyOptionValue[];
}

interface PrintifyRawVariant {
  id: number;
  sku: string;
  price: number; // cents
  title: string; // e.g. "White / S"
  is_enabled: boolean;
  is_available: boolean;
  is_default: boolean;
  options: number[]; // option-value ids, positional per product.options
}

interface PrintifyRawProduct {
  id: string;
  title: string;
  description: string;
  options: PrintifyOption[];
  variants: PrintifyRawVariant[];
  images: PrintifyImage[];
  visible: boolean;
}

export interface PrintifyVariantDetail {
  variantId: number;
  productId: string;
  name: string; // e.g. "White / S"
  retailPrice: string; // formatted dollar string, no $ sign, e.g. "36.00"
  sku: string;
  isAvailable: boolean;
  options: { id: string; value: string }[]; // e.g. [{id:'colors',value:'White'},{id:'sizes',value:'S'}]
  imageUrl: string;
  imagesByPosition: Record<string, string>; // e.g. { front: '...', back: '...' }
}

export interface MerchProduct {
  id: string;
  slug: string;
  name: string;
  thumbnailUrl: string;
  price: number; // lowest enabled variant price, dollars
  priceFormatted: string; // "$36.00"
  variants: PrintifyVariantDetail[];
  description: string; // raw HTML from Printify
  inStock: boolean;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(cents: number): { price: number; formatted: string } {
  const price = cents / 100;
  return { price, formatted: `$${price.toFixed(2)}` };
}

function resolveVariantOptions(
  variant: PrintifyRawVariant,
  productOptions: PrintifyOption[]
): { id: string; value: string }[] {
  return productOptions
    .map((opt) => {
      const valueId = variant.options.find((id) =>
        opt.values.some((v) => v.id === id)
      );
      const match = opt.values.find((v) => v.id === valueId);
      if (!match) return null;
      return { id: opt.name.toLowerCase(), value: match.title };
    })
    .filter((o): o is { id: string; value: string } => o !== null);
}

function resolveVariantImage(variantId: number, images: PrintifyImage[]): string {
  const forVariant = images.filter((img) => img.variant_ids.includes(variantId));
  const fallback = images.find((img) => img.is_default) ?? images[0];
  return (forVariant[0] ?? fallback)?.src ?? "";
}

function resolveVariantImagesByPosition(
  variantId: number,
  images: PrintifyImage[]
): Record<string, string> {
  const forVariant = images.filter((img) => img.variant_ids.includes(variantId));
  const byPosition: Record<string, string> = {};
  for (const img of forVariant) {
    if (!byPosition[img.position]) byPosition[img.position] = img.src;
  }
  return byPosition;
}

function enrichVariant(v: PrintifyRawVariant, product: PrintifyRawProduct): PrintifyVariantDetail {
  const { formatted } = formatPrice(v.price);
  return {
    variantId: v.id,
    productId: product.id,
    name: v.title,
    retailPrice: formatted.replace("$", ""),
    sku: v.sku,
    isAvailable: v.is_enabled && v.is_available,
    options: resolveVariantOptions(v, product.options),
    imageUrl: resolveVariantImage(v.id, product.images),
    imagesByPosition: resolveVariantImagesByPosition(v.id, product.images),
  };
}

function enrichProduct(p: PrintifyRawProduct): MerchProduct {
  const slug = toSlug(p.title);
  const enabledVariants = p.variants.filter((v) => v.is_enabled && v.is_available);
  const prices = enabledVariants.map((v) => v.price).filter((n) => !isNaN(n));
  const lowestCents = prices.length > 0 ? Math.min(...prices) : 0;
  const { price, formatted } = formatPrice(lowestCents);
  const defaultImage = p.images.find((img) => img.is_default) ?? p.images[0];

  return {
    id: p.id,
    slug,
    name: p.title,
    thumbnailUrl: defaultImage?.src ?? "",
    price,
    priceFormatted: formatted,
    variants: p.variants.map((v) => enrichVariant(v, p)),
    description: p.description ?? "",
    inStock: p.variants.some((v) => v.is_enabled && v.is_available),
  };
}

async function pfGetCached(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "User-Agent": "jade-the-gem-dj/1.0",
    },
    next: { revalidate: 3600 }, // ISR — re-fetch at most once an hour
  });
  if (!res.ok) throw new Error(`Printify GET ${path} failed: ${res.status}`);
  return res.json();
}

// The Printify shop (27644500 / jadehiddengems) has old test products,
// duplicates, and at least one other brand's item sitting in it, all
// marked visible — Printify's own "visible" flag isn't a reliable filter
// here. This is the explicit, permanent list of the 4 real storefront
// products, keyed by Printify's own product id (never changes, unlike
// titles). getProduct() enforces this too, not just getProducts() — the
// checkout route calls getProduct() with a client-supplied product id,
// so without this an arbitrary product id from the same Printify account
// (including other brands' items) could be checked out through Jade's
// store. Ask Jade to clean up/unpublish the extras in the Printify
// dashboard when she gets a chance; this list is the safety net either way.
const STOREFRONT_PRODUCT_IDS = new Set([
  "6a71305259aeae90dd0d21a3", // HIDDEN GEM AIR BRUSH (replaces 6a402761b38ebb906e0692b5, deleted from Printify Aug 2026)
  "6a145e8298c5cbc2170dcf1a", // HIDDEN GEM TEE (replaces 6a1535ec69e138f54905134e, deleted from Printify Aug 2026)
  "6a145e8598c5cbc2170dcf1b", // HIDDEN VINTAGE TRUCKER
  "6a41717777569fc62a0efa06", // HIDDEN POSTER
]);

/** Full live storefront catalog — visible products only. */
export async function getProducts(): Promise<MerchProduct[]> {
  const data = await pfGetCached(`/shops/${shopId()}/products.json?limit=50`);
  const raw: PrintifyRawProduct[] = data.data ?? [];
  return raw
    .filter((p) => p.visible && STOREFRONT_PRODUCT_IDS.has(p.id))
    .map(enrichProduct);
}

/** One product by Printify product id, with full variant detail. */
export async function getProduct(id: string): Promise<MerchProduct | null> {
  if (!STOREFRONT_PRODUCT_IDS.has(id)) return null;
  try {
    const raw: PrintifyRawProduct = await pfGetCached(`/shops/${shopId()}/products/${id}.json`);
    return enrichProduct(raw);
  } catch {
    return null;
  }
}
