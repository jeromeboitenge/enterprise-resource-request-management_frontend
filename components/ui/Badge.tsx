// Reusable Badge Component

'use client';

import React from 'react';
import { RequestStatus, Priority } from '@/lib/types';
import { STATUSES, PRIORITIES } from '@/lib/constants';

type BadgeVariant = 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange' | 'teal';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    gray: 'bg-gray-100 text-gray-800',
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800',
    teal: 'bg-teal-100 text-teal-800',
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'gray',
    className = '',
}) => {
    const classes = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
};

interface StatusBadgeProps {
    status: RequestStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusInfo = STATUSES[status];
    return (
        <Badge variant={statusInfo.color as BadgeVariant}>
            {statusInfo.label}
        </Badge>
    );
};

interface PriorityBadgeProps {
    priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
    const priorityInfo = PRIORITIES[priority];
    return (
        <Badge variant={priorityInfo.color as BadgeVariant}>
            {priorityInfo.label}
        </Badge>
    );
};
