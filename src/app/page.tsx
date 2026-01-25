import { sql } from '@/lib/db';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getHomepage() {
  const pages = await sql`
    SELECT * FROM pages WHERE slug = '/' LIMIT 1
  `;
  return pages[0] || null;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage();
  if (!page) {
    return {
      title: 'rfp.quest - AI-Powered RFP & Tender Software',
      description: 'Streamline your RFP process with AI-powered bid management software.',
    };
  }

  return {
    title: page.title_tag,
    description: page.meta_description,
    keywords: [page.primary_keyword, ...(page.secondary_keywords || [])],
    alternates: {
      canonical: 'https://rfp.quest',
    },
    openGraph: {
      title: page.h1,
      description: page.meta_description,
      url: 'https://rfp.quest',
      siteName: 'rfp.quest',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.h1,
      description: page.meta_description,
    },
  };
}

export default async function Home() {
  const page = await getHomepage();

  if (!page) {
    return (
      <div className="px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">rfp.quest</h1>
          <p className="text-lg text-gray-600">AI-powered RFP and tender management software. Coming soon.</p>
        </div>
      </div>
    );
  }

  const jsonLd = page.json_ld as { schemas: object[] } | null;
  const mainSchema = jsonLd?.schemas?.[0] || null;
  const faqSchema = jsonLd?.schemas?.[1] || null;

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
      <section className="px-4 py-16 md:py-24 bg-gradient-to-b from-teal-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
            {page.h1}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            {page.meta_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              Start Free Trial
            </Link>
            <Link
              href="/tender-software"
              className="px-8 py-3 border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 font-semibold rounded-lg transition-colors text-lg"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-lg max-w-none">
            <Markdown>{page.body_content}</Markdown>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-teal-600 dark:bg-teal-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to win more tenders?
          </h2>
          <p className="text-teal-100 text-lg mb-8">
            Join UK procurement teams using AI to write better bids, faster.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-white text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-lg"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
