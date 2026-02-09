import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const AGENT_URL = process.env.AGENT_URL || 'http://localhost:8000';

/**
 * POST /api/analyze
 *
 * Start a new tender analysis job.
 * This endpoint creates a record in tender_analyses and triggers the LangGraph agent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenderOcid, rfpUploadId, userId } = body;

    if (!tenderOcid && !rfpUploadId) {
      return NextResponse.json(
        { error: 'Either tenderOcid or rfpUploadId is required' },
        { status: 400 }
      );
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Create analysis record
    const sourceType = tenderOcid ? 'find_a_tender' : 'rfp_upload';
    const result = await sql`
      INSERT INTO tender_analyses (
        user_id,
        tender_ocid,
        rfp_upload_id,
        source_type,
        status,
        started_at
      ) VALUES (
        ${userId || null},
        ${tenderOcid || null},
        ${rfpUploadId || null},
        ${sourceType},
        'pending',
        NOW()
      )
      RETURNING id
    `;

    const analysisId = result[0].id;

    // Trigger the agent (async - don't wait for completion)
    // In production, this would be a background job or message queue
    triggerAgentAnalysis(analysisId, tenderOcid, rfpUploadId).catch((err) => {
      console.error('Agent trigger failed:', err);
    });

    return NextResponse.json({
      id: analysisId,
      status: 'pending',
      message: 'Analysis started',
    });
  } catch (error) {
    console.error('Error starting analysis:', error);
    return NextResponse.json(
      { error: 'Failed to start analysis' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze?id={analysisId}
 *
 * Get analysis status and results.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const analysisId = searchParams.get('id');
    const tenderOcid = searchParams.get('tenderOcid');

    const sql = neon(process.env.DATABASE_URL!);

    let result;
    if (analysisId) {
      result = await sql`
        SELECT id, status, framework_type, summary, compliance, gap_analysis,
               created_at, completed_at, error_message
        FROM tender_analyses
        WHERE id = ${analysisId}
        LIMIT 1
      `;
    } else if (tenderOcid) {
      result = await sql`
        SELECT id, status, framework_type, summary, compliance, gap_analysis,
               created_at, completed_at, error_message
        FROM tender_analyses
        WHERE tender_ocid = ${tenderOcid}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    } else {
      return NextResponse.json(
        { error: 'Either id or tenderOcid is required' },
        { status: 400 }
      );
    }

    if (result.length === 0) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    const row = result[0];
    return NextResponse.json({
      id: row.id,
      status: row.status,
      frameworkType: row.framework_type,
      summary: row.summary,
      compliance: row.compliance,
      gapAnalysis: row.gap_analysis,
      createdAt: row.created_at,
      completedAt: row.completed_at,
      error: row.error_message,
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}

/**
 * Trigger the LangGraph agent to perform analysis.
 * This calls the FastAPI backend which runs the analysis pipeline.
 */
async function triggerAgentAnalysis(
  analysisId: string,
  tenderOcid?: string,
  rfpUploadId?: string
) {
  const sql = neon(process.env.DATABASE_URL!);

  try {
    // Fetch tender data if we have an OCID
    let tenderData = null;
    if (tenderOcid) {
      const tenderResult = await sql`
        SELECT ocid, title, description, buyer_name, value_min, value_max,
               tender_end_date, published_date, cpv_codes, region, stage
        FROM tenders
        WHERE ocid = ${tenderOcid}
        LIMIT 1
      `;
      if (tenderResult.length > 0) {
        tenderData = tenderResult[0];
      }
    }

    // Call the agent backend
    // For now, simulate the analysis since agent isn't deployed yet
    // In production: await fetch(`${AGENT_URL}/agents/tender_analyzer`, { ... })

    // Simulate analysis with mock data
    // TODO: Replace with actual agent call when deployed
    const mockAnalysis = await simulateAnalysis(tenderData);

    // Update the analysis record with results
    await sql`
      UPDATE tender_analyses
      SET
        status = 'completed',
        framework_type = ${mockAnalysis.frameworkType},
        summary = ${JSON.stringify(mockAnalysis.summary)},
        compliance = ${JSON.stringify(mockAnalysis.compliance)},
        gap_analysis = ${JSON.stringify(mockAnalysis.gapAnalysis)},
        completed_at = NOW()
      WHERE id = ${analysisId}
    `;

    console.log(`Analysis ${analysisId} completed`);
  } catch (error) {
    console.error(`Analysis ${analysisId} failed:`, error);

    // Update status to error
    await sql`
      UPDATE tender_analyses
      SET
        status = 'error',
        error_message = ${String(error)},
        completed_at = NOW()
      WHERE id = ${analysisId}
    `;
  }
}

/**
 * Simulate analysis results for development.
 * TODO: Remove when agent backend is deployed.
 */
async function simulateAnalysis(tenderData: Record<string, unknown> | null) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    frameworkType: 'open_tender',
    summary: {
      overview: {
        title: tenderData?.title || 'Unknown Tender',
        buyer: {
          name: tenderData?.buyer_name || 'Unknown Buyer',
          type: 'central_gov',
        },
        deadline: tenderData?.tender_end_date,
        publishedDate: tenderData?.published_date,
      },
      contract: {
        valueMin: tenderData?.value_min,
        valueMax: tenderData?.value_max,
        currency: 'GBP',
        type: 'services',
        procedure: 'open',
      },
      classification: {
        cpvCodes: tenderData?.cpv_codes || [],
        region: tenderData?.region,
      },
      keyDates: [],
    },
    compliance: {
      overallStatus: 'needs_review',
      complianceScore: 50,
      categories: [
        {
          name: 'Mandatory Exclusions',
          status: 'unknown',
          items: [
            {
              requirement: 'No mandatory exclusion grounds',
              status: 'unknown',
              criticality: 'mandatory',
            },
          ],
        },
        {
          name: 'Certifications',
          status: 'unknown',
          items: [
            {
              requirement: 'ISO 9001',
              status: 'unknown',
              criticality: 'desirable',
            },
            {
              requirement: 'Cyber Essentials',
              status: 'unknown',
              criticality: 'desirable',
            },
          ],
        },
        {
          name: 'Social Value',
          status: 'action_required',
          items: [
            {
              requirement: 'Social Value commitments (min 10%)',
              status: 'action_required',
              action: 'Prepare Social Value response',
              criticality: 'mandatory',
            },
          ],
        },
      ],
      actionItems: [
        {
          action: 'Review full tender documents for compliance requirements',
          priority: 'high',
          category: 'General',
          deadline: 'Before submission',
        },
        {
          action: 'Complete company profile to enable accurate compliance check',
          priority: 'high',
          category: 'Profile',
          deadline: 'ASAP',
        },
      ],
    },
    gapAnalysis: {
      overallScore: 50,
      overallStatus: 'partial_match',
      bidRecommendation: 'needs_work',
      summary:
        'Analysis is limited due to incomplete company profile. Complete your profile for accurate gap analysis.',
      dimensions: [
        {
          name: 'Technical Skills',
          score: 50,
          status: 'partial',
          matches: [],
          gaps: [
            {
              requirement: 'Technical requirements assessment',
              gap: 'Complete company profile for assessment',
              impact: 'high',
              remediation: 'Add expertise areas to company profile',
              timeframe: 'immediate',
            },
          ],
        },
        {
          name: 'Certifications',
          score: 0,
          status: 'critical_gap',
          matches: [],
          gaps: [
            {
              requirement: 'Required certifications',
              gap: 'No certifications in profile',
              impact: 'high',
              remediation: 'Add certifications to company profile',
              timeframe: 'immediate',
            },
          ],
        },
        {
          name: 'Past Performance',
          score: 0,
          status: 'critical_gap',
          matches: [],
          gaps: [
            {
              requirement: 'Relevant case studies',
              gap: 'No case studies available',
              impact: 'high',
              remediation: 'Add relevant project examples',
              timeframe: 'short_term',
            },
          ],
        },
        {
          name: 'Capacity',
          score: 50,
          status: 'partial',
          matches: [],
          gaps: [],
        },
        {
          name: 'Social Value',
          score: 25,
          status: 'gap',
          matches: [],
          gaps: [
            {
              requirement: 'Social Value commitments',
              gap: 'Limited social value evidence',
              impact: 'medium',
              remediation: 'Develop Social Value policy',
              timeframe: 'short_term',
            },
          ],
        },
      ],
      actionPlan: [
        {
          action: 'Complete company profile with services and certifications',
          category: 'Profile',
          priority: 'critical',
          deadline: 'Before analysis',
          owner: 'User',
          impact: 'Enables accurate gap analysis',
        },
      ],
      strengthsToHighlight: [],
      riskAssessment: {
        winProbability: 'low',
        keyRisks: [
          {
            risk: 'Incomplete profile prevents accurate assessment',
            likelihood: 'high',
            impact: 'high',
            mitigation: 'Complete profile before bidding',
          },
        ],
        dealBreakers: [],
      },
    },
  };
}
