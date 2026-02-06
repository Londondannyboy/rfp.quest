import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getUserById } from '@/lib/auth/user';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    const user = await getUserById(session.userId);

    if (!user) {
      // User no longer exists, clear session
      session.destroy();
      return NextResponse.json(
        { user: null },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { user: null },
      { status: 200 }
    );
  }
}
