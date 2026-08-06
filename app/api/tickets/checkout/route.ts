import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { upcomingEvents } from "@/lib/data";

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`ticket-checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { eventId } = await req.json();
    const event = upcomingEvents.find((e) => e.id === eventId);
    if (!event || !event.ticketPrice) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await initDb();

    if (typeof event.ticketCapacity === "number") {
      const r = await db.execute({
        sql: "SELECT COUNT(*) AS total FROM event_tickets WHERE event_id = ? AND status = 'paid'",
        args: [event.id],
      });
      const sold = Number(r.rows[0]?.total ?? 0);
      if (sold >= event.ticketCapacity) {
        return NextResponse.json({ error: "This event is sold out." }, { status: 409 });
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const amountCents = Math.round(event.ticketPrice * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      phone_number_collection: { enabled: true },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${event.title} — Ticket`,
              description: `${event.date}${event.time ? ` · ${event.time}` : ""} · ${event.venue}, ${event.city}, ${event.state}`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "event-ticket",
        eventId: event.id,
        eventTitle: event.title,
      },
      success_url: `${siteUrl}/events/ticket-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/events`,
    });

    await db.execute({
      sql: `INSERT INTO event_tickets (event_id, event_title, amount_cents, stripe_session_id, status)
            VALUES (?, ?, ?, ?, 'pending')`,
      args: [event.id, event.title, amountCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
