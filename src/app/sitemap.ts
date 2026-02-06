import { sql } from '@/lib/db';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rfp.quest';

  // Get SEO pages
  const pages = await sql`
    SELECT slug, updated_at, intent, search_volume
    FROM pages
    WHERE status IN ('draft', 'published')
    ORDER BY search_volume DESC
  `;

  // Get all tender pages
  const tenders = await sql`
    SELECT slug, updated_at, stage
    FROM tenders
    WHERE slug IS NOT NULL
    ORDER BY published_date DESC
  `;

  // SEO pages
  const seoPages: MetadataRoute.Sitemap = pages.map((page) => {
    const isHomepage = page.slug === '/';
    return {
      url: isHomepage ? baseUrl : `${baseUrl}${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
      changeFrequency: (page.intent === 'commercial' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: isHomepage ? 1.0 : page.intent === 'commercial' ? 0.9 : 0.8,
    };
  });

  // Tender pages - high priority for active tenders
  const tenderPages: MetadataRoute.Sitemap = tenders.map((tender) => ({
    url: `${baseUrl}/tender/${tender.slug}`,
    lastModified: tender.updated_at ? new Date(tender.updated_at) : new Date(),
    changeFrequency: (tender.stage === 'tender' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: tender.stage === 'tender' ? 0.8 : 0.6,
  }));

  // Dashboard page
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  return [...seoPages, ...staticPages, ...tenderPages];
}
