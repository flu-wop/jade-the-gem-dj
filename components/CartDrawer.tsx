"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { lineId } from "@/lib/merch";

export default function CartDrawer() {
  const { items, isOpen, close, subtotal, setQty, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    if (items.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/merch/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-[60] bg-black/70 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[61] h-full w-full max-w-md bg-surface border-l border-plum/30 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-plum/20">
          <h2 className="font-sub text-sm tracking-[0.25em] uppercase text-cream flex items-center gap-2">
            <ShoppingBag size={16} className="text-gold" /> Your Cart
          </h2>
          <button
            onClick={close}
            className="text-mist/60 hover:text-gold transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag size={40} className="text-mist/20 mb-4" />
              <p className="font-body text-sm text-mist/40">Your cart is empty.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((l) => {
                const id = lineId(l);
                return (
                  <li key={id} className="flex gap-4 border-b border-plum/10 pb-4">
                    <div className="relative w-16 h-16 shrink-0 bg-surface-2 overflow-hidden">
                      <Image src={l.image} alt={l.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sub text-xs tracking-wider uppercase text-cream truncate">
                        {l.name}
                      </p>
                      <p className="font-body text-[11px] text-mist/40 mt-0.5">
                        {l.style} · {l.size} · {l.gender}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQty(id, l.qty - 1)}
                            className="w-6 h-6 border border-plum/30 text-mist hover:border-plum hover:text-gold flex items-center justify-center transition-all"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-sub text-cream text-sm w-5 text-center">{l.qty}</span>
                          <button
                            onClick={() => setQty(id, l.qty + 1)}
                            className="w-6 h-6 border border-plum/30 text-mist hover:border-plum hover:text-gold flex items-center justify-center transition-all"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-sub text-gold text-sm">${l.price * l.qty}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(id)}
                      className="text-mist/30 hover:text-jade-light transition-colors self-start"
                      aria-label="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-plum/20 px-6 py-5 space-y-4">
            <div className="flex justify-between font-sub text-sm tracking-wider uppercase">
              <span className="text-mist/50">Subtotal</span>
              <span className="text-cream">${subtotal}</span>
            </div>
            <p className="font-body text-[11px] text-mist/30">
              Shipping calculated at checkout. Taxes where applicable.
            </p>
            {error && <p className="font-body text-xs text-jade-light">{error}</p>}
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full py-3.5 font-sub text-xs tracking-[0.2em] uppercase bg-plum hover:bg-plum-light text-cream transition-all duration-300 shadow-[0_0_20px_#4a3f8f55] hover:shadow-[0_0_30px_#4a3f8f88] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting…" : "Secure Checkout"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
