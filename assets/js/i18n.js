(() => {
  const storageKey = "site-language";
  const languages = new Set(["zh", "en"]);
  const translations = {
    zh: {
      brand: "陈瑾辰",
      navOverview: "概览",
      navHonors: "荣誉",
      navStudy: "研学",
      navPresentation: "演示",
      languageSwitch: "切换到英文",
      languageName: "EN",
      themeSettings: "主题设置",
      themeOptions: "主题选项",
      themeSystem: "跟随系统",
      themeLight: "浅色",
      themeDark: "深色",
      follow: "关注",
      honorCategories: "荣誉分类",
      activityCategories: "活动分类",
      growthCategories: "成长分类",
      poweredBy: "技术支持：",
      feed: "订阅",
      website: "网站",
      email: "邮箱",
      dataUpdated: "数据最后更新",
      version: "版本",
      releaseDate: "发布时间",
      overview: "个人概览",
      featuredResults: "精选成果",
      importantHonors: "重要荣誉",
      featuredExperiences: "精选经历",
      studyPractice: "研学实践",
      viewAllHonors: "查看全部荣誉",
      viewAllActivities: "查看全部活动",
      viewAll: "查看全部",
      all: "全部",
      uncategorized: "未分类",
      additionalHonors: "补充荣誉",
      additionalActivities: "补充活动",
      date: "时间",
      event: "事件",
      award: "奖项",
      level: "等级",
      offline: "线下",
      presentationTabs: "简历演示页签",
      previous: "上一页",
      next: "下一页",
      fullscreen: "全屏",
      aboutMe: "个人概览",
      completeOverview: "查看完整概览",
      academicRecord: "学业表现",
      completeSchool: "查看完整校内内容",
      mathematics: "数学思维",
      completeMathematics: "查看全部数学成果",
      english: "英语能力",
      completeEnglish: "查看全部英语成果",
      coding: "信息学编程",
      completeCoding: "查看全部编程成果",
      completeActivities: "查看全部研学活动",
      wellRounded: "综合素质",
      completeWellRounded: "查看全部综合素质",
      contact: "谢谢浏览",
      backOverview: "返回概览",
      academicStrength: "学业全优 · 数理见长",
      academicRank: "历年成绩排名",
      squadLeader: "中队长",
      mathAwards: "项数学竞赛奖项",
      toeflScore: "TOEFL Junior · 小托福，满分 900",
      codingAwards: "项编程与人工智能相关奖项",
      hobbies: "绘画 · 篮球 · 吉他 · 公益 · 科技 · 话剧",
      rankFallback: "入学以来学科全优，学习功底扎实、习惯自律，历年总分排名第 1 / 40。",
      studying: "正在加载动态简历演示……",
      unknownError: "Supabase 请求失败，请检查配置和 RLS 策略。",
      guitarAlt: "弹吉他"
    },
    en: {
      brand: "Jinchen Chen",
      navOverview: "Overview",
      navHonors: "Honors",
      navStudy: "Activities",
      navPresentation: "Presentation",
      languageSwitch: "切换到中文",
      languageName: "中",
      themeSettings: "Theme settings",
      themeOptions: "Theme options",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      follow: "Follow",
      honorCategories: "Honor categories",
      activityCategories: "Activity categories",
      growthCategories: "Growth categories",
      poweredBy: "Powered by",
      feed: "Feed",
      website: "Website",
      email: "Email",
      dataUpdated: "Data last updated",
      version: "Version",
      releaseDate: "Released",
      overview: "Overview",
      featuredResults: "Featured results",
      importantHonors: "Featured honors",
      featuredExperiences: "Featured experiences",
      studyPractice: "Study & practice",
      viewAllHonors: "View all honors",
      viewAllActivities: "View all activities",
      viewAll: "View all",
      all: "All",
      uncategorized: "Uncategorized",
      additionalHonors: "Additional honors",
      additionalActivities: "Additional activities",
      date: "Date",
      event: "Event",
      award: "Award",
      level: "Level",
      offline: "Offline",
      presentationTabs: "Resume presentation slides",
      previous: "Previous slide",
      next: "Next slide",
      fullscreen: "Full screen",
      aboutMe: "About me",
      completeOverview: "View complete overview",
      academicRecord: "Academic record",
      completeSchool: "View school record",
      mathematics: "Mathematical thinking",
      completeMathematics: "View all mathematics results",
      english: "English",
      completeEnglish: "View all English results",
      coding: "Coding & CS",
      completeCoding: "View all coding results",
      completeActivities: "View all study activities",
      wellRounded: "Well-rounded",
      completeWellRounded: "View all activities",
      contact: "Thank you",
      backOverview: "Back to overview",
      academicStrength: "Strong academics · Mathematics & science",
      academicRank: "Overall ranking",
      squadLeader: "Class leader",
      mathAwards: "mathematics competition results",
      toeflScore: "TOEFL Junior · maximum score 900",
      codingAwards: "coding and artificial intelligence results",
      hobbies: "Drawing · Basketball · Guitar · Volunteering · Technology · Theatre",
      rankFallback: "Consistently excellent academic results, strong foundations and disciplined study habits; ranked 1st out of 40 overall.",
      studying: "Loading your interactive resume…",
      unknownError: "Could not load content from Supabase. Please check the configuration and RLS policies.",
      guitarAlt: "Playing guitar"
    }
  };

  const pageTranslations = {
    "/": { title: ["基本信息", "Profile"], intro: ["", ""] },
    "/cv/": { title: ["荣誉总览", "Honors"], intro: ["", ""] },
    "/presentation/": { title: ["简历演示", "Resume presentation"], intro: ["", ""] },
    "/activities/": { title: ["研学实践", "Study & practice"], intro: ["科技、校园与社会实践的经历记录。", "Experiences in technology, school and community activities."] },
    "/school/": { title: ["校内成长", "School"], intro: ["学业表现、校内荣誉与学校成长记录。", "Academic performance, school honors and growth records."] },
    "/mathematics/": { title: ["数学思维", "Mathematical thinking"], intro: ["数学竞赛、思维训练与相关学习成果。", "Mathematics competitions, problem-solving practice and related results."] },
    "/english/": { title: ["英语能力", "English"], intro: ["英语学习经历、证书与代表性成绩。", "English learning experiences, certificates and representative results."] },
    "/programming/": { title: ["信息学编程", "Coding & computer science"], intro: ["从 Scratch、Python 到 C++ 的学习路径与竞赛成果。", "A learning path from Scratch and Python to C++, with competition results."] },
    "/comprehensive/": { title: ["综合素质", "Well-rounded"], intro: ["艺术、协作、兴趣与其他综合能力。", "Arts, collaboration, interests and other strengths."] }
  };

  const readSavedLanguage = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (languages.has(saved)) return saved;
    } catch {
      // Private browsing and locked-down browsers can disable localStorage.
    }
    return /^en(?:-|$)/i.test(navigator.language || "") ? "en" : "zh";
  };

  let currentLanguage = readSavedLanguage();
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  document.documentElement.dataset.language = currentLanguage;

  const text = (key, fallback = "") => translations[currentLanguage]?.[key] || fallback || key;

  const localized = (row, field, fallback = "") => {
    if (!row) return fallback;
    if (currentLanguage === "en") {
      const english = String(row[`${field}_en`] ?? "").trim();
      if (english) return english;
    }
    const value = String(row[field] ?? "").trim();
    return value || fallback;
  };

  const setLanguageLabel = () => {
    const button = document.querySelector("[data-language-toggle]");
    if (!button) return;
    const label = button.querySelector("[data-language-toggle-label]");
    if (label) label.textContent = text("languageName");
    else button.textContent = text("languageName");
    button.title = text("languageSwitch");
    button.setAttribute("aria-label", text("languageSwitch"));
  };

  const applyStaticTranslations = () => {
    document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
    document.documentElement.dataset.language = currentLanguage;

    document.querySelectorAll("[data-i18n-key]").forEach((element) => {
      const value = text(element.dataset.i18nKey, element.textContent.trim());
      if (element.matches("input, textarea")) element.placeholder = value;
      else element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-zh][data-i18n-en]").forEach((element) => {
      const value = currentLanguage === "en" ? element.dataset.i18nEn : element.dataset.i18nZh;
      if (element.matches("input, textarea")) element.value = value;
      else element.textContent = value;
    });

    document.querySelectorAll("[data-i18n-aria-key]").forEach((element) => {
      element.setAttribute("aria-label", text(element.dataset.i18nAriaKey, element.getAttribute("aria-label") || ""));
    });

    document.querySelectorAll("[data-language-content]").forEach((element) => {
      element.hidden = element.dataset.languageContent !== currentLanguage;
    });

    const path = window.location.pathname === "/" ? "/" : `${window.location.pathname.replace(/\/+$/, "")}/`;
    const pageCopy = pageTranslations[path];
    if (pageCopy) {
      const title = document.querySelector(".page__title");
      const intro = document.querySelector(".db-page-intro");
      if (title) title.textContent = currentLanguage === "en" ? pageCopy.title[1] : pageCopy.title[0];
      if (intro && pageCopy.intro[0]) intro.textContent = currentLanguage === "en" ? pageCopy.intro[1] : pageCopy.intro[0];
      if (pageCopy.title[0]) {
        const brand = currentLanguage === "en" ? "Jinchen Chen" : "陈瑾辰";
        document.title = `${currentLanguage === "en" ? pageCopy.title[1] : pageCopy.title[0]} - ${brand}`;
      }
    }

    const meta = document.querySelector("[data-site-meta]");
    if (meta) {
      const version = meta.dataset.version || "";
      const releaseDate = meta.dataset.releaseDate || "";
      meta.textContent = currentLanguage === "en"
        ? `Version ${version} · Released ${releaseDate}`
        : `版本 ${version} · 发布时间 ${releaseDate}`;
    }
    const updated = document.querySelector("[data-data-updated]");
    if (updated) {
      const timestamp = updated.dataset.timestamp || "";
      updated.textContent = timestamp ? `${text("dataUpdated")} ${timestamp}` : "";
      updated.hidden = !timestamp;
    }
    setLanguageLabel();
  };

  const setLanguage = (language, persist = true) => {
    const next = languages.has(language) ? language : "zh";
    currentLanguage = next;
    if (persist) {
      try { window.localStorage.setItem(storageKey, next); } catch { /* best effort */ }
    }
    applyStaticTranslations();
    window.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: next } }));
  };

  window.SiteI18n = {
    get language() { return currentLanguage; },
    text,
    localized,
    setLanguage,
    apply: applyStaticTranslations
  };

  window.addEventListener("site-data-updated", applyStaticTranslations);

  const init = () => {
    document.querySelector("[data-language-toggle]")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setLanguage(currentLanguage === "zh" ? "en" : "zh");
    }, true);
    applyStaticTranslations();
    window.dispatchEvent(new CustomEvent("site-language-ready", { detail: { language: currentLanguage } }));
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
