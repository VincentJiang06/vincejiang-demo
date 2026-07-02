#!/usr/bin/env node
// build-site.mjs —— vincejiang.com 静态站生成器(容器构建阶段跑,不碰 git)。
//   node build-site.mjs --out <dir>   # 全量构建到 <dir>
//   node build-site.mjs --check       # 只校验不产出(CI check job / 本地预检)
//
// 职责(SPEC/runbook §3.3):
//   1) 原样拷贝静态内容目录(demo 等),剔除基础设施/元文件;
//   2) 按 manifest 渲染已发布文章 → /blog/<slug>/index.html(+ 同时落 /blog/<slug>/index.md 机读副本);
//   3) 生成 /blog/ 索引、/blog/feed.xml(RSS);
//   4) 生成全站 sitemap.xml(lastmod 用真实 git 日期,来自 manifest);
//   5) 生成 llms.txt;6) 首页注入最新 N 篇;7) 生成 /gallery/。
// 发布判定 = manifest(git 历史含「发布」)∧ 非 draft;日期优先 frontmatter,否则用 manifest 的 git 日期。
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, cpSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const TPL = join(ROOT, 'templates');
const POSTS = join(ROOT, 'posts');

// ---- 参数 ----
const args = process.argv.slice(2);
const CHECK = args.includes('--check');
const outIdx = args.indexOf('--out');
const OUT = outIdx >= 0 ? args[outIdx + 1] : join(ROOT, 'site');
const LATEST_N = 5;

// ---- 站点常量 ----
const SITE = {
  name: 'Vince Jiang', url: 'https://vincejiang.com', lang: 'zh-CN',
  tagline: '小蒋的个人站 —— 博客杂谈、作品集,以及六个香港高校「非官方」野史站的入口。',
  author: 'Vince Jiang', github: 'https://github.com/VincentJiang06',
  image: 'https://vincejiang.com/favicon.png',
};
const NAV_ITEMS = [
  { key: 'home', label: '首页', href: '/' },
  { key: 'blog', label: 'Blog', href: '/blog/' },
  { key: 'gallery', label: 'Gallery', href: '/gallery/' },
];

// ---- 载入模板/配置/manifest ----
const BASE = readFileSync(join(TPL, 'base.html'), 'utf8');
const CSS = readFileSync(join(TPL, 'site.css'), 'utf8');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
let MANIFEST = null;
const manifestPath = join(ROOT, 'posts-manifest.json');
if (existsSync(manifestPath)) MANIFEST = JSON.parse(readFileSync(manifestPath, 'utf8'));

const warnings = [], errors = [];
const warn = m => warnings.push(m);
const err = m => errors.push(m);

// ---- markdown ----
const md = new MarkdownIt({
  html: true, linkify: true, breaks: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try { return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegal: true }).value + '</code></pre>'; } catch {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  },
});
md.use(anchor, { level: [2, 3], permalink: anchor.permalink.linkInsideHeader({ symbol: '#', class: 'anchor', placement: 'after' }) });

// ---- 工具 ----
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, map) => { let o = tpl; for (const [k, v] of Object.entries(map)) o = o.split('{{' + k + '}}').join(v); return o; };
const dOnly = iso => (iso ? String(iso).slice(0, 10) : '');
// YAML 会把无引号的 date: 2026-07-03 解析成 Date 对象;统一规整成 'YYYY-MM-DD' 字符串
const fmDate = v => (v == null ? null : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
const rfc822 = iso => new Date(iso || Date.now()).toUTCString();
const today = () => new Date().toISOString().slice(0, 10);
function plain(mdText) {
  return mdText.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*`_~-]/g, '').replace(/\s+/g, ' ').trim();
}

// ---- <head> 生成(每页 MUST:title/canonical/desc/OG/twitter/robots/theme + JSON-LD)----
function headHtml({ type = 'website', path = '/', title, desc, image = SITE.image, jsonld = [] }) {
  const url = SITE.url + path;
  const ld = jsonld.length ? `<script type="application/ld+json">${JSON.stringify(jsonld.length === 1 ? jsonld[0] : jsonld)}</script>` : '';
  return [
    `<meta name="description" content="${esc(desc)}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta name="theme-color" content="#5b5bd6">`,
    `<meta name="author" content="${esc(SITE.author)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="${type}">`,
    `<meta property="og:site_name" content="vincejiang.com">`,
    `<meta property="og:locale" content="zh_CN">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${image}">`,
    ld,
  ].join('\n');
}
function navHtml(active) {
  const items = NAV_ITEMS.map(i => `<a class="item${i.key === active ? ' active' : ''}" href="${i.href}">${i.label}</a>`).join('\n');
  return `<nav class="nav"><div class="in"><a class="brand" href="/">Vince Jiang</a>${items}<button class="toggle" id="theme-toggle" title="切换明暗">🌙</button></div></nav>`;
}
function footHtml() {
  const y = new Date().getFullYear();
  return `<footer class="foot"><span>© ${y} Vince Jiang</span><a href="${SITE.github}" rel="me">GitHub</a><a href="/blog/feed.xml">RSS</a><span class="sp">Served from a home server via Cloudflare Tunnel.</span></footer>`;
}
function pageHtml({ lang = SITE.lang, active = '', head, main }) {
  return fill(BASE, { LANG: lang, TITLE: head.titleFull, HEAD: head.html, CSS, NAV: navHtml(active), MAIN: main, FOOTER: footHtml() });
}
const personLd = { '@type': 'Person', name: SITE.author, url: SITE.url + '/', sameAs: [SITE.github] };

// ---- 读取文章 ----
function findMd(dir) {
  let out = [];
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(findMd(p));
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
function loadPosts() {
  const posts = [];
  const seen = new Map();
  for (const abs of findMd(POSTS)) {
    const rel = abs.slice(ROOT.length + 1);           // posts/xxx.md 或 posts/xxx/index.md
    const isDir = basename(abs) === 'index.md';
    const slug = isDir ? basename(dirname(abs)) : basename(abs, '.md');
    let fm, body;
    try { const g = matter(readFileSync(abs, 'utf8')); fm = g.data; body = g.content; }
    catch (e) { err(`frontmatter 解析失败: ${rel} — ${e.message}`); continue; }
    if (!fm.title) warn(`缺 title: ${rel}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) warn(`slug 非 kebab-case: ${slug}`);
    if (seen.has(slug)) { err(`slug 重复: ${slug}(${rel} 与 ${seen.get(slug)})`); continue; }
    seen.set(slug, rel);

    const m = MANIFEST?.posts?.[rel];
    const gitPublished = MANIFEST ? !!m?.published : true;   // 无 manifest(本地):非 draft 即视为已发布
    const published = gitPublished && fm.draft !== true;
    const date = fmDate(fm.date) || (m?.firstPublish ? dOnly(m.firstPublish) : today());
    const updated = fmDate(fm.updated) || (m?.lastPublish ? dOnly(m.lastPublish) : date);
    const description = fm.description || plain(body).slice(0, 120);
    posts.push({ slug, rel, abs, isDir, srcDir: isDir ? dirname(abs) : null,
      title: fm.title || slug, description, tags: fm.tags || [], lang: fm.lang || SITE.lang,
      date, updated, cover: fm.cover || null, draft: fm.draft === true, published, body });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

// ---- 渲染单篇 ----
function renderPost(p) {
  const path = `/blog/${p.slug}/`;
  const bodyHtml = md.render(p.body);
  const breadcrumb = {
    '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE.url + '/blog/' },
      { '@type': 'ListItem', position: 3, name: p.title, item: SITE.url + path },
    ],
  };
  const blogPosting = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.description,
    datePublished: p.date, dateModified: p.updated, inLanguage: p.lang,
    mainEntityOfPage: SITE.url + path, author: personLd, publisher: personLd,
    ...(p.cover ? { image: SITE.url + path + p.cover.replace(/^\.?\//, '') } : {}),
  };
  const head = {
    titleFull: `${p.title} · ${SITE.name}`,
    html: headHtml({ type: 'article', path, title: p.title, desc: p.description, jsonld: [blogPosting, { '@context': 'https://schema.org', ...breadcrumb }] }),
  };
  const tags = p.tags.length ? `<span>${p.tags.map(t => `<a class="tag" href="/blog/#tag-${esc(t)}">${esc(t)}</a>`).join('')}</span>` : '';
  const upd = p.updated !== p.date ? ` · 更新 ${p.updated}` : '';
  const main = `<main class="wrap"><article class="article">
<div class="head"><h1>${esc(p.title)}</h1><div class="meta"><time datetime="${p.date}">${p.date}</time>${upd}${tags}</div></div>
<div class="prose">${bodyHtml}</div>
<a class="backlink" href="/blog/">← 返回 Blog</a>
</article></main>`;
  return pageHtml({ lang: p.lang, active: 'blog', head, main });
}

// ---- 页面:blog 索引 / 首页 / gallery ----
function renderBlogIndex(posts) {
  const items = posts.map(p => `<li><a href="/blog/${p.slug}/"><div class="t">${esc(p.title)}</div><div class="d">${esc(p.description)}</div><div class="meta"><time datetime="${p.date}">${p.date}</time>${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div></a></li>`).join('\n');
  const desc = `Vince Jiang 的博客 —— 共 ${posts.length} 篇杂谈与技术笔记。`;
  const head = { titleFull: `Blog · ${SITE.name}`, html: headHtml({ path: '/blog/', title: 'Blog', desc, jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `${SITE.name} 的 Blog`, url: SITE.url + '/blog/', author: personLd }] }) };
  const main = `<main class="wrap narrow"><div class="hero"><h1>Blog</h1><p>杂谈、技术笔记、随手记的实验。共 ${posts.length} 篇。</p></div>
<ul class="postlist">${items || '<p class="note">还没有已发布的文章。</p>'}</ul></main>`;
  return pageHtml({ active: 'blog', head, main });
}
function tileCard(href, title, desc, extra = '') {
  const external = /^https?:/.test(href);
  const host = external ? `<span class="host">${esc(href.replace(/^https?:\/\//, '').replace(/\/$/, ''))} ↗</span>` : '';
  const attr = external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="tile card" href="${href}"${attr}><div class="t">${esc(title)}</div><div class="d">${esc(desc)}</div>${extra}${host}</a>`;
}
function renderHome(posts) {
  const latest = posts.slice(0, LATEST_N);
  const wild = (CONFIG.wildSites || []).map(w => tileCard(w.url, w.name, w.desc)).join('\n');
  const gallery = (CONFIG.gallery || []).map(g => tileCard(g.href, g.title, g.desc)).join('\n');
  const blog = latest.map(p => `<a class="tile card" href="/blog/${p.slug}/"><div class="t">${esc(p.title)}</div><div class="d">${esc(p.description)}</div><div class="meta">${p.date}</div></a>`).join('\n');
  const head = {
    titleFull: `${SITE.name} · 个人站`,
    html: headHtml({ path: '/', title: SITE.name, desc: SITE.tagline, jsonld: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + '/', inLanguage: SITE.lang, author: personLd },
      { '@context': 'https://schema.org', ...personLd },
    ] }),
  };
  const main = `<main class="wrap">
<div class="hero"><h1>Vince Jiang</h1><p>${esc(SITE.tagline)}</p></div>

<div class="sec"><h2>📝 Blog</h2><a class="more" href="/blog/">全部文章 →</a></div>
<div class="grid c2">${blog || '<p class="note">敬请期待。</p>'}</div>

<div class="sec"><h2>🎨 Gallery</h2><a class="more" href="/gallery/">全部作品 →</a></div>
<div class="grid c3">${gallery}</div>

<div class="sec"><h2>🏫 香港高校「非官方」野史 · 集群</h2><span class="note">六站互链,各守一校</span></div>
<div class="grid c3">${wild}</div>
</main>`;
  return pageHtml({ active: 'home', head, main });
}
function renderGallery() {
  const cards = (CONFIG.gallery || []).map(g => tileCard(g.href, g.title, g.desc, g.badge ? `<div class="meta"><span class="badge">${esc(g.badge)}</span></div>` : '')).join('\n');
  const list = (CONFIG.gallery || []).map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.title, url: /^https?:/.test(g.href) ? g.href : SITE.url + g.href }));
  const head = {
    titleFull: `Gallery · ${SITE.name}`,
    html: headHtml({ path: '/gallery/', title: 'Gallery', desc: '作品集 —— AI 服务状态聚合、HiFi 声学笔记、Mac 选购等交互式 demo 与实验。', jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${SITE.name} · Gallery`, url: SITE.url + '/gallery/', author: personLd, mainEntity: { '@type': 'ItemList', itemListElement: list } },
    ] }),
  };
  const main = `<main class="wrap"><div class="hero"><h1>Gallery</h1><p>做过的交互式 demo 与实验。原地址不变,这里只是索引。</p></div>
<div class="grid c2">${cards}</div></main>`;
  return pageHtml({ active: 'gallery', head, main });
}

// ---- sitemap / rss / llms ----
function buildSitemap(posts) {
  const newest = posts[0]?.updated || today();
  const cfgDate = dOnly(MANIFEST?.paths?.['site.config.json']) || today();
  const urls = [
    { loc: '/', lastmod: newest, cf: 'weekly', pri: '1.0' },
    { loc: '/blog/', lastmod: newest, cf: 'weekly', pri: '0.8' },
    { loc: '/gallery/', lastmod: cfgDate, cf: 'monthly', pri: '0.7' },
  ];
  for (const p of posts) urls.push({ loc: `/blog/${p.slug}/`, lastmod: p.updated, cf: 'monthly', pri: '0.6' });
  for (const g of (CONFIG.gallery || [])) {
    if (/^https?:/.test(g.href)) continue;               // 只收本站内部作品
    const key = g.href.replace(/^\/|\/$/g, '');
    const lm = dOnly(MANIFEST?.paths?.[key]) || newest;
    urls.push({ loc: g.href, lastmod: lm, cf: 'monthly', pri: '0.6' });
  }
  const body = urls.map(u => `  <url><loc>${SITE.url}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.cf}</changefreq><priority>${u.pri}</priority></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
function buildRss(posts) {
  const items = posts.slice(0, 20).map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE.url}/blog/${p.slug}/</link>
      <guid isPermaLink="true">${SITE.url}/blog/${p.slug}/</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>${esc(SITE.name)} · Blog</title>
    <link>${SITE.url}/blog/</link>
    <description>${esc(SITE.tagline)}</description>
    <language>zh-cn</language>
    <lastBuildDate>${rfc822(posts[0]?.date)}</lastBuildDate>
${items}
</channel></rss>\n`;
}
function buildLlms(posts) {
  const recent = posts.slice(0, 10).map(p => `- [${p.title}](${SITE.url}/blog/${p.slug}/) — ${p.description}`).join('\n');
  const works = (CONFIG.gallery || []).map(g => `- [${g.title}](${/^https?:/.test(g.href) ? g.href : SITE.url + g.href}) — ${g.desc}`).join('\n');
  return `# ${SITE.name} — vincejiang.com

> ${SITE.tagline}

作者 Vince Jiang(小蒋),GitHub: ${SITE.github}。全站中文,geo-open。

## Blog(/blog/)
博客文章的机读 markdown 副本在每篇的 \`/blog/<slug>/index.md\`。最新:
${recent || '(暂无)'}

## Gallery(/gallery/)
${works}

## 开放接口
- ${SITE.url}/status-ai/api — 只读 JSON,聚合 OpenAI/Anthropic 官方状态 + 中文解说(schema: vincejiang.status/1,开放 CORS)。

## Sitemap
- ${SITE.url}/sitemap.xml
`;
}

// ---- 拷贝静态内容 ----
const COPY_EXCLUDE = new Set(['.git', '.github', '.gitignore', '.dockerignore', 'Dockerfile', 'docker', 'tools', 'templates',
  'posts', 'posts-manifest.json', 'site.config.json', 'SPEC.md', 'README.md', 'LICENSE', 'node_modules', 'site', '.DS_Store',
  'index.html', 'sitemap.xml', 'llms.txt', 'blog', 'gallery']);
function contentDirs() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter(e => !COPY_EXCLUDE.has(e.name))
    .map(e => ({ name: e.name, dir: e.isDirectory() }));
}

// ---- CHECK 模式 ----
function runCheck(posts) {
  // 每个对外发布的顶层目录必须有 index.html
  for (const c of contentDirs()) {
    if (c.dir && !existsSync(join(ROOT, c.name, 'index.html'))) err(`内容目录缺 index.html: ${c.name}/`);
  }
  const pub = posts.filter(p => p.published);
  console.error(`check: ${posts.length} 篇 md(${pub.length} 已发布),内容目录 ${contentDirs().filter(c => c.dir).length} 个`);
  if (!MANIFEST) warn('无 posts-manifest.json(本地模式:所有非 draft 视为已发布)');
  for (const w of warnings) console.error('  ⚠ ' + w);
  if (errors.length) { for (const e of errors) console.error('  ✗ ' + e); console.error(`check 失败:${errors.length} 处硬伤`); process.exit(1); }
  console.error('check 通过 ✓');
}

// ---- BUILD 模式 ----
function copyDir(src, dst) { cpSync(src, dst, { recursive: true }); }
function runBuild(posts) {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  // 1) 拷贝静态内容
  for (const c of contentDirs()) copyDir(join(ROOT, c.name), join(OUT, c.name));
  // 2) 文章
  const pub = posts.filter(p => p.published);
  for (const p of pub) {
    const dir = join(OUT, 'blog', p.slug);
    mkdirSync(dir, { recursive: true });
    if (p.isDir) copyDir(p.srcDir, dir);                 // 带图文章:整目录(含 index.md)拷过去
    else writeFileSync(join(dir, 'index.md'), readFileSync(p.abs));  // 单文件:落 md 副本
    writeFileSync(join(dir, 'index.html'), renderPost(p));           // 渲染后的 html(覆盖同名)
  }
  // 3-7) 索引 / 首页 / gallery / sitemap / rss / llms
  mkdirSync(join(OUT, 'blog'), { recursive: true });
  writeFileSync(join(OUT, 'blog', 'index.html'), renderBlogIndex(pub));
  writeFileSync(join(OUT, 'blog', 'feed.xml'), buildRss(pub));
  writeFileSync(join(OUT, 'index.html'), renderHome(pub));
  mkdirSync(join(OUT, 'gallery'), { recursive: true });
  writeFileSync(join(OUT, 'gallery', 'index.html'), renderGallery());
  writeFileSync(join(OUT, 'sitemap.xml'), buildSitemap(pub));
  writeFileSync(join(OUT, 'llms.txt'), buildLlms(pub));

  for (const w of warnings) console.error('  ⚠ ' + w);
  if (errors.length) { for (const e of errors) console.error('  ✗ ' + e); console.error(`build 失败:${errors.length} 处硬伤`); process.exit(1); }
  console.error(`build ✓ → ${OUT}(${pub.length} 篇已发布 / 共 ${posts.length};内容目录 ${contentDirs().filter(c => c.dir).length} 个)`);
}

// ---- main ----
const posts = loadPosts();
if (CHECK) runCheck(posts); else runBuild(posts);
