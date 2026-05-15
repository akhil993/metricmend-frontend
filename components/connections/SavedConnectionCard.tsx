import ConnectionStatusBadge from "./ConnectionStatusBadge";
import type { SavedConnection } from "@/lib/api/connections";

type Props = {
  connection: SavedConnection;
  workspaceName?: string;
  onEdit: (connection: SavedConnection) => void;
};

export default function SavedConnectionCard({
  connection,
  workspaceName,
  onEdit,
}: Props) {
  const displayWorkspaceName = connection.workspace_name ?? workspaceName;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {connection.name}
          </h3>

          <div className="mt-1 space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {connection.connector_key}
            </p>

            {displayWorkspaceName && (
              <p className="text-xs text-cyan-600 dark:text-cyan-300">
                Workspace: {displayWorkspaceName}
              </p>
            )}
          </div>
        </div>

        <ConnectionStatusBadge status={connection.status} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Created {new Date(connection.created_at).toLocaleDateString()}
        </div>

        <button
          type="button"
          onClick={() => onEdit(connection)}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Edit
        </button>
      </div>
    </div>
  );
}