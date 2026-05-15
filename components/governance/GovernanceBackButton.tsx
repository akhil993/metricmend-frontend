"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  workspaceId: string;
};

export function GovernanceBackButton({ workspaceId }: Props) {
  return (
    <Link
      href={`/app/workspaces/${workspaceId}/governance`}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Governance
    </Link>
  );
}