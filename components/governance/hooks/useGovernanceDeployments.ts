"use client";

import { useEffect, useState } from "react";

import { getGovernanceDeployments } from "@/lib/api/governanceDeployments";

export function useGovernanceDeployments(
  workspaceId?: string
) {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!workspaceId) {
        setDeployments([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getGovernanceDeployments(workspaceId);
        setDeployments(data);
      } catch (error) {
        console.error(error);
        setDeployments([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [workspaceId]);

  return {
    deployments,
    loading,
  };
}