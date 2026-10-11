import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  /** Giá gốc trước khuyến mãi (nếu sản phẩm đang giảm giá) */
  original_price?: number;
  image_url: string;
  quantity: number;
  size: string;
  color?: string;
  stock: number;
}

/** Khóa duy nhất của một dòng trong giỏ hàng (sản phẩm + size + màu) */
export const cartKey = (i: { product_id: string; size: string; color?: string }) =>
  `${i.product_id}-${i.size}-${i.color || ''}`;

interface CartState {
  items: CartItem[];
  /** Sản phẩm đã lưu để mua sau */
  savedItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, size: string, color?: string) => void;
  removeItems: (keys: string[]) => void;
  updateQuantity: (product_id: string, size: string, color: string | undefined, quantity: number) => void;
  /** Đổi phân loại (size/màu) ngay trong giỏ, tự gộp nếu trùng với dòng khác */
  updateVariant: (
    product_id: string,
    size: string,
    color: string | undefined,
    newSize: string,
    newColor: string | undefined
  ) => void;
  /** Đồng bộ tồn kho / giá mới nhất từ server cho mọi dòng của một sản phẩm */
  syncProduct: (product_id: string, data: { stock?: number; price?: number; original_price?: number }) => void;
  saveForLater: (key: string) => void;
  moveSavedToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      savedItems: [],
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
      removeItems: (keys) => set((state) => ({
        items: state.items.filter(i => !keys.includes(cartKey(i)))
      })),
      updateQuantity: (product_id, size, color, quantity) => set((state) => ({
        items: state.items.map(i => 
          (i.product_id === product_id && i.size === size && i.color === color)
            ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock || 100) }
            : i
        )
      })),
      updateVariant: (product_id, size, color, newSize, newColor) => set((state) => {
        const current = state.items.find(
          i => i.product_id === product_id && i.size === size && i.color === color
        );
        if (!current) return state;
        if (size === newSize && color === newColor) return state;

        const duplicate = state.items.find(
          i => i !== current && i.product_id === product_id && i.size === newSize && i.color === newColor
        );

        if (duplicate) {
          // Gộp vào dòng đã có
          const merged = Math.min(duplicate.quantity + current.quantity, duplicate.stock || 100);
          return {
            items: state.items
              .filter(i => i !== current)
              .map(i => (i === duplicate ? { ...i, quantity: merged } : i))
          };
        }

        return {
          items: state.items.map(i =>
            i === current ? { ...i, size: newSize, color: newColor } : i
          )
        };
      }),
      syncProduct: (product_id, data) => set((state) => {
        let changed = false;
        const items = state.items.map(i => {
          if (i.product_id !== product_id) return i;
          const next = { ...i };
          if (typeof data.stock === 'number' && data.stock !== i.stock) {
            next.stock = data.stock;
            if (data.stock > 0 && next.quantity > data.stock) next.quantity = data.stock;
          }
          if (typeof data.price === 'number' && data.price !== i.price) {
            next.price = data.price;
          }
          if (data.original_price !== undefined && data.original_price !== i.original_price) {
            next.original_price = data.original_price;
          }
          if (
            next.stock !== i.stock || next.quantity !== i.quantity ||
            next.price !== i.price || next.original_price !== i.original_price
          ) {
            changed = true;
            return next;
          }
          return i;
        });
        return changed ? { items } : state;
      }),
      saveForLater: (key) => set((state) => {
        const target = state.items.find(i => cartKey(i) === key);
        if (!target) return state;
        const alreadySaved = state.savedItems.some(i => cartKey(i) === key);
        return {
          items: state.items.filter(i => cartKey(i) !== key),
          savedItems: alreadySaved ? state.savedItems : [...state.savedItems, target],
        };
      }),
      moveSavedToCart: (key) => set((state) => {
        const target = state.savedItems.find(i => cartKey(i) === key);
        if (!target) return state;
        const existing = state.items.find(i => cartKey(i) === key);
        const items = existing
          ? state.items.map(i =>
              cartKey(i) === key
                ? { ...i, quantity: Math.min(i.quantity + target.quantity, i.stock || 100) }
                : i
            )
          : [...state.items, target];
        return { items, savedItems: state.savedItems.filter(i => cartKey(i) !== key) };
      }),
      removeSaved: (key) => set((state) => ({
        savedItems: state.savedItems.filter(i => cartKey(i) !== key)
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
