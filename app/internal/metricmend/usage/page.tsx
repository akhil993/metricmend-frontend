"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getInternalUsage,
  type InternalUsageItem,
} from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

export default function InternalUsagePage() {
  const [usage, setUsage] = useState<InternalUsageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const filteredUsage = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return usage;

    return usage.filter((item) =>
      (item.company_name || "").toLowerCase().includes(value)
    );
  }, [usage, search]);

  useEffect(() => {
    async function loadUsage() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data = await getInternalUsage(user.id);

        setUsage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadUsage();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Usage
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Company-level platform usage and aggregate Mira adoption visibility.
        </p>
      </section>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid flex-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Companies" value={usage.length} />

          <MetricCard
            label="Active Users"
            value={usage.reduce(
              (total, item) => total + (item.active_users ?? 0),
              0
            )}
          />

          <MetricCard
            label="Queries"
            value={usage.reduce(
              (total, item) => total + (item.query_count ?? 0),
              0
            )}
          />

          <MetricCard
            label="Failures"
            value={usage.reduce(
              (total, item) => total + (item.failed_count ?? 0),
              0
            )}
          />
        </div>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search companies..."
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-cyan-500 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-cyan-300/40 xl:w-80"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Active Users</th>
                <th className="px-5 py-3 font-medium">Queries</th>
                <th className="px-5 py-3 font-medium">Failures</th>
                <th className="px-5 py-3 font-medium">Avg Execution</th>
                <th className="px-5 py-3 font-medium">Last Activity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    Loading usage...
                  </td>
                </tr>
              ) : filteredUsage.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No usage found.
                  </td>
                </tr>
              ) : (
                filteredUsage.map((item) => (
                  <tr
                    key={item.company_id}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      {item.company_name || "Unnamed company"}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {item.active_users ?? 0}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {item.query_count ?? 0}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {item.failed_count ?? 0}
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {Math.round(item.avg_execution_ms ?? 0)} ms
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                      {formatDateTime(item.last_activity_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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

      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
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