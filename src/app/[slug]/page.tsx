import { sql } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureGrid, StatsBar, TrustBadges, CTABanner } from '@/components/seo';

// Enable ISR with 1-hour revalidation for SEO performance
// (removed force-dynamic which was disabling caching)
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
      siteName: 'RFP Platform Quest',
      locale: 'en_GB',
      type: page.intent === 'informational' ? 'article' : 'website',
      images: [{ url: page.og_image || `${baseUrl}/og-image.png`, width: 1200, height: 630, alt: page.hero_image_alt || page.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.h1,
      description: page.meta_description,
      images: [page.og_image || `${baseUrl}/og-image.png`],
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

      {/* Hero Section - Enhanced with ultra blue theme */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Advanced decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          
          {/* Floating glass orbs for all pages */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
          
          {/* Additional floating elements */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-slate-300/10 rounded-full blur-xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`py-16 md:py-24 lg:py-32 ${page.hero_image ? 'grid md:grid-cols-2 gap-12 items-center' : ''}`}>
            <div className={page.hero_image ? '' : 'max-w-4xl mx-auto text-center'}>
              {/* Breadcrumb */}
              <nav className="mb-8">
                <ol className="flex items-center gap-2 text-sm">
                  <li>
                    <Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors">
                      Home
                    </Link>
                  </li>
                  <li className="text-slate-500">/</li>
                  <li className="text-blue-400 font-medium capitalize">
                    {page.cluster}
                  </li>
                </ol>
              </nav>

              {/* H1 with enhanced typography and gradient text */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                {page.h1}
              </h1>

              {/* Meta description as subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                {page.meta_description}
              </p>

              {/* CTA Buttons for commercial pages */}
              {isCommercial && (
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start">
                  <a
                    href="https://calendly.com/my-first-quest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full" />
                    <span className="relative">Register Early</span>
                    <svg className="ml-2 w-5 h-5 relative group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <Link
                    href="/tender-software"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600/50 bg-slate-900/50 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 hover:bg-slate-800/50 font-semibold rounded-xl transition-all duration-300 backdrop-blur-sm"
                  >
                    Explore Features
                  </Link>
                </div>
              )}
            </div>

            {/* Hero Image */}
            {page.hero_image && (
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 ring-1 ring-slate-700/50 bg-slate-900/60 backdrop-blur-xl">
                  <Image
                    src={page.hero_image}
                    alt={page.hero_image_alt || page.h1}
                    title={page.hero_image_alt || page.h1}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                {/* Decorative element behind image */}
                <div className="absolute -z-10 -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-blue-500/30 to-slate-900/30 rounded-2xl blur-sm" />
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

      {/* Main Content - Enhanced prose styling with ultra blue theme */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_30%,transparent_100%)] opacity-10" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 ring-1 ring-slate-700/50 shadow-2xl shadow-blue-900/20">
            <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-100 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:bg-gradient-to-r prose-h2:from-white prose-h2:via-blue-100 prose-h2:to-white prose-h2:bg-clip-text prose-h2:text-transparent prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-blue-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-slate-300 prose-li:my-2 prose-li:text-slate-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-300 prose-strong:text-slate-100 prose-table:border-collapse prose-th:bg-slate-800/60 prose-th:text-slate-200 prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-slate-600/50 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-slate-600/50 prose-td:text-slate-300 prose-code:text-blue-300 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-300">
              <Markdown>{page.body_content}</Markdown>
            </article>
          </div>
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
          title="Ready to Try Our RFP Software?"
          subtitle="Join UK businesses preparing to use RFP Platform Quest — the RFP software built for winning. Register early for exclusive access when we launch in Q2 2026."
          primaryCta={{ text: 'Register Early', href: 'https://calendly.com/my-first-quest' }}
          secondaryCta={{ text: 'Explore RFP Software', href: '/' }}
          variant="gradient"
        />
      )}
    </>
  );
}
