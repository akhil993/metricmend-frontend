"use client";

import { useEffect, useState } from "react";
import {
  getMetricMendOverview,
  type MetricMendOverview,
} from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

export default function InternalMetricMendOverviewPage() {
  const [overview, setOverview] =
    useState<MetricMendOverview | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data = await getMetricMendOverview(user.id);

        setOverview(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadOverview();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Internal Overview
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          MetricMend super-admin control plane for tenants,
          access, usage, and platform health.
        </p>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
          Loading internal overview...
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
              label="Companies"
              value={overview?.company_count ?? 0}
            />

            <OverviewCard
              label="Users"
              value={overview?.user_count ?? 0}
            />

            <OverviewCard
              label="Mira Queries"
              value={overview?.mira_query_count ?? 0}
            />

            <OverviewCard
              label="Failed Requests"
              value={overview?.failed_request_count ?? 0}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Panel
              title="Control Plane"
              description="Manage customer companies, admins, roles, and internal platform access."
            />

            <Panel
              title="System Observability"
              description="Track aggregate Mira usage, failed requests, connector issues, guardrails, and platform health."
            />
          </div>
        </>
      )}
    </div>
  );
}

function OverviewCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:shadow-2xl">
      <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}