import type { InternalAuditLog } from "@/components/internal/metricmend/audit/types";

export type InternalCompanyAdmin = {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "admin" | "editor" | "member" | "viewer";
  status: string;
  created_at?: string | null;
  profiles?: {
    id: string;
    email?: string | null;
    full_name?: string | null;
  } | null;
};

export type InternalCompany = {
  id: string;
  name?: string | null;
  company_name?: string | null;
  status?: string | null;
  plan?: string | null;
  created_at?: string | null;
  admins?: InternalCompanyAdmin[];
  admin_count?: number;
};

export async function getInternalAuditLogs(
  userId: string
): Promise<InternalAuditLog[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/metricmend/audit-logs`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("FAILED_TO_LOAD_AUDIT_LOGS");
  }

  const data = await response.json();

  return data.items || [];
}

export type InternalUserSearchResult = {
  id: string;
  email?: string | null;
  full_name?: string | null;
};
export async function searchInternalUsers({
  authUserId,
  search,
}: {
  authUserId: string;
  search: string;
}): Promise<InternalUserSearchResult[]> {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/users/search?q=${encodeURIComponent(
      search
    )}`,
    {
      headers: {
        "user-id": authUserId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search users");
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export async function getMetricMendAdminMe(userId: string) {
  const baseUrl = apiBaseUrl();

  if (!baseUrl || !userId) {
    return { is_metricmend_admin: false, profile: null };
  }

  try {
    const response = await fetch(`${baseUrl}/api/admin/metricmend/me`, {
      headers: {
        "user-id": userId,
      },
    });

    if (response.status === 403) {
      return { is_metricmend_admin: false, profile: null };
    }

    if (!response.ok) {
      return { is_metricmend_admin: false, profile: null };
    }

    return response.json();
  } catch {
    return { is_metricmend_admin: false, profile: null };
  }
}

export async function getInternalCompanies(userId: string) {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/companies`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("Failed to load internal companies");
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

export async function assignCompanyAdmin({
  authUserId,
  companyId,
  userId,
  role,
}: {
  authUserId: string;
  companyId: string;
  userId: string;
  role: "owner" | "admin";
}) {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/companies/${companyId}/admins`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": authUserId,
      },
      body: JSON.stringify({
        user_id: userId,
        role,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to assign company admin");
  }

  return response.json();
}

export async function removeCompanyAdmin({
  authUserId,
  companyId,
  adminUserId,
}: {
  authUserId: string;
  companyId: string;
  adminUserId: string;
}) {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/companies/${companyId}/admins/${adminUserId}`,
    {
      method: "DELETE",
      headers: {
        "user-id": authUserId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to remove company admin");
  }

  return response.json();
}
export type MetricMendOverview = {
  company_count: number;
  user_count: number;
  mira_query_count: number;
  failed_request_count: number;
};

const emptyOverview: MetricMendOverview = {
  company_count: 0,
  user_count: 0,
  mira_query_count: 0,
  failed_request_count: 0,
};

export async function getMetricMendOverview(
  userId: string
): Promise<MetricMendOverview> {
  const baseUrl = apiBaseUrl();

  if (!baseUrl || !userId) {
    return emptyOverview;
  }

  try {
    const response = await fetch(`${baseUrl}/api/admin/metricmend/overview`, {
      headers: {
        "user-id": userId,
      },
    });

    if (response.status === 403) {
      throw new Error("FORBIDDEN");
    }

    if (!response.ok) {
      console.error("MetricMend overview failed:", response.status);
      return emptyOverview;
    }

    return response.json();
  } catch (error) {
    console.error("MetricMend overview fetch failed:", error);
    return emptyOverview;
  }
}

export type InternalUserCompanyMembership = {
  id: string;
  company_id: string;
  user_id: string;
  role?: string | null;
  status?: string | null;
  companies?: {
    id?: string;
    name?: string | null;
  } | null;
};

export type InternalUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  is_metricmend_admin?: boolean | null;
  created_at?: string | null;
  companies?: InternalUserCompanyMembership[];
  company_count?: number;
};

export async function getInternalUsers(
  userId: string
): Promise<InternalUser[]> {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/users`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("Failed to load internal users");
  }

  const data = await response.json();

  return Array.isArray(data?.items) ? data.items : [];
}
export type InternalUsageItem = {
  company_id: string;
  company_name?: string | null;
  active_users?: number;
  query_count?: number;
  failed_count?: number;
  avg_execution_ms?: number;
  last_activity_at?: string | null;
};

export async function getInternalUsage(
  userId: string
): Promise<InternalUsageItem[]> {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/usage`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("Failed to load internal usage");
  }

  const data = await response.json();

  return Array.isArray(data?.items) ? data.items : [];
}

export type InternalSystemHealthService = {
  name: string;
  status: "healthy" | "degraded" | "error" | string;
  description?: string | null;
};

export type InternalSystemHealth = {
  overall_status: "healthy" | "degraded" | "error" | string;
  services: InternalSystemHealthService[];
};

export async function getInternalSystemHealth(
  userId: string
): Promise<InternalSystemHealth> {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/system-health`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("Failed to load system health");
  }

  return response.json();

}
export async function createInternalCompany(
  userId: string,
  payload: {
    name: string;
    slug?: string | null;
  }
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/metricmend/companies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("FAILED_TO_CREATE_COMPANY");
  }

  return response.json();
}

export type InternalCompanyDetailMember = {
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

export type InternalCompanyDetail = {
  id: string;
  name?: string | null;
  company_name?: string | null;
  slug?: string | null;
  status?: string | null;
  plan?: string | null;
  created_at?: string | null;
  admins: InternalCompanyDetailMember[];
  members: InternalCompanyDetailMember[];
  admin_count: number;
  member_count: number;
  workspace_count: number;
    workspaces: {
    id: string;
    name?: string | null;
    created_at?: string | null;
  }[];

  recent_audit_logs: {
    id: string;
    actor_user_id?: string | null;
    action: string;
    entity_type: string;
    entity_id: string;
    metadata?: Record<string, unknown>;
    created_at?: string | null;
  }[];

  model_count: number;
};

export async function getInternalCompanyDetail(
  userId: string,
  companyId: string
): Promise<InternalCompanyDetail> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/metricmend/companies/${companyId}`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }

  if (!response.ok) {
    throw new Error("FAILED_TO_LOAD_COMPANY_DETAIL");
  }

  const data = await response.json();

  return data.item;
}
export type InternalCompanyPlan = {
  id: string;
  name?: string | null;
  slug?: string | null;
  plan: "free_trial" | "team" | "business" | "enterprise";
  company_type: "self_serve" | "sales_led" | "enterprise" | "internal" | string;
  subscription_status:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "suspended"
    | string;
  max_users: number;
  max_workspaces: number;
  max_builders?: number | null;
  monthly_mira_credits: number;
  purchased_mira_credits: number;
  created_at?: string | null;
};

export type UpdateCompanyPlanPayload = {
  plan?: InternalCompanyPlan["plan"];
  company_type?: string;
  subscription_status?: string;
  max_users?: number;
  max_workspaces?: number;
  max_builders?: number;
  monthly_mira_credits?: number;
  purchased_mira_credits?: number;
};

export async function getInternalCompanyPlans(
  userId: string
): Promise<InternalCompanyPlan[]> {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/company-plans`,
    {
      headers: {
        "user-id": userId,
      },
      cache: "no-store",
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("FAILED_TO_LOAD_COMPANY_PLANS");
  }

  const data = await response.json();

  return Array.isArray(data?.items) ? data.items : [];
}

export async function updateInternalCompanyPlan({
  userId,
  companyId,
  payload,
}: {
  userId: string;
  companyId: string;
  payload: UpdateCompanyPlanPayload;
}) {
  const response = await fetch(
    `${apiBaseUrl()}/api/admin/metricmend/company-plans/${companyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (response.status === 403) {
    throw new Error("FORBIDDEN");
  }

  if (!response.ok) {
    throw new Error("FAILED_TO_UPDATE_COMPANY_PLAN");
  }

  return response.json();
}