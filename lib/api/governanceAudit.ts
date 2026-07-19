import { fetchJsonWithAuth } from "@/lib/api/fetch";

type AuditFilters = {
  eventType?: string;
  entityType?: string;
  status?: string;
};

export async function getGovernanceAuditLogs(
  workspaceId: string,
  filters?: AuditFilters
) {
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

  const query = params.toString();

  return fetchJsonWithAuth<any[]>(
    `/api/governance/audit/workspace/${workspaceId}${query ? `?${query}` : ""}`
  );
}
