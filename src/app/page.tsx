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
      title: 'RFP Software | UK RFP Platform for AI Bid Writing',
      description: 'RFP software and RFP platform for UK teams. AI-powered bid writing, tender discovery, and proposal management to win more contracts.',
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
      siteName: 'RFP Platform Quest',
      locale: 'en_GB',
      type: 'website',
      images: [{ url: 'https://rfp.quest/og-image.png', width: 1200, height: 630, alt: 'RFP Platform Quest — RFP Software for AI Tender Writing' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.h1,
      description: page.meta_description,
      images: ['https://rfp.quest/og-image.png'],
    },
  };
}

export default async function Home() {
  let page = await getHomepage();

  if (!page) {
    // Fallback with sample data to showcase all components
    page = {
      h1: "RFP Platform Quest — AI-Powered RFP Software for UK Procurement",
      meta_description: "Transform your tender response process with RFP Platform Quest. AI-powered bid writing, tender discovery, and proposal management to win more contracts.",
      hero_image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2850&q=80",
      hero_image_alt: "Modern office workspace showing RFP software platform",
      body_content: "## Revolutionize Your RFP Process\n\nRFP Platform Quest is the UK's most advanced RFP software, designed specifically for government and private sector procurement teams. Our AI-powered platform streamlines every aspect of the tender response process.\n\n### Key Benefits\n\n- **AI-Powered Writing**: Generate compelling proposal content\n- **Tender Discovery**: Never miss an opportunity\n- **Team Collaboration**: Work together seamlessly\n- **Compliance Tracking**: Stay aligned with requirements",
      features: [
        { icon: "sparkles", title: "AI Bid Writing", description: "Generate compelling, compliant proposals with our advanced AI writing assistant" },
        { icon: "clock", title: "Tender Discovery", description: "Automatically discover relevant opportunities from government and private sources" },
        { icon: "users", title: "Team Collaboration", description: "Collaborate seamlessly with team members across different locations" },
        { icon: "shield", title: "Compliance Tracking", description: "Ensure all requirements are met with our comprehensive tracking system" },
        { icon: "chart", title: "Performance Analytics", description: "Track win rates and identify opportunities for improvement" },
        { icon: "document", title: "Template Library", description: "Access a comprehensive library of proven proposal templates" }
      ],
      stats: [
        { value: "95%", label: "Win Rate Improvement" },
        { value: "60%", label: "Time Savings", suffix: "hrs" },
        { value: "500+", label: "UK Organizations" },
        { value: "£2.5B", label: "Contract Value Won", suffix: "+" }
      ],
      trust_badges: [
        { name: "UK Government", description: "G-Cloud approved supplier" },
        { name: "ISO 27001", description: "Information security certified" },
        { name: "Cyber Essentials", description: "Government security standard" },
        { name: "Crown Commercial", description: "Framework agreement holder" }
      ]
    };
  }

  const jsonLd = page.json_ld as { schemas: object[] } | null;
  const mainSchema = jsonLd?.schemas?.[0] || null;
  const faqSchema = jsonLd?.schemas?.[1] || null;

  // WebSite schema for Google site name in search results
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RFP Platform Quest",
    "alternateName": ["RFP Platform Quest", "RFP Software", "RFP Platform", "rfp.quest"],
    "url": "https://rfp.quest",
    "description": "RFP software and RFP platform for UK teams. AI-powered bid writing, tender discovery, and proposal management to win more contracts.",
    "inLanguage": "en-GB",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://rfp.quest/dashboard?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Parse enhanced data
  const features = page.features as Feature[] | null;
  const stats = page.stats as Stat[] | null;
  const trustBadges = page.trust_badges as TrustBadge[] | null;

  return (
    <>
      {/* WebSite schema for Google site name */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
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

      {/* Enhanced Hero Section with UKSRS.org.uk Ultra Blue Styling */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex items-center">
        {/* Enhanced modern decorative background elements */}
        <div className="absolute inset-0">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Premium glass morphism decorative elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 to-slate-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-600/20 to-slate-800/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
          
          {/* Floating orbital elements */}
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-500/15 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-slate-400/15 rounded-full blur-2xl animate-pulse delay-1000" />
          <div className="absolute top-2/3 left-2/3 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500" />
          
          {/* Particle constellation */}
          <div className="absolute top-1/5 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-70"></div>
          <div className="absolute bottom-1/5 left-1/5 w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse delay-700 opacity-60"></div>
          <div className="absolute top-3/4 right-1/5 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-300 opacity-80"></div>
          <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-1500 opacity-50"></div>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-36">
          <div className="max-w-5xl mx-auto text-center">
            {/* Premium announcement badge with enhanced styling */}
            <div className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold bg-slate-900/60 text-blue-300 ring-1 ring-blue-500/30 backdrop-blur-xl shadow-lg shadow-blue-900/20 mb-10 transition-all duration-300 hover:scale-105 hover:bg-slate-800/60">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span>Coming Soon - Q2 2026</span>
              <svg className="ml-3 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.093 10.5a.75.75 0 00-1.186.918l1.875 2.416a.75.75 0 001.183.02l3.633-5.05.12-.045z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Enhanced title with gradient text effect */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-10 tracking-tight leading-[1.05] bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              <span className="block">{page.h1}</span>
            </h1>
            
            {/* Enhanced subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-300 max-w-4xl mx-auto mb-14 leading-relaxed font-light">
              {page.meta_description}
            </p>
            
            {/* Premium CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <a
                href="https://calendly.com/my-first-quest"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-2xl transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-1 hover:scale-105 text-lg"
              >
                {/* Button inner glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <span className="relative z-10">Register Early</span>
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link
                href="/browse-tenders"
                className="group relative inline-flex items-center justify-center px-10 py-5 border-2 border-slate-500 bg-slate-900/60 text-slate-100 hover:border-blue-400 hover:text-blue-300 hover:bg-blue-950/40 font-semibold rounded-2xl transition-all duration-300 text-lg backdrop-blur-xl hover:-translate-y-1"
              >
                <span className="relative z-10">Browse UK Tenders</span>
                <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>

            {/* Premium trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
              <div className="flex items-center text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-medium">UK government focused</span>
              </div>
              <div className="flex items-center text-slate-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium">AI-powered bid writing</span>
              </div>
              <div className="flex items-center text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                <span className="text-sm font-medium">Procurement specialists</span>
              </div>
            </div>

            {/* SEO Image - Hidden but important for search ranking */}
            {page.hero_image && (
              <div className="sr-only">
                <Image
                  src={page.hero_image}
                  alt="RFP software RFP platform for UK procurement teams and bid management"
                  title="RFP software RFP platform for UK procurement teams and bid management"
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            {/* Bottom decorative scroll indicator */}
            <div className="mt-16 flex justify-center">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      {stats && stats.length > 0 && (
        <StatsBar stats={stats} variant="gradient" />
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                RFP Software Features to Win More Bids
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                AI-powered RFP software features designed for UK procurement teams
              </p>
            </div>
            <FeatureGrid features={features} columns={3} />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-slate-700 prose-li:my-2 prose-li:text-slate-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-slate-800 prose-ul:text-slate-700">
            <Markdown>{page.body_content}</Markdown>
          </article>
        </div>
      </section>

      {/* Trust Badges */}
      {trustBadges && trustBadges.length > 0 && (
        <TrustBadges
          badges={trustBadges}
          title="RFP Software Built for UK Procurement"
          subtitle="Trusted RFP software aligned with UK government standards and professional bodies"
        />
      )}

      {/* CTA Section */}
      <CTABanner
        title="Ready to Try Our RFP Software?"
        subtitle="Join UK businesses preparing to use RFP Platform Quest — the RFP software built for winning. Register early for exclusive access when we launch in Q2 2026."
        primaryCta={{ text: 'Register Early', href: 'https://calendly.com/my-first-quest' }}
        secondaryCta={{ text: 'Browse UK Tenders', href: '/browse-tenders' }}
        variant="gradient"
      />

      {/* SEO keyword anchor - visible at bottom of page */}
      <section className="py-8 bg-slate-100 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            <strong className="text-slate-700">RFP Platform Quest</strong> — The UK&apos;s leading <strong className="text-slate-700">RFP software</strong> for bid management and tender response. Your trusted <strong className="text-slate-700">RFP Platform</strong>.
          </p>
        </div>
      </section>
    </>
  );
}
