import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: "order" | "promotion" | "ai_recommend" | "admin_message";
  voucher_code?: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (userIdOrEmail?: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userIdOrEmail?: string) => Promise<void>;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

  fetchNotifications: async (userIdOrEmail?: string) => {
    const token = typeof window !== 'undefined' 
      ? (localStorage.getItem('kady_customer_token') || localStorage.getItem('token'))
      : null;
    // Khách vãng lai chưa đăng nhập: Tuyệt đối không gọi API, xóa sạch badge
    if (!userIdOrEmail && !token) {
      set({ notifications: [], unreadCount: 0, loading: false });
      return;
    }

    try {
      set({ loading: true });
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const params = new URLSearchParams();
      if (userIdOrEmail) {
        params.append('user_id', userIdOrEmail);
      }

      const url = `http://localhost:8000/api/v1/notifications${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { headers });

      if (res.ok) {
        const data = await res.json();
        set({
          notifications: data.notifications || [],
          unreadCount: data.unread_count || 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      // Optimistic update
      const currentList = get().notifications;
      const updatedList = currentList.map(n => 
        (n.notification_id === notificationId || n.id === notificationId)
          ? { ...n, is_read: true }
          : n
      );
      const newUnread = updatedList.filter(n => !n.is_read).length;
      set({ notifications: updatedList, unreadCount: newUnread });

      await fetch(`http://localhost:8000/api/v1/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  },

  markAllAsRead: async (userIdOrEmail?: string) => {
    try {
      const currentList = get().notifications;
      const updatedList = currentList.map(n => ({ ...n, is_read: true }));
      set({ notifications: updatedList, unreadCount: 0 });

      const params = new URLSearchParams();
      if (userIdOrEmail) params.append('user_id', userIdOrEmail);

      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('kady_customer_token') || localStorage.getItem('token'))
        : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`http://localhost:8000/api/v1/notifications/read-all${params.toString() ? `?${params.toString()}` : ''}`, {
        method: 'PUT',
        headers
      });
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }
}));
