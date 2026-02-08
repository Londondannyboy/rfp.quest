import { NextResponse } from 'next/server';
import { getSession, destroySession } from '@/lib/auth/session';
import { sql } from '@/lib/db';

export async function DELETE() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to delete your account.' },
        { status: 401 }
      );
    }

    const userId = session.userId;

    // Delete in order to respect foreign key constraints
    // 1. Delete company profile
    await sql`DELETE FROM company_profiles WHERE user_id = ${userId}`;

    // 2. Delete user
    await sql`DELETE FROM users WHERE id = ${userId}`;

    // 3. Destroy session
    await destroySession();

    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account. Please try again.' },
      { status: 500 }
    );
  }
}
