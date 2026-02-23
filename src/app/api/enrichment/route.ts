import { NextRequest, NextResponse } from 'next/server';
import { extractCompanyIntelligence } from '@/lib/jigsawstack-intelligence';
import { useCredits } from '@/lib/db/operations';

export async function POST(request: NextRequest) {
  try {
    const { 
      referenceId, 
      referenceType, 
      enrichmentType,
      teamId,
      userId,
      targetSectors 
    } = await request.json();

    if (!referenceId || !referenceType || !teamId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Determine credit cost based on enrichment type
    const creditCosts = {
      company: 1,
      linkedin: 1, 
      full: 3,
    };

    const creditsRequired = creditCosts[enrichmentType as keyof typeof creditCosts] || 1;

    // Check and deduct credits
    const creditResult = await useCredits(
      teamId,
      creditsRequired,
      `${enrichmentType} enrichment for ${referenceId}`,
      referenceId,
      referenceType,
      userId
    );

    if (!creditResult.success) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          message: creditResult.message,
          remaining: creditResult.remaining 
        },
        { status: 402 } // Payment required
      );
    }

    let enrichmentData = null;

    try {
      // Extract intelligence based on type
      switch (enrichmentType) {
        case 'company':
        case 'full':
          if (referenceType === 'company') {
            // For company enrichment, referenceId should be company number
            const companyName = await getCompanyName(referenceId);
            
            enrichmentData = await extractCompanyIntelligence(
              referenceId, // company number
              companyName,
              targetSectors
            );
          }
          break;

        case 'linkedin':
          // This would use your existing LinkedIn/Apify integration
          enrichmentData = await enrichDecisionMakers(referenceId);
          break;

        default:
          throw new Error(`Unsupported enrichment type: ${enrichmentType}`);
      }

      if (!enrichmentData) {
        // If enrichment fails, refund credits
        await useCredits(
          teamId,
          creditsRequired, // Refund as positive amount
          `Refund for failed ${enrichmentType} enrichment`,
          referenceId,
          referenceType,
          userId
        );

        return NextResponse.json(
          { error: 'Enrichment failed - no data extracted' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: enrichmentData,
        creditsUsed: creditsRequired,
        creditsRemaining: creditResult.remaining - creditsRequired,
        enrichmentType,
        extractedAt: new Date().toISOString(),
      });

    } catch (enrichmentError) {
      console.error('Enrichment process failed:', enrichmentError);

      // Refund credits on failure
      await useCredits(
        teamId,
        creditsRequired,
        `Refund for failed ${enrichmentType} enrichment`,
        referenceId,
        referenceType,
        userId
      );

      return NextResponse.json(
        { error: 'Enrichment process failed', details: enrichmentError },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Enrichment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get company name from Companies House
async function getCompanyName(companyNumber: string): Promise<string> {
  try {
    const CH_API_KEY = process.env.COMPANIES_HOUSE_API_KEY;
    if (!CH_API_KEY) return `Company ${companyNumber}`;

    const response = await fetch(
      `https://api.company-information.service.gov.uk/company/${companyNumber}`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(CH_API_KEY + ':').toString('base64')}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.company_name || `Company ${companyNumber}`;
    }

    return `Company ${companyNumber}`;
  } catch (error) {
    console.error('Failed to get company name:', error);
    return `Company ${companyNumber}`;
  }
}

// Placeholder for LinkedIn enrichment (using existing Apify integration)
async function enrichDecisionMakers(companyIdentifier: string): Promise<any> {
  // This would integrate with your existing agent/tools/apify_linkedin.py
  // For now, return placeholder structure
  return {
    type: 'decision_makers',
    company: companyIdentifier,
    decisionMakers: [
      {
        name: 'Sample Decision Maker',
        role: 'CTO',
        linkedin: 'https://linkedin.com/in/sample',
        recentPosts: [],
        priorities: [],
      }
    ],
    extractedAt: new Date(),
  };
}

// GET endpoint to retrieve cached enrichment data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const referenceId = searchParams.get('referenceId');
    const referenceType = searchParams.get('referenceType');

    if (!referenceId || !referenceType) {
      return NextResponse.json(
        { error: 'Missing referenceId or referenceType' },
        { status: 400 }
      );
    }

    // Check if we have cached enrichment data
    // This would query the enrichment_cache table
    const cachedData = await getCachedEnrichment(referenceId, referenceType);

    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData.data,
        cached: true,
        cachedAt: cachedData.created_at,
        expiresAt: cachedData.expires_at,
      });
    }

    return NextResponse.json({
      success: false,
      message: 'No cached enrichment data found',
    });

  } catch (error) {
    console.error('Get enrichment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to get cached enrichment data
async function getCachedEnrichment(referenceId: string, referenceType: string): Promise<{
  data: any;
  created_at: string;
  expires_at: string;
} | null> {
  // This would query the enrichment_cache table from your schema
  // For now, return null
  return null;
}