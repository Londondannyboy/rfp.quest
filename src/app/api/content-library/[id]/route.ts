import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/content-library/[id] - Get a single content item
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    const result = await sql`
      SELECT * FROM content_library
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

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
        lastUsedAt: item.last_used_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      },
    });
  } catch (error) {
    console.error('Error fetching content item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content item' },
      { status: 500 }
    );
  }
}

// PUT /api/content-library/[id] - Update a content item
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, tags, metadata } = body;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Check item exists and belongs to user
    const existing = await sql`
      SELECT id FROM content_library
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    // Update item
    const result = await sql`
      UPDATE content_library
      SET
        title = COALESCE(${title}, title),
        content = COALESCE(${content}, content),
        tags = COALESCE(${tags}, tags),
        metadata = COALESCE(${metadata ? JSON.stringify(metadata) : null}, metadata),
        updated_at = NOW()
      WHERE id = ${id}
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
        updatedAt: item.updated_at,
      },
      message: 'Content item updated successfully',
    });
  } catch (error) {
    console.error('Error updating content item:', error);
    return NextResponse.json(
      { error: 'Failed to update content item' },
      { status: 500 }
    );
  }
}

// DELETE /api/content-library/[id] - Delete a content item
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Delete item
    const result = await sql`
      DELETE FROM content_library
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Content item deleted successfully' });
  } catch (error) {
    console.error('Error deleting content item:', error);
    return NextResponse.json(
      { error: 'Failed to delete content item' },
      { status: 500 }
    );
  }
}

// POST /api/content-library/[id]/use - Record usage of a content item
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { data: session } = await authServer.getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get company profile
    const profileResult = await sql`
      SELECT id FROM company_profiles WHERE user_id = ${session.user.id}
    `;

    if (profileResult.length === 0) {
      return NextResponse.json({ error: 'Company profile required' }, { status: 400 });
    }

    const companyProfileId = profileResult[0].id;

    // Increment usage count
    await sql`
      UPDATE content_library
      SET
        usage_count = usage_count + 1,
        last_used_at = NOW()
      WHERE id = ${id}
      AND company_profile_id = ${companyProfileId}
    `;

    return NextResponse.json({ message: 'Usage recorded' });
  } catch (error) {
    console.error('Error recording usage:', error);
    return NextResponse.json(
      { error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}
