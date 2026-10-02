import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (token, user) => {
    localStorage.setItem('token', token);
    set({
      token,
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'admin'
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const user = await res.json();
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin'
        });
      } else {
        // Token invalid or expired
        localStorage.removeItem('token');
        set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
      }
    } catch (error) {
      console.error('Lỗi kiểm tra xác thực', error);
      set({ isAuthenticated: false, isAdmin: false, user: null, token: null });
    }
  }
}));
