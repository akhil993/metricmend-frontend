import { getApiBaseUrl } from "@/lib/api/fetch";
import {
  getCurrentAccessToken,
  getCurrentUserId,
} from "@/lib/auth/session";

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

export type BillingSummary = {
  company: {
    id: string;
    name?: string | null;
    plan?: string | null;
    subscription_status?: string | null;

    max_users?: number | null;
    max_workspaces?: number | null;

    auto_credit_top_up_enabled?: boolean;
    auto_credit_top_up_threshold?: number;
    auto_credit_top_up_amount?: number;
    monthly_credit_hard_limit?: number | null;
  };

  credits: {
    included: number;
    purchased: number;
    used: number;
    total: number;
    remaining: number;
  };
};
export type CompanyUsageSummary = {
  members: {
    used: number;
    limit: number | null;
  };

  workspaces: {
    used: number;
    limit: number | null;
  };

  mira_credits: {
    used: number;
    remaining: number;
    total: number;
  };
};

async function readBillingError(
  response: Response,
  fallbackMessage: string
) {
  const error = await response.json().catch(() => null);

  if (
    error &&
    typeof error === "object" &&
    "detail" in error &&
    typeof error.detail === "string"
  ) {
    return error.detail;
  }

  return fallbackMessage;
}

export async function getMyBilling(): Promise<BillingSummary> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${getApiBaseUrl()}/api/billing/me`,
    {
      headers: authHeaders,
    }
  );

  if (!response.ok) {
    throw new Error(
      await readBillingError(
        response,
        "Failed to load billing."
      )
    );
  }

  return response.json();
}

export async function createCreditPurchase({
  company_id,
  credits,
}: {
  company_id: string;
  credits: number;
}) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${getApiBaseUrl()}/api/billing/purchase-credits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        company_id,
        credits,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readBillingError(
        response,
        "Failed to purchase credits."
      )
    );
  }

  return response.json();
}

export async function updateAutoCredits({
  companyId,
  auto_credit_top_up_enabled,
  auto_credit_top_up_threshold,
  auto_credit_top_up_amount,
  monthly_credit_hard_limit,
}: {
  companyId: string;
  auto_credit_top_up_enabled: boolean;
  auto_credit_top_up_threshold: number;
  auto_credit_top_up_amount: number;
  monthly_credit_hard_limit?: number | null;
}) {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(
    `${getApiBaseUrl()}/api/billing/auto-credits/${companyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        auto_credit_top_up_enabled,
        auto_credit_top_up_threshold,
        auto_credit_top_up_amount,
        monthly_credit_hard_limit,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      await readBillingError(
        response,
        "Failed to update auto credits."
      )
    );
  }

  return response.json();
}

export async function getCompanyUsageSummary(): Promise<CompanyUsageSummary> {
  const billing = await getMyBilling();

  return {
    members: {
      used: billing.company.max_users ?? 0,
      limit: billing.company.max_users ?? null,
    },

    workspaces: {
      used: billing.company.max_workspaces ?? 0,
      limit: billing.company.max_workspaces ?? null,
    },

    mira_credits: {
      used: billing.credits.used,
      remaining: billing.credits.remaining,
      total: billing.credits.total,
    },
  };
}
