import type { CompanyDetailAuditLog } from "./types";

export default function CompanyRecentActivity({
  logs,
}: {
  logs: CompanyDetailAuditLog[];
}) {
  if (!logs.length) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-400">
        No recent company activity found.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div
          key={log.id}
          className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatAction(log.action)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {log.entity_type} · {log.entity_id}
              </p>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatDate(log.created_at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
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