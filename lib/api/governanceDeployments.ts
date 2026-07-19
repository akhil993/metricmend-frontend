import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function createDeployment(
  payload: any,
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    "/api/governance/deployments",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function approveDeployment(
  deploymentId: string,
  payload: any,
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/deployments/${deploymentId}/approve`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function getGovernanceDeployments(
  workspaceId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/deployments/${workspaceId}`
  );
}
