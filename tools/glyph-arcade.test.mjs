#!/usr/bin/env node
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');
const RELEASE_ASSET_VERSION = 'glyph-20260715-pinball1';
const GAME = 'glyph-pinball';

assert.ok(existsSync(join(ROOT, GAME, 'index.html')), 'TYPE//PINBALL HTML is missing');
assert.ok(existsSync(join(ROOT, GAME, 'game.js')), 'TYPE//PINBALL runtime is missing');
assert.ok(existsSync(join(ROOT, GAME, 'physics.js')), 'TYPE//PINBALL physics module is missing');
assert.ok(!existsSync(join(ROOT, 'glyph-dino')), 'retired Dino source must be deleted');
assert.ok(!existsSync(join(ROOT, 'glyph-surf')), 'retired Surf source must be deleted');

const html = read(GAME, 'index.html');
const game = read(GAME, 'game.js');
const physicsSource = read(GAME, 'physics.js');
assert.equal((html.match(/<canvas\b/g) || []).length, 1, 'the game must have exactly one canvas');
assert.equal((html.match(/<svg\b/g) || []).length, 0, 'the game must render without SVG');
assert.doesNotMatch(html, /<(?:img|video|picture)\b/i, 'the game must not ship image or video media');
assert.match(html, /<canvas[^>]+role="application"/i, 'the text field must expose an application role');
assert.match(html, /<section class="sr-only"/, 'semantic instructions must remain available');
assert.match(html, /TYPE\/\/PINBALL/, 'the replacement game title is missing');
assert.ok(html.includes(`stage.css?v=${RELEASE_ASSET_VERSION}`), 'CSS cache key must match this release');
assert.ok(html.includes(`game.js?v=${RELEASE_ASSET_VERSION}`), 'game cache key must match this release');
assert.ok(game.includes(`engine.js?v=${RELEASE_ASSET_VERSION}`), 'engine cache key must match this release');
assert.ok(game.includes(`physics.js?v=${RELEASE_ASSET_VERSION}`), 'physics cache key must match this release');

const engine = read('assets', 'glyph-arcade', 'engine.js');
for (const contract of [
  /prepareWithSegments/,
  /measureNaturalWidth/,
  /layoutWithLines/,
  /layoutNextLine/,
  /getPretextUsage/,
  /publishDiagnostics/,
  /flowText\(/,
  /font:\s*typography\.font/,
  /flowTypographyForSlot/,
  /compressedFamily/,
  /freeFlowIntervals/,
  /flowPreparedCache/,
  /safeTop/,
  /safeBottom/,
  /shouldIgnoreGameKeyTarget\(event\.target\)/,
  /\.clearRect\(/,
  /\.fillText\(/,
]) assert.match(engine, contract, `shared glyph contract missing: ${contract}`);

const { flowTypographyForSlot, freeFlowIntervals, shouldIgnoreGameKeyTarget } = await import('../assets/glyph-arcade/engine.js');
const squeezeOptions = {
  size: 10,
  family: 'linear',
  weight: 400,
  squeeze: {
    minSize: 7,
    maxSize: 11,
    narrowWidth: 44,
    wideWidth: 190,
    compressedFamily: 'casual',
  },
};
const narrowTypography = flowTypographyForSlot(44, squeezeOptions);
const wideTypography = flowTypographyForSlot(220, squeezeOptions);
assert.ok(narrowTypography.size < wideTypography.size, 'narrow text slots must choose a smaller measured font');
assert.equal(narrowTypography.family, 'casual', 'narrow slots must use the compressed font personality');
assert.equal(wideTypography.family, 'linear', 'wide slots must retain the primary family');
assert.notEqual(narrowTypography.font, wideTypography.font, 'slot widths must produce distinct real font specs');
assert.equal(shouldIgnoreGameKeyTarget({ tagName: 'BUTTON' }), true, 'semantic control buttons must keep Space and Enter out of game input');
assert.equal(shouldIgnoreGameKeyTarget({ tagName: 'CANVAS' }), false, 'the focused game canvas must continue receiving game keys');
assert.equal(shouldIgnoreGameKeyTarget({ tagName: 'DIV', isContentEditable: true }), true, 'editable content must not leak keys into the game');

const wordBumper = [{
  id: 'word-bumper',
  padding: 0,
  polygons: [[{ x: 100, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 100 }, { x: 100, y: 100 }]],
}];
assert.deepEqual(
  freeFlowIntervals({ x: 0, y: 0, w: 300, h: 100 }, 20, 40, wordBumper),
  [{ start: 0, end: 100, width: 100 }, { start: 200, end: 300, width: 100 }],
  'a text bumper must split the Pretext line into two live slots',
);

const physics = await import('../glyph-pinball/physics.js');
const {
  reflectIntoRange,
  predictInterceptX,
  movePaddleToward,
  bounceFromPaddle,
  resolveCircleRect,
  scoreBoundary,
  choosePlayerTarget,
  remapPointBetweenArenas,
  stateAllowsPlayerMotion,
  shouldShowTouchToolbar,
  fragmentFitsFreeIntervals,
  resetBumperStates,
} = physics;

assert.equal(shouldShowTouchToolbar(390, false), true, 'compact screens must expose the character toolbar');
assert.equal(shouldShowTouchToolbar(1024, true), true, 'large touch screens must expose the character toolbar');
assert.equal(shouldShowTouchToolbar(1280, false), false, 'wide pointer-only screens should retain the desktop help line');

assert.equal(
  fragmentFitsFreeIntervals({ x: 20, w: 80 }, [{ start: 20, end: 100, width: 80 }]),
  true,
  'a cached Pretext fragment may replay only when its full width is still free',
);
assert.equal(
  fragmentFitsFreeIntervals({ x: 20, w: 80 }, [{ start: 20, end: 56, width: 36 }]),
  false,
  'a cached Pretext fragment must be suppressed when a moving exclusion crosses it',
);
const bumperStates = [
  { variant: 1, active: 0.4, cooldown: 0.08 },
  { variant: 0, active: 0, cooldown: 0 },
];
resetBumperStates(bumperStates);
assert.deepEqual(
  bumperStates,
  [
    { variant: 0, active: 0, cooldown: 0 },
    { variant: 0, active: 0, cooldown: 0 },
  ],
  'reset must clear every transient word-bumper state',
);

for (const [value, min, max, expected] of [
  [30, 0, 100, 30],
  [-20, 0, 100, 20],
  [130, 0, 100, 70],
  [250, 0, 100, 50],
]) assert.equal(reflectIntoRange(value, min, max), expected, `wall-fold failed for ${value}`);

assert.equal(
  predictInterceptX({ x: 50, y: 100, vx: 30, vy: -50 }, 0, 0, 100),
  90,
  'AI prediction must include the future side-wall reflection',
);
assert.equal(
  predictInterceptX({ x: 50, y: 100, vx: 30, vy: 50 }, 0, 0, 100),
  null,
  'AI must not predict an intercept while the ball moves away',
);

assert.deepEqual(
  movePaddleToward(50, 100, 0.1, { maxSpeed: 200, minCenter: 20, maxCenter: 180, deadZone: 2 }),
  { center: 70, velocity: 200 },
  'AI paddle movement must be speed limited',
);
assert.deepEqual(
  movePaddleToward(50, 51, 0.1, { maxSpeed: 200, minCenter: 20, maxCenter: 180, deadZone: 2 }),
  { center: 50, velocity: 0 },
  'AI paddle must hold inside its dead zone',
);
assert.deepEqual(
  movePaddleToward(175, 220, 1, { maxSpeed: 200, minCenter: 20, maxCenter: 180, deadZone: 0 }),
  { center: 180, velocity: 5 },
  'AI paddle movement must remain inside the field',
);

const centeredBounce = bounceFromPaddle(
  { x: 100, y: 600, vx: 0, vy: 280, radius: 8 },
  { centerX: 100, width: 100, velocity: 0 },
  -1,
);
assert.ok(centeredBounce.vy < 0, 'the player paddle must send the ball upward');
assert.ok(Math.abs(centeredBounce.vx) < 1, 'a centered hit should stay almost vertical');
const edgeBounce = bounceFromPaddle(
  { x: 145, y: 600, vx: 0, vy: 280, radius: 8 },
  { centerX: 100, width: 100, velocity: 80 },
  -1,
);
assert.ok(edgeBounce.vx > 120 && edgeBounce.vy < 0, 'an edge hit must create a steerable return angle');
const aiBounce = bounceFromPaddle(
  { x: 60, y: 70, vx: -40, vy: -280, radius: 8 },
  { centerX: 60, width: 96, velocity: -30 },
  1,
);
assert.ok(aiBounce.vy > 0, 'the AI reflector must send the ball back toward the player');

const bumperHit = resolveCircleRect(
  { x: 96, y: 50, vx: 140, vy: 15, radius: 8 },
  { x: 100, y: 30, w: 50, h: 40 },
);
assert.equal(bumperHit.collided, true, 'a word bumper must register a collision');
assert.ok(bumperHit.ball.vx < 0 && bumperHit.ball.x <= 92, 'the ball must reflect and separate from the nearest bumper edge');
const playerBackFace = resolveCircleRect(
  { x: 120, y: 614, vx: 0, vy: 160, radius: 8 },
  { x: 100, y: 600, w: 40, h: 18 },
  'top',
);
assert.equal(playerBackFace.collided, false, 'the player reflector must not re-catch a ball already moving away');
const playerUnderside = resolveCircleRect(
  { x: 120, y: 622, vx: 0, vy: -160, radius: 8 },
  { x: 100, y: 600, w: 40, h: 18 },
  'top',
);
assert.equal(playerUnderside.collided, false, 'the player reflector must reject a ball arriving from its underside');
const playerFrontFace = resolveCircleRect(
  { x: 120, y: 596, vx: 0, vy: 160, radius: 8 },
  { x: 100, y: 600, w: 40, h: 18 },
  'top',
);
assert.equal(playerFrontFace.collided, true, 'the player reflector must catch a descending ball on its top face');
assert.equal(scoreBoundary(-9, 0, 700, 8), 'player', 'crossing the AI edge must score for the player');
assert.equal(scoreBoundary(709, 0, 700, 8), 'ai', 'crossing the player edge must score for the AI');
assert.equal(scoreBoundary(350, 0, 700, 8), null, 'a ball inside the field must not score');
assert.equal(
  stateAllowsPlayerMotion('paused'),
  false,
  'paused play must freeze the player reflector as well as the ball',
);
assert.equal(
  choosePlayerTarget({ left: true, right: false, pointerActive: true, pointerX: 280, pointerY: 650 }, 120, { left: 10, right: 300, height: 700 }),
  10,
  'keyboard input must override a stale pointer position',
);
assert.deepEqual(
  remapPointBetweenArenas({ x: 640, y: 650 }, { left: 12, right: 1268, top: 7, bottom: 713 }, { left: 12, right: 378, top: 7, bottom: 383 }),
  { x: 195, y: 349.448 },
  'resize must preserve the ball position proportionally inside the new arena',
);

assert.match(game, /stage\.flowText\(/, 'the full text field must flow through Pretext');
assert.match(game, /dynamicExclusions\(/, 'moving ball and paddles must drive live text exclusions');
assert.match(game, /function readyBallGeometry\(\)/, 'ready state must expose one shared ball geometry');
assert.match(game, /const visibleBall = game\.state === 'ready' \? readyBallGeometry\(\) : game\.ball;[\s\S]{0,360}circleExclusion\('ball', visibleBall/, 'the visible ready ball and its Pretext exclusion must share one geometry');
assert.match(game, /TEXT_BUMPERS/, 'the field must contain visible word bumpers');
assert.match(game, /TEXT_CORPORA/, 'players must be able to change the flowing text corpus');
assert.match(game, /predictInterceptX\(/, 'the AI reflector must use a projected intercept');
assert.match(game, /movePaddleToward\(/, 'the AI reflector must move through the speed-limited algorithm');
assert.match(game, /AI_REACTION_SECONDS/, 'the AI must have a finite reaction interval');
assert.match(game, /stateAllowsPlayerMotion\(game\.state\)/, 'paused state must gate player motion');
assert.match(game, /remapPointBetweenArenas\(/, 'resize must remap the moving ball and trail');
assert.match(game, /touchToolbarAction\(/, 'mobile players must receive text-only controls beyond movement');
assert.match(game, /shouldShowTouchToolbar\(/, 'toolbar visibility must include large touch screens');
assert.match(game, /fragmentFitsFreeIntervals\(/, 'cached fragments must be checked against current live exclusions');
assert.match(game, /font:\s*fragment\.font/, 'cached 7px fragments must replay with their exact Pretext font');
assert.match(game, /flowCache:\s*\{[\s\S]{0,220}cacheHit/, 'diagnostics must expose reduced-motion cache state');
assert.match(game, /renderPolygonOutline\(/, 'the character Flow Map must trace the real exclusion polygon');
assert.match(game, /flowCache/, 'reduced-motion mode must reduce full-page Pretext reflow frequency');
assert.match(game, /warmupFrames:\s*2/, 'static ready screens must repaint enough frames for a complete desynchronized canvas');
assert.match(game, /addEventListener\('resize',[\s\S]{0,520}input\.reset\(\)/, 'resize must clear stale pointer coordinates after a rotation');
assert.match(game, /function resetMatch\([\s\S]{0,520}resetBumperStates\(game\.bumpers\)/, 'match reset must clear bumper highlight and cooldown state');
assert.match(game, /game\.state = 'point';[\s\S]{0,180}game\.flowCache = null;/, 'point messages must invalidate the running text cache');
assert.match(game, /game\.state = game\.state === 'paused'[\s\S]{0,180}game\.flowCache = null;/, 'pause messages must invalidate the running text cache');
assert.match(game, /game\.pointDelay = nextDelay;[\s\S]{0,180}game\.renderDirty = true;/, 'the visible point countdown must mark its frame dirty');
assert.match(game, /paddle\.w \* 0\.72/, 'the AI prediction error must be large enough to create natural misses');
assert.match(game, /pretext:\s*getPretextUsage\(\)/, 'diagnostics must report measured Pretext use');
assert.match(game, /game\.state === 'paused' && !game\.renderDirty/, 'pause must stop repeated Pretext re-layout');
assert.match(game, /stage\.safeBottom/, 'the player reflector must respect mobile safe areas');
for (const control of ['ArrowLeft', 'KeyA', 'ArrowRight', 'KeyD', 'Space', 'KeyP', 'KeyR', 'KeyC']) {
  assert.ok(game.includes(control), `pinball control missing: ${control}`);
}

const visibleSource = [engine, game, physicsSource].join('\n');
assert.doesNotMatch(visibleSource, /\.(?:measureText|getBBox|getCTM)\s*\(/, 'the game must not bypass Pretext measurement');
for (const method of ['fillRect', 'strokeRect', 'drawImage', 'beginPath', 'moveTo', 'lineTo', 'arc', 'ellipse', 'createLinearGradient', 'createRadialGradient']) {
  assert.doesNotMatch(visibleSource, new RegExp(`\\.${method}\\s*\\(`), `visible renderer must not call ${method}()`);
}
assert.doesNotMatch(visibleSource, /\b(?:ctx|context)\.(?:stroke|fill)\s*\(/, 'visible renderer must not stroke or fill paths');

const css = read('assets', 'glyph-arcade', 'stage.css');
assert.equal((css.match(/@font-face\s*\{/g) || []).length, 4, 'four fixed local font faces are required');
assert.doesNotMatch(css, /font-family\s*:[^;]*(?:system-ui|monospace|sans-serif|serif)/i, 'font fallback stacks are forbidden');
assert.doesNotMatch(css, /(?:linear|radial|conic)-gradient\(/i, 'CSS gradients must not draw the game');
assert.match(css, /safe-area-inset-top/, 'stage CSS must expose notch-safe positioning');
assert.match(css, /safe-area-inset-bottom/, 'stage CSS must expose home-indicator-safe positioning');
assert.doesNotMatch(css, /#vector-stage/, 'the text-only game must not retain a vector layer');
assert.match(css, /height:\s*100vh;\s*height:\s*100dvh;\s*min-height:\s*0/, 'dynamic viewport height must not be expanded by legacy 100vh');
assert.doesNotMatch(html, /user-scalable\s*=\s*no/i, 'mobile users must be allowed to zoom dense small text');
assert.match(css, /touch-action:\s*pinch-zoom/, 'the game surface must preserve two-finger zoom');
assert.match(html, /role="toolbar"/, 'screen readers must receive a semantic controls toolbar');
assert.equal((html.match(/data-pinball-action=/g) || []).length, 6, 'all six character controls need semantic button twins');
assert.match(game, /button\.addEventListener\('keydown',[\s\S]{0,320}event\.stopPropagation\(\)[\s\S]{0,240}applyControlAction/, 'semantic Space and Enter must be consumed before global game input');
assert.match(game, /event\.repeat[\s\S]{0,120}return/, 'held semantic controls must not repeat-toggle game state');
assert.match(css, /\.semantic-toolbar:focus-within[\s\S]{0,900}clip:\s*auto\s*!important/, 'keyboard-focused semantic controls must become visibly discoverable');

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
assert.ok(routes.includes('/glyph-pinball/'), 'Gallery must include TYPE//PINBALL');
assert.ok(!routes.includes('/glyph-dino/'), 'Gallery must not include retired Dino');
assert.ok(!routes.includes('/glyph-surf/'), 'Gallery must not include retired Surf');

console.log('glyph arcade constraints ✓');
