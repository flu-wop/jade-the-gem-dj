import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { db, initDb } from "@/lib/db";

type TrackInput = {
  id?: string;
  title: string;
  embedSrc: string;
  isFeatured?: boolean;
  sortOrder?: number;
};

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const body = (await req.json()) as TrackInput;
  if (!body.title || !body.embedSrc) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const id = body.id || `t-${Date.now()}`;
  const countRow = await db.execute(`SELECT COUNT(*) AS n FROM tracks`);
  const sortOrder = body.sortOrder ?? Number(countRow.rows[0]?.n ?? 0);
  await db.execute({
    sql: `INSERT INTO tracks (id, title, embed_src, is_featured, sort_order) VALUES (?, ?, ?, ?, ?)`,
    args: [id, body.title, body.embedSrc, body.isFeatured ? 1 : 0, sortOrder],
  });
  return NextResponse.json({ id });
}

export async function PATCH(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const body = (await req.json()) as TrackInput;
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.execute({
    sql: `UPDATE tracks SET title=?, embed_src=?, is_featured=?, sort_order=? WHERE id=?`,
    args: [body.title, body.embedSrc, body.isFeatured ? 1 : 0, body.sortOrder ?? 0, body.id],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const { id } = (await req.json()) as { id: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.execute({ sql: `DELETE FROM tracks WHERE id = ?`, args: [id] });
  return NextResponse.json({ ok: true });
}
