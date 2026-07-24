import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateBookingTotal } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cap = (s: string, n: number) => s.slice(0, n);

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body = await req.json();
    const { name, email, phone, eventDate, eventType, hours, location, message, discountCode } = body;
    if (!name || !email || !eventDate || !eventType || !hours || !location)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (typeof email !== "string" || !EMAIL_RE.test(email))
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    if (isNaN(Date.parse(eventDate)))
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    if (!Number.isFinite(Number(hours)) || Number(hours) <= 0 || Number(hours) > 24)
      return NextResponse.json({ error: "Invalid hours" }, { status: 400 });

    const safeName = cap(String(name), 100);
    const safePhone = cap(String(phone ?? ""), 30);
    const safeLocation = cap(String(location), 200);
    const safeMessage = cap(String(message ?? ""), 1000);
    const safeEventType = cap(String(eventType), 100);

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
            name: `DJ Jade the Gem — ${safeEventType}`,
            description: `${hours} hours · ${eventDate} · ${safeLocation}`,
          },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      metadata: { name: safeName, email, phone: safePhone, eventDate, eventType: safeEventType, hours: String(hours), location: safeLocation, message: safeMessage, discountCode: discountCode ?? "" },
      success_url: `${siteUrl}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/bookings`,
    });

    await initDb();
    await db.execute({
      sql: `INSERT INTO bookings (name,email,phone,event_date,event_type,hours,location,message,discount_code,amount_cents,stripe_session_id,status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending')`,
      args: [safeName, email, safePhone, eventDate, safeEventType, hours, safeLocation, safeMessage, discountCode ?? "", totalCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
