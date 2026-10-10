'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/Icons';
import { SiteSettings, SocialLink } from '../../lib/db/types';

interface FooterProps {
  siteSettings: SiteSettings;
  socialLinks: SocialLink[];
}

export function Footer({ siteSettings, socialLinks }: FooterProps) {
  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'github':
        return <GithubIcon className="w-4 h-4" />;
      case 'linkedin':
        return <LinkedinIcon className="w-4 h-4" />;
      case 'twitter':
        return <TwitterIcon className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-[var(--bg)] overflow-hidden pt-16 pb-12 transition-colors duration-300">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/5">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white transition-colors"
            >
              {siteSettings.logo_text || 'MW'}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              {siteSettings.site_tagline || 'Founder of Systemize EG • Software & AI/ML Engineer'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks
              .filter((s) => s.is_visible)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 transition-all duration-200 hover:scale-105"
                  style={{
                    // dynamic hover will be applied via inline CSS variables
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 45%, transparent)';
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 15%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '';
                    e.currentTarget.style.borderColor = '';
                    e.currentTarget.style.backgroundColor = '';
                  }}
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.icon)}
                </a>
              ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <div
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 {siteSettings.logo_text || 'Portfolio'}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-gray-500">Crafted with Next.js, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
