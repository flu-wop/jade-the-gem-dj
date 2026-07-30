import { NextRequest, NextResponse } from "next/server";
import { getProducts, printifyConfigured } from "@/lib/printify";

export const runtime = "nodejs";

function mask(v: string | undefined) {
  if (!v) return null;
  if (v.length <= 12) return `len:${v.length}`;
  return `len:${v.length} starts:${v.slice(0, 6)} ends:${v.slice(-6)}`;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawToken = process.env.PRINTIFY_API_TOKEN;
  const rawShop = process.env.PRINTIFY_SHOP_ID;
  const diag = {
    tokenPresent: !!rawToken,
    tokenMasked: mask(rawToken),
    tokenHasWhitespace: !!rawToken && /\s/.test(rawToken),
    shopId: rawShop ?? null,
    configured: printifyConfigured(),
  };
  try {
    const products = await getProducts();
    return NextResponse.json({ diag, count: products.length, slugs: products.map(p => p.slug) });
  } catch (err) {
    return NextResponse.json({ diag, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
