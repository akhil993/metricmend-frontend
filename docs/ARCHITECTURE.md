# MetricMend Architecture

## Product Vision

MetricMend is a trust-first AI analytics platform that helps teams build governed semantic models, define trusted metrics, and ask business questions through Mira.

MetricMend is not a data warehouse. It is an AI and semantic layer that connects to customer data systems, understands business models, and helps users get reliable answers faster.

---

## Core Architecture

MetricMend follows a multi-tenant SaaS architecture.

Company
→ Users
→ Workspaces
→ Connections
→ Semantic Models
→ Metrics
→ Mira

All business objects belong to a company and workspace.

---

## Design Rules

- company_id is required for business objects.
- workspace_id is always a real UUID.
- The database never stores fake workspace IDs like "launchpad".
- Frontend may send scope values like "launchpad".
- Backend resolves scope into real workspace IDs.
- Frontend never writes business tables directly.
- FastAPI owns authorization and permission checks.
- Backend uses Supabase service role key.
- Frontend uses Supabase anon key only.
- No mock data is allowed in production paths.
- No temporary routes are allowed.
- Every route must be documented before frontend integration.

---

## Company Model

A company represents a customer account.

A company may represent:
- A real business customer
- A small team
- A public/individual user account

Every user belongs to a company through their profile.

---

## User Profile & Identity

Supabase Auth handles authentication.

The profiles table stores MetricMend-specific user details:
- user id
- company id
- email
- display name
- account status

The backend validates Supabase JWTs before serving protected routes.

---

## Workspace Architecture

A workspace is the main operating area where users build and use analytics models.

Workspace types:
- launchpad
- team

A workspace owns:
- connections
- semantic models
- metrics
- Mira chats
- audit logs

---

## Per-User Launchpad Workspace

Launchpad is a real workspace, not a fake frontend mode.

Each user gets their own Launchpad workspace automatically.

Frontend may send:

```txt
scope = "launchpad"

Launchpad rules:

* One Launchpad per user per company
* User is admin of their own Launchpad
* Launchpad data is private to that user
* Launchpad models do not mix with team workspace models
* Database stores only real workspace UUIDs

⸻

Team Workspace Model

Team workspaces are shared spaces inside a company.

Team workspace access is controlled by workspace_members.

Team workspaces support:

* shared connections
* governed models
* approved metrics
* team Mira usage
* admin/builder/member/viewer roles

⸻

Role-Based Access Control

MetricMend uses role-based permissions.

Core roles:

* admin
* builder
* member
* executive
* viewer
* support_readonly
* support_debug

Permissions are checked in the backend before any business operation.

Examples:

* connectors:view
* connectors:manage
* models:view
* models:manage
* metrics:view
* metrics:manage
* metrics:approve
* mira:ask
* data:query

⸻

Support Access Model

MetricMend does not have default access to customer data.

Support access must be explicitly granted by the customer.

Support access rules:

* Off by default
* Time-bound
* Revocable
* Audited
* Transparent to the customer

Support can help with:

* model structure
* metric logic
* connector setup
* error diagnosis
* query planning

Support should not access raw customer data unless explicitly granted.

⸻

Connection Management

Connections represent saved customer data sources.

Supported connector types:

* Athena
* Snowflake
* Postgres
* Redshift
* SQL Server
* BigQuery
* Databricks

Connections store:

* connector type
* configuration
* encrypted authentication details
* workspace ownership
* creator information

Connection credentials must never be exposed to frontend after saving.

⸻

Connector Adapter Layer

Each connector has an adapter.

Adapters implement:

* test_connection
* list_tables
* get_columns
* execute_query

The backend routes call connector services. Connector services call adapter instances.

Frontend never talks directly to customer databases.

⸻

Semantic Model Builder

Semantic models define business-friendly data models.

A semantic model includes:

* selected tables
* table roles
* selected columns
* relationships
* base metrics
* time intelligence metrics

Semantic models are scoped to a workspace.

⸻

Tables, Columns & Relationships

Tables selected into a semantic model are stored separately from raw connection metadata.

Table roles:

* fact
* dimension

Relationships define joins between tables.

Relationships should support:

* fact table
* dimension table
* join keys
* join type
* cardinality
* active/inactive status

⸻

Metric Layer

Metrics are governed business definitions.

Metric types:

* base metric
* calculated metric
* time intelligence metric
* Mira-generated metric

Metrics belong to a semantic model and workspace.

User-created metrics and Mira-generated metrics must be clearly separated.

⸻

Time Intelligence Layer

Time intelligence supports reusable period calculations.

Examples:

* MTD
* QTD
* YTD
* Last Month
* Last Quarter
* Last 30 Days
* Last 3 Months
* Rolling 7/30/90 Days

Time intelligence depends on:

* base metric
* date column
* source database dialect

⸻

Mira AI Layer

Mira is the AI analytics assistant.

Mira answers questions using:

* selected workspace
* selected semantic model
* available metrics
* relationships
* time intelligence
* connector metadata

Mira must not guess outside the selected model unless explicitly allowed.

Mira-generated metrics must be saved separately with provenance and review status.

⸻

Query Planning & SQL Generation

Mira follows this flow:

1. Understand user question
2. Detect intent
3. Resolve metrics
4. Resolve dimensions
5. Resolve time filters
6. Build SQL
7. Validate SQL
8. Execute through connector
9. Generate summary and visualization

SQL generation must be dialect-aware.

⸻

Execution & Guardrails

Backend must validate SQL before execution.

Guardrails:

* No destructive SQL
* No DROP/DELETE/TRUNCATE/UPDATE
* No SELECT * in Mira-generated production queries
* Row limits enforced
* Workspace access enforced
* Connector access enforced

⸻

Visualization Layer

Mira responses may include visualizations.

Supported early visual types:

* table
* bar chart
* line chart
* KPI card

Visualization should be derived from query result shape.

⸻

Audit Logging

Important actions must be logged.

Examples:

* connection created
* model created
* metric created
* Mira query executed
* support access granted
* support action performed

Audit logs support trust, debugging, and future compliance.

⸻

Frontend Architecture

Frontend uses Next.js.

Frontend responsibilities:

* authentication UI
* workspace navigation
* Launchpad UI
* model builder UI
* Mira chat UI
* settings/profile UI

Frontend must call documented backend routes only.

Frontend must not:

* write business tables directly
* store service role keys
* execute SQL
* access raw credentials after save

⸻

Backend Architecture

Backend uses FastAPI.

Backend responsibilities:

* authentication validation
* workspace resolution
* permission checks
* connector execution
* semantic model services
* Mira orchestration
* audit logging

Backend uses Supabase service role key only on the server.