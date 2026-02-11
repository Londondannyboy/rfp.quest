import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

export interface BidSummary {
  documentId: string;
  tenderOcid: string;
  fileName: string;
  contractTitle: string | null;
  buyerName: string | null;
  submissionDeadline: string | null;
  analysisStatus: string;
  totalRequirements: number;
  completedResponses: number;
  draftResponses: number;
  completionPercentage: number;
  lastUpdated: string;
  uploadedAt: string;
}

// GET /api/my-bids - Get all bids the user is working on
export async function GET() {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ bids: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Get all documents with their requirements and response counts
    const bidsResult = await sql`
      SELECT
        td.id as document_id,
        td.tender_ocid,
        td.file_name,
        td.analysis_status,
        td.analysis_result,
        td.uploaded_at,
        td.updated_at,
        COUNT(DISTINCT br.id) as total_requirements,
        COUNT(DISTINCT CASE WHEN resp.status = 'complete' THEN resp.id END) as completed_responses,
        COUNT(DISTINCT CASE WHEN resp.status = 'draft' THEN resp.id END) as draft_responses,
        MAX(resp.updated_at) as last_response_update
      FROM tender_documents td
      LEFT JOIN bid_requirements br ON br.document_id = td.id
      LEFT JOIN bid_responses resp ON resp.requirement_id = br.id
        AND resp.company_profile_id = ${companyProfileId}
      WHERE td.company_profile_id = ${companyProfileId}
      AND td.analysis_status = 'completed'
      GROUP BY td.id
      ORDER BY COALESCE(MAX(resp.updated_at), td.updated_at) DESC
    `;

    const bids: BidSummary[] = bidsResult.map((row) => {
      const analysis = row.analysis_result as {
        contractTitle?: string;
        buyerName?: string;
        submissionDeadline?: string;
      } | null;

      const totalReqs = Number(row.total_requirements) || 0;
      const completedResps = Number(row.completed_responses) || 0;

      return {
        documentId: row.document_id as string,
        tenderOcid: row.tender_ocid as string,
        fileName: row.file_name as string,
        contractTitle: analysis?.contractTitle || null,
        buyerName: analysis?.buyerName || null,
        submissionDeadline: analysis?.submissionDeadline || null,
        analysisStatus: row.analysis_status as string,
        totalRequirements: totalReqs,
        completedResponses: completedResps,
        draftResponses: Number(row.draft_responses) || 0,
        completionPercentage: totalReqs > 0 ? Math.round((completedResps / totalReqs) * 100) : 0,
        lastUpdated: (row.last_response_update || row.updated_at) as string,
        uploadedAt: row.uploaded_at as string,
      };
    });

    // Get summary stats
    const stats = {
      totalBids: bids.length,
      inProgress: bids.filter(b => b.completionPercentage > 0 && b.completionPercentage < 100).length,
      completed: bids.filter(b => b.completionPercentage === 100).length,
      notStarted: bids.filter(b => b.completionPercentage === 0).length,
      upcomingDeadlines: bids.filter(b => {
        if (!b.submissionDeadline) return false;
        const deadline = new Date(b.submissionDeadline);
        const now = new Date();
        const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 7;
      }).length,
    };

    return NextResponse.json({ bids, stats });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bids' },
      { status: 500 }
    );
  }
}
