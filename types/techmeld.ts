// ---------------------------------------------------------------------------
// Database row types — mirror supabase/migrations/*_techmeld_schema.sql
// ---------------------------------------------------------------------------

export type TechMeldSourceType =
  | "rss"
  | "atom"
  | "api"
  | "editorial"
  | "calendar"
  | "event_feed";

export type TechMeldTrustLevel = "official" | "community" | "unverified";

export interface TechMeldSourceRow {
  id: string;
  name: string;
  source_type: TechMeldSourceType;
  base_url: string;
  feed_url: string | null;
  api_url: string | null;
  official_source: boolean;
  enabled: boolean;
  trust_level: TechMeldTrustLevel;
  rights_review_status: "pending" | "approved" | "restricted" | "prohibited";
  terms_url: string | null;
  robots_url: string | null;
  terms_reviewed_at: string | null;
  attribution_requirements: string | null;
  permitted_use: string | null;
  category: string;
  last_checked_at: string | null;
  last_success_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TechMeldContentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "archived";

export interface TechMeldArticleRow {
  id: string;
  source_id: string | null;
  external_id: string | null;
  title: string;
  slug: string;
  source_name: string;
  source_url: string;
  canonical_url: string;
  category: string;
  summary: string;
  why_it_matters: string;
  publisher: string;
  article_language: string;
  summary_method: "ai" | "editorial" | "metadata_template";
  image_rights_status: "not_cleared" | "licensed" | "publisher_permitted" | "original";
  published_at: string;
  discovered_at: string;
  image_url: string | null;
  author: string | null;
  tags: string[];
  status: TechMeldContentStatus;
  featured: boolean;
  importance_score: number | null;
  related_product: "lifemeld" | "metricmend" | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type TechMeldEventFormat = "virtual" | "in_person" | "hybrid";
export type TechMeldEventCostType = "free" | "paid" | "unknown";
export type TechMeldEventStatus =
  | "pending"
  | "approved"
  | "cancelled"
  | "completed"
  | "archived";
export type TechMeldEventType =
  | "event"
  | "conference"
  | "webinar"
  | "workshop"
  | "meetup"
  | "hackathon"
  | "community";

export interface TechMeldEventRow {
  id: string;
  source_id: string | null;
  external_id: string | null;
  name: string;
  slug: string;
  organizer: string;
  source_url: string;
  registration_url: string | null;
  registration_open_at: string | null;
  registration_close_at: string | null;
  registration_status: "open" | "closed" | "unknown" | null;
  same_day_registration: boolean;
  category: string;
  event_type: TechMeldEventType;
  description: string;
  start_at: string;
  end_at: string | null;
  timezone: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  venue: string | null;
  format: TechMeldEventFormat;
  cost_type: TechMeldEventCostType;
  price_text: string | null;
  tags: string[];
  featured: boolean;
  status: TechMeldEventStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TechMeldLearningResourceRow {
  id: string;
  title: string;
  slug: string;
  provider: string;
  source_url: string;
  category: string;
  description: string;
  access_type: "free" | "paid";
  certification: boolean;
  tags: string[];
  status: TechMeldContentStatus;
  featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TechMeldToolRow {
  id: string;
  name: string;
  slug: string;
  company: string | null;
  website_url: string;
  category: string;
  description: string;
  pricing_type: "free" | "freemium" | "paid";
  tags: string[];
  status: TechMeldContentStatus;
  featured: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type TechMeldSubscriberStatus = "pending" | "active" | "unsubscribed";

export interface TechMeldSubscriberRow {
  id: string;
  email: string;
  first_name: string | null;
  interests: string[];
  status: TechMeldSubscriberStatus;
  consented_at: string;
  unsubscribed_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export type TechMeldIngestionRunStatus =
  | "running"
  | "success"
  | "partial"
  | "failed";

export interface TechMeldIngestionRunRow {
  id: string;
  source_id: string;
  started_at: string;
  completed_at: string | null;
  status: TechMeldIngestionRunStatus;
  items_found: number;
  items_created: number;
  items_updated: number;
  error_message: string | null;
  metadata: Record<string, unknown>;
}

export type TechMeldSubmissionType =
  | "event"
  | "article"
  | "tool"
  | "learning_resource"
  | "hackathon"
  | "meetup";

export type TechMeldSubmissionStatus = "pending" | "approved" | "rejected";

export interface TechMeldEditorialSubmissionRow {
  id: string;
  submission_type: TechMeldSubmissionType;
  submitted_by_name: string | null;
  submitted_by_email: string | null;
  title: string;
  source_url: string;
  description: string | null;
  status: TechMeldSubmissionStatus;
  reviewed_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Public view models — what pages/components render
// ---------------------------------------------------------------------------

export type TechMeldCategorySlug =
  | "ai-news"
  | "events"
  | "releases"
  | "learning"
  | "tools"
  | "community";

export interface TechMeldCategory {
  slug: TechMeldCategorySlug;
  title: string;
  description: string;
  href: string;
  itemCount: number;
  icon: "brain" | "calendar" | "rocket" | "graduation" | "wrench" | "users";
}

export interface TechMeldArticle {
  id: string;
  slug: string;
  title: string;
  sourceName: string;
  sourceUrl: string;
  canonicalUrl: string;
  category: string;
  publishedAt: string;
  publishedDateLabel: string;
  summary: string;
  whyItMatters: string;
  publisher: string;
  language: string;
  summaryMethod: "ai" | "editorial" | "metadata_template";
  tags: string[];
  imageUrl?: string | null;
  author?: string | null;
  featured: boolean;
  relatedProduct?: "lifemeld" | "metricmend" | null;
}

export interface TechMeldEvent {
  id: string;
  slug: string;
  name: string;
  organizer: string;
  sourceUrl: string;
  registrationUrl?: string | null;
  registrationOpenAt?: string | null;
  registrationCloseAt?: string | null;
  registrationBadge: string;
  category: string;
  eventType: TechMeldEventType;
  description: string;
  startAt: string;
  startDateLabel: string;
  endAt?: string | null;
  timezone?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  venue?: string | null;
  format: TechMeldEventFormat;
  costType: TechMeldEventCostType;
  priceText?: string | null;
  tags: string[];
  featured: boolean;
  status: TechMeldEventStatus;
  isExpired: boolean;
}

export interface TechMeldTool {
  id: string;
  slug: string;
  name: string;
  company?: string | null;
  category: string;
  description: string;
  websiteUrl: string;
  pricingType: "free" | "freemium" | "paid";
  tags: string[];
  featured: boolean;
}

export interface TechMeldLearningResource {
  id: string;
  slug: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  resourceUrl: string;
  accessType: "free" | "paid";
  certification: boolean;
  tags: string[];
  featured: boolean;
}
