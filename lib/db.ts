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
    CREATE TABLE IF NOT EXISTS rsvps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      guests INTEGER DEFAULT 1,
      message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  // Newsletter-engine migration (Aug 2026): renamed from `newsletter` to
  // `newsletter_subscribers` + added unsubscribed_at, to match the Epoch
  // Skin standard schema. Safe to run repeatedly — the rename only succeeds
  // once (old table gone after), everything else is idempotent.
  try {
    await db.execute(`ALTER TABLE newsletter RENAME TO newsletter_subscribers`);
  } catch {
    // already renamed, or this is a fresh DB that never had `newsletter` — fine
  }
  await db.execute(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  try {
    await db.execute(`ALTER TABLE newsletter_subscribers ADD COLUMN unsubscribed_at TEXT`);
  } catch {
    // already exists — fine
  }
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
    CREATE TABLE IF NOT EXISTS event_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      name TEXT,
      email TEXT,
      phone TEXT,
      amount_cents INTEGER NOT NULL,
      stripe_session_id TEXT,
      status TEXT DEFAULT 'pending',  -- pending | paid
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

  // ── Content tables (Sep 2026): events, tracks, and hero video are now
  // admin-editable instead of hardcoded in lib/data.ts. `date` on events
  // decides upcoming vs. past automatically — no manual flag to maintain.
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT NOT NULL,           -- ISO YYYY-MM-DD
      time TEXT,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      flyer_url TEXT NOT NULL,
      ticket_link TEXT,
      rsvp_required INTEGER DEFAULT 0,
      rsvp_capacity INTEGER,
      ticket_price INTEGER,
      ticket_capacity INTEGER,
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tracks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      embed_src TEXT NOT NULL,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  // One-time seed: if events/tracks are still empty, carry over what was
  // previously hardcoded in lib/data.ts so the migration doesn't lose data.
  // Safe to run repeatedly — it only fires while the tables are empty.
  const eventCount = await db.execute(`SELECT COUNT(*) AS n FROM events`);
  if (Number(eventCount.rows[0]?.n ?? 0) === 0) {
    const { pastEvents, upcomingEvents } = await import("./data");
    for (const e of [...upcomingEvents, ...pastEvents]) {
      await db.execute({
        sql: `INSERT INTO events (id, title, date, time, venue, city, state, flyer_url, ticket_link, rsvp_required, rsvp_capacity, ticket_price, ticket_capacity)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          e.id, e.title, e.date, e.time ?? null, e.venue, e.city, e.state,
          e.flyerImage, e.ticketLink ?? null,
          e.rsvpRequired ? 1 : 0, e.rsvpCapacity ?? null,
          // Seed source (lib/data.ts) stores ticketPrice in whole dollars;
          // the DB column is cents, matching every other amount_cents
          // column in the app.
          e.ticketPrice != null ? Math.round(e.ticketPrice * 100) : null,
          e.ticketCapacity ?? null,
        ],
      });
    }
  }
  const trackCount = await db.execute(`SELECT COUNT(*) AS n FROM tracks`);
  if (Number(trackCount.rows[0]?.n ?? 0) === 0) {
    const { tracks: seedTracks } = await import("./data");
    for (let i = 0; i < seedTracks.length; i++) {
      const t = seedTracks[i];
      await db.execute({
        sql: `INSERT INTO tracks (id, title, embed_src, is_featured, sort_order) VALUES (?, ?, ?, ?, ?)`,
        args: [t.id, t.title, t.embedSrc, t.visual ? 1 : 0, i],
      });
    }
  }
}

// ── Content helpers ──────────────────────────────────────────

export interface DbEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  venue: string;
  city: string;
  state: string;
  flyer_url: string;
  ticket_link: string | null;
  rsvp_required: number;
  rsvp_capacity: number | null;
  ticket_price: number | null;
  ticket_capacity: number | null;
  featured: number;
}

export async function getAllEvents(): Promise<DbEvent[]> {
  const r = await db.execute(`SELECT * FROM events ORDER BY date DESC`);
  return r.rows as unknown as DbEvent[];
}

export interface DbTrack {
  id: string;
  title: string;
  embed_src: string;
  is_featured: number;
  sort_order: number;
}

export async function getAllTracks(): Promise<DbTrack[]> {
  const r = await db.execute(`SELECT * FROM tracks ORDER BY sort_order ASC`);
  return r.rows as unknown as DbTrack[];
}

export async function getSetting(key: string): Promise<string | null> {
  // initDb() is idempotent (CREATE TABLE IF NOT EXISTS) and cheap once the
  // schema exists, so it's safe to call on every read. Without this,
  // getSetting() called in parallel with getEvents()/getTracks() (which do
  // call initDb() themselves) can race ahead of table creation on a cold
  // start and throw "no such table: site_settings".
  await initDb();
  const r = await db.execute({ sql: `SELECT value FROM site_settings WHERE key = ?`, args: [key] });
  return (r.rows[0]?.value as string | undefined) ?? null;
}

export async function setSetting(key: string, value: string) {
  await initDb();
  await db.execute({
    sql: `INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    args: [key, value],
  });
}
