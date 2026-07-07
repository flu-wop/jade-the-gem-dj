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

/** Push an existing order to production (this is what actually prints it). */
export async function sendToProduction(orderId: string): Promise<unknown> {
  return req(`/shops/${shopId()}/orders/${orderId}/send_to_production.json`, {
    method: "POST",
  });
}

// ── Helpers used by the /api/printify/products admin route ──
// They let you read your real product_id + variant_id values so you
// can fill them into lib/merch.ts → PRINTIFY_VARIANTS.

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
