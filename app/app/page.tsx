"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Database,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import {
  getLaunchpadSummary,
  type LaunchpadSummary,
} from "@/lib/api/launchpad";

const quickActions = [
  {
    title: "Create workspace",
    description: "Add a shared workspace when your plan supports it.",
    href: "/app/workspaces",
    icon: Sparkles,
  },
  {
    title: "Connect data",
    description: "Add your first warehouse, lakehouse, database, or file source.",
    href: "/app/connections",
    icon: Database,
  },
  {
    title: "Create model",
    description: "Define facts, dimensions, relationships, and metrics.",
    href: "/app/models",
    icon: Boxes,
  },
  {
    title: "Ask Mira",
    description: "Ask governed questions once your model is ready.",
    href: "/app/mira",
    icon: Bot,
  },
];


function formatPlan(plan?: string) {
  if (!plan) return "Free Trial";

  return plan
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AppHomePage() {
  const { activeWorkspace } = useAppWorkspace();

  const [summary, setSummary] = useState<LaunchpadSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getLaunchpadSummary(
          activeWorkspace.workspace_id
        );

        setSummary(data);
      } catch (error) {
        console.error("Failed to load launchpad summary", error);
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, [activeWorkspace.workspace_id]);

  const miraCreditsLabel = useMemo(() => {
    const includedCredits = summary?.limits.included_mira_credits;

    if (includedCredits === null || includedCredits === undefined) {
      return "Unlimited";
    }

    const usedCredits = summary?.counts.mira_questions_this_month ?? 0;
    const remainingCredits = Math.max(includedCredits - usedCredits, 0);

    return `${remainingCredits} remaining`;
  }, [summary]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              Launchpad ready
            </div>

            <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
              Welcome to {activeWorkspace.workspace_name} 👋
            </h2>

            <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-neutral-400">
              Start by connecting data, building a semantic model, and creating
              trusted metrics before asking Mira for governed answers.
            </p>
          </div>

          <Link
            href="/app/connections"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 px-6 py-3 text-sm font-semibold text-[#070810] transition hover:opacity-90 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          >
            Start setup
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">Plan</p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              {loading ? "Loading..." : formatPlan(summary?.plan)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Shared workspaces
            </p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              {summary?.limits.max_workspaces === null
                ? "Unlimited"
                : `${summary?.limits.max_workspaces ?? 1} included`}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Mira credits
            </p>
            <p className="mt-1 font-semibold text-slate-950 dark:text-white">
              {loading ? "Loading..." : miraCreditsLabel}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.045] dark:hover:border-cyan-200/20"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.08]">
                <Icon className="h-6 w-6 text-cyan-500 dark:text-cyan-300" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
                {action.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-400">
                {action.description}
              </p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
          <Sparkles className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Setup path
          </h3>

          <div className="mt-6 space-y-3">
            {[
              "Connect a data source",
              "Build your semantic model",
              "Create approved metrics",
              "Ask Mira governed questions",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-[#070810]/50 dark:text-neutral-300"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white dark:bg-cyan-300 dark:text-[#070810]">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 text-emerald-500 dark:text-emerald-300" />
            <div>
              <h3 className="font-semibold text-slate-950 dark:text-white">
                Tenant isolation active
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-400">
                Your workspace is protected by Supabase Auth, workspace
                membership, and Row Level Security. Platform admins will not get
                automatic access to client workspace data.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-cyan-500 dark:text-cyan-300" />
              <p className="font-medium text-slate-950 dark:text-white">
                Workspace activity
              </p>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-neutral-400">
              Activity, model health, and Mira usage will appear here as you
              build.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}