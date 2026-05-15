"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMetricMendAdminMe } from "@/lib/api/adminMetricMend";
import { createClient } from "@/lib/supabase/client";

export default function MetricMendAdminNavLink() {
  const [isMetricMendAdmin, setIsMetricMendAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          setChecked(true);
          return;
        }

        const data = await getMetricMendAdminMe(user.id);
        setIsMetricMendAdmin(Boolean(data.is_metricmend_admin));
      } catch (error) {
        console.error(error);
        setIsMetricMendAdmin(false);
      } finally {
        setChecked(true);
      }
    }

    checkAccess();
  }, []);

  if (!checked || !isMetricMendAdmin) return null;

  return (
    <Link
      href="/app/admin/metricmend"
      className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-300/15"
    >
      MetricMend Admin
    </Link>
  );
}