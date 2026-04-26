import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Perfume } from "@/lib/api";

export interface CartItem {
  perfume: Perfume;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (p: Perfume, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "dreamscents.cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (perfume: Perfume, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.perfume.id === perfume.id);
      if (existing) {
        return prev.map((i) =>
          i.perfume.id === perfume.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { perfume, qty }];
    });
  };

  const removeFromCart = (id: string) =>
    setItems((prev) => prev.filter((i) => i.perfume.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.perfume.id !== id)
        : prev.map((i) => (i.perfume.id === id ? { ...i, qty } : i))
    );

  const clearCart = () => setItems([]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.perfume.price, 0),
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
