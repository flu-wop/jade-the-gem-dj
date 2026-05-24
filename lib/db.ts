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
  get: (_, prop) => getDb()[prop as keyof ReturnType<typeof createClient>],
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
}
