"use client";

import { useMemo } from "react";

import { useMetricMendAdmin } from "@/hooks/useMetricMendAdmin";

function getFounderEmailAllowlist() {
  return (process.env.NEXT_PUBLIC_METRICMEND_FOUNDER_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function useFounderAccess() {
  const adminState = useMetricMendAdmin();

  const founderEmails = useMemo(() => getFounderEmailAllowlist(), []);
  const userEmail = adminState.user?.email?.toLowerCase() || null;
  const founderConfigured = founderEmails.length > 0;
  const hasFounderRole =
    adminState.user?.internal_role === "founder";
  const founderAuthorized =
    adminState.authorized &&
    hasFounderRole &&
    (
      !founderConfigured ||
      (
        Boolean(userEmail) &&
        founderEmails.includes(userEmail as string)
      )
    );

  return {
    ...adminState,
    founderConfigured,
    founderAuthorized,
    founderEmails,
    hasFounderRole,
  };
}
