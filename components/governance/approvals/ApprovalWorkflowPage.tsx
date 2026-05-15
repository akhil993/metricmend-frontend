"use client";

import { useState } from "react";
import { Workflow } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import ApprovalQueue from "./ApprovalQueue";
import ApprovalReviewDrawer from "./ApprovalReviewDrawer";

import { useGovernanceApprovals } from "../hooks/useGovernanceApprovals";

export default function ApprovalWorkflowPage() {
  const { activeWorkspace } = useAppWorkspace();

  const workspaceId = activeWorkspace?.workspace_id;

  const [selectedApproval, setSelectedApproval] =
    useState<any>(null);

  const { approvals, loading } =
    useGovernanceApprovals(workspaceId);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/10 p-3">
            <Workflow className="h-6 w-6 text-violet-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Approval Workflows
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Govern semantic approvals, deployment reviews,
              and production readiness workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <ApprovalQueue
          approvals={loading ? [] : approvals}
          onSelect={(approval) =>
            setSelectedApproval(approval)
          }
        />

        <ApprovalReviewDrawer approval={selectedApproval} />
      </div>
    </div>
  );
}