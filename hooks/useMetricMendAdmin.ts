"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MetricMendAdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  is_metricmend_admin: boolean;
  internal_role: string | null;
  internal_permissions: string[];
  internal_access_source?: string | null;
};

type UseMetricMendAdminState = {
  user: MetricMendAdminUser | null;
  loading: boolean;
  authorized: boolean;
  error: string | null;
};

export function useMetricMendAdmin(): UseMetricMendAdminState {
  const [user, setUser] = useState<MetricMendAdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadAdmin() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser?.id) {
          if (!active) return;

          setUser(null);
          setAuthorized(false);
          setError("You are not signed in.");
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          if (!active) return;

          setUser(null);
          setAuthorized(false);
          setError("Your internal session could not be verified.");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/metricmend/me`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "user-id": authUser.id,
            },
          }
        );

        if (!response.ok) {
          if (!active) return;

          setUser(null);
          setAuthorized(false);
          setError(
            response.status === 403
              ? "You do not have access to MetricMend Internal."
              : "Unable to verify internal admin access."
          );
          return;
        }

        const meData = await response.json();

        if (!active) return;

        setUser({
          id: meData.profile?.id ?? authUser.id,
          email: meData.profile?.email ?? authUser.email ?? null,
          full_name: meData.profile?.full_name ?? null,
          is_metricmend_admin: Boolean(meData.is_metricmend_admin),
          internal_role: meData.internal_role ?? null,
          internal_permissions: Array.isArray(meData.internal_permissions)
            ? meData.internal_permissions
            : [],
          internal_access_source: meData.internal_access_source ?? null,
        });

        setAuthorized(Boolean(meData.is_metricmend_admin));
      } catch (err) {
        if (!active) return;

        console.error(err);
        setUser(null);
        setAuthorized(false);
        setError("Unable to connect to MetricMend Internal.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadAdmin();

    return () => {
      active = false;
    };
  }, []);

  return {
    user,
    loading,
    authorized,
    error,
  };
}
