-- TechMeld production schema
-- Separates: external source ingestion, normalized stored content, editorial
-- approval, public display, newsletter subscriptions, and ingestion logs.
--
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- Never drops or truncates existing data.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function techmeld_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. techmeld_sources
-- ---------------------------------------------------------------------------
create table if not exists techmeld_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null check (source_type in ('rss', 'atom', 'api', 'editorial', 'calendar', 'event_feed')),
  base_url text not null,
  feed_url text,
  api_url text,
  official_source boolean not null default false,
  enabled boolean not null default true,
  trust_level text not null default 'community' check (trust_level in ('official', 'community', 'unverified')),
  -- Conventionally one of: ai-news, releases, events, learning, tools, community.
  category text not null,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_sources;
create trigger set_updated_at before update on techmeld_sources
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_sources_enabled on techmeld_sources (enabled);
create index if not exists idx_techmeld_sources_category on techmeld_sources (category);
create unique index if not exists uq_techmeld_sources_feed_url
  on techmeld_sources (feed_url)
  where feed_url is not null;

-- ---------------------------------------------------------------------------
-- 2. techmeld_articles
-- ---------------------------------------------------------------------------
create table if not exists techmeld_articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references techmeld_sources (id) on delete set null,
  external_id text,
  title text not null,
  slug text not null unique,
  source_name text not null,
  source_url text not null,
  canonical_url text not null,
  -- Broad section this article belongs to: 'ai-news' or 'releases'.
  category text not null,
  summary text not null,
  published_at timestamptz not null,
  discovered_at timestamptz not null default now(),
  image_url text,
  author text,
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  featured boolean not null default false,
  importance_score numeric,
  related_product text check (related_product in ('lifemeld', 'metricmend')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_articles;
create trigger set_updated_at before update on techmeld_articles
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_articles_published_at on techmeld_articles (published_at desc);
create index if not exists idx_techmeld_articles_category on techmeld_articles (category);
create index if not exists idx_techmeld_articles_status on techmeld_articles (status);
create index if not exists idx_techmeld_articles_featured on techmeld_articles (featured);
create index if not exists idx_techmeld_articles_source_id on techmeld_articles (source_id);
create index if not exists idx_techmeld_articles_tags on techmeld_articles using gin (tags);
create unique index if not exists uq_techmeld_articles_source_external
  on techmeld_articles (source_id, external_id)
  where external_id is not null;

-- ---------------------------------------------------------------------------
-- 3. techmeld_events
-- ---------------------------------------------------------------------------
create table if not exists techmeld_events (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references techmeld_sources (id) on delete set null,
  external_id text,
  name text not null,
  slug text not null unique,
  organizer text not null,
  source_url text not null,
  registration_url text,
  -- Topic facet: AI, Cloud, Analytics, Data Engineering, Software Development, etc.
  category text not null,
  description text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  timezone text,
  city text,
  region text,
  country text,
  venue text,
  format text not null check (format in ('virtual', 'in_person', 'hybrid')),
  cost_type text not null check (cost_type in ('free', 'paid', 'unknown')),
  price_text text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'cancelled', 'completed', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_events;
create trigger set_updated_at before update on techmeld_events
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_events_start_at on techmeld_events (start_at);
create index if not exists idx_techmeld_events_category on techmeld_events (category);
create index if not exists idx_techmeld_events_status on techmeld_events (status);
create index if not exists idx_techmeld_events_featured on techmeld_events (featured);
create index if not exists idx_techmeld_events_source_id on techmeld_events (source_id);
create index if not exists idx_techmeld_events_tags on techmeld_events using gin (tags);
create unique index if not exists uq_techmeld_events_source_external
  on techmeld_events (source_id, external_id)
  where external_id is not null;

-- ---------------------------------------------------------------------------
-- 4. techmeld_learning_resources
-- ---------------------------------------------------------------------------
create table if not exists techmeld_learning_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  provider text not null,
  source_url text not null,
  category text not null,
  description text not null,
  access_type text not null check (access_type in ('free', 'paid')),
  certification boolean not null default false,
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  featured boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_learning_resources;
create trigger set_updated_at before update on techmeld_learning_resources
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_learning_category on techmeld_learning_resources (category);
create index if not exists idx_techmeld_learning_status on techmeld_learning_resources (status);
create index if not exists idx_techmeld_learning_featured on techmeld_learning_resources (featured);
create index if not exists idx_techmeld_learning_tags on techmeld_learning_resources using gin (tags);

-- ---------------------------------------------------------------------------
-- 5. techmeld_tools
-- ---------------------------------------------------------------------------
create table if not exists techmeld_tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  company text,
  website_url text not null,
  category text not null,
  description text not null,
  pricing_type text not null check (pricing_type in ('free', 'freemium', 'paid')),
  tags text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'archived')),
  featured boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_tools;
create trigger set_updated_at before update on techmeld_tools
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_tools_category on techmeld_tools (category);
create index if not exists idx_techmeld_tools_status on techmeld_tools (status);
create index if not exists idx_techmeld_tools_featured on techmeld_tools (featured);
create index if not exists idx_techmeld_tools_tags on techmeld_tools using gin (tags);

-- ---------------------------------------------------------------------------
-- 6. techmeld_subscribers
-- ---------------------------------------------------------------------------
create table if not exists techmeld_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  interests text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'active', 'unsubscribed')),
  consented_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  source text not null default 'techmeld',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on techmeld_subscribers;
create trigger set_updated_at before update on techmeld_subscribers
  for each row execute function techmeld_set_updated_at();

create index if not exists idx_techmeld_subscribers_status on techmeld_subscribers (status);

-- ---------------------------------------------------------------------------
-- 7. techmeld_ingestion_runs
-- ---------------------------------------------------------------------------
create table if not exists techmeld_ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references techmeld_sources (id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'partial', 'failed')),
  items_found integer not null default 0,
  items_created integer not null default 0,
  items_updated integer not null default 0,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_techmeld_ingestion_runs_source_id on techmeld_ingestion_runs (source_id);
create index if not exists idx_techmeld_ingestion_runs_status on techmeld_ingestion_runs (status);

-- ---------------------------------------------------------------------------
-- 8. techmeld_editorial_submissions
-- ---------------------------------------------------------------------------
create table if not exists techmeld_editorial_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (submission_type in ('event', 'article', 'tool', 'learning_resource', 'hackathon', 'meetup')),
  submitted_by_name text,
  submitted_by_email text,
  title text not null,
  source_url text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_techmeld_submissions_status on techmeld_editorial_submissions (status);
create index if not exists idx_techmeld_submissions_type on techmeld_editorial_submissions (submission_type);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Public (anon/authenticated) may only ever SELECT approved, public-facing
-- rows from the four content tables below. There is intentionally no INSERT/
-- UPDATE/DELETE policy for anon/authenticated on ANY table: the newsletter,
-- submissions, ingestion, and admin/editorial writes all happen exclusively
-- through server routes using the Supabase service-role key, which bypasses
-- RLS. techmeld_sources, techmeld_subscribers, techmeld_ingestion_runs, and
-- techmeld_editorial_submissions have RLS enabled with NO anon/authenticated
-- policy at all, so they default-deny all public access.
-- ---------------------------------------------------------------------------

alter table techmeld_sources enable row level security;
alter table techmeld_articles enable row level security;
alter table techmeld_events enable row level security;
alter table techmeld_learning_resources enable row level security;
alter table techmeld_tools enable row level security;
alter table techmeld_subscribers enable row level security;
alter table techmeld_ingestion_runs enable row level security;
alter table techmeld_editorial_submissions enable row level security;

drop policy if exists techmeld_articles_public_read on techmeld_articles;
create policy techmeld_articles_public_read on techmeld_articles
  for select to anon, authenticated
  using (status = 'approved');

-- Events keep 'cancelled' and 'completed' publicly visible (with a badge on
-- the detail page) so a direct link to an event someone registered for never
-- 404s just because it happened or was called off. 'pending', 'rejected',
-- and 'archived' stay hidden.
drop policy if exists techmeld_events_public_read on techmeld_events;
create policy techmeld_events_public_read on techmeld_events
  for select to anon, authenticated
  using (status in ('approved', 'cancelled', 'completed'));

drop policy if exists techmeld_tools_public_read on techmeld_tools;
create policy techmeld_tools_public_read on techmeld_tools
  for select to anon, authenticated
  using (status = 'approved');

drop policy if exists techmeld_learning_public_read on techmeld_learning_resources;
create policy techmeld_learning_public_read on techmeld_learning_resources
  for select to anon, authenticated
  using (status = 'approved');

-- ---------------------------------------------------------------------------
-- Seed: verified official sources only.
--
-- Every feed_url below was checked during implementation (HTTP 200, valid
-- RSS/Atom content-type and body). Sources considered but NOT included
-- because no working public feed could be verified: Azure Updates (feed
-- endpoint now serves an HTML SPA shell, no XML), Snowflake newsroom (404),
-- dbt Labs blog (unreachable), Apple Developer News (500), HashiCorp blog
-- (rate-limited every attempt), Anthropic (no public RSS endpoint), Meta / AI
-- at Meta (404). These are left unconfigured rather than guessed at or
-- scraped. See docs/techmeld.md for how to add a source later once verified.
-- ---------------------------------------------------------------------------

insert into techmeld_sources (name, source_type, base_url, feed_url, official_source, enabled, trust_level, category)
values
  ('AWS News Blog', 'rss', 'https://aws.amazon.com/blogs/aws/', 'https://aws.amazon.com/blogs/aws/feed/', true, true, 'official', 'ai-news'),
  ('AWS What''s New', 'rss', 'https://aws.amazon.com/about-aws/whats-new/', 'https://aws.amazon.com/about-aws/whats-new/recent/feed/', true, true, 'official', 'releases'),
  ('Google Cloud Release Notes', 'atom', 'https://cloud.google.com/release-notes', 'https://docs.cloud.google.com/feeds/gcp-release-notes.xml', true, true, 'official', 'releases'),
  ('Google AI Blog', 'rss', 'https://blog.google/technology/ai/', 'https://blog.google/technology/ai/rss/', true, true, 'official', 'ai-news'),
  ('Microsoft Cloud Blog', 'rss', 'https://www.microsoft.com/en-us/microsoft-cloud/blog/', 'https://www.microsoft.com/en-us/microsoft-cloud/blog/feed/', true, true, 'official', 'ai-news'),
  ('Microsoft DevBlogs', 'rss', 'https://devblogs.microsoft.com/', 'https://devblogs.microsoft.com/feed/', true, true, 'official', 'ai-news'),
  ('GitHub Blog', 'rss', 'https://github.blog/', 'https://github.blog/feed/', true, true, 'official', 'ai-news'),
  ('GitHub Changelog', 'rss', 'https://github.blog/changelog/', 'https://github.blog/changelog/feed/', true, true, 'official', 'releases'),
  ('NVIDIA Developer Blog', 'atom', 'https://developer.nvidia.com/blog/', 'https://developer.nvidia.com/blog/feed', true, true, 'official', 'ai-news'),
  ('NVIDIA Blog', 'rss', 'https://blogs.nvidia.com/', 'https://blogs.nvidia.com/feed/', true, true, 'official', 'ai-news'),
  ('Databricks Blog', 'rss', 'https://www.databricks.com/blog', 'https://www.databricks.com/feed', true, true, 'official', 'ai-news'),
  ('Docker Blog', 'rss', 'https://www.docker.com/blog/', 'https://www.docker.com/feed/', true, true, 'official', 'ai-news'),
  ('Kubernetes Blog', 'rss', 'https://kubernetes.io/blog/', 'https://kubernetes.io/feed.xml', true, true, 'official', 'ai-news'),
  ('Vercel News', 'atom', 'https://vercel.com/blog', 'https://vercel.com/atom', true, true, 'official', 'ai-news'),
  ('Supabase Blog', 'rss', 'https://supabase.com/blog', 'https://supabase.com/rss.xml', true, true, 'official', 'ai-news'),
  ('Cloudflare Blog', 'rss', 'https://blog.cloudflare.com/', 'https://blog.cloudflare.com/rss/', true, true, 'official', 'ai-news'),
  ('OpenAI News', 'rss', 'https://openai.com/news/', 'https://openai.com/news/rss.xml', true, true, 'official', 'ai-news'),
  ('Hugging Face Blog', 'rss', 'https://huggingface.co/blog', 'https://huggingface.co/blog/feed.xml', true, true, 'official', 'ai-news'),
  ('MongoDB Blog', 'rss', 'https://www.mongodb.com/blog', 'https://www.mongodb.com/blog/rss', true, true, 'official', 'ai-news'),
  ('Stack Overflow Blog', 'rss', 'https://stackoverflow.blog/', 'https://stackoverflow.blog/feed/', true, true, 'official', 'ai-news')
on conflict (feed_url) where feed_url is not null do nothing;
