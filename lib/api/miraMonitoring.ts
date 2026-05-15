import type {
  CompanyChat,
  RecentQuery,
  SummaryResponse,
  ThreadInspector,
} from "@/components/admin/mira-monitoring/types";
import { unwrapArray } from "@/components/admin/mira-monitoring/utils";
import { createClient } from "@/lib/supabase/client";

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return apiBaseUrl;
}

async function getCurrentUserId() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("You must be signed in to view Mira monitoring.");
  }

  return user.id;
}

async function fetchJson(url: string) {
  const userId = await getCurrentUserId();

  const response = await fetch(url, {
    headers: {
      "user-id": userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${url}`);
  }

  return response.json();
}

export async function getMiraMonitoringSummary(): Promise<SummaryResponse> {
  return fetchJson(`${getApiBaseUrl()}/api/mira/monitoring/summary`);
}

export async function getMiraCompanyChats(): Promise<CompanyChat[]> {
  const data = await fetchJson(
    `${getApiBaseUrl()}/api/mira/monitoring/company-chats`
  );

  return unwrapArray<CompanyChat>(data, [
    "items",
    "company_chats",
    "threads",
    "chats",
  ]);
}

export async function getMiraFailures(): Promise<RecentQuery[]> {
  const data = await fetchJson(
    `${getApiBaseUrl()}/api/mira/monitoring/failures`
  );

  return unwrapArray<RecentQuery>(data, [
    "items",
    "failures",
    "queries",
    "logs",
  ]);
}

export async function getMiraRecentQueries(): Promise<RecentQuery[]> {
  const data = await fetchJson(
    `${getApiBaseUrl()}/api/mira/monitoring/recent-queries`
  );

  return unwrapArray<RecentQuery>(data, [
    "items",
    "recent_queries",
    "queries",
    "logs",
  ]);
}

export async function getMiraThreadInspector(
  threadId: string
): Promise<ThreadInspector> {
  const data = await fetchJson(
    `${getApiBaseUrl()}/api/mira/monitoring/company-chats/${threadId}`
  );

  return {
    thread: data.thread ?? data.chat ?? null,
    messages: Array.isArray(data.messages) ? data.messages : [],
    audit_logs: unwrapArray<RecentQuery>(data.audit_logs ?? data, [
      "audit_logs",
      "logs",
      "queries",
    ]),
  };
}

export async function deleteMiraThread(threadId: string) {
  const userId = await getCurrentUserId();

  const response = await fetch(
    `${getApiBaseUrl()}/api/mira/monitoring/company-chats/${threadId}`,
    {
      method: "DELETE",
      headers: {
        "user-id": userId,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete thread");
  }
}