-- Public content is filtered before pagination.  Date-only decisions use the
-- production/user-facing timezone rather than UTC.
alter table techmeld_articles
  add column if not exists source_published_at timestamptz,
  add column if not exists announced_at timestamptz;

alter table techmeld_events
  add column if not exists registration_open_at timestamptz,
  add column if not exists registration_close_at timestamptz,
  add column if not exists registration_status text
    check (registration_status in ('open', 'closed', 'unknown')),
  add column if not exists same_day_registration boolean not null default false;

create or replace view active_news
with (security_invoker = true)
as
select a.*,
  coalesce(a.published_at, a.source_published_at, a.announced_at, a.created_at)
    as effective_published_at
from techmeld_articles a
where a.status = 'approved'
  and coalesce(a.published_at, a.source_published_at, a.announced_at, a.created_at)
      >= current_timestamp - interval '30 days';

create or replace view actionable_events
with (security_invoker = true)
as
select e.*,
  case
    when coalesce(e.registration_open_at, '-infinity'::timestamptz) <= current_timestamp
      and coalesce(e.registration_close_at, 'infinity'::timestamptz) >= current_timestamp
      and coalesce(e.registration_status, 'unknown') <> 'closed'
      and e.registration_url is not null then 1
    when e.registration_open_at > current_timestamp then 2
    when e.registration_close_at >= current_timestamp then 3
    else 4
  end as action_priority,
  case
    when coalesce(e.registration_open_at, '-infinity'::timestamptz) <= current_timestamp
      and coalesce(e.registration_close_at, 'infinity'::timestamptz) >= current_timestamp
      and coalesce(e.registration_status, 'unknown') <> 'closed'
      and e.registration_url is not null
      then coalesce(e.registration_close_at, e.start_at)
    when e.registration_open_at > current_timestamp then e.registration_open_at
    when e.registration_close_at >= current_timestamp then e.registration_close_at
    else e.start_at
  end as actionable_at
from techmeld_events e
where e.status = 'approved'
  and coalesce(e.registration_status, 'unknown') <> 'closed'
  and (coalesce(e.end_at, e.start_at) at time zone 'America/Los_Angeles')::date
      >= (current_timestamp at time zone 'America/Los_Angeles')::date
  and (
    (e.registration_close_at at time zone 'America/Los_Angeles')::date
      >= (current_timestamp at time zone 'America/Los_Angeles')::date
    or e.registration_open_at > current_timestamp
    or (e.registration_status = 'open' and e.registration_url is not null)
    or (
      e.registration_open_at is null and e.registration_close_at is null
      and e.registration_url is not null
      and (
        (e.start_at at time zone 'America/Los_Angeles')::date
          >= (current_timestamp at time zone 'America/Los_Angeles')::date
        or e.same_day_registration
      )
    )
  );

grant select on active_news, actionable_events to anon, authenticated;
