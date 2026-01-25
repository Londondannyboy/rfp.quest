import { sql } from '@/lib/db';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await sql`
    SELECT slug, updated_at, intent, search_volume
    FROM pages
    WHERE status IN ('draft', 'published')
    ORDER BY search_volume DESC
  `;

  const baseUrl = 'https://rfp.quest';

  return pages.map((page) => {
    const isHomepage = page.slug === '/';
    return {
      url: isHomepage ? baseUrl : `${baseUrl}${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: (page.intent === 'commercial' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: isHomepage ? 1.0 : page.intent === 'commercial' ? 0.9 : 0.8,
    };
  });
}
