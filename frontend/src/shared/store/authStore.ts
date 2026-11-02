import { create } from 'zustand';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';

export interface User {
  id: string;
  user_id?: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  tier?: string;
  total_spent?: number;
  loyalty_points?: number;
  interested_sports?: string[];
  shoe_size?: string;
  apparel_size?: string;
  role: string;
  is_2fa_enabled?: boolean;
  email_notifications?: boolean;
  wishlist?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kady_customer_token', token);
        localStorage.setItem('kady_customer_user', JSON.stringify(user));
        // Xóa key legacy 'token' nếu có để không lẫn với admin
        localStorage.removeItem('token');
      } catch (e) {
        console.error('Error saving customer auth:', e);
      }
    }

    const accountId = user.id || user.username;
    useCartStore.getState().switchUserCart(accountId);
    useWishlistStore.getState().switchUserWishlist(accountId);

    set({
      token,
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin'
    });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kady_customer_user', JSON.stringify(user));
      } catch (e) {
        console.error('Error updating customer user:', e);
      }
    }
    const accountId = user.id || user.username;
    useWishlistStore.getState().switchUserWishlist(accountId);
    set({
      user,
      isAdmin: user.role === 'admin'
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        // CHỈ xóa phiên Khách hàng, TUYỆT ĐỐI không xóa phiên kady_admin_* của Quản trị viên
        localStorage.removeItem('kady_customer_token');
        localStorage.removeItem('kady_customer_user');
        localStorage.removeItem('token');
      } catch (e) {
        console.error('Error clearing customer auth from localStorage:', e);
      }
    }

    // Làm sạch giỏ hàng và danh sách yêu thích của phiên làm việc đó
    useCartStore.getState().clearCartOnLogout();
    useWishlistStore.getState().switchUserWishlist(null);

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') return;

    // Đọc token của Khách hàng (ưu tiên kady_customer_token, fallback token cũ nếu có)
    const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
    if (!token) {
      // Nếu không có token khách, đảm bảo giỏ hàng không giữ phiên người dùng cũ
      if (useCartStore.getState().userId !== null) {
        useCartStore.getState().clearCartOnLogout();
      }
      useWishlistStore.getState().switchUserWishlist(null);
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
      return;
    }

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem('kady_customer_user', JSON.stringify(user));
        const accountId = user.id || user.username;
        useCartStore.getState().switchUserCart(accountId);
        useWishlistStore.getState().switchUserWishlist(accountId);
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin'
        });
      } else {
        // Token invalid or expired
        localStorage.removeItem('kady_customer_token');
        localStorage.removeItem('kady_customer_user');
        localStorage.removeItem('token');
        useCartStore.getState().clearCartOnLogout();
        useWishlistStore.getState().switchUserWishlist(null);
        set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra xác thực Khách hàng:', error);
      // Fallback cache nếu mất mạng tạm thời
      const cached = localStorage.getItem('kady_customer_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed) {
            set({ token, user: parsed, isAuthenticated: true, isAdmin: parsed.role === 'admin' });
            return;
          }
        } catch {}
      }
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
    }
  }
}));

// Tự động khôi phục nhanh trạng thái Khách hàng trên Client từ localStorage
if (typeof window !== 'undefined') {
  try {
    const savedToken = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
    const savedUser = localStorage.getItem('kady_customer_user');
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser) {
        useAuthStore.setState({
          token: savedToken,
          user: parsedUser,
          isAuthenticated: true,
          isAdmin: parsedUser.role === 'admin'
        });
      }
    }
  } catch {
    // ignore
  }
}

export function getUserInitials(user: { full_name?: string; username?: string } | null | undefined): string {
  if (!user) return "KD";
  const fullName = (user.full_name || "").trim();
  if (fullName) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  const username = (user.username || "").trim();
  if (username) {
    return username.slice(0, 2).toUpperCase();
  }
  return "KD";
}
