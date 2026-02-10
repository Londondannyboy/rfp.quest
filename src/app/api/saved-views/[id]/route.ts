import { NextResponse } from 'next/server';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import type { SavedView, SavedViewFilters } from '../route';

export const dynamic = 'force-dynamic';

// PUT /api/saved-views/[id] - Update a saved view
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Build update fields dynamically
    const updates: string[] = [];
    const values: unknown[] = [];

    if (body.name !== undefined) {
      updates.push('name = $' + (values.length + 1));
      values.push(body.name.trim());
    }

    if (body.filters !== undefined) {
      updates.push('filters = $' + (values.length + 1));
      values.push(JSON.stringify(body.filters));
    }

    if (body.isDefault !== undefined) {
      updates.push('is_default = $' + (values.length + 1));
      values.push(body.isDefault);
    }

    if (body.isPinned !== undefined) {
      updates.push('is_pinned = $' + (values.length + 1));
      values.push(body.isPinned);
    }

    if (body.icon !== undefined) {
      updates.push('icon = $' + (values.length + 1));
      values.push(body.icon);
    }

    if (body.color !== undefined) {
      updates.push('color = $' + (values.length + 1));
      values.push(body.color);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    try {
      const results = await sql`
        UPDATE saved_views
        SET name = COALESCE(${body.name?.trim()}, name),
            filters = COALESCE(${body.filters ? JSON.stringify(body.filters) : null}::jsonb, filters),
            is_default = COALESCE(${body.isDefault}, is_default),
            is_pinned = COALESCE(${body.isPinned}, is_pinned),
            icon = COALESCE(${body.icon}, icon),
            color = COALESCE(${body.color}, color)
        WHERE id = ${id} AND user_id = ${session.user.id}
        RETURNING id, user_id, name, filters, is_default, is_pinned, icon, color, created_at
      `;

      if (results.length === 0) {
        return NextResponse.json(
          { error: 'View not found' },
          { status: 404 }
        );
      }

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
      console.error('Error updating saved view:', e);
      return NextResponse.json(
        { error: 'Failed to update saved view' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating saved view:', error);
    return NextResponse.json(
      { error: 'Failed to update saved view' },
      { status: 500 }
    );
  }
}

// DELETE /api/saved-views/[id] - Delete a saved view
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { data: session } = await authServer.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    try {
      const result = await sql`
        DELETE FROM saved_views
        WHERE id = ${id} AND user_id = ${session.user.id}
        RETURNING id
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'View not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true });
    } catch (e) {
      console.error('Error deleting saved view:', e);
      return NextResponse.json(
        { error: 'Failed to delete saved view' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting saved view:', error);
    return NextResponse.json(
      { error: 'Failed to delete saved view' },
      { status: 500 }
    );
  }
}
