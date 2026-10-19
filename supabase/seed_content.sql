-- Generated from _data/*.csv plus the 2026 PPT/PDF highlights.
-- Run after supabase/schema.sql. Profile sections upsert; awards and activities insert only when missing.

-- Latest profile values from the PPT/PDF.
insert into public.site_profile (
  id, name, english_name, birthday_label, school, grade, location,
  avatar_url,
  phone, email, short_tagline, seo_description
) values (
  1,
  '陈瑾辰',
  'JASON CHEN',
  '2016年7月',
  '浦东新区明珠小学A区',
  '五年级',
  '上海',
  '/images/portrait.png',
  '18017264048',
  'ichenjinchen@163.com',
  '热爱数学、编程与创造',
  '陈瑾辰的个人主页，记录学习、竞赛、研学和成长经历。'
) on conflict (id) do update set
  name = excluded.name,
  english_name = excluded.english_name,
  birthday_label = excluded.birthday_label,
  school = excluded.school,
  grade = excluded.grade,
  location = excluded.location,
  avatar_url = excluded.avatar_url,
  phone = excluded.phone,
  email = excluded.email,
  short_tagline = excluded.short_tagline,
  seo_description = excluded.seo_description;
-- Markdown profile sections.
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'overview',
  '个人概览',
  'ABOUT ME',
  '陈瑾辰生于 **2016 年 7 月**，就读于上海市浦东新区明珠小学 A 区五年级，担任中队长。

他热爱数学、编程与创造，学习自律、性格开朗，在竞赛、艺术与公益实践中持续成长。
',
  'rich_text_image',
  '/images/gitar1.png',
  10,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'academic',
  '学业表现',
  'ACADEMIC RECORD',
  '入学以来学科全优，学习功底扎实、习惯自律，历年总分排名 **第 1 / 40**。

| 年级 | 语文 | 数学 | 英语 |
| --- | ---: | ---: | ---: |
| 四上 | 97 | 100 | 98.5 |
| 四下 | 94 | 99.5 | 98 |

校内荣誉包括 **“智慧阅读之星”**、**“红领巾广播员”** 和 **“行规好少年”**。
',
  'rich_text',
  '',
  20,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'mathematics',
  '数学与算法',
  'MATHEMATICS',
  '热爱数学与算法，自学小学奥数及部分初高中数学知识，四下裸考进入 XES 竞赛班 MC-A 及夏令营、HZ 科创班。

已获得 **10+ 项数学竞赛奖项**，完整记录见荣誉页面。
',
  'rich_text',
  '',
  30,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'english',
  '英语能力',
  'ENGLISH',
  '通过 TOEFL Junior（小托福），总分 **850 分**（满分 900 分）。

自学完成《新概念英语》一、二册，通过全国新概念英语等级考试第三级（NCTE Level 3）。
',
  'rich_text',
  '',
  40,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'programming',
  '信息学编程',
  'CODING & CS',
  '沿 **Scratch → Python → C++** 持续进阶。三年级获得 **CCF CSP-J 初赛一等奖**，并通过全国计算机等级考试二级 C++。

四年级通过 **CCF GESP C++ 五级** 和 **电子学会 C++ 六级**，另获全国、市、区级编程与人工智能相关奖项 **20 余项**。
',
  'rich_text',
  '',
  50,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'practice',
  '社会实践与研学足迹',
  'PRACTICE & STUDY TOUR',
  '积极参与人工智能、科技、公益和校园实践，持续记录研学足迹，在真实场景中了解科学、技术与社会。

代表性经历包括 AI 人形机器人开发、浦东 AI 编程专项培训、复旦大学“科学家精神”研学和上海交通大学 AI 之旅研学。
',
  'rich_text',
  '',
  60,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'well-rounded',
  '综合素质',
  'WELL-ROUNDED',
  '通过社会艺术水平考级漫画八级，获得朵云杯全国少儿书法绘画二等奖、上海市头脑奥林匹克 OM 大赛一等奖等荣誉。

热爱绘画、篮球和吉他，积极参与公益、科技与话剧实践，性格开朗进取，具备较强的协作能力与社会责任感。
',
  'rich_text',
  '',
  70,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
insert into public.profile_sections (
  section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
) values (
  'family',
  '家庭背景',
  'FAMILY',
  '家庭秉持 **“五育并重”** 理念。父亲为清华大学博士，创办 AI 企业；母亲为浙江大学硕士，任职世界 500 强外企经理。

和睦的家庭氛围培养了他乐观钻研的态度，也让他立志成为对国家与社会有用的人。
',
  'rich_text',
  '',
  80,
  true
) on conflict (section_key) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  body_markdown = excluded.body_markdown,
  section_type = excluded.section_type,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order;
-- Awards merged from the CSV and PPT/PDF.
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.05',
  '2026-05-01',
  '“思维100”决赛·四年级',
  '二等奖',
  '市级',
  '',
  true,
  1,
  1,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.05'
    and existing.title = '“思维100”决赛·四年级'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.05',
  '2026-05-01',
  'SASMO 数学奥赛·四年级',
  '金奖',
  '全国',
  '',
  true,
  2,
  2,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.05'
    and existing.title = 'SASMO 数学奥赛·四年级'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.04',
  '2026-04-01',
  '袋鼠数学 G5·跨级参赛',
  '超级金奖',
  '全国',
  '',
  true,
  3,
  3,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.04'
    and existing.title = '袋鼠数学 G5·跨级参赛'
    and existing.result = '超级金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.04',
  '2026-04-01',
  '华数国际·初级组',
  '一等奖',
  '全国',
  '',
  true,
  4,
  4,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.04'
    and existing.title = '华数国际·初级组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.04',
  '2026-04-01',
  '“走美杯”陈省身学思奖',
  '金奖',
  '市级',
  '',
  true,
  5,
  5,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.04'
    and existing.title = '“走美杯”陈省身学思奖'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.04',
  '2026-04-01',
  '希望杯国际数学邀请赛四年级个人组',
  '一等奖',
  '全国',
  '',
  true,
  6,
  6,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.04'
    and existing.title = '希望杯国际数学邀请赛四年级个人组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2026.03',
  '2026-03-01',
  '电子学会软件编程等级·C++',
  '六级',
  '全国',
  '',
  true,
  7,
  7,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.03'
    and existing.title = '电子学会软件编程等级·C++'
    and existing.result = '六级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2026.03',
  '2026-03-01',
  'CCF GESP 等级认证·C++',
  '五级',
  '全国',
  '',
  true,
  8,
  8,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.03'
    and existing.title = 'CCF GESP 等级认证·C++'
    and existing.result = '五级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2026.03',
  '2026-03-01',
  '第47届世界头脑奥林匹克选拔活动',
  '二等奖',
  '全国',
  '',
  false,
  1000,
  9,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.03'
    and existing.title = '第47届世界头脑奥林匹克选拔活动'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2026.03',
  '2026-03-01',
  '上海市头脑奥林匹克 OM 大赛',
  '一等奖',
  '市级',
  '',
  true,
  10,
  10,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.03'
    and existing.title = '上海市头脑奥林匹克 OM 大赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'english'),
  '2026.02',
  '2026-02-01',
  'TOEFL Junior（小托福）',
  '850分',
  '',
  '总分 850 分，满分 900 分。',
  true,
  11,
  11,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.02'
    and existing.title = 'TOEFL Junior（小托福）'
    and existing.result = '850分'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2026.02',
  '2026-02-01',
  '上海市计算机学会竞赛平台2月月赛',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  12,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.02'
    and existing.title = '上海市计算机学会竞赛平台2月月赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.01',
  '2026-01-01',
  'AMC8',
  'TOP10%',
  '全国',
  '',
  false,
  1000,
  13,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.01'
    and existing.title = 'AMC8'
    and existing.result = 'TOP10%'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'school'),
  '2026.01',
  '2026-01-01',
  '“行规好少年”',
  '',
  '校级',
  '',
  false,
  1000,
  14,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.01'
    and existing.title = '“行规好少年”'
    and existing.result = ''
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.12',
  '2025-12-01',
  '上海中小学生人工智能算法设计·C++',
  '三等奖',
  '市级',
  '',
  false,
  1000,
  15,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.12'
    and existing.title = '上海中小学生人工智能算法设计·C++'
    and existing.result = '三等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2025.12',
  '2025-12-01',
  'DI 上海青少年创新思维竞赛·团队即时挑战',
  '一等奖',
  '区级',
  '',
  true,
  16,
  16,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.12'
    and existing.title = 'DI 上海青少年创新思维竞赛·团队即时挑战'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2025.11',
  '2025-11-01',
  '社会艺术水平考级·漫画',
  '八级',
  '全国',
  '',
  true,
  17,
  17,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.11'
    and existing.title = '社会艺术水平考级·漫画'
    and existing.result = '八级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2025.11',
  '2025-11-01',
  '思维100 G4/5',
  '入围奖',
  '',
  '',
  false,
  1000,
  18,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.11'
    and existing.title = '思维100 G4/5'
    and existing.result = '入围奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.08',
  '2025-08-01',
  '全国青少年信息素养大赛全国总决赛算法创意实践挑战赛小学组',
  '优秀奖',
  '全国',
  '',
  false,
  1000,
  19,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.08'
    and existing.title = '全国青少年信息素养大赛全国总决赛算法创意实践挑战赛小学组'
    and existing.result = '优秀奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.08',
  '2025-08-01',
  '蓝桥杯大赛C++初级创意编程组',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  20,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.08'
    and existing.title = '蓝桥杯大赛C++初级创意编程组'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.07',
  '2025-07-01',
  '全国青少年信息素养大赛·复赛',
  '一等奖',
  '市级',
  '',
  true,
  21,
  21,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.07'
    and existing.title = '全国青少年信息素养大赛·复赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.06',
  '2025-06-01',
  '第五届全国青少年科技教育成果展示大赛AI+程序算法省级区域赛',
  '一等奖',
  '市级',
  '',
  false,
  1000,
  22,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.06'
    and existing.title = '第五届全国青少年科技教育成果展示大赛AI+程序算法省级区域赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2025.05',
  '2025-05-01',
  '上海头脑奥林匹克创新大赛浦东区赛',
  '二等奖',
  '区级',
  '',
  false,
  1000,
  23,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.05'
    and existing.title = '上海头脑奥林匹克创新大赛浦东区赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.03',
  '2025-03-01',
  '全国计算机等级考试·C++',
  '二级',
  '全国',
  '',
  true,
  24,
  24,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.03'
    and existing.title = '全国计算机等级考试·C++'
    and existing.result = '二级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.03',
  '2025-03-01',
  '电子学会青少年软件编程等级考试C++',
  '三级',
  '全国',
  '',
  false,
  1000,
  25,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.03'
    and existing.title = '电子学会青少年软件编程等级考试C++'
    and existing.result = '三级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.01',
  '2025-01-01',
  '上海青少年编程与机器人挑战',
  '二等奖',
  '市级',
  '',
  true,
  26,
  26,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.01'
    and existing.title = '上海青少年编程与机器人挑战'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2025.01',
  '2025-01-01',
  '上海市少年儿童乐创挑战系列活动',
  '三等奖',
  '市级',
  '',
  false,
  1000,
  27,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.01'
    and existing.title = '上海市少年儿童乐创挑战系列活动'
    and existing.result = '三等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2025.01',
  '2025-01-01',
  '上海市中小学生人工智能算法设计活动C++小学组',
  '三等奖',
  '市级',
  '',
  false,
  1000,
  28,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2025.01'
    and existing.title = '上海市中小学生人工智能算法设计活动C++小学组'
    and existing.result = '三等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2024.12',
  '2024-12-01',
  'DI上海青少年创新思维竞赛活动浦东区赛',
  '三等奖',
  '区级',
  '',
  false,
  1000,
  29,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.12'
    and existing.title = 'DI上海青少年创新思维竞赛活动浦东区赛'
    and existing.result = '三等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'school'),
  '2024.12',
  '2024-12-01',
  '2024年“智慧阅读之星”（四年级）',
  '',
  '校级',
  '',
  false,
  1000,
  30,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.12'
    and existing.title = '2024年“智慧阅读之星”（四年级）'
    and existing.result = ''
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.10',
  '2024-10-01',
  'CCF CSP-J 初赛',
  '一等奖',
  '全国',
  '',
  true,
  31,
  31,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.10'
    and existing.title = 'CCF CSP-J 初赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.08',
  '2024-08-01',
  'NOC 信息技术创新与实践·全国决赛',
  '二等奖',
  '全国',
  '',
  true,
  32,
  32,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.08'
    and existing.title = 'NOC 信息技术创新与实践·全国决赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.07',
  '2024-07-01',
  '青科赛 AI+程序算法总决赛',
  '二等奖',
  '全国',
  '',
  true,
  33,
  33,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.07'
    and existing.title = '青科赛 AI+程序算法总决赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.07',
  '2024-07-01',
  '全国青少年信息素养大赛华东赛区（上海）智能算法应用挑战赛小学组（全年级）',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  34,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.07'
    and existing.title = '全国青少年信息素养大赛华东赛区（上海）智能算法应用挑战赛小学组（全年级）'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.06',
  '2024-06-01',
  '全国中小学信息技术创新与实践大赛（NOC）复赛童创AI编程赛项小学低年级组',
  '一等奖',
  '全国',
  '',
  false,
  1000,
  35,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.06'
    and existing.title = '全国中小学信息技术创新与实践大赛（NOC）复赛童创AI编程赛项小学低年级组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.05',
  '2024-05-01',
  '第四届全国青少年科技教育成果展示大赛AI+程序算法省级区域赛',
  '一等奖',
  '市级',
  '',
  false,
  1000,
  36,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.05'
    and existing.title = '第四届全国青少年科技教育成果展示大赛AI+程序算法省级区域赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2024.04',
  '2024-04-01',
  'CCF中国计算机学会GESP C++ 三级',
  '优秀(92)',
  '',
  '',
  false,
  1000,
  37,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.04'
    and existing.title = 'CCF中国计算机学会GESP C++ 三级'
    and existing.result = '优秀(92)'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'english'),
  '2024.04',
  '2024-04-01',
  'KET',
  'Pass',
  '',
  '',
  false,
  1000,
  38,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.04'
    and existing.title = 'KET'
    and existing.result = 'Pass'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2024.01',
  '2024-01-01',
  '中华思想文化术语大赛',
  '银奖',
  '全国',
  '',
  false,
  1000,
  39,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '中华思想文化术语大赛'
    and existing.result = '银奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2024.01',
  '2024-01-01',
  '春蕾杯全国小学生思维邀请赛二年级组',
  '三等奖',
  '全国',
  '',
  false,
  1000,
  40,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '春蕾杯全国小学生思维邀请赛二年级组'
    and existing.result = '三等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2024.01',
  '2024-01-01',
  '春蕾杯全国小学生阅读邀请赛二年级组',
  '一等奖',
  '全国',
  '',
  false,
  1000,
  41,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '春蕾杯全国小学生阅读邀请赛二年级组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'english'),
  '2024.01',
  '2024-01-01',
  '春蕾杯全国小学生英语邀请赛二年级组',
  '二等奖',
  '全国',
  '',
  false,
  1000,
  42,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '春蕾杯全国小学生英语邀请赛二年级组'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2024.01',
  '2024-01-01',
  '春蕾杯全国小学生科普邀请赛二年级组',
  '一等奖',
  '全国',
  '',
  false,
  1000,
  43,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '春蕾杯全国小学生科普邀请赛二年级组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2024.01',
  '2024-01-01',
  '数学大王国际邀请赛小学二年级上海市赛',
  '一等奖',
  '市级',
  '',
  false,
  1000,
  44,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '数学大王国际邀请赛小学二年级上海市赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'school'),
  '2024.01',
  '2024-01-01',
  '2023年“智慧阅读之星”（二年级）',
  '',
  '校级',
  '',
  false,
  1000,
  45,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = '2023年“智慧阅读之星”（二年级）'
    and existing.result = ''
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2024.01',
  '2024-01-01',
  'YMO世界青少年奥林匹克数学竞赛（中国区）全国总决赛二年级组',
  '金奖',
  '全国',
  '',
  false,
  1000,
  46,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2024.01'
    and existing.title = 'YMO世界青少年奥林匹克数学竞赛（中国区）全国总决赛二年级组'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2023.12',
  '2023-12-01',
  'YMO世界青少年奥林匹克数学竞赛（中国区）上海赛区复赛二年级组',
  '一等奖',
  '市级',
  '',
  false,
  1000,
  47,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.12'
    and existing.title = 'YMO世界青少年奥林匹克数学竞赛（中国区）上海赛区复赛二年级组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'english'),
  '2023.11',
  '2023-11-01',
  '新概念英语等级考试（NCTE）Level 3',
  'Pass',
  '',
  '',
  false,
  1000,
  48,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.11'
    and existing.title = '新概念英语等级考试（NCTE）Level 3'
    and existing.result = 'Pass'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.10',
  '2023-10-01',
  '全国青少年 AI 创新挑战赛',
  '金奖',
  '全国',
  '',
  true,
  49,
  49,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.10'
    and existing.title = '全国青少年 AI 创新挑战赛'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.10',
  '2023-10-01',
  '第六届青少年人工智能创新大赛 AI创意编程-软件程序设计Python（小学组）',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  50,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.10'
    and existing.title = '第六届青少年人工智能创新大赛 AI创意编程-软件程序设计Python（小学组）'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.09',
  '2023-09-01',
  'CCF中国计算机学会GESP Python',
  '二级',
  '全国',
  '',
  false,
  1000,
  51,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.09'
    and existing.title = 'CCF中国计算机学会GESP Python'
    and existing.result = '二级'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2023.09',
  '2023-09-01',
  '朵云杯全国少儿书法绘画·绘画',
  '二等奖',
  '全国',
  '',
  false,
  1000,
  52,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.09'
    and existing.title = '朵云杯全国少儿书法绘画·绘画'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.07',
  '2023-07-01',
  '第六届全国青少年人工智能创新挑战赛 选拔赛 编程创作与信息学专项赛',
  '一等奖',
  '全国',
  '',
  false,
  1000,
  53,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.07'
    and existing.title = '第六届全国青少年人工智能创新挑战赛 选拔赛 编程创作与信息学专项赛'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.07',
  '2023-07-01',
  'ICODE第五届国际青少年编程竞赛（中国区）决赛 图形化初级组',
  '明日之星',
  '全国',
  '',
  false,
  1000,
  54,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.07'
    and existing.title = 'ICODE第五届国际青少年编程竞赛（中国区）决赛 图形化初级组'
    and existing.result = '明日之星'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.07',
  '2023-07-01',
  '第二届上海市青少年人工智能与编程实践活动 编程项目小学组',
  '一等奖',
  '市级',
  '',
  false,
  1000,
  55,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.07'
    and existing.title = '第二届上海市青少年人工智能与编程实践活动 编程项目小学组'
    and existing.result = '一等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.07',
  '2023-07-01',
  '全国青少年信息素养大赛华东赛区（上海） 图形化编程挑战赛 小学组',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  56,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.07'
    and existing.title = '全国青少年信息素养大赛华东赛区（上海） 图形化编程挑战赛 小学组'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'arts-and-well-rounded'),
  '2023.06',
  '2023-06-01',
  '全国中小学生语文综合能力展示活动省级小低组',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  57,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.06'
    and existing.title = '全国中小学生语文综合能力展示活动省级小低组'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2023.06',
  '2023-06-01',
  '数学大王国际邀请赛小学一年级上海市赛',
  '二等奖',
  '市级',
  '',
  false,
  1000,
  58,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.06'
    and existing.title = '数学大王国际邀请赛小学一年级上海市赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2023.06',
  '2023-06-01',
  '袋鼠数学 Grade 1 Level A',
  '银奖',
  '',
  '',
  false,
  1000,
  59,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.06'
    and existing.title = '袋鼠数学 Grade 1 Level A'
    and existing.result = '银奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.05',
  '2023-05-01',
  'ICODE第五届国际青少年编程竞赛（中国区）预选赛 图形化初级组',
  '金奖',
  '',
  '',
  false,
  1000,
  60,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.05'
    and existing.title = 'ICODE第五届国际青少年编程竞赛（中国区）预选赛 图形化初级组'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.05',
  '2023-05-01',
  '第三届全国青少年科技教育成果展示大赛区域赛 ICODE专项赛',
  '二等奖',
  '',
  '',
  false,
  1000,
  61,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.05'
    and existing.title = '第三届全国青少年科技教育成果展示大赛区域赛 ICODE专项赛'
    and existing.result = '二等奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'programming'),
  '2023.04',
  '2023-04-01',
  '中国电子学会青少年软件编程等级考试图形化编程',
  '四级(最高级)',
  '',
  '',
  false,
  1000,
  62,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2023.04'
    and existing.title = '中国电子学会青少年软件编程等级考试图形化编程'
    and existing.result = '四级(最高级)'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'mathematics'),
  '2026.07',
  '2026-07-01',
  'YMO 全国总决赛·四年级组',
  '金奖',
  '',
  '',
  true,
  63,
  63,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.07'
    and existing.title = 'YMO 全国总决赛·四年级组'
    and existing.result = '金奖'
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'school'),
  '2026.06',
  '2026-06-01',
  '“智慧阅读之星”（四年级）',
  '',
  '校级',
  '',
  true,
  64,
  64,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.06'
    and existing.title = '“智慧阅读之星”（四年级）'
    and existing.result = ''
);
insert into public.awards (
  category_id, display_date, sort_date, title, result, level, description,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'award' and slug = 'school'),
  '2026.05',
  '2026-05-01',
  '“红领巾广播员”',
  '',
  '校级',
  '',
  true,
  65,
  65,
  true
where not exists (
  select 1 from public.awards existing
  where existing.display_date = '2026.05'
    and existing.title = '“红领巾广播员”'
    and existing.result = ''
);
-- Activities merged from the CSV and PPT/PDF.
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2026.05',
  '2026-05-01',
  '复旦大学“科学家精神”研学',
  '走进复旦校园，聆听科研故事，感受求真务实的科学家精神。',
  '{}'::text[],
  true,
  1,
  1,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2026.05'
    and existing.title = '复旦大学“科学家精神”研学'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2026.04',
  '2026-04-01',
  '浦东 AI 人工智能编程专项培训',
  '参加浦东新区专项培训，系统学习人工智能编程方法。',
  '{}'::text[],
  true,
  2,
  2,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2026.04'
    and existing.title = '浦东 AI 人工智能编程专项培训'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2025.11',
  '2025-11-01',
  'AI人形机器人开发与实践活动',
  '动手参与人形机器人的编程与开发实践，近距离体验具身智能。',
  ARRAY['/images/activities/airobot.png']::text[],
  false,
  1000,
  3,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2025.11'
    and existing.title = 'AI人形机器人开发与实践活动'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2025.06',
  '2025-06-01',
  'C919航空研学',
  '',
  ARRAY['/images/activities/C919.png']::text[],
  false,
  1000,
  4,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2025.06'
    and existing.title = 'C919航空研学'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2025.02',
  '2025-02-01',
  '上海自然博物馆研学',
  '',
  ARRAY['/images/activities/ziranbowuguan.png']::text[],
  false,
  1000,
  5,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2025.02'
    and existing.title = '上海自然博物馆研学'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2025.01',
  '2025-01-01',
  '东方绿舟实践活动',
  '',
  ARRAY['/images/activities/dongfanglvzhou.jpg']::text[],
  false,
  1000,
  6,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2025.01'
    and existing.title = '东方绿舟实践活动'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2024.10',
  '2024-10-01',
  '上海市龙华烈士陵园2024国防教育活动',
  '',
  ARRAY['/images/activities/lieshilingyuan.jpg']::text[],
  false,
  1000,
  7,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2024.10'
    and existing.title = '上海市龙华烈士陵园2024国防教育活动'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2024.02',
  '2024-02-01',
  '逐梦寰宇问苍穹中国载人航天工程成就展',
  '',
  ARRAY['/images/activities/huanyu.jpg', '/images/activities/huanyu2.jpg']::text[],
  false,
  1000,
  8,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2024.02'
    and existing.title = '逐梦寰宇问苍穹中国载人航天工程成就展'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2024.02',
  '2024-02-01',
  '梵高星空艺术馆沉浸式体验',
  '',
  ARRAY['/images/activities/vango.jpg']::text[],
  false,
  1000,
  9,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2024.02'
    and existing.title = '梵高星空艺术馆沉浸式体验'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2024.01',
  '2024-01-01',
  '陈家祠参观交流（与非遗大吴泥塑传承人吴漫互动）',
  '',
  ARRAY['/images/activities/feiyi.jpg', '/images/activities/feiyi2.jpg']::text[],
  false,
  1000,
  10,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2024.01'
    and existing.title = '陈家祠参观交流（与非遗大吴泥塑传承人吴漫互动）'
);
insert into public.activities (
  category_id, display_date, sort_date, title, description, image_paths,
  is_pinned, pin_order, sort_order, is_visible
)
select
  (select id from public.categories where content_type = 'activity' and slug = 'study-tour'),
  '2026.06',
  '2026-06-01',
  '上海交通大学 AI 之旅研学',
  '参观上海交通大学实验室，了解人工智能前沿科技与应用。',
  '{}'::text[],
  true,
  11,
  11,
  true
where not exists (
  select 1 from public.activities existing
  where existing.display_date = '2026.06'
    and existing.title = '上海交通大学 AI 之旅研学'
);
