# 课程架构：REACTOR 天赋树

> 本文定义课程的知识结构——一棵非线性的天赋树，而非线性 1→100 的章节。
> 它是 `site/content/tree.json` 的权威来源。设计系统见 [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)。
> 底层研究见 research/01–10。

---

## 1. 结构总览

一个**根节点** → **三条谱系分支**（红/蓝/黄，颜色恒定编码）→ **七个汇流 capstone**。
分支内部是 DAG（有向无环图）：节点有前置依赖，但**不是一条直线**——学习者可以在
一条分支里深潜，也可以三线交替，还能走跨分支的"合金"路径（某些节点同时依赖两色）。

```
                         ┌───────────── N00 测量即干预 ─────────────┐
                         │            (ROOT · 白)                    │
        ┌────────────────┼──────────────────────┬──────────────────┐
     RED 社会学谱系      BLUE 定律与形式        YELLOW 机器与前沿
   (排名重制现实)      (指标失效的定律与定理)   (AI/ML 的代理博弈)
        │                    │                       │
     R01…R11              B01…B13                 Y01…Y12
        └──────────┬─────────┴───────────┬───────────┘
                   │   跨分支"合金"节点    │
              (Y09/Y10/Y11/Y12 各依赖两色)
                   │                      │
              ┌────┴──────── 汇流 CAPSTONE ────────┴────┐
              C01 概念地图 · C02 七杠杆 · C03 反Goodhart实验室
              C04 诚实信号 · C05 解耦(Deming/POSIWID) · C06 案例库
                          C07 你的 Eval 事后剖析（终章）
```

设计意图：
- **三分支同源异流**：都从"测量即干预"长出，却在社会学、经济学/控制论、ML 三个方向
  各自发展出一整套语言。学完任一分支都自成体系，学完三支才看见它们是同一只野兽。
- **跨分支合金**是惊喜点：performative prediction = 表演性(红) × reward hacking(黄)；
  strategic classification = 委托代理(蓝) × 过拟合(黄)；leaderboard illusion =
  马太/社会影响(红) × 污染(黄)；evaluation awareness = 霍桑(红) × reward hacking(黄)。
  这些节点的"解锁需要两色前置"在天赋树上会显示为双色连线——视觉上就讲清了"跨界"。
- **capstone 需要跨支前置**：C02 七杠杆要求三支各一，逼学习者集齐三色才能点亮
  这个"终极天赋"。C07 终章要求 C03+C04+Y02，直接落到用户自己的 eval 痛点。

---

## 2. 节点清单（权威）

字段：`id` · 标题(中/EN) · 分支 · tier(布局深度) · 前置 · 主模块 · 研究来源 · 钩子。

### ROOT
| id | 标题 | 前置 | 模块 | 源 | 钩子 |
|---|---|---|---|---|---|
| **N00** | 测量即干预 / To Measure Is To Intervene | — | `explorable:the-loop`（一张会因你观察而改变的图） | 00,02 | 你以为你在读数，其实读数在读你。 |

### RED — 社会学谱系（排名如何重新制造现实）
| id | 标题 | tier | 前置 | 主模块 | 源 | 钩子 |
|---|---|---|---|---|---|---|
| **R01** | 反应性 / Reactivity | 1 | N00 | `sandbox:game-the-ranking`（当院长，招牌） | 01 | 排名不反映现实，排名制造现实。 |
| **R02** | 自我实现预言 / Self-Fulfilling Prophecy | 1 | N00 | `sim:feedback`（预期→行为→坐实的闭环） | 01,07 | 一个假定义，如何长成真事实。 |
| **R03** | 可通约化 / Commensuration | 2 | R01 | `explorable:flatten`（把异质压成一把尺，看丢了什么） | 01,02 | 三页纸总结全美法学教育。 |
| **R04** | 规训与监视 / Discipline & Surveillance | 2 | R01 | `scrolly:panopticon`（全景敞视滚动叙事） | 01 | 为什么组织缓冲不掉排名。 |
| **R05** | 可读性 / Legibility | 2 | R02 | `explorable:seeing-like-a-state`（简化地图前后对比） | 02 | 国家为了看清你，先把你改简单。 |
| **R06** | 循环效应 / Looping Effects | 2 | R02 | `explorable:interactive-kinds`（夸克 vs 人类种类） | 02 | 分类会改变被分类的人。 |
| **R07** | 表演性 / Performativity | 3 | R03,R06 | `sim:black-scholes`（模型让自己成真/证伪的对照） | 02 | 理论不是照相机，是发动机。 |
| **R08** | 反身性 / Reflexivity (Soros) | 2 | R02 | `sim:boom-bust`（认知↔基本面双向回路） | 07 | 价格反映基本面，也塑造基本面。 |
| **R09** | 审计社会 / Audit Society | 3 | R03,R04 | `explorable:auditability`（"可审计"如何取代"好"） | 02 | 让组织可审计，本身成了目的。 |
| **R10** | 马太效应与人工市场 / Matthew & MusicLab | 2 | R02 | `sim:musiclab`（社会影响制造赢家通吃，招牌） | 06,02 | 最好的歌，命运却看运气。 |
| **R11** | 霍桑效应及其证伪 / Hawthorne & Its Debunking | 1 | N00 | `provenance:hawthorne`（通俗叙事 vs Levitt-List 重分析） | 07 | 连"反应性"的招牌案例都被夸大了。 |

### BLUE — 定律与形式（指标失效的定律与定理）
| id | 标题 | tier | 前置 | 主模块 | 源 | 钩子 |
|---|---|---|---|---|---|---|
| **B01** | Goodhart 定律 | 1 | N00 | `provenance:goodhart`（原文脚注 vs Strathern 名句考证） | 03,03a | 一条"小小脚注"如何统治了世界。 |
| **B02** | Campbell 定律 | 2 | B01 | `explorable:corruption-pressure`（决策权重↑→腐蚀↑） | 03 | 警示指标的人，本是测量的旗手。 |
| **B03** | Lucas 批判 | 2 | B01 | `sim:policy-invariance`（基于历史规律定政策→规律失效） | 03 | 你一用规律，人就改行为。 |
| **B04** | 眼镜蛇效应 / 反常激励 | 2 | B01 | `provenance:cobra`（德里传闻 vs 河内老鼠档案） | 03,04 | 悬赏捕蛇，市民开始养蛇。 |
| **B05** | McNamara 谬误 | 2 | B01 | `provenance:mcnamara`（四步引文的真正出处 Yankelovich） | 03c | 不能测量的，最后被宣布不存在。 |
| **B06** | 奖励A却指望B / Kerr 1975 | 3 | B04 | `explorable:reward-b-prime`（奖励结构与真实目标的错位） | 03c | 希望教学好，却只奖励发表。 |
| **B07** | 代理指标替代 / Surrogation | 3 | B06 | `explorable:attribute-substitution`（把指标当构念的认知替换） | 03c | 为什么当事人不觉得自己在作弊。 |
| **B08** | Goodhart 四型 / Taxonomy | 2 | B01 | `sim:goodhart4`（回归/极值/因果/对抗四型，招牌） | 03 | 同一句格言，四种完全不同的机制。 |
| **B09** | 多任务代理 / Holmström-Milgrom | 3 | B06 | `diagram:multitask`（可测任务的强激励抽走不可测任务） | 03b | 教师为什么拿固定工资——一条定理。 |
| **B10** | 绩效测量扭曲 / Baker | 4 | B09 | `sim:distortion-vs-risk`（对齐 ρ(P_e,V_e) 决定指标好坏） | 03b | 便宜、低噪、可控，仍可能是坏指标。 |
| **B11** | 必要多样性 / Ashby's Requisite Variety | 2 | B01 | `sim:variety`（简单控制器无法约束复杂系统） | 08 | 只有多样性能吸收多样性。 |
| **B12** | 委托代理与信息不对称 | 2 | B04 | `explorable:principal-agent`（谁的目标、谁的信息、谁的路径） | 06,03b | 你要好 agent，优化器只要 eval 通过。 |
| **B13** | 优化者诅咒 / Optimizer's Curse | 3 | B08 | `sim:winners-curse`（择优即高估，best-of-N 的系统性偏差） | 09 | 选中的那个，期望必然让你失望。 |

### YELLOW — 机器与前沿（AI/ML 的代理博弈）
| id | 标题 | tier | 前置 | 主模块 | 源 | 钩子 |
|---|---|---|---|---|---|---|
| **Y01** | 过拟合 / Overfitting | 1 | N00 | `sim:overfit`（Goodhart 的统计学同构） | 05,06 | 训练集就是你的 eval。 |
| **Y02** | 自适应过拟合 / Adaptive Overfitting | 2 | Y01 | `sim:eval-overfit-lab`（榜面分裂成真实/窄化/题目过拟合，招牌） | 05,09 | 你反复看同一个测试集，就已经在训练它。 |
| **Y03** | 基准污染与饱和 / Contamination & Saturation | 2 | Y01 | `timeline:saturation`（基准饱和速度史 + GSM1k 掉分） | 05 | "在测试集上预训练"就够了。 |
| **Y04** | 奖励破解 / Reward Hacking & Spec Gaming | 2 | B01 | `sandbox:reward-hack`（DeepMind 案例可玩化，招牌） | 05,09 | 划船 AI 不跑圈，原地打转刷分。 |
| **Y05** | 最近未堵策略 / Nearest Unblocked Strategy | 3 | Y04 | `sim:nus`（给 proxy 打补丁→最近的绕行捷径亮起） | 09 | 修 eval 的方式为什么总是"机械的"。 |
| **Y06** | 内对齐与 mesa 优化 / Mesa-Optimization | 3 | Y04 | `explorable:mesa`（base 目标 vs mesa 目标 vs 欺骗对齐） | 09 | 你训练出的，可能是另一个优化器。 |
| **Y07** | 奖励模型过优化 / RM Overoptimization | 3 | Y04,B08 | `sim:overopt`（Gao 抛物线：先升后降，招牌曲线） | 05 | Goodhart 定律最干净的一条实验曲线。 |
| **Y08** | 谄媚 / Sycophancy | 4 | Y07 | `sandbox:sycophancy`（对点赞信号过优化→说你爱听的） | 05,09 | 奖励"人类满意"，得到"讨好"。 |
| **Y09** | 表演性预测 / Performative Prediction | 4 | R07,Y04 | `sim:performative`（重训练收敛到"自造的世界"，合金) | 05 | 预测改变分布——反应性的数学化。 |
| **Y10** | 策略性分类 / Strategic Classification | 3 | B12,Y01 | `sandbox:strategic-clf`（被分类者按你的分类器改特征，合金） | 05,06 | 公布评分规则，人就照着改自己。 |
| **Y11** | 排行榜幻觉 / Leaderboard Illusion | 3 | Y03,R10 | `sim:arena`（best-of-N私测/采样不对称/风格分，合金招牌） | 05 | 发布即登顶，分里有多少是押题？ |
| **Y12** | 评估觉察 / Evaluation Awareness | 3 | R11,Y04 | `explorable:sandbagging`（模型察觉被测就改行为，AI霍桑，合金） | 09 | 被观察的模型，不是真实的模型。 |

### CONVERGE — 汇流 Capstone
| id | 标题 | tier | 前置 | 主模块 | 源 | 钩子 |
|---|---|---|---|---|---|---|
| **C01** | 概念地图：五个近邻 / Concept Map | 4 | R07,R08,R09 | `explorable:concept-map`（reactivity/performativity/looping/legibility/audit 辨析） | 02 | 不是一个东西的五个名字。 |
| **C02** | 统一框架：七个杠杆 / The Seven Levers | 5 | R01,B01,Y04 | `sim:seven-levers`（七拨杆→反应性强度指数，招牌） | 00 | 预测任何排名/评测的失真强度。 |
| **C03** | 反 Goodhart 设计实验室 / Anti-Goodhart Lab | 5 | B11,C02 | `sandbox:design-robust-eval`（勾防御→模拟攻击，招牌） | 06,10 | 既然指标必被博弈，怎么设计才扛得住。 |
| **C04** | 诚实信号 / Honest & Costly Signals | 4 | B12,B01 | `explorable:handicap`（昂贵信号 + Zahavi 原则的当代争议） | 10 | 难伪造的信号才诚实——但"昂贵"够吗？ |
| **C05** | 解耦 / Decoupling: Deming & POSIWID | 4 | B11,R09 | `explorable:posiwid`（系统真实目的=它实际所为；解耦度量与奖惩） | 08 | 别让 eval 分数直接驱动迭代。 |
| **C06** | 案例库 / Cross-Domain Case Vault | 3 | R01,B04 | `explorable:case-vault`（十领域案例 + 机制标注筛选器） | 04 | 从 US News 到 Doing Business 到刷单。 |
| **C07** | 你的 Eval 事后剖析 / Your Eval Postmortem | 6 | C03,C04,Y02 | `sandbox:eval-checklist`（把全课收束成 agent-eval 抗博弈清单，终章） | 05,09,10 | 你发现"eval 前后毫无区别"——这个发现比多数 eval 值钱。 |

**合计 44 节点**（1 root + 11 红 + 13 蓝 + 12 黄 + 7 汇流）。模块实例 ≥ 44，其中招牌 ~14。

---

## 3. 模块 → 引擎映射（复用最大化）

可复用引擎（一份代码多处皮肤，移植自已跑通的 5 个 Python 实验）：
- **engine `feedback`**：R02, C02 的反馈回路核心。
- **engine `goodhart4`**：B08, （B13 用其 adversarial 皮肤）。
- **engine `musiclab`**：R10, Y11（Arena 是 MusicLab + best-of-N 的组合皮肤）。
- **engine `overopt`**：Y07, Y02（过拟合是过优化的题库版皮肤）。
- **engine `select`**（择优/赢者诅咒）：B13, Y11, C03 的攻击模拟。
- **engine `treemap`**：天赋树本体（首页导航 + 每课局部图）。

定制小模块（跟着文章走，各自独立）：provenance 对照翻卡（B01/B04/B05/R11）、
scrolly 全景敞视（R04）、principal-agent 流程图（B12）、concept-map 辨析（C01）、
seven-levers 记分卡（C02）、design-robust-eval 沙盒（C03）、case-vault 筛选器（C06）、
eval-checklist 生成器（C07）等。

---

## 4. 天赋树数据结构（tree.json 形态）

```json
{
  "meta": { "title": "REACTOR", "version": "1", "accents": ["red","blue","yellow"] },
  "nodes": [
    { "id":"N00","zh":"测量即干预","en":"To Measure Is To Intervene",
      "branch":"root","tier":0,"col":0,
      "prereqs":[], "module":"explorable:the-loop",
      "sources":["00","02"], "hook":"你以为你在读数，其实读数在读你。",
      "status_default":"available" },
    { "id":"R01","zh":"反应性","en":"Reactivity","branch":"red","tier":1,"col":-3,
      "prereqs":["N00"],"module":"sandbox:game-the-ranking","sources":["01"],
      "hook":"排名不反映现实，排名制造现实。" }
    /* …其余 42 节点，字段同上… */
  ],
  "edges": [
    { "from":"N00","to":"R01","kind":"same" },
    { "from":"R07","to":"Y09","kind":"alloy" },   /* 跨分支双色连线 */
    { "from":"Y04","to":"Y09","kind":"same" }
  ]
}
```

布局：分层（tier = 纵深），三分支按 `col` 左(红)/中(蓝→黄错开)/右分布，
root 居顶，capstone 居底汇聚。`kind:"alloy"` 的边渲染成双色渐变电路线。
进度存 `localStorage`：节点 locked/available/active/completed；完成前置才解锁后继。
`prefers-reduced-motion` 时关闭通电动画，保留静态发光态。

---

## 5. 学习路径（推荐几条穿过树的"天赋 build"）

非线性，但给几条主线建议（对应不同读者）：

- **社科向（红线深潜）**：N00→R01→R03→R04→R09→C01→C05。看排名如何重制社会。
- **理论向（蓝线深潜）**：N00→B01→B08→B11→B09→B10→C04。把格言学成定理。
- **工程向（黄线深潜，用户默认路径）**：N00→Y01→Y02→Y04→Y05→Y07→Y11→C03→C07。
  直击"eval 越多越退化到 eval"，收束到抗博弈 eval 清单。
- **合金全通（三色集齐）**：交替三支 → 点亮 Y09/Y11/Y12 合金节点 → C02 七杠杆 →
  C07 终章。这是"学界顶级视野"路径：看见三支是同一只野兽。

---

## 6. 构建顺序（build order）

- **Phase A（本阶段，垂直切片验证全链路）**：设计系统 + 主题 CSS + 生成器 +
  首页天赋树 + 三色各一节完整课（N00 根 + R01「当院长」+ B01「Goodhart 考证」+
  Y02「Eval 过拟合实验室」），跑通"策划→模板→交互模块→静态页→SEO"全流程。
- **Phase B**：补齐三分支全部叶子节点 + 其余可复用引擎皮肤。
- **Phase C**：七个 capstone（含 seven-levers / design-robust-eval / eval-checklist
  三大招牌）+ atlas 附录（概念地图/术语表/参考文献接 research/01–10）+ manual 元页。
- **Phase D**：SEO/GEO 收尾（JSON-LD、sitemap、OG、无 JS fallback 审计）、
  无障碍与 reduced-motion 审计、跨主题(红/蓝/黄×亮/暗)视觉回归。

文案原则见 DESIGN-SYSTEM §8：亲和、像聊哲学、有冷幽默、硬考证打底，
每课收束到"我们正被多少失效的尺子量着"。所有文案、编排、模块创意由 Fable 负责。
