"use client";

import { GitBranch, ShieldCheck } from "lucide-react";

import EnvironmentPromotionBoard from "./EnvironmentPromotionBoard";
import ProductionProtectionCard from "./ProductionProtectionCard";

export default function EnvironmentGovernancePage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-3">
            <GitBranch className="h-6 w-6 text-blue-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Environment Governance
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Govern development, test, and production semantic promotion.
            </p>
          </div>
        </div>
      </div>

      <EnvironmentPromotionBoard />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50/60 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Certified Promotion Required
            </h2>
          </div>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Promotion into production is blocked unless the metric or model is certified.
          </p>
        </div>

        <ProductionProtectionCard />
      </div>
    </div>
  );
}