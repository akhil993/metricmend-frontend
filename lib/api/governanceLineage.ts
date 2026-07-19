import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function getMetricLineage(
  metricId: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/lineage/metrics/${metricId}`
  );
}

export async function getModelLineage(
  modelId: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/lineage/models/${modelId}`
  );
}

export async function getDeploymentHistory(
  entityType: string,
  entityId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/lineage/${entityType}/${entityId}/deployments`
  );
}

export async function getWorkspaceLineageGraph(
  workspaceId: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/lineage/workspace/${workspaceId}/graph`
  );
}
