import type {
  TechMeldArticle,
  TechMeldArticleRow,
  TechMeldEvent,
  TechMeldEventRow,
  TechMeldLearningResource,
  TechMeldLearningResourceRow,
  TechMeldTool,
  TechMeldToolRow,
} from "@/types/techmeld";
import { formatArticleDate, formatEventDate, getEventRegistrationBadge, isEventExpired } from "./format";
import { sanitizeSearchTerm } from "./sanitize";
import { getPublicSupabaseClient } from "./supabase/public-client";

const DEFAULT_PAGE_SIZE = 12;

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

function emptyPage<T>(page: number, pageSize: number): PaginatedResult<T> {
  return { items: [], total: 0, page, pageSize, hasMore: false };
}

// ---------------------------------------------------------------------------
// View-model mappers
// ---------------------------------------------------------------------------

function toArticleViewModel(row: TechMeldArticleRow): TechMeldArticle {
  const effectivePublishedAt = (row as TechMeldArticleRow & { effective_published_at?: string }).effective_published_at ?? row.published_at;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    canonicalUrl: row.canonical_url,
    category: row.category,
    publishedAt: effectivePublishedAt,
    publishedDateLabel: formatArticleDate(effectivePublishedAt),
    summary: row.summary,
    whyItMatters: row.why_it_matters,
    publisher: row.publisher ?? row.source_name,
    language: row.article_language ?? "en",
    summaryMethod: row.summary_method ?? "metadata_template",
    tags: row.tags ?? [],
    imageUrl: row.image_rights_status === "licensed" || row.image_rights_status === "publisher_permitted" || row.image_rights_status === "original" ? row.image_url : null,
    author: row.author,
    featured: row.featured,
    relatedProduct: row.related_product,
  };
}

function toEventViewModel(row: TechMeldEventRow): TechMeldEvent {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    organizer: row.organizer,
    sourceUrl: row.source_url,
    registrationUrl: row.registration_url,
    registrationOpenAt: row.registration_open_at,
    registrationCloseAt: row.registration_close_at,
    registrationBadge: getEventRegistrationBadge(row),
    category: row.category,
    eventType: row.event_type ?? "event",
    description: row.description,
    startAt: row.start_at,
    startDateLabel: formatEventDate(row.start_at, row.timezone),
    endAt: row.end_at,
    timezone: row.timezone,
    city: row.city,
    region: row.region,
    country: row.country,
    venue: row.venue,
    format: row.format,
    costType: row.cost_type,
    priceText: row.price_text,
    tags: row.tags ?? [],
    featured: row.featured,
    status: row.status,
    isExpired: isEventExpired(row),
  };
}

function toToolViewModel(row: TechMeldToolRow): TechMeldTool {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    company: row.company,
    category: row.category,
    description: row.description,
    websiteUrl: row.website_url,
    pricingType: row.pricing_type,
    tags: row.tags ?? [],
    featured: row.featured,
  };
}

function toLearningViewModel(row: TechMeldLearningResourceRow): TechMeldLearningResource {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    provider: row.provider,
    category: row.category,
    description: row.description,
    resourceUrl: row.source_url,
    accessType: row.access_type,
    certification: row.certification,
    tags: row.tags ?? [],
    featured: row.featured,
  };
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export interface ArticleListFilters {
  category?: string;
  sourceName?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export async function getLatestArticles(
  filters: ArticleListFilters = {}
): Promise<PaginatedResult<TechMeldArticle>> {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const client = getPublicSupabaseClient();
  if (!client) return emptyPage(page, pageSize);

  let query = client.from("active_news").select("*", { count: "exact" });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.sourceName) query = query.eq("source_name", filters.sourceName);
  if (filters.q) {
    const term = sanitizeSearchTerm(filters.q);
    if (term) query = query.or(`title.ilike.%${term}%,summary.ilike.%${term}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query
    .order("effective_published_at", { ascending: false, nullsFirst: false })
    .range(from, to);

  if (error || !data) return emptyPage(page, pageSize);

  return {
    items: data.map(toArticleViewModel),
    total: count ?? data.length,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  };
}

export async function getFeaturedArticle(): Promise<TechMeldArticle | null> {
  const client = getPublicSupabaseClient();
  if (!client) return null;

  const { data: featured } = await client
    .from("active_news")
    .select("*")
    .eq("featured", true)
    .order("effective_published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (featured) return toArticleViewModel(featured);

  const { data: latest } = await client
    .from("active_news")
    .select("*")
    .order("effective_published_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  return latest ? toArticleViewModel(latest) : null;
}

export async function getArticleBySlug(slug: string): Promise<TechMeldArticle | null> {
  const client = getPublicSupabaseClient();
  if (!client) return null;

  const { data } = await client
    .from("active_news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data ? toArticleViewModel(data) : null;
}

export async function getRelatedArticles(
  article: TechMeldArticle,
  limit = 3
): Promise<TechMeldArticle[]> {
  const client = getPublicSupabaseClient();
  if (!client) return [];

  const { data } = await client
    .from("active_news")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("effective_published_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  return (data ?? []).map(toArticleViewModel);
}

export async function getDistinctArticleSources(): Promise<string[]> {
  const client = getPublicSupabaseClient();
  if (!client) return [];

  const { data } = await client
    .from("active_news")
    .select("source_name")
    .limit(500);

  return Array.from(new Set((data ?? []).map((row) => row.source_name))).sort();
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export interface EventListFilters {
  category?: string;
  eventTypes?: Array<"event" | "conference" | "webinar" | "workshop" | "meetup" | "hackathon" | "community">;
  format?: "virtual" | "in_person" | "hybrid";
  costType?: "free" | "paid";
  q?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export async function getUpcomingEvents(
  filters: EventListFilters = {}
): Promise<PaginatedResult<TechMeldEvent>> {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const client = getPublicSupabaseClient();
  if (!client) return emptyPage(page, pageSize);

  let query = client.from("actionable_events").select("*", { count: "exact" });

  if (filters.dateFrom) query = query.gte("start_at", filters.dateFrom);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.eventTypes?.length) query = query.in("event_type", filters.eventTypes);
  if (filters.format) query = query.eq("format", filters.format);
  if (filters.costType) query = query.eq("cost_type", filters.costType);
  if (filters.dateTo) query = query.lte("start_at", filters.dateTo);
  if (filters.location) {
    const term = sanitizeSearchTerm(filters.location);
    if (term) query = query.or(`city.ilike.%${term}%,region.ilike.%${term}%,country.ilike.%${term}%`);
  }
  if (filters.q) {
    const term = sanitizeSearchTerm(filters.q);
    if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query
    .order("action_priority", { ascending: true })
    .order("actionable_at", { ascending: true })
    .order("start_at", { ascending: true })
    .range(from, to);

  if (error || !data) return emptyPage(page, pageSize);

  return {
    items: data.map(toEventViewModel),
    total: count ?? data.length,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  };
}

export async function getFeaturedEvents(limit = 3): Promise<TechMeldEvent[]> {
  const client = getPublicSupabaseClient();
  if (!client) return [];

  const { data } = await client
    .from("actionable_events")
    .select("*")
    .eq("featured", true)
    .order("action_priority", { ascending: true })
    .order("actionable_at", { ascending: true })
    .limit(limit);

  return (data ?? []).map(toEventViewModel);
}

/** Detail-page lookup: also returns cancelled/completed events (RLS allows it) so a direct link never 404s just because the event happened or was called off. */
export async function getEventBySlug(slug: string): Promise<TechMeldEvent | null> {
  const client = getPublicSupabaseClient();
  if (!client) return null;

  const { data } = await client
    .from("actionable_events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data ? toEventViewModel(data) : null;
}

export async function getRelatedEvents(event: TechMeldEvent, limit = 3): Promise<TechMeldEvent[]> {
  const client = getPublicSupabaseClient();
  if (!client) return [];

  const { data } = await client
    .from("actionable_events")
    .select("*")
    .eq("category", event.category)
    .neq("id", event.id)
    .order("action_priority", { ascending: true })
    .order("actionable_at", { ascending: true })
    .limit(limit);

  return (data ?? []).map(toEventViewModel);
}

// ---------------------------------------------------------------------------
// Learning resources
// ---------------------------------------------------------------------------

export interface LearningResourceFilters {
  accessType?: "free" | "paid";
  certification?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function getLearningResources(
  filters: LearningResourceFilters = {}
): Promise<PaginatedResult<TechMeldLearningResource>> {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const client = getPublicSupabaseClient();
  if (!client) return emptyPage(page, pageSize);

  let query = client
    .from("techmeld_learning_resources")
    .select("*", { count: "exact" })
    .eq("status", "approved");

  if (filters.accessType) query = query.eq("access_type", filters.accessType);
  if (typeof filters.certification === "boolean") query = query.eq("certification", filters.certification);
  if (filters.category) query = query.eq("category", filters.category);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) return emptyPage(page, pageSize);

  return {
    items: data.map(toLearningViewModel),
    total: count ?? data.length,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  };
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

export interface ToolFilters {
  pricingType?: "free" | "freemium" | "paid";
  category?: string;
  page?: number;
  pageSize?: number;
}

export async function getFeaturedTools(
  filters: ToolFilters = {}
): Promise<PaginatedResult<TechMeldTool>> {
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const client = getPublicSupabaseClient();
  if (!client) return emptyPage(page, pageSize);

  let query = client
    .from("techmeld_tools")
    .select("*", { count: "exact" })
    .eq("status", "approved");

  if (filters.pricingType) query = query.eq("pricing_type", filters.pricingType);
  if (filters.category) query = query.eq("category", filters.category);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, count, error } = await query
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) return emptyPage(page, pageSize);

  return {
    items: data.map(toToolViewModel),
    total: count ?? data.length,
    page,
    pageSize,
    hasMore: (count ?? 0) > page * pageSize,
  };
}

// ---------------------------------------------------------------------------
// Category counts + site status (homepage "live-content status" strip)
// ---------------------------------------------------------------------------

export interface TechMeldCategoryCounts {
  aiNews: number;
  releases: number;
  events: number;
  learning: number;
  tools: number;
  community: number;
}

export async function getTechMeldCategoryCounts(): Promise<TechMeldCategoryCounts> {
  const empty: TechMeldCategoryCounts = {
    aiNews: 0,
    releases: 0,
    events: 0,
    learning: 0,
    tools: 0,
    community: 0,
  };

  const client = getPublicSupabaseClient();
  if (!client) return empty;

  const [aiNews, releases, events, learning, tools, community] = await Promise.all([
    client.from("active_news").select("id", { count: "exact", head: true }).eq("category", "ai-news"),
    client.from("active_news").select("id", { count: "exact", head: true }).eq("category", "releases"),
    client.from("actionable_events").select("id", { count: "exact", head: true }),
    client.from("techmeld_learning_resources").select("id", { count: "exact", head: true }).eq("status", "approved"),
    client.from("techmeld_tools").select("id", { count: "exact", head: true }).eq("status", "approved"),
    client.from("actionable_events").select("id", { count: "exact", head: true }).in("event_type", ["hackathon", "meetup", "community"]),
  ]);

  return {
    aiNews: aiNews.count ?? 0,
    releases: releases.count ?? 0,
    events: events.count ?? 0,
    learning: learning.count ?? 0,
    tools: tools.count ?? 0,
    community: community.count ?? 0,
  };
}

export interface TechMeldLiveStatus {
  lastUpdatedAt: string | null;
  upcomingEventsCount: number;
  recentArticleCount: number;
}

export async function getTechMeldLiveStatus(): Promise<TechMeldLiveStatus> {
  const client = getPublicSupabaseClient();
  if (!client) return { lastUpdatedAt: null, upcomingEventsCount: 0, recentArticleCount: 0 };

  const [{ data: latest }, upcomingEvents, recentArticles] = await Promise.all([
    client
      .from("active_news")
      .select("effective_published_at")
      .order("effective_published_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    client.from("actionable_events").select("id", { count: "exact", head: true }),
    client.from("active_news").select("id", { count: "exact", head: true }),
  ]);

  return {
    lastUpdatedAt: latest?.effective_published_at ?? null,
    upcomingEventsCount: upcomingEvents.count ?? 0,
    recentArticleCount: recentArticles.count ?? 0,
  };
}
