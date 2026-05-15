"use client";

import type { InternalAuditLog } from "./types";

type Props = {
  items: InternalAuditLog[];
};

export default function AuditLogsTable({ items }: Props) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
        No audit logs found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-white/10 dark:text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Entity</th>
              <th className="px-5 py-3 font-medium">Details</th>
              <th className="px-5 py-3 font-medium">Created</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {items.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 dark:hover:bg-white/[0.03]"
              >
                <td className="px-5 py-4">
                  <ActionBadge action={item.action} />
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {item.profiles?.full_name ||
                      item.profiles?.email ||
                      "Unknown"}
                  </p>

                  {item.profiles?.email && item.profiles?.full_name && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                      {item.profiles.email}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium capitalize text-slate-700 dark:text-slate-200">
                    {item.entity_type}
                  </p>
                  <p className="mt-1 max-w-[260px] truncate text-xs text-slate-500 dark:text-slate-500">
                    {item.entity_id}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                  <MetadataSummary metadata={item.metadata} />
                </td>

                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                  {formatDate(item.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const label = formatAction(action);

  const className =
    action === "assign_company_admin"
      ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-300 dark:text-slate-950 dark:ring-0"
      : action === "remove_company_admin"
        ? "bg-rose-100 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-400 dark:text-white dark:ring-0"
        : "bg-slate-100 text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-0";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}

function MetadataSummary({
  metadata,
}: {
  metadata?: Record<string, unknown>;
}) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return <span className="text-slate-400 dark:text-slate-500">—</span>;
  }

  const assignedUserId = getString(metadata.assigned_user_id);
  const removedUserId = getString(metadata.removed_user_id);
  const role = getString(metadata.role);

  return (
    <div className="space-y-1 text-xs">
      {assignedUserId && (
        <p>
          <span className="text-slate-500 dark:text-slate-500">
            Assigned user:
          </span>{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {assignedUserId}
          </span>
        </p>
      )}

      {removedUserId && (
        <p>
          <span className="text-slate-500 dark:text-slate-500">
            Removed user:
          </span>{" "}
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {removedUserId}
          </span>
        </p>
      )}

      {role && (
        <p>
          <span className="text-slate-500 dark:text-slate-500">Role:</span>{" "}
          <span className="font-medium capitalize text-slate-700 dark:text-slate-200">
            {role}
          </span>
        </p>
      )}
    </div>
  );
}

function getString(value: unknown) {
  return typeof value === "string" ? value : null;
}

function formatAction(action: string) {
  return action
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}