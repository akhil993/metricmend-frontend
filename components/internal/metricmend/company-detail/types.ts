export type CompanyDetailMember = {
  id: string;
  company_id: string;
  user_id: string;
  role: string;
  status?: string | null;
  created_at?: string | null;
  profiles?: {
    id: string;
    email?: string | null;
    full_name?: string | null;
  } | null;
};

export type CompanyDetailWorkspace = {
  id: string;
  name?: string | null;
  created_at?: string | null;
};

export type CompanyDetailAuditLog = {
  id: string;
  actor_user_id?: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  metadata?: Record<string, unknown>;
  created_at?: string | null;
};

export type CompanyDetail = {
  id: string;
  name?: string | null;
  company_name?: string | null;
  slug?: string | null;
  status?: string | null;
  plan?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  admins: CompanyDetailMember[];
  members: CompanyDetailMember[];
  workspaces: CompanyDetailWorkspace[];
  recent_audit_logs: CompanyDetailAuditLog[];

  admin_count: number;
  member_count: number;
  workspace_count: number;
  model_count: number;
};