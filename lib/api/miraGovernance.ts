import { fetchJsonWithAuth } from "@/lib/api/fetch";

export async function getMiraGovernanceContext(
  workspaceId: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/mira/${workspaceId}/context`
  );
}

export async function getMiraGeneratedReviewQueue(
  workspaceId: string
) {
  return fetchJsonWithAuth<any[]>(
    `/api/governance/mira/${workspaceId}/review-queue`
  );
}

export async function submitMiraGeneratedAssetReview(
  payload: any,
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    "/api/governance/mira/submit-review",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function reviewMiraGeneratedAsset(
  reviewId: string,
  payload: any,
  _userId?: string
) {
  return fetchJsonWithAuth<any>(
    `/api/governance/mira/reviews/${reviewId}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
