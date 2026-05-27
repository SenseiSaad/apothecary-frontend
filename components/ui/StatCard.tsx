import React from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: string;
    color?: string;
    bgColor?: string;
    showProgress?: boolean;
    progressValue?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    change,
    color = 'from-blue-500 to-blue-600',
    bgColor = 'bg-blue-50',
    showProgress = false,
    progressValue = 75,
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 group">
            {icon && change && (
                <div className="flex items-center justify-between mb-4">
                    <div
                        className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}
                    >
                        {icon}
                    </div>
                    <span className="text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                        {change}
                    </span>
                </div>
            )}
            {icon && !change && (
                <div
                    className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                    {icon}
                </div>
            )}
            <h3 className="text-gray-600 text-sm mb-1">{label}</h3>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {showProgress && (
                <div className={`mt-3 h-1 ${bgColor} rounded-full overflow-hidden`}>
                    <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                        style={{ width: `${progressValue}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
};
