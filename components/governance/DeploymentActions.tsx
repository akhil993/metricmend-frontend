"use client";

import { PromoteDeploymentDialog } from "@/components/governance/PromoteDeploymentDialog";

type DeploymentActionsProps = {
  companyId: string;
  workspaceId: string;
  semanticModelId: string;
  deployedBy: string;
  environmentType: string;
};

function getTargetEnvironment(environmentType: string) {
  if (environmentType === "development") {
    return "test";
  }

  if (environmentType === "test") {
    return "production";
  }

  return null;
}

export function DeploymentActions({
  companyId,
  workspaceId,
  semanticModelId,
  deployedBy,
  environmentType,
}: DeploymentActionsProps) {
  const targetEnvironment =
    getTargetEnvironment(environmentType);

  if (!targetEnvironment) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          Production protected
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Production workspaces cannot promote deployments further.
        </p>
      </div>
    );
  }

  return (
    <PromoteDeploymentDialog
      companyId={companyId}
      sourceWorkspaceId={workspaceId}
      targetWorkspaceId={targetEnvironment}
      semanticModelId={semanticModelId}
      deployedBy={deployedBy}
    />
  );
}