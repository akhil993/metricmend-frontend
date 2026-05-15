"use client";

import { useState } from "react";

import {
  BadgeCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { certifyMetric } from "@/lib/api/certifications";

type Props = {
  metricId: string;
  workspaceId: string;
  metricName: string;
  isCertified?: boolean;
};

export default function CertifiedMetricCard({
  metricId,
  workspaceId,
  metricName,
  isCertified = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleCertify() {
    try {
      setLoading(true);

      const userId = await getCurrentUserId();

      await certifyMetric(
        {
          workspace_id: workspaceId,
          metric_id: metricId,
        },
        userId
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-emerald-500" />

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {metricName}
            </h3>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Govern this semantic metric for trusted enterprise analytics.
          </p>
        </div>

        {isCertified ? (
          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            Certified
          </div>
        ) : (
          <button
            disabled={loading}
            onClick={handleCertify}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}

            Certify
          </button>
        )}
      </div>
    </div>
  );
}