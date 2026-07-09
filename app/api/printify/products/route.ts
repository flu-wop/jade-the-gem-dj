import { NextRequest, NextResponse } from "next/server";
import { listProducts, listShops } from "@/lib/printify";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!process.env.PRINTIFY_SHOP_ID) {
      const shops = await listShops();
      return NextResponse.json({
        note: "Add PRINTIFY_SHOP_ID using the id below, then reload this page.",
        shops,
      });
    }

    const { data } = await listProducts();
    return NextResponse.json({ products: data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
