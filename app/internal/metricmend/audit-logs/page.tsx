"use client";

import { useEffect, useMemo, useState } from "react";
import AuditLogsTable from "@/components/internal/metricmend/audit/AuditLogsTable";
import type { InternalAuditLog } from "@/components/internal/metricmend/audit/types";
import { getInternalAuditLogs } from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

export default function InternalAuditLogsPage() {
  const [logs, setLogs] = useState<InternalAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const summary = useMemo(() => {
    return {
      total: logs.length,
      assignments: logs.filter(
        (log) => log.action === "assign_company_admin"
      ).length,
      removals: logs.filter(
        (log) => log.action === "remove_company_admin"
      ).length,
      lastEvent: logs[0]?.created_at ?? null,
    };
  }, [logs]);

  useEffect(() => {
    async function loadLogs() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data = await getInternalAuditLogs(user.id);

        setLogs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Audit Logs
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Operational history for internal administrative actions.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Logs"
          value={summary.total}
        />

        <MetricCard
          label="Admin Assignments"
          value={summary.assignments}
        />

        <MetricCard
          label="Admin Removals"
          value={summary.removals}
        />

        <MetricCard
          label="Last Audit Event"
          value={formatDateTime(summary.lastEvent)}
        />
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          Loading audit logs...
        </div>
      ) : (
        <AuditLogsTable items={logs} />
      )}
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

      <p className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}