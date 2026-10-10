import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'outline';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'cyan', className = '', size = 'sm' }: BadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  if (variant === 'cyan') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
          color: 'var(--accent)',
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'blue') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-2) 14%, transparent)',
          color: 'var(--accent-2)',
          borderColor: 'color-mix(in srgb, var(--accent-2) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'purple') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-3) 14%, transparent)',
          color: 'var(--accent-3)',
          borderColor: 'color-mix(in srgb, var(--accent-3) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'green') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
          color: 'var(--accent)',
          borderColor: 'color-mix(in srgb, var(--accent) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'amber') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-2) 14%, transparent)',
          color: 'var(--accent-2)',
          borderColor: 'color-mix(in srgb, var(--accent-2) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  if (variant === 'red') {
    return (
      <span
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent-3) 14%, transparent)',
          color: 'var(--accent-3)',
          borderColor: 'color-mix(in srgb, var(--accent-3) 35%, transparent)',
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm select-none transition-colors ${sizeClasses} ${className}`}
      >
        {children}
      </span>
    );
  }

  const variantClasses = {
    outline: 'bg-transparent text-gray-300 border border-white/10',
  }[variant] || 'bg-white/5 text-gray-300 border border-white/10';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full backdrop-blur-sm select-none transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
}
