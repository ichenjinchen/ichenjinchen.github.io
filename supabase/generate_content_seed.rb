#!/usr/bin/env ruby

require "csv"
require "date"

ROOT = File.expand_path("..", __dir__)
AWARDS_CSV = File.join(ROOT, "_data", "awards.csv")
ACTIVITIES_CSV = File.join(ROOT, "_data", "activities.csv")

def clean(value)
  value.to_s.strip
end
def sql(value)
  "'#{value.to_s.gsub("'", "''")}'"
end

def date_sql(label)
  match = label.to_s.match(/\A(\d{4})[.\/-](\d{1,2})\z/)
  return "NULL" unless match

  sql(format("%04d-%02d-01", match[1].to_i, match[2].to_i))
end

def category_for(title)
  case title
  when /小托福|TOEFL|NCTE|KET|英语/i
    "english"
  when /数学|AMC8|思维100|希望杯|走美杯|YMO|袋鼠|SASMO|华数/i
    "mathematics"
  when /GESP|CSP|编程|信息|计算机|AI|人工智能|NOC|蓝桥|电子学会|ICODE|机器人|程序|软件/i
    "programming"
  when /智慧阅读|行规|红领巾/i
    "school"
  else
    "arts-and-well-rounded"
  end
end

def activity_category_for(title)
  if title.match?(/AI|人工智能|机器人|编程|科技|研学|博物馆|航空|航天|艺术馆|参观|东方绿舟|烈士陵园/i)
    "study-tour"
  elsif title.match?(/公益|志愿/i)
    "public-service"
  elsif title.match?(/校园|学校/i)
    "school-activities"
  else
    "other"
  end
end

def find_row(rows, time: nil, pattern: nil)
  rows.find do |row|
    next false if time && row["time"] != time
    pattern.nil? || row["event"].match?(pattern)
  end
end

def update_row(rows, time:, pattern:, updates:)
  row = find_row(rows, time: time, pattern: pattern)
  row.merge!(updates) if row
end

def add_award(rows, time:, title:, result: "", level: "", category: nil, description: "", pinned: false)
  rows << {
    "time" => time,
    "event" => title,
    "award" => result,
    "level" => level,
    "category" => category || category_for(title),
    "description" => description,
    "pinned" => pinned
  }
end

def upsert_award(rows, time:, pattern:, title:, result:, pinned: true)
  row = find_row(rows, time: time, pattern: pattern)
  if row
    row["event"] = title
    row["award"] = result
    row["pinned"] = pinned
  else
    add_award(rows, time: time, title: title, result: result, pinned: pinned)
  end
end

awards = CSV.read(AWARDS_CSV, headers: true).map do |row|
  {
    "time" => clean(row["time"]),
    "event" => clean(row["event"]),
    "award" => clean(row["award"]),
    "level" => clean(row["level"]),
    "description" => "",
    "pinned" => false
  }
end

# PPT/PDF wording takes precedence over the older CSV wording.
update_row(awards, time: "2026.04", pattern: /走美杯/, updates: {
  "event" => "“走美杯”陈省身学思奖", "award" => "金奖"
})
update_row(awards, time: "2026.04", pattern: /希望杯/, updates: {
  "event" => "希望杯国际数学邀请赛四年级个人组", "award" => "一等奖", "level" => "全国"
})
update_row(awards, time: "2026.03", pattern: /中国电子学会.*软件编程.*C\+\+/, updates: {
  "event" => "电子学会软件编程等级·C++", "award" => "六级", "level" => "全国"
})
update_row(awards, time: "2026.03", pattern: /GESP C\+\+/, updates: {
  "event" => "CCF GESP 等级认证·C++", "award" => "五级", "level" => "全国"
})
update_row(awards, time: "2026.03", pattern: /OM头脑奥林匹克/, updates: {
  "event" => "上海市头脑奥林匹克 OM 大赛", "award" => "一等奖"
})
update_row(awards, time: "2026.03", pattern: /上海市头脑奥林匹克创新大赛/, updates: {
  "event" => "上海市头脑奥林匹克 OM 大赛"
})
update_row(awards, time: "2026.02", pattern: /小托福/, updates: {
  "event" => "TOEFL Junior（小托福）", "award" => "850分", "level" => "",
  "description" => "总分 850 分，满分 900 分。"
})
update_row(awards, time: "2025.12", pattern: /人工智能算法设计/, updates: {
  "event" => "上海中小学生人工智能算法设计·C++", "award" => "三等奖", "level" => "市级"
})
update_row(awards, time: "2025.12", pattern: /DI上海/, updates: {
  "event" => "DI 上海青少年创新思维竞赛·团队即时挑战", "award" => "一等奖", "level" => "区级"
})
update_row(awards, time: "2025.07", pattern: /全国青少年信息素养大赛复赛/, updates: {
  "event" => "全国青少年信息素养大赛·复赛", "award" => "一等奖", "level" => "市级"
})
update_row(awards, time: "2025.03", pattern: /全国计算机等级考试/, updates: {
  "event" => "全国计算机等级考试·C++", "award" => "二级", "level" => "全国"
})
update_row(awards, time: "2025.01", pattern: /青少年编程与机器人/, updates: {
  "event" => "上海青少年编程与机器人挑战", "award" => "二等奖", "level" => "市级"
})
update_row(awards, time: "2024.10", pattern: /CSP-J/, updates: {
  "event" => "CCF CSP-J 初赛", "award" => "一等奖", "level" => "全国"
})
update_row(awards, time: "2024.08", pattern: /NOC/, updates: {
  "event" => "NOC 信息技术创新与实践·全国决赛", "award" => "二等奖", "level" => "全国"
})
update_row(awards, time: "2024.07", pattern: /科技教育成果展示.*全国总决赛/, updates: {
  "event" => "青科赛 AI+程序算法总决赛", "award" => "二等奖", "level" => "全国"
})
update_row(awards, time: "2023.10", pattern: /全国青少年人工智能创新挑战赛\s*编程/, updates: {
  "event" => "全国青少年 AI 创新挑战赛", "award" => "金奖", "level" => "全国"
})
update_row(awards, time: "2025.11", pattern: /\A漫画\z/, updates: {
  "event" => "社会艺术水平考级·漫画", "award" => "八级", "level" => "全国"
})
update_row(awards, time: "2023.09", pattern: /朵云杯/, updates: {
  "event" => "朵云杯全国少儿书法绘画·绘画", "award" => "二等奖", "level" => "全国"
})
update_row(awards, time: "2026.01", pattern: /行规好少年/, updates: {
  "event" => "“行规好少年”", "award" => "", "level" => "校级"
})

# Items present in the 2026 PPT/PDF but absent from the older CSV.
upsert_award(awards, time: "2026.05", pattern: /思维100.*决赛/, title: "“思维100”决赛·四年级", result: "二等奖")
upsert_award(awards, time: "2026.04", pattern: /袋鼠数学.*(Grade 5|G5)/, title: "袋鼠数学 G5·跨级参赛", result: "超级金奖")
upsert_award(awards, time: "2026.05", pattern: /SASMO/, title: "SASMO 数学奥赛·四年级", result: "金奖")
upsert_award(awards, time: "2026.04", pattern: /华数国际/, title: "华数国际·初级组", result: "一等奖")
add_award(awards, time: "2026.07", title: "YMO 全国总决赛·四年级组", result: "金奖", pinned: true)
add_award(awards, time: "2026.06", title: "“智慧阅读之星”（四年级）", level: "校级", pinned: true)
add_award(awards, time: "2026.05", title: "“红领巾广播员”", level: "校级", pinned: true)

# PPT highlights are the initial pinned items. The admin UI can change this later.
featured_patterns = [
  /走美杯/, /希望杯/, /思维100.*决赛/, /袋鼠数学 G5/, /SASMO/, /华数国际/, /YMO 全国总决赛/,
  /TOEFL Junior/, /CCF GESP 等级认证/, /电子学会软件编程等级/, /全国计算机等级考试·C\+\+/,
  /CCF CSP-J 初赛/, /NOC 信息技术创新/, /全国青少年信息素养大赛·复赛/, /上海青少年编程与机器人挑战/,
  /青科赛 AI\+程序算法/, /全国青少年 AI 创新挑战赛/, /OM 大赛/, /DI 上海/, /社会艺术水平/
]
awards.each do |row|
  row["pinned"] ||= featured_patterns.any? { |pattern| row["event"].match?(pattern) }
end

# Remove exact duplicates after applying the authoritative wording.
awards = awards.uniq { |row| [row["time"], row["event"], row["award"], row["level"]] }

activities = CSV.read(ACTIVITIES_CSV, headers: true).map do |row|
  {
    "time" => clean(row["time"]),
    "title" => clean(row["title"]),
    "description" => "",
    "images" => clean(row["images"]).split("|").reject(&:empty?),
    "pinned" => false
  }
end

# PPT/PDF wording takes precedence for activities that already exist in CSV.
update_activity = lambda do |time:, pattern:, title:, description:|
  row = activities.find { |item| item["time"] == time && item["title"].match?(pattern) }
  if row
    row["title"] = title
    row["description"] = description
    row["pinned"] = true
  end
end

update_activity.call(
  time: "2026.04",
  pattern: /AI.*编程.*专项培训/,
  title: "浦东 AI 人工智能编程专项培训",
  description: "参加浦东新区专项培训，系统学习人工智能编程方法。"
)
update_activity.call(
  time: "2026.05",
  pattern: /复旦大学.*科学家精神.*研学/,
  title: "复旦大学“科学家精神”研学",
  description: "走进复旦校园，聆听科研故事，感受求真务实的科学家精神。"
)

existing_robot = activities.find { |row| row["title"] == "AI人形机器人开发与实践活动" }
existing_robot["description"] = "动手参与人形机器人的编程与开发实践，近距离体验具身智能。" if existing_robot

activities << {
  "time" => "2026.06",
  "title" => "上海交通大学 AI 之旅研学",
  "description" => "参观上海交通大学实验室，了解人工智能前沿科技与应用。",
  "images" => [],
  "pinned" => true
}
activities = activities.uniq { |row| [row["time"], row["title"]] }

profile_sections = [
  {
    key: "overview",
    title: "个人概览",
    subtitle: "ABOUT ME",
    type: "rich_text_image",
    image: "/images/gitar1.png",
    body: <<~MARKDOWN
      陈瑾辰生于 **2016 年 7 月**，就读于上海市浦东新区明珠小学 A 区五年级，担任中队长。

      他热爱数学、编程与创造，学习自律、性格开朗，在竞赛、艺术与公益实践中持续成长。
    MARKDOWN
  },
  {
    key: "academic",
    title: "学业表现",
    subtitle: "ACADEMIC RECORD",
    body: <<~MARKDOWN
      入学以来学科全优，学习功底扎实、习惯自律，历年总分排名 **第 1 / 40**。

      | 年级 | 语文 | 数学 | 英语 |
      | --- | ---: | ---: | ---: |
      | 四上 | 97 | 100 | 98.5 |
      | 四下 | 94 | 99.5 | 98 |

      校内荣誉包括 **“智慧阅读之星”**、**“红领巾广播员”** 和 **“行规好少年”**。
    MARKDOWN
  },
  {
    key: "mathematics",
    title: "数学与算法",
    subtitle: "MATHEMATICS",
    body: <<~MARKDOWN
      热爱数学与算法，自学小学奥数及部分初高中数学知识，四下裸考进入 XES 竞赛班 MC-A 及夏令营、HZ 科创班。

      已获得 **10+ 项数学竞赛奖项**，完整记录见荣誉页面。
    MARKDOWN
  },
  {
    key: "english",
    title: "英语能力",
    subtitle: "ENGLISH",
    body: <<~MARKDOWN
      通过 TOEFL Junior（小托福），总分 **850 分**（满分 900 分）。

      自学完成《新概念英语》一、二册，通过全国新概念英语等级考试第三级（NCTE Level 3）。
    MARKDOWN
  },
  {
    key: "programming",
    title: "信息学编程",
    subtitle: "CODING & CS",
    body: <<~MARKDOWN
      沿 **Scratch → Python → C++** 持续进阶。三年级获得 **CCF CSP-J 初赛一等奖**，并通过全国计算机等级考试二级 C++。

      四年级通过 **CCF GESP C++ 五级** 和 **电子学会 C++ 六级**，另获全国、市、区级编程与人工智能相关奖项 **20 余项**。
    MARKDOWN
  },
  {
    key: "practice",
    title: "社会实践与研学足迹",
    subtitle: "PRACTICE & STUDY TOUR",
    body: <<~MARKDOWN
      积极参与人工智能、科技、公益和校园实践，持续记录研学足迹，在真实场景中了解科学、技术与社会。

      代表性经历包括 AI 人形机器人开发、浦东 AI 编程专项培训、复旦大学“科学家精神”研学和上海交通大学 AI 之旅研学。
    MARKDOWN
  },
  {
    key: "well-rounded",
    title: "综合素质",
    subtitle: "WELL-ROUNDED",
    body: <<~MARKDOWN
      通过社会艺术水平考级漫画八级，获得朵云杯全国少儿书法绘画二等奖、上海市头脑奥林匹克 OM 大赛一等奖等荣誉。

      热爱绘画、篮球和吉他，积极参与公益、科技与话剧实践，性格开朗进取，具备较强的协作能力与社会责任感。
    MARKDOWN
  },
  {
    key: "family",
    title: "家庭背景",
    subtitle: "FAMILY",
    body: <<~MARKDOWN
      家庭秉持 **“五育并重”** 理念。父亲为清华大学博士，创办 AI 企业；母亲为浙江大学硕士，任职世界 500 强外企经理。

      和睦的家庭氛围培养了他乐观钻研的态度，也让他立志成为对国家与社会有用的人。
    MARKDOWN
  }
]

category_sql = lambda do |content_type, slug|
  "(select id from public.categories where content_type = #{sql(content_type)} and slug = #{sql(slug)})"
end

puts "-- Generated from _data/*.csv plus the 2026 PPT/PDF highlights."
puts "-- Run after supabase/schema.sql. Profile sections upsert; awards and activities insert only when missing."
puts
puts "-- Latest profile values from the PPT/PDF."
puts <<~SQL
  insert into public.site_profile (
    id, name, english_name, birthday_label, school, grade, location,
    phone, email, short_tagline, seo_description
  ) values (
    1,
    #{sql("陈瑾辰")},
    #{sql("JASON CHEN")},
    #{sql("2016年7月")},
    #{sql("浦东新区明珠小学A区")},
    #{sql("五年级")},
    #{sql("上海")},
    #{sql("18017264048")},
    #{sql("ichenjinchen@163.com")},
    #{sql("热爱数学、编程与创造")},
    #{sql("陈瑾辰的个人主页，记录学习、竞赛、研学和成长经历。")}
  ) on conflict (id) do update set
    name = excluded.name,
    english_name = excluded.english_name,
    birthday_label = excluded.birthday_label,
    school = excluded.school,
    grade = excluded.grade,
    location = excluded.location,
    phone = excluded.phone,
    email = excluded.email,
    short_tagline = excluded.short_tagline,
    seo_description = excluded.seo_description;
SQL

puts "-- Markdown profile sections."
profile_sections.each do |section|
  puts <<~SQL
    insert into public.profile_sections (
      section_key, title, subtitle, body_markdown, section_type, image_url, sort_order, is_visible
    ) values (
      #{sql(section[:key])},
      #{sql(section[:title])},
      #{sql(section[:subtitle])},
      #{sql(section[:body])},
      #{sql(section[:type] || "rich_text")},
      #{sql(section[:image] || "")},
      #{section[:sort_order] || ((profile_sections.index(section) + 1) * 10)},
      true
    ) on conflict (section_key) do update set
      title = excluded.title,
      subtitle = excluded.subtitle,
      body_markdown = excluded.body_markdown,
      section_type = excluded.section_type,
      image_url = excluded.image_url,
      sort_order = excluded.sort_order;
  SQL
end
puts "-- Awards merged from the CSV and PPT/PDF."
awards.each_with_index do |row, index|
  category = row["category"] || category_for(row["event"])
  pinned = row["pinned"] == true
  pin_order = pinned ? (index + 1) : 1000
  puts <<~SQL
    insert into public.awards (
      category_id, display_date, sort_date, title, result, level, description,
      is_pinned, pin_order, sort_order, is_visible
    )
    select
      #{category_sql.call("award", category)},
      #{sql(row["time"])},
      #{date_sql(row["time"])},
      #{sql(row["event"])},
      #{sql(row["award"])},
      #{sql(row["level"])},
      #{sql(row["description"])},
      #{pinned ? "true" : "false"},
      #{pin_order},
      #{index + 1},
      true
    where not exists (
      select 1 from public.awards existing
      where existing.display_date = #{sql(row["time"])}
        and existing.title = #{sql(row["event"])}
        and existing.result = #{sql(row["award"]) }
    );
  SQL
end

puts "-- Activities merged from the CSV and PPT/PDF."
activities.each_with_index do |row, index|
  category = activity_category_for(row["title"])
  image_sql = if row["images"].empty?
    "'{}'::text[]"
  else
    "ARRAY[#{row["images"].map { |image| sql("/images/activities/#{image}") }.join(", ")}]::text[]"
  end
  puts <<~SQL
    insert into public.activities (
      category_id, display_date, sort_date, title, description, image_paths,
      is_pinned, pin_order, sort_order, is_visible
    )
    select
      #{category_sql.call("activity", category)},
      #{sql(row["time"])},
      #{date_sql(row["time"])},
      #{sql(row["title"])},
      #{sql(row["description"])},
      #{image_sql},
      #{row["pinned"] ? "true" : "false"},
      #{row["pinned"] ? index + 1 : 1000},
      #{index + 1},
      true
    where not exists (
      select 1 from public.activities existing
      where existing.display_date = #{sql(row["time"])}
        and existing.title = #{sql(row["title"])}
    );
  SQL
end
