"use client";

import { ArrowDown, GitCommitHorizontal } from "lucide-react";

type Props = {
  deployments?: any[];
};

export default function DeploymentLineageTimeline({
  deployments = [],
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <GitCommitHorizontal className="h-5 w-5 text-violet-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Deployment Timeline
        </h2>
      </div>

      <div className="mt-6 space-y-4">
        {deployments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No deployment lineage available yet.
          </div>
        ) : (
          deployments.map((deployment, index) => (
            <div key={deployment.id}>
              <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
                <p className="font-medium text-slate-900 dark:text-white">
                  {deployment.source_environment} →{" "}
                  {deployment.target_environment}
                </p>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Status: {deployment.status ?? "recorded"}
                </p>
              </div>

              {index < deployments.length - 1 && (
                <div className="flex justify-center py-3">
                  <ArrowDown className="h-5 w-5 text-slate-300" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}