import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";
import { db, initDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { fulfillEventTicket } from "@/lib/ticket-fulfillment";

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!session || session !== sessionToken()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await initDb();
  const pending = (await db.execute(
    `SELECT stripe_session_id, event_title FROM event_tickets WHERE status = 'pending' AND stripe_session_id IS NOT NULL`
  )).rows as unknown as { stripe_session_id: string; event_title: string }[];

  const results: { sessionId: string; eventTitle: string; result: string }[] = [];

  for (const row of pending) {
    const sessionId = row.stripe_session_id;
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      if (stripeSession.payment_status !== "paid") {
        results.push({ sessionId, eventTitle: row.event_title, result: `not paid (${stripeSession.payment_status})` });
        continue;
      }
      const fulfillment = await fulfillEventTicket(sessionId);
      results.push({
        sessionId,
        eventTitle: row.event_title,
        result: fulfillment.ok ? "fulfilled" : `skipped (${fulfillment.reason})`,
      });
    } catch (err) {
      results.push({ sessionId, eventTitle: row.event_title, result: `error: ${(err as Error).message}` });
    }
  }

  const fulfilledCount = results.filter((r) => r.result === "fulfilled").length;
  return NextResponse.json({ checked: pending.length, fulfilled: fulfilledCount, results });
}
