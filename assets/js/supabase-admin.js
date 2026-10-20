import {
  escapeHtml,
  formatSupabaseError,
  isSupabaseConfigured,
  supabase
} from "./supabase-client.js";

const app = document.querySelector("[data-admin-app]");
if (app) {
  let statusFadeTimer;
  let statusHideTimer;
  const state = {
    tab: "profile",
    editing: {},
    siteProfile: {},
    profileSections: [],
    categories: [],
    awards: [],
    activities: []
  };

  const status = (message, type = "info") => {
    const node = document.querySelector("[data-admin-status]");
    if (!node) return;
    window.clearTimeout(statusFadeTimer);
    window.clearTimeout(statusHideTimer);
    node.classList.remove("is-leaving");
    if (!message) {
      node.hidden = true;
      return;
    }
    if (node.parentElement !== document.body) document.body.append(node);
    node.textContent = message;
    node.className = `db-content-status db-admin-toast db-admin-${type}`;
    node.setAttribute("role", type === "error" ? "alert" : "status");
    node.setAttribute("aria-live", type === "error" ? "assertive" : "polite");
    node.hidden = false;
    if (type === "success") {
      statusFadeTimer = window.setTimeout(() => node.classList.add("is-leaving"), 2300);
      statusHideTimer = window.setTimeout(() => { node.hidden = true; }, 2650);
    }
  };

  const field = (label, name, value = "", type = "text", extra = "") => `
    <label>${label}<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${extra}></label>
  `;

  const textarea = (label, name, value = "", extra = "") => `
    <label class="db-field-full">${label}<textarea name="${name}" ${extra}>${escapeHtml(value)}</textarea></label>
  `;

  const checkbox = (label, name, checked) => `
    <label><span>${label}</span><input name="${name}" type="checkbox" ${checked ? "checked" : ""}></label>
  `;

  function categoryOptions(type, selected = "") {
    return state.categories
      .filter((category) => category.content_type === type)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => `<option value="${category.id}" ${category.id === selected ? "selected" : ""}>${escapeHtml(category.name)}</option>`)
      .join("");
  }

  function categoryName(id) {
    return state.categories.find((category) => category.id === id)?.name || "未分类";
  }

  function editorHeader(type, label) {
    return `<div class="db-admin-toolbar"><h2>${label}</h2><button type="button" class="btn btn--inverse" data-new="${type}">新增</button></div>`;
  }

  function profilePanel() {
    const record = state.editing.profile || {};
    const siteProfile = state.siteProfile || {};
    return `
      <div class="db-admin-toolbar"><h2>基本资料</h2></div>
      <form data-form="site_profile">
        <div class="db-form-grid">
          ${field("姓名", "name", siteProfile.name || "", "text", "required")}
          ${field("英文名", "english_name", siteProfile.english_name || "")}
          ${field("学校 / 机构（基本资料和左侧栏）", "school", siteProfile.school || "")}
          ${field("学校 / 机构（英文）", "school_en", siteProfile.school_en || "")}
          ${field("年级", "grade", siteProfile.grade || "")}
          ${field("年级（英文）", "grade_en", siteProfile.grade_en || "")}
          ${field("班级", "class_name", siteProfile.class_name || "")}
          ${field("班级（英文）", "class_name_en", siteProfile.class_name_en || "")}
          ${field("所在地（基本资料和左侧栏）", "location", siteProfile.location || "")}
          ${field("所在地（英文）", "location_en", siteProfile.location_en || "")}
          ${field("邮箱（基本资料和左侧栏）", "email", siteProfile.email || "", "email")}
          ${field("头像地址（支持站内路径或完整网址）", "avatar_url", siteProfile.avatar_url || "", "text", "placeholder=\"/images/portrait.png 或 https://...\"")}
          ${field("一句话简介", "short_tagline", siteProfile.short_tagline || "")}
          ${field("一句话简介（英文）", "short_tagline_en", siteProfile.short_tagline_en || "")}
          ${field("生日显示", "birthday_label", siteProfile.birthday_label || "")}
          ${field("概览个人描述数量（0 为全部）", "overview_profile_sections_limit", siteProfile.overview_profile_sections_limit ?? 3, "number", "required min=\"0\" max=\"50\" step=\"1\"")}
          <h3 class="db-form-section-title db-field-full">左侧栏</h3>
          ${field("显示名称", "sidebar_name", siteProfile.sidebar_name || "")}
          ${field("显示名称（英文）", "sidebar_name_en", siteProfile.sidebar_name_en || "")}
          ${field("侧栏头像（支持站内路径或完整网址）", "sidebar_avatar_url", siteProfile.sidebar_avatar_url || "/images/sidebar-avatar.png", "text", "placeholder=\"/images/sidebar-avatar.png 或 https://...\"")}
          ${field("个性签名", "sidebar_pronouns", siteProfile.sidebar_pronouns || "")}
          ${field("个性签名（英文）", "sidebar_pronouns_en", siteProfile.sidebar_pronouns_en || "")}
          ${field("个人网站", "sidebar_website_url", siteProfile.sidebar_website_url || "", "text", "placeholder=\"https://example.com\"")}
          ${field("GitHub 个人主页", "sidebar_github_url", siteProfile.sidebar_github_url || "", "text", "placeholder=\"https://github.com/用户名\" ")}
          ${textarea("侧栏简介", "sidebar_bio", siteProfile.sidebar_bio || "")}
          ${textarea("侧栏简介（英文）", "sidebar_bio_en", siteProfile.sidebar_bio_en || "")}
          ${textarea("SEO 描述", "seo_description", siteProfile.seo_description || "")}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">保存基本资料</button></div>
      </form>
      ${editorHeader("profile", "个人描述")}
      <form data-form="profile" ${state.editing.profile ? "" : "hidden"}>
        <div class="db-form-grid">
          ${field("区块 key", "section_key", record.section_key || "")}
          ${field("标题", "title", record.title || "")}
          ${field("标题（英文）", "title_en", record.title_en || "")}
          ${field("副标题", "subtitle", record.subtitle || "")}
          ${field("副标题（英文）", "subtitle_en", record.subtitle_en || "")}
          ${field("排序", "sort_order", record.sort_order ?? 100, "number")}
          ${field("图片地址", "image_url", record.image_url || "")}
          ${checkbox("显示", "is_visible", record.is_visible !== false)}
          ${textarea("Markdown 内容", "body_markdown", record.body_markdown || "", "required")}
          ${textarea("Markdown 内容（英文）", "body_markdown_en", record.body_markdown_en || "")}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">保存</button><button class="btn btn--inverse" type="button" data-cancel="profile">取消</button></div>
      </form>
      <table class="db-admin-table"><thead><tr><th>排序</th><th>标题</th><th>key</th><th>状态</th><th>操作</th></tr></thead><tbody>
        ${state.profileSections.map((row) => `<tr><td>${row.sort_order}</td><td>${escapeHtml(row.title)}</td><td>${escapeHtml(row.section_key)}</td><td>${row.is_visible ? "显示" : "隐藏"}</td><td class="db-row-actions"><button class="btn btn--small" type="button" data-edit="profile" data-id="${escapeHtml(row.id)}">编辑</button> <button class="btn btn--small" type="button" data-delete="profile" data-id="${escapeHtml(row.id)}">删除</button></td></tr>`).join("")}
      </tbody></table>
    `;
  }

  function categoryPanel() {
    const record = state.editing.category || {};
    return `
      ${editorHeader("category", "分类管理")}
      <form data-form="category" ${state.editing.category ? "" : "hidden"}>
        <div class="db-form-grid">
          <label>内容类型<select name="content_type"><option value="award" ${record.content_type === "award" ? "selected" : ""}>荣誉</option><option value="activity" ${record.content_type === "activity" ? "selected" : ""}>活动</option></select></label>
          ${field("名称", "name", record.name || "", "text", "required")}
          ${field("名称（英文）", "name_en", record.name_en || "")}
          ${field("slug", "slug", record.slug || "", "text", "required")}
          <label>颜色<select name="accent_color">${["gold", "blue", "green", "purple", "gray"].map((color) => `<option value="${color}" ${record.accent_color === color ? "selected" : ""}>${color}</option>`).join("")}</select></label>
          ${field("排序", "sort_order", record.sort_order ?? 100, "number")}
          ${checkbox("显示", "is_visible", record.is_visible !== false)}
          ${textarea("描述", "description", record.description || "")}
          ${textarea("描述（英文）", "description_en", record.description_en || "")}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">保存</button><button class="btn btn--inverse" type="button" data-cancel="category">取消</button></div>
      </form>
      <table class="db-admin-table"><thead><tr><th>类型</th><th>名称</th><th>slug</th><th>排序</th><th>操作</th></tr></thead><tbody>
        ${state.categories.sort((a, b) => (a.content_type.localeCompare(b.content_type)) || (a.sort_order - b.sort_order)).map((row) => `<tr><td>${row.content_type === "award" ? "荣誉" : "活动"}</td><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.slug)}</td><td>${row.sort_order}</td><td class="db-row-actions"><button class="btn btn--small" type="button" data-edit="category" data-id="${escapeHtml(row.id)}">编辑</button> <button class="btn btn--small" type="button" data-delete="category" data-id="${escapeHtml(row.id)}">删除</button></td></tr>`).join("")}
      </tbody></table>
    `;
  }

  function awardPanel() {
    const record = state.editing.award || {};
    return `
      ${editorHeader("award", "荣誉奖项")}
      <form data-form="award" ${state.editing.award ? "" : "hidden"}>
        <div class="db-form-grid">
          <label>分类<select name="category_id" required>${categoryOptions("award", record.category_id)}</select></label>
          ${field("显示日期", "display_date", record.display_date || "", "text", "required")}
          ${field("排序日期", "sort_date", record.sort_date || "", "date")}
          ${field("事件名称", "title", record.title || "", "text", "required")}
          ${field("事件名称（英文）", "title_en", record.title_en || "")}
          ${field("奖项结果", "result", record.result || "")}
          ${field("奖项结果（英文）", "result_en", record.result_en || "")}
          ${field("等级", "level", record.level || "")}
          ${field("等级（英文）", "level_en", record.level_en || "")}
          ${field("置顶顺序", "pin_order", record.pin_order ?? 1000, "number")}
          ${field("普通排序", "sort_order", record.sort_order ?? 1000, "number")}
          ${checkbox("置顶", "is_pinned", record.is_pinned)}
          ${checkbox("线下", "is_offline", record.is_offline)}
          ${checkbox("显示", "is_visible", record.is_visible !== false)}
          ${textarea("补充描述", "description", record.description || "")}
          ${textarea("补充描述（英文）", "description_en", record.description_en || "")}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">保存</button><button class="btn btn--inverse" type="button" data-cancel="award">取消</button></div>
      </form>
      <table class="db-admin-table"><thead><tr><th>日期</th><th>名称</th><th>分类</th><th>置顶</th><th>线下</th><th>操作</th></tr></thead><tbody>
        ${state.awards.sort((a, b) => (b.is_pinned - a.is_pinned) || String(b.sort_date || "").localeCompare(String(a.sort_date || ""))).map((row) => `<tr><td>${escapeHtml(row.display_date)}</td><td>${escapeHtml(row.title)}<br><small>${escapeHtml(row.result)}</small></td><td>${escapeHtml(categoryName(row.category_id))}</td><td>${row.is_pinned ? "是" : "否"}</td><td>${row.is_offline ? "是" : "否"}</td><td class="db-row-actions"><button class="btn btn--small" type="button" data-edit="award" data-id="${escapeHtml(row.id)}">编辑</button> <button class="btn btn--small" type="button" data-toggle-pin="award" data-id="${escapeHtml(row.id)}">${row.is_pinned ? "取消置顶" : "置顶"}</button> <button class="btn btn--small" type="button" data-delete="award" data-id="${escapeHtml(row.id)}">删除</button></td></tr>`).join("")}
      </tbody></table>
    `;
  }

  function activityPanel() {
    const record = state.editing.activity || {};
    return `
      ${editorHeader("activity", "活动经历")}
      <form data-form="activity" ${state.editing.activity ? "" : "hidden"}>
        <div class="db-form-grid">
          <label>分类<select name="category_id" required>${categoryOptions("activity", record.category_id)}</select></label>
          ${field("显示日期", "display_date", record.display_date || "", "text", "required")}
          ${field("排序日期", "sort_date", record.sort_date || "", "date")}
          ${field("活动名称", "title", record.title || "", "text", "required")}
          ${field("活动名称（英文）", "title_en", record.title_en || "")}
          ${field("置顶顺序", "pin_order", record.pin_order ?? 1000, "number")}
          ${field("普通排序", "sort_order", record.sort_order ?? 1000, "number")}
          ${checkbox("置顶", "is_pinned", record.is_pinned)}
          ${checkbox("线下", "is_offline", record.is_offline)}
          ${checkbox("显示", "is_visible", record.is_visible !== false)}
          ${textarea("活动描述", "description", record.description || "")}
          ${textarea("活动描述（英文）", "description_en", record.description_en || "")}
          ${textarea("图片地址（每行一个）", "image_paths", (record.image_paths || []).join("\n"))}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">保存</button><button class="btn btn--inverse" type="button" data-cancel="activity">取消</button></div>
      </form>
      <table class="db-admin-table"><thead><tr><th>日期</th><th>活动</th><th>分类</th><th>置顶</th><th>线下</th><th>操作</th></tr></thead><tbody>
        ${state.activities.sort((a, b) => (b.is_pinned - a.is_pinned) || String(b.sort_date || "").localeCompare(String(a.sort_date || ""))).map((row) => `<tr><td>${escapeHtml(row.display_date)}</td><td>${escapeHtml(row.title)}</td><td>${escapeHtml(categoryName(row.category_id))}</td><td>${row.is_pinned ? "是" : "否"}</td><td>${row.is_offline ? "是" : "否"}</td><td class="db-row-actions"><button class="btn btn--small" type="button" data-edit="activity" data-id="${escapeHtml(row.id)}">编辑</button> <button class="btn btn--small" type="button" data-toggle-pin="activity" data-id="${escapeHtml(row.id)}">${row.is_pinned ? "取消置顶" : "置顶"}</button> <button class="btn btn--small" type="button" data-delete="activity" data-id="${escapeHtml(row.id)}">删除</button></td></tr>`).join("")}
      </tbody></table>
    `;
  }

  function renderDashboard(user) {
    app.innerHTML = `
      <div class="db-admin-toolbar"><strong>管理员：${escapeHtml(user.email || "")}</strong><button class="btn btn--inverse" type="button" data-signout>退出登录</button></div>
      <nav class="db-admin-tabs" aria-label="内容管理">
        ${[["profile", "个人描述"], ["award", "荣誉"], ["activity", "活动"], ["category", "分类"]].map(([key, label]) => `<button type="button" class="${state.tab === key ? "is-active" : ""}" data-tab="${key}">${label}</button>`).join("")}
      </nav>
      <section class="db-admin-panel" data-panel="profile" ${state.tab === "profile" ? "" : "hidden"}>${profilePanel()}</section>
      <section class="db-admin-panel" data-panel="award" ${state.tab === "award" ? "" : "hidden"}>${awardPanel()}</section>
      <section class="db-admin-panel" data-panel="activity" ${state.tab === "activity" ? "" : "hidden"}>${activityPanel()}</section>
      <section class="db-admin-panel" data-panel="category" ${state.tab === "category" ? "" : "hidden"}>${categoryPanel()}</section>
    `;
  }

  async function loadData() {
    const [siteProfile, sections, categories, awards, activities] = await Promise.all([
      supabase.from("site_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("profile_sections").select("*").order("sort_order"),
      supabase.from("categories").select("*").order("content_type").order("sort_order"),
      supabase.from("awards").select("*"),
      supabase.from("activities").select("*")
    ]);
    const error = [siteProfile, sections, categories, awards, activities].find((result) => result.error)?.error;
    if (error) throw error;
    state.siteProfile = siteProfile.data || {};
    state.profileSections = sections.data || [];
    state.categories = categories.data || [];
    state.awards = awards.data || [];
    state.activities = activities.data || [];
  }

  async function verifyAdmin(session) {
    const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", session.user.id).maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("当前账号不在 admin_users 管理员名单中。");
  }

  function showLogin() {
    app.innerHTML = `
      <form data-form="login" class="db-admin-login">
        <div class="db-form-grid">
          ${field("登录邮箱", "email", "", "email", "required autocomplete=\"email\"")}
          ${field("密码", "password", "", "password", "required autocomplete=\"current-password\"")}
        </div>
        <div class="db-form-actions"><button class="btn btn--primary" type="submit">登录</button></div>
      </form>
    `;
  }

  async function boot() {
    if (!isSupabaseConfigured || !supabase) {
      showLogin();
      status("请先在 _config.yml 中填写 Supabase project_url 和 publishable_key。", "error");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showLogin();
      return;
    }
    try {
      await verifyAdmin(session);
      await loadData();
      renderDashboard(session.user);
      status("");
    } catch (error) {
      await supabase.auth.signOut();
      showLogin();
      status(formatSupabaseError(error), "error");
    }
  }

  async function saveRecord(type, form) {
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    if (["profile", "category", "award", "activity"].includes(type)) payload.is_visible = data.has("is_visible");
    if (["award", "activity"].includes(type)) {
      payload.is_pinned = data.has("is_pinned");
      payload.is_offline = data.has("is_offline");
    }
    ["sort_order", "pin_order"].forEach((key) => { if (key in payload) payload[key] = Number(payload[key] || 1000); });
    if ("overview_profile_sections_limit" in payload) {
      payload.overview_profile_sections_limit = Math.min(50, Math.max(0, Number(payload.overview_profile_sections_limit || 0)));
    }
    if (type === "profile") payload.section_type = payload.image_url ? "rich_text_image" : "rich_text";
    if (type === "activity") payload.image_paths = (payload.image_paths || "").split(/[\n,]/).map((value) => value.trim()).filter(Boolean);
    if (type === "site_profile") {
      const result = await supabase.from("site_profile").update(payload).eq("id", 1);
      if (result.error) throw result.error;
    } else if (type === "profile") {
      const result = await supabase.from("profile_sections").upsert(payload, { onConflict: "section_key" });
      if (result.error) throw result.error;
    } else {
      const table = type === "award" ? "awards" : type === "activity" ? "activities" : "categories";
      const id = state.editing[type]?.id;
      const result = id
        ? await supabase.from(table).update(payload).eq("id", id)
        : await supabase.from(table).insert(payload);
      if (result.error) throw result.error;
    }
    state.editing[type] = null;
    await loadData();
    renderDashboard((await supabase.auth.getUser()).data.user);
    status("已保存。", "success");
  }

  async function deleteRecord(type, id) {
    const table = type === "profile" ? "profile_sections" : type === "award" ? "awards" : type === "activity" ? "activities" : "categories";
    const result = await supabase.from(table).delete().eq("id", id);
    if (result.error) throw result.error;
    await loadData();
    renderDashboard((await supabase.auth.getUser()).data.user);
    status("已删除。", "success");
  }

  async function togglePin(type, id) {
    const table = type === "award" ? "awards" : "activities";
    const row = state[type === "award" ? "awards" : "activities"].find((item) => item.id === id);
    const result = await supabase.from(table).update({ is_pinned: !row.is_pinned }).eq("id", id);
    if (result.error) throw result.error;
    await loadData();
    renderDashboard((await supabase.auth.getUser()).data.user);
    status(row.is_pinned ? "已取消置顶。" : "已置顶。", "success");
  }

  app.addEventListener("click", async (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    try {
      if (target.dataset.tab) {
        state.tab = target.dataset.tab;
        renderDashboard((await supabase.auth.getUser()).data.user);
      } else if (target.dataset.new) {
        state.editing[target.dataset.new] = {};
        state.tab = target.dataset.new;
        renderDashboard((await supabase.auth.getUser()).data.user);
      } else if (target.dataset.cancel) {
        state.editing[target.dataset.cancel] = null;
        renderDashboard((await supabase.auth.getUser()).data.user);
      } else if (target.dataset.edit) {
        const type = target.dataset.edit;
        const collection = type === "profile" ? state.profileSections : type === "category" ? state.categories : type === "award" ? state.awards : state.activities;
        state.editing[type] = collection.find((row) => row.id === target.dataset.id);
        state.tab = type;
        renderDashboard((await supabase.auth.getUser()).data.user);
      } else if (target.dataset.delete) {
        if (window.confirm("确定删除这条内容吗？")) await deleteRecord(target.dataset.delete, target.dataset.id);
      } else if (target.dataset.togglePin) {
        await togglePin(target.dataset.togglePin, target.dataset.id);
      } else if (target.dataset.signout) {
        await supabase.auth.signOut();
        showLogin();
      }
    } catch (error) {
      status(formatSupabaseError(error), "error");
    }
  });

  app.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    try {
      if (form.dataset.form === "login") {
        const data = new FormData(form);
        const result = await supabase.auth.signInWithPassword({ email: data.get("email"), password: data.get("password") });
        if (result.error) throw result.error;
        await boot();
      } else {
        await saveRecord(form.dataset.form, form);
      }
    } catch (error) {
      status(formatSupabaseError(error), "error");
    }
  });

  boot();
}
