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
      items TEXT NOT NULL,            -- JSON array of cart lines
      amount_cents INTEGER NOT NULL,
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
}
