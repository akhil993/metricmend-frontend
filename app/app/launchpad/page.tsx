"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Database,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import {
  getLaunchpadSummary,
  type LaunchpadSummary,
} from "@/lib/api/launchpad";

export default function LaunchpadPage() {
  const { activeWorkspace } = useAppWorkspace();

  const [summary, setSummary] =
    useState<LaunchpadSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getLaunchpadSummary(
          activeWorkspace.workspace_id
        );

        setSummary(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load launchpad."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [activeWorkspace.workspace_id]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.045]">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-500" />
        Loading launchpad...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-red-500">
        {error || "No launchpad summary found."}
      </div>
    );
  }

  const statCards = [
    {
      label: "Connections",
      value: summary.counts.connections,
      href: "/app/launchpad/connections",
      icon: Database,
      helper:
        summary.counts.connections === 0
          ? "Add your first data source"
          : "Data sources connected",
    },
    {
      label: "Models",
      value: summary.counts.models,
      href: "/app/launchpad/models",
      icon: Boxes,
      helper:
        summary.counts.models === 0
          ? "Create your first semantic model"
          : "Semantic models active",
    },
    {
      label: "Base metrics",
      value: summary.counts.base_metrics,
      href: "/app/launchpad/models",
      icon: BarChart3,
      helper:
        summary.counts.base_metrics === 0
          ? "Define trusted metrics"
          : "Metric layer ready",
    },
    {
      label: "Pending reviews",
      value: summary.counts.pending_reviews,
      href: "/app/launchpad/models",
      icon: Wand2,
      helper:
        summary.counts.pending_reviews === 0
          ? "No Mira metrics waiting"
          : "Review Mira-generated metrics",
    },
  ];

  const setupSteps = [
    {
      title: "Connect data",
      description:
        "Add Athena, Snowflake, warehouse, database, or file sources.",
      href: "/app/launchpad/connections",
      done: summary.counts.connections > 0,
    },
    {
      title: "Build model",
      description:
        "Choose tables, relationships, dimensions, and facts.",
      href: "/app/launchpad/models",
      done: summary.counts.models > 0,
    },
    {
      title: "Create metrics",
      description:
        "Define base metrics before asking Mira for semantic answers.",
      href: "/app/launchpad/models",
      done: summary.counts.base_metrics > 0,
    },
    {
      title: "Ask Mira",
      description:
        "Use your model to generate safe SQL, insights, and actions.",
      href: "/app/launchpad/mira",
      done: summary.counts.mira_questions_this_month > 0,
    },
  ];

  const miraUsed = summary.counts.mira_credits_used;
  const miraTotal = summary.counts.mira_credits_total;
  const miraRemaining = summary.counts.mira_credits_remaining;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
          <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
            Personal sandbox
          </div>

          <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
            Build your analytics foundation before Mira answers.
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-neutral-400">
            Launchpad is your personal setup space for connecting data,
            building semantic models, defining metrics, and testing Mira
            safely before moving work into governed shared workspaces.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-cyan-500 dark:text-cyan-300" />

                    <span className="text-2xl font-semibold text-slate-950 dark:text-white">
                      {card.value}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-medium text-slate-950 dark:text-white">
                    {card.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-500">
                    {card.helper}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#15161d] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_35%),linear-gradient(180deg,#15161d,#111217)]">
          <Sparkles className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Setup path
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-400">
            Follow this order so your analytics foundation is clean before
            you move into governed collaboration.
          </p>

          <div className="mt-6 space-y-3">
            {setupSteps.map((step, index) => (
              <Link
                key={step.title}
                href={step.href}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-[#070810]/50 dark:hover:bg-white/[0.06]"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    step.done
                      ? "bg-emerald-500 text-white dark:bg-emerald-300 dark:text-[#070810]"
                      : "bg-slate-950 text-white dark:bg-cyan-300 dark:text-[#070810]"
                  }`}
                >
                  {step.done ? "✓" : index + 1}
                </span>

                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    {step.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-neutral-500">
                    {step.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
          <Bot className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Mira readiness
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-400">
            Mira works best after a connection, semantic model, and base
            metrics exist.
          </p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-sm text-slate-500 dark:text-neutral-500">
              Mira credits
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
              {miraUsed}
              {miraTotal ? ` / ${miraTotal}` : ""}
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-neutral-500">
              {miraRemaining} remaining
            </p>
          </div>

          <Link
            href="/app/launchpad/mira"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/[0.07]"
          >
            Open Mira
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
          <ShieldCheck className="h-7 w-7 text-emerald-500 dark:text-emerald-300" />

          <h3 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Sandbox safety
          </h3>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-400">
            Launchpad is your personal sandbox. Connections, models,
            metrics, and Mira-generated assets stay isolated until promoted
            into governed shared workspaces.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-neutral-500">
                Plan
              </p>

              <p className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">
                {summary.plan}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-neutral-500">
                SQL safety
              </p>

              <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                Enabled
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-sm text-slate-500 dark:text-neutral-500">
                Review queue
              </p>

              <p className="mt-1 font-semibold text-slate-950 dark:text-white">
                {summary.counts.pending_reviews}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
