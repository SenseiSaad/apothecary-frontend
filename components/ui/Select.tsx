import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    helperText?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all disabled:bg-gray-100 ${className}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
