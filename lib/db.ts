import { createClient } from "@libsql/client";

let _db: ReturnType<typeof createClient> | null = null;
export function getDb() {
  if (!_db) _db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  return _db;
}
export const db = new Proxy({} as ReturnType<typeof createClient>, {
  get: (_, prop) => {
    const client = getDb();
    const val = client[prop as keyof ReturnType<typeof createClient>];
    return typeof val === "function" ? (val as (...a: unknown[]) => unknown).bind(client) : val;
  },
});

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      event_date TEXT NOT NULL,
      event_type TEXT NOT NULL,
      hours INTEGER NOT NULL,
      location TEXT NOT NULL,
      message TEXT,
      discount_code TEXT,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS merch_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone TEXT,
      items TEXT NOT NULL,            -- JSON array of cart lines (pre-discount prices)
      discount_code TEXT,
      shipping_cents INTEGER DEFAULT 0,
      amount_cents INTEGER NOT NULL,  -- full charged total: discounted items + shipping
      stripe_session_id TEXT,
      printify_order_id TEXT,
      shipping_json TEXT,             -- JSON of the shipping address
      status TEXT DEFAULT 'pending',  -- pending | paid | fulfilled | fulfill_failed
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS playlist_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tier TEXT NOT NULL,
      name TEXT,
      email TEXT,
      discount_code TEXT,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      status TEXT DEFAULT 'pending',  -- pending | paid
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS merch_build_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tier TEXT NOT NULL,
      item_count INTEGER NOT NULL,
      name TEXT,
      email TEXT,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      status TEXT DEFAULT 'pending',  -- pending | paid
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  // discount_code was added to the CREATE TABLE above after playlist_orders
  // already existed in production — CREATE TABLE IF NOT EXISTS is a no-op on
  // an existing table, so the column never actually landed there. This
  // ALTER TABLE is the real fix; the checkout route always inserts into
  // discount_code (even as an empty string), so without this every playlist
  // purchase fails with "no such column: discount_code" before the customer
  // ever reaches Stripe checkout.
  try {
    await db.execute(`ALTER TABLE playlist_orders ADD COLUMN discount_code TEXT`);
  } catch {
    // Column already exists — fine.
  }
  // Same story as above: merch_orders already exists in production, so
  // CREATE TABLE IF NOT EXISTS won't add these new columns on its own.
  try {
    await db.execute(`ALTER TABLE merch_orders ADD COLUMN discount_code TEXT`);
  } catch {
    // Column already exists — fine.
  }
  try {
    await db.execute(`ALTER TABLE merch_orders ADD COLUMN shipping_cents INTEGER DEFAULT 0`);
  } catch {
    // Column already exists — fine.
  }
}
