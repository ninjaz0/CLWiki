const appState = {
  manifest: null,
  activeArticleId: null,
  headings: [],
  observer: null,
  expandedGroups: new Set(),
  expandedSubgroups: new Set()
};

const CATEGORY_ORDER = [
  "入门与生态",
  "文档与演示",
  "内容创作与设计",
  "开发与自动化",
  "安全与分析",
  "AI 与智能体",
  "商业与生产力",
  "垂直领域与其他"
];

const SUBCATEGORY_ORDER = {
  "入门与生态": ["Codex 入门", "工具扩展", "Skill 使用"],
  "文档与演示": ["文档处理", "PPT 与演示"],
  "内容创作与设计": ["内容发布", "视觉设计", "视频音频", "文化创作"],
  "开发与自动化": ["应用开发与部署", "数据与后端", "测试与工程效率", "自动化流程", "Skill 创建与管理"],
  "安全与分析": ["安全审计与认证", "文档审查与研究分析"],
  "AI 与智能体": ["模型与机器学习", "上下文与提示工程", "多智能体协作"],
  "商业与生产力": ["品牌、营销与 CMS", "协作与知识管理", "支付与商业系统", "电商、产品与财务"],
  "垂直领域与其他": ["专业领域", "其他技能"]
};

const elements = {
  article: document.querySelector("#article"),
  articleNav: document.querySelector("#articles"),
  articleSearch: document.querySelector("#articleSearch"),
  toc: document.querySelector("#toc"),
  menuButton: document.querySelector("#menuButton"),
  sidebar: document.querySelector("#sidebar"),
  mobileScrim: document.querySelector("#mobileScrim"),
  githubLink: document.querySelector("#githubLink")
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const manifest = await fetchJson("articles.json");
    appState.manifest = manifest;
    document.title = `${manifest.site.title} - ${manifest.site.description}`;
    updateGitHubLink();
    renderArticleNav();
    bindEvents();

    const articleId = getArticleIdFromHash() || manifest.articles[0]?.id;
    if (articleId) {
      await loadArticle(articleId);
    }
  } catch (error) {
    showError("站点加载失败。请确认 articles.json 和 Markdown 文件存在。", error);
  }
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: ${response.status}`);
  }
  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url}: ${response.status}`);
  }
  return response.text();
}

function bindEvents() {
  window.addEventListener("hashchange", async () => {
    const articleId = getArticleIdFromHash();
    if (articleId && articleId !== appState.activeArticleId) {
      await loadArticle(articleId);
    }
  });

  elements.articleSearch.addEventListener("input", renderArticleNav);
  window.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.articleSearch) {
      event.preventDefault();
      elements.articleSearch.focus();
    }
    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

  elements.menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    elements.menuButton.setAttribute("aria-expanded", String(isOpen));
    elements.mobileScrim.hidden = !isOpen;
  });

  elements.mobileScrim.addEventListener("click", closeMobileNav);
}

function updateGitHubLink() {
  const host = window.location.hostname;
  const path = window.location.pathname.split("/").filter(Boolean)[0];

  if (host.endsWith(".github.io") && path) {
    const owner = host.replace(".github.io", "");
    elements.githubLink.href = `https://github.com/${owner}/${path}`;
  }
}

function getArticleIdFromHash() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return params.get("article");
}

function setArticleHash(articleId) {
  const nextHash = `article=${encodeURIComponent(articleId)}`;
  if (window.location.hash.replace(/^#/, "") !== nextHash) {
    history.replaceState(null, "", `#${nextHash}`);
  }
}

function renderArticleNav() {
  const query = elements.articleSearch.value.trim().toLowerCase();
  const articles = appState.manifest.articles.filter((article) => {
    const category = parseArticleCategory(article.category);
    const haystack =
      `${article.title} ${article.shortTitle} ${article.category} ${category.group} ${category.subgroup}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!articles.length) {
    elements.articleNav.innerHTML = `<div class="empty-state">没有匹配的文章。</div>`;
    return;
  }

  const tree = buildArticleNavTree(articles);
  const forceOpen = Boolean(query);
  elements.articleNav.innerHTML = tree.map((groupNode) => renderArticleGroup(groupNode, forceOpen)).join("");

  elements.articleNav.querySelectorAll("[data-nav-toggle='group']").forEach((button) => {
    button.addEventListener("click", () => {
      toggleExpanded(appState.expandedGroups, button.dataset.groupKey);
      renderArticleNav();
    });
  });

  elements.articleNav.querySelectorAll("[data-nav-toggle='subgroup']").forEach((button) => {
    button.addEventListener("click", () => {
      toggleExpanded(appState.expandedSubgroups, button.dataset.subgroupKey);
      renderArticleNav();
    });
  });

  elements.articleNav.querySelectorAll("[data-article-id]").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });
}

function buildArticleNavTree(articles) {
  const groupMap = new Map();

  articles.forEach((article, index) => {
    const category = parseArticleCategory(article.category);
    const groupKey = category.group;
    const subgroupKey = getSubgroupKey(category);

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        key: groupKey,
        title: category.group,
        count: 0,
        subgroups: new Map()
      });
    }

    const groupNode = groupMap.get(groupKey);
    groupNode.count += 1;

    if (!groupNode.subgroups.has(subgroupKey)) {
      groupNode.subgroups.set(subgroupKey, {
        key: subgroupKey,
        title: category.subgroup,
        group: category.group,
        count: 0,
        articles: []
      });
    }

    const subgroupNode = groupNode.subgroups.get(subgroupKey);
    subgroupNode.count += 1;
    subgroupNode.articles.push({ ...article, navIndex: index });
  });

  return Array.from(groupMap.values())
    .sort(compareGroupNodes)
    .map((groupNode) => ({
      ...groupNode,
      subgroups: Array.from(groupNode.subgroups.values()).sort(compareSubgroupNodes)
    }));
}

function renderArticleGroup(groupNode, forceOpen) {
  const isOpen = forceOpen || appState.expandedGroups.has(groupNode.key);
  const subgroups = isOpen
    ? `<div class="article-subgroups">${groupNode.subgroups.map((subgroupNode) => renderArticleSubgroup(subgroupNode, forceOpen)).join("")}</div>`
    : "";

  return `
    <section class="article-group" data-open="${isOpen}">
      <button class="article-group-toggle" type="button" aria-expanded="${isOpen}" data-nav-toggle="group" data-group-key="${escapeAttr(groupNode.key)}">
        <span class="nav-caret" aria-hidden="true"></span>
        <span class="nav-label">${escapeHtml(groupNode.title)}</span>
        <span class="nav-count">${groupNode.count}</span>
      </button>
      ${subgroups}
    </section>
  `;
}

function renderArticleSubgroup(subgroupNode, forceOpen) {
  const isOpen = forceOpen || appState.expandedSubgroups.has(subgroupNode.key);
  const links = isOpen
    ? `<div class="article-links">${subgroupNode.articles.map(renderArticleLink).join("")}</div>`
    : "";

  return `
    <section class="article-subgroup" data-open="${isOpen}">
      <button class="article-subgroup-toggle" type="button" aria-expanded="${isOpen}" data-nav-toggle="subgroup" data-subgroup-key="${escapeAttr(subgroupNode.key)}">
        <span class="nav-caret" aria-hidden="true"></span>
        <span class="nav-label">${escapeHtml(subgroupNode.title)}</span>
        <span class="nav-count">${subgroupNode.count}</span>
      </button>
      ${links}
    </section>
  `;
}

function renderArticleLink(article) {
  const activeClass = article.id === appState.activeArticleId ? " is-active" : "";
  return `
    <a class="article-link${activeClass}" href="#article=${escapeAttr(article.id)}" data-article-id="${escapeAttr(article.id)}">
      ${escapeHtml(article.shortTitle || article.title)}
    </a>
  `;
}

function compareGroupNodes(groupA, groupB) {
  return getGroupRank(groupA.title) - getGroupRank(groupB.title) || groupA.title.localeCompare(groupB.title, "zh-Hans-CN");
}

function compareSubgroupNodes(subgroupA, subgroupB) {
  const rankA = getSubgroupRank(subgroupA.group, subgroupA.title);
  const rankB = getSubgroupRank(subgroupB.group, subgroupB.title);
  return rankA - rankB || subgroupA.title.localeCompare(subgroupB.title, "zh-Hans-CN");
}

function getGroupRank(group) {
  const index = CATEGORY_ORDER.indexOf(group);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

function getSubgroupRank(group, subgroup) {
  const order = SUBCATEGORY_ORDER[group] || [];
  const index = order.indexOf(subgroup);
  return index === -1 ? order.length : index;
}

function parseArticleCategory(category) {
  const [group, ...rest] = String(category || "未分类 / 其他技能").split(" / ");
  return {
    group: group.trim() || "未分类",
    subgroup: rest.join(" / ").trim() || "其他技能"
  };
}

function getSubgroupKey(category) {
  return `${category.group} / ${category.subgroup}`;
}

function toggleExpanded(collection, key) {
  if (collection.has(key)) {
    collection.delete(key);
  } else {
    collection.add(key);
  }
}

function expandArticlePath(article) {
  const category = parseArticleCategory(article.category);
  appState.expandedGroups.add(category.group);
  appState.expandedSubgroups.add(getSubgroupKey(category));
}

async function loadArticle(articleId) {
  const articleMeta = appState.manifest.articles.find((article) => article.id === articleId);
  if (!articleMeta) {
    showError("找不到这篇文章。");
    return;
  }

  elements.article.innerHTML = `<div class="loading-state">正在加载文章...</div>`;
  appState.activeArticleId = articleId;
  expandArticlePath(articleMeta);
  renderArticleNav();
  setArticleHash(articleId);

  try {
    const markdown = await fetchText(articleMeta.source);
    const parsed = renderMarkdown(markdown);

    elements.article.innerHTML = `
      <header class="article-header">
        <h1>${escapeHtml(articleMeta.title)}</h1>
      </header>
      <div class="article-content">${parsed.html}</div>
    `;

    appState.headings = parsed.headings.filter((heading) => heading.level >= 2 && heading.level <= 4);
    renderToc();
    observeHeadings();
  } catch (error) {
    showError(`文章加载失败：${articleMeta.source}`, error);
  }
}

function renderToc() {
  if (!appState.headings.length) {
    elements.toc.innerHTML = `<div class="empty-state">暂无目录。</div>`;
    return;
  }

  elements.toc.innerHTML = appState.headings
    .map(
      (heading) => `
        <a href="#${escapeAttr(heading.id)}" data-heading-id="${escapeAttr(heading.id)}" data-level="${heading.level}">
          ${escapeHtml(heading.text)}
        </a>
      `
    )
    .join("");
}

function observeHeadings() {
  if (appState.observer) {
    appState.observer.disconnect();
  }

  const headingNodes = appState.headings
    .map((heading) => document.getElementById(heading.id))
    .filter(Boolean);

  appState.observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (visible) {
        setActiveTocItem(visible.target.id);
      }
    },
    {
      rootMargin: "-90px 0px -70% 0px",
      threshold: [0, 1]
    }
  );

  headingNodes.forEach((heading) => appState.observer.observe(heading));
  if (headingNodes[0]) {
    setActiveTocItem(headingNodes[0].id);
  }
}

function setActiveTocItem(id) {
  elements.toc.querySelectorAll("a").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.headingId === id);
  });
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const headings = [];
  const slugCounts = new Map();
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const lang = line.trim().replace(/^```/, "").trim();
      const codeLines = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      html.push(
        `<pre><code class="language-${escapeAttr(lang)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`
      );
      continue;
    }

    if (/^\s*---+\s*$/.test(line)) {
      html.push("<hr />");
      index += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = stripInlineMarkdown(headingMatch[2].trim());
      const id = uniqueSlug(text, slugCounts);
      headings.push({ id, text, level });
      html.push(`<h${level} id="${escapeAttr(id)}">${renderInline(headingMatch[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines = [lines[index], lines[index + 1]];
      index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        tableLines.push(lines[index]);
        index += 1;
      }
      html.push(renderTable(tableLines));
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      html.push(`<blockquote><p>${renderInline(quoteLines.join(" "))}</p></blockquote>`);
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*-\s+/, ""));
        index += 1;
      }
      html.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+\.\s+/, ""));
        index += 1;
      }
      html.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && lines[index].trim() && !startsBlock(lines, index)) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    html.push(`<p>${renderInline(paragraphLines.join(" "))}</p>`);
  }

  return { html: html.join("\n"), headings };
}

function startsBlock(lines, index) {
  const line = lines[index];
  return (
    /^```/.test(line.trim()) ||
    /^\s*---+\s*$/.test(line) ||
    /^(#{1,6})\s+/.test(line) ||
    isTableStart(lines, index) ||
    /^\s*>\s?/.test(line) ||
    /^\s*-\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line)
  );
}

function isTableStart(lines, index) {
  if (index + 1 >= lines.length || !lines[index].includes("|")) {
    return false;
  }
  return /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1]);
}

function renderTable(tableLines) {
  const rows = tableLines.map(parseTableRow);
  const headers = rows[0] || [];
  const bodyRows = rows.slice(2);
  const headHtml = headers.map((cell) => `<th>${renderInline(cell)}</th>`).join("");
  const bodyHtml = bodyRows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
    .join("");

  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${headHtml}</tr></thead>
        <tbody>${bodyHtml}</tbody>
      </table>
    </div>
  `;
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderInline(raw) {
  const tokens = [];
  const stash = (value) => {
    tokens.push(value);
    return `@@CLWIKI_TOKEN_${tokens.length - 1}@@`;
  };

  let text = escapeHtml(raw);

  text = text.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeHtml(code)}</code>`));
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    return stash(`<img src="${escapeAttr(src)}" alt="${escapeAttr(alt || "文章图片")}" loading="lazy" />`);
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    return stash(`<a href="${escapeAttr(href)}" target="_blank" rel="noreferrer">${renderInline(label)}</a>`);
  });

  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/(^|[\s(>])((?:https?:\/\/|mailto:)[^\s<)]+)/g, (_, prefix, url) => {
    const cleanUrl = url.replace(/[，。；、]+$/, "");
    const suffix = url.slice(cleanUrl.length);
    return `${prefix}${stash(
      `<a href="${escapeAttr(cleanUrl)}" target="_blank" rel="noreferrer">${escapeHtml(cleanUrl)}</a>`
    )}${escapeHtml(suffix)}`;
  });

  tokens.forEach((value, tokenIndex) => {
    text = text.replaceAll(`@@CLWIKI_TOKEN_${tokenIndex}@@`, value);
  });

  return text;
}

function uniqueSlug(text, slugCounts) {
  const base =
    text
      .trim()
      .toLowerCase()
      .replace(/[`*_~[\]()]/g, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section";
  const count = slugCounts.get(base) || 0;
  slugCounts.set(base, count + 1);
  return count ? `${base}-${count + 1}` : base;
}

function stripInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  elements.menuButton.setAttribute("aria-expanded", "false");
  elements.mobileScrim.hidden = true;
}

function showError(message, error) {
  if (error) {
    console.error(error);
  }
  elements.article.innerHTML = `<div class="error-state">${escapeHtml(message)}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
