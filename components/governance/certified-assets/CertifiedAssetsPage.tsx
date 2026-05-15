"use client";

import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";
import { getCertificationCandidates } from "@/lib/api/certifications";

import CertifiedMetricCard from "./CertifiedMetricCard";

export default function CertifiedAssetsPage() {
  const { activeWorkspace } = useAppWorkspace();

  const workspaceId = activeWorkspace?.workspace_id;

  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCandidates() {
      if (!workspaceId) {
        setMetrics([]);
        setLoading(false);
        return;
      }

      try {
        const data =
          await getCertificationCandidates(workspaceId);

        setMetrics(data);
      } catch (error) {
        console.error(error);
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, [workspaceId]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <BadgeCheck className="h-6 w-6 text-emerald-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Certified Semantic Assets
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Governed and trusted semantic assets approved
              for enterprise analytics and Mira intelligence.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
            Loading certification candidates...
          </div>
        ) : metrics.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
            No semantic metrics available for certification.
          </div>
        ) : (
          metrics.map((metric) => (
            <CertifiedMetricCard
              key={metric.id}
              workspaceId={workspaceId!}
              metricId={metric.id}
              metricName={
                metric.display_name ?? metric.name
              }
              isCertified={metric.is_certified}
            />
          ))
        )}
      </div>
    </div>
  );
}