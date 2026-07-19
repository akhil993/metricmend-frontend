import { getApiBaseUrl } from "@/lib/api/fetch";
import {
  getCurrentAccessToken,
  getCurrentUserId,
} from "@/lib/auth/session";

const API_BASE_URL = getApiBaseUrl();

async function getAuthHeaders() {
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  return {
    Authorization: `Bearer ${accessToken}`,
    "user-id": userId,
  };
}

export type LaunchpadSummary = {
  workspace_id: string;
  plan: string;
  counts: {
    connections: number;
    models: number;
    base_metrics: number;
    pending_reviews: number;
    mira_questions_this_month: number;
    mira_credits_used: number;
    mira_credits_remaining: number;
    mira_credits_total: number;
  };
  limits: {
    max_users: number | null;
    max_workspaces: number | null;
    max_builders: number | null;
    included_mira_credits:
    number | null;
    purchased_mira_credits: number;
  };
};

export async function getLaunchpadSummary(
  workspaceId: string
): Promise<LaunchpadSummary> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${API_BASE_URL}/api/launchpad/${workspaceId}/summary`,
    {
      headers: authHeaders,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Unable to load launchpad summary.");
  }

  return response.json();
}
