-- Optional English fields for the public website's language switch.
-- Existing Chinese values remain unchanged; blank English values fall back to Chinese.

alter table public.site_profile
  add column if not exists school_en text not null default '',
  add column if not exists grade_en text not null default '',
  add column if not exists class_name_en text not null default '',
  add column if not exists location_en text not null default '',
  add column if not exists short_tagline_en text not null default '',
  add column if not exists sidebar_name_en text not null default '',
  add column if not exists sidebar_pronouns_en text not null default '',
  add column if not exists sidebar_bio_en text not null default '';

alter table public.profile_sections
  add column if not exists title_en text not null default '',
  add column if not exists subtitle_en text not null default '',
  add column if not exists body_markdown_en text not null default '';

alter table public.categories
  add column if not exists name_en text not null default '',
  add column if not exists description_en text not null default '';

alter table public.awards
  add column if not exists title_en text not null default '',
  add column if not exists result_en text not null default '',
  add column if not exists level_en text not null default '',
  add column if not exists description_en text not null default '';

alter table public.activities
  add column if not exists title_en text not null default '',
  add column if not exists description_en text not null default '';

comment on column public.profile_sections.body_markdown_en is 'Optional English Markdown; blank values fall back to the Chinese body_markdown.';
comment on column public.awards.title_en is 'Optional English award/event title; blank values fall back to the Chinese title.';
comment on column public.activities.title_en is 'Optional English activity title; blank values fall back to the Chinese title.';
