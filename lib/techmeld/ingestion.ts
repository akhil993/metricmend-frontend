import type { SupabaseClient } from "@supabase/supabase-js";
import type { TechMeldSourceRow } from "@/types/techmeld";
import { fetchSourceText } from "./fetch-source";
import { normalizeArticle, type NormalizedArticle } from "./normalize-article";
import { parseFeedXml } from "./parse-rss";
import { getServiceSupabaseClient } from "./supabase/service-client";

const MAX_ITEMS_PER_SOURCE = 40;
const STALE_RUN_MINUTES = 15;
const SOURCE_CONCURRENCY = 5;

export interface SourceIngestionResult {
  sourceId: string;
  sourceName: string;
  status: "success" | "partial" | "failed";
  itemsFound: number;
  itemsCreated: number;
  itemsUpdated: number;
  errorMessage: string | null;
}

export interface IngestionSummary {
  startedAt: string;
  completedAt: string;
  sourcesProcessed: number;
  sourcesSkipped: number;
  results: SourceIngestionResult[];
}

/** Fetches every enabled RSS/Atom source, normalizes, dedupes, and stores new/updated articles. Per-source and per-item failures never abort the run. */
export async function runIngestion(): Promise<IngestionSummary> {
  const startedAt = new Date().toISOString();
  const client = getServiceSupabaseClient();

  if (!client) {
    return { startedAt, completedAt: new Date().toISOString(), sourcesProcessed: 0, sourcesSkipped: 0, results: [] };
  }

  const supabase = client;

  const { data: sources, error } = await supabase
    .from("techmeld_sources")
    .select("*")
    .eq("enabled", true)
    .in("source_type", ["rss", "atom"])
    .not("feed_url", "is", null);

  if (error || !sources) {
    return { startedAt, completedAt: new Date().toISOString(), sourcesProcessed: 0, sourcesSkipped: 0, results: [] };
  }

  const results: SourceIngestionResult[] = [];
  let sourcesSkipped = 0;

  // Sources are fetched with bounded concurrency (not all-at-once, not fully
  // sequential) so a 20-source run finishes well within a serverless
  // function's execution limit instead of summing every source's latency.
  const queue = [...(sources as TechMeldSourceRow[])];

  async function worker() {
    for (;;) {
      const source = queue.shift();
      if (!source) return;

      const busy = await hasRecentRunningRun(supabase, source.id);
      if (busy) {
        sourcesSkipped += 1;
        continue;
      }
      results.push(await ingestSource(supabase, source));
    }
  }

  const workerCount = Math.min(SOURCE_CONCURRENCY, queue.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return {
    startedAt,
    completedAt: new Date().toISOString(),
    sourcesProcessed: results.length,
    sourcesSkipped,
    results,
  };
}

async function hasRecentRunningRun(client: SupabaseClient, sourceId: string): Promise<boolean> {
  const staleBefore = new Date(Date.now() - STALE_RUN_MINUTES * 60_000).toISOString();
  const { data } = await client
    .from("techmeld_ingestion_runs")
    .select("id")
    .eq("source_id", sourceId)
    .eq("status", "running")
    .gt("started_at", staleBefore)
    .limit(1);
  return Boolean(data && data.length > 0);
}

async function ingestSource(
  client: SupabaseClient,
  source: TechMeldSourceRow
): Promise<SourceIngestionResult> {
  const { data: runRow } = await client
    .from("techmeld_ingestion_runs")
    .insert({ source_id: source.id, status: "running" })
    .select("id")
    .single();
  const runId: string | undefined = runRow?.id;

  let itemsFound = 0;
  let itemsCreated = 0;
  let itemsUpdated = 0;

  try {
    if (!source.feed_url) throw new Error("Source has no feed_url configured");

    const fetched = await fetchSourceText(source.feed_url);
    if (!fetched.ok || !fetched.body) {
      throw new Error(fetched.error ?? "Fetch failed");
    }

    const parsed = await parseFeedXml(fetched.body);
    const items = parsed.items.slice(0, MAX_ITEMS_PER_SOURCE);
    itemsFound = items.length;

    for (const item of items) {
      try {
        const normalized = normalizeArticle(item, source);
        if (!normalized) continue;

        const outcome = await upsertArticle(client, normalized);
        if (outcome === "created") itemsCreated += 1;
        if (outcome === "updated") itemsUpdated += 1;
      } catch {
        // A single malformed item never aborts the source's run.
      }
    }

    await client
      .from("techmeld_sources")
      .update({
        last_checked_at: new Date().toISOString(),
        last_success_at: new Date().toISOString(),
      })
      .eq("id", source.id);

    if (runId) {
      await client
        .from("techmeld_ingestion_runs")
        .update({
          completed_at: new Date().toISOString(),
          status: "success",
          items_found: itemsFound,
          items_created: itemsCreated,
          items_updated: itemsUpdated,
        })
        .eq("id", runId);
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      status: "success",
      itemsFound,
      itemsCreated,
      itemsUpdated,
      errorMessage: null,
    };
  } catch (caughtError) {
    const errorMessage = caughtError instanceof Error ? caughtError.message : "Unknown ingestion error";
    const status = itemsCreated > 0 || itemsUpdated > 0 ? "partial" : "failed";

    await client
      .from("techmeld_sources")
      .update({ last_checked_at: new Date().toISOString() })
      .eq("id", source.id);

    if (runId) {
      await client
        .from("techmeld_ingestion_runs")
        .update({
          completed_at: new Date().toISOString(),
          status,
          items_found: itemsFound,
          items_created: itemsCreated,
          items_updated: itemsUpdated,
          error_message: errorMessage,
        })
        .eq("id", runId);
    }

    return {
      sourceId: source.id,
      sourceName: source.name,
      status,
      itemsFound,
      itemsCreated,
      itemsUpdated,
      errorMessage,
    };
  }
}

async function findExistingArticleId(
  client: SupabaseClient,
  article: NormalizedArticle
): Promise<string | null> {
  if (article.external_id) {
    const { data } = await client
      .from("techmeld_articles")
      .select("id")
      .eq("source_id", article.source_id)
      .eq("external_id", article.external_id)
      .limit(1)
      .maybeSingle();
    if (data?.id) return data.id;
  }

  const { data: byUrl } = await client
    .from("techmeld_articles")
    .select("id")
    .eq("canonical_url", article.canonical_url)
    .limit(1)
    .maybeSingle();

  return byUrl?.id ?? null;
}

async function upsertArticle(
  client: SupabaseClient,
  article: NormalizedArticle
): Promise<"created" | "updated" | "skipped"> {
  const existingId = await findExistingArticleId(client, article);

  if (existingId) {
    const { error } = await client
      .from("techmeld_articles")
      .update({
        title: article.title,
        summary: article.summary,
        why_it_matters: article.why_it_matters,
        publisher: article.publisher,
        article_language: article.article_language,
        summary_method: article.summary_method,
        tags: article.tags,
        image_url: null,
        image_rights_status: article.image_rights_status,
        author: article.author,
      })
      .eq("id", existingId);
    return error ? "skipped" : "updated";
  }

  const { error } = await client.from("techmeld_articles").insert(article);
  if (!error) return "created";

  // Rare slug collision: retry once with a short unique suffix.
  if (error.code === "23505") {
    const suffix = globalThis.crypto?.randomUUID?.().slice(0, 6) ?? Math.random().toString(36).slice(2, 8);
    const retry = await client
      .from("techmeld_articles")
      .insert({ ...article, slug: `${article.slug}-${suffix}` });
    if (!retry.error) return "created";
  }

  return "skipped";
}
