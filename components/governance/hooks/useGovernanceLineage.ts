"use client";

import { useCallback, useEffect, useState } from "react";

import { useAppWorkspace } from "@/components/app/AppWorkspaceContext";

import {
  getMetricLineage,
  getModelLineage,
  getWorkspaceLineageGraph,
} from "@/lib/api/governanceLineage";

export function useGovernanceLineage(
  entityType?: "metric" | "model",
  entityId?: string
) {
  const { activeWorkspace } = useAppWorkspace();

  const [lineage, setLineage] = useState<any>(null);
  const [graph, setGraph] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const loadLineage = useCallback(async () => {
    if (!entityType || !entityId) {
      setLineage(null);
      return;
    }

    try {
      setLoading(true);

      let data;

      if (entityType === "metric") {
        data = await getMetricLineage(entityId);
      } else {
        data = await getModelLineage(entityId);
      }

      setLineage(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load lineage");
    } finally {
      setLoading(false);
    }
  }, [entityType, entityId]);

  const loadGraph = useCallback(async () => {
    if (!activeWorkspace?.workspace_id) {
      return;
    }

    try {
      const data = await getWorkspaceLineageGraph(
        activeWorkspace.workspace_id
      );

      setGraph(data);
    } catch (err) {
      console.error(err);
    }
  }, [activeWorkspace?.workspace_id]);

  useEffect(() => {
    loadLineage();
  }, [loadLineage]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  return {
    lineage,
    graph,
    loading,
    error,
    refreshLineage: loadLineage,
    refreshGraph: loadGraph,
  };
}