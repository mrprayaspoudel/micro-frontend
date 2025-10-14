import { create } from 'zustand';
import { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  
  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  fetchNotifications: (userId: string) => Promise<void>;
  getUnreadNotifications: () => Notification[];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (notifications) => {
    const unreadCount = notifications.filter((n) => !n.read).length;
    set({ notifications, unreadCount });
  },

  addNotification: (notification) => set((state) => {
    const notifications = [notification, ...state.notifications];
    const unreadCount = notifications.filter((n) => !n.read).length;
    return { notifications, unreadCount };
  }),

  markAsRead: (id) => set((state) => {
    const notifications = state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    const unreadCount = notifications.filter((n) => !n.read).length;
    return { notifications, unreadCount };
  }),

  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map((n) => ({ ...n, read: true }));
    return { notifications, unreadCount: 0 };
  }),

  deleteNotification: (id) => set((state) => {
    const notifications = state.notifications.filter((n) => n.id !== id);
    const unreadCount = notifications.filter((n) => !n.read).length;
    return { notifications, unreadCount };
  }),

  fetchNotifications: async (userId: string) => {
    set({ loading: true });
    try {
      const companyId = localStorage.getItem('selectedCompanyId') || '1';
      const response = await fetch(`http://localhost:3000/task/${companyId}.json`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      const userNotifications = (data.notifications || []).filter(
        (n: Notification) => n.userId === userId
      );
      const unreadCount = userNotifications.filter((n: Notification) => !n.read).length;
      set({ notifications: userNotifications, unreadCount, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },

  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.read);
  },
}));
