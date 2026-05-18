import React from 'react';

interface AvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className = '' }) => {
    const initial = name.charAt(0).toUpperCase();

    return (
        <div
            className={`bg-[#E67E3C] rounded-full flex items-center justify-center text-white font-bold ${sizeClasses[size]} ${className}`}
        >
            {initial}
        </div>
    );
};
