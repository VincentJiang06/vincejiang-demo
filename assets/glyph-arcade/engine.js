import {
  layoutNextLine,
  layoutWithLines,
  measureNaturalWidth,
  prepareWithSegments,
  setLocale,
} from './pretext/layout.js';

setLocale('en-US');

export const FONT_FAMILY = Object.freeze({
  linear: '"Recursive Linear"',
  casual: '"Recursive Casual"',
});

const FONT_PROBES = [
  '400 16px "Recursive Linear"',
  '700 16px "Recursive Linear"',
  '400 16px "Recursive Casual"',
  '700 16px "Recursive Casual"',
];

const preparedCache = new Map();
const flowPreparedCache = new Map();
const widthCache = new Map();
const pretextUsage = {
  prepares: 0,
  measurements: 0,
  layouts: 0,
  flowLayouts: 0,
  flowFragments: 0,
};

export function fontSpec(size, family = 'linear', weight = 400) {
  return `${weight} ${Math.max(8, size)}px ${FONT_FAMILY[family]}`;
}

function prepared(text, font, whiteSpace = 'pre-wrap') {
  const key = `${font}\u0000${whiteSpace}\u0000${text}`;
  let value = preparedCache.get(key);
  if (!value) {
    value = prepareWithSegments(text, font, { whiteSpace });
    pretextUsage.prepares += 1;
    preparedCache.set(key, value);
  }
  return value;
}

function preparedFlow(text, font, targetCharacters) {
  const key = `${font}\u0000${targetCharacters}\u0000${text}`;
  let value = flowPreparedCache.get(key);
  if (!value) {
    const corpus = `${text} `.repeat(Math.max(2, Math.ceil(targetCharacters / (text.length + 1))));
    value = prepared(corpus, font, 'normal');
    flowPreparedCache.set(key, value);
  }
  return value;
}

export function textWidth(text, font) {
  const source = text === '' ? '\u00a0' : text;
  const key = `${font}\u0000${source}`;
  let width = widthCache.get(key);
  if (width === undefined) {
    width = measureNaturalWidth(prepared(source, font));
    pretextUsage.measurements += 1;
    widthCache.set(key, width);
  }
  return width;
}

export function wrapLines(text, font, maxWidth, lineHeight) {
  pretextUsage.layouts += 1;
  return layoutWithLines(prepared(text, font, 'normal'), Math.max(20, maxWidth), lineHeight).lines;
}

export function getPretextUsage() { return { ...pretextUsage }; }

function intersectionAtY(a, b, y) {
  const dy = b.y - a.y;
  if (Math.abs(dy) < 0.0001) return null;
  const t = (y - a.y) / dy;
  if (t < 0 || t > 1) return null;
  return a.x + (b.x - a.x) * t;
}

export function polygonBandSpan(points, top, bottom, padding = 0) {
  if (!Array.isArray(points) || points.length < 3) return null;
  const xs = [];
  for (const point of points) {
    if (point.y >= top && point.y <= bottom) xs.push(point.x);
  }
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    if (Math.max(a.y, b.y) < top || Math.min(a.y, b.y) > bottom) continue;
    const atTop = intersectionAtY(a, b, top);
    const atBottom = intersectionAtY(a, b, bottom);
    if (atTop !== null) xs.push(atTop);
    if (atBottom !== null) xs.push(atBottom);
  }
  if (!xs.length) return null;
  return { start: Math.min(...xs) - padding, end: Math.max(...xs) + padding };
}

export function freeFlowIntervals(bounds, lineTop, lineBottom, exclusions = []) {
  const left = bounds.x;
  const right = bounds.x + bounds.w;
  const blocked = [];
  for (const exclusion of exclusions) {
    const polygons = exclusion.polygons || (exclusion.points ? [exclusion.points] : []);
    for (const polygon of polygons) {
      const padding = exclusion.padding || 0;
      const span = polygonBandSpan(polygon, lineTop - padding, lineBottom + padding, padding);
      if (!span || span.end <= left || span.start >= right) continue;
      blocked.push({ start: Math.max(left, span.start), end: Math.min(right, span.end) });
    }
  }
  blocked.sort((a, b) => a.start - b.start);
  const merged = [];
  for (const span of blocked) {
    const previous = merged[merged.length - 1];
    if (previous && span.start <= previous.end) previous.end = Math.max(previous.end, span.end);
    else merged.push({ ...span });
  }
  const free = [];
  let cursor = left;
  for (const span of merged) {
    if (span.start > cursor) free.push({ start: cursor, end: span.start, width: span.start - cursor });
    cursor = Math.max(cursor, span.end);
  }
  if (cursor < right) free.push({ start: cursor, end: right, width: right - cursor });
  return free;
}

function transformFlowPolygon(points, options) {
  const { x, y, width, height, rotate = 0 } = options;
  const radians = rotate * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return points.map(point => {
    const px = x + point[0] * width;
    const py = y + point[1] * height;
    const dx = px - centerX;
    const dy = py - centerY;
    return {
      x: centerX + dx * cosine - dy * sine,
      y: centerY + dx * sine + dy * cosine,
    };
  });
}

const SVG_NS = 'http://www.w3.org/2000/svg';

export class VectorStage {
  constructor(svg) {
    if (!(svg instanceof SVGSVGElement)) throw new Error('vector-stage svg missing');
    this.svg = svg;
    this.scene = svg.querySelector('[data-vector-scene]') || svg;
    this.nodes = new Map();
    this.touched = new Set();
    this.exclusions = [];
  }

  beginFrame(width, height) {
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.touched.clear();
    this.exclusions.length = 0;
  }

  use(key, symbol, options) {
    const { x, y, width, height, rotate = 0, opacity = 1 } = options;
    let node = this.nodes.get(key);
    if (!node) {
      node = document.createElementNS(SVG_NS, 'use');
      node.dataset.vectorKey = key;
      this.scene.append(node);
      this.nodes.set(key, node);
    }
    node.setAttribute('href', `#${symbol}`);
    node.setAttribute('x', x);
    node.setAttribute('y', y);
    node.setAttribute('width', width);
    node.setAttribute('height', height);
    node.setAttribute('opacity', opacity);
    node.setAttribute('transform', rotate ? `rotate(${rotate} ${x + width / 2} ${y + height / 2})` : '');
    node.setAttribute('class', options.className || 'vector-object');
    node.style.color = options.color || '#ffffff';
    for (const [name, value] of Object.entries(options.cssVars || {})) node.style.setProperty(name, value);
    this.touched.add(key);

    const sourcePolygons = options.flowPolygons || (options.flowPolygon ? [options.flowPolygon] : []);
    if (sourcePolygons.length) {
      this.exclusions.push({
        id: key,
        padding: options.flowPadding ?? 8,
        polygons: sourcePolygons.map(points => transformFlowPolygon(points, { x, y, width, height, rotate })),
      });
    }
    return node;
  }

  endFrame() {
    for (const [key, node] of this.nodes) {
      if (this.touched.has(key)) continue;
      node.remove();
      this.nodes.delete(key);
    }
  }

  get visibleCount() { return this.nodes.size; }
}

export async function waitForGlyphFonts() {
  await Promise.all(FONT_PROBES.map(probe => document.fonts.load(probe, 'WiM@~')));
  await document.fonts.ready;
  const missing = FONT_PROBES.filter(probe => !document.fonts.check(probe, 'WiM@~'));
  if (missing.length) throw new Error(`Local glyph fonts failed: ${missing.join(', ')}`);
}

export class GlyphStage {
  constructor(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error('glyph-stage canvas missing');
    const context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!context) throw new Error('Canvas 2D is unavailable');
    this.canvas = canvas;
    this.ctx = context;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.fontState = '';
    this.colorState = '';
    this.alphaState = 1;
    this.alignState = 'left';
    this.frameColors = new Set();
    this.frameGlyphs = 0;
    this.flowDiagnostics = { fragments: 0, slots: 0, exclusions: 0 };
    this.lastDiagnosticsPublish = 0;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, Math.round(rect.width || innerWidth));
    this.height = Math.max(1, Math.round(rect.height || innerHeight));
    this.dpr = Math.min(1.75, Math.max(1, devicePixelRatio || 1));
    const pixelWidth = Math.round(this.width * this.dpr);
    const pixelHeight = Math.round(this.height * this.dpr);
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
    }
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.ctx.textBaseline = 'alphabetic';
    this.ctx.textAlign = 'left';
    this.ctx.imageSmoothingEnabled = false;
    this.fontState = '';
    this.colorState = '';
    this.alphaState = 1;
    this.alignState = 'left';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.frameColors.clear();
    this.frameGlyphs = 0;
    this.flowDiagnostics = { fragments: 0, slots: 0, exclusions: 0 };
  }

  glyph(text, x, y, options = {}) {
    if (!text) return 0;
    const font = options.font || fontSpec(options.size || 16, options.family || 'linear', options.weight || 400);
    const color = options.color || '#ffffff';
    const alpha = options.alpha ?? 1;
    const align = options.align || 'left';
    if (font !== this.fontState) {
      this.ctx.font = font;
      this.fontState = font;
    }
    if (color !== this.colorState) {
      this.ctx.fillStyle = color;
      this.colorState = color;
    }
    if (alpha !== this.alphaState) {
      this.ctx.globalAlpha = alpha;
      this.alphaState = alpha;
    }
    if (align !== this.alignState) {
      this.ctx.textAlign = align;
      this.alignState = align;
    }
    this.ctx.fillText(text, x, y);
    this.frameColors.add(color);
    this.frameGlyphs += Array.from(text).length;
    return options.knownWidth ?? textWidth(text, font);
  }

  sequence(text, x, y, options = {}) {
    const chars = Array.from(text);
    const font = options.font || fontSpec(options.size || 16, options.family || 'linear', options.weight || 400);
    let cursor = x;
    for (let index = 0; index < chars.length; index += 1) {
      const char = chars[index];
      const width = textWidth(char, font);
      if (char !== ' ') {
        const color = typeof options.color === 'function' ? options.color(char, index) : options.color;
        const alpha = typeof options.alpha === 'function' ? options.alpha(char, index) : options.alpha;
        this.glyph(char, cursor, y, { ...options, font, color, alpha });
      }
      cursor += width + (options.tracking || 0);
    }
    return cursor - x;
  }

  sprite(rows, x, y, options = {}) {
    const size = options.size || 16;
    const lineHeight = options.lineHeight || size * 0.9;
    const font = options.font || fontSpec(size, options.family || 'casual', options.weight || 700);
    let maxWidth = 0;
    for (let row = 0; row < rows.length; row += 1) {
      const width = this.sequence(rows[row], x, y + row * lineHeight, {
        ...options,
        font,
        color: typeof options.color === 'function'
          ? (char, col) => options.color(char, row, col)
          : options.color,
      });
      maxWidth = Math.max(maxWidth, width);
    }
    return { width: maxWidth, height: rows.length * lineHeight };
  }

  paragraph(text, x, y, maxWidth, options = {}) {
    const size = options.size || 16;
    const lineHeight = options.lineHeight || Math.round(size * 1.28);
    const font = options.font || fontSpec(size, options.family || 'linear', options.weight || 400);
    const lines = wrapLines(text, font, maxWidth, lineHeight);
    for (let index = 0; index < lines.length; index += 1) {
      this.glyph(lines[index].text, x, y + index * lineHeight, { ...options, font });
    }
    return { lines, height: lines.length * lineHeight };
  }

  flowText(text, bounds, exclusions = [], options = {}) {
    const size = options.size || 10;
    const lineHeight = options.lineHeight || Math.round(size * 1.3);
    const font = options.font || fontSpec(size, options.family || 'linear', options.weight || 400);
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (!normalized || bounds.w <= 0 || bounds.h <= 0) return { fragments: [], slots: 0 };
    const targetCharacters = options.targetCharacters || 16000;
    const flowPrepared = preparedFlow(normalized, font, targetCharacters);
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    const fragments = [];
    let slotCount = 0;
    let row = 0;
    const firstBaseline = bounds.y + size;
    for (let baseline = firstBaseline; baseline <= bounds.y + bounds.h; baseline += lineHeight) {
      const slots = freeFlowIntervals(bounds, baseline - lineHeight + 1, baseline + 2, exclusions)
        .filter(slot => slot.width >= (options.minWidth || Math.max(26, size * 4)));
      slotCount += slots.length;
      for (let slotIndex = 0; slotIndex < slots.length; slotIndex += 1) {
        const slot = slots[slotIndex];
        let line = layoutNextLine(flowPrepared, cursor, slot.width);
        pretextUsage.layouts += 1;
        if (!line) {
          cursor = { segmentIndex: 0, graphemeIndex: 0 };
          line = layoutNextLine(flowPrepared, cursor, slot.width);
          pretextUsage.layouts += 1;
        }
        if (!line) continue;
        cursor = line.end;
        if (!line.text.trim()) continue;
        const context = { row, slot: slotIndex, index: fragments.length, line, baseline };
        const color = typeof options.color === 'function' ? options.color(context) : options.color;
        const alpha = typeof options.alpha === 'function' ? options.alpha(context) : options.alpha;
        this.glyph(line.text, slot.start, baseline, { ...options, font, color, alpha, knownWidth: line.width });
        fragments.push({ x: slot.start, y: baseline - lineHeight + 1, w: line.width, h: lineHeight, text: line.text });
      }
      row += 1;
    }
    pretextUsage.flowLayouts += 1;
    pretextUsage.flowFragments += fragments.length;
    this.flowDiagnostics.fragments += fragments.length;
    this.flowDiagnostics.slots += slotCount;
    this.flowDiagnostics.exclusions = Math.max(this.flowDiagnostics.exclusions, exclusions.length);
    return { fragments, slots: slotCount, cursor };
  }

  dottedFrame(x, y, width, height, options = {}) {
    const size = options.size || 13;
    const font = fontSpec(size, options.family || 'linear', options.weight || 400);
    const glyph = options.glyph || '.';
    const step = Math.max(4, textWidth(glyph, font) + 3);
    const color = options.color || '#7fffd4';
    for (let px = x; px <= x + width; px += step) {
      this.glyph(glyph, px, y, { font, color, alpha: options.alpha ?? 0.75 });
      this.glyph(glyph, px, y + height, { font, color, alpha: options.alpha ?? 0.75 });
    }
    for (let py = y + step; py < y + height; py += step) {
      this.glyph(glyph, x, py, { font, color, alpha: options.alpha ?? 0.75 });
      this.glyph(glyph, x + width, py, { font, color, alpha: options.alpha ?? 0.75 });
    }
  }

  publishDiagnostics(value) {
    window.__glyphDiagnostics = value;
    const now = performance.now();
    if (now - this.lastDiagnosticsPublish >= 250) {
      this.canvas.dataset.glyphDiagnostics = JSON.stringify(value);
      this.lastDiagnosticsPublish = now;
    }
  }
}

export class InputState {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.edges = new Set();
    this.pointer = { x: 0, y: 0, down: false, active: false };
    this.onKeyDown = event => {
      if (!this.keys.has(event.code)) this.edges.add(event.code);
      this.keys.add(event.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
    };
    this.onKeyUp = event => this.keys.delete(event.code);
    this.onPointerDown = event => {
      canvas.focus({ preventScroll: true });
      this.edges.add('PointerDown');
      this.pointer.down = true;
      this.pointer.active = true;
      this.updatePointer(event);
      canvas.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    };
    this.onPointerMove = event => {
      this.pointer.active = true;
      this.updatePointer(event);
      event.preventDefault();
    };
    this.onPointerUp = event => {
      this.pointer.down = false;
      this.updatePointer(event);
      event.preventDefault();
    };
    this.reset = () => {
      this.keys.clear();
      this.edges.clear();
      this.pointer.down = false;
      this.pointer.active = false;
    };
    addEventListener('keydown', this.onKeyDown, { passive: false });
    addEventListener('keyup', this.onKeyUp);
    canvas.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', this.onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', this.onPointerUp, { passive: false });
    canvas.addEventListener('pointercancel', this.onPointerUp, { passive: false });
    addEventListener('blur', this.reset);
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.reset(); });
  }

  updatePointer(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = event.clientX - rect.left;
    this.pointer.y = event.clientY - rect.top;
  }

  held(...codes) { return codes.some(code => this.keys.has(code)); }

  pressed(...codes) {
    const hit = codes.some(code => this.edges.has(code));
    for (const code of codes) this.edges.delete(code);
    return hit;
  }

  endFrame() { this.edges.clear(); }
}

export class SeededRandom {
  constructor(seed = 0x12345678) { this.state = seed >>> 0; }

  next() {
    let value = this.state += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  }

  range(min, max) { return min + (max - min) * this.next(); }
  int(min, max) { return Math.floor(this.range(min, max + 1)); }
  pick(values) { return values[Math.min(values.length - 1, Math.floor(this.next() * values.length))]; }
}

export function createLoop({ update, render, input }) {
  const fixedStep = 1 / 60;
  let previous = performance.now();
  let accumulator = 0;
  let stopped = false;
  function frame(now) {
    if (stopped) return;
    const elapsed = Math.min(0.1, (now - previous) / 1000);
    previous = now;
    if (!document.hidden) {
      accumulator += elapsed;
      let stepped = false;
      while (accumulator >= fixedStep) {
        update(fixedStep);
        accumulator -= fixedStep;
        stepped = true;
      }
      render(now / 1000, accumulator / fixedStep);
      // Keep edge-triggered input alive across render-only frames on 90/120 Hz displays.
      if (stepped) input?.endFrame();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return () => { stopped = true; };
}

export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
export function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function hsl(hue, saturation, lightness, alpha = 1) {
  return `hsla(${((hue % 360) + 360) % 360} ${saturation}% ${lightness}% / ${alpha})`;
}

export function loadBest(key, fallback = 0) {
  try { return Number(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

export function saveBest(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* device-local score is optional */ }
}

export function setSemanticStatus(text) {
  const node = document.getElementById('game-status');
  if (node) node.textContent = text;
}
