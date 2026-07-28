import { NextResponse } from "next/server";
import { getProducts, printifyConfigured } from "@/lib/printify";

export const runtime = "nodejs";

export async function GET() {
  try {
    const configured = printifyConfigured();
    const products = await getProducts();
    return NextResponse.json({ configured, count: products.length, slugs: products.map(p => p.slug) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
