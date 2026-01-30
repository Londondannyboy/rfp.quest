import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureGrid, StatsBar, TrustBadges, CTABanner } from '@/components/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

interface PageData {
  slug: string;
  title_tag: string;
  meta_description: string;
  h1: string;
  body_content: string;
  intent: string;
  cluster: string;
  hero_image?: string;
  hero_image_alt?: string;
  og_image?: string;
  json_ld?: { schemas: object[] };
  features?: Feature[];
  stats?: Stat[];
  trust_badges?: TrustBadge[];
}

async function getPage(slug: string): Promise<PageData | null> {
  const pages = await sql`
    SELECT * FROM pages WHERE slug = ${`/${slug}`} LIMIT 1
  `;
  return (pages[0] as PageData) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};

  const baseUrl = 'https://rfp.quest';

  return {
    title: page.title_tag,
    description: page.meta_description,
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
      images: page.og_image ? [{ url: page.og_image, width: 1200, height: 630, alt: page.hero_image_alt || page.h1 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.h1,
      description: page.meta_description,
      images: page.og_image ? [page.og_image] : undefined,
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

      {/* Hero Section - Enhanced with better spacing */}
      <section className={`relative overflow-hidden ${isCommercial ? 'bg-gradient-to-br from-teal-50 via-white to-teal-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900' : 'bg-gray-50 dark:bg-slate-800'}`}>
        {/* Decorative background elements for commercial pages */}
        {isCommercial && (
          <>
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100/50 dark:bg-teal-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-100/30 dark:bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </>
        )}

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`py-16 md:py-24 lg:py-32 ${page.hero_image ? 'grid md:grid-cols-2 gap-12 items-center' : ''}`}>
            <div className={page.hero_image ? '' : 'max-w-4xl mx-auto text-center'}>
              {/* Breadcrumb */}
              <nav className="mb-8">
                <ol className="flex items-center gap-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-gray-400 dark:text-gray-500">/</li>
                  <li className="text-teal-600 dark:text-teal-400 font-medium capitalize">
                    {page.cluster}
                  </li>
                </ol>
              </nav>

              {/* H1 with enhanced typography */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                {page.h1}
              </h1>

              {/* Meta description as subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {page.meta_description}
              </p>

              {/* CTA Buttons for commercial pages */}
              {isCommercial && (
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 hover:-translate-y-0.5"
                  >
                    Start Free Trial
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 font-semibold rounded-xl transition-all duration-200"
                  >
                    Watch Demo
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image */}
            {page.hero_image && (
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700">
                  <Image
                    src={page.hero_image}
                    alt={page.hero_image_alt || page.h1}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Decorative element behind image */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-teal-200/50 dark:bg-teal-900/30 rounded-2xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Bar - Show if data exists */}
      {stats && stats.length > 0 && (
        <StatsBar stats={stats} variant="gradient" />
      )}

      {/* Features Section - Show if data exists */}
      {features && features.length > 0 && (
        <FeatureGrid features={features} columns={features.length <= 4 ? (features.length as 2 | 3 | 4) : 3} />
      )}

      {/* Main Content - Enhanced prose styling and spacing */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-li:my-2 prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-table:border-collapse prose-th:bg-gray-50 dark:prose-th:bg-slate-800 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-gray-200 dark:prose-td:border-gray-700">
            <Markdown>{page.body_content}</Markdown>
          </article>
        </div>
      </section>

      {/* Trust Badges - Show if data exists */}
      {trustBadges && trustBadges.length > 0 && (
        <TrustBadges
          badges={trustBadges}
          title="Trusted by UK Organisations"
          subtitle="Aligned with UK procurement standards and professional bodies"
        />
      )}

      {/* CTA Section for commercial pages */}
      {isCommercial && (
        <CTABanner
          title="Ready to Win More Bids?"
          subtitle="Join hundreds of UK businesses using rfp.quest to create winning proposals faster. Start your free trial today — no credit card required."
          primaryCta={{ text: 'Start Free Trial', href: '/signup' }}
          secondaryCta={{ text: 'Book a Demo', href: '/demo' }}
          variant="gradient"
        />
      )}
    </>
  );
}
