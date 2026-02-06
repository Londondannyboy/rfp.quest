import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

// CPV Division labels for readable output
const CPV_LABELS: Record<string, string> = {
  '45': 'Construction',
  '48': 'Software & IT Systems',
  '50': 'Repair & Maintenance',
  '55': 'Hospitality',
  '60': 'Transport',
  '65': 'Utilities',
  '71': 'Engineering & Architecture',
  '72': 'IT Services',
  '73': 'R&D Services',
  '75': 'Government Services',
  '77': 'Agriculture & Forestry',
  '79': 'Business Services',
  '80': 'Education',
  '85': 'Healthcare',
  '90': 'Environment & Waste',
  '92': 'Recreation & Culture',
};

// Sustainability CPV codes
const SUSTAINABILITY_CPV_PREFIXES = ['90', '77'];

interface MatchBreakdown {
  category: string;
  weight: number;
  score: number;
  details: string;
}

interface MatchResult {
  overallScore: number;
  breakdown: MatchBreakdown[];
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to analyze tender matches.' },
        { status: 401 }
      );
    }

    // Get tender OCID from query params
    const searchParams = request.nextUrl.searchParams;
    const ocid = searchParams.get('ocid');

    if (!ocid) {
      return NextResponse.json(
        { error: 'Tender OCID is required' },
        { status: 400 }
      );
    }

    // Fetch company profile
    const profileResults = await sql`
      SELECT * FROM company_profiles WHERE user_id = ${session.userId}
    `;

    if (profileResults.length === 0) {
      return NextResponse.json(
        { error: 'No company profile found. Please set up your company profile first.' },
        { status: 404 }
      );
    }

    const profile = profileResults[0];

    // Fetch tender details
    const tenderResults = await sql`
      SELECT * FROM tenders WHERE ocid = ${ocid}
    `;

    if (tenderResults.length === 0) {
      return NextResponse.json(
        { error: 'Tender not found' },
        { status: 404 }
      );
    }

    const tender = tenderResults[0];

    // Calculate match scores
    const breakdown: MatchBreakdown[] = [];
    const strengths: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];

    // 1. CPV Code Matching (40%)
    const tenderCpvCodes = (tender.cpv_codes as string[]) || [];
    const targetCpvDivisions = (profile.target_cpv_divisions as string[]) || [];
    const expertiseAreas = (profile.expertise_areas as string[]) || [];

    let cpvScore = 0;
    const matchedDivisions: string[] = [];

    if (tenderCpvCodes.length > 0 && targetCpvDivisions.length > 0) {
      for (const code of tenderCpvCodes) {
        const division = code.slice(0, 2);
        if (targetCpvDivisions.includes(division)) {
          matchedDivisions.push(division);
          cpvScore += 1;
        }
      }
      cpvScore = Math.min(100, (cpvScore / tenderCpvCodes.length) * 100);
    } else if (tenderCpvCodes.length === 0) {
      cpvScore = 50; // Neutral if no CPV codes
    }

    if (matchedDivisions.length > 0) {
      const labels = [...new Set(matchedDivisions)].map(d => CPV_LABELS[d] || d).join(', ');
      strengths.push(`Strong match in: ${labels}`);
    } else if (targetCpvDivisions.length > 0 && tenderCpvCodes.length > 0) {
      gaps.push('Tender categories do not match your target sectors');
      recommendations.push('Consider expanding your target CPV sectors in your profile');
    }

    breakdown.push({
      category: 'Sector Match',
      weight: 40,
      score: cpvScore,
      details: matchedDivisions.length > 0
        ? `Matches ${matchedDivisions.length} of your target sectors`
        : 'No sector overlap with your profile',
    });

    // 2. Region Matching (20%)
    const tenderRegion = tender.region as string | null;
    const targetRegions = (profile.target_regions as string[]) || [];

    let regionScore = 0;
    if (tenderRegion && targetRegions.length > 0) {
      if (targetRegions.includes(tenderRegion) || targetRegions.includes('UK-wide')) {
        regionScore = 100;
        strengths.push(`Tender is in your target region: ${tenderRegion}`);
      } else {
        gaps.push(`Tender is in ${tenderRegion}, which is not in your target regions`);
      }
    } else if (!tenderRegion) {
      regionScore = 50; // Neutral if no region specified
    } else if (targetRegions.length === 0) {
      regionScore = 75; // Slight positive if no preferences set
    }

    breakdown.push({
      category: 'Region Match',
      weight: 20,
      score: regionScore,
      details: tenderRegion
        ? `Tender location: ${tenderRegion}`
        : 'No specific region specified',
    });

    // 3. Value Range Matching (20%)
    const tenderValue = (tender.value_amount as number) ||
                        (tender.value_max as number) ||
                        (tender.value_min as number) || 0;
    const minValue = profile.min_contract_value as number | null;
    const maxValue = profile.max_contract_value as number | null;

    let valueScore = 0;
    if (tenderValue > 0) {
      if (minValue && tenderValue < minValue) {
        valueScore = 30;
        gaps.push(`Contract value (£${tenderValue.toLocaleString()}) is below your minimum (£${minValue.toLocaleString()})`);
      } else if (maxValue && tenderValue > maxValue) {
        valueScore = 30;
        gaps.push(`Contract value (£${tenderValue.toLocaleString()}) exceeds your maximum (£${maxValue.toLocaleString()})`);
      } else {
        valueScore = 100;
        strengths.push(`Contract value fits your target range`);
      }
    } else {
      valueScore = 50; // Neutral if no value specified
    }

    breakdown.push({
      category: 'Value Match',
      weight: 20,
      score: valueScore,
      details: tenderValue > 0
        ? `Contract value: £${tenderValue.toLocaleString()}`
        : 'No value specified',
    });

    // 4. Sustainability Alignment (10%)
    const sustainabilityFocus = profile.sustainability_focus as boolean;
    const tenderIsSustainability = tenderCpvCodes.some(code =>
      SUSTAINABILITY_CPV_PREFIXES.some(prefix => code.startsWith(prefix))
    );

    let sustainabilityScore = 50; // Neutral baseline
    if (sustainabilityFocus && tenderIsSustainability) {
      sustainabilityScore = 100;
      strengths.push('Sustainability tender matches your environmental focus');
    } else if (sustainabilityFocus && !tenderIsSustainability) {
      sustainabilityScore = 40;
    } else if (!sustainabilityFocus && tenderIsSustainability) {
      sustainabilityScore = 60;
      recommendations.push('This is a sustainability tender - consider highlighting any environmental credentials');
    }

    breakdown.push({
      category: 'Sustainability',
      weight: 10,
      score: sustainabilityScore,
      details: tenderIsSustainability
        ? 'Sustainability-focused tender'
        : 'Standard tender',
    });

    // 5. Keyword/Expertise Match (10%)
    const productsServices = (profile.products_services as string[]) || [];
    const tenderText = `${tender.title} ${tender.description || ''}`.toLowerCase();

    let keywordScore = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of [...productsServices, ...expertiseAreas]) {
      if (tenderText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
        keywordScore += 20;
      }
    }
    keywordScore = Math.min(100, keywordScore);

    if (matchedKeywords.length > 0) {
      strengths.push(`Matches your expertise: ${matchedKeywords.slice(0, 3).join(', ')}`);
    }

    breakdown.push({
      category: 'Expertise Match',
      weight: 10,
      score: keywordScore,
      details: matchedKeywords.length > 0
        ? `${matchedKeywords.length} keyword matches`
        : 'No keyword matches',
    });

    // Calculate overall score
    const overallScore = breakdown.reduce((sum, item) => {
      return sum + (item.score * item.weight / 100);
    }, 0);

    // Add general recommendations based on score
    if (overallScore >= 70) {
      recommendations.unshift('Strong match - consider prioritizing this tender');
    } else if (overallScore >= 50) {
      recommendations.unshift('Moderate match - review requirements carefully');
    } else {
      recommendations.unshift('Low match - may require additional capabilities');
    }

    const result: MatchResult = {
      overallScore: Math.round(overallScore),
      breakdown,
      strengths,
      gaps,
      recommendations,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Match analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze match' },
      { status: 500 }
    );
  }
}
