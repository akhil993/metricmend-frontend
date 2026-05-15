"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import CompanyOverviewCards from "@/components/internal/metricmend/company-detail/CompanyOverviewCards";
import CompanyRecentActivity from "@/components/internal/metricmend/company-detail/CompanyRecentActivity";
import CompanyUsersTable from "@/components/internal/metricmend/company-detail/CompanyUsersTable";
import CompanyWorkspacesTable from "@/components/internal/metricmend/company-detail/CompanyWorkspacesTable";

import type { CompanyDetail } from "@/components/internal/metricmend/company-detail/types";

import { getInternalCompanyDetail } from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

type Props = {
  params: Promise<{
    companyId: string;
  }>;
};

export default function InternalCompanyDetailPage({
  params,
}: Props) {
  const { companyId } = use(params);

  const [company, setCompany] =
    useState<CompanyDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [notFound, setNotFound] =
    useState(false);

  useEffect(() => {
    async function loadCompany() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data =
          await getInternalCompanyDetail(
            user.id,
            companyId
          );

        setCompany(data);
      } catch (error) {
        console.error(error);

        if (
          error instanceof Error &&
          error.message === "NOT_FOUND"
        ) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [companyId]);

  const companyName =
    company?.name ||
    company?.company_name ||
    "Company detail";

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <Link
          href="/internal/metricmend/companies"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to companies
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {companyName}
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Dedicated internal tenant
          control center for this
          company.
        </p>
      </section>

      {loading ? (
        <Panel>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading company detail...
          </p>
        </Panel>
      ) : notFound || !company ? (
        <Panel>
          <p className="text-sm text-rose-600 dark:text-rose-300">
            Company not found.
          </p>
        </Panel>
      ) : (
        <>
          <CompanyOverviewCards
            company={company}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Company Overview">
              <DetailRow
                label="Company ID"
                value={company.id}
              />

              <DetailRow
                label="Name"
                value={
                  company.name ||
                  company.company_name ||
                  "—"
                }
              />

              <DetailRow
                label="Slug"
                value={company.slug || "—"}
              />

              <DetailRow
                label="Plan"
                value={company.plan || "—"}
              />

              <DetailRow
                label="Created"
                value={formatDate(
                  company.created_at
                )}
              />
            </Panel>

            <Panel title="Identity & SSO">
              <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                SSO, Azure AD, Okta,
                Google Workspace,
                SCIM, and group-role
                mappings will be
                configured here later.
              </p>
            </Panel>
          </div>

          <Panel title="Workspaces">
            <CompanyWorkspacesTable
              workspaces={
                company.workspaces || []
              }
            />
          </Panel>

          <Panel title="Company Admins">
            <CompanyUsersTable
              members={company.admins || []}
              emptyText="No admins assigned."
            />
          </Panel>

          <Panel title="All Members">
            <CompanyUsersTable
              members={company.members || []}
              emptyText="No members found."
            />
          </Panel>

          <Panel title="Recent Activity">
            <CompanyRecentActivity
              logs={
                company.recent_audit_logs ||
                []
              }
            />
          </Panel>
        </>
      )}
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      {title ? (
        <h2 className="mb-4 text-lg font-semibold text-slate-950 dark:text-white">
          {title}
        </h2>
      ) : null}

      {children}
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex border-b border-slate-100 py-3 last:border-0 dark:border-white/10">
      <div className="w-32 shrink-0 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </div>

      <div className="min-w-0 break-words text-sm font-medium text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function formatDate(
  value?: string | null
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}