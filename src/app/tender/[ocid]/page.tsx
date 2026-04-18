import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import { TenderPageClient } from './client';

interface Props {
  params: Promise<{ ocid: string }>;
}

// Shared function to generate optimal meta description (110-160 chars)
function generateOptimalDescription(tender: any, displayTitle: string, year: number): string {
  const valueText = tender.valueMax
    ? `£${(tender.valueMax / 1000000).toFixed(1)}M`
    : 'Value TBC';
    
  const baseInfo = `${displayTitle} | ${tender.stage} UK government contract by ${tender.buyerName}${tender.region ? ` in ${tender.region}` : ''}.`;
  const valueInfo = `Contract value: ${valueText}.`;
  const callToAction = ` View tender details, deadlines, and requirements on RFP Quest.`;
  
  // Try with custom description first
  if (tender.description?.trim()) {
    const cleanDesc = tender.description.trim().replace(/\s+/g, ' ');
    const maxDescLength = 160 - valueInfo.length - callToAction.length - 3; // 3 for "... "
    
    if (cleanDesc.length <= maxDescLength) {
      const result = `${cleanDesc} ${valueInfo}${callToAction}`;
      if (result.length >= 110) return result;
    } else {
      const truncatedDesc = cleanDesc.substring(0, maxDescLength).replace(/\s+\S*$/, '');
      const result = `${truncatedDesc}... ${valueInfo}${callToAction}`;
      if (result.length >= 110) return result;
    }
  }
  
  // Fallback to base description ensuring 110-160 chars
  let fallbackDesc = `${baseInfo} ${valueInfo}${callToAction}`;
  
  if (fallbackDesc.length < 110) {
    // Add more context to reach minimum length
    const additionalInfo = ` Published ${year}. UK public procurement opportunity for registered suppliers.`;
    fallbackDesc = `${baseInfo} ${valueInfo}${additionalInfo}${callToAction}`;
  }
  
  // Ensure we don't exceed 160 characters
  if (fallbackDesc.length > 160) {
    fallbackDesc = fallbackDesc.substring(0, 157) + '...';
  }
  
  return fallbackDesc;
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
  const validStages = ['planning', 'tender', 'award', 'contract'] as const;
  const rawStage = row.stage as string;
  const stage = validStages.includes(rawStage as typeof validStages[number])
    ? (rawStage as 'planning' | 'tender' | 'award' | 'contract')
    : 'tender';
  return {
    ocid: row.ocid as string,
    slug: row.slug as string,
    title: row.title as string,
    description: row.description as string | null,
    stage,
    status: row.status as string | null,
    buyerName: (row.buyer_name as string) || 'Unknown Organisation',
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
  try {
    const { ocid } = await params;
    const tender = await getTender(ocid);

    if (!tender) {
      return {
        title: 'Tender Not Found | RFP Software Quest',
        description: 'The requested tender could not be found.',
      };
    }

    const year = new Date(tender.publishedDate).getFullYear();
    const valueText = tender.valueMax
      ? `£${(tender.valueMax / 1000000).toFixed(1)}M`
      : 'Value TBC';

    // Generate fallback title if main title is missing/empty
    const displayTitle = tender.title?.trim() || `${tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1)} Contract Opportunity`;
    
    // Smart title truncation for optimal SEO (50-60 chars)
    const truncateSmartly = (text: string, maxLength: number): string => {
      if (text.length <= maxLength) return text;
      
      // Common words to remove first to preserve meaning
      const fillerWords = [
        'and Associated Works', 'Framework Agreement', 'Services Limited', 
        'Foundation Trust', 'Borough Council', 'City Council', 'County Council',
        'NHS Trust', 'Limited', 'Ltd', 'Contract', 'Services', 'System',
        'Programme', 'Project', 'Support', 'Management', 'Solutions'
      ];
      
      let shortened = text;
      for (const filler of fillerWords) {
        if (shortened.length > maxLength) {
          shortened = shortened.replace(new RegExp(filler, 'gi'), '').trim();
        }
      }
      
      // If still too long, truncate at word boundary
      if (shortened.length > maxLength) {
        const words = shortened.split(' ');
        let result = '';
        for (const word of words) {
          if ((result + ' ' + word).trim().length <= maxLength - 3) {
            result = (result + ' ' + word).trim();
          } else {
            break;
          }
        }
        return result.length > 0 ? result + '...' : shortened.substring(0, maxLength - 3) + '...';
      }
      
      return shortened;
    };
    
    // Smart buyer name shortening
    const shortenBuyer = (name: string): string => {
      return name
        .replace(/NHS Foundation Trust/gi, 'NHS')
        .replace(/Borough Council|City Council|County Council/gi, 'Council')
        .replace(/Limited|Ltd$/gi, '')
        .replace(/University of /gi, 'Univ ')
        .replace(/Community Housing Association/gi, 'Housing')
        .trim();
    };
    
    // Calculate optimal title length (target 50-55 chars)
    const shortBuyer = shortenBuyer(tender.buyerName);
    const titleSuffix = ` | ${shortBuyer} ${year}`;
    const maxTitleLength = 55 - titleSuffix.length;
    const smartTitle = truncateSmartly(displayTitle, maxTitleLength);
    
    // SEO-optimized title: "[Smart Title] | [Short Buyer] [Year]" (50-55 chars)
    const seoTitle = `${smartTitle}${titleSuffix}`;

    // Use shared description generation function
    const seoDescription = generateOptimalDescription(tender, displayTitle, year);

    return {
      title: seoTitle,
      description: seoDescription,
    keywords: [
      displayTitle,
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
      description: seoDescription,
      type: 'article',
      url: `https://rfp.quest/tender/${tender.slug}`,
      siteName: 'RFP Software Quest',
      images: [
        {
          url: 'https://rfp.quest/og-image.png',
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
    },
    alternates: {
      canonical: `https://rfp.quest/tender/${tender.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
  } catch {
    return {
      title: 'UK Government Tender | RFP Software Quest',
      description: 'View UK government tender details, deadlines, and requirements on RFP Software Quest.',
    };
  }
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

  // Generate fallback title for this tender display
  const displayTitle = tender.title?.trim() || `${tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1)} Contract Opportunity`;
  const year = new Date(tender.publishedDate).getFullYear();

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: displayTitle,
    description: generateOptimalDescription(tender, displayTitle, year),
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
