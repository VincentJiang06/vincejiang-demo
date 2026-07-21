/* ============================================================
   REACTOR · static site generator (zero framework, no React)
   node build.mjs  →  writes dist/
   ============================================================ */
import { readFile, writeFile, mkdir, rm, cp, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { layoutTree } from "./lib/tree-layout.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
/* 部署位置由环境变量决定，默认是站根（本地预览用）：
     BASE=/reactor-study  → 站点挂在子路径下，所有内部链接加前缀
     SITE=https://…       → canonical / sitemap 用的绝对前缀 */
const BASE = (process.env.BASE || "").replace(/\/$/, "");
const SITE = process.env.SITE || "https://reactor.vincejiang.com";  // 2026-07 已迁子域,默认即新域(防裸跑 build 回退)

const AUTHOR = { "@type": "Person", name: "Vince Jiang", url: "https://vincejiang.com" };
const OG_IMAGE = SITE + "/og.png";

/* 课文的真实最后修改日(git 提交日期)——sitemap 的 lastmod 用它,比构建日期诚实。
   拿不到 git(纯 tarball 构建)时优雅退化为今天。 */
const LESSON_DATES = await (async () => {
  try {
    const { execSync } = await import("node:child_process");
    const out = execSync("git log --format=%cs --name-only -- content/lessons", { cwd: ROOT, encoding: "utf8" });
    const map = {}; let date = null;
    for (const line of out.split("\n")) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(line)) date = line;
      else if (line.includes("content/lessons/") && date) {
        // git --name-only 输出的是「仓库根」相对路径,不是 cwd 相对路径,取 basename 才对
        const id = line.slice(line.lastIndexOf("/") + 1).replace(/\.mjs$/, "");
        if (!map[id]) map[id] = date;      // git log 倒序,首次出现即最新
      }
    }
    return map;
  } catch { return {}; }
})();
const TODAY = new Date().toISOString().slice(0, 10);

const I18N = JSON.parse(await readFile(path.join(ROOT, "content/i18n.json"), "utf8"));
/* 语言上下文：zh 是母版(站根)，en 是译版(/en 前缀)。
   t() 在英文词条尚未翻译时回落中文——管线可以先跑通，翻译灌进来自动生效。 */
const LANGS = [
  { code: "zh", htmlLang: "zh-CN", ogLocale: "zh_CN", prefix: "", dir: "" },
  { code: "en", htmlLang: "en",    ogLocale: "en_US", prefix: "/en", dir: "en" }
];
function makeL(langDef) {
  const { code, prefix } = langDef;
  const pick = entry => (entry && (entry[code] || entry.zh)) || "";
  return {
    ...langDef,
    isEn: code === "en",
    href: p => prefix + p,                                   // 站内链接加语种前缀
    alt: p => (code === "en" ? p : "/en" + p),                // 对侧语种同页
    t(key, vars = {}) {
      let out = pick(I18N.ui[key]) || key;
      for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, v);
      return out;
    },
    branch: b => pick(I18N.branch[b]) || b,
    branchDesc: b => pick(I18N.branch[b]?.desc) || "",
    level: label => (code === "en" ? (I18N.level[label]?.en || label) : label),
    nodeTitle: n => (code === "en" ? (n.en || n.zh) : n.zh),
    nodeHook: n => (code === "en" ? (I18N.node[n.id]?.hook?.en || n.hook) : n.hook)
  };
}

const tree = JSON.parse(await readFile(path.join(ROOT, "content/tree.json"), "utf8"));
const byId = Object.fromEntries(tree.nodes.map(n => [n.id, n]));

/* ---- 布局：正式排版算法 v4（lib/tree-layout.mjs，规格见 course/TREE-LAYOUT-ALGORITHM.md）
   tree.json 的 tier 字段已废弃——层级由 prereq 图自动推导。 ---- */
const _layout = layoutTree(tree.nodes);
for (const n of tree.nodes) { n.x = _layout.pos[n.id].x; n.y = _layout.pos[n.id].y; }
const bounds = _layout.bounds;
const LEVELS = _layout.levels;

/* ---- load authored lessons ---- */
const lessonsDir = path.join(ROOT, "content/lessons");
const lessonFiles = existsSync(lessonsDir)
  ? (await readdir(lessonsDir)).filter(f => f.endsWith(".mjs")) : [];
const lessons = {};
for (const f of lessonFiles) {
  const mod = await import(pathToFileURL(path.join(lessonsDir, f)).href);
  lessons[mod.default.id] = mod.default;
}
const builtIds = new Set(Object.keys(lessons));

/* ---- auto-discover interactive modules ----
   "type:name" resolves to modules/name.js (bespoke) OR modules/type.js (generic). */
const moduleDir = path.join(ROOT, "modules");
const moduleFiles = new Set((await readdir(moduleDir)).filter(f => f.endsWith(".js")).map(f => f.slice(0, -3)));
const moduleFileFor = mod => {
  const [type, name] = mod.split(":");
  if (moduleFiles.has(name)) return name;      // bespoke override
  if (moduleFiles.has(type)) return type;      // generic engine
  return null;
};

/* ---- helpers ---- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const BRANCH_LABEL = { root: "ROOT", red: "社会学谱系", blue: "定律与形式", yellow: "机器与前沿", green: "防御与设计", case: "案例带", converge: "汇流" };

/* 外部开源字体（jsDelivr / fontsource，均为 SIL OFL）：
   Space Grotesk=拉丁（几何科技感），Noto Sans SC=中文，JetBrains Mono=等宽。
   全站基准字重 500（v2 起），故三族各载 400/500/700（JBM 无 500 载 400/700）。
   Noto 的 CSS 按 unicode-range 切片，浏览器只下用得到的那几片。 */
const FONT_CDN = "https://cdn.jsdelivr.net/npm/@fontsource";
const FONT_LINKS = [
  `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>`,
  `<link rel="stylesheet" href="${FONT_CDN}/space-grotesk@5/400.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/space-grotesk@5/500.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/space-grotesk@5/700.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/noto-sans-sc@5/400.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/noto-sans-sc@5/500.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/noto-sans-sc@5/700.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/jetbrains-mono@5/400.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/jetbrains-mono@5/700.css">`
].join("\n");

function head({ title, desc, url, jsonld, L, altPath }) {
  const lang = L || makeL(LANGS[0]);
  // hreflang 三件套:两语互指 + x-default 指中文(母版)
  const alts = altPath ? `
<link rel="alternate" hreflang="zh-Hans" href="${SITE}${altPath}">
<link rel="alternate" hreflang="en" href="${SITE}/en${altPath}">
<link rel="alternate" hreflang="x-default" href="${SITE}${altPath}">` : "";
  return `<!doctype html><html lang="${lang.htmlLang}" data-theme="dark" data-lp="${lang.prefix}"${BASE ? ` data-base="${BASE}"` : ""}><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${OG_IMAGE}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:site_name" content="REACTOR"><meta property="og:locale" content="${lang.ogLocale}">
<meta property="og:locale:alternate" content="${lang.isEn ? "zh_CN" : "en_US"}">${alts}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${OG_IMAGE}">
<meta name="author" content="Vince Jiang">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="icon" href="/favicon.svg"><link rel="mask-icon" href="/favicon.svg" color="#E11D3A">
<script>try{var m=localStorage.getItem("reactor.theme")||"auto",t=(m==="light"||m==="dark")?m:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
${FONT_LINKS}
<link rel="stylesheet" href="/theme/tokens.css"><link rel="stylesheet" href="/theme/base.css">
<link rel="stylesheet" href="/theme/components.css"><link rel="stylesheet" href="/theme/led.css">
<link rel="stylesheet" href="/theme/bg.css"><link rel="stylesheet" href="/theme/extra.css">
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ""}
</head><body>${bgField()}`;
}

function bgField() {
  // v2：撤掉扫光条/反应堆环/扫描线全部动画层（fixed 混合层曾给卡片盖『暗色矩形遮挡』），
  // 只留静态点阵 + 渐变，样式全在 bg.css。
  return `<div class="bg-dots" aria-hidden="true"></div>
<div class="bg-field" aria-hidden="true"></div>`;
}

function siteHead({ home = false, L, altPath = "/" } = {}) {
  const lang = L || makeL(LANGS[0]);
  // 语言切换:与主题按钮同形制,显示「对侧语种」,跳到对侧同一页(不做自动重定向)
  const altHref = lang.isEn ? altPath : "/en" + altPath;
  const langBtn = `<a class="btn lang-toggle persist" href="${altHref}" data-lang-switch
    hreflang="${lang.isEn ? "zh-Hans" : "en"}" aria-label="${lang.isEn ? "切换到中文" : "Switch to English"}"
    ><span class="tt-glyph" aria-hidden="true">⇄</span><span class="tt-label">${lang.isEn ? "中" : "EN"}</span></a>`;
  // 首页本身就是天赋树，不再放「天赋树」项；其余页面它指向语种首页
  return `<header class="site-head">
  <a class="brand persist" href="${lang.href("/")}"><span class="glyph-strip" aria-hidden="true">${
    ["w", "w", "red", "yellow", "blue", "green"].map(c => `<span class="led on l-${c}"></span>`).join("")
  }</span> REACTOR</a>
  <nav>
    ${home ? "" : `<a href="${lang.href("/")}">${esc(lang.t("nav.tree"))}</a>\n    `}<a href="${lang.href("/lesson/N00.html")}">${esc(lang.t("nav.start"))}</a>
    <a href="${lang.href("/atlas.html")}">${esc(lang.t("nav.atlas"))}</a>
    ${langBtn}
    <button class="btn theme-toggle" data-theme-toggle><span class="tt-glyph" aria-hidden="true">◑</span><span class="tt-label">${esc(lang.t("nav.themeAuto"))}</span></button>
  </nav>
</header>`;
}
function siteFoot(L) {
  const lang = L || makeL(LANGS[0]);
  return `<footer class="site-foot"><div class="wrap">
  <span>${esc(lang.t("foot.tagline"))}</span>
  <span class="foot-by"><a href="https://vincejiang.com">${esc(lang.t("foot.by"))}</a><span class="sep">·</span>self-hosted · no-react</span>
</div></footer><script type="module" src="/modules/boot.js"></script></body></html>`;
}

const modScripts = new Set();   // dedupe <script> per page
function moduleSlot(mod, opts = {}) {
  const lang = opts.L || makeL(LANGS[0]);
  const file = moduleFileFor(mod);
  const [type, name] = mod.split(":");
  const fig = opts.fig || "FIG.01";
  const cfg = opts.config ? `<script type="application/json" class="mod-config">${JSON.stringify(opts.config).replace(/</g, "\\u003c")}</script>` : "";
  const inner = file
    ? `${cfg}<noscript><div class="noscript-fallback">${esc(lang.t("lesson.noscript"))}</div></noscript>`
    : `<div class="noscript-fallback"><code>${esc(mod)}</code> ${esc(lang.t("lesson.wip"))}</div>`;
  const script = file ? `<script type="module" src="/modules/${file}.js"></script>` : "";
  return `<figure class="module reg" data-module="${esc(file || name)}" data-modname="${esc(name)}" data-modtype="${esc(type)}">
    <figcaption class="module-head"><span class="fig">${esc(fig)}</span>
      <span>${esc(opts.title || name)}</span><span class="spacer"></span>
      <span class="mono">${esc(type.toUpperCase())}</span></figcaption>
    <div class="module-body">${inner}</div>
  </figure>${script}`;
}

/* ---- render one lesson ---- */
/* 正文里的节点引用 <code>R05</code> 转成跳转链接(仅真实存在的节点;跟随语种前缀)。
   sources 里的 <code>research/deep/D2</code> 不匹配 [A-Z]\d\d 整串,不会误伤。 */
function linkNodeRefs(html, lang) {
  return String(html).replace(/<code>([A-Z]\d\d)<\/code>/g, (m, id) =>
    (byId[id] && builtIds.has(id))
      ? `<a class="node-ref" href="${lang.href(`/lesson/${id}.html`)}"><code>${id}</code></a>`
      : m);
}

function renderBlocks(blocks, L) {
  const lang = L || makeL(LANGS[0]);
  let figN = 0;
  return blocks.map(b => {
    switch (b.t) {
      case "prose": return `<div class="read">${linkNodeRefs(b.html, lang)}</div>`;
      case "h": return `<h2>${esc(b.text)}</h2>`;
      case "callout": {
        const tag = { myth: lang.t("callout.myth"), intuit: lang.t("callout.intuit"), applied: lang.t("callout.applied") }[b.variant] || "//";
        return `<aside class="callout ${b.variant}"><span class="co-tag">${esc(b.tag || tag)}</span>${linkNodeRefs(b.html, lang)}</aside>`;
      }
      case "module": { figN++; return moduleSlot(b.module, { fig: "FIG." + String(figN).padStart(2, "0"), title: b.title, config: b.config, L: lang }); }
      case "sources": return `<details class="sources"><summary class="label">${esc(lang.t("lesson.sources"))}</summary><div class="read"><ul>${b.items.map(i => `<li>${linkNodeRefs(i, lang)}</li>`).join("")}</ul></div></details>`;
      default: return "";
    }
  }).join("\n");
}

function prereqRow(node, L) {
  const lang = L || makeL(LANGS[0]);
  const pre = node.prereqs.map(id => byId[id]).filter(Boolean);
  const unlocks = tree.nodes.filter(n => n.prereqs.includes(node.id));
  const link = n => builtIds.has(n.id)
    ? `<a href="${lang.href(`/lesson/${n.id}.html`)}">${esc(n.id)} ${esc(lang.nodeTitle(n))}</a>`
    : `<span class="stub">${esc(n.id)} ${esc(lang.nodeTitle(n))}</span>`;
  return `<div class="prereq-row">
    <span class="label">${esc(lang.t("lesson.prereq"))}</span> ${pre.length ? pre.map(link).join(" ") : `<span class='stub'>${esc(lang.t("lesson.none"))}</span>`}
    <span class="label" style="margin-left:auto">${esc(lang.t("lesson.unlocks"))}</span> ${unlocks.length ? unlocks.map(link).join(" ") : "<span class='stub'>—</span>"}
  </div>`;
}

function lessonPage(node, lesson, L) {
  const lang = L || makeL(LANGS[0]);
  const selfPath = `/lesson/${node.id}.html`;
  const url = `${SITE}${lang.prefix}${selfPath}`;
  const jsonld = [{
    "@context": "https://schema.org", "@type": "LearningResource",
    name: lang.isEn ? node.en : `${node.zh} · ${node.en}`, description: lang.nodeHook(node),
    inLanguage: lang.htmlLang, url, author: AUTHOR, isAccessibleForFree: true,
    learningResourceType: "lesson", educationalLevel: "advanced",
    timeRequired: "PT10M", teaches: node.en,
    isPartOf: { "@type": "Course", name: "REACTOR", url: SITE + lang.prefix + "/" },
    ...(node.prereqs.length ? { coursePrerequisites: node.prereqs.map(p => byId[p] && lang.nodeTitle(byId[p])).filter(Boolean).join(", ") } : {})
  }, {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: lang.t("nav.tree"), item: SITE + lang.prefix + "/" },
      { "@type": "ListItem", position: 2, name: lang.branch(node.branch), item: SITE + lang.prefix + "/atlas.html" },
      { "@type": "ListItem", position: 3, name: `${node.id} ${lang.nodeTitle(node)}`, item: url }
    ]
  }];
  // v2 骨架：左侧天赋树导轨（迷你点阵，当前节点高亮）+ 右侧课文
  const rail = `<div class="lesson-shell"><aside class="tree-rail" aria-label="${esc(lang.t("nav.tree"))}">
  <div class="rail-head"><span class="rh-id">${esc(node.id)}</span><span>${esc(lang.nodeTitle(node))}</span><span class="rh-count" data-tree-count></span></div>
  <div class="tree-viewport mini" data-mode="mini" data-focus="${esc(node.id)}"></div>
  <div class="rail-foot"><a href="${lang.href("/")}">${esc(lang.t("rail.expand"))}</a><span class="label">TREE</span></div>
</aside>`;
  return head({ title: `${node.id} ${lang.nodeTitle(node)} · REACTOR`, desc: lang.nodeHook(node), url, jsonld, L: lang, altPath: selfPath })
    + siteHead({ L: lang, altPath: selfPath })
    + rail
    + `<main class="wrap" data-branch="${node.branch}">
    <div class="hero">
      <div class="nameplate"><span class="tag">${esc(node.id)}</span>
        <span>${esc(lang.isEn ? lang.branch(node.branch) : node.en)}</span><span class="rule"></span>
        <span class="rev">${esc(lang.branch(node.branch))} · REV.${tree.meta.version}</span></div>
      <p class="bootline typing" style="margin:16px 0">${esc(lang.t("boot.line", { v: tree.meta.version, id: node.id }))}<span class="cursor"></span></p>
      <h1>${esc(lang.nodeTitle(node))}</h1>
      <p class="lede">${esc(lang.nodeHook(node))}</p>
      ${prereqRow(node, lang)}
    </div>
    <article class="stack">${renderBlocks(lesson.blocks, lang)}</article>
    ${recommendRow(node, lang)}
    <nav class="prereq-row" style="margin-top:32px">
      <a class="btn" href="${lang.href("/")}">${esc(lang.t("lesson.back"))}</a>
    </nav>
  </main></div>` + siteFoot(lang);
}

/* 「接下来去哪」——两组候选,而非单一「下一课」:
   1) 继续往下探索 = 以本节点为前置、图上更深一层的节点(prereq 下游 unlocks)
   2) 去树上其他地方看看 = 树上其他可探索的节点(用户 2026-07-22 更正:不再按「同层」,
      而是给出树上别处的入口)。跨分支优先、偏好浅前置(更可能已解锁),客户端隐去已读的。
   每组无候选即不渲染。 */
function recommendRow(node, L) {
  const lang = L || makeL(LANGS[0]);
  const built = n => builtIds.has(n.id);
  const byX = (a, b) => (a.x - b.x) || a.id.localeCompare(b.id);
  const item = n => `<a class="rec-item" data-node="${esc(n.id)}" data-branch="${esc(n.branch)}" href="${lang.href(`/lesson/${n.id}.html`)}">`
    + `<span class="rec-id">${esc(n.id)}</span><span class="rec-name">${esc(lang.nodeTitle(n))}</span></a>`;

  const down = tree.nodes.filter(n => n.prereqs.includes(node.id) && built(n)).sort(byX);
  const skip = new Set([node.id, ...down.map(n => n.id), ...node.prereqs]);

  /* 树上其他可探索节点:按分支分桶,桶内偏好浅前置(入口更可能已解锁)+靠左;
     再跨分支轮转取样,当前分支排最后,凑够 6 个——保证广度、避免全挤在一支。 */
  const buckets = {};
  for (const n of tree.nodes) {
    if (!built(n) || skip.has(n.id) || n.branch === "root") continue;
    (buckets[n.branch] ||= []).push(n);
  }
  for (const b in buckets) buckets[b].sort((a, c) => (a.prereqs.length - c.prereqs.length) || byX(a, c));
  const order = Object.keys(buckets).sort((a, b) => (a === node.branch) - (b === node.branch) || a.localeCompare(b));
  const explore = [];
  for (let i = 0; explore.length < 6 && order.some(b => buckets[b][i]); i++)
    for (const b of order) { if (buckets[b][i] && explore.length < 6) explore.push(buckets[b][i]); }

  const group = (key, items, filter) => items.length
    ? `<div class="rec-group"${filter ? ` data-rec-filter="${filter}"` : ""}>`
      + `<span class="rec-glabel">${esc(lang.t(key))}</span>`
      + `<div class="rec-items">${items.slice(0, 6).map(item).join("")}</div></div>`
    : "";

  const groups = [
    group("rec.down", down),
    group("rec.explore", explore, "explored")
  ].filter(Boolean).join("");
  if (!groups) return "";
  return `<section class="recommend" aria-label="${esc(lang.t("rec.title"))}" style="margin-top:56px">`
    + `<span class="label rec-title">${esc(lang.t("rec.title"))}</span>${groups}</section>`;
}


/* 首页内容总览行（点击=树视角跳到该分支，与 tree.js 的 [data-jump] 联动） */
function introMap(L) {
  const lang = L || makeL(LANGS[0]);
  const DESC = Object.fromEntries(["red","blue","yellow","green","case","converge"].map(b => [b, lang.branchDesc(b)]));
  const SW = { red: "var(--red)", blue: "var(--blue)", yellow: "var(--yellow)",
    green: "var(--green)", case: "var(--text-mute)", converge: "var(--text)" };
  return ["red", "blue", "yellow", "green", "case", "converge"].map(b => {
    const n = tree.nodes.filter(x => x.branch === b).length;
    return `<button class="im-pill" data-jump="${b}" title="${esc(DESC[b])}"><span class="im-dot" style="background:${SW[b]}"></span>` +
      `<span class="im-name">${esc(lang.branch(b))}</span><span class="im-n">${n}</span></button>`;
  }).join("");
}

/* ---- homepage：v3 全屏天赋树（树即首页即核心导航）---- */
function homePage(L) {
  const lang = L || makeL(LANGS[0]);
  const url = SITE + lang.prefix + "/";
  const jsonld = {
    "@context": "https://schema.org", "@type": "Course",
    name: lang.isEn ? "REACTOR — an interactive course on rankings, evaluation and metric failure"
                    : "REACTOR — 排名、评测与指标失灵的互动课程",
    description: lang.t("meta.homeDesc", { n: tree.nodes.length }),
    inLanguage: lang.htmlLang, url, author: AUTHOR, isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "REACTOR", url },
    educationalLevel: "advanced",
    about: ["Goodhart's Law", "Reactivity", "Performativity", "AI evaluation", "Reward hacking",
            "Benchmark contamination", "Metric design", "指标失灵", "排名反应性"],
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT12H" },
    hasPart: tree.nodes.filter(n => builtIds.has(n.id)).map(n => ({
      "@type": "LearningResource", name: lang.isEn ? n.en : `${n.zh} · ${n.en}`,
      url: `${SITE}${lang.prefix}/lesson/${n.id}.html`
    }))
  };
  return head({ title: lang.t("meta.homeTitle"), desc: jsonld.description, url, jsonld, L: lang, altPath: "/" })
    + siteHead({ home: true, L: lang, altPath: "/" })
    + `<main class="tree-full" data-branch="root">
  <div class="intro-strip">
    <div class="is-title">
      <h1>${esc(lang.t("home.title"))}</h1>
      <span class="is-sub">${esc(lang.t("home.sub", { n: tree.nodes.length }))}</span>
    </div>
    <nav class="is-map" aria-label="${esc(lang.t("nav.tree"))}">${introMap(lang)}</nav>
    <div class="is-actions">
      <a class="btn btn-primary" href="${lang.href("/lesson/N00.html")}">${esc(lang.t("home.cta"))}</a>
      <span class="intro-controls" aria-label="map controls">
        <button data-tree-zout aria-label="${esc(lang.t("hud.zoomOut"))}">−</button><button data-tree-zin aria-label="${esc(lang.t("hud.zoomIn"))}">+</button>
        <button data-tree-fit>${esc(lang.t("hud.fit"))}</button><button data-tree-reset-progress>${esc(lang.t("hud.reset"))}</button>
      </span>
    </div>
  </div>
  <div class="tree-viewport" id="tree-viewport" data-mode="full">
    <noscript><div class="noscript-fallback">${esc(lang.t("home.noscript"))}
      <a href="${lang.href("/lesson/N00.html")}">N00</a> · <a href="${lang.href("/atlas.html")}">${esc(lang.t("nav.atlas"))}</a></div></noscript>
  </div>
</main>` + siteFoot(lang);
}

/* ---- atlas: node index (grouped) + glossary + myth-corrections ---- */
const GLOSSARY = [
  ["Reactivity 反应性", "人因被测量、观察、评估而改变行为，本课的地基（Espeland & Sauder）。"],
  ["Commensuration 可通约化", "把异质的质压成共享一把标尺的量；主动创造可比性，而非发现相似。"],
  ["Self-fulfilling prophecy 自我实现预言", "起初为假的定义，经由改变行为把自己变真（Merton）。"],
  ["Performativity 表演性", "理论不是照相机而是引擎；使用使世界向理论收敛（Barnesian）或背离（counter）。"],
  ["Looping effects 循环效应", "分类改变被分类者，被分类者反过来改变类别；人的种类是移动的靶（Hacking）。"],
  ["Legibility 可读性", "为治理而把社会简化成可测形式；操纵的前提（Scott）。"],
  ["Goodhart 定律", "任何统计规律一旦用于调控就崩塌；流行的'measure/target'版实为 Strathern。"],
  ["Campbell 定律", "指标越用于高利害决策，越腐蚀它本要监测的过程。"],
  ["Requisite variety 必要多样性", "只有多样性能消灭多样性；单一指标约束不住复杂系统（Ashby）。"],
  ["Surrogation 代理指标替代", "把衡量目标的指标当成目标本身的认知替换，Goodhart 的心理地基。"],
  ["Reward hacking 奖励破解", "优化器把奖励拉满却不做你想要的事；Goodhart 在梯度下降里的重演。"],
  ["Nearest unblocked strategy 最近未堵策略", "打一个补丁，优化器就找到最近的绕行捷径；这是修 eval 总显得机械的原因。"],
  ["Adaptive overfitting 适应性过拟合", "反复用同一测试集做选择，就把它的特异性学进模型：看也是训练。"],
  ["Performative prediction 表演性预测", "预测改变数据分布；重训练收敛到'自造世界'而非最优（Perdomo）。"],
  ["Optimizer's curse 优化者诅咒", "从多候选择优即高估；选中者的真值期望必低于其估计。"],
  ["Trade-offs 权衡（诚实信号现代版）", "诚实由质量依赖的净收益差维持；成本差只是其中一种实现，均衡成本可为零（Számadó et al. 2023/2026）。"],
  ["Strategic classification 策略性分类", "公布分类器，被分类者照规则改造自己；想诱导真改进必须解因果推断问题（Miller-Milli-Hardt 2020）。"],
  ["Evaluation awareness 评测觉知", "模型识别出自己在被测并改变行为；2025 年已有因果证据，读数本身被污染。"],
  ["Proxy failure 代理失效", "跨神经科学/经济学/生态学的统一命名，把成瘾、孔雀尾与 Goodhart 收进同一机制（John et al. 2024, BBS）。"],
  ["Good regulator theorem 好调节器定理", "好的调节器必是被调节系统的（同态）模型；scalar eval = 没有模型的调节（Conant & Ashby 1970）。"],
  ["Mechanical objectivity 机械客观性", "遵循公开规则、排除个人判断的客观性：谁来算结果都一样；不信任裁量的社会转而信任程序与数字（Porter）。"],
  ["L'homme moyen 平均人", "Quetelet 把误差曲线搬到人身上：正中央从杂音翻转成理想与标准，「正常/不正常」这条线由此被画出。"],
  ["Cheap talk 空口白话", "零成本的话能传多少真，由双方利益一致程度单调决定；维持诚实所需成本正比于利益冲突（Crawford & Sobel）。"],
  ["Regression to the mean 向均值回归", "极端成绩里掺着运气，再测一次运气散去分数自然回落；先扣回归，再谈反应性（Galton）。"],
  ["RLHF 从人类反馈做强化学习", "人类二选一→奖励模型→拿分当靶子拧策略；三步连续降维，模型最后追的是刻度不是你心里的「好」。"],
  ["Bradley-Terry 配对比较模型", "假设每个选手有隐含实力值，从大量两两胜负里反推；竞技场排名与 RLHF 奖励模型的共同统计骨架。"],
  ["Benchmark saturation 基准饱和", "顶尖模型间失去可统计区分的分辨力；随基准年龄温和上升，公开与私有题库无显著差别。"],
  ["Red-teaming 红队", "雇捣蛋鬼抢在优化器前头找最近的未堵出口；只能证明「这里能破」，永远证不了「哪里都破不了」。"],
  ["Temporal split 时间切分", "只考模型训练截止日之后出现的题，没见过未来就没法背；把防作弊从抬成本换成讲因果。"],
  ["POSIWID", "系统的目的就是它实际所做的，不是它宣称的意图；短语确为 Beer 所述，缩写为后人定型。"],
  ["Impact factor 影响因子", "某刊前两年论文的当年篇均被引；分子分母都留有套利面，DORA 主张不得以它评单篇与个人。"],
  ["Selection effect 选择效应（成绩单效应）", "不改自身水平，改被测总体：医生回避高危病人，账面全真，比造假更难抓（Dranove 2003）。"],
  ["Success indicator problem 成功指标问题", "单一总量指标下的方向性扭曲与品种坍缩：按吨造厚、按面积造薄，指标没写的等于死刑（Nove 1958）。"],
  ["裁判的利益相关度（第八杠杆）", "打分机构的收入、估值或数据来源是否依赖被打分者；与前七根杠杆正交，裁判可中立也可不中立。"]
];
const MYTHS = [
  ["“When a measure becomes a target…”", "不是 Goodhart 说的。是 Strathern (1997, p.308) 措辞、Hoskin (1996) 命名。", "B01 / R09"],
  ["德里眼镜蛇故事", "无一手史料，疑为都市传说。有档案的是河内老鼠悬赏 (1902, Michael Vann)。", "B04"],
  ["McNamara 四步引文", "实为 Yankelovich 1971 演讲；Handy 1994 误归给 McNamara。", "B05"],
  ["霍桑效应（强版本）", "原始照明数据经 Levitt & List (2011) 重分析判为 'entirely fictional'。", "R11"],
  ["Ashby “absorb variety”", "原文是 'only variety can destroy variety'；absorb 是 Beer 的改写。", "B11"],
  ["“不能度量就不能管理”≈Deming", "反了。Deming 视其为要破除的谬误；'最重要数字不可知'是他转引 Nelson。", "G02"],
  ["“Grafen 证明了障碍原则”", "该流行叙事被 Penn & Számadó (2020) 论证为对模型的误读。", "G01"],
  ["NUS 归于 Alex Turner", "更准的溯源是 Yudkowsky / Arbital（约 2015）。", "Y05"],
  ["Pygmalion 效应是铁证", "效应主要限一二年级、复制不稳定，被 Thorndike 1968 批评。", "R02"],
  ["苏联钉子厂", "寓言级证据，无一手史料；巨钉漫画的《鳄鱼》刊期从未被可靠定位。机制真实但别当史实引用。", "K06"],
  ["家族起点是 Campbell / Goodhart", "需前推：Ridgway 1956 (ASQ) 是最早的成文系统综述，早 19 年；三方原文互不引用，大概率独立发现。", "B01 / B15"],
  ["Goodhart 与 Lucas 独立发现", "需收紧：Chrystal & Mizen (2003) 裁定「若两者等价，Lucas 几乎肯定先说」。", "B01 / B03"],
  ["Campbell 1976 与 1979 是两说", "同一文本：油印本 (1976) ＝ 期刊版 (1979)，措辞一致。", "B02"],
  ["E&S 2007 提出「四机制」", "2007 原文只有 2 机制 + 3 效果；narrative 出自 Espeland 2015，reverse engineering 与 emotional attachments 出自 Espeland 2016 (HSR)。", "R01 / R14"],
  ["MusicLab 证明成功纯随机", "误读：2008 反转实验恰证质量设定边界，最好的歌能从人为打压中恢复。", "R10"],
  ["霍桑效应作为统一效应成立", "连概念本身都被判不成立；McCambridge (2014) 主张弃名，改用 research participation effects。", "R11"],
  ["污染 = 分数线性虚高", "路径依赖：同一次泄漏既可致命，也可被后续训练洗掉（Schaeffer 2026 的污染悖论）。", "Y03"],
  ["反复刷同一榜必然严重过拟合", "经验裁决温和得多：Kaggle 百场「little evidence of substantial overfitting」，机制是模型相似性。", "Y02"],
  ["winner's curse 出自 Thaler", "概念源自 Capen, Clapp & Campbell (1971) 三位石油工程师；Thaler 1988 是通俗化者。", "B13"],
  ["好调节器定理证明需要世界模型", "「model」只是同态映射；且因果方向常被讲反，原证明有技术空隙（Scholten 2010）。", "B11"],
  ["POSIWID 是后人讹传", "这次不是讹传：短语确为 Beer 所述，仅缩写为后人定型。", "G02"],
  ["cost differential 是诚实信号的终点", "已被 2023/2026 的 trade-offs 超越：成本可为零，关键是质量依赖的净收益差。", "G01"],
  ["昂贵信号是诚实的必要条件", "错：昂贵只在利益冲突时才需要，且需要量正比于冲突（cheap talk 传统）。", "G01 / B16"],
  ["操演性 = 经济学总能自证", "抹掉了 MacKenzie 四分类学，尤其方向相反的 counterperformativity。", "R07"],
  ["「榜首回落」证明反应性", "向均值回归足以单独解释；须先扣除回归再归因 Goodhart。", "B13 / B17"],
  ["统计类别是建构的，所以是假的", "Hacking 明确反对：互动类既是建构的又是真实的，「建构＝虚构」是对循环效应最常见的误用。", "R15"],
  ["Ridgway 拼作 Ridgeway", "误拼多了一个 e，连一些正式出版物都拼错；正确拼法是 Ridgway。", "B15"],
  ["家族警句只有那句 measure/target", "最早最形象的警句是 Ridgway 1956 的青霉素比喻「治病的药有时比病更糟」，却几乎从未被通俗文章引用。", "B15"],
  ["Secrist：商业世界正走向平庸的胜利", "1933 年整本书把向均值回归误当真实经济规律，成了统计学著名反面教材。", "B17"],
  ["《体育画报》封面诅咒", "上封面正因刚打出极端高峰，之后回落是纯回归；诅咒不存在，存在的是给回归编因果故事。", "B17"],
  ["RLHF 教模型对齐人类价值观", "它优化的是「人类当场更喜欢哪个回答」；偏好模型常奖励迎合而非真话，谄媚被放大（GPT-4o 2025-04 回滚）。", "Y16"],
  ["逼近满分＝模型快把任务做完了", "MMLU 约 6.49% 错题把上限钉在 93.5% 附近：撞的是标注天花板与糙设计，不是能力天花板。", "Y17"],
  ["把题藏起来，分数就是干净的", "公开与私有测试集饱和率无统计显著差异；污染检测方法本身站不住，阴性不等于干净。", "G03"],
  ["指标越多越抗博弈", "Meyer 2003 观察相反：指标越多扭曲往往越多；制衡只在各维正交、作弊手段不相通时成立。", "G04"],
  ["设计得够好就能造出不可博弈的指标", "Gibbard–Satterthwaite 与 Skalse 等证明一般情形不可能；只能在四条退路上抬高操纵成本。", "G05"],
  ["旧榜有病，换套更透明的新榜就好", "Doing Business 换成 B-READY 照被质疑「过时且不公」；US News 改法后博弈照旧。后果还在，改方法只是换战场。", "G06"],
  ["过了红队测试就是安全的", "红队只给下界：证明「这里能破」，证不了「哪里都破不了」；sandbagging 与评测觉知还在掏空地基。", "G07"],
  ["上线跑 A/B 看真实数据就客观了", "现实防的是自报造假，防不了选错代理；现实指标一旦成为目标照样滑回 Goodhart。", "G08"],
  ["Campbell 举过中国科举的例子", "1979 原文全文无 China、无 imperial examination，科举例子是后人附会；「Campbell's Law」之名亦系后人所加。", "K01"],
  ["Bevan & Hood 证明了目标制失败", "过度简化：受考核维度的改善是真实的，论点是改善与博弈并存、审计太弱无法区分比例。", "K02"],
  ["豆瓣「锁分」/「评分皆水军」", "法院认定锁分证据不足；水军攻击另有分布铁证。攻防双向，单方受害叙事是选择性引用。", "K04"],
  ["成绩单证明公开透明是错的", "把双向证据读成单向：回避高危是实锤，真实质量改进同样成立（Kolstad 2013）；净福利取决于风险调整。", "K05"],
  ["榜单出问题，改改评分方法就能修好", "改良指标不等于消除反应性：修订本身立刻成为被博弈对象，指标与被测者共同演化。", "C08"]
];

function atlasPage(L) {
  const lang = L || makeL(LANGS[0]);
  const url = SITE + lang.prefix + "/atlas.html";
  const branchOrder = ["root", "red", "blue", "yellow", "green", "case", "converge"];
  const groups = branchOrder.map(b => {
    const ns = tree.nodes.filter(n => n.branch === b).sort((a, c) => a.id.localeCompare(c.id));
    if (!ns.length) return "";
    return `<div class="atlas-group" data-branch="${b}">
      <div class="nameplate" style="margin:28px 0 12px"><span class="tag">${esc(lang.branch(b))}</span><span class="rule"></span><span class="rev">${ns.length} ${esc(lang.t("atlas.nodes"))}</span></div>
      <div class="cards">${ns.map(n => `<a class="card" data-branch="${b}" href="${lang.href(`/lesson/${n.id}.html`)}">
        <span class="num">${esc(n.id)}</span><h3>${esc(lang.nodeTitle(n))}</h3><p>${esc(lang.nodeHook(n))}</p></a>`).join("")}</div></div>`;
  }).join("");
  const GL = lang.isEn ? (I18N.glossaryEn || GLOSSARY) : GLOSSARY;
  const glossary = GL.map(([t, d]) => `<div class="gl"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("");
  // "见 B01 / R09" 以前是纯文本：叫人去看，却不给路。拆成节点链接。
  const refLinks = ref => esc(ref).split(" / ").map(id => {
    const n = byId[id.trim()];
    return n && builtIds.has(n.id) ? `<a href="${lang.href(`/lesson/${n.id}.html`)}">${n.id}</a>` : id;
  }).join(" / ");
  const MY = lang.isEn ? (I18N.mythsEn || MYTHS) : MYTHS;
  const myths = MY.map(([m, c, ref]) => `<tr><td>${m}</td><td>${c}</td><td class="mono">${refLinks(ref)}</td></tr>`).join("");
  const atlasLd = [{
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "图鉴 / Atlas · REACTOR", url, inLanguage: "zh-CN", author: AUTHOR,
    description: "REACTOR 全节点索引、术语表与讹传更正速查。",
    isPartOf: { "@type": "Course", name: "REACTOR", url: SITE + "/" },
    mainEntity: {
      "@type": "ItemList", numberOfItems: tree.nodes.length,
      itemListElement: tree.nodes.filter(n => builtIds.has(n.id)).map((n, i) => ({
        "@type": "ListItem", position: i + 1, name: `${n.id} ${n.zh}`,
        url: `${SITE}/lesson/${n.id}.html`
      }))
    }
  }, {
    // 术语表:让 AI 检索能直接取到「这门课怎么定义每个术语」
    "@context": "https://schema.org", "@type": "DefinedTermSet",
    name: "REACTOR 术语表", url: url + "#glossary", inLanguage: "zh-CN",
    hasDefinedTerm: GLOSSARY.map(([t, d]) => ({
      "@type": "DefinedTerm", name: t, description: d, inDefinedTermSet: url + "#glossary"
    }))
  }];
  return head({ title: lang.t("atlas.metaTitle"), desc: lang.t("atlas.metaDesc"), url, jsonld: atlasLd, L: lang, altPath: "/atlas.html" })
    + siteHead({ L: lang, altPath: "/atlas.html" }) + `<main class="wrap section" data-branch="root">
    <div class="nameplate"><span class="tag">ATLAS</span><span>INDEX · GLOSSARY · CORRECTIONS</span><span class="rule"></span></div>
    <h1 style="margin:16px 0">${esc(lang.t("atlas.title"))}</h1>
    <p class="lede">${esc(lang.t("atlas.lede", { n: tree.nodes.length }))}</p>
    ${groups}
    <div class="nameplate reg" style="margin:40px 0 16px"><span class="tag">GLOSSARY</span><span>${esc(lang.t("atlas.glossary"))}</span><span class="rule"></span></div>
    <dl class="glossary">${glossary}</dl>
    <div class="nameplate reg" style="margin:40px 0 16px"><span class="tag">CORRECTIONS</span><span>${esc(lang.t("atlas.corrections"))}</span><span class="rule"></span></div>
    <p class="read" style="color:var(--text-2);font-size:.92rem">${esc(lang.t("atlas.correctionsLede"))}</p>
    <div class="scroll-x"><table class="atlas-table myths"><tr><th>${esc(lang.t("atlas.thClaim"))}</th><th>${esc(lang.t("atlas.thFix"))}</th><th>${esc(lang.t("atlas.thSee"))}</th></tr>${myths}</table></div>
  </main>` + siteFoot(lang);
}

/* ============================================================
   emit
   ============================================================ */
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await mkdir(path.join(DIST, "lesson"), { recursive: true });
await cp(path.join(ROOT, "theme"), path.join(DIST, "theme"), { recursive: true });
await cp(path.join(ROOT, "modules"), path.join(DIST, "modules"), { recursive: true });
if (existsSync(path.join(ROOT, "static"))) await cp(path.join(ROOT, "static"), path.join(DIST, "static"), { recursive: true });
if (existsSync(path.join(ROOT, "static/favicon.svg"))) await cp(path.join(ROOT, "static/favicon.svg"), path.join(DIST, "favicon.svg"));
// OG 分享图放站根(URL 简洁,社交平台抓取友好)
if (existsSync(path.join(ROOT, "static/og.png"))) await cp(path.join(ROOT, "static/og.png"), path.join(DIST, "og.png"));

/* tree-data.js：天赋树唯一数据源（tree.json+布局 生成；首页全屏树与课程页导轨共用） */
await writeFile(path.join(DIST, "modules", "tree-data.js"),
  `/* REACTOR · tree-data.js — generated from content/tree.json by build.mjs, do not edit */\n`
  + `export const TREE = ${JSON.stringify({
      nodes: tree.nodes.map(n => ({
        id: n.id, zh: n.zh, en: n.en, branch: n.branch, x: n.x, y: n.y, prereqs: n.prereqs,
        hook: n.hook, hookEn: I18N.node[n.id]?.hook?.en || "",
        built: builtIds.has(n.id), kind: n.branch === "converge" ? "cap" : "chip"
      })),
      bounds, branchLabel: BRANCH_LABEL,
      levels: LEVELS.map(l => ({ ...l, labelEn: I18N.level[l.label]?.en || l.label }))
    })};\n`);

/* 双语输出:zh 在站根,en 在 /en 前缀。英文课文缺失时回落中文正文
   (页面骨架仍是英文,内容标注为待译)——保证 /en 路由始终完整,翻译灌进来即生效。 */
const lessonsEnDir = path.join(ROOT, "content/lessons-en");
const lessonsEn = {};
if (existsSync(lessonsEnDir)) {
  for (const f of (await readdir(lessonsEnDir)).filter(f => f.endsWith(".mjs"))) {
    const mod = await import(pathToFileURL(path.join(lessonsEnDir, f)).href);
    lessonsEn[mod.default.id] = mod.default;
  }
}
const emitted = [];   // {id, node} —— 真正落盘的课,供 sitemap / llms.txt 共用
for (const langDef of LANGS) {
  const L = makeL(langDef);
  const dir = langDef.dir ? path.join(DIST, langDef.dir) : DIST;
  await mkdir(path.join(dir, "lesson"), { recursive: true });
  await writeFile(path.join(dir, "index.html"), homePage(L));
  await writeFile(path.join(dir, "atlas.html"), atlasPage(L));
  for (const [id, lesson] of Object.entries(lessons)) {
    if (!byId[id]) { if (!L.isEn) console.log(`  ⚠ 课文 ${id} 无对应树节点,跳过(节点已被裁撤)`); continue; }
    const body = L.isEn ? (lessonsEn[id] || lesson) : lesson;
    await writeFile(path.join(dir, "lesson", id + ".html"), lessonPage(byId[id], body, L));
    if (!L.isEn) emitted.push({ id, node: byId[id] });
  }
}
console.log(`  · 英文课文已译 ${Object.keys(lessonsEn).length}/${emitted.length}（未译的暂用中文正文占位，骨架已英文化）`);
const newest = Object.values(LESSON_DATES).sort().pop() || TODAY;
/* sitemap:带真实 lastmod(git 提交日) + 分层 priority。
   根节点是入口故 0.9,汇流 capstone 是终点故 0.8,其余课 0.7。 */
const priOf = n => n.branch === "root" ? "0.9" : n.branch === "converge" ? "0.8" : "0.7";
const smPaths = [
  { p: "/", lastmod: newest, cf: "weekly", pri: "1.0" },
  { p: "/atlas.html", lastmod: newest, cf: "monthly", pri: "0.8" },
  ...emitted.map(({ id, node }) => ({
    p: `/lesson/${id}.html`, lastmod: LESSON_DATES[id] || newest, cf: "monthly", pri: priOf(node)
  }))
];
/* 双语 sitemap:每个 URL 内嵌 xhtml:link 声明两语对照(Google 推荐的 hreflang 表达方式),
   英文版 priority 略低于中文母版。 */
const smEntry = (path_, lastmod, cf, pri, isEn) =>
  `  <url><loc>${SITE}${isEn ? "/en" : ""}${path_}</loc><lastmod>${lastmod}</lastmod>`
  + `<changefreq>${cf}</changefreq><priority>${pri}</priority>`
  + `<xhtml:link rel="alternate" hreflang="zh-Hans" href="${SITE}${path_}"/>`
  + `<xhtml:link rel="alternate" hreflang="en" href="${SITE}/en${path_}"/>`
  + `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${path_}"/></url>`;
await writeFile(path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`
  + smPaths.map(u => smEntry(u.p, u.lastmod, u.cf, u.pri, false)).join("\n") + "\n"
  + smPaths.map(u => smEntry(u.p, u.lastmod, u.cf, (Math.max(0.4, (+u.pri) - 0.1)).toFixed(1), true)).join("\n")
  + `\n</urlset>\n`);

// robots.txt 只在域名根目录有效；挂在子路径下时不生成，免得给人"这里能配爬虫"的错觉。
// GEO:AI 检索器逐个显式放行——这门课本身就讲「评测与引用」,被 AI 引用是分内事。
if (!BASE) await writeFile(path.join(DIST, "robots.txt"),
`User-agent: *
Allow: /

# AI 检索/抓取器显式放行(GEO):内容欢迎被检索、摘要与引用
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

/* llms.txt(GEO 核心):给大模型看的全站目录 —— 两语各一份。
   一次抓取即可拿到结构、每课主张与入口。格式沿用 llmstxt.org 约定。 */
if (!BASE) for (const langDef of LANGS) {
  const L = makeL(langDef);
  const order = ["root", "red", "blue", "yellow", "green", "case", "converge"];
  const sections = order.map(b => {
    const ns = emitted.filter(e => e.node.branch === b).sort((a, x) => a.id.localeCompare(x.id));
    if (!ns.length) return "";
    return `## ${L.branch(b)}（${ns.length}）\n${L.branchDesc(b)}\n\n`
      + ns.map(({ id, node }) =>
          `- [${id} ${L.nodeTitle(node)}](${SITE}${L.prefix}/lesson/${id}.html) — ${L.nodeHook(node)}`).join("\n");
  }).filter(Boolean).join("\n\n");

  const zhBody =
`# REACTOR — 排名、评测与指标失灵的互动课程

> 测量一个社会对象，就是干预它。这门免费课程把「排名 / 评测 / 反身性」从社会学、经济学讲到 AI 前沿，${emitted.length} 节十分钟短课组成一棵可自由探索的天赋树，每课配一个可上手的交互实验。

作者 Vince Jiang（https://vincejiang.com）。中文原版在 ${SITE}/，英文版在 ${SITE}/en/。欢迎抓取、检索、摘要与引用（geo-open；robots.txt 显式放行 GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / Claude-SearchBot / PerplexityBot / Google-Extended / Applebot-Extended / CCBot）。

课程有两个特点值得注意：一是每条流行说法都做过出处考证（例如「When a measure becomes a target」并非 Goodhart 原话，而出自 Strathern 1997），全部考证收在图鉴的「讹传更正」表；二是每课都以「一句话带走」收尾，可直接作为该主题的凝练答案引用。

- 天赋树主页：${SITE}/
- 图鉴（全节点索引 + 术语表 + 讹传更正速查）：${SITE}/atlas.html
- 英文版：${SITE}/en/
- 站点地图（含双语 hreflang 对照）：${SITE}/sitemap.xml`;

  const enBody =
`# REACTOR — an interactive course on rankings, evaluation and metric failure

> To measure a social object is to intervene in it. This free course traces reactivity, Goodhart's Law and AI evaluation gaming from sociology and economics through to the frontier of machine learning: ${emitted.length} ten-minute lessons arranged as a talent tree you can explore in any order, each with a hands-on interactive experiment.

By Vince Jiang (https://vincejiang.com). Chinese original at ${SITE}/, English at ${SITE}/en/. Crawling, retrieval, summarisation and citation are all welcome (geo-open; robots.txt explicitly allows GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / Claude-SearchBot / PerplexityBot / Google-Extended / Applebot-Extended / CCBot).

Two things make this course unusually citable. First, every popular claim has been traced to source — "When a measure becomes a target, it ceases to be a good measure" is not Goodhart's sentence but Strathern's (1997); all such corrections live in the atlas. Second, every lesson closes with a one-line takeaway that can be quoted directly as the compressed answer for that topic.

- Talent tree (home): ${SITE}/en/
- Atlas (all nodes + glossary + corrections table): ${SITE}/en/atlas.html
- Chinese original: ${SITE}/
- Sitemap (with bilingual hreflang): ${SITE}/sitemap.xml`;

  const tail = L.isEn
    ? `\n\n## How to cite\nPoint at the specific lesson URL for a specific claim. Every lesson page carries schema.org LearningResource data (teaches / coursePrerequisites / isPartOf) that can be parsed directly.\n`
    : `\n\n## 引用建议\n引用具体主张时请指向对应课程页 URL。每课页面含 schema.org LearningResource 结构化数据（含 teaches / coursePrerequisites / isPartOf），可直接解析。\n`;

  const outDir = langDef.dir ? path.join(DIST, langDef.dir) : DIST;
  await writeFile(path.join(outDir, "llms.txt"), (L.isEn ? enBody : zhBody) + "\n\n" + sections + tail);
}

/* small extra CSS for atlas table + stubs, appended so build stays single-source */
await writeFile(path.join(DIST, "theme", "extra.css"),
  `.atlas-table{width:100%;border-collapse:collapse;font-size:.9rem}
.atlas-table th,.atlas-table td{text-align:left;padding:.6em .8em;border-bottom:1px solid var(--line)}
.atlas-table th{font-family:var(--font-mono);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-2)}
.atlas-table.myths td{font-size:.86rem;vertical-align:top}
.atlas-table.myths td:first-child{color:var(--text);font-weight:700}
.glossary{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:2px 24px;margin:0}
.glossary .gl{padding:12px 0;border-bottom:1px solid var(--line)}
.glossary dt{font-family:var(--font-mono);font-size:.82rem;color:var(--accent);margin-bottom:4px}
.glossary dd{margin:0;font-size:.9rem;color:var(--text-2);line-height:1.55}
.stub{color:var(--text-mute)}
details.sources{margin-top:24px;border:1px solid var(--line);border-radius:var(--radius);padding:12px 16px}
details.sources summary{cursor:pointer}`);

/* ---- finalize：给内部链接加 BASE 前缀 + 给静态资源打内容指纹 ----
   指纹用 ?v=<hash>，不改文件名。改文件名会遇到 boot.js ↔ tree.js 的循环
   import（重命名要求拓扑序，有环就排不出来）；查询串没有这个问题，
   因为哈希算的是文件"原始内容"，不受重写影响，没有级联失效。 */
async function finalize() {
  const walk = async d => {
    const out = [];
    for (const e of await readdir(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) out.push(...await walk(f)); else out.push(f);
    }
    return out;
  };
  const files = await walk(DIST);
  // 1. 先按原始内容算哈希（重写之前）
  const stamp = new Map();
  for (const f of files) {
    const rel = "/" + path.relative(DIST, f).split(path.sep).join("/");
    if (!/^\/(theme|modules)\/.+\.(css|js)$/.test(rel)) continue;
    const h = createHash("sha256").update(await readFile(f)).digest("hex").slice(0, 10);
    stamp.set(rel, `${BASE}${rel}?v=${h}`);
  }
  // 2. 再重写所有 html / js 里的引用
  const rewriteAttr = t => t.replace(/(href|src)="(\/[^"#?]*)((?:#|\?)[^"]*)?"/g,
    (m, a, p2, tail = "") => `${a}="${stamp.get(p2) || BASE + p2}${stamp.has(p2) ? "" : tail}"`);
  const rewriteImports = t => t.replace(/(["'])(\/modules\/[A-Za-z0-9_.-]+\.js)\1/g,
    (m, q, p2) => `${q}${stamp.get(p2) || BASE + p2}${q}`);
  let n = 0;
  for (const f of files) {
    if (f.endsWith(".html")) { await writeFile(f, rewriteAttr(await readFile(f, "utf8"))); n++; }
    else if (f.endsWith(".js")) { await writeFile(f, rewriteImports(await readFile(f, "utf8"))); n++; }
  }
  return { hashed: stamp.size, rewritten: n };
}
const fin = await finalize();

console.log(`✓ built ${Object.keys(lessons).length} lessons + home + atlas → dist/`);
console.log(`  base: ${BASE || "(站根)"} · site: ${SITE} · 指纹资源 ${fin.hashed} 个 · 重写 ${fin.rewritten} 文件`);
console.log(`  nodes: ${tree.nodes.length} · authored: ${[...builtIds].join(", ")}`);
