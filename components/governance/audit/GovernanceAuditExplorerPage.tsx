"use client";

import { useMemo, useState } from "react";

import {
  Activity,
  Search,
  ShieldCheck,
} from "lucide-react";

import { useGovernanceAudit } from "../hooks/useGovernanceAudit";

function buildStatusStyles(status?: string) {
  switch (status) {
    case "approved":
    case "completed":
    case "success":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500";

    case "rejected":
    case "failed":
      return "border-rose-500/20 bg-rose-500/10 text-rose-400";

    case "pending":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-400";
  }
}

export default function GovernanceAuditExplorerPage() {
  const [search, setSearch] = useState("");

  const { logs, loading } =
    useGovernanceAudit();

  const filteredLogs = useMemo(() => {
    if (!search.trim()) {
      return logs;
    }

    const lowered = search.toLowerCase();

    return logs.filter((log) => {
      return (
        log.event_type
          ?.toLowerCase()
          .includes(lowered) ||
        log.entity_type
          ?.toLowerCase()
          .includes(lowered) ||
        log.status
          ?.toLowerCase()
          .includes(lowered) ||
        log.user_id
          ?.toLowerCase()
          .includes(lowered)
      );
    });
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>

          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Governance Audit Explorer
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explore governance approvals,
              deployments, certifications, production
              protections, and audit-safe activity.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Governance Activity
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search and review governance actions
              across your workspace environments.
            </p>
          </div>

          <div className="relative w-full lg:w-[340px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search governance activity..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 dark:border-white/10 dark:bg-black/20 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <th className="px-6 py-4">
                  Event
                </th>

                <th className="px-6 py-4">
                  Entity
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  User
                </th>

                <th className="px-6 py-4">
                  Timestamp
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Loading governance audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="rounded-2xl bg-slate-500/10 p-4">
                        <Activity className="h-6 w-6 text-slate-400" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          No governance activity found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Governance audit events will
                          appear here.
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                  >
                    <td className="px-6 py-5">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {log.event_type}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {log.entity_id}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {log.entity_type}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${buildStatusStyles(
                          log.status
                        )}`}
                      >
                        {log.status || "recorded"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                      {log.user_id}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(
                        log.created_at
                      ).toLocaleString()}
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