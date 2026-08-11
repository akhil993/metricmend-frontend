import { createClient } from "@/lib/supabase/client";
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const supabase = createClient(); const { data } = await supabase.auth.getSession();
  const user = data.session?.user; if (!user) throw new Error("Sign in required.");
  const response = await fetch(`${API}${path}`, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token}`, "user-id": user.id, ...(init?.headers || {}) } });
  if (!response.ok) throw new Error(await response.text() || "InsightMend request failed.");
  return response.json();
}

export type Phase2Kind = "decisions" | "proposals" | "agents" | "reviews";
export function listPhase2(kind: Phase2Kind, workspaceId: string) { return call<any[]>(`/api/insightmend/${kind}?workspace_id=${workspaceId}`); }
export function createDecision(payload: Record<string, any>) { return call<any>("/api/insightmend/decisions", { method: "POST", body: JSON.stringify(payload) }); }
export function updateDecision(id: string, payload: Record<string, any>) { return call<any>(`/api/insightmend/decisions/${id}`, { method: "PATCH", body: JSON.stringify(payload) }); }
export function createProposal(payload: Record<string, any>) { return call<any>("/api/insightmend/proposals", { method: "POST", body: JSON.stringify(payload) }); }
export function reviewProposal(id: string, status: "approved" | "rejected") { return call<any>(`/api/insightmend/proposals/${id}/review`, { method: "POST", body: JSON.stringify({ status }) }); }
export function createAgent(payload: Record<string, any>) { return call<any>("/api/insightmend/agents", { method: "POST", body: JSON.stringify(payload) }); }
export function evaluateAgent(id: string, current_value: number, previous_value?: number) { return call<any>(`/api/insightmend/agents/${id}/evaluate`, { method: "POST", body: JSON.stringify({ current_value, previous_value }) }); }
export function createBusinessReview(payload: Record<string, any>) { return call<any>("/api/insightmend/reviews", { method: "POST", body: JSON.stringify(payload) }); }
