import { NextRequest, NextResponse } from 'next/server';
import { extractBearerToken } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventName = String(body.eventName || '').trim();
    const payload = body.payload && typeof body.payload === 'object' ? body.payload : {};
    const page = typeof body.page === 'string' ? body.page : null;

    if (!eventName) {
      return NextResponse.json({ error: 'eventName is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    let userId: string | null = null;
    const token = extractBearerToken(request);
    if (token) {
      const { data } = await supabase.auth.getUser(token);
      userId = data.user?.id || null;
    }

    const { error } = await supabase.from('event_logs').insert({
      user_id: userId,
      event_name: eventName,
      page,
      payload,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event logging error:', error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
