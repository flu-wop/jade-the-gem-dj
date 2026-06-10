"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function CartButton({ className = "" }: { className?: string }) {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      className={`relative text-mist/70 hover:text-gold transition-colors p-1 ${className}`}
      aria-label={`Open cart (${count} item${count === 1 ? "" : "s"})`}
    >
      <ShoppingBag size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gold text-background text-[10px] font-sub flex items-center justify-center leading-none">
          {count}
        </span>
      )}
    </button>
  );
}
