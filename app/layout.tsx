import type { Metadata } from 'next';
import { Syne, DM_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../lib/theme/ThemeProvider';
import { getThemeSettings, getSiteSettings } from '../lib/db/server-store';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Portfolio | Software Engineer',
  description: 'Personal software engineering and builder portfolio.',
  metadataBase: new URL('https://example.com'),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, siteSettings] = await Promise.all([
    getThemeSettings(),
    getSiteSettings(),
  ]);

  const isCyanAccent = theme.primary_color?.toLowerCase() === '#00c8ff';
  const dynamicGlow =
    theme.accent_glow && (isCyanAccent || !theme.accent_glow.includes('0, 200, 255'))
      ? theme.accent_glow
      : `color-mix(in srgb, ${theme.primary_color} 38%, transparent)`;

  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} dark h-full antialiased`}
      style={{
        backgroundColor: theme.bg_color,
        color: theme.text_primary,
      }}
    >
      <head>
        <style
          id="theme-ssr-vars"
          dangerouslySetInnerHTML={{
            __html: `
:root {
  --bg: ${theme.bg_color};
  --bg-2: ${theme.bg_secondary};
  --bg-card: ${theme.card_bg};
  --border: ${theme.card_border || 'rgba(255, 255, 255, 0.08)'};
  --border-glow: ${dynamicGlow};
  --accent: ${theme.primary_color};
  --accent-2: ${theme.secondary_color};
  --accent-3: ${theme.accent_color};
  --text: ${theme.text_primary};
  --text-muted: ${theme.text_muted};
  --text-dim: ${theme.text_dim};
  --gradient-start: ${theme.gradient_start};
  --gradient-middle: ${theme.gradient_middle};
  --gradient-end: ${theme.gradient_end};
  --radius: ${theme.border_radius};
  --glow-opacity: ${theme.glow_intensity};
  --grid-opacity: ${theme.grid_opacity};
}
body {
  background-color: ${theme.bg_color} !important;
  color: ${theme.text_primary} !important;
}
${siteSettings.custom_css || ''}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <ThemeProvider initialTheme={theme} initialSiteSettings={siteSettings}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
