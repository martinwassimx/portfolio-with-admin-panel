'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  User,
  Wrench,
  FolderKanban,
  GraduationCap,
  Briefcase,
  Mail,
  Image as ImageIcon,
  Palette,
  Layers,
  Compass,
  Search,
  Settings,
  ShieldCheck,
  History,
  X,
  ExternalLink,
  Award,
  Sparkles,
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'CV Auto-Fill', href: '/admin/cv-import', icon: Sparkles },
  { label: 'Website Content', href: '/admin/content', icon: FileText },
  { label: 'About', href: '/admin/about', icon: User },
  { label: 'Skills', href: '/admin/skills', icon: Wrench },
  { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
  { label: 'Education', href: '/admin/education', icon: GraduationCap },
  { label: 'Experience', href: '/admin/experience', icon: Briefcase },
  { label: 'Certifications', href: '/admin/certifications', icon: Award },
  { label: 'Contact Messages', href: '/admin/messages', icon: Mail },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Theme & Colors', href: '/admin/theme', icon: Palette },
  { label: 'Layout & Sections', href: '/admin/sections', icon: Layers },
  { label: 'Navigation & Footer', href: '/admin/navigation', icon: Compass },
  { label: 'SEO & Metadata', href: '/admin/seo', icon: Search },
  { label: 'Website Settings', href: '/admin/settings', icon: Settings },
  { label: 'Account & Security', href: '/admin/security', icon: ShieldCheck },
  { label: 'Activity Log', href: '/admin/activity', icon: History },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export function AdminSidebar({ isOpen, onClose, unreadCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0f1d] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <span className="text-xs font-black">AD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight leading-tight">Admin Console</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Control Panel</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16 Navigation Categories */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {ADMIN_NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,200,255,0.15)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.label === 'Contact Messages' && unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 shadow-[0_0_10px_#00c8ff]">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer: Link to Live Site */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
