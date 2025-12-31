// Formatting Utilities

import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date): string => {
    try {
        return format(new Date(date), 'MMM dd, yyyy');
    } catch {
        return 'Invalid date';
    }
};

export const formatDateTime = (date: string | Date): string => {
    try {
        return format(new Date(date), 'MMM dd, yyyy HH:mm');
    } catch {
        return 'Invalid date';
    }
};

export const formatRelativeTime = (date: string | Date): string => {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
        return 'Invalid date';
    }
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
