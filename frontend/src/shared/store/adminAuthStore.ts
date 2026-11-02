import { create } from 'zustand';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: string;
  is_2fa_enabled?: boolean;
  email_notifications?: boolean;
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AdminUser) => void;
  setUser: (user: AdminUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kady_admin_token', token);
        localStorage.setItem('kady_admin_user', JSON.stringify(user));
      } catch (e) {
        console.error('Error saving admin auth to localStorage:', e);
      }
    }
    set({
      token,
      user,
      isAuthenticated: true
    });
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('kady_admin_user', JSON.stringify(user));
      } catch (e) {
        console.error('Error updating admin user:', e);
      }
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        // CHỈ xóa phiên Admin, TUYỆT ĐỐI không xóa phiên kady_customer_* của Khách hàng
        localStorage.removeItem('kady_admin_token');
        localStorage.removeItem('kady_admin_user');
        localStorage.removeItem('admin_token');
      } catch (e) {
        console.error('Error removing admin auth from localStorage:', e);
      }
    }
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('kady_admin_token') || localStorage.getItem('admin_token');
    if (!token) {
      set({ isAuthenticated: false, user: null, token: null });
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
        if (user.role === 'admin') {
          localStorage.setItem('kady_admin_user', JSON.stringify(user));
          set({
            token,
            user,
            isAuthenticated: true
          });
        } else {
          // Token không có quyền Admin -> hủy phiên Admin
          localStorage.removeItem('kady_admin_token');
          localStorage.removeItem('kady_admin_user');
          set({ isAuthenticated: false, user: null, token: null });
        }
      } else {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('kady_admin_token');
        localStorage.removeItem('kady_admin_user');
        set({ isAuthenticated: false, user: null, token: null });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra xác thực Admin:', error);
      // Fallback cache nếu mất mạng tạm thời
      const cached = localStorage.getItem('kady_admin_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.role === 'admin') {
            set({ token, user: parsed, isAuthenticated: true });
            return;
          }
        } catch {}
      }
      set({ isAuthenticated: false, user: null, token: null });
    }
  }
}));

// Tự động khôi phục nhanh trạng thái Admin trên Client từ localStorage để tránh flash màn hình
if (typeof window !== 'undefined') {
  try {
    const savedToken = localStorage.getItem('kady_admin_token') || localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('kady_admin_user');
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser && parsedUser.role === 'admin') {
        useAdminAuthStore.setState({
          token: savedToken,
          user: parsedUser,
          isAuthenticated: true
        });
      }
    }
  } catch {
    // ignore
  }
}
