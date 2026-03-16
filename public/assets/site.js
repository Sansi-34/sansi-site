(function () {
  const THEME_STORAGE_KEY = "sansi-theme-mode";
  const THEME_LABELS = { system: "跟随系统", light: "明亮", dark: "黑暗" };
  const THEME_ORDER = ["system", "light", "dark"];
  const themeMedia = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function getSearchIndex() {
    return Array.isArray(window.__SANSI_SEARCH__) ? window.__SANSI_SEARCH__ : [];
  }

  function getIconMarkup(name) {
    const icons = {
      system: '<svg class="ui-icon ui-icon-sm" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="11" height="8" rx="2"></rect><path d="M6 13h4"></path><path d="M8 11v2"></path></svg>',
      light: '<svg class="ui-icon ui-icon-sm" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="2.75"></circle><path d="M8 1.75v1.5"></path><path d="M8 12.75v1.5"></path><path d="M1.75 8h1.5"></path><path d="M12.75 8h1.5"></path><path d="M3.6 3.6l1.05 1.05"></path><path d="M11.35 11.35l1.05 1.05"></path><path d="M12.4 3.6l-1.05 1.05"></path><path d="M4.65 11.35L3.6 12.4"></path></svg>',
      dark: '<svg class="ui-icon ui-icon-sm" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.9 2.4a5.6 5.6 0 1 0 2.7 10.5A5.8 5.8 0 0 1 10.9 2.4Z"></path></svg>'
    };
    return icons[name] || icons.system;
  }

  function getStoredThemeMode() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return THEME_ORDER.includes(stored) ? stored : "system";
    } catch {
      return "system";
    }
  }

  function resolveTheme(mode) {
    if (mode === "system") return themeMedia && themeMedia.matches ? "dark" : "light";
    return mode === "dark" ? "dark" : "light";
  }

  function updateThemeButton(mode) {
    const label = THEME_LABELS[mode] || THEME_LABELS.system;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.dataset.themeMode = mode;
      button.setAttribute("aria-label", `切换主题，当前${label}`);
      button.setAttribute("title", `切换主题，当前${label}`);
      const iconNode = button.querySelector("[data-theme-icon]");
      if (iconNode) iconNode.innerHTML = getIconMarkup(mode);
    });
  }

  function applyTheme(mode) {
    const rootNode = document.documentElement;
    rootNode.setAttribute("data-theme-mode", mode);
    rootNode.setAttribute("data-theme", resolveTheme(mode));
    updateThemeButton(mode);
  }

  function cycleThemeMode() {
    const currentMode = document.documentElement.getAttribute("data-theme-mode") || getStoredThemeMode();
    const currentIndex = THEME_ORDER.indexOf(currentMode);
    const nextMode = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch {}
    applyTheme(nextMode);
  }

  function bindThemeToggle() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      if (button.dataset.boundThemeToggle === "true") return;
      button.dataset.boundThemeToggle = "true";
      button.addEventListener("click", cycleThemeMode);
    });
  }

  function bindSystemThemeListener() {
    if (!themeMedia || window.__SANSI_THEME_MEDIA_BOUND__) return;
    const handleChange = () => {
      const currentMode = document.documentElement.getAttribute("data-theme-mode") || getStoredThemeMode();
      if (currentMode === "system") applyTheme("system");
    };
    if (typeof themeMedia.addEventListener === "function") themeMedia.addEventListener("change", handleChange);
    else if (typeof themeMedia.addListener === "function") themeMedia.addListener(handleChange);
    window.__SANSI_THEME_MEDIA_BOUND__ = true;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function createSearchText(entry) {
    return [entry.title, entry.meta, ...(entry.keywords || [])].join(" ").toLowerCase();
  }

  function normalizeUrlForCompare(url) {
    try {
      const resolved = new URL(url, window.location.origin);
      return `${resolved.pathname}${resolved.search}`;
    } catch {
      return url;
    }
  }

  function bindHeaderSearch() {
    const searchRoots = Array.from(document.querySelectorAll("[data-search-root]"));
    if (searchRoots.length === 0) return;

    const currentUrl = `${window.location.pathname}${window.location.search}`;
    const searchIndex = getSearchIndex();

    searchRoots.forEach((root) => {
      if (root.dataset.boundSearch === "true") return;
      root.dataset.boundSearch = "true";

      const form = root.querySelector("[data-search-form]");
      const input = root.querySelector("[data-search-input]");
      const results = root.querySelector("[data-search-results]");
      if (!form || !input || !results) return;

      let activeIndex = -1;
      let currentResults = [];

      const closeResults = () => {
        results.hidden = true;
        results.innerHTML = "";
        activeIndex = -1;
        currentResults = [];
      };

      const openFirstResult = () => {
        if (currentResults.length > 0) window.location.href = currentResults[0].url;
      };

      const renderResults = (matches) => {
        currentResults = matches;
        activeIndex = -1;

        if (matches.length === 0) {
          if (!input.value.trim()) {
            closeResults();
            return;
          }
          results.innerHTML = '<div class="header-search-empty">没有找到匹配内容。</div>';
          results.hidden = false;
          return;
        }

        results.innerHTML = matches
          .map((item, index) => {
            const currentMarker = normalizeUrlForCompare(item.url) === currentUrl ? " / 当前页" : "";
            return `<a class="header-search-result${index === activeIndex ? " is-active" : ""}" href="${item.url}" data-search-result><span class="header-search-result-title">${escapeHtml(item.title)}</span><span class="header-search-result-meta">${escapeHtml(item.meta + currentMarker)}</span></a>`;
          })
          .join("");
        results.hidden = false;
      };

      const applyActiveResult = () => {
        const nodes = Array.from(results.querySelectorAll("[data-search-result]"));
        nodes.forEach((node, index) => node.classList.toggle("is-active", index === activeIndex));
      };

      const runSearch = () => {
        const keyword = input.value.trim().toLowerCase();
        if (!keyword) {
          closeResults();
          return;
        }
        const matches = searchIndex.filter((entry) => createSearchText(entry).includes(keyword)).slice(0, 6);
        renderResults(matches);
      };

      input.addEventListener("input", runSearch);
      input.addEventListener("focus", runSearch);
      input.addEventListener("keydown", (event) => {
        if (results.hidden || currentResults.length === 0) {
          if (event.key === "Enter") {
            event.preventDefault();
            openFirstResult();
          }
          return;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          activeIndex = (activeIndex + 1) % currentResults.length;
          applyActiveResult();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          activeIndex = activeIndex <= 0 ? currentResults.length - 1 : activeIndex - 1;
          applyActiveResult();
        } else if (event.key === "Enter") {
          event.preventDefault();
          if (activeIndex >= 0 && currentResults[activeIndex]) window.location.href = currentResults[activeIndex].url;
          else openFirstResult();
        } else if (event.key === "Escape") {
          closeResults();
          input.blur();
        }
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        openFirstResult();
      });

      document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) closeResults();
      });
    });
  }

  function bindTocHighlight() {
    if (document.documentElement.dataset.boundTocFor === window.location.pathname) return;
    const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
    if (tocLinks.length === 0 || !("IntersectionObserver" in window)) return;
    const sections = tocLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        tocLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-24% 0px -60% 0px", threshold: 0.1 });
    sections.forEach((section) => observer.observe(section));
    document.documentElement.dataset.boundTocFor = window.location.pathname;
  }

  function bindCopyButtons() {
    document.querySelectorAll("[data-copy-btn]").forEach((btn) => {
      if (btn.dataset.boundCopy === "true") return;
      btn.dataset.boundCopy = "true";
      btn.addEventListener("click", async () => {
        const target = btn.closest(".code-window")?.querySelector("code");
        const labelNode = btn.querySelector("[data-copy-label]");
        if (!target || !labelNode) return;
        const originalLabel = labelNode.textContent;
        try {
          await navigator.clipboard.writeText(target.textContent || "");
          labelNode.textContent = "已复制";
        } catch {
          labelNode.textContent = "复制失败";
        }
        window.setTimeout(() => {
          labelNode.textContent = originalLabel;
        }, 1400);
      });
    });

    document.querySelectorAll("[data-copy-link-btn]").forEach((btn) => {
      if (btn.dataset.boundCopyLink === "true") return;
      btn.dataset.boundCopyLink = "true";
      btn.addEventListener("click", async () => {
        const labelNode = btn.querySelector("[data-copy-link-label]");
        const copyUrl = btn.dataset.copyUrl || window.location.href;
        if (!labelNode) return;
        const originalLabel = labelNode.textContent;
        try {
          await navigator.clipboard.writeText(copyUrl);
          labelNode.textContent = "链接已复制";
        } catch {
          labelNode.textContent = "复制失败";
        }
        window.setTimeout(() => {
          labelNode.textContent = originalLabel;
        }, 1400);
      });
    });
  }

  function initPage() {
    applyTheme(getStoredThemeMode());
    bindThemeToggle();
    bindHeaderSearch();
    bindTocHighlight();
    bindCopyButtons();
  }

  bindSystemThemeListener();
  initPage();
  document.addEventListener("astro:page-load", initPage);
  document.addEventListener("astro:after-swap", () => applyTheme(getStoredThemeMode()));
})();

