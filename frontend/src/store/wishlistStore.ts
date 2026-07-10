import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: number | string;
  name: string;
  price: number | string;
  image: string;
  // Index signature to allow easy integration with MOCK_PRODUCTS
  [key: string]: any;
}

interface WishlistState {
  // State
  wishlist: WishlistItem[];
  items: WishlistItem[];
  wishlistCount: number;
  
  // Actions
  addWishlist: (item: WishlistItem) => void;
  removeWishlist: (id: number | string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  clearWishlist: () => void;
  
  // Queries
  isWishlisted: (id: number | string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlist: [],
      items: [],
      wishlistCount: 0,

      addWishlist: (item) => {
        const { items } = get();
        if (!items.find((i) => i.id === item.id)) {
          const updatedItems = [...items, item];
          set({ wishlist: updatedItems, items: updatedItems, wishlistCount: updatedItems.length });
        }
      },

      removeWishlist: (id) => {
        const { items } = get();
        const updatedItems = items.filter((i) => i.id !== id);
        set({ wishlist: updatedItems, items: updatedItems, wishlistCount: updatedItems.length });
      },

      toggleWishlist: (item) => {
        const { isWishlisted, addWishlist, removeWishlist } = get();
        if (isWishlisted(item.id)) {
          removeWishlist(item.id);
        } else {
          addWishlist(item);
        }
      },

      clearWishlist: () => set({ wishlist: [], items: [], wishlistCount: 0 }),

      isWishlisted: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'veloria-wishlist-storage',
      onRehydrateStorage: () => (state) => {
        if (!state) return

        const items = state.items || state.wishlist || []

        state.items = items
        state.wishlist = items
        state.wishlistCount = items.length
      }
    }
  )
);