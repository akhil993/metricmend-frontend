import type { SemanticDeployment } from "@/lib/api/governance";

type DeploymentHistoryTableProps = {
  deployments: SemanticDeployment[];
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DeploymentHistoryTable({
  deployments,
}: DeploymentHistoryTableProps) {
  if (!deployments.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
        No deployments yet. Promote a semantic model from development to test,
        then test to production.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          <tr>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Semantic Model</th>
            <th className="px-5 py-4">Source</th>
            <th className="px-5 py-4">Target</th>
            <th className="px-5 py-4">Deployed</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-white/10">
          {deployments.map((deployment) => (
            <tr
              key={deployment.id}
              className="text-slate-700 dark:text-slate-200"
            >
              <td className="px-5 py-4">
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold capitalize text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
                  {deployment.deployment_status}
                </span>
              </td>

              <td className="px-5 py-4 font-medium">
                {deployment.semantic_model_id}
              </td>

              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                {deployment.source_workspace_id}
              </td>

              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                {deployment.target_workspace_id}
              </td>

              <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                {formatDate(deployment.deployed_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}