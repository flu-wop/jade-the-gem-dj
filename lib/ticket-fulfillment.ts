import { db, initDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendTicketEmails } from "@/lib/resend";
import { upcomingEvents } from "@/lib/data";
import { privateAddressForEvent } from "@/lib/addresses";

/**
 * Marks an event ticket paid and sends the confirmation email, given a
 * Stripe checkout session ID. Safe to call more than once (idempotent —
 * only fires for rows still in 'pending') and safe to call for a session
 * whose DB row is missing (rebuilds it from Stripe's own session data).
 * Does NOT check payment status itself — callers must confirm the session
 * is actually paid before calling this.
 */
export async function fulfillEventTicket(sessionId: string): Promise<{ ok: boolean; reason?: string }> {
  await initDb();

  let row = (await db.execute({
    sql: `SELECT * FROM event_tickets WHERE stripe_session_id=?`,
    args: [sessionId],
  })).rows[0] as Record<string, unknown> | undefined;

  const full = await stripe.checkout.sessions.retrieve(sessionId);

  if (!row) {
    console.error("event_tickets row not found for", sessionId, "— reconstructing from Stripe session");
    const meta = full.metadata || {};
    await db.execute({
      sql: `INSERT INTO event_tickets (event_id, event_title, amount_cents, stripe_session_id, status)
            VALUES (?, ?, ?, ?, 'pending')`,
      args: [meta.eventId || "", meta.eventTitle || "", full.amount_total ?? 0, sessionId],
    });
    row = (await db.execute({
      sql: `SELECT * FROM event_tickets WHERE stripe_session_id=?`,
      args: [sessionId],
    })).rows[0] as Record<string, unknown> | undefined;
    if (!row) return { ok: false, reason: "reconstruction failed" };
  }

  if (row.status !== "pending") return { ok: false, reason: `already ${row.status}` };

  const cust = full.customer_details;
  const name = cust?.name || "Guest";
  const email = cust?.email || "";
  const phone = full.customer_details?.phone || "";
  const amount = (full.amount_total ?? Number(row.amount_cents)) / 100;
  const eventId = String(row.event_id || "");
  const eventTitle = String(row.event_title || "");
  const event = upcomingEvents.find((e) => e.id === eventId);

  await db.execute({
    sql: `UPDATE event_tickets SET status='paid', name=?, email=?, phone=? WHERE stripe_session_id=?`,
    args: [name, email, phone, sessionId],
  });

  try {
    const address = privateAddressForEvent(eventId);
    const where = address
      ? `${address}${event?.city ? `, ${event.city}, ${event.state}` : ""}`
      : "We'll send the exact address separately before the event.";

    await sendTicketEmails({
      eventTitle, name, email, phone, amount, where,
      date: event?.date || "",
      time: event?.time,
    });
  } catch (e) {
    console.error("Ticket email error:", e);
    return { ok: true, reason: "fulfilled but confirmation email failed" };
  }

  return { ok: true };
}
