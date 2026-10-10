import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, id, rows = 4, ...props }, ref) => {
    const textareaId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-[#0d1120] border ${
            error ? 'border-red-500/80 focus:border-red-400' : 'border-white/10 focus:border-[var(--accent)]'
          } rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 ${
            error ? 'focus:ring-red-400' : 'focus:ring-[var(--accent)]/40'
          } transition-all duration-200 resize-y ${className}`}
          {...props}
        />
        {helperText && !error && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
        {error && <p className="text-xs text-red-400 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
