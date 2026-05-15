"use client";

import DynamicConnectionForm from "./DynamicConnectionForm";
import type {
  ConnectorRegistryItem,
  SavedConnection,
} from "@/lib/api/connections";

type Props = {
  connector: ConnectorRegistryItem | null;
  editingConnection?: SavedConnection | null;
  workspaceId: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export default function ConnectionDrawer({
  connector,
  editingConnection,
  workspaceId,
  open,
  onClose,
  onSaved,
}: Props) {
  if (!open) return null;

  const isEditing = Boolean(editingConnection);

  if (!connector && !editingConnection) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close connection drawer"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
              {isEditing ? "Edit Connection" : "New Connection"}
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {isEditing ? editingConnection?.name : connector?.name}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isEditing
                ? "Update connection details, configuration, or rotate credentials."
                : connector?.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <DynamicConnectionForm
          connector={connector}
          editingConnection={editingConnection}
          workspaceId={workspaceId}
          onSaved={onSaved}
        />
      </aside>
    </div>
  );
}