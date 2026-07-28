import { NextRequest, NextResponse } from "next/server";
import { stripe, MERCH_SHIPPING_FLAT_CENTS, calculateMerchDiscount } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { findProduct, priceFor, type CartLine } from "@/lib/merch";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const ok = await rateLimit(`checkout:${clientIp(req)}`, 10, 600); // 10 per 10 min
    if (!ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { items, code } = (await req.json()) as { items: CartLine[]; code?: string };
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // Re-validate every line against the catalog. Never trust client prices.
    const validated: CartLine[] = [];
    for (const l of items) {
      const product = findProduct(l.productId);
      if (!product) return NextResponse.json({ error: `Unknown product: ${l.productId}` }, { status: 400 });
      const styleOpt = product.styles.find((s) => s.label === l.style);
      if (!styleOpt) return NextResponse.json({ error: `Invalid style for ${product.name}` }, { status: 400 });
      if (!styleOpt.forGenders.includes(l.gender) || !styleOpt.sizes.includes(l.size))
        return NextResponse.json({ error: `Invalid option for ${product.name}` }, { status: 400 });
      const qty = Math.max(1, Math.floor(Number(l.qty) || 1));
      validated.push({
        productId: product.id,
        name: product.name,
        style: l.style,
        size: l.size,
        gender: l.gender,
        qty,
        price: priceFor(product, l.style, l.size), // authoritative price — includes size modifier
        image: product.mockups[0],
      });
    }

    // Discount applies to item cost only — computed server-side, never
    // trust a client-sent discount amount. Same pattern as HIDDEN50/PLAY30.
    const rawSubtotal = validated.reduce((s, l) => s + l.price * l.qty, 0);
    const { discount, discountApplied } = calculateMerchDiscount(rawSubtotal, code);
    const discountRate = discountApplied ? 0.8 : 1;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Apply the discount per line item so Stripe's displayed prices match
    // what the customer actually pays per unit, not just a lump discount.
    const lineItemsWithAmounts = validated.map((l) => ({
      line: l,
      unitAmount: Math.round(l.price * 100 * discountRate),
    }));
    const itemSubtotalCents = lineItemsWithAmounts.reduce(
      (s, x) => s + x.unitAmount * x.line.qty,
      0
    );
    const amountCents = itemSubtotalCents + MERCH_SHIPPING_FLAT_CENTS;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItemsWithAmounts.map(({ line: l, unitAmount }) => ({
        quantity: l.qty,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: `${l.name} — ${l.style}`,
            description: `${l.gender} · Size ${l.size}`,
            images: [`${siteUrl}${l.image}`],
          },
        },
      })),
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: MERCH_SHIPPING_FLAT_CENTS, currency: "usd" },
            display_name: "Standard Shipping (5–10 business days)",
          },
        },
      ],
      phone_number_collection: { enabled: true },
      metadata: { kind: "merch", discountCode: discountApplied ? code!.trim().toUpperCase() : "" },
      success_url: `${siteUrl}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#merch`,
    });

    // Save a pending row keyed by session id. The webhook reads it back
    // after payment to build the Printify order (Stripe gives us the
    // address, this row gives us the variants). `items` keeps the
    // original catalog prices (pre-discount) for order records; the
    // discount and shipping are tracked separately.
    await initDb();
    await db.execute({
      sql: `INSERT INTO merch_orders (items, discount_code, shipping_cents, amount_cents, stripe_session_id, status)
            VALUES (?,?,?,?,?, 'pending')`,
      args: [
        JSON.stringify(validated),
        discountApplied ? code!.trim().toUpperCase() : "",
        MERCH_SHIPPING_FLAT_CENTS,
        amountCents,
        session.id,
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("merch checkout error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
