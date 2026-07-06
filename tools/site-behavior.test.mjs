#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
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

assert.match(home, /<div class="ambient-bg" aria-hidden="true">/);
assert.match(home, /<svg viewBox="0 0 1440 980" preserveAspectRatio="xMidYMid slice" role="img">/);
assert.doesNotMatch(home, /preserveAspectRatio="none"/);
assert.doesNotMatch(home, /class="foam-dots"/);
assert.doesNotMatch(home, /class="wave-ribbons"/);
assert.doesNotMatch(home, /class="wave-echo"/);
assert.match(home, /id="ambient-dot-grid"/);
assert.match(home, /<style>\.ambient-dot\{r:1px\}<\/style>/);
assert.match(home, /<pattern id="ambient-dot-grid" width="31" height="31" patternUnits="userSpaceOnUse" patternTransform="translate\(-8 -4\)">/);
assert.match(home, /<animateTransform attributeName="patternTransform" type="translate" values="-8 -4;8 6;-8 -4" dur="22s" repeatCount="indefinite"\/>/);
assert.match(home, /<circle class="ambient-dot" cx="4" cy="4" fill="url\(#ambient-stroke\)" opacity="\.62"\/>/);
assert.doesNotMatch(home, /id="ambient-dot-wave-grid"/);
assert.doesNotMatch(home, /r="2\.55"/);
assert.match(home, /<g id="wave-source" fill="none">/);
assert.match(home, /<filter id="wave-dot-grow"/);
assert.match(home, /<feMorphology in="SourceGraphic" operator="dilate" radius="1\.45" result="grown"\/>/);
assert.match(home, /<mask id="wave-response-mask" maskUnits="userSpaceOnUse" x="-180" y="-100" width="1800" height="1180">/);
assert.match(home, /stroke-width="128" opacity="\.88"/);
assert.match(home, /class="dot-field wave-reactive" mask="url\(#wave-response-mask\)" filter="url\(#wave-dot-grow\)" opacity="\.72"/);
assert.doesNotMatch(home, /rx="1\.5"/);
assert.match(home, /\.ambient-bg\{position:fixed;inset:-8vh -6vw;z-index:0;pointer-events:none;overflow:hidden;opacity:1\}/);
assert.match(home, /--ambient-line-a:rgba\(86,96,130,.26\)/);
assert.match(home, /color-mix\(in srgb,var\(--page\) 46%,transparent\) 98%/);
const ambientBg = home.slice(home.indexOf('<div class="ambient-bg"'), home.indexOf('</div>', home.indexOf('<div class="ambient-bg"')));
assert.equal((ambientBg.match(/<rect /g) || []).length, 2, 'ambient background should reuse one dot source twice: base plus wave-reactive filter layer');
assert.match(home, /<feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G"\/>/);
assert.match(home, /<animateTransform attributeName="transform" type="translate" values="-24 -12;24 12;-24 -12" dur="18s" repeatCount="indefinite"\/>/);
assert.doesNotMatch(ambientBg, /values="0 -7;0 9;0 -7"/);
assert.doesNotMatch(ambientBg, /stroke-dasharray="20 30"/);
assert.match(home, /data-period/);
assert.match(home, /backdrop-filter:blur\(18px\) saturate\(1\.12\)/);
assert.match(home, /s==='neutral'/);
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
assert.match(home, /\.research-card\{display:grid;grid-template-columns:auto minmax\(0,1fr\) auto;gap:\.85rem;align-items:center;\n  padding:\.86rem 0;color:inherit;border-top:1px solid var\(--border\);transition:color \.14s\}/);
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
assert.equal((pair.match(/class="research-card /g) || []).length, 2);
assert.ok(pair.includes('class="research-card-list"'), 'collection rows should be grouped in a list');
assert.ok(existsSync(join(OUT, 'research', 'pension-demo', 'index.html')), 'paper collection should live under /research/');
assert.ok(existsSync(join(OUT, 'research', 'pension-demo-revision', 'index.html')), 'revision collection should live under /research/');
assert.ok(!existsSync(join(OUT, 'blog', 'pension-demo')), 'paper collection should not live under /blog/');
assert.ok(!existsSync(join(OUT, 'blog', 'pension-demo-revision')), 'revision collection should not live under /blog/');

const blogIndex = html('blog');
const galleryIndex = html('gallery');
assert.match(blogIndex, /<main class="wrap narrow index-page">/);
assert.match(galleryIndex, /<main class="wrap narrow index-page">/);

const backgroundTest = html('background-test');
assert.match(backgroundTest, /<title>Background Test · Vince Jiang<\/title>/);
assert.match(backgroundTest, /<meta name="robots" content="noindex, nofollow">/);
assert.match(backgroundTest, /<main class="background-test" aria-label="background svg test">/);
assert.match(backgroundTest, /id="ambient-dot-grid"/);
assert.match(backgroundTest, /class="dot-field wave-reactive"/);
assert.match(backgroundTest, /id="wave-dot-grow"/);
assert.match(backgroundTest, /id="wave-response-mask"/);
assert.doesNotMatch(backgroundTest, /id="ambient-dot-wave-grid"|r="2\.55"|class="dot-wave-matrix"/);
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
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/blog/pension-demo/</loc>'), 'sitemap should not include old blog collection path');

console.log('site behavior ✓');
