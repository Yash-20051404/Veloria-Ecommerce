import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number | string;
  name: string;
  price: number | string;
  image: string;
  quantity: number;
  // Index signature to allow easy integration with MOCK_PRODUCTS 
  // (e.g., collection, category, rarity) without strict type errors.
  [key: string]: any;
}

interface CartState {
  // State
  cart: CartItem[];
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  
  // Actions
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: number | string) => void;
  increaseQuantity: (id: number | string) => void;
  decreaseQuantity: (id: number | string) => void;
  clearCart: () => void;
}

// Utility to safely parse prices like "$14,500" into raw numbers for accurate totals
const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  const parsed = Number(price.replace(/[^0-9.-]+/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

// Helper to keep our derived values perfectly in sync with our items array
const calculateDerivedState = (items: CartItem[]) => {
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = items.reduce(
    (total, item) => total + parsePrice(item.price) * item.quantity,
    0
  );
  return {
    cart: items,
    items,
    cartCount,
    cartTotal
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      items: [],
      cartCount: 0,
      cartTotal: 0,

      addToCart: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          const updatedItems = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + Math.max(1, item.quantity || 1) }
              : i
          );
          set(calculateDerivedState(updatedItems));
        } else {
          const updatedItems = [
            ...items,
            { ...item, quantity: Math.max(1, item.quantity || 1) },
          ];
          set(calculateDerivedState(updatedItems));
        }
      },

      removeFromCart: (id) => {
        const updatedItems = get().items.filter((i) => i.id !== id);
        set(calculateDerivedState(updatedItems));
      },

      increaseQuantity: (id) => {
        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        );
        set(calculateDerivedState(updatedItems));
      },

      decreaseQuantity: (id) => {
        const updatedItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        );
        set(calculateDerivedState(updatedItems));
      },

      clearCart: () => set({ cart: [], items: [], cartCount: 0, cartTotal: 0 }),
    }),
    { name: 'veloria-cart-storage' }
  )
);