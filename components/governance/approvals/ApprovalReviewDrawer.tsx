"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Loader2,
  MessageSquareText,
  XCircle,
} from "lucide-react";

import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { reviewApprovalWorkflow } from "@/lib/api/approvalWorkflows";

type Props = {
  approval?: any;
};

export default function ApprovalReviewDrawer({
  approval,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleReview(
    status: "approved" | "rejected"
  ) {
    if (!approval?.id) return;

    try {
      setLoading(true);

      const userId = await getCurrentUserId();

      await reviewApprovalWorkflow(
        approval.id,
        {
          status,
        },
        userId
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Approval Review
        </h2>

        <div className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          Governance
        </div>
      </div>

      {!approval ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          Select an approval request to review governance details.
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Entity Type
            </p>

            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {approval.entity_type}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Status
            </p>

            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {approval.status}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-slate-400" />

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Governance Notes
              </p>
            </div>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Review semantic integrity, production safety,
              lineage impact, and certification readiness.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              disabled={loading}
              onClick={() =>
                handleReview("approved")
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              Approve
            </button>

            <button
              disabled={loading}
              onClick={() =>
                handleReview("rejected")
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />

              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}