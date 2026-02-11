import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface ExtractedRequirement {
  number: string;
  title: string;
  description: string;
  type: 'mandatory' | 'desirable' | 'informational';
  wordLimit?: number;
  pageLimit?: number;
  weighting?: number;
  scoringCriteria?: string;
  sectionReference?: string;
}

export interface DocumentAnalysis {
  summary: string;
  buyerName?: string;
  contractTitle?: string;
  submissionDeadline?: string;
  estimatedValue?: string;
  evaluationMethodology?: string;
  requirements: ExtractedRequirement[];
  scoringWeights?: Record<string, number>;
  keyDates?: Array<{ date: string; description: string }>;
}

const ANALYSIS_PROMPT = `You are an expert bid analyst. Analyze this tender document and extract structured information.

Return a JSON object with the following structure:
{
  "summary": "Brief 2-3 sentence summary of what the tender is for",
  "buyerName": "Name of the procuring organization",
  "contractTitle": "Official title of the contract/tender",
  "submissionDeadline": "ISO date string or null if not found",
  "estimatedValue": "Contract value if stated",
  "evaluationMethodology": "How bids will be evaluated (e.g., MEAT, lowest price)",
  "requirements": [
    {
      "number": "1.1",
      "title": "Brief title for the requirement",
      "description": "Full description of what is required",
      "type": "mandatory|desirable|informational",
      "wordLimit": 500,
      "pageLimit": null,
      "weighting": 10,
      "scoringCriteria": "How this will be scored",
      "sectionReference": "Section reference in the document"
    }
  ],
  "scoringWeights": {
    "Technical": 60,
    "Price": 40
  },
  "keyDates": [
    {"date": "2024-01-15", "description": "Clarification deadline"}
  ]
}

Focus on:
1. Identifying ALL questions/requirements that need responses
2. Word limits and page limits for each section
3. Scoring criteria and weightings
4. Mandatory vs desirable requirements
5. Any pass/fail criteria

Document text:
`;

// POST /api/analyze-document - Analyze a document with AI
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
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

    const companyProfileId = profileResult[0].id;

    // Get the document
    const docResult = await sql`
      SELECT id, extracted_text, analysis_status
      FROM tender_documents
      WHERE id = ${documentId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (docResult.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const doc = docResult[0];

    if (!doc.extracted_text) {
      return NextResponse.json(
        { error: 'Document has no extracted text' },
        { status: 400 }
      );
    }

    // Update status to processing
    await sql`
      UPDATE tender_documents
      SET analysis_status = 'processing', updated_at = NOW()
      WHERE id = ${documentId}
    `;

    // Truncate text if too long (GPT-4 context limit)
    const maxChars = 100000; // ~25k tokens
    const text = doc.extracted_text.length > maxChars
      ? doc.extracted_text.slice(0, maxChars) + '\n\n[Document truncated due to length...]'
      : doc.extracted_text;

    // Call OpenAI to analyze the document
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert bid analyst. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: ANALYSIS_PROMPT + text,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 8000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from AI');
    }

    let analysis: DocumentAnalysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Update document with analysis result
    await sql`
      UPDATE tender_documents
      SET
        analysis_status = 'completed',
        analysis_result = ${JSON.stringify(analysis)},
        analyzed_at = NOW(),
        updated_at = NOW()
      WHERE id = ${documentId}
    `;

    // Insert requirements into bid_requirements table
    if (analysis.requirements && analysis.requirements.length > 0) {
      for (let i = 0; i < analysis.requirements.length; i++) {
        const req = analysis.requirements[i];
        await sql`
          INSERT INTO bid_requirements (
            document_id,
            requirement_number,
            title,
            description,
            requirement_type,
            word_limit,
            page_limit,
            weighting,
            scoring_criteria,
            section_reference,
            sort_order
          ) VALUES (
            ${documentId},
            ${req.number || String(i + 1)},
            ${req.title},
            ${req.description},
            ${req.type || 'mandatory'},
            ${req.wordLimit || null},
            ${req.pageLimit || null},
            ${req.weighting || null},
            ${req.scoringCriteria || null},
            ${req.sectionReference || null},
            ${i}
          )
        `;
      }
    }

    return NextResponse.json({
      analysis,
      requirementsCount: analysis.requirements?.length || 0,
      message: 'Document analyzed successfully',
    });
  } catch (error) {
    console.error('Error analyzing document:', error);

    // Try to update status to failed
    try {
      const body = await request.clone().json();
      if (body.documentId) {
        await sql`
          UPDATE tender_documents
          SET analysis_status = 'failed', updated_at = NOW()
          WHERE id = ${body.documentId}
        `;
      }
    } catch {
      // Ignore cleanup errors
    }

    return NextResponse.json(
      { error: 'Failed to analyze document', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET /api/analyze-document?documentId=XXX - Get analysis status/result
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Get document with analysis
    const docResult = await sql`
      SELECT analysis_status, analysis_result, analyzed_at
      FROM tender_documents
      WHERE id = ${documentId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (docResult.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const doc = docResult[0];

    // Get requirements
    const requirements = await sql`
      SELECT *
      FROM bid_requirements
      WHERE document_id = ${documentId}
      ORDER BY sort_order
    `;

    return NextResponse.json({
      status: doc.analysis_status,
      analysis: doc.analysis_result,
      analyzedAt: doc.analyzed_at,
      requirements: requirements.map((r) => ({
        id: r.id,
        number: r.requirement_number,
        title: r.title,
        description: r.description,
        type: r.requirement_type,
        wordLimit: r.word_limit,
        pageLimit: r.page_limit,
        weighting: r.weighting,
        scoringCriteria: r.scoring_criteria,
        sectionReference: r.section_reference,
      })),
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
}
