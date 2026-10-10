import { MetadataRoute } from 'next';
import { getSiteSettings } from '../lib/db/store';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteSettings = await getSiteSettings();
  const baseUrl = siteSettings.site_url || 'https://example.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/api/*'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
