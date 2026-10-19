const status = document.querySelector("[data-db-status]");
const page = document.querySelector("[data-db-page]");
const config = {
  projectUrl: document.querySelector('meta[name="supabase-project-url"]')?.content || "",
  publishableKey: document.querySelector('meta[name="supabase-publishable-key"]')?.content || ""
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function selectRows(table, filters = {}) {
  const query = new URLSearchParams({ select: "*", ...filters });
  const response = await fetch(`${config.projectUrl.replace(/\/$/, "")}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: config.publishableKey,
      Authorization: `Bearer ${config.publishableKey}`
    }
  });
  if (!response.ok) throw new Error(`Supabase 请求失败（${response.status}）：${await response.text()}`);
  return response.json();
}

function setStatus(message, type = "info") {
  if (!status) return;
  status.textContent = message;
  status.dataset.statusType = type;
  status.hidden = !message;
}

function sortByDateDesc(a, b) {
  return String(b.sort_date || b.display_date || "").localeCompare(String(a.sort_date || a.display_date || ""));
}

function sortRows(a, b) {
  return (Number(b.is_pinned) - Number(a.is_pinned))
    || (Number(a.pin_order || 1000) - Number(b.pin_order || 1000))
    || sortByDateDesc(a, b)
    || (Number(a.sort_order || 1000) - Number(b.sort_order || 1000));
}

function categoryClass(category) {
  return `db-accent-${category?.accent_color || "gray"}`;
}

function renderMarkdown(value) {
  const lines = String(value || "").split(/\r?\n/);
  const inline = (text) => escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  let html = "";
  let listOpen = false;
  let tableOpen = false;
  let tableHead = false;
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (/^\|.*\|$/.test(trimmed)) {
      const cells = trimmed.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (/^\s*:?[-]+:?\s*$/.test(cells[0])) return;
      if (listOpen) { html += "</ul>"; listOpen = false; }
      if (!tableOpen) { html += "<table><thead>"; tableOpen = true; tableHead = true; }
      const tag = tableHead ? "th" : "td";
      html += `<tr>${cells.map((cell) => `<${tag}>${inline(cell)}</${tag}>`).join("")}</tr>`;
      if (tableHead) { html += "</thead><tbody>"; tableHead = false; }
      return;
    }
    if (tableOpen) { html += "</tbody></table>"; tableOpen = false; }
    if (/^\s*[-*]\s+/.test(trimmed)) {
      if (!listOpen) { html += "<ul>"; listOpen = true; }
      html += `<li>${inline(trimmed.replace(/^\s*[-*]\s+/, ""))}</li>`;
      return;
    }
    if (listOpen) { html += "</ul>"; listOpen = false; }
    if (!trimmed) return;
    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    html += heading ? `<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>` : `<p>${inline(trimmed)}</p>`;
  });
  if (listOpen) html += "</ul>";
  if (tableOpen) html += "</tbody></table>";
  return html;
}

function findSection(sections, ...keys) {
  return sections.find((section) => keys.some((key) => {
    const value = `${section.section_key} ${section.title}`.toLowerCase();
    return value.includes(key.toLowerCase());
  }));
}

function groupedCategories(categories, rows) {
  const byId = new Map(categories.map((category) => [category.id, { category, rows: [] }]));
  rows.forEach((row) => {
    const group = byId.get(row.category_id);
    if (group) group.rows.push(row);
  });
  return categories.map((category) => byId.get(category.id)).filter((group) => group && group.rows.length);
}

function mergeStudyTourCategories(categories, activities) {
  const study = categories.find((category) => category.slug === "study-tour");
  const technology = categories.find((category) => category.slug === "technology");
  if (!study) return { categories, activities };
  const mergedStudy = { ...study, name: "研学实践", description: study.description || "科技、校园与社会实践的研学记录。" };
  if (technology) {
    activities.forEach((row) => {
      if (row.category_id === technology.id) row.category_id = study.id;
    });
  }
  return {
    categories: categories.filter((category) => category.id !== technology?.id).map((category) => category.id === study.id ? mergedStudy : category),
    activities
  };
}

function renderProfileSummary(profile, sections = []) {
  const target = document.querySelector("[data-profile-summary]");
  if (!target || !profile) return;
  const overview = findSection(sections, "overview", "概览", "介绍");
  const overviewImage = overview?.image_url || "/images/gitar1.png";
  target.innerHTML = `
    <div class="db-overview-identity">
      <div class="db-overview-identity-copy">
        <p class="db-overview-eyebrow">个人概览</p>
        <h1>${escapeHtml(profile.name || "陈瑾辰")}</h1>
        ${profile.english_name ? `<p class="db-overview-english">${escapeHtml(profile.english_name)}</p>` : ""}
        <p class="db-overview-meta">${escapeHtml([profile.school, profile.grade, profile.class_name].filter(Boolean).join(" · "))}</p>
        ${profile.short_tagline ? `<p class="db-overview-tagline">${escapeHtml(profile.short_tagline)}</p>` : ""}
      </div>
      <img class="db-overview-feature-image" src="${escapeHtml(overviewImage)}" alt="弹吉他">
    </div>
  `;
  target.hidden = false;
}

function renderProfileSections(sections) {
  const target = document.querySelector("[data-profile-sections]");
  const fallback = document.querySelector("[data-profile-fallback]");
  if (!target || !sections.length) return;
  const limit = Number(target.dataset.profileSectionsLimit || 0);
  const visibleSections = limit ? sections.slice(0, limit) : sections;
  target.innerHTML = visibleSections.map((section) => {
    const sectionImage = section.section_key === "overview" ? "" : section.image_url;
    return `
    <section class="db-profile-section ${sectionImage ? "db-profile-section-with-image" : ""}" data-section-key="${escapeHtml(section.section_key)}">
      <div class="db-profile-section-copy">
        <h2>${escapeHtml(section.title)}</h2>
        ${section.subtitle ? `<p class="db-section-subtitle">${escapeHtml(section.subtitle)}</p>` : ""}
        <div class="db-markdown">${renderMarkdown(section.body_markdown)}</div>
      </div>
      ${sectionImage ? `<img class="db-section-image" src="${escapeHtml(sectionImage)}" alt="">` : ""}
    </section>
  `;
  }).join("");
  target.hidden = false;
  if (fallback) fallback.hidden = true;
}

function categoryHref(category) {
  const hrefs = {
    school: "/school/",
    mathematics: "/mathematics/",
    english: "/english/",
    programming: "/programming/",
    "arts-and-well-rounded": "/comprehensive/"
  };
  return hrefs[category?.slug] || (category?.slug ? `/cv/?category=${encodeURIComponent(category.slug)}` : "/cv/");
}

function categoryLabel(category, activities = false) {
  if (category?.slug === "study-tour" && activities) return "研学实践";
  if (category?.slug === "other") return activities ? "补充活动" : "补充荣誉";
  return category?.name || "未分类";
}

function awardCard(row, category) {
  return `
    <a class="db-feature-card ${row.is_pinned ? "db-feature-card-pinned" : ""} ${categoryClass(category)}" href="${categoryHref(category)}">
      <p class="db-feature-card-date">${escapeHtml(row.display_date)}</p>
      <h3>${escapeHtml(row.title)}</h3>
      <p>${escapeHtml([row.result, row.level].filter(Boolean).join(" · "))}</p>
      ${row.description ? `<div class="db-feature-card-description">${escapeHtml(row.description)}</div>` : ""}
    </a>
  `;
}

function activityCard(row, category) {
  return `
    <a class="db-feature-card ${row.is_pinned ? "db-feature-card-pinned" : ""} ${categoryClass(category)}" href="/activities/">
      <p class="db-feature-card-date">${escapeHtml(row.display_date)}</p>
      <h3>${escapeHtml(row.title)}</h3>
      ${row.description ? `<div class="db-feature-card-description">${escapeHtml(row.description)}</div>` : ""}
      ${row.image_paths?.[0] ? `<img class="db-feature-card-image" src="${escapeHtml(row.image_paths[0])}" alt="">` : ""}
    </a>
  `;
}

function renderFeaturedAwards(categories, awards) {
  const target = document.querySelector("[data-featured-awards]");
  if (!target) return;
  const limit = Number(target.dataset.featuredLimit || 9);
  const essential = [
    awards.filter((row) => /TOEFL|小托福/i.test(row.title)).sort(sortRows)[0],
    awards.filter((row) => /CSP/i.test(row.title)).sort(sortRows)[0],
    awards.filter((row) => /信息素养/i.test(row.title)).sort(sortRows)[0]
  ].filter(Boolean);
  const essentialIds = new Set(essential.map((row) => row.id));
  const pinned = awards.filter((row) => row.is_pinned && !essentialIds.has(row.id)).sort(sortRows);
  const featured = [...pinned.slice(0, Math.max(0, limit - essential.length)), ...essential].slice(0, limit);
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  if (!featured.length) return;
  target.innerHTML = `
    <div class="db-section-heading"><div><p class="db-overview-eyebrow">精选成果</p><h2>重要荣誉</h2></div><a class="db-text-link" href="${target.dataset.allHref || "/cv/"}">查看全部荣誉</a></div>
    <div class="db-feature-grid">${featured.map((row) => awardCard(row, categoryById.get(row.category_id))).join("")}</div>
  `;
  target.hidden = false;
}

function renderFeaturedActivities(categories, activities) {
  const target = document.querySelector("[data-featured-activities]");
  if (!target) return;
  const featured = activities.filter((row) => row.is_pinned).sort(sortRows).slice(0, Number(target.dataset.featuredLimit || 3));
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  if (!featured.length) return;
  target.innerHTML = `
    <div class="db-section-heading"><div><p class="db-overview-eyebrow">精选经历</p><h2>研学实践</h2></div><a class="db-text-link" href="${target.dataset.allHref || "/activities/"}">查看全部活动</a></div>
    <div class="db-feature-grid db-feature-grid-activities">${featured.map((row) => activityCard(row, categoryById.get(row.category_id))).join("")}</div>
  `;
  target.hidden = false;
}

function renderCategoryNav(categories, activities = false, rows = []) {
  const target = document.querySelector("[data-category-nav]");
  if (!target) return;
  const type = activities ? "activity" : "award";
  const hrefs = activities ? { "study-tour": "/activities/" } : {
    school: "/school/",
    mathematics: "/mathematics/",
    english: "/english/",
    programming: "/programming/",
    "arts-and-well-rounded": "/comprehensive/"
  };
  const selectedSlug = page?.dataset.categorySlug || new URLSearchParams(window.location.search).get("category") || "";
  const allHref = activities ? "/activities/" : "/cv/";
  const typedCategories = categories.filter((category) => category.content_type === type);
  const visibleCategories = rows.length
    ? groupedCategories(typedCategories, rows).map(({ category }) => category)
    : typedCategories;
  const categoryLinks = visibleCategories.map((category) => `
    <a class="db-category-link ${category.slug === selectedSlug ? "is-active" : ""}" href="${hrefs[category.slug] || `/cv/?category=${encodeURIComponent(category.slug)}`}" data-category-slug="${escapeHtml(category.slug)}">${escapeHtml(categoryLabel(category, activities))}</a>
  `).join("");
  target.innerHTML = `<a class="db-category-link ${selectedSlug ? "" : "is-active"}" href="${allHref}">全部</a>${categoryLinks}`;
}

function renderAwards(categories, awards) {
  const target = document.querySelector("[data-awards-content]");
  const fallback = document.querySelector("[data-awards-fallback]");
  if (!target || !awards.length) return;
  const selectedSlug = page?.dataset.categorySlug || new URLSearchParams(window.location.search).get("category") || "";
  const selectedCategories = selectedSlug ? categories.filter((category) => category.slug === selectedSlug) : categories;
  const selectedIds = new Set(selectedCategories.map((category) => category.id));
  const selectedAwards = awards.filter((row) => selectedIds.has(row.category_id));
  if (!selectedAwards.length) return;
  target.innerHTML = groupedCategories(selectedCategories, selectedAwards).map(({ category, rows }) => `
    <section class="db-category ${categoryClass(category)}">
      <div class="db-category-heading"><h2>${escapeHtml(categoryLabel(category))}</h2></div>
      ${category.description ? `<p class="db-category-description">${escapeHtml(category.description)}</p>` : ""}
      <table class="db-awards-table">
        <thead><tr><th>时间</th><th>事件</th><th>奖项</th><th>等级</th></tr></thead>
        <tbody>${rows.sort(sortRows).map((row) => `
          <tr class="${row.is_pinned ? "db-award-pinned" : ""}">
            <td>${escapeHtml(row.display_date)}</td>
            <td>${escapeHtml(row.title)}${row.is_offline ? '<span class="db-offline-label">线下</span>' : ""}${row.description ? `<div class="db-award-description">${escapeHtml(row.description)}</div>` : ""}</td>
            <td>${escapeHtml(row.result)}</td>
            <td>${escapeHtml(row.level)}</td>
          </tr>
        `).join("")}</tbody>
      </table>
    </section>
  `).join("");
  target.hidden = false;
  if (fallback) fallback.hidden = true;
}

function renderActivities(categories, activities) {
  const target = document.querySelector("[data-activities-content]");
  const fallback = document.querySelector("[data-activities-fallback]");
  if (!target || !activities.length) return;
  target.innerHTML = groupedCategories(categories, activities).map(({ category, rows }) => `
    <section class="db-category ${categoryClass(category)}">
      <div class="db-category-heading"><h2>${escapeHtml(categoryLabel(category, true))}</h2></div>
      <div class="timeline-container">${rows.sort(sortRows).map((row) => `
        <article class="timeline-item ${row.is_pinned ? "db-activity-pinned" : ""}">
          <div class="timeline-time">${escapeHtml(row.display_date)}</div>
          <div class="timeline-title">${escapeHtml(row.title)}${row.is_offline ? '<span class="db-offline-label">线下</span>' : ""}</div>
          ${row.description ? `<div class="db-activity-description">${escapeHtml(row.description)}</div>` : ""}
          ${row.image_paths?.length ? `<div class="timeline-img-container">${row.image_paths.map((image) => `<img class="pub-img-content" src="${escapeHtml(image)}" alt="">`).join("")}</div>` : ""}
        </article>
      `).join("")}</div>
    </section>
  `).join("");
  target.hidden = false;
  if (fallback) fallback.hidden = true;
}

function categoryRows(categories, rows, slug) {
  const category = categories.find((item) => item.slug === slug);
  return { category, rows: category ? rows.filter((row) => row.category_id === category.id).sort(sortRows) : [] };
}

function presentationCard(row) {
  return `<li><strong>${escapeHtml(row.title)}</strong><span>${escapeHtml([row.result, row.level].filter(Boolean).join(" · "))}</span></li>`;
}

function renderPresentation(profile, sections, awards, activities, awardCategories) {
  const target = document.querySelector("[data-presentation]");
  if (!target) return;
  const selected = (slug) => categoryRows(awardCategories, awards.filter((row) => row.is_pinned), slug);
  const math = selected("mathematics");
  const english = selected("english");
  const programming = selected("programming");
  const comprehensive = selected("arts-and-well-rounded");
  const practice = activities.filter((row) => row.is_pinned).sort(sortRows).slice(0, 4);
  const overview = findSection(sections, "overview", "概览", "介绍");
  const academic = findSection(sections, "academic", "school", "学业", "校内");
  const englishSection = findSection(sections, "english", "英语");
  const programmingSection = findSection(sections, "programming", "编程");
  const comprehensiveSection = findSection(sections, "comprehensive", "综合", "艺术");
  const avatarSrc = profile?.avatar_url || "/images/portrait.png";
  const overviewHighlights = overview ? renderMarkdown(overview.body_markdown) : `<p>${escapeHtml(profile?.short_tagline || "")}</p>`;
  const academicFallback = academic ? renderMarkdown(academic.body_markdown) : `<p>入学以来学科全优，学习功底扎实、习惯自律，历年总分排名第 1 / 40。</p>`;
  const slides = [
    { eyebrow: "PERSONAL PROFILE · 2026", title: profile?.name || "陈瑾辰", body: "JASON CHEN", detailHref: "/", detailLabel: "查看概览", className: "db-presentation-cover", content: `<div class="db-presentation-cover-grid"><div><p>${escapeHtml([profile?.school, profile?.grade, profile?.class_name].filter(Boolean).join(" · "))}</p><ul class="db-presentation-highlight-list">${awards.filter((row) => row.is_pinned).sort(sortRows).slice(0, 4).map(presentationCard).join("")}</ul></div><img class="db-presentation-avatar" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(profile?.name || "陈瑾辰")}"></div>` },
    { eyebrow: "ABOUT ME", title: "个人概览", detailHref: "/", detailLabel: "查看完整概览", className: "db-presentation-overview", content: `<div class="db-presentation-overview-grid"><div class="db-presentation-overview-aside"><img class="db-presentation-avatar db-presentation-avatar-large" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(profile?.name || "陈瑾辰")}"><strong>学业全优 · 数理见长</strong><p>${escapeHtml(profile?.short_tagline || "热爱数学、编程与创造，学习自律、性格开朗，在竞赛、艺术与公益实践中持续成长。")}</p></div><div class="db-presentation-markdown">${overviewHighlights}</div></div>` },
    { eyebrow: "ACADEMIC RECORD", title: "学业表现", detailHref: "/school/", detailLabel: "查看完整校内内容", className: "", content: `<div class="db-presentation-academic-grid"><div class="db-presentation-markdown">${academicFallback}</div><div class="db-presentation-stat"><strong>1 / 40</strong><span>历年成绩排名</span><em>中队长</em></div></div>` },
    { eyebrow: "MATHEMATICS", title: "数学思维", detailHref: "/mathematics/", detailLabel: "查看全部数学成果", className: "", content: `<div class="db-presentation-statline"><strong>10+</strong><span>项数学竞赛奖项</span></div><ul class="db-presentation-list db-presentation-list-dense">${math.rows.slice(0, 6).map(presentationCard).join("")}</ul>` },
    { eyebrow: "ENGLISH", title: "英语能力", detailHref: "/english/", detailLabel: "查看全部英语成果", className: "", content: `<div class="db-presentation-score"><strong>850</strong><span>TOEFL Junior · 小托福，满分 900</span></div>${englishSection ? `<div class="db-presentation-markdown">${renderMarkdown(englishSection.body_markdown)}</div>` : ""}<ul class="db-presentation-list">${english.rows.slice(0, 4).map(presentationCard).join("")}</ul>` },
    { eyebrow: "CODING & CS", title: "信息学编程", detailHref: "/programming/", detailLabel: "查看全部编程成果", className: "", content: `<div class="db-presentation-statline"><strong>30+</strong><span>项编程与人工智能相关奖项</span></div>${programmingSection ? `<div class="db-presentation-markdown">${renderMarkdown(programmingSection.body_markdown)}</div>` : ""}<ul class="db-presentation-list db-presentation-list-dense">${programming.rows.slice(0, 4).map(presentationCard).join("")}</ul>` },
    { eyebrow: "PRACTICE & STUDY TOUR", title: "研学实践", detailHref: "/activities/", detailLabel: "查看全部研学活动", className: "", content: `<div class="db-presentation-activity-grid">${practice.map((row) => `<article><span>${escapeHtml(row.display_date)}</span><strong>${escapeHtml(row.title)}</strong><p>${escapeHtml(row.description || "")}</p></article>`).join("")}</div>` },
    { eyebrow: "WELL-ROUNDED", title: "综合素质", detailHref: "/comprehensive/", detailLabel: "查看全部综合素质", className: "", content: `${comprehensiveSection ? `<div class="db-presentation-markdown">${renderMarkdown(comprehensiveSection.body_markdown)}</div>` : ""}<ul class="db-presentation-list">${comprehensive.rows.slice(0, 6).map(presentationCard).join("")}</ul><p class="db-presentation-hobbies">绘画 · 篮球 · 吉他 · 公益 · 科技 · 话剧</p>` },
    { eyebrow: "CONTACT", title: "谢谢浏览", detailHref: "/", detailLabel: "返回概览", className: "db-presentation-closing", content: `<p>${escapeHtml(profile?.email || "")}</p><p>${escapeHtml(profile?.location || "")}</p>` }
  ];
  target.innerHTML = `
    <div class="db-presentation-stage">
      <nav class="db-presentation-mininav" aria-label="简历演示页签">${slides.map((slide, index) => `<button type="button" data-presentation-jump="${index}" class="${index === 0 ? "is-current" : ""}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(slide.title)}</button>`).join("")}</nav>
      <div class="db-presentation-slides">${slides.map((slide, index) => `<section class="db-presentation-slide ${slide.className}" data-slide="${index}" ${index ? "hidden" : ""}><div class="db-presentation-title-row"><div><p class="db-presentation-eyebrow">${slide.eyebrow}</p><h2>${escapeHtml(slide.title)}</h2></div>${slide.detailHref ? `<a class="db-presentation-detail-link" href="${escapeHtml(slide.detailHref)}">${escapeHtml(slide.detailLabel || "查看全部")}</a>` : ""}</div>${slide.body ? `<p class="db-presentation-lead">${escapeHtml(slide.body)}</p>` : ""}${slide.content}</section>`).join("")}</div>
      <div class="db-presentation-controls"><button type="button" data-presentation-prev aria-label="上一页">←</button><span data-presentation-count>1 / ${slides.length}</span><button type="button" data-presentation-next aria-label="下一页">→</button><button type="button" data-presentation-fullscreen aria-label="全屏">全屏</button></div>
    </div>
  `;
  const slideNodes = [...target.querySelectorAll("[data-slide]")];
  let current = 0;
  const show = (index) => {
    current = (index + slideNodes.length) % slideNodes.length;
    slideNodes.forEach((slide, position) => { slide.hidden = position !== current; });
    const count = target.querySelector("[data-presentation-count]");
    if (count) count.textContent = `${current + 1} / ${slideNodes.length}`;
    target.querySelectorAll("[data-presentation-jump]").forEach((button, position) => {
      button.classList.toggle("is-current", position === current);
      button.classList.toggle("is-done", position < current);
    });
  };
  target.querySelector("[data-presentation-prev]")?.addEventListener("click", () => show(current - 1));
  target.querySelector("[data-presentation-next]")?.addEventListener("click", () => show(current + 1));
  target.querySelector("[data-presentation-fullscreen]")?.addEventListener("click", () => {
    const fullscreenTarget = target.closest(".db-presentation-page") || target;
    fullscreenTarget.requestFullscreen?.();
  });
  target.querySelectorAll("[data-presentation-jump]").forEach((button) => button.addEventListener("click", () => show(Number(button.dataset.presentationJump))));
  target.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight" || event.key === " ") show(current + 1);
  });
  target.tabIndex = 0;
}

async function loadContent() {
  if (!page) return;
  if (!config.projectUrl || !config.publishableKey) return;
  const [profiles, visibleSections, visibleAwards, visibleActivities, awardCategories, activityCategories] = await Promise.all([
    selectRows("site_profile", { "id": "eq.1", limit: "1" }),
    selectRows("profile_sections", { "is_visible": "eq.true", order: "sort_order.asc" }),
    selectRows("awards", { "is_visible": "eq.true" }),
    selectRows("activities", { "is_visible": "eq.true" }),
    selectRows("categories", { "content_type": "eq.award", "is_visible": "eq.true", order: "sort_order.asc" }),
    selectRows("categories", { "content_type": "eq.activity", "is_visible": "eq.true", order: "sort_order.asc" })
  ]);
  const profile = profiles[0] || null;
  visibleAwards.sort(sortByDateDesc);
  visibleActivities.sort(sortByDateDesc);
  renderProfileSummary(profile, visibleSections);
  renderProfileSections(visibleSections);
  renderFeaturedAwards(awardCategories || [], visibleAwards);
  renderFeaturedActivities(activityCategories || [], visibleActivities);
  const mergedActivities = mergeStudyTourCategories(activityCategories || [], visibleActivities);
  renderCategoryNav([...(awardCategories || []), ...mergedActivities.categories], page.dataset.pageType === "activities", page.dataset.pageType === "activities" ? mergedActivities.activities : visibleAwards);
  renderAwards(awardCategories || [], visibleAwards);
  renderActivities(mergedActivities.categories, mergedActivities.activities);
  renderPresentation(profile, visibleSections, visibleAwards, mergedActivities.activities, awardCategories || []);
  setStatus("");
}

loadContent().catch((error) => setStatus(error.message || "Supabase 请求失败，请检查配置和 RLS 策略。", "error"));
