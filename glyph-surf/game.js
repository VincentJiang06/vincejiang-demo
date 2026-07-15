import {
  GlyphStage,
  InputState,
  SeededRandom,
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
} from '/assets/glyph-arcade/engine.js';

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
]);

const SURFER = [
  '   o',
  '  /|\\',
  ' ~ |',
  '  / \\',
  '==~~~===',
];

const WORLD_SPRITES = Object.freeze({
  island: ['  yyyyY', ' ,;;;;;, ', ',===:===,', '~~.....~~'],
  coral: ['  Y y', ' \\|/ ', '  Y  ', ' ~~~ '],
  log: ['__===___', '~~---~~~'],
  buoy: ['  !', ' /|\\', '  |', ' ~o~'],
  coin: ['(o)'],
  boost: ['<+>'],
  friend: [' o/', '/| ', '/ \\'],
});

const canvas = document.getElementById('glyph-stage');
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
  paletteIndex: 0,
  event: null,
  lastEventName: null,
  eventLeft: 0,
  eventCooldown: 3.25,
  slowMode: false,
  highVisibility: false,
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

function hashNoise(x, y, t = 0) {
  const value = Math.sin(x * 91.173 + y * 47.331 + t * 19.771) * 14627.317;
  return value - Math.floor(value);
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
  game.paletteIndex = 0;
  game.event = null;
  game.lastEventName = null;
  game.eventLeft = 0;
  game.eventCooldown = 3.25;
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
  return {
    island: { r: 38, harmful: true },
    coral: { r: 23, harmful: true },
    log: { r: 26, harmful: true },
    buoy: { r: 15, harmful: true },
    coin: { r: 14, pickup: true },
    boost: { r: 16, pickup: true },
    friend: { r: 20, pickup: true },
  }[kind];
}

function spawnWorldObject() {
  const currentMode = mode().id;
  let choices = currentMode === 'time'
    ? ['island', 'coral', 'log', 'coin', 'coin', 'boost']
    : ['island', 'coral', 'log', 'buoy', 'coin', 'boost'];
  if (currentMode === 'endless' && game.distance > 500) choices = [...choices, 'friend'];
  const kind = game.rng.pick(choices);
  const config = objectConfig(kind);
  const margin = Math.max(58, config.r + 25);
  game.objects.push({
    kind,
    x: game.rng.range(margin, stage.width - margin),
    y: -80,
    r: config.r,
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
  game.objects.push({ kind: 'gate', x, y: -55, r: width / 2, width, checked: false, phase: 0 });
  game.gateTimer = game.rng.range(1.18, 1.55);
}

function spawnEvent() {
  const candidates = EVENTS.filter(event => !event.endlessOnly || mode().id === 'endless');
  const freshCandidates = candidates.filter(event => event.name !== game.lastEventName);
  const next = game.rng.pick(freshCandidates.length ? freshCandidates : candidates);
  game.event = next;
  game.lastEventName = next.name;
  game.eventLeft = next.duration;
  game.eventCooldown = game.rng.range(12, 18);
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
  const y = Math.max(54, (stage.height - height) / 2 - 12);
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
  if (input.pressed('KeyH')) game.highVisibility = !game.highVisibility;
  if (input.pressed('KeyL')) game.slowMode = !game.slowMode;
  if (input.pressed('KeyG') && game.state !== 'running') location.href = '/gallery/';
  if (input.pressed('KeyM') && game.state === 'results') game.state = 'ready';
  if (input.pressed('KeyP', 'Escape') && (game.state === 'running' || game.state === 'paused')) {
    game.state = game.state === 'paused' ? 'running' : 'paused';
  }
  if (game.state !== 'paused') game.visualTime += dt;

  const keyboardStart = input.pressed('Space', 'Enter');
  const pointerStart = input.pressed('PointerDown');
  if (game.state === 'ready') {
    if (pointerStart) {
      const target = menuPointerTarget(input.pointer.x, input.pointer.y);
      if (target?.type === 'mode') {
        game.modeIndex = target.index;
        setSemanticStatus(`已选择 ${mode().label} 模式。点击 START 开始。`);
      } else if (target?.type === 'start') {
        reset();
      }
    } else if (keyboardStart) reset();
    return;
  }
  if (game.state === 'results') {
    if (keyboardStart || pointerStart || input.pressed('KeyR')) reset();
    updateWake(dt * 0.35);
    return;
  }
  if (game.state === 'paused') return;

  game.time += dt;
  game.elapsed += dt;
  const pad = gamepadSteer();
  let steer = 0;
  if (input.held('ArrowLeft', 'KeyA')) steer -= 1;
  if (input.held('ArrowRight', 'KeyD')) steer += 1;
  if (Math.abs(pad.steer) > Math.abs(steer)) steer = pad.steer;
  if (input.pointer.down && !input.held('ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD')) {
    steer = clamp((input.pointer.x - game.surfer.x) / Math.max(90, stage.width * 0.18), -1, 1);
  }
  const boost = input.held('ArrowUp', 'KeyW') || input.pointer.down || pad.boost;
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

  if (mode().id === 'zigzag') {
    game.gateTimer -= dt;
    if (game.gateTimer <= 0) spawnGate();
  } else {
    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) spawnWorldObject();
  }

  for (const object of game.objects) {
    object.y += game.speed * dt;
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
    if (!object.dead && distance(player, object) < object.r + 14) {
      if (object.pickup) collect(object);
      else if (object.harmful) damage();
      object.dead = true;
    }
  }
  game.objects = game.objects.filter(object => !object.dead && object.y < stage.height + 100);

  game.eventCooldown -= dt;
  if (!game.event && game.eventCooldown <= 0) spawnEvent();
  if (game.event) {
    game.eventLeft -= dt;
    if (game.eventLeft <= 0) game.event = null;
  }

  if (mode().id === 'time' && game.distance >= 1800) finish(true);
  updateWake(dt);
}

function drawWater(now, palette) {
  const compact = stage.width < 600;
  const size = compact ? 11 : 14;
  const lineHeight = compact ? 16 : 20;
  const font = fontSpec(size, 'linear', 400);
  const glyphs = ['~', 's', 'c', 'e', 'a', 'n', '/', '\\', '(', ')', '{', '}', '.', ':', "'", 'i', 'w'];
  const eventHue = game.event?.name === 'BIOLUMINESCENT BLOOM' ? -42
    : game.event?.name === 'SUN SHOWER' ? 34
      : game.event?.name === 'SQUALL LINE' ? 32
        : 0;
  const rows = Math.ceil(stage.height / lineHeight) + 2;
  for (let row = 0; row < rows; row += 1) {
    let x = -42 - ((game.distance * (1.4 + row * 0.018)) % 42);
    let col = 0;
    while (x < stage.width + 36) {
      const wave = Math.sin(row * 0.71 + col * 0.39 + now * (1.4 + row * 0.01));
      const noise = hashNoise(col, row, Math.floor(game.distance / 36));
      const index = Math.floor(clamp((wave * 0.28 + noise * 0.72), 0, 0.999) * glyphs.length);
      const char = glyphs[index];
      const depth = row / rows;
      const hue = palette.deep + (palette.surface - palette.deep) * depth + eventHue + col * 0.52;
      const saturation = 66 + noise * 28;
      const lightness = 22 + depth * 29 + wave * 5 + noise * 7;
      const alpha = 0.48 + noise * 0.44;
      stage.glyph(char, x, row * lineHeight + 14, {
        font,
        color: hsl(hue, saturation, lightness, alpha),
      });
      x += textWidth(char, font) + 5 + noise * 9;
      col += 1;
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
    const rows = WORLD_SPRITES[object.kind];
    const size = stage.width < 600 ? 10 : object.kind === 'island' ? 14 : 13;
    const y = object.y - rows.length * size * 0.82;
    const baseHue = object.kind === 'island' ? palette.sand
      : object.kind === 'coral' ? palette.danger + 38
        : object.kind === 'coin' ? 48
          : object.kind === 'boost' ? 138
            : object.kind === 'friend' ? 28
              : palette.sand - 18;
    stage.sprite(rows, object.x - object.r, y, {
      size,
      lineHeight: size * 0.84,
      family: object.pickup ? 'casual' : 'linear',
      weight: 700,
      color: (char, row, col) => hsl(baseHue + row * 9 + col * 4, 86, 50 + ((row + col) % 5) * 7),
    });
    if (game.highVisibility && object.harmful) {
      const outlineFont = fontSpec(12, 'linear', 700);
      for (let index = 0; index < 14; index += 1) {
        const angle = index / 14 * Math.PI * 2;
        stage.glyph('!', object.x + Math.cos(angle) * (object.r + 7), object.y + Math.sin(angle) * (object.r + 7), {
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
  const compact = stage.width < 600;
  const size = compact ? 12 : 16;
  const y = stage.height * 0.74 - SURFER.length * size * 0.82;
  const alpha = game.surfer.invulnerable > 0 && Math.floor(game.time * 16) % 2 ? 0.35 : 1;
  stage.sprite(SURFER, game.surfer.x - 31, y, {
    size,
    lineHeight: size * 0.84,
    family: 'casual',
    weight: 700,
    alpha,
    color: (char, row, col) => {
      if (char === 'o') return hsl(28 + col * 5, 82, 67);
      if (char === '~' || char === '=') return hsl(palette.foam + col * 5, 98, 70);
      return hsl(328 + row * 15 + col * 3, 88, 62 + col % 3 * 6);
    },
  });
  if (game.surfer.shield > 0) {
    const shieldFont = fontSpec(compact ? 17 : 23, 'casual', 700);
    stage.glyph('(', game.surfer.x - 51, stage.height * 0.74 - 18, { font: shieldFont, color: '#fff46d', alpha: 0.85 });
    stage.glyph(')', game.surfer.x + 43, stage.height * 0.74 - 18, { font: shieldFont, color: '#fff46d', alpha: 0.85 });
  }
}

function formatBest() {
  if (mode().id === 'endless') return `${Math.floor(game.best.endless)}m`;
  if (mode().id === 'time') return game.best.time ? `${Number(game.best.time).toFixed(2)}s` : '--';
  return `${game.best.zigzag}`;
}

function drawHud(palette) {
  const compact = stage.width < 600;
  const font = fontSpec(compact ? 10 : 13, 'linear', 700);
  const hearts = mode().id === 'time' ? `PENALTY +${game.penalties}s` : `${'H'.repeat(game.surfer.hearts)}${'.'.repeat(Math.max(0, 3 - game.surfer.hearts))}`;
  const score = mode().id === 'time'
    ? `${game.elapsed.toFixed(1)}s  ${Math.floor(game.distance)}/1800m  COINS:${game.coins}`
    : mode().id === 'zigzag'
      ? `STREAK:${game.streak}  MAX:${game.maxStreak}  GATES:${game.gatesPassed}`
      : `${Math.floor(game.distance).toString().padStart(5, '0')}m`;
  stage.glyph(`SURF//GLYPH  ${mode().label}  ${hearts}`, 14, 24, { font, color: hsl(palette.foam, 98, 74) });
  stage.glyph(`${score}  BEST:${formatBest()}`, stage.width - 14, 24, {
    font,
    color: hsl(palette.surface + 78, 94, 72),
    align: 'right',
  });
  const meter = Math.round(game.surfer.boost / 10);
  stage.glyph(`BOOST ${'+'.repeat(meter)}${'.'.repeat(10 - meter)}`, 14, 45, {
    font: fontSpec(compact ? 9 : 11, 'casual', 700),
    color: hsl(52 + meter * 2, 100, 66),
  });
  stage.glyph(`${game.event ? `EVENT:${game.event.name}` : SURF_PALETTES[game.paletteIndex].name}  H:${game.highVisibility ? 'HIGH' : 'COLOR'}  L:${game.slowMode ? 'SLOW' : 'FULL'}`, stage.width - 14, 45, {
    font: fontSpec(compact ? 8 : 10, 'linear', 400),
    color: hsl(palette.danger + 20, 92, 72),
    align: 'right',
  });
}

function drawOverlay(palette) {
  if (game.state === 'running') return;
  const layout = overlayLayout();
  const { compact, width, height, x, y } = layout;
  stage.dottedFrame(x, y, width, height, { color: hsl(palette.foam, 100, 73), glyph: game.state === 'results' ? '+' : '.' });
  stage.glyph(game.state === 'ready' ? 'SURF//GLYPH' : game.state === 'paused' ? 'CURRENT//PAUSED' : 'TIDE//RESULT', stage.width / 2, y + 50, {
    font: fontSpec(compact ? 27 : 43, 'casual', 700),
    color: hsl(palette.foam, 100, 72),
    align: 'center',
  });

  if (game.state === 'ready') {
    stage.paragraph('A top-down ocean rendered only with proportional, independently colored glyphs. Choose a current:', x + 28, y + 82, width - 56, {
      size: compact ? 12 : 15,
      lineHeight: compact ? 17 : 21,
      color: hsl(palette.surface + 42, 76, 79),
    });
    for (let index = 0; index < SURF_MODES.length; index += 1) {
      const item = SURF_MODES[index];
      const active = index === game.modeIndex;
      const rowY = layout.menuFirstY + index * layout.menuStep;
      stage.glyph(`${active ? '>>' : '  '} ${item.key}. ${item.label}`, x + 35, rowY, {
        font: fontSpec(compact ? 14 : 18, active ? 'casual' : 'linear', 700),
        color: hsl(active ? palette.foam : palette.surface + index * 18, 96, active ? 72 : 62),
      });
      stage.glyph(item.goal, x + 35, rowY + 17, {
        font: fontSpec(compact ? 9 : 11, 'linear', 400),
        color: hsl(palette.deep + 95 + index * 9, 72, 70),
      });
    }
    stage.dottedFrame(layout.startX, layout.startY - 23, layout.startWidth, 31, {
      color: hsl(palette.foam + 24, 100, 73),
      glyph: Math.floor(game.visualTime * 3) % 2 ? '.' : '+',
    });
    stage.glyph('[ START CURRENT ]', stage.width / 2, layout.startY, {
      font: fontSpec(compact ? 13 : 16, 'casual', 700),
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
      size: compact ? 15 : 20,
      lineHeight: compact ? 21 : 28,
      family: 'casual',
      weight: 700,
      color: hsl(palette.surface + 62, 96, 72),
    });
    stage.glyph(game.state === 'paused' ? '[ P / ESC : RESUME ]' : '[ SPACE / TAP : AGAIN ]', stage.width / 2, y + height - 88, {
      font: fontSpec(compact ? 14 : 19, 'linear', 700),
      color: hsl(palette.foam, 100, 73),
      align: 'center',
    });
    if (game.state === 'results') {
      stage.glyph('[ M : MODE MENU ]', stage.width / 2, y + height - 57, {
        font: fontSpec(compact ? 11 : 14, 'linear', 700),
        color: hsl(palette.danger, 92, 70),
        align: 'center',
      });
    }
  }
  stage.glyph('A/D steer  W boost  S brake  H visibility  L slow  P pause  G gallery', stage.width / 2, y + height - 25, {
    font: fontSpec(compact ? 8 : 10, 'linear', 400),
    color: hsl(palette.surface + 95, 78, 70),
    align: 'center',
  });
}

function render() {
  const palette = SURF_PALETTES[game.paletteIndex];
  stage.clear();
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
    distance: Math.floor(game.distance),
    event: game.event?.name || null,
    hearts: game.surfer.hearts,
    surferX: Math.round(game.surfer.x),
    speed: Math.round(game.speed),
    highVisibility: game.highVisibility,
    slowMode: game.slowMode,
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
