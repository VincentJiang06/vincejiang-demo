#!/usr/bin/env node
// gen-topo.mjs —— 生成全站等高线(topographic)背景 SVG(assets/bg-topo-{light,dark}.svg)。
// 设计(2026-08-04 用户裁决,替代全部动画背景方案):远看白+灰(暗=近黑+深灰)的等高线地形,
// 每第 4 条是加粗的「计曲线」(仿真实地形图),另挑 4 条染低饱和色(与全站色条同一套色相语言)。
// 生成 = 种子化高程场(高斯峰谷 + 缓和正弦)→ marching squares 取 16 档等值线 → 链段成折线 → 抽稀。
// 纯静态、零脚本、零动画。改地形/配色改本文件后:node tools/gen-topo.mjs && 重新 build,产物要提交。
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const W = 1440, H = 900, CELL = 10;
const NX = Math.ceil(W / CELL) + 1, NY = Math.ceil(H / CELL) + 1;

let seed = 20260804;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

// 高程场:8 座高斯峰/谷(错落于版面,含出血) + 两组缓和正弦起伏
const PEAKS = [];
for (let i = 0; i < 8; i++) {
  PEAKS.push({
    x: -150 + rnd() * (W + 300), y: -150 + rnd() * (H + 300),
    amp: (rnd() < 0.32 ? -1 : 1) * (0.55 + rnd() * 0.75),
    s2: 2 * (140 + rnd() * 190) ** 2,
  });
}
const field = (x, y) => {
  let v = 0.22 * Math.sin(x * 0.0031 + 1.7) * Math.cos(y * 0.0024 - 0.6)
        + 0.14 * Math.sin((x + y) * 0.0017 + 4.2);
  for (const p of PEAKS) v += p.amp * Math.exp(-((x - p.x) ** 2 + (y - p.y) ** 2) / p.s2);
  return v;
};

// 网格采样
const grid = [];
for (let j = 0; j < NY; j++) { const row = []; for (let i = 0; i < NX; i++) row.push(field(i * CELL, j * CELL)); grid.push(row); }
let lo = Infinity, hi = -Infinity;
for (const row of grid) for (const v of row) { if (v < lo) lo = v; if (v > hi) hi = v; }

// marching squares:每档取线段,再按端点链接成折线
function contour(level) {
  const segs = [];
  const lerp = (a, b, va, vb) => a + (level - va) / (vb - va) * (b - a);
  for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
    const x = i * CELL, y = j * CELL;
    const v0 = grid[j][i], v1 = grid[j][i + 1], v2 = grid[j + 1][i + 1], v3 = grid[j + 1][i];
    let idx = (v0 > level ? 1 : 0) | (v1 > level ? 2 : 0) | (v2 > level ? 4 : 0) | (v3 > level ? 8 : 0);
    if (idx === 0 || idx === 15) continue;
    const T = [lerp(x, x + CELL, v0, v1), y];                 // 上边交点
    const R = [x + CELL, lerp(y, y + CELL, v1, v2)];          // 右
    const B = [lerp(x, x + CELL, v3, v2), y + CELL];          // 下
    const L = [x, lerp(y, y + CELL, v0, v3)];                 // 左
    const EDGES = {
      1: [[L, T]], 2: [[T, R]], 3: [[L, R]], 4: [[R, B]], 5: [[L, T], [R, B]],
      6: [[T, B]], 7: [[L, B]], 8: [[B, L]], 9: [[B, T]], 10: [[T, R], [B, L]],
      11: [[B, R]], 12: [[R, L]], 13: [[R, T]], 14: [[T, L]],
    };
    for (const s of EDGES[idx]) segs.push(s);
  }
  // 链接:端点量化建索引,顺藤摸瓜串折线
  const key = pt => (Math.round(pt[0] * 4) + ',' + Math.round(pt[1] * 4));
  const adj = new Map();
  for (const s of segs) for (const [a, b] of [[s[0], s[1]], [s[1], s[0]]]) {
    const k = key(a); if (!adj.has(k)) adj.set(k, []); adj.get(k).push({ to: b, seg: s });
  }
  const used = new Set(), lines = [];
  for (const s of segs) {
    if (used.has(s)) continue;
    let line = [s[0], s[1]]; used.add(s);
    for (const dir of [1, 0]) {                      // 先向尾延,再向头延
      for (;;) {
        const end = dir ? line[line.length - 1] : line[0];
        const cands = (adj.get(key(end)) || []).filter(c => !used.has(c.seg));
        if (!cands.length) break;
        used.add(cands[0].seg);
        if (dir) line.push(cands[0].to); else line.unshift(cands[0].to);
      }
    }
    if (line.length >= 4) lines.push(line);
  }
  // 抽稀 + 圆整
  return lines.map(line => line.filter((_, i) => i % 2 === 0 || i === line.length - 1)
    .map(pt => [Math.round(pt[0] * 10) / 10, Math.round(pt[1] * 10) / 10]));
}

const LEVELS = 16;
const COLORED = { 3: 205, 6: 24, 10: 165, 13: 268 };   // 这些档染低饱和色(蓝/橙/绿/紫)
function svg(mode) {
  const dark = mode === 'dark';
  const paths = [];
  for (let k = 1; k < LEVELS; k++) {
    const level = lo + (hi - lo) * k / LEVELS;
    const isIndex = k % 4 === 0;                       // 计曲线:每 4 条加粗
    const hue = COLORED[k];
    const stroke = hue != null
      ? (dark ? `hsl(${hue} 30% 30%)` : `hsl(${hue} 48% 80%)`)
      : isIndex ? (dark ? '#26272f' : '#d6d9e2') : (dark ? '#191a20' : '#e7e9ef');
    const width = isIndex ? 1.2 : hue != null ? 0.9 : 0.7;
    const d = contour(level).map(line => 'M' + line.map(p => p[0] + ' ' + p[1]).join('L')).join('');
    if (d) paths.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<rect width="${W}" height="${H}" fill="${dark ? '#050507' : '#ffffff'}"/>
${paths.join('\n')}
</svg>`;
}

for (const mode of ['light', 'dark']) {
  const out = join(ROOT, 'assets', `bg-topo-${mode}.svg`);
  writeFileSync(out, svg(mode));
  console.log('✓', out, (svg(mode).length / 1024).toFixed(0) + 'KB');
}
