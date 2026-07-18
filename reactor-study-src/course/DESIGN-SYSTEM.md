# 设计系统：REACTOR — 一套 Nothing 美学的课程网站语言

> 本文是网站的设计宪法。所有页面、模块、组件都从这里派生。
> 目标：把 Nothing / Teenage Engineering 的工业极简美学，提炼成一套可执行的
> token + 组件 + 特效规范，服务于一个"排名/测量反应性"主题的大型天赋树课程。
> 读者：负责实现的工程侧（也是 Fable 自己后续建站时的唯一事实来源）。

---

## 0. 命名

- **平台代号：REACTOR**（reactivity 反应性 × reactor 反应堆——测量是会自我放大的链式反应）。
- 中文主标题：**《当尺子开始回看你》** —— 副题："一部关于排名、评测与反身性的现场手册"。
- 英文：**THE MEASURE LOOKS BACK · a field manual on reactivity**。
- 气质关键词：field manual（现场手册）/ instrument（仪器）/ specimen（标本）/
  telemetry（遥测）。整站要读起来像一台**测量仪器的说明书**——这与主题自指：
  我们用一台仪器，去讲测量这台仪器如何反噬现实。

---

## 1. 设计 DNA：从 Nothing 与 TE 提炼的七条原则

我看了 nothing.tech（确认：纯黑白单色基底、颜色只从产品图渗出、`ear ( 3a )`
式括号命名、大留白网格、link 式极简按钮）并综合 Nothing OS / Glyph 界面与
Teenage Engineering（OP-1 / OP-Z / PO 系列 / 官网）的设计语言，提炼为七条：

**1. 单色基底 + 单一信号色（Monochrome + one signal color）。**
Nothing 的核心不是"黑白"，而是"黑白 **加一个** 高饱和信号色"。红色是 Nothing 的
签名（录制点、通知）。TE 则把红/黄/蓝当**功能编码**——不同颜色 = 不同功能区。
→ 我们的做法：黑白灰做 95% 的界面，信号色只在"通电/激活/警告/强调"时出现。
且信号色**三选一可切换**（见 §3），并同时充当课程三大分支的编码色。

**2. 点阵是灵魂（The dot-matrix is the soul）。**
Nothing 的 Ndot 字体、Glyph LED、机身穿孔，全是**圆点栅格**。这是"LED / 穿孔金属 /
乐谱纸"的共同母题。→ 全站背景是极淡的点栅格；LED 效果本质就是"会发光的点阵"；
分节符、进度、节点都用点阵表达。

**3. 透明与内构可见（Transparency / exposed internals）。**
Nothing 硬件透明，能看到螺丝和排线；这是一种"诚实的技术"姿态。→ UI 用**磨砂玻璃**
面板（backdrop blur），并**故意暴露结构**：坐标标注、螺丝孔、版本号、"这是一个
模块"的边框与角标。装饰即信息。

**4. 工程制图的标注癖（Engineering-drawing labeling）。**
TE 和 Nothing 都爱在角落放**微型等宽大写标签**：`01 — SPECIFICATIONS`、
`FIG. 04`、`REV. 2.1`、坐标刻度、括号注释 `( )`、尺寸引线。→ 每个模块、每张图、
每个章节都带这种"仪器铭牌"。它让内容显得被精确测量过——与主题反讽地呼应。

**5. 极端排版对比（Typographic contrast）。**
巨大的技术无衬线标题 vs 极小的等宽功能标签，中间几乎没有中间态。留白极多。
→ display 用粗壮 grotesk，label 用等宽小字，正文才是常规阅读字号。

**6. 网格与模块化（Grid & modularity）。**
一切都在网格里，像 PO 合成器的按钮矩阵、像穿孔板。内容天然是"一格一格的模块"。
→ 课程本身就是模块化的（天赋树节点 = 模块），设计与信息结构同构。

**7. 克制的动效，机械的节奏（Restrained, mechanical motion）。**
Nothing 的动效像 LED 通电/熄灭、像继电器开合——**离散、有段落感**，不是流畅的
缓动。→ 用 steps() 时间函数、闪断、扫描线、点阵逐点点亮，而非丝滑淡入。

> 一句话审美定调：**"一台透明的测量仪器，黑白机身，穿孔点阵会发光，
> 角落印着等宽的铭牌，只有通电时才亮起一种颜色。"**

---

## 2. 设计 Token（CSS 变量，权威定义）

### 2.1 中性色阶（墨黑 → 纸白，带极轻冷调）

```
--ink-900: #0A0A0B   /* 近黑主背景（不是纯黑，带一点冷灰，屏幕更耐看）*/
--ink-800: #121214   /* 面板底 */
--ink-700: #1A1A1D   /* 卡片 */
--ink-600: #26262B   /* 边界/分隔 */
--ink-500: #3A3A42   /* 次要边界 */
--ink-400: #5C5C66   /* 禁用文字 */
--ink-300: #8A8A95   /* 次要文字 */
--ink-200: #B8B8C0   /* 正文次强调 */
--ink-100: #E4E4E8   /* 正文（暗色模式）*/
--paper:   #F4F4F2   /* 纸白（亮色模式主背景，带暖，像手册纸）*/
--paper-2: #EAEAE6   /* 亮色模式面板 */
--white:   #FFFFFF
```

### 2.2 三套信号色（唯一的颜色来源；见 §3 主题切换）

```
/* RED — 社会学谱系（Nothing 签名红）*/
--sig-red:      #D6002A
--sig-red-glow: #FF1F49

/* BLUE — 定律与形式（仪器蓝 / 示波器绿松蓝）*/
--sig-blue:      #1E5BFF
--sig-blue-glow: #4C86FF

/* YELLOW — 机器与前沿（TE 警示黄）*/
--sig-yellow:      #FFD400
--sig-yellow-glow: #FFE85C
```

信号色仅用于：激活态、当前分支、LED 发光、进度已完成段、警示、链接 hover、
关键强调词。**正文永不用信号色**。

### 2.3 字体

```
--font-display: "Space Grotesk", "Neue Haas Grotesk", system-ui, sans-serif;
                /* 技术感 grotesk，做大标题/节点名 */
--font-mono:    "Maple Mono", "Commit Mono", "SFMono-Regular", ui-monospace, monospace;
                /* 所有铭牌/坐标/代码/数字/标签 */
--font-body:    "Inter", system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
                /* 正文 */
--font-read:    "LXGW WenKai Mono", var(--font-body);
                /* 长文阅读可选：温暖的中文等宽，做"手册正文"气质 */
```

点阵/LED 效果**不靠字体**，靠 CSS 生成（见 §5），以保证自包含、可离线、可无限缩放。
可选增强：自托管开源点阵字体（DotGothic16, OFL）用于纯拉丁的巨型数字。

### 2.4 间距 / 圆角 / 栅格

```
--u: 8px;                       /* 基础间距单元，全站 8px 网格 */
--radius: 2px;                  /* 圆角极小——工业硬朗，几乎直角 */
--radius-panel: 4px;
--border: 1px solid var(--ink-600);
--maxw: 1200px;                 /* 内容最大宽 */
--dot-gap: 22px;                /* 背景点栅格间距 */
--grid-unit: 64px;              /* 天赋树/模块对齐大网格 */
```

### 2.5 层与阴影（玻璃时代用 blur 而非重阴影）

```
--blur: 14px;
--glass-bg:   color-mix(in srgb, var(--ink-800) 62%, transparent);
--glass-brd:  color-mix(in srgb, var(--white) 10%, transparent);
--shadow-led: 0 0 0 1px, 0 0 12px;   /* 配合 currentColor 做发光 */
```

---

## 3. 三套配色 = 主题切换 + 分支编码（核心机制）

用户要"黑 / 蓝红黄 / 白 三套配色"。落地方案（一石三鸟）：

- 全站永远是**黑白基底**（暗色为主，亮色可切）。
- **信号色三选一**：`data-accent="red|blue|yellow"` 挂在 `<html>` 上，
  切换 `--accent` / `--accent-glow` 指向对应信号色。右上角有一个 TE 风格的
  三档硬拨杆切换器（红/蓝/黄三个发光点，像合成器的波形选择）。
- **同时**，课程三大分支**恒定绑定**三色：进入 RED 分支的课，无论全局主题如何，
  该分支的节点、进度、模块强调都用红；BLUE 用蓝；YELLOW 用黄。汇流章节
  用白/多色。这样"配色"既是用户可玩的主题开关，又是知识结构的视觉编码。
- 亮/暗：`data-theme="dark|light"`。暗 = 黑机身透明仪器（默认、最出效果）；
  亮 = 白色手册纸张（打印手册气质）。两套都要调好。

> 记忆口诀：**主题是你手里的开关（红/蓝/黄 × 亮/暗），分支是知识的颜色（恒定）。**

---

## 4. 组件库（原子 → 分子）

每个组件都带"铭牌"基因。以下为规格，实现见 theme/components.css。

**4.1 Nameplate（铭牌标签）** — 等宽大写小字 + 引线/方括号。
形如 `[ R4 ] DISCIPLINE ————————— REV.1`。用于每个模块/章节头。

**4.2 Node chip（节点芯片）** — 天赋树的单个节点。状态：locked（灰、点阵暗）/
available（描边呼吸）/ active（发光 LED）/ completed（实心 + 勾）。方形硬角，
左上角编号，中心图标（几何象形，TE 风），底部微标题。

**4.3 Glass panel（玻璃面板）** — 磨砂 + 1px 亮边 + 四角"螺丝"点。承载正文与模块。

**4.4 LED readout（LED 读出屏）** — 点阵显示区，用于数值/状态/进度，绿松或信号色发光，
带扫描线。是"仪器"气质的主要载体。

**4.5 Toggle bank（拨杆组）** — TE 风格硬开关：主题切换、模块参数的离散选择。

**4.6 Slider / dial（滑块 / 旋钮）** — 交互模块的主要输入。旋钮带刻度点阵环。

**4.7 Diagram frame（制图框）** — 给任何插图/模块套上工程制图边框：坐标刻度、
`FIG.` 编号、尺寸引线、图注。

**4.8 Callout（旁注块）** — 三种：`// 讹传更正`（红）、`// 直觉`（蓝）、
`// 落地到 AI eval`（黄）。用等宽前缀 `//` 与信号色左边框。

**4.9 Boot line（通电行）** — 页面/模块加载时逐字符点亮的一行等宽文本，
像仪器自检 `SELF-TEST OK · REACTOR v1 · LOADING TELEMETRY…`。

**4.10 Progress spine（进度脊）** — 侧边的点阵竖条，随阅读点亮，像 Glyph 灯带。

---

## 5. 招牌特效：玻璃 + LED（用户点名要做好的两样）

### 5.1 玻璃（Glass）
- 面板：`background: var(--glass-bg); backdrop-filter: blur(var(--blur)) saturate(1.1);
  border: 1px solid var(--glass-brd);` + 顶部一道 1px 高光渐变（模拟玻璃边缘反光）。
- **暴露结构**：面板四角用 `::before/::after` 放小圆点（螺丝孔）；边缘印坐标刻度。
- 背景与玻璃之间要有可透视的**点栅格 + 极淡噪点**，blur 才有"磨砂"实感。
- 性能不敏感（用户已授权），可叠多层玻璃 + 微动的背景光斑透过玻璃。

### 5.2 LED（发光点阵）
LED 是本站的记忆点，四种实现层层递进：

1. **点阵底**：`radial-gradient` 平铺出圆点栅格（`background-size: var(--dot-gap)`）。
   暗态点是 `--ink-600`。
2. **点亮**：激活的点 = 信号色 + `box-shadow: 0 0 6px currentColor, 0 0 14px currentColor;`
   `color: var(--accent-glow)`。发光靠多层 box-shadow / drop-shadow。
3. **Glyph 灯带**：Nothing 招牌——沿元素边缘/路径排布的一列点，用 `@keyframes` 做
   "逐点点亮 / 呼吸 / 追逐"，`animation-timing-function: steps()` 保持机械离散感。
   用于：节点解锁的通电动画、进度脊、模块加载、正确答案的庆祝。
4. **扫描线 / CRT**：LED 读出屏叠一层 `repeating-linear-gradient` 扫描线 +
   轻微 flicker，给"老式仪表"的温度。可选 chromatic aberration 微移。

关键：所有发光都用 `currentColor` + 当前分支/主题的 `--accent`，一处定义处处发光。
尊重 `prefers-reduced-motion`：关闭闪烁/追逐，保留静态发光。

---

## 6. 交互模块套件（Module Kit）—— "超级多"的落地策略

用户要"超级多"可交互模块，且"设计和 UI 创意跟着文章走"。策略：**共享外壳 +
可复用引擎 + 每课一个定制皮肤**。

### 6.1 统一外壳
每个模块都被 `Diagram frame`（§4.7）+ `Glass panel`（§4.3）包裹，带 `FIG.` 铭牌、
参数拨杆区、LED 读出区、reset。这保证 40+ 个模块**看起来是一台仪器的不同表盘**，
而不是拼凑的 widget。共享一个 `module.css` + `module.js` 基类（挂载、reset、
reduced-motion、随机种子、数值格式化）。

### 6.2 可复用引擎（一份代码，多处皮肤）
把我已经跑通的 5 个 Python 实验移植为 JS 引擎，复用于多个节点：
- `sim-feedback`（反应性反馈回路）→ 用于 R1、R2、R10、C2
- `sim-goodhart4`（Goodhart 四型）→ B1、B8
- `sim-musiclab`（社会影响市场）→ R10、Y11
- `sim-overopt`（过优化抛物线）→ Y2、Y7
- `sim-select`（择优/赢者诅咒/best-of-N）→ Y3、Y11、C4

### 6.3 模块类型学（设计跟着内容走）
按内容气质给每类内容配一种交互原型：

| 类型 | 交互 | 用于哪些节点 |
|---|---|---|
| **Simulator（模拟器）** | 拖滑块看曲线/散点实时变 | 反应性、Goodhart四型、过优化、MusicLab、RM |
| **Sandbox（沙盒博弈）** | 你扮演被测者，分配预算/选策略去骗指标 | "当院长"、reward hack 沙盒、"设计一个抗博弈 eval" |
| **Scrollytelling（滚动叙事）** | 滚动驱动一张图分步演化 | 自我实现预言的闭环、Foucault 全景敞视、Doing Business 时间线 |
| **Explorable（可探索图解）** | hover/点节点看解释 | 概念地图五近邻、委托代理流、七杠杆记分卡 |
| **Provenance（考证对照）** | 并排/翻转对照"流行版 vs 原文" | Goodhart 出处、McNamara 引文、眼镜蛇史实 |
| **Meter/Quiz（仪表自测）** | 拨杆答题，LED 亮绿/红反馈 | 每章末尾自检、七杠杆打分 |
| **Timeline（时间线）** | 横向可拖时间轴 | Arena 事件史、US News 造假史 |
| **Diagram-live（活体制图）** | 静态图 + 少量可调参数注解 | 形式模型（HM、Baker）、Ashby 多样性 |

目标密度：**每个知识节点至少 1 个模块，招牌节点 2-3 个**。全站规划 ≥ 45 个模块实例
（其中 ~8 个可复用引擎 × 多皮肤 + ~30 个定制小模块）。

### 6.4 招牌模块（signature，最花心思）
1. **The Talent Tree（天赋树本体）** —— 可平移缩放的 SVG 图，节点 LED 通电、
   连线像电路、localStorage 记进度、点节点进课。是首页也是导航。
2. **The Seven Levers（七杠杆记分卡）** —— 七个拨杆（垄断度/利害/粗暴度/节律/
   零和/可绕行/被测者反身能力），实时算出"反应性强度指数"并给现实类比。C2 capstone。
3. **Game the Ranking（当院长）** —— 沙盒：预算在"真实质量 vs 操纵指标"间分配，
   看排名与真实质量分道扬镳。R1 招牌。
4. **Eval Overfitting Lab（评测过拟合实验室）** —— 复现 exp4：反复用同一 eval，
   看榜面分裂成"真实 / 窄化 / 题目过拟合"三条。Y2 招牌，直击用户痛点。
5. **Design-a-Robust-Eval（抗博弈 eval 构建器）** —— 玩家勾选防御手段（held-out /
   轮换 / 配对指标 / 人工抽检 / 解耦），系统模拟 gaming 攻击看哪些被挡住。C3/C7 capstone。

---

## 7. 页面类型与信息架构

- **首页 `/`** = 天赋树全景 + 通电 boot 序列 + 主题拨杆 + 进度。是仪器的"总面板"。
- **分支页 `/branch/{red|blue|yellow}`** = 该谱系的导言 + 该分支子树。
- **课程页 `/lesson/{id}`** = 单节点。结构模板见 §8。
- **capstone 页** = 汇流章，含招牌大模块。
- **附录 `/atlas`** = 概念地图、术语表、完整参考文献（承接 research/01–10）。
- **关于 `/manual`** = 这台"仪器"的说明书（元页面：讲设计与主题自指）。

SEO/GEO：纯静态多页 HTML（无 React），每页服务端预渲染真实内容、语义化标题层级、
JSON-LD（Course / LearningResource schema）、每课有摘要 meta 与 OpenGraph、
sitemap.xml、干净可读 URL。交互模块是渐进增强（no-JS 也能读到静态图 fallback +
全文），这对爬虫和 LLM 抓取（GEO）都友好。

---

## 8. 课程页模板（每个节点长这样）

```
┌ 铭牌：[ R4 ] DISCIPLINE & SURVEILLANCE · REV.1 · 分支色=RED ┐
│ Boot line 自检动画                                          │
│ 巨型节点标题（display）+ 一句"钩子"                          │
│ 前置/解锁：← 依赖节点   → 解锁节点（小天赋树局部图）          │
├─────────────────────────────────────────────────────────┤
│ § 概念（Fable 正文，玻璃面板，配 // 直觉 旁注）              │
│ § 招牌交互模块（Diagram frame + FIG. 铭牌）                 │
│ § 深入（原文证据 / 考证 / 形式化，配 // 讹传更正）           │
│ § 落地到 AI eval（// 黄旁注，连到用户的核心命题）            │
│ § 自测（LED meter quiz）                                    │
│ § 来源（引 research/xx，可折叠）                            │
├─────────────────────────────────────────────────────────┤
│ 进度脊点亮一格 · 下一个推荐节点（按树的脉络，非线性）        │
└─────────────────────────────────────────────────────────┘
```

写作声音（Fable 的文案基调）：像上一轮对话里用户欣赏的那种——**亲和、像讨论
哲学一样、有冷幽默、但底子是硬考证**。术语保留英文，关键结论加信号色强调。
每课结尾都收束到用户的元问题："我们生活/工程里，正被多少已经失效的尺子量着？"

---

## 9. 技术实现约定

- 生成器：自写 Node ESM 脚本 `site/build.mjs`，读 `content/tree.json` +
  `content/lessons/*`，套模板吐 `dist/*.html`。零运行时框架、零 React。
- CSS：原生 CSS + 自定义属性，分文件（tokens / base / components / led / module）。
- JS：原生 ES module，每个交互模块一个文件，`<script type="module">` 按需加载，
  渐进增强。图形用 Canvas（模拟器）与 SVG（天赋树/图解）。
- 字体：自托管，`font-display: swap`，带系统回退，先跑起来。
- 无障碍：语义标签、焦点态、`prefers-reduced-motion`、对比度达标、模块有文字 fallback。
- 部署：纯静态，任意 CDN/静态托管。性能不敏感但仍做懒加载与合理分包。
```
