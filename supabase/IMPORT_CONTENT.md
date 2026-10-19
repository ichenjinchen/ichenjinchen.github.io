# 导入个人主页内容

`seed_content.sql` 是根据当前 `_data/awards.csv`、`_data/activities.csv` 与简历 PPT/PDF 生成的初始内容数据。

## 在 Supabase 中执行

1. 确认已经执行过 `schema.sql`，并且 Supabase Auth 中存在管理员邮箱 `ichenjinchen@163.com`。
2. 如果项目已经执行过旧版 `schema.sql`，先执行同目录下的 `migration_add_offline_labels.sql`，给荣誉和活动增加可配置的“线下”字段。
3. 执行同目录下的 `migration_merge_study_tour.sql`，把“研学”和“科技实践”合并为“研学实践”，并迁移已有活动。
4. 打开 Supabase Dashboard → **SQL Editor** → **New query**。
5. 打开同目录下的 `seed_content.sql`，复制全部内容到 SQL Editor，点击 **Run**。
6. 执行下面的核对查询：

```sql
select count(*) as profile_sections from public.profile_sections;
select count(*) as awards from public.awards;
select count(*) as activities from public.activities;

select c.name, count(a.id) as total
from public.categories c
left join public.awards a on a.category_id = c.id and a.is_visible = true
where c.content_type = 'award'
group by c.id, c.name, c.sort_order
order by c.sort_order;

select c.name, count(a.id) as total
from public.categories c
left join public.activities a on a.category_id = c.id and a.is_visible = true
where c.content_type = 'activity'
group by c.id, c.name, c.sort_order
order by c.sort_order;
```

当前仓库资料生成的预期数量为：`profile_sections = 8`、`awards = 65`、`activities = 11`。如果此前已经导入过一部分内容，数量可能不同；脚本对相同日期、标题和结果的荣誉，以及相同日期和标题的活动不会重复插入。

## 连接网站

数据导入成功后，还需要把 Supabase 的公开浏览器配置填入仓库根目录的 `_config.yml`：

```yaml
supabase:
  project_url: "https://你的项目.supabase.co"
  publishable_key: "sb_publishable_..."
```

从 Supabase Dashboard 的 **Settings → API Keys** 中复制 Project URL 和 **Publishable key**。Project URL 应该是 `https://你的项目.supabase.co`，不要附加 `/rest/v1/`。这里只能填写以 `sb_publishable_` 开头的公开 Publishable key，不能填写 `sb_secret_...` 或旧的 `service_role` key。配置随网站代码发布一次后，之后在 `/admin/` 修改内容会直接写入数据库，不需要重新编译网站。

## 数据来源和优先级

- CSV 中已有、但 PPT/PDF 有更准确名称的条目，以 PPT/PDF 为准，例如 TOEFL Junior、CCF GESP、电子学会 C++、CSP-J、NOC 等。
- PPT/PDF 中新增、CSV 没有的条目会追加，例如“思维100”决赛、袋鼠数学 G5、SASMO、华数国际、YMO 以及 2026 年的三段研学经历。
- 初始置顶项使用 PPT/PDF 中的重点成果；导入后可以直接在管理界面调整 `is_pinned` 和 `pin_order`。
- 个人描述存储在 `profile_sections.body_markdown`，支持 Markdown；修改后不需要重新编译这份数据脚本。

## 后续更新

需要重新合并本地简历资料时，在仓库根目录运行：

```bash
ruby supabase/generate_content_seed.rb > supabase/seed_content.sql
```

然后重新检查 SQL，再在 Supabase SQL Editor 执行。`profile_sections` 会按 `section_key` 更新；荣誉和活动使用去重条件追加，已经在管理界面手工修改过的条目建议不要再次用整份 seed 覆盖。
