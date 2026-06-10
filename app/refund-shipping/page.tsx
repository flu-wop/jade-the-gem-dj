import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Refunds — DJ Jade the Gem",
  description: "Shipping, returns, and booking policies for DJ Jade the Gem.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-sub text-sm tracking-[0.2em] uppercase text-gold mb-3">{title}</h2>
      <div className="font-body text-sm text-mist/70 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function ShippingRefundsPage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-24">
      <div className="max-w-2xl mx-auto">
        <p className="section-label mb-3">The Fine Print</p>
        <h1 className="font-display text-5xl sm:text-6xl text-holo leading-none mb-10">
          SHIPPING & REFUNDS
        </h1>

        <Section title="Merch — How It Ships">
          <p>
            Every item in the Hidden Gem store is made to order and printed by our
            print partner, then shipped directly to you. Orders are produced within
            2–5 business days and typically arrive within 5–10 business days after
            that, depending on your location. We currently ship within the United
            States and Canada.
          </p>
          <p>
            You&apos;ll get an email confirmation when your order is placed and a
            tracking link once it ships.
          </p>
        </Section>

        <Section title="Merch — Returns & Replacements">
          <p>
            Because each piece is printed on demand just for you, we can&apos;t accept
            returns or exchanges for buyer&apos;s remorse or for ordering the wrong size,
            so please check the size guide before ordering.
          </p>
          <p>
            If your item arrives damaged, defective, or it&apos;s not what you ordered,
            we&apos;ll make it right. Email{" "}
            <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
              jadedwheeler8@gmail.com
            </a>{" "}
            within 14 days of delivery with your order details and a clear photo of
            the issue, and we&apos;ll send a free replacement or a refund.
          </p>
        </Section>

        <Section title="Bookings — Payment & Cancellations">
          <p>
            DJ bookings are paid in full at the time of booking to reserve your date.
            Your slot isn&apos;t held until payment is complete.
          </p>
          <p>
            Need to cancel or reschedule? Reach out as early as you can. Cancellations
            made at least 14 days before the event are eligible for a full refund;
            cancellations within 14 days may be refunded at our discretion, since the
            date was held for you. To reschedule, contact us and we&apos;ll do our best
            to move your booking to a new available date.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            Anything that isn&apos;t covered here, just ask —{" "}
            <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
              jadedwheeler8@gmail.com
            </a>
            .
          </p>
        </Section>

        <p className="font-body text-xs text-mist/30 mt-12">
          Last updated {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
        </p>
      </div>
    </main>
  );
}
