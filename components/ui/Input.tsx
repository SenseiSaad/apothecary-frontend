import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`w-full ${icon ? 'pl-10' : 'px-4'} py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-[#E67E3C] focus:border-transparent outline-none transition-all disabled:bg-gray-100 ${className}`}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
