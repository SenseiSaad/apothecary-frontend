import React from 'react';

interface Feature {
    text: string;
    icon?: React.ReactNode;
}

interface FeatureListProps {
    features: Feature[];
    className?: string;
}

export const FeatureList: React.FC<FeatureListProps> = ({ features, className = '' }) => {
    return (
        <div className={`space-y-4 ${className}`}>
            {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        {feature.icon || (
                            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </div>
                    <span className="text-lg">{feature.text}</span>
                </div>
            ))}
        </div>
    );
};
