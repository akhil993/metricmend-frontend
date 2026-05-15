const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getMiraGovernanceContext(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/mira/${workspaceId}/context`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Mira governance context");
  }

  return response.json();
}

export async function getMiraGeneratedReviewQueue(
  workspaceId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/mira/${workspaceId}/review-queue`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Mira generated review queue");
  }

  return response.json();
}

export async function submitMiraGeneratedAssetReview(
  payload: any,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/mira/submit-review`,
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
    throw new Error("Failed to submit Mira asset review");
  }

  return response.json();
}

export async function reviewMiraGeneratedAsset(
  reviewId: string,
  payload: any,
  userId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/governance/mira/reviews/${reviewId}`,
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
    throw new Error("Failed to review Mira generated asset");
  }

  return response.json();
}