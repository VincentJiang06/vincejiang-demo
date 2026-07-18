# 汇流 Capstone 节点简报（C01–C07）

> 用途：本文件为课程"汇流/收束"环节的 7 个 capstone 节点提供可直接改写成课文的紧凑简报。
> 站在底层研究 00-SYNTHESIS 与 research/01–10 的肩上（尤以 02 概念辨析、04 案例库、06 形式理论+反方、
> 08 控制论/Deming/POSIWID、10 诚实信号+抗博弈设计为骨架），并用 2025–2026 的最新实践与一手考证补齐。
> 每节固定栏目：【核心一句】【关键出处+URL】【最有力的例子或对照】【讹传更正】【可操作要点清单】【交互模块点子】【来源URL】。
> 凡讹传/误归因/寓言一律标注。撰写日期：2026-07-18。

---

## C01 概念地图：五个近邻的精确辨析

**【核心一句】**
Reactivity / performativity / looping effects / legibility / audit culture 不是同一件事的五个名字，而是"被测对象会回望测量并据以自我重塑"这一共同内核在**五个不同分析层次**上的切片——分清它们的关键是问三件事：**谁是主体（被测者 / 理论 / 分类 / 国家 / 制度仪式）、能动方向、以及它相对 reactivity 多说了什么。**

**【关键出处+URL】**
- Espeland & Sauder, "Rankings and Reactivity," *AJS* 113(1), 2007 — https://www.journals.uchicago.edu/doi/abs/10.1086/517897 （reactivity 基准概念：self-fulfilling prophecy + commensuration 两机制）
- MacKenzie, *An Engine, Not a Camera* (MIT, 2006) + MacKenzie & Bamford, "Counterperformativity," *NLR* 113, 2018 — https://newleftreview.org/issues/ii113/articles/donald-mackenzie-alice-bamford-counterperformativity （performativity 四级：generic→effective→Barnesian→counter）
- Hacking, "Kinds of People: Moving Targets," *Proc. British Academy* 151, 2007 — https://www.thebritishacademy.ac.uk/documents/2043/pba151p285.pdf （looping effects / interactive vs indifferent kinds）
- Scott, *Seeing Like a State* (Yale, 1998) — https://en.wikipedia.org/wiki/Seeing_Like_a_State （legibility）
- Power, *The Audit Society* (Oxford, 1997) — https://academic.oup.com/book/26482 ；Strathern, *Audit Cultures* (Routledge, 2000)（audit culture）

**【对照表：五个近邻】**

| 概念 | 主体（谁在回望）| 能动方向 | 招牌机制 | 相对 reactivity 多说了什么 | 层次 |
|---|---|---|---|---|---|
| **Reactivity**（E&S）| 被测量的人/组织 | 测量 → 行为改变 → 重造世界 | 自我实现预言 + 通约化 | —（基准概念，扣住"效度/问责"）| 行动者/组织的回应 |
| **Performativity**（Callon/MacKenzie）| 理论/模型（+市场装置）| 理论 → 世界向理论收敛 | Barnesian（拉向自己）/ counter（推离自己）| 主语是**理论**不是评价性度量；关心**本体论**（经济被 economics 造出来），且自带**强度分级** | 知识/理论造世界 |
| **Looping effects**（Hacking）| 分类范畴 ↔ 被分类的人 | 双向回环 | interactive kinds 意识到被分类而改变 | 强调**类别本身**在漂移（moving target），不止个体行为；最抽象的哲学地基 | 本体论/认识论 |
| **Legibility**（Scott）| 国家/中心 | 简化测量 → 重塑世界**以便**测量 | 为看见而强制标准化（姓氏、地籍、单一树种）| 强调测量的**前提**：世界必须先被改造得可测；发生在测量**之前** | 国家/前测量 |
| **Audit culture**（Power/Strathern）| 制度/组织仪式 | 审计逻辑 → 组织围绕"可审计性"重组 | making things auditable（长出合规部门、文档系统）| 强调**可审计性取代实质**、仪式化；是 reactivity 得以大规模发生的制度土壤 | 制度场域/文化 |

记忆钩子（自上而下一条因果链）：Weber/Simmel 的**可计算性文化** → Foucault 治理术用统计**看见**人口 → Scott 的 **legibility** 为看见而简化 → **commensuration** 把质压成量 → 度量被公开周期发布成排名/审计（**audit culture**）→ 被测者作为 interactive kind 产生 **reactivity / looping / performativity** → 度量成靶被 gaming 掏空（Goodhart/Campbell）。

**【讹传更正】**
- **reactivity ≠ performativity**：E&S 在 2007 论文第 6 页**有意选择** reactivity 而非 performativity，因为 reactivity 扣住"测量效度受威胁"这一方法论议题。二者高度亲缘（self-fulfilling prophecy ≈ Barnesian performativity；自我否定预言 ≈ counterperformativity）但不同义。
- **Barnesian performativity 的经典弧线常被讲反**：Black–Scholes 模型使市场**向模型收敛**（"越来越真"）是 1976–87；1987 股灾后出现波动率微笑，模型拟合反而**变差**（counterperformativity）——是"用了反而更假"，不是一路更真。

**【可操作要点清单（辨析用决策树）】**
1. 触发物是**评价性度量**（排名/分数/指标）？→ reactivity。是一套**理论/模型**？→ performativity。
2. 改变的是**个体行为**，还是**类别本身的内容**（"什么算多动症儿童"在漂移）？后者 → looping effects。
3. 现象发生在测量**之后**（人迎合指标）还是**之前**（世界被改造得可测）？前者 reactivity，后者 legibility。
4. 组织是在追求**实质结果**，还是在追求**"看起来可被审计"**（长出合规科层）？后者 → audit culture。
5. 需要**强度分级**时，借 MacKenzie 四级（generic/effective/Barnesian/counter）——reactivity 自己没有现成分级。

**【交互模块点子】** 一个"分类器"小游戏：给出 12 张真实案例卡（如"大学建国际发表办公室""国家推行永久姓氏""ADHD 诊断标准每版扩大"），拖拽到五个概念桶里，即时反馈判定理由与层次。

**【来源URL】**
- https://www.journals.uchicago.edu/doi/abs/10.1086/517897
- https://mitpress.mit.edu/9780262633673/an-engine-not-a-camera/
- https://www.thebritishacademy.ac.uk/documents/2043/pba151p285.pdf
- https://academic.oup.com/book/26482

---

## C02 统一框架：反应性强度的七个杠杆

**【核心一句】**
把所有文献压成一条因果链（通约化→公开发布→注意力重构→期望重构→资源再分配→行为/世界重构→效度内生化），任何排名/评测的**反应性强度**都可由**七个可打分的杠杆**预测——它们共同决定"迎合指标、牺牲未测维度"这件事有多划算、有多可能。

**【关键出处+URL】**
- 00-SYNTHESIS-总纲.md §4（七杠杆的原始综合）
- Sauder & Espeland, "The Discipline of Rankings," *ASR* 74, 2009（垄断测量才有规训力）；对照组 Sauder & Espeland 2006 "Strength in Numbers"（商学院多榜并存→效应更弱）
- Ashby, *An Introduction to Cybernetics* (1956) ch.11 必要多样性 — http://pespmc1.vub.ac.be/books/IntroCyb.pdf （粗暴度/单标量的信息论下界）
- Baker, "Incentive Contracts and Performance Measurement," *JPE* 100(3), 1992 — https://www.journals.uchicago.edu/doi/abs/10.1086/261831 （可绕行通道 = P_e 与 V_e 脱钩的状态空间）

**【七杠杆操作化 + 0–3 打分尺】**

| # | 杠杆 | 操作化问题 | 0（弱）| 3（强）| 现实类比 |
|---|---|---|---|---|---|
| 1 | **垄断度** | 该对象被几套**独立**排名覆盖？| ≥4 套并存、互相消解 | 唯一权威榜 | USN 法学院（唯一，3）vs 商学院（5 榜并存，≈1）|
| 2 | **利害绑定** | 指标是否硬编码进钱/生死/发布？| 纯信息、无强制后果 | 直接锁定预算/录取/融资/监管资本 | 信用评级被写进 Basel 资本要求（3）vs 宜居城市榜（1）|
| 3 | **可通约化的粗暴度** | 输出形态是全序名次、分层、还是多维仪表盘？| 多维仪表盘/不排序 | 单标量全序名次 | 全国第 N 名（3）vs 卫生评级 A/B/C 三档（1）|
| 4 | **发布节律** | 多久发布一次、是否实时？| 一次性/多年一次 | 连续实时天梯 | LMArena 实时 Elo（3）vs 十年一次评估（0–1）|
| 5 | **零和性** | 是相对排名还是绝对达标？| 绝对阈值，人人可同时达标 | 名次固定、你升我必降 | 官员 GDP 晋升锦标赛（3）vs 餐厅卫生分（1）|
| 6 | **可绕行通道** | 指标与真目标之间因果链多长、旁路多少？| 端到端、结果客观可验、无旁路 | 长因果链、可自报、可重分类 | USN 靠自报数据、可重分类（3）vs 真跑通的代码测试（0–1）|
| 7 | **被测者反身能力** | 被测者会逆向工程公式、本身是优化器吗？| 被动、无力逆向工程 | 专职逆向工程/本身即优化器 | 模型厂商 benchmaxxing（3）；法学院院长逆向工程 USN（3）|

**【最有力的例子或对照（打分示例）】**

| 系统 | 1垄断 | 2利害 | 3粗暴 | 4节律 | 5零和 | 6绕行 | 7反身 | 合计/21 | 判读 |
|---|---|---|---|---|---|---|---|---|---|
| USN 法学院排名 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | **21** | 几乎不可缓冲（E&S 的紧耦合样本）|
| 商学院排名（多榜）| 1 | 2 | 3 | 2 | 3 | 3 | 3 | 17 | 效应显著更弱（多榜互相消解）|
| Chatbot Arena / LMArena | 2 | 3 | 3 | 3 | 3 | 2 | 3 | **19** | Goodhart 化以**月**为单位发作（被测者即优化器）|
| 餐厅卫生评级卡（Jin-Leslie 2003）| 2 | 1 | 1 | 1 | 1 | 1 | 0 | 7 | **良性反应性**：真实卫生改善、无军备竞赛 |

推论（三条非显然结论，值得写进课文）：
- **反应性可以提高测量效度，同时摧毁测量价值**——自我实现通道让排名"变准"，但它测的已是自己造出来的世界。"准"≠"好"。
- **改良指标 ≠ 消除反应性**：指标修订本身也是被博弈对象（USN 每年微调、Arena 上了 style control 后厂商就优化残差）。指标与被测者**共同演化**。
- **最危险的不是坏指标，而是"够好"的指标**：相关性高的代理获得信任→获得利害绑定→在强优化下失效（Gao 过优化曲线先升后降）。

**【讹传更正】**
- 杠杆 7 常被低估：AI 评测的 Goodhart 化比大学排名快**一个数量级**，正因为**被测者本身就是优化器**，而非因为"AI 更会作弊"。这是结构差异，不是道德差异。
- 杠杆 1 的因果方向：是**垄断**的测量才有规训力，不是"排名天生有规训力"——多元测量互相消解（E&S 对照组的核心证据），这一条常被漏掉。

**【可操作要点清单】**
1. 拿到任一新排名/评测，先逐项打 0–3 分，合计 ≥15 视为高反应性、需主动设防。
2. **能砍哪个杠杆就砍哪个**：多引入一套独立榜（降 1）、松开硬后果（降 2）、改全序为多维仪表盘（降 3）、拉长发布周期（降 4）、改相对名次为绝对达标（降 5）、缩短可绕行通道/要求端到端客观验证（降 6）。
3. 杠杆 6、7 是抗博弈设计的主战场（详见 C03）；杠杆 1–5 多为治理/制度选择。
4. 打分是**相对**工具（跨系统比较、追踪同一系统随时间的漂移），不是绝对真值——这本身呼应"综合指数内在任意"（Saisana et al. 2005），报告时应给区间。

**【交互模块点子】** 七个滑杆（每杠杆 0–3）联动一个"反应性温度计"，学生拖动即时看到合计分与预测的失效模式（gaming / 造假 / 俘获），并可载入 USN、Arena、PISA 等预设档位对照。

**【来源URL】**
- https://www.journals.uchicago.edu/doi/abs/10.1086/517897
- http://pespmc1.vub.ac.be/books/IntroCyb.pdf
- https://www.journals.uchicago.edu/doi/abs/10.1086/261831
- https://academic.oup.com/qje/article-abstract/118/2/409/1899578 （Jin & Leslie 卫生评级卡良性反应性）

---

## C03 反 Goodhart 设计实验室：抗博弈手段全清单

**【核心一句】**
没有绝对不可博弈的指标，只有"让说谎比说真话贵得多"的评估；抗博弈设计的真正对象不是"指标"而是**博弈的成本结构**——让正确者便宜、让投机者昂贵、让裁判担责、让规则不可完全预知、让判决不外包给单一数字。

**【关键出处+URL】**
- Bevan & Hood, "What's Measured Is What Matters," *Public Administration* 84(3), 2006 — https://eprints.lse.ac.uk/16211/ （gaming 三型 + synecdoche）
- Carter, "Performance indicators: backseat driving or hands-off control?," *Policy & Politics* 17(2), 1989（tin openers vs dials）— https://andifugard.info/tin-openers-versus-dials/
- Manheim & Garrabrant, "Categorizing Variants of Goodhart's Law," arXiv:1803.04585 — https://arxiv.org/abs/1803.04585 （四型：Regressional/Extremal/Causal/Adversarial）
- Advani et al., "The Dynamic Effects of Tax Audits," *REStat* 105(3), 2023；"Tax Audits as Scarecrows," NBER WP 23631 — https://www.nber.org/system/files/working_papers/w23631 （随机审计的"稻草人"威慑）
- Dwork et al., "The reusable holdout," *Science* 349:636, 2015；Blum & Hardt, "The Ladder," arXiv:1502.04585（holdout 定价 / 抗适应性过拟合）

**【七种手段：为什么有效 + 适用条件 + 局限】**

| 手段 | 为什么有效 | 适用条件 | 局限 |
|---|---|---|---|
| **① held-out / 私有集** | 博弈需先知道优化什么；从不公开的私有集使定向过拟合无处着力 | 有能力维护一个从不进任何训练/调参回路的隔离集；出题方与被测方无资金/数据纠缠 | 牺牲透明度与可申诉性；一旦泄漏即失效（SWE-bench Verified 被弃用即因 solution leakage 达 ~32.7%）|
| **② 动态 / 定期刷新 / 轮换** | 缩短任一指标"被摸透"的窗口，对抗 Spence 式稀释与 Adversarial Goodhart | 题目可持续再生（时序抓取、按发布日期切分，如 LiveBench 每月换 ~1/6、LiveCodeBench 只用训练截止后的题）| 纵向可比性下降、认知负担上升、造新题有成本 |
| **③ 配对 / counterbalanced 指标** | 为每个可单独优化的指标配一个"若走捷径就恶化"的对立指标，使只博弈一端立刻在另一端暴露；抬高"要骗就得同时骗多维"的边际成本 | 能选出**真正正交、作弊手段不相通**的对立面（速度↔复诊率；成功率↔有害副作用/资源消耗/幻觉率）| 若两指标被同一种作弊同时拉高，制衡失效；只压制部分 Regressional/Adversarial |
| **④ tin openers 而非 dials** | 在指标与后果之间插入一层**人的追问**，斩断"数字→自动奖惩"的机械链，使操纵单一数字的期望收益骤降 | 有能力做人工深挖；组织接受"异常即调查"而非"异常即结算" | 慢、贵、需专业判断；不适合需即时自动决策的高频场景 |
| **⑤ 随机 / 突击审计** | 把"被抓概率"从零抬到正值；威慑远超实际抽查频率（稻草人效应），仅可信的审计信号即显著提升合规 | 审计需**可信且不可预测**；有能力对最易博弈的接缝抽样人审 | 抽样偏差；对"系统性造假者"需配合追责才够；公平性质疑 |
| **⑥ 保持指标（部分）秘密** | 不公布确切评分函数与权重，被评者无法针对性过拟合（同"提高攻击者侦察成本"）| 折中做法：**公开评估维度与方法论，但保密具体测试项与权重** | 与透明度/问责冲突；违反"评估者也要对指标负责"（Leiden Manifesto）|
| **⑦ 解耦度量与奖惩** | 度量只用于**诊断系统**（区分噪声与信号），不直接接进优化/晋级回路，从根上不让 eval 变成被优化目标 | 制度上能把"评估"与"优化/发布决策"分家；接受 eval 只是不确定估计 | 需组织纪律；见 C05 的完整处方 |

**【最有力的例子或对照】**
"抗污染基准"的产业弧线 = 抗博弈设计的活教材：**SWE-bench（2023 原版）→ Verified（2024 人审 500 题）→ 2026-02 OpenAI 停用**（审计发现最难 138 题中 59% 有实质缺陷、~32.7% 成功补丁存在 solution leakage、模型逐词复现 gold patch 属记忆）**→ SWE-bench Pro**（含私有 GPL/商业代码库的 held-out 层）。同一逻辑贯穿 ①②⑦——**benchmark 被优化到失去区分度，只能不断另造抗污染新版**。（来源：research/05；OpenAI *Why we no longer evaluate SWE-bench Verified*, 2026）

**【讹传更正】**
- **"Goodhart 定律 = Campbell 定律，可互换"——不准确**。Campbell (1976/1979) 独立提出、**时间更早**、且直接锁定"社会指标 + 决策压力 → 腐蚀"，比 Goodhart 的货币语境更贴近绩效博弈。
- **"眼镜蛇效应是史实"——讹传**。"cobra effect"由 Horst Siebert 约 2001 年造词，德里悬赏死蛇的故事无当代史料（apocryphal）；讲抗博弈时应改用**有史料的河内老鼠悬赏 1902**（Michael Vann：交鼠尾领赏→出现无尾活鼠与养鼠场）。
- **配对指标不是"多加几个 KPI"**：关键在对立指标必须**正交且作弊手段不相通**，否则是伪制衡。

**【可操作要点清单】**
1. **held-out + 动态**：留一份从不公开、从不进任何优化回路的私有集；主池滚动刷新并记录每套题"服役时长"，到期轮换。
2. **配对制衡**：每个能力指标配一个"走捷径就恶化"的对立指标（如任务成功率↔有害副作用率/资源消耗/幻觉率），并**预先写明"作弊本指标会在哪个配对项暴露"**。
3. **tin opener 化**：异常高分**触发人工深挖**而非自动放行；建立"红旗即调查"流程。
4. **随机人审 + 稻草人威慑**：对最易博弈的接缝做不可预测抽样人审，不必审全部。
5. **秘密的正确用法**：公开维度与方法论、保密具体测试项与权重。
6. **解耦**：优化只能看训练/验证集，最终评估集对优化过程完全不可见（见 C05、C07）。
7. **元层运营**：预算每个公开 eval 的半衰期；via negativa——先删已被平凡博弈的旧 eval，而非无限堆新；像安全披露一样维护"已知绕过手段"清单。

**【交互模块点子】** "红队沙盒"：学生扮演被测者，面对一套可切换防护（关/开 held-out、配对、随机审计…）的评估去尝试刷分，实时显示"表面分 vs 真实分"的裂口如何随每道防护开启而收窄。

**【来源URL】**
- https://eprints.lse.ac.uk/16211/
- https://arxiv.org/abs/1803.04585
- https://www.nber.org/system/files/working_papers/w23631
- https://scale.com/blog/swe-bench-pro

---

## C04 诚实信号：为什么诚实不来自"贵"，而来自"对说谎者才贵"

**【核心一句】**
诚实信号的正确内核**不是**"越浪费越可信"，而是**"作弊的边际成本必须随质量下降而急剧上升"**（cost differential / 差异性成本）——你要设计的不是"贵"的评估，而是"对不合格者伪造起来边际成本极高、对合格者反而便宜"的评估。

**【关键出处+URL】**
- Zahavi, "Mate selection—A selection for a handicap," *J. Theor. Biol.* 53(1), 1975 — https://www.sciencedirect.com/science/article/abs/pii/0022519375901113 （障碍原则原始直觉：浪费即担保）
- Grafen, "Biological signals as handicaps," *J. Theor. Biol.* 144(4), 1990 — https://users.ox.ac.uk/~grafen/cv/hcapsig.pdf （ESS 诚实信号均衡的数学证明）
- Penn & Számadó, "The Handicap Principle: how an erroneous hypothesis became a scientific principle," *Biological Reviews* 95(1), 2020 — https://onlinelibrary.wiley.com/doi/full/10.1111/brv.12563 （当代关键质疑）
- Számadó, Zachar & Penn, "General signalling theory: why honest signals are explained by trade-offs rather than costs or handicaps," *J. Evol. Biol.* 39(2), 2025 — https://academic.oup.com/jeb/article/39/2/171/8362708 （最新综合：trade-off 而非 cost）
- Spence, "Job Market Signaling," *QJE* 87(3), 1973 — https://www.sfu.ca/~allen/Spence.pdf ；Taleb, *Skin in the Game* (2018) — https://en.wikipedia.org/wiki/Skin_in_the_Game_(book)

**【最有力的例子或对照（三幕争议史，讲清楚就够了）】**
- **第一幕（被否定）**：Zahavi 的孔雀尾巴直觉在 1970–80s 被主流否证——Kirkpatrick 1986 论文标题就是"The handicap mechanism of sexual selection does not work"；替代解释是 Fisher 失控选择（不必诚实，只需自我强化偏好）。
- **第二幕（被平反）**：Grafen 1990 构造 ESS 模型，证明只要（i）信号有成本、（ii）**同强度下低质量者边际成本更高**、（iii）接收者的反应对信号者有利，则"按真实质量投资"演化稳定；Maynard Smith 随后转而支持。教科书叙事定型为"数学证明了直觉"。
- **第三幕（再质疑——本节的题眼）**：Számadó 2011 + Penn & Számadó 2020 指出，维持诚实的**不是均衡上实付的成本，而是"作弊的潜在/边际成本"**；诚实均衡上信号者甚至可以只付接近零的实现成本（区分 Getty 的 efficacy cost 与 strategic cost，后者可为零）。结论："Grafen 的模型支持的是 Zahavi 的**第二假说**——**condition-dependent signalling**（按自身状态调节投资）——而非严格障碍原则。"原文：**"it is time to usher the handicap principle off to an honourable retirement."** 2025 年 Számadó–Zachar–Penn 进一步收束为一句可直接板书的话：**"signals are honest, not because they are costly (handicaps), but because cheating (deception) is costly."**

同构映射（把生物学翻成经济学与工程学，capstone 的价值所在）：
- **Spence 分离均衡**：教育即便不提高生产率，只要"受教育成本与能力负相关"（高能力者更省力），就能成为可信信号——**支柱同样是成本与被信号品质负相关**，而非信号内容有实质产出。
- **Taleb skin in the game**：把"作弊/错判的代价"对称地加到**行动者/评估者**身上——谁享受正确的果实，谁就得吃错误的苦；无 skin in the game 的裁判是系统性偏差源。

**【讹传更正】**
- **"Grafen (1990) 证明了 Zahavi 障碍原则（浪费即诚实）是对的"——不准确**。Grafen 证明的是 **condition-dependent 诚实信号可为 ESS**（Zahavi 第二假说）；严格"障碍/浪费即诚实"缺乏理论与经验支持，2020/2025 年主张其"体面退休"。
- **"诚实来自成本的绝对高度"——错**。来自成本的**差异性**（对说谎者才贵）。纯 handicap（提高所有人的成本）既低效又未必诚实。
- **"教育回报几乎全是信号"（Caplan）——过强**。经济学界认为教育兼含人力资本与信号成分，sheepskin effect 可部分由"完成度阈值"解释；Caplan 的高信号占比估计有争议。
- **"Lindy 效应是 Taleb 首创"——讹传**。源自 Albert Goldman 1964，经 Mandelbrot 形式化，Taleb 仅推广命名。

**【可操作要点清单】**
1. 设计任一筛选/评估时，先问：**"对不合格者，伪造这个信号的边际成本是否远高于对合格者？"** 若否，这不是诚实信号。
2. 优先选**对合格者便宜、对不合格者昂贵**的任务：端到端、需真实执行、结果客观可验（"记住答案"无法得分）。
3. 不要靠"提高所有人的门槛"制造诚实（纯 handicap 低效）；要制造**成本差异**（cost differential）。
4. 预算信号的**通胀/稀释**：任何信号被广泛采用并优化后会像文凭一样贬值，必须预算衰减速率并持续更新（连 C03 的轮换）。
5. 把 skin in the game 加到**评估者**身上：放行某系统的评估团队须为其真实部署失败负责；评估集若被证明可平凡绕过，追责到评估设计者。

**【交互模块点子】** "伪造成本"双滑杆：分别设定合格者与不合格者的伪造边际成本，实时画出两条成本曲线与分离均衡是否存在——直观展示"只有当红线（差者）远陡于绿线（好者）时，信号才诚实"。

**【来源URL】**
- https://onlinelibrary.wiley.com/doi/full/10.1111/brv.12563
- https://academic.oup.com/jeb/article/39/2/171/8362708
- https://users.ox.ac.uk/~grafen/cv/hcapsig.pdf
- https://www.sfu.ca/~allen/Spence.pdf

---

## C05 解耦：度量用于诊断系统，不用于直接驱动优化

**【核心一句】**
从 Deming 到 Beer 到 Bevan-Hood，同一条处方被反复开出——**把"度量"与"激励/奖惩/优化"在制度上解耦**：度量的正当功能是**理解系统、区分噪声与信号**（tin opener），而非给个体排名、驱动优化（dial）；一旦把 proxy 当 dial 去用力优化，金标准必过峰而降。

**【关键出处+URL】**
- Deming, *Out of the Crisis* (MIT CAES, 1986)：第 11 点废除数字定额/MBO、第 8 点驱除恐惧、七大致命病；p.121 的 Nelson 引语 — https://deming.org/explore/fourteen-points/ ；红珠实验 https://deming.org/explore/red-bead-experiment/
- Beer, *The Heart of Enterprise* (Wiley, 1979)；POSIWID 的 verbatim 锚点：Beer 2001 Valladolid 演讲 — https://en.wikipedia.org/wiki/The_purpose_of_a_system_is_what_it_does
- Kelly, "The Shirky Principle," *The Technium*, 2010 — https://kk.org/thetechnium/the-shirky-prin/
- Carter, Klein & Day, *How Organisations Measure Success* (Routledge, 1992)（tin openers vs dials）
- Gao, Schulman & Hilton, "Scaling Laws for Reward Model Overoptimization," arXiv:2210.10760 — https://arxiv.org/abs/2210.10760 （proxy 分升、金分先升后降）

**【最有力的例子或对照】**
**红珠实验（Red Bead Experiment）**——对"排名反应性"最古老、最优雅的反证：工人用带 50 孔的木铲从含 ~20% 红珠（次品）的容器舀珠，红珠数**纯由抽样（系统）决定**，工人再努力也控不了；可管理层照例每天评出"最佳/最差员工"、表扬训诫甚至解雇。教训：**当结果由系统决定时，任何基于排名的激励都只是在奖惩运气**——要改产出只能改系统（换掉红珠），不能改人。
**漏斗实验（Funnel）**补一刀：把 common-cause 噪声误当 special-cause 信号去逐次纠偏（tampering）会**放大**方差——直接预警"用每次 eval 分数的抖动去即时调优，几乎必然放大真实性能的方差"。

**【讹传更正（本节的重头，四处必标）】**
1. **"最重要的数字不可测量"——半讹**。Deming 确实写过 *"The most important figures are unknown and unknowable"*，但他**明确把这个 opinion 归给挚友 Lloyd S. Nelson**（Nashua 统计方法主管）；一手锚点 *Out of the Crisis* **p.121**。正确引法："Nelson, quoted in Deming (1986, p.121)"。
2. **"You can't manage what you can't measure"（不能度量就不能管理）——严重讹传/张冠李戴**。常被误安给 Deming（或 Drucker）。Deming **立场完全相反**：他把"只靠可见数字管理、几乎不考虑未知/不可知的数字"列为**七大致命病之一**。
3. **POSIWID（"the purpose of a system is what it does"）**——洞见与命名归 **Stafford Beer**，但**勿指定为某书某页的 verbatim**；最稳 verbatim 锚点是 **Beer 2001 Valladolid 演讲**（"According to the cybernetician, the purpose of a system is what it does. This is a basic dictum."），书面通常指 *The Heart of Enterprise* (1979)。**缩略词 POSIWID 本身的流行是后世系统思考社群之功，非 Beer**。误用警告：POSIWID 是**诊断性提问**（"输出与宣称为何背离？"），不是**把任何讨厌的副作用读成"有人蓄意为之"的阴谋论许可证**。
4. **Shirky 原则（"Institutions will try to preserve the problem to which they are the solution."）**——**措辞与命名属 Kevin Kelly (2010, The Technium)**，思想源自 Clay Shirky；不宜当作 Shirky 直接原话引用。
5. **（附带）Ashby 必要多样性**："only variety can **absorb** variety" 中的 absorb 是 **Beer 的管理学化改写**；Ashby 1956 原文是 "only variety can **destroy** variety"。

**【可操作要点清单（解耦的处方）】**
1. **eval 只诊断、不直接驱动优化**：优化(训练/调参/选型)只能看训练/验证集，最终评估集对优化过程**完全不可见**（严格 train/test 分离 + 私有 held-out）。任何"拿最终 eval 反复调"都会把 eval 变成被优化目标。
2. **度量当 tin opener**：异常分触发对失败模式的追问与系统诊断，而非自动接进 RLHF 奖励/发布撤回/排行榜竞赛。
3. **区分 common-cause 与 special-cause**：不要对分数抖动逐次 tampering（漏斗实验），也不要把系统级变异奖惩到个体/模型头上（红珠实验）。
4. **驱除恐惧**：eval 与高利害（融资、发布、排名羞辱）强绑定会把"老实做 eval 的团队"推成"reactive gamers"——gaming 是制度在恐惧下的必然产物，去锦标赛化/匿名化/事后审计化。
5. **用 POSIWID 自检 eval 体系**：不看它宣称测什么，看它**稳定产出**什么——若某套 eval 稳定产出更长、更谄媚、更爱堆 emoji 的模型，那它的 de facto purpose 就包含"生产冗长与谄媚"。
6. **警惕 Shirky 化**：以"修理 eval 病理"为存在理由的评测/审计机构，其身份依赖病理持续存在——须定期轮换、外部独立、对自身指标也施加 tin-opener 质询。

**【交互模块点子】** "红珠工厂"网页小实验：学生点击"舀珠"若干轮，系统随机产出红珠数并自动生成"员工排行榜+奖惩"，几轮后揭示所有波动都是 common-cause 噪声——亲手体会"给运气排名"的荒谬。

**【来源URL】**
- https://deming.org/unknown-and-unknowable-data/
- https://en.wikipedia.org/wiki/The_purpose_of_a_system_is_what_it_does
- https://kk.org/thetechnium/the-shirky-prin/
- https://arxiv.org/abs/2210.10760

---

## C06 案例库：15 张可筛选案例卡（含机制标注）

**【核心一句】**
把跨领域案例并置，反应性是一条从"温和适应"到"公然俘获"的**光谱**——**后果越硬，反应越烈**：当排名被硬编码进强制后果（监管资本、官员晋升、增资谈判），反应性就从适应升级为造假乃至俘获。

**【关键出处+URL】**
- research/04-cases-across-domains.md（110+ 来源的跨领域案例库主档）
- Espeland & Sauder 2007 *AJS* 113(1)；Bevan & Hood 2006 *Public Administration* 84(3)
- Dranove, Kessler, McClellan & Satterthwaite, "Is More Information Better?" *JPE* 111(3), 2003 — https://ideas.repec.org/a/ucp/jpolec/v111y2003i3p555-588.html
- Luca, "Reviews, Reputation, and Revenue: The Case of Yelp.com," HBS WP 12-016 — https://www.hbs.edu/ris/Publication%20Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf

**【15 张卡片（领域 · 机制标注 · 一句话 · 来源）】**

| # | 案例 | 领域 | 机制标注 | 一句话 | 来源 |
|---|---|---|---|---|---|
| 1 | **US News 自报数据造假（总）** | 大学 | 规则套利+直接造假+集体退出 | 高度依赖高校自我申报，天然激励从"重分类"到"伪造"的完整反应性光谱 | research/04 §1A |
| 2 | **Columbia / Thaddeus** | 大学 | 定义套利+吹哨引发被动退出 | 数学教授 Thaddeus 2022 万字自查揭排名冲到全美第 2 的数据矛盾（班级规模、师生比、把 12 亿医疗开支计入教学），校方承认"过时/不正确方法论"，降至第 18 | https://www.math.columbia.edu/~thaddeus/ranking/investigation.html |
| 3 | **Temple / Porat（刑事定罪）** | 大学 | 直接造假→**联邦刑事** | 前院长指使把在线 MBA"100% 提交标化成绩"（实为 19.6%）连续四年刷到全美第 1；2022 判 14 个月监禁——排名史唯一刑事定罪 | https://www.justice.gov/usao-edpa/pr/former-temple-business-school-dean-convicted-fraud |
| 4 | **世行 Doing Business** | 国家 | **测量俘获**+资源再分配 | 中国 DB2018 从第 85 位被高层施压改回第 78；2021 永久停刊——国家级反应性极端形态：合谋俘获测量工具本身 | https://www.worldbank.org/en/news/statement/2021/09/16/world-bank-group-to-discontinue-doing-business-report |
| 5 | **Wells Fargo 假账户** | 银行 | 目标替换+直接造假（销售定额）| "cross-sell/八个才叫棒"定额压力（2002–2016）致员工偷开数百万未授权账户；2016 CFPB 认定约 200 万、2017 复核上修至约 350 万；2020 DOJ/SEC 以 **30 亿美元**和解 | https://www.justice.gov/opa/pr/wells-fargo-agrees-pay-3-billion-resolve-criminal-and-civil-investigations-sales-practices |
| 6 | **外科医生避重症** | 医疗 | 选择效应/cream-skimming | NY/PA 公开 CABG 死亡率成绩单后，63% 心外科医生更不愿为重症开刀；Dranove 2003 证净效果是"更高消耗+更差结果，尤其重症者"——短期内降低患者福利 | https://ideas.repec.org/a/ucp/jpolec/v111y2003i3p555-588.html |
| 7 | **米其林星级（Bras/Loiseau）** | 餐饮 | 表演性压力/目标替换 | Sébastien Bras 2017 主动"退星"求解脱，米其林 2019 未经其申请又强行纳入；Loiseau 2003 在降级传闻+债务+抑郁下自杀——评级体系不给退出自由 | https://www.cnn.com/travel/article/french-chef-sebastien-bras-michelin-stars/index.html |
| 8 | **Yelp / Luca** | 消费评分 | 自我实现预言（因果）| 回归断点识别：星级每升一星、独立餐厅营收升 **5%–9%**（连锁不受影响）——评分本身直接驱动需求 | https://www.hbs.edu/ris/Publication%20Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf |
| 9 | **刷单 / Fake reviews** | 电商 | 直接造假/刷分 | Luca & Zervas：约 16% Yelp 评论被标可疑，声誉薄弱/竞争激烈者更易造假；中国刷单成灰产链；2024 FTC《虚假评论最终规则》全面封堵 | https://pubsonline.informs.org/doi/abs/10.1287/mnsc.2015.2304 |
| 10 | **河内老鼠悬赏（1902）** | 公共政策 | 反常激励（有史料版）| 交鼠尾领赏→出现无尾活鼠与专门养鼠场——**应替代无史料的"德里眼镜蛇"来讲反常激励** | https://en.wikipedia.org/wiki/Perverse_incentive |
| 11 | **NHS targets（英国）** | 医疗/公共管理 | gaming 三型（棘轮/阈值/产出扭曲）| Bevan & Hood 把"targets and terror"祛魅为斯大林式指标游戏；但 Propper 2008 又证候诊时间**真的降了**——反方必须同时讲 | https://eprints.lse.ac.uk/16211/ |
| 12 | **苏联钉子厂（寓言）** | 计划经济 | 通约化粗暴度（按重量 vs 按数量）| 按吨位考核→造一根巨钉；按个数考核→造无数小钉——**教学寓言，非史实**（见讹传更正）| https://en.wikipedia.org/wiki/Perverse_incentive |
| 13 | **信用评级 AAA（2008）** | 金融 | 表演性测量+利益冲突 | issuer-pays 下把次贷证券评 AAA；到 2010 年 Moody's 2006 年 AAA 按揭证券 73% 被降为垃圾级；AAA 符号本身**制造了市场**（监管硬编码）| https://fcic-static.law.stanford.edu/cdn_media/fcic-reports/fcic_final_report_conclusions.pdf |
| 14 | **沙特买"高被引学者"挂名** | 科研排名 | 规则套利→直接造假→榜方修补 | KAU 等付 ~$72k/年请高被引学者挂第二附属机构；ARWU 2014 起不再计第二机构，Clarivate 事后剔除整个数学领域 | https://arxiv.org/pdf/1407.2037 |
| 15 | **中国 GDP"挤水分"** | 城市/国家 | 晋升锦标赛+直接造假 | 辽宁承认 2011–14 财政虚增≥20%、天津滨海 2016 GDP 从 1 万亿降至 6650 亿——GDP 绑定官员晋升排名→层层注水 | https://www.caixinglobal.com/2017-01-18/liaoning-government-admits-false-growth-data-from-2011-14-101046468.html |

**【贯穿全表四条规律】** ① 后果越硬，反应越烈（硬编码→造假→俘获）；② 自我申报＝造假温床；③ Goodhart 普适（观看时长、影响因子、师生比一旦承载后果就与真实质量脱钩）；④ 测量方并非无辜旁观者（QS 卖咨询、米其林拒绝让主厨退出、Clarivate 事后剔除、USN 迫于抵制改方法论——出榜方与被排名者共处同一反应性回路）。

**【讹传更正】**
- **苏联钉子厂是寓言，非史实**：常追溯到 Krokodil 杂志 1957 年一幅漫画，但该漫画"可能是杜撰的"（描述出自经济学家 Alec Nove，无人能指出确切出处）。机制（吨位 vs 个数的 Goodhart）是真的，**但不可当作已证实的历史事件引用**——与"德里眼镜蛇"同属寓言级证据。
- **河内老鼠 ✅ vs 德里眼镜蛇 ❌**：讲反常激励用**有史料的河内案例**（Michael Vann 研究），不用无史料的眼镜蛇。
- Wells Fargo 账户数以官方口径为准（2016 CFPB ~200 万、2017 复核 ~350 万），媒体常混用；Doing Business 中"Kim/Djankov 下令"部分属 WilmerHale 的调查推论（"likely"），当事人否认，引用宜标明。

**【可操作要点清单】** 每张卡建议编码三个可筛选维度：**领域**（大学/国家/医疗/金融/消费/科研/公共管理）× **机制**（资源再分配→表演性→规则套利→选择效应→直接造假→测量俘获→集体退出）× **反应性强度**（温和/中/强/极强/反向）。授课时按"强度递增"或"机制同类"两种排序切换。

**【交互模块点子】** 可筛选卡片墙：三个下拉（领域/机制/强度）即时过滤 15 张卡，点开每卡展开细节与来源，并高亮它在 C02 七杠杆上的打分雷达图。

**【来源URL】**
- https://www.math.columbia.edu/~thaddeus/ranking/investigation.html
- https://www.justice.gov/usao-edpa/pr/former-temple-business-school-dean-convicted-fraud
- https://www.worldbank.org/en/news/statement/2021/09/16/world-bank-group-to-discontinue-doing-business-report
- https://www.hbs.edu/ris/Publication%20Files/12-016_a7e4a5a2-03f9-490d-b093-8f951238dba2.pdf

---

## C07 你的 Eval 事后剖析：agent/skill 抗博弈 eval checklist

**【核心一句】**
"eval 越多，AI 越退化到 eval"成立、但是**条件版**——退化速率 ∝ 单一 eval 上的优化压力 × 容量约束紧度 × eval 与真实任务的错配度，且虚高可精确分解为**窄化 + 题目过拟合 + 真实挤占**三成分，三者对策完全不同；抗博弈 eval = held-out+动态 × 配对制衡+客观可执行 × eval 与优化解耦 × 评估者有 skin in the game × 随机人审+结构化裁量。

**【关键出处+URL】**
- research/05-ai-evals-reactivity.md（arXiv 全核验）；experiments/exp4（虚高三成分分解）
- Gao et al. 2023 过优化标度律 arXiv:2210.10760；Skalse et al. 2022 不可玩性 arXiv:2209.13085；Zhuang & Hadfield-Menell 2020 arXiv:2102.03896（不完整代理必致效用任意低）
- Singh et al. 2025, "The Leaderboard Illusion," arXiv:2504.20879 — https://arxiv.org/abs/2504.20879
- METR, "Guidelines for capability elicitation," 2024 — https://metr.org/blog/2024-03-15-guidelines-for-capability-elicitation/ ；"Self-Preference Bias in LLM-as-a-Judge," arXiv:2410.21819

**【最有力的例子或对照：exp4 的虚高三成分分解（capstone 的量化骨架）】**
固定题库跑 300 代，榜面涨分 5.49 = 真实 0.33 + 窄化 2.53 + 题目过拟合 2.64 —— **94% 是幻觉**；且零和容量下未测能力真实**变负**（真实挤占）；换新题时真实能力反而最高且零虚高。三成分及其对策：

| 成分 | 含义 | 是否合法 | 对策 |
|---|---|---|---|
| **窄化（narrowing）** | 只练被测的那 10% 维度，合法但片面 | 合法但片面 | **扩大覆盖面**：多维、异质、互不相关的 eval 组合（逼近 requisite variety）|
| **题目过拟合（overfitting）** | 纯虚假：记住具体题，换题归零 | 纯虚假 | **换题 / held-out / 动态刷新** + 污染审计 |
| **真实挤占（crowding-out）** | 仅当容量零和时：未测维度绝对下降 | 有害 | **承认容量约束、降低单一指标的优化压力**（解耦，见 C05）|

对照锚点：Gao 过优化曲线（proxy 升、gold 先升后降）证成分总量会过峰；Recht et al. 2019 发现十年 ImageNet 迭代后**排名仍稳**、适应性过拟合弱于预期——限定了退化的形状（整体虚高、序关系较稳）；GSM1k 发现**前沿模型基本不掉分**——退化主要发生在"优化压力/容量比"高的场景（小模型硬刷分）。

**【讹传更正】**
- **"eval 越多越退化"不是无条件定律**：若"越多"指"同一个 eval 被反复透支"→退化严重（Dwork 的 holdout 预算账本）；若指"不断有更多、更多样、抗污染的新 eval"→反而是**对冲**退化。
- **"换题就万事大吉"——错**：换题只治**题目过拟合**这一成分；**窄化**要靠扩大覆盖面、**真实挤占**只能靠承认容量约束+降优化压力——三成分不可用同一招通治。
- **"LLM 裁判可当唯一判决"——错**：已知 self-preference / position / verbosity 偏差；裁判无 skin in the game 且有系统偏好，是评估的博弈入口。

**【可操作要点清单（可直接采用的 checklist）】**
*I. 任务本身要"贵而难伪造"（cost differential）*
- [ ] **held-out + 私有集**：公开维度与方法论，保留从不公开、从不进任何训练/调参回路的私有任务，只用于最终裁决。
- [ ] **动态 / 定期刷新**：滚动更新题池，记录每套题"服役时长"，到期轮换（长期存活仍有区分度的题保留——Lindy）。
- [ ] **选"对差系统作弊边际成本极高"的任务**：端到端、需真实执行、结果客观可验（真跑通的代码/可复现实验），使"记住答案"无法得分。
- [ ] **污染审计**：主动检测测试项是否泄入训练（答案可被猜全、换选项顺序即掉分等信号），污染项作废。

*II. 指标结构要制衡、要触发追问*
- [ ] **配对 / counterbalanced 指标**：每个能力指标配"走捷径就恶化"的对立项（成功率↔有害副作用/资源消耗/幻觉率）。
- [ ] **指标作 tin opener 而非 dial**：异常高分触发人工深挖，而非自动放行/晋级。
- [ ] **覆盖多任务、警惕 Holmström-Milgrom 扭曲**：不对单一可测代理下重注（否则努力从难测但重要处被抽走）。

*III. 评估者要有 skin in the game、要与优化解耦*
- [ ] **eval 与优化/训练解耦**：优化只能看训练/验证集，最终评估集对优化过程完全不可见。
- [ ] **评估者 skin in the game**：放行某系统的团队须为其真实部署失败负责；评估集若被平凡绕过，追责到评估设计者。
- [ ] **不把 LLM 裁判当唯一判决**：多裁判 + 打乱位置 + 长度归一 + 关键样本人审；裁判分歧大处强制人审。

*IV. 随机人审不可测部分 + 结构化/裁量分工*
- [ ] **随机人工抽检**：对最易博弈的接缝做不可预测抽样人审（稻草人威慑，不必审全部）。
- [ ] **结构化在前、专家裁量在后**：结构化 rubric + 机械聚合压噪声，专家处理 rubric 覆盖不到的"断腿"式分布外表现，但 override 必须书面、可审计、统计命中率（防"过度声称断腿"）。
- [ ] **主动能力激发（elicitation）**：投入真实激发努力（多 prompt/脚手架/工具）逼近能力上限，压制"装傻式评估博弈"。

*V. 元层：把 eval 当会衰减的信号运营*
- [ ] **预算信号半衰期**、**via negativa 优先**（先删已被平凡博弈的旧 eval）、**记录并公开"已知绕过手段"清单**。

**【交互模块点子】** "虚高分解器"：学生调三个滑杆（优化压力 / 容量紧度 / 题库更新率），实时看到榜面分被拆成"真实 / 窄化 / 题目过拟合 / 真实挤占"四色堆叠柱，并观察"换新题"按钮如何瞬间抹掉题目过拟合那一段。

**【来源URL】**
- https://arxiv.org/abs/2210.10760
- https://arxiv.org/abs/2504.20879
- https://metr.org/blog/2024-03-15-guidelines-for-capability-elicitation/
- https://arxiv.org/abs/2209.13085

---

*编制方法：本简报综合 00-SYNTHESIS 与 research/02、04、06、08、10 的一手梳理，并用 2025–2026 WebSearch/WebFetch 补充最新实践（Számadó-Zachar-Penn 2025 trade-off 综合、SWE-bench Pro/Verified 弃用、Leaderboard Illusion）与两处新增案例的一手核验（Wells Fargo DOJ/SEC 30 亿和解；苏联钉子厂经查为 Krokodil 1957 漫画的疑似杜撰寓言，已标注）。凡讹传/寓言均在各节【讹传更正】显式标注。*
