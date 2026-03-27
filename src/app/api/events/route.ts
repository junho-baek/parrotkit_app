import { NextRequest, NextResponse } from 'next/server';
import { extractBearerToken } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { insertEventLog } from '@/lib/event-logs';

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

    await insertEventLog({
      userId,
      eventName,
      page,
      payload,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event logging error:', error);
    return NextResponse.json({ success: false, error: 'EVENT_LOGGING_FAILED' }, { status: 500 });
  }
}
