'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, LogOut, Database, UserCheck } from 'lucide-react';
import { AdminUser, logoutAdmin } from '../../lib/security/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  title: string;
  user: AdminUser | null;
}

export function AdminHeader({ onOpenSidebar, title, user }: AdminHeaderProps) {
  const isConnected = isSupabaseConfigured();

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <header className="h-16 bg-[#0a0f1d]/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* Right: Database Status + User + Logout */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Supabase Connection Status Pill */}
        <Link
          href="/admin/setup"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            isConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
          }`}
          title="Click to view database connection status and migration instructions"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isConnected ? 'Supabase Connected' : 'Local / Setup Mode'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
            }`}
          />
        </Link>

        {/* User Identity */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-300">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
          <span>{user?.email || 'admin@portfolio.local'}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
          title="Logout"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
