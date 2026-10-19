-- Merge the activity categories "研学" and "科技实践" into "研学实践".
-- Safe to run after schema.sql and before or after seed_content.sql.
begin;

update public.site_profile
set avatar_url = '/images/portrait.png'
where id = 1
  and coalesce(avatar_url, '') = '';

update public.categories
set name = '研学实践',
    description = coalesce(description, '科技、校园与社会实践的研学记录。')
where content_type = 'activity'
  and slug = 'study-tour';

update public.activities as activity
set category_id = study.id
from public.categories as technology
join public.categories as study
  on study.content_type = 'activity'
 and study.slug = 'study-tour'
where technology.content_type = 'activity'
  and technology.slug = 'technology'
  and activity.category_id = technology.id;

delete from public.categories
where content_type = 'activity'
  and slug = 'technology';

commit;
