"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useMetricMendAdmin } from "@/hooks/useMetricMendAdmin";

type Props = {
  children: React.ReactNode;
};

export default function InternalAccessGate({ children }: Props) {
  const { loading, authorized, error } = useMetricMendAdmin();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <ShieldCheck className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Verifying access
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Checking your MetricMend internal permissions.
              </p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-900/60 dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40">
              <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-300" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Access restricted
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {error ?? "You do not have permission to view this area."}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-500">
            MetricMend Internal is only available to users with
            <span className="font-semibold"> is_metricmend_admin </span>
            access.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}