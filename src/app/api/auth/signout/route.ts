import { NextRequest, NextResponse } from 'next/server';
import { createSupabasePublishableServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const accessToken = String(body.accessToken || '').trim();
    const refreshToken = String(body.refreshToken || '').trim();

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ success: true });
    }

    const supabase = createSupabasePublishableServerClient();

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json({ success: true });
  }
}
