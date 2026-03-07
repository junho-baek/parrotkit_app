const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadDotEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const idx = line.indexOf('=');
    const key = line.slice(0, idx).trim();
    if (process.env[key]) continue;

    let value = line.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function normalizeDatabaseUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  let value = rawUrl;
  if (value.startsWith('DATABASE_URL=')) {
    value = value.slice('DATABASE_URL='.length);
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  return value;
}

async function listAllSupabaseUsers(supabaseAdmin) {
  const users = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw error;
    }

    users.push(...data.users);

    if (data.users.length < perPage) {
      break;
    }

    page += 1;
  }

  return users;
}

async function findAuthUserIdByEmail(supabaseAdmin, email) {
  const users = await listAllSupabaseUsers(supabaseAdmin);
  const found = users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  return found?.id || null;
}

async function main() {
  loadDotEnvLocal();
  const legacyDbUrl = normalizeDatabaseUrl(
    process.env.LEGACY_DATABASE_URL || process.env.DATABASE_URL
  );
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // This script needs admin auth APIs, so it intentionally uses the modern server-side secret key.
  // New Supabase projects should not add legacy service_role JWT keys unless interoperability requires it.
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  const dryRun = process.argv.includes('--dry-run');

  if (!legacyDbUrl) {
    throw new Error('LEGACY_DATABASE_URL or DATABASE_URL is required');
  }

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY are required');
  }

  const client = new Client({ connectionString: legacyDbUrl });
  const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await client.connect();

  try {
    const { rows } = await client.query(`
      select
        id,
        email,
        username,
        password,
        interests,
        subscription_id,
        subscription_status,
        plan_type,
        subscription_ends_at
      from public.mvp_users
      order by id asc
    `);

    console.log(`[migration] legacy users: ${rows.length}`);

    let migrated = 0;
    let reused = 0;
    let failed = 0;

    for (const row of rows) {
      const email = String(row.email || '').trim().toLowerCase();
      const username = String(row.username || '').trim();

      if (!email || !username || !row.password) {
        console.warn(`[skip] invalid row: legacy_id=${row.id}`);
        continue;
      }

      if (dryRun) {
        console.log(`[dry-run] legacy_id=${row.id} email=${email}`);
        continue;
      }

      let authUserId = null;
      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          password_hash: row.password,
          user_metadata: {
            legacy_user_id: row.id,
            migrated_at: new Date().toISOString(),
          },
        });

        if (error || !data.user?.id) {
          authUserId = await findAuthUserIdByEmail(supabaseAdmin, email);
          if (!authUserId) {
            throw error || new Error('createUser failed and fallback lookup failed');
          }
          reused += 1;
        } else {
          authUserId = data.user.id;
          migrated += 1;
        }

        const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
          {
            id: authUserId,
            email,
            username,
            interests: Array.isArray(row.interests) ? row.interests : [],
            onboarding_completed: Array.isArray(row.interests) && row.interests.length > 0,
            subscription_id: row.subscription_id,
            subscription_status: row.subscription_status || 'free',
            plan_type: row.plan_type || 'free',
            subscription_ends_at: row.subscription_ends_at
              ? new Date(row.subscription_ends_at).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

        if (profileError) {
          throw profileError;
        }

        console.log(`[ok] legacy_id=${row.id} auth_user_id=${authUserId} email=${email}`);
      } catch (error) {
        failed += 1;
        console.error(`[fail] legacy_id=${row.id} email=${email}:`, error.message || error);
      }
    }

    console.log(`[migration] done migrated=${migrated} reused=${reused} failed=${failed}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('[migration] fatal:', error);
  process.exit(1);
});
