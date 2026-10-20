-- Move the visible left-sidebar profile fields into site_profile.
-- Run this once in Supabase SQL Editor for an existing project.

alter table public.site_profile
  add column if not exists sidebar_name text not null default '陈瑾辰(Jason)',
  add column if not exists sidebar_pronouns text not null default '男',
  add column if not exists sidebar_bio text not null default '好好学习，天天向上',
  add column if not exists sidebar_avatar_url text not null default '/images/sidebar-avatar.png',
  add column if not exists sidebar_website_url text not null default '',
  add column if not exists sidebar_github_url text not null default 'https://github.com/ichenjinchen';

comment on column public.site_profile.sidebar_name is 'Display name shown in the left sidebar.';
comment on column public.site_profile.sidebar_pronouns is 'Short descriptor shown below the sidebar name.';
comment on column public.site_profile.sidebar_bio is 'Short biography shown in the left sidebar.';
comment on column public.site_profile.sidebar_avatar_url is 'Left-sidebar avatar path or URL; independent from the resume avatar.';
comment on column public.site_profile.sidebar_website_url is 'Optional personal website URL shown in the left sidebar.';
comment on column public.site_profile.sidebar_github_url is 'GitHub profile URL shown in the left sidebar.';
