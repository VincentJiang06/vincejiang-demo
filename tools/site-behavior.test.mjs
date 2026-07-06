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
assert.match(home, /class="foam-dots"/);
assert.match(home, /class="wave-ribbons"/);
assert.match(home, /\.ambient-bg\{position:fixed;inset:-8vh -6vw;z-index:0;pointer-events:none;overflow:hidden;opacity:1\}/);
assert.match(home, /--ambient-line-a:rgba\(86,96,130,.26\)/);
assert.match(home, /color-mix\(in srgb,var\(--page\) 46%,transparent\) 98%/);
const waveStart = home.indexOf('<g class="wave-ribbons"');
const waveEnd = home.indexOf('<g class="foam-dots"', waveStart);
assert.ok(waveStart > -1 && waveEnd > waveStart, 'wave ribbons should render before foam dots');
const waveRibbons = home.slice(waveStart, waveEnd);
assert.ok((waveRibbons.match(/<path d="/g) || []).length >= 13, 'wave ribbons should add dense horizontal wave lines');
assert.match(waveRibbons, /<g class="wave-ribbons" opacity="\.86">/);
assert.match(waveRibbons, /stroke-dasharray="170 54 28 62"/);
assert.match(waveRibbons, /stroke-dasharray="260 58 42 86"/);
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

const paperPage = readFileSync(join(OUT, 'research', 'pension-demo', 'paper-1', 'index.html'), 'utf8');
assert.match(paperPage, /\.side\{[\s\S]*?backdrop-filter:blur\(28px\) saturate\(1\.18\)/);
assert.match(paperPage, /\.flow\{[\s\S]*?backdrop-filter:blur\(10px\) saturate\(1\.05\)/);
assert.match(paperPage, /@media print\{[\s\S]*?body::before\{display:none\}/);

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/</loc>'), 'sitemap should include /research/');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/pension-demo/</loc>'), 'sitemap should include research collection');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/blog/pension-demo/</loc>'), 'sitemap should not include old blog collection path');

console.log('site behavior ✓');
