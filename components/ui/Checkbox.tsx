import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex items-start">
                <input
                    ref={ref}
                    type="checkbox"
                    className={`h-4 w-4 text-[#E67E3C] focus:ring-[#E67E3C] border-gray-300 rounded mt-1 ${className}`}
                    {...props}
                />
                {label && (
                    <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700">
                        {label}
                    </label>
                )}
                {error && <p className="text-xs text-red-500 mt-1 ml-6">{error}</p>}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';
