#!/usr/bin/env node
// gen-waves.mjs —— 生成全站海浪背景 SVG(assets/bg-waves-{light,dark}.svg)。
// 设计约束(2026-08-03 用户裁决,推翻此前「纯色背景」决定):
//   - 远看 = 白 + 灰(暗色 = 近黑 + 深灰)的 mono 波浪;细看 = 波带间交替埋多个低饱和色相;
//   - 纯静态:无动画、无滤镜、无脚本,渲染零持续开销(沿用 reactor 性能红线精神);
//   - 波形 = 双正弦叠加(不同波长+相位,硬编码,构建可复现),自下而上层层堆叠。
// 改波形/配色改本文件后:node tools/gen-waves.mjs && 重新 build。
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const W = 1440, H = 900;

// 每条波带:baseY=基线高度,a1/λ1/p1 + a2/λ2/p2 双正弦,hue/sat 为「细节色」;lit/dark 分别给亮暗两版的亮度
// 色相序列刻意交替远离(青→紫→橙→蓝→绿→粉→靛→灰),同 gallery 卡的「低饱和多色」语言
const BANDS = [
  { baseY: 300, a1: 26, l1: 900, p1: 0.8, a2: 12, l2: 430, p2: 2.1, hue: 205, satL: 34, litL: 97.4, satD: 16, darkL: 6.5 },
  { baseY: 385, a1: 30, l1: 760, p1: 2.6, a2: 10, l2: 360, p2: 0.4, hue: 268, satL: 26, litL: 97.0, satD: 13, darkL: 7.0 },
  { baseY: 470, a1: 24, l1: 980, p1: 4.4, a2: 14, l2: 500, p2: 3.3, hue: 24,  satL: 38, litL: 96.8, satD: 15, darkL: 7.4 },
  { baseY: 552, a1: 32, l1: 820, p1: 1.5, a2: 11, l2: 400, p2: 5.0, hue: 215, satL: 30, litL: 96.2, satD: 15, darkL: 8.0 },
  { baseY: 636, a1: 27, l1: 700, p1: 3.8, a2: 13, l2: 330, p2: 1.7, hue: 165, satL: 28, litL: 95.9, satD: 13, darkL: 8.6 },
  { baseY: 718, a1: 30, l1: 900, p1: 5.6, a2: 12, l2: 470, p2: 4.2, hue: 330, satL: 24, litL: 95.5, satD: 12, darkL: 9.2 },
  { baseY: 800, a1: 24, l1: 780, p1: 0.2, a2: 10, l2: 380, p2: 2.9, hue: 242, satL: 26, litL: 94.9, satD: 13, darkL: 10.0 },
  { baseY: 868, a1: 18, l1: 1000, p1: 2.2, a2: 8,  l2: 520, p2: 0.9, hue: 210, satL: 18, litL: 94.2, satD: 10, darkL: 10.8 },
];

const yAt = (b, x) =>
  b.baseY + b.a1 * Math.sin((2 * Math.PI * x) / b.l1 + b.p1) + b.a2 * Math.sin((2 * Math.PI * x) / b.l2 + b.p2);

function wavePath(b, close = true) {
  const pts = [];
  for (let x = 0; x <= W; x += 16) pts.push(`${x},${yAt(b, x).toFixed(1)}`);
  const line = 'M' + pts.join(' L');
  return close ? `${line} L${W},${H} L0,${H} Z` : line;
}

function svg(mode) {
  const dark = mode === 'dark';
  const base = dark ? '#050507' : '#ffffff';
  const fills = BANDS.map(b => {
    const fill = dark ? `hsl(${b.hue} ${b.satD}% ${b.darkL}%)` : `hsl(${b.hue} ${b.satL}% ${b.litL}%)`;
    return `<path d="${wavePath(b)}" fill="${fill}"/>`;
  }).join('\n');
  // 波峰细线:挑三条波带描一根 1.5px 的低饱和亮线,是「细看有颜色」的点睛处
  const crests = [BANDS[1], BANDS[3], BANDS[5]].map(b => {
    const stroke = dark ? `hsl(${b.hue} 26% 20%)` : `hsl(${b.hue} 48% 88%)`;
    return `<path d="${wavePath(b, false)}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="${dark ? 0.55 : 0.7}"/>`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
<rect width="${W}" height="${H}" fill="${base}"/>
${fills}
${crests}
</svg>`;
}

for (const mode of ['light', 'dark']) {
  const out = join(ROOT, 'assets', `bg-waves-${mode}.svg`);
  writeFileSync(out, svg(mode));
  console.log('✓', out);
}
