"use client";

import { CheckCircle2, Circle, Rocket } from "lucide-react";

const steps = [
  "Draft",
  "Review",
  "Approved",
  "Deployed",
];

export default function PromotionTimeline() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <Rocket className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Promotion Timeline
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => {
          const isFirst = index === 0;

          return (
            <div key={step} className="flex items-center gap-3">
              {isFirst ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              )}

              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}