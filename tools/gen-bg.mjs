#!/usr/bin/env node
// gen-bg.mjs —— 生成全站渐变背景 SVG(assets/bg-{light,dark}.svg)。一次生成、静态发布,运行时零计算。
//
// 设计(2026-08-04 定稿):**等高线路径的曲线色带** ——
//   路径 = 等高线图那套(种子化高程场:高斯峰谷 + 缓和正弦 → marching squares 取等值线 → 链段成折线 →
//          抽稀 → Catmull-Rom 转贝塞尔平滑),挑最长且分散的几条作丝带骨架(有机盘绕,非人工 S 弯);
//   着色 = 每条用 linearGradient 沿走向过渡 2~3 个低饱和色相;
//   散开 = 「多层同形描边羽化」:同一条路径叠 N 层,stroke-width 由粗到细、opacity 由淡到浓
//          (不用 feGaussianBlur —— 大面积模糊在低端机上是真开销,多层描边等价且零滤镜)。
//   路径只在 <defs> 里存一份,各羽化层用 <use> 引用 —— 否则等值线折线点多,11 层重复会把文件撑到几十 KB。
//
// 关键调校经验(踩过的坑,改之前先看):
//   1) 别加全幅 wash 罩层 —— 会把所有色相压成一片脏灰;
//   2) 亮色要「高明度 + 够高饱和」(hsl ~74% 88%),饱和度低了在白底上只剩脏灰;
//   3) 暗色底 #07070c、色带亮度 ~16%,否则死黑没层次;
//   4) 暗色下暖色(橙/粉)与冷色叠加会发浑 —— 用 dk 权重单独压低甚至归零,暗色只留冷调;
//   5) 羽化层数别少于 ~9,层数少了能看出一圈圈同心边界(带状条纹);
//   6a) 等值线里要**挑舒展的开放曲线**(span/len > ~0.34):闭合或紧绕的等值线渲成色带像涂鸦圈,
//       背景要的是「掠过」感;
//   6) **色带别太宽** —— 宽度超过画布高的 ~20%(如 300/900)时,弯曲会被羽化糊成水平条、曲线感全失;
//      带宽压到 110~190 才看得出路径走向。
//
// 改构图/配色改本文件后:node tools/gen-bg.mjs && 重新 build,产物要提交。
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const W = 1440, H = 900, CELL = 12;
const NX = Math.ceil(W / CELL) + 1, NY = Math.ceil(H / CELL) + 1;

let seed = 20260804;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

// ---- 高程场:8 座高斯峰/谷(错落于版面,含出血)+ 两组缓和正弦起伏 ----
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

const grid = [];
for (let j = 0; j < NY; j++) { const row = []; for (let i = 0; i < NX; i++) row.push(field(i * CELL, j * CELL)); grid.push(row); }
let lo = Infinity, hi = -Infinity;
for (const row of grid) for (const v of row) { if (v < lo) lo = v; if (v > hi) hi = v; }

// ---- marching squares:取某一档等值线的所有折线 ----
function contour(level) {
  const segs = [];
  const lerp = (a, b, va, vb) => a + (level - va) / (vb - va) * (b - a);
  for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
    const x = i * CELL, y = j * CELL;
    const v0 = grid[j][i], v1 = grid[j][i + 1], v2 = grid[j + 1][i + 1], v3 = grid[j + 1][i];
    const idx = (v0 > level ? 1 : 0) | (v1 > level ? 2 : 0) | (v2 > level ? 4 : 0) | (v3 > level ? 8 : 0);
    if (idx === 0 || idx === 15) continue;
    const T = [lerp(x, x + CELL, v0, v1), y], R = [x + CELL, lerp(y, y + CELL, v1, v2)];
    const B = [lerp(x, x + CELL, v3, v2), y + CELL], L = [x, lerp(y, y + CELL, v0, v3)];
    const EDGES = {
      1: [[L, T]], 2: [[T, R]], 3: [[L, R]], 4: [[R, B]], 5: [[L, T], [R, B]],
      6: [[T, B]], 7: [[L, B]], 8: [[B, L]], 9: [[B, T]], 10: [[T, R], [B, L]],
      11: [[B, R]], 12: [[R, L]], 13: [[R, T]], 14: [[T, L]],
    };
    for (const s of EDGES[idx]) segs.push(s);
  }
  // 端点量化建索引,顺藤摸瓜串成折线
  const key = pt => (Math.round(pt[0] * 4) + ',' + Math.round(pt[1] * 4));
  const adj = new Map();
  for (const s of segs) for (const [a, b] of [[s[0], s[1]], [s[1], s[0]]]) {
    const k = key(a); if (!adj.has(k)) adj.set(k, []); adj.get(k).push({ to: b, seg: s });
  }
  const used = new Set(), lines = [];
  for (const s of segs) {
    if (used.has(s)) continue;
    const line = [s[0], s[1]]; used.add(s);
    for (const dir of [1, 0]) {
      for (;;) {
        const end = dir ? line[line.length - 1] : line[0];
        const cands = (adj.get(key(end)) || []).filter(c => !used.has(c.seg));
        if (!cands.length) break;
        used.add(cands[0].seg);
        if (dir) line.push(cands[0].to); else line.unshift(cands[0].to);
      }
    }
    if (line.length >= 8) lines.push(line);
  }
  return lines;
}

const lengthOf = line => {
  let d = 0;
  for (let i = 1; i < line.length; i++) d += Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
  return d;
};
const centroid = line => {
  let sx = 0, sy = 0;
  for (const p of line) { sx += p[0]; sy += p[1]; }
  return [sx / line.length, sy / line.length];
};

// 抽稀 + Catmull-Rom 转三次贝塞尔(平滑掉 marching squares 的锯齿,同时缩短 d 串)
function smoothPath(line, step = 5) {
  const pts = line.filter((_, i) => i % step === 0 || i === line.length - 1);
  if (pts.length < 3) return '';
  const r = n => Math.round(n * 10) / 10;
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || pts[i + 1];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r(c1[0])} ${r(c1[1])},${r(c2[0])} ${r(c2[1])},${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

// ---- 挑丝带骨架:跨若干档等值线取最长的曲线,按质心去重(避免几条挤在同一处) ----
function pickRibbonPaths(count) {
  const all = [];
  for (let k = 2; k <= 13; k++) {
    const level = lo + (hi - lo) * k / 15;
    for (const line of contour(level)) all.push({ line, len: lengthOf(line), c: centroid(line) });
  }
  // span = 首尾直线距离;span/len 比值高 = 舒展的「掠过」型曲线,低 = 绕圈涂鸦型(不要)
  for (const c of all) {
    const a = c.line[0], b = c.line[c.line.length - 1];
    c.span = Math.hypot(b[0] - a[0], b[1] - a[1]);
    c.straightness = c.span / c.len;
  }
  const cands = all.filter(c => c.len > 700 && c.straightness > 0.34);
  cands.sort((a, b) => (b.span - a.span));                          // 优先横跨画面最远的
  const picked = [];
  for (const cand of cands) {
    if (picked.length >= count) break;
    const tooClose = picked.some(p => Math.hypot(p.c[0] - cand.c[0], p.c[1] - cand.c[1]) < 200);
    if (tooClose) continue;                                         // 质心太近 = 视觉重叠
    picked.push(cand);
  }
  return picked.map(p => smoothPath(p.line));
}

// 色带配色:与全站色条同一套低饱和色相语言。a=亮色权重,dk=暗色权重(暖色在深色下发浑,单独压低)
const STYLES = [
  { hues: [210, 248, 275], w: 190, a: 1.00, dk: 1.00 },
  { hues: [168, 190, 214], w: 170, a: 0.82, dk: 0.72 },
  { hues: [332, 356, 28],  w: 150, a: 0.72, dk: 0.16 },
  { hues: [28, 46],        w: 120, a: 0.50, dk: 0.10 },
  { hues: [262, 292],      w: 130, a: 0.58, dk: 0.46 },
];
const LAYERS = 11;   // 羽化层数:少于 ~9 会看出同心带状条纹

const PATHS = pickRibbonPaths(STYLES.length);

function svg(mode) {
  const dark = mode === 'dark';
  const base = dark ? '#07070c' : '#ffffff';
  const defs = [];
  const body = [];
  PATHS.forEach((d, i) => {
    const st = STYLES[i];
    const weight = dark ? (st.dk == null ? st.a : st.dk) : st.a;
    defs.push(`<path id="p${i}" d="${d}" fill="none"/>`);
    if (weight <= 0.01) return;
    const stops = st.hues.map((h, k) => {
      const off = Math.round(k / (st.hues.length - 1) * 100);
      return `    <stop offset="${off}%" stop-color="${dark ? `hsl(${h} 55% 16%)` : `hsl(${h} 74% 88%)`}"/>`;
    }).join('\n');
    defs.push(`<linearGradient id="r${i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${Math.round(H * 0.4)}">
${stops}
  </linearGradient>`);
    // 多层羽化:外层最宽最淡,内层最窄最浓;路径只存一份,各层用 <use> 引用
    for (let k = 0; k < LAYERS; k++) {
      const t = k / (LAYERS - 1);
      const width = Math.round(st.w * (1 - t * 0.88));
      const alpha = ((dark ? 0.062 : 0.052) * weight * (0.35 + t * 0.9)).toFixed(4);
      body.push(`  <use href="#p${i}" stroke="url(#r${i})" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${alpha}"/>`);
    }
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
${defs.join('\n')}
</defs>
<rect width="${W}" height="${H}" fill="${base}"/>
${body.join('\n')}
</svg>`;
}

for (const mode of ['light', 'dark']) {
  const out = join(ROOT, 'assets', `bg-${mode}.svg`);
  const content = svg(mode);
  writeFileSync(out, content);
  console.log('✓', out, (content.length / 1024).toFixed(1) + 'KB');
}
