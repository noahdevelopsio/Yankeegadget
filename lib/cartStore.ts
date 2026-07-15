import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // combination of productId and variantId (if applicable)
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number; // in kobo
  quantity: number;
  selectedVariant?: {
    id: string;
    name: string;
    value: string;
    priceDiff: number;
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity" | "id">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem, quantity = 1) => {
        const id = newItem.selectedVariant
          ? `${newItem.productId}-${newItem.selectedVariant.id}`
          : newItem.productId;

        const existingItems = get().items;
        const existingItem = existingItems.find((item) => item.id === id);

        if (existingItem) {
          set({
            items: existingItems.map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...existingItems, { ...newItem, id, quantity }],
          });
        }
        // Open drawer automatically when item is added
        set({ isOpen: true });
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen) => set({ isOpen }),
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + (item.price + (item.selectedVariant?.priceDiff || 0)) * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "yankee-gadgets-cart",
      skipHydration: true, // prevents hydration mismatch
    }
  )
);
