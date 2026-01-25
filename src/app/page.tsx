import { sql } from '@/lib/db';
import { Metadata } from 'next';
import Markdown from 'react-markdown';

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
      title: 'RFP Quest - AI-Powered RFP & Tender Software',
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
      <main className="min-h-screen px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">rfp.quest</h1>
          <p className="text-lg text-gray-600">AI-powered RFP and tender management software. Coming soon.</p>
        </div>
      </main>
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

      <main className="min-h-screen px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
              {page.h1}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {page.meta_description}
            </p>
          </header>

          <article className="prose prose-lg max-w-none dark:prose-invert">
            <Markdown>{page.body_content}</Markdown>
          </article>

          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} rfp.quest. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
