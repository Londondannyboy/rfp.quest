import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

interface TenderListing {
  slug: string;
  title: string;
  buyerName: string;
  valueMax: number | null;
  tenderEndDate: string | null;
  publishedDate: string;
  stage: string;
  region: string | null;
  cpvCodes: string[] | null;
}

async function getTenders(): Promise<TenderListing[]> {
  const sql = neon(process.env.DATABASE_URL!);
  
  const result = await sql`
    SELECT slug, title, buyer_name, value_max, tender_end_date, 
           published_date, stage, region, cpv_codes
    FROM tenders 
    WHERE slug IS NOT NULL 
      AND stage NOT IN ('tenderCancellation', 'contractTermination')
      AND title IS NOT NULL
    ORDER BY published_date DESC 
    LIMIT 100
  `;

  return result.map(row => ({
    slug: row.slug as string,
    title: row.title as string,
    buyerName: (row.buyer_name as string) || 'Unknown Organisation',
    valueMax: row.value_max ? Number(row.value_max) : null,
    tenderEndDate: row.tender_end_date as string | null,
    publishedDate: row.published_date as string,
    stage: row.stage as string,
    region: row.region as string | null,
    cpvCodes: row.cpv_codes as string[] | null,
  }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Browse UK Government Tenders | Live Procurement Opportunities | RFP Quest',
    description: 'Browse the latest UK government tenders and public procurement opportunities. Find active contracts, view deadlines, and discover new business opportunities on RFP Quest.',
    keywords: [
      'UK government tenders',
      'public procurement',
      'tender opportunities',
      'government contracts',
      'UK contracts',
      'public sector opportunities',
      'tender search',
      'procurement portal'
    ],
    openGraph: {
      title: 'Browse UK Government Tenders | RFP Quest',
      description: 'Browse the latest UK government tenders and public procurement opportunities. Find active contracts and new business opportunities.',
      url: 'https://rfp.quest/browse-tenders',
      siteName: 'RFP Quest',
      type: 'website',
      images: [{ 
        url: 'https://rfp.quest/og-image.png', 
        width: 1200, 
        height: 630, 
        alt: 'Browse UK Government Tenders' 
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Browse UK Government Tenders | RFP Quest',
      description: 'Browse the latest UK government tenders and public procurement opportunities.',
      images: ['https://rfp.quest/og-image.png'],
    },
    alternates: {
      canonical: 'https://rfp.quest/browse-tenders',
    },
  };
}

function formatValue(value: number | null): string {
  if (!value) return 'Value TBC';
  if (value >= 1000000) return `£${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}K`;
  return `£${value.toLocaleString()}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'TBC';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getStageBadgeColor(stage: string): string {
  switch (stage.toLowerCase()) {
    case 'tender': return 'bg-green-100 text-green-800 border-green-200';
    case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'award': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'contract': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getCpvSector(cpvCodes: string[] | null): string {
  if (!cpvCodes || cpvCodes.length === 0) return 'General';
  
  const firstCode = cpvCodes[0];
  const division = firstCode.substring(0, 2);
  
  const sectors: Record<string, string> = {
    '45': 'Construction',
    '48': 'Software',
    '50': 'Maintenance',
    '60': 'Transport',
    '64': 'Telecommunications',
    '71': 'Engineering',
    '72': 'IT Services',
    '79': 'Business Services',
    '80': 'Education',
    '85': 'Healthcare',
    '90': 'Environmental'
  };
  
  return sectors[division] || 'Other';
}

export default async function BrowseTendersPage() {
  const tenders = await getTenders();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'UK Government Tenders',
    description: 'Browse the latest UK government tenders and public procurement opportunities',
    url: 'https://rfp.quest/browse-tenders',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Government Tender Listings',
      numberOfItems: tenders.length,
      itemListElement: tenders.slice(0, 10).map((tender, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'GovernmentService',
          name: tender.title,
          provider: {
            '@type': 'GovernmentOrganization',
            name: tender.buyerName
          },
          url: `https://rfp.quest/tender/${tender.slug}`
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  UK Government Tenders
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                  Browse the latest public procurement opportunities
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Advanced Search
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>{tenders.length} active opportunities</span>
              <span>Updated daily</span>
              <span>UK Government Data</span>
            </div>
          </div>
        </div>

        {/* Tender Listings */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-4">
            {tenders.map((tender) => (
              <div
                key={tender.slug}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium border rounded-full ${getStageBadgeColor(tender.stage)}`}
                      >
                        {tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1)}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                        {getCpvSector(tender.cpvCodes)}
                      </span>
                      {tender.region && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full">
                          {tender.region}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      <Link
                        href={`/tender/${tender.slug}`}
                        className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                      >
                        {tender.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {tender.buyerName}
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Value:</span> {formatValue(tender.valueMax)}
                      </div>
                      {tender.tenderEndDate && (
                        <div>
                          <span className="font-medium">Deadline:</span> {formatDate(tender.tenderEndDate)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Published:</span> {formatDate(tender.publishedDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex-shrink-0">
                    <Link
                      href={`/tender/${tender.slug}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 border border-teal-200 hover:border-teal-300 dark:border-teal-700 dark:hover:border-teal-600 rounded-lg transition-colors"
                    >
                      View Details
                      <ArrowRightIcon className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Need More Advanced Features?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Get AI-powered bid analysis, competitor intelligence, and personalized tender matching with our advanced platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors"
                >
                  Explore Advanced Search
                </Link>
                <Link
                  href="/tender-software"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-600 hover:text-teal-600 dark:hover:border-teal-400 dark:hover:text-teal-400 font-medium rounded-lg transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}