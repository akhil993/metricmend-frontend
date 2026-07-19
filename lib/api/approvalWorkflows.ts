import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function getApprovalWorkflows(
  workspaceId: string,
  _userId?: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/workflows/${workspaceId}`
  );
}

export async function reviewApprovalWorkflow(
  workflowId: string,
  payload: {
    status: "approved" | "rejected";
    review_comments?: string;
  },
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/workflows/${workflowId}/review`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
