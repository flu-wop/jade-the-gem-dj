import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { sendRsvpEmails } from "@/lib/resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`rsvp:${clientIp(req)}`, 5, 600); // 5 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const eventId = typeof body.eventId === "string" ? body.eventId.slice(0, 64) : "";
    const eventTitle = typeof body.eventTitle === "string" ? body.eventTitle.slice(0, 200) : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const email = typeof body.email === "string" ? body.email.trim().slice(0, 200) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 40) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : "";
    let guests = Number(body.guests);
    if (!Number.isFinite(guests) || guests < 1) guests = 1;
    guests = Math.min(Math.floor(guests), 10);

    if (!eventId || !eventTitle)
      return NextResponse.json({ error: "Missing event" }, { status: 400 });
    if (!name)
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!email || !EMAIL_RE.test(email))
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });

    await initDb();
    await db.execute({
      sql: `INSERT INTO rsvps (event_id, event_title, name, email, phone, guests, message)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [eventId, eventTitle, name, email, phone || null, guests, message || null],
    });

    try {
      await sendRsvpEmails({ eventTitle, name, email, phone, guests, message });
    } catch (emailErr) {
      // RSVP is saved even if email delivery fails
      console.error("RSVP email error:", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
