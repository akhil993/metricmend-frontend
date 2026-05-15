"use client";

import { Database, Sigma, Sparkles } from "lucide-react";

import type { SemanticMetric } from "@/lib/api/metrics";
import MetricStatusBadge from "./MetricStatusBadge";

type Props = {
  metrics: SemanticMetric[];
  onMetricClick?: (metric: SemanticMetric) => void;
};

export default function MetricList({ metrics, onMetricClick }: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
      <div className="border-b border-slate-200 px-6 py-4 dark:border-white/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Semantic Metrics
        </h2>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-white/10">
        {metrics.length === 0 ? (
          <div className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
            No metrics created yet.
          </div>
        ) : null}

        {metrics.map((metric) => (
          <button
            type="button"
            key={metric.id}
            onClick={() => onMetricClick?.(metric)}
            className="flex w-full flex-col gap-4 px-6 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-white/[0.04] lg:flex-row lg:items-start lg:justify-between"
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  {metric.metric_type === "calculated" ? (
                    <Sparkles className="h-4 w-4 text-cyan-500" />
                  ) : (
                    <Sigma className="h-4 w-4 text-cyan-500" />
                  )}

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {metric.display_name || metric.name}
                  </h3>
                </div>

                <MetricStatusBadge status={metric.status} />
              </div>

              {metric.description ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {metric.description}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-white/10">
                  {metric.metric_type}
                </span>
                <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-white/10">
                  v{metric.version || 1}
                </span>
                {metric.aggregation_type ? (
                  <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-white/10">
                    {metric.aggregation_type}
                  </span>
                ) : null}

                <span className="rounded-full border border-slate-200 px-2 py-1 dark:border-white/10">
                  {metric.format_type}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-300">
                {metric.user_formula || metric.expression}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Database className="h-4 w-4" />
              Governed Semantic Measure
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}