export type InternalAuditLog = {
  id: string;

  action: string;

  entity_type: string;
  entity_id: string;

  metadata?: Record<string, unknown>;

  created_at?: string | null;

  profiles?: {
    id: string;
    email?: string | null;
    full_name?: string | null;
  } | null;
};