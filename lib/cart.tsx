// lib/cart.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "jade-cart-v2"; // v2: variant-based schema (live Printify), not style/size/gender

// One cart line = one Printify variant. Since a variant already encodes
// color + size together, there's nothing else to key on — no more manual
// style/size/gender combinations to keep in sync with the real catalog.
export interface CartItem {
  variantId: number;
  productId: string;
  slug: string;
  name: string; // product name, e.g. "Hidden Gem Tee"
  variantName: string; // e.g. "Black / L" or "One size / Black / Leopard"
  price: number; // dollars, snapshotted at add-to-cart time (re-validated at checkout)
  qty: number;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: CartItem) => void;
  setQty: (variantId: number, qty: number) => void;
  removeItem: (variantId: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((l) => l.variantId === item.variantId);
      if (existing) {
        return prev.map((l) =>
          l.variantId === item.variantId ? { ...l, qty: l.qty + item.qty } : l
        );
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const setQty = useCallback((variantId: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((l) => (l.variantId === variantId ? { ...l, qty: Math.max(1, qty) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const removeItem = useCallback((variantId: number) => {
    setItems((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((s, l) => s + l.price * l.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        addItem,
        setQty,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
