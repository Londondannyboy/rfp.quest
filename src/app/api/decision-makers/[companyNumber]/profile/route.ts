import { NextResponse } from 'next/server';

const AGENT_URL = process.env.AGENT_URL || 'https://rfp-quest-agent-production.up.railway.app';

interface DecisionMakerProfile {
  name: string;
  role: string;
  linkedin_url: string | null;
  linkedin_profile: {
    url: string;
    name: string;
    headline: string;
    location: { linkedinText: string } | null;
    followers: number | null;
    connections: number | null;
  } | null;
  recent_topics: string[];
  public_priorities: string[];
  concerns: string[];
  bid_insights: string[];
  post_count: number;
}

interface ProfileResponse {
  company_number: string;
  company_name: string;
  decision_maker_profiles: DecisionMakerProfile[];
  directors_found: number;
  profiles_with_linkedin: number;
  profiles_with_posts: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyNumber: string }> }
) {
  try {
    const { companyNumber } = await params;
    const { searchParams } = new URL(request.url);
    const maxDirectors = searchParams.get('maxDirectors') || '5';

    const response = await fetch(
      `${AGENT_URL}/decision-makers/${companyNumber}/profile?max_directors=${maxDirectors}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Agent error: ${error}` },
        { status: response.status }
      );
    }

    const data: ProfileResponse = await response.json();

    // Transform to camelCase for frontend
    return NextResponse.json({
      companyNumber: data.company_number,
      companyName: data.company_name,
      profiles: data.decision_maker_profiles.map(p => ({
        name: p.name,
        role: p.role,
        linkedinUrl: p.linkedin_url,
        linkedinProfile: p.linkedin_profile ? {
          url: p.linkedin_profile.url,
          name: p.linkedin_profile.name,
          headline: p.linkedin_profile.headline,
          location: p.linkedin_profile.location?.linkedinText || null,
          followers: p.linkedin_profile.followers,
          connections: p.linkedin_profile.connections,
        } : null,
        recentTopics: p.recent_topics,
        publicPriorities: p.public_priorities,
        concerns: p.concerns,
        bidInsights: p.bid_insights,
        postCount: p.post_count,
      })),
      directorsFound: data.directors_found,
      profilesWithLinkedin: data.profiles_with_linkedin,
      profilesWithPosts: data.profiles_with_posts,
    });
  } catch (error) {
    console.error('Decision maker profiling error:', error);
    return NextResponse.json(
      { error: 'Failed to profile decision makers' },
      { status: 500 }
    );
  }
}
