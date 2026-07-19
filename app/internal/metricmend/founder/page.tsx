"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Building2,
  EyeOff,
  Gauge,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import FounderAccessGate from "@/components/internal/metricmend/founder/FounderAccessGate";
import { useFounderAccess } from "@/hooks/useFounderAccess";
import {
  getInternalCompanyPlans,
  getInternalSystemHealth,
  getInternalUsage,
  getMetricMendOverview,
  type InternalCompanyPlan,
  type InternalSystemHealth,
  type InternalUsageItem,
  type MetricMendOverview,
} from "@/lib/api/adminMetricMend";

export default function FounderPage() {
  return (
    <FounderAccessGate>
      <FounderDashboard />
    </FounderAccessGate>
  );
}

function FounderDashboard() {
  const { user } = useFounderAccess();
  const [overview, setOverview] = useState<MetricMendOverview | null>(null);
  const [usage, setUsage] = useState<InternalUsageItem[]>([]);
  const [plans, setPlans] = useState<InternalCompanyPlan[]>([]);
  const [health, setHealth] = useState<InternalSystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFounderData() {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const [overviewData, usageData, planData, healthData] =
          await Promise.all([
            getMetricMendOverview(user.id),
            getInternalUsage(user.id),
            getInternalCompanyPlans(user.id),
            getInternalSystemHealth(user.id),
          ]);

        if (!active) return;

        setOverview(overviewData);
        setUsage(usageData);
        setPlans(planData);
        setHealth(healthData);
      } catch (err) {
        if (!active) return;
        console.error(err);
        setError("Unable to load founder dashboard.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadFounderData();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const planMix = useMemo(() => {
    return plans.reduce<Record<string, number>>((acc, company) => {
      const key = company.plan || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [plans]);

  const usageSummary = useMemo(() => {
    return usage.reduce(
      (summary, item) => {
        summary.activeUsers += item.active_users || 0;
        summary.queries += item.query_count || 0;
        summary.failures += item.failed_count || 0;

        if (item.avg_execution_ms) {
          summary.latencySamples += 1;
          summary.latencyTotal += item.avg_execution_ms;
        }

        return summary;
      },
      {
        activeUsers: 0,
        queries: 0,
        failures: 0,
        latencySamples: 0,
        latencyTotal: 0,
      }
    );
  }, [usage]);

  const avgLatency =
    usageSummary.latencySamples > 0
      ? Math.round(usageSummary.latencyTotal / usageSummary.latencySamples)
      : 0;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-orange-100 bg-[linear-gradient(135deg,#fffaf3_0%,#ffe8d1_48%,#fff4ec_100%)] p-8 shadow-sm dark:border-white/10 dark:bg-none dark:bg-white/[0.045]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-orange-700">
              <ShieldCheck className="h-4 w-4" />
              Founder private console
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Founder View
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 dark:text-slate-400">
              Privacy-aware operating view for MetricMend. This page summarizes
              platform health, growth signals, usage, and access posture without
              exposing raw customer data or individual user details.
            </p>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/75 p-4 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Signed in
            </p>
            <p className="mt-2 max-w-xs truncate font-semibold text-slate-950 dark:text-white">
              {user?.email || "Founder"}
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Building2}
          label="Companies"
          value={loading ? "..." : overview?.company_count ?? 0}
          description="Tenant-level count only"
        />
        <MetricCard
          icon={Users}
          label="Users"
          value={loading ? "..." : overview?.user_count ?? 0}
          description="Aggregate only"
        />
        <MetricCard
          icon={Sparkles}
          label="Mira Queries"
          value={loading ? "..." : overview?.mira_query_count ?? 0}
          description="Platform usage"
        />
        <MetricCard
          icon={HeartPulse}
          label="System"
          value={loading ? "..." : health?.overall_status || "unknown"}
          description="Dependency status"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel
          title="Founder Operating Signals"
          description="Aggregate health signals for quick decision-making."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <SignalRow
              label="Active users"
              value={usageSummary.activeUsers}
              detail="Summed by company usage rows"
            />
            <SignalRow
              label="Usage queries"
              value={usageSummary.queries || overview?.mira_query_count || 0}
              detail="Mira and analytics activity"
            />
            <SignalRow
              label="Failed requests"
              value={usageSummary.failures || overview?.failed_request_count || 0}
              detail="Reliability watchpoint"
            />
            <SignalRow
              label="Avg execution"
              value={avgLatency ? `${avgLatency}ms` : "n/a"}
              detail="Across available usage rows"
            />
          </div>
        </Panel>

        <Panel
          title="Plan Mix"
          description="Plan distribution without listing customer names."
        >
          <div className="space-y-3">
            {Object.keys(planMix).length ? (
              Object.entries(planMix).map(([plan, count]) => (
                <div
                  key={plan}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-200">
                    {plan.replaceAll("_", " ")}
                  </span>
                  <span className="text-sm font-semibold text-slate-950 dark:text-white">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No plan data loaded.
              </p>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PrivacyCard
          icon={EyeOff}
          title="Privacy Boundary"
          body="This founder page avoids raw user tables, customer records, message text, connector credentials, and warehouse data."
        />
        <PrivacyCard
          icon={LockKeyhole}
          title="Access Model"
          body="Access requires a valid Supabase session, MetricMend internal admin verification, and founder email allowlist membership."
        />
        <PrivacyCard
          icon={ShieldCheck}
          title="Audit Posture"
          body="Use the audit log console for sensitive administrative history instead of duplicating private records here."
        />
      </div>

      <Panel
        title="Founder Shortcuts"
        description="Deep links stay inside the existing internal permission model."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Shortcut href="/internal/metricmend/companies" label="Companies" icon={Building2} />
          <Shortcut href="/internal/metricmend/usage" label="Usage" icon={Gauge} />
          <Shortcut href="/internal/metricmend/plans" label="Plans" icon={WalletCards} />
          <Shortcut href="/internal/metricmend/system-health" label="System Health" icon={Activity} />
        </div>
      </Panel>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Building2;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-400/10 dark:text-orange-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-3xl font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SignalRow({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function PrivacyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof EyeOff;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {body}
      </p>
    </div>
  );
}

function Shortcut({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof Building2;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-orange-400/10 dark:hover:text-orange-100"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
