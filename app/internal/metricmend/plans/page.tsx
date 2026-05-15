"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  CreditCard,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";

import {
  getInternalCompanyPlans,
  updateInternalCompanyPlan,
  type InternalCompanyPlan,
  type UpdateCompanyPlanPayload,
} from "@/lib/api/adminMetricMend";

import { createClient } from "@/lib/supabase/client";

export default function InternalPlansPage() {
  const [loading, setLoading] = useState(true);
  const [savingCompanyId, setSavingCompanyId] =
    useState<string | null>(null);

  const [companies, setCompanies] = useState<
    InternalCompanyPlan[]
  >([]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) return;

        const data = await getInternalCompanyPlans(user.id);

        setCompanies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function updateCompany(
    companyId: string,
    payload: UpdateCompanyPlanPayload
  ) {
    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) return;

      setSavingCompanyId(companyId);

      await updateInternalCompanyPlan({
        userId: user.id,
        companyId,
        payload,
      });

      setCompanies((previous) =>
        previous.map((company) =>
          company.id === companyId
            ? {
                ...company,
                ...payload,
              }
            : company
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update company plan.");
    } finally {
      setSavingCompanyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Plans & Billing
        </h1>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
          Manage company subscriptions, Mira credits, limits, and
          enterprise access.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          icon={Building2}
          label="Companies"
          value={companies.length}
        />

        <StatCard
          icon={Sparkles}
          label="Total Monthly Credits"
          value={companies.reduce(
            (sum, company) =>
              sum +
              (company.monthly_mira_credits || 0),
            0
          )}
        />

        <StatCard
          icon={CreditCard}
          label="Purchased Credits"
          value={companies.reduce(
            (sum, company) =>
              sum +
              (company.purchased_mira_credits || 0),
            0
          )}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
            <thead className="bg-slate-50 dark:bg-white/[0.03]">
              <tr>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Workspaces</TableHead>
                <TableHead>Builders</TableHead>
                <TableHead>Monthly Credits</TableHead>
                <TableHead>Purchased Credits</TableHead>
                <TableHead>Save</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    Loading plans...
                  </td>
                </tr>
              ) : companies.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No companies found.
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <CompanyRow
                    key={company.id}
                    company={company}
                    saving={
                      savingCompanyId === company.id
                    }
                    onSave={updateCompany}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CompanyRow({
  company,
  saving,
  onSave,
}: {
  company: InternalCompanyPlan;
  saving: boolean;
  onSave: (
    companyId: string,
    payload: UpdateCompanyPlanPayload
  ) => Promise<void>;
}) {
  const [form, setForm] = useState({
    plan: company.plan,
    subscription_status:
      company.subscription_status,
    max_users: company.max_users,
    max_workspaces: company.max_workspaces,
    max_builders: company.max_builders || 0,
    monthly_mira_credits:
      company.monthly_mira_credits,
    purchased_mira_credits:
      company.purchased_mira_credits,
  });

  return (
    <tr className="transition hover:bg-slate-50 dark:hover:bg-white/[0.02]">
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-slate-950 dark:text-white">
            {company.name}
          </p>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {company.slug}
          </p>
        </div>
      </td>

      <td className="px-4 py-4">
        <select
          value={form.plan}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              plan: event.target
                .value as InternalCompanyPlan["plan"],
            }))
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950"
        >
          <option value="free_trial">
            Free Trial
          </option>
          <option value="team">Team</option>
          <option value="business">
            Business
          </option>
          <option value="enterprise">
            Enterprise
          </option>
        </select>
      </td>

      <td className="px-4 py-4">
        <select
          value={form.subscription_status}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              subscription_status:
                event.target.value,
            }))
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950"
        >
          <option value="trialing">
            Trialing
          </option>
          <option value="active">Active</option>
          <option value="past_due">
            Past Due
          </option>
          <option value="canceled">
            Canceled
          </option>
          <option value="suspended">
            Suspended
          </option>
        </select>
      </td>

      <EditableNumberCell
        value={form.max_users}
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            max_users: value,
          }))
        }
      />

      <EditableNumberCell
        value={form.max_workspaces}
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            max_workspaces: value,
          }))
        }
      />

      <EditableNumberCell
        value={form.max_builders}
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            max_builders: value,
          }))
        }
      />

      <EditableNumberCell
        value={form.monthly_mira_credits}
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            monthly_mira_credits: value,
          }))
        }
      />

      <EditableNumberCell
        value={form.purchased_mira_credits}
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            purchased_mira_credits:
              value,
          }))
        }
      />

      <td className="px-4 py-4">
        <button
          type="button"
          disabled={saving}
          onClick={() =>
            onSave(company.id, form)
          }
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          Save
        </button>
      </td>
    </tr>
  );
}

function EditableNumberCell({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <td className="px-4 py-4">
      <input
        type="number"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950"
      />
    </td>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
      {children}
    </th>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}