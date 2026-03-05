import bcrypt from 'bcryptjs';
import { eq, ilike, or } from 'drizzle-orm';
import { db } from '@/lib/db';
import { mvpUsers } from '@/lib/schema';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

export type LegacyUser = {
  id: number;
  email: string;
  username: string;
  password: string;
  interests: string[] | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  planType: string | null;
  subscriptionEndsAt: Date | null;
};

function normalizeIdentifier(identifier: string) {
  return identifier.trim().toLowerCase();
}

export async function findLegacyUserByIdentifier(identifier: string): Promise<LegacyUser | null> {
  const normalized = normalizeIdentifier(identifier);

  const rows = await db
    .select({
      id: mvpUsers.id,
      email: mvpUsers.email,
      username: mvpUsers.username,
      password: mvpUsers.password,
      interests: mvpUsers.interests,
      subscriptionId: mvpUsers.subscriptionId,
      subscriptionStatus: mvpUsers.subscriptionStatus,
      planType: mvpUsers.planType,
      subscriptionEndsAt: mvpUsers.subscriptionEndsAt,
    })
    .from(mvpUsers)
    .where(
      or(
        ilike(mvpUsers.email, normalized),
        ilike(mvpUsers.username, normalized)
      )
    )
    .limit(1);

  return rows[0] || null;
}

export async function verifyLegacyPassword(plainPassword: string, hash: string) {
  return bcrypt.compare(plainPassword, hash);
}

async function findAuthUserIdByEmail(email: string): Promise<string | null> {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw error;
  }

  const found = data.users.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
  return found?.id || null;
}

export async function upsertProfileFromLegacy(authUserId: string, legacyUser: LegacyUser) {
  const supabaseAdmin = createSupabaseAdminClient();

  const { error } = await supabaseAdmin.from('profiles').upsert(
    {
      id: authUserId,
      email: legacyUser.email,
      username: legacyUser.username,
      interests: legacyUser.interests || [],
      onboarding_completed: Array.isArray(legacyUser.interests) && legacyUser.interests.length > 0,
      subscription_id: legacyUser.subscriptionId,
      subscription_status: legacyUser.subscriptionStatus || 'free',
      plan_type: legacyUser.planType || 'free',
      subscription_ends_at: legacyUser.subscriptionEndsAt
        ? legacyUser.subscriptionEndsAt.toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

export async function migrateLegacyUserToSupabase(legacyUser: LegacyUser): Promise<string> {
  const supabaseAdmin = createSupabaseAdminClient();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: legacyUser.email,
    email_confirm: true,
    password_hash: legacyUser.password,
    user_metadata: {
      legacy_user_id: legacyUser.id,
      migrated_at: new Date().toISOString(),
    },
  });

  let authUserId = data.user?.id || null;

  if (error || !authUserId) {
    const existingId = await findAuthUserIdByEmail(legacyUser.email);
    if (!existingId) {
      throw error || new Error('Failed to migrate legacy user to Supabase');
    }
    authUserId = existingId;
  }

  await upsertProfileFromLegacy(authUserId, legacyUser);
  return authUserId;
}

export async function ensureProfileForSupabaseUser(params: {
  authUserId: string;
  email: string;
  username: string;
}) {
  const supabaseAdmin = createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('profiles').upsert(
    {
      id: params.authUserId,
      email: params.email,
      username: params.username,
      interests: [],
      onboarding_completed: false,
      subscription_status: 'free',
      plan_type: 'free',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

export async function findLegacyUserByEmail(email: string): Promise<LegacyUser | null> {
  const rows = await db
    .select({
      id: mvpUsers.id,
      email: mvpUsers.email,
      username: mvpUsers.username,
      password: mvpUsers.password,
      interests: mvpUsers.interests,
      subscriptionId: mvpUsers.subscriptionId,
      subscriptionStatus: mvpUsers.subscriptionStatus,
      planType: mvpUsers.planType,
      subscriptionEndsAt: mvpUsers.subscriptionEndsAt,
    })
    .from(mvpUsers)
    .where(eq(mvpUsers.email, email))
    .limit(1);

  return rows[0] || null;
}

export async function legacyUserExistsByEmailOrUsername(email: string, username: string) {
  const rows = await db
    .select({ id: mvpUsers.id })
    .from(mvpUsers)
    .where(
      or(
        eq(mvpUsers.email, email),
        eq(mvpUsers.username, username)
      )
    )
    .limit(1);

  return rows.length > 0;
}
