"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  ClipboardCheck,
  GitBranch,
  Layers3,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CreatePipelineDialog } from "@/components/governance/CreatePipelineDialog";
import { DeploymentHistoryTable } from "@/components/governance/DeploymentHistoryTable";
import { EnvironmentBadge } from "@/components/governance/EnvironmentBadge";
import { GovernanceWarnings } from "@/components/governance/GovernanceWarnings";
import { WorkspacePipelineCard } from "@/components/governance/WorkspacePipelineCard";


import {
  getWorkspaceDeployments,
  getWorkspaceGovernancePermissions,
  getWorkspaceGovernanceSummary,
  getWorkspacePipelineSummary,
  type SemanticDeployment,
  type WorkspaceGovernancePermissions,
  type WorkspaceGovernanceSummary,
  type WorkspacePipelineSummary,
} from "@/lib/api/governance";

type WorkspaceGovernancePageProps = {
  params: Promise<{
    workspaceId: string;
  }>;
};

const governanceSections = [
  {
    title: "Approvals",
    description:
      "Review governance approvals and semantic release workflows.",
    href: "approvals",
    icon: ClipboardCheck,
  },
  {
    title: "Deployments",
    description:
      "Track governed semantic promotions across environments.",
    href: "deployments",
    icon: GitBranch,
  },
  {
    title: "Certifications",
    description:
      "Manage certified semantic assets and trusted metrics.",
    href: "certifications",
    icon: CheckCircle2,
  },
  {
    title: "Environments",
    description:
      "Control production protections and environment governance.",
    href: "environments",
    icon: Shield,
  },
  {
    title: "Lineage",
    description:
      "Trace semantic dependencies and governed deployment lineage.",
    href: "lineage",
    icon: Layers3,
  },
  {
    title: "Mira Governance",
    description:
      "Govern Mira-generated semantic assets and AI trust flows.",
    href: "mira",
    icon: Sparkles,
  },
  {
    title: "Audit Explorer",
    description:
      "Explore governance activity, approvals, deployments, and protected production actions.",
    href: "audit",
    icon: ShieldCheck,
  },
];

export default function WorkspaceGovernancePage({
  params,
}: WorkspaceGovernancePageProps) {
  const [workspaceId, setWorkspaceId] = useState("");

  const [summary, setSummary] =
    useState<WorkspaceGovernanceSummary | null>(null);

  const [deployments, setDeployments] =
    useState<SemanticDeployment[]>([]);

  const [pipeline, setPipeline] =
    useState<WorkspacePipelineSummary | null>(null);

  const [permissions, setPermissions] =
    useState<WorkspaceGovernancePermissions | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const resolvedParams = await params;

      setWorkspaceId(resolvedParams.workspaceId);

      const [
        summaryData,
        deploymentsData,
        pipelineData,
        permissionsData,
      ] = await Promise.all([
        getWorkspaceGovernanceSummary(resolvedParams.workspaceId),
        getWorkspaceDeployments(resolvedParams.workspaceId),
        getWorkspacePipelineSummary(resolvedParams.workspaceId),
        getWorkspaceGovernancePermissions(resolvedParams.workspaceId),
      ]);

      setSummary(summaryData);
      setDeployments(deploymentsData);
      setPipeline(pipelineData);
      setPermissions(permissionsData);
      setLoading(false);
    }

    load();
  }, [params]);

  if (loading || !summary || !pipeline || !permissions) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
        Loading workspace governance...
      </div>
    );
  }

  if (!permissions.can_access_governance) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
        You do not have access to workspace governance.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full border border-violet-300/30 bg-violet-50 px-4 py-2 text-sm text-violet-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100">
              Workspace Governance
            </div>

            <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Govern semantic lifecycle
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Control semantic deployments, certification policy,
              environment promotion rules, and production safety for this
              workspace.
            </p>
          </div>

          <EnvironmentBadge environment={summary.environment_type} />
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Environment
            </p>
            <p className="mt-2 text-lg font-semibold capitalize text-slate-950 dark:text-white">
              {summary.environment_type}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Production Protected
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
              {summary.is_production ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Certification Required
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
              {summary.certification_required ? "Yes" : "No"}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Deployments
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
              {deployments.length}
            </p>
          </div>
        </div>
      </section>


      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {governanceSections.map((section) => {
          const Icon = section.icon;

          return (
            <Link
              key={section.title}
              href={`/app/workspaces/${workspaceId}/governance/${section.href}`}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.045]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                <Icon className="h-6 w-6 text-violet-500" />
              </div>

              <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">
                {section.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {section.description}
              </p>
            </Link>
          );
        })}
      </section>

      <GovernanceWarnings
        environment={summary.environment_type}
        isProduction={summary.is_production}
        certificationRequired={summary.certification_required}
      />

      <WorkspacePipelineCard pipeline={pipeline} />

      {summary.company_id && permissions.can_manage_pipelines && (
        <CreatePipelineDialog companyId={summary.company_id} />
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Deployment history
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review governed semantic model promotions across development,
            test, and production environments.
          </p>
        </div>

        <DeploymentHistoryTable deployments={deployments} />
      </section>
    </div>
  );
}