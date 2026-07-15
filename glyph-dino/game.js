import {
  GlyphStage,
  InputState,
  SeededRandom,
  VectorStage,
  clamp,
  createLoop,
  fontSpec,
  getPretextUsage,
  hsl,
  loadBest,
  overlap,
  saveBest,
  setSemanticStatus,
  textWidth,
  waitForGlyphFonts,
} from '/assets/glyph-arcade/engine.js?v=glyph-20260715-pretext3';

export const DINO_DIFFICULTY = Object.freeze({
  id: 'easy',
  initialSpeed: 215,
  maxSpeed: 420,
  acceleration: 0.10,
  mobileSpeedFactor: 0.88,
  firstObstacleDelay: 2.1,
  spawnEarly: [1.60, 2.35],
  spawnLate: [1.35, 2.00],
  birdUnlock: 450,
  vineUnlock: 750,
  jumpVelocity: 520,
  gravity: 1250,
  holdGravity: 650,
  holdDuration: 0.24,
  releaseGravity: 1750,
  fastFallGravity: 2200,
  fastFallVelocity: -200,
  jumpBuffer: 0.10,
  coyoteTime: 0.08,
  firstEventDelay: 12,
});

export const DINO_PALETTES = Object.freeze([
  { name: 'DAWN DESERT', sky: 232, accent: 28, ground: 18, danger: 350 },
  { name: 'FOSSIL CANYON', sky: 194, accent: 42, ground: 24, danger: 8 },
  { name: 'NEON NIGHT', sky: 258, accent: 176, ground: 286, danger: 326 },
  { name: 'STORM PLAIN', sky: 214, accent: 64, ground: 154, danger: 48 },
  { name: 'FROST ECHO', sky: 202, accent: 292, ground: 224, danger: 338 },
]);

const EVENTS = Object.freeze([
  { name: 'SANDSTORM', duration: 7 },
  { name: 'METEOR RAIN', duration: 6 },
  { name: 'FIREFLY MIGRATION', duration: 8 },
  { name: 'THUNDER PULSE', duration: 5 },
  { name: 'FOSSIL BLOOM', duration: 8 },
]);

export const DINO_TEXT_THEMES = Object.freeze([
  {
    id: 'desert-processes',
    name: 'DESERT PROCESSES',
    family: 'linear',
    hue: 34,
    corpus: 'Wind moves dry sand by creep, saltation, and suspension. A dune grows where transport loses energy, while its slip face records the prevailing wind. Quartz grains survive repeated collisions because quartz is harder than many common minerals. Surface temperature changes quickly, but heat penetrates slowly into the sediment. Desert pavement can reduce later erosion by shielding the finer material below.',
  },
  {
    id: 'fossil-record',
    name: 'FOSSIL RECORD',
    family: 'casual',
    hue: 82,
    corpus: 'A fossil enters the geological record only when burial outpaces decay and disturbance. Sediment protects hard tissue, groundwater carries dissolved minerals, and pressure gradually alters the surrounding matrix. Stratigraphic position provides relative age before radiometric measurements add numerical constraints. Trace fossils preserve behavior such as walking, feeding, and burrowing even when a body is absent.',
  },
  {
    id: 'orbital-observation',
    name: 'ORBITAL OBSERVATION',
    family: 'linear',
    hue: 204,
    corpus: 'An orbit is continuous free fall around a massive body. Apparent brightness depends on intrinsic luminosity, distance, and the material between observer and source. Parallax shifts a nearby star against a more distant background as Earth changes position. A spectrum separates light by wavelength and reveals temperature, motion, and chemical composition without touching the object.',
  },
  {
    id: 'storm-physics',
    name: 'STORM PHYSICS',
    family: 'casual',
    hue: 278,
    corpus: 'Warm moist air becomes buoyant when the surrounding atmosphere is cooler and denser. Rising air expands, cools, and can condense into cloud droplets that release latent heat. Charge separation inside a turbulent cloud creates an electric field until lightning opens a conductive path. Thunder is the pressure wave produced when that path heats and expands the nearby air.',
  },
  {
    id: 'cryosphere-archive',
    name: 'CRYOSPHERE ARCHIVE',
    family: 'linear',
    hue: 174,
    corpus: 'Snow becomes glacial ice as burial compresses grains and removes pore space. Bright ice reflects much of the incoming sunlight, while darker meltwater absorbs more energy. Layers in an ice core preserve dust, volcanic particles, and bubbles of ancient atmosphere. A glacier flows under its own weight and transports rock toward a moraine at its edge.',
  },
]);

const PLAYER_FLOW = Object.freeze({
  run: [[0.02, 0.35], [0.12, 0.54], [0.28, 0.45], [0.50, 0.08], [0.95, 0.08], [0.98, 0.42], [0.67, 0.45], [0.65, 0.76], [0.58, 1], [0.42, 1], [0.39, 0.76], [0.23, 1], [0.16, 0.72], [0.04, 0.58]],
  duck: [[0.01, 0.25], [0.22, 0.50], [0.36, 0.18], [0.92, 0.14], [0.99, 0.65], [0.62, 0.72], [0.54, 1], [0.22, 1], [0.09, 0.78]],
});

const canvas = document.getElementById('glyph-stage');
const stage = new GlyphStage(canvas);
const vector = new VectorStage(document.querySelector('#vector-stage'));
const input = new InputState(canvas);
const rng = new SeededRandom(0xD1A05EED);

const game = {
  state: 'ready',
  time: 0,
  layoutTime: 0,
  distance: 0,
  best: loadBest('glyph-dino-best'),
  speed: DINO_DIFFICULTY.initialSpeed,
  groundY: 0,
  scroll: 0,
  spawnTimer: DINO_DIFFICULTY.firstObstacleDelay,
  biomeIndex: 0,
  themeIndex: 0,
  flowMap: true,
  renderDirty: true,
  lastFlow: { fragments: [], slots: 0 },
  event: null,
  lastEventName: null,
  eventLeft: 0,
  eventCooldown: DINO_DIFFICULTY.firstEventDelay,
  flash: 0,
  player: { y: 0, vy: 0, duck: false, jumpHold: 0, jumpSustain: false, jumpBuffer: 0, coyote: DINO_DIFFICULTY.coyoteTime },
  pad: { jump: false, pause: false },
  obstacles: [],
  typePresses: [],
  particles: [],
  obstacleId: 0,
  typePressId: 0,
  readyPressSeeded: false,
  pointerToolActive: false,
};

function reset() {
  game.state = 'running';
  game.time = 0;
  game.distance = 0;
  game.speed = DINO_DIFFICULTY.initialSpeed * (stage.width < 600 ? DINO_DIFFICULTY.mobileSpeedFactor : 1);
  game.scroll = 0;
  game.spawnTimer = DINO_DIFFICULTY.firstObstacleDelay;
  game.biomeIndex = 0;
  game.event = null;
  game.lastEventName = null;
  game.eventLeft = 0;
  game.eventCooldown = DINO_DIFFICULTY.firstEventDelay;
  game.flash = 0;
  game.player.y = 0;
  game.player.vy = 0;
  game.player.duck = false;
  game.player.jumpHold = 0;
  game.player.jumpSustain = false;
  game.player.jumpBuffer = 0;
  game.player.coyote = DINO_DIFFICULTY.coyoteTime;
  game.pad.jump = false;
  game.pad.pause = false;
  game.obstacles.length = 0;
  game.typePresses.length = 0;
  game.particles.length = 0;
  game.readyPressSeeded = true;
  game.pointerToolActive = false;
  game.renderDirty = true;
  setSemanticStatus('游戏开始。当前距离 0 米。');
}

function spawnObstacle() {
  const progress = clamp(game.distance / 1500, 0, 1);
  const roll = rng.next();
  let type = roll < 0.45 ? 'cactus' : roll < 0.68 ? 'twin' : roll < 0.86 ? 'bird' : 'vine';
  if (type === 'twin' && game.distance < 120) type = 'cactus';
  if (type === 'bird' && game.distance < DINO_DIFFICULTY.birdUnlock) type = 'cactus';
  if (type === 'vine' && game.distance < DINO_DIFFICULTY.vineUnlock) {
    type = game.distance >= DINO_DIFFICULTY.birdUnlock ? 'bird' : 'cactus';
  }
  const config = {
    cactus: { lift: 0 },
    twin: { lift: 0 },
    bird: { lift: rng.pick([28, 56]) },
    vine: { lift: 48 },
  }[type];
  game.obstacles.push({
    id: game.obstacleId += 1,
    type,
    x: stage.width + 90,
    lift: config.lift,
    phase: rng.range(0, Math.PI * 2),
  });
  const minimum = DINO_DIFFICULTY.spawnEarly[0] + (DINO_DIFFICULTY.spawnLate[0] - DINO_DIFFICULTY.spawnEarly[0]) * progress;
  const maximum = DINO_DIFFICULTY.spawnEarly[1] + (DINO_DIFFICULTY.spawnLate[1] - DINO_DIFFICULTY.spawnEarly[1]) * progress;
  game.spawnTimer = rng.range(minimum, maximum);
}

function spawnEvent() {
  const candidates = EVENTS.filter(event => event.name !== game.lastEventName);
  const next = rng.pick(candidates);
  game.event = next;
  game.lastEventName = next.name;
  game.eventLeft = next.duration;
  game.eventCooldown = rng.range(18, 26);
  if (next.name === 'THUNDER PULSE') game.flash = 0.16;
  setSemanticStatus(`环境事件：${next.name}。`);
}

function typePressVisual(press) {
  const widthScale = 1.015 + Math.sin(game.layoutTime * 1.75 + press.phase) * 0.335;
  const heightScale = 0.96 + Math.cos(game.layoutTime * 1.25 + press.phase) * 0.04;
  const width = press.baseWidth * widthScale;
  const height = press.baseHeight * heightScale;
  return {
    x: press.centerX - width / 2,
    y: press.y + Math.sin(game.layoutTime * 1.1 + press.phase) * 4,
    width,
    height,
    symbol: 'dino-type-press',
    flowPolygon: [[0.04, 0.08], [0.20, 0.08], [0.20, 0.28], [0.80, 0.28], [0.80, 0.08], [0.96, 0.08], [0.96, 0.96], [0.04, 0.96]],
  };
}

function spawnTypePress(options = {}) {
  const compact = stage.width < 600;
  while (game.typePresses.length >= 3) game.typePresses.shift();
  const demo = options.demo === true;
  const baseWidth = compact ? 104 : 154;
  const baseHeight = compact ? 78 : 112;
  const upper = Math.max(58, game.groundY * 0.36);
  game.typePresses.push({
    id: game.typePressId += 1,
    centerX: stage.width * (demo ? 0.78 : rng.range(0.56, 0.82)),
    y: demo ? Math.max(48, game.groundY * 0.13) : rng.range(55, upper),
    baseWidth,
    baseHeight,
    phase: rng.range(0, Math.PI * 2),
    speed: demo ? 3 : rng.range(15, 24),
    age: 0,
    demo,
  });
  if (!demo) setSemanticStatus(`已召唤 SVG 活字压力机。当前 ${game.typePresses.length} 台，文字正在重新排版。`);
}

function updateTypePresses(dt) {
  for (const press of game.typePresses) {
    press.centerX -= press.speed * dt;
    press.age += dt;
  }
  game.typePresses = game.typePresses.filter(press => {
    const visual = typePressVisual(press);
    return visual.x + visual.width > -30 && (press.demo || press.age < 24);
  });
}

function cycleTextTheme() {
  game.themeIndex = (game.themeIndex + 1) % DINO_TEXT_THEMES.length;
  const theme = DINO_TEXT_THEMES[game.themeIndex];
  setSemanticStatus(`Pretext 主题切换为 ${theme.name}。字体 ${theme.family}。`);
}

function dinoToolbarLayout() {
  const compact = stage.width < 600;
  const gap = compact ? 5 : 8;
  const widths = compact ? [66, 76, 66] : [82, 98, 82];
  const total = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
  const y = stage.height - stage.safeBottom - (compact ? 64 : 42);
  const height = compact ? 30 : 28;
  let x = Math.max(8, (stage.width - total) / 2);
  const actions = ['flow', 'topic', 'press'];
  return widths.map((width, index) => {
    const item = { action: actions[index], x, y, width, height };
    x += width + gap;
    return item;
  });
}

function dinoToolbarPointerTarget(x, y) {
  return dinoToolbarLayout().find(item => (
    x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height
  ))?.action || null;
}

function runPretextAction(action) {
  if (action === 'flow') {
    game.flowMap = !game.flowMap;
    setSemanticStatus(`Pretext Flow Map ${game.flowMap ? '开启' : '关闭'}。`);
  } else if (action === 'topic') {
    cycleTextTheme();
  } else if (action === 'press') {
    spawnTypePress();
  }
  game.renderDirty = true;
}

function playerVisual() {
  const compact = stage.width < 600;
  const width = game.player.duck ? (compact ? 72 : 88) : (compact ? 54 : 66);
  const height = game.player.duck ? (compact ? 31 : 38) : (compact ? 58 : 70);
  const x = stage.width * 0.14;
  const y = game.groundY - game.player.y - height;
  const symbol = game.player.duck ? 'dino-duck' : Math.floor(game.time * 12) % 2 ? 'dino-run-a' : 'dino-run-b';
  return { x, y, width, height, symbol, flowPolygon: game.player.duck ? PLAYER_FLOW.duck : PLAYER_FLOW.run };
}

function obstacleVisual(obstacle) {
  const compact = stage.width < 600;
  const dimensions = {
    cactus: compact ? [24, 48] : [30, 58],
    twin: compact ? [46, 48] : [56, 58],
    bird: compact ? [50, 32] : [62, 40],
    vine: compact ? [48, 29] : [60, 36],
  }[obstacle.type];
  const [width, height] = dimensions;
  const bob = obstacle.type === 'bird' ? Math.sin(game.time * 10 + obstacle.phase) * 5 : 0;
  const y = game.groundY - obstacle.lift - height + bob;
  const flowPolygon = obstacle.type === 'bird'
    ? [[0, 0.50], [0.27, 0.15], [0.50, 0.48], [0.82, 0.27], [1, 0.42], [0.75, 0.68], [0.58, 1], [0.38, 0.72], [0.12, 0.70]]
    : obstacle.type === 'vine'
      ? [[0, 0.05], [0.18, 0.05], [0.34, 0.38], [0.51, 0.70], [0.68, 1], [0.84, 0.68], [1, 0.25], [1, 0.62], [0.84, 0.95], [0.67, 0.75], [0.50, 0.48], [0.32, 0.18], [0.16, 0.38], [0, 0.25]]
      : [[0.05, 1], [0.22, 0.45], [0.08, 0.30], [0.15, 0.12], [0.36, 0.34], [0.43, 0], [0.66, 0], [0.70, 0.30], [0.90, 0.18], [0.98, 0.48], [0.70, 0.58], [0.78, 1]];
  return { x: obstacle.x, y, width, height, symbol: `dino-${obstacle.type}`, flowPolygon };
}

function insetBox(visual, horizontalRatio, verticalRatio) {
  const insetX = visual.width * horizontalRatio;
  const insetY = visual.height * verticalRatio;
  return {
    x: visual.x + insetX,
    y: visual.y + insetY,
    w: Math.max(1, visual.width - insetX * 2),
    h: Math.max(1, visual.height - insetY * 2),
  };
}

function playerBox() {
  return insetBox(playerVisual(), game.player.duck ? 0.18 : 0.24, game.player.duck ? 0.20 : 0.16);
}

function obstacleBox(obstacle) {
  const ratios = {
    cactus: [0.22, 0.10],
    twin: [0.18, 0.10],
    bird: [0.25, 0.30],
    vine: [0.22, 0.25],
  }[obstacle.type];
  return insetBox(obstacleVisual(obstacle), ratios[0], ratios[1]);
}

function readGamepad() {
  try {
    const pads = navigator.getGamepads?.();
    if (!pads) return { jump: false, duck: false, pause: false };
    let pad = null;
    for (let index = 0; index < pads.length; index += 1) {
      if (pads[index]) {
        pad = pads[index];
        break;
      }
    }
    if (!pad) return { jump: false, duck: false, pause: false };
    const vertical = pad.axes?.[1] || 0;
    return {
      jump: !!pad.buttons?.[0]?.pressed || !!pad.buttons?.[12]?.pressed || vertical < -0.55,
      duck: !!pad.buttons?.[1]?.pressed || !!pad.buttons?.[13]?.pressed || vertical > 0.55,
      pause: !!pad.buttons?.[9]?.pressed,
    };
  } catch {
    return { jump: false, duck: false, pause: false };
  }
}

function crash() {
  game.state = 'gameover';
  const score = Math.floor(game.distance);
  if (score > game.best) {
    game.best = score;
    saveBest('glyph-dino-best', score);
  }
  setSemanticStatus(`撞上障碍。距离 ${score} 米，最高 ${game.best} 米。按空格重新开始。`);
}

function updateParticles(dt) {
  for (const particle of game.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
  }
  game.particles = game.particles.filter(particle => particle.life > 0 && particle.x > -30 && particle.x < stage.width + 30);
}

function emitFootDust() {
  if (game.particles.length > 90) return;
  game.particles.push({
    x: stage.width * 0.14 + rng.range(8, 52),
    y: game.groundY - rng.range(0, 5),
    vx: rng.range(-90, -35),
    vy: rng.range(-22, 3),
    life: rng.range(0.25, 0.7),
    char: rng.pick(['.', ':', ',', "'", '`']),
  });
}

function update(dt) {
  game.groundY = stage.height * 0.78;
  if (game.state !== 'paused') {
    game.layoutTime += dt;
    if (game.state === 'ready' && !game.readyPressSeeded) {
      spawnTypePress({ demo: true });
      game.readyPressSeeded = true;
    }
    updateTypePresses(dt);
  }

  const pad = readGamepad();
  const padJumpPressed = pad.jump && !game.pad.jump;
  const padPausePressed = pad.pause && !game.pad.pause;
  game.pad.jump = pad.jump;
  game.pad.pause = pad.pause;

  const pointerPressed = input.pressed('PointerDown');
  const pointerTool = pointerPressed ? dinoToolbarPointerTarget(input.pointer.x, input.pointer.y) : null;
  if (pointerTool) {
    game.pointerToolActive = true;
    runPretextAction(pointerTool);
  } else if (pointerPressed || !input.pointer.down) {
    game.pointerToolActive = false;
  }
  if (input.pressed('KeyF')) runPretextAction('flow');
  if (input.pressed('KeyC')) runPretextAction('topic');
  if (input.pressed('KeyX')) runPretextAction('press');

  const startAction = input.pressed('Space', 'Enter', 'ArrowUp', 'KeyW') || (pointerPressed && !pointerTool) || padJumpPressed;
  const pointerJumpHeld = input.pointer.down && !game.pointerToolActive && input.pointer.x >= stage.width * 0.34;
  const jumpHeld = input.held('Space', 'ArrowUp', 'KeyW') || pointerJumpHeld || pad.jump;
  const duckHeld = input.held('ArrowDown', 'KeyS') || pad.duck || (input.pointer.down && !game.pointerToolActive && input.pointer.x < stage.width * 0.34);

  if (input.pressed('KeyG') && game.state !== 'running') location.href = '/gallery/';
  if ((input.pressed('KeyP', 'Escape') || padPausePressed) && (game.state === 'running' || game.state === 'paused')) {
    game.state = game.state === 'paused' ? 'running' : 'paused';
    game.renderDirty = true;
  }

  if (game.state === 'ready') {
    if (startAction) reset();
    return;
  }
  if (game.state === 'gameover') {
    if (startAction || input.pressed('KeyR')) reset();
    updateParticles(dt * 0.35);
    return;
  }
  if (game.state === 'paused') return;

  game.time += dt;
  game.distance += game.speed * dt * 0.035;
  const speedFactor = stage.width < 600 ? DINO_DIFFICULTY.mobileSpeedFactor : 1;
  game.speed = Math.min(DINO_DIFFICULTY.maxSpeed, DINO_DIFFICULTY.initialSpeed + game.distance * DINO_DIFFICULTY.acceleration) * speedFactor;
  game.scroll += game.speed * dt;
  game.biomeIndex = Math.floor(game.distance / 520) % DINO_PALETTES.length;
  game.flash = Math.max(0, game.flash - dt);

  const grounded = game.player.y <= 0.1;
  game.player.jumpBuffer = startAction ? DINO_DIFFICULTY.jumpBuffer : Math.max(0, game.player.jumpBuffer - dt);
  game.player.coyote = grounded ? DINO_DIFFICULTY.coyoteTime : Math.max(0, game.player.coyote - dt);
  game.player.duck = duckHeld && grounded;
  if (game.player.jumpBuffer > 0 && game.player.coyote > 0 && !game.player.duck) {
    game.player.vy = DINO_DIFFICULTY.jumpVelocity;
    game.player.y = 0.2;
    game.player.jumpHold = 0;
    game.player.jumpSustain = true;
    game.player.jumpBuffer = 0;
    game.player.coyote = 0;
  }

  const fastFall = duckHeld && game.player.y > 3;
  if (!jumpHeld || fastFall) game.player.jumpSustain = false;
  let gravity = DINO_DIFFICULTY.gravity;
  if (fastFall) {
    game.player.vy = Math.min(game.player.vy, DINO_DIFFICULTY.fastFallVelocity);
    gravity = DINO_DIFFICULTY.fastFallGravity;
  } else if (game.player.jumpSustain && game.player.vy > 0 && game.player.jumpHold < DINO_DIFFICULTY.holdDuration) {
    gravity = DINO_DIFFICULTY.holdGravity;
    game.player.jumpHold += dt;
  } else if (!jumpHeld && game.player.vy > 0) {
    gravity = DINO_DIFFICULTY.releaseGravity;
  }
  game.player.y += game.player.vy * dt;
  game.player.vy -= gravity * dt;
  if (game.player.y <= 0) {
    game.player.y = 0;
    game.player.vy = 0;
    game.player.jumpHold = 0;
    game.player.jumpSustain = false;
    if (Math.floor(game.time * 22) % 2 === 0) emitFootDust();
  }

  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) spawnObstacle();
  for (const obstacle of game.obstacles) obstacle.x -= game.speed * dt;
  game.obstacles = game.obstacles.filter(obstacle => {
    const visual = obstacleVisual(obstacle);
    return visual.x + visual.width > -40;
  });

  const hitbox = playerBox();
  for (const obstacle of game.obstacles) {
    if (overlap(hitbox, obstacleBox(obstacle))) {
      crash();
      break;
    }
  }

  game.eventCooldown -= dt;
  if (!game.event && game.eventCooldown <= 0) spawnEvent();
  if (game.event) {
    game.eventLeft -= dt;
    if (game.event.name === 'THUNDER PULSE' && Math.floor(game.eventLeft * 3) % 5 === 0 && rng.next() < 0.018) game.flash = 0.11;
    if (game.eventLeft <= 0) game.event = null;
  }
  updateParticles(dt);
}

function overlayLayout() {
  const compact = stage.width < 600;
  const width = Math.min(stage.width - 28, compact ? 344 : 560);
  const height = compact ? 205 : 226;
  return { compact, width, height, x: (stage.width - width) / 2, y: Math.max(stage.safeTop + 54, (stage.height - height) / 2 - 8) };
}

function drawVectorScene(palette, theme) {
  if (game.state !== 'running') {
    const panel = overlayLayout();
    vector.use('overlay-panel', 'dino-panel', {
      x: panel.x,
      y: panel.y,
      width: panel.width,
      height: panel.height,
      color: hsl(palette.sky, 48, 8, 0.94),
      cssVars: { '--highlight': hsl(palette.accent, 96, 70) },
      flowPolygon: [[0, 0], [1, 0], [1, 1], [0, 1]],
      flowPadding: 5,
    });
  }

  const fossilSpan = stage.width + 260;
  for (let index = 0; index < 2; index += 1) {
    const x = ((index * stage.width * 0.63 - game.scroll * 0.06) % fossilSpan + fossilSpan) % fossilSpan - 100;
    vector.use(`ambient-fossil-${index}`, 'dino-fossil', {
      x,
      y: game.groundY - 122 - index * 74,
      width: 58,
      height: 28,
      color: hsl(palette.ground + 36 + index * 20, 78, 58, 0.42),
      cssVars: { '--highlight': hsl(palette.accent, 88, 68, 0.48) },
      flowPolygon: [[0, 0.2], [0.8, 0.2], [1, 0.5], [0.78, 0.8], [0, 0.8]],
      flowPadding: 4,
      opacity: 0.65,
    });
  }

  for (const press of game.typePresses) {
    const visual = typePressVisual(press);
    vector.use(`type-press-${press.id}`, visual.symbol, {
      ...visual,
      color: hsl(theme.hue + press.id * 13, 78, 34, 0.94),
      cssVars: {
        '--highlight': hsl(theme.hue + 54, 98, 68),
        '--spark': hsl(theme.hue + 152, 100, 72),
        '--cutout': '#030711',
      },
      flowPadding: 8,
      opacity: press.demo ? 0.82 : 0.96,
    });
  }

  if (game.event?.name === 'FOSSIL BLOOM') {
    for (let index = 0; index < 4; index += 1) {
      const x = ((index * 173 - game.scroll * 0.18) % (stage.width + 120) + stage.width + 120) % (stage.width + 120) - 60;
      vector.use(`bloom-fossil-${index}`, 'dino-fossil', {
        x,
        y: game.groundY - 185 - (index % 2) * 62,
        width: 64,
        height: 31,
        color: hsl(palette.accent + index * 16, 92, 68),
        cssVars: { '--highlight': hsl(palette.danger + index * 10, 96, 74) },
        flowPolygon: [[0, 0.15], [0.86, 0.15], [1, 0.5], [0.82, 0.85], [0, 0.85]],
        flowPadding: 5,
      });
    }
  }

  for (const obstacle of game.obstacles) {
    const visual = obstacleVisual(obstacle);
    vector.use(`obstacle-${obstacle.id}`, visual.symbol, {
      ...visual,
      color: hsl(obstacle.type === 'bird' ? palette.danger : palette.ground + 100, 88, 56),
      cssVars: { '--highlight': hsl(palette.accent + obstacle.id * 7, 96, 72), '--cutout': '#030711' },
      flowPadding: 5,
    });
  }

  const player = playerVisual();
  vector.use('dino-player', player.symbol, {
    ...player,
    color: hsl(palette.accent, 94, 62),
    cssVars: { '--highlight': hsl(palette.danger, 96, 72), '--cutout': '#030711' },
    flowPadding: 6,
  });
}

function drawSky(_now, palette, theme) {
  const compact = stage.width < 600;
  const flowTop = stage.safeTop + (compact ? 50 : 48);
  const eventCorpus = game.event
    ? ` The current field event is ${game.event.name.toLowerCase()}, so observers record its duration, direction, and intensity.`
    : '';
  const flow = stage.flowText(`${theme.corpus}${eventCorpus}`, {
    x: 8,
    y: flowTop,
    w: stage.width - 16,
    h: Math.max(50, game.groundY - flowTop - 4),
  }, vector.exclusions, {
    size: 10,
    lineHeight: 11,
    family: theme.family,
    weight: 400,
    minWidth: 22,
    targetCharacters: 14000,
    squeeze: {
      minSize: 8,
      maxSize: 10,
      sizes: [8, 9, 10],
      narrowWidth: compact ? 42 : 200,
      wideWidth: compact ? 150 : 480,
      compressedFamily: 'casual',
      compressedBelow: compact ? 74 : 280,
    },
    color: ({ row, slot, index, size }) => hsl(theme.hue + palette.sky * 0.08 + row * 2.4 + slot * 21 + index * 0.26, 72 + row % 5 * 4, 36 + (row + slot + size) % 7 * 4, 0.62),
  });
  game.lastFlow = flow;
  return flow;
}

function drawEvent(now, palette) {
  if (!game.event) return;
  const name = game.event.name;
  if (name === 'SANDSTORM') {
    const font = fontSpec(stage.width < 600 ? 14 : 18, 'casual', 400);
    for (let row = 2; row < 19; row += 2) {
      const offset = (game.scroll * (0.35 + row * 0.02)) % 110;
      for (let x = -offset; x < stage.width + 80; x += 65 + row) {
        stage.glyph(row % 4 ? '~' : '=', x, row * 27, {
          font,
          color: hsl(34 + row, 94, 63 + row % 3 * 5, 0.36),
        });
      }
    }
  } else if (name === 'METEOR RAIN') {
    const font = fontSpec(20, 'casual', 700);
    for (let index = 0; index < 12; index += 1) {
      const phase = (now * (85 + index * 4) + index * 137) % (stage.width + 300);
      const x = stage.width - phase + 120;
      const y = 40 + ((phase * 0.38 + index * 37) % (game.groundY * 0.58));
      stage.sequence(index % 2 ? '/**' : '/*+', x, y, {
        font,
        tracking: -2,
        color: (_char, col) => hsl(palette.accent + col * 18 + index * 4, 98, 72 - col * 9, 0.9),
      });
    }
  } else if (name === 'FIREFLY MIGRATION') {
    const font = fontSpec(15, 'casual', 700);
    for (let index = 0; index < 54; index += 1) {
      const x = (index * 79 + now * 35) % (stage.width + 80) - 40;
      const y = game.groundY - 35 - ((index * 43) % 210) + Math.sin(now * 2 + index) * 13;
      stage.glyph(index % 5 ? '.' : 'o', x, y, {
        font,
        color: hsl(52 + index * 1.7, 100, 62 + index % 4 * 8, 0.88),
      });
    }
  } else if (name === 'FOSSIL BLOOM') {
    const font = fontSpec(14, 'linear', 700);
    const word = 'FOSSIL';
    for (let index = 0; index < 42; index += 1) {
      const x = (index * 91 - game.scroll * 0.16) % (stage.width + 100) - 50;
      const y = game.groundY + 35 + (index % 4) * 21;
      stage.glyph(word[index % word.length], x, y, {
        font,
        color: hsl(42 + index * 1.4, 82, 70 - index % 5 * 5, 0.74),
      });
    }
  }

  if (game.flash > 0) {
    const flashFont = fontSpec(stage.width < 600 ? 26 : 42, 'casual', 700);
    for (let index = 0; index < 55; index += 1) {
      stage.glyph(index % 5 === 0 ? '/' : '!', (index * 47) % stage.width, 30 + (index * 71) % stage.height, {
        font: flashFont,
        color: hsl(55 + index * 3, 100, 82, game.flash * 5),
      });
    }
  }
}

function drawGround(palette) {
  const compact = stage.width < 600;
  const fonts = [fontSpec(compact ? 8 : 10, 'linear', 700), fontSpec(compact ? 8 : 9, 'casual', 400)];
  const rows = ['_-=~_.', 'fossil0123456789', '::;,,..--==', 'roots/\\/\\/\\'];
  for (let row = 0; row < rows.length; row += 1) {
    const font = fonts[row % fonts.length];
    const source = rows[row];
    let x = -((game.scroll * (1 - row * 0.13)) % 58) - 58;
    let index = 0;
    while (x < stage.width + 40) {
      const char = source[(index + Math.floor(game.distance / 17)) % source.length];
      const color = hsl(palette.ground + row * 8 + index * 0.9, 68 + row * 4, 46 - row * 6, 0.92 - row * 0.1);
      stage.glyph(char, x, game.groundY + row * (compact ? 12 : 14), { font, color });
      x += textWidth(char, font) + 4 + row * 2;
      index += 1;
    }
  }
}

function drawParticles(palette) {
  const font = fontSpec(stage.width < 600 ? 8 : 10, 'casual', 400);
  for (const particle of game.particles) {
    stage.glyph(particle.char, particle.x, particle.y, {
      font,
      color: hsl(palette.ground + 18 + particle.life * 70, 78, 58 + particle.life * 12, particle.life),
    });
  }
}

function drawHud(palette, theme) {
  const compact = stage.width < 600;
  const size = compact ? 8 : 10;
  const font = fontSpec(size, 'linear', 700);
  const left = compact ? 12 : 24;
  const eventText = game.event ? `EVENT:${game.event.name}` : `BIOME:${palette.name}`;
  const flow = stage.flowDiagnostics;
  const sizes = flow.fontSizes.length ? flow.fontSizes.join('/') : '-';
  const families = flow.families.length
    ? flow.families.map(family => family === 'casual' ? 'CAS' : family === 'linear' ? 'LIN' : String(family).slice(0, 3).toUpperCase()).join('/')
    : '-';
  stage.glyph(`DINO//TYPE  ${Math.floor(game.distance).toString().padStart(5, '0')}m  BEST:${game.best.toString().padStart(5, '0')}`, left, stage.safeTop + (compact ? 16 : 20), {
    font,
    color: hsl(palette.accent, 96, 72),
  });
  stage.glyph(eventText, stage.width - left, stage.safeTop + (compact ? 16 : 20), {
    font: fontSpec(compact ? 8 : 9, 'casual', 700),
    color: hsl(game.event ? palette.danger : palette.sky + 70, 98, 73),
    align: 'right',
  });
  stage.glyph(`TOPIC:${theme.name}  PRESS:${game.typePresses.length}`, left, stage.safeTop + (compact ? 29 : 34), {
    font: fontSpec(8, theme.family, 700),
    color: hsl(theme.hue, 94, 72),
  });
  stage.glyph(`PTX LIVE  MAP:${game.flowMap ? 'ON' : 'OFF'}  SLOTS:${flow.slots}  EXCL:${flow.exclusions}  FONT:${sizes}  FACE:${families}`, left, stage.safeTop + (compact ? 42 : 46), {
    font: fontSpec(8, 'linear', 700),
    color: hsl(theme.hue + 56, 96, 74),
  });
}

function drawPretextToolbar(theme) {
  const labels = ['[F FLOW]', '[C TOPIC]', '[X SVG+]'];
  const items = dinoToolbarLayout();
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const active = item.action === 'flow' ? game.flowMap : item.action === 'press' ? game.typePresses.length > 0 : false;
    const color = hsl(theme.hue + index * 54, 96, active ? 76 : 61);
    stage.dottedFrame(item.x, item.y, item.width, item.height, {
      color,
      glyph: active ? '+' : '.',
      size: 8,
      alpha: active ? 0.96 : 0.72,
    });
    stage.glyph(labels[index], item.x + item.width / 2, item.y + (stage.width < 600 ? 20 : 19), {
      font: fontSpec(stage.width < 600 ? 8 : 9, index === 1 ? theme.family : 'linear', 700),
      color,
      align: 'center',
    });
  }
}

function drawOverlay(palette) {
  if (game.state === 'running') return;
  const { compact, width: boxWidth, height: boxHeight, x, y } = overlayLayout();
  stage.dottedFrame(x, y, boxWidth, boxHeight, { color: hsl(palette.accent, 96, 72), glyph: game.state === 'gameover' ? 'x' : '.' });
  const title = game.state === 'ready' ? 'DINO//TYPE' : game.state === 'paused' ? 'PAUSED//TYPE' : 'EXTINCT//RETRY';
  stage.glyph(title, stage.width / 2, y + 39, {
    font: fontSpec(compact ? 21 : 29, 'casual', 700),
    color: hsl(game.state === 'gameover' ? palette.danger : palette.accent, 100, 70),
    align: 'center',
  });
  const message = game.state === 'ready'
    ? 'Every dashed Flow Map polygon is a live Pretext exclusion. Tap SVG+ to add a stretching type press, then watch real 8, 9, and 10 pixel fonts refill the changing slots.'
    : game.state === 'paused'
      ? 'The glyph field is frozen. Press P or ESC to continue.'
      : `Distance ${Math.floor(game.distance)}m. Best ${game.best}m. The desert will typeset another chance.`;
  stage.paragraph(message, x + 22, y + 64, boxWidth - 44, {
    size: compact ? 9 : 11,
    lineHeight: compact ? 12 : 15,
    color: hsl(palette.sky + 42, 72, 79),
  });
  stage.glyph(game.state === 'paused' ? '[ P / ESC : RESUME ]' : '[ SPACE / TAP : RUN ]', stage.width / 2, y + boxHeight - 38, {
    font: fontSpec(compact ? 10 : 13, 'linear', 700),
    color: hsl(palette.accent + 36, 100, 72),
    align: 'center',
  });
  stage.glyph('W/UP jump  S/DOWN fall  F map  C topic  X press  P pause', stage.width / 2, y + boxHeight - 16, {
    font: fontSpec(compact ? 8 : 9, 'linear', 400),
    color: hsl(palette.sky + 95, 82, 70),
    align: 'center',
  });
}

function render() {
  if (game.state === 'paused' && !game.renderDirty) return;
  const palette = DINO_PALETTES[game.biomeIndex];
  const theme = DINO_TEXT_THEMES[game.themeIndex];
  const sceneTime = game.time;
  stage.clear();
  vector.beginFrame(stage.width, stage.height);
  drawVectorScene(palette, theme);
  const flowResult = drawSky(sceneTime, palette, theme);
  drawEvent(sceneTime, palette);
  drawGround(palette);
  drawParticles(palette);
  drawHud(palette, theme);
  drawOverlay(palette);
  drawPretextToolbar(theme);
  const flowMapResult = vector.renderFlowMap(game.flowMap, {
    stroke: hsl(theme.hue + 42, 100, 72),
    fill: hsl(theme.hue, 88, 48, 0.045),
    strokeWidth: 1,
    dashArray: '5 4',
    opacity: 0.82,
  });
  vector.endFrame();
  stage.publishDiagnostics({
    game: 'dino',
    state: game.state,
    gameTime: Number(game.time.toFixed(2)),
    distance: Math.floor(game.distance),
    event: game.event?.name || null,
    lastEvent: game.lastEventName,
    biome: palette.name,
    theme: theme.name,
    themeId: theme.id,
    flowMap: game.flowMap,
    flowMapPolygons: flowMapResult.polygons,
    typePresses: game.typePresses.length,
    player: { y: Math.round(game.player.y), duck: game.player.duck },
    speed: Math.round(game.speed),
    obstacleCount: game.obstacles.length,
    nearestObstacleX: game.obstacles.length ? Math.round(Math.min(...game.obstacles.map(obstacle => obstacle.x))) : null,
    nextObstacleIn: Number(Math.max(0, game.spawnTimer).toFixed(2)),
    difficulty: 'easy',
    flow: {
      ...stage.flowDiagnostics,
      returnedSlots: flowResult.slots,
      returnedFragments: flowResult.fragments.length,
    },
    activeSvgObjects: vector.visibleCount,
    visibleColors: stage.frameColors.size,
    visibleGlyphs: stage.frameGlyphs,
    proportional: textWidth('iiii', fontSpec(16)) !== textWidth('WWWW', fontSpec(16)),
    fonts: ['Recursive Linear', 'Recursive Casual'],
    pretext: getPretextUsage(),
    visibleCanvasCount: document.querySelectorAll('canvas:not(.sr-only)').length,
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
  setSemanticStatus('字体与 Pretext 已就绪。按空格开始。');
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
