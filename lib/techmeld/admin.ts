import type {
  TechMeldContentStatus,
  TechMeldEventStatus,
  TechMeldSubmissionStatus,
} from "@/types/techmeld";
import { getServiceSupabaseClient } from "./supabase/service-client";

export interface AdminResult {
  ok: boolean;
  error?: string;
}

function requireServiceClient() {
  const client = getServiceSupabaseClient();
  if (!client) {
    throw new Error("Supabase service client is not configured (missing env vars)");
  }
  return client;
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export async function setArticleStatus(
  id: string,
  status: TechMeldContentStatus
): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_articles").update({ status }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function setArticleFeatured(id: string, featured: boolean): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_articles").update({ featured }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export interface ArticleEditableFields {
  summary?: string;
  category?: string;
  tags?: string[];
}

export async function editArticle(id: string, fields: ArticleEditableFields): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_articles").update(fields).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function listPendingArticles(limit = 50) {
  const client = requireServiceClient();
  const { data } = await client
    .from("techmeld_articles")
    .select("*")
    .eq("status", "pending")
    .order("discovered_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function setEventStatus(id: string, status: TechMeldEventStatus): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_events").update({ status }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function setEventFeatured(id: string, featured: boolean): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_events").update({ featured }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export interface EventEditableFields {
  description?: string;
  category?: string;
  tags?: string[];
}

export async function editEvent(id: string, fields: EventEditableFields): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_events").update(fields).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function listPendingEvents(limit = 50) {
  const client = requireServiceClient();
  const { data } = await client
    .from("techmeld_events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export async function setSourceEnabled(id: string, enabled: boolean): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client.from("techmeld_sources").update({ enabled }).eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function listSources() {
  const client = requireServiceClient();
  const { data } = await client.from("techmeld_sources").select("*").order("name", { ascending: true });
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Editorial submissions
// ---------------------------------------------------------------------------

export async function reviewSubmission(
  id: string,
  status: TechMeldSubmissionStatus
): Promise<AdminResult> {
  const client = requireServiceClient();
  const { error } = await client
    .from("techmeld_editorial_submissions")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function listPendingSubmissions(limit = 50) {
  const client = requireServiceClient();
  const { data } = await client
    .from("techmeld_editorial_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Ingestion visibility
// ---------------------------------------------------------------------------

export async function listRecentIngestionRuns(limit = 50) {
  const client = requireServiceClient();
  const { data } = await client
    .from("techmeld_ingestion_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
