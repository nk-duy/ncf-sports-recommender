import { create } from 'zustand';

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

interface BackendWishlistProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string | string[];
  discount_percent?: number;
  original_price?: string;
}

interface WishlistStore {
  userId: string | null;
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'added_at'>) => void;
  removeItem: (product_id: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'added_at'>) => boolean; // returns true if added
  isWishlisted: (product_id: string) => boolean;
  clearAll: () => void;
  switchUserWishlist: (newUserId: string | null) => void;
  syncWithBackend: () => Promise<void>;
}

const getWishlistStorageKey = (userId: string | null | undefined): string => {
  if (userId && typeof userId === 'string' && userId.trim()) {
    return `kady_wishlist_${userId.trim()}`;
  }
  return 'kady_wishlist_guest';
};

const getCustomerToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kady_customer_token') || localStorage.getItem('token') || null;
};

const loadItemsFromStorage = (key: string): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : (parsed.items || []);
  } catch {
    return [];
  }
};

const saveItemsToStorage = (key: string, items: WishlistItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn('[Wishlist save error]:', err);
  }
};

const getInitialUserId = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const userRaw = localStorage.getItem('kady_customer_user');
    if (userRaw) {
      const u = JSON.parse(userRaw);
      return u?.id || u?.username || null;
    }
  } catch {}
  return null;
};

const initialUserId = getInitialUserId();
const initialKey = getWishlistStorageKey(initialUserId);
const initialItems = loadItemsFromStorage(initialKey);

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  userId: initialUserId,
  items: initialItems,

  addItem: (item) => {
    if (get().isWishlisted(item.product_id)) return;
    const newItem: WishlistItem = {
      ...item,
      added_at: new Date().toISOString(),
    };
    const nextItems = [newItem, ...get().items];
    set({ items: nextItems });

    const key = getWishlistStorageKey(get().userId);
    saveItemsToStorage(key, nextItems);

    // Đồng bộ lên MongoDB và ghi nhận Interaction ngầm (event_type="wishlist", rating=4.0)
    const token = getCustomerToken();
    if (token) {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
      fetch(`${apiUrl}/users/wishlist/${item.product_id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch((e) => console.warn('[Wishlist API error]:', e));
    }
  },

  removeItem: (product_id) => {
    const nextItems = get().items.filter((i) => i.product_id !== product_id);
    set({ items: nextItems });

    const key = getWishlistStorageKey(get().userId);
    saveItemsToStorage(key, nextItems);

    // Đồng bộ xóa khỏi MongoDB
    const token = getCustomerToken();
    if (token) {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
      fetch(`${apiUrl}/users/wishlist/${product_id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch((e) => console.warn('[Wishlist API error]:', e));
    }
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

  clearAll: () => {
    set({ items: [] });
    const key = getWishlistStorageKey(get().userId);
    saveItemsToStorage(key, []);
  },

  switchUserWishlist: (newUserId) => {
    const currentUserId = get().userId;
    if (currentUserId === newUserId) return;

    // Lưu wishlist của tài khoản cũ
    const oldKey = getWishlistStorageKey(currentUserId);
    saveItemsToStorage(oldKey, get().items);

    // Nạp wishlist của tài khoản mới
    const newKey = getWishlistStorageKey(newUserId);
    const loaded = loadItemsFromStorage(newKey);
    set({ userId: newUserId, items: loaded });

    // Đồng bộ với backend cho tài khoản mới
    get().syncWithBackend();
  },

  syncWithBackend: async () => {
    const token = getCustomerToken();
    if (!token) return;

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
      const res = await fetch(`${apiUrl}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          const backendItems: WishlistItem[] = data.products.map((p: BackendWishlistProduct) => ({
            product_id: p.product_id,
            name: p.name,
            price: p.price,
            image_url: p.image_url,
            category: Array.isArray(p.category) ? p.category[0] : (p.category || 'Thể Thao'),
            discount_percent: p.discount_percent,
            original_price: p.original_price,
            added_at: new Date().toISOString(),
          }));

          const currentItems = get().items;
          const currentMap = new Map(currentItems.map((i) => [i.product_id, i]));
          const merged: WishlistItem[] = backendItems.map((bi) => {
            const existing = currentMap.get(bi.product_id);
            return existing ? { ...existing, ...bi } : bi;
          });

          set({ items: merged });
          saveItemsToStorage(getWishlistStorageKey(get().userId), merged);
        } else if (Array.isArray(data.product_ids) && data.product_ids.length === 0 && get().items.length > 0) {
          // Nếu MongoDB chưa có nhưng Local có, đồng bộ local lên MongoDB
          const localItems = get().items;
          for (const item of localItems) {
            fetch(`${apiUrl}/users/wishlist/${item.product_id}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {});
          }
        }
      }
    } catch (e) {
      console.warn('[Wishlist sync error]:', e);
    }
  },
}));
