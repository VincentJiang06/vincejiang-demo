# REACTOR — 课程网站

《当尺子开始回看你》——排名/评测/反身性的现场手册。纯静态、无 React、Nothing 美学、
天赋树导航。设计与课程策划见 [../course/DESIGN-SYSTEM.md](../course/DESIGN-SYSTEM.md) 与
[../course/COURSE-ARCHITECTURE.md](../course/COURSE-ARCHITECTURE.md)。

## 构建 & 预览

```bash
cd site
node build.mjs                 # 生成 dist/（纯静态 HTML）
cd dist && python3 -m http.server 8099   # 预览 http://localhost:8099
```

## 结构

```
site/
  build.mjs              零框架静态生成器（读 content/ → 吐 dist/）
  content/
    tree.json            天赋树 44 节点图（权威数据）
    lessons/*.mjs        每节课的文案（Fable 撰写；导出 {id, blocks}）
  theme/
    tokens.css           设计 token（颜色/字体/间距/三套信号色）
    base.css             重置 + 排版 + 布局 + 骨架
    components.css       铭牌/玻璃面板/按钮/旁注/模块外壳/拨杆…
    led.css              LED 发光/点阵/Glyph 灯带/天赋树电路
  modules/
    boot.js              主题·配色切换、进度持久化、通电动画（每页加载）
    mod-kit.js           交互模块共享工具（slider/canvas/readout/branch色…）
    tree.js              天赋树本体（SVG 电路 + DOM 节点，平移缩放）
    the-loop.js          N00 · 观察改变被观察者
    game-the-ranking.js  R01 · 当院长（招牌沙盒）
    goodhart-provenance.js B01 · 名言出处翻卡
    eval-overfit-lab.js  Y02 · Eval 过拟合解剖（招牌，直击用户痛点）
  dist/                  生成产物（sitemap.xml / robots.txt / JSON-LD 已含）
```

## 状态：全部完成 ✅

- **字体**：全站无衬线，外部开源 CDN（jsDelivr / fontsource，均 SIL OFL）：Inter（拉丁）+ Noto Sans SC（中文）+ JetBrains Mono（等宽）。`<link>` 在 `build.mjs` 的 `FONT_LINKS`，字体栈在 `theme/tokens.css`。改内容不再需要子集化步骤。
- **主题**：只有明/暗两套，没有全局强调色切换。红/黄/蓝/绿只作分支编码，且明暗各一套色号（暗底亮色、亮底深色，正文级用色全部 ≥4.5:1）。
- **美学**：Nothing/TE 风——移动光条 + 反应堆环 SVG 动态背景、点阵、玻璃、LED、工程铭牌、角标；自绘 favicon（反应堆左右切割）；标题 reactor-study。
- **天赋树首页**：44 节点，跨分支"合金"双色连线，LED 解锁态，平移缩放，localStorage 进度。
- **44 节完整课程**：红 11 / 蓝 13 / 黄 12 / 汇流 7 + 根，全部由 Fable 撰写。
- **交互模块**：18+ 个——11 个定制 sim（feedback/goodhart4/overopt/musiclab/winners-curse/variety/overfit/arena/boom-bust/policy-invariance/seven-levers）、2 个 sandbox（当院长 / 抗博弈eval构建器）、4 个 config 驱动的通用引擎（explorable 步进/对照/卡片/矩阵、provenance 翻卡、timeline、quiz），覆盖全部 44 节点、零施工中。
- **图鉴 Atlas**：按分支分组的节点索引 + 21 条术语表 + 25 条"讹传更正"速查。
- **SEO/GEO**：纯静态多页、语义化、JSON-LD(Course/LearningResource)、sitemap(46 URL)、robots、OG、no-JS fallback、reduced-motion。dist 总大小 ~760KB（字体走 CDN 后不再自托管）。

## 加新节点/模块

- 写课：在 `content/lessons/{id}.mjs` 导出 `{id, blocks:[...]}`；块类型 prose/h/callout(myth|intuit|applied)/module/sources。
- 模块：`{t:"module", module:"type:name", config:{...}}`。`name.js` 存在→用它（定制）；否则 `type.js`（通用引擎，读 config）。放进 `modules/` 即自动发现。
- 改完内容跑 `node build.mjs`（本地预览，站根）。
- **部署到子路径**：`BASE=/reactor-study SITE=https://vincejiang.com/reactor-study node build.mjs`。
  `BASE` 给所有内部链接加前缀（含 `<html data-base>`，供 tree.js 运行时拼节点 href）；`SITE` 定 canonical / sitemap。
- **资源指纹**：finalize 阶段给 `theme/*.css` 与 `modules/*.js` 的引用加 `?v=<内容哈希>`，HTML 的 href/src 与 JS 的 import 说明符一起重写。
  用查询串而不是改文件名，是因为 `boot.js ↔ tree.js` 相互 import 成环，改名要求拓扑序，有环排不出来；查询串的哈希算的是文件原始内容，不受重写影响，没有级联失效。
- **发布到 vincejiang.com**：把 `dist/` 拷成 `~/experiment/vincejiang-demo/reactor-study/`，并在该仓库 `site.config.json` 的 `gallery` 加一条，push 后 CI 自动构建（规范见该仓库 SPEC.md §3）。
