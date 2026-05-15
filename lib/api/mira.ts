const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type MiraThread = {
  id: string;
  workspace_id: string;
  model_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
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
  metadata?: {
    query_type?: string;
    metric?: string;
    dimension?: string;
    date_grain?: string;
    time_period?: string;
    format_type?: string;
    row_count?: number;
    is_governed?: boolean;
  };
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
  metadata?: MiraMessage["metadata"];
  suggested_questions?: string[];
};


async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Mira request failed");
  }

  return response.json();
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
  const response = await fetch(
    `${API_BASE_URL}/api/mira/threads/${threadId}`,
    {
      method: "DELETE",
    }
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