"use client";

import { useCallback, useEffect, useState } from "react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import { getGovernanceAuditLogs } from "@/lib/api/governanceAudit";

type AuditFilters = {
  eventType?: string;
  entityType?: string;
  status?: string;
};

export function useGovernanceAudit(
  filters?: AuditFilters
) {
  const { activeWorkspace } = useAppWorkspace();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadLogs = useCallback(async () => {
    if (!activeWorkspace?.workspace_id) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await getGovernanceAuditLogs(
          activeWorkspace.workspace_id,
          filters
        );

      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    activeWorkspace?.workspace_id,
    filters,
  ]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    logs,
    loading,
    refreshLogs: loadLogs,
  };
}