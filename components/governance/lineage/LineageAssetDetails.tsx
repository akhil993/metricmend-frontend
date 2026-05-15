"use client";

import { BadgeCheck, DatabaseZap } from "lucide-react";

type Props = {
  lineage?: any;
  loading?: boolean;
  selectedAsset?: {
    entityType: "metric" | "model";
    entityId: string;
  } | null;
};

export default function LineageAssetDetails({
  lineage,
  loading,
  selectedAsset,
}: Props) {
  const asset = lineage?.metric ?? lineage?.model;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <DatabaseZap className="h-5 w-5 text-emerald-500" />

        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Asset Details
        </h2>
      </div>

      {!selectedAsset ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          Select a governed semantic asset to view certification,
          dependencies, deployments, and approval history.
        </div>
      ) : loading ? (
        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Loading asset details...
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Asset
            </p>

            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {asset?.display_name ?? asset?.name ?? "Governed Asset"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Type
            </p>

            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {selectedAsset.entityType === "metric"
                ? "Certified Metric"
                : "Certified Semantic Model"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
            <BadgeCheck className="h-4 w-4" />
            Certified for enterprise analytics
          </div>
        </div>
      )}
    </div>
  );
}