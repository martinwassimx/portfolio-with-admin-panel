'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeSettings, SiteSettings } from '../db/types';
import { DEFAULT_THEME_SETTINGS, DEFAULT_SITE_SETTINGS } from '../db/defaults';
import { getThemeSettings, getSiteSettings } from '../db/store';

interface ThemeContextType {
  theme: ThemeSettings;
  siteSettings: SiteSettings;
  previewTheme: (newTheme: Partial<ThemeSettings>) => void;
  resetPreview: () => void;
  refreshTheme: () => Promise<void>;
  isLivePreview: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME_SETTINGS,
  siteSettings: DEFAULT_SITE_SETTINGS,
  previewTheme: () => {},
  resetPreview: () => {},
  refreshTheme: async () => {},
  isLivePreview: false,
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeSettings;
  initialSiteSettings?: SiteSettings;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialSiteSettings,
}: ThemeProviderProps) {
  const [persistedTheme, setPersistedTheme] = useState<ThemeSettings>(
    initialTheme || DEFAULT_THEME_SETTINGS
  );
  const [activeTheme, setActiveTheme] = useState<ThemeSettings>(
    initialTheme || DEFAULT_THEME_SETTINGS
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(
    initialSiteSettings || DEFAULT_SITE_SETTINGS
  );
  const [isLivePreview, setIsLivePreview] = useState<boolean>(false);

  const applyThemeVariables = (t: ThemeSettings, s: SiteSettings) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    const dynamicGlow = t.accent_glow || `color-mix(in srgb, ${t.primary_color} 35%, transparent)`;

    root.style.setProperty('--bg', t.bg_color);
    root.style.setProperty('--bg-2', t.bg_secondary);
    root.style.setProperty('--bg-card', t.card_bg);
    root.style.setProperty('--border', t.card_border || 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--border-glow', dynamicGlow);
    root.style.setProperty('--accent', t.primary_color);
    root.style.setProperty('--accent-2', t.secondary_color);
    root.style.setProperty('--accent-3', t.accent_color);
    root.style.setProperty('--text', t.text_primary);
    root.style.setProperty('--text-muted', t.text_muted);
    root.style.setProperty('--text-dim', t.text_dim);
    root.style.setProperty('--gradient-start', t.gradient_start);
    root.style.setProperty('--gradient-middle', t.gradient_middle);
    root.style.setProperty('--gradient-end', t.gradient_end);
    root.style.setProperty('--radius', t.border_radius);
    root.style.setProperty('--glow-opacity', t.glow_intensity.toString());
    root.style.setProperty('--grid-opacity', t.grid_opacity.toString());

    if (document.body) {
      document.body.style.backgroundColor = t.bg_color;
      document.body.style.color = t.text_primary;
    }
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = t.bg_color;
    }

    // Custom CSS injection safely into a dedicated style tag
    let customStyleTag = document.getElementById('portfolio-custom-css');
    if (s.custom_css) {
      if (!customStyleTag) {
        customStyleTag = document.createElement('style');
        customStyleTag.id = 'portfolio-custom-css';
        document.head.appendChild(customStyleTag);
      }
      customStyleTag.textContent = s.custom_css;
    } else if (customStyleTag) {
      customStyleTag.remove();
    }
  };

  const loadData = async () => {
    try {
      const [t, s] = await Promise.all([getThemeSettings(), getSiteSettings()]);
      setPersistedTheme(t);
      setActiveTheme(t);
      setSiteSettings(s);
      applyThemeVariables(t, s);
    } catch (e) {
      console.error('Error loading theme and site settings:', e);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('portfolio_db_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('portfolio_db_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const previewTheme = (partial: Partial<ThemeSettings>) => {
    const nextTheme = { ...activeTheme, ...partial };
    setActiveTheme(nextTheme);
    setIsLivePreview(true);
    applyThemeVariables(nextTheme, siteSettings);
  };

  const resetPreview = () => {
    setActiveTheme(persistedTheme);
    setIsLivePreview(false);
    applyThemeVariables(persistedTheme, siteSettings);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        siteSettings,
        previewTheme,
        resetPreview,
        refreshTheme: loadData,
        isLivePreview,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
