import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

export interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  metadata: Record<string, unknown>;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const VALID_TYPES = [
  'boilerplate',
  'case_study',
  'cv',
  'certification',
  'methodology',
  'policy',
  'capability_statement',
  'social_value',
  'sustainability',
];

// GET /api/content-library - List content items with optional filters
export async function GET(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const companyProfileId = profileResult[0].id;

    // Build query
    let items;
    if (type && search) {
      items = await sql`
        SELECT * FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND type = ${type}
        AND (title ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
        ORDER BY usage_count DESC, updated_at DESC
      `;
    } else if (type) {
      items = await sql`
        SELECT * FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND type = ${type}
        ORDER BY usage_count DESC, updated_at DESC
      `;
    } else if (search) {
      items = await sql`
        SELECT * FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        AND (title ILIKE ${'%' + search + '%'} OR content ILIKE ${'%' + search + '%'})
        ORDER BY usage_count DESC, updated_at DESC
      `;
    } else {
      items = await sql`
        SELECT * FROM content_library
        WHERE company_profile_id = ${companyProfileId}
        ORDER BY usage_count DESC, updated_at DESC
      `;
    }

    // Filter by tags if provided (in JS since array contains is complex in SQL)
    let filteredItems = items;
    if (tags && tags.length > 0) {
      filteredItems = items.filter((item) => {
        const itemTags = item.tags as string[];
        return tags.some((tag) => itemTags.includes(tag));
      });
    }

    const transformedItems: ContentItem[] = filteredItems.map((item) => ({
      id: item.id as string,
      type: item.type as string,
      title: item.title as string,
      content: item.content as string,
      tags: item.tags as string[],
      metadata: item.metadata as Record<string, unknown>,
      usageCount: item.usage_count as number,
      lastUsedAt: item.last_used_at as string | null,
      createdAt: item.created_at as string,
      updatedAt: item.updated_at as string,
    }));

    return NextResponse.json({ items: transformedItems });
  } catch (error) {
    console.error('Error fetching content library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content library' },
      { status: 500 }
    );
  }
}

// POST /api/content-library - Create a new content item
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, content, tags = [], metadata = {} } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'title and content are required' },
        { status: 400 }
      );
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

    // Insert content item
    const result = await sql`
      INSERT INTO content_library (
        company_profile_id,
        type,
        title,
        content,
        tags,
        metadata
      ) VALUES (
        ${companyProfileId},
        ${type},
        ${title},
        ${content},
        ${tags},
        ${JSON.stringify(metadata)}
      )
      RETURNING *
    `;

    const item = result[0];

    return NextResponse.json({
      item: {
        id: item.id,
        type: item.type,
        title: item.title,
        content: item.content,
        tags: item.tags,
        metadata: item.metadata,
        usageCount: item.usage_count,
        createdAt: item.created_at,
      },
      message: 'Content item created successfully',
    });
  } catch (error) {
    console.error('Error creating content item:', error);
    return NextResponse.json(
      { error: 'Failed to create content item' },
      { status: 500 }
    );
  }
}
