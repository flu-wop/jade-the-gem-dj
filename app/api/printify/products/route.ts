import { NextRequest, NextResponse } from "next/server";
import { printifyConfigured, listShops, listProducts } from "@/lib/printify";

export const runtime = "nodejs";

// Visit /api/printify/products?key=YOUR_ADMIN_PASSWORD
// Returns your shop id and every product's variant ids + titles, so you
// can paste them into lib/merch.ts → PRINTIFY_VARIANTS.
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: "Unauthorized. Append ?key=YOUR_ADMIN_PASSWORD" }, { status: 401 });

  if (!process.env.PRINTIFY_API_TOKEN)
    return NextResponse.json({ error: "PRINTIFY_API_TOKEN not set yet." }, { status: 400 });

  try {
    // Always test auth by listing shops first — confirms token validity
    const shops = await listShops();

    // If shop id isn't set, return shops so you can grab it
    if (!process.env.PRINTIFY_SHOP_ID) {
      return NextResponse.json({ note: "Set PRINTIFY_SHOP_ID to one of these, then reload.", shops });
    }

    const shopMatch = shops.find((s) => String(s.id) === process.env.PRINTIFY_SHOP_ID);
    if (!shopMatch) {
      return NextResponse.json({
        error: `PRINTIFY_SHOP_ID ${process.env.PRINTIFY_SHOP_ID} not found in your account. Your shops are:`,
        shops,
      });
    }

    const { data } = await listProducts();
    const simplified = data.map((p) => ({
      product_id: p.id,
      title: p.title,
      variants: p.variants
        .filter((v) => v.is_enabled)
        .map((v) => ({ variant_id: v.id, title: v.title })),
    }));
    return NextResponse.json({ configured: printifyConfigured(), products: simplified });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message, token_length: process.env.PRINTIFY_API_TOKEN?.trim().length ?? 0 }, { status: 500 });
  }
}
