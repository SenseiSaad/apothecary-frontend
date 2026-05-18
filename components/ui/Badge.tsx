import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}
        >
            {children}
        </span>
    );
};

// Helper function to get badge variant based on status
export const getStatusBadgeVariant = (status: string): BadgeVariant => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'paid' || statusLower === 'completed') {
        return 'success';
    }
    if (statusLower === 'pending' || statusLower === 'on hold') {
        return 'warning';
    }
    if (statusLower === 'inactive' || statusLower === 'overdue' || statusLower === 'cancelled') {
        return 'error';
    }
    return 'default';
};
