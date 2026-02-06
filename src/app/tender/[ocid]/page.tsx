import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import { TenderPageClient } from './client';

interface Props {
  params: Promise<{ ocid: string }>;
}

async function getTender(slug: string) {
  const sql = neon(process.env.DATABASE_URL!);

  const isOcid = slug.startsWith('ocds-');
  const result = isOcid
    ? await sql`
        SELECT ocid, slug, title, description, stage, status, buyer_name, buyer_id,
               value_min, value_max, value_currency, tender_start_date, tender_end_date,
               contract_start_date, contract_end_date, published_date, cpv_codes, region
        FROM tenders WHERE ocid = ${slug} LIMIT 1
      `
    : await sql`
        SELECT ocid, slug, title, description, stage, status, buyer_name, buyer_id,
               value_min, value_max, value_currency, tender_start_date, tender_end_date,
               contract_start_date, contract_end_date, published_date, cpv_codes, region
        FROM tenders WHERE slug = ${slug} LIMIT 1
      `;

  if (result.length === 0) return null;

  const row = result[0];
  return {
    ocid: row.ocid as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string | null,
    stage: row.stage as 'planning' | 'tender' | 'award' | 'contract',
    status: row.status as string | null,
    buyerName: row.buyer_name as string,
    buyerId: row.buyer_id as string | null,
    valueMin: row.value_min ? Number(row.value_min) : null,
    valueMax: row.value_max ? Number(row.value_max) : null,
    valueCurrency: (row.value_currency as string) || 'GBP',
    tenderStartDate: row.tender_start_date as string | null,
    tenderEndDate: row.tender_end_date as string | null,
    contractStartDate: row.contract_start_date as string | null,
    contractEndDate: row.contract_end_date as string | null,
    publishedDate: row.published_date as string,
    cpvCodes: row.cpv_codes as string[] | null,
    region: row.region as string | null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ocid } = await params;
  const tender = await getTender(ocid);

  if (!tender) {
    return {
      title: 'Tender Not Found | RFP.quest',
      description: 'The requested tender could not be found.',
    };
  }

  const year = new Date(tender.publishedDate).getFullYear();
  const valueText = tender.valueMax
    ? `£${(tender.valueMax / 1000000).toFixed(1)}M`
    : 'Value TBC';

  // SEO-optimized title: "[Title] | [Buyer] Contract [Year]"
  const seoTitle = `${tender.title} | ${tender.buyerName} Contract ${year}`;

  // SEO-optimized description with keywords
  const seoDescription = tender.description
    ? `${tender.description.substring(0, 120)}... ${tender.buyerName} ${tender.stage} contract worth ${valueText}. View full details, deadlines, and requirements.`
    : `${tender.title} - ${tender.stage} UK government contract by ${tender.buyerName}${tender.region ? ` in ${tender.region}` : ''}. Contract value: ${valueText}. View tender details on RFP.quest.`;

  return {
    title: seoTitle,
    description: seoDescription.substring(0, 160),
    keywords: [
      tender.title,
      tender.buyerName,
      'UK tender',
      'government contract',
      tender.region || 'UK',
      tender.stage,
      `${year} tender`,
      'public procurement',
    ].filter(Boolean),
    openGraph: {
      title: seoTitle,
      description: seoDescription.substring(0, 200),
      type: 'article',
      url: `https://rfp.quest/tender/${tender.slug}`,
      siteName: 'RFP.quest',
      images: [
        {
          url: 'https://rfp.quest/og-tender.png',
          width: 1200,
          height: 630,
          alt: tender.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription.substring(0, 200),
    },
    alternates: {
      canonical: `https://rfp.quest/tender/${tender.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TenderPage({ params }: Props) {
  const { ocid } = await params;
  const tender = await getTender(ocid);

  if (!tender) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Tender Not Found</h1>
          <p className="text-slate-400">The requested tender could not be found.</p>
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

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: tender.title,
    description: tender.description || `${tender.stage} UK government contract`,
    provider: {
      '@type': 'GovernmentOrganization',
      name: tender.buyerName,
      areaServed: tender.region || 'United Kingdom',
    },
    areaServed: tender.region || 'United Kingdom',
    serviceType: 'Public Procurement',
    ...(tender.valueMax && {
      offers: {
        '@type': 'Offer',
        priceCurrency: tender.valueCurrency,
        price: tender.valueMax,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TenderPageClient tender={tender} />
    </>
  );
}
