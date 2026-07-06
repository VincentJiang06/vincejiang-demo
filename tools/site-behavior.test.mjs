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

assert.match(home, /<a class="item" href="\/research\/">Research<\/a>/);
assert.doesNotMatch(home, /class="item special"/);
assert.ok(existsSync(join(OUT, 'research', 'index.html')), 'Research index should be generated');

const research = html('research');
assert.match(research, /<h1>Research<\/h1>/);
assert.equal((research.match(/class="research-pair"/g) || []).length, 1);

const pair = research.match(/<section class="research-pair"[\s\S]*?<\/section>/)?.[0] || '';
assert.ok(pair.includes('href="/blog/pension-demo/"'), 'paper collection card should be in the pair');
assert.ok(pair.includes('href="/blog/pension-demo-revision/"'), 'revision collection card should be in the pair');
assert.equal((pair.match(/class="research-card card/g) || []).length, 2);

const sitemap = readFileSync(join(OUT, 'sitemap.xml'), 'utf8');
assert.ok(sitemap.includes('<loc>https://vincejiang.com/research/</loc>'), 'sitemap should include /research/');

console.log('site behavior ✓');
