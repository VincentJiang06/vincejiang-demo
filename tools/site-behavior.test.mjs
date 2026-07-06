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
assert.match(home, /data-period/);
assert.match(home, /backdrop-filter:blur\(18px\) saturate\(1\.12\)/);
assert.match(home, /s==='neutral'/);
assert.match(home, /<div class="hero home-hero">/);
assert.match(home, /\.home-hero::before\{content:"";position:absolute;left:0;right:0;/);
assert.doesNotMatch(home, /\.home-hero::before\{[^}]*left:-1\.2rem;right:-1\.2rem;/);
assert.doesNotMatch(home, /\.nav \.in::before/);
assert.match(home, /@keyframes brand-glint/);
assert.match(home, /\.nav \.brand\{font-weight:760;letter-spacing:0;color:transparent;/);
assert.match(home, /\.nav a\.item\{color:var\(--sub\); font-size:\.92rem; padding:\.2rem 0; border-bottom:2px solid transparent;/);
assert.match(home, /\.nav a\.item\.active\{color:var\(--fg\); border-bottom-color:var\(--link\);background:transparent\}/);
assert.doesNotMatch(home, /\.nav a\.item::after/);
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
