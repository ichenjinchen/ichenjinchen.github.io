# 后端搭建 / 重建指南

站点的内容（个人资料、荣誉、活动）都存在 Supabase，网页是静态的，运行时直接读数据库。所以“在后台改内容”不需要重新编译、不需要 push，也不会影响 GitHub Pages 的发布。

> 现状提醒：`_config.yml` 里的项目 ref `cuvdudkqezbaxvbohhtv` 现在解析不到（DNS 返回 NXDOMAIN），那个项目已经不在了（被删或 ref 变了）。在重建之前，线上站点显示的是 HTML 里的静态兜底内容。下面第 1–3 步就是从零重建。

## 1. 建项目

1. 打开 <https://supabase.com/dashboard> 新建一个项目，区域选 Singapore（离大陆最近）。
2. 记下 **Project URL**（形如 `https://xxxx.supabase.co`）和 **Publishable key**（`sb_publishable_...`）。
3. 填进仓库根目录 `_config.yml`：

```yaml
supabase:
  project_url: "https://你的项目.supabase.co"
  publishable_key: "sb_publishable_..."
```

只能用 publishable key，不能把 `sb_secret_...` 或 service_role 写进前端。

## 2. 建表、导内容、开上传

Supabase Dashboard → **SQL Editor**，按顺序整段执行（都可以重复执行）：

| 顺序 | 文件 | 作用 |
| --- | --- | --- |
| 1 | `schema.sql` | 五张表 + RLS + `admin_users` 白名单表 |
| 2 | `migration_add_offline_labels.sql` | “线下”标记 |
| 3 | `migration_merge_study_tour.sql` | 研学与科技实践合并 |
| 4 | `migration_configurable_profile_sections_limit.sql` | 概览区块数量可配 |
| 5 | `migration_sidebar_profile_fields.sql` | 左侧栏配置字段 |
| 6 | `migration_add_english_content.sql` | 可选英文栏位 |
| 7 | `migration_proof_uploads.sql` | **获奖证明/活动照片上传 + 草稿发布**，同时创建 `resume-assets` 存储桶和访问策略 |
| 8 | `seed_content.sql` | 从仓库里的 CSV/PPT 生成的初始内容 |

## 3. 建管理员

1. Dashboard → **Authentication → Users → Add user**，填你的邮箱和密码（建议关掉 “Auto confirm” 后手动确认，或直接勾选自动确认）。
2. 复制这个用户的 **UID**，到 SQL Editor 执行：

```sql
insert into public.admin_users (user_id) values ('把用户 UID 粘在这里')
on conflict (user_id) do nothing;
```

3. 打开 `/admin/`，用这个邮箱密码登录。不在 `admin_users` 里的账号即使登录成功也会被踢出。

## 4. 上传功能怎么用

- 荣誉奖项 → 编辑 → “获奖证明”：一次可传多张奖状照片或 PDF，浏览器端自动压到长边 1600、WebP，单文件上限 10MB。
- 活动经历 → 编辑 → “活动照片”：同样支持多张。
- 存的是相对路径（`awards/202611/xxxx.webp`），前端拼成存储桶公开地址；删除记录不会自动删图，需要清理时到 Storage → `resume-assets` 手动删。
- 免费版 Storage 有 1GB 额度，按压缩后的体积够放好几年。

## 5. 草稿与发布

- “发布到站点”勾掉 = 草稿，站点不读；“在列表显示”控制是否出现在列表里（两者独立：可以先发布但暂时隐藏）。
- 线上只读 `is_published = true` 的记录；后台永远能看到全部。

## 6. 备份

- 数据：Dashboard → Database → Backups（免费版有每日备份），或每周在 SQL Editor 跑一次导出，把结果存本地。
- 图片：Storage → `resume-assets` → 定期打包下载。
- 内容也可以从 `/admin/` 手工复制，但批量恢复还是靠 SQL/备份更稳。
