import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface ExtractedRequirement {
  number: string;
  title: string;
  description: string;
  type: 'mandatory' | 'desirable' | 'informational';
  wordLimit?: number;
  weighting?: number;
  scoringCriteria?: string;
}

interface TenderAnalysis {
  summary: string;
  evaluationMethodology?: string;
  requirements: ExtractedRequirement[];
  keyThemes: string[];
  suggestedApproach?: string;
}

const TENDER_ANALYSIS_PROMPT = `You are an expert UK government bid consultant. Analyze this tender notice and extract the key requirements that a bidder would need to address.

Based on the tender title, description, sector (CPV codes), and buyer information, identify:

1. **Implied Requirements**: What capabilities, experience, or qualifications would a bidder need to demonstrate?
2. **Key Themes**: What are the main focus areas (e.g., quality, innovation, social value, sustainability)?
3. **Suggested Response Sections**: Break down into logical sections a bidder should address

Return a JSON object:
{
  "summary": "2-3 sentence summary of what the buyer is looking for",
  "evaluationMethodology": "Likely evaluation approach based on tender type",
  "requirements": [
    {
      "number": "1",
      "title": "Brief title",
      "description": "What the bidder should address/demonstrate",
      "type": "mandatory|desirable|informational",
      "wordLimit": 500,
      "weighting": null,
      "scoringCriteria": "How this would typically be scored"
    }
  ],
  "keyThemes": ["Theme 1", "Theme 2"],
  "suggestedApproach": "Brief advice on winning strategy"
}

Focus on practical, actionable requirements. For UK government tenders, typically include:
- Technical/methodology approach
- Relevant experience/case studies
- Team qualifications
- Quality assurance
- Social value (if applicable)
- Risk management
- Pricing approach (if commercial)

Generate 5-10 requirements based on the tender complexity.

Tender information:
`;

// POST /api/analyze-tender - Extract requirements from tender notice
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tenderOcid } = body;

    if (!tenderOcid) {
      return NextResponse.json({ error: 'tenderOcid is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json(
        { error: 'Company profile required' },
        { status: 400 }
      );
    }

    // Company profile verified - user is authenticated and has a profile
    const _companyProfileId = profileResult[0].id;

    // Get the tender from database
    const tenderResult = await sql`
      SELECT ocid, title, description, stage, buyer_name,
             value_min, value_max, tender_end_date, cpv_codes, region
      FROM tenders
      WHERE ocid = ${tenderOcid}
    `;

    if (tenderResult.length === 0) {
      return NextResponse.json({ error: 'Tender not found' }, { status: 404 });
    }

    const tender = tenderResult[0];

    // Check if we already have requirements for this tender
    const existingReqs = await sql`
      SELECT id FROM bid_requirements
      WHERE tender_ocid = ${tenderOcid}
      LIMIT 1
    `;

    if (existingReqs.length > 0) {
      // Return existing requirements
      const requirements = await sql`
        SELECT * FROM bid_requirements
        WHERE tender_ocid = ${tenderOcid}
        ORDER BY sort_order
      `;

      return NextResponse.json({
        status: 'existing',
        requirements: requirements.map((r) => ({
          id: r.id,
          number: r.requirement_number,
          title: r.title,
          description: r.description,
          type: r.requirement_type,
          wordLimit: r.word_limit,
          weighting: r.weighting,
          scoringCriteria: r.scoring_criteria,
        })),
        message: 'Requirements already extracted',
      });
    }

    // Build context for AI analysis
    const tenderContext = `
Title: ${tender.title}

Buyer: ${tender.buyer_name}
Region: ${tender.region || 'UK-wide'}
Stage: ${tender.stage}
${tender.value_max ? `Estimated Value: £${Number(tender.value_max).toLocaleString()}` : ''}
${tender.tender_end_date ? `Deadline: ${tender.tender_end_date}` : ''}
${tender.cpv_codes?.length ? `Sector (CPV): ${(tender.cpv_codes as string[]).join(', ')}` : ''}

Description:
${tender.description || 'No description available'}
`;

    // Call OpenAI to analyze
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert UK government bid consultant. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: TENDER_ANALYSIS_PROMPT + tenderContext,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from AI');
    }

    let analysis: TenderAnalysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Store requirements in database
    const storedRequirements = [];
    if (analysis.requirements && analysis.requirements.length > 0) {
      for (let i = 0; i < analysis.requirements.length; i++) {
        const req = analysis.requirements[i];
        const result = await sql`
          INSERT INTO bid_requirements (
            tender_ocid,
            requirement_number,
            title,
            description,
            requirement_type,
            word_limit,
            weighting,
            scoring_criteria,
            sort_order
          ) VALUES (
            ${tenderOcid},
            ${req.number || String(i + 1)},
            ${req.title},
            ${req.description},
            ${req.type || 'mandatory'},
            ${req.wordLimit || 500},
            ${req.weighting || null},
            ${req.scoringCriteria || null},
            ${i}
          )
          RETURNING *
        `;
        storedRequirements.push(result[0]);
      }
    }

    // Store analysis metadata (could be useful later)
    // For now, we'll just return it

    return NextResponse.json({
      status: 'completed',
      analysis: {
        summary: analysis.summary,
        evaluationMethodology: analysis.evaluationMethodology,
        keyThemes: analysis.keyThemes,
        suggestedApproach: analysis.suggestedApproach,
      },
      requirements: storedRequirements.map((r) => ({
        id: r.id,
        number: r.requirement_number,
        title: r.title,
        description: r.description,
        type: r.requirement_type,
        wordLimit: r.word_limit,
        weighting: r.weighting,
        scoringCriteria: r.scoring_criteria,
      })),
      message: 'Tender analyzed successfully',
    });
  } catch (error) {
    console.error('Error analyzing tender:', error);
    return NextResponse.json(
      { error: 'Failed to analyze tender', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET /api/analyze-tender?ocid=XXX - Get existing analysis/requirements
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenderOcid = searchParams.get('ocid');

    if (!tenderOcid) {
      return NextResponse.json({ error: 'ocid is required' }, { status: 400 });
    }

    // Get requirements for this tender
    const requirements = await sql`
      SELECT * FROM bid_requirements
      WHERE tender_ocid = ${tenderOcid}
      ORDER BY sort_order
    `;

    // Get responses for these requirements
    const requirementIds = requirements.map(r => r.id);
    let responses: Record<string, unknown>[] = [];

    if (requirementIds.length > 0) {
      responses = await sql`
        SELECT * FROM bid_responses
        WHERE requirement_id = ANY(${requirementIds})
      `;
    }

    const responseMap = new Map(responses.map(r => [r.requirement_id, r]));

    return NextResponse.json({
      hasRequirements: requirements.length > 0,
      requirements: requirements.map((r) => {
        const response = responseMap.get(r.id);
        return {
          id: r.id,
          number: r.requirement_number,
          title: r.title,
          description: r.description,
          type: r.requirement_type,
          wordLimit: r.word_limit,
          weighting: r.weighting,
          scoringCriteria: r.scoring_criteria,
          response: response ? {
            id: response.id,
            text: response.response_text,
            status: response.status,
            wordCount: response.word_count,
          } : null,
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching tender analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}
