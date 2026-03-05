import { NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export type AuthenticatedUser = {
  id: string;
  email: string;
};

export function extractBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length).trim();
}

export async function requireAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser> {
  const token = extractBearerToken(request);
  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new Error('UNAUTHORIZED');
  }

  return {
    id: data.user.id,
    email: data.user.email || '',
  };
}
