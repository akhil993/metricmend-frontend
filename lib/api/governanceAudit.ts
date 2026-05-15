import { getCurrentUserId } from "@/lib/auth/getCurrentUserId";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL!;

type AuditFilters = {
  eventType?: string;
  entityType?: string;
  status?: string;
};

export async function getGovernanceAuditLogs(
  workspaceId: string,
  filters?: AuditFilters
) {
  const userId = await getCurrentUserId();

  const params = new URLSearchParams();

  if (filters?.eventType) {
    params.append(
      "event_type",
      filters.eventType
    );
  }

  if (filters?.entityType) {
    params.append(
      "entity_type",
      filters.entityType
    );
  }

  if (filters?.status) {
    params.append("status", filters.status);
  }

  const response = await fetch(
    `${API_BASE_URL}/api/governance/audit/workspace/${workspaceId}?${params.toString()}`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch governance audit logs"
    );
  }

  return response.json();
}