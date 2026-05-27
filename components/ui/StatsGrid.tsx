import React from 'react';

interface Stat {
    value: string;
    label: string;
}

interface StatsGridProps {
    stats: Stat[];
    columns?: 2 | 3 | 4;
    className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, columns = 3, className = '' }) => {
    return (
        <div className={`grid grid-cols-${columns} gap-6 ${className}`}>
            {stats.map((stat, index) => (
                <div key={index}>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};
