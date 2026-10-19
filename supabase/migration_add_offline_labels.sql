-- Add the database-controlled label used for in-person / offline items.
-- Run this once in Supabase SQL Editor for an existing project.

alter table public.awards
  add column if not exists is_offline boolean not null default false;

alter table public.activities
  add column if not exists is_offline boolean not null default false;
