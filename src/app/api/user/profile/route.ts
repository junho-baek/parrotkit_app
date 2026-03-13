import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from('profiles')
      .select(
        'id, email, username, interests, subscription_id, subscription_status, plan_type, subscription_ends_at'
      )
      .eq('id', authUser.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const [
      { count: referencesCount, error: referencesCountError },
      { count: recipesCount, error: recipesCountError },
      { count: viewsCount, error: viewsCountError },
    ] = await Promise.all([
      supabase
        .from('references')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', authUser.id),
      supabase
        .from('recipes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', authUser.id),
      supabase
        .from('event_logs')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', authUser.id)
        .like('event_name', 'view_%'),
    ]);

    if (referencesCountError || recipesCountError || viewsCountError) {
      throw referencesCountError || recipesCountError || viewsCountError;
    }

    return NextResponse.json({
      user: {
        id: data.id,
        email: data.email,
        username: data.username,
        interests: data.interests || [],
        subscriptionId: data.subscription_id,
        subscriptionStatus: data.subscription_status,
        planType: data.plan_type,
        subscriptionEndsAt: data.subscription_ends_at,
      },
      stats: {
        references: referencesCount ?? 0,
        recipes: recipesCount ?? 0,
        views: viewsCount ?? 0,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
