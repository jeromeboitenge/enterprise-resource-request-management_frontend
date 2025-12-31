// Authentication Utilities

import { User, UserRole } from './types';

export const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const isAuthenticated = (): boolean => {
    return !!getStoredToken();
};

export const hasRole = (user: User | null, roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
};

export const canApprove = (user: User | null): boolean => {
    if (!user) return false;
    return ['manager', 'department_head', 'finance', 'admin'].includes(user.role);
};

export const canManageUsers = (user: User | null): boolean => {
    return hasRole(user, 'admin');
};

export const canViewAllRequests = (user: User | null): boolean => {
    if (!user) return false;
    return ['finance', 'admin'].includes(user.role);
};

export const canManageDepartments = (user: User | null): boolean => {
    return hasRole(user, 'admin');
};

export const canViewAuditLogs = (user: User | null): boolean => {
    return hasRole(user, 'admin');
};

export const getDashboardRoute = (role: UserRole): string => {
    const routes: Record<UserRole, string> = {
        employee: '/employee',
        manager: '/manager',
        department_head: '/department-head',
        finance: '/finance',
        admin: '/admin',
    };
    return routes[role] || '/employee';
};

export const clearAuth = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
