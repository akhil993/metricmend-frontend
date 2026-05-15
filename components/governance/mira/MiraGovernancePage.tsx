"use client";

import { Bot } from "lucide-react";

import MiraGeneratedReviewQueue from "./MiraGeneratedReviewQueue";
import MiraGovernancePolicyCard from "./MiraGovernancePolicyCard";

export default function MiraGovernancePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-fuchsia-500/10 p-3">
            <Bot className="h-6 w-6 text-fuchsia-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Mira Governance
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Govern Mira-generated semantic intelligence and
              enterprise AI trust policies.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MiraGovernancePolicyCard />

        <MiraGeneratedReviewQueue />
      </div>
    </div>
  );
}