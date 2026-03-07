import { createClient } from '@supabase/supabase-js';

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }
  return value;
}

function getSupabasePublishableKey() {
  // Prefer the explicit project env name, but accept the dashboard-generated DEFAULT variant
  // so local setup and Vercel imports do not fork the code path.
  const value =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!value) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured'
    );
  }
  return value;
}

function getSupabaseSecretKey() {
  // Secret keys are the modern server-only replacement for legacy service_role JWT keys.
  // Keep them out of client bundles and use them only for privileged admin flows.
  const value = process.env.SUPABASE_SECRET_KEY;
  if (!value) {
    throw new Error('SUPABASE_SECRET_KEY is not configured');
  }
  return value;
}

export function createSupabasePublishableServerClient() {
  // Use the publishable key for normal auth/session work on the server so request handlers
  // do not accidentally depend on privileged credentials.
  return createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
