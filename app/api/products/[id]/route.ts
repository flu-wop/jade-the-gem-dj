// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";

const PRODUCTS: Record<string, { name: string; price: number }> = {
  "hidden-gem-gypsy":  { name: "Hidden Gem Gypsy",  price: 30 },
  "hidden-gem-bubble": { name: "Hidden Gem Bubble", price: 30 },
  "mash-ups-vol-1":    { name: "Mash-Ups Vol. 1",   price: 30 },
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const baseId = id.split("__")[0];
  const product = PRODUCTS[baseId];

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ id: baseId, ...product });
}
