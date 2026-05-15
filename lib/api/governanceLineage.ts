import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getMetricLineage(
  metricId: string
) {
  const userId = await getCurrentUserId();

  const response = await fetch(
    `${API_BASE_URL}/api/governance/lineage/metrics/${metricId}`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch metric lineage");
  }

  return response.json();
}

export async function getModelLineage(
  modelId: string
) {
  const userId = await getCurrentUserId();

  const response = await fetch(
    `${API_BASE_URL}/api/governance/lineage/models/${modelId}`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch model lineage");
  }

  return response.json();
}

export async function getDeploymentHistory(
  entityType: string,
  entityId: string
) {
  const userId = await getCurrentUserId();

  const response = await fetch(
    `${API_BASE_URL}/api/governance/lineage/${entityType}/${entityId}/deployments`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch deployment history"
    );
  }

  return response.json();
}

export async function getWorkspaceLineageGraph(
  workspaceId: string
) {
  const userId = await getCurrentUserId();

  const response = await fetch(
    `${API_BASE_URL}/api/governance-lineage/workspace/${workspaceId}/graph`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch governance lineage graph"
    );
  }

  return response.json();
}