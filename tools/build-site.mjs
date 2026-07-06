#!/usr/bin/env node
// build-site.mjs —— vincejiang.com 静态站生成器(容器构建阶段跑,不碰 git)。
//   node build-site.mjs --out <dir>   # 全量构建到 <dir>
//   node build-site.mjs --check       # 只校验不产出(CI check job / 本地预检)
//
// 职责(SPEC/runbook §3.3):
//   1) 原样拷贝静态内容目录(demo 等),剔除基础设施/元文件;
//   2) 按 manifest 渲染已发布文章 → /blog/<slug>/ 或 /research/<collection>/<slug>/(+ 机读 index.md);
//      collection 分组(posts/<group>/<slug>.md)走 /research/<group>/<slug>/;中英双语走 <slug>.en.md 兄弟文件,
//      配对进主文并额外产出 /en/ 子页(英文页不进任何列表,首页/索引/RSS 只收中文主页)。
//   3) 生成 /blog/ 索引、/research/ 索引、各 collection 落地页、/blog/feed.xml(RSS);
//   4) 生成全站 sitemap.xml(lastmod 用真实 git 日期,来自 manifest);
//   5) 生成 llms.txt;6) 首页注入最新 N 篇 + 友链 + Research;7) 生成 /gallery/。
// 发布判定 = manifest(git 历史含「发布」)∧ 非 draft;日期优先 frontmatter,否则用 manifest 的 git 日期。
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, cpSync, existsSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';
import { renderPaper } from './paper.mjs';

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
const RESEARCH_PATH = '/research/';
const NAV_ITEMS = [
  { key: 'home', label: '首页', href: '/' },
  { key: 'blog', label: 'Blog', href: '/blog/' },
  { key: 'research', label: 'Research', href: RESEARCH_PATH },
  { key: 'gallery', label: 'Gallery', href: '/gallery/' },
];

// ---- 载入模板/配置/manifest ----
const BASE = readFileSync(join(TPL, 'base.html'), 'utf8');
const CSS = readFileSync(join(TPL, 'site.css'), 'utf8');
const CONFIG = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8'));
const COLLECTIONS = Array.isArray(CONFIG.collections) ? CONFIG.collections : [];
const collectionOf = group => COLLECTIONS.find(c => c.key === group) || null;
const collectionPath = key => `${RESEARCH_PATH}${key}/`;
const postPath = (group, slug) => collectionOf(group) ? `${collectionPath(group)}${slug}/` : (group ? `/blog/${group}/${slug}/` : `/blog/${slug}/`);
const listOf = value => Array.isArray(value) ? value : (value == null ? [] : [value]);
const hasCollectionPosts = (posts, key) => posts.some(p => p.collectionKey === key);
const collectionPostCount = (posts, key) => posts.filter(p => p.collectionKey === key).length;
function revisionCollectionsFor(coll) {
  const keys = new Set(listOf(coll.revisedBy));
  for (const c of COLLECTIONS) {
    if (c.key === coll.key) continue;
    if (c.kind === 'revision' && listOf(c.revisionOf).includes(coll.key)) keys.add(c.key);
  }
  return [...keys].map(collectionOf).filter(Boolean);
}
function researchPairs(posts) {
  return COLLECTIONS
    .filter(c => hasCollectionPosts(posts, c.key) && c.kind !== 'revision' && listOf(c.revisionOf).length === 0)
    .map(c => ({ primary: c, revisions: revisionCollectionsFor(c).filter(r => hasCollectionPosts(posts, r.key)) }));
}
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
const maxDate = (...dates) => {
  const xs = dates.filter(Boolean).sort();
  return xs[xs.length - 1] || today();
};
// YAML 会把无引号的 date: 2026-07-03 解析成 Date 对象;统一规整成 'YYYY-MM-DD' 字符串
const fmDate = v => (v == null ? null : v instanceof Date ? v.toISOString().slice(0, 10) : String(v).slice(0, 10));
const rfc822 = iso => new Date(iso || Date.now()).toUTCString();
const today = () => new Date().toISOString().slice(0, 10);
function plain(mdText) {
  return mdText.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*`_~-]/g, '').replace(/\s+/g, ' ').trim();
}

// ---- <head> 生成(每页 MUST:title/canonical/desc/OG/twitter/robots/theme + JSON-LD)----
function headHtml({ type = 'website', path = '/', title, desc, image = SITE.image, jsonld = [], locale = 'zh_CN' }) {
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
    `<meta property="og:locale" content="${locale}">`,
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
  return `<nav class="nav"><div class="in"><a class="brand" href="/">Vince Jiang</a>${items}<button class="toggle" id="theme-toggle" title="色彩模式:按时间自动">◷</button></div></nav>`;
}
function footHtml() {
  const y = new Date().getFullYear();
  return `<footer class="foot"><span>© ${y} Vince Jiang</span><a href="${SITE.github}" rel="me">GitHub</a><a href="/blog/feed.xml">RSS</a></footer>`;
}
function pageHtml({ lang = SITE.lang, active = '', head, main }) {
  return fill(BASE, { LANG: lang, TITLE: head.titleFull, HEAD: head.html, CSS, NAV: navHtml(active), MAIN: main, FOOTER: footHtml() });
}
const personLd = { '@type': 'Person', name: SITE.author, url: SITE.url + '/', sameAs: [SITE.github] };
const backLabel = l => (l && l.startsWith('en') ? '← Back' : '← 返回');

// ---- 双语 / 系列 通用片段 ----
// 语言切换器:两端各一,当前语言加粗、另一语言给链接。英文页不进列表,故只在有 en 时出现。
function langSwitchHtml(p, isEn) {
  if (!p.en) return '';
  const zh = isEn ? `<a href="${p.path}" hreflang="${p.lang}">中文</a>` : `<b>中文</b>`;
  const en = isEn ? `<b>English</b>` : `<a href="${p.enPath}" hreflang="en">English</a>`;
  return `<span class="langsw" aria-label="language">${zh}<i>·</i>${en}</span>`;
}
function hreflangHtml(p) {
  if (!p.en) return '';
  return '\n' + [
    `<link rel="alternate" hreflang="${p.lang}" href="${SITE.url}${p.path}">`,
    `<link rel="alternate" hreflang="en" href="${SITE.url}${p.enPath}">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE.url}${p.path}">`,
  ].join('\n');
}
// 系列上/下篇(同语言);q 为相邻 post 对象
function prevNextHtml(p, isEn) {
  if (!p.prev && !p.next) return '';
  const cell = (q, dir) => {
    if (!q) return `<span class="pn-empty"></span>`;
    const href = isEn ? (q.enPath || q.path) : q.path;
    const t = isEn ? (q.paper?.title_en || q.en?.title || q.title) : q.title;
    const lbl = dir === 'prev' ? (isEn ? '← Previous' : '← 上一篇') : (isEn ? 'Next →' : '下一篇 →');
    return `<a class="pn-${dir}" href="${href}"><span class="pn-lbl">${lbl}</span><span class="pn-t">${esc(t)}</span></a>`;
  };
  return `<nav class="prevnext" aria-label="series">${cell(p.prev, 'prev')}${cell(p.next, 'next')}</nav>`;
}

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
// 从绝对路径推出 {group, slug, isDir, isEn}
//   posts/<slug>.md | posts/<slug>/index.md | posts/<group>/<slug>.md | posts/<group>/<slug>/index.md
//   翻译:同名 <slug>.en.md 或 <dir>/index.en.md
function relInfo(abs) {
  const base = basename(abs);
  const dir = dirname(abs);
  const relDir = dir === POSTS ? '' : dir.slice(POSTS.length + 1);
  const isEn = /\.en\.md$/.test(base);
  let group, slug, isDir;
  if (base === 'index.md' || base === 'index.en.md') {
    isDir = true;
    const parts = relDir ? relDir.split('/') : [];
    slug = parts.pop() || '';
    group = parts.join('/');
  } else {
    isDir = false;
    group = relDir;
    slug = base.replace(/\.en\.md$/, '').replace(/\.md$/, '');
  }
  return { group, slug, isDir, isEn };
}
function parseMd(abs) { const g = matter(readFileSync(abs, 'utf8')); return { fm: g.data, body: g.content }; }

function loadPosts() {
  const posts = [];
  const seen = new Map();
  const files = findMd(POSTS).map(abs => ({ abs, ...relInfo(abs) }));
  // 先收英文翻译,按 group/slug 归档
  const ens = new Map();
  for (const f of files) {
    if (!f.isEn) continue;
    try { const p = parseMd(f.abs); ens.set(`${f.group}/${f.slug}`, { ...f, ...p }); }
    catch (e) { err(`frontmatter 解析失败: ${f.abs.slice(ROOT.length + 1)} — ${e.message}`); }
  }
  // 再收中文主文件,配对英文
  for (const f of files) {
    if (f.isEn) continue;
    const rel = f.abs.slice(ROOT.length + 1);
    let fm, body;
    try { const p = parseMd(f.abs); fm = p.fm; body = p.body; }
    catch (e) { err(`frontmatter 解析失败: ${rel} — ${e.message}`); continue; }
    const group = fm.group != null ? String(fm.group) : f.group;   // frontmatter 可覆盖目录分组
    const slug = f.slug;
    const key = `${group}/${slug}`;
    if (!fm.title) warn(`缺 title: ${rel}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) warn(`slug 非 kebab-case: ${slug}`);
    if (group && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(group)) warn(`group 非 kebab-case: ${group}`);
    if (seen.has(key)) { err(`路径重复: ${key}(${rel} 与 ${seen.get(key)})`); continue; }
    seen.set(key, rel);

    const m = MANIFEST?.posts?.[rel];
    const gitPublished = MANIFEST ? !!m?.published : true;   // 无 manifest(本地):非 draft 即视为已发布
    const published = gitPublished && fm.draft !== true;
    const date = fmDate(fm.date) || (m?.firstPublish ? dOnly(m.firstPublish) : today());
    const updated = fmDate(fm.updated) || (m?.lastPublish ? dOnly(m.lastPublish) : date);
    const description = fm.description || (fm.paper?.abstract ? String(fm.paper.abstract).slice(0, 120) : plain(body).slice(0, 120));
    const path = postPath(group, slug);

    // 配对英文翻译(英文文件只提供 title/description/body;论文元数据一律从中文 frontmatter.paper 取,含 *_en)
    const ef = ens.get(key);
    let en = null;
    if (ef) {
      const eb = ef.body;
      en = {
        title: ef.fm.title || fm.paper?.title_en || fm.title,
        description: ef.fm.description || (fm.paper?.abstract_en ? String(fm.paper.abstract_en).slice(0, 120) : plain(eb).slice(0, 120)),
        body: eb, rel: ef.abs.slice(ROOT.length + 1), abs: ef.abs, isDir: ef.isDir, srcDir: ef.isDir ? dirname(ef.abs) : null,
      };
      ens.delete(key);
    }

    posts.push({
      group, slug, rel, abs: f.abs, isDir: f.isDir, srcDir: f.isDir ? dirname(f.abs) : null,
      path, enPath: en ? path + 'en/' : null,
      title: fm.title || slug, description, tags: fm.tags || [], lang: fm.lang || SITE.lang,
      date, updated, cover: fm.cover || null, draft: fm.draft === true, published, body,
      layout: fm.layout === 'paper' ? 'paper' : 'post', paper: fm.paper || null,
      en, collectionKey: collectionOf(group) ? group : null, card: fm.card || null,
      prev: null, next: null,
    });
  }
  for (const [k, v] of ens) warn(`翻译无主文件: ${v.abs.slice(ROOT.length + 1)}(缺 ${k} 的中文主文件)`);

  // 系列上/下篇(按 collection.order;仅已发布成员参与)
  for (const coll of COLLECTIONS) {
    const order = coll.order || [];
    const members = posts.filter(p => p.collectionKey === coll.key && p.published)
      .sort((a, b) => (order.indexOf(a.slug) - order.indexOf(b.slug)));
    members.forEach((p, i) => { p.prev = members[i - 1] || null; p.next = members[i + 1] || null; });
  }

  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

// 论文模板(layout: paper)渲染上下文;渲染逻辑在 paper.mjs,规格见 templates/PAPER-SPEC.md
const paperCtx = () => ({ SITE, headHtml, personLd, esc, warn, langSwitchHtml, hreflangHtml, prevNextHtml, backLabel, collectionOf, collectionPath });

// ---- 渲染单篇博客(post);isEn=true 时渲染英文子页 ----
function renderPost(p, isEn = false) {
  const src = isEn ? p.en : p;
  const lang = isEn ? 'en' : p.lang;
  const path = isEn ? p.enPath : p.path;
  const bodyHtml = md.render(src.body);
  const coll = p.collectionKey ? collectionOf(p.collectionKey) : null;
  const breadcrumb = {
    '@type': 'BreadcrumbList', itemListElement: coll ? [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Research', item: SITE.url + RESEARCH_PATH },
      { '@type': 'ListItem', position: 3, name: coll.title, item: SITE.url + collectionPath(coll.key) },
      { '@type': 'ListItem', position: 4, name: src.title, item: SITE.url + path },
    ] : [
      { '@type': 'ListItem', position: 1, name: '首页', item: SITE.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE.url + '/blog/' },
      { '@type': 'ListItem', position: 3, name: src.title, item: SITE.url + path },
    ],
  };
  const blogPosting = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: src.title, description: src.description,
    datePublished: p.date, dateModified: p.updated, inLanguage: lang,
    mainEntityOfPage: SITE.url + path, author: personLd, publisher: personLd,
    ...(p.cover ? { image: SITE.url + p.path + p.cover.replace(/^\.?\//, '') } : {}),
  };
  const head = {
    titleFull: `${src.title} · ${SITE.name}`,
    html: headHtml({ type: 'article', path, title: src.title, desc: src.description, locale: isEn ? 'en_US' : 'zh_CN', jsonld: [blogPosting, { '@context': 'https://schema.org', ...breadcrumb }] })
      + hreflangHtml(p),
  };
  const tags = p.tags.length ? `<span>${p.tags.map(t => `<a class="tag" href="/blog/#tag-${esc(t)}">${esc(t)}</a>`).join('')}</span>` : '';
  const upd = p.updated !== p.date ? ` · ${isEn ? 'updated' : '更新'} ${p.updated}` : '';
  const main = `<main class="wrap"><article class="article">
<div class="head"><h1>${esc(src.title)}</h1><div class="meta"><time datetime="${p.date}">${p.date}</time>${upd}${tags}${langSwitchHtml(p, isEn)}</div></div>
<div class="prose">${bodyHtml}</div>
${prevNextHtml(p, isEn)}
<a class="backlink" href="${p.collectionKey ? collectionPath(p.collectionKey) : '/blog/'}">${isEn ? '← Back' : '← 返回'}</a>
</article></main>`;
  return pageHtml({ lang, active: p.collectionKey ? 'research' : 'blog', head, main });
}

// ---- 页面:collection 落地页 / blog 索引 / 首页 / gallery ----
function renderCollection(coll, posts) {
  const order = coll.order || [];
  const members = posts.filter(p => p.collectionKey === coll.key)
    .sort((a, b) => (order.indexOf(a.slug) - order.indexOf(b.slug)));
  const path = collectionPath(coll.key);
  const isRev = coll.kind === 'revision';
  // 与 blog 索引同版式(.postlist)
  const items = members.map(p => {
    const tldr = p.card === 'tldr';
    const badge = tldr ? `<span class="tag tldr">TL;DR · 先读这篇</span>`
      : (p.layout === 'paper' ? `<span class="tag paper">论文</span>` : `<span class="tag">评述</span>`);
    return `<li class="${tldr ? 'is-tldr' : ''}"><a href="${p.path}"><div class="t">${esc(p.title)}</div><div class="d">${esc(p.description)}</div><div class="meta"><time datetime="${p.date}">${p.date}</time>${badge}</div></a></li>`;
  }).join('\n');
  const list = members.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.title, url: SITE.url + p.path }));
  const revOf = coll.revisionOf ? collectionOf(coll.revisionOf) : null;
  const revBy = coll.revisedBy ? collectionOf(coll.revisedBy) : null;
  const cross = revOf ? `<a class="crosslink rev" href="${collectionPath(revOf.key)}">← 本专辑是对《${esc(revOf.title)}》的评述与复盘</a>`
    : revBy ? `<a class="crosslink" href="${collectionPath(revBy.key)}">📝 这套论文的评述与复盘 → ${esc(revBy.title)}</a>` : '';
  const heroTag = isRev ? '<span class="rev-tag">修订 · REVISION</span>' : '<span class="paper-tag">论文正文 · RESEARCH</span>';
  // GEO:把各篇作为系列组成部分(含摘要),让 AI 从一页拿到全部摘要
  const hasPart = members.map(m => {
    const isP = m.layout === 'paper', mp = m.paper || {};
    return { '@type': isP ? 'ScholarlyArticle' : 'Article', headline: m.title, url: SITE.url + m.path,
      ...(isP && mp.abstract ? { abstract: mp.abstract } : { description: m.description }),
      ...(isP && mp.keywords ? { keywords: Array.isArray(mp.keywords) ? mp.keywords.join(', ') : mp.keywords } : {}),
      inLanguage: m.lang, datePublished: m.date, author: personLd };
  });
  const collKw = [...new Set(members.flatMap(m => Array.isArray(m.paper?.keywords) ? m.paper.keywords : []))].slice(0, 12);
  const crumbs = [{ '@type': 'ListItem', position: 1, name: '首页', item: SITE.url + '/' }];
  crumbs.push({ '@type': 'ListItem', position: 2, name: 'Research', item: SITE.url + RESEARCH_PATH });
  if (isRev && revOf) crumbs.push({ '@type': 'ListItem', position: 3, name: revOf.title, item: SITE.url + collectionPath(revOf.key) });
  crumbs.push({ '@type': 'ListItem', position: isRev && revOf ? 4 : 3, name: coll.title, item: SITE.url + path });
  const head = {
    titleFull: `${coll.title} · ${SITE.name}`,
    html: headHtml({ path, title: coll.title, desc: coll.desc, jsonld: [
      { '@context': 'https://schema.org', '@type': ['CollectionPage', 'CreativeWorkSeries'], name: coll.title, url: SITE.url + path, description: coll.desc, author: personLd, inLanguage: 'zh-CN',
        ...(collKw.length ? { keywords: collKw.join(', ') } : {}),
        isPartOf: { '@type': 'CreativeWorkSeries', name: 'Research', url: SITE.url + RESEARCH_PATH },
        hasPart, mainEntity: { '@type': 'ItemList', itemListElement: list } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs },
    ] }),
  };
  const main = `<main class="wrap narrow"><div class="hero${isRev ? ' rev' : ' research'}">${heroTag}<h1>${esc(coll.title)}</h1><p>${esc(coll.desc)}</p>${coll.note ? `<p class="note">${esc(coll.note)}</p>` : ''}${cross}</div>
<ul class="postlist">${items || '<p class="note">敬请期待。</p>'}</ul>
<a class="backlink" href="/">← 返回首页</a></main>`;
  return pageHtml({ active: 'research', head, main });
}
function researchCollectionCard(c, posts, role, { compact = false } = {}) {
  const count = collectionPostCount(posts, c.key);
  const isRevision = role === 'revision';
  const label = isRevision ? 'Revision' : '论文正文';
  const meta = isRevision ? `修订复盘 · ${count} 篇` : `Research · ${count} 篇`;
  const title = isRevision ? c.title : '论文正文';
  const desc = compact ? (c.homeCardDesc || c.homeDesc || c.desc) : c.desc;
  return `<a class="research-card ${role}" href="${collectionPath(c.key)}"><span class="research-role">${label}</span><span class="research-card-copy"><span class="t">${esc(title)}</span><span class="d">${esc(desc)}</span></span><span class="meta">${meta}</span></a>`;
}
function missingRevisionCard() {
  return `<div class="research-card revision missing"><span class="research-role">Revision</span><span class="research-card-copy"><span class="t">Revision 准备中</span><span class="d">这组研究的修订、评述或复盘尚未发布。</span></span><span class="meta">即将补齐</span></div>`;
}
function researchPairBlock(pair, posts, _index, { compact = false, heading = 'h2', framed = true } = {}) {
  const revCards = pair.revisions.length ? pair.revisions.map(c => researchCollectionCard(c, posts, 'revision', { compact })).join('\n') : missingRevisionCard();
  const titleTag = heading;
  const classes = ['research-pair', framed ? 'card' : '', compact ? 'compact' : ''].filter(Boolean).join(' ');
  const desc = compact ? (pair.primary.homeDesc || pair.primary.desc) : pair.primary.desc;
  return `<section class="${classes}">
<div class="research-pair-head"><${titleTag}>${esc(pair.primary.title)}</${titleTag}><p>${esc(desc)}</p></div>
<div class="research-card-list">${researchCollectionCard(pair.primary, posts, 'paper', { compact })}${revCards}</div>
</section>`;
}
function renderResearchIndex(posts) {
  const pairs = researchPairs(posts);
  const blocks = pairs.map((pair, i) => researchPairBlock(pair, posts, i)).join('\n');
  const desc = 'Research 索引:每组研究把论文正文与对应 Revision 成对放在一起,便于先读原文,再读修订、评述与复盘。';
  let pos = 0;
  const list = pairs.flatMap(pair => [pair.primary, ...pair.revisions]).map(c => ({
    '@type': 'ListItem', position: ++pos, name: c.title, url: SITE.url + collectionPath(c.key),
  }));
  const head = {
    titleFull: `Research · ${SITE.name}`,
    html: headHtml({ path: RESEARCH_PATH, title: 'Research', desc, jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${SITE.name} · Research`, url: SITE.url + RESEARCH_PATH, description: desc, author: personLd, mainEntity: { '@type': 'ItemList', itemListElement: list } },
    ] }),
  };
  const main = `<main class="wrap narrow research-page"><div class="hero"><h1>Research</h1><p>${desc}</p></div>
<div class="research-pairs">${blocks || '<p class="note">敬请期待。</p>'}</div></main>`;
  return pageHtml({ active: 'research', head, main });
}
function renderBlogIndex(posts) {
  // Research collections 不进 blog —— 仅经 header「Research」/ 首页 Research 区进入。blog 只列散篇。
  const loose = posts.filter(p => !p.collectionKey);
  const items = loose.map(p => `<li><a href="${p.path}"><div class="t">${esc(p.title)}</div><div class="d">${esc(p.description)}</div><div class="meta"><time datetime="${p.date}">${p.date}</time>${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div></a></li>`).join('\n');
  const total = loose.length;
  const desc = `Vince Jiang 的博客 —— 共 ${total} 篇杂谈与技术笔记。`;
  const head = { titleFull: `Blog · ${SITE.name}`, html: headHtml({ path: '/blog/', title: 'Blog', desc, jsonld: [{ '@context': 'https://schema.org', '@type': 'Blog', name: `${SITE.name} 的 Blog`, url: SITE.url + '/blog/', author: personLd }] }) };
  const main = `<main class="wrap narrow"><div class="hero"><h1>Blog</h1><p>杂谈、技术笔记、随手记的实验。共 ${total} 篇。</p></div>
<ul class="postlist">${items || '<p class="note">还没有已发布的文章。</p>'}</ul></main>`;
  return pageHtml({ active: 'blog', head, main });
}
function tileCard(href, title, desc, extra = '') {
  const external = /^https?:/.test(href);
  const host = external ? `<span class="host">${esc(href.replace(/^https?:\/\//, '').replace(/\/$/, ''))} ↗</span>` : '';
  const attr = external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="tile card" href="${href}"${attr}><div class="t">${esc(title)}</div><div class="d">${esc(desc)}</div>${extra}${host}</a>`;
}
// 友链卡:纸皮石马赛克底纹 + 站色相(--hue),港铁导视克制调性
function friendCard(w) {
  const host = esc(w.url.replace(/^https?:\/\//, '').replace(/\/$/, ''));
  const hue = Number.isFinite(w.hue) ? ` style="--hue:${w.hue}"` : '';
  const neutral = w.hue == null ? ' neutral' : '';
  return `<a class="friend${neutral}"${hue} href="${w.url}" target="_blank" rel="noopener"><span class="mosaic" aria-hidden="true"></span><span class="fc"><span class="t">${esc(w.name)}</span><span class="d">${esc(w.desc)}</span><span class="host">${host} ↗</span></span></a>`;
}
function renderHome(posts) {
  const latest = posts.filter(p => !p.collectionKey).slice(0, LATEST_N);   // 论文专辑不进 blog 最新
  const friends = (CONFIG.wildSites || []).map(friendCard).join('\n');
  const gallery = (CONFIG.gallery || []).map(g => tileCard(g.href, g.title, g.desc)).join('\n');
  const blog = latest.map(p => `<a class="tile card" href="${p.path}"><div class="t">${esc(p.title)}</div><div class="d">${esc(p.description)}</div><div class="meta">${p.date}</div></a>`).join('\n');
  const researchSec = researchPairs(posts).map((pair, i) => researchPairBlock(pair, posts, i, { compact: true, heading: 'h3', framed: false })).join('\n');
  const head = {
    titleFull: `${SITE.name} · 个人站`,
    html: headHtml({ path: '/', title: SITE.name, desc: SITE.tagline, jsonld: [
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.url + '/', inLanguage: SITE.lang, author: personLd },
      { '@context': 'https://schema.org', ...personLd },
    ] }),
  };
  const main = `<main class="wrap">
<div class="hero home-hero"><h1>Vince Jiang</h1><p>${esc(SITE.tagline)}</p></div>

<div class="sec"><h2>📝 Blog</h2><a class="more" href="/blog/">全部文章 →</a></div>
<div class="grid c2">${blog || '<p class="note">敬请期待。</p>'}</div>
${researchSec ? `\n<div class="sec research-sec"><h2><span class="section-icon research-icon" aria-hidden="true">⌁</span>Research</h2><a class="more" href="${RESEARCH_PATH}">全部 Research →</a></div>\n<section class="research-home card"><div class="research-pairs home">${researchSec}</div></section>\n` : ''}
<div class="sec"><h2>🎨 Gallery</h2><a class="more" href="/gallery/">全部作品 →</a></div>
<div class="grid c3">${gallery}</div>

<div class="sec"><h2>🔗 友链 · 香港高校「非官方」野史集群</h2><span class="note">六站互链,各守一校 · 纸皮石取自港铁月台墙</span></div>
<div class="grid c3 friends">${friends}</div>
</main>`;
  return pageHtml({ active: 'home', head, main });
}
function renderGallery() {
  // 与 blog 索引同一列表版式(.wrap.narrow + .postlist)
  const items = (CONFIG.gallery || []).map(g => {
    const ext = /^https?:/.test(g.href);
    const host = ext ? `<span class="host">${esc(g.href.replace(/^https?:\/\//, '').replace(/\/$/, ''))} ↗</span>` : '';
    const attr = ext ? ' target="_blank" rel="noopener"' : '';
    const badge = g.badge ? `<span class="tag">${esc(g.badge)}</span>` : '';
    return `<li><a href="${g.href}"${attr}><div class="t">${esc(g.title)}</div><div class="d">${esc(g.desc)}</div><div class="meta">${badge}${host}</div></a></li>`;
  }).join('\n');
  const list = (CONFIG.gallery || []).map((g, i) => ({ '@type': 'ListItem', position: i + 1, name: g.title, url: /^https?:/.test(g.href) ? g.href : SITE.url + g.href }));
  const head = {
    titleFull: `Gallery · ${SITE.name}`,
    html: headHtml({ path: '/gallery/', title: 'Gallery', desc: '作品集 —— AI 服务状态聚合、HiFi 声学笔记、Mac 选购等交互式 demo 与实验。', jsonld: [
      { '@context': 'https://schema.org', '@type': 'CollectionPage', name: `${SITE.name} · Gallery`, url: SITE.url + '/gallery/', author: personLd, mainEntity: { '@type': 'ItemList', itemListElement: list } },
    ] }),
  };
  const main = `<main class="wrap narrow"><div class="hero"><h1>Gallery</h1><p>做过的交互式 demo 与实验。原地址不变,这里只是索引。</p></div>
<ul class="postlist">${items}</ul></main>`;
  return pageHtml({ active: 'gallery', head, main });
}

// ---- sitemap / rss / llms ----
function buildSitemap(posts) {
  const newest = posts[0]?.updated || today();
  const cfgDate = dOnly(MANIFEST?.paths?.['site.config.json']) || today();
  const shellDate = maxDate(newest, cfgDate, dOnly(MANIFEST?.paths?.templates), dOnly(MANIFEST?.paths?.tools));
  const urls = [
    { loc: '/', lastmod: shellDate, cf: 'weekly', pri: '1.0' },
    { loc: '/blog/', lastmod: shellDate, cf: 'weekly', pri: '0.8' },
    { loc: RESEARCH_PATH, lastmod: shellDate, cf: 'monthly', pri: '0.8' },
    { loc: '/gallery/', lastmod: shellDate, cf: 'monthly', pri: '0.7' },
  ];
  for (const c of COLLECTIONS) {
    if (posts.some(p => p.collectionKey === c.key)) urls.push({ loc: collectionPath(c.key), lastmod: shellDate, cf: 'monthly', pri: '0.8' });
  }
  for (const p of posts) {
    const pri = p.collectionKey ? '0.7' : '0.6';   // 研究论文优先级更高
    urls.push({ loc: p.path, lastmod: p.updated, cf: 'monthly', pri });
    if (p.enPath) urls.push({ loc: p.enPath, lastmod: p.updated, cf: 'monthly', pri: p.collectionKey ? '0.6' : '0.5' });
  }
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
  const items = posts.filter(p => !p.collectionKey).slice(0, 20).map(p => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE.url}${p.path}</link>
      <guid isPermaLink="true">${SITE.url}${p.path}</guid>
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
  const recent = posts.filter(p => !p.collectionKey).slice(0, 10).map(p => `- [${p.title}](${SITE.url}${p.path}) — ${p.description}`).join('\n');
  const works = (CONFIG.gallery || []).map(g => `- [${g.title}](${/^https?:/.test(g.href) ? g.href : SITE.url + g.href}) — ${g.desc}`).join('\n');
  // Research:逐篇列出 + 机读 markdown 链接(中英),便于 LLM 检索与引用
  const research = COLLECTIONS.filter(c => posts.some(p => p.collectionKey === c.key)).map(c => {
    const order = c.order || [];
    const members = posts.filter(p => p.collectionKey === c.key).sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
    const lines = members.map(p => {
      const u = SITE.url + p.path;
      const en = p.enPath ? `;英文 ${SITE.url}${p.enPath}(md ${SITE.url}${p.enPath}index.md)` : '';
      return `- [${p.title}](${u}) — ${p.description}\n  机读 markdown:${u}index.md${en}`;
    }).join('\n');
    return `### ${c.title}\n${c.desc}\n入口:${SITE.url}${collectionPath(c.key)}\n${lines}`;
  }).join('\n\n');
  return `# ${SITE.name} — vincejiang.com

> ${SITE.tagline}

作者 Vince Jiang(小蒋),GitHub: ${SITE.github}。所有文章都有机读 markdown 副本(文章 URL 后加 \`index.md\`,英文译版在 \`en/index.md\`),欢迎抓取、检索与引用(geo-open;robots.txt 显式放行 GPTBot / OAI-SearchBot / ChatGPT-User / ClaudeBot / Claude-SearchBot / PerplexityBot / Google-Extended)。
${research ? `\n## Research(/research/)\n每组研究在站内 Research 页以「论文正文 + Revision」成对展示;以下保留逐篇机读入口。\n${research}\n` : ''}
## Blog(/blog/)
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
  'index.html', 'sitemap.xml', 'llms.txt', 'blog', 'research', 'gallery', 'release']);
const ASSET_DIRS = new Set(['assets']);   // 纯静态资源目录:随内容拷贝但不要求 index.html(无干净 URL)
function contentDirs() {
  return readdirSync(ROOT, { withFileTypes: true })
    .filter(e => !COPY_EXCLUDE.has(e.name))
    .map(e => ({ name: e.name, dir: e.isDirectory() }));
}

// ---- CHECK 模式 ----
function runCheck(posts) {
  // 每个对外发布的顶层目录必须有 index.html
  for (const c of contentDirs()) {
    if (c.dir && !ASSET_DIRS.has(c.name) && !existsSync(join(ROOT, c.name, 'index.html'))) err(`内容目录缺 index.html: ${c.name}/`);
  }
  // collection.order 完整性:声明的 slug 必须都有对应文章(反之只 warn)
  for (const c of COLLECTIONS) {
    for (const s of (c.order || [])) if (!posts.some(p => p.collectionKey === c.key && p.slug === s)) warn(`collection ${c.key}: order 列了 ${s} 但无对应文章`);
    for (const key of listOf(c.revisedBy)) if (!collectionOf(key)) err(`collection ${c.key}: revisedBy 指向不存在的 collection ${key}`);
    for (const key of listOf(c.revisionOf)) if (!collectionOf(key)) err(`collection ${c.key}: revisionOf 指向不存在的 collection ${key}`);
  }
  // 论文(layout: paper)整篇试渲染(中 + 英),图表 JSON 非法、正文违规等硬伤在 CI 就拦下
  for (const p of posts.filter(x => x.layout === 'paper')) {
    try { renderPaper(p, paperCtx(), { isEn: false }); } catch (e) { err(e.message); }
    if (p.en) try { renderPaper(p, paperCtx(), { isEn: true }); } catch (e) { err(e.message); }
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
function writePage(relPath, html) { const dir = join(OUT, relPath); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'index.html'), html); }
function runBuild(posts) {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  // 1) 拷贝静态内容
  for (const c of contentDirs()) copyDir(join(ROOT, c.name), join(OUT, c.name));
  // 2) 文章(中文主页 + 可选英文子页)
  const pub = posts.filter(p => p.published);
  for (const p of pub) {
    const dir = join(OUT, p.path);
    mkdirSync(dir, { recursive: true });
    if (p.isDir) copyDir(p.srcDir, dir);                 // 带图文章:整目录(含 index.md)拷过去
    else writeFileSync(join(dir, 'index.md'), readFileSync(p.abs));  // 单文件:落 md 副本
    writeFileSync(join(dir, 'index.html'), p.layout === 'paper' ? renderPaper(p, paperCtx(), { isEn: false }) : renderPost(p, false));
    if (p.en) {
      const edir = join(OUT, p.enPath);
      mkdirSync(edir, { recursive: true });
      if (p.en.isDir) copyDir(p.en.srcDir, edir); else writeFileSync(join(edir, 'index.md'), readFileSync(p.en.abs));
      writeFileSync(join(edir, 'index.html'), p.layout === 'paper' ? renderPaper(p, paperCtx(), { isEn: true }) : renderPost(p, true));
    }
  }
  // 3) collection 落地页
  for (const c of COLLECTIONS) {
    if (!pub.some(p => p.collectionKey === c.key)) continue;
    writePage(join('research', c.key), renderCollection(c, pub));
  }
  // 4-8) 索引 / 首页 / gallery / sitemap / rss / llms
  mkdirSync(join(OUT, 'blog'), { recursive: true });
  writeFileSync(join(OUT, 'blog', 'index.html'), renderBlogIndex(pub));
  writeFileSync(join(OUT, 'blog', 'feed.xml'), buildRss(pub));
  mkdirSync(join(OUT, 'research'), { recursive: true });
  writeFileSync(join(OUT, 'research', 'index.html'), renderResearchIndex(pub));
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
