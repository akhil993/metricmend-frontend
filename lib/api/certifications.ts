const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getCertifiedMetrics(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/certifications/${workspaceId}/metrics`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch certified metrics");
  }

  return response.json();
}

export async function getCertifiedModels(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/certifications/${workspaceId}/models`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch certified models");
  }

  return response.json();
}

export async function certifyMetric(
  payload: {
    workspace_id: string;
    metric_id: string;
    certification_notes?: string;
  },
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/certification-actions/metrics`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to certify metric");
  }

  return response.json();
}

export async function certifyModel(
  payload: {
    workspace_id: string;
    semantic_model_id: string;
    certification_notes?: string;
  },
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/certification-actions/models`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to certify model");
  }

  return response.json();
}

export async function getCertificationCandidates(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/certifications/${workspaceId}/candidates`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch certification candidates");
  }

  return response.json();
}