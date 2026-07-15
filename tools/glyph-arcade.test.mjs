#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');
const RELEASE_ASSET_VERSION = 'glyph-20260715-pretext3';

for (const game of ['glyph-dino', 'glyph-surf']) {
  const html = read(game, 'index.html');
  assert.equal((html.match(/<canvas\b/g) || []).length, 1, `${game} must have exactly one canvas`);
  assert.equal((html.match(/<svg\b/g) || []).length, 1, `${game} must have exactly one SVG object layer`);
  assert.match(html, /<svg[^>]+id="vector-stage"/i, `${game} must expose the shared vector stage`);
  assert.equal(
    (html.match(/<symbol\b/g) || []).length,
    (html.match(/<symbol\b[^>]+preserveAspectRatio="none"/g) || []).length,
    `${game} symbols must stretch exactly like their normalized flow polygons`,
  );
  assert.doesNotMatch(html, /<(?:img|video|picture)\b/i, `${game} must not ship raster or video media`);
  assert.match(html, /<section class="sr-only"/, `${game} should retain hidden semantic instructions`);
  assert.match(html, /assets\/glyph-arcade\/stage\.css/);
  assert.match(html, /\.\/game\.js/);
  assert.ok(html.includes(`stage.css?v=${RELEASE_ASSET_VERSION}`), `${game} CSS cache key must match this release`);
  assert.ok(html.includes(`game.js?v=${RELEASE_ASSET_VERSION}`), `${game} script cache key must match this release`);
  assert.ok(read(game, 'game.js').includes(`engine.js?v=${RELEASE_ASSET_VERSION}`), `${game} engine cache key must match this release`);
}

const engine = read('assets', 'glyph-arcade', 'engine.js');
assert.match(engine, /prepareWithSegments/);
assert.match(engine, /measureNaturalWidth/);
assert.match(engine, /layoutWithLines/);
assert.match(engine, /layoutNextLine/);
assert.match(engine, /getPretextUsage/);
assert.match(engine, /publishDiagnostics/);
assert.match(engine, /class VectorStage/);
assert.match(engine, /flowText\(/);
assert.match(engine, /flowTypographyForSlot/, 'slot width must select real flow typography');
assert.match(engine, /renderFlowMap\(/, 'SVG exclusions must have a visible Flow Map mode');
assert.match(engine, /compressedFamily/, 'narrow slots must be able to switch font personality');
assert.match(engine, /safeTop/, 'canvas layout must expose device safe-area insets');
assert.match(engine, /freeFlowIntervals/);
assert.match(engine, /flowPreparedCache/, 'flow corpora must be cached outside the animation hot path');
assert.match(engine, /\.clearRect\(/);
assert.match(engine, /\.fillText\(/);

const { flowTypographyForSlot, freeFlowIntervals } = await import('../assets/glyph-arcade/engine.js');
const squeezeOptions = {
  size: 10,
  family: 'linear',
  weight: 400,
  squeeze: {
    minSize: 8,
    maxSize: 10,
    narrowWidth: 48,
    wideWidth: 180,
    compressedFamily: 'casual',
  },
};
const narrowTypography = flowTypographyForSlot(48, squeezeOptions);
const wideTypography = flowTypographyForSlot(220, squeezeOptions);
assert.ok(narrowTypography.size < wideTypography.size, 'narrow slots must render with a smaller measured font');
assert.equal(narrowTypography.family, 'casual', 'narrow slots must activate the configured compressed family');
assert.equal(wideTypography.family, 'linear', 'wide slots must retain the primary family');
assert.notEqual(narrowTypography.font, wideTypography.font, 'Pretext must receive distinct real font specs per slot width');
const centerBlock = [{
  id: 'reef',
  padding: 0,
  polygons: [[{ x: 100, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 100 }, { x: 100, y: 100 }]],
}];
assert.deepEqual(
  freeFlowIntervals({ x: 0, y: 0, w: 300, h: 100 }, 20, 40, centerBlock),
  [{ start: 0, end: 100, width: 100 }, { start: 200, end: 300, width: 100 }],
  'SVG exclusion must split one text band into two flow slots',
);
const shiftedBlock = [{
  id: 'moving-object',
  padding: 0,
  polygons: [[{ x: 0, y: 0 }, { x: 80, y: 0 }, { x: 80, y: 100 }, { x: 0, y: 100 }]],
}];
assert.deepEqual(
  freeFlowIntervals({ x: 0, y: 0, w: 300, h: 100 }, 20, 40, shiftedBlock),
  [{ start: 80, end: 300, width: 220 }],
  'moving an SVG object must produce a new text-flow geometry',
);

const visibleSource = [
  engine,
  read('glyph-dino', 'game.js'),
  read('glyph-surf', 'game.js'),
].join('\n');
assert.doesNotMatch(visibleSource, /\.(?:measureText|getBBox|getCTM)\s*\(/, 'games and flow layout must not bypass Pretext or read SVG geometry');
for (const method of ['fillRect', 'strokeRect', 'drawImage', 'beginPath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'createLinearGradient', 'createRadialGradient']) {
  assert.doesNotMatch(visibleSource, new RegExp(`\\.${method}\\s*\\(`), `visible renderer must not call ${method}()`);
}
assert.doesNotMatch(visibleSource, /\b(?:ctx|context)\.(?:stroke|fill)\s*\(/, 'visible renderer must not stroke or fill paths');

const css = read('assets', 'glyph-arcade', 'stage.css');
assert.equal((css.match(/@font-face\s*\{/g) || []).length, 4, 'four fixed local font faces are required');
assert.doesNotMatch(css, /font-family\s*:[^;]*(?:system-ui|monospace|sans-serif|serif)/i, 'font fallback stacks are forbidden');
assert.doesNotMatch(css, /(?:linear|radial|conic)-gradient\(/i, 'CSS gradients must not draw the game');
assert.match(css, /safe-area-inset-top/, 'shared stage CSS must expose notch-safe positioning');
assert.match(css, /safe-area-inset-bottom/, 'shared stage CSS must expose home-indicator-safe positioning');
assert.doesNotMatch(css, /#[a-z-]+:focus-visible\s*\{[^}]*outline\s*:(?!\s*none)/i, 'focus state must not add non-glyph decoration');
assert.match(css, /#vector-stage/);

const dino = read('glyph-dino', 'game.js');
assert.match(dino, /pretext:\s*getPretextUsage\(\)/, 'Dino diagnostics must report measured Pretext use');
assert.match(dino, /DINO_DIFFICULTY/);
for (const setting of [
  /initialSpeed:\s*215/,
  /maxSpeed:\s*420/,
  /mobileSpeedFactor:\s*0\.88/,
  /firstObstacleDelay:\s*2\.1/,
  /spawnEarly:\s*\[1\.60,\s*2\.35\]/,
  /birdUnlock:\s*450/,
  /vineUnlock:\s*750/,
  /jumpBuffer:\s*0\.10/,
  /coyoteTime:\s*0\.08/,
  /firstEventDelay:\s*12/,
]) assert.match(dino, setting, `Dino easy-mode setting missing: ${setting}`);
assert.match(dino, /stage\.flowText\(/, 'Dino background must flow through Pretext');
assert.match(dino, /vector\.exclusions/, 'Dino flow must consume SVG exclusions');
assert.match(dino, /DINO_TEXT_THEMES/, 'Dino must expose selectable text/object themes');
assert.match(dino, /spawnTypePress\(/, 'Dino must let players summon an SVG type press');
assert.match(dino, /dinoToolbarPointerTarget\(/, 'Dino touch controls must expose Pretext actions');
assert.match(dino, /flowMap:\s*true/, 'Dino must reveal the Flow Map on first load');
assert.match(dino, /vector\.renderFlowMap\(/, 'Dino must draw the same polygons that drive line flow');
assert.match(dino, /squeeze:\s*\{/, 'Dino must change measured typography as slots narrow');
assert.match(dino, /game\.state === 'paused' && !game\.renderDirty/, 'Dino must stop re-layout work while paused');
assert.match(dino, /stage\.safeBottom/, 'Dino touch tools must stay above the device safe area');
for (const control of ['KeyF', 'KeyC', 'KeyX']) assert.ok(dino.includes(control), `Dino Pretext control missing: ${control}`);
assert.match(dino, /pointerJumpHeld/, 'touch hold must receive the same sustained-jump assistance as keyboard hold');
for (const event of ['SANDSTORM', 'METEOR RAIN', 'FIREFLY MIGRATION', 'THUNDER PULSE', 'FOSSIL BLOOM']) {
  assert.ok(dino.includes(event), `Dino event missing: ${event}`);
}
const surf = read('glyph-surf', 'game.js');
assert.match(surf, /pretext:\s*getPretextUsage\(\)/, 'Surf diagnostics must report measured Pretext use');
assert.match(surf, /stage\.flowText\(/, 'Surf water must flow through Pretext');
assert.match(surf, /vector\.exclusions/, 'Surf flow must consume SVG exclusions');
assert.match(surf, /SURF_TEXT_THEMES/, 'Surf must expose selectable water-text themes');
assert.match(surf, /summonReef\(/, 'Surf must let players actively summon a safe reef formation');
assert.match(surf, /surfToolbarPointerTarget\(/, 'Surf touch controls must expose Pretext actions');
assert.match(surf, /flowMap:\s*true/, 'Surf must reveal the Flow Map on first load');
assert.match(surf, /flowLens:/, 'Surf must include a draggable SVG flow lens');
assert.match(surf, /vector\.renderFlowMap\(/, 'Surf must draw the same polygons that drive line flow');
assert.match(surf, /squeeze:\s*\{/, 'Surf must change measured typography as slots narrow');
assert.match(surf, /reefSummonQueued/, 'Zig Zag reef requests must queue instead of deleting an active gate');
assert.match(surf, /activeGates\(\)/, 'Surf reef spawning must account for gates');
assert.match(surf, /FLOW_LENS_HANDLE_POLYGON/, 'the flow lens handle must participate in exclusion geometry');
assert.match(surf, /game\.state === 'paused' && !game\.renderDirty/, 'Surf must stop re-layout work while paused');
assert.match(surf, /stage\.safeTop/, 'Surf HUD and tools must stay below the device safe area');
for (const control of ['KeyF', 'KeyC', 'KeyX', 'KeyV']) assert.ok(surf.includes(control), `Surf Pretext control missing: ${control}`);
assert.match(surf, /game\.rng\.int\(2,\s*3\)/, 'REEF RISE must create a cluster of two or three reefs');
assert.match(surf, /const channel = compact \? 110/, 'mobile reef formations must retain a 110px safe channel');
assert.match(surf, /variant\.colliders\.some/, 'large reefs must use forgiving multi-circle collision');
assert.match(surf, /game\.firstEventPending && reefRise/, 'the signature reef cluster should appear during the first run');
assert.match(surf, /resultsMenuPointerHit/, 'touch players must be able to return to the Surf mode menu');
for (const mode of ["id: 'endless'", "id: 'time'", "id: 'zigzag'"]) assert.ok(surf.includes(mode), `Surf mode missing: ${mode}`);
for (const event of ['SUN SHOWER', 'SQUALL LINE', 'BIOLUMINESCENT BLOOM', 'WHALE SONG', 'WHIRLPOOL FIELD', 'KRAKEN WAKE', 'REEF RISE']) {
  assert.ok(surf.includes(event), `Surf event missing: ${event}`);
}

const dinoHtml = read('glyph-dino', 'index.html');
for (const symbol of ['dino-run-a', 'dino-run-b', 'dino-duck', 'dino-cactus', 'dino-bird']) {
  assert.ok(dinoHtml.includes(`id="${symbol}"`), `Dino SVG symbol missing: ${symbol}`);
}
assert.ok(dinoHtml.includes('id="dino-type-press"'), 'Dino SVG type press symbol missing');
const surfHtml = read('glyph-surf', 'index.html');
for (const symbol of ['reef-crown', 'reef-garden', 'reef-atoll', 'reef-chain']) {
  assert.ok(surfHtml.includes(`id="${symbol}"`), `Surf SVG reef missing: ${symbol}`);
}
assert.ok(surfHtml.includes('id="flow-lens"'), 'Surf SVG flow lens symbol missing');

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
