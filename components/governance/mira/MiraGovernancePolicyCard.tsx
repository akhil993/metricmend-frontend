"use client";

import { ShieldCheck } from "lucide-react";

export default function MiraGovernancePolicyCard() {
  return (
    <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Governance Policies
        </h2>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <li>
          • Prefer certified semantic metrics for enterprise answers
        </li>

        <li>
          • Mira-generated metrics require governance review
        </li>

        <li>
          • Production analytics prioritize certified semantic models
        </li>

        <li>
          • Governance audit trails tracked for all AI-generated assets
        </li>
      </ul>
    </div>
  );
}