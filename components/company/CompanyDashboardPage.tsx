"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Settings,
  Shield,
  Users,
  Workflow,
} from "lucide-react";

import { getMyBilling, type BillingSummary } from "@/lib/api/billing";
import {
  listCompanyMembers,
  type CompanyMember,
} from "@/lib/api/company-members";
import { getMyWorkspaces, type MyWorkspace } from "@/lib/api/workspaces";
import { slugifyCompanyName } from "@/lib/company-slug";

type Props = {
  companySlug?: string;
};

function formatPlanName(plan?: string | null) {
  if (!plan) return "Free Trial";

  return plan
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function roleClass(role: string) {
  switch (role) {
    case "owner":
      return "bg-amber-100 text-amber-800 dark:bg-amber-300/10 dark:text-amber-200";
    case "admin":
      return "bg-violet-100 text-violet-800 dark:bg-violet-300/10 dark:text-violet-200";
    case "builder":
    case "editor":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-300/10 dark:text-cyan-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
  }
}

export default function CompanyDashboardPage({ companySlug }: Props) {
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [workspaces, setWorkspaces] = useState<MyWorkspace[]>([]);
  const [membersRestricted, setMembersRestricted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const billingData = await getMyBilling();
        const company = billingData.company;

        if (!company?.id) {
          throw new Error("Company details were not found for this account.");
        }

        const expectedSlug = slugifyCompanyName(company.name || company.id);

        if (companySlug && companySlug !== expectedSlug) {
          throw new Error("This company page is not available for your account.");
        }

        setBilling(billingData);

        const workspaceData = await getMyWorkspaces();
        setWorkspaces(
          workspaceData.filter(
            (workspace) => workspace.company_id === company.id
          )
        );

        try {
          const memberData = await listCompanyMembers(company.id, "");
          setMembers(memberData);
          setMembersRestricted(false);
        } catch {
          setMembers([]);
          setMembersRestricted(true);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load company details."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [companySlug]);

  const company = billing?.company;
  const credits = billing?.credits;

  const adminCount = useMemo(
    () =>
      members.filter((member) =>
        ["owner", "admin"].includes(member.role)
      ).length,
    [members]
  );

  if (loading) {
    return (
      <Panel>
        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading company...
        </div>
      </Panel>
    );
  }

  if (error || !company || !credits) {
    return (
      <Panel>
        <div className="flex items-start gap-3 text-sm text-rose-600 dark:text-rose-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {error || "Company details were not found."}
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
              <Building2 className="h-4 w-4" />
              Company command center
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {company.name || "Company"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-neutral-400">
              Review company plan, users, workspaces, AI credit usage, and
              governance readiness from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/app/settings/team"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              <Users className="h-4 w-4" />
              Manage users
            </Link>

            <Link
              href="/app/settings/billing"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          icon={Shield}
          label="Plan"
          value={formatPlanName(company.plan)}
        />
        <MetricCard
          icon={Users}
          label="Members"
          value={membersRestricted ? "Admin only" : String(members.length)}
        />
        <MetricCard
          icon={Workflow}
          label="Workspaces"
          value={String(workspaces.length)}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Mira credits"
          value={`${credits.remaining}/${credits.total}`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel title="Company Details">
          <DetailRow label="Company ID" value={company.id} />
          <DetailRow label="Company URL" value={`/app/company/${slugifyCompanyName(company.name || company.id)}`} />
          <DetailRow label="Subscription" value={company.subscription_status || "Not configured"} />
          <DetailRow label="Included seats" value={String(company.max_users ?? "Unlimited")} />
          <DetailRow label="Workspace limit" value={String(company.max_workspaces ?? "Unlimited")} />
        </Panel>

        <Panel title="Credit Usage">
          <div className="space-y-4">
            <UsageBar
              label="Monthly Mira credits"
              used={credits.used}
              total={credits.total}
            />
            <DetailRow label="Included" value={String(credits.included)} />
            <DetailRow label="Purchased" value={String(credits.purchased)} />
            <DetailRow label="Remaining" value={String(credits.remaining)} />
          </div>
        </Panel>
      </div>

      <Panel title="Company Users">
        {membersRestricted ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100">
            User details are available to company owners and admins.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <MiniStat label="Admins" value={String(adminCount)} />
              <MiniStat label="Active users" value={String(members.length)} />
              <MiniStat
                label="Available seats"
                value={
                  typeof company.max_users === "number"
                    ? String(Math.max(company.max_users - members.length, 0))
                    : "Unlimited"
                }
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 dark:border-white/10 md:grid-cols-[1fr_auto_auto] md:items-center"
                >
                  <div>
                    <p className="font-medium text-slate-950 dark:text-white">
                      {member.profiles?.full_name ||
                        member.profiles?.email ||
                        member.user_id}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {member.profiles?.email || member.user_id}
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${roleClass(
                      member.role
                    )}`}
                  >
                    {member.role}
                  </span>

                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Workspaces">
        {workspaces.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No workspaces found.
          </p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.workspace_id}
                href={`/app/workspaces/${workspace.workspace_id}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
              >
                <p className="font-medium text-slate-950 dark:text-white">
                  {workspace.workspace_name}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>{workspace.environment}</span>
                  <span>{workspace.role}</span>
                  <span>{workspace.workspace_type || "workspace"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      {title ? (
        <h2 className="mb-5 text-lg font-semibold text-slate-950 dark:text-white">
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700 dark:bg-white/10 dark:text-slate-200">
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>
      <p className="mt-5 truncate text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-white/10">
      <div className="w-36 shrink-0 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </div>
      <div className="min-w-0 break-words text-sm font-medium text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function UsageBar({
  label,
  used,
  total,
}: {
  label: string;
  used: number;
  total: number;
}) {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {used} used
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
