import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import { BuyerPageClient } from './client';

interface Props {
  params: Promise<{ slug: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100);
}

async function getBuyer(slug: string) {
  const sql = neon(process.env.DATABASE_URL!);

  // Find buyer by slug match
  const buyerResult = await sql`
    SELECT DISTINCT buyer_name, buyer_id, region
    FROM tenders
    WHERE buyer_name IS NOT NULL
  `;

  const buyer = buyerResult.find(
    (b) => slugify(b.buyer_name as string) === slug
  );

  if (!buyer) return null;

  const buyerName = buyer.buyer_name as string;

  // Get tender count and total value
  const stats = await sql`
    SELECT
      COUNT(*) as total_tenders,
      COUNT(CASE WHEN stage = 'tender' THEN 1 END) as active_tenders,
      SUM(COALESCE(value_max, 0)) as total_value
    FROM tenders
    WHERE buyer_name = ${buyerName}
  `;

  return {
    name: buyerName,
    slug: slugify(buyerName),
    id: buyer.buyer_id as string | null,
    region: buyer.region as string | null,
    totalTenders: Number(stats[0].total_tenders),
    activeTenders: Number(stats[0].active_tenders),
    totalValue: Number(stats[0].total_value) || 0,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const buyer = await getBuyer(slug);

  if (!buyer) {
    return {
      title: 'Organization Not Found | RFP.quest',
      description: 'The requested organization could not be found.',
    };
  }

  const valueText = buyer.totalValue >= 1000000
    ? `£${(buyer.totalValue / 1000000).toFixed(1)}M`
    : buyer.totalValue >= 1000
    ? `£${(buyer.totalValue / 1000).toFixed(0)}K`
    : 'Various values';

  const seoTitle = `${buyer.name} Tenders & Contracts | UK Government Procurement`;
  const seoDescription = `View all ${buyer.totalTenders} UK government tenders from ${buyer.name}. ${buyer.activeTenders} active opportunities worth ${valueText}. Track procurement spending and contract history.`;

  return {
    title: seoTitle,
    description: seoDescription.substring(0, 160),
    keywords: [
      buyer.name,
      'UK tenders',
      'government contracts',
      'public procurement',
      buyer.region || 'UK',
      'contract opportunities',
    ].filter(Boolean),
    openGraph: {
      title: seoTitle,
      description: seoDescription.substring(0, 200),
      type: 'website',
      url: `https://rfp.quest/buyer/${buyer.slug}`,
      siteName: 'RFP.quest',
    },
    alternates: {
      canonical: `https://rfp.quest/buyer/${buyer.slug}`,
    },
  };
}

export default async function BuyerPage({ params }: Props) {
  const { slug } = await params;
  const buyer = await getBuyer(slug);

  if (!buyer) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Organization Not Found</h1>
          <p className="text-slate-400">The requested organization could not be found.</p>
          <a
            href="/dashboard"
            className="inline-block mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Browse All Tenders
          </a>
        </div>
      </div>
    );
  }

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: buyer.name,
    areaServed: buyer.region || 'United Kingdom',
    description: `UK government organization with ${buyer.totalTenders} procurement contracts`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BuyerPageClient buyer={buyer} />
    </>
  );
}
