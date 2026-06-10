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
    // If shop id isn't set, list shops so you can grab it.
    if (!process.env.PRINTIFY_SHOP_ID) {
      const shops = await listShops();
      return NextResponse.json({
        note: "Add PRINTIFY_SHOP_ID using the id below, then reload this page.",
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
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
