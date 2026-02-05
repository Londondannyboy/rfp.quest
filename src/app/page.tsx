import { sql } from '@/lib/db';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureGrid, StatsBar, TrustBadges, CTABanner } from '@/components/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

interface TrustBadge {
  name: string;
  logo?: string;
  url?: string;
  description?: string;
}

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

  // Parse enhanced data
  const features = page.features as Feature[] | null;
  const stats = page.stats as Stat[] | null;
  const trustBadges = page.trust_badges as TrustBadge[] | null;

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
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              {page.h1}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              {page.meta_description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/my-first-quest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5 text-lg"
              >
                Register Early
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link
                href="/tender-software"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 font-semibold rounded-xl transition-all duration-200 text-lg"
              >
                Explore Features
              </Link>
            </div>

            {/* Hero Image */}
            {page.hero_image && (
              <div className="mt-12 relative rounded-2xl overflow-hidden shadow-2xl shadow-teal-600/10">
                <Image
                  src={page.hero_image}
                  alt={page.hero_image_alt || 'RFP platform for bid management'}
                  title={page.hero_image_alt || 'RFP platform for bid management'}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats && stats.length > 0 && (
        <StatsBar stats={stats} variant="gradient" />
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className="py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need to Win More Bids
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                AI-powered features designed for UK procurement teams
              </p>
            </div>
            <FeatureGrid features={features} columns={3} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-li:my-2 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline">
            <Markdown>{page.body_content}</Markdown>
          </article>
        </div>
      </section>

      {/* Trust Badges */}
      {trustBadges && trustBadges.length > 0 && (
        <TrustBadges
          badges={trustBadges}
          title="Built for UK Procurement"
          subtitle="Aligned with UK government standards and professional bodies"
        />
      )}

      {/* CTA Section */}
      <CTABanner
        title="Ready to Win More Bids?"
        subtitle="Join UK businesses preparing to use RFP Platform Quest. Register early for exclusive access when we launch in Q1 2026."
        primaryCta={{ text: 'Register Early', href: 'https://calendly.com/my-first-quest' }}
        secondaryCta={{ text: 'Explore Features', href: '/tender-software' }}
        variant="gradient"
      />
    </>
  );
}
