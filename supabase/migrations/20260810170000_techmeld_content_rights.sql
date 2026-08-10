-- Copyright-safe article metadata and provenance.
alter table techmeld_sources
  add column if not exists terms_url text,
  add column if not exists robots_url text,
  add column if not exists rights_review_status text not null default 'pending'
    check (rights_review_status in ('pending', 'approved', 'restricted', 'prohibited')),
  add column if not exists terms_reviewed_at timestamptz,
  add column if not exists attribution_requirements text,
  add column if not exists permitted_use text;

alter table techmeld_articles
  add column if not exists publisher text,
  add column if not exists article_language text not null default 'en',
  add column if not exists why_it_matters text,
  add column if not exists summary_method text not null default 'metadata_template'
    check (summary_method in ('ai', 'editorial', 'metadata_template')),
  add column if not exists image_rights_status text not null default 'not_cleared'
    check (image_rights_status in ('not_cleared', 'licensed', 'publisher_permitted', 'original')),
  add column if not exists content_rights_status text not null default 'metadata_only'
    check (content_rights_status in ('metadata_only', 'licensed'));

update techmeld_articles
set publisher = coalesce(publisher, source_name),
    why_it_matters = coalesce(
      why_it_matters,
      'This development may affect technical roadmaps, vendor choices, and operating practices. The original reporting remains the authoritative source.'
    ),
    summary = source_name || ' reports “' || title || '.” TechMeld indexed this development from source metadata. Consult the publisher’s original article for its reporting, evidence, details, and complete context.',
    summary_method = 'metadata_template',
    image_url = null,
    image_rights_status = 'not_cleared',
    content_rights_status = 'metadata_only'
where content_rights_status = 'metadata_only';

alter table techmeld_articles alter column publisher set not null;
alter table techmeld_articles alter column why_it_matters set not null;
