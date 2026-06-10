import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function MerchSuccess() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 border border-jade/40 bg-jade/10 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={36} className="text-jade-light" />
        </div>
        <h1 className="font-display text-5xl text-cream uppercase tracking-wider mb-4">
          Order Confirmed!
        </h1>
        <p className="text-jade-light font-display text-3xl tracking-wider mb-6">💎</p>
        <p className="text-mist/50 font-body text-sm leading-relaxed mb-10">
          Thanks for repping Hidden Gem. Your order is in — check your email for
          the receipt. Everything is printed to order and ships in about 5–10 days.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-secondary">Back Home</Link>
          <Link href="/#merch" className="btn-ghost">Keep Shopping</Link>
        </div>
      </div>
    </div>
  );
}
