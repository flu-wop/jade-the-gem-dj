import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";
import { db, initDb } from "@/lib/db";
import { sendToProduction, findOrderByExternalId, printifyConfigured } from "@/lib/printify";

// Retries send_to_production for merch orders stuck in fulfill_failed —
// e.g. from the transient "order still pending" rejection Printify returns
// right after createOrder(). Safe to re-run: never creates a new Printify
// order, only pushes an existing one to production.
export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!session || session !== sessionToken()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!printifyConfigured()) {
    return NextResponse.json({ error: "Printify not configured" }, { status: 400 });
  }

  await initDb();
  const rows = (await db.execute(
    `SELECT stripe_session_id, printify_order_id FROM merch_orders WHERE status = 'fulfill_failed'`
  )).rows as unknown as { stripe_session_id: string; printify_order_id: string | null }[];

  const results: { sessionId: string; result: string }[] = [];

  for (const row of rows) {
    const sessionId = row.stripe_session_id;
    try {
      let orderId = row.printify_order_id;
      // Older failed rows (before this webhook persisted the id on failure)
      // won't have printify_order_id saved — recover it via external_id.
      if (!orderId) {
        const match = await findOrderByExternalId(sessionId);
        if (!match) {
          results.push({ sessionId, result: "no matching Printify order found" });
          continue;
        }
        orderId = match.id;
        await db.execute({
          sql: `UPDATE merch_orders SET printify_order_id=? WHERE stripe_session_id=?`,
          args: [orderId, sessionId],
        });
      }
      await sendToProduction(orderId);
      await db.execute({
        sql: `UPDATE merch_orders SET status='fulfilled', printify_order_id=? WHERE stripe_session_id=?`,
        args: [orderId, sessionId],
      });
      results.push({ sessionId, result: `fulfilled (${orderId})` });
    } catch (err) {
      results.push({ sessionId, result: `error: ${(err as Error).message}` });
    }
  }

  const fulfilledCount = results.filter((r) => r.result.startsWith("fulfilled")).length;
  return NextResponse.json({ checked: rows.length, fulfilled: fulfilledCount, results });
}
