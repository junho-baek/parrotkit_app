import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { mvpUsers } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret) as { userId: number };
    
    const users = await db
      .select({
        id: mvpUsers.id,
        email: mvpUsers.email,
        username: mvpUsers.username,
        subscriptionId: mvpUsers.subscriptionId,
        subscriptionStatus: mvpUsers.subscriptionStatus,
        planType: mvpUsers.planType,
        subscriptionEndsAt: mvpUsers.subscriptionEndsAt,
      })
      .from(mvpUsers)
      .where(eq(mvpUsers.id, decoded.userId));

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
