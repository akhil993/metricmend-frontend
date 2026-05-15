const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000";

export type CompanyMemberRole =
  | "owner"
  | "admin"
  | "editor"
  | "member"
  | "viewer";

export type AssignableCompanyMemberRole =
  | "admin"
  | "editor"
  | "member"
  | "viewer";

export type CompanyMember = {
  id: string;
  company_id: string;
  user_id: string;
  role: CompanyMemberRole;
  status: string;
  created_at: string;

  profiles?: {
    id: string;
    email?: string;
    full_name?: string;
  };
};

async function readApiError(
  response: Response,
  fallbackMessage: string
): Promise<never> {
  const error = await response.json().catch(() => null);

  throw new Error(error?.detail ?? fallbackMessage);
}

export async function listCompanyMembers(
  companyId: string,
  userId: string
): Promise<CompanyMember[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/company-members/company/${companyId}`,
    {
      headers: {
        "user-id": userId,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return readApiError(
      response,
      "Failed to load company members."
    );
  }

  const data = await response.json();

  return data.items ?? [];
}

export async function inviteCompanyMember(
  payload: {
    company_id: string;
    user_id: string;
    role: AssignableCompanyMemberRole;
  },
  currentUserId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/company-members/invite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": currentUserId,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    return readApiError(
      response,
      "Failed to invite member."
    );
  }

  return response.json();
}

export async function inviteCompanyMemberByEmail(
  payload: {
    company_id: string;
    email: string;
    role: AssignableCompanyMemberRole;
  },
  currentUserId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/company-members/invite-by-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": currentUserId,
      },
      body: JSON.stringify({
        ...payload,
        email: payload.email.trim().toLowerCase(),
      }),
    }
  );

  if (!response.ok) {
    return readApiError(
      response,
      "Failed to invite member."
    );
  }

  return response.json();
}

export async function updateCompanyMemberRole(
  memberId: string,
  role: AssignableCompanyMemberRole,
  currentUserId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/company-members/${memberId}/role`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "user-id": currentUserId,
      },
      body: JSON.stringify({ role }),
    }
  );

  if (!response.ok) {
    return readApiError(
      response,
      "Failed to update role."
    );
  }

  return response.json();
}

export async function removeCompanyMember(
  memberId: string,
  currentUserId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/api/company-members/${memberId}`,
    {
      method: "DELETE",
      headers: {
        "user-id": currentUserId,
      },
    }
  );

  if (!response.ok) {
    return readApiError(
      response,
      "Failed to remove member."
    );
  }

  return response.json();
}