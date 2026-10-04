import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";
import type { StoreSection } from "@/lib/brands";

export type CartItem = {
  key: string; // productId + size
  productId: string;
  slug: string;
  section: StoreSection;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
  image: string;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "key">) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

type CartStore = UseBoundStore<StoreApi<CartState>>;

function createCartStore(storageKey: string): CartStore {
  return create<CartState>()(
    persist(
      (set) => ({
        items: [],
        addItem: (item) =>
          set((state) => {
            const key = `${item.productId}::${item.size ?? "onesize"}`;
            const existing = state.items.find((i) => i.key === key);
            if (existing) {
              return {
                items: state.items.map((i) =>
                  i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i,
                ),
              };
            }
            return { items: [...state.items, { ...item, key }] };
          }),
        removeItem: (key) =>
          set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
        setQuantity: (key, quantity) =>
          set((state) => ({
            items: state.items
              .map((i) => (i.key === key ? { ...i, quantity } : i))
              .filter((i) => i.quantity > 0),
          })),
        clear: () => set({ items: [] }),
      }),
      { name: storageKey },
    ),
  );
}

/**
 * One cart per selling brand. Santus Sabaoth and Sartorial Executive never
 * share a bag, and once they live on separate domains they could not share
 * browser storage anyway.
 */
const stores: Record<StoreSection, CartStore> = {
  SANTUS_SABAOTH: createCartStore("santus-cart"),
  SARTORIAL_EXECUTIVE: createCartStore("sartorial-cart"),
};

/** The zustand hook for a brand's cart. Call with a stable section per component. */
export function useCartStore<T>(section: StoreSection, selector: (s: CartState) => T): T {
  return stores[section](selector);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
