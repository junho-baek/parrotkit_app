import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAnonServerClient, createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  ensureProfileForSupabaseUser,
  legacyUserExistsByEmailOrUsername,
} from '@/lib/auth/legacy-migration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { data: existingProfileByEmail } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (existingProfileByEmail) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const { data: existingProfileByUsername } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .limit(1)
      .maybeSingle();

    if (existingProfileByUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }

    const legacyExists = await legacyUserExistsByEmailOrUsername(email, username);
    if (legacyExists) {
      return NextResponse.json(
        { error: 'Legacy account exists. Please sign in with your existing credentials.' },
        { status: 409 }
      );
    }

    const supabaseAnon = createSupabaseAnonServerClient();
    const { data: signUpData, error: signUpError } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (signUpError || !signUpData.user) {
      return NextResponse.json(
        { error: signUpError?.message || 'Signup failed' },
        { status: 400 }
      );
    }

    await ensureProfileForSupabaseUser({
      authUserId: signUpData.user.id,
      email,
      username,
    });

    let session = signUpData.session;

    if (!session) {
      const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        session = signInData.session;
      }
    }

    return NextResponse.json(
      {
        message: 'Signup successful',
        token: session?.access_token || null,
        refreshToken: session?.refresh_token || null,
        expiresAt: session?.expires_at || null,
        user: {
          id: signUpData.user.id,
          email,
          username,
          interests: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
