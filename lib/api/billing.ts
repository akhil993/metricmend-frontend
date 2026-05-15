import { createClient } from "@/lib/supabase/client";

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

async function getAuthUserId() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id;
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
export async function getMyBilling(): Promise<BillingSummary> {
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(
    `${apiBaseUrl()}/api/billing/me`,
    {
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("FAILED_TO_LOAD_BILLING");
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
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(
    `${apiBaseUrl()}/api/billing/purchase-credits`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
      },
      body: JSON.stringify({
        company_id,
        credits,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("FAILED_TO_PURCHASE_CREDITS");
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
  const userId = await getAuthUserId();

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(
    `${apiBaseUrl()}/api/billing/auto-credits/${companyId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "user-id": userId,
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
    throw new Error("FAILED_TO_UPDATE_AUTO_CREDITS");
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