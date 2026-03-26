import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '@/lib/auth/server-auth';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

type ProfileRow = {
  id: string;
  created_at: string;
  onboarding_completed: boolean;
  plan_type: string | null;
  subscription_status: string | null;
  subscription_id: string | null;
};

type UserRefRow = {
  user_id: string;
};

type EventRow = {
  user_id: string | null;
  event_name: string;
  payload: Record<string, unknown> | null;
};

type Stage = {
  key: string;
  label: string;
  users: number;
  conversionFromPrev: number;
  dropoffFromPrev: number;
};

type SourceShare = {
  source: string;
  sessions: number;
  share: number;
};

const MAX_LOOKBACK_DAYS = 90;
const DEFAULT_LOOKBACK_DAYS = 30;
const CHURN_EVENT_NAMES = ['subscription_cancelled', 'subscription_expired'];
const PURCHASE_EVENT_NAME = 'purchase_success';

function toNumber(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

function clampDays(days: number) {
  if (days < 1) {
    return 1;
  }

  if (days > MAX_LOOKBACK_DAYS) {
    return MAX_LOOKBACK_DAYS;
  }

  return days;
}

function toPercent(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return Number(((numerator / denominator) * 100).toFixed(1));
}

function asDateKey(input: Date) {
  return input.toISOString().slice(0, 10);
}

function buildDateSeries(days: number) {
  const today = new Date();
  const series: Array<{ date: string; signups: number; purchases: number }> = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - offset);
    series.push({
      date: asDateKey(date),
      signups: 0,
      purchases: 0,
    });
  }

  return series;
}

function isPaidProfile(profile: ProfileRow) {
  if (profile.plan_type === 'pro') {
    return true;
  }

  if (profile.subscription_id) {
    return true;
  }

  const status = (profile.subscription_status || '').toLowerCase();
  return Boolean(status && status !== 'free');
}

function isChurnedStatus(status: string | null) {
  const value = (status || '').toLowerCase();
  return value === 'cancelled' || value === 'expired';
}

function parseAdminEmails() {
  const raw = process.env.ADMIN_DASHBOARD_EMAILS || process.env.ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
}

function ensureAdminAccess(email: string) {
  const adminEmails = parseAdminEmails();

  if (!adminEmails.length) {
    return false;
  }

  return adminEmails.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);

    if (!ensureAdminAccess(authUser.email)) {
      return NextResponse.json(
        {
          error: 'Forbidden',
          message:
            'Admin access denied. Add your email to ADMIN_DASHBOARD_EMAILS (comma-separated) in .env.local.',
        },
        { status: 403 }
      );
    }

    const daysParam = request.nextUrl.searchParams.get('days');
    const days = clampDays(toNumber(daysParam, DEFAULT_LOOKBACK_DAYS));

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    const sinceIso = since.toISOString();

    const supabase = createSupabaseAdminClient();

    const [
      { data: totalProfilesRows, error: totalProfilesError },
      { data: profilesRows, error: profilesError },
      { data: referencesRows, error: referencesError },
      { data: recipesRows, error: recipesError },
      { data: purchaseRows, error: purchaseError },
      { data: churnRows, error: churnError },
      { data: periodEventRows, error: periodEventError },
      { count: referencesTotalCount, error: referencesTotalError },
      { count: recipesTotalCount, error: recipesTotalError },
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, created_at, onboarding_completed, plan_type, subscription_status, subscription_id'),
      supabase
        .from('profiles')
        .select('id, created_at, onboarding_completed, plan_type, subscription_status, subscription_id')
        .gte('created_at', sinceIso),
      supabase.from('references').select('user_id, created_at').gte('created_at', sinceIso),
      supabase.from('recipes').select('user_id, created_at').gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('user_id, created_at, event_name')
        .eq('event_name', PURCHASE_EVENT_NAME)
        .gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('user_id, created_at, event_name')
        .in('event_name', CHURN_EVENT_NAMES)
        .gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('user_id, event_name, payload')
        .gte('created_at', sinceIso),
      supabase.from('references').select('id', { count: 'exact', head: true }),
      supabase.from('recipes').select('id', { count: 'exact', head: true }),
    ]);

    if (
      totalProfilesError ||
      profilesError ||
      referencesError ||
      recipesError ||
      purchaseError ||
      churnError ||
      periodEventError ||
      referencesTotalError ||
      recipesTotalError
    ) {
      throw (
        totalProfilesError ||
        profilesError ||
        referencesError ||
        recipesError ||
        purchaseError ||
        churnError ||
        periodEventError ||
        referencesTotalError ||
        recipesTotalError
      );
    }

    const totalProfiles = (totalProfilesRows || []) as ProfileRow[];
    const periodProfiles = (profilesRows || []) as ProfileRow[];
    const periodReferences = ((referencesRows || []) as UserRefRow[]).filter((row) => Boolean(row.user_id));
    const periodRecipes = ((recipesRows || []) as UserRefRow[]).filter((row) => Boolean(row.user_id));
    const periodPurchases = ((purchaseRows || []) as Array<{ user_id: string | null; created_at?: string }>).filter(
      (row) => Boolean(row.user_id)
    );
    const periodChurns = (churnRows || []) as Array<{ user_id: string | null }>;
    const periodEvents = (periodEventRows || []) as EventRow[];

    const signups = periodProfiles.length;
    const onboarded = periodProfiles.filter((profile) => profile.onboarding_completed).length;

    const signupUserIds = new Set(periodProfiles.map((profile) => profile.id));
    const referenceUsersFromSignup = new Set(
      periodReferences
        .map((row) => row.user_id)
        .filter((userId) => signupUserIds.has(userId))
    );
    const recipeUsersFromSignup = new Set(
      periodRecipes
        .map((row) => row.user_id)
        .filter((userId) => signupUserIds.has(userId))
    );
    const purchaseUsersFromSignup = new Set(
      periodPurchases
        .map((row) => row.user_id)
        .filter((userId): userId is string => Boolean(userId) && signupUserIds.has(userId as string))
    );

    const paidTotalUsers = totalProfiles.filter(isPaidProfile).length;
    const churnedTotalUsers = totalProfiles.filter((profile) => isChurnedStatus(profile.subscription_status)).length;
    const churnEventsInPeriod = periodChurns.length;

    const churnRate = toPercent(churnEventsInPeriod, paidTotalUsers + churnEventsInPeriod);
    const conversionRateSignupToPaid = toPercent(purchaseUsersFromSignup.size, signups);
    const onboardingCompletionRate = toPercent(onboarded, signups);
    const referenceActivationRate = toPercent(referenceUsersFromSignup.size, signups);
    const recipeActivationRate = toPercent(recipeUsersFromSignup.size, signups);

    const dailySeries = buildDateSeries(days);
    const dailyIndex = new Map(dailySeries.map((entry) => [entry.date, entry]));

    for (const profile of periodProfiles) {
      const key = profile.created_at.slice(0, 10);
      const item = dailyIndex.get(key);
      if (item) {
        item.signups += 1;
      }
    }

    for (const purchase of periodPurchases) {
      const createdAt = purchase.created_at;
      if (!createdAt) {
        continue;
      }

      const key = createdAt.slice(0, 10);
      const item = dailyIndex.get(key);
      if (item) {
        item.purchases += 1;
      }
    }

    const sourceCounter = new Map<string, number>();
    for (const event of periodEvents) {
      const payload = event.payload;
      if (!payload || typeof payload !== 'object') {
        continue;
      }

      const sourceRaw = payload.utm_source;
      if (typeof sourceRaw !== 'string') {
        continue;
      }

      const normalized = sourceRaw.trim().toLowerCase();
      if (!normalized) {
        continue;
      }

      sourceCounter.set(normalized, (sourceCounter.get(normalized) || 0) + 1);
    }

    const sourceTotal = Array.from(sourceCounter.values()).reduce((sum, value) => sum + value, 0);
    const sourceShares: SourceShare[] = Array.from(sourceCounter.entries())
      .map(([source, sessions]) => ({
        source,
        sessions,
        share: toPercent(sessions, sourceTotal),
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5);

    const stages: Stage[] = [
      {
        key: 'signup',
        label: 'Signup',
        users: signups,
        conversionFromPrev: 100,
        dropoffFromPrev: 0,
      },
      {
        key: 'onboarding',
        label: 'Onboarding Completed',
        users: onboarded,
        conversionFromPrev: toPercent(onboarded, signups),
        dropoffFromPrev: toPercent(signups - onboarded, signups),
      },
      {
        key: 'reference',
        label: 'Reference Created',
        users: referenceUsersFromSignup.size,
        conversionFromPrev: toPercent(referenceUsersFromSignup.size, onboarded),
        dropoffFromPrev: toPercent(onboarded - referenceUsersFromSignup.size, onboarded),
      },
      {
        key: 'recipe',
        label: 'Recipe Created',
        users: recipeUsersFromSignup.size,
        conversionFromPrev: toPercent(recipeUsersFromSignup.size, referenceUsersFromSignup.size),
        dropoffFromPrev: toPercent(referenceUsersFromSignup.size - recipeUsersFromSignup.size, referenceUsersFromSignup.size),
      },
      {
        key: 'purchase',
        label: 'Paid Conversion',
        users: purchaseUsersFromSignup.size,
        conversionFromPrev: toPercent(purchaseUsersFromSignup.size, recipeUsersFromSignup.size),
        dropoffFromPrev: toPercent(recipeUsersFromSignup.size - purchaseUsersFromSignup.size, recipeUsersFromSignup.size),
      },
    ];

    const kpis = {
      totalUsers: totalProfiles.length,
      newUsers: signups,
      totalReferences: referencesTotalCount || 0,
      totalRecipes: recipesTotalCount || 0,
      paidUsers: paidTotalUsers,
      churnedUsers: churnedTotalUsers,
      signupToPaidConversionRate: conversionRateSignupToPaid,
      churnRate,
      onboardingCompletionRate,
      referenceActivationRate,
      recipeActivationRate,
      purchasesInPeriod: periodPurchases.length,
      churnEventsInPeriod,
    };

    const insights = [
      {
        key: 'onboarding_dropoff',
        label: 'Onboarding Drop-off',
        value: toPercent(signups - onboarded, signups),
        direction: signups - onboarded > 0 ? 'down' : 'flat',
      },
      {
        key: 'recipe_gap',
        label: 'Reference → Recipe Gap',
        value: toPercent(referenceUsersFromSignup.size - recipeUsersFromSignup.size, referenceUsersFromSignup.size),
        direction: referenceUsersFromSignup.size > recipeUsersFromSignup.size ? 'down' : 'flat',
      },
      {
        key: 'paid_conversion',
        label: 'Signup → Paid Conversion',
        value: conversionRateSignupToPaid,
        direction: conversionRateSignupToPaid >= 10 ? 'up' : 'flat',
      },
    ];

    return NextResponse.json({
      range: {
        days,
        since: sinceIso,
      },
      kpis,
      funnel: stages,
      trafficSources: sourceShares,
      trend: dailySeries,
      insights,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Admin KPI error:', error);
    return NextResponse.json({ error: 'Failed to load admin KPI data' }, { status: 500 });
  }
}
