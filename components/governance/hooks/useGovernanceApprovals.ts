"use client";

import { useEffect, useState } from "react";

import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";
import { getApprovalWorkflows } from "@/lib/api/approvalWorkflows";

export function useGovernanceApprovals(workspaceId?: string) {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!workspaceId) {
        setApprovals([]);
        setLoading(false);
        return;
      }

      try {
        const userId = await getCurrentUserId();

        const data = await getApprovalWorkflows(
          workspaceId,
          userId
        );

        setApprovals(data);
      } catch (error) {
        console.error(error);
        setApprovals([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [workspaceId]);

  return {
    approvals,
    loading,
  };
}