"use client";

import { useState } from "react";

import { createDeployment } from "@/lib/api/governance";

type PromoteDeploymentDialogProps = {
  companyId: string;
  sourceWorkspaceId: string;
  targetWorkspaceId: string;
  semanticModelId: string;
  deployedBy: string;
};

export function PromoteDeploymentDialog({
  companyId,
  sourceWorkspaceId,
  targetWorkspaceId,
  semanticModelId,
  deployedBy,
}: PromoteDeploymentDialogProps) {
  const [deploymentNotes, setDeploymentNotes] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function handleDeploy() {
    try {
      setIsSubmitting(true);

      await createDeployment({
        company_id: companyId,
        source_workspace_id:
          sourceWorkspaceId,
        target_workspace_id:
          targetWorkspaceId,
        semantic_model_id:
          semanticModelId,
        deployed_by: deployedBy,
        deployment_notes:
          deploymentNotes,
      });

      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert(
        "Failed to deploy semantic model."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          Promote deployment
        </h3>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Promote certified semantic
          changes through governed
          environments.
        </p>
      </div>

      <textarea
        value={deploymentNotes}
        onChange={(event) =>
          setDeploymentNotes(
            event.target.value
          )
        }
        placeholder="Deployment notes"
        className="mt-5 min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
      />

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleDeploy}
          disabled={isSubmitting}
          className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Deploying..."
            : "Promote deployment"}
        </button>

        {success && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Deployment completed.
          </span>
        )}
      </div>
    </div>
  );
}