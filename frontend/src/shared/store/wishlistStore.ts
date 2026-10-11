import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
  original_price?: string;
  discount_percent?: number;
  discount_label?: string;
  added_at: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'added_at'>) => void;
  removeItem: (product_id: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'added_at'>) => boolean; // returns true if added
  isWishlisted: (product_id: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().isWishlisted(item.product_id)) return;
        set((state) => ({
          items: [
            { ...item, added_at: new Date().toISOString() },
            ...state.items,
          ],
        }));
      },
      removeItem: (product_id) => {
        set((state) => ({ items: state.items.filter((i) => i.product_id !== product_id) }));
      },
      toggleItem: (item) => {
        const exists = get().isWishlisted(item.product_id);
        if (exists) {
          get().removeItem(item.product_id);
          return false;
        } else {
          get().addItem(item);
          return true;
        }
      },
      isWishlisted: (product_id) => {
        return get().items.some((i) => i.product_id === product_id);
      },
      clearAll: () => set({ items: [] }),
    }),
    { name: 'kady-wishlist' }
  )
);
