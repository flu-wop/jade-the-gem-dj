// app/merch/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/printify";
import ProductDetail from "./ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function findProduct(slug: string) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return { title: "Product Not Found | Hidden Gem" };

  return {
    title: `${product.name} | Hidden Gem`,
    description: `${product.name} — ${product.priceFormatted}. Official Hidden Gem merch, printed to order.`,
    openGraph: {
      title: product.name,
      images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/#merch"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-mist/40 hover:text-gold transition-colors font-sub mb-8"
        >
          ← Back to shop
        </Link>
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
