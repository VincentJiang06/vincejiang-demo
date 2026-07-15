import {
  GlyphStage,
  InputState,
  SeededRandom,
  VectorStage,
  clamp,
  createLoop,
  distance,
  fontSpec,
  getPretextUsage,
  hsl,
  loadBest,
  saveBest,
  setSemanticStatus,
  textWidth,
  waitForGlyphFonts,
} from '/assets/glyph-arcade/engine.js?v=glyph-20260715-pretext3';

export const SURF_MODES = Object.freeze([
  { id: 'endless', key: '1', label: 'ENDLESS', goal: 'Ride until the last heart sinks.' },
  { id: 'time', key: '2', label: 'TIME TRIAL', goal: 'Reach 1800m. Coins cut 1.5 seconds.' },
  { id: 'zigzag', key: '3', label: 'ZIG ZAG', goal: 'Thread every gate and build a streak.' },
]);

export const SURF_PALETTES = Object.freeze([
  { name: 'AZURE CURRENT', deep: 214, surface: 190, foam: 172, sand: 42, danger: 344 },
  { name: 'VIOLET TIDE', deep: 252, surface: 224, foam: 194, sand: 26, danger: 8 },
  { name: 'SUNSET REEF', deep: 226, surface: 188, foam: 52, sand: 30, danger: 326 },
  { name: 'BIO LAGOON', deep: 194, surface: 162, foam: 124, sand: 52, danger: 288 },
]);

const EVENTS = Object.freeze([
  { name: 'SUN SHOWER', duration: 9 },
  { name: 'SQUALL LINE', duration: 7 },
  { name: 'BIOLUMINESCENT BLOOM', duration: 10 },
  { name: 'WHALE SONG', duration: 7 },
  { name: 'WHIRLPOOL FIELD', duration: 9 },
  { name: 'KRAKEN WAKE', duration: 8, endlessOnly: true },
  { name: 'REEF RISE', duration: 10 },
]);

export const SURF_TEXT_THEMES = Object.freeze([
  Object.freeze({
    id: 'oceanography',
    label: 'OCEANOGRAPHY',
    family: 'linear',
    hue: 186,
    corpus: 'oceanography log / wind transfers momentum into the surface layer / wave period measures the interval between successive crests / bathymetry redirects swell through refraction / salinity and temperature set seawater density / the thermocline separates warm mixed water from the cold deep layer / longshore current follows the coast / upwelling carries nutrient rich water toward sunlight /',
  }),
  Object.freeze({
    id: 'ecology',
    label: 'REEF ECOLOGY',
    family: 'casual',
    hue: 132,
    corpus: 'reef ecology field notes / coral polyps build calcium carbonate habitat / seagrass meadows shelter juvenile fish and bind sediment / cleaner wrasse remove parasites from visiting fish / mangrove roots slow the tide and protect the coast / plankton blooms convert sunlight into food / herbivores keep algae from covering young coral / biodiversity increases resilience after a storm /',
  }),
  Object.freeze({
    id: 'navigation',
    label: 'NAVIGATION',
    family: 'linear',
    hue: 48,
    corpus: 'navigation watch / red port mark and green starboard mark define the channel / steer a compass course corrected for current and leeway / depth soundings reveal shoals beneath the surface / a bearing line joins observer and landmark / latitude follows parallels while longitude follows meridians / keep a safe speed and scan the horizon / plot position time course and distance in the log /',
  }),
  Object.freeze({
    id: 'weather',
    label: 'MARINE WEATHER',
    family: 'casual',
    hue: 306,
    corpus: 'marine weather bulletin / falling pressure can announce an approaching front / cumulus towers grow where warm humid air rises / a squall produces a sudden increase in wind / sea breeze moves inland as land warms faster than water / swell can arrive before the distant storm / visibility falls inside rain and spray / read cloud wind pressure and wave direction together /',
  }),
]);

const FLOW_LENS_POLYGON = Object.freeze([
  [0.5, 0.02], [0.72, 0.07], [0.89, 0.21], [0.98, 0.42],
  [0.95, 0.64], [0.84, 0.81], [0.68, 0.91], [0.58, 0.99],
  [0.4, 0.96], [0.21, 0.84], [0.07, 0.65], [0.03, 0.36],
]);

const FLOW_LENS_HANDLE_POLYGON = Object.freeze([
  [0.70, 0.76], [0.77, 0.69], [1, 0.91], [0.92, 1],
]);

const SURF_TOOLBAR = Object.freeze([
  Object.freeze({ action: 'flow', label: '[F FLOW]' }),
  Object.freeze({ action: 'topic', label: '[C TOPIC]' }),
  Object.freeze({ action: 'reef', label: '[X REEF+]' }),
  Object.freeze({ action: 'lens', label: '[V LENS]' }),
]);

const VECTOR_OBJECTS = Object.freeze({
  island: { symbol: 'island', width: 72, height: 62, r: 31, harmful: true, flow: [[[0.05, 0.56], [0.18, 0.2], [0.55, 0.08], [0.92, 0.36], [0.98, 0.9], [0.08, 0.92]]] },
  coral: { symbol: 'coral', width: 48, height: 54, r: 20, harmful: true, flow: [[[0.08, 0.18], [0.92, 0.12], [0.9, 0.94], [0.12, 0.94]]] },
  log: { symbol: 'log', width: 76, height: 34, r: 25, harmful: true, flow: [[[0.04, 0.25], [0.96, 0.25], [0.96, 0.76], [0.04, 0.76]]] },
  buoy: { symbol: 'buoy', width: 34, height: 52, r: 14, harmful: true, flow: [[[0.18, 0.04], [0.82, 0.04], [0.96, 0.9], [0.04, 0.9]]] },
  coin: { symbol: 'coin', width: 30, height: 30, r: 13, pickup: true, flow: [[[0.08, 0.08], [0.92, 0.08], [0.92, 0.92], [0.08, 0.92]]] },
  boost: { symbol: 'boost', width: 34, height: 34, r: 14, pickup: true, flow: [[[0.5, 0.02], [0.98, 0.5], [0.5, 0.98], [0.02, 0.5]]] },
  friend: { symbol: 'friend', width: 38, height: 50, r: 18, pickup: true, flow: [[[0.12, 0.04], [0.88, 0.04], [0.94, 0.96], [0.06, 0.96]]] },
});

const REEF_VARIANTS = Object.freeze({
  crown: {
    symbol: 'reef-crown', aspect: 1.05,
    flow: [[[0.02, 0.84], [0.18, 0.52], [0.3, 0.2], [0.5, 0.04], [0.72, 0.28], [0.98, 0.82], [0.95, 0.98], [0.04, 0.98]]],
    colliders: [[0.25, 0.72, 0.18], [0.5, 0.65, 0.2], [0.76, 0.73, 0.17]],
  },
  garden: {
    symbol: 'reef-garden', aspect: 1.2,
    flow: [[[0.03, 0.7], [0.17, 0.35], [0.34, 0.55], [0.5, 0.14], [0.67, 0.5], [0.82, 0.34], [0.98, 0.72], [0.94, 0.96], [0.05, 0.96]]],
    colliders: [[0.25, 0.75, 0.17], [0.5, 0.72, 0.19], [0.76, 0.75, 0.17]],
  },
  atoll: {
    symbol: 'reef-atoll', aspect: 1.15,
    flow: [
      [[0.05, 0.1], [0.78, 0.04], [0.94, 0.3], [0.2, 0.42]],
      [[0.02, 0.22], [0.32, 0.2], [0.34, 0.82], [0.05, 0.86]],
      [[0.05, 0.65], [0.34, 0.54], [0.76, 0.68], [0.72, 0.98], [0.14, 0.96]],
    ],
    colliders: [[0.25, 0.27, 0.18], [0.17, 0.55, 0.18], [0.38, 0.82, 0.2], [0.67, 0.8, 0.14]],
  },
  chain: {
    symbol: 'reef-chain', aspect: 1.35,
    flow: [
      [[0.01, 0.72], [0.14, 0.38], [0.34, 0.78], [0.36, 0.96], [0.02, 0.96]],
      [[0.31, 0.84], [0.5, 0.48], [0.74, 0.82], [0.73, 0.98], [0.34, 0.98]],
      [[0.65, 0.88], [0.86, 0.58], [0.99, 0.9], [0.98, 1], [0.68, 1]],
    ],
    colliders: [[0.2, 0.76, 0.16], [0.54, 0.78, 0.17], [0.86, 0.84, 0.13]],
  },
});

const canvas = document.getElementById('glyph-stage');
const vector = new VectorStage(document.getElementById('vector-stage'));
const stage = new GlyphStage(canvas);
const input = new InputState(canvas);

const game = {
  state: 'ready',
  modeIndex: 0,
  time: 0,
  visualTime: 0,
  elapsed: 0,
  distance: 0,
  displayScore: 0,
  best: {
    endless: loadBest('glyph-surf-best-endless'),
    time: loadBest('glyph-surf-best-time'),
    zigzag: loadBest('glyph-surf-best-zigzag'),
  },
  seed: 0x51F7C0DE,
  rng: new SeededRandom(0x51F7C0DE),
  speed: 250,
  spawnTimer: 0.8,
  gateTimer: 0.5,
  reefTimer: 7.5,
  serial: 0,
  safeLaneX: 0,
  paletteIndex: 0,
  event: null,
  lastEventName: null,
  eventLeft: 0,
  eventCooldown: 3.25,
  firstEventPending: true,
  slowMode: false,
  highVisibility: false,
  themeIndex: 0,
  flowMap: true,
  flowLens: {
    active: true,
    dragging: false,
    initialized: false,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  },
  pointerControl: null,
  reefSummonCooldown: 0,
  reefSummonQueued: false,
  renderDirty: true,
  flow: { fragments: [], slots: 0 },
  surfer: { x: 0, vx: 0, hearts: 3, boost: 100, invulnerable: 0, shield: 0 },
  objects: [],
  wake: [],
  gatesPassed: 0,
  streak: 0,
  maxStreak: 0,
  coins: 0,
  penalties: 0,
  nextGateLeft: true,
};

function mode() { return SURF_MODES[game.modeIndex]; }

function textTheme() { return SURF_TEXT_THEMES[game.themeIndex]; }

function toolbarLayout() {
  const width = Math.min(stage.width - 12, stage.width < 600 ? 420 : 680);
  const x = (stage.width - width) / 2;
  const top = stage.safeTop + 55;
  const height = 31;
  const itemWidth = width / SURF_TOOLBAR.length;
  return { x, top, height, width, itemWidth, bottom: top + height };
}

export function surfToolbarPointerTarget(pointerX, pointerY) {
  const layout = toolbarLayout();
  if (
    pointerX < layout.x
    || pointerX > layout.x + layout.width
    || pointerY < layout.top
    || pointerY > layout.bottom
  ) return null;
  const index = clamp(Math.floor((pointerX - layout.x) / layout.itemWidth), 0, SURF_TOOLBAR.length - 1);
  return SURF_TOOLBAR[index].action;
}

function flowLensSize() {
  return stage.width < 600 ? 86 : 122;
}

function ensureFlowLensPosition() {
  const size = flowLensSize();
  const radius = size / 2;
  const minY = toolbarLayout().bottom + radius + 9;
  if (!game.flowLens.initialized) {
    // Start off-centre, not at the edge: the two resulting slots deliberately
    // land on different discrete 8/9/10px typography levels.
    game.flowLens.x = stage.width * (stage.width < 600 ? 0.72 : 0.78);
    game.flowLens.y = minY;
    game.flowLens.initialized = true;
  }
  game.flowLens.x = clamp(game.flowLens.x, radius + 3, stage.width - radius - 3);
  game.flowLens.y = clamp(game.flowLens.y, minY, stage.height - radius - 3);
}

function flowLensPointerHit(pointerX, pointerY) {
  if (!game.flowLens.active) return false;
  ensureFlowLensPosition();
  const radius = flowLensSize() * 0.54;
  return distance({ x: pointerX, y: pointerY }, game.flowLens) <= radius;
}

function cycleTextTheme() {
  game.themeIndex = (game.themeIndex + 1) % SURF_TEXT_THEMES.length;
  const theme = textTheme();
  game.renderDirty = true;
  setSemanticStatus(`Pretext 海洋主题切换为 ${theme.label}，字流使用 ${theme.family} 字体。`);
}

function toggleFlowMap() {
  game.flowMap = !game.flowMap;
  game.renderDirty = true;
  setSemanticStatus(`Pretext Flow Map ${game.flowMap ? '已开启' : '已关闭'}。`);
}

function toggleFlowLens() {
  game.flowLens.active = !game.flowLens.active;
  game.flowLens.dragging = false;
  if (game.flowLens.active) ensureFlowLensPosition();
  game.renderDirty = true;
  setSemanticStatus(`SVG 排版透镜 ${game.flowLens.active ? '已开启，可以拖动观察文字绕排' : '已关闭'}。`);
}

function applyPretextAction(action) {
  if (action === 'flow') toggleFlowMap();
  else if (action === 'topic') cycleTextTheme();
  else if (action === 'reef') summonReef();
  else if (action === 'lens') toggleFlowLens();
}

function reset() {
  const fixedSeed = mode().id === 'time' ? 0x7A11BEEF : (0x51F7C0DE + Math.floor(performance.now())) >>> 0;
  game.seed = fixedSeed;
  game.rng = new SeededRandom(fixedSeed);
  game.state = 'running';
  game.time = 0;
  game.elapsed = 0;
  game.distance = 0;
  game.displayScore = 0;
  game.speed = 250;
  game.spawnTimer = 0.7;
  game.gateTimer = 0.35;
  game.reefTimer = mode().id === 'time' ? 9 : 7.5;
  game.serial = 0;
  game.safeLaneX = stage.width / 2;
  game.paletteIndex = 0;
  game.event = null;
  game.lastEventName = null;
  game.eventLeft = 0;
  game.eventCooldown = 5.5;
  game.firstEventPending = true;
  game.reefSummonCooldown = 0;
  game.reefSummonQueued = false;
  game.renderDirty = true;
  game.pointerControl = null;
  game.flowLens.dragging = false;
  game.flow = { fragments: [], slots: 0 };
  game.surfer.x = stage.width / 2;
  game.surfer.vx = 0;
  game.surfer.hearts = 3;
  game.surfer.boost = 100;
  game.surfer.invulnerable = 0;
  game.surfer.shield = 0;
  game.objects.length = 0;
  game.wake.length = 0;
  game.gatesPassed = 0;
  game.streak = 0;
  game.maxStreak = 0;
  game.coins = 0;
  game.penalties = 0;
  game.nextGateLeft = true;
  setSemanticStatus(`${mode().label} 模式开始。三颗生命。`);
}

function objectConfig(kind) {
  return VECTOR_OBJECTS[kind];
}

function spawnWorldObject() {
  const currentMode = mode().id;
  let choices = currentMode === 'time'
    ? ['island', 'coral', 'log', 'coin', 'coin', 'boost']
    : ['island', 'coral', 'log', 'buoy', 'coin', 'boost'];
  if (currentMode === 'endless' && game.distance > 500) choices = [...choices, 'friend'];
  const kind = game.rng.pick(choices);
  const config = objectConfig(kind);
  const scale = stage.width < 600 ? 0.82 : 1;
  const width = config.width * scale;
  const height = config.height * scale;
  const margin = Math.max(40, width / 2 + 12);
  game.objects.push({
    id: `object-${game.serial += 1}`,
    kind,
    x: game.rng.range(margin, stage.width - margin),
    y: -height / 2 - 16,
    width,
    height,
    r: config.r * scale,
    harmful: !!config.harmful,
    pickup: !!config.pickup,
    phase: game.rng.range(0, Math.PI * 2),
    checked: false,
  });
  game.spawnTimer = game.rng.range(0.75, 1.35);
}

function spawnGate() {
  const margin = Math.min(110, stage.width * 0.21);
  const width = clamp(180 - game.gatesPassed * 1.2, 92, 180);
  const x = game.nextGateLeft
    ? game.rng.range(margin, stage.width * 0.44)
    : game.rng.range(stage.width * 0.56, stage.width - margin);
  game.nextGateLeft = !game.nextGateLeft;
  game.objects.push({ id: `gate-${game.serial += 1}`, kind: 'gate', x, y: -55, r: width / 2, width, checked: false, phase: 0 });
  game.gateTimer = game.rng.range(1.18, 1.55);
}

function activeReefs() {
  return game.objects.filter(object => object.kind === 'reef' && !object.dead);
}

function activeGates() {
  return game.objects.filter(object => object.kind === 'gate' && !object.dead);
}

function spawnReefFormation(isEvent = false) {
  if (mode().id === 'zigzag' && activeGates().length) return false;
  const compact = stage.width < 600;
  const channel = compact ? 110 : Math.max(130, Math.min(170, stage.width * 0.22));
  const preferredLaneX = game.surfer.x || stage.width / 2;
  const laneX = clamp(
    preferredLaneX + game.rng.range(-channel * 0.22, channel * 0.22),
    channel / 2 + 62,
    stage.width - channel / 2 - 62,
  );
  game.objects = game.objects.filter(object => (
    object.kind === 'reef' || (!object.harmful && object.kind !== 'gate')
  ));
  const count = isEvent ? game.rng.int(2, 3) : 1;
  const names = Object.keys(REEF_VARIANTS);
  const firstSide = game.rng.next() < 0.5 ? 'left' : 'right';
  for (let index = 0; index < count; index += 1) {
    const variantName = names[(game.rng.int(0, names.length - 1) + index) % names.length];
    const variant = REEF_VARIANTS[variantName];
    const side = index % 2 ? (firstSide === 'left' ? 'right' : 'left') : firstSide;
    const desiredWidth = compact ? game.rng.range(132, 184) : game.rng.range(205, 310);
    const width = Math.min(desiredWidth, stage.width - channel - 18);
    const height = width / variant.aspect;
    const laneLeft = laneX - channel / 2;
    const laneRight = laneX + channel / 2;
    const x = side === 'left' ? laneLeft - 9 - width / 2 : laneRight + 9 + width / 2;
    game.objects.push({
      id: `reef-${game.serial += 1}`,
      kind: 'reef',
      variant: variantName,
      side,
      x,
      y: -height / 2 + (isEvent ? index * 54 : 0),
      width,
      height,
      harmful: true,
      phase: game.rng.range(0, Math.PI * 2),
      rotate: game.rng.range(-3, 3),
      hitCooldown: 0,
    });
  }
  game.safeLaneX = laneX;
  game.reefTimer = game.rng.range(isEvent ? 15 : 11.5, isEvent ? 19 : 16.5);
  game.spawnTimer = Math.max(game.spawnTimer, 2.4);
  game.gateTimer = Math.max(game.gateTimer, 2.2);
  setSemanticStatus(`大型礁石升起，安全航道宽度 ${Math.round(channel)} 像素。`);
  return true;
}

export function summonReef() {
  if (game.state !== 'running') {
    setSemanticStatus('先开始冲浪，再用 X / REEF+ 主动升起安全礁石。');
    game.renderDirty = true;
    return false;
  }
  if (game.reefSummonCooldown > 0 || activeReefs().length > 0) return false;
  if (mode().id === 'zigzag' && activeGates().length) {
    game.reefSummonQueued = true;
    setSemanticStatus('REEF+ 已排队：通过当前门后再升起礁石，门不会被删除。');
    return true;
  }
  const existing = new Set(game.objects.map(object => object.id));
  if (!spawnReefFormation(true)) return false;
  const summoned = activeReefs().filter(object => !existing.has(object.id));
  summoned.forEach((reef, index) => {
    // Reveal the formation immediately while keeping the corridor calculated by
    // spawnReefFormation intact. Only vertical placement changes here.
    reef.y = Math.max(reef.y, reef.height * 0.12 + index * Math.min(44, reef.height * 0.2));
  });
  game.reefSummonCooldown = 14;
  game.reefSummonQueued = false;
  setSemanticStatus(`主动升起 ${summoned.length} 座 SVG 礁石；Pretext 正沿安全航道重新排字。`);
  return true;
}

function spawnEvent() {
  const candidates = EVENTS.filter(event => (
    (!event.endlessOnly || mode().id === 'endless')
    && (event.name !== 'REEF RISE' || (activeReefs().length === 0 && activeGates().length === 0))
  ));
  const freshCandidates = candidates.filter(event => event.name !== game.lastEventName);
  const reefRise = freshCandidates.find(event => event.name === 'REEF RISE');
  const next = game.firstEventPending && reefRise
    ? reefRise
    : game.rng.pick(freshCandidates.length ? freshCandidates : candidates);
  game.firstEventPending = false;
  game.event = next;
  game.lastEventName = next.name;
  game.eventLeft = next.duration;
  game.eventCooldown = game.rng.range(12, 18);
  if (next.name === 'REEF RISE') spawnReefFormation(true);
  setSemanticStatus(`海况事件：${next.name}。`);
}

function damage() {
  if (game.surfer.invulnerable > 0) return;
  if (game.surfer.shield > 0) {
    game.surfer.shield = 0;
    game.surfer.invulnerable = 0.8;
    return;
  }
  if (mode().id === 'time') {
    game.penalties += 2;
  } else {
    game.surfer.hearts -= 1;
  }
  game.surfer.boost = 0;
  game.surfer.invulnerable = 1.15;
  game.surfer.vx *= -0.35;
  for (let index = 0; index < 34; index += 1) {
    game.wake.push({
      x: game.surfer.x + game.rng.range(-26, 26),
      y: stage.height * 0.73 + game.rng.range(-14, 14),
      vx: game.rng.range(-80, 80),
      vy: game.rng.range(-80, 20),
      life: game.rng.range(0.4, 1.1),
      char: game.rng.pick(['o', 'O', '.', '*', '+']),
    });
  }
  if (game.surfer.hearts <= 0 && mode().id !== 'time') finish(false);
}

function collect(object) {
  if (object.kind === 'coin') game.coins += 1;
  if (object.kind === 'boost') game.surfer.boost = Math.min(100, game.surfer.boost + 42);
  if (object.kind === 'friend') {
    game.surfer.shield = 1;
    setSemanticStatus('救起一位朋友，获得一次保护。');
  }
  object.dead = true;
}

function finish(completed) {
  if (game.state !== 'running') return;
  game.state = 'results';
  const currentMode = mode().id;
  let result = 0;
  if (currentMode === 'endless') {
    result = Math.floor(game.distance);
    if (result > game.best.endless) {
      game.best.endless = result;
      saveBest('glyph-surf-best-endless', result);
    }
  } else if (currentMode === 'time') {
    result = Math.max(0, game.elapsed + game.penalties - game.coins * 1.5);
    if (!game.best.time || result < game.best.time) {
      game.best.time = Number(result.toFixed(2));
      saveBest('glyph-surf-best-time', game.best.time);
    }
  } else {
    result = game.maxStreak;
    if (result > game.best.zigzag) {
      game.best.zigzag = result;
      saveBest('glyph-surf-best-zigzag', result);
    }
  }
  game.displayScore = result;
  setSemanticStatus(`${mode().label} 结束。成绩 ${typeof result === 'number' ? result.toFixed(currentMode === 'time' ? 2 : 0) : result}${completed ? '，完成赛道。' : '。'}`);
}

function updateWake(dt) {
  for (const particle of game.wake) {
    particle.x += particle.vx * dt;
    particle.y += (particle.vy + game.speed * 0.24) * dt;
    particle.vx *= 0.985;
    particle.life -= dt;
  }
  game.wake = game.wake.filter(particle => particle.life > 0 && particle.y < stage.height + 40);
}

function emitWake() {
  if (game.wake.length > 170) return;
  const biolume = game.event?.name === 'BIOLUMINESCENT BLOOM';
  game.wake.push({
    x: game.surfer.x + game.rng.range(-13, 13),
    y: stage.height * 0.75 + game.rng.range(23, 38),
    vx: game.rng.range(-18, 18),
    vy: game.rng.range(8, 40),
    life: game.rng.range(biolume ? 0.9 : 0.35, biolume ? 2.2 : 1.0),
    char: game.rng.pick(['.', ':', 'o', 's', 'v', "'"]),
  });
}

function gamepadSteer() {
  try {
    const pad = navigator.getGamepads?.()[0];
    if (!pad) return { steer: 0, boost: false, brake: false };
    const axis = Math.abs(pad.axes[0] || 0) > 0.18 ? pad.axes[0] : 0;
    return { steer: axis, boost: !!pad.buttons[0]?.pressed, brake: !!pad.buttons[1]?.pressed };
  } catch {
    return { steer: 0, boost: false, brake: false };
  }
}

function overlayLayout() {
  const compact = stage.width < 600;
  const width = Math.min(stage.width - 28, compact ? 360 : 660);
  const height = compact ? 330 : 365;
  const x = (stage.width - width) / 2;
  const y = Math.max(toolbarLayout().bottom + 8, (stage.height - height) / 2 - 12);
  const menuStep = compact ? 42 : 48;
  const menuFirstY = y + 150;
  const startY = y + height - (compact ? 52 : 54);
  const startWidth = Math.min(width - 64, compact ? 280 : 360);
  return {
    compact,
    width,
    height,
    x,
    y,
    menuStep,
    menuFirstY,
    startY,
    startWidth,
    startX: (stage.width - startWidth) / 2,
  };
}

function menuPointerTarget(pointerX, pointerY) {
  const layout = overlayLayout();
  if (pointerX >= layout.x + 20 && pointerX <= layout.x + layout.width - 20) {
    for (let index = 0; index < SURF_MODES.length; index += 1) {
      const rowY = layout.menuFirstY + index * layout.menuStep;
      const rowHalfHeight = layout.compact ? 20 : 23;
      if (pointerY >= rowY - rowHalfHeight && pointerY <= rowY + rowHalfHeight) {
        return { type: 'mode', index };
      }
    }
  }
  if (
    pointerX >= layout.startX
    && pointerX <= layout.startX + layout.startWidth
    && pointerY >= layout.startY - 23
    && pointerY <= layout.startY + 8
  ) {
    return { type: 'start' };
  }
  return null;
}

function resultsMenuPointerHit(pointerX, pointerY) {
  const layout = overlayLayout();
  const centerY = layout.y + layout.height - 57;
  const halfWidth = Math.min(120, layout.width * 0.34);
  return pointerX >= stage.width / 2 - halfWidth
    && pointerX <= stage.width / 2 + halfWidth
    && pointerY >= centerY - 18
    && pointerY <= centerY + 10;
}

function update(dt) {
  const select1 = input.pressed('Digit1', 'Numpad1');
  const select2 = input.pressed('Digit2', 'Numpad2');
  const select3 = input.pressed('Digit3', 'Numpad3');
  const selectedMode = select1 ? 0 : select2 ? 1 : select3 ? 2 : null;
  if ((game.state === 'ready' || game.state === 'results') && selectedMode !== null) {
    game.modeIndex = selectedMode;
    if (game.state === 'results') {
      game.state = 'ready';
      setSemanticStatus(`已选择 ${mode().label} 模式。按空格或点击 START 开始。`);
    }
  }
  if (input.pressed('KeyH')) {
    game.highVisibility = !game.highVisibility;
    game.renderDirty = true;
  }
  if (input.pressed('KeyL')) {
    game.slowMode = !game.slowMode;
    game.renderDirty = true;
  }
  if (input.pressed('KeyF')) toggleFlowMap();
  if (input.pressed('KeyC')) cycleTextTheme();
  if (input.pressed('KeyX')) summonReef();
  if (input.pressed('KeyV')) toggleFlowLens();
  if (input.pressed('KeyG') && game.state !== 'running') location.href = '/gallery/';
  if (input.pressed('KeyM') && game.state === 'results') game.state = 'ready';
  if (input.pressed('KeyP', 'Escape') && (game.state === 'running' || game.state === 'paused')) {
    game.state = game.state === 'paused' ? 'running' : 'paused';
    game.renderDirty = true;
  }
  if (game.state !== 'paused') game.visualTime += dt;

  const keyboardStart = input.pressed('Space', 'Enter');
  const pointerStart = input.pressed('PointerDown');
  let pointerConsumed = false;
  if (!input.pointer.down) {
    if (game.flowLens.dragging || game.pointerControl !== null) game.renderDirty = true;
    game.flowLens.dragging = false;
    game.pointerControl = null;
  }
  if (pointerStart) {
    const toolbarAction = surfToolbarPointerTarget(input.pointer.x, input.pointer.y);
    if (toolbarAction) {
      game.pointerControl = 'toolbar';
      applyPretextAction(toolbarAction);
      pointerConsumed = true;
    } else if (flowLensPointerHit(input.pointer.x, input.pointer.y)) {
      game.pointerControl = 'lens';
      game.flowLens.dragging = true;
      game.flowLens.offsetX = input.pointer.x - game.flowLens.x;
      game.flowLens.offsetY = input.pointer.y - game.flowLens.y;
      pointerConsumed = true;
      setSemanticStatus('正在拖动 SVG 排版透镜；Pretext 字流实时绕过十二边排版边界。');
    }
  }
  if (game.flowLens.dragging && input.pointer.down) {
    const radius = flowLensSize() / 2;
    const minY = toolbarLayout().bottom + radius + 9;
    game.flowLens.x = clamp(input.pointer.x - game.flowLens.offsetX, radius + 3, stage.width - radius - 3);
    game.flowLens.y = clamp(input.pointer.y - game.flowLens.offsetY, minY, stage.height - radius - 3);
    game.renderDirty = true;
  }
  if (game.state === 'ready') {
    if (pointerStart && !pointerConsumed) {
      const target = menuPointerTarget(input.pointer.x, input.pointer.y);
      if (target?.type === 'mode') {
        game.modeIndex = target.index;
        setSemanticStatus(`已选择 ${mode().label} 模式。点击 START 开始。`);
      } else if (target?.type === 'start') {
        reset();
      }
    } else if (keyboardStart && !pointerConsumed) reset();
    return;
  }
  if (game.state === 'results') {
    if (pointerStart && !pointerConsumed && resultsMenuPointerHit(input.pointer.x, input.pointer.y)) {
      game.state = 'ready';
      setSemanticStatus(`已返回模式菜单。当前选择 ${mode().label}。`);
      return;
    }
    if ((!pointerConsumed && (keyboardStart || pointerStart)) || input.pressed('KeyR')) reset();
    updateWake(dt * 0.35);
    return;
  }
  if (game.state === 'paused') return;

  game.time += dt;
  game.elapsed += dt;
  game.reefSummonCooldown = Math.max(0, game.reefSummonCooldown - dt);
  const pad = gamepadSteer();
  let steer = 0;
  if (input.held('ArrowLeft', 'KeyA')) steer -= 1;
  if (input.held('ArrowRight', 'KeyD')) steer += 1;
  if (Math.abs(pad.steer) > Math.abs(steer)) steer = pad.steer;
  const pointerRiding = input.pointer.down && game.pointerControl === null;
  if (pointerRiding && !input.held('ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD')) {
    steer = clamp((input.pointer.x - game.surfer.x) / Math.max(90, stage.width * 0.18), -1, 1);
  }
  const boost = input.held('ArrowUp', 'KeyW') || pointerRiding || pad.boost;
  const brake = input.held('ArrowDown', 'KeyS') || pad.brake;
  const speedFactor = game.slowMode ? 0.72 : 1;
  const boostPower = boost && game.surfer.boost > 0 ? 1 : 0;
  if (boostPower) game.surfer.boost = Math.max(0, game.surfer.boost - 28 * dt);
  else game.surfer.boost = Math.min(100, game.surfer.boost + 8 * dt);

  const modeBoost = mode().id === 'zigzag' ? game.gatesPassed * 0.6 : game.distance * 0.012;
  game.speed = (250 + Math.min(160, modeBoost) + boostPower * 120) * speedFactor * (brake ? 0.66 : 1);
  const squall = game.event?.name === 'SQUALL LINE' ? Math.sin(game.time * 1.7) * 85 : 0;
  const whirl = game.event?.name === 'WHIRLPOOL FIELD' ? (stage.width / 2 - game.surfer.x) * 0.34 : 0;
  const targetVx = steer * (brake ? 310 : 255) + squall + whirl;
  game.surfer.vx += (targetVx - game.surfer.vx) * Math.min(1, dt * (brake ? 8 : 5));
  game.surfer.x = clamp(game.surfer.x + game.surfer.vx * dt, 35, stage.width - 35);
  game.surfer.invulnerable = Math.max(0, game.surfer.invulnerable - dt);
  game.surfer.shield = Math.max(0, game.surfer.shield - dt * 0.02);
  game.distance += game.speed * dt * 0.052;
  game.paletteIndex = Math.floor(game.distance / 480) % SURF_PALETTES.length;
  emitWake();

  game.reefTimer -= dt;
  let reefsPresent = activeReefs().length > 0;
  let gatesPresent = activeGates().length > 0;
  if (mode().id === 'zigzag' && game.reefSummonQueued && !reefsPresent && !gatesPresent) {
    game.reefSummonQueued = false;
    reefsPresent = summonReef();
  }
  if (game.reefTimer <= 0 && !reefsPresent && !gatesPresent && game.event?.name !== 'WHIRLPOOL FIELD') {
    spawnReefFormation(false);
    reefsPresent = true;
  }

  if (mode().id === 'zigzag' && !reefsPresent && !game.reefSummonQueued) {
    game.gateTimer -= dt;
    if (game.gateTimer <= 0) spawnGate();
  } else if (mode().id !== 'zigzag' && !reefsPresent) {
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) spawnWorldObject();
  }

  for (const object of game.objects) {
    object.y += game.speed * dt;
    if (object.hitCooldown) object.hitCooldown = Math.max(0, object.hitCooldown - dt);
    if (object.kind === 'gate') {
      const playerY = stage.height * 0.74;
      if (!object.checked && object.y >= playerY) {
        object.checked = true;
        const passed = Math.abs(game.surfer.x - object.x) <= object.width / 2;
        if (passed) {
          game.streak += 1;
          game.maxStreak = Math.max(game.maxStreak, game.streak);
          game.gatesPassed += 1;
        } else {
          game.streak = 0;
          damage();
        }
      }
      continue;
    }
    const player = { x: game.surfer.x, y: stage.height * 0.74 };
    if (object.kind === 'reef') {
      const variant = REEF_VARIANTS[object.variant];
      const scale = Math.min(object.width, object.height);
      const hit = variant.colliders.some(([cx, cy, radius]) => distance(player, {
        x: object.x - object.width / 2 + cx * object.width,
        y: object.y - object.height / 2 + cy * object.height,
      }) < radius * scale + 9);
      if (hit && !object.hitCooldown) {
        damage();
        object.hitCooldown = 1.35;
        const direction = object.side === 'left' ? 1 : -1;
        game.surfer.x = clamp(game.surfer.x + direction * 34, 35, stage.width - 35);
        game.surfer.vx = direction * 175;
      }
      continue;
    }
    if (!object.dead && distance(player, object) < object.r + 14) {
      if (object.pickup) collect(object);
      else if (object.harmful) damage();
      object.dead = true;
    }
  }
  game.objects = game.objects.filter(object => (
    !object.dead && object.y < stage.height + (object.kind === 'reef' ? object.height / 2 + 70 : 100)
  ));
  gatesPresent = activeGates().length > 0;
  if (mode().id === 'zigzag' && game.reefSummonQueued && !activeReefs().length && !gatesPresent) {
    game.reefSummonQueued = false;
    summonReef();
  }

  game.eventCooldown -= dt;
  if (!game.event && game.eventCooldown <= 0) spawnEvent();
  if (game.event) {
    game.eventLeft -= dt;
    if (game.eventLeft <= 0) game.event = null;
  }

  if (mode().id === 'time' && game.distance >= 1800) finish(true);
  updateWake(dt);
}

function addRectExclusion(id, x, y, width, height, padding = 0) {
  vector.exclusions.push({
    id,
    padding,
    polygons: [[
      { x, y }, { x: x + width, y },
      { x: x + width, y: y + height }, { x, y: y + height },
    ]],
  });
}

function drawVectorScene(palette) {
  vector.beginFrame(stage.width, stage.height);
  if (game.state === 'ready') {
    const compact = stage.width < 600;
    const scale = compact ? 0.72 : 1;
    const layout = overlayLayout();
    vector.use('menu-reef-left', 'reef-crown', {
      x: -42 * scale, y: stage.height * 0.08, width: 230 * scale, height: 210 * scale,
      opacity: 0.54, rotate: -4, flowPolygons: REEF_VARIANTS.crown.flow, flowPadding: 8,
    });
    vector.use('menu-reef-right', 'reef-atoll', {
      x: compact ? stage.width - 88 : stage.width - 195,
      y: compact ? layout.y + layout.height + 28 : stage.height * 0.61,
      width: compact ? 180 : 245,
      height: compact ? 158 : 214,
      opacity: 0.5, rotate: 5, flowPolygons: REEF_VARIANTS.atoll.flow, flowPadding: 8,
    });
  } else {
    for (const object of game.objects) {
      if (object.kind === 'reef') {
        const variant = REEF_VARIANTS[object.variant];
        vector.use(object.id, variant.symbol, {
          x: object.x - object.width / 2,
          y: object.y - object.height / 2,
          width: object.width,
          height: object.height,
          rotate: object.rotate + Math.sin(game.visualTime * 0.7 + object.phase) * 1.3,
          flowPolygons: variant.flow,
          flowPadding: 8,
        });
        continue;
      }
      if (object.kind === 'gate') {
        const postWidth = stage.width < 600 ? 22 : 28;
        const postHeight = stage.width < 600 ? 38 : 48;
        for (const [side, x] of [['left', object.x - object.width / 2], ['right', object.x + object.width / 2]]) {
          vector.use(`${object.id}-${side}`, 'gate-post', {
            x: x - postWidth / 2, y: object.y - postHeight / 2,
            width: postWidth, height: postHeight,
            flowPolygon: [[0.1, 0], [0.9, 0], [1, 1], [0, 1]], flowPadding: 3,
          });
        }
        continue;
      }
      const config = objectConfig(object.kind);
      vector.use(object.id, config.symbol, {
        x: object.x - object.width / 2,
        y: object.y - object.height / 2,
        width: object.width,
        height: object.height,
        rotate: object.kind === 'log' ? Math.sin(game.visualTime + object.phase) * 8 : 0,
        flowPolygons: config.flow,
        flowPadding: object.pickup ? 3 : 5,
      });
    }
  }

  if (game.state !== 'ready') {
    const surferWidth = stage.width < 600 ? 48 : 62;
    const surferHeight = stage.width < 600 ? 66 : 82;
    const surferY = stage.height * 0.74;
    const surferAlpha = game.surfer.invulnerable > 0 && Math.floor(game.time * 16) % 2 ? 0.35 : 1;
    vector.use('player-surfer', 'surfer', {
      x: game.surfer.x - surferWidth / 2,
      y: surferY - surferHeight / 2,
      width: surferWidth,
      height: surferHeight,
      rotate: clamp(game.surfer.vx * 0.035, -12, 12),
      opacity: surferAlpha,
      color: hsl(palette.danger + 12, 94, 67),
      flowPolygon: [[0.28, 0.02], [0.72, 0.02], [0.9, 0.96], [0.1, 0.96]],
      flowPadding: 5,
    });
    if (game.surfer.shield > 0) {
      vector.use('player-shield', 'shield-ring', {
        x: game.surfer.x - surferWidth * 0.66,
        y: surferY - surferHeight * 0.57,
        width: surferWidth * 1.32,
        height: surferHeight * 1.14,
        rotate: game.visualTime * 18,
        opacity: 0.86,
      });
    }
  }

  if (game.flowLens.active) {
    ensureFlowLensPosition();
    const theme = textTheme();
    const size = flowLensSize();
    vector.use('pretext-flow-lens', 'flow-lens', {
      x: game.flowLens.x - size / 2,
      y: game.flowLens.y - size / 2,
      width: size,
      height: size,
      rotate: Math.sin(game.visualTime * 0.82) * 3.5,
      opacity: game.flowLens.dragging ? 1 : 0.88,
      color: hsl(theme.hue, 100, 76),
      cssVars: {
        '--highlight': hsl(theme.hue + 54, 100, 72),
        '--spark': hsl(theme.hue + 154, 100, 70),
      },
      flowPolygons: [FLOW_LENS_POLYGON, FLOW_LENS_HANDLE_POLYGON],
      flowPadding: 7,
    });
  }

  const toolbar = toolbarLayout();
  addRectExclusion('hud', 0, 0, stage.width, toolbar.bottom + 2, 2);
  if (game.event?.name === 'REEF RISE') {
    const labelWidth = Math.min(stage.width - 24, stage.width < 600 ? 268 : 390);
    addRectExclusion('reef-rise-label', (stage.width - labelWidth) / 2, toolbar.bottom + 5, labelWidth, 23, 3);
  }
  if (game.state !== 'running') {
    const layout = overlayLayout();
    addRectExclusion('overlay', layout.x, layout.y, layout.width, layout.height, 8);
  }
  const theme = textTheme();
  const flowMapResult = vector.renderFlowMap(game.flowMap, {
    stroke: hsl(theme.hue + 42, 100, 74),
    fill: hsl(theme.hue, 92, 50, 0.045),
    strokeWidth: game.flowLens.dragging ? 1.8 : 1.15,
    dashArray: game.flowLens.dragging ? '3 3' : '7 5',
    opacity: 0.82,
  });
  vector.endFrame();
  return flowMapResult;
}

function drawWater(now, palette) {
  const compact = stage.width < 600;
  const theme = textTheme();
  const lineHeight = compact ? 12 : 14;
  const eventHue = game.event?.name === 'BIOLUMINESCENT BLOOM' ? -42
    : game.event?.name === 'SUN SHOWER' ? 34
      : game.event?.name === 'SQUALL LINE' ? 32
        : 0;
  game.flow = stage.flowText(theme.corpus, { x: 3, y: 0, w: stage.width - 6, h: stage.height }, vector.exclusions, {
    size: 10,
    lineHeight,
    family: theme.family,
    weight: 400,
    minWidth: compact ? 32 : 42,
    targetCharacters: 24000,
    squeeze: {
      minSize: 8,
      maxSize: 10,
      sizes: [8, 9, 10],
      narrowWidth: compact ? 32 : 160,
      wideWidth: compact ? 148 : Math.min(420, Math.max(300, stage.width * 0.32)),
      compressedFamily: 'casual',
      compressedBelow: compact ? 76 : 240,
    },
    color: ({ row, slot, baseline }) => {
      const depth = baseline / Math.max(1, stage.height);
      const wave = Math.sin(row * 0.48 + slot * 1.7 + now * 1.25);
      return hsl(theme.hue + depth * 46 + eventHue + row * 1.1 + slot * 8, 72 + row % 19, 29 + depth * 31 + wave * 5, 0.58 + (row % 5) * 0.07);
    },
  });
  if (game.flowMap) {
    const markerFont = fontSpec(7, 'casual', 700);
    for (let index = 0; index < game.flow.fragments.length; index += 4) {
      const fragment = game.flow.fragments[index];
      stage.glyph('‹', fragment.x - 2, fragment.y + fragment.h - 2, {
        font: markerFont,
        color: hsl(theme.hue + 84, 100, 78, 0.72),
        align: 'right',
      });
      stage.glyph('›', fragment.x + fragment.w + 2, fragment.y + fragment.h - 2, {
        font: markerFont,
        color: hsl(theme.hue + 164, 100, 75, 0.72),
      });
    }
  }
}

function drawEvent(now, palette) {
  const event = game.event?.name;
  if (!event) return;
  if (event === 'SUN SHOWER' || event === 'SQUALL LINE') {
    const char = event === 'SUN SHOWER' ? "'" : '/';
    const font = fontSpec(stage.width < 600 ? 14 : 19, 'casual', event === 'SQUALL LINE' ? 700 : 400);
    for (let index = 0; index < (stage.width < 600 ? 55 : 110); index += 1) {
      const x = (index * 73 + now * (event === 'SQUALL LINE' ? 210 : 86)) % (stage.width + 120) - 60;
      const y = (index * 47 + now * 120) % stage.height;
      stage.glyph(char, x, y, {
        font,
        color: hsl(event === 'SUN SHOWER' ? 52 + index : 270 + index * 0.7, 98, 68 + index % 5 * 5, 0.62),
      });
    }
  } else if (event === 'WHALE SONG') {
    const centerY = stage.height * 0.35 + Math.sin(now * 0.7) * 25;
    const centerX = (now * 58) % (stage.width + 340) - 170;
    const font = fontSpec(stage.width < 600 ? 20 : 30, 'casual', 700);
    stage.sequence('((  W H A L E  ))', centerX, centerY, {
      font,
      tracking: 2,
      color: (_char, index) => hsl(palette.deep + 35 + index * 2.5, 74, 50 + index % 4 * 7, 0.58),
    });
  } else if (event === 'WHIRLPOOL FIELD') {
    const font = fontSpec(stage.width < 600 ? 16 : 22, 'casual', 700);
    const centerX = stage.width / 2;
    const centerY = stage.height * 0.43;
    for (let index = 0; index < 70; index += 1) {
      const radius = 20 + (index % 14) * 9;
      const angle = now * (0.8 + index % 5 * 0.08) + index * 0.74;
      stage.glyph(index % 3 ? ')' : '@', centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius * 0.42, {
        font,
        color: hsl(palette.surface + index * 1.8, 88, 54 + index % 5 * 6, 0.66),
      });
    }
  } else if (event === 'KRAKEN WAKE') {
    const font = fontSpec(stage.width < 600 ? 28 : 42, 'casual', 700);
    for (let index = 0; index < 18; index += 1) {
      const x = index * (stage.width / 17) + Math.sin(now * 1.3 + index) * 18;
      const y = stage.height - 16 - (index % 4) * 23;
      stage.glyph(index % 2 ? 'S' : '}', x, y, {
        font,
        color: hsl(palette.danger + index * 4, 98, 55 + index % 4 * 7, 0.78),
      });
    }
  } else if (event === 'REEF RISE') {
    stage.glyph('REEF RISE // FOLLOW THE OPEN WATER', stage.width / 2, toolbarLayout().bottom + 21, {
      font: fontSpec(stage.width < 600 ? 9 : 13, 'casual', 700),
      color: hsl(palette.sand + now * 18, 100, 72),
      align: 'center',
    });
  }
}

function drawWake(palette) {
  const font = fontSpec(stage.width < 600 ? 12 : 15, 'casual', 700);
  const biolume = game.event?.name === 'BIOLUMINESCENT BLOOM';
  for (const particle of game.wake) {
    const hue = biolume ? 142 + particle.life * 48 : palette.foam + particle.life * 28;
    stage.glyph(particle.char, particle.x, particle.y, {
      font,
      color: hsl(hue, 96, 63 + particle.life * 16, particle.life),
    });
  }
}

function drawGate(object, palette) {
  const y = object.y;
  const left = object.x - object.width / 2;
  const right = object.x + object.width / 2;
  const font = fontSpec(stage.width < 600 ? 13 : 17, 'linear', 700);
  for (let offset = -25; offset <= 25; offset += 13) {
    stage.glyph(offset % 2 ? '!' : 'I', left, y + offset, {
      font,
      color: hsl(palette.danger + offset * 0.9, 100, 67 + Math.abs(offset) % 8),
      align: 'center',
    });
    stage.glyph(offset % 2 ? 'I' : '!', right, y + offset, {
      font,
      color: hsl(palette.foam + offset * 0.8, 100, 72),
      align: 'center',
    });
  }
  stage.sequence('. . . . . . .', left + 8, y, {
    font: fontSpec(11, 'linear', 400),
    tracking: Math.max(1, object.width / 18),
    color: (_char, index) => hsl(palette.foam + index * 5, 96, 72, 0.75),
  });
}

function drawObjects(palette) {
  for (const object of game.objects) {
    if (object.kind === 'gate') {
      drawGate(object, palette);
      continue;
    }
    if (game.highVisibility && object.harmful) {
      const radius = object.kind === 'reef' ? Math.min(object.width, object.height) * 0.38 : object.r;
      const outlineFont = fontSpec(stage.width < 600 ? 8 : 10, 'linear', 700);
      for (let index = 0; index < 12; index += 1) {
        const angle = index / 14 * Math.PI * 2;
        stage.glyph('!', object.x + Math.cos(angle) * (radius + 7), object.y + Math.sin(angle) * (radius + 7), {
          font: outlineFont,
          color: index % 2 ? '#fff56b' : '#ff477e',
          alpha: 0.9,
          align: 'center',
        });
      }
    }
  }
}

function drawSurfer(palette) {
  // The player is an SVG object; only its wake remains typographic.
}

function formatBest() {
  if (mode().id === 'endless') return `${Math.floor(game.best.endless)}m`;
  if (mode().id === 'time') return game.best.time ? `${Number(game.best.time).toFixed(2)}s` : '--';
  return `${game.best.zigzag}`;
}

function drawHud(palette) {
  const compact = stage.width < 600;
  const theme = textTheme();
  const font = fontSpec(compact ? 8 : 10, 'linear', 700);
  const hearts = mode().id === 'time' ? `PENALTY +${game.penalties}s` : `${'H'.repeat(game.surfer.hearts)}${'.'.repeat(Math.max(0, 3 - game.surfer.hearts))}`;
  const score = mode().id === 'time'
    ? `${game.elapsed.toFixed(1)}s  ${Math.floor(game.distance)}/1800m  COINS:${game.coins}`
    : mode().id === 'zigzag'
      ? `STREAK:${game.streak}  MAX:${game.maxStreak}  GATES:${game.gatesPassed}`
      : `${Math.floor(game.distance).toString().padStart(5, '0')}m`;
  stage.glyph(`SURF//GLYPH  ${mode().label}  ${hearts}`, 9, stage.safeTop + 18, { font, color: hsl(palette.foam, 98, 74) });
  stage.glyph(`${score}  BEST:${formatBest()}`, stage.width - 9, stage.safeTop + 18, {
    font,
    color: hsl(palette.surface + 78, 94, 72),
    align: 'right',
  });
  const meter = Math.round(game.surfer.boost / 10);
  stage.glyph(`BOOST ${'+'.repeat(meter)}${'.'.repeat(10 - meter)}`, 9, stage.safeTop + 36, {
    font: fontSpec(compact ? 8 : 9, 'casual', 700),
    color: hsl(52 + meter * 2, 100, 66),
  });
  const reefWarning = game.reefSummonQueued
    ? '  REEF QUEUED'
    : game.state === 'running' && game.reefTimer > 0 && game.reefTimer < 1.6 ? '  REEF AHEAD' : '';
  stage.glyph(`${game.event ? `EVENT:${game.event.name}` : theme.label}${reefWarning}  H:${game.highVisibility ? 'HIGH' : 'COLOR'}  L:${game.slowMode ? 'SLOW' : 'FULL'}`, stage.width - 9, stage.safeTop + 36, {
    font: fontSpec(8, 'linear', 400),
    color: hsl(palette.danger + 20, 92, 72),
    align: 'right',
  });

  const flow = stage.flowDiagnostics;
  const fontSizes = flow.fontSizes.length ? flow.fontSizes.join('/') : '--';
  const families = flow.families.length ? flow.families.join('/') : '--';
  const metricsFont = fontSpec(compact ? 7 : 8, 'linear', 700);
  stage.glyph(`PTX LIVE  slots:${flow.slots}  exclusions:${flow.exclusions}`, 9, stage.safeTop + 51, {
    font: metricsFont,
    color: hsl(theme.hue + 18, 100, 76),
  });
  stage.glyph(`fontSizes:${fontSizes}  families:${families}`, stage.width - 9, stage.safeTop + 51, {
    font: metricsFont,
    color: hsl(theme.hue + 126, 100, 76),
    align: 'right',
  });

  const toolbar = toolbarLayout();
  for (let index = 0; index < SURF_TOOLBAR.length; index += 1) {
    const item = SURF_TOOLBAR[index];
    const itemX = toolbar.x + index * toolbar.itemWidth;
    const enabled = item.action === 'flow' ? game.flowMap
      : item.action === 'lens' ? game.flowLens.active
        : item.action === 'reef'
          ? game.state === 'running' && !game.reefSummonQueued && game.reefSummonCooldown <= 0 && activeReefs().length === 0
          : true;
    const label = item.action === 'reef' && game.reefSummonQueued ? '[X QUEUED]' : item.label;
    const itemHue = theme.hue + index * 58;
    stage.dottedFrame(itemX + 1, toolbar.top, toolbar.itemWidth - 3, toolbar.height, {
      size: compact ? 7 : 8,
      glyph: enabled ? '+' : '.',
      color: hsl(itemHue, enabled ? 100 : 48, enabled ? 72 : 49, enabled ? 0.9 : 0.6),
    });
    stage.glyph(label, itemX + toolbar.itemWidth / 2, toolbar.top + 20, {
      font: fontSpec(compact ? 7.5 : 9, item.action === 'topic' ? theme.family : 'linear', 700),
      color: hsl(itemHue + 22, enabled ? 100 : 42, enabled ? 76 : 58),
      align: 'center',
    });
  }
}

function drawOverlay(palette) {
  if (game.state === 'running') return;
  const layout = overlayLayout();
  const { compact, width, height, x, y } = layout;
  stage.dottedFrame(x, y, width, height, { color: hsl(palette.foam, 100, 73), glyph: game.state === 'results' ? '+' : '.' });
  stage.glyph(game.state === 'ready' ? 'SURF//GLYPH' : game.state === 'paused' ? 'CURRENT//PAUSED' : 'TIDE//RESULT', stage.width / 2, y + 50, {
    font: fontSpec(compact ? 21 : 33, 'casual', 700),
    color: hsl(palette.foam, 100, 72),
    align: 'center',
  });

  if (game.state === 'ready') {
    stage.paragraph('Drag the SVG lens or change the factual ocean corpus now. During the ride, use REEF+ to raise a safe reef corridor. Pretext remeasures 8–10px proportional type and reflows every line around the moving shapes:', x + 28, y + 82, width - 56, {
      size: compact ? 9 : 11,
      lineHeight: compact ? 13 : 16,
      color: hsl(palette.surface + 42, 76, 79),
    });
    for (let index = 0; index < SURF_MODES.length; index += 1) {
      const item = SURF_MODES[index];
      const active = index === game.modeIndex;
      const rowY = layout.menuFirstY + index * layout.menuStep;
      stage.glyph(`${active ? '>>' : '  '} ${item.key}. ${item.label}`, x + 35, rowY, {
        font: fontSpec(compact ? 11 : 14, active ? 'casual' : 'linear', 700),
        color: hsl(active ? palette.foam : palette.surface + index * 18, 96, active ? 72 : 62),
      });
      stage.glyph(item.goal, x + 35, rowY + 17, {
        font: fontSpec(8, 'linear', 400),
        color: hsl(palette.deep + 95 + index * 9, 72, 70),
      });
    }
    stage.dottedFrame(layout.startX, layout.startY - 23, layout.startWidth, 31, {
      color: hsl(palette.foam + 24, 100, 73),
      glyph: Math.floor(game.visualTime * 3) % 2 ? '.' : '+',
    });
    stage.glyph('[ START CURRENT ]', stage.width / 2, layout.startY, {
      font: fontSpec(compact ? 10 : 13, 'casual', 700),
      color: hsl(palette.foam + 32, 100, 76),
      align: 'center',
    });
  } else {
    const resultText = game.state === 'paused'
      ? 'The current and every event timer are frozen.'
      : mode().id === 'time'
        ? `RAW ${game.elapsed.toFixed(2)}s  +${game.penalties}s  -${(game.coins * 1.5).toFixed(1)}s  = ${Number(game.displayScore).toFixed(2)}s`
        : mode().id === 'zigzag'
          ? `MAX STREAK ${game.maxStreak}  TOTAL GATES ${game.gatesPassed}`
          : `DISTANCE ${Math.floor(game.distance)}m  BEST ${Math.floor(game.best.endless)}m`;
    stage.paragraph(resultText, x + 30, y + 105, width - 60, {
      size: compact ? 11 : 15,
      lineHeight: compact ? 16 : 21,
      family: 'casual',
      weight: 700,
      color: hsl(palette.surface + 62, 96, 72),
    });
    stage.glyph(game.state === 'paused' ? '[ P / ESC : RESUME ]' : '[ SPACE / TAP : AGAIN ]', stage.width / 2, y + height - 88, {
      font: fontSpec(compact ? 10 : 14, 'linear', 700),
      color: hsl(palette.foam, 100, 73),
      align: 'center',
    });
    if (game.state === 'results') {
      const menuButtonWidth = Math.min(240, width * 0.68);
      stage.dottedFrame(stage.width / 2 - menuButtonWidth / 2, y + height - 75, menuButtonWidth, 25, {
        color: hsl(palette.danger, 92, 70),
        glyph: '.',
      });
      stage.glyph('[ M / TAP HERE : MODE MENU ]', stage.width / 2, y + height - 57, {
        font: fontSpec(compact ? 9 : 11, 'linear', 700),
        color: hsl(palette.danger, 92, 70),
        align: 'center',
      });
    }
  }
  stage.glyph('F flow map  C topic  X reef+  V lens/drag  |  A/D steer  W boost  S brake  P pause', stage.width / 2, y + height - 25, {
    font: fontSpec(compact ? 8 : 10, 'linear', 400),
    color: hsl(palette.surface + 95, 78, 70),
    align: 'center',
  });
}

function render() {
  if (game.state === 'paused' && !game.renderDirty) return;
  const palette = SURF_PALETTES[game.paletteIndex];
  stage.clear();
  const flowMapResult = drawVectorScene(palette);
  drawWater(game.visualTime, palette);
  drawEvent(game.visualTime, palette);
  drawWake(palette);
  drawObjects(palette);
  drawSurfer(palette);
  drawHud(palette);
  drawOverlay(palette);
  stage.publishDiagnostics({
    game: 'surf',
    state: game.state,
    mode: mode().id,
    theme: textTheme().id,
    themeFamily: textTheme().family,
    themeHue: textTheme().hue,
    flowMap: game.flowMap,
    flowMapPolygons: flowMapResult.polygons,
    flowLens: {
      active: game.flowLens.active,
      dragging: game.flowLens.dragging,
      x: Math.round(game.flowLens.x),
      y: Math.round(game.flowLens.y),
      polygonSides: FLOW_LENS_POLYGON.length,
      polygonParts: 2,
    },
    reefSummonCooldown: Number(game.reefSummonCooldown.toFixed(2)),
    reefSummonQueued: game.reefSummonQueued,
    gameTime: Number(game.time.toFixed(2)),
    distance: Math.floor(game.distance),
    event: game.event?.name || null,
    hearts: game.surfer.hearts,
    surferX: Math.round(game.surfer.x),
    speed: Math.round(game.speed),
    highVisibility: game.highVisibility,
    slowMode: game.slowMode,
    flow: {
      ...stage.flowDiagnostics,
      activeExclusions: vector.exclusions.length,
      returnedSlots: game.flow.slots,
      returnedFragments: game.flow.fragments.length,
    },
    activeSvgObjects: vector.visibleCount,
    activeReefs: activeReefs().length,
    activeGates: activeGates().length,
    reefIn: Number(Math.max(0, game.reefTimer).toFixed(2)),
    safeLaneX: Math.round(game.safeLaneX),
    worldObjects: game.objects.length,
    safeChannelMinimum: stage.width < 600 ? 110 : 130,
    visibleColors: stage.frameColors.size,
    visibleGlyphs: stage.frameGlyphs,
    proportional: textWidth('iiii', fontSpec(16)) !== textWidth('WWWW', fontSpec(16)),
    fonts: ['Recursive Linear', 'Recursive Casual'],
    pretext: getPretextUsage(),
    visibleCanvasCount: document.querySelectorAll('canvas:not(.sr-only)').length,
    visibleSvgCount: document.querySelectorAll('#vector-stage').length,
    safeInsets: { top: stage.safeTop, right: stage.safeRight, bottom: stage.safeBottom, left: stage.safeLeft },
  }, game.state === 'paused');
  game.renderDirty = false;
}

addEventListener('resize', () => {
  stage.resize();
  game.renderDirty = true;
});

try {
  await waitForGlyphFonts();
  canvas.focus({ preventScroll: true });
  setSemanticStatus('字体与 Pretext 已就绪。按数字选择模式，再按空格开始。');
  createLoop({ update, render, input });
} catch (error) {
  stage.clear();
  stage.paragraph(`FONT LOAD ERROR -- ${error.message}`, 28, 70, stage.width - 56, {
    size: 18,
    lineHeight: 26,
    family: 'linear',
    weight: 700,
    color: '#ff6b8a',
  });
  setSemanticStatus(`字体加载失败：${error.message}`);
}
