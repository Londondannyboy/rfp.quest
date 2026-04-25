import { sql } from '@/lib/db';
import { Metadata } from 'next';
import Markdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { FeatureGrid, StatsBar, TrustBadges, CTABanner } from '@/components/seo';
import { HomepageClient } from '@/components/homepage-client';

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
      hero_image_alt: "RFP software RFP platform dashboard showing AI bid writing and tender discovery features",
      body_content: `# RFP Platform Quest — Leading RFP Software for UK Businesses

RFP Platform Quest is the UK's most advanced **RFP software** and **RFP platform**, designed specifically for businesses looking to win more government and private sector contracts. Our AI-powered solution streamlines the entire tender response process, from discovery to submission.

## Why Choose Our RFP Software?

Our **RFP platform** combines cutting-edge artificial intelligence with deep understanding of UK procurement requirements. Whether you're responding to government tenders through Find a Tender, or private sector RFPs, our software ensures you never miss an opportunity and always submit winning proposals.

### Key Benefits:

- **AI-Powered Bid Writing**: Generate compelling, compliant content that wins contracts
- **Automated Tender Discovery**: Never miss relevant opportunities with intelligent matching
- **Team Collaboration**: Streamline collaboration across departments and locations
- **Compliance Management**: Ensure every requirement is addressed with our tracking system
- **Performance Analytics**: Optimize your approach based on detailed win/loss analysis

## Ready to Transform Your RFP Process?

Join hundreds of UK organizations already using RFP Platform Quest to win more contracts with less effort. Our **RFP software** is launching in Q2 2026 — register early for exclusive access and special pricing.`,
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

      {/* Client-Side Interactive Components */}
      <HomepageClient page={page} />

      {/* Stats Bar */}
      {stats && stats.length > 0 && (
        <StatsBar stats={stats} variant="gradient" />
      )}

      {/* Features Section */}
      {features && features.length > 0 && (
        <FeatureGrid features={features} columns={3} />
      )}

      {/* Main Content */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          
          {/* Floating glass orbs */}
          <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3" />
          <div className="absolute bottom-1/4 left-0 w-56 h-56 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Glass morphism content container */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 ring-1 ring-slate-700/50 shadow-2xl shadow-blue-900/20 border-slate-800/50">
            <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:via-blue-100 prose-h1:to-white prose-h1:bg-clip-text prose-h1:text-transparent prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:bg-gradient-to-r prose-h2:from-white prose-h2:via-blue-100 prose-h2:to-white prose-h2:bg-clip-text prose-h2:text-transparent prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-white prose-p:leading-relaxed prose-p:mb-6 prose-p:text-slate-300 prose-li:my-2 prose-li:text-slate-300 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-300 prose-a:font-medium prose-a:transition-colors prose-strong:text-white prose-ul:text-slate-300">
              <Markdown>{page.body_content}</Markdown>
            </article>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      {trustBadges && trustBadges.length > 0 && (
        <TrustBadges badges={trustBadges} />
      )}

      {/* Call to Action */}
      <CTABanner
        title="Ready to Try Our RFP Software?"
        subtitle="Join UK businesses preparing to use RFP Platform Quest — the RFP software built for winning. Register early for exclusive access when we launch in Q2 2026."
        primaryCta={{ text: 'Register Early', href: 'https://calendly.com/my-first-quest' }}
        secondaryCta={{ text: 'Browse UK Tenders', href: '/browse-tenders' }}
        variant="gradient"
      />

      {/* SEO keyword anchor - visible at bottom of page */}
      <section className="py-12 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 ring-1 ring-slate-700/30 shadow-lg shadow-blue-900/10">
            <p className="text-sm text-slate-300 leading-relaxed">
              <strong className="text-white bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">RFP Platform Quest</strong> — The UK&apos;s leading <strong className="text-blue-400">RFP software</strong> for bid management and tender response. Your trusted <strong className="text-blue-400">RFP Platform</strong>.
            </p>
            <div className="flex justify-center mt-4">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}