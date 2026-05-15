"use client";

import { useEffect, useState } from "react";
import {
  Brain,
  Building2,
  CreditCard,
  Loader2,
  Users,
} from "lucide-react";

import {
  BillingSummary,
  getMyBilling,
} from "@/lib/api/billing";

export default function BillingSettingsPage() {
  const [billing, setBilling] =
    useState<BillingSummary | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyBilling();
        setBilling(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load billing."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <LoadingPanel message="Loading billing..." />
    );
  }

  if (error || !billing) {
    return (
      <ErrorPanel
        message={error || "Unable to load billing."}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-50 px-4 py-2 text-sm text-violet-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100">
          <CreditCard className="h-4 w-4" />
          Billing
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Plan & billing overview
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Review your company plan, credit allocation, and usage
          limits. Payment, invoices, and subscription changes are
          intentionally not exposed yet.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <BillingCard
          icon={CreditCard}
          label="Current plan"
          value={formatPlan(billing.company.plan)}
          description={
            billing.company.subscription_status ||
            "No subscription status"
          }
        />

        <BillingCard
          icon={Brain}
          label="Total Mira credits"
          value={billing.credits.total}
          description={`${billing.credits.remaining} remaining`}
        />

        <BillingCard
          icon={Users}
          label="Seats included"
          value={billing.company.max_users ?? "∞"}
          description="Company member capacity"
        />
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Plan limits
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LimitRow
            icon={Users}
            label="Team members"
            value={billing.company.max_users ?? "Unlimited"}
          />

          <LimitRow
            icon={Building2}
            label="Workspaces"
            value={
              billing.company.max_workspaces ??
              "Unlimited"
            }
          />

          <LimitRow
            icon={Brain}
            label="Included Mira credits"
            value={billing.credits.included}
          />

          <LimitRow
            icon={Brain}
            label="Purchased Mira credits"
            value={billing.credits.purchased}
          />
        </div>
      </section>
    </div>
  );
}

function formatPlan(plan?: string | null) {
  if (!plan) return "Free Trial";

  return plan
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

function BillingCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div className="rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-400/10 dark:text-violet-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-6 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>

      <p className="mt-2 text-sm capitalize text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function LimitRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white p-2 text-slate-600 dark:bg-white/10 dark:text-slate-200">
          <Icon className="h-4 w-4" />
        </div>

        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </p>
      </div>

      <p className="text-sm font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function LoadingPanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.045] dark:text-slate-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      {message}
    </div>
  );
}

function ErrorPanel({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-red-300/30 bg-red-50 p-6 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
      {message}
    </div>
  );
}