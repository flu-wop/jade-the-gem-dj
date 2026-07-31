import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, initDb } from "@/lib/db";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";

async function isAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
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
