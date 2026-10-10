import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2.5',
    }[size];

    let dynamicStyle: React.CSSProperties = { ...style };

    if (variant === 'primary') {
      dynamicStyle = {
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
        color: '#07090f',
        boxShadow: '0 0 24px color-mix(in srgb, var(--accent) 40%, transparent)',
        ...dynamicStyle,
      };
    } else if (variant === 'outline') {
      dynamicStyle = {
        borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
        color: 'var(--accent)',
        ...dynamicStyle,
      };
    }

    const variantStyles = {
      primary:
        'font-bold hover:opacity-95 hover:shadow-[0_0_32px_rgba(255,255,255,0.2)]',
      secondary:
        'bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 hover:border-white/25 backdrop-blur-md',
      outline:
        'border bg-transparent hover:bg-white/5',
      ghost:
        'text-gray-400 hover:text-white hover:bg-white/5',
      danger:
        'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${sizeStyles} ${variantStyles} ${className}`}
        style={dynamicStyle}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
