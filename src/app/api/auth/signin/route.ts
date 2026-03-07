import { NextRequest, NextResponse } from 'next/server';
import { createSupabasePublishableServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  findLegacyUserByIdentifier,
  migrateLegacyUserToSupabase,
  verifyLegacyPassword,
} from '@/lib/auth/legacy-migration';

async function resolveEmailFromIdentifier(identifier: string): Promise<string> {
  const normalized = identifier.trim().toLowerCase();

  if (normalized.includes('@')) {
    return normalized;
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('username', normalized)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.email || normalized).toLowerCase();
}

async function fetchProfileByAuthUserId(authUserId: string) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, username, interests')
    .eq('id', authUserId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const supabaseAuth = createSupabasePublishableServerClient();

    const resolvedEmail = await resolveEmailFromIdentifier(identifier);

    let { data: signInData, error: signInError } = await supabaseAuth.auth.signInWithPassword({
      email: resolvedEmail,
      password,
    });

    if (signInError || !signInData.user || !signInData.session) {
      const legacyUser = await findLegacyUserByIdentifier(identifier);

      if (!legacyUser) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValidLegacyPassword = await verifyLegacyPassword(password, legacyUser.password);
      if (!isValidLegacyPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      await migrateLegacyUserToSupabase(legacyUser);

      const retried = await supabaseAuth.auth.signInWithPassword({
        email: legacyUser.email.toLowerCase(),
        password,
      });

      signInData = retried.data;
      signInError = retried.error;
    }

    if (signInError || !signInData.user || !signInData.session) {
      return NextResponse.json(
        { error: signInError?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const profile = await fetchProfileByAuthUserId(signInData.user.id);

    return NextResponse.json(
      {
        message: 'Login successful',
        token: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
        expiresAt: signInData.session.expires_at,
        user: {
          id: signInData.user.id,
          email: profile?.email || signInData.user.email,
          username: profile?.username || signInData.user.email || '',
          interests: profile?.interests || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
