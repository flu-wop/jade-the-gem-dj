// components/MerchSection.tsx
// Homepage merch teaser — pulls the live catalog straight from Printify
// (lib/printify.ts: getProducts()) so colors/sizes/availability always
// match what's actually orderable. Cards link through to /merch/[slug]
// for the full color/size/gallery experience.

import { MERCH_LIVE } from "@/lib/merch";
import { getProducts, printifyConfigured } from "@/lib/printify";
import ProductCard from "@/components/merch/ProductCard";

export default async function MerchSection() {
  const configured = printifyConfigured();
  const products = configured ? await getProducts().catch(() => null) : null;

  return (
    <section id="merch" className="relative bg-transparent py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-jade-glow pointer-events-none opacity-60" />

      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Hidden Gem Collection</p>
          <h2 className="section-title drop-shadow-[0_0_20px_#4a3f8f66]">THE DRIP</h2>
          <p className="font-body text-sm text-mist/50 mt-4 max-w-sm mx-auto">
            Premium Shaka Wear · Printed via Printify · Ships direct to you
          </p>
        </div>

        {!MERCH_LIVE ? (
          /* ── Store being rebuilt — hide stale products ── */
          <div className="border border-plum/20 bg-surface py-20 px-6 text-center">
            <p className="font-display text-4xl sm:text-5xl text-holo mb-4">
              NEW COLLECTION DROPPING SOON
            </p>
            <p className="font-body text-sm text-mist/50 max-w-md mx-auto">
              The new Hidden Gem store is on the way. Join the list below and
              you&apos;ll be first to know when it goes live.
            </p>
          </div>
        ) : !products || products.length === 0 ? (
          /* ── Printify unreachable/misconfigured — fail quietly, not a broken grid ── */
          <div className="border border-plum/20 bg-surface py-16 px-6 text-center">
            <p className="font-body text-sm text-mist/50 max-w-md mx-auto">
              The shop is taking a quick breather — check back shortly, or reach out directly to grab merch.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Trust bar */}
            <div className="mt-10 py-4 px-6 border border-plum/20 bg-surface flex flex-wrap justify-center gap-6 text-mist/40 font-sub text-[10px] tracking-[0.2em] uppercase">
              {["Premium Shaka Wear", "Printed via Printify", "Ships 5–10 Days", "Secure Checkout"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="text-jade-light">✦</span>{t}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
