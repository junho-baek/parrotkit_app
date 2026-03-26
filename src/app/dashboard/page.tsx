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

function KPIStatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {sub ? <p className="mt-1 text-xs text-gray-500">{sub}</p> : null}
    </div>
  );
}

function InsightBadge({ severity }: { severity: 'positive' | 'warning' | 'critical' }) {
  if (severity === 'positive') {
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">GOOD</span>;
  }

  if (severity === 'warning') {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">WATCH</span>;
  }

  return <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">RISK</span>;
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
      ...data.trend.map((entry) => Math.max(entry.signups, entry.purchases, entry.activeUsers, entry.recipes, 0))
    );
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Performance Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Conversion / churn metrics for growth marketing and UX optimization
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-1">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  option === days ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setDays(option)}
                disabled={loading}
              >
                {option}d
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            Loading KPI data...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        ) : null}

        {!loading && !error && data ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <KPIStatCard label="Total Users" value={formatNumber(data.kpis.totalUsers)} />
              <KPIStatCard
                label={`New Users (${data.range.days}d)`}
                value={formatNumber(data.kpis.newUsers)}
                sub={`Paid ratio ${formatPercent(data.kpis.paidUserRatio)}`}
              />
              <KPIStatCard
                label="Signup → Paid"
                value={formatPercent(data.kpis.signupToPaidConversionRate)}
                sub={`${formatNumber(data.kpis.purchasesInPeriod)} paid events`}
              />
              <KPIStatCard
                label="Churn Rate"
                value={formatPercent(data.kpis.churnRate)}
                sub={`${formatNumber(data.kpis.churnEventsInPeriod)} churn events`}
              />
              <KPIStatCard
                label="Onboarding Completion"
                value={formatPercent(data.kpis.onboardingCompletionRate)}
              />
              <KPIStatCard
                label="Reference → Recipe"
                value={formatPercent(data.kpis.recipeActivationRate)}
                sub={`Ref activation ${formatPercent(data.kpis.referenceActivationRate)}`}
              />
              <KPIStatCard
                label="Churned Users"
                value={formatNumber(data.kpis.churnedUsers)}
                sub={`${formatPercent(data.kpis.churnRate)} period churn proxy`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <KPIStatCard label="DAU" value={formatNumber(data.kpis.dau)} />
              <KPIStatCard label="WAU" value={formatNumber(data.kpis.wau)} />
              <KPIStatCard label="MAU" value={formatNumber(data.kpis.mau)} />
              <KPIStatCard
                label="Stickiness"
                value={formatPercent(data.kpis.stickiness)}
                sub="DAU / MAU"
              />
              <KPIStatCard
                label="Returning Rate (30d)"
                value={formatPercent(data.kpis.returningRate30d)}
                sub={`${formatNumber(data.kpis.returningUsers30d)} returning users`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <KPIStatCard label="Total References" value={formatNumber(data.kpis.totalReferences)} />
              <KPIStatCard label="Total Recipes" value={formatNumber(data.kpis.totalRecipes)} />
              <KPIStatCard
                label="Refs per New User"
                value={formatDecimal(data.kpis.referencesPerNewUser)}
              />
              <KPIStatCard
                label="Recipes per New User"
                value={formatDecimal(data.kpis.recipesPerNewUser)}
                sub={`Avg events/active ${formatDecimal(data.kpis.avgEventsPerActiveUser30d)}`}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="text-base font-semibold text-gray-900">Funnel ({data.range.days}d)</h2>
                <div className="mt-4 space-y-3">
                  {data.funnel.map((stage, index) => (
                    <div key={stage.key} className="rounded-xl border border-gray-100 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">{index + 1}. {stage.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{formatNumber(stage.users)} users</p>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>Conversion from previous: {formatPercent(stage.conversionFromPrev)}</span>
                        <span>Drop-off: {formatPercent(stage.dropoffFromPrev)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">Traffic Sources</h2>
                  <div className="mt-4 space-y-3">
                    {data.trafficSources.length ? (
                      data.trafficSources.map((source) => (
                        <div key={source.source}>
                          <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                            <span>{source.source}</span>
                            <span>{formatNumber(source.sessions)} ({formatPercent(source.share)})</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${Math.min(source.share, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No UTM source data in this range.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900">Action Insights</h2>
                  <ul className="mt-3 space-y-2">
                    {data.insights.map((insight) => (
                      <li key={insight.key} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold">{insight.label}</span>
                          <InsightBadge severity={insight.severity} />
                        </div>
                        <p className="mt-1 text-xs text-gray-600">{insight.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Source Performance</h2>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-left text-xs">
                    <thead className="text-gray-500">
                      <tr>
                        <th className="py-2 pr-3 font-medium">Source</th>
                        <th className="py-2 pr-3 font-medium">Users</th>
                        <th className="py-2 pr-3 font-medium">Paid CVR</th>
                        <th className="py-2 pr-3 font-medium">Recipe Act.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.sourcePerformance.length ? (
                        data.sourcePerformance.map((row) => (
                          <tr key={row.source} className="border-t border-gray-100 text-gray-700">
                            <td className="py-2 pr-3 font-medium">{row.source}</td>
                            <td className="py-2 pr-3">{formatNumber(row.users)}</td>
                            <td className="py-2 pr-3">
                              {formatPercent(row.conversionRate)} ({formatNumber(row.paidUsers)})
                            </td>
                            <td className="py-2 pr-3">
                              {formatPercent(row.recipeActivationRate)} ({formatNumber(row.recipeActivatedUsers)})
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-3 text-gray-500" colSpan={4}>
                            No source cohort data.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Top Events ({data.range.days}d)</h2>
                <div className="mt-3 space-y-2">
                  {data.topEvents.length ? (
                    data.topEvents.map((event) => (
                      <div key={event.eventName} className="rounded-lg border border-gray-100 p-3">
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <span className="font-medium">{event.eventName}</span>
                          <span>{formatNumber(event.count)} ({formatPercent(event.share)})</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No event logs in this range.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Daily Trend (Signup / Purchase / Active / Recipe)</h2>
              <div className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-10 lg:grid-cols-14">
                {data.trend.map((point) => {
                  const signupHeight = maxTrendValue > 0 ? Math.max(6, (point.signups / maxTrendValue) * 72) : 6;
                  const purchaseHeight = maxTrendValue > 0 ? Math.max(6, (point.purchases / maxTrendValue) * 72) : 6;
                  const activeHeight = maxTrendValue > 0 ? Math.max(6, (point.activeUsers / maxTrendValue) * 72) : 6;
                  const recipeHeight = maxTrendValue > 0 ? Math.max(6, (point.recipes / maxTrendValue) * 72) : 6;

                  return (
                    <div key={point.date} className="flex flex-col items-center gap-1">
                      <div className="flex h-20 items-end gap-1">
                        <div className="w-2 rounded-sm bg-blue-500" style={{ height: `${signupHeight}px` }} />
                        <div className="w-2 rounded-sm bg-emerald-500" style={{ height: `${purchaseHeight}px` }} />
                        <div className="w-2 rounded-sm bg-violet-500" style={{ height: `${activeHeight}px` }} />
                        <div className="w-2 rounded-sm bg-amber-500" style={{ height: `${recipeHeight}px` }} />
                      </div>
                      <p className="text-[10px] text-gray-500">{point.date.slice(5)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500">
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" />Signup</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Purchase</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-violet-500" />Active Users</span>
                <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />Recipes</span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
