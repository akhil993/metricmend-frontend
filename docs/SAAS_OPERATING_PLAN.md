# MetricMend SaaS Operating Plan

## Purpose

This document defines how MetricMend will run technically and financially as it moves from no-client development to real SaaS customers.

MetricMend is an AI analytics layer. It does not store customer raw data by default and does not act as the primary data warehouse. It connects to customer data systems, builds semantic models, and uses Mira to answer questions through governed model context.

---

## Stage 0: Development / No Clients

### Goal

Build and validate the production foundation with the lowest reasonable cost.

### Services

- Frontend: Vercel free/dev tier
- Backend: Local development first, then low-cost Render/Railway/Fly.io
- Database/Auth: Supabase free tier
- File/docs: GitHub repository
- AI: OpenAI API with strict usage limits
- Cache/Queue: Not required yet

### Rules

- No mock production paths
- No hardcoded customer data
- All database tables documented before use
- All API routes documented before frontend integration
- Launchpad and workspace architecture must be production-safe from day one

---

## Stage 1: First Internal Beta / First Client

### Goal

Run MetricMend for one real customer safely.

### Services

- Frontend: Vercel Pro or equivalent
- Backend: Render/Railway/Fly.io paid instance
- Database/Auth: Supabase Pro
- AI: OpenAI API with budget limits
- Logging: Basic app logs and audit_logs table
- Monitoring: Platform logs + uptime monitor

### Customer Data Model

MetricMend should not ingest or store full raw datasets unless explicitly required.

Preferred flow:

1. Customer connects Athena/Snowflake/Postgres/etc.
2. MetricMend stores encrypted connection metadata
3. Mira generates SQL
4. Query runs in customer system
5. MetricMend receives only limited/aggregated results

### Cost Control

- Limit Mira requests per plan
- Limit result row count
- Avoid SELECT *
- Use aggregation-first queries
- Cache repeated metadata calls
- Track AI token usage per workspace

---

## Stage 2: Two to Five Clients

### Goal

Move from working product to reliable SaaS.

### Services

- Frontend: Vercel Pro
- Backend: Dedicated paid backend service with autoscaling option
- Database/Auth: Supabase Pro with backups enabled
- Cache: Redis for metadata/query caching
- Queue: Background jobs for long-running sync/schema discovery
- Monitoring: Error tracking and uptime monitoring
- Secrets: Proper encrypted credential handling

### Required Features

- Company and workspace isolation
- Role-based access control
- Per-user Launchpad workspace
- Audit logs
- Support access model
- Query limits by plan
- AI usage tracking
- Workspace-level billing metadata

---

## Stage 3: Growing SaaS / More Clients

### Goal

Scale reliably without redesigning the product.

### Services

- Frontend: Vercel Pro/Enterprise if needed
- Backend: AWS ECS/Fargate, Render autoscale, or similar
- Database/Auth: Supabase Team/Enterprise or managed Postgres
- Cache: Redis
- Queue: Celery/RQ/Temporal/Cloud Tasks
- Object Storage: S3 for exports, logs, generated reports
- Observability: Sentry, PostHog, Datadog/OpenTelemetry

### Scaling Strategy

MetricMend should avoid owning customer compute.

Customer compute should stay in:

- Athena
- Snowflake
- Redshift
- BigQuery
- Postgres
- SQL Server

MetricMend scales mostly on:

- API requests
- Metadata storage
- AI requests
- Query result rendering
- Cache usage

---

## Pricing Direction

### Free / Launchpad

- One user
- Personal Launchpad
- Limited connections
- Limited Mira usage
- Limited saved models

### Pro

- More models
- More Mira usage
- More connectors
- Personal productivity features

### Team

- Multiple users
- Shared workspaces
- RBAC
- Audit logs
- Higher Mira limits
- More saved connections

### Enterprise

- SSO
- Advanced support access
- Dedicated limits
- Security review support
- Private deployment option
- SLA

---

## Client Onboarding Requirements

For each new client, MetricMend needs:

- Company record
- Admin user
- Workspace setup
- Connection configuration
- Connector permissions
- Semantic model setup
- Mira usage limits
- Billing plan
- Support access rules

MetricMend should not need:

- A new database per client
- A new backend per client
- A new frontend per client
- Direct access to raw customer data by default

---

## Security and Trust Rules

- Frontend uses Supabase anon key only
- Backend uses Supabase service role key only
- Service role key is never exposed to frontend
- Backend owns authorization
- Customer data access is explicit and auditable
- Support access is off by default
- Support access must be granted by customer
- Support actions are logged
- Customers can revoke support access

---

## Upgrade Triggers

### Upgrade Supabase when:

- Free tier limits are close
- Need backups
- Need more auth users
- Need more database storage
- Need better performance

### Upgrade backend hosting when:

- API latency is high
- More clients are active
- Long-running jobs are needed
- Background workers are introduced

### Add Redis when:

- Metadata calls repeat often
- Model schema loading becomes slow
- Mira context building becomes expensive

### Add queue/workers when:

- Schema discovery takes too long
- Data profiling is added
- Report generation/export is added
- Long-running customer queries need async handling

---

## Operating Principle

MetricMend should start lean but not messy.

Use low-cost tools while there are no clients, but design every core object as if the product will support multiple companies, multiple workspaces, paid plans, support access, and auditability.
Pricing Model

MetricMend pricing should support:

Free / Launchpad:

* one user
* limited Mira usage
* limited models
* limited connections

Pro:

* more models
* more Mira usage
* personal productivity workflows

Team:

* multiple users
* shared workspaces
* RBAC
* audit logs

Enterprise:

* SSO
* advanced support access
* SLA
* security review
* private deployment option

⸻

Compute & Cost Model

MetricMend should not own customer compute by default.

Customer queries run in:

* Athena
* Snowflake
* Redshift
* BigQuery
* Postgres
* SQL Server

MetricMend costs mainly come from:

* backend hosting
* Supabase
* AI tokens
* metadata storage
* caching
* monitoring

⸻

SaaS Operating Model

Stage 0: No clients

* Vercel free/dev
* Supabase free/dev
* local or low-cost backend
* strict docs and architecture

Stage 1: First client

* Supabase Pro
* paid backend
* Vercel Pro
* audit logs
* AI usage limits

Stage 2: Multiple clients

* Redis cache
* background workers
* monitoring
* error tracking
* stronger billing controls

Stage 3: Enterprise

* SSO
* dedicated compute options
* advanced audit
* private deployment option

⸻

Trust Principle

MetricMend helps customers fix and understand their data systems without accessing raw customer data by default.