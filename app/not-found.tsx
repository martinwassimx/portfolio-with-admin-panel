import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="glow-orb w-[450px] h-[450px] bg-cyan-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-md">
        <span className="text-7xl sm:text-9xl font-black gradient-text tracking-tighter">
          404
        </span>
        <h1 className="text-2xl font-bold text-white mt-4 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-400 mb-8">
          The requested page or project case study could not be located or is unpublished.
        </p>

        <Link
          href="/"
          className="btn-primary py-3 px-6 text-sm inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
