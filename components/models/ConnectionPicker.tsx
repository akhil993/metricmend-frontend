import type { SavedConnection } from "@/lib/api/connections";

type Props = {
  connections: SavedConnection[];
  selectedConnectionId: string;
  onSelect: (connectionId: string) => void;
};

export default function ConnectionPicker({
  connections,
  selectedConnectionId,
  onSelect,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        1. Select connection
      </h2>

      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Models are built from saved workspace connections.
      </p>

      <select
        value={selectedConnectionId}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
      >
        <option value="">Choose a saved connection...</option>

        {connections.map((connection) => (
          <option key={connection.id} value={connection.id}>
            {connection.name} — {connection.connector_key}
          </option>
        ))}
      </select>
    </div>
  );
}