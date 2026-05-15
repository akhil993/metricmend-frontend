"use client";

import { ClipboardCheck } from "lucide-react";

type ApprovalItem = {
  id: string;
  entity_type: string;
  status: string;
  requested_by?: string;
};

type Props = {
  approvals?: ApprovalItem[];
  onSelect?: (approval: ApprovalItem) => void;
};

export default function ApprovalQueue({
  approvals = [],
  onSelect,
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Approval Queue
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {approvals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No pending governance approvals.
          </div>
        ) : (
          approvals.map((approval) => (
            <button
              key={approval.id}
              onClick={() => onSelect?.(approval)}
              className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-violet-300 dark:border-white/10 dark:hover:border-violet-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {approval.entity_type}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Requested by {approval.requested_by ?? "Unknown"}
                  </p>
                </div>

                <div className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-300">
                  {approval.status}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}