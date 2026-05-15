"use client";

import { Handle, Position } from "reactflow";

type Props = {
  data: {
    label: string;
    table: {
      display_name: string;
      table_role: "fact" | "dimension";
      source_table?: string;
      columns?: {
        source_column: string;
        data_type?: string | null;
      }[];
    };
  };
};

export default function ModelNode({ data }: Props) {
  const isFact = data.table.table_role === "fact";

  return (
    <div
      className={[
        "relative min-w-[260px] rounded-2xl border shadow-xl backdrop-blur",
        isFact
          ? "border-cyan-400/30 bg-cyan-500/10"
          : "border-violet-400/30 bg-violet-500/10",
      ].join(" ")}
    >
      <Handle id="left-target" type="target" position={Position.Left} />
      <Handle id="right-target" type="target" position={Position.Right} />

      <div
        className={[
          "rounded-t-2xl px-4 py-3",
          isFact ? "bg-cyan-500/20" : "bg-violet-500/20",
        ].join(" ")}
      >
        <p className="text-sm font-semibold text-white">
          {data.table.display_name}
        </p>

        <p className="text-xs uppercase tracking-wider text-white/60">
          {data.table.table_role}
        </p>
      </div>

      <div className="max-h-[280px] overflow-y-auto px-3 py-2">
        {data.table.columns?.length ? (
          <div className="space-y-1">
            {data.table.columns.map((column) => (
              <div
                key={column.source_column}
                className="flex items-center justify-between rounded-lg px-2 py-1 text-xs text-slate-200 transition hover:bg-white/5"
              >
                <span>{column.source_column}</span>
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                  {column.data_type ?? "unknown"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No columns loaded.</p>
        )}
      </div>

      <Handle id="left-source" type="source" position={Position.Left} />
      <Handle id="right-source" type="source" position={Position.Right} />
    </div>
  );
}