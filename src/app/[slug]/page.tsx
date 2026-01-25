import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Markdown from 'react-markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPage(slug: string) {
  const pages = await sql`
    SELECT * FROM pages WHERE slug = ${`/${slug}`} LIMIT 1
  `;
  return pages[0] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const baseUrl = 'https://rfp.quest';

  return {
    title: page.title_tag,
    description: page.meta_description,
    keywords: [page.primary_keyword, ...(page.secondary_keywords || [])],
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
    openGraph: {
      title: page.h1,
      description: page.meta_description,
      url: `${baseUrl}/${slug}`,
      siteName: 'rfp.quest',
      locale: 'en_GB',
      type: page.intent === 'informational' ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.h1,
      description: page.meta_description,
    },
  };
}

export async function generateStaticParams() {
  const pages = await sql`
    SELECT slug FROM pages WHERE slug != '/'
  `;
  return pages.map((page) => ({
    slug: page.slug.replace(/^\//, ''),
  }));
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = page.json_ld as { schemas: object[] } | null;
  const faqSchema = jsonLd?.schemas?.[1] || null;
  const mainSchema = jsonLd?.schemas?.[0] || null;

  return (
    <>
      {mainSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(mainSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {page.h1}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {page.meta_description}
          </p>
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <Markdown>{page.body_content}</Markdown>
        </div>
      </article>
    </>
  );
}
