"use client";

import { History } from "lucide-react";

type Deployment = {
  id: string;
  status: string;
  source_environment: string;
  target_environment: string;
  created_at?: string;
};

type Props = {
  deployments?: Deployment[];
};

export default function DeploymentHistoryTable({
  deployments = [],
}: Props) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <History className="h-5 w-5 text-blue-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Deployment History
        </h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
        {deployments.length === 0 ? (
          <div className="p-6 text-sm text-slate-500 dark:text-slate-400">
            No deployment history yet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-white/[0.03] dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>

            <tbody>
              {deployments.map((deployment) => (
                <tr
                  key={deployment.id}
                  className="border-t border-slate-200 dark:border-white/10"
                >
                  <td className="px-4 py-3 text-slate-900 dark:text-white">
                    {deployment.status}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {deployment.source_environment}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {deployment.target_environment}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {deployment.created_at ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}