"use client";

import { Rocket, ShieldCheck } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import { useGovernanceDeployments } from "../hooks/useGovernanceDeployments";

import DeploymentHistoryTable from "./DeploymentHistoryTable";
import PromotionTimeline from "./PromotionTimeline";

export default function DeploymentPipelinePage() {
  const { activeWorkspace } = useAppWorkspace();
  const workspaceId = activeWorkspace?.workspace_id;

  const { deployments, loading } =
    useGovernanceDeployments(workspaceId);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3">
            <Rocket className="h-6 w-6 text-violet-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Governance Deployments
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Govern semantic promotions across development,
              test, and production environments.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Production Governance
            </h2>
          </div>

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Production assets are protected through governed
            deployment approvals and certification workflows.
          </p>
        </div>

        <div className="lg:col-span-2">
          <PromotionTimeline />
        </div>
      </div>

      <DeploymentHistoryTable
        deployments={loading ? [] : deployments}
      />
    </div>
  );
}