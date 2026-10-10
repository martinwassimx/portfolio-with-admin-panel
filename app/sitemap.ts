import { MetadataRoute } from 'next';
import { getProjects, getSiteSettings } from '../lib/db/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteSettings = await getSiteSettings();
  const baseUrl = siteSettings.site_url || 'https://example.com';

  const publishedProjects = await getProjects({ publishedOnly: true });

  const projectUrls = publishedProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at || project.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
