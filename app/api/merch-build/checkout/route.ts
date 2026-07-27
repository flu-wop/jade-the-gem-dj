import { NextRequest, NextResponse } from "next/server";
import { stripe, findMerchBuildTier, calculateMerchBuildTotal } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { tierId } = await req.json();
    const tier = findMerchBuildTier(tierId);
    if (!tier) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

    const { total } = calculateMerchBuildTotal(tier.itemCount);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const amountCents = Math.round(total * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Merch Store Build — ${tier.name}`,
              description: `${tier.itemCount} products, designed and built by Hidden Gem`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "merch-build",
        tier: tier.name,
        itemCount: String(tier.itemCount),
      },
      success_url: `${siteUrl}/merch-build/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/merch-build`,
    });

    await initDb();
    await db.execute({
      sql: `INSERT INTO merch_build_orders (tier, item_count, amount_cents, stripe_session_id, status) VALUES (?,?,?,?, 'pending')`,
      args: [tier.name, tier.itemCount, amountCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
