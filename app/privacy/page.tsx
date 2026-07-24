import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — DJ Jade the Gem",
  description: "What we collect, why, and how it's used on dahiddengem.com.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-sub text-sm tracking-[0.2em] uppercase text-gold mb-3">{title}</h2>
      <div className="font-body text-sm text-mist/70 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 pt-32 pb-24">
      <div className="max-w-2xl mx-auto">
        <p className="section-label mb-3">The Fine Print</p>
        <h1 className="font-display text-5xl sm:text-6xl text-holo leading-none mb-10">
          PRIVACY POLICY
        </h1>

        <Section title="What We Collect">
          <p>
            When you book an event, order merch, buy a playlist, or sign up for the
            newsletter, we collect what&apos;s needed to fulfill that: your name, email,
            phone number, and — for merch orders — a shipping address. Payment card
            details are entered directly with Stripe and never touch our servers.
          </p>
        </Section>

        <Section title="Why We Collect It">
          <p>
            To confirm and deliver on your booking, order, or purchase; to send
            confirmation and status emails; and to ship physical merch to the right
            address. Newsletter signups are used only to send occasional updates from
            DJ Jade the Gem.
          </p>
        </Section>

        <Section title="Where It Lives">
          <p>
            Booking, order, and playlist records are stored in our database (Turso).
            Payments are processed and stored by Stripe. Emails are sent through
            Resend. Merch orders are shared with our print partner, Printify, solely
            to produce and ship your item.
          </p>
        </Section>

        <Section title="Who It's Shared With">
          <p>
            We don&apos;t sell or rent your information. It&apos;s shared only with the
            services above, only as needed to complete your booking or order: Stripe
            (payment), Resend (email), and Printify (merch production + shipping).
          </p>
        </Section>

        <Section title="How Long We Keep It">
          <p>
            We keep booking and order records to maintain a history of transactions
            and for accounting purposes. You can request deletion of your personal
            information at any time — see below.
          </p>
        </Section>

        <Section title="Your Choices">
          <p>
            Want your information corrected or deleted, or want off the newsletter?
            Email{" "}
            <a href="mailto:jadedwheeler8@gmail.com" className="text-jade-light hover:underline">
              jadedwheeler8@gmail.com
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </Section>

        <p className="font-body text-xs text-mist/30 mt-12">
          This page is a disclosure, not legal advice. Last updated{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
        </p>
      </div>
    </main>
  );
}
