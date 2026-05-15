"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Bot,
  Boxes,
  Database,
  GitBranch,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = String(params.workspaceId);
  

  const cards = [
    {
      label: "Connections",
      description: "Manage this workspace's data sources.",
      href: `/app/workspaces/${workspaceId}/connections`,
      icon: Database,
    },
    {
      label: "Models",
      description: "Build governed semantic models for this workspace.",
      href: `/app/workspaces/${workspaceId}/models`,
      icon: Boxes,
    },
    {
      label: "Metrics",
      description: "Create and manage model-scoped semantic metrics.",
      href: `/app/workspaces/${workspaceId}/models`,
      icon: BarChart3,
    },
    {
      label: "Mira",
      description: "Ask governed questions inside this workspace context.",
      href: `/app/workspaces/${workspaceId}/mira`,
      icon: Bot,
    },
    {
      label: "Governance",
      description:
        "Manage semantic deployments, certification, and environment promotion.",
      href: `/app/workspaces/${workspaceId}/governance`,
      icon: GitBranch,
    },
    {
      label: "Members",
      description:
        "Manage workspace-level access, roles, and semantic collaboration.",
      href: `/app/workspaces/${workspaceId}/members`,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/app/workspaces"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Workspaces
      </Link>
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          Workspace command center
        </div>

        <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-5xl">
          Manage this workspace.
        </h2>

        <p className="mt-5 max-w-2xl leading-7 text-slate-600 dark:text-neutral-400">
          Connections, models, metrics, and Mira activity are organized inside
          this workspace context.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.045]"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                {card.label}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-neutral-500">
                {card.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                Workspace scoped
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}