import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { initDb, getSetting, setSetting } from "@/lib/db";

const ALLOWED_KEYS = new Set(["hero_video_url"]);

export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const { key, value } = (await req.json()) as { key: string; value: string };
  if (!ALLOWED_KEYS.has(key)) return NextResponse.json({ error: "Unknown setting" }, { status: 400 });
  await setSetting(key, value);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const key = new URL(req.url).searchParams.get("key") || "";
  if (!ALLOWED_KEYS.has(key)) return NextResponse.json({ error: "Unknown setting" }, { status: 400 });
  const value = await getSetting(key);
  return NextResponse.json({ value });
}
