-- Chen Jinchen personal site: initial Supabase schema.
-- Run this file in Supabase SQL Editor after creating the Auth user.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Core content tables
-- ---------------------------------------------------------------------------

create table if not exists public.site_profile (
  id smallint primary key default 1 check (id = 1),
  name text not null default '陈瑾辰',
  english_name text not null default '',
  birthday_label text not null default '',
  school text not null default '',
  grade text not null default '',
  class_name text not null default '',
  location text not null default '',
  phone text not null default '',
  email text not null default '',
  avatar_url text not null default '',
  short_tagline text not null default '',
  seo_description text not null default '',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.profile_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null,
  subtitle text not null default '',
  body_markdown text not null default '',
  section_type text not null default 'rich_text'
    check (section_type in ('rich_text', 'rich_text_image')),
  image_url text not null default '',
  sort_order integer not null default 1000,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  content_type text not null
    check (content_type in ('award', 'activity')),
  name text not null,
  slug text not null,
  description text not null default '',
  accent_color text not null default 'gold'
    check (accent_color in ('gold', 'blue', 'green', 'purple', 'gray')),
  sort_order integer not null default 1000,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (content_type, slug)
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  display_date text not null default '',
  sort_date date,
  title text not null,
  result text not null default '',
  level text not null default '',
  description text not null default '',
  certificate_url text not null default '',
  is_pinned boolean not null default false,
  is_offline boolean not null default false,
  pin_order integer not null default 1000,
  sort_order integer not null default 1000,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  display_date text not null default '',
  sort_date date,
  title text not null,
  description text not null default '',
  image_paths text[] not null default '{}'::text[],
  is_pinned boolean not null default false,
  is_offline boolean not null default false,
  pin_order integer not null default 1000,
  sort_order integer not null default 1000,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- The single-user allowlist. It is intentionally separate from public profile data.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes for the public read queries and admin lists
-- ---------------------------------------------------------------------------

create index if not exists profile_sections_order_idx
  on public.profile_sections (is_visible, sort_order);

create index if not exists categories_order_idx
  on public.categories (content_type, is_visible, sort_order);

create index if not exists awards_listing_idx
  on public.awards (category_id, is_visible, is_pinned, pin_order, sort_date, sort_order);

create index if not exists activities_listing_idx
  on public.activities (category_id, is_visible, is_pinned, pin_order, sort_date, sort_order);

-- ---------------------------------------------------------------------------
-- Updated-at triggers
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_profile_updated_at on public.site_profile;
create trigger site_profile_updated_at
before update on public.site_profile
for each row execute function public.touch_updated_at();

drop trigger if exists profile_sections_updated_at on public.profile_sections;
create trigger profile_sections_updated_at
before update on public.profile_sections
for each row execute function public.touch_updated_at();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at
before update on public.categories
for each row execute function public.touch_updated_at();

drop trigger if exists awards_updated_at on public.awards;
create trigger awards_updated_at
before update on public.awards
for each row execute function public.touch_updated_at();

drop trigger if exists activities_updated_at on public.activities;
create trigger activities_updated_at
before update on public.activities
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Admin helper and initial data
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- The Auth user must exist first. If it does not exist yet, this inserts zero
-- rows; rerun this statement after creating the user.
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('ichenjinchen@163.com')
on conflict (user_id) do nothing;

insert into public.site_profile (
  id,
  name,
  avatar_url,
  email,
  location
)
values (
  1,
  '陈瑾辰',
  '/images/portrait.png',
  'ichenjinchen@163.com',
  '上海市'
)
on conflict (id) do nothing;

-- Initial categories. Rerunning the schema will not overwrite later edits.
insert into public.categories (content_type, name, slug, sort_order, accent_color)
values
  ('award', '数学', 'mathematics', 10, 'gold'),
  ('award', '编程与信息学', 'programming', 20, 'blue'),
  ('award', '英语', 'english', 30, 'green'),
  ('award', '校内荣誉', 'school', 40, 'purple'),
  ('award', '艺术与综合素质', 'arts-and-well-rounded', 50, 'gray'),
  ('award', '其他', 'other', 100, 'gray'),
  ('activity', '研学实践', 'study-tour', 10, 'gold'),
  ('activity', '公益实践', 'public-service', 30, 'green'),
  ('activity', '校园活动', 'school-activities', 40, 'purple'),
  ('activity', '其他', 'other', 100, 'gray')
on conflict (content_type, slug) do nothing;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.site_profile enable row level security;
alter table public.profile_sections enable row level security;
alter table public.categories enable row level security;
alter table public.awards enable row level security;
alter table public.activities enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can read profile" on public.site_profile;
create policy "public can read profile"
on public.site_profile
for select
to anon, authenticated
using (true);

drop policy if exists "public can read visible profile sections" on public.profile_sections;
create policy "public can read visible profile sections"
on public.profile_sections
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "public can read visible categories" on public.categories;
create policy "public can read visible categories"
on public.categories
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "public can read visible awards" on public.awards;
create policy "public can read visible awards"
on public.awards
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "public can read visible activities" on public.activities;
create policy "public can read visible activities"
on public.activities
for select
to anon, authenticated
using (is_visible = true);

drop policy if exists "admins can manage profile" on public.site_profile;
create policy "admins can manage profile"
on public.site_profile
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage profile sections" on public.profile_sections;
create policy "admins can manage profile sections"
on public.profile_sections
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage categories" on public.categories;
create policy "admins can manage categories"
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage awards" on public.awards;
create policy "admins can manage awards"
on public.awards
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can manage activities" on public.activities;
create policy "admins can manage activities"
on public.activities
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "admins can read own membership" on public.admin_users;
create policy "admins can read own membership"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

-- Explicit API grants. RLS still decides which rows each role may use.
grant select on public.site_profile, public.profile_sections, public.categories,
  public.awards, public.activities to anon, authenticated;

grant insert, update, delete on public.site_profile, public.profile_sections,
  public.categories, public.awards, public.activities to authenticated;

revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;

grant execute on function public.is_admin() to anon, authenticated;
