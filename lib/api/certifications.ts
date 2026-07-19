import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function getCertifiedMetrics(
  workspaceId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/certifications/${workspaceId}/metrics`
  );
}

export async function getCertifiedModels(
  workspaceId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/certifications/${workspaceId}/models`
  );
}

export async function certifyMetric(
  payload: {
    workspace_id: string;
    metric_id: string;
    certification_notes?: string;
  },
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    "/api/governance/certification-actions/metrics",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function certifyModel(
  payload: {
    workspace_id: string;
    semantic_model_id: string;
    certification_notes?: string;
  },
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    "/api/governance/certification-actions/models",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getCertificationCandidates(
  workspaceId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/certifications/${workspaceId}/candidates`
  );
}
