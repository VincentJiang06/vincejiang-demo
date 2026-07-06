// paper.mjs —— 论文展示模板(layout: paper)的渲染器。由 build-site.mjs 调用。
// 输入:loadPosts() 产出的 post 对象(含 frontmatter.paper 元数据)+ ctx(SITE/headHtml/personLd/esc/warn)。
// 输出:完整 HTML(独立骨架 templates/paper.html,白纸黑字 + A4 连排 + 左侧大纲 + 打印即 A4 论文稿)。
// 规格文档:templates/PAPER-SPEC.md(Opus 适配论文时照此写 md)。
// 硬错误(图表 JSON 非法、正文出现 # 一级标题等)直接 throw,由 build --check 拦在 CI。
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { renderChart, renderFlow, renderMindmap } from './paper-charts.mjs';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const TPL = join(ROOT, 'templates');
let SHELL = null, CSS = null, JS = null;
function shell() {
  if (!SHELL) {
    SHELL = readFileSync(join(TPL, 'paper.html'), 'utf8');
    CSS = readFileSync(join(TPL, 'paper.css'), 'utf8');
    JS = readFileSync(join(TPL, 'paper.js'), 'utf8');
  }
  return { SHELL, CSS, JS };
}

const FIG = '\x01F\x01', TAB = '\x01T\x01';           // 图/表编号占位符(后处理统一编号)
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fill = (tpl, map) => { let o = tpl; for (const [k, v] of Object.entries(map)) o = o.split('{{' + k + '}}').join(v); return o; };

// ---- markdown 实例(与博客隔离:无 anchor 永久链;fence 拦截 chart/flow/mindmap)----
function makeMd(slug, warns) {
  const md = new MarkdownIt({
    html: true, linkify: false, breaks: false,
    highlight(str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try { return '<pre class="hljs"><code>' + hljs.highlight(str, { language: lang, ignoreIllegal: true }).value + '</code></pre>'; } catch {}
      }
      return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
  });
  const defFence = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const t = tokens[idx];
    const lang = (t.info || '').trim().split(/\s+/)[0];
    if (lang === 'chart' || lang === 'flow' || lang === 'mindmap') {
      let r;
      try {
        if (lang === 'mindmap') r = renderMindmap(t.content);
        else {
          let spec;
          try { spec = JSON.parse(t.content); }
          catch (e) { throw new Error(`JSON 解析失败 — ${e.message}`); }
          r = lang === 'chart' ? renderChart(spec) : renderFlow(spec);
        }
      } catch (e) {
        throw new Error(`论文 ${slug}: \`\`\`${lang} 块渲染失败(内容开头「${t.content.slice(0, 40).replace(/\n/g, ' ')}…」): ${e.message}`);
      }
      for (const w of r.warnings || []) warns.push(`论文 ${slug}: ${w}`);
      const src = r.source ? `<span class="figsrc">${esc(r.source)}</span>` : '';
      return `<figure class="fig fig-${lang}">${r.svg}<figcaption><b class="figno">${FIG}</b>${esc(r.caption)}${src}</figcaption></figure>\n`;
    }
    return defFence(tokens, idx, options, env, self);
  };
  return md;
}

// ---- 后处理:图片段落 → figure(题注取 alt)----
function imageFigures(html) {
  return html.replace(/<p>(<img\b[^>]*>)<\/p>/g, (m, img) => {
    const alt = (img.match(/\balt="([^"]*)"/) || [])[1] || '';
    return `<figure class="fig fig-img">${img}<figcaption><b class="figno">${FIG}</b>${alt}</figcaption></figure>`;
  });
}

// ---- 后处理:「表：题注」前置段落 + 紧邻表格 → 带编号表题的 figure(表题在表上方)----
function tableFigures(html, warns, slug) {
  html = html.replace(/<p>(?:表|Table)\s*[::]\s*([\s\S]*?)<\/p>\s*(<table>[\s\S]*?<\/table>)/g,
    (m, cap, tbl) => `<figure class="tblfig"><figcaption><b class="figno">${TAB}</b>${cap}</figcaption>${tbl}</figure>`);
  const orphan = (html.match(/<table>/g) || []).length - (html.match(/<figure class="tblfig">/g) || []).length;
  if (orphan > 0) warns.push(`论文 ${slug}: 有 ${orphan} 个表格缺「表：题注」前置段落(不参与编号)`);
  return html;
}

// ---- 后处理:图/表顺序编号 ----
function numberFigures(html) {
  let f = 0, t = 0;
  return html.split(FIG).join('\x02').replace(/\x02/g, () => `图 ${++f}　`)
    .split(TAB).join('\x03').replace(/\x03/g, () => `表 ${++t}　`);
}

// ---- 后处理:标题编号(1 / 1.1 / 1.1.1)+ id + 大纲收集;特殊节不编号 ----
const UNNUM = /^(摘要|abstract|关键词|keywords|参考文献|references|致谢|acknowledge?ments?|附录.*|appendix.*)$/i;
function numberHeadings(html, autonum = true) {
  const toc = [];
  const ctr = [0, 0, 0];
  const seen = new Set();
  let seq = 0;
  html = html.replace(/<h([234])((?:\s[^>]*)?)>([\s\S]*?)<\/h\1>/g, (m, lv, attrs, inner) => {
    lv = +lv;
    const text = inner.replace(/<[^>]*>/g, '').trim();
    let no = '', id;
    if (!autonum) {
      id = 'sec-' + (++seq);       // 手动编号模式:不自动前缀,只给稳定 id + 收 TOC(保留标题原文的手写编号)
    } else if (UNNUM.test(text)) {
      id = 'sec-' + text.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, '-').replace(/^-|-$/g, '');
    } else {
      const i = lv - 2;
      ctr[i]++;
      for (let j = i + 1; j < 3; j++) ctr[j] = 0;
      no = ctr.slice(0, i + 1).join('.');
      id = 'sec-' + no.replace(/\./g, '-');
    }
    while (seen.has(id)) id += '-x';
    seen.add(id);
    if (lv <= 3) toc.push({ lv, no, text, id });
    return `<h${lv} id="${id}">${no ? `<span class="secno">${no}</span>` : ''}${inner}</h${lv}>`;
  });
  return { html, toc };
}

// ---- 后处理:参考文献列表加锚点(#ref-n),正文 [n] 变上标引文链接 ----
function refAnchors(html) {
  const hm = html.match(/<h2 id="[^"]*">(?:参考文献|References)<\/h2>/i);
  if (!hm) return { html, nRefs: 0 };
  const start = html.indexOf(hm[0]) + hm[0].length;
  const olAt = html.indexOf('<ol', start);
  if (olAt < 0) return { html, nRefs: 0 };
  const olEnd = html.indexOf('</ol>', olAt);
  let n = 0;
  const olHtml = html.slice(olAt, olEnd).replace(/<li>/g, () => `<li id="ref-${++n}">`);
  html = html.slice(0, olAt) + olHtml.replace(/^<ol/, '<ol class="refs"') + html.slice(olEnd);
  return { html, nRefs: n };
}
function citeLinks(html, nRefs) {
  if (!nRefs) return html;
  const parts = html.split(/(<[^>]+>)/);
  let code = 0;
  return parts.map(pt => {
    if (pt.startsWith('<')) {
      if (/^<(pre|code)[\s>]/i.test(pt)) code++;
      else if (/^<\/(pre|code)>/i.test(pt)) code = Math.max(0, code - 1);
      return pt;
    }
    if (code) return pt;
    return pt.replace(/\[(\d{1,3})(?:\s*[,,–—-]\s*\d{1,3})*\]/g, (m, first) => {
      const k = +first;
      if (k < 1 || k > nRefs) return m;
      return `<sup class="cite"><a href="#ref-${k}">${m}</a></sup>`;
    });
  }).join('');
}

// ---- 标题块(题目/作者/单位/摘要/关键词);双语单一数据源在中文 frontmatter.paper,含 *_en ----
function absBlock(cls, label, text, kwLabel, kw) {
  if (!text) return '';
  let h = `<div class="${cls}"><p><b>${label}</b>${esc(text)}</p>`;
  if (kw) h += `<p><b>${kwLabel}</b>${esc(kw)}</p>`;
  return h + `</div>`;
}
function titleBlock(p, pp, isEn) {
  const authors = (pp.authors || []).map(a => typeof a === 'string' ? { name: a } : a);
  const authorLine = authors.map(a => esc(a.name)).join(isEn ? ', ' : '，') || esc('Vince Jiang');
  const affils = pp.affiliations || [...new Set(authors.map(a => a.affil).filter(Boolean))];
  const emails = authors.map(a => a.email).filter(Boolean);
  const updLbl = isEn ? 'updated' : '更新';
  const meta = [pp.version, p.date, p.updated !== p.date ? `${updLbl} ${p.updated}` : null, 'vincejiang.com'].filter(Boolean).join(' · ');
  const kwZh = Array.isArray(pp.keywords) ? pp.keywords.join('；') : (pp.keywords || '');
  const kwEn = Array.isArray(pp.keywords_en) ? pp.keywords_en.join('; ') : (pp.keywords_en || '');
  const mainTitle = isEn ? (pp.title_en || p.en?.title || p.title) : p.title;
  const otherTitle = isEn ? p.title : pp.title_en;                 // 另一语言的题目作副题
  let h = `<header class="pt" id="paper-top">`;
  h += `<h1>${esc(mainTitle)}</h1>`;
  if (!isEn && pp.subtitle) h += `<p class="psub">${esc(pp.subtitle)}</p>`;
  if (otherTitle) h += `<p class="pten">${esc(otherTitle)}</p>`;
  h += `<p class="pauth">${authorLine}</p>`;
  for (const af of affils) h += `<p class="paffil">${esc(af)}</p>`;
  if (emails.length) h += `<p class="paffil">${emails.map(esc).join('　')}</p>`;
  h += `<p class="pmeta">${esc(meta)}</p>`;
  const zh = t => absBlock(t, '摘　要：', pp.abstract, '关键词：', kwZh);
  const en = t => absBlock(t, 'Abstract: ', pp.abstract_en, 'Keywords: ', kwEn);
  if (isEn) { h += en('abs'); h += zh('abs absen'); }             // 主语言在上(实边框),另一语言在下(细边框)
  else { h += zh('abs'); h += en('abs absen'); }
  return h + `</header>`;
}

function tocHtml(toc, isEn) {
  const items = toc.map(t =>
    `<a class="t${t.lv}" href="#${t.id}">${t.no ? `<i>${t.no}</i>` : ''}<span>${esc(t.text)}</span></a>`).join('\n');
  return `<a class="t2" href="#paper-top"><span>${isEn ? 'Title & Abstract' : '标题与摘要'}</span></a>\n` + items;
}

// ---- 主入口;opts.isEn=true 渲染英文子页(/research/.../en/)----
export function renderPaper(p, ctx, opts = {}) {
  const isEn = !!opts.isEn;
  const pp = p.paper || {};
  const body = isEn ? (p.en ? p.en.body : '') : p.body;
  const title = isEn ? (pp.title_en || p.en?.title || p.title) : p.title;
  const description = isEn ? (p.en?.description || pp.abstract_en || p.description) : p.description;
  const lang = isEn ? 'en' : p.lang;
  const path = isEn ? p.enPath : p.path;
  const warns = [];
  if (!isEn && !pp.abstract) warns.push(`论文 ${p.slug}: frontmatter 缺 paper.abstract(摘要)`);
  if (isEn && !pp.abstract_en) warns.push(`论文 ${p.slug} (en): 缺 paper.abstract_en`);
  if (isEn && !pp.title_en && !p.en?.title) warns.push(`论文 ${p.slug} (en): 缺 paper.title_en`);
  if (/^#\s/m.test(body.replace(/```[\s\S]*?```/g, ''))) {
    throw new Error(`论文 ${p.slug}${isEn ? ' (en)' : ''}: 正文不得出现 # 一级标题(题目由 frontmatter title 提供,章节从 ## 开始)`);
  }

  const md = makeMd(p.slug + (isEn ? '.en' : ''), warns);
  let html = md.render(body);
  html = imageFigures(html);
  html = tableFigures(html, warns, p.slug);
  html = numberFigures(html);
  const nh = numberHeadings(html, pp.autonumber !== false);
  html = nh.html;
  const ra = refAnchors(html);
  html = citeLinks(ra.html, ra.nRefs);

  const authors = (pp.authors || []).map(a => typeof a === 'string' ? { name: a } : a);
  const absTxt = isEn ? pp.abstract_en : pp.abstract;
  const kwTxt = isEn ? pp.keywords_en : pp.keywords;
  const kwArr = Array.isArray(kwTxt) ? kwTxt : (kwTxt ? String(kwTxt).split(/[;,；、]\s*/).filter(Boolean) : []);
  // 归属研究系列(而非泛 blog),便于 AI 理解为一套连贯研究
  const coll = (p.collectionKey && ctx.collectionOf) ? ctx.collectionOf(p.collectionKey) : null;
  const collUrl = coll && ctx.collectionPath ? ctx.collectionPath(coll.key) : (coll ? `/research/${coll.key}/` : null);
  const isPartOf = coll
    ? { '@type': 'CreativeWorkSeries', name: coll.title, url: ctx.SITE.url + collUrl }
    : { '@type': 'Blog', name: `${ctx.SITE.name} 的 Blog`, url: ctx.SITE.url + '/blog/' };
  // 中英互为译本(schema.org 翻译关系)
  const transHref = isEn ? ctx.SITE.url + p.path : (p.enPath ? ctx.SITE.url + p.enPath : null);
  const transRel = isEn ? 'translationOfWork' : 'workTranslation';
  const ld = {
    '@context': 'https://schema.org', '@type': 'ScholarlyArticle',
    headline: title, ...(!isEn && pp.title_en ? { alternativeHeadline: pp.title_en } : {}),
    ...(absTxt ? { abstract: absTxt } : {}),
    ...(kwArr.length ? { keywords: kwArr.join(', '), about: kwArr.map(k => ({ '@type': 'Thing', name: k })) } : {}),
    genre: 'working paper', datePublished: p.date, dateModified: p.updated, inLanguage: lang,
    url: ctx.SITE.url + path, mainEntityOfPage: ctx.SITE.url + path,
    author: authors.length ? authors.map(a => ({ '@type': 'Person', name: a.name, ...(a.affil ? { affiliation: a.affil } : {}) })) : ctx.personLd,
    publisher: ctx.personLd,
    isPartOf,
    ...(transHref ? { [transRel]: { '@type': 'ScholarlyArticle', '@id': transHref, url: transHref, inLanguage: isEn ? p.lang : 'en' } } : {}),
  };
  // 论文归属 Research collection,而非泛 blog
  const upHref = collUrl || '/blog/';
  const upLabel = p.collectionKey ? 'Research' : 'Blog';
  const breadcrumbItems = coll ? [
    { '@type': 'ListItem', position: 1, name: '首页', item: ctx.SITE.url + '/' },
    { '@type': 'ListItem', position: 2, name: 'Research', item: ctx.SITE.url + '/research/' },
    { '@type': 'ListItem', position: 3, name: coll.title, item: ctx.SITE.url + collUrl },
    { '@type': 'ListItem', position: 4, name: title, item: ctx.SITE.url + path },
  ] : [
    { '@type': 'ListItem', position: 1, name: '首页', item: ctx.SITE.url + '/' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: ctx.SITE.url + '/blog/' },
    { '@type': 'ListItem', position: 3, name: title, item: ctx.SITE.url + path },
  ];
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: breadcrumbItems,
  };
  const head = ctx.headHtml({ type: 'article', path, title, desc: description, locale: isEn ? 'en_US' : 'zh_CN', jsonld: [ld, breadcrumb] })
    + (ctx.hreflangHtml ? ctx.hreflangHtml(p) : '');

  const { SHELL, CSS, JS } = shell();
  const out = fill(SHELL, {
    LANG: lang, TITLE: `${esc(title)} · ${ctx.SITE.name}`, HEAD: head, CSS, JS,
    SHORT: esc(pp.short || title),
    TITLE_SIDE: esc(title),
    TOC: tocHtml(nh.toc, isEn),
    TITLEBLOCK: titleBlock(p, pp, isEn),
    CONTENT: html,
    UPLINK: `<a href="${upHref}">${upLabel}</a>`,
    LANGSW: ctx.langSwitchHtml ? ctx.langSwitchHtml(p, isEn) : '',
    PREVNEXT: ctx.prevNextHtml ? ctx.prevNextHtml(p, isEn) : '',
    SRCLABEL: isEn ? 'Markdown source' : 'Markdown 源',
    PRINTLABEL: isEn ? 'Print / Save PDF' : '打印 / 存 PDF',
  });
  for (const w of warns) ctx.warn(w);
  return out;
}
