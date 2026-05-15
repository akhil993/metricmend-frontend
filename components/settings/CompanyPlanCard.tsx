"use client";

import {
  Brain,
  Building2,
  CreditCard,
  Sparkles,
  Users,
} from "lucide-react";

type Props = {
  planName?: string | null;

  creditsUsed: number;
  creditsRemaining: number;
  creditsTotal: number;

  maxUsers?: number | null;
  maxWorkspaces?: number | null;
};

function formatPlanName(plan?: string | null) {
  if (!plan) {
    return "Free Trial";
  }

  return plan
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

export default function CompanyPlanCard({
  planName,
  creditsUsed,
  creditsRemaining,
  creditsTotal,
  maxUsers,
  maxWorkspaces,
}: Props) {
  const usagePercentage =
    creditsTotal > 0
      ? Math.min(
          (creditsUsed / creditsTotal) * 100,
          100
        )
      : 0;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-50 px-4 py-2 text-sm text-violet-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100">
            <Sparkles className="h-4 w-4" />
            Active company plan
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {formatPlanName(planName)}
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Governed analytics,
            enterprise collaboration,
            semantic modeling,
            and AI-powered insights.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
          <CreditCard className="h-4 w-4" />
          Manage billing
        </button>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
              <Brain className="h-5 w-5" />
            </div>

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Mira credits
            </span>
          </div>

          <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">
            {creditsRemaining}
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Remaining this month
          </p>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-cyan-500"
              style={{
                width: `${usagePercentage}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {creditsUsed} used of{" "}
            {creditsTotal}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-700 dark:bg-purple-400/10 dark:text-purple-200">
              <Users className="h-5 w-5" />
            </div>

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Team capacity
            </span>
          </div>

          <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">
            {maxUsers ?? "∞"}
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Included seats
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center justify-between">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              <Building2 className="h-5 w-5" />
            </div>

            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Workspaces
            </span>
          </div>

          <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">
            {maxWorkspaces ?? "∞"}
          </p>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Workspace capacity
          </p>
        </div>
      </div>
    </section>
  );
}