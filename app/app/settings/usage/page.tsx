"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Brain,
  Building2,
  Loader2,
  Users,
} from "lucide-react";

import {
  BillingSummary,
  getMyBilling,
} from "@/lib/api/billing";

export default function UsageSettingsPage() {
  const [billing, setBilling] =
    useState<BillingSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyBilling();
        setBilling(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load usage."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <LoadingPanel message="Loading usage..." />
    );
  }

  if (error || !billing) {
    return (
      <ErrorPanel
        message={error || "Unable to load usage."}
      />
    );
  }

  const creditsUsed = billing.credits.used;
  const creditsTotal = billing.credits.total;
  const creditsRemaining = billing.credits.remaining;

  const creditUsagePercent =
    creditsTotal > 0
      ? Math.min(
          (creditsUsed / creditsTotal) * 100,
          100
        )
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          <Activity className="h-4 w-4" />
          Usage
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Usage & operational analytics
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Monitor Mira credits, workspace capacity, and organization
          limits for your company plan.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <UsageCard
          icon={Brain}
          label="Mira credits remaining"
          value={creditsRemaining}
          description={`${creditsUsed} used of ${creditsTotal}`}
        />

        <UsageCard
          icon={Users}
          label="Team capacity"
          value={billing.company.max_users ?? "∞"}
          description="Included company seats"
        />

        <UsageCard
          icon={Building2}
          label="Workspace capacity"
          value={
            billing.company.max_workspaces ?? "∞"
          }
          description="Available workspace limit"
        />
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Mira credit usage
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Mira consumes credits when users ask AI-powered analytics
          questions.
        </p>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className="h-full rounded-full bg-cyan-500"
            style={{
              width: `${creditUsagePercent}%`,
            }}
          />
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
          <UsageLine
            label="Included"
            value={billing.credits.included}
          />

          <UsageLine
            label="Purchased"
            value={billing.credits.purchased}
          />

          <UsageLine
            label="Remaining"
            value={billing.credits.remaining}
          />
        </div>
      </section>
    </div>
  );
}

function UsageCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function UsageLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-xs uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function LoadingPanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
}

function ErrorPanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-red-300/30 bg-red-50 p-6 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
      {message}
    </div>
  );
}