"use client";

import { ArrowRight, GitBranch } from "lucide-react";

const lanes = [
  {
    label: "Development",
    description: "Draft semantic changes and editor-owned work.",
  },
  {
    label: "Test",
    description: "Validated assets awaiting governance approval.",
  },
  {
    label: "Production",
    description: "Certified, protected enterprise semantic assets.",
  },
];

export default function EnvironmentPromotionBoard() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <GitBranch className="h-5 w-5 text-blue-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Environment Promotion Flow
        </h2>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {lanes.map((lane, index) => (
          <div
            key={lane.label}
            className="relative rounded-2xl border border-slate-200 p-5 dark:border-white/10"
          >
            <p className="font-semibold text-slate-900 dark:text-white">
              {lane.label}
            </p>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {lane.description}
            </p>

            {index < lanes.length - 1 && (
              <ArrowRight className="absolute right-4 top-5 hidden h-5 w-5 text-slate-300 lg:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}