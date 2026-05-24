import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateBookingTotal } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, eventDate, eventType, hours, location, message, discountCode } = body;
    if (!name || !email || !eventDate || !eventType || !hours || !location)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const { total } = calculateBookingTotal(hours, discountCode);
    const totalCents = Math.round(total * 100);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `DJ Jade the Gem — ${eventType}`,
            description: `${hours} hours · ${eventDate} · ${location}`,
          },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      metadata: { name, email, phone: phone ?? "", eventDate, eventType, hours: String(hours), location, message: message ?? "", discountCode: discountCode ?? "" },
      success_url: `${siteUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/bookings`,
    });

    await initDb();
    await db.execute({
      sql: `INSERT INTO bookings (name,email,phone,event_date,event_type,hours,location,message,discount_code,amount_cents,stripe_session_id,status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending')`,
      args: [name, email, phone ?? "", eventDate, eventType, hours, location, message ?? "", discountCode ?? "", totalCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
