import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

export interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  linkedinUrl: string | null;
  skills: string[];
  certifications: string[];
  bidRoles: string[];
  yearsExperience: number | null;
  sectorExperience: string[];
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

// GET /api/team-members - Get team members for current user's company
export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get company profile first
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ members: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Get team members
    const members = await sql`
      SELECT
        id,
        name,
        email,
        role,
        linkedin_url,
        skills,
        certifications,
        bid_roles,
        years_experience,
        sector_experience,
        bio,
        avatar_url,
        is_active
      FROM team_members
      WHERE company_profile_id = ${companyProfileId}
      AND is_active = true
      ORDER BY years_experience DESC NULLS LAST, name ASC
    `;

    const transformedMembers: TeamMember[] = members.map((m) => ({
      id: m.id as string,
      name: m.name as string,
      email: m.email as string | null,
      role: m.role as string | null,
      linkedinUrl: m.linkedin_url as string | null,
      skills: (m.skills as string[]) || [],
      certifications: (m.certifications as string[]) || [],
      bidRoles: (m.bid_roles as string[]) || [],
      yearsExperience: m.years_experience as number | null,
      sectorExperience: (m.sector_experience as string[]) || [],
      bio: m.bio as string | null,
      avatarUrl: m.avatar_url as string | null,
      isActive: m.is_active as boolean,
    }));

    return NextResponse.json({ members: transformedMembers });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/team-members - Add a new team member
export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: 'Company profile required' },
        { status: 400 }
      );
    }

    const companyProfileId = profileResult[0].id;
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO team_members (
        company_profile_id,
        name,
        email,
        role,
        linkedin_url,
        skills,
        certifications,
        bid_roles,
        years_experience,
        sector_experience,
        bio,
        avatar_url
      ) VALUES (
        ${companyProfileId},
        ${body.name},
        ${body.email || null},
        ${body.role || null},
        ${body.linkedinUrl || null},
        ${body.skills || []},
        ${body.certifications || []},
        ${body.bidRoles || []},
        ${body.yearsExperience || null},
        ${body.sectorExperience || []},
        ${body.bio || null},
        ${body.avatarUrl || null}
      )
      RETURNING *
    `;

    const member = result[0];
    return NextResponse.json({
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        linkedinUrl: member.linkedin_url,
        skills: member.skills || [],
        certifications: member.certifications || [],
        bidRoles: member.bid_roles || [],
        yearsExperience: member.years_experience,
        sectorExperience: member.sector_experience || [],
        bio: member.bio,
        avatarUrl: member.avatar_url,
        isActive: member.is_active,
      },
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}
