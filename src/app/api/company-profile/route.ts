import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  description: string | null;
  website: string | null;
  productsServices: string[];
  expertiseAreas: string[];
  certifications: string[];
  targetRegions: string[];
  targetCpvDivisions: string[];
  minContractValue: number | null;
  maxContractValue: number | null;
  sustainabilityFocus: boolean;
  sustainabilityKeywords: string[];
  createdAt: string;
  updatedAt: string;
}

// GET /api/company-profile - Get current user's company profile
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await sql`
      SELECT
        id,
        user_id,
        company_name,
        description,
        website,
        products_services,
        expertise_areas,
        certifications,
        target_regions,
        target_cpv_divisions,
        min_contract_value,
        max_contract_value,
        sustainability_focus,
        sustainability_keywords,
        created_at,
        updated_at
      FROM company_profiles
      WHERE user_id = ${session.userId}
    `;

    if (results.length === 0) {
      return NextResponse.json({ profile: null });
    }

    const row = results[0];
    const profile: CompanyProfile = {
      id: row.id as string,
      userId: row.user_id as string,
      companyName: row.company_name as string,
      description: row.description as string | null,
      website: row.website as string | null,
      productsServices: (row.products_services as string[]) || [],
      expertiseAreas: (row.expertise_areas as string[]) || [],
      certifications: (row.certifications as string[]) || [],
      targetRegions: (row.target_regions as string[]) || [],
      targetCpvDivisions: (row.target_cpv_divisions as string[]) || [],
      minContractValue: row.min_contract_value as number | null,
      maxContractValue: row.max_contract_value as number | null,
      sustainabilityFocus: row.sustainability_focus as boolean,
      sustainabilityKeywords: (row.sustainability_keywords as string[]) || [],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company profile' },
      { status: 500 }
    );
  }
}

// PUT /api/company-profile - Create or update company profile
export async function PUT(request: Request) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.companyName || typeof body.companyName !== 'string') {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Prepare values with defaults
    const values = {
      companyName: body.companyName.trim(),
      description: body.description?.trim() || null,
      website: body.website?.trim() || null,
      productsServices: Array.isArray(body.productsServices) ? body.productsServices : [],
      expertiseAreas: Array.isArray(body.expertiseAreas) ? body.expertiseAreas : [],
      certifications: Array.isArray(body.certifications) ? body.certifications : [],
      targetRegions: Array.isArray(body.targetRegions) ? body.targetRegions : [],
      targetCpvDivisions: Array.isArray(body.targetCpvDivisions) ? body.targetCpvDivisions : [],
      minContractValue: typeof body.minContractValue === 'number' ? body.minContractValue : null,
      maxContractValue: typeof body.maxContractValue === 'number' ? body.maxContractValue : null,
      sustainabilityFocus: body.sustainabilityFocus === true,
      sustainabilityKeywords: Array.isArray(body.sustainabilityKeywords) ? body.sustainabilityKeywords : [],
    };

    // Upsert the profile
    const results = await sql`
      INSERT INTO company_profiles (
        user_id,
        company_name,
        description,
        website,
        products_services,
        expertise_areas,
        certifications,
        target_regions,
        target_cpv_divisions,
        min_contract_value,
        max_contract_value,
        sustainability_focus,
        sustainability_keywords
      ) VALUES (
        ${session.userId},
        ${values.companyName},
        ${values.description},
        ${values.website},
        ${values.productsServices},
        ${values.expertiseAreas},
        ${values.certifications},
        ${values.targetRegions},
        ${values.targetCpvDivisions},
        ${values.minContractValue},
        ${values.maxContractValue},
        ${values.sustainabilityFocus},
        ${values.sustainabilityKeywords}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        description = EXCLUDED.description,
        website = EXCLUDED.website,
        products_services = EXCLUDED.products_services,
        expertise_areas = EXCLUDED.expertise_areas,
        certifications = EXCLUDED.certifications,
        target_regions = EXCLUDED.target_regions,
        target_cpv_divisions = EXCLUDED.target_cpv_divisions,
        min_contract_value = EXCLUDED.min_contract_value,
        max_contract_value = EXCLUDED.max_contract_value,
        sustainability_focus = EXCLUDED.sustainability_focus,
        sustainability_keywords = EXCLUDED.sustainability_keywords,
        updated_at = NOW()
      RETURNING
        id,
        user_id,
        company_name,
        description,
        website,
        products_services,
        expertise_areas,
        certifications,
        target_regions,
        target_cpv_divisions,
        min_contract_value,
        max_contract_value,
        sustainability_focus,
        sustainability_keywords,
        created_at,
        updated_at
    `;

    const row = results[0];
    const profile: CompanyProfile = {
      id: row.id as string,
      userId: row.user_id as string,
      companyName: row.company_name as string,
      description: row.description as string | null,
      website: row.website as string | null,
      productsServices: (row.products_services as string[]) || [],
      expertiseAreas: (row.expertise_areas as string[]) || [],
      certifications: (row.certifications as string[]) || [],
      targetRegions: (row.target_regions as string[]) || [],
      targetCpvDivisions: (row.target_cpv_divisions as string[]) || [],
      minContractValue: row.min_contract_value as number | null,
      maxContractValue: row.max_contract_value as number | null,
      sustainabilityFocus: row.sustainability_focus as boolean,
      sustainabilityKeywords: (row.sustainability_keywords as string[]) || [],
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error saving company profile:', error);
    return NextResponse.json(
      { error: 'Failed to save company profile' },
      { status: 500 }
    );
  }
}
