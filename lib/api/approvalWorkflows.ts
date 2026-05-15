const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getApprovalWorkflows(
  workspaceId: string,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/workflows/${workspaceId}`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch governance workflows");
  }

  return response.json();
}

export async function reviewApprovalWorkflow(
  workflowId: string,
  payload: {
    status: "approved" | "rejected";
    review_comments?: string;
  },
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/workflows/${workflowId}/review`,
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
    throw new Error("Failed to review governance workflow");
  }

  return response.json();
}