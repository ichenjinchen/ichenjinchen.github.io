(() => {
  const storageKey = "theme";
  const validThemes = new Set(["system", "light", "dark"]);
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const getThemeSetting = () => {
    const saved = window.localStorage.getItem(storageKey);
    return validThemes.has(saved) ? saved : "system";
  };

  const getResolvedTheme = (setting) => {
    if (setting !== "system") return setting;
    return media.matches ? "dark" : "light";
  };

  const themeLabel = (setting) => {
    const key = setting === "system" ? "themeSystem" : setting === "dark" ? "themeDark" : "themeLight";
    return window.SiteI18n?.text(key) || (setting === "system" ? "跟随系统" : setting === "dark" ? "深色模式" : "浅色模式");
  };

  const updateThemeUi = (setting) => {
    const icon = document.querySelector("#theme-icon");
    const menu = document.querySelector("[data-theme-menu]");
    const resolved = getResolvedTheme(setting);
    if (icon) {
      icon.classList.remove("fa-sun", "fa-moon", "fa-desktop");
      icon.classList.add(setting === "system" ? "fa-desktop" : resolved === "dark" ? "fa-moon" : "fa-sun");
      icon.title = themeLabel(setting);
    }
    if (menu) {
      menu.dataset.themeSetting = setting;
      menu.querySelectorAll("[data-theme-choice]").forEach((choice) => {
        const active = choice.dataset.themeChoice === setting;
        choice.setAttribute("aria-checked", String(active));
        choice.classList.toggle("is-active", active);
      });
    }
  };

  const applyTheme = (setting, persist = true) => {
    const next = validThemes.has(setting) ? setting : "system";
    if (persist) {
      if (next === "system") {
        window.localStorage.removeItem(storageKey);
      } else {
        window.localStorage.setItem(storageKey, next);
      }
    }
    const resolved = getResolvedTheme(next);
    if (resolved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateThemeUi(next);
  };

  const initThemeMenu = () => {
    const menu = document.querySelector("[data-theme-menu]");
    if (!menu) return;
    const initialSetting = getThemeSetting();
    applyTheme(initialSetting, false);
    // Keep the icon in sync with the legacy bundled theme initializer.
    window.setTimeout(() => updateThemeUi(initialSetting), 50);
    menu.querySelectorAll("[data-theme-choice]").forEach((choice) => {
      const selectChoice = () => {
        applyTheme(choice.dataset.themeChoice);
        menu.removeAttribute("open");
      };
      choice.addEventListener("click", selectChoice);
      choice.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectChoice();
        }
      });
    });
    window.addEventListener("site-language-change", () => updateThemeUi(getThemeSetting()));
    media.addEventListener("change", () => {
      if (getThemeSetting() === "system") {
        applyTheme("system", false);
        // The legacy bundled theme script also listens to this event. Update
        // once more after it runs so the system icon remains accurate.
        window.setTimeout(() => updateThemeUi("system"), 50);
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeMenu, { once: true });
  } else {
    initThemeMenu();
  }
})();
