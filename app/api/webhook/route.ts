import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, initDb } from "@/lib/db";
import { sendBookingConfirmation, sendMerchEmails, sendPlaylistEmails, sendMerchBuildEmails } from "@/lib/resend";
import {
  printifyConfigured,
  createOrder,
  sendToProduction,
  type PrintifyLineItem,
} from "@/lib/printify";
import { findProduct, getPrintifyVariant, type CartLine } from "@/lib/merch";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text(); // RAW body — required for signature verification
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: Record<string, string>; amount_total?: number };
    const meta = session.metadata ?? {};

    if (meta.kind === "merch") {
      await handleMerch(session.id);
    } else if (meta.kind === "playlist") {
      await handlePlaylist(session.id);
    } else if (meta.kind === "merch-build") {
      await handleMerchBuild(session.id);
    } else {
      await handleBooking(session, meta);
    }
  }

  return NextResponse.json({ received: true });
}

// ── Booking (unchanged behavior) ──────────────────────────────
async function handleBooking(
  session: { id: string; amount_total?: number },
  meta: Record<string, string>
) {
  await initDb();
  // IDEMPOTENCY: only proceed if this session hasn't already been confirmed
  // (Stripe retries webhook delivery — without this, a retry re-sends the
  // confirmation email every time).
  const existing = (await db.execute({
    sql: `SELECT status FROM bookings WHERE stripe_session_id=?`,
    args: [session.id],
  })).rows[0] as Record<string, unknown> | undefined;
  if (!existing || existing.status === "confirmed") return;

  await db.execute({
    sql: `UPDATE bookings SET status='confirmed' WHERE stripe_session_id=?`,
    args: [session.id],
  });
  try {
    await sendBookingConfirmation({
      name: meta.name, email: meta.email, eventDate: meta.eventDate,
      eventType: meta.eventType, hours: parseInt(meta.hours),
      location: meta.location, total: (session.amount_total ?? 0) / 100,
      discountCode: meta.discountCode || undefined,
    });
  } catch (e) {
    console.error("Booking email error:", e);
  }
}

// ── Merch: fulfill via Printify after payment ─────────────────
async function handleMerch(sessionId: string) {
  await initDb();

  // Load the cart we saved at checkout
  const row = (await db.execute({
    sql: `SELECT * FROM merch_orders WHERE stripe_session_id=?`,
    args: [sessionId],
  })).rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    console.error("merch_orders row not found for", sessionId);
    return;
  }
  // IDEMPOTENCY: don't re-fulfill or re-email an order already processed
  if (row.status !== "pending") return;

  const items = JSON.parse(String(row.items)) as CartLine[];
  const total = Number(row.amount_cents) / 100;

  // Pull the customer + shipping address from Stripe
  const full = await stripe.checkout.sessions.retrieve(sessionId);
  const cust = full.customer_details;
  const ship = full.shipping_details ?? full.customer_details;
  const addr = ship?.address;
  const fullName = ship?.name || cust?.name || "Customer";
  const [firstName, ...rest] = fullName.split(" ");
  const lastName = rest.join(" ") || firstName;
  const email = cust?.email || "";
  const phone = cust?.phone || "";

  const shippingLines = [
    fullName,
    addr?.line1 || "",
    addr?.line2 || "",
    [addr?.city, addr?.state, addr?.postal_code].filter(Boolean).join(", "),
    addr?.country || "",
  ].filter(Boolean);

  await db.execute({
    sql: `UPDATE merch_orders SET status='paid', name=?, email=?, phone=?, shipping_json=? WHERE stripe_session_id=?`,
    args: [fullName, email, phone, JSON.stringify(addr ?? {}), sessionId],
  });

  // Build Printify line items from the variant mapping
  let fulfilled = false;
  const lineItems: PrintifyLineItem[] = [];
  for (const l of items) {
    const product = findProduct(l.productId);
    const variantId = getPrintifyVariant(l.productId, l.style, l.size, l.gender);
    if (product?.printifyProductId && variantId) {
      lineItems.push({ product_id: product.printifyProductId, variant_id: variantId, quantity: l.qty });
    }
  }

  if (printifyConfigured() && lineItems.length === items.length && addr) {
    try {
      const order = await createOrder({
        externalId: sessionId,
        label: `Hidden Gem — ${fullName}`,
        lineItems,
        address: {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          country: addr.country || "US",
          region: addr.state || "",
          address1: addr.line1 || "",
          address2: addr.line2 || "",
          city: addr.city || "",
          zip: addr.postal_code || "",
        },
      });
      await sendToProduction(order.id);
      await db.execute({
        sql: `UPDATE merch_orders SET status='fulfilled', printify_order_id=? WHERE stripe_session_id=?`,
        args: [order.id, sessionId],
      });
      fulfilled = true;
    } catch (e) {
      console.error("Printify fulfillment failed:", e);
      await db.execute({
        sql: `UPDATE merch_orders SET status='fulfill_failed' WHERE stripe_session_id=?`,
        args: [sessionId],
      });
    }
  }

  // Always email (payment already succeeded — never throw from here)
  try {
    await sendMerchEmails({
      name: fullName,
      email,
      items: items.map((l) => ({ name: l.name, style: l.style, size: l.size, gender: l.gender, qty: l.qty, price: l.price })),
      total,
      shippingLines,
      fulfilled,
    });
  } catch (e) {
    console.error("Merch email error:", e);
  }
}

// ── Playlist: one-click digital service purchase ──────────────
async function handlePlaylist(sessionId: string) {
  await initDb();

  const row = (await db.execute({
    sql: `SELECT * FROM playlist_orders WHERE stripe_session_id=?`,
    args: [sessionId],
  })).rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    console.error("playlist_orders row not found for", sessionId);
    return;
  }
  // IDEMPOTENCY: don't re-email an order already marked paid
  if (row.status !== "pending") return;

  const full = await stripe.checkout.sessions.retrieve(sessionId);
  const cust = full.customer_details;
  const name = cust?.name || "Customer";
  const email = cust?.email || "";
  const tier = String(row.tier || "");
  const total = (full.amount_total ?? Number(row.amount_cents)) / 100;
  const discountCode = String(row.discount_code || "");
  const discountApplied = discountCode === "PLAY30";

  await db.execute({
    sql: `UPDATE playlist_orders SET status='paid', name=?, email=? WHERE stripe_session_id=?`,
    args: [name, email, sessionId],
  });

  try {
    await sendPlaylistEmails({ name, email, tier, total, discountApplied });
  } catch (e) {
    console.error("Playlist email error:", e);
  }
}

// ── Merch Build: one-click productized design service purchase ──
async function handleMerchBuild(sessionId: string) {
  await initDb();

  const row = (await db.execute({
    sql: `SELECT * FROM merch_build_orders WHERE stripe_session_id=?`,
    args: [sessionId],
  })).rows[0] as Record<string, unknown> | undefined;
  if (!row) {
    console.error("merch_build_orders row not found for", sessionId);
    return;
  }
  // IDEMPOTENCY: don't re-email an order already marked paid
  if (row.status !== "pending") return;

  const full = await stripe.checkout.sessions.retrieve(sessionId);
  const cust = full.customer_details;
  const name = cust?.name || "Customer";
  const email = cust?.email || "";
  const tier = String(row.tier || "");
  const itemCount = Number(row.item_count || 0);
  const total = (full.amount_total ?? Number(row.amount_cents)) / 100;

  await db.execute({
    sql: `UPDATE merch_build_orders SET status='paid', name=?, email=? WHERE stripe_session_id=?`,
    args: [name, email, sessionId],
  });

  try {
    await sendMerchBuildEmails({ name, email, tier, itemCount, total });
  } catch (e) {
    console.error("Merch build email error:", e);
  }
}
