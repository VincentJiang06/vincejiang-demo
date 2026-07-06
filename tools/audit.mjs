#!/usr/bin/env node
// audit.mjs —— 手动全站 SEO/GEO 审计(report-only,永不阻塞构建)。
//   node audit.mjs                 # 先 build 到临时目录再审计
//   node audit.mjs --dir <builtdir># 审计已构建目录
//   node audit.mjs --out report.md # 额外写 markdown 报告(供 CI audit job 贴 job summary)
// 逐页对照 SEO/GEO MUST(title/desc/canonical/OG/twitter/lang/viewport/单 h1)+ 断链 + img alt
// + JSON-LD 可解析 + sitemap 双向覆盖。退出码恒 0。
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdtempSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const args = process.argv.slice(2);
const dirIdx = args.indexOf('--dir');
const outIdx = args.indexOf('--out');
const OUTFILE = outIdx >= 0 ? args[outIdx + 1] : null;

// 1) 确定构建目录
let DIR = dirIdx >= 0 ? args[dirIdx + 1] : null;
if (!DIR) {
  DIR = mkdtempSync(join(tmpdir(), 'vj-audit-'));
  const r = spawnSync('node', [join(ROOT, 'tools', 'build-site.mjs'), '--out', DIR], { encoding: 'utf8' });
  if (r.status !== 0) { console.error('构建失败,无法审计:\n' + (r.stderr || '')); process.exit(0); }
}
const SITE = 'https://vincejiang.com';

// 遍历 html
function walk(dir, ext) {
  let out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p, ext));
    else if (e.name.endsWith(ext)) out.push(p);
  }
  return out;
}
const htmls = walk(DIR, '.html');
const rel = p => p.slice(DIR.length) || '/';
const urlOf = p => { const r = rel(p); return r.endsWith('/index.html') ? r.slice(0, -10) : r; };

const pick = (re, s) => { const m = s.match(re); return m ? m[1] : null; };
const has = (re, s) => re.test(s);

// 内部链接可解析?
function resolves(href) {
  let h = href.split('#')[0].split('?')[0];
  if (!h || /^(https?:|mailto:|tel:|data:)/.test(h)) return true;   // 外链/锚点跳过
  if (!h.startsWith('/')) return true;                              // 相对(demo 内部)不判
  const base = join(DIR, h);
  if (existsSync(base)) { try { return statSync(base).isDirectory() ? existsSync(join(base, 'index.html')) : true; } catch { return false; } }
  if (existsSync(base + '.html')) return true;
  if (h.endsWith('/') && existsSync(join(base, 'index.html'))) return true;
  return false;
}

const pages = [];
for (const f of htmls) {
  const s = readFileSync(f, 'utf8');
  const issues = [];
  const title = pick(/<title>([^<]*)<\/title>/, s);
  if (!title) issues.push('缺 <title>');
  const h1 = (s.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) issues.push(`h1 数量=${h1}(应为 1)`);
  if (!has(/<meta name="description" content="[^"]+"/, s)) issues.push('缺 meta description');
  const canon = pick(/<link rel="canonical" href="([^"]+)"/, s);
  if (!canon) issues.push('缺 canonical');
  else if (!canon.startsWith('https://')) issues.push('canonical 非 https 绝对');
  for (const og of ['og:title', 'og:description', 'og:url', 'og:image']) if (!s.includes(`property="${og}"`)) issues.push(`缺 ${og}`);
  if (!has(/name="twitter:card"/, s)) issues.push('缺 twitter:card');
  if (!has(/<html lang="[^"]+"/, s)) issues.push('缺 <html lang>');
  if (!has(/name="viewport"/, s)) issues.push('缺 viewport');
  // img alt 覆盖
  const imgs = s.match(/<img\b[^>]*>/g) || [];
  const noAlt = imgs.filter(t => !/\salt=/.test(t)).length;
  if (noAlt) issues.push(`${noAlt}/${imgs.length} 张 img 缺 alt`);
  // JSON-LD 可解析
  let ldCount = 0, ldBad = 0;
  for (const m of s.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { ldCount++; try { JSON.parse(m[1]); } catch { ldBad++; } }
  if (ldBad) issues.push(`${ldBad} 段 JSON-LD 解析失败`);
  // 断链(仅本站绝对路径)
  const dead = [];
  for (const m of s.matchAll(/href="([^"]+)"/g)) if (!resolves(m[1])) dead.push(m[1]);
  if (dead.length) issues.push(`断链 ${dead.length}: ${[...new Set(dead)].slice(0, 5).join(', ')}`);

  pages.push({ url: urlOf(f), title, hasLd: ldCount > 0, issues });
}
pages.sort((a, b) => a.url.localeCompare(b.url));

// sitemap 双向覆盖
const smPath = join(DIR, 'sitemap.xml');
let smReport = [];
if (existsSync(smPath)) {
  const sm = readFileSync(smPath, 'utf8');
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(SITE, '') || '/');
  const pageUrls = new Set(pages.map(p => p.url));
  // sitemap 里指向不存在的页
  const smDead = locs.filter(l => !resolves(l));
  // 我方页面(/、/blog/、/blog/*、/research/、/gallery/)是否都进了 sitemap
  const ours = pages.map(p => p.url).filter(u => u === '/' || u === '/blog/' || u.startsWith('/blog/') || u === '/research/' || u === '/gallery/');
  const notInSm = ours.filter(u => !locs.includes(u));
  if (smDead.length) smReport.push(`sitemap 指向不存在的页 ${smDead.length}: ${smDead.slice(0, 5).join(', ')}`);
  if (notInSm.length) smReport.push(`我方页面未进 sitemap ${notInSm.length}: ${notInSm.slice(0, 8).join(', ')}`);
  if (!smReport.length) smReport.push(`sitemap ✓ ${locs.length} 条,双向一致`);
} else smReport.push('⚠ 无 sitemap.xml');

// 机读层存在性(GEO)
const geo = [];
for (const [name, p] of [['llms.txt', 'llms.txt'], ['RSS', 'blog/feed.xml'], ['robots.txt', 'robots.txt']])
  geo.push(`${existsSync(join(DIR, p)) ? '✓' : '✗'} ${name}`);

// ---- 报告 ----
const clean = pages.filter(p => p.issues.length === 0);
const dirty = pages.filter(p => p.issues.length > 0);
const L = [];
L.push(`# vincejiang.com SEO/GEO 审计`);
L.push(``);
L.push(`审计目录:\`${DIR}\` · 页面 ${pages.length}(合规 ${clean.length} / 有问题 ${dirty.length})`);
L.push(``);
L.push(`## 机读层(GEO)`);
L.push(geo.map(g => `- ${g}`).join('\n'));
L.push(``);
L.push(`## sitemap 覆盖`);
L.push(smReport.map(s => `- ${s}`).join('\n'));
L.push(``);
L.push(`## 逐页问题`);
if (!dirty.length) L.push(`所有页面通过 MUST 清单 ✓`);
else for (const p of dirty) L.push(`- **${p.url}**${p.hasLd ? '' : ' (无 JSON-LD)'}\n  - ${p.issues.join('\n  - ')}`);
L.push(``);
L.push(`## 合规页面`);
L.push(clean.map(p => `- ${p.url}${p.hasLd ? ' · JSON-LD ✓' : ''}`).join('\n') || '(无)');
const report = L.join('\n') + '\n';

console.log(report);
if (OUTFILE) { writeFileSync(OUTFILE, report); console.error(`报告已写 ${OUTFILE}`); }
process.exit(0);
