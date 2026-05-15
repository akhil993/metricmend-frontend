"use client";

import { BadgeCheck } from "lucide-react";

type CertifiedAsset = {
  id: string;
  metric_id?: string;
  semantic_model_id?: string;
  status: string;
  semantic_metrics?: {
    id: string;
    name: string;
    display_name?: string;
    metric_type?: string;
  };
  semantic_models?: {
    id: string;
    name: string;
    description?: string;
  };
};

type Props = {
  metrics?: CertifiedAsset[];
  models?: CertifiedAsset[];
  selectedAsset?: {
    entityType: "metric" | "model";
    entityId: string;
  } | null;
  onSelect: (asset: {
    entityType: "metric" | "model";
    entityId: string;
  }) => void;
};

export default function LineageAssetSelector({
  metrics = [],
  models = [],
  selectedAsset,
  onSelect,
}: Props) {
  const hasAssets = metrics.length > 0 || models.length > 0;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <BadgeCheck className="h-5 w-5 text-emerald-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Certified Assets
        </h2>
      </div>

      <div className="mt-6 space-y-3">
        {!hasAssets ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
            No certified assets available yet.
          </div>
        ) : (
          <>
            {metrics.map((item) => {
              const metric = item.semantic_metrics;
              const metricId = item.metric_id ?? metric?.id;

              if (!metricId) return null;

              const active =
                selectedAsset?.entityType === "metric" &&
                selectedAsset.entityId === metricId;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    onSelect({
                      entityType: "metric",
                      entityId: metricId,
                    })
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-emerald-400 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10"
                      : "border-slate-200 hover:border-emerald-300 dark:border-white/10"
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-white">
                    {metric?.display_name ?? metric?.name ?? "Certified Metric"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Metric
                  </p>
                </button>
              );
            })}

            {models.map((item) => {
              const model = item.semantic_models;
              const modelId = item.semantic_model_id ?? model?.id;

              if (!modelId) return null;

              const active =
                selectedAsset?.entityType === "model" &&
                selectedAsset.entityId === modelId;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    onSelect({
                      entityType: "model",
                      entityId: modelId,
                    })
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-blue-400 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10"
                      : "border-slate-200 hover:border-blue-300 dark:border-white/10"
                  }`}
                >
                  <p className="font-medium text-slate-900 dark:text-white">
                    {model?.name ?? "Certified Model"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Semantic Model
                  </p>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}