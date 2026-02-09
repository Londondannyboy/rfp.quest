import { Metadata } from 'next';
import { neon } from '@neondatabase/serverless';
import { AnalysisPageClient } from './client';

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

async function getExistingAnalysis(ocid: string) {
  const sql = neon(process.env.DATABASE_URL!);

  const result = await sql`
    SELECT id, status, framework_type, summary, compliance, gap_analysis,
           created_at, completed_at
    FROM tender_analyses
    WHERE tender_ocid = ${ocid}
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (result.length === 0) return null;

  const row = result[0];
  return {
    id: row.id as string,
    status: row.status as string,
    frameworkType: row.framework_type as string | null,
    summary: row.summary as Record<string, unknown> | null,
    compliance: row.compliance as Record<string, unknown> | null,
    gapAnalysis: row.gap_analysis as Record<string, unknown> | null,
    createdAt: row.created_at as string,
    completedAt: row.completed_at as string | null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ocid } = await params;
  const tender = await getTender(ocid);

  if (!tender) {
    return {
      title: 'Analysis Not Found | RFP.quest',
      description: 'The requested tender could not be found.',
    };
  }

  return {
    title: `Analyze: ${tender.title} | RFP.quest`,
    description: `AI-powered analysis of ${tender.buyerName} tender. Get compliance checklist, gap analysis, and bid recommendations.`,
    robots: {
      index: false, // Don't index analysis pages
      follow: true,
    },
  };
}

export default async function AnalysisPage({ params }: Props) {
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

  // Check for existing analysis
  const existingAnalysis = await getExistingAnalysis(tender.ocid);

  return <AnalysisPageClient tender={tender} existingAnalysis={existingAnalysis} />;
}
