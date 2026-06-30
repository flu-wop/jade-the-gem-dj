import { NextRequest, NextResponse } from "next/server";
import { stripe, findPlaylistTier } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { tierId } = await req.json();
    const tier = findPlaylistTier(tierId);
    if (!tier) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const amountCents = tier.price * 100;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      allow_promotion_codes: true, // lets PLAY30 be entered right on Stripe's checkout page
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hidden Gem Playlist — ${tier.name}`,
              description: tier.songs,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: { kind: "playlist", tier: tier.name, songs: tier.songs },
      success_url: `${siteUrl}/playlist/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/bookings`,
    });

    await initDb();
    await db.execute({
      sql: `INSERT INTO playlist_orders (tier, amount_cents, stripe_session_id, status) VALUES (?,?,?, 'pending')`,
      args: [tier.name, amountCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
