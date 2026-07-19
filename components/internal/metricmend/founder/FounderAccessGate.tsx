"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";

import { useFounderAccess } from "@/hooks/useFounderAccess";

type Props = {
  children: React.ReactNode;
};

export default function FounderAccessGate({ children }: Props) {
  const {
    loading,
    authorized,
    founderAuthorized,
    error,
  } = useFounderAccess();

  if (loading) {
    return (
      <FounderGatePanel
        tone="neutral"
        icon={ShieldCheck}
        title="Verifying founder access"
        message="Checking your signed-in session, MetricMend internal role, and founder access."
      />
    );
  }

  if (!authorized) {
    return (
      <FounderGatePanel
        tone="danger"
        icon={ShieldAlert}
        title="Internal access required"
        message={error || "You must be signed in as a MetricMend internal admin."}
      />
    );
  }

  if (!founderAuthorized) {
    return (
      <FounderGatePanel
        tone="danger"
        icon={ShieldAlert}
        title="Founder access restricted"
        message="This page is limited to active MetricMend internal users with the founder role."
      />
    );
  }

  return <>{children}</>;
}

function FounderGatePanel({
  tone,
  icon: Icon,
  title,
  message,
}: {
  tone: "neutral" | "danger";
  icon: typeof ShieldCheck;
  title: string;
  message: string;
}) {
  const danger = tone === "danger";

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        className={[
          "w-full max-w-lg rounded-2xl border bg-white p-6 shadow-sm dark:bg-white/[0.04]",
          danger
            ? "border-rose-200 dark:border-rose-400/30"
            : "border-slate-200 dark:border-white/10",
        ].join(" ")}
      >
        <div className="flex items-start gap-4">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              danger
                ? "bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200"
                : "bg-cyan-50 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-200",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-950 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
