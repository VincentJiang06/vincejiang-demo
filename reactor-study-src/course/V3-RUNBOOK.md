# REACTOR v3 Runbook：树重构 + 内容扩充 200%

> 2026-07-18 立项。执行主体：Fable 主线（全部课文由 Fable 撰写）。
> 本文件是跨会话的工程状态账本——每完成一波在 §5 打勾并 commit。
> 权威树定义 = `site/content/tree.json`；本文件记录设计依据与进度。

## 1. 为什么重构（用户裁决 + 设计诊断）

用户：绿色（汇流）节点不合理，应从头设计；内容整体 +200%，全部用 Fable 写。

诊断：v1/v2 的 converge 混了三种体裁——
- **辨析/参考**（C01 概念地图、C06 案例库）：是查阅物不是综合；
- **防御工具**（C04 诚实信号、C05 解耦）：是「怎么办」的正式内容，被塞进了尾巴；
- **真综合**（C02 七杠杆、C03 设计实验室、C07 终章）：真正的 capstone。

防御侧研究底稿极厚（research/10 = 46KB、deep/D7 = 52KB、06 后半、08），
在旧树里只有两个节点的位置——这是内容 +200% 最大的增量空间。

## 2. 树 v3 结构（58 节点）

- **ROOT** N00（不变）
- **RED 社会学谱系 13**：R01–R11 扩写 + 新 **R12 机械客观性**（Porter/Trust in
  Numbers，源 02/D1）+ 新 **R13 排名的反击：抵制、退出与多元化**（USN boycott、
  商学院五榜并存，源 01/D3）
- **BLUE 定律与形式 14**：B01–B13 扩写 + 新 **B14 良性指标的条件**（反方陈词
  steelman：Baker ρ→1、Propper、Koretz 边界，源 06/04/D2）
- **YELLOW 机器与前沿 15**：Y01–Y12 扩写 + 新 **Y13 污染取证学**（n-gram/MIA
  失败、污染悖论，源 D4）+ 新 **Y14 智能体评测前线**（SWE-bench 弧线、METR 43×、
  FrontierMath 纠缠，源 D4/D5）+ 新 **Y15 评测科学运动**（BetterBench、eval
  cards、LMArena 治理，源 D5）
- **GREEN 防御与设计 6（新分支，绿色从此=防御）**：
  - G01 诚实信号与权衡（原 C04 迁移+扩写）prereq [B12,B01]
  - G02 解耦：Deming 与 POSIWID（原 C05 迁移+扩写）prereq [B11,R09]
  - G03 留出与动态评测（held-out/Ladder/Dynabench/LiveBench/时间切分，源 D4/D7）prereq [Y02,Y03]
  - G04 多指标制衡与轮换（surrogation 缓解、多任务合同落地、Meyer 移动靶，源 06/03b/D7）prereq [B09,B07]
  - G05 抗博弈机制设计（作弊成本工程、Gibbard-Satterthwaite/Skalse 边界、METR
    评分逻辑不可见，源 06/09/D7）prereq [G01,B11]
  - G06 制度层防御（审计独立、Doing Business 改革、排名治理，源 04/D3/D7）prereq [G02,R13]
- **案例带 CASE 5（branch:"case"，中性色、虚线芯片，横向一排）**：
  - K00 案例库总览（原 C06 迁移，vault 模块保留）prereq [R01,B04]
  - K01 教育：应试与作弊（Campbell 原产地、亚特兰大、Koretz，源 04/D3）prereq [K00,B02]
  - K02 治理：目标与恐怖（NHS targets&terror、Propper、Compstat、Doing Business，源 04/D3）prereq [K00,R04]
  - K03 学术：引用的军备竞赛（JIF、引用农场、h-index，源 04/D3）prereq [K00,R10]
  - K04 市场：评分与刷单（平台评分通胀、LIBOR、信用评分博弈，源 04/D3）prereq [K00,R08]
- **CONVERGE 汇流 4（真 capstone，中性白色=与根同色）**：
  - C01 概念地图：五个近邻 prereq [R07,R08,R12]
  - C02 统一框架：七个杠杆 prereq [R01,B01,Y04]
  - C03 反 Goodhart 设计实验室 prereq [C02,G03,G05]
  - C07 你的 Eval 事后剖析（终章）prereq [C03,Y02,Y14]

**迁移**：C04→G01、C05→G02、C06→K00。旧 URL 在 nginx（docker/site.conf reactor
server 块）加 301；正文/图鉴里的旧 id 引用全部替换。C 系空出的 C04/C05/C06 不再复用。

## 3a. 写作契约 v2（2026-07-18 深夜用户裁决，覆盖 §3 的行文要求）

用户反馈第一批交付「论述不说人话/讲得过于简单」。修订如下，**对所有已写与将写的课文生效**：

1. **面向初学者/小白**：读者=聪明但零背景的朋友。每课开头 3-5 句白话导语
   （这课在说什么事、为什么值得十分钟）；术语/人名/定律首次出现给一句白话解释；
   先具体故事与例子、后理论；段落宁短勿长。
2. **前置感知写作**：只可假设读者读过 tree.json 里本课 prereqs 的内容（引用时一句话
   唤醒记忆）；引用非前置概念必须现场白话解释 + <code>节点ID</code> 链接。
   入门桥节点（R15/Y16/Y17/B17/B15/B16）就是为此新增的。
3. **考证降密度不降质量**：优先权/文献细节退到 callout（myth 卡）与 sources；
   正文主线=讲明白机制+讲好故事；每个一手数字都要带「这说明什么」的白话解读。
4. 结尾「留一个问题」+ 新增「一句话带走」（一句大白话总结本课）。
5. 节点要多：v3.1 已扩到 70 节点（+12 入门桥/案例/capstone），后续还可继续裂变。

## 3. 内容标准（+200%）

- 现有 44 课：正文从 ~600–1200 字扩到 **2000–3200 字**。扩什么：机制细节与
  一手数字（briefs/D 系里有大量没上站的）、学术脉络与优先权考证、反方与边界
  条件、与相邻节点的连接段。**不掺水：每一段都要有 briefs/D 系里的对应物。**
- 新 14 课：同标准全文。模块：能复用现有引擎（explorable/timeline/provenance/
  quiz + 各 sim）就配 config 复用；无合适引擎的先纯文（build 对缺模块有优雅
  降级），后续再补。
- 文风契约：course/CAOLIAO-VOICE.md + DESIGN-SYSTEM §8（亲和、聊哲学、冷幽默、
  硬考证打底）。callout 三型照旧：myth（讹传更正）/intuit（直觉）/applied
  （落地到 AI EVAL）。sources 块引 research 文件 + 原始文献。
- **全部由 Fable 撰写**（主线或 Fable 子代理均可；子代理必须直接读源料落盘，
  不得再拆包）。

## 4. 管线（v2 已回灌后）

```
改 content/tree.json + content/lessons/*.mjs
cd reactor-study-src/site && node build.mjs     # SITE/BASE 环境变量见 SPEC
rsync -a --delete dist/ ../../reactor-study/    # 产物目录整体替换
（保留 reactor-study/robots.txt 的 sitemap 域名——build 已按 SITE 生成，核对即可）
git commit + push → CI 自动部署
```

## 5. 进度账本

- [x] P0 回灌 v2 进 build 系统（build.mjs 模板 + theme/modules 回灌 + tree-data.js 生成）
- [x] P1 tree.json v3 + 布局（四分支+案例带）+ tokens/led 分支样式 + 三节点迁移 + 301
- [x] P2 首波部署（新树上线，新节点以「施工中」态出现）
- [x] W1 RED 扩写 R01–R06（源 11-briefs + D1）
- [x] W2 RED 扩写 R07–R11 + 新写 R12,R13
- [x] W3 BLUE 扩写 B01–B07（源 12-briefs + D2 + 03a/03b/03c）
- [x] W4 BLUE 扩写 B08–B13 + 新写 B14
- [x] W5 YELLOW 扩写 Y01–Y06（源 13-briefs + D4/D5）
- [x] W6 YELLOW 扩写 Y07–Y12 + 新写 Y13,Y14,Y15
- [x] W7 GREEN：G01,G02 迁移扩写 + 新写 G03–G06（源 10 + D7 + 06 + 08）
- [x] W8 CASE：K00 迁移 + 新写 K01–K04（源 04 + D3）
- [ ] W9 CONVERGE 扩写 C01,C02,C03,C07 + N00（源 14-briefs + 00 总纲，按契约 v2）
- [ ] W-R 可读性修订：批一交付的 24 课（R01-R06/B01-B07/Y01-Y06/K00-K04）按契约 v2 重修（白话导语/术语白话化/考证下沉/一句话带走）
- [ ] W12 v3.1 新 12 课：R14,R15,B15,B16,B17,Y16,Y17,G07,G08,K05,K06,C08（源见 tree.json sources 字段，契约 v2）
- [ ] W10 图鉴更新（术语表/讹传表补新条目）+ 全站交叉引用核对 + sitemap
- [x] W11a 互动模块复杂化·通用引擎（mod-kit 控件扩容 + explorable 预测→操作→揭示三段式 + provenance/timeline/quiz）
- [ ] W11b 互动模块复杂化·定制 sim 批一（feedback/boom-bust/musiclab/game-the-ranking/overfit/eval-overfit-lab/the-loop）
- [ ] W11c 互动模块复杂化·定制 sim 批二（goodhart4/variety/policy-invariance/overopt/winners-curse/arena/seven-levers/design-robust-eval）+ 新节点配模块
- [ ] 终检：截图审计（双主题）+ 移动端 + 部署验证

**UI 迭代备忘（2026-07-18 用户第二轮裁决，已执行）**：树总览排列放宽（ROW_H 244/COL_W 190/GUTTER 150）；
迷你树详细度分级（当前=发光框嵌标号，邻接=挂标号点）；灯带 6px+3.6s 周期；全站禁 backdrop-filter；
互动模块复杂化立项为 W11a-c。性能红线（写进 led.css/tree 注释）：无空闲 rAF、动画只动 opacity/transform、无 backdrop-filter。
