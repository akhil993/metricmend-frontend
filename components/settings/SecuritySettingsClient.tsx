"use client";

import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Database,
  KeyRound,
  Loader2,
  Lock,
  Shield,
  Users,
} from "lucide-react";

import {
  getModelSecurityStatus,
  type ModelSecurityStatus,
  type SecurityControl,
} from "@/lib/api/security";

const STATIC_CONTROLS = [
  {
    icon: Users,
    title: "Role-based access",
    status: "Active",
    description:
      "Company owners/admins manage team roles and governed access through Team settings.",
  },
  {
    icon: Shield,
    title: "SSO readiness",
    status: "Planned",
    description:
      "SAML, Azure AD, Okta, Google Workspace, and SCIM controls can be added here later.",
  },
  {
    icon: KeyRound,
    title: "Service access",
    status: "Planned",
    description:
      "Future API keys, service accounts, and machine-to-machine access controls belong here.",
  },
] as const;

const MODEL_CONTROL_ICONS = {
  model_table_rls: Database,
  object_level_security: Lock,
  backend_build_gate: Shield,
} as const;

export default function SecuritySettingsClient() {
  const [status, setStatus] =
    useState<ModelSecurityStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getModelSecurityStatus()
      .then((nextStatus) => {
        if (!mounted) {
          return;
        }

        setStatus(nextStatus);
        setError(null);
      })
      .catch((nextError) => {
        if (!mounted) {
          return;
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : "Failed to load security status."
        );
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const modelControls = useMemo(
    () => status?.controls || [],
    [status]
  );

  const tableCounts = useMemo(() => {
    const tables = status?.model_security.tables || [];

    return {
      total: tables.length,
      rlsEnabled: tables.filter((table) => table.rls_enabled).length,
      withPolicies: tables.filter(
        (table) => table.policies.length > 0
      ).length,
    };
  }, [status]);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
          <Shield className="h-4 w-4" />
          Security
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Security & governance
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Manage organization access governance, authentication
              readiness, admin controls, and enterprise security posture.
            </p>
          </div>

          <StatusBadge
            loading={loading}
            ready={status?.status === "ready"}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              Semantic model security
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              RLS protects model tables by tenant. OLS protects child
              records through parent workspace, model, metric, and thread
              ownership.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <MiniStat label="Tables" value={tableCounts.total} />
            <MiniStat label="RLS" value={tableCounts.rlsEnabled} />
            <MiniStat label="OLS" value={tableCounts.withPolicies} />
          </div>
        </div>

        {status?.issues.length ? (
          <div className="mt-5 space-y-2">
            {status.issues.map((issue) => (
              <div
                key={issue}
                className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {modelControls.map((control) => (
            <ModelSecurityCard
              key={control.key}
              control={control}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {STATIC_CONTROLS.map((control) => (
          <SecurityCard
            key={control.title}
            icon={control.icon}
            title={control.title}
            status={control.status}
            description={control.description}
          />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  loading,
  ready,
}: {
  loading: boolean;
  ready: boolean;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
        ready
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
          : "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"
      }`}
    >
      {ready ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      {ready ? "Ready" : "Needs attention"}
    </span>
  );
}

function ModelSecurityCard({
  control,
}: {
  control: SecurityControl;
}) {
  const Icon =
    MODEL_CONTROL_ICONS[
      control.key as keyof typeof MODEL_CONTROL_ICONS
    ] || Shield;
  const active = control.status === "active";

  return (
    <div className="rounded-2xl border border-slate-200 p-5 dark:border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            active
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
              : "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"
          }`}
        >
          {active ? "Active" : "Needs SQL"}
        </span>
      </div>

      <h3 className="mt-5 font-semibold text-slate-950 dark:text-white">
        {control.label}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
        {control.description}
      </p>
    </div>
  );
}

function SecurityCard({
  icon: Icon,
  title,
  status,
  description,
}: {
  icon: ElementType;
  title: string;
  status: "Active" | "Planned";
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Active"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
              : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300"
          }`}
        >
          {status}
        </span>
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

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-20 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-white/10">
      <div className="text-lg font-semibold text-slate-950 dark:text-white">
        {value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </div>
    </div>
  );
}
