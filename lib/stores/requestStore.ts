// Request Store using Zustand

'use client';

import { create } from 'zustand';
import { ResourceRequest, FilterOptions, PaginationParams } from '../types';
import api from '../api';

interface RequestState {
    requests: ResourceRequest[];
    currentRequest: ResourceRequest | null;
    isLoading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    fetchRequests: (params?: PaginationParams & FilterOptions) => Promise<void>;
    fetchRequestById: (id: string) => Promise<void>;
    createRequest: (requestData: any) => Promise<ResourceRequest>;
    updateRequest: (id: string, requestData: any) => Promise<void>;
    deleteRequest: (id: string) => Promise<void>;
    clearCurrentRequest: () => void;
}

export const useRequestStore = create<RequestState>((set) => ({
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,

    fetchRequests: async (params) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.getRequests(params);
            set({
                requests: response.data,
                totalPages: response.totalPages,
                currentPage: response.page,
                isLoading: false,
            });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchRequestById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const request = await api.getRequestById(id);
            set({ currentRequest: request, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
            const request = await api.createRequest(requestData);
            set({ isLoading: false });
            return request;
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateRequest: async (id: string, requestData) => {
        set({ isLoading: true, error: null });
        try {
            const request = await api.updateRequest(id, requestData);
            set({ currentRequest: request, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    deleteRequest: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await api.deleteRequest(id);
            set({ isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    clearCurrentRequest: () => {
        set({ currentRequest: null });
    },
}));
