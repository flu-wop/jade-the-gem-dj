import { NextRequest, NextResponse } from "next/server";
import {
  stripe,
  calculateMerchBuildTotal,
  merchBuildTierLabel,
  MERCH_BUILD_MIN_ITEMS,
  MERCH_BUILD_MAX_ITEMS,
} from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { itemCount } = await req.json();
    const count = Number(itemCount);
    if (!Number.isInteger(count) || count < MERCH_BUILD_MIN_ITEMS || count > MERCH_BUILD_MAX_ITEMS) {
      return NextResponse.json({ error: "Invalid item count" }, { status: 400 });
    }

    const { total } = calculateMerchBuildTotal(count);
    const tierLabel = merchBuildTierLabel(count);
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
              name: `Merch Store Build — ${tierLabel}`,
              description: `${count} products, designed and built by Hidden Gem`,
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "merch-build",
        tier: tierLabel,
        itemCount: String(count),
      },
      success_url: `${siteUrl}/merch-build/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/merch-build`,
    });

    await initDb();
    await db.execute({
      sql: `INSERT INTO merch_build_orders (tier, item_count, amount_cents, stripe_session_id, status) VALUES (?,?,?,?, 'pending')`,
      args: [tierLabel, count, amountCents, session.id],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
