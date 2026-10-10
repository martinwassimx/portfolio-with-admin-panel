import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ children, className = '', glow = true, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-[#111827]/80 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300 card-glow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
