import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendBookingConfirmation } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};
    await db.execute({ sql: `UPDATE bookings SET status='confirmed' WHERE stripe_session_id=?`, args: [session.id] });
    try {
      await sendBookingConfirmation({
        name: meta.name, email: meta.email, eventDate: meta.eventDate,
        eventType: meta.eventType, hours: parseInt(meta.hours),
        location: meta.location, total: (session.amount_total ?? 0) / 100,
        discountCode: meta.discountCode || undefined,
      });
    } catch (e) { console.error("Email error:", e); }
  }

  return NextResponse.json({ received: true });
}
