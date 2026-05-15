"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  FileSearch,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import CompanyPlanCard from "@/components/settings/CompanyPlanCard";

import {
  BillingSummary,
  getMyBilling,
} from "@/lib/api/billing";

import {
  getMetricMendAdminMe,
} from "@/lib/api/adminMetricMend";

import { createClient } from "@/lib/supabase/client";

type AdminMeResponse = {
  is_metricmend_admin: boolean;
  profile?: unknown | null;
};

export default function SettingsPage() {
  const [billing, setBilling] =
    useState<BillingSummary | null>(null);

  const [isMetricMendAdmin, setIsMetricMendAdmin] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function load() {
    try {
      setLoading(true);

      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        throw new Error("UNAUTHORIZED");
      }

      const [billingData, adminMe] =
        await Promise.all([
          getMyBilling(),
          getMetricMendAdminMe(user.id) as Promise<AdminMeResponse>,
        ]);

      setBilling(billingData);
      setIsMetricMendAdmin(
        Boolean(adminMe?.is_metricmend_admin)
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load settings."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-slate-950 dark:border-white/20 dark:border-t-white" />
      </div>
    );
  }

  if (error || !billing) {
    return (
      <div className="rounded-3xl border border-red-300/30 bg-red-50 p-6 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
        {error || "Unable to load settings."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CompanyPlanCard
        planName={billing.company.plan}
        creditsUsed={billing.credits.used}
        creditsRemaining={billing.credits.remaining}
        creditsTotal={billing.credits.total}
        maxUsers={billing.company.max_users}
        maxWorkspaces={
          billing.company.max_workspaces
        }
      />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Organization controls
          </h2>

          <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
            Manage collaboration,
            governance, usage visibility,
            and security controls for
            your company.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SettingsLinkCard
            href="/app/settings/team"
            icon={Users}
            title="Team"
            description="Manage members, roles, and governed access."
          />

          <SettingsLinkCard
            href="/app/settings/usage"
            icon={Activity}
            title="Usage"
            description="Review organization usage and operational adoption."
          />

          <SettingsLinkCard
            href="/app/settings/audit-logs"
            icon={FileSearch}
            title="Audit Logs"
            description="Track important governance and activity events."
          />

          <SettingsLinkCard
            href="/app/settings/security"
            icon={Shield}
            title="Security"
            description="Prepare SSO, access, and enterprise security controls."
          />
        </div>
      </section>

      {isMetricMendAdmin ? (
        <section className="rounded-[2rem] border border-cyan-300/30 bg-cyan-50 p-8 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-400/10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-white/10 dark:text-cyan-100">
                <Sparkles className="h-4 w-4" />
                MetricMend admin
              </div>

              <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                Internal Operations Console
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-cyan-100/80">
                Access the MetricMend
                internal control plane for
                tenants, usage, plans,
                system health, audit logs,
                and AI operations.
              </p>
            </div>

            <Link
              href="/internal/metricmend"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
            >
              Open internal console
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SettingsLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20 dark:hover:bg-white/[0.065]"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm dark:bg-white/10 dark:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-700 dark:group-hover:text-white" />
      </div>

      <h3 className="mt-6 font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </Link>
  );
}