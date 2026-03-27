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
  created_at: string;
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

type SourcePerformance = {
  source: string;
  users: number;
  paidUsers: number;
  conversionRate: number;
  recipeActivatedUsers: number;
  recipeActivationRate: number;
  checkoutUsers: number;
  checkoutRate: number;
};

type TopEvent = {
  eventName: string;
  count: number;
  share: number;
};

type Insight = {
  key: string;
  label: string;
  detail: string;
  severity: 'positive' | 'warning' | 'critical';
};

const MAX_LOOKBACK_DAYS = 90;
const DEFAULT_LOOKBACK_DAYS = 30;
const CHURN_EVENT_NAMES = ['subscription_cancelled', 'subscription_expired'];
const PURCHASE_EVENT_NAME = 'purchase_success';
const CHECKOUT_EVENT_NAME = 'begin_checkout';
const SIGNUP_SUCCESS_EVENT_NAME = 'signup_success';
const ONBOARDING_EVENT_NAME = 'onboarding_complete';
const REFERENCE_EVENT_NAME = 'reference_submitted';
const RECIPE_EVENT_NAME = 'recipe_generated';

type DailySeriesEntry = {
  date: string;
  signups: number;
  purchases: number;
  activeUsers?: number;
  recipes?: number;
  checkouts?: number;
};

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

function toRatioPercent(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return 0;
  }

  return Number(((numerator / denominator) * 100).toFixed(1));
}

function asDateKey(input: Date) {
  return input.toISOString().slice(0, 10);
}

function getDateBefore(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function buildDateSeries(days: number) {
  const today = new Date();
  const series: DailySeriesEntry[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setUTCDate(date.getUTCDate() - offset);
    series.push({
      date: asDateKey(date),
      signups: 0,
      purchases: 0,
      checkouts: 0,
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

function readUtmSource(payload: Record<string, unknown> | null) {
  if (!payload) {
    return null;
  }

  const sourceRaw = payload.utm_source;
  if (typeof sourceRaw !== 'string') {
    return null;
  }

  const normalized = sourceRaw.trim().toLowerCase();
  return normalized || null;
}

function readPayloadString(payload: Record<string, unknown> | null, key: string) {
  if (!payload) {
    return null;
  }

  const raw = payload[key];
  if (typeof raw !== 'string') {
    return null;
  }

  const normalized = raw.trim();
  return normalized || null;
}

function getEventUserIds(events: EventRow[], eventName: string, filter?: (event: EventRow) => boolean) {
  const ids = new Set<string>();

  for (const event of events) {
    if (event.event_name !== eventName || !event.user_id) {
      continue;
    }

    if (filter && !filter(event)) {
      continue;
    }

    ids.add(event.user_id);
  }

  return ids;
}

function getDistinctUserCount(events: Array<{ user_id: string | null }>) {
  return new Set(events.map((event) => event.user_id).filter((userId): userId is string => Boolean(userId))).size;
}

function getReturningUsers(events: EventRow[]) {
  const userDays = new Map<string, Set<string>>();

  for (const event of events) {
    if (!event.user_id) {
      continue;
    }

    const dayKey = event.created_at.slice(0, 10);
    const days = userDays.get(event.user_id) || new Set<string>();
    days.add(dayKey);
    userDays.set(event.user_id, days);
  }

  let returningUsers = 0;
  for (const days of userDays.values()) {
    if (days.size >= 2) {
      returningUsers += 1;
    }
  }

  return returningUsers;
}

function getSourcePerformance(params: {
  events: EventRow[];
  purchaseUserIds: Set<string>;
  recipeUserIds: Set<string>;
  checkoutUserIds: Set<string>;
}) {
  const firstSourceByUser = new Map<string, { source: string; createdAt: string }>();

  for (const event of params.events) {
    if (!event.user_id) {
      continue;
    }

    const source = readUtmSource(event.payload);
    if (!source) {
      continue;
    }

    const current = firstSourceByUser.get(event.user_id);
    if (!current || event.created_at < current.createdAt) {
      firstSourceByUser.set(event.user_id, { source, createdAt: event.created_at });
    }
  }

  const sourceUserMap = new Map<string, Set<string>>();
  for (const [userId, sourceData] of firstSourceByUser.entries()) {
    const users = sourceUserMap.get(sourceData.source) || new Set<string>();
    users.add(userId);
    sourceUserMap.set(sourceData.source, users);
  }

  const performance: SourcePerformance[] = Array.from(sourceUserMap.entries())
    .map(([source, users]) => {
      const userList = Array.from(users);
      const paidUsers = userList.filter((userId) => params.purchaseUserIds.has(userId)).length;
      const recipeActivatedUsers = userList.filter((userId) => params.recipeUserIds.has(userId)).length;
      const checkoutUsers = userList.filter((userId) => params.checkoutUserIds.has(userId)).length;

      return {
        source,
        users: userList.length,
        paidUsers,
        conversionRate: toRatioPercent(paidUsers, userList.length),
        recipeActivatedUsers,
        recipeActivationRate: toRatioPercent(recipeActivatedUsers, userList.length),
        checkoutUsers,
        checkoutRate: toRatioPercent(checkoutUsers, userList.length),
      };
    })
    .sort((a, b) => b.users - a.users)
    .slice(0, 6);

  return performance;
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

    const since = getDateBefore(days);
    const since30d = getDateBefore(30);
    const since7d = getDateBefore(7);
    const since1d = getDateBefore(1);
    const sinceIso = since.toISOString();
    const since30dIso = since30d.toISOString();
    const since7dIso = since7d.toISOString();
    const since1dIso = since1d.toISOString();

    const supabase = createSupabaseAdminClient();

    const [
      { data: totalProfilesRows, error: totalProfilesError },
      { data: profilesRows, error: profilesError },
      { data: referencesRows, error: referencesError },
      { data: recipesRows, error: recipesError },
      { data: purchaseRows, error: purchaseError },
      { data: churnRows, error: churnError },
      { data: periodEventRows, error: periodEventError },
      { data: last30dEventRows, error: last30dEventError },
      { data: last7dEventRows, error: last7dEventError },
      { data: last1dEventRows, error: last1dEventError },
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
        .select('user_id, created_at, event_name, payload')
        .eq('event_name', PURCHASE_EVENT_NAME)
        .gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('user_id, created_at, event_name')
        .in('event_name', CHURN_EVENT_NAMES)
        .gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('created_at, user_id, event_name, payload')
        .gte('created_at', sinceIso),
      supabase
        .from('event_logs')
        .select('created_at, user_id, event_name, payload')
        .gte('created_at', since30dIso),
      supabase
        .from('event_logs')
        .select('created_at, user_id, event_name, payload')
        .gte('created_at', since7dIso),
      supabase
        .from('event_logs')
        .select('created_at, user_id, event_name, payload')
        .gte('created_at', since1dIso),
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
      last30dEventError ||
      last7dEventError ||
      last1dEventError ||
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
        last30dEventError ||
        last7dEventError ||
        last1dEventError ||
        referencesTotalError ||
        recipesTotalError
      );
    }

    const totalProfiles = (totalProfilesRows || []) as ProfileRow[];
    const periodProfiles = (profilesRows || []) as ProfileRow[];
    const periodReferences = ((referencesRows || []) as UserRefRow[]).filter((row) => Boolean(row.user_id));
    const periodRecipes = ((recipesRows || []) as UserRefRow[]).filter((row) => Boolean(row.user_id));
    const periodPurchaseEvents = (purchaseRows || []) as EventRow[];
    const periodPurchases = periodPurchaseEvents.filter(
      (row) => Boolean(row.user_id) && readPayloadString(row.payload, 'source') === 'lemonsqueezy_webhook'
    );
    const periodChurns = (churnRows || []) as Array<{ user_id: string | null }>;
    const periodEvents = (periodEventRows || []) as EventRow[];
    const last30dEvents = (last30dEventRows || []) as EventRow[];
    const last7dEvents = (last7dEventRows || []) as EventRow[];
    const last1dEvents = (last1dEventRows || []) as EventRow[];

    const signups = periodProfiles.length;
    const onboarded = periodProfiles.filter((profile) => profile.onboarding_completed).length;

    const signupUserIds = new Set(periodProfiles.map((profile) => profile.id));
    const eventUserIdsInPeriod = new Set(
      periodEvents.map((event) => event.user_id).filter((userId): userId is string => Boolean(userId))
    );
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
    const checkoutUsersFromSignup = new Set(
      Array.from(getEventUserIds(periodEvents, CHECKOUT_EVENT_NAME)).filter((userId) => signupUserIds.has(userId))
    );
    const purchaseUsersFromSignup = new Set(
      periodPurchases
        .map((row) => row.user_id)
        .filter((userId): userId is string => Boolean(userId) && signupUserIds.has(userId as string))
    );

    const onboardingUsers = getEventUserIds(periodEvents, ONBOARDING_EVENT_NAME);
    const signupSuccessUsers = getEventUserIds(periodEvents, SIGNUP_SUCCESS_EVENT_NAME);
    const referenceEventUsers = getEventUserIds(periodEvents, REFERENCE_EVENT_NAME);
    const recipeEventUsers = getEventUserIds(periodEvents, RECIPE_EVENT_NAME);

    const paidTotalUsers = totalProfiles.filter(isPaidProfile).length;
    const churnedTotalUsers = totalProfiles.filter((profile) => isChurnedStatus(profile.subscription_status)).length;
    const churnEventsInPeriod = periodChurns.length;
    const paidUserRatio = toRatioPercent(paidTotalUsers, totalProfiles.length);

    const churnRate = toPercent(churnEventsInPeriod, paidTotalUsers + churnEventsInPeriod);
    const conversionRateSignupToPaid = toPercent(purchaseUsersFromSignup.size, signups);
    const conversionRateSignupToCheckout = toPercent(checkoutUsersFromSignup.size, signups);
    const conversionRateCheckoutToPaid = toPercent(purchaseUsersFromSignup.size, checkoutUsersFromSignup.size);
    const conversionRateRecipeToCheckout = toPercent(checkoutUsersFromSignup.size, recipeUsersFromSignup.size);
    const onboardingCompletionRate = toPercent(onboarded, signups);
    const referenceActivationRate = toPercent(referenceUsersFromSignup.size, signups);
    const recipeActivationRate = toPercent(recipeUsersFromSignup.size, signups);

    const identifiedEventsInPeriod = periodEvents.filter((event) => Boolean(event.user_id)).length;
    const anonymousEventsInPeriod = Math.max(0, periodEvents.length - identifiedEventsInPeriod);
    const identifiedEventRatio = toRatioPercent(identifiedEventsInPeriod, periodEvents.length);
    const eventCoverageRate = toRatioPercent(
      Array.from(signupUserIds).filter((userId) => eventUserIdsInPeriod.has(userId)).length,
      signups
    );
    const utmTaggedEvents = periodEvents.filter((event) => Boolean(readUtmSource(event.payload))).length;
    const utmCoverageRate = toRatioPercent(utmTaggedEvents, periodEvents.length);

    const purchaseEventsRaw = periodPurchaseEvents.length;
    const purchaseEventsWebhook = periodPurchases.length;
    const purchaseEventsClient = periodEvents.filter((event) => event.event_name === 'purchase_success_client').length;

    const stageCoverage = {
      signupSuccessUsers: signupSuccessUsers.size,
      onboardingEventUsers: onboardingUsers.size,
      referenceEventUsers: referenceEventUsers.size,
      recipeEventUsers: recipeEventUsers.size,
    };

    const mau = getDistinctUserCount(last30dEvents);
    const wau = getDistinctUserCount(last7dEvents);
    const dau = getDistinctUserCount(last1dEvents);
    const stickiness = toRatioPercent(dau, mau);
    const returningUsers30d = getReturningUsers(last30dEvents);
    const returningRate30d = toRatioPercent(returningUsers30d, mau);
    const avgEventsPerActiveUser30d =
      mau > 0 ? Number((last30dEvents.length / mau).toFixed(2)) : 0;

    const referencesPerNewUser = signups > 0 ? Number((periodReferences.length / signups).toFixed(2)) : 0;
    const recipesPerNewUser = signups > 0 ? Number((periodRecipes.length / signups).toFixed(2)) : 0;

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

    for (const event of periodEvents) {
      if (event.event_name !== CHECKOUT_EVENT_NAME) {
        continue;
      }

      const key = event.created_at.slice(0, 10);
      const item = dailyIndex.get(key);
      if (item) {
        item.checkouts = (item.checkouts || 0) + 1;
      }
    }

    const activeUsersByDay = new Map<string, Set<string>>();
    for (const event of periodEvents) {
      if (!event.user_id) {
        continue;
      }

      const dayKey = event.created_at.slice(0, 10);
      const users = activeUsersByDay.get(dayKey) || new Set<string>();
      users.add(event.user_id);
      activeUsersByDay.set(dayKey, users);
    }

    for (const recipe of periodRecipes as Array<{ created_at?: string }>) {
      const createdAt = recipe.created_at;
      if (!createdAt) {
        continue;
      }

      const key = createdAt.slice(0, 10);
      const item = dailyIndex.get(key);
      if (item) {
        item.recipes = (item.recipes || 0) + 1;
      }
    }

    for (const [dayKey, users] of activeUsersByDay.entries()) {
      const item = dailyIndex.get(dayKey);
      if (item) {
        item.activeUsers = users.size;
      }
    }

    const sourceCounter = new Map<string, number>();
    for (const event of periodEvents) {
      const source = readUtmSource(event.payload);
      if (!source) {
        continue;
      }

      sourceCounter.set(source, (sourceCounter.get(source) || 0) + 1);
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

    const sourcePerformance = getSourcePerformance({
      events: periodEvents,
      purchaseUserIds: purchaseUsersFromSignup,
      recipeUserIds: recipeUsersFromSignup,
      checkoutUserIds: checkoutUsersFromSignup,
    });

    const eventCounter = new Map<string, number>();
    for (const event of periodEvents) {
      eventCounter.set(event.event_name, (eventCounter.get(event.event_name) || 0) + 1);
    }

    const totalEvents = Array.from(eventCounter.values()).reduce((sum, count) => sum + count, 0);
    const topEvents: TopEvent[] = Array.from(eventCounter.entries())
      .map(([eventName, count]) => ({
        eventName,
        count,
        share: toRatioPercent(count, totalEvents),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

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
        dropoffFromPrev: toPercent(Math.max(0, onboarded - referenceUsersFromSignup.size), onboarded),
      },
      {
        key: 'recipe',
        label: 'Recipe Created',
        users: recipeUsersFromSignup.size,
        conversionFromPrev: toPercent(recipeUsersFromSignup.size, referenceUsersFromSignup.size),
        dropoffFromPrev: toPercent(
          Math.max(0, referenceUsersFromSignup.size - recipeUsersFromSignup.size),
          referenceUsersFromSignup.size
        ),
      },
      {
        key: 'checkout',
        label: 'Checkout Started',
        users: checkoutUsersFromSignup.size,
        conversionFromPrev: toPercent(checkoutUsersFromSignup.size, recipeUsersFromSignup.size),
        dropoffFromPrev: toPercent(
          Math.max(0, recipeUsersFromSignup.size - checkoutUsersFromSignup.size),
          recipeUsersFromSignup.size
        ),
      },
      {
        key: 'purchase',
        label: 'Paid Conversion',
        users: purchaseUsersFromSignup.size,
        conversionFromPrev: toPercent(purchaseUsersFromSignup.size, checkoutUsersFromSignup.size),
        dropoffFromPrev: toPercent(
          Math.max(0, checkoutUsersFromSignup.size - purchaseUsersFromSignup.size),
          checkoutUsersFromSignup.size
        ),
      },
    ];

    const kpis = {
      totalUsers: totalProfiles.length,
      newUsers: signups,
      totalReferences: referencesTotalCount || 0,
      totalRecipes: recipesTotalCount || 0,
      paidUsers: paidTotalUsers,
      paidUserRatio,
      churnedUsers: churnedTotalUsers,
      signupToPaidConversionRate: conversionRateSignupToPaid,
      signupToCheckoutRate: conversionRateSignupToCheckout,
      checkoutToPaidRate: conversionRateCheckoutToPaid,
      recipeToCheckoutRate: conversionRateRecipeToCheckout,
      churnRate,
      onboardingCompletionRate,
      referenceActivationRate,
      recipeActivationRate,
      dau,
      wau,
      mau,
      stickiness,
      returningUsers30d,
      returningRate30d,
      avgEventsPerActiveUser30d,
      referencesPerNewUser,
      recipesPerNewUser,
      purchasesInPeriod: periodPurchases.length,
      churnEventsInPeriod,
      totalEventsInPeriod: periodEvents.length,
      identifiedEventsInPeriod,
      anonymousEventsInPeriod,
      identifiedEventRatio,
      eventCoverageRate,
      utmCoverageRate,
      purchaseEventsRaw,
      purchaseEventsWebhook,
      purchaseEventsClient,
      checkoutUsersFromSignup: checkoutUsersFromSignup.size,
      signupSuccessUsers: stageCoverage.signupSuccessUsers,
      onboardingEventUsers: stageCoverage.onboardingEventUsers,
      referenceEventUsers: stageCoverage.referenceEventUsers,
      recipeEventUsers: stageCoverage.recipeEventUsers,
    };

    const topSourceShare = sourceShares[0]?.share || 0;
    const insights: Insight[] = [
      {
        key: 'onboarding_dropoff',
        label: 'Onboarding Completion',
        detail: `Current completion is ${onboardingCompletionRate.toFixed(1)}%.`,
        severity: onboardingCompletionRate >= 70 ? 'positive' : onboardingCompletionRate >= 50 ? 'warning' : 'critical',
      },
      {
        key: 'paid_conversion',
        label: 'Signup to Paid',
        detail: `Conversion is ${conversionRateSignupToPaid.toFixed(1)}% for the selected period.`,
        severity: conversionRateSignupToPaid >= 8 ? 'positive' : conversionRateSignupToPaid >= 4 ? 'warning' : 'critical',
      },
      {
        key: 'checkout_bottleneck',
        label: 'Checkout to Paid',
        detail: `Checkout-to-paid is ${conversionRateCheckoutToPaid.toFixed(1)}% with ${checkoutUsersFromSignup.size} checkout users.`,
        severity: conversionRateCheckoutToPaid >= 55 ? 'positive' : conversionRateCheckoutToPaid >= 35 ? 'warning' : 'critical',
      },
      {
        key: 'retention_proxy',
        label: 'Returning User Rate (30d)',
        detail: `${returningRate30d.toFixed(1)}% of MAU returned on multiple days.`,
        severity: returningRate30d >= 35 ? 'positive' : returningRate30d >= 20 ? 'warning' : 'critical',
      },
      {
        key: 'source_concentration',
        label: 'Source Concentration',
        detail: `Top source share is ${topSourceShare.toFixed(1)}%.`,
        severity: topSourceShare <= 45 ? 'positive' : topSourceShare <= 60 ? 'warning' : 'critical',
      },
      {
        key: 'churn_monitor',
        label: 'Churn Monitor',
        detail: `Churn rate proxy is ${churnRate.toFixed(1)}%.`,
        severity: churnRate <= 5 ? 'positive' : churnRate <= 10 ? 'warning' : 'critical',
      },
      {
        key: 'event_identity_quality',
        label: 'Identified Event Ratio',
        detail: `${identifiedEventRatio.toFixed(1)}% of events include user_id.`,
        severity: identifiedEventRatio >= 85 ? 'positive' : identifiedEventRatio >= 70 ? 'warning' : 'critical',
      },
      {
        key: 'utm_coverage',
        label: 'UTM Coverage',
        detail: `${utmCoverageRate.toFixed(1)}% of events include utm_source.`,
        severity: utmCoverageRate >= 35 ? 'positive' : utmCoverageRate >= 20 ? 'warning' : 'critical',
      },
    ];

    const trend = dailySeries.map((entry) => ({
      date: entry.date,
      signups: entry.signups,
      purchases: entry.purchases,
      activeUsers: entry.activeUsers || 0,
      recipes: entry.recipes || 0,
      checkouts: entry.checkouts || 0,
    }));

    return NextResponse.json({
      range: {
        days,
        since: sinceIso,
      },
      kpis,
      funnel: stages,
      trafficSources: sourceShares,
      sourcePerformance,
      topEvents,
      trend,
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
