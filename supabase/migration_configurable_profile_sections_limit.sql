-- Make the number of profile sections shown on the overview page configurable.
-- Run this once in Supabase SQL Editor for an existing project.
-- 0 means "show every visible section"; 1-50 means "show at most this many".

alter table public.site_profile
  add column if not exists overview_profile_sections_limit smallint not null default 3;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.site_profile'::regclass
      and conname = 'site_profile_overview_profile_sections_limit_check'
  ) then
    alter table public.site_profile
      add constraint site_profile_overview_profile_sections_limit_check
      check (overview_profile_sections_limit between 0 and 50);
  end if;
end
$$;

comment on column public.site_profile.overview_profile_sections_limit is
  'Maximum visible profile sections on the overview page; 0 displays all.';
