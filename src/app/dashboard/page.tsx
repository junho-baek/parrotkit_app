'use client';

import React from 'react';
import { authenticatedFetch } from '@/lib/auth/client-session';

type DashboardResponse = {
  range: {
    days: number;
    since: string;
  };
  kpis: {
    totalUsers: number;
    newUsers: number;
    totalReferences: number;
    totalRecipes: number;
    paidUsers: number;
    paidUserRatio: number;
    churnedUsers: number;
    signupToPaidConversionRate: number;
    signupToCheckoutRate: number;
    checkoutToPaidRate: number;
    recipeToCheckoutRate: number;
    churnRate: number;
    onboardingCompletionRate: number;
    referenceActivationRate: number;
    recipeActivationRate: number;
    dau: number;
    wau: number;
    mau: number;
    stickiness: number;
    returningUsers30d: number;
    returningRate30d: number;
    avgEventsPerActiveUser30d: number;
    referencesPerNewUser: number;
    recipesPerNewUser: number;
    purchasesInPeriod: number;
    churnEventsInPeriod: number;
    totalEventsInPeriod: number;
    identifiedEventsInPeriod: number;
    anonymousEventsInPeriod: number;
    identifiedEventRatio: number;
    eventCoverageRate: number;
    utmCoverageRate: number;
    purchaseEventsRaw: number;
    purchaseEventsWebhook: number;
    purchaseEventsClient: number;
    checkoutUsersFromSignup: number;
    signupSuccessUsers: number;
    onboardingEventUsers: number;
    referenceEventUsers: number;
    recipeEventUsers: number;
  };
  funnel: Array<{
    key: string;
    label: string;
    users: number;
    conversionFromPrev: number;
    dropoffFromPrev: number;
  }>;
  trafficSources: Array<{
    source: string;
    sessions: number;
    share: number;
  }>;
  sourcePerformance: Array<{
    source: string;
    users: number;
    paidUsers: number;
    conversionRate: number;
    recipeActivatedUsers: number;
    recipeActivationRate: number;
    checkoutUsers: number;
    checkoutRate: number;
  }>;
  topEvents: Array<{
    eventName: string;
    count: number;
    share: number;
  }>;
  trend: Array<{
    date: string;
    signups: number;
    purchases: number;
    activeUsers: number;
    recipes: number;
    checkouts: number;
  }>;
  insights: Array<{
    key: string;
    label: string;
    detail: string;
    severity: 'positive' | 'warning' | 'critical';
  }>;
};

const RANGE_OPTIONS = [7, 30, 90];

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDecimal(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function Badge({ severity }: { severity: 'positive' | 'warning' | 'critical' }) {
  if (severity === 'positive') {
    return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Stable</span>;
  }

  if (severity === 'warning') {
    return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">Watch</span>;
  }

  return <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold text-red-700">Risk</span>;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-slate-500">{sub}</p> : null}
    </div>
  );
}

export default function DashboardPage() {
  const [days, setDays] = React.useState<number>(30);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<DashboardResponse | null>(null);

  const loadDashboard = React.useCallback(async (selectedDays: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(`/api/admin/kpi?days=${selectedDays}`);
      const payload = (await response.json()) as DashboardResponse & {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(payload.message || payload.error || 'Failed to load dashboard');
        setData(null);
        return;
      }

      setData(payload);
    } catch {
      setError('Failed to load dashboard');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadDashboard(days);
  }, [days, loadDashboard]);

  const maxTrendValue = React.useMemo(() => {
    if (!data?.trend?.length) {
      return 0;
    }

    return Math.max(
      ...data.trend.map((entry) =>
        Math.max(entry.signups, entry.purchases, entry.activeUsers, entry.recipes, entry.checkouts, 0)
      )
    );
  }, [data]);

  const webhookReliability = React.useMemo(() => {
    if (!data) {
      return 0;
    }

    return data.kpis.purchaseEventsRaw > 0
      ? Number(((data.kpis.purchaseEventsWebhook / data.kpis.purchaseEventsRaw) * 100).toFixed(1))
      : 0;
  }, [data]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#e0f2fe,_transparent_38%),radial-gradient(circle_at_top_right,_#ecfeff,_transparent_32%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Executive Console</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">ParrotKit Growth Intelligence</h1>
              <p className="mt-2 text-sm text-slate-600">
                Professional dashboard for acquisition, funnel, retention, and data quality monitoring.
              </p>
              {data ? (
                <p className="mt-1 text-xs text-slate-500">
                  Window: last {data.range.days} days (since {formatDate(data.range.since)})
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    option === days
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setDays(option)}
                  disabled={loading}
                >
                  {option}d
                </button>
              ))}
              <button
                type="button"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
                disabled={loading}
                onClick={() => void loadDashboard(days)}
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading enterprise KPI data...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">{error}</div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Acquisition"
                value={formatNumber(data.kpis.newUsers)}
                sub={`Signup to checkout ${formatPercent(data.kpis.signupToCheckoutRate)}`}
              />
              <StatCard
                label="Revenue Conversion"
                value={formatPercent(data.kpis.signupToPaidConversionRate)}
                sub={`Checkout to paid ${formatPercent(data.kpis.checkoutToPaidRate)}`}
              />
              <StatCard
                label="Retention"
                value={formatPercent(data.kpis.returningRate30d)}
                sub={`Stickiness ${formatPercent(data.kpis.stickiness)}`}
              />
              <StatCard
                label="Data Quality"
                value={formatPercent(data.kpis.identifiedEventRatio)}
                sub={`UTM coverage ${formatPercent(data.kpis.utmCoverageRate)}`}
              />
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900">Full Funnel</h2>
                  <span className="text-xs text-slate-500">Signup to Paid with checkout stage</span>
                </div>
                <div className="mt-4 space-y-3">
                  {data.funnel.map((stage, index) => {
                    const width = Math.max(6, Math.min(100, stage.conversionFromPrev));
                    return (
                      <div key={stage.key} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">{index + 1}. {stage.label}</p>
                          <p className="text-sm font-semibold text-slate-900">{formatNumber(stage.users)}</p>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-200">
                          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500" style={{ width: `${width}%` }} />
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-slate-500">
                          <span>Conv {formatPercent(stage.conversionFromPrev)}</span>
                          <span>Drop {formatPercent(stage.dropoffFromPrev)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-900">Revenue Integrity</h2>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between"><span>Raw purchase events</span><strong>{formatNumber(data.kpis.purchaseEventsRaw)}</strong></div>
                    <div className="flex items-center justify-between"><span>Webhook purchase events</span><strong>{formatNumber(data.kpis.purchaseEventsWebhook)}</strong></div>
                    <div className="flex items-center justify-between"><span>Client purchase events</span><strong>{formatNumber(data.kpis.purchaseEventsClient)}</strong></div>
                    <div className="flex items-center justify-between"><span>Webhook reliability</span><strong>{formatPercent(webhookReliability)}</strong></div>
                    <div className="flex items-center justify-between"><span>Checkout users</span><strong>{formatNumber(data.kpis.checkoutUsersFromSignup)}</strong></div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-slate-900">Action Insights</h2>
                  <ul className="mt-3 space-y-2">
                    {data.insights.map((insight) => (
                      <li key={insight.key} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800">{insight.label}</span>
                          <Badge severity={insight.severity} />
                        </div>
                        <p className="mt-1 text-xs text-slate-600">{insight.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
                <h2 className="text-base font-semibold text-slate-900">KPI Matrix</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard label="Total Users" value={formatNumber(data.kpis.totalUsers)} sub={`Paid users ${formatNumber(data.kpis.paidUsers)}`} />
                  <StatCard label="DAU / WAU / MAU" value={`${formatNumber(data.kpis.dau)} / ${formatNumber(data.kpis.wau)} / ${formatNumber(data.kpis.mau)}`} sub={`Avg events per active ${formatDecimal(data.kpis.avgEventsPerActiveUser30d)}`} />
                  <StatCard label="Onboarding Completion" value={formatPercent(data.kpis.onboardingCompletionRate)} sub={`Event users ${formatNumber(data.kpis.onboardingEventUsers)}`} />
                  <StatCard label="Reference Activation" value={formatPercent(data.kpis.referenceActivationRate)} sub={`Refs/new user ${formatDecimal(data.kpis.referencesPerNewUser)}`} />
                  <StatCard label="Recipe Activation" value={formatPercent(data.kpis.recipeActivationRate)} sub={`Recipes/new user ${formatDecimal(data.kpis.recipesPerNewUser)}`} />
                  <StatCard label="Churn" value={formatPercent(data.kpis.churnRate)} sub={`${formatNumber(data.kpis.churnEventsInPeriod)} churn events`} />
                  <StatCard label="Event Coverage" value={formatPercent(data.kpis.eventCoverageRate)} sub={`${formatNumber(data.kpis.identifiedEventsInPeriod)} identified events`} />
                  <StatCard label="Anonymous Events" value={formatNumber(data.kpis.anonymousEventsInPeriod)} sub={`Total events ${formatNumber(data.kpis.totalEventsInPeriod)}`} />
                  <StatCard label="Recipe to Checkout" value={formatPercent(data.kpis.recipeToCheckoutRate)} sub={`Signups to paid ${formatPercent(data.kpis.signupToPaidConversionRate)}`} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Top Events</h2>
                <div className="mt-3 space-y-2">
                  {data.topEvents.length ? (
                    data.topEvents.map((event) => (
                      <div key={event.eventName} className="rounded-lg border border-slate-100 p-3">
                        <div className="flex items-center justify-between text-sm text-slate-700">
                          <span className="font-medium">{event.eventName}</span>
                          <span>{formatNumber(event.count)}</span>
                        </div>
                        <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${Math.min(100, event.share)}%` }} />
                        </div>
                        <p className="mt-1 text-[11px] text-slate-500">Share {formatPercent(event.share)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No event logs in this range.</p>
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Source Performance</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="py-2 pr-3 font-medium">Source</th>
                        <th className="py-2 pr-3 font-medium">Users</th>
                        <th className="py-2 pr-3 font-medium">Checkout</th>
                        <th className="py-2 pr-3 font-medium">Paid CVR</th>
                        <th className="py-2 pr-3 font-medium">Recipe Act.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sourcePerformance.length ? (
                        data.sourcePerformance.map((row) => (
                          <tr key={row.source} className="border-t border-slate-100 text-slate-700">
                            <td className="py-2 pr-3 font-medium">{row.source}</td>
                            <td className="py-2 pr-3">{formatNumber(row.users)}</td>
                            <td className="py-2 pr-3">{formatPercent(row.checkoutRate)} ({formatNumber(row.checkoutUsers)})</td>
                            <td className="py-2 pr-3">{formatPercent(row.conversionRate)} ({formatNumber(row.paidUsers)})</td>
                            <td className="py-2 pr-3">{formatPercent(row.recipeActivationRate)} ({formatNumber(row.recipeActivatedUsers)})</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-3 text-slate-500" colSpan={5}>No source cohort data.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Top source mix</p>
                  <div className="mt-2 space-y-2">
                    {data.trafficSources.length ? (
                      data.trafficSources.map((source) => (
                        <div key={source.source}>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                            <span>{source.source}</span>
                            <span>{formatNumber(source.sessions)} ({formatPercent(source.share)})</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${Math.min(source.share, 100)}%` }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500">No UTM source data in this range.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">Daily Multi-Metric Trend</h2>
                <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-14">
                  {data.trend.map((point) => {
                    const signupHeight = maxTrendValue > 0 ? Math.max(6, (point.signups / maxTrendValue) * 70) : 6;
                    const checkoutHeight = maxTrendValue > 0 ? Math.max(6, (point.checkouts / maxTrendValue) * 70) : 6;
                    const purchaseHeight = maxTrendValue > 0 ? Math.max(6, (point.purchases / maxTrendValue) * 70) : 6;
                    const activeHeight = maxTrendValue > 0 ? Math.max(6, (point.activeUsers / maxTrendValue) * 70) : 6;
                    const recipeHeight = maxTrendValue > 0 ? Math.max(6, (point.recipes / maxTrendValue) * 70) : 6;

                    return (
                      <div key={point.date} className="flex flex-col items-center gap-1">
                        <div className="flex h-20 items-end gap-1">
                          <div className="w-1.5 rounded-sm bg-cyan-500" style={{ height: `${signupHeight}px` }} />
                          <div className="w-1.5 rounded-sm bg-indigo-500" style={{ height: `${checkoutHeight}px` }} />
                          <div className="w-1.5 rounded-sm bg-emerald-500" style={{ height: `${purchaseHeight}px` }} />
                          <div className="w-1.5 rounded-sm bg-amber-500" style={{ height: `${activeHeight}px` }} />
                          <div className="w-1.5 rounded-sm bg-rose-500" style={{ height: `${recipeHeight}px` }} />
                        </div>
                        <p className="text-[10px] text-slate-500">{point.date.slice(5)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-500" />Signup</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-500" />Checkout</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Purchase</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Active Users</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />Recipes</span>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}
