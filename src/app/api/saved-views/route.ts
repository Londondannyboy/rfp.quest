import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export interface SavedViewFilters {
  keyword?: string;
  stage?: string;
  region?: string;
  cpvDivisions?: string[];
  minValue?: number;
  maxValue?: number;
  sustainability?: boolean;
  buyerName?: string;
}

export interface SavedView {
  id: string;
  userId: string;
  name: string;
  filters: SavedViewFilters;
  isDefault: boolean;
  isPinned: boolean;
  icon?: string;
  color?: string;
  createdAt: string;
}

// GET /api/saved-views - List user's saved views
export async function GET() {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to get from database
    try {
      const results = await sql`
        SELECT id, user_id, name, filters, is_default, is_pinned, icon, color, created_at
        FROM saved_views
        WHERE user_id = ${session.user.id}
        ORDER BY is_pinned DESC, created_at DESC
      `;

      const views: SavedView[] = results.map((row) => ({
        id: row.id as string,
        userId: row.user_id as string,
        name: row.name as string,
        filters: row.filters as SavedViewFilters,
        isDefault: row.is_default as boolean,
        isPinned: row.is_pinned as boolean,
        icon: row.icon as string | undefined,
        color: row.color as string | undefined,
        createdAt: row.created_at as string,
      }));

      return NextResponse.json({ views });
    } catch (e) {
      // Table might not exist yet
      console.log('saved_views table not found, returning empty array');
      return NextResponse.json({ views: [] });
    }
  } catch (error) {
    console.error('Error fetching saved views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved views' },
      { status: 500 }
    );
  }
}

// POST /api/saved-views - Create a new saved view
export async function POST(request: Request) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'View name is required' },
        { status: 400 }
      );
    }

    if (!body.filters || typeof body.filters !== 'object') {
      return NextResponse.json(
        { error: 'Filters are required' },
        { status: 400 }
      );
    }

    try {
      const results = await sql`
        INSERT INTO saved_views (user_id, name, filters, is_default, is_pinned, icon, color)
        VALUES (
          ${session.user.id},
          ${body.name.trim()},
          ${JSON.stringify(body.filters)},
          ${body.isDefault || false},
          ${body.isPinned || false},
          ${body.icon || null},
          ${body.color || null}
        )
        RETURNING id, user_id, name, filters, is_default, is_pinned, icon, color, created_at
      `;

      const row = results[0];
      const view: SavedView = {
        id: row.id as string,
        userId: row.user_id as string,
        name: row.name as string,
        filters: row.filters as SavedViewFilters,
        isDefault: row.is_default as boolean,
        isPinned: row.is_pinned as boolean,
        icon: row.icon as string | undefined,
        color: row.color as string | undefined,
        createdAt: row.created_at as string,
      };

      return NextResponse.json({ view });
    } catch (e) {
      // Check for duplicate name
      const error = e as Error;
      if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'A view with this name already exists' },
          { status: 409 }
        );
      }

      // Table might not exist
      console.error('Error creating saved view:', e);
      return NextResponse.json(
        { error: 'Saved views feature is not available yet' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating saved view:', error);
    return NextResponse.json(
      { error: 'Failed to create saved view' },
      { status: 500 }
    );
  }
}
