#!/usr/bin/env node
// gen-bg.mjs —— 生成全站渐变背景 SVG(assets/bg-{light,dark}.svg)。一次生成、静态发布,运行时零计算。
//
// 设计(2026-08-04 用户裁决,等高线版嫌丑后改):**保留等高线那套「高程场峰谷」的构图思路**,
// 但不再画线 —— 每个峰渲染成一团 radialGradient 晕染,低饱和多色在白(暗=近黑)底上柔和交叠。
// 关键调校经验:
//   1) 晕团别铺满整幅、别互相全覆盖 —— 半径控制在画布 40~55%,留出干净底色,色团才分得出来;
//   2) 别加全幅 wash 罩层 —— 它会把所有色相压成一片灰(第一版就是这么翻车的);
//   3) 亮色要「高明度 + 够高饱和」(hsl ~72% 91%),饱和度低了在白底上只剩脏灰;
//   4) 暗色底提到 #07070c 并让色团亮度到 ~15%,否则整幅死黑看不出层次;
//   5) 暗色下暖色(橙/粉)与冷色叠加会发浑发脏 —— 用 dk 权重单独压低甚至归零,暗色只留冷调三团。
// 纯静态:无脚本、无动画、无滤镜(不用 feGaussianBlur,大面积模糊在低端机上是真开销;径向渐变本身够柔)。
//
// 改构图/配色改本文件后:node tools/gen-bg.mjs && 重新 build,产物要提交。
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const W = 1440, H = 900;

// 晕团布局:沿用等高线高程场的峰谷分布感 —— 大小错落、部分出血到画布外,避免对称呆板。
// hue 取自全站色条同一套低饱和色相语言;r 为椭圆半径占画布宽的比例;a 为强度权重。
// a = 亮色权重;dk = 暗色权重(缺省同 a)。
const BLOBS = [
  { x: 0.12, y: 0.04, rx: 0.46, ry: 0.62, hue: 210, a: 1.00, dk: 1.00 },   // 左上 · 冷蓝(最强)
  { x: 0.88, y: 0.14, rx: 0.42, ry: 0.58, hue: 275, a: 0.86, dk: 0.80 },   // 右上 · 淡紫
  { x: 0.70, y: 0.72, rx: 0.44, ry: 0.60, hue: 168, a: 0.78, dk: 0.62 },   // 右下 · 青绿
  { x: 0.20, y: 0.92, rx: 0.40, ry: 0.52, hue: 332, a: 0.74, dk: 0.24 },   // 左下 · 藕粉(暗色下压低)
  { x: 0.52, y: 0.34, rx: 0.30, ry: 0.40, hue: 28,  a: 0.52, dk: 0 },      // 中心偏上 · 暖橙(暗色去掉,会发浑)
];

function svg(mode) {
  const dark = mode === 'dark';
  const base = dark ? '#07070c' : '#ffffff';
  // 亮色:高明度 + 够高饱和(白底上饱和度低了只剩脏灰);暗色:低明度中饱和(黑底上的色温)
  const stop = (b, offset, k) => {
    const w = dark ? (b.dk == null ? b.a : b.dk) : b.a;
    const alpha = ((dark ? 0.72 : 0.62) * w * k).toFixed(3);
    return dark
      ? `<stop offset="${offset}" stop-color="hsl(${b.hue} 52% 15% / ${alpha})"/>`
      : `<stop offset="${offset}" stop-color="hsl(${b.hue} 72% 91% / ${alpha})"/>`;
  };
  const defs = BLOBS.map((b, i) => `<radialGradient id="g${i}" cx="50%" cy="50%" r="50%">
${stop(b, '0%', 1)}
${stop(b, '45%', 0.62)}
${stop(b, '78%', 0.2)}
    <stop offset="100%" stop-color="hsl(${b.hue} ${dark ? 40 : 60}% ${dark ? 12 : 93}% / 0)"/>
  </radialGradient>`).join('\n');
  const ellipses = BLOBS.filter(b => !(dark && b.dk === 0)).map((b, i) =>
    `<ellipse cx="${Math.round(b.x * W)}" cy="${Math.round(b.y * H)}" rx="${Math.round(b.rx * W)}" ry="${Math.round(b.ry * H)}" fill="url(#g${BLOBS.indexOf(b)})"/>`
  ).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
${defs}
</defs>
<rect width="${W}" height="${H}" fill="${base}"/>
${ellipses}
</svg>`;
}

for (const mode of ['light', 'dark']) {
  const out = join(ROOT, 'assets', `bg-${mode}.svg`);
  const content = svg(mode);
  writeFileSync(out, content);
  console.log('✓', out, (content.length / 1024).toFixed(1) + 'KB');
}
