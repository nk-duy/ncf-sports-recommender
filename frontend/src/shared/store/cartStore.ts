import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  size: string;
  color?: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string, color?: string) => void;
  updateQuantity: (product_id: string, size: string, color: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(
          i => i.product_id === item.product_id && i.size === item.size && i.color === item.color
        );
        
        if (existingItemIndex >= 0) {
          const newItems = [...state.items];
          const newQuantity = newItems[existingItemIndex].quantity + item.quantity;
          const currentStock = item.stock || 100;
          if (newQuantity > currentStock) {
            // we will handle notification on the component side or just cap it
            newItems[existingItemIndex].quantity = currentStock;
          } else {
            newItems[existingItemIndex].quantity = newQuantity;
          }
          return { items: newItems };
        }
        
        return { items: [...state.items, item] };
      }),
      removeItem: (product_id, size, color) => set((state) => ({
        items: state.items.filter(i => !(i.product_id === product_id && i.size === size && i.color === color))
      })),
      updateQuantity: (product_id, size, color, quantity) => set((state) => ({
        items: state.items.map(i => 
          (i.product_id === product_id && i.size === size && i.color === color)
            ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock || 100) }
            : i
        )
      })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'ncf-cart-storage',
    }
  )
);
