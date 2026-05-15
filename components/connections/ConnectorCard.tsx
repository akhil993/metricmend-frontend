"use client";

import ConnectionStatusBadge from "./ConnectionStatusBadge";
import type { ConnectorRegistryItem } from "@/lib/api/connections";

type Props = {
  connector: ConnectorRegistryItem;
  onSelect: (connector: ConnectorRegistryItem) => void;
};

export default function ConnectorCard({
  connector,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(connector)}
      className="group flex min-h-[185px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-cyan-300/50"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700 dark:bg-cyan-300/10 dark:text-cyan-300">
            <span className="text-sm font-bold tracking-wide">
              {connector.name.slice(0, 2).toUpperCase()}
            </span>
          </div>

          <ConnectionStatusBadge status={connector.status} />
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            {connector.name}
          </h3>

          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {connector.category}
          </p>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {connector.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm font-medium text-cyan-600 transition group-hover:text-cyan-500 dark:text-cyan-300">
          Configure connection
        </span>

        <span className="text-slate-400 transition group-hover:translate-x-1 dark:text-slate-500">
          →
        </span>
      </div>
    </button>
  );
}