'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-xl backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--accent)',
        boxShadow: '0 0 20px color-mix(in srgb, var(--accent) 25%, transparent)',
      }}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
