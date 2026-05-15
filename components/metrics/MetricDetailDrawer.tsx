"use client";

import { useEffect, useState } from "react";
import {
  X,
  Sigma,
  GitBranch,
  FileCode2,
  History,
  Loader2,
} from "lucide-react";

import {
  getMetricVersions,
  type SemanticMetric,
  type SemanticMetricVersion,
} from "@/lib/api/metrics";

import MetricStatusBadge from "./MetricStatusBadge";

type Props = {
  metric: SemanticMetric | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (metric: SemanticMetric) => void;
};

export default function MetricDetailDrawer({
  metric,
  open,
  onClose,
  onEdit,
}: Props) {
  const [versions, setVersions] = useState<SemanticMetricVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  useEffect(() => {
    async function loadVersions() {
      if (!open || !metric?.id) return;

      setLoadingVersions(true);

      try {
        const result = await getMetricVersions(metric.id);
        setVersions(result);
      } catch (error) {
        console.error("Failed to load metric versions:", error);
        setVersions([]);
      } finally {
        setLoadingVersions(false);
      }
    }

    loadVersions();
  }, [open, metric?.id]);

  if (!open || !metric) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm">
      <aside className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#0f172a]">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                <Sigma className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                  {metric.display_name || metric.name}
                </h2>

                <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
                  [{metric.name}]
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <MetricStatusBadge status={metric.status} />

              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {metric.metric_type}
              </span>

              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {metric.format_type}
              </span>

              <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-medium text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                v{metric.version ?? 1}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <FileCode2 className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              Current Formula
            </div>

            <pre className="overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-100">
              {metric.user_formula || metric.expression || "No formula saved."}
            </pre>
          </section>

          <section className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <GitBranch className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              System Details
            </div>

            <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
              <div>Aggregation: {metric.aggregation_type || "None"}</div>
              <div>Current Version: {metric.version ?? 1}</div>
              <div>Validation: {metric.validation_status || "valid"}</div>
            </div>
          </section>

          <details className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
            <summary className="mb-3 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              {loadingVersions ? (
                <Loader2 className="h-4 w-4 animate-spin text-cyan-600 dark:text-cyan-300" />
              ) : (
                <History className="h-4 w-4 text-cyan-600 dark:text-cyan-300" />
              )}
              Version History
            </summary>

            {loadingVersions ? (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Loading version history...
              </div>
            ) : versions.length ? (
              <div className="space-y-2">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/20"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
                        v{version.version}
                      </span>

                      <span className="text-[10px] text-slate-500 dark:text-slate-500">
                        {version.created_at
                          ? new Date(version.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>

                    <pre className="overflow-auto rounded-lg bg-slate-950 p-2 text-xs text-slate-100">
                      {version.expression || "No formula captured."}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                No previous versions yet.
              </div>
            )}
          </details>

          {metric.description ? (
            <section className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
              <div className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">
                Description
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                {metric.description}
              </p>
            </section>
          ) : null}

          <button
            type="button"
            onClick={() => onEdit?.(metric)}
            className="w-full rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            Edit Metric
          </button>
        </div>
      </aside>
    </div>
  );
}