import React from 'react';

interface BarChartProps {
    data: Array<{
        label: string;
        value: number;
        tooltip?: string;
    }>;
    color?: string;
    hoverColor?: string;
    height?: string;
    showLabels?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
    data,
    color = 'bg-primary',
    hoverColor = 'hover:bg-primary-dark',
    height = 'h-64',
    showLabels = true,
}) => {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className={`${height} flex items-end justify-around space-x-2`}>
            {data.map((item, index) => {
                const barHeight = (item.value / maxValue) * 100;
                return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                        <div
                            className={`w-full ${color} ${hoverColor} rounded-t-lg transition-all cursor-pointer shadow-md`}
                            style={{ height: `${barHeight}%` }}
                            title={item.tooltip || `${item.label}: ${item.value}`}
                        ></div>
                        {showLabels && (
                            <span className="text-xs text-gray-500 mt-2 font-medium">
                                {item.label}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
