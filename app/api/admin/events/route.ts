import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin-auth";
import { db, initDb } from "@/lib/db";

type EventInput = {
  id?: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  city: string;
  state: string;
  flyerUrl: string;
  ticketLink?: string;
  rsvpRequired?: boolean;
  rsvpCapacity?: number | null;
  ticketPrice?: number | null;
  ticketCapacity?: number | null;
  featured?: boolean;
};

function slugify(title: string, date: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${date}`;
}

export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const body = (await req.json()) as EventInput;
  if (!body.title || !body.date || !body.venue || !body.city || !body.state || !body.flyerUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const id = body.id || slugify(body.title, body.date);
  await db.execute({
    sql: `INSERT INTO events (id, title, date, time, venue, city, state, flyer_url, ticket_link, rsvp_required, rsvp_capacity, ticket_price, ticket_capacity, featured)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, body.title, body.date, body.time ?? null, body.venue, body.city, body.state,
      body.flyerUrl, body.ticketLink ?? null,
      body.rsvpRequired ? 1 : 0, body.rsvpCapacity ?? null,
      body.ticketPrice ?? null, body.ticketCapacity ?? null, body.featured ? 1 : 0,
    ],
  });
  return NextResponse.json({ id });
}

export async function PATCH(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const body = (await req.json()) as EventInput;
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.execute({
    sql: `UPDATE events SET title=?, date=?, time=?, venue=?, city=?, state=?, flyer_url=?, ticket_link=?, rsvp_required=?, rsvp_capacity=?, ticket_price=?, ticket_capacity=?, featured=?
          WHERE id=?`,
    args: [
      body.title, body.date, body.time ?? null, body.venue, body.city, body.state,
      body.flyerUrl, body.ticketLink ?? null,
      body.rsvpRequired ? 1 : 0, body.rsvpCapacity ?? null,
      body.ticketPrice ?? null, body.ticketCapacity ?? null, body.featured ? 1 : 0,
      body.id,
    ],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await initDb();
  const { id } = (await req.json()) as { id: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await db.execute({ sql: `DELETE FROM events WHERE id = ?`, args: [id] });
  return NextResponse.json({ ok: true });
}
