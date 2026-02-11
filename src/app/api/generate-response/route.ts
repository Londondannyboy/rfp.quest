import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import OpenAI from 'openai';

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

interface RequirementInput {
  title: string;
  description: string;
  wordLimit?: number;
  scoringCriteria?: string;
}

interface GenerateRequestBody {
  requirementId: string;
  requirement: RequirementInput;
  existingResponse?: string;
  refinementPrompt?: string;
}

const SYSTEM_PROMPT = `You are an expert bid writer specializing in UK public sector tenders. You write compelling, professional responses that:

1. Directly address the requirement with specific, relevant answers
2. Use clear, concise language appropriate for government procurement
3. Include concrete evidence, examples, and metrics where possible
4. Follow the STAR format (Situation, Task, Action, Result) for case studies
5. Demonstrate understanding of the buyer's needs
6. Highlight relevant experience and capabilities
7. Use bullet points and structure for readability
8. Stay within word limits while maximizing impact

Always write in first person plural ("we", "our team") as if you are the bidding company.
Focus on outcomes and benefits to the buyer, not just features.
Be specific - avoid vague claims like "we have extensive experience" without backing it up.`;

interface ContentLibraryItem {
  type: string;
  title: string;
  content: string;
}

interface PastBidResponse {
  questionText: string;
  responseText: string;
  outcome: string;
  tenderTitle: string;
}

function buildPrompt(
  requirement: RequirementInput,
  companyProfile: Record<string, unknown> | null,
  contentItems: ContentLibraryItem[],
  pastResponses: PastBidResponse[],
  existingResponse?: string,
  refinementPrompt?: string
): string {
  let prompt = '';

  // Company context
  if (companyProfile) {
    prompt += `## Company Context\n`;
    if (companyProfile.company_name) {
      prompt += `Company: ${companyProfile.company_name}\n`;
    }
    if (companyProfile.company_description) {
      prompt += `Description: ${companyProfile.company_description}\n`;
    }
    if (companyProfile.key_capabilities) {
      const capabilities = companyProfile.key_capabilities as string[];
      prompt += `Key Capabilities: ${capabilities.join(', ')}\n`;
    }
    if (companyProfile.certifications) {
      const certs = companyProfile.certifications as string[];
      prompt += `Certifications: ${certs.join(', ')}\n`;
    }
    prompt += '\n';
  }

  // Content library reference material
  if (contentItems.length > 0) {
    prompt += `## Reference Material from Content Library\n`;
    prompt += `Use the following approved content as reference. You may quote, paraphrase, or adapt this material:\n\n`;
    contentItems.forEach((item, i) => {
      prompt += `### ${i + 1}. ${item.title} (${item.type.replace('_', ' ')})\n`;
      prompt += `${item.content}\n\n`;
    });
  }

  // Past winning responses
  const winningResponses = pastResponses.filter(r => r.outcome === 'won');
  if (winningResponses.length > 0) {
    prompt += `## Examples from Past Winning Bids\n`;
    prompt += `These responses won in previous tenders. Use them as style and structure references:\n\n`;
    winningResponses.forEach((r, i) => {
      prompt += `### Example ${i + 1} (from "${r.tenderTitle}")\n`;
      prompt += `Question: ${r.questionText}\n`;
      prompt += `Response: ${r.responseText}\n\n`;
    });
  }

  // Requirement
  prompt += `## Requirement to Answer\n`;
  prompt += `Title: ${requirement.title}\n`;
  prompt += `Description: ${requirement.description}\n`;

  if (requirement.wordLimit) {
    prompt += `\nWord Limit: ${requirement.wordLimit} words (IMPORTANT: Stay within this limit)\n`;
  }

  if (requirement.scoringCriteria) {
    prompt += `\nScoring Criteria: ${requirement.scoringCriteria}\n`;
    prompt += `(Ensure your response addresses these scoring criteria directly)\n`;
  }

  // Refinement or generation
  if (existingResponse && refinementPrompt) {
    prompt += `\n## Current Response\n${existingResponse}\n`;
    prompt += `\n## Refinement Request\n${refinementPrompt}\n`;
    prompt += `\nPlease refine the response according to this request while maintaining accuracy and relevance.`;
  } else {
    prompt += `\n## Task\nWrite a compelling bid response that addresses this requirement. `;
    if (requirement.wordLimit) {
      prompt += `The response must be approximately ${Math.round(requirement.wordLimit * 0.9)} words (staying under the ${requirement.wordLimit} word limit). `;
    }
    prompt += `Use the company context and reference material to make the response specific and evidence-based.`;
  }

  return prompt;
}

// POST /api/generate-response - Generate or refine a bid response
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: GenerateRequestBody = await request.json();
    const { requirementId, requirement, existingResponse, refinementPrompt } = body;

    if (!requirement) {
      return NextResponse.json({ error: 'requirement is required' }, { status: 400 });
    }

    // Get company profile for context
    const profileResult = await sql`
      SELECT
        company_name,
        company_description,
        key_capabilities,
        certifications,
        target_cpv_divisions,
        sustainability_focus,
        social_value_focus
      FROM company_profiles
      WHERE user_id = ${session.user.id}
    `;

    const companyProfile = profileResult.length > 0 ? profileResult[0] : null;
    const companyProfileId = companyProfile?.id as string | undefined;

    // Search content library for relevant material
    let contentItems: ContentLibraryItem[] = [];
    let pastResponses: PastBidResponse[] = [];

    if (companyProfileId) {
      // Search for relevant content using keywords from requirement
      const searchTerms = `${requirement.title} ${requirement.description}`.slice(0, 200);

      const contentResult = await sql`
        SELECT type, title, content
        FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND (
          title ILIKE ${'%' + searchTerms.split(' ')[0] + '%'}
          OR content ILIKE ${'%' + searchTerms.split(' ')[0] + '%'}
        )
        ORDER BY usage_count DESC
        LIMIT 3
      `;

      contentItems = contentResult.map((item) => ({
        type: item.type as string,
        title: item.title as string,
        content: (item.content as string).slice(0, 1500), // Limit content length
      }));

      // Get past winning bid responses for similar questions
      const pastResult = await sql`
        SELECT
          pbr.question_text,
          pbr.response_text,
          pb.outcome,
          pb.tender_title
        FROM past_bid_responses pbr
        JOIN past_bids pb ON pb.id = pbr.past_bid_id
        WHERE pb.company_profile_id = ${companyProfileId}
        AND pb.outcome = 'won'
        ORDER BY pbr.score_received DESC NULLS LAST
        LIMIT 2
      `;

      pastResponses = pastResult.map((r) => ({
        questionText: r.question_text as string,
        responseText: (r.response_text as string).slice(0, 1000),
        outcome: r.outcome as string,
        tenderTitle: r.tender_title as string,
      }));

      // Update usage count for content items used
      if (contentItems.length > 0) {
        const contentTitles = contentItems.map(c => c.title);
        await sql`
          UPDATE content_library
          SET usage_count = usage_count + 1, last_used_at = NOW()
          WHERE company_profile_id = ${companyProfileId}
          AND title = ANY(${contentTitles})
        `;
      }
    }

    // Build the prompt with content library context
    const userPrompt = buildPrompt(
      requirement,
      companyProfile as Record<string, unknown> | null,
      contentItems,
      pastResponses,
      existingResponse,
      refinementPrompt
    );

    // Call OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from AI');
    }

    // Save the response to the database if we have a requirementId
    if (requirementId && companyProfileId) {
      // Check if response exists
      const existingDbResponse = await sql`
        SELECT id FROM bid_responses
        WHERE requirement_id = ${requirementId}
        AND company_profile_id = ${companyProfileId}
      `;

      const wordCount = responseText.trim().split(/\s+/).filter(Boolean).length;

      if (existingDbResponse.length > 0) {
        // Update existing response
        await sql`
          UPDATE bid_responses
          SET
            response_text = ${responseText},
            word_count = ${wordCount},
            status = 'draft',
            version = version + 1,
            ai_generated = true,
            updated_at = NOW()
          WHERE id = ${existingDbResponse[0].id}
        `;
      } else {
        // Insert new response
        await sql`
          INSERT INTO bid_responses (
            requirement_id,
            company_profile_id,
            response_text,
            word_count,
            status,
            ai_generated
          ) VALUES (
            ${requirementId},
            ${companyProfileId},
            ${responseText},
            ${wordCount},
            'draft',
            true
          )
        `;
      }
    }

    return NextResponse.json({
      response: responseText,
      wordCount: responseText.trim().split(/\s+/).filter(Boolean).length,
      isRefinement: !!refinementPrompt,
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET /api/generate-response?requirementId=XXX - Get saved response for a requirement
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requirementId = searchParams.get('requirementId');

    if (!requirementId) {
      return NextResponse.json({ error: 'requirementId is required' }, { status: 400 });
    }

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ response: null });
    }

    const companyProfileId = profileResult[0].id;

    // Get saved response
    const responseResult = await sql`
      SELECT
        id,
        response_text,
        word_count,
        status,
        version,
        ai_generated,
        created_at,
        updated_at
      FROM bid_responses
      WHERE requirement_id = ${requirementId}
      AND company_profile_id = ${companyProfileId}
    `;

    if (responseResult.length === 0) {
      return NextResponse.json({ response: null });
    }

    const savedResponse = responseResult[0];

    return NextResponse.json({
      response: savedResponse.response_text,
      wordCount: savedResponse.word_count,
      status: savedResponse.status,
      version: savedResponse.version,
      aiGenerated: savedResponse.ai_generated,
      updatedAt: savedResponse.updated_at,
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response' },
      { status: 500 }
    );
  }
}
