"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  createCreditPurchase,
  getMyBilling,
  type BillingSummary,
} from "@/lib/api/billing";

const creditPacks = [
  {
    credits: 100,
    label: "Starter Boost",
    price: "$10",
    description: "Good for testing and light Mira usage.",
  },
  {
    credits: 500,
    label: "Builder Pack",
    price: "$40",
    description: "Best for active model building and frequent analysis.",
  },
  {
    credits: 1000,
    label: "Growth Pack",
    price: "$75",
    description: "For heavier Mira usage across workspaces.",
  },
];

const upgradePlans = [
  {
    name: "Team",
    description: "More users, more workspaces, and higher Mira credits.",
    badge: "Coming soon",
  },
  {
    name: "Business",
    description: "Governance, admin controls, and larger team limits.",
    badge: "Coming soon",
  },
  {
    name: "Enterprise",
    description: "SSO, SCIM, custom limits, and enterprise support.",
    badge: "Contact us",
  },
];

function formatPlan(plan?: string | null) {
  if (!plan) return "Free Trial";

  return plan
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingCredits, setBuyingCredits] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadBilling() {
    setLoading(true);
    setMessage(null);

    try {
      const data = await getMyBilling();
      setBilling(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load billing."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBilling();
  }, []);

  const usagePercent = useMemo(() => {
    if (!billing?.credits.total) return 0;

    return Math.min(
      100,
      Math.round((billing.credits.used / billing.credits.total) * 100)
    );
  }, [billing]);

  async function handleBuyCredits(credits: number) {
    if (!billing?.company.id) return;

    setBuyingCredits(credits);
    setMessage(null);

    try {
      const result = await createCreditPurchase({
        company_id: billing.company.id,
        credits,
      });

      setMessage(result.message ?? "Credit purchase started.");
      await loadBilling();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to buy credits."
      );
    } finally {
      setBuyingCredits(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading billing...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-50 px-4 py-2 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          Billing & Mira credits
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Manage your plan and AI credits.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
          Free trial includes 50 Mira credits. You can buy more credits without
          upgrading, or move to a paid plan when your team is ready.
        </p>
      </section>

      {message ? (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <CreditCard className="h-7 w-7 text-cyan-500 dark:text-cyan-300" />

          <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Current plan
          </h2>

          <div className="mt-5 space-y-4">
            <InfoRow label="Company" value={billing?.company.name ?? "—"} />
            <InfoRow label="Plan" value={formatPlan(billing?.company.plan)} />
            <InfoRow
              label="Status"
              value={billing?.company.subscription_status ?? "—"}
            />
            <InfoRow
              label="Workspace limit"
              value={billing?.company.max_workspaces ?? 0}
            />
            <InfoRow label="User limit" value={billing?.company.max_users ?? 0} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <Sparkles className="h-7 w-7 text-indigo-500 dark:text-indigo-300" />

          <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
            Mira credit balance
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-4">
            <CreditStat label="Included" value={billing?.credits.included ?? 0} />
            <CreditStat
              label="Purchased"
              value={billing?.credits.purchased ?? 0}
            />
            <CreditStat label="Used" value={billing?.credits.used ?? 0} />
            <CreditStat
              label="Remaining"
              value={billing?.credits.remaining ?? 0}
            />
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Credit usage</span>
              <span>{usagePercent}% used</span>
            </div>

            <div className="mt-2 h-3 rounded-full bg-slate-100 dark:bg-white/[0.06]">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-amber-500" />

          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Buy extra credits
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Free trial users can request extra credits without upgrading. Online payments
              are paused while billing setup is finalized.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {creditPacks.map((pack) => (
            <div
              key={pack.credits}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.035]"
            >
              <p className="text-sm font-semibold text-slate-950 dark:text-white">
                {pack.label}
              </p>

              <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                {pack.credits}
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Mira credits
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {pack.description}
              </p>

              <button
                type="button"
                disabled
                className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-500"
              >
                Contact us to add credits
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
        <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
          Upgrade your plan
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Upgrade when you need more users, workspaces, governance, or enterprise
          controls.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {upgradePlans.map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.035]"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">
                  {plan.name}
                </p>

                <span className="rounded-full border border-cyan-300/30 bg-cyan-50 px-3 py-1 text-xs text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-100">
                  {plan.badge}
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {plan.description}
              </p>

              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400 dark:border-white/10 dark:text-slate-500"
              >
                Upgrade flow coming soon
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold capitalize text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function CreditStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.04]">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}