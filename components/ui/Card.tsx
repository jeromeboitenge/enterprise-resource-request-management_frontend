// Reusable Card Component

'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    glass?: boolean;
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    glass = false,
    hover = false,
}) => {
    const baseClasses = 'rounded-lg p-6';
    const glassClasses = glass ? 'glass' : 'bg-white shadow-md';
    const hoverClasses = hover ? 'hover-lift cursor-pointer' : '';

    const classes = `${baseClasses} ${glassClasses} ${hoverClasses} ${className}`;

    return (
        <div className={classes}>
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
    return (
        <h3 className={`text-xl font-bold text-gray-800 ${className}`}>
            {children}
        </h3>
    );
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};
