#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const OUT = mkdtempSync(join(tmpdir(), 'vj-site-test-'));

const built = spawnSync('node', [join(ROOT, 'tools', 'build-site.mjs'), '--out', OUT], {
  cwd: ROOT,
  encoding: 'utf8',
});
assert.equal(built.status, 0, built.stderr || built.stdout);

const html = rel => readFileSync(join(OUT, rel, 'index.html'), 'utf8');
const home = html('');

assert.doesNotMatch(home, /<div class="ambient-bg"|<svg viewBox="0 0 1440 980"/);
assert.doesNotMatch(home, /class="foam-dots"/);
assert.doesNotMatch(home, /class="wave-ribbons"/);
assert.doesNotMatch(home, /class="wave-echo"/);
assert.doesNotMatch(home, /id="ambient-dot|id="ambient-ripple"|id="wave-|class="dot-field|class="main-waves"|animateTransform|feTurbulence|feDisplacementMap|feMorphology|r="2\.55"/);
assert.doesNotMatch(home, /\.ambient-bg|body::before\{/);
assert.match(home, /--status-g1:#a8c0ff; --status-g2:#ffd3e0; --status-g3:#c2f5e9; --status-g4:#e7d5ff;/);
assert.match(home, /--status-g1:#1e3a8a; --status-g2:#5b2a6e; --status-g3:#0f5a52; --status-g4:#3b2a72;/);
assert.match(home, /background:var\(--page\);\s*\/\* 底色兜底;实际背景=固定层 \.bgfx 静态等高线 SVG/);
// ── 等高线背景(2026-08-04 用户裁决,动画方案全部作废):固定 div + 静态 SVG,零脚本零动画 ──
assert.match(home, /<div class="bgfx" aria-hidden="true"><\/div>/);
assert.match(home, /\.bgfx\{position:fixed;inset:0;z-index:-1;pointer-events:none;/);
assert.match(home, /bg-topo-light\.svg/);
assert.match(home, /bg-topo-dark\.svg/);
assert.doesNotMatch(home, /bgfx.*requestAnimationFrame|流星|星尘/, 'background must carry no animation script');
assert.ok(existsSync(join(OUT, 'assets', 'bg-topo-light.svg')), 'light topo SVG should be in the build');
assert.ok(existsSync(join(OUT, 'assets', 'bg-topo-dark.svg')), 'dark topo SVG should be in the build');
const topoSvg = readFileSync(join(OUT, 'assets', 'bg-topo-light.svg'), 'utf8');
assert.doesNotMatch(topoSvg, /<animate|<script|feTurbulence|feDisplacementMap/, 'topo must stay static');
assert.ok(!existsSync(join(OUT, 'assets', 'bg-waves-light.svg')), 'retired waves SVG should be gone');
assert.doesNotMatch(home, /radial-gradient\(\d+rem \d+rem at \d+% \d+%,color-mix\(in srgb,var\(--status-g/);
assert.doesNotMatch(home, /linear-gradient\(135deg,color-mix\(in srgb,var\(--ambient-wash-a\)/);
assert.doesNotMatch(home, /--ambient-line-[abc]/);
assert.doesNotMatch(home, /data-period|\[data-period=|morning-a|afternoon-a|evening-a|按时间自动/);
assert.match(home, /backdrop-filter:blur\(18px\) saturate\(1\.12\)/);
assert.doesNotMatch(home, /data-theme="neutral"|s==='neutral'|order=\['auto','light','dark','neutral'\]|色彩模式:默认按本地时间自动换色/);
assert.match(home, /色彩模式:仅保留 light\/dark;未手动选择时跟随系统。/);
assert.match(home, /localStorage\.setItem\('theme',effective\(\)==='dark'\?'light':'dark'\)/);
assert.match(home, /<button class="toggle" id="theme-toggle" title="切换明暗模式">☾<\/button>/);
assert.match(home, /<div class="hero home-hero">/);
assert.match(home, /\.home-hero\{min-height:176px;display:flex;flex-direction:column;justify-content:center;/);
assert.match(home, /background:linear-gradient\(135deg,#2f6eea,#2457c8\)/);
assert.match(home, /\.home-hero::before,\.home-hero::after\{content:none\}/);
assert.match(home, /\.home-hero h1\{color:#fff\}/);
assert.doesNotMatch(home, /\.nav \.in::before/);
assert.doesNotMatch(home, /@keyframes brand-glint|@keyframes brand-line|@keyframes nav-horizon|@keyframes nav-underline/);
assert.doesNotMatch(home, /\.nav::after|\.nav \.brand::after|\.nav a\.item::after/);
assert.match(home, /\.nav \.brand\{font-weight:700; letter-spacing:-\.01em; color:var\(--fg\);/);
assert.match(home, /\.nav a\.item\.active\{color:var\(--fg\); border-bottom-color:var\(--link\);background:transparent\}/);
assert.match(home, /\.index-page\{padding-bottom:6\.2rem\}/);
assert.match(home, /\.foot\{max-width:1000px;width:calc\(100% - 2\.4rem\); margin:3\.8rem auto 3\.8rem;/);
assert.match(home, /backdrop-filter:blur\(30px\) saturate\(1\.18\)/);
assert.match(home, /\.sec\{margin:2\.4rem 0 1rem; display:flex; align-items:baseline; gap:\.7rem; flex-wrap:wrap\}/);
assert.doesNotMatch(home, /\.sec\{[^}]*border-radius:16px/);
assert.match(home, /\.section-icon\{display:inline;color:var\(--link\);font-size:1\.05rem;/);
assert.match(home, /\.article \.head\{[\s\S]*?backdrop-filter:blur\(26px\) saturate\(1\.16\)/);
assert.match(home, /<a class="item" href="\/research\/">Research<\/a>/);
assert.doesNotMatch(home, /class="item special"/);
assert.match(home, /<div class="sec research-sec"><h2><span class="section-icon research-icon" aria-hidden="true">🧪<\/span>Research<\/h2><a class="more" href="\/research\/">全部 Research →<\/a><\/div>/);
assert.doesNotMatch(home, /research-more/);
assert.doesNotMatch(home, /论文正文和 revision 成对展示/);
assert.match(home, /<section class="research-home card">/);
assert.doesNotMatch(home, /class="research-pair card compact"/);
assert.doesNotMatch(home, /\.research-card\{[^}]*border-radius:14px/);
assert.ok(existsSync(join(OUT, 'research', 'index.html')), 'Research index should be generated');

const research = html('research');
assert.match(research, /<h1>Research<\/h1>/);
assert.equal((research.match(/<section class="research-pair/g) || []).length, 1);
assert.doesNotMatch(research, /class="research-no"/);
assert.doesNotMatch(research, />0[1-9]</);

const pair = research.match(/<section class="research-pair[^"]*"[\s\S]*?<\/section>/)?.[0] || '';
assert.ok(pair.includes('href="/research/pension-demo/"'), 'paper collection card should be in the pair');
assert.ok(pair.includes('href="/research/pension-demo-revision/"'), 'revision collection card should be in the pair');
assert.equal((pair.match(/proj card research-card/g) || []).length, 2, 'pair should hold two color-bar cards');
assert.ok(pair.includes('research-card-list'), 'collection cards should be grouped in a list');
assert.ok(existsSync(join(OUT, 'research', 'pension-demo', 'index.html')), 'paper collection should live under /research/');
assert.ok(existsSync(join(OUT, 'research', 'pension-demo-revision', 'index.html')), 'revision collection should live under /research/');
assert.ok(!existsSync(join(OUT, 'blog', 'pension-demo')), 'paper collection should not live under /blog/');
assert.ok(!existsSync(join(OUT, 'blog', 'pension-demo-revision')), 'revision collection should not live under /blog/');

const blogIndex = html('blog');
const galleryIndex = html('gallery');
assert.match(blogIndex, /<main class="wrap index-page">/, 'blog index adopts the wide gallery layout');
assert.match(blogIndex, /<div class="grid c2 projects" id="tool-grid" data-unit="篇">/);

// ── 作品区新版式:两列截图卡 + 截图提取色相(--hue)+ Gallery 工具栏(搜索/筛选/排序) ──
assert.match(galleryIndex, /<main class="wrap index-page gallery-page">/);
assert.match(home, /<div class="grid c2 projects">/);
assert.doesNotMatch(home, /<div class="grid c3">/, 'old 3-col gallery grid should be gone (friends grid keeps its own class)');
assert.match(home, /class="proj-bar" aria-hidden="true"/, 'cards should carry the hue color bar');
assert.match(home, /class="proj card" style="--hue:\d+"/, 'extracted hue should land on the card as --hue');
assert.match(home, /class="proj card neutral"/, 'near-monochrome sites should render as neutral cards');
assert.match(home, /class="proj card hl"/, 'highlight renders as an emphasized color-bar card');
assert.doesNotMatch(home, /theme-reactor\.svg|theme-cus\.svg/, 'theme SVGs are replaced by real screenshots');
assert.ok(!existsSync(join(OUT, 'assets', 'shots')), 'local screenshots must NOT ship into the build');
assert.match(galleryIndex, /id="tool-grid"/);
assert.match(galleryIndex, /id="gq"/);
assert.match(galleryIndex, /data-sort="new"/);
assert.match(galleryIndex, /data-filter="hl"/);
// Blog 索引复用同一工具栏(搜索+排序,无筛选);友链 = 截图卡两列
assert.match(blogIndex, /id="tool-grid" data-unit="篇"/);
assert.match(blogIndex, /data-sort="old"/);
assert.doesNotMatch(blogIndex, /data-filter=/, 'blog toolbar should not have gallery-only filters');
assert.match(home, /<div class="grid c3 friends">/);
assert.match(home, /class="mosaic" aria-hidden="true"/, 'friend cards keep the mosaic texture');
assert.match(galleryIndex, /style="--hue:\d+" href="https:\/\/cus\.vincejiang\.com"/, 'cus hueManual should win over extracted null hue');
// 色相防撞:所有带色相的卡两两间隔 ≥15°(圆周),蓝色扎堆时渲染层要推开
const gHues = [...galleryIndex.matchAll(/class="proj card" style="--hue:(\d+)"/g)].map(m => +m[1]).sort((a, b) => a - b);
assert.ok(gHues.length >= 6, `expected >=6 hued cards, got ${gHues.length}`);
for (let i = 1; i < gHues.length; i++) {
  assert.ok(gHues[i] - gHues[i - 1] >= 15, `hue 防撞失效:${gHues[i - 1]} 与 ${gHues[i]} 间隔 <15°`);
}
const cfgGallery = JSON.parse(readFileSync(join(ROOT, 'site.config.json'), 'utf8')).gallery;
const gCards = [...galleryIndex.matchAll(/<a class="proj card[^"]*"[^>]*href="([^"]+)"/g)].map(m => m[1]);
assert.equal(gCards.length, cfgGallery.length, `gallery should list all ${cfgGallery.length} projects as cards`);
const newestDate = cfgGallery.map(g => g.date).sort().reverse()[0];
const firstCardDate = galleryIndex.match(/<time datetime="(\d{4}-\d{2}-\d{2})">/)[1];
assert.equal(firstCardDate, newestDate, 'gallery default order should be newest-first');
const gDates = [...galleryIndex.matchAll(/<time datetime="(\d{4}-\d{2}-\d{2})">/g)].map(m => m[1]);
assert.deepEqual(gDates, [...gDates].sort().reverse(), 'gallery cards should be sorted by date desc');
assert.doesNotMatch(home, /mac-buying-demo|M 系列 Mac 纯文本选购终端/);
assert.doesNotMatch(galleryIndex, /mac-buying-demo|M 系列 Mac 纯文本选购终端|Mac 选购/);
assert.ok(!existsSync(join(OUT, 'mac-buying-demo')), 'retired Mac demo should not be copied into the build');
assert.match(home, /href="\/glyph-pinball\/"/);
assert.doesNotMatch(home, /href="\/(?:glyph-dino|glyph-surf)\/"/);
assert.match(galleryIndex, /TYPE\/\/PINBALL/);
assert.doesNotMatch(galleryIndex, /DINO\/\/TYPE|SURF\/\/GLYPH/);
assert.match(galleryIndex, /href="\/glyph-pinball\/"/);
assert.ok(existsSync(join(OUT, 'glyph-pinball', 'index.html')), 'Text Pinball should be copied into the build');
assert.ok(existsSync(join(OUT, 'glyph-pinball', 'game.js')), 'Text Pinball runtime should be copied into the build');
assert.ok(existsSync(join(OUT, 'glyph-pinball', 'physics.js')), 'Text Pinball physics should be copied into the build');
assert.ok(!existsSync(join(OUT, 'glyph-dino')), 'retired Dino must not remain in the build');
assert.ok(!existsSync(join(OUT, 'glyph-surf')), 'retired Surf must not remain in the build');
assert.ok(existsSync(join(OUT, 'assets', 'glyph-arcade', 'engine.js')), 'shared glyph engine should be copied into the build');
assert.ok(existsSync(join(OUT, 'assets', 'glyph-arcade', 'stage.css')), 'shared glyph stage CSS should be copied into the build');
assert.ok(existsSync(join(OUT, 'assets', 'glyph-arcade', 'pretext', 'layout.js')), 'Pretext runtime should be copied into the build');
const fontManifest = JSON.parse(readFileSync(join(ROOT, 'assets', 'glyph-arcade', 'fonts', 'manifest.json'), 'utf8'));
for (const file of fontManifest.files.map(entry => entry.file)) {
  assert.ok(existsSync(join(OUT, 'assets', 'glyph-arcade', 'fonts', file)), `${file} should be copied into the build`);
}
assert.deepEqual(
  readdirSync(join(OUT, 'assets', 'glyph-arcade', 'fonts')).filter(file => file.endsWith('.woff2')).sort(),
  fontManifest.files.map(entry => entry.file).sort(),
  'the build must contain only the manifest-listed RedHatMono face',
);

const backgroundTest = html('background-test');
assert.match(backgroundTest, /<title>Background Test · Vince Jiang<\/title>/);
assert.match(backgroundTest, /<meta name="robots" content="noindex, nofollow">/);
assert.match(backgroundTest, /<main class="background-test" aria-label="background gradient test">/);
assert.match(backgroundTest, /等高线 SVG · tools\/gen-topo\.mjs/);
assert.match(backgroundTest, /<div class="bgfx" aria-hidden="true"><\/div>/);
assert.doesNotMatch(backgroundTest, /<div class="ambient-bg"|<svg viewBox="0 0 1440 980"|id="ambient-dot|id="wave-|feMorphology|class="dot-wave-matrix"/);
assert.doesNotMatch(backgroundTest, /<nav class="nav">/);
assert.doesNotMatch(backgroundTest, /<footer class="foot">/);
assert.match(backgroundTest, /\.background-test\{position:relative;z-index:1;min-height:100vh;padding:0\}/);

const paperPage = readFileSync(join(OUT, 'research', 'pension-demo', 'paper-1', 'index.html'), 'utf8');
assert.match(paperPage, /\.side\{[\s\S]*?backdrop-filter:blur\(28px\) saturate\(1\.18\)/);
assert.match(paperPage, /\.flow\{[\s\S]*?backdrop-filter:blur\(10px\) saturate\(1\.05\)/);
assert.match(paperPage, /@media print\{[\s\S]*?body::before\{display:none\}/);

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/</loc>'), 'sitemap should include /research/');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/pension-demo/</loc>'), 'sitemap should include research collection');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/background-test/</loc>'), 'background test should stay out of sitemap');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/mac-buying-demo/</loc>'), 'retired Mac demo should stay out of sitemap');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/glyph-pinball/</loc>'), 'sitemap should include Text Pinball');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/glyph-dino/</loc>'), 'sitemap should exclude retired Dino');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/glyph-surf/</loc>'), 'sitemap should exclude retired Surf');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/blog/pension-demo/</loc>'), 'sitemap should not include old blog collection path');

const llms = readFileSync(join(OUT, 'llms.txt'), 'utf8');
assert.ok(llms.includes('[TYPE//PINBALL](https://vincejiang.com/glyph-pinball/)'), 'llms.txt should include Text Pinball');
assert.ok(!llms.includes('glyph-dino') && !llms.includes('glyph-surf'), 'llms.txt should exclude both retired games');

console.log('site behavior ✓');
