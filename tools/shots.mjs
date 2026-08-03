#!/usr/bin/env node
// shots.mjs —— 作品卡「真实首屏截图 + 主色相提取」维护工具(手动跑,CI 不跑)。
// 用法(经 shots.sh 在 playwright 容器里执行,本机无需装浏览器):
//   ./shots.sh                 # 截全部 gallery 项目
//   ./shots.sh paletter cus    # 只重截指定 key
//   ORIGIN=http://localhost:8080 ./shots.sh   # 对本地构建截图(默认打线上)
// 产物:
//   assets/shots/<key>.jpg —— 960×600 首屏截图(viewport 1280×800 × dsf 0.75,jpeg q84);
//   site.config.json 各 gallery 条目的 hue 字段 —— 从截图提取的主色相(饱和度过低的灰系站写 null)。
// 色相提取在浏览器 canvas 里做(零 npm 依赖):去灰/去黑白后按饱和度×明度加权直方图取峰,
// 峰桶 ±1 邻域做圆均值;彩色像素占比 <1.5% 视作中性站(hue=null,卡片走 neutral 样式)。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');   // 由 shots.sh 挂载并经 NODE_PATH 提供

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const CONFIG_PATH = join(ROOT, 'site.config.json');
const SHOTS_DIR = join(ROOT, 'assets', 'shots');
const ORIGIN = process.env.ORIGIN || 'https://vincejiang.com';
const only = process.argv.slice(2).filter(a => !a.startsWith('-'));

// 个别站点的额外等待(开屏动画/懒加载),按 key 覆盖;默认 2800ms 等字体与动画稳定
const EXTRA_WAIT = { 'ai-industry-report': 5200, reactor: 4000, cus: 4000 };
// 个别站点截图前的页面预操作:默认首屏是空态/占位的站,切到内容更有代表性的视图再截
// (评审实测:cus 默认「信息」页几乎全白,暗色主题下像坏图;「选课」页是 1611 门课的卡片流)
const ACTIONS = {
  cus: async page => { await page.click('text=选课', { timeout: 8000 }); await page.waitForTimeout(2500); },
};

async function extractHue(page, jpgBuffer) {
  const dataUri = 'data:image/jpeg;base64,' + jpgBuffer.toString('base64');
  return await page.evaluate(async (src) => {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('img decode failed')); img.src = src; });
    const W = 128, H = Math.max(1, Math.round(img.height / img.width * W));
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const BUCKETS = 24, SEG = 360 / BUCKETS, hist = new Float64Array(BUCKETS);
    const px = [];
    let total = 0, colored = 0;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, delta = mx - mn;
      total++;
      if (delta < 0.06 || l < 0.07 || l > 0.95) continue;          // 近灰/近黑/近白不计
      const s = delta / (1 - Math.abs(2 * l - 1));
      if (s < 0.15) continue;
      let h;
      if (mx === r) h = ((g - b) / delta + 6) % 6; else if (mx === g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4;
      h *= 60;
      const w = s * (1 - Math.abs(l - 0.5));
      hist[Math.floor(h / SEG) % BUCKETS] += w;
      px.push([h, w]);
      colored++;
    }
    let best = 0, bestV = -1;
    for (let k = 0; k < BUCKETS; k++) {
      const v = hist[(k + BUCKETS - 1) % BUCKETS] * 0.5 + hist[k] + hist[(k + 1) % BUCKETS] * 0.5;
      if (v > bestV) { bestV = v; best = k; }
    }
    let sx = 0, sy = 0;
    for (const [h, w] of px) {
      const k = Math.floor(h / SEG) % BUCKETS;
      const dk = Math.min((k - best + BUCKETS) % BUCKETS, (best - k + BUCKETS) % BUCKETS);
      if (dk > 1) continue;
      const rad = h * Math.PI / 180; sx += Math.cos(rad) * w; sy += Math.sin(rad) * w;
    }
    const hue = Math.round(((Math.atan2(sy, sx) * 180 / Math.PI) + 360) % 360);
    return { hue, coverage: colored / total };
  }, dataUri);
}

const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
// gallery 提取 hue 并写回;wildSites 只截图 —— 站色相是手选的设计决定(反官色),不被提取值覆盖
const pool = [
  ...(config.gallery || []).map(g => ({ entry: g, href: g.href, writeHue: true })),
  ...(config.wildSites || []).map(w => ({ entry: w, href: w.url, writeHue: false })),
];
const targets = pool.filter(t => t.entry.key && (!only.length || only.includes(t.entry.key)));
if (!targets.length) { console.error('没有匹配的 gallery/wildSites 条目(检查 key)'); process.exit(1); }
mkdirSync(SHOTS_DIR, { recursive: true });

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const failures = [];
for (const { entry: g, href, writeHue } of targets) {
  const url = /^https?:/.test(href) ? href : ORIGIN + href;
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }, deviceScaleFactor: 0.75,
    colorScheme: 'light', locale: 'zh-CN',
  });
  const page = await context.newPage();
  try {
    try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }); }
    catch (e) {
      // 只容忍 networkidle 超时(长轮询站 load 早已完成);DNS/拒连等真实失败必须抛出去记为失败,
      // 否则会把浏览器错误页截成「成功」并把无意义 hue 写回 config
      if (e?.name !== 'TimeoutError') throw e;
    }
    await page.waitForTimeout(EXTRA_WAIT[g.key] ?? 2800);
    if (ACTIONS[g.key]) await ACTIONS[g.key](page);
    const jpg = await page.screenshot({ type: 'jpeg', quality: 84 });
    writeFileSync(join(SHOTS_DIR, g.key + '.jpg'), jpg);
    const blank = await context.newPage();                      // 提色在 about:blank 做,避开目标站 CSP
    const { hue, coverage } = await extractHue(blank, jpg);
    if (writeHue) g.hue = coverage >= 0.015 ? hue : null;
    console.log(`✓ ${g.key.padEnd(20)} ${url}  hue=${writeHue ? (g.hue ?? 'null(中性)') : `[手选 ${g.hue ?? '无'};提取 ${hue} 仅记录]`}  彩色占比=${(coverage * 100).toFixed(1)}%`);
  } catch (e) {
    failures.push(g.key);
    console.error(`✗ ${g.key}: ${e.message}`);
  } finally {
    await context.close();
  }
}
await browser.close();

writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
console.log(`\nsite.config.json 已写回 hue;截图在 assets/shots/(记得 git add)。`);
if (failures.length) { console.error(`失败:${failures.join(', ')}`); process.exit(1); }
