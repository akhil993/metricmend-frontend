import { Building2, Database, Shield, Users, Workflow } from "lucide-react";
import type { CompanyDetail } from "./types";

export default function CompanyOverviewCards({
  company,
}: {
  company: CompanyDetail;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard label="Members" value={company.member_count ?? 0} icon={<Users className="h-5 w-5" />} />
      <MetricCard label="Admins" value={company.admin_count ?? 0} icon={<Shield className="h-5 w-5" />} />
      <MetricCard label="Workspaces" value={company.workspace_count ?? 0} icon={<Workflow className="h-5 w-5" />} />
      <MetricCard label="Models" value={company.model_count ?? 0} icon={<Database className="h-5 w-5" />} />
      <MetricCard label="Status" value={company.status || "Active"} icon={<Building2 className="h-5 w-5" />} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-white/[0.06] dark:text-slate-300">
          {icon}
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}