import { create } from 'zustand';

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
  userId: string | null;
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
  /** Làm sạch giỏ hàng khi người dùng bấm Đăng xuất */
  clearCartOnLogout: () => void;
  /** Chuyển đổi giỏ hàng tương ứng với người dùng đăng nhập hoặc khách vãng lai */
  switchUserCart: (newUserId: string | null) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

/**
 * Trả về key lưu trữ trong localStorage theo từng tài khoản:
 * - Người dùng đăng nhập: 'kady_cart_<userId>'
 * - Khách vãng lai: 'kady_cart_guest'
 */
const getCartStorageKey = (userId: string | null | undefined): string => {
  if (userId && typeof userId === 'string' && userId.trim()) {
    return `kady_cart_${userId.trim()}`;
  }
  return 'kady_cart_guest';
};

const saveCartToStorage = (userId: string | null | undefined, items: CartItem[], savedItems: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    const key = getCartStorageKey(userId);
    localStorage.setItem(key, JSON.stringify({ items, savedItems }));
  } catch (e) {
    console.error('Error saving cart to storage:', e);
  }
};

const loadCartFromStorage = (userId: string | null | undefined): { items: CartItem[]; savedItems: CartItem[] } => {
  if (typeof window === 'undefined') return { items: [], savedItems: [] };
  try {
    const key = getCartStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (!raw) return { items: [], savedItems: [] };
    const parsed = JSON.parse(raw);
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      savedItems: Array.isArray(parsed.savedItems) ? parsed.savedItems : [],
    };
  } catch (e) {
    console.error('Error loading cart from storage:', e);
    return { items: [], savedItems: [] };
  }
};

// Tự động xóa sạch hoàn toàn các key mẫu mock / cache cũ từ phiên thử nghiệm trước
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('ncf-cart-storage');
    localStorage.removeItem('ncf-cart-guest');
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('ncf-cart-') || k === 'ncf-cart-storage')) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // ignore
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  userId: null,
  items: [],
  savedItems: [],

  switchUserCart: (newUserId) => {
    const currentUserId = get().userId;
    // 1. Lưu giỏ hàng hiện tại vào storage riêng của user/khách cũ
    if (currentUserId) {
      saveCartToStorage(currentUserId, get().items, get().savedItems);
    } else if (get().items.length > 0) {
      saveCartToStorage(null, get().items, get().savedItems);
    }

    // 2. Tải giỏ hàng của user/khách mới (nếu có, không có thì giỏ trống)
    const loaded = loadCartFromStorage(newUserId);
    set({
      userId: newUserId,
      items: loaded.items,
      savedItems: loaded.savedItems,
    });
  },

  clearCartOnLogout: () => {
    const currentUserId = get().userId;
    // 1. Lưu lại giỏ hàng của user trước khi đăng xuất nếu có
    if (currentUserId) {
      saveCartToStorage(currentUserId, get().items, get().savedItems);
    }

    // 2. Xóa sạch giỏ hàng khách và bộ nhớ tạm cũ trong localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('kady_cart_guest');
        localStorage.removeItem('ncf-cart-storage');
        localStorage.removeItem('ncf-cart-guest');
      } catch (e) {
        console.error('Error clearing cart on logout:', e);
      }
    }

    // 3. Đặt lại state rỗng hoàn toàn (0 sản phẩm)
    set({
      userId: null,
      items: [],
      savedItems: [],
    });
  },

  addItem: (item) => set((state) => {
    const existingItemIndex = state.items.findIndex(
      i => i.product_id === item.product_id && i.size === item.size && i.color === item.color
    );
    let newItems: CartItem[];
    if (existingItemIndex >= 0) {
      newItems = [...state.items];
      const newQuantity = newItems[existingItemIndex].quantity + item.quantity;
      const currentStock = item.stock || 100;
      newItems[existingItemIndex].quantity = newQuantity > currentStock ? currentStock : newQuantity;
    } else {
      newItems = [...state.items, item];
    }
    saveCartToStorage(state.userId, newItems, state.savedItems);
    return { items: newItems };
  }),

  removeItem: (product_id, size, color) => set((state) => {
    const newItems = state.items.filter(i => !(i.product_id === product_id && i.size === size && i.color === color));
    saveCartToStorage(state.userId, newItems, state.savedItems);
    return { items: newItems };
  }),

  removeItems: (keys) => set((state) => {
    const newItems = state.items.filter(i => !keys.includes(cartKey(i)));
    saveCartToStorage(state.userId, newItems, state.savedItems);
    return { items: newItems };
  }),

  updateQuantity: (product_id, size, color, quantity) => set((state) => {
    const newItems = state.items.map(i => 
      (i.product_id === product_id && i.size === size && i.color === color)
        ? { ...i, quantity: Math.min(Math.max(1, quantity), i.stock || 100) }
        : i
    );
    saveCartToStorage(state.userId, newItems, state.savedItems);
    return { items: newItems };
  }),

  updateVariant: (product_id, size, color, newSize, newColor) => set((state) => {
    const normColor = (c?: string) => (c ? c.trim() : undefined);
    const curColor = normColor(color);
    const targetColor = normColor(newColor);
    const targetSize = (newSize || '').trim();

    const current = state.items.find(
      i => i.product_id === product_id && (i.size || '').trim() === (size || '').trim() && normColor(i.color) === curColor
    );
    if (!current) return state;
    if ((current.size || '').trim() === targetSize && normColor(current.color) === targetColor) return state;

    const duplicate = state.items.find(
      i => i !== current && i.product_id === product_id && (i.size || '').trim() === targetSize && normColor(i.color) === targetColor
    );

    let newItems: CartItem[];
    if (duplicate) {
      // Gộp vào dòng đã có
      const merged = Math.min(duplicate.quantity + current.quantity, duplicate.stock || 100);
      newItems = state.items
        .filter(i => i !== current)
        .map(i => (i === duplicate ? { ...i, quantity: merged } : i));
    } else {
      newItems = state.items.map(i =>
        i === current ? { ...i, size: targetSize, color: targetColor } : i
      );
    }
    saveCartToStorage(state.userId, newItems, state.savedItems);
    return { items: newItems };
  }),

  syncProduct: (product_id, data) => set((state) => {
    let changed = false;
    const newItems = state.items.map(i => {
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
    if (changed) {
      saveCartToStorage(state.userId, newItems, state.savedItems);
      return { items: newItems };
    }
    return state;
  }),

  saveForLater: (key) => set((state) => {
    const target = state.items.find(i => cartKey(i) === key);
    if (!target) return state;
    const alreadySaved = state.savedItems.some(i => cartKey(i) === key);
    const newItems = state.items.filter(i => cartKey(i) !== key);
    const newSaved = alreadySaved ? state.savedItems : [...state.savedItems, target];
    saveCartToStorage(state.userId, newItems, newSaved);
    return {
      items: newItems,
      savedItems: newSaved,
    };
  }),

  moveSavedToCart: (key) => set((state) => {
    const target = state.savedItems.find(i => cartKey(i) === key);
    if (!target) return state;
    const existing = state.items.find(i => cartKey(i) === key);
    const newItems = existing
      ? state.items.map(i =>
          cartKey(i) === key
            ? { ...i, quantity: Math.min(i.quantity + target.quantity, i.stock || 100) }
            : i
        )
      : [...state.items, target];
    const newSaved = state.savedItems.filter(i => cartKey(i) !== key);
    saveCartToStorage(state.userId, newItems, newSaved);
    return { items: newItems, savedItems: newSaved };
  }),

  removeSaved: (key) => set((state) => {
    const newSaved = state.savedItems.filter(i => cartKey(i) !== key);
    saveCartToStorage(state.userId, state.items, newSaved);
    return {
      savedItems: newSaved
    };
  }),

  clearCart: () => set((state) => {
    saveCartToStorage(state.userId, [], state.savedItems);
    return { items: [] };
  }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));

// Tự động khởi tạo giỏ hàng cho khách vãng lai khi trang được tải trên client (nếu chưa đăng nhập)
if (typeof window !== 'undefined') {
  try {
    const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
    if (!token) {
      const guestCart = loadCartFromStorage(null);
      if (guestCart.items.length > 0 || guestCart.savedItems.length > 0) {
        useCartStore.setState({
          userId: null,
          items: guestCart.items,
          savedItems: guestCart.savedItems,
        });
      }
    }
  } catch {
    // ignore
  }
}

