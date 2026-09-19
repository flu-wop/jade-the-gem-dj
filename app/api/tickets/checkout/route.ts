import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { getEvents } from "@/lib/data";

const MAX_QUANTITY = 5;

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`ticket-checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { eventId, quantity: rawQuantity } = await req.json();
    // Clamp/validate rather than trust the client: 1–5, whole number.
    const quantity = Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(rawQuantity) || 1)));

    const { upcoming } = await getEvents();
    const event = upcoming.find((e) => e.id === eventId);
    if (!event || !event.ticketPrice) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    await initDb();

    if (typeof event.ticketCapacity === "number") {
      const r = await db.execute({
        sql: "SELECT COALESCE(SUM(quantity), 0) AS total FROM event_tickets WHERE event_id = ? AND status = 'paid'",
        args: [event.id],
      });
      const sold = Number(r.rows[0]?.total ?? 0);
      const remaining = event.ticketCapacity - sold;
      if (remaining <= 0) {
        return NextResponse.json({ error: "This event is sold out." }, { status: 409 });
      }
      if (quantity > remaining) {
        return NextResponse.json(
          { error: `Only ${remaining} ticket${remaining === 1 ? "" : "s"} left for this event.` },
          { status: 409 }
        );
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const unitAmountCents = Math.round(event.ticketPrice * 100);

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
            unit_amount: unitAmountCents,
          },
          quantity,
        },
      ],
      metadata: {
        kind: "event-ticket",
        eventId: event.id,
        eventTitle: event.title,
        quantity: String(quantity),
      },
      success_url: `${siteUrl}/events/ticket-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/events`,
    });

    await db.execute({
      sql: `INSERT INTO event_tickets (event_id, event_title, amount_cents, quantity, stripe_session_id, status)
            VALUES (?, ?, ?, ?, ?, 'pending')`,
      args: [event.id, event.title, unitAmountCents * quantity, quantity, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
