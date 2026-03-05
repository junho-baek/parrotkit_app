import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function PUT(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json();
    const interests = body.interests;

    if (!Array.isArray(interests)) {
      return NextResponse.json({ error: 'Interests must be an array' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        interests,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authUser.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Interests updated successfully' }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Update interests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
