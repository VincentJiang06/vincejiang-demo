#!/usr/bin/env node
// gen-bg.mjs —— 生成全站渐变背景 SVG(assets/bg-{light,dark}.svg)。一次生成、静态发布,运行时零计算。
//
// 设计(2026-08-04 定稿):**曲线状散开的线性渐变** —— 几条贯穿画布的大 S 形曲线,
// 每条用 linearGradient 沿走向着色(两三个低饱和色相过渡),再靠「多层同形描边羽化」散开边缘:
// 同一条曲线画 N 层,stroke-width 由粗到细、opacity 由淡到浓,叠加出中心浓、边缘柔和散开的色带。
// (不用 feGaussianBlur —— 大面积模糊在低端机上是真开销,多层描边是等价但零滤镜的做法。)
//
// 关键调校经验(踩过的坑,改之前先看):
//   1) 别加全幅 wash 罩层 —— 会把所有色相压成一片脏灰;
//   2) 亮色要「高明度 + 够高饱和」(hsl ~72% 88%),饱和度低了在白底上只剩脏灰;
//   3) 暗色底 #07070c、色带亮度 ~16%,否则死黑没层次;
//   4) 暗色下暖色(橙/粉)与冷色叠加会发浑 —— 用 dk 权重单独压低甚至归零,暗色只留冷调;
//   5) 羽化层数别少于 ~9,层数少了能看出一圈圈同心边界(带状条纹);
//   6) **色带别太宽** —— 宽度超过画布高的 ~20%(如 300/900)时,弯曲会被羽化糊成水平条,曲线感全失;
//      想要看得出「曲线状散开」,带宽压到 110~190 且控制点拉出真正的 S 弯。
//
// 改构图/配色改本文件后:node tools/gen-bg.mjs && 重新 build,产物要提交。
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const W = 1440, H = 900;

// 曲线色带:d 为贯穿画布的三次贝塞尔(坐标按 W/H 比例给,出血到画布外);
// hues 为沿曲线走向的渐变色相序列;w 为色带最粗层宽度(px);a 亮色权重;dk 暗色权重(缺省同 a)。
const RIBBONS = [
  { // 左上 → 右中:主色带,冷蓝转淡紫;控制点拉出明显 S 弯,不要退化成水平条
    pts: [[-0.12, 0.02], [0.30, 0.52], [0.62, -0.06], [1.12, 0.40]],
    hues: [210, 248, 275], w: 190, a: 1.00, dk: 1.00,
  },
  { // 左中 → 右下:青绿转蓝,与主带反向弯曲形成交错
    pts: [[-0.12, 0.74], [0.26, 0.34], [0.72, 0.96], [1.12, 0.52]],
    hues: [168, 190, 214], w: 170, a: 0.82, dk: 0.72,
  },
  { // 底部斜掠:藕粉转暖橙(暗色下压到几乎无)
    pts: [[-0.12, 1.06], [0.32, 0.72], [0.70, 1.12], [1.12, 0.78]],
    hues: [332, 356, 28], w: 150, a: 0.72, dk: 0.16,
  },
  { // 顶部细带:一抹暖色提气,弯度小、走得高
    pts: [[-0.12, 0.20], [0.34, -0.10], [0.76, 0.26], [1.12, -0.04]],
    hues: [28, 46], w: 110, a: 0.44, dk: 0.10,
  },
];


const LAYERS = 11;   // 羽化层数:层数少了能看出同心带状条纹(经验 ≥9)

function pathD(pts) {
  const p = pts.map(([x, y]) => [Math.round(x * W), Math.round(y * H)]);
  return `M${p[0][0]} ${p[0][1]}C${p[1][0]} ${p[1][1]},${p[2][0]} ${p[2][1]},${p[3][0]} ${p[3][1]}`;
}

function svg(mode) {
  const dark = mode === 'dark';
  const base = dark ? '#07070c' : '#ffffff';
  const defs = RIBBONS.map((r, i) => {
    const stops = r.hues.map((h, k) => {
      const off = Math.round(k / (r.hues.length - 1) * 100);
      const color = dark ? `hsl(${h} 55% 16%)` : `hsl(${h} 74% 88%)`;
      return `    <stop offset="${off}%" stop-color="${color}"/>`;
    }).join('\n');
    // 渐变沿曲线走向(左→右),userSpaceOnUse 保证与路径坐标一致
    return `<linearGradient id="r${i}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="${H * 0.4}">
${stops}
  </linearGradient>`;
  }).join('\n');

  const ribbons = RIBBONS.map((r, i) => {
    const weight = dark ? (r.dk == null ? r.a : r.dk) : r.a;
    if (weight <= 0.01) return '';
    const d = pathD(r.pts);
    // 多层羽化:外层最宽最淡,内层最窄最浓;叠加后中心浓、边缘散开
    const layers = [];
    for (let k = 0; k < LAYERS; k++) {
      const t = k / (LAYERS - 1);                       // 0=最外 1=最内
      const width = Math.round(r.w * (1 - t * 0.88));
      const alpha = ((dark ? 0.105 : 0.095) * weight * (0.35 + t * 0.9)).toFixed(4);
      layers.push(`  <path d="${d}" fill="none" stroke="url(#r${i})" stroke-width="${width}" stroke-linecap="round" opacity="${alpha}"/>`);
    }
    return layers.join('\n');
  }).filter(Boolean).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
${defs}
</defs>
<rect width="${W}" height="${H}" fill="${base}"/>
${ribbons}
</svg>`;
}

for (const mode of ['light', 'dark']) {
  const out = join(ROOT, 'assets', `bg-${mode}.svg`);
  const content = svg(mode);
  writeFileSync(out, content);
  console.log('✓', out, (content.length / 1024).toFixed(1) + 'KB');
}
