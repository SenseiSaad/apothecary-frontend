import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-[#E67E3C] focus:border-transparent outline-none transition-all disabled:bg-gray-100 resize-none ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
