import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, initDb } from "@/lib/db";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";

async function isAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    eventId?: string; eventTitle?: string; name?: string; email?: string;
    phone?: string; guests?: number; message?: string; createdAt?: string;
  };
  if (!body.eventId || !body.eventTitle || !body.name || !body.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await initDb();
  await db.execute({
    sql: `INSERT INTO rsvps (event_id, event_title, name, email, phone, guests, message, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))`,
    args: [
      body.eventId, body.eventTitle, body.name, body.email,
      body.phone || null, body.guests || 1, body.message || null, body.createdAt || null,
    ],
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = (await req.json().catch(() => ({}))) as { id?: number | string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await initDb();
  await db.execute({ sql: "DELETE FROM rsvps WHERE id = ?", args: [id] });

  return NextResponse.json({ ok: true });
}
