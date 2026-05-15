const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function createDeployment(
  payload: any,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/deployments`,
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
    throw new Error("Failed to create deployment");
  }

  return response.json();
}

export async function approveDeployment(
  deploymentId: string,
  payload: any,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/deployments/${deploymentId}/approve`,
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
    throw new Error("Failed to approve deployment");
  }

  return response.json();
}

export async function getGovernanceDeployments(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/deployments/${workspaceId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch governance deployments");
  }

  return response.json();
}