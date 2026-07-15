import {
  GlyphStage,
  InputState,
  SeededRandom,
  clamp,
  createLoop,
  fontSpec,
  freeFlowIntervals,
  getPretextUsage,
  hsl,
  loadBest,
  saveBest,
  setSemanticStatus,
  textWidth,
  waitForGlyphFonts,
} from '../assets/glyph-arcade/engine.js?v=glyph-20260715-pinball1';
import {
  bounceFromPaddle,
  choosePlayerTarget,
  fragmentFitsFreeIntervals,
  movePaddleToward,
  predictInterceptX,
  remapPointBetweenArenas,
  resetBumperStates,
  reflectIntoRange,
  resolveCircleRect,
  scoreBoundary,
  shouldShowTouchToolbar,
  stateAllowsPlayerMotion,
} from './physics.js?v=glyph-20260715-pinball1';

export const AI_REACTION_SECONDS = 0.18;

export const TEXT_CORPORA = Object.freeze([
  Object.freeze({
    id: 'motion',
    label: 'MOTION / MOMENTUM',
    family: 'linear',
    hues: [168, 186, 205, 258, 326, 48],
    text: 'motion carries a direction / momentum changes at every contact / an angle is a decision / the wall returns what it receives / speed is distance remembered by time / a moving paddle lends spin / prediction is only a folded line / every miss becomes a new serve / the circle crosses a field of measured words / reflection turns arrival into departure',
  }),
  Object.freeze({
    id: 'language',
    label: 'LANGUAGE / RHYTHM',
    family: 'casual',
    hues: [48, 92, 168, 205, 278, 332],
    text: 'letters gather into rhythm / a sentence bends around a moving point / narrow space changes voice and scale / punctuation opens a small corridor / words wait at the edge of impact / the next line begins where the last collision ended / every return edits the page / meaning survives compression / the field keeps speaking while the ball keeps moving',
  }),
  Object.freeze({
    id: 'arcade',
    label: 'ARCADE / SIGNAL',
    family: 'linear',
    hues: [326, 16, 48, 112, 186, 272],
    text: 'ready player return / one ball two reflectors many possible angles / rally becomes score / score becomes memory / move left move right keep the signal alive / the upper machine predicts but cannot know / the lower hand changes the future / bright glyphs mark a collision / continue continue continue / no pixels were filled except by letters',
  }),
  Object.freeze({
    id: 'cosmos',
    label: 'ORBIT / GRAVITY',
    family: 'casual',
    hues: [205, 232, 266, 304, 348, 58],
    text: 'an orbit is a fall that keeps missing / vectors cross the dark field / a small body meets an invisible boundary / the path folds and continues / observation changes anticipation / distant lights become coordinates / gravity writes curves while this arena writes straight segments / every rebound redraws the local sky / the reflector waits near the horizon',
  }),
]);

export const TEXT_BUMPERS = Object.freeze([
  Object.freeze({ id: 'momentum', x: 0.22, y: 0.34, hue: 168, labels: ['[ MOMENTUM ]', '[ IMPULSE! ]'] }),
  Object.freeze({ id: 'angle', x: 0.77, y: 0.39, hue: 326, labels: ['< ANGLE >', '< DEFLECT >'] }),
  Object.freeze({ id: 'return', x: 0.34, y: 0.54, hue: 48, labels: ['RETURN /', 'REBOUND /'] }),
  Object.freeze({ id: 'syntax', x: 0.70, y: 0.61, hue: 258, labels: ['{ SYNTAX }', '{ REFLOW }'] }),
  Object.freeze({ id: 'pressure', x: 0.18, y: 0.72, hue: 112, labels: ['TYPE PRESSURE', 'TYPE RELEASE'] }),
  Object.freeze({ id: 'measure', x: 0.82, y: 0.76, hue: 205, labels: ['MEASURED', 'REMEASURED'] }),
]);

const COLORS = Object.freeze({
  aqua: '#5fffe0',
  violet: '#9a7cff',
  magenta: '#ff5ca8',
  amber: '#fff36d',
  lime: '#b7ff6a',
  ice: '#dffcff',
  dim: '#39556b',
  dark: '#02040b',
});

const canvas = document.getElementById('glyph-stage');
const stage = new GlyphStage(canvas);
const input = new InputState(canvas);
const rng = new SeededRandom(0x71EBA11);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)');
const semanticControlButtons = [...document.querySelectorAll('[data-pinball-action]')];

const game = {
  state: 'ready',
  time: 0,
  rally: 0,
  best: loadBest('glyph-pinball-best'),
  playerScore: 0,
  aiScore: 0,
  corpusIndex: 0,
  highContrast: false,
  flowMap: false,
  showPrediction: true,
  renderDirty: true,
  warmupFrames: 2,
  flowCache: null,
  flowCacheStatus: { hit: false, ageMs: 0, sourceExclusions: 0, renderedFragments: 0 },
  lastFlowAt: -Infinity,
  pointDelay: 0,
  nextServeDirection: -1,
  aiReactionLeft: 0,
  aiTargetX: 0,
  aiPredictionX: null,
  aiDecisions: 0,
  player: { centerX: 0, velocity: 0 },
  ai: { centerX: 0, velocity: 0 },
  ball: { x: 0, y: 0, vx: 0, vy: 0, radius: 8 },
  trail: [],
  bumpers: TEXT_BUMPERS.map(source => ({ ...source, variant: 0, active: 0, cooldown: 0 })),
};

function compactMode() {
  return stage.width < 620;
}

function touchCapable() {
  return coarsePointer.matches || navigator.maxTouchPoints > 0;
}

function hasTouchToolbar() {
  return shouldShowTouchToolbar(stage.width, touchCapable());
}

const TOUCH_CONTROLS = Object.freeze([
  Object.freeze({ action: 'corpus', label: '[C]TEXT' }),
  Object.freeze({ action: 'flow', label: '[F]FLOW' }),
  Object.freeze({ action: 'prediction', label: '[V]AIM' }),
  Object.freeze({ action: 'contrast', label: '[H]HI' }),
  Object.freeze({ action: 'pause', label: '[P]PAUSE' }),
  Object.freeze({ action: 'reset', label: '[R]RESET' }),
]);

function touchToolbarLayout() {
  const field = arena();
  const top = field.top + 38;
  const height = 44;
  const availableWidth = field.right - field.left;
  const width = Math.min(availableWidth, compactMode() ? availableWidth : 720);
  const x = field.left + (availableWidth - width) / 2;
  return { x, top, height, width, itemWidth: width / TOUCH_CONTROLS.length, bottom: top + height };
}

export function touchToolbarAction(pointerX, pointerY) {
  if (!hasTouchToolbar()) return null;
  const layout = touchToolbarLayout();
  if (pointerX < layout.x || pointerX > layout.x + layout.width || pointerY < layout.top || pointerY > layout.bottom) return null;
  const index = clamp(Math.floor((pointerX - layout.x) / layout.itemWidth), 0, TOUCH_CONTROLS.length - 1);
  return TOUCH_CONTROLS[index].action;
}

function arena() {
  return {
    left: stage.safeLeft + 12,
    right: stage.width - stage.safeRight - 12,
    top: stage.safeTop + 7,
    bottom: stage.height - stage.safeBottom - 7,
  };
}

function paddleGeometry() {
  const compact = compactMode();
  const field = arena();
  const playerFont = fontSpec(compact ? 10 : 12, 'casual', 700);
  const aiFont = fontSpec(compact ? 9 : 11, 'linear', 700);
  const playerLabel = compact ? '<< YOU ===== >>' : '<< YOU ============ >>';
  const aiLabel = compact ? '< AUTO ==== >' : '< AUTO·REFLECTOR ======= >';
  const playerWidth = clamp(textWidth(playerLabel, playerFont) + 18, compact ? 92 : 122, compact ? 124 : 184);
  const aiWidth = clamp(textWidth(aiLabel, aiFont) + 16, compact ? 82 : 108, compact ? 112 : 170);
  return {
    player: {
      x: game.player.centerX - playerWidth / 2,
      y: field.bottom - (compact ? 39 : 45),
      w: playerWidth,
      h: compact ? 15 : 18,
      centerX: game.player.centerX,
      width: playerWidth,
      velocity: game.player.velocity,
      label: playerLabel,
      font: playerFont,
    },
    ai: {
      x: game.ai.centerX - aiWidth / 2,
      y: field.top + (hasTouchToolbar() ? 100 : 55),
      w: aiWidth,
      h: compact ? 14 : 17,
      centerX: game.ai.centerX,
      width: aiWidth,
      velocity: game.ai.velocity,
      label: aiLabel,
      font: aiFont,
    },
  };
}

function layoutBumpers() {
  const compact = compactMode();
  const field = arena();
  const verticalSpan = field.bottom - field.top;
  const count = compact ? 4 : game.bumpers.length;
  return game.bumpers.slice(0, count).map((bumper, index) => {
    const active = bumper.active > 0 && !reducedMotion;
    const baseSize = compact ? 11 + index % 2 : 14 + index % 3;
    const size = baseSize + (active ? 3 : 0);
    const family = active ? 'casual' : index % 2 ? 'linear' : 'casual';
    const font = fontSpec(size, family, active ? 700 : 400);
    const label = bumper.labels[bumper.variant];
    const width = textWidth(label, font) + (compact ? 10 : 16);
    const height = size + (compact ? 8 : 11);
    const centerX = clamp(field.left + (field.right - field.left) * bumper.x, field.left + width / 2 + 3, field.right - width / 2 - 3);
    const centerY = field.top + verticalSpan * bumper.y;
    return { ...bumper, index, active, label, font, size, family, x: centerX - width / 2, y: centerY - height / 2, w: width, h: height, centerX, centerY };
  });
}

function rectExclusion(id, rect, padding = 4) {
  return {
    id,
    padding,
    polygons: [[
      { x: rect.x, y: rect.y },
      { x: rect.x + rect.w, y: rect.y },
      { x: rect.x + rect.w, y: rect.y + rect.h },
      { x: rect.x, y: rect.y + rect.h },
    ]],
  };
}

function circleExclusion(id, circle, padding = 4) {
  const points = [];
  const radius = circle.radius + 2;
  for (let index = 0; index < 12; index += 1) {
    const angle = index / 12 * Math.PI * 2;
    points.push({ x: circle.x + Math.cos(angle) * radius, y: circle.y + Math.sin(angle) * radius });
  }
  return { id, padding, polygons: [points] };
}

function messageRect() {
  const field = arena();
  const width = Math.min(field.right - field.left - 24, compactMode() ? 310 : 520);
  return {
    x: stage.width / 2 - width / 2,
    y: stage.height / 2 - (compactMode() ? 58 : 66),
    w: width,
    h: compactMode() ? 116 : 132,
  };
}

function readyBallGeometry() {
  const message = messageRect();
  const radius = compactMode() ? 7 : 8;
  return {
    x: stage.width / 2,
    y: message.y - radius - (compactMode() ? 9 : 12),
    radius,
  };
}

function rectanglesOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function renderableBumpers() {
  const bumpers = layoutBumpers();
  return game.state === 'running' ? bumpers : bumpers.filter(bumper => !rectanglesOverlap(bumper, messageRect()));
}

export function dynamicExclusions() {
  const paddles = paddleGeometry();
  const field = arena();
  const visibleBall = game.state === 'ready' ? readyBallGeometry() : game.ball;
  const exclusions = [
    rectExclusion('hud', { x: field.left, y: field.top, w: field.right - field.left, h: hasTouchToolbar() ? 88 : 46 }, 3),
    rectExclusion('ai-reflector', paddles.ai, 6),
    rectExclusion('player-reflector', paddles.player, 6),
    ...(game.state === 'point' ? [] : [circleExclusion('ball', visibleBall, 5)]),
    ...renderableBumpers().map(bumper => rectExclusion(`word-${bumper.id}`, bumper, 4)),
  ];
  if (game.state === 'ready' || game.state === 'point' || game.state === 'paused') {
    exclusions.push(rectExclusion('message', messageRect(), 7));
  }
  return exclusions;
}

function resetBall() {
  const paddles = paddleGeometry();
  game.ball.x = stage.width / 2;
  game.ball.y = (paddles.ai.y + paddles.ai.h + paddles.player.y) / 2;
  game.ball.vx = 0;
  game.ball.vy = 0;
  game.ball.radius = compactMode() ? 7 : 8;
  game.trail.length = 0;
}

function ensurePositions() {
  const field = arena();
  if (!game.player.centerX) game.player.centerX = stage.width / 2;
  if (!game.ai.centerX) game.ai.centerX = stage.width / 2;
  const paddles = paddleGeometry();
  game.player.centerX = clamp(game.player.centerX, field.left + paddles.player.w / 2, field.right - paddles.player.w / 2);
  game.ai.centerX = clamp(game.ai.centerX, field.left + paddles.ai.w / 2, field.right - paddles.ai.w / 2);
  if (game.state !== 'running' && game.state !== 'paused') resetBall();
}

function launch(direction = -1) {
  resetBall();
  const speed = reducedMotion ? (compactMode() ? 180 : 205) : (compactMode() ? 210 : 245);
  const horizontal = rng.range(speed * 0.26, speed * 0.48) * (rng.next() > 0.5 ? 1 : -1);
  game.ball.vx = horizontal;
  game.ball.vy = direction * Math.sqrt(Math.max(1, speed * speed - horizontal * horizontal));
  game.state = 'running';
  game.rally = 0;
  game.pointDelay = 0;
  game.aiReactionLeft = 0;
  game.aiPredictionX = null;
  game.flowCache = null;
  game.warmupFrames = 0;
  game.renderDirty = true;
  setSemanticStatus('发球。移动底部字符反射板，把球顶回文字场。');
}

function resetMatch() {
  input.reset();
  game.state = 'ready';
  game.playerScore = 0;
  game.aiScore = 0;
  game.rally = 0;
  game.pointDelay = 0;
  game.nextServeDirection = -1;
  game.aiPredictionX = null;
  game.aiTargetX = stage.width / 2;
  game.player.centerX = stage.width / 2;
  game.ai.centerX = stage.width / 2;
  game.player.velocity = 0;
  game.ai.velocity = 0;
  game.flowCache = null;
  resetBumperStates(game.bumpers);
  resetBall();
  game.warmupFrames = 2;
  game.renderDirty = true;
  syncSemanticControls();
  setSemanticStatus('准备完成。按空格或轻触画面发球。');
}

function awardPoint(winner) {
  if (winner === 'player') game.playerScore += 1;
  else game.aiScore += 1;
  game.state = 'point';
  game.flowCache = null;
  game.pointDelay = 0.9;
  game.nextServeDirection = winner === 'player' ? 1 : -1;
  resetBall();
  game.warmupFrames = 2;
  game.renderDirty = true;
  setSemanticStatus(`${winner === 'player' ? '你' : '算法反射板'}得到一分。短暂停顿后自动重新发球。`);
}

function updatePlayer(dt) {
  const field = arena();
  const paddle = paddleGeometry().player;
  const left = input.held('ArrowLeft', 'KeyA');
  const right = input.held('ArrowRight', 'KeyD');
  const target = choosePlayerTarget({
    left,
    right,
    pointerActive: input.pointer.active,
    pointerX: input.pointer.x,
    pointerY: input.pointer.y,
  }, game.player.centerX, { left: field.left, right: field.right, height: stage.height });
  const moving = left || right || (input.pointer.active && input.pointer.y > stage.height * 0.42);
  const next = movePaddleToward(game.player.centerX, target, dt, {
    maxSpeed: compactMode() ? 520 : 680,
    minCenter: field.left + paddle.w / 2,
    maxCenter: field.right - paddle.w / 2,
    deadZone: !left && !right && input.pointer.active ? 2 : 0,
  });
  if (!moving) next.velocity = 0;
  if (next.center !== game.player.centerX) game.renderDirty = true;
  game.player.centerX = next.center;
  game.player.velocity = next.velocity;
}

function updateAi(dt) {
  const field = arena();
  const paddle = paddleGeometry().ai;
  game.aiReactionLeft -= dt;
  if (game.aiReactionLeft <= 0) {
    game.aiReactionLeft = AI_REACTION_SECONDS;
    game.aiDecisions += 1;
    if (game.ball.vy < 0) {
      const predicted = predictInterceptX(
        game.ball,
        paddle.y + paddle.h + game.ball.radius,
        field.left + game.ball.radius,
        field.right - game.ball.radius,
      );
      game.aiPredictionX = predicted;
      const error = Math.sin(game.aiDecisions * 2.17 + game.rally * 0.73) * paddle.w * 0.72;
      game.aiTargetX = predicted == null ? stage.width / 2 : predicted + error;
    } else {
      game.aiPredictionX = null;
      game.aiTargetX = stage.width / 2;
    }
  }
  const next = movePaddleToward(game.ai.centerX, game.aiTargetX, dt, {
    maxSpeed: compactMode() ? 225 : 285,
    minCenter: field.left + paddle.w / 2,
    maxCenter: field.right - paddle.w / 2,
    deadZone: compactMode() ? 5 : 7,
  });
  game.ai.centerX = next.center;
  game.ai.velocity = next.velocity;
}

function recordRally(actor) {
  game.rally += 1;
  if (game.rally > game.best) {
    game.best = game.rally;
    saveBest('glyph-pinball-best', game.best);
  }
  setSemanticStatus(`${actor}完成回球。当前连续 ${game.rally} 次。`);
}

function updateBall(dt) {
  const field = arena();
  const substeps = 2;
  for (let step = 0; step < substeps; step += 1) {
    const slice = dt / substeps;
    game.ball.x += game.ball.vx * slice;
    game.ball.y += game.ball.vy * slice;
    if (game.ball.x - game.ball.radius < field.left) {
      game.ball.x = field.left + game.ball.radius;
      game.ball.vx = Math.abs(game.ball.vx);
    } else if (game.ball.x + game.ball.radius > field.right) {
      game.ball.x = field.right - game.ball.radius;
      game.ball.vx = -Math.abs(game.ball.vx);
    }

    const paddles = paddleGeometry();
    if (game.ball.vy > 0 && game.ball.y < paddles.player.y + paddles.player.h) {
      const hit = resolveCircleRect(game.ball, paddles.player, 'top');
      if (hit.collided) {
        game.ball = bounceFromPaddle(hit.ball, paddles.player, -1, { maxSpeed: reducedMotion ? 330 : 410 });
        game.ball.y = paddles.player.y - game.ball.radius - 0.2;
        recordRally('你');
      }
    }
    if (game.ball.vy < 0 && game.ball.y > paddles.ai.y) {
      const hit = resolveCircleRect(game.ball, paddles.ai, 'bottom');
      if (hit.collided) {
        game.ball = bounceFromPaddle(hit.ball, paddles.ai, 1, { maxSpeed: reducedMotion ? 330 : 410 });
        game.ball.y = paddles.ai.y + paddles.ai.h + game.ball.radius + 0.2;
        recordRally('算法反射板');
      }
    }

    const bumpers = layoutBumpers();
    for (const rect of bumpers) {
      const source = game.bumpers[rect.index];
      if (source.cooldown > 0) continue;
      const result = resolveCircleRect(game.ball, rect);
      if (!result.collided) continue;
      game.ball = result.ball;
      source.cooldown = 0.1;
      source.active = reducedMotion ? 0.12 : 0.5;
      source.variant = (source.variant + 1) % source.labels.length;
      game.renderDirty = true;
      break;
    }

    const scored = scoreBoundary(game.ball.y, field.top, field.bottom, game.ball.radius);
    if (scored) {
      awardPoint(scored);
      return;
    }
  }

  game.trail.unshift({ x: game.ball.x, y: game.ball.y });
  game.trail.length = Math.min(reducedMotion ? 2 : 7, game.trail.length);
}

function cycleCorpus() {
  game.corpusIndex = (game.corpusIndex + 1) % TEXT_CORPORA.length;
  game.flowCache = null;
  game.warmupFrames = 2;
  game.renderDirty = true;
  syncSemanticControls();
  setSemanticStatus(`Pretext 文字主题切换为 ${TEXT_CORPORA[game.corpusIndex].label}。`);
}

function applyControlAction(action) {
  if (action === 'corpus') cycleCorpus();
  else if (action === 'flow') {
    game.flowMap = !game.flowMap;
    game.warmupFrames = 2;
    game.renderDirty = true;
  } else if (action === 'prediction') {
    game.showPrediction = !game.showPrediction;
    game.warmupFrames = 2;
    game.renderDirty = true;
  } else if (action === 'contrast') {
    game.highContrast = !game.highContrast;
    game.flowCache = null;
    game.warmupFrames = 2;
    game.renderDirty = true;
  } else if (action === 'reset') resetMatch();
  else if (action === 'pause' && (game.state === 'running' || game.state === 'paused')) {
    game.state = game.state === 'paused' ? 'running' : 'paused';
    game.flowCache = null;
    game.warmupFrames = 2;
    game.renderDirty = true;
    setSemanticStatus(game.state === 'paused' ? '游戏已暂停。' : '游戏继续。');
  }
  syncSemanticControls();
}

function syncSemanticControls() {
  for (const button of semanticControlButtons) {
    const action = button.dataset.pinballAction;
    const pressed = action === 'flow' ? game.flowMap
      : action === 'prediction' ? game.showPrediction
        : action === 'contrast' ? game.highContrast
          : action === 'pause' ? game.state === 'paused'
            : null;
    if (pressed !== null) button.setAttribute('aria-pressed', String(pressed));
    if (action === 'corpus') button.textContent = `切换文字主题，当前 ${TEXT_CORPORA[game.corpusIndex].label}`;
    if (action === 'pause') button.textContent = game.state === 'paused' ? '继续游戏' : '暂停游戏';
  }
}

function update(dt) {
  game.time += game.state === 'paused' ? 0 : dt;
  const pointerStart = input.pressed('PointerDown');
  const toolbarAction = pointerStart ? touchToolbarAction(input.pointer.x, input.pointer.y) : null;
  if (input.pressed('KeyC')) applyControlAction('corpus');
  if (input.pressed('KeyF')) applyControlAction('flow');
  if (input.pressed('KeyV')) applyControlAction('prediction');
  if (input.pressed('KeyH')) applyControlAction('contrast');
  if (input.pressed('KeyR')) applyControlAction('reset');
  if (input.pressed('KeyG')) location.href = '/gallery/';
  if (input.pressed('KeyP', 'Escape')) applyControlAction('pause');
  if (toolbarAction) applyControlAction(toolbarAction);

  if (!stateAllowsPlayerMotion(game.state)) return;
  updatePlayer(dt);

  const start = input.pressed('Space', 'Enter') || (pointerStart && !toolbarAction);
  if (game.state === 'ready') {
    if (start) launch(game.nextServeDirection);
    return;
  }
  if (game.state === 'point') {
    const previousTick = Math.ceil(game.pointDelay * 10);
    const nextDelay = Math.max(0, game.pointDelay - dt);
    game.pointDelay = nextDelay;
    if (Math.ceil(nextDelay * 10) !== previousTick) game.renderDirty = true;
    if (start || game.pointDelay <= 0) launch(game.nextServeDirection);
    return;
  }
  if (game.state !== 'running') return;

  updateAi(dt);
  for (const bumper of game.bumpers) {
    bumper.cooldown = Math.max(0, bumper.cooldown - dt);
    bumper.active = Math.max(0, bumper.active - dt);
  }
  updateBall(dt);
}

function flowVisual(theme, index) {
  const hue = theme.hues[index % theme.hues.length];
  return {
    color: hsl(hue, game.highContrast ? 96 : 88, game.highContrast ? 82 : 75),
    alpha: game.highContrast ? 0.96 : 0.82 + index % 4 * 0.04,
  };
}

function renderTextField(exclusions) {
  const theme = TEXT_CORPORA[game.corpusIndex];
  const field = arena();
  if (reducedMotion && game.flowCache && game.time - game.lastFlowAt < 0.24) {
    const replayedFragments = [];
    for (let index = 0; index < game.flowCache.fragments.length; index += 1) {
      const fragment = game.flowCache.fragments[index];
      const freeIntervals = freeFlowIntervals(
        { x: fragment.x, y: fragment.y, w: fragment.w, h: fragment.h },
        fragment.y,
        fragment.y + fragment.h + 1,
        exclusions,
      );
      if (!fragmentFitsFreeIntervals(fragment, freeIntervals)) continue;
      const visual = flowVisual(theme, index);
      stage.glyph(fragment.text, fragment.x, fragment.y + fragment.h - 1, {
        font: fragment.font,
        color: visual.color,
        alpha: visual.alpha,
        knownWidth: fragment.w,
      });
      replayedFragments.push(fragment);
    }
    const ageMs = Math.round((game.time - game.lastFlowAt) * 1000);
    game.flowCacheStatus = {
      hit: true,
      ageMs,
      sourceExclusions: game.flowCache.sourceExclusions,
      renderedFragments: replayedFragments.length,
    };
    stage.flowDiagnostics = {
      ...game.flowCache.diagnostics,
      fontSizes: [...game.flowCache.diagnostics.fontSizes],
      families: [...game.flowCache.diagnostics.families],
      cacheHit: true,
      cacheAgeMs: ageMs,
      sourceExclusions: game.flowCache.sourceExclusions,
      layoutExclusions: exclusions.length,
      renderedFragments: replayedFragments.length,
    };
    return { fragments: replayedFragments, slots: game.flowCache.slots, cursor: game.flowCache.cursor };
  }
  const flow = stage.flowText(theme.text, {
    x: field.left + 2,
    y: field.top + 2,
    w: field.right - field.left - 4,
    h: field.bottom - field.top - 4,
  }, exclusions, {
    size: compactMode() ? 9 : 11,
    family: theme.family,
    weight: 400,
    lineHeight: compactMode() ? 10 : 12,
    minWidth: 24,
    squeeze: {
      minSize: 7,
      maxSize: compactMode() ? 10 : 11,
      narrowWidth: 44,
      wideWidth: compactMode() ? 128 : 190,
      step: 1,
      compressedFamily: theme.family === 'linear' ? 'casual' : 'linear',
      compressedBelow: compactMode() ? 72 : 82,
    },
    color: ({ index }) => flowVisual(theme, index).color,
    alpha: ({ index }) => flowVisual(theme, index).alpha,
  });
  game.flowCacheStatus = {
    hit: false,
    ageMs: 0,
    sourceExclusions: exclusions.length,
    renderedFragments: flow.fragments.length,
  };
  stage.flowDiagnostics.cacheHit = false;
  stage.flowDiagnostics.cacheAgeMs = 0;
  stage.flowDiagnostics.sourceExclusions = exclusions.length;
  stage.flowDiagnostics.layoutExclusions = exclusions.length;
  stage.flowDiagnostics.renderedFragments = flow.fragments.length;
  if (reducedMotion) {
    game.lastFlowAt = game.time;
    game.flowCache = {
      fragments: flow.fragments,
      slots: flow.slots,
      cursor: flow.cursor,
      sourceExclusions: exclusions.length,
      diagnostics: {
        ...stage.flowDiagnostics,
        fontSizes: [...stage.flowDiagnostics.fontSizes],
        families: [...stage.flowDiagnostics.families],
      },
    };
  }
  return flow;
}

function renderWalls() {
  const field = arena();
  const font = fontSpec(compactMode() ? 8 : 10, 'linear', 700);
  for (let y = field.top + 50; y < field.bottom - 24; y += compactMode() ? 12 : 15) {
    stage.glyph('│', field.left - 5, y, { font, color: COLORS.dim, alpha: 0.86, align: 'center' });
    stage.glyph('│', field.right + 5, y, { font, color: COLORS.dim, alpha: 0.86, align: 'center' });
  }
  const netFont = fontSpec(compactMode() ? 7 : 9, 'casual', 400);
  for (let y = field.top + 100; y < field.bottom - 80; y += compactMode() ? 31 : 38) {
    stage.glyph(':', stage.width / 2, y, { font: netFont, color: COLORS.violet, alpha: 0.42, align: 'center' });
  }
}

function renderBumpers() {
  for (const bumper of renderableBumpers()) {
    const color = bumper.active ? COLORS.ice : hsl(bumper.hue, 92, game.highContrast ? 76 : 67);
    if (!compactMode()) stage.dottedFrame(bumper.x, bumper.y, bumper.w, bumper.h, { glyph: bumper.active ? '+' : '.', size: 7, color, alpha: bumper.active ? 0.94 : 0.58 });
    stage.glyph(bumper.label, bumper.centerX, bumper.centerY + bumper.size * 0.35, {
      font: bumper.font,
      color,
      alpha: bumper.active ? 1 : 0.9,
      align: 'center',
    });
  }
}

function renderPrediction() {
  if (!game.showPrediction || game.ball.vy >= 0 || game.aiPredictionX == null) return;
  const field = arena();
  const paddle = paddleGeometry().ai;
  const steps = compactMode() ? 7 : 11;
  const font = fontSpec(compactMode() ? 7 : 9, 'casual', 400);
  for (let index = 1; index <= steps; index += 1) {
    const ratio = index / (steps + 1);
    const y = game.ball.y + (paddle.y + paddle.h - game.ball.y) * ratio;
    const seconds = (y - game.ball.y) / game.ball.vy;
    const x = reflectIntoRange(game.ball.x + game.ball.vx * seconds, field.left + game.ball.radius, field.right - game.ball.radius);
    stage.glyph(index % 3 ? '·' : '›', x, y, { font, color: COLORS.aqua, alpha: 0.52, align: 'center' });
  }
  stage.glyph(compactMode() ? '⌄ predict' : '⌄ algorithm predicts here', game.aiPredictionX, paddle.y + paddle.h + 24, {
    font,
    color: COLORS.aqua,
    alpha: 0.78,
    align: 'center',
  });
}

function renderPaddlesAndBall() {
  const paddles = paddleGeometry();
  stage.glyph(paddles.ai.label, paddles.ai.centerX, paddles.ai.y + paddles.ai.h - 2, {
    font: paddles.ai.font,
    color: COLORS.aqua,
    align: 'center',
  });
  stage.glyph(paddles.player.label, paddles.player.centerX, paddles.player.y + paddles.player.h - 2, {
    font: paddles.player.font,
    color: COLORS.amber,
    align: 'center',
  });
  if (game.state === 'ready' || game.state === 'point') return;
  const trailGlyphs = ['O', 'o', '·', '·', '·', '·', '·'];
  for (let index = game.trail.length - 1; index >= 1; index -= 1) {
    const point = game.trail[index];
    stage.glyph(trailGlyphs[Math.min(index, trailGlyphs.length - 1)], point.x, point.y + 3, {
      font: fontSpec(Math.max(6, 13 - index), index % 2 ? 'casual' : 'linear', 400),
      color: index % 2 ? COLORS.magenta : COLORS.violet,
      alpha: reducedMotion ? 0.18 : Math.max(0.12, 0.62 - index * 0.075),
      align: 'center',
    });
  }
  stage.glyph('●', game.ball.x, game.ball.y + game.ball.radius * 0.72, {
    font: fontSpec(compactMode() ? 17 : 21, 'casual', 700),
    color: COLORS.ice,
    align: 'center',
  });
  stage.glyph('o', game.ball.x - game.ball.radius * 0.35, game.ball.y + game.ball.radius * 0.1, {
    font: fontSpec(compactMode() ? 7 : 8, 'linear', 700),
    color: COLORS.amber,
    alpha: 0.86,
    align: 'center',
  });
}

function renderHud(flow, exclusions) {
  const field = arena();
  const compact = compactMode();
  const titleFont = fontSpec(compact ? 9 : 11, 'casual', 700);
  const smallFont = fontSpec(compact ? 7 : 9, 'linear', 700);
  stage.glyph('TYPE//PINBALL', field.left, field.top + (compact ? 12 : 15), { font: titleFont, color: COLORS.ice });
  stage.glyph(`YOU:${game.playerScore}  AUTO:${game.aiScore}  RALLY:${game.rally}  BEST:${game.best}`, field.right, field.top + (compact ? 12 : 15), {
    font: smallFont,
    color: COLORS.amber,
    align: 'right',
  });
  stage.glyph(`PTX ${TEXT_CORPORA[game.corpusIndex].label}  slots:${flow.slots}  exclusions:${exclusions.length}  fonts:${stage.flowDiagnostics.fontSizes.join('/')}`, field.left, field.top + (compact ? 28 : 34), {
    font: smallFont,
    color: COLORS.aqua,
  });
  if (!hasTouchToolbar()) {
    stage.glyph('A/D or ←/→ move  ·  touch/drag  ·  C corpus  F flow  V prediction  H contrast  P pause  R reset  G gallery', field.right, field.top + 34, {
      font: smallFont,
      color: COLORS.violet,
      align: 'right',
    });
  } else {
    renderTouchToolbar();
  }
}

function renderTouchToolbar() {
  if (!hasTouchToolbar()) return;
  const layout = touchToolbarLayout();
  const font = fontSpec(6.5, 'linear', 700);
  for (let index = 0; index < TOUCH_CONTROLS.length; index += 1) {
    const control = TOUCH_CONTROLS[index];
    const x = layout.x + index * layout.itemWidth;
    const selected = control.action === 'flow' ? game.flowMap
      : control.action === 'prediction' ? game.showPrediction
        : control.action === 'contrast' ? game.highContrast
          : control.action === 'pause' ? game.state === 'paused'
            : false;
    const label = control.action === 'pause' && game.state === 'paused' ? '[P]PLAY' : control.label;
    const color = selected ? COLORS.amber : index % 2 ? COLORS.violet : COLORS.aqua;
    stage.dottedFrame(x + 1, layout.top, layout.itemWidth - 2, layout.height, {
      glyph: selected ? '+' : '.',
      size: 5.5,
      color,
      alpha: selected ? 0.88 : 0.5,
    });
    stage.glyph(label, x + layout.itemWidth / 2, layout.top + 27, { font, color, align: 'center' });
  }
}

function renderPolygonOutline(polygon, color = COLORS.lime) {
  const font = fontSpec(6, 'linear', 700);
  for (let index = 0; index < polygon.length; index += 1) {
    const start = polygon[index];
    const end = polygon[(index + 1) % polygon.length];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    const steps = Math.max(1, Math.ceil(length / 8));
    for (let step = 0; step < steps; step += 1) {
      const ratio = step / steps;
      stage.glyph('·', start.x + (end.x - start.x) * ratio, start.y + (end.y - start.y) * ratio, {
        font,
        color,
        alpha: 0.76,
        align: 'center',
      });
    }
  }
}

function renderFlowMap(exclusions) {
  if (!game.flowMap) return;
  for (const exclusion of exclusions) {
    for (const polygon of exclusion.polygons) renderPolygonOutline(polygon);
  }
}

function renderMessage() {
  if (game.state !== 'ready' && game.state !== 'point' && game.state !== 'paused') return;
  const compact = compactMode();
  const centerY = stage.height / 2;
  const title = game.state === 'ready' ? 'TYPE//PINBALL' : game.state === 'paused' ? 'PAUSED // WORDS WAIT' : `${game.playerScore > game.aiScore ? 'YOU LEAD' : game.aiScore > game.playerScore ? 'AUTO LEADS' : 'LEVEL SCORE'}`;
  const subtitle = game.state === 'ready'
    ? 'A ball, two text reflectors, one simple prediction.'
    : game.state === 'paused'
      ? 'P / ESC to continue'
      : `next serve in ${Math.max(0, game.pointDelay).toFixed(1)}s`;
  if (game.state === 'ready') {
    const visibleBall = readyBallGeometry();
    stage.glyph('●', visibleBall.x, visibleBall.y + visibleBall.radius * 0.72, {
      font: fontSpec(compact ? 17 : 21, 'casual', 700),
      color: COLORS.ice,
      align: 'center',
    });
  }
  stage.glyph(title, stage.width / 2, centerY - 24, {
    font: fontSpec(compact ? 22 : 31, 'casual', 700),
    color: COLORS.ice,
    align: 'center',
  });
  stage.glyph(subtitle, stage.width / 2, centerY + 9, {
    font: fontSpec(compact ? 9 : 12, 'linear', 400),
    color: COLORS.aqua,
    align: 'center',
  });
  if (game.state === 'ready') {
    stage.glyph('[ SPACE / TAP TO SERVE ]', stage.width / 2, centerY + 42, {
      font: fontSpec(compact ? 11 : 14, 'linear', 700),
      color: COLORS.amber,
      align: 'center',
    });
  }
}

function render() {
  if (game.state === 'paused' && !game.renderDirty) return;
  if (game.state !== 'running' && !game.renderDirty) return;
  stage.clear();
  const exclusions = dynamicExclusions();
  const flow = renderTextField(exclusions);
  renderWalls();
  renderPrediction();
  renderBumpers();
  renderPaddlesAndBall();
  renderFlowMap(exclusions);
  renderHud(flow, exclusions);
  renderMessage();
  const paddles = paddleGeometry();
  stage.publishDiagnostics({
    game: 'pinball',
    state: game.state,
    corpus: TEXT_CORPORA[game.corpusIndex].id,
    scores: { player: game.playerScore, ai: game.aiScore },
    rally: game.rally,
    best: game.best,
    ball: {
      x: Number(game.ball.x.toFixed(1)),
      y: Number(game.ball.y.toFixed(1)),
      vx: Number(game.ball.vx.toFixed(1)),
      vy: Number(game.ball.vy.toFixed(1)),
    },
    ai: {
      targetX: Number(game.aiTargetX.toFixed(1)),
      predictionX: game.aiPredictionX == null ? null : Number(game.aiPredictionX.toFixed(1)),
      maxSpeed: compactMode() ? 225 : 285,
      reactionSeconds: AI_REACTION_SECONDS,
    },
    paddles: {
      playerX: Number(paddles.player.centerX.toFixed(1)),
      aiX: Number(paddles.ai.centerX.toFixed(1)),
    },
    flowMap: game.flowMap,
    predictionVisible: game.showPrediction,
    textOnly: true,
    exclusions: exclusions.length,
    wordBumpers: layoutBumpers().length,
    flow: {
      ...stage.flowDiagnostics,
      returnedSlots: flow.slots,
      returnedFragments: flow.fragments.length,
    },
    flowCache: {
      cacheHit: game.flowCacheStatus.hit,
      ageMs: game.flowCacheStatus.ageMs,
      sourceExclusions: game.flowCacheStatus.sourceExclusions,
      layoutExclusions: exclusions.length,
      renderedFragments: game.flowCacheStatus.renderedFragments,
    },
    fonts: ['Recursive Linear', 'Recursive Casual'],
    pretext: getPretextUsage(),
    visibleGlyphs: stage.frameGlyphs,
    visibleColors: stage.frameColors.size,
    visibleCanvasCount: 1,
    visibleSvgCount: 0,
    reducedMotion,
    safeInsets: { top: stage.safeTop, right: stage.safeRight, bottom: stage.safeBottom, left: stage.safeLeft },
  }, game.renderDirty);
  if (game.warmupFrames > 0) {
    game.warmupFrames -= 1;
    game.renderDirty = true;
  } else {
    game.renderDirty = false;
  }
}

addEventListener('resize', () => {
  const previous = arena();
  input.reset();
  const previousBall = { x: game.ball.x, y: game.ball.y };
  const previousPlayer = { x: game.player.centerX, y: previous.bottom };
  const previousAi = { x: game.ai.centerX, y: previous.top };
  const previousTarget = { x: game.aiTargetX, y: previous.top };
  const previousPrediction = game.aiPredictionX == null ? null : { x: game.aiPredictionX, y: previous.top };
  const previousTrail = game.trail.map(point => ({ ...point }));
  stage.resize();
  const next = arena();
  game.player.centerX = remapPointBetweenArenas(previousPlayer, previous, next).x;
  game.ai.centerX = remapPointBetweenArenas(previousAi, previous, next).x;
  game.aiTargetX = remapPointBetweenArenas(previousTarget, previous, next).x;
  game.aiPredictionX = previousPrediction == null ? null : remapPointBetweenArenas(previousPrediction, previous, next).x;
  if (game.state === 'running' || game.state === 'paused') {
    const mappedBall = remapPointBetweenArenas(previousBall, previous, next);
    game.ball.x = clamp(mappedBall.x, next.left + game.ball.radius, next.right - game.ball.radius);
    game.ball.y = clamp(mappedBall.y, next.top + game.ball.radius, next.bottom - game.ball.radius);
    game.trail = previousTrail.map(point => remapPointBetweenArenas(point, previous, next));
  }
  game.flowCache = null;
  ensurePositions();
  game.warmupFrames = 2;
  game.renderDirty = true;
});

await waitForGlyphFonts();
stage.resize();
ensurePositions();
for (const button of semanticControlButtons) {
  const activate = () => applyControlAction(button.dataset.pinballAction);
  button.addEventListener('click', event => {
    event.stopPropagation();
    activate();
  });
  button.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    event.stopPropagation();
    if (event.repeat) return;
    applyControlAction(button.dataset.pinballAction);
  });
}
resetMatch();
canvas.focus({ preventScroll: true });
createLoop({ update, render, input });
