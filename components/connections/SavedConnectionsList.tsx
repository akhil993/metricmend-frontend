import SavedConnectionCard from "./SavedConnectionCard";
import type { SavedConnection } from "@/lib/api/connections";

type Props = {
  connections: SavedConnection[];
  workspaceName?: string;
  onEdit: (connection: SavedConnection) => void;
};

export default function SavedConnectionsList({
  connections,
  workspaceName,
  onEdit,
}: Props) {
  if (!connections.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        No saved connections yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {connections.map((connection) => (
        <SavedConnectionCard
          key={connection.id}
          connection={connection}
          workspaceName={workspaceName}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}