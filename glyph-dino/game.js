import {
  GlyphStage,
  InputState,
  SeededRandom,
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
} from '/assets/glyph-arcade/engine.js';

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

const RUN_SPRITES = [
  [
    '       __',
    '  .-""`  `-.',
    ' /  o       \\',
    '<     ___   |',
    ' `-._/  `-._/',
    '   /_\\   /',
  ],
  [
    '       __',
    '  .-""`  `-.',
    ' /  o       \\',
    '<     ___   |',
    ' `-._/  `-._/',
    '     \\  /_\\',
  ],
];

const DUCK_SPRITE = [
  ' .-""`-.__',
  '/ o      _ `-.',
  '`-.___.-` `---',
  '  /_\\  /_\\',
];

const OBSTACLE_SPRITES = Object.freeze({
  cactus: ['  Y', '\\ | /', ' \\|/', '  |', ' _|_'],
  twin: [' Y   Y', '\\|/ \\|/', ' |   |', '_|_ _|_'],
  bird: ['  __/\\__', '<_  o  _>', '  \\/\\/'],
  vine: ['\\/\\/\\/', ' }}}} ', '  }}  '],
});

const spriteMetricsCache = new Map();

const canvas = document.getElementById('glyph-stage');
const stage = new GlyphStage(canvas);
const input = new InputState(canvas);
const rng = new SeededRandom(0xD1A05EED);

const game = {
  state: 'ready',
  time: 0,
  distance: 0,
  best: loadBest('glyph-dino-best'),
  speed: 285,
  groundY: 0,
  scroll: 0,
  spawnTimer: 1.3,
  biomeIndex: 0,
  event: null,
  lastEventName: null,
  eventLeft: 0,
  eventCooldown: 3.25,
  flash: 0,
  player: { y: 0, vy: 0, duck: false, jumpHold: 0, jumpSustain: false },
  pad: { jump: false, pause: false },
  obstacles: [],
  particles: [],
};

function hashNoise(x, y, t = 0) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + t * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function reset() {
  game.state = 'running';
  game.time = 0;
  game.distance = 0;
  game.speed = 285;
  game.scroll = 0;
  game.spawnTimer = 1.1;
  game.biomeIndex = 0;
  game.event = null;
  game.lastEventName = null;
  game.eventLeft = 0;
  game.eventCooldown = 3.25;
  game.flash = 0;
  game.player.y = 0;
  game.player.vy = 0;
  game.player.duck = false;
  game.player.jumpHold = 0;
  game.player.jumpSustain = false;
  game.pad.jump = false;
  game.pad.pause = false;
  game.obstacles.length = 0;
  game.particles.length = 0;
  setSemanticStatus('游戏开始。当前距离 0 米。');
}

function spawnObstacle() {
  const progress = clamp(game.distance / 900, 0, 1);
  const roll = rng.next();
  let type = roll < 0.45 ? 'cactus' : roll < 0.68 ? 'twin' : roll < 0.86 ? 'bird' : 'vine';
  if (game.distance < 130 && (type === 'bird' || type === 'vine')) type = 'cactus';
  const config = {
    cactus: { lift: 0 },
    twin: { lift: 0 },
    bird: { lift: rng.pick([51, 75]) },
    vine: { lift: 54 },
  }[type];
  game.obstacles.push({
    type,
    x: stage.width + 90,
    lift: config.lift,
    phase: rng.range(0, Math.PI * 2),
  });
  const minimum = 0.78 + progress * 0.12;
  game.spawnTimer = rng.range(minimum, 1.48 - progress * 0.18);
}

function spawnEvent() {
  const candidates = EVENTS.filter(event => event.name !== game.lastEventName);
  const next = rng.pick(candidates);
  game.event = next;
  game.lastEventName = next.name;
  game.eventLeft = next.duration;
  game.eventCooldown = rng.range(12, 18);
  if (next.name === 'THUNDER PULSE') game.flash = 0.16;
  setSemanticStatus(`环境事件：${next.name}。`);
}

function spriteMetrics(rows, font, lineHeight, size) {
  const key = `${font}\u0000${lineHeight}\u0000${rows.join('\n')}`;
  const cached = spriteMetricsCache.get(key);
  if (cached) return cached;
  let left = Infinity;
  let right = 0;
  for (const row of rows) {
    let cursor = 0;
    for (const char of Array.from(row)) {
      const width = textWidth(char, font);
      if (char !== ' ') {
        left = Math.min(left, cursor);
        right = Math.max(right, cursor + width);
      }
      cursor += width;
    }
  }
  const value = {
    left: Number.isFinite(left) ? left : 0,
    right,
    top: -size * 0.8,
    bottom: (rows.length - 1) * lineHeight + size * 0.2,
  };
  spriteMetricsCache.set(key, value);
  return value;
}

function playerVisual() {
  const size = stage.width < 600 ? 11 : 14;
  const lineHeight = size * 0.88;
  const rows = game.player.duck ? DUCK_SPRITE : RUN_SPRITES[Math.floor(game.time * 10) % RUN_SPRITES.length];
  const font = fontSpec(size, 'casual', 700);
  const x = stage.width * 0.14;
  const y = game.groundY - game.player.y - rows.length * lineHeight + size;
  return { rows, size, lineHeight, font, x, y, metrics: spriteMetrics(rows, font, lineHeight, size) };
}

function obstacleVisual(obstacle) {
  const rows = OBSTACLE_SPRITES[obstacle.type];
  const size = stage.width < 600 ? 10 : obstacle.type === 'bird' ? 13 : 14;
  const lineHeight = size * 0.9;
  const font = fontSpec(size, obstacle.type === 'bird' ? 'casual' : 'linear', 700);
  const bob = obstacle.type === 'bird' ? Math.sin(game.time * 10 + obstacle.phase) * 5 : 0;
  const y = game.groundY - obstacle.lift - rows.length * lineHeight + size + bob;
  return { rows, size, lineHeight, font, x: obstacle.x, y, metrics: spriteMetrics(rows, font, lineHeight, size) };
}

function insetBox(visual, horizontalRatio = 0.16, verticalRatio = 0.12) {
  const { metrics, size } = visual;
  const insetX = size * horizontalRatio;
  const insetY = size * verticalRatio;
  return {
    x: visual.x + metrics.left + insetX,
    y: visual.y + metrics.top + insetY,
    w: Math.max(1, metrics.right - metrics.left - insetX * 2),
    h: Math.max(1, metrics.bottom - metrics.top - insetY * 2),
  };
}

function playerBox() {
  return insetBox(playerVisual(), game.player.duck ? 0.12 : 0.18, 0.14);
}

function obstacleBox(obstacle) {
  return insetBox(obstacleVisual(obstacle), obstacle.type === 'bird' ? 0.12 : 0.16, 0.1);
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
  const pad = readGamepad();
  const padJumpPressed = pad.jump && !game.pad.jump;
  const padPausePressed = pad.pause && !game.pad.pause;
  game.pad.jump = pad.jump;
  game.pad.pause = pad.pause;
  const startAction = input.pressed('Space', 'Enter', 'ArrowUp', 'KeyW', 'PointerDown') || padJumpPressed;
  const jumpHeld = input.held('Space', 'ArrowUp', 'KeyW') || pad.jump;
  const duckHeld = input.held('ArrowDown', 'KeyS') || pad.duck || (input.pointer.down && input.pointer.x < stage.width * 0.34);

  if (input.pressed('KeyG') && game.state !== 'running') location.href = '/gallery/';
  if ((input.pressed('KeyP', 'Escape') || padPausePressed) && (game.state === 'running' || game.state === 'paused')) {
    game.state = game.state === 'paused' ? 'running' : 'paused';
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
  game.speed = Math.min(580, 285 + game.distance * 0.19);
  game.scroll += game.speed * dt;
  game.biomeIndex = Math.floor(game.distance / 520) % DINO_PALETTES.length;
  game.flash = Math.max(0, game.flash - dt);

  const grounded = game.player.y <= 0.1;
  game.player.duck = duckHeld && grounded;
  if (startAction && game.player.y <= 0.1 && !game.player.duck) {
    game.player.vy = 590;
    game.player.y = 0.2;
    game.player.jumpHold = 0;
    game.player.jumpSustain = true;
  }

  const fastFall = duckHeld && game.player.y > 3;
  if (!jumpHeld || fastFall) game.player.jumpSustain = false;
  let gravity = 1660;
  if (fastFall) {
    game.player.vy = Math.min(game.player.vy, -240);
    gravity = 2650;
  } else if (game.player.jumpSustain && game.player.vy > 0 && game.player.jumpHold < 0.2) {
    gravity = 760;
    game.player.jumpHold += dt;
  } else if (!jumpHeld && game.player.vy > 0) {
    gravity = 2200;
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
    return visual.x + visual.metrics.right > -40;
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

function drawSky(now, palette) {
  const compact = stage.width < 600;
  const size = compact ? 12 : 15;
  const lineHeight = compact ? 17 : 20;
  const font = fontSpec(size, 'linear', 400);
  const glyphs = ['.', ',', "'", '`', ':', ';', 'i', 'l', 's', 'w', '~'];
  const rows = Math.ceil(game.groundY / lineHeight);
  for (let row = 0; row < rows; row += 1) {
    let x = -28 - ((game.scroll * (0.018 + row * 0.0005)) % 28);
    let col = 0;
    while (x < stage.width + 22) {
      const noise = hashNoise(col, row, Math.floor(game.distance / 25));
      const char = glyphs[Math.floor(noise * glyphs.length)];
      const hue = palette.sky + row * 1.2 + col * 0.85 + Math.sin(now + row) * 6;
      const light = 18 + row * 0.7 + noise * 18;
      const alpha = 0.16 + noise * 0.42;
      stage.glyph(char, x, 18 + row * lineHeight, {
        font,
        color: hsl(hue, 70 + noise * 20, light, alpha),
      });
      x += textWidth(char, font) + 8 + noise * 12;
      col += 1;
    }
  }

  const mountainFont = fontSpec(compact ? 17 : 23, 'casual', 700);
  for (let index = 0; index < Math.ceil(stage.width / 34) + 2; index += 1) {
    const x = index * 34 - (game.scroll * 0.065 % 34);
    const y = game.groundY - 63 - Math.sin(index * 1.7) * 24;
    const char = index % 3 === 0 ? 'A' : index % 2 ? '^' : '/\\';
    stage.glyph(char, x, y, {
      font: mountainFont,
      color: hsl(palette.ground + index * 2.1, 62, 32 + index % 4 * 3, 0.72),
    });
  }
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
  const fonts = [fontSpec(compact ? 13 : 16, 'linear', 700), fontSpec(compact ? 12 : 15, 'casual', 400)];
  const rows = ['_-=~_.', 'fossil0123456789', '::;,,..--==', 'roots/\\/\\/\\'];
  for (let row = 0; row < rows.length; row += 1) {
    const font = fonts[row % fonts.length];
    const source = rows[row];
    let x = -((game.scroll * (1 - row * 0.13)) % 58) - 58;
    let index = 0;
    while (x < stage.width + 40) {
      const char = source[(index + Math.floor(game.distance / 17)) % source.length];
      const color = hsl(palette.ground + row * 8 + index * 0.9, 68 + row * 4, 46 - row * 6, 0.92 - row * 0.1);
      stage.glyph(char, x, game.groundY + row * (compact ? 17 : 21), { font, color });
      x += textWidth(char, font) + 4 + row * 2;
      index += 1;
    }
  }
}

function drawPlayer(palette) {
  const visual = playerVisual();
  stage.sprite(visual.rows, visual.x, visual.y, {
    font: visual.font,
    size: visual.size,
    lineHeight: visual.lineHeight,
    color: (char, row, col) => {
      if (char === 'o') return hsl(palette.danger, 96, 69);
      if ('_/-\\'.includes(char)) return hsl(palette.accent + col * 2, 94, 69 - row * 3);
      return hsl(palette.accent + row * 9 + col, 82, 59);
    },
  });
}

function drawObstacles(palette) {
  for (const obstacle of game.obstacles) {
    const visual = obstacleVisual(obstacle);
    stage.sprite(visual.rows, visual.x, visual.y, {
      font: visual.font,
      size: visual.size,
      lineHeight: visual.lineHeight,
      color: (char, row, col) => hsl(
        obstacle.type === 'bird' ? palette.danger + col * 3 : palette.ground + 92 + row * 7 + col * 2,
        82,
        49 + ((row + col) % 4) * 7,
      ),
    });
  }
}

function drawParticles(palette) {
  const font = fontSpec(13, 'casual', 400);
  for (const particle of game.particles) {
    stage.glyph(particle.char, particle.x, particle.y, {
      font,
      color: hsl(palette.ground + 18 + particle.life * 70, 78, 58 + particle.life * 12, particle.life),
    });
  }
}

function drawHud(palette) {
  const compact = stage.width < 600;
  const size = compact ? 11 : 14;
  const font = fontSpec(size, 'linear', 700);
  const left = compact ? 12 : 24;
  const eventText = game.event ? `EVENT:${game.event.name}` : `BIOME:${palette.name}`;
  stage.glyph(`DINO//TYPE  ${Math.floor(game.distance).toString().padStart(5, '0')}m  BEST:${game.best.toString().padStart(5, '0')}`, left, 27, {
    font,
    color: hsl(palette.accent, 96, 72),
  });
  stage.glyph(eventText, stage.width - left, 27, {
    font: fontSpec(compact ? 9 : 12, 'casual', 700),
    color: hsl(game.event ? palette.danger : palette.sky + 70, 98, 73),
    align: 'right',
  });
}

function drawOverlay(palette) {
  if (game.state === 'running') return;
  const compact = stage.width < 600;
  const boxWidth = Math.min(stage.width - 32, compact ? 350 : 610);
  const boxHeight = compact ? 235 : 265;
  const x = (stage.width - boxWidth) / 2;
  const y = Math.max(66, (stage.height - boxHeight) / 2 - 10);
  stage.dottedFrame(x, y, boxWidth, boxHeight, { color: hsl(palette.accent, 96, 72), glyph: game.state === 'gameover' ? 'x' : '.' });
  const title = game.state === 'ready' ? 'DINO//TYPE' : game.state === 'paused' ? 'PAUSED//TYPE' : 'EXTINCT//RETRY';
  stage.glyph(title, stage.width / 2, y + 49, {
    font: fontSpec(compact ? 28 : 42, 'casual', 700),
    color: hsl(game.state === 'gameover' ? palette.danger : palette.accent, 100, 70),
    align: 'center',
  });
  const message = game.state === 'ready'
    ? 'A proportional-font dinosaur run. Every cloud, fossil, obstacle and particle is a colored glyph measured by Pretext.'
    : game.state === 'paused'
      ? 'The glyph field is frozen. Press P or ESC to continue.'
      : `Distance ${Math.floor(game.distance)}m. Best ${game.best}m. The desert will typeset another chance.`;
  stage.paragraph(message, x + 25, y + 83, boxWidth - 50, {
    size: compact ? 13 : 16,
    lineHeight: compact ? 18 : 22,
    color: hsl(palette.sky + 42, 72, 79),
  });
  stage.glyph(game.state === 'paused' ? '[ P / ESC : RESUME ]' : '[ SPACE / TAP : RUN ]', stage.width / 2, y + boxHeight - 52, {
    font: fontSpec(compact ? 14 : 18, 'linear', 700),
    color: hsl(palette.accent + 36, 100, 72),
    align: 'center',
  });
  stage.glyph('HOLD W/UP jump  S/DOWN fast fall  PAD A/B  P pause', stage.width / 2, y + boxHeight - 22, {
    font: fontSpec(compact ? 10 : 12, 'linear', 400),
    color: hsl(palette.sky + 95, 82, 70),
    align: 'center',
  });
}

function render() {
  const palette = DINO_PALETTES[game.biomeIndex];
  const sceneTime = game.time;
  stage.clear();
  drawSky(sceneTime, palette);
  drawEvent(sceneTime, palette);
  drawGround(palette);
  drawParticles(palette);
  drawObstacles(palette);
  drawPlayer(palette);
  drawHud(palette);
  drawOverlay(palette);
  stage.publishDiagnostics({
    game: 'dino',
    state: game.state,
    distance: Math.floor(game.distance),
    event: game.event?.name || null,
    lastEvent: game.lastEventName,
    biome: palette.name,
    player: { y: Math.round(game.player.y), duck: game.player.duck },
    visibleColors: stage.frameColors.size,
    visibleGlyphs: stage.frameGlyphs,
    proportional: textWidth('iiii', fontSpec(16)) !== textWidth('WWWW', fontSpec(16)),
    fonts: ['Recursive Linear', 'Recursive Casual'],
    pretext: getPretextUsage(),
    visibleCanvasCount: document.querySelectorAll('canvas:not(.sr-only)').length,
  });
}

addEventListener('resize', () => stage.resize());

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
