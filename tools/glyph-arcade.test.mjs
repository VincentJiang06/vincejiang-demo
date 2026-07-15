#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');

for (const game of ['glyph-dino', 'glyph-surf']) {
  const html = read(game, 'index.html');
  assert.equal((html.match(/<canvas\b/g) || []).length, 1, `${game} must have exactly one canvas`);
  assert.doesNotMatch(html, /<(?:img|svg|video|picture)\b/i, `${game} must not ship visual media`);
  assert.match(html, /<section class="sr-only"/, `${game} should retain hidden semantic instructions`);
  assert.match(html, /assets\/glyph-arcade\/stage\.css/);
  assert.match(html, /\.\/game\.js/);
}

const engine = read('assets', 'glyph-arcade', 'engine.js');
assert.match(engine, /prepareWithSegments/);
assert.match(engine, /measureNaturalWidth/);
assert.match(engine, /layoutWithLines/);
assert.match(engine, /getPretextUsage/);
assert.match(engine, /publishDiagnostics/);
assert.match(engine, /\.clearRect\(/);
assert.match(engine, /\.fillText\(/);

const visibleSource = [
  engine,
  read('glyph-dino', 'game.js'),
  read('glyph-surf', 'game.js'),
].join('\n');
for (const method of ['fillRect', 'strokeRect', 'drawImage', 'beginPath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'createLinearGradient', 'createRadialGradient']) {
  assert.doesNotMatch(visibleSource, new RegExp(`\\.${method}\\s*\\(`), `visible renderer must not call ${method}()`);
}
assert.doesNotMatch(visibleSource, /\b(?:ctx|context)\.(?:stroke|fill)\s*\(/, 'visible renderer must not stroke or fill paths');

const css = read('assets', 'glyph-arcade', 'stage.css');
assert.equal((css.match(/@font-face\s*\{/g) || []).length, 4, 'four fixed local font faces are required');
assert.doesNotMatch(css, /font-family\s*:[^;]*(?:system-ui|monospace|sans-serif|serif)/i, 'font fallback stacks are forbidden');
assert.doesNotMatch(css, /(?:linear|radial|conic)-gradient\(/i, 'CSS gradients must not draw the game');
assert.doesNotMatch(css, /#[a-z-]+:focus-visible\s*\{[^}]*outline\s*:(?!\s*none)/i, 'focus state must not add non-glyph decoration');

const dino = read('glyph-dino', 'game.js');
assert.match(dino, /pretext:\s*getPretextUsage\(\)/, 'Dino diagnostics must report measured Pretext use');
for (const event of ['SANDSTORM', 'METEOR RAIN', 'FIREFLY MIGRATION', 'THUNDER PULSE', 'FOSSIL BLOOM']) {
  assert.ok(dino.includes(event), `Dino event missing: ${event}`);
}
const surf = read('glyph-surf', 'game.js');
assert.match(surf, /pretext:\s*getPretextUsage\(\)/, 'Surf diagnostics must report measured Pretext use');
for (const mode of ["id: 'endless'", "id: 'time'", "id: 'zigzag'"]) assert.ok(surf.includes(mode), `Surf mode missing: ${mode}`);
for (const event of ['SUN SHOWER', 'SQUALL LINE', 'BIOLUMINESCENT BLOOM', 'WHALE SONG', 'WHIRLPOOL FIELD', 'KRAKEN WAKE']) {
  assert.ok(surf.includes(event), `Surf event missing: ${event}`);
}

const fontRoot = join(ROOT, 'assets', 'glyph-arcade', 'fonts');
const manifest = JSON.parse(read('assets', 'glyph-arcade', 'fonts', 'manifest.json'));
assert.equal(manifest.version, '1.085');
assert.equal(manifest.license, 'OFL-1.1');
assert.ok(existsSync(join(fontRoot, 'RECURSIVE-OFL.txt')), 'Recursive OFL must ship beside the fonts');
for (const entry of manifest.files) {
  const bytes = readFileSync(join(fontRoot, entry.file));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, `${entry.file} hash mismatch`);
}
assert.ok(existsSync(join(ROOT, 'assets', 'glyph-arcade', 'pretext', 'layout.js')), 'vendored Pretext runtime is required');

const site = JSON.parse(read('site.config.json'));
const routes = site.gallery.map(item => item.href);
assert.ok(routes.includes('/glyph-dino/'));
assert.ok(routes.includes('/glyph-surf/'));

console.log('glyph arcade constraints ✓');
