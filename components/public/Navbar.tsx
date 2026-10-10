'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { NavigationItem, SiteSettings } from '../../lib/db/types';

interface NavbarProps {
  navItems: NavigationItem[];
  siteSettings: SiteSettings;
}

export function Navbar({ navItems, siteSettings }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Scrollspy active section
      const sections = ['about', 'skills', 'projects', 'education', 'experience', 'certifications', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const visibleNav = navItems.filter((i) => i.is_visible).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Announcement Banner (Clean Top Ribbon) */}
        {siteSettings.announcement_banner_enabled && (
          <div
            className="border-b py-2 px-4 text-center text-xs font-semibold backdrop-blur-md"
            style={{
              background:
                'linear-gradient(90deg, color-mix(in srgb, var(--accent) 18%, transparent), color-mix(in srgb, var(--accent-2) 18%, transparent))',
              borderColor: 'color-mix(in srgb, var(--accent) 25%, transparent)',
              color: 'var(--text)',
            }}
          >
            {siteSettings.announcement_banner_text ||
              '🚀 Open for Full-Stack & AI Engineering Opportunities'}
          </div>
        )}

        {/* Main Navigation Row */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? 'bg-[var(--bg)]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3'
              : 'bg-[var(--bg)]/70 backdrop-blur-md border-b border-white/5 py-4'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <span className="text-xl font-bold tracking-tight text-white transition-colors">
                {(siteSettings.logo_text || 'MW').replace(/\.+$/, '')}
                <span style={{ color: 'var(--accent)' }}>.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              <nav className="flex items-center gap-0.5 lg:gap-1.5">
                {visibleNav.map((item) => {
                  const target = item.href.replace('/#', '').replace('#', '');
                  const isActive = activeSection === target;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`px-3 lg:px-3.5 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'font-bold'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      style={
                        isActive
                          ? {
                              color: 'var(--accent)',
                              backgroundColor: 'color-mix(in srgb, var(--accent) 14%, transparent)',
                              boxShadow: '0 0 14px color-mix(in srgb, var(--accent) 25%, transparent)',
                            }
                          : {}
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Right Controls: Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--bg)]/95 backdrop-blur-2xl flex flex-col pt-28 px-6 md:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col gap-3">
            {visibleNav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-lg font-medium text-gray-200 hover:text-white rounded-xl border border-transparent hover:border-white/10 transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 12%, transparent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '';
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
