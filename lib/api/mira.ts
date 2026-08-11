import { getApiBaseUrl } from "@/lib/api/fetch";
import {
  getCurrentAccessToken,
  getCurrentUserId,
} from "@/lib/auth/session";

const API_BASE_URL = getApiBaseUrl();

export type MiraThread = {
  id: string;
  workspace_id: string;
  model_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  scope?: "workspace" | "global" | "launchpad";
};

export type MiraMessageRole = "user" | "assistant" | "system";

export type MiraMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  summary?: string;
  insights?: string[];
  recommendations?: string[];
  visual_payload?: any;
  rows?: any[];
  metadata?: any;
  suggested_questions?: string[];
};

export type MiraVisualPayload = {
  type?: "card" | "bar" | "column" | "line" | "area" | "donut" | "table" | "matrix";
  title?: string;
  subtitle?: string;
  value?: string | number;
  data?: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
  categoryKey?: string;
  valueKey?: string;
};

export type MiraAskPayload = {
  workspace_id: string;
  model_id: string;
  user_id: string;
  thread_id?: string | null;
  question: string;
};

export type GlobalMiraAskPayload = {
  user_id: string;
  thread_id?: string | null;
  question: string;
};

export type MiraAskResponse = {
  thread_id: string;
  user_message: MiraMessage;
  assistant_message: MiraMessage;
  content?: string;
  summary?: string;
  insights?: string[];
  recommendations?: string[];
  visual_payload?: any;
  rows?: any[];
  metadata?: any;
  suggested_questions?: string[];
};

export type MiraProgressEvent = {
  event: string;
  label: string;
  detail?: string;
  phase?: string;
  progress?: number;
  sequence?: number;
  elapsed_ms?: number;
  trace_version?: string;
  receivedAt?: number;
};

export type MiraAskStreamOptions = {
  onProgress?: (event: MiraProgressEvent) => void;
  signal?: AbortSignal;
};

export type MiraActionPayload = {
  workspace_id: string;
  user_id: string;
  thread_id: string;
  message_id: string;
  title?: string;
  description?: string;
  filename?: string;
  artifact_type?: string;
};

export type MiraActionResponse = {
  success: boolean;
  data: Record<string, any>;
};

export type MiraDashboardCard = {
  id: string; workspace_id: string; title: string; description?: string;
  visual_payload: any; semantic_context?: Record<string, any>; metadata?: Record<string, any>;
  created_at?: string;
};

async function request<T>(
  path: string,
  options?: RequestInit,
  timeoutMs = 300000,
): Promise<T> {
  const controller = new AbortController();
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "user-id": userId,
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Mira request failed");
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Mira request timed out.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function requestStream<T>(
  path: string,
  body: unknown,
  options?: MiraAskStreamOptions,
): Promise<T> {
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    signal: options?.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      Authorization: `Bearer ${accessToken}`,
      "user-id": userId,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(text || "Mira request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let separatorIndex = buffer.indexOf("\n\n");

    while (separatorIndex !== -1) {
      const rawFrame = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      if (rawFrame.startsWith("data: ")) {
        const frame = JSON.parse(rawFrame.slice("data: ".length));

        if (frame.type === "progress") {
          const { type: _type, ...progress } = frame;
          options?.onProgress?.({
            ...progress,
          });
        } else if (frame.type === "result") {
          return frame.payload as T;
        } else if (frame.type === "error") {
          throw new Error(
            frame.detail || "Mira failed to answer this question.",
          );
        }
      }

      separatorIndex = buffer.indexOf("\n\n");
    }
  }

  throw new Error("Mira stream ended without a result.");
}

export async function getMiraThreads(params: {
  workspaceId: string;
  userId: string;
}): Promise<MiraThread[]> {
  const search = new URLSearchParams({
    workspace_id: params.workspaceId,
    user_id: params.userId,
  });

  const data = await request<{ threads: MiraThread[] }>(
    `/api/mira/threads?${search.toString()}`,
  );

  return data.threads;
}

export async function getGlobalMiraThreads(params: {
  userId: string;
}): Promise<MiraThread[]> {
  const search = new URLSearchParams({
    user_id: params.userId,
  });

  const data = await request<{ threads: MiraThread[] }>(
    `/api/mira/threads/global?${search.toString()}`,
  );

  return data.threads;
}

export async function createMiraThread(payload: {
  workspace_id: string;
  model_id: string;
  user_id: string;
  title?: string;
}): Promise<MiraThread> {
  return request<MiraThread>("/api/mira/threads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMiraThreadMessages(
  threadId: string,
): Promise<MiraMessage[]> {
  const data = await request<{ messages: MiraMessage[] }>(
    `/api/mira/threads/${threadId}/messages`,
  );

  return data.messages;
}

export async function deleteMiraThread(threadId: string) {
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  const response = await fetch(
    `${API_BASE_URL}/api/mira/threads/${threadId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "user-id": userId,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete Mira thread");
  }

  return response.json();
}

export async function askMira(
  payload: MiraAskPayload,
): Promise<MiraAskResponse> {
  return request<MiraAskResponse>("/api/mira/ask", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function askGlobalMira(
  payload: GlobalMiraAskPayload,
): Promise<MiraAskResponse> {
  return request<MiraAskResponse>("/api/mira/ask/global", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function askMiraStream(
  payload: MiraAskPayload,
  options?: MiraAskStreamOptions,
): Promise<MiraAskResponse> {
  return requestStream<MiraAskResponse>("/api/mira/ask", payload, options);
}

export async function askGlobalMiraStream(
  payload: GlobalMiraAskPayload,
  options?: MiraAskStreamOptions,
): Promise<MiraAskResponse> {
  return requestStream<MiraAskResponse>(
    "/api/mira/ask/global",
    payload,
    options,
  );
}

export async function saveMiraInsight(
  payload: MiraActionPayload,
): Promise<MiraActionResponse> {
  return request<MiraActionResponse>("/api/mira/actions/save-insight", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createMiraDashboardCard(
  payload: MiraActionPayload,
): Promise<MiraActionResponse> {
  return request<MiraActionResponse>("/api/mira/actions/dashboard-card", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listMiraDashboardCards(workspaceId: string): Promise<MiraDashboardCard[]> {
  const response = await request<MiraActionResponse>(`/api/mira/dashboard-cards?workspace_id=${encodeURIComponent(workspaceId)}`);
  return (response.data.cards || []) as MiraDashboardCard[];
}

export async function deleteMiraDashboardCard(workspaceId: string, cardId: string): Promise<void> {
  await request<MiraActionResponse>(`/api/mira/dashboard-cards/${cardId}?workspace_id=${encodeURIComponent(workspaceId)}`, { method: "DELETE" });
}

export async function shareMiraArtifact(
  payload: MiraActionPayload,
): Promise<MiraActionResponse> {
  return request<MiraActionResponse>("/api/mira/actions/share", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      artifact_type: payload.artifact_type || "mira_response",
    }),
  });
}

export async function exportMiraVisual(
  payload: MiraActionPayload,
): Promise<MiraActionResponse> {
  return request<MiraActionResponse>("/api/mira/actions/export-visual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function exportMiraTable(
  payload: MiraActionPayload,
): Promise<void> {
  const [accessToken, userId] = await Promise.all([
    getCurrentAccessToken(),
    getCurrentUserId(),
  ]);

  const response = await fetch(`${API_BASE_URL}/api/mira/actions/export-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "user-id": userId,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to export Mira table");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = payload.filename || "mira-table-export.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}
