import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';

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

  // Determine page type for styling
  const isCommercial = page.intent === 'commercial';

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

      {/* Hero Section */}
      <section className={`px-4 py-12 md:py-16 ${isCommercial ? 'bg-gradient-to-b from-teal-50 to-white dark:from-slate-800 dark:to-slate-900' : 'bg-gray-50 dark:bg-slate-800'}`}>
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-teal-600">Home</Link>
            <span className="mx-2">/</span>
            <span className="capitalize">{page.cluster}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            {page.h1}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            {page.meta_description}
          </p>
          {isCommercial && (
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <Markdown>{page.body_content}</Markdown>
          </article>
        </div>
      </section>

      {/* CTA Section for commercial pages */}
      {isCommercial && (
        <section className="px-4 py-12 bg-gray-50 dark:bg-slate-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to transform your tender process?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start your free trial today. No credit card required.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
