import type { CompanyDetailWorkspace } from "./types";

export default function CompanyWorkspacesTable({
  workspaces,
}: {
  workspaces: CompanyDetailWorkspace[];
}) {
  if (!workspaces.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No workspaces found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Workspace</th>
            <th className="px-4 py-3 font-medium">Workspace ID</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/10">
          {workspaces.map((workspace) => (
            <tr key={workspace.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03]">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {workspace.name || "Untitled workspace"}
              </td>
              <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-500">
                {workspace.id}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {formatDate(workspace.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}