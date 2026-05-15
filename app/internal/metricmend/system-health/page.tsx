"use client";

import { useEffect, useState } from "react";
import {
  getInternalSystemHealth,
  type InternalSystemHealth,
} from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

export default function InternalSystemHealthPage() {
  const [health, setHealth] =
    useState<InternalSystemHealth | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHealth() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data = await getInternalSystemHealth(user.id);

        setHealth(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadHealth();
  }, []);

  const healthyCount =
    health?.services.filter(
      (service) => service.status === "healthy"
    ).length ?? 0;

  const issueCount =
    health?.services.filter(
      (service) => service.status !== "healthy"
    ).length ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          System Health
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Operational status for backend services, database access, and
          internal platform dependencies.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Overall Status"
          value={
            loading
              ? "Loading"
              : health?.overall_status || "Unknown"
          }
        />

        <MetricCard
          label="Healthy Services"
          value={healthyCount}
        />

        <MetricCard
          label="Issues"
          value={issueCount}
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
            Service Checks
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Basic operational checks for internal platform dependencies.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">
                  Service
                </th>

                <th className="px-5 py-3 font-medium">
                  Status
                </th>

                <th className="px-5 py-3 font-medium">
                  Description
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    Loading system health...
                  </td>
                </tr>
              ) : !health?.services.length ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No health checks found.
                  </td>
                </tr>
              ) : (
                health.services.map((service) => (
                  <tr
                    key={service.name}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      {service.name}
                    </td>

                    <td className="px-5 py-4">
                      <HealthBadge
                        status={service.status}
                      />
                    </td>

                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {service.description || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-2xl font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function HealthBadge({
  status,
}: {
  status?: string | null;
}) {
  const normalized = status?.toLowerCase();

  const className =
    normalized === "healthy"
      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-300 dark:text-slate-950 dark:ring-0"
      : normalized === "degraded"
        ? "bg-amber-100 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-300 dark:text-slate-950 dark:ring-0"
        : "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-400 dark:text-white dark:ring-0";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${className}`}
    >
      {status || "unknown"}
    </span>
  );
}