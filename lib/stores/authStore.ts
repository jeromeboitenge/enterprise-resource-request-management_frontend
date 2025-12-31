// Authentication Store using Zustand

'use client';

import { create } from 'zustand';
import { User } from '../types';
import { getStoredUser, getStoredToken, clearAuth } from '../auth';
import api from '../api';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: getStoredUser(),
    token: getStoredToken(),
    isLoading: false,
    error: null,

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.login({ email, password });
            set({ user: response.user, token: response.token, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        api.logout();
        clearAuth();
        set({ user: null, token: null });
    },

    refreshUser: async () => {
        try {
            const user = await api.getCurrentUser();
            set({ user });
        } catch (error) {
            // Token might be invalid, clear auth
            clearAuth();
            set({ user: null, token: null });
        }
    },

    setUser: (user: User | null) => {
        set({ user });
    },
}));
