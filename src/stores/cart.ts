import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/data/types";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId ? { ...i, quantity: Math.max(0, qty) } : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      total: () =>
        get().items.reduce((sum, i) => sum + i.priceDzd * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "halawiyat-cart" }
  )
);
