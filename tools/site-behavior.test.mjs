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
assert.match(home, /s==='neutral'/);
assert.match(home, /<div class="hero home-hero">/);
assert.match(home, /<a class="item" href="\/research\/">Research<\/a>/);
assert.doesNotMatch(home, /class="item special"/);
assert.match(home, /<section class="research-home card">/);
assert.doesNotMatch(home, /class="research-pair card compact"/);
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

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/</loc>'), 'sitemap should include /research/');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/pension-demo/</loc>'), 'sitemap should include research collection');
assert.ok(!sitemap.includes('<loc>https://vincejiang.com/blog/pension-demo/</loc>'), 'sitemap should not include old blog collection path');

console.log('site behavior ✓');
