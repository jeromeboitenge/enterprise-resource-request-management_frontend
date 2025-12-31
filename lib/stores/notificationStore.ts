// Notification Store using Zustand

'use client';

import { create } from 'zustand';
import { Notification } from '../types';
import api from '../api';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const notifications = await api.getNotifications();
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            set({ notifications, unreadCount, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await api.markNotificationAsRead(id);
            const notifications = get().notifications.map((n) =>
                n._id === id ? { ...n, isRead: true } : n
            );
            const unreadCount = notifications.filter((n) => !n.isRead).length;
            set({ notifications, unreadCount });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    },

    markAllAsRead: async () => {
        try {
            await api.markAllNotificationsAsRead();
            const notifications = get().notifications.map((n) => ({ ...n, isRead: true }));
            set({ notifications, unreadCount: 0 });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    },
}));
