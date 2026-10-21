const status = document.querySelector("[data-db-status]");
const page = document.querySelector("[data-db-page]");
const config = {
  projectUrl: document.querySelector('meta[name="supabase-project-url"]')?.content || "",
  publishableKey: document.querySelector('meta[name="supabase-publishable-key"]')?.content || ""
};
let siteProfileRequest;
let renderedContent;
const presentationKeyHandlers = new WeakMap();

const currentLanguage = () => window.SiteI18n?.language || "zh";
const text = (key, fallback = "") => window.SiteI18n?.text(key, fallback) || fallback || key;
const localized = (row, field, fallback = "") => window.SiteI18n?.localized(row, field, fallback) || fallback;

function renderAllContent() {
  if (!renderedContent) return;
  const { profile, sections, awards, activities, awardCategories, activityCategories } = renderedContent;
  renderSidebarProfile(profile);
  renderProfileSummary(profile, sections);
  renderProfileSections(sections, profile);
  renderFeaturedAwards(awardCategories, awards);
  renderFeaturedActivities(activityCategories, activities);
  const mergedActivities = mergeStudyTourCategories(activityCategories, activities);
  renderCategoryNav([...awardCategories, ...mergedActivities.categories], page.dataset.pageType === "activities", page.dataset.pageType === "activities" ? mergedActivities.activities : awards);
  renderAwards(awardCategories, awards);
  renderActivities(mergedActivities.categories, mergedActivities.activities);
  renderPresentation(profile, sections, awards, mergedActivities.activities, awardCategories);
}

window.addEventListener("site-language-change", renderAllContent);

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

function getSiteProfile() {
  if (!siteProfileRequest) {
    siteProfileRequest = selectRows("site_profile", { "id": "eq.1", limit: "1" }).then((rows) => rows[0] || null);
  }
  return siteProfileRequest;
}

function sidebarAvatarUrl(value) {
  const path = String(value || "").trim();
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/") && !path.startsWith("//")) return path;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return "";
  return `/images/${path.replace(/^\/+/, "").replace(/^images\//, "")}`;
}

function sidebarExternalUrl(value) {
  try {
    const url = new URL(String(value || "").trim());
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderSidebarProfile(profile) {
  const target = document.querySelector("[data-sidebar-profile]");
  if (!target || !profile) return;

  const setText = (key, value, fallback = "") => {
    const element = target.querySelector(`[data-sidebar-field="${key}"]`);
    if (!element) return;
    const text = String(value || fallback || "").trim();
    if (["location", "employer"].includes(key)) {
      const valueElement = target.querySelector(`[data-sidebar-value="${key}"]`);
      if (valueElement) valueElement.textContent = text;
    } else {
      element.textContent = text;
    }
    element.hidden = !text;
  };

  setText("name", currentLanguage() === "en"
    ? (profile.sidebar_name_en || profile.english_name)
    : profile.sidebar_name, profile.name);
  if ("sidebar_pronouns" in profile) setText("pronouns", localized(profile, "sidebar_pronouns"));
  if ("sidebar_bio" in profile) setText("bio", localized(profile, "sidebar_bio"));
  setText("location", localized(profile, "location"));
  setText("employer", localized(profile, "school"));

  const avatar = target.querySelector('[data-sidebar-field="avatar"]');
  const avatarUrl = "sidebar_avatar_url" in profile ? sidebarAvatarUrl(profile.sidebar_avatar_url) : "";
  if (avatar && avatarUrl) {
    avatar.src = avatarUrl;
    avatar.alt = String(profile.sidebar_name_en || profile.sidebar_name || profile.english_name || profile.name || "个人头像");
  }

  const email = String(profile.email || "").trim();
  const emailItem = target.querySelector('[data-sidebar-field="email"]');
  const emailLink = target.querySelector('[data-sidebar-link="email"]');
  if (emailItem && emailLink) {
    emailItem.hidden = !email;
    if (email) emailLink.href = `mailto:${email}`;
  }

  const websiteUrl = sidebarExternalUrl(profile.sidebar_website_url);
  const websiteItem = target.querySelector('[data-sidebar-field="website"]');
  const websiteLink = target.querySelector('[data-sidebar-link="website"]');
  if (websiteItem && websiteLink && "sidebar_website_url" in profile) {
    websiteItem.hidden = !websiteUrl;
    if (websiteUrl) websiteLink.href = websiteUrl;
  }

  const githubUrl = "sidebar_github_url" in profile ? sidebarExternalUrl(profile.sidebar_github_url) : "";
  const githubItem = target.querySelector('[data-sidebar-field="github"]');
  const githubLink = target.querySelector('[data-sidebar-link="github"]');
  if (githubItem && githubLink && "sidebar_github_url" in profile) {
    githubItem.hidden = !githubUrl;
    if (githubUrl) githubLink.href = githubUrl;
  }
}

async function loadSidebarProfile() {
  if (!document.querySelector("[data-sidebar-profile]") || !config.projectUrl || !config.publishableKey) return;
  try {
    renderSidebarProfile(await getSiteProfile());
  } catch {
    // Keep the static Jekyll-rendered sidebar as a fallback when the API is unavailable.
  }
}

function setStatus(message, type = "info") {
  if (!status) return;
  status.textContent = message;
  status.dataset.statusType = type;
  status.hidden = !message;
}

function formatDataUpdatedAt(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date).reduce((result, part) => {
    if (part.type !== "literal") result[part.type] = part.value;
    return result;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function setDataUpdatedAt(rows) {
  const target = document.querySelector("[data-data-updated]");
  if (!target) return;
  const timestamps = rows
    .flatMap((row) => Array.isArray(row) ? row : [row])
    .map((row) => row?.updated_at)
    .filter(Boolean)
    .map((value) => ({ value, time: Date.parse(value) }))
    .filter(({ time }) => !Number.isNaN(time));
  const latest = timestamps.sort((a, b) => b.time - a.time)[0];
  target.dataset.timestamp = latest ? formatDataUpdatedAt(latest.value) : "";
  target.hidden = !target.dataset.timestamp;
  window.dispatchEvent(new CustomEvent("site-data-updated"));
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
  const mergedStudy = {
    ...study,
    name: "研学实践",
    name_en: study.name_en || "Study & practice",
    description: study.description || "科技、校园与社会实践的研学记录。",
    description_en: study.description_en || "Experiences in technology, school and community activities."
  };
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
  const displayName = currentLanguage() === "en"
    ? (profile.english_name || profile.name)
    : profile.name;
  target.innerHTML = `
    <div class="db-overview-identity">
      <div class="db-overview-identity-copy">
        <p class="db-overview-eyebrow">${escapeHtml(text("overview"))}</p>
        <h1>${escapeHtml(displayName || "陈瑾辰")}</h1>
        ${profile.english_name && currentLanguage() !== "en" ? `<p class="db-overview-english">${escapeHtml(profile.english_name)}</p>` : ""}
        <p class="db-overview-meta">${escapeHtml([localized(profile, "school"), localized(profile, "grade"), localized(profile, "class_name")].filter(Boolean).join(" · "))}</p>
        ${localized(profile, "short_tagline") ? `<p class="db-overview-tagline">${escapeHtml(localized(profile, "short_tagline"))}</p>` : ""}
      </div>
      <img class="db-overview-feature-image" src="${escapeHtml(overviewImage)}" alt="${escapeHtml(text("guitarAlt", "弹吉他"))}">
    </div>
  `;
  const image = target.querySelector(".db-overview-feature-image");
  image?.addEventListener("click", () => {
    const overlay = document.createElement("div");
    overlay.className = "db-image-lightbox";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", image.alt || text("guitarAlt", "弹吉他"));
    overlay.innerHTML = `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">`;
    const close = () => overlay.remove();
    overlay.addEventListener("click", close);
    overlay.querySelector("img")?.addEventListener("click", (event) => event.stopPropagation());
    document.body.appendChild(overlay);
  });
  target.hidden = false;
}

function renderProfileSections(sections, profile) {
  const target = document.querySelector("[data-profile-sections]");
  const fallback = document.querySelector("[data-profile-fallback]");
  if (!target || !sections.length) return;
  const configuredLimit = Number(profile?.overview_profile_sections_limit);
  const limit = Number.isInteger(configuredLimit) && configuredLimit >= 0 ? configuredLimit : 3;
  const visibleSections = limit ? sections.slice(0, limit) : sections;
  target.innerHTML = visibleSections.map((section) => {
    const sectionImage = section.section_key === "overview" ? "" : section.image_url;
    return `
    <section class="db-profile-section ${sectionImage ? "db-profile-section-with-image" : ""}" data-section-key="${escapeHtml(section.section_key)}">
      <div class="db-profile-section-copy">
        <h2>${escapeHtml(localized(section, "title"))}</h2>
        ${localized(section, "subtitle") ? `<p class="db-section-subtitle">${escapeHtml(localized(section, "subtitle"))}</p>` : ""}
        <div class="db-markdown">${renderMarkdown(localized(section, "body_markdown"))}</div>
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
  return hrefs[category?.slug] || (category?.slug ? `/honors/?category=${encodeURIComponent(category.slug)}` : "/honors/");
}

function categoryLabel(category, activities = false) {
  if (currentLanguage() === "en" && category?.name_en?.trim()) return category.name_en.trim();
  if (category?.slug === "study-tour" && activities) return text("studyPractice");
  if (category?.slug === "other") return activities ? text("additionalActivities") : text("additionalHonors");
  if (currentLanguage() === "en") {
    const standardLabels = {
      school: "School",
      mathematics: "Mathematics",
      english: "English",
      programming: "Coding & CS",
      "arts-and-well-rounded": "Well-rounded"
    };
    if (standardLabels[category?.slug]) return standardLabels[category.slug];
  }
  return localized(category, "name", text("uncategorized"));
}

function awardCard(row, category) {
  const result = [localized(row, "result"), localized(row, "level")].filter(Boolean).join(" · ");
  return `
    <a class="db-feature-card ${row.is_pinned ? "db-feature-card-pinned" : ""} ${categoryClass(category)}" href="${categoryHref(category)}">
      <p class="db-feature-card-date">${escapeHtml(row.display_date)}</p>
      <h3>${escapeHtml(localized(row, "title"))}</h3>
      <p>${escapeHtml(result)}</p>
      ${localized(row, "description") ? `<div class="db-feature-card-description">${escapeHtml(localized(row, "description"))}</div>` : ""}
    </a>
  `;
}

function activityCard(row, category) {
  return `
    <a class="db-feature-card ${row.is_pinned ? "db-feature-card-pinned" : ""} ${categoryClass(category)}" href="/activities/">
      <p class="db-feature-card-date">${escapeHtml(row.display_date)}</p>
      <h3>${escapeHtml(localized(row, "title"))}</h3>
      ${localized(row, "description") ? `<div class="db-feature-card-description">${escapeHtml(localized(row, "description"))}</div>` : ""}
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
    <div class="db-section-heading"><div><p class="db-overview-eyebrow">${escapeHtml(text("featuredResults"))}</p><h2>${escapeHtml(text("importantHonors"))}</h2></div><a class="db-text-link" href="${target.dataset.allHref || "/honors/"}">${escapeHtml(text("viewAllHonors"))}</a></div>
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
    <div class="db-section-heading"><div><p class="db-overview-eyebrow">${escapeHtml(text("featuredExperiences"))}</p><h2>${escapeHtml(text("studyPractice"))}</h2></div><a class="db-text-link" href="${target.dataset.allHref || "/activities/"}">${escapeHtml(text("viewAllActivities"))}</a></div>
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
  const allHref = activities ? "/activities/" : "/honors/";
  const typedCategories = categories.filter((category) => category.content_type === type);
  const visibleCategories = rows.length
    ? groupedCategories(typedCategories, rows).map(({ category }) => category)
    : typedCategories;
  const counts = new Map();
  rows.forEach((row) => counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1));
  const countLabel = (count) => currentLanguage() === "en" ? count + " items" : count + "项";
  const categoryLinks = visibleCategories.map((category) => `
    <a class="db-category-link ${category.slug === selectedSlug ? "is-active" : ""}" href="${hrefs[category.slug] || `/honors/?category=${encodeURIComponent(category.slug)}`}" data-category-slug="${escapeHtml(category.slug)}"><span>${escapeHtml(categoryLabel(category, activities))}</span><small>${escapeHtml(countLabel(counts.get(category.id) || 0))}</small></a>
  `).join("");
  target.innerHTML = `<a class="db-category-link ${selectedSlug ? "" : "is-active"}" href="${allHref}"><span>${escapeHtml(text("all"))}</span><small>${escapeHtml(countLabel(rows.length))}</small></a>${categoryLinks}`;
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
      <div class="db-category-heading"><h2>${escapeHtml(categoryLabel(category))}<small>${escapeHtml(currentLanguage() === "en" ? rows.length + " items" : rows.length + "项")}</small></h2></div>
      ${localized(category, "description") ? `<p class="db-category-description">${escapeHtml(localized(category, "description"))}</p>` : ""}
      <table class="db-awards-table">
        <thead><tr><th>${escapeHtml(text("date"))}</th><th>${escapeHtml(text("event"))}</th><th>${escapeHtml(text("award"))}</th><th>${escapeHtml(text("level"))}</th></tr></thead>
        <tbody>${rows.sort(sortRows).map((row) => `
          <tr class="${row.is_pinned ? "db-award-pinned" : ""}">
            <td>${escapeHtml(row.display_date)}</td>
            <td>${escapeHtml(localized(row, "title"))}${row.is_offline ? `<span class="db-offline-label">${escapeHtml(text("offline"))}</span>` : ""}${localized(row, "description") ? `<div class="db-award-description">${escapeHtml(localized(row, "description"))}</div>` : ""}</td>
            <td>${escapeHtml(localized(row, "result"))}</td>
            <td>${escapeHtml(localized(row, "level"))}</td>
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
      <div class="db-category-heading"><h2>${escapeHtml(categoryLabel(category, true))}<small>${escapeHtml(currentLanguage() === "en" ? rows.length + " items" : rows.length + "项")}</small></h2></div>
      <div class="timeline-container">${rows.sort(sortRows).map((row) => `
        <article class="timeline-item ${row.is_pinned ? "db-activity-pinned" : ""}">
          <div class="timeline-time">${escapeHtml(row.display_date)}</div>
          <div class="timeline-title">${escapeHtml(localized(row, "title"))}${row.is_offline ? `<span class="db-offline-label">${escapeHtml(text("offline"))}</span>` : ""}</div>
          ${localized(row, "description") ? `<div class="db-activity-description">${escapeHtml(localized(row, "description"))}</div>` : ""}
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
  return `<li><strong>${escapeHtml(localized(row, "title"))}</strong><span>${escapeHtml([localized(row, "result"), localized(row, "level")].filter(Boolean).join(" · "))}</span></li>`;
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
  const displayName = currentLanguage() === "en"
    ? (profile?.english_name || profile?.name || "Jinchen Chen")
    : (profile?.name || "陈瑾辰");
  const overviewHighlights = overview ? renderMarkdown(localized(overview, "body_markdown")) : `<p>${escapeHtml(localized(profile, "short_tagline"))}</p>`;
  const academicFallback = academic
    ? renderMarkdown(localized(academic, "body_markdown"))
    : `<p>${escapeHtml(text("rankFallback"))}</p>`;
  const school = localized(profile, "school");
  const profileMeta = [school, localized(profile, "grade"), localized(profile, "class_name")].filter(Boolean).join(" · ");
  const shortTagline = localized(profile, "short_tagline", currentLanguage() === "en"
    ? "Curious about mathematics, coding and creative problem-solving."
    : "热爱数学、编程与创造，学习自律、性格开朗，在竞赛、艺术与公益实践中持续成长。");
  const overviewTitle = text("aboutMe");
  const slides = [
    { eyebrow: "PERSONAL PROFILE · 2026", title: displayName, body: "JASON CHEN", detailHref: "/", detailLabel: text("overview"), className: "db-presentation-cover", content: `<div class="db-presentation-cover-grid"><div><p>${escapeHtml(profileMeta)}</p><ul class="db-presentation-highlight-list">${awards.filter((row) => row.is_pinned).sort(sortRows).slice(0, 4).map(presentationCard).join("")}</ul></div><img class="db-presentation-avatar" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(displayName)}"></div>` },
    { eyebrow: "ABOUT ME", title: overviewTitle, detailHref: "/", detailLabel: text("completeOverview"), className: "db-presentation-overview", content: `<div class="db-presentation-overview-grid"><div class="db-presentation-overview-aside"><img class="db-presentation-avatar db-presentation-avatar-large" src="${escapeHtml(avatarSrc)}" alt="${escapeHtml(displayName)}"><strong>${escapeHtml(text("academicStrength"))}</strong><p>${escapeHtml(shortTagline)}</p></div><div class="db-presentation-markdown">${overviewHighlights}</div></div>` },
    { eyebrow: "ACADEMIC RECORD", title: text("academicRecord"), detailHref: "/school/", detailLabel: text("completeSchool"), className: "", content: `<div class="db-presentation-academic-grid"><div class="db-presentation-markdown">${academicFallback}</div><div class="db-presentation-stat"><strong>1 / 40</strong><span>${escapeHtml(text("academicRank"))}</span><em>${escapeHtml(text("squadLeader"))}</em></div></div>` },
    { eyebrow: "MATHEMATICS", title: text("mathematics"), detailHref: "/mathematics/", detailLabel: text("completeMathematics"), className: "", content: `<div class="db-presentation-statline"><strong>10+</strong><span>${escapeHtml(text("mathAwards"))}</span></div><ul class="db-presentation-list db-presentation-list-dense">${math.rows.slice(0, 6).map(presentationCard).join("")}</ul>` },
    { eyebrow: "ENGLISH", title: text("english"), detailHref: "/english/", detailLabel: text("completeEnglish"), className: "", content: `<div class="db-presentation-score"><strong>850</strong><span>${escapeHtml(text("toeflScore"))}</span></div>${englishSection ? `<div class="db-presentation-markdown">${renderMarkdown(localized(englishSection, "body_markdown"))}</div>` : ""}<ul class="db-presentation-list">${english.rows.slice(0, 4).map(presentationCard).join("")}</ul>` },
    { eyebrow: "CODING & CS", title: text("coding"), detailHref: "/programming/", detailLabel: text("completeCoding"), className: "", content: `<div class="db-presentation-statline"><strong>30+</strong><span>${escapeHtml(text("codingAwards"))}</span></div>${programmingSection ? `<div class="db-presentation-markdown">${renderMarkdown(localized(programmingSection, "body_markdown"))}</div>` : ""}<ul class="db-presentation-list db-presentation-list-dense">${programming.rows.slice(0, 4).map(presentationCard).join("")}</ul>` },
    { eyebrow: "PRACTICE & STUDY TOUR", title: text("studyPractice"), detailHref: "/activities/", detailLabel: text("completeActivities"), className: "", content: `<div class="db-presentation-activity-grid">${practice.map((row) => `<article><span>${escapeHtml(row.display_date)}</span><strong>${escapeHtml(localized(row, "title"))}</strong><p>${escapeHtml(localized(row, "description"))}</p></article>`).join("")}</div>` },
    { eyebrow: "WELL-ROUNDED", title: text("wellRounded"), detailHref: "/comprehensive/", detailLabel: text("completeWellRounded"), className: "", content: `${comprehensiveSection ? `<div class="db-presentation-markdown">${renderMarkdown(localized(comprehensiveSection, "body_markdown"))}</div>` : ""}<ul class="db-presentation-list">${comprehensive.rows.slice(0, 6).map(presentationCard).join("")}</ul><p class="db-presentation-hobbies">${escapeHtml(text("hobbies"))}</p>` },
    { eyebrow: "CONTACT", title: text("contact"), detailHref: "/", detailLabel: text("backOverview"), className: "db-presentation-closing", content: `<p>${escapeHtml(profile?.email || "")}</p><p>${escapeHtml(localized(profile, "location"))}</p>` }
  ];
  target.innerHTML = `
    <div class="db-presentation-stage">
      <nav class="db-presentation-mininav" aria-label="${escapeHtml(text("presentationTabs"))}">${slides.map((slide, index) => `<button type="button" data-presentation-jump="${index}" class="${index === 0 ? "is-current" : ""}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(slide.title)}</button>`).join("")}</nav>
      <div class="db-presentation-slides">${slides.map((slide, index) => `<section class="db-presentation-slide ${slide.className}" data-slide="${index}" ${index ? "hidden" : ""}><div class="db-presentation-title-row"><div><p class="db-presentation-eyebrow">${slide.eyebrow}</p><h2>${escapeHtml(slide.title)}</h2></div>${slide.detailHref ? `<a class="db-presentation-detail-link" href="${escapeHtml(slide.detailHref)}">${escapeHtml(slide.detailLabel || "查看全部")}</a>` : ""}</div>${slide.body ? `<p class="db-presentation-lead">${escapeHtml(slide.body)}</p>` : ""}${slide.content}</section>`).join("")}</div>
      <div class="db-presentation-controls"><button type="button" data-presentation-prev aria-label="${escapeHtml(text("previous"))}">←</button><span data-presentation-count>1 / ${slides.length}</span><button type="button" data-presentation-next aria-label="${escapeHtml(text("next"))}">→</button><button type="button" data-presentation-fullscreen aria-label="${escapeHtml(text("fullscreen"))}">${escapeHtml(text("fullscreen"))}</button></div>
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
  const previousKeyHandler = presentationKeyHandlers.get(target);
  if (previousKeyHandler) target.removeEventListener("keydown", previousKeyHandler);
  const keyHandler = (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight" || event.key === " ") show(current + 1);
  };
  target.addEventListener("keydown", keyHandler);
  presentationKeyHandlers.set(target, keyHandler);
  target.tabIndex = 0;
}

async function loadContent() {
  if (!page) return;
  if (!config.projectUrl || !config.publishableKey) return;
  const [profiles, visibleSections, visibleAwards, visibleActivities, awardCategories, activityCategories] = await Promise.all([
    getSiteProfile(),
    selectRows("profile_sections", { "is_visible": "eq.true", order: "sort_order.asc" }),
    selectRows("awards", { "is_visible": "eq.true" }),
    selectRows("activities", { "is_visible": "eq.true" }),
    selectRows("categories", { "content_type": "eq.award", "is_visible": "eq.true", order: "sort_order.asc" }),
    selectRows("categories", { "content_type": "eq.activity", "is_visible": "eq.true", order: "sort_order.asc" })
  ]);
  const profile = profiles;
  visibleAwards.sort(sortByDateDesc);
  visibleActivities.sort(sortByDateDesc);
  renderedContent = {
    profile,
    sections: visibleSections || [],
    awards: visibleAwards || [],
    activities: visibleActivities || [],
    awardCategories: awardCategories || [],
    activityCategories: activityCategories || []
  };
  setDataUpdatedAt([profile, visibleSections, visibleAwards, visibleActivities, awardCategories, activityCategories]);
  renderAllContent();
  setStatus("");
}

loadSidebarProfile();
loadContent().catch((error) => setStatus(error.message || text("unknownError"), "error"));
