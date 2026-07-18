/* ============================================================
   REACTOR · static site generator (zero framework, no React)
   node build.mjs  →  writes dist/
   ============================================================ */
import { readFile, writeFile, mkdir, rm, cp, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");
/* 部署位置由环境变量决定，默认是站根（本地预览用）：
     BASE=/reactor-study  → 站点挂在子路径下，所有内部链接加前缀
     SITE=https://…       → canonical / sitemap 用的绝对前缀 */
const BASE = (process.env.BASE || "").replace(/\/$/, "");
const SITE = process.env.SITE || "https://reactor.study";

const tree = JSON.parse(await readFile(path.join(ROOT, "content/tree.json"), "utf8"));
const byId = Object.fromEntries(tree.nodes.map(n => [n.id, n]));

/* ---- talent-tree auto-layout (branch columns × tier rows) ----
   Column x is derived from each branch's widest tier, so branches can never
   collide; tiers wider than MAX_PER_ROW wrap into stacked sub-rows. */
const ROW_H = 210, COL_W = 168, SUB_DY = 92;
const CHIP_W = 132, MAX_PER_ROW = 4, GUTTER = 110, CONV_OFFSET_TIERS = 1;
const rowsOf = len => Math.ceil(len / MAX_PER_ROW);
const perRowOf = len => Math.ceil(len / rowsOf(len));
function layout() {
  const groups = {};
  for (const n of tree.nodes) {
    const key = n.branch + ":" + n.tier;
    (groups[key] ||= []).push(n);
  }
  // half-width each branch needs at its widest tier, chip edge included
  const halfW = {};
  for (const [key, arr] of Object.entries(groups)) {
    const branch = key.split(":")[0];
    const half = (perRowOf(arr.length) - 1) / 2 * COL_W + CHIP_W / 2;
    halfW[branch] = Math.max(halfW[branch] || 0, half);
  }
  const BRANCH_X = { root: 0, blue: 0, converge: 0 };
  BRANCH_X.red = -((halfW.blue || 0) + GUTTER + (halfW.red || 0));
  BRANCH_X.yellow = (halfW.blue || 0) + GUTTER + (halfW.yellow || 0);

  const maxBranchTier = Math.max(...tree.nodes.filter(n => n.branch !== "converge").map(n => n.tier));
  for (const [key, arr] of Object.entries(groups)) {
    const [branch, tierStr] = key.split(":");
    const tier = +tierStr;
    arr.sort((a, b) => a.id.localeCompare(b.id));
    const rows = rowsOf(arr.length), perRow = perRowOf(arr.length);
    const baseY = branch === "converge"
      ? (maxBranchTier + CONV_OFFSET_TIERS + (tier - 3)) * ROW_H
      : tier * ROW_H;
    arr.forEach((n, i) => {
      const r = Math.floor(i / perRow), j = i - r * perRow;
      const inRow = Math.min(perRow, arr.length - r * perRow);
      n.x = BRANCH_X[branch] + (j - (inRow - 1) / 2) * COL_W;
      n.y = baseY + (r - (rows - 1) / 2) * SUB_DY;
    });
  }
  const xs = tree.nodes.map(n => n.x), ys = tree.nodes.map(n => n.y);
  return {
    minX: Math.min(...xs) - 120, maxX: Math.max(...xs) + 120,
    minY: Math.min(...ys) - 90, maxY: Math.max(...ys) + 110
  };
}
const bounds = layout();

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
const BRANCH_LABEL = { root: "ROOT", red: "社会学谱系", blue: "定律与形式", yellow: "机器与前沿", converge: "汇流" };

/* 外部开源字体（jsDelivr / fontsource，均为 SIL OFL）：
   Inter=拉丁，Noto Sans SC=中文，JetBrains Mono=等宽。
   Noto 的 CSS 按 unicode-range 切成 101 片，浏览器只下用得到的那几片。 */
const FONT_CDN = "https://cdn.jsdelivr.net/npm/@fontsource";
const FONT_LINKS = [
  `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>`,
  `<link rel="stylesheet" href="${FONT_CDN}/inter@5/400.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/inter@5/700.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/noto-sans-sc@5/400.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/noto-sans-sc@5/700.css">`,
  `<link rel="stylesheet" href="${FONT_CDN}/jetbrains-mono@5/400.css">`
].join("\n");

function head({ title, desc, url, jsonld }) {
  return `<!doctype html><html lang="zh-CN" data-theme="dark"${BASE ? ` data-base="${BASE}"` : ""}><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
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
  return `<div class="bg-dots" aria-hidden="true"></div>
<div class="bg-field" aria-hidden="true"><svg class="bg-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="vbar" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="var(--accent)" stop-opacity="0"/>
<stop offset=".5" stop-color="var(--accent-glow)" stop-opacity=".85"/>
<stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient>
<linearGradient id="hbar" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="var(--accent)" stop-opacity="0"/>
<stop offset=".5" stop-color="var(--accent-glow)" stop-opacity=".5"/>
<stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1"/></filter>
</defs>
<g transform="translate(600 400)" opacity=".55">
<circle class="reactor-ring" r="300" fill="none" stroke="var(--line-2)" stroke-width="1" stroke-dasharray="2 16"/>
<circle class="reactor-ring2" r="366" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="1 26"/>
<circle r="232" fill="none" stroke="var(--line)" stroke-width="1" opacity=".6"/>
<circle r="3" fill="var(--accent)" opacity=".6"/></g>
<g filter="url(#soft)">
<rect class="bar v" style="--d:24s" x="0" y="-120" width="2" height="1040" fill="url(#vbar)"/>
<rect class="bar v2" style="--d:31s" x="0" y="-120" width="1.5" height="1040" fill="url(#vbar)"/>
<rect class="bar v" style="--d:18s;animation-delay:-9s" x="0" y="-120" width="1" height="1040" fill="url(#vbar)"/>
<rect class="hbar" style="--d:27s" x="-120" y="250" width="1340" height="1.5" fill="url(#hbar)"/>
<rect class="hbar" style="--d:35s;animation-delay:-13s" x="-120" y="558" width="1340" height="1" fill="url(#hbar)"/>
</g></svg></div>
<div class="bg-scan" aria-hidden="true"></div>`;
}

function siteHead() {
  return `<header class="site-head">
  <a class="brand persist" href="/"><span class="glyph-strip" aria-hidden="true">${
    ["w", "w", "red", "yellow", "blue", "green"].map(c => `<span class="led on l-${c}"></span>`).join("")
  }</span> REACTOR</a>
  <nav>
    <a href="/#tree">天赋树</a>
    <a href="/lesson/N00.html">从这里开始</a>
    <a href="/atlas.html">图鉴</a>
    <button class="btn theme-toggle" data-theme-toggle><span class="tt-glyph" aria-hidden="true">◑</span><span class="tt-label">自动</span></button>
  </nav>
</header>`;
}
function siteFoot() {
  return `<footer class="site-foot"><div class="wrap">
  <span>REACTOR · 当尺子开始回看你 · 一部关于反应性的现场手册</span>
  <span>self-hosted · no-react · v${tree.meta.version}</span>
</div></footer><script type="module" src="/modules/boot.js"></script></body></html>`;
}

const modScripts = new Set();   // dedupe <script> per page
function moduleSlot(mod, opts = {}) {
  const file = moduleFileFor(mod);
  const [type, name] = mod.split(":");
  const fig = opts.fig || "FIG.01";
  const cfg = opts.config ? `<script type="application/json" class="mod-config">${JSON.stringify(opts.config).replace(/</g, "\\u003c")}</script>` : "";
  const inner = file
    ? `${cfg}<noscript><div class="noscript-fallback">该交互模块需要 JavaScript。核心结论已在正文与配图中给出。</div></noscript>`
    : `<div class="noscript-fallback">模块 <code>${esc(mod)}</code> 施工中（本节内容已完整，交互稍后上线）。</div>`;
  const script = file ? `<script type="module" src="/modules/${file}.js"></script>` : "";
  return `<figure class="module reg" data-module="${esc(file || name)}" data-modname="${esc(name)}" data-modtype="${esc(type)}">
    <figcaption class="module-head"><span class="fig">${esc(fig)}</span>
      <span>${esc(opts.title || name)}</span><span class="spacer"></span>
      <span class="mono">${esc(type.toUpperCase())}</span></figcaption>
    <div class="module-body">${inner}</div>
  </figure>${script}`;
}

/* ---- render one lesson ---- */
function renderBlocks(blocks) {
  let figN = 0;
  return blocks.map(b => {
    switch (b.t) {
      case "prose": return `<div class="read">${b.html}</div>`;
      case "h": return `<h2>${esc(b.text)}</h2>`;
      case "callout": {
        const tag = { myth: "// 讹传更正", intuit: "// 直觉", applied: "// 落地到 AI EVAL" }[b.variant] || "// 注";
        return `<aside class="callout ${b.variant}"><span class="co-tag">${esc(b.tag || tag)}</span>${b.html}</aside>`;
      }
      case "module": { figN++; return moduleSlot(b.module, { fig: "FIG." + String(figN).padStart(2, "0"), title: b.title, config: b.config }); }
      case "sources": return `<details class="sources"><summary class="label">来源 / 延伸阅读</summary><div class="read"><ul>${b.items.map(i => `<li>${i}</li>`).join("")}</ul></div></details>`;
      default: return "";
    }
  }).join("\n");
}

function prereqRow(node) {
  const pre = node.prereqs.map(id => byId[id]).filter(Boolean);
  const unlocks = tree.nodes.filter(n => n.prereqs.includes(node.id));
  const link = n => builtIds.has(n.id) ? `<a href="/lesson/${n.id}.html">${esc(n.id)} ${esc(n.zh)}</a>` : `<span class="stub">${esc(n.id)} ${esc(n.zh)}</span>`;
  return `<div class="prereq-row">
    <span class="label">前置</span> ${pre.length ? pre.map(link).join(" ") : "<span class='stub'>无 · 起点</span>"}
    <span class="label" style="margin-left:auto">解锁</span> ${unlocks.length ? unlocks.map(link).join(" ") : "<span class='stub'>——</span>"}
  </div>`;
}

function lessonPage(node, lesson) {
  const url = `${SITE}/lesson/${node.id}.html`;
  const jsonld = {
    "@context": "https://schema.org", "@type": "LearningResource",
    name: `${node.zh} · ${node.en}`, description: node.hook,
    inLanguage: "zh-CN", isPartOf: { "@type": "Course", name: "REACTOR" },
    educationalLevel: "advanced", url
  };
  return head({ title: `${node.id} ${node.zh} · reactor-study`, desc: node.hook, url, jsonld })
    + siteHead()
    + `<main class="wrap" data-branch="${node.branch}">
    <div class="hero">
      <div class="nameplate"><span class="tag">${esc(node.id)}</span>
        <span>${esc(node.en)}</span><span class="rule"></span>
        <span class="rev">${esc(BRANCH_LABEL[node.branch])} · REV.1</span></div>
      <p class="bootline typing" style="margin:16px 0">SELF-TEST OK · REACTOR v${tree.meta.version} · LOADING [ ${esc(node.id)} ]…<span class="cursor"></span></p>
      <h1>${esc(node.zh)}</h1>
      <p class="lede">${esc(node.hook)}</p>
      ${prereqRow(node)}
    </div>
    <article class="stack">${renderBlocks(lesson.blocks)}</article>
    <nav class="prereq-row" style="margin-top:48px">
      <a class="btn" href="/#tree">← 返回天赋树</a>
      ${nextNode(node) ? `<a class="btn btn-primary" href="/lesson/${nextNode(node).id}.html">下一个推荐 · ${esc(nextNode(node).zh)} →</a>` : ""}
    </nav>
  </main>` + siteFoot();
}
function nextNode(node) {
  const unlocks = tree.nodes.filter(n => n.prereqs.includes(node.id) && builtIds.has(n.id));
  return unlocks[0] || null;
}

/* ---- homepage ---- */
function homePage() {
  const url = SITE + "/";
  const jsonld = {
    "@context": "https://schema.org", "@type": "Course",
    name: "REACTOR — 当尺子开始回看你",
    description: "一部关于排名、评测与反身性的现场手册：从 Espeland-Sauder 反应性、Goodhart 定律家族，到 AI 评测的代理博弈与抗博弈设计。",
    inLanguage: "zh-CN", provider: { "@type": "Organization", name: "REACTOR" }
  };
  const treeData = JSON.stringify({
    nodes: tree.nodes.map(n => ({ id: n.id, zh: n.zh, en: n.en, branch: n.branch, x: n.x, y: n.y, prereqs: n.prereqs, hook: n.hook, built: builtIds.has(n.id) })),
    bounds, branchLabel: BRANCH_LABEL
  });
  const CARD_META = {
    red: { key: "red", label: "RED", branch: "red", title: "社会学谱系", desc: "排名如何重新制造社会：反应性、可通约化、规训、可读性、表演性。" },
    yellow: { key: "yellow", label: "YELLOW", branch: "yellow", title: "机器与前沿", desc: "AI/ML 的代理博弈：过拟合、奖励破解、排行榜幻觉、评估觉察。" },
    blue: { key: "blue", label: "BLUE", branch: "blue", title: "定律与形式", desc: "指标失效的定律与定理：Goodhart、Campbell、必要多样性、多任务代理。" },
    green: { key: "green", label: "GREEN", branch: "converge", title: "汇流综合", desc: "三支在此交汇：概念地图、七个杠杆、反 Goodhart 设计、你的 eval 事后剖析。" }
  };
  const branchCards = ["red", "yellow", "blue", "green"].map(k => {
    const m = CARD_META[k];
    const first = tree.nodes.find(n => n.branch === m.branch && builtIds.has(n.id))
      || tree.nodes.find(n => n.branch === m.branch);
    const count = tree.nodes.filter(n => n.branch === m.branch).length;
    return `<a class="card" data-branch="${k}" href="/lesson/${first.id}.html">
      <span class="num">${m.label} · ${count} 节点</span>
      <h3>${m.title}</h3>
      <p>${m.desc}</p>
    </a>`;
  }).join("");

  return head({ title: "reactor-study · 当尺子开始回看你", desc: jsonld.description, url, jsonld })
    + siteHead()
    + `<main>
    <section class="wrap hero" data-branch="root">
      <div class="nameplate"><span class="tag">v${tree.meta.version}</span><span>FIELD MANUAL</span>
        <span class="rule"></span><span class="rev">REACTIVITY · MEASUREMENT · FEEDBACK</span></div>
      <p class="bootline typing" style="margin:18px 0">BOOTING REACTOR… ${tree.nodes.length} NODES · 3 BRANCHES · SELF-TEST OK<span class="cursor"></span></p>
      <h1>当尺子开始<br>回看你</h1>
      <p class="lede">测量一个社会对象，就是干预它。这部手册把「排名 / 评测 / 反身性」这件事，从
      社会学、经济学到 AI 前沿，铺成一棵可以自由探索的天赋树。它不是 1 到 100 的线性课程，
      而是一张跟着知识脉络生长的结构图。</p>
      <div class="prereq-row" style="margin-top:24px">
        <a class="btn btn-primary" href="/lesson/N00.html">通电 · 从根节点开始 →</a>
        <a class="btn" href="#tree">俯瞰天赋树</a>
      </div>
    </section>

    <section class="wrap section" id="tree" data-branch="root">
      <div class="nameplate"><span class="tag">MAP</span><span>THE TALENT TREE</span><span class="rule"></span>
        <span class="rev">拖动平移 · 滚轮缩放 · 点击进入</span></div>
      <h2 style="margin-top:16px">天赋树</h2>
      <div class="tree-viewport" id="tree-viewport" data-tree='${treeData.replace(/'/g, "&#39;")}'>
        <div class="tree-legend">
          <div class="k"><span class="sw" style="background:var(--red)"></span>红 · 社会学谱系</div>
          <div class="k"><span class="sw" style="background:var(--yellow)"></span>黄 · 机器与前沿</div>
          <div class="k"><span class="sw" style="background:var(--blue)"></span>蓝 · 定律与形式</div>
          <div class="k"><span class="sw" style="background:var(--green)"></span>绿 · 汇流综合</div>
          <div class="k"><span class="sw" style="background:linear-gradient(90deg,var(--red),var(--yellow))"></span>合金 · 跨分支</div>
        </div>
        <div class="tree-hud">
          <button data-tree-zout>−</button><button data-tree-zin>+</button>
          <button data-tree-fit>适配</button><button data-tree-reset-progress>重置进度</button>
        </div>
        <div class="tree-hint">拖动平移 · 按住 ⌘/Ctrl 滚轮缩放 · 点亮的是推荐的下一步，未点亮的也能直接进</div>
        <noscript><div class="noscript-fallback">天赋树需要 JavaScript。你可以直接从
          <a href="/lesson/N00.html">根节点</a>顺序阅读，或用上方导航进入各分支。</div></noscript>
      </div>
    </section>

    <section class="wrap section" data-branch="root">
      <div class="nameplate"><span class="tag">03</span><span>THREE BRANCHES</span><span class="rule"></span></div>
      <h2 style="margin-top:16px">三条谱系</h2>
      <div class="cards" style="margin-top:24px">${branchCards}</div>
    </section>
  </main>` + siteFoot();
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
  ["Good regulator theorem 好调节器定理", "好的调节器必是被调节系统的（同态）模型；scalar eval = 没有模型的调节（Conant & Ashby 1970）。"]
];
const MYTHS = [
  ["“When a measure becomes a target…”", "不是 Goodhart 说的。是 Strathern (1997, p.308) 措辞、Hoskin (1996) 命名。", "B01 / R09"],
  ["德里眼镜蛇故事", "无一手史料，疑为都市传说。有档案的是河内老鼠悬赏 (1902, Michael Vann)。", "B04"],
  ["McNamara 四步引文", "实为 Yankelovich 1971 演讲；Handy 1994 误归给 McNamara。", "B05"],
  ["霍桑效应（强版本）", "原始照明数据经 Levitt & List (2011) 重分析判为 'entirely fictional'。", "R11"],
  ["Ashby “absorb variety”", "原文是 'only variety can destroy variety'；absorb 是 Beer 的改写。", "B11"],
  ["“不能度量就不能管理”≈Deming", "反了。Deming 视其为要破除的谬误；'最重要数字不可知'是他转引 Nelson。", "C05"],
  ["“Grafen 证明了障碍原则”", "该流行叙事被 Penn & Számadó (2020) 论证为对模型的误读。", "C04"],
  ["NUS 归于 Alex Turner", "更准的溯源是 Yudkowsky / Arbital（约 2015）。", "Y05"],
  ["Pygmalion 效应是铁证", "效应主要限一二年级、复制不稳定，被 Thorndike 1968 批评。", "R02"],
  ["苏联钉子厂", "寓言级证据，无一手史料；机制真实但别当史实引用。", "C06"],
  ["家族起点是 Campbell / Goodhart", "需前推：Ridgway 1956 (ASQ) 是最早的成文系统综述，早 19 年。", "B01"],
  ["Goodhart 与 Lucas 独立发现", "需收紧：Chrystal & Mizen (2003) 裁定「若两者等价，Lucas 几乎肯定先说」。", "B01 / B03"],
  ["Campbell 1976 与 1979 是两说", "同一文本：油印本 (1976) ＝ 期刊版 (1979)，措辞一致。", "B02"],
  ["E&S 2007 提出「四机制」", "2007 原文只有 2 机制 + 3 效果；narrative 出自 Espeland 2015，reverse engineering 与 emotional attachments 出自 Espeland 2016 (HSR)。", "R01"],
  ["MusicLab 证明成功纯随机", "误读：2008 反转实验恰证质量设定边界，最好的歌能从人为打压中恢复。", "R10"],
  ["霍桑效应作为统一效应成立", "连概念本身都被判不成立；McCambridge (2014) 主张弃名，改用 research participation effects。", "R11"],
  ["污染 = 分数线性虚高", "路径依赖：同一次泄漏既可致命，也可被后续训练洗掉（Schaeffer 2026 的污染悖论）。", "Y03"],
  ["反复刷同一榜必然严重过拟合", "经验裁决温和得多：Kaggle 百场「little evidence of substantial overfitting」，机制是模型相似性。", "Y02"],
  ["winner's curse 出自 Thaler", "概念源自 Capen, Clapp & Campbell (1971) 三位石油工程师；Thaler 1988 是通俗化者。", "B13"],
  ["好调节器定理证明需要世界模型", "「model」只是同态映射；且因果方向常被讲反，原证明有技术空隙（Scholten 2010）。", "B11"],
  ["POSIWID 是后人讹传", "这次不是讹传：短语确为 Beer 所述，仅缩写为后人定型。", "C05"],
  ["cost differential 是诚实信号的终点", "已被 2023/2026 的 trade-offs 超越：成本可为零，关键是质量依赖的净收益差。", "C04"],
  ["昂贵信号是诚实的必要条件", "错：昂贵只在利益冲突时才需要，且需要量正比于冲突（cheap talk 传统）。", "C04"],
  ["操演性 = 经济学总能自证", "抹掉了 MacKenzie 四分类学，尤其方向相反的 counterperformativity。", "R07"],
  ["「榜首回落」证明反应性", "向均值回归足以单独解释；须先扣除回归再归因 Goodhart。", "B13"]
];

function atlasPage() {
  const url = SITE + "/atlas.html";
  const branchOrder = ["root", "red", "yellow", "blue", "converge"];
  const groups = branchOrder.map(b => {
    const ns = tree.nodes.filter(n => n.branch === b).sort((a, c) => a.id.localeCompare(c.id));
    if (!ns.length) return "";
    return `<div class="atlas-group" data-branch="${b === "converge" ? "green" : b}">
      <div class="nameplate" style="margin:28px 0 12px"><span class="tag">${esc(BRANCH_LABEL[b].toUpperCase?.() || BRANCH_LABEL[b])}</span><span class="rule"></span><span class="rev">${ns.length} 节点</span></div>
      <div class="cards">${ns.map(n => `<a class="card" data-branch="${b === "converge" ? "green" : b}" href="/lesson/${n.id}.html">
        <span class="num">${esc(n.id)}</span><h3>${esc(n.zh)}</h3><p>${esc(n.hook)}</p></a>`).join("")}</div></div>`;
  }).join("");
  const glossary = GLOSSARY.map(([t, d]) => `<div class="gl"><dt>${esc(t)}</dt><dd>${esc(d)}</dd></div>`).join("");
  // "见 B01 / R09" 以前是纯文本：叫人去看，却不给路。拆成节点链接。
  const refLinks = ref => esc(ref).split(" / ").map(id => {
    const n = byId[id.trim()];
    return n && builtIds.has(n.id) ? `<a href="/lesson/${n.id}.html">${n.id}</a>` : id;
  }).join(" / ");
  const myths = MYTHS.map(([m, c, ref]) => `<tr><td>${m}</td><td>${c}</td><td class="mono">${refLinks(ref)}</td></tr>`).join("");
  return head({ title: "图鉴 / Atlas · reactor-study", desc: "REACTOR 全节点索引、术语表与讹传更正速查。", url })
    + siteHead() + `<main class="wrap section" data-branch="root">
    <div class="nameplate"><span class="tag">ATLAS</span><span>INDEX · GLOSSARY · CORRECTIONS</span><span class="rule"></span></div>
    <h1 style="margin:16px 0">图鉴</h1>
    <p class="lede">全部 ${tree.nodes.length} 个节点、核心术语表，以及一张"讹传更正"速查。这门课花了大力气考证每一处流行说法的真正出处。底层研究见项目 <code>research/01–14</code>。</p>
    ${groups}
    <div class="nameplate reg" style="margin:40px 0 16px"><span class="tag">GLOSSARY</span><span>术语表</span><span class="rule"></span></div>
    <dl class="glossary">${glossary}</dl>
    <div class="nameplate reg" style="margin:40px 0 16px"><span class="tag">CORRECTIONS</span><span>讹传更正速查</span><span class="rule"></span></div>
    <p class="read" style="color:var(--text-2);font-size:.92rem">这门课的一个隐藏主题：流行的说法往往不是原文。以下每一条都在正文里有完整考证。</p>
    <div class="scroll-x"><table class="atlas-table myths"><tr><th>流行说法</th><th>更正</th><th>见</th></tr>${myths}</table></div>
  </main>` + siteFoot();
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

await writeFile(path.join(DIST, "index.html"), homePage());
await writeFile(path.join(DIST, "atlas.html"), atlasPage());
const urls = [SITE + "/", SITE + "/atlas.html"];
for (const [id, lesson] of Object.entries(lessons)) {
  await writeFile(path.join(DIST, "lesson", id + ".html"), lessonPage(byId[id], lesson));
  urls.push(`${SITE}/lesson/${id}.html`);
}
await writeFile(path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
// robots.txt 只在域名根目录有效；挂在子路径下时不生成，免得给人"这里能配爬虫"的错觉
if (!BASE) await writeFile(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

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
