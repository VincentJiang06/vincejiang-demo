const EPSILON = 1e-7;

export function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function reflectIntoRange(value, min, max) {
  const span = max - min;
  if (!(span > 0) || !Number.isFinite(value)) return min;
  const period = span * 2;
  const wrapped = ((value - min) % period + period) % period;
  return min + (wrapped <= span ? wrapped : period - wrapped);
}

export function predictInterceptX(ball, targetY, minX, maxX) {
  if (!ball || Math.abs(ball.vy) < EPSILON) return null;
  const seconds = (targetY - ball.y) / ball.vy;
  if (!(seconds >= 0) || !Number.isFinite(seconds)) return null;
  return reflectIntoRange(ball.x + ball.vx * seconds, minX, maxX);
}

export function movePaddleToward(currentCenter, targetCenter, dt, options = {}) {
  const minCenter = Number.isFinite(options.minCenter) ? options.minCenter : -Infinity;
  const maxCenter = Number.isFinite(options.maxCenter) ? options.maxCenter : Infinity;
  const maxSpeed = Math.max(0, Number(options.maxSpeed) || 0);
  const deadZone = Math.max(0, Number(options.deadZone) || 0);
  const seconds = Math.max(0, Number(dt) || 0);
  const delta = targetCenter - currentCenter;
  if (Math.abs(delta) <= deadZone || seconds === 0) {
    return { center: clampNumber(currentCenter, minCenter, maxCenter), velocity: 0 };
  }
  const step = Math.sign(delta) * Math.min(Math.abs(delta), maxSpeed * seconds);
  const center = clampNumber(currentCenter + step, minCenter, maxCenter);
  return { center, velocity: (center - currentCenter) / seconds };
}

export function stateAllowsPlayerMotion(state) {
  return state !== 'paused';
}

export function shouldShowTouchToolbar(width, touchCapable) {
  return Number(width) < 620 || Boolean(touchCapable);
}

export function fragmentFitsFreeIntervals(fragment, intervals, epsilon = 0.5) {
  const start = Number(fragment?.x);
  const end = start + Number(fragment?.w);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return false;
  return (intervals || []).some(interval => (
    Number(interval.start) <= start + epsilon
    && Number(interval.end) >= end - epsilon
  ));
}

export function resetBumperStates(bumpers) {
  for (const bumper of bumpers || []) {
    bumper.variant = 0;
    bumper.active = 0;
    bumper.cooldown = 0;
  }
  return bumpers;
}

export function choosePlayerTarget(pointerAndKeys, currentCenter, field) {
  const left = Boolean(pointerAndKeys?.left);
  const right = Boolean(pointerAndKeys?.right);
  if (left !== right) return left ? field.left : field.right;
  if (
    pointerAndKeys?.pointerActive
    && Number(pointerAndKeys.pointerY) > field.height * 0.42
    && Number.isFinite(Number(pointerAndKeys.pointerX))
  ) return Number(pointerAndKeys.pointerX);
  return currentCenter;
}

export function remapPointBetweenArenas(point, previous, next) {
  const previousWidth = Math.max(EPSILON, previous.right - previous.left);
  const previousHeight = Math.max(EPSILON, previous.bottom - previous.top);
  const xRatio = clampNumber((point.x - previous.left) / previousWidth, 0, 1);
  const yRatio = clampNumber((point.y - previous.top) / previousHeight, 0, 1);
  return {
    x: Number((next.left + xRatio * (next.right - next.left)).toFixed(3)),
    y: Number((next.top + yRatio * (next.bottom - next.top)).toFixed(3)),
  };
}

export function bounceFromPaddle(ball, paddle, outwardSign, options = {}) {
  const minSpeed = Math.max(1, Number(options.minSpeed) || 260);
  const maxSpeed = Math.max(minSpeed, Number(options.maxSpeed) || 620);
  const speedGain = Math.max(1, Number(options.speedGain) || 1.025);
  const maxAngle = clampNumber(Number(options.maxAngle) || 1.03, 0.2, 1.25);
  const paddleInfluence = clampNumber(Number(options.paddleInfluence) || 0.22, 0, 0.8);
  const speed = clampNumber(Math.hypot(ball.vx, ball.vy) * speedGain, minSpeed, maxSpeed);
  const halfWidth = Math.max(1, paddle.width / 2);
  const offset = clampNumber((ball.x - paddle.centerX) / halfWidth, -1, 1);
  const carriedVelocity = (Number(paddle.velocity) || 0) * paddleInfluence;
  const horizontalLimit = speed * 0.88;
  const vx = clampNumber(Math.sin(offset * maxAngle) * speed + ball.vx * 0.12 + carriedVelocity, -horizontalLimit, horizontalLimit);
  const vy = (outwardSign < 0 ? -1 : 1) * Math.max(speed * 0.48, Math.sqrt(Math.max(0, speed * speed - vx * vx)));
  return { ...ball, vx, vy };
}

export function resolveCircleRect(ball, rect, face = 'any') {
  const radius = Math.max(0, Number(ball.radius) || 0);
  const closestX = clampNumber(ball.x, rect.x, rect.x + rect.w);
  const closestY = clampNumber(ball.y, rect.y, rect.y + rect.h);
  let dx = ball.x - closestX;
  let dy = ball.y - closestY;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared > radius * radius) return { collided: false, ball: { ...ball } };

  let normalX = 0;
  let normalY = 0;
  let penetration = 0;
  if (distanceSquared > EPSILON) {
    const distance = Math.sqrt(distanceSquared);
    normalX = dx / distance;
    normalY = dy / distance;
    penetration = radius - distance;
  } else {
    const distances = [
      { value: Math.abs(ball.x - rect.x), x: -1, y: 0 },
      { value: Math.abs(rect.x + rect.w - ball.x), x: 1, y: 0 },
      { value: Math.abs(ball.y - rect.y), x: 0, y: -1 },
      { value: Math.abs(rect.y + rect.h - ball.y), x: 0, y: 1 },
    ].sort((a, b) => a.value - b.value);
    normalX = distances[0].x;
    normalY = distances[0].y;
    penetration = radius + distances[0].value;
  }

  const approach = ball.vx * normalX + ball.vy * normalY;
  const acceptedFace = face === 'top'
    ? normalY < -0.5 && ball.vy > 0
    : face === 'bottom'
      ? normalY > 0.5 && ball.vy < 0
      : true;
  if (!acceptedFace || approach >= 0) return { collided: false, ball: { ...ball }, normal: { x: normalX, y: normalY } };

  const next = {
    ...ball,
    x: ball.x + normalX * penetration,
    y: ball.y + normalY * penetration,
  };
  next.vx -= 2 * approach * normalX;
  next.vy -= 2 * approach * normalY;
  return { collided: true, ball: next, normal: { x: normalX, y: normalY } };
}

export function scoreBoundary(ballY, minY, maxY, radius = 0) {
  if (ballY + radius < minY) return 'player';
  if (ballY - radius > maxY) return 'ai';
  return null;
}
