import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, initDb } from "@/lib/db";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";

async function isAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
}

// Whitelist — never interpolate a client-supplied table name directly into SQL.
const TABLES = {
  merch: "merch_orders",
  playlist: "playlist_orders",
  "merch-build": "merch_build_orders",
  tickets: "event_tickets",
} as const;
type TableKey = keyof typeof TABLES;

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    table?: TableKey; id?: number | string; clearPending?: boolean;
  };
  const table = body.table ? TABLES[body.table] : undefined;
  if (!table) return NextResponse.json({ error: "Unknown table" }, { status: 400 });

  await initDb();

  if (body.clearPending) {
    // Only sweep rows old enough to be genuinely abandoned — a buyer can
    // legitimately take a few minutes on Stripe's checkout page, and
    // deleting that row out from under them means the webhook later can't
    // find it and the sale gets silently lost.
    await db.execute(`DELETE FROM ${table} WHERE status = 'pending' AND created_at < datetime('now', '-20 minutes')`);
    return NextResponse.json({ ok: true });
  }

  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.execute({ sql: `DELETE FROM ${table} WHERE id = ?`, args: [body.id] });
  return NextResponse.json({ ok: true });
}
