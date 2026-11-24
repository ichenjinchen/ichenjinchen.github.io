-- 获奖证明 / 活动配图上传 + 草稿发布
-- 在 Supabase Dashboard → SQL Editor 里整段执行一次。可重复执行（幂等）。
-- 依赖：schema.sql 已执行、admin_users 里已有你的管理员账号。

-- ---------------------------------------------------------------------------
-- 1) 字段
-- ---------------------------------------------------------------------------
alter table public.awards
  add column if not exists certificate_paths text[] not null default '{}'::text[],
  add column if not exists is_published boolean not null default true,
  add column if not exists updated_by uuid;

alter table public.activities
  add column if not exists is_published boolean not null default true,
  add column if not exists updated_by uuid;

-- 已存在的历史数据默认按“已发布”处理
update public.awards set is_published = true where is_published is null;
update public.activities set is_published = true where is_published is null;

-- ---------------------------------------------------------------------------
-- 2) 存储桶（public 读、仅管理员写；单文件 10MB，只收图片和 PDF）
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resume-assets',
  'resume-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- 3) storage.objects 策略：任何人可读，只有 admin_users 里的账号可写/删
-- ---------------------------------------------------------------------------
drop policy if exists "resume-assets public read" on storage.objects;
create policy "resume-assets public read"
  on storage.objects for select
  using (bucket_id = 'resume-assets');

drop policy if exists "resume-assets admin insert" on storage.objects;
create policy "resume-assets admin insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'resume-assets'
    and exists (select 1 from public.admin_users u where u.user_id = auth.uid())
  );

drop policy if exists "resume-assets admin update" on storage.objects;
create policy "resume-assets admin update"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'resume-assets'
    and exists (select 1 from public.admin_users u where u.user_id = auth.uid())
  )
  with check (
    bucket_id = 'resume-assets'
    and exists (select 1 from public.admin_users u where u.user_id = auth.uid())
  );

drop policy if exists "resume-assets admin delete" on storage.objects;
create policy "resume-assets admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'resume-assets'
    and exists (select 1 from public.admin_users u where u.user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 4) 核对
-- ---------------------------------------------------------------------------
-- select column_name, data_type
-- from information_schema.columns
-- where table_schema = 'public' and table_name in ('awards', 'activities')
--   and column_name in ('certificate_paths', 'is_published', 'updated_by');
-- select id, name, public, file_size_limit from storage.buckets where id = 'resume-assets';
