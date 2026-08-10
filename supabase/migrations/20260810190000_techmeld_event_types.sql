alter table techmeld_events
  add column if not exists event_type text not null default 'event'
    check (event_type in ('event', 'conference', 'webinar', 'workshop', 'meetup', 'hackathon', 'community'));

create index if not exists idx_techmeld_events_event_type
  on techmeld_events (event_type);

