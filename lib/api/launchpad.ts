const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type LaunchpadSummary = {
  workspace_id: string;
  plan: string;
  counts: {
    connections: number;
    models: number;
    base_metrics: number;
    pending_reviews: number;
    mira_questions_this_month: number;
  };
  limits: {
    max_users: number | null;
    max_workspaces: number | null;
    max_builders: number | null;
    included_mira_credits:
    number | null;
  };
};

export async function getLaunchpadSummary(
  workspaceId: string
): Promise<LaunchpadSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/launchpad/${workspaceId}/summary`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Unable to load launchpad summary.");
  }

  return response.json();
}