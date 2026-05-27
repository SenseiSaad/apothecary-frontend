import React from 'react';

interface ProgressBarProps {
    label?: string;
    value: number;
    maxValue?: number;
    color?: string;
    bgColor?: string;
    showValue?: boolean;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg' | string;
    height?: string;
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    label,
    value,
    maxValue,
    color = 'bg-primary',
    bgColor = 'bg-gray-200',
    showValue = true,
    showLabel = false,
    size = 'md',
    height,
    className = '',
}) => {
    const percentage = maxValue ? (value / maxValue) * 100 : value;
    const resolvedHeight = height || (size === 'sm' ? 'h-3' : size === 'lg' ? 'h-10' : 'h-8');

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {label && <span className="text-sm text-gray-600 w-20 flex-shrink-0">{label}</span>}
            <div className={`flex-1 ${bgColor} rounded-full ${resolvedHeight} relative`}>
                <div
                    className={`${color} ${resolvedHeight} rounded-full flex items-center justify-end pr-3 transition-all duration-300`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                >
                    {showValue && (
                        <span className="text-white text-sm font-medium">{showLabel ? `${value}%` : value}</span>
                    )}
                </div>
            </div>
        </div>
    );
};
