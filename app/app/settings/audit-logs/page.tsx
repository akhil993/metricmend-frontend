import { FileSearch, Lock, ShieldCheck } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100">
          <FileSearch className="h-4 w-4" />
          Audit Logs
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Organization audit activity
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Track governance activity across members, workspaces,
          semantic models, metrics, Mira usage, and administrative
          actions.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <GovernanceCard
          icon={ShieldCheck}
          title="Tenant-scoped logs"
          description="Customer audit logs should only expose events from this company."
        />

        <GovernanceCard
          icon={FileSearch}
          title="Governance history"
          description="Role changes, model updates, connection changes, and metric events belong here."
        />

        <GovernanceCard
          icon={Lock}
          title="Internal logs separated"
          description="MetricMend internal operational logs remain private under the internal console."
        />
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Audit log viewer
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          This page is ready for the company-scoped audit API. Do not
          reuse internal audit endpoints here because those are
          MetricMend staff-only operational logs.
        </p>

        <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          Waiting for company-scoped audit endpoint:
          <span className="ml-2 font-mono text-xs">
            /api/company-audit-logs
          </span>
        </div>
      </section>
    </div>
  );
}

function GovernanceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}