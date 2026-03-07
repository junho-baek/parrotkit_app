'use client';

import { createClient } from '@supabase/supabase-js';

let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Supabase now recommends publishable keys for app clients because they rotate independently
  // from the project's JWT signing secret. Keep the DEFAULT fallback for dashboard-generated env names.
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  browserClient = createClient(supabaseUrl, supabasePublishableKey);
  return browserClient;
}
