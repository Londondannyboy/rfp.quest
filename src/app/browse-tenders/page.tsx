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
    case 'tender': return 'bg-blue-100 text-green-800 border-blue-200';
    case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'award': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'contract': return 'bg-slate-800/50 text-slate-100 border-slate-600/50';
    default: return 'bg-slate-800/50 text-slate-100 border-slate-600/50';
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
      
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        {/* Advanced decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          
          {/* Floating glass orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/15 to-slate-900/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-blue-600/15 to-slate-800/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Header */}
        <div className="relative bg-slate-900/60 backdrop-blur-xl border-b border-slate-700/50 shadow-2xl shadow-blue-900/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  UK Government Tenders
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Browse the latest public procurement opportunities
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="group relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full" />
                  <span className="relative">Advanced Search</span>
                  <ArrowRightIcon className="ml-2 w-5 h-5 relative group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">{tenders.length} active opportunities</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Updated daily</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>UK Government Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tender Listings */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-6">
            {tenders.map((tender) => (
              <div
                key={tender.slug}
                className="group relative bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1"
              >
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                
                <div className="relative flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="px-3 py-1.5 text-xs font-semibold bg-blue-900/200/20 text-green-300 border-blue-500/30 rounded-full backdrop-blur-sm">
                        {tender.stage.charAt(0).toUpperCase() + tender.stage.slice(1)}
                      </span>
                      <span className="px-3 py-1.5 text-xs font-semibold bg-blue-500/20 text-blue-300 border-blue-500/30 rounded-full backdrop-blur-sm">
                        {getCpvSector(tender.cpvCodes)}
                      </span>
                      {tender.region && (
                        <span className="px-3 py-1.5 text-xs font-semibold bg-slate-700/50 text-slate-300 border-slate-600/50 rounded-full backdrop-blur-sm">
                          {tender.region}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight">
                      <Link
                        href={`/tender/${tender.slug}`}
                        className="hover:text-blue-300 transition-colors group-hover:text-blue-200"
                      >
                        {tender.title}
                      </Link>
                    </h2>
                    
                    <p className="text-slate-300 mb-4 font-medium">
                      {tender.buyerName}
                    </p>
                    
                    <div className="flex items-center gap-8 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-medium text-slate-300">Value:</span> 
                        <span className="text-blue-300 font-semibold">{formatValue(tender.valueMax)}</span>
                      </div>
                      {tender.tenderEndDate && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span className="font-medium text-slate-300">Deadline:</span> 
                          <span className="text-amber-300 font-semibold">{formatDate(tender.tenderEndDate)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                        <span className="font-medium text-slate-300">Published:</span> 
                        <span>{formatDate(tender.publishedDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex-shrink-0">
                    <Link
                      href={`/tender/${tender.slug}`}
                      className="group/btn relative inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/30 overflow-hidden"
                    >
                      {/* Button shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-full transition-all duration-600 -translate-x-full" />
                      <span className="relative">View Details</span>
                      <ArrowRightIcon className="ml-2 w-4 h-4 relative group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Section */}
          <div className="mt-16">
            <div className="relative bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-2xl p-8 lg:p-12 shadow-2xl shadow-blue-900/20 overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-slate-500/10 rounded-2xl pointer-events-none" />
              
              {/* Content */}
              <div className="relative text-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Need More Advanced Features?
                </h3>
                <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Get AI-powered bid analysis, competitor intelligence, and personalized tender matching with our advanced platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link
                    href="/dashboard"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 -translate-x-full" />
                    <span className="relative">Explore Advanced Search</span>
                  </Link>
                  <Link
                    href="/tender-software"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-blue-300 font-semibold rounded-xl border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="relative">Learn More</span>
                  </Link>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-slate-400 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}