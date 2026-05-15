MetricMend Database Model

Purpose

This document defines the production-grade database model for MetricMend as a multi-tenant SaaS product.

The goal is to design the schema carefully up front so the product can support:

* Multiple companies / customers
* Multiple workspaces per company
* Real user profiles
* Role-based access control
* Trust-first support access
* Mira AI workflows
* Connectors and semantic models
* Future billing, audit, compliance, and enterprise features

This document starts with the core tenant and workspace foundation.

⸻

1. Core Design Principles

1.1 Naming Rules

MetricMend should use clean, predictable table and column names.

Recommended conventions:

* Table names: plural snake_case
* Primary keys: id
* Foreign keys: <table_singular>_id
* Timestamps: created_at, updated_at
* Soft delete timestamp: deleted_at
* Status fields: status
* Role fields: role
* Metadata fields: metadata as jsonb

Examples:

* companies
* profiles
* workspaces
* workspace_members
* company_id
* workspace_id
* user_id

1.2 ID Strategy

Use UUIDs for primary keys.

Reasoning:

* Safer for multi-tenant systems
* Harder to guess than sequential IDs
* Works well across distributed systems
* Easier for future imports, migrations, and background jobs

Recommended default:

id uuid primary key default gen_random_uuid()

1.3 Multi-Tenant Strategy

MetricMend should use a company-first tenancy model.

Hierarchy:

Company
  └── Workspace
        └── Workspace Members
        └── Connections
        └── Models
        └── Mira Threads

A company represents the customer account / organization.
A workspace represents a working area inside that company.

This avoids treating workspace as a fake string and makes it a real product entity.

1.4 Access Model

Access should be based on explicit membership.

A user does not automatically get access to a company or workspace unless a membership row grants it.

For the first core version:

* Company ownership is tracked on companies.owner_user_id
* Workspace access is tracked in workspace_members
* Future company-wide roles can be added with company_members if needed

⸻

2. Core Tables

The first core tables are:

1. companies
2. profiles
3. workspaces
4. workspace_members

These tables form the tenant, identity, workspace, and access-control foundation.

⸻

3. Table: companies

3.1 Purpose

The companies table represents a customer organization in MetricMend.

Examples:

* A startup using MetricMend
* A consulting client
* An enterprise customer
* A solo founder account

Every production workspace should belong to a company.

This table is the top-level tenant boundary.

⸻

3.2 Table Definition

create table if not exists companies (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text not null unique,
    owner_user_id uuid not null references auth.users(id) on delete restrict,
    status text not null default 'active',
    plan_key text not null default 'free',
    billing_email text,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    constraint companies_status_check
        check (status in ('active', 'trialing', 'suspended', 'cancelled')),
    constraint companies_plan_key_check
        check (plan_key in ('free', 'starter', 'team', 'business', 'enterprise')),
    constraint companies_slug_format_check
        check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

⸻

3.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for the company.
name	text	Yes	Display name of the company.
slug	text	Yes	URL-safe unique identifier. Example: acme-inc.
owner_user_id	uuid	Yes	The user who created or owns the company. References auth.users(id).
status	text	Yes	Current lifecycle status of the company.
plan_key	text	Yes	Current SaaS plan identifier.
billing_email	text	No	Billing contact email.
metadata	jsonb	Yes	Flexible non-critical metadata.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.
deleted_at	timestamptz	No	Soft delete timestamp.

⸻

3.4 Constraints

Primary Key

id uuid primary key

Each company has a globally unique UUID.

Unique Slug

slug text not null unique

The slug should be unique because it may be used in URLs later.

Example future URL:

/app/acme-inc/workspaces/sales-analytics

Owner Relationship

owner_user_id uuid not null references auth.users(id) on delete restrict

Reasoning:

* A company must always have an owner.
* If the owner user is deleted, we should not accidentally delete the entire company.
* Ownership transfer should be handled intentionally.

Status Check

Allowed values:

active
trialing
suspended
cancelled

Reasoning:

This supports SaaS lifecycle management without needing billing tables immediately.

Plan Check

Allowed values:

free
starter
team
business
enterprise

Reasoning:

This gives us a clean upgrade path from free development usage to paid SaaS clients.

⸻

3.5 Relationships

auth.users
  └── companies.owner_user_id
companies
  └── workspaces.company_id

A company can have many workspaces.

⸻

3.6 Reasoning

The companies table is necessary because MetricMend is not just a single-user app. It is a SaaS platform.

Without this table, we would end up attaching everything directly to users or fake workspace strings, which would create rework later.

This table gives us:

* Real tenant boundary
* SaaS billing path
* Enterprise account structure
* Multiple workspaces under one customer
* Clear ownership
* Support for future company-level policies

⸻

4. Table: profiles

4.1 Purpose

The profiles table stores application-level user information for MetricMend.

Supabase already has auth.users, but that table should not be used as the main application profile table.

auth.users handles authentication.
profiles handles product identity.

⸻

4.2 Table Definition

create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    display_name text,
    avatar_url text,
    email text,
    default_company_id uuid references companies(id) on delete set null,
    default_workspace_id uuid,
    onboarding_status text not null default 'not_started',
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint profiles_onboarding_status_check
        check (onboarding_status in ('not_started', 'in_progress', 'completed'))
);

⸻

4.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Same ID as auth.users(id).
full_name	text	No	User’s full legal or account name.
display_name	text	No	Preferred product display name.
avatar_url	text	No	Profile image URL.
email	text	No	Cached email for display/search convenience.
default_company_id	uuid	No	User’s default company after login.
default_workspace_id	uuid	No	User’s default workspace after login.
onboarding_status	text	Yes	Tracks onboarding progress.
metadata	jsonb	Yes	Flexible user metadata.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.

⸻

4.4 Constraints

Primary Key / Auth Relationship

id uuid primary key references auth.users(id) on delete cascade

Reasoning:

* One profile per authenticated user.
* Profile is deleted if the auth user is deleted.
* Keeps app identity tied cleanly to Supabase Auth.

Onboarding Status Check

Allowed values:

not_started
in_progress
completed

Reasoning:

This helps the app decide where to send users after login:

* Create company
* Create workspace
* Launchpad
* Existing workspace

⸻

4.5 Relationships

auth.users
  └── profiles.id
profiles
  └── companies.owner_user_id
  └── workspace_members.user_id

The profile belongs to one auth user.
The same user may belong to many workspaces through workspace_members.

⸻

4.6 Reasoning

The profiles table keeps authentication separate from product identity.

This is important because in production we will need to store things like:

* Display name
* Avatar
* Default workspace
* Onboarding state
* User preferences
* Future notification settings

We should not overload Supabase Auth for product-level data.

⸻

5. Table: workspaces

5.1 Purpose

The workspaces table represents a real working space inside a company.

A workspace is where users will manage:

* Data connections
* Semantic models
* Metrics
* Mira chats
* Dashboards / future apps
* Team collaboration

Launchpad should route users into real workspaces, not fake strings.

⸻

5.2 Table Definition

create table if not exists workspaces (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references companies(id) on delete cascade,
    name text not null,
    slug text not null,
    description text,
    status text not null default 'active',
    metadata jsonb not null default '{}'::jsonb,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    constraint workspaces_status_check
        check (status in ('active', 'archived', 'disabled')),
    constraint workspaces_slug_format_check
        check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    constraint workspaces_company_slug_unique
        unique (company_id, slug)
);

⸻

5.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for the workspace.
company_id	uuid	Yes	Parent company.
name	text	Yes	Workspace display name.
slug	text	Yes	URL-safe workspace identifier within company.
description	text	No	Optional description.
status	text	Yes	Workspace lifecycle status.
metadata	jsonb	Yes	Flexible workspace metadata.
created_by	uuid	No	User who created the workspace.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.
deleted_at	timestamptz	No	Soft delete timestamp.

⸻

5.4 Constraints

Company Relationship

company_id uuid not null references companies(id) on delete cascade

Reasoning:

* A workspace cannot exist without a company.
* If a company is truly deleted, its workspaces should be deleted too.
* Normal product deletion should use deleted_at, not physical delete.

Unique Workspace Slug per Company

unique (company_id, slug)

Reasoning:

Two different companies can both have a workspace called sales.

But the same company should not have two active workspaces with the same slug.

Example allowed:

/acme/sales
/contoso/sales

Example not allowed:

/acme/sales
/acme/sales

Status Check

Allowed values:

active
archived
disabled

Reasoning:

* active: normal workspace
* archived: hidden/read-only in future
* disabled: blocked due to billing/security/admin reasons

⸻

5.5 Relationships

companies
  └── workspaces.company_id
workspaces
  └── workspace_members.workspace_id

A company has many workspaces.
A workspace has many members.

⸻

5.6 Reasoning

The workspace is one of the most important product concepts in MetricMend.

It should be a real database entity because future features will depend on it:

* Workspace-level RBAC
* Workspace-level connectors
* Workspace-level models
* Workspace-level Mira chats
* Workspace-level billing limits
* Workspace-level audit logs

This prevents the earlier issue of using workspace as a fake text value.

⸻

6. Table: workspace_members

6.1 Purpose

The workspace_members table controls which users can access which workspaces and what role they have.

This is the foundation for RBAC.

Users should not get workspace access unless they have a row in this table.

⸻

6.2 Table Definition

create table if not exists workspace_members (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    user_id uuid not null references auth.users(id) on delete cascade,
    role text not null default 'viewer',
    status text not null default 'active',
    invited_by uuid references auth.users(id) on delete set null,
    joined_at timestamptz,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint workspace_members_role_check
        check (role in ('owner', 'admin', 'editor', 'viewer')),
    constraint workspace_members_status_check
        check (status in ('invited', 'active', 'disabled', 'removed')),
    constraint workspace_members_unique_user_per_workspace
        unique (workspace_id, user_id)
);

⸻

6.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for the membership row.
workspace_id	uuid	Yes	Workspace the user belongs to.
user_id	uuid	Yes	User who belongs to the workspace.
role	text	Yes	User’s role inside the workspace.
status	text	Yes	Membership lifecycle status.
invited_by	uuid	No	User who invited this member.
joined_at	timestamptz	No	Timestamp when invite was accepted / user joined.
metadata	jsonb	Yes	Flexible membership metadata.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.

⸻

6.4 Role Values

Initial workspace roles:

Role	Meaning
owner	Full control of workspace. Can manage members, settings, connectors, models.
admin	Can manage most workspace resources, but not ownership transfer.
editor	Can create/edit models, metrics, and Mira workflows.
viewer	Can view approved models, metrics, and Mira answers.

⸻

6.5 Status Values

Status	Meaning
invited	User has been invited but not fully joined.
active	User has active access.
disabled	Access temporarily disabled.
removed	User was removed from the workspace.

⸻

6.6 Constraints

Unique User per Workspace

unique (workspace_id, user_id)

Reasoning:

A user should not have duplicate membership rows for the same workspace.

Workspace Relationship

workspace_id uuid not null references workspaces(id) on delete cascade

Reasoning:

If a workspace is deleted, its membership rows should be deleted too.

User Relationship

user_id uuid not null references auth.users(id) on delete cascade

Reasoning:

If a user is deleted, their membership rows should be removed.

⸻

6.7 Relationships

workspaces
  └── workspace_members.workspace_id
auth.users
  └── workspace_members.user_id

A workspace can have many users.
A user can belong to many workspaces.

This is a many-to-many relationship between users and workspaces.

⸻

6.8 Reasoning

This table makes MetricMend production-ready for teams.

It supports:

* Multiple users per workspace
* Multiple workspaces per user
* Role-based access
* Future invitations
* Future team management
* Future enterprise permissions

This is better than storing a single workspace_id on the user profile because users may eventually belong to several companies or workspaces.

⸻

7. Core Relationship Summary

auth.users
  ├── profiles.id
  ├── companies.owner_user_id
  └── workspace_members.user_id
companies
  └── workspaces.company_id
workspaces
  └── workspace_members.workspace_id

⸻

8. Core Access Flow

8.1 New User Signup

When a new user signs up:

1. Supabase creates a row in auth.users.
2. MetricMend creates a row in profiles.
3. User completes onboarding.
4. MetricMend creates a company.
5. MetricMend creates a default workspace.
6. MetricMend creates a workspace_members row with role owner.
7. Launchpad loads the user’s real active workspaces.

⸻

8.2 Returning User Login

When a user logs in:

1. Read profiles.
2. Read active workspace_members rows for that user.
3. Join to workspaces.
4. Join to companies.
5. Show Launchpad with real workspace options.

⸻

8.3 Authorization Rule

A user can access a workspace only if this exists:

select 1
from workspace_members wm
join workspaces w on w.id = wm.workspace_id
join companies c on c.id = w.company_id
where wm.user_id = auth.uid()
  and wm.workspace_id = :workspace_id
  and wm.status = 'active'
  and w.status = 'active'
  and c.status in ('active', 'trialing');

⸻

9. Recommended Indexes

create index if not exists idx_companies_owner_user_id
    on companies(owner_user_id);
create index if not exists idx_companies_slug
    on companies(slug);
create index if not exists idx_workspaces_company_id
    on workspaces(company_id);
create index if not exists idx_workspaces_company_slug
    on workspaces(company_id, slug);
create index if not exists idx_workspace_members_user_id
    on workspace_members(user_id);
create index if not exists idx_workspace_members_workspace_id
    on workspace_members(workspace_id);
create index if not exists idx_workspace_members_user_workspace_status
    on workspace_members(user_id, workspace_id, status);

⸻

10. Important Design Notes

10.1 Why Not Store Workspace as Text?

Because workspace is a real SaaS entity.

Using text would break or complicate:

* RBAC
* Sharing
* Connectors
* Models
* Billing limits
* Audit logs
* Enterprise support
* Workspace settings

10.2 Why Company First?

Because MetricMend will eventually need customer-level concepts:

* Plans
* Billing
* Tenant status
* Enterprise contracts
* SSO
* Support access policies
* Data retention policies
* Company-wide audit logs

10.3 Why Workspace Members Instead of User Workspace Column?

Because a user may belong to multiple workspaces.

Example:

Akhil
  ├── MetricMend Demo Workspace
  ├── Client A Workspace
  └── Client B Workspace

A single workspace_id on the user profile would not support this cleanly.

⸻

11. Next Tables To Add

After locking these core tables, the next database areas should be added in this order:

1. Workspace invitations
2. Workspace settings
3. Support access requests
4. Connections
5. Connector credentials / secrets reference table
6. Data source catalog tables
7. Semantic models
8. Model tables / fields / relationships
9. Metrics
10. Mira threads and messages
11. Mira generated metrics
12. Audit logs
13. Billing and usage tracking
14. Feature limits
15. Notifications

⸻

12. Table: workspace_invitations

12.1 Purpose

The workspace_invitations table manages pending invitations before a user becomes an active workspace member.

This table is separate from workspace_members because invited users may not have a MetricMend account yet.

This gives MetricMend a clean production invite flow:

1. Admin invites a person by email.
2. Invite is stored in workspace_invitations.
3. User accepts invite.
4. User is added to workspace_members.
5. Invite status becomes accepted.

⸻

12.2 Table Definition

create table if not exists workspace_invitations (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    company_id uuid not null references companies(id) on delete cascade,
    email text not null,
    role text not null default 'viewer',
    status text not null default 'pending',
    token_hash text not null unique,
    expires_at timestamptz not null,
    invited_by uuid references auth.users(id) on delete set null,
    accepted_by uuid references auth.users(id) on delete set null,
    accepted_at timestamptz,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint workspace_invitations_role_check
        check (role in ('admin', 'editor', 'viewer')),
    constraint workspace_invitations_status_check
        check (status in ('pending', 'accepted', 'expired', 'revoked')),
    constraint workspace_invitations_unique_pending_email
        unique (workspace_id, email, status)
);

⸻

12.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for the invitation.
workspace_id	uuid	Yes	Workspace the user is being invited to.
company_id	uuid	Yes	Parent company for easier tenant filtering.
email	text	Yes	Email address of invited user.
role	text	Yes	Role the user will receive after accepting.
status	text	Yes	Invitation lifecycle status.
token_hash	text	Yes	Hashed invitation token. Never store raw invite token.
expires_at	timestamptz	Yes	Expiration timestamp.
invited_by	uuid	No	User who sent the invite.
accepted_by	uuid	No	User account that accepted the invite.
accepted_at	timestamptz	No	Timestamp when invite was accepted.
metadata	jsonb	Yes	Flexible invitation metadata.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.

⸻

12.4 Reasoning

This table prevents invite logic from polluting workspace_members.

Important production reasons:

* Invitees may not have accounts yet.
* Invitations need expiration.
* Invitations need revocation.
* Invite tokens should be hashed.
* Accepted invites should be auditable.
* Future enterprise flows may require approval, SSO, or domain restrictions.

⸻

13. Table: workspace_settings

13.1 Purpose

The workspace_settings table stores workspace-level configuration.

Settings should not be hardcoded in frontend or backend.

This table allows each workspace to have its own behavior for:

* Mira behavior
* Default model preferences
* Data refresh settings
* Workspace branding
* Future notification preferences
* Future enterprise policies

⸻

13.2 Table Definition

create table if not exists workspace_settings (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null unique references workspaces(id) on delete cascade,
    company_id uuid not null references companies(id) on delete cascade,
    default_timezone text not null default 'America/Los_Angeles',
    default_currency text not null default 'USD',
    mira_enabled boolean not null default true,
    mira_auto_generate_metrics boolean not null default true,
    mira_requires_admin_review boolean not null default true,
    allow_member_invites boolean not null default false,
    allow_external_sharing boolean not null default false,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

⸻

13.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for settings row.
workspace_id	uuid	Yes	Workspace these settings belong to. Unique.
company_id	uuid	Yes	Parent company for tenant filtering.
default_timezone	text	Yes	Workspace default timezone.
default_currency	text	Yes	Workspace default currency.
mira_enabled	boolean	Yes	Whether Mira is enabled for this workspace.
mira_auto_generate_metrics	boolean	Yes	Whether Mira can generate metric definitions.
mira_requires_admin_review	boolean	Yes	Whether generated metrics require admin review.
allow_member_invites	boolean	Yes	Whether non-admin members can invite users.
allow_external_sharing	boolean	Yes	Whether external sharing is allowed.
metadata	jsonb	Yes	Flexible workspace settings.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.

⸻

13.4 Relationships

workspaces
  └── workspace_settings.workspace_id
companies
  └── workspace_settings.company_id

Each workspace should have one settings row.

⸻

13.5 Reasoning

This table keeps workspace behavior configurable.

This matters because different customers may want different rules.

Examples:

* One company may allow Mira to auto-generate metrics.
* Another company may require admin approval before metrics are saved.
* One workspace may allow external sharing later.
* Another workspace may lock everything down.

This is especially important for trust-first SaaS behavior.

⸻

14. Table: support_access_requests

14.1 Purpose

The support_access_requests table supports the trust-first MetricMend support model.

MetricMend support should not have default access to customer data.

Instead, a customer admin must explicitly grant temporary support access.

This table records:

* Who requested access
* Which workspace access applies to
* Why access was requested
* Who approved it
* When access starts and expires
* Whether access was revoked

⸻

14.2 Table Definition

create table if not exists support_access_requests (
    id uuid primary key default gen_random_uuid(),
    company_id uuid not null references companies(id) on delete cascade,
    workspace_id uuid references workspaces(id) on delete cascade,
    requested_by uuid references auth.users(id) on delete set null,
    approved_by uuid references auth.users(id) on delete set null,
    revoked_by uuid references auth.users(id) on delete set null,
    reason text not null,
    status text not null default 'pending',
    access_scope text not null default 'workspace',
    starts_at timestamptz,
    expires_at timestamptz not null,
    approved_at timestamptz,
    revoked_at timestamptz,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint support_access_requests_status_check
        check (status in ('pending', 'approved', 'denied', 'revoked', 'expired')),
    constraint support_access_requests_scope_check
        check (access_scope in ('company', 'workspace'))
);

⸻

14.3 Columns

Column	Type	Required	Description
id	uuid	Yes	Primary key for support access request.
company_id	uuid	Yes	Company access belongs to.
workspace_id	uuid	No	Workspace access belongs to, if scoped to workspace.
requested_by	uuid	No	Support/admin user who requested access.
approved_by	uuid	No	Customer admin who approved access.
revoked_by	uuid	No	User who revoked access.
reason	text	Yes	Reason support access is needed.
status	text	Yes	Lifecycle status.
access_scope	text	Yes	Whether access applies to company or workspace.
starts_at	timestamptz	No	When access starts.
expires_at	timestamptz	Yes	When access expires.
approved_at	timestamptz	No	Approval timestamp.
revoked_at	timestamptz	No	Revocation timestamp.
metadata	jsonb	Yes	Flexible support access metadata.
created_at	timestamptz	Yes	Creation timestamp.
updated_at	timestamptz	Yes	Last update timestamp.

⸻

14.4 Status Values

Status	Meaning
pending	Access has been requested but not approved.
approved	Customer approved temporary access.
denied	Customer denied access.
revoked	Previously approved access was revoked.
expired	Access window ended.

⸻

14.5 Access Rule

Support access is valid only when:

status = 'approved'
and now() >= coalesce(starts_at, created_at)
and now() < expires_at
and revoked_at is null

⸻

14.6 Reasoning

This table protects customer trust.

MetricMend should not silently access customer workspaces.

This design supports:

* No default support access
* Temporary access windows
* Customer approval
* Revocation
* Auditability
* Enterprise trust posture

This is a key product differentiator.

⸻

15. Updated Core Table Order

Create tables in this order:

1. companies
2. profiles
3. workspaces
4. workspace_members
5. workspace_invitations
6. workspace_settings
7. support_access_requests

Important note:

Because profiles.default_workspace_id references workspaces, there are two clean options:

Option A:

* Create profiles.default_workspace_id without a foreign key first.
* Add the foreign key after workspaces exists.

Option B:

* Keep default_workspace_id as a nullable UUID without FK enforcement initially.
* Validate access through application logic and membership joins.

Recommended for now:

Use Option B for faster development and fewer circular dependency issues.

Later, we can add a foreign key once the onboarding flow is stable.

⸻

16. Should We Run These Queries Now?

Do not copy random table snippets one by one into Supabase yet.

Before running anything, create one clean migration file that includes:

1. Required extensions
2. Tables in the correct order
3. Shared updated_at trigger function
4. Indexes
5. Optional RLS enablement
6. Optional seed/default onboarding logic

Reasoning:

The table definitions above are correct as a design model, but production execution should happen through a single migration file so the schema is reproducible.

Recommended migration name:

supabase/migrations/001_core_saas_foundation.sql

⸻

17. First Migration Checklist

Before executing the first migration, confirm:

* Supabase project is selected correctly.
* auth.users exists.
* pgcrypto extension is enabled for gen_random_uuid().
* Tables are created in dependency order.
* profiles.default_workspace_id is nullable UUID without FK for now.
* RLS policies are added after table creation, not before.
* App backend queries use workspace_members, not fake workspace strings.