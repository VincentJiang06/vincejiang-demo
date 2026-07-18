# 控制论、系统论与组织度量病理：Goodhart 之前与之外的思想谱系

> **本报告的位置。** 前作（01 Espeland & Sauder 的 reactivity、03 Goodhart 家族、05 AI eval）已经证明：一个被公开当作目标的度量会反过来塑造被测对象的行为。但那一族文献大多把病理定位在"激励"与"社会心理"层面。本报告向上追溯到更冷、更硬的一层——**控制论（cybernetics）与系统论（systems theory）**。这里的核心论点不是"人会作弊"，而是一个关于**控制的信息论下界**：一个低多样性的调节器**在原理上不可能**充分调节一个高多样性的系统。Goodhart 定律、Campbell 定律、reward hacking，在这一层看来都只是 Ashby **必要多样性定律**（Law of Requisite Variety）的社会学与工程学投影。把这条线讲透，读者就能理解为什么"用一个简单指标去控制复杂系统"不是一个可以靠"设计更好的 KPI"修补的工程缺陷，而是一个**结构性的、信息论意义上的不可能**。
>
> 本报告同时是一份**出处考证**：这一族思想充斥着漂亮但被讹传的金句（"only variety can absorb variety"、"the most important figures are unknown and unknowable"、"you can't manage what you can't measure"、Shirky 原则、POSIWID）。我们逐条锚定一手出处，并在文末给出讹传清单。

---

## 一、POSIWID：Stafford Beer 的 dictum，考证与误用

### 1.1 这句话到底是谁、在哪说的

**POSIWID = "The Purpose Of a System Is What It Does"**（系统的目的即其所为）。它被归给英国管理控制论学者 **Stafford Beer**（1926–2002）。但"确切出处"需要分层考证，因为流传的版本混淆了三样东西：**（a）这个控制论洞见本身、（b）"the purpose of a system is what it does" 这句话、（c）POSIWID 这个首字母缩略词**。

- **最可靠的 verbatim 锚点是 2001 年 10 月 Beer 在西班牙 University of Valladolid 的演讲**，原话为：*"According to the cybernetician, the purpose of a system is what it does. This is a basic dictum."*（"照控制论者看来，系统的目的即其所为。这是一条基本箴言。"）他紧接着补充：*"there is no point in claiming that the purpose of a system is to do what it constantly fails to do"*（"声称某系统的目的是去做它一贯做不到的事，毫无意义"）。这是目前能查到的、Beer 亲口把该句作为"dictum"郑重给出的最清晰记录。
- **更早的书面锚点通常指向 Beer 的 1979 年著作《The Heart of Enterprise》（Wiley）**，以及散见于其多次公开演讲。维基把"coined"（首创）归给 Beer。
- **警示（考证要点）：** 把它当作某本书某一页的"精确原文"去引用是危险的——二手来源在措辞与页码上并不统一。**安全引法**是："Beer（1979，*The Heart of Enterprise*；as stated in his 2001 Valladolid address）"。此外，**POSIWID 这个缩略词的流行，很大程度上是后来的系统思考社群（如 Cybernetics/Systems 圈、Benjamin P. Taylor 等）推动的**，不宜把缩略词本身的传播都算到 Beer 头上。

### 1.2 在管理控制论里的含义

POSIWID 是一件**认识论撬棍**：它命令你**悬置系统"自称的目的"（stated/official purpose），转而从系统"稳定地、反复地产出什么"去反推它的 de facto purpose**。控制论者对"意图"不感兴趣——意图不可观测、不可证伪；可观测的是**行为与输出的稳定模式**。因此当一家医院年年宣称"以病人安全为第一"却年年高事故率，POSIWID 说：它的**实际**目的（在系统层面）就包含了"生产事故"这一稳定输出，无论谁的主观愿望如何。它与本报告后文的 Deming、Seddon 一脉相承：**系统的产出由系统结构决定，而非由个体善意或口号决定。**

### 1.3 常见误用（这是 POSIWID 最需要被"打码"的地方）

POSIWID 极易被滑向两种谬误，读者必须能一眼识别：

1. **意图谬误 / 阴谋论化（intent fallacy）。** 最常见的误用是把"系统在做 X"直接读成"**有人故意想要 X**"——于是"任何你最讨厌的副作用"都被指认为"系统真正的、隐秘的目的"。这恰恰**违背** Beer 的本意：POSIWID 的价值在于**绕开**对意图的追问，而不是把意图偷运回来并升级成阴谋。（Scott Alexander 在 Astral Codex Ten、Nelson Elhage 等都专门批评过这种"POSIWID 沦为偏执狂的许可证"的滑坡。）
2. **同义反复 / 抹平"失灵"与"目的"的区别。** 若"目的就是所为"被读成"凡发生的都是目的"，则一切改进诉求都被消解——系统永远"成功地在做它所做的"。这使 POSIWID 变得**不可证伪因而无内容**。正确用法是把它当作**诊断性提问**（"输出与宣称为何背离？"），而非**规范性结论**（"背离即是阴谋"）。

> **小结与桥接：** POSIWID 给了本报告一个总的姿态——**看输出的稳定模式，不看口号**。这正是把"度量病理"从道德问题（谁坏）改写为系统问题（结构必然产出什么）的第一步。下一节的 VSM 与 Ashby，会把"为什么单一度量注定失灵"从姿态升级为**定理**。

---

## 二、可行系统模型（VSM）与管理控制论对"度量/反馈"的看法

### 2.1 VSM 是什么

**Viable System Model（VSM）**是 Beer 在 1950s 末至 1970s 间发展的控制论组织模型，主著为 *Brain of the Firm*（1972）、*The Heart of Enterprise*（1979）、*Diagnosing the System for Organizations*（1985）。它主张：**任何能在多变环境中长期存活（viable）的组织，都必然实现五类功能，缺一不可**：

- **System 1（S1）操作**：直接与环境交互的自治业务单元。
- **System 2（S2）协调**：抑制 S1 各单元之间振荡的协调机制（防止内耗/共振）。
- **System 3（S3）控制**（外加 **S3\*** 审计通道）：内部协同与资源分配的即时管理。
- **System 4（S4）情报/发展**：面向外部与未来的侦测、规划、适应。
- **System 5（S5）政策/身份**：平衡 S3（当下）与 S4（未来）的张力，守护系统的身份（identity）。

VSM 的两大结构特征：**递归性（recursion）**——每个 S1 单元自身又是一个完整的五系统可行系统（Beer 称之为 cybernetic isomorphism / 同构）；以及**多样性感知（variety-aware）**——它在每个界面上显式地做"多样性工程"。

### 2.2 管理控制论对度量与反馈的核心立场：**变量工程（variety engineering）**

这是 VSM 与本报告最相关的部分。Beer 直接继承 Ashby（见第三节），把**管理**定义为**多样性的匹配问题**：环境的多样性 ≫ 操作单元的多样性 ≫ 管理层的多样性。要让低多样性的管理层"控制住"高多样性的现实，只有两条路，Beer 称之为 **variety engineering**：

- **衰减（attenuation）**：把上行的环境/操作多样性**过滤、聚合、抽样、例外报告、下放决策权**，使其压缩到管理层的信道容量之内。**一切 KPI、仪表盘、报表，本质上都是 attenuator。**
- **放大（amplification）**：把下行的管理指令**放大**为足以规制环境的多样性（政策、规则、自动化、赋能一线）。

由此得出管理控制论对"度量"的**根本态度**，也是本报告的枢纽：

1. **度量必然是 attenuator，即必然丢弃多样性。** 任何指标都是对现实的**有损压缩**。问题从来不是"要不要丢信息"，而是"丢得聪明还是丢得愚蠢"。
2. **单一指标是极端的 attenuator，几乎必然"丢得愚蠢"。** 把一个高多样性系统压进一个标量，等于宣称该标量已捕获所有 essential variables——这在原理上违背必要多样性（下节）。
3. **好的反馈是快速、局部、双通道的，而非慢速、中心化、单标量的。** VSM 特别强调 **algedonic signal（痛/快信号）**：绕过常规层级的、快速直达 S5 的告警通道——因为**总量指标的平滑会掩盖局部的致命异常**。这与 Deming 的"区分 common cause / special cause"（第四节）指向同一件事：**反馈的价值在于分辨信号与噪声，而不在于把一切压成一个可排名的数。**

> **桥接：** VSM 告诉我们"为什么要衰减、如何聪明地衰减"。但**衰减有没有下界？低多样性的调节器到底能不能控住高多样性的系统？** 这个"能不能"的问题，由 Ashby 给出斩钉截铁的答案。

---

## 三、Ashby 必要多样性定律：Goodhart 的控制论根源（本报告的理论核心）

### 3.1 原始表述考证

- **出处**：**W. Ross Ashby, *An Introduction to Cybernetics*, Chapman & Hall, London, 1956**。定律见 **第 11 章 "Requisite Variety"**。
- **Ashby 的原话是**：**"only variety can destroy variety."**（"唯有多样性能摧毁多样性。"）该informal statement 一般被引作 **§11/7**；书中正式命名为 **the Law of Requisite Variety**。
- **⚠ 关键讹传（务必标注）：** 广为流传的 **"only variety can absorb variety"** 中的动词 **"absorb"（吸收）并非 Ashby 原文**——Ashby 用的是 **"destroy"（摧毁/抵消）**。**"absorb"/"variety absorbs variety" 是 Stafford Beer 的复述/管理学化改写**，后被无数二手文献错当成 Ashby 原句回填。用户题面里给的正是"absorb"版——这是一处需要澄清的常见误记：**它抓住了对的意思，但引错了原文与作者。**（次要 caution：个别在线选段把加框的"Law"排到 §11/11 附近，与多数二手文献标注的 §11/7 略有出入；引用时以"第 11 章 Requisite Variety"为稳。）

**定律的形式内容**：设扰动 D 的多样性为 V(D)、调节器 R 的多样性为 V(R)、结果 outcome 的多样性为 V(O)。Ashby 证明在一次性博弈式的调节里，**V(O) ≥ V(D) − V(R)**。也就是说，**结果中不可消除的多样性（不确定/失控），至少等于扰动多样性减去调节器多样性。** 要把 outcome 压到最低（把 essential variables 稳定在存活区间内），**必须 V(R) ≥ V(D)**——调节器的多样性必须不小于它所要对抗的扰动的多样性。Ashby 还给出一个信息论推论："R 作为调节器的能力，不能超过 R 作为信道的容量。"

### 3.2 为什么这是"用一个简单指标控制复杂系统必然失败"的**根源**

把上式读进度量治理，结论是**冷酷而精确**的：

- 令"复杂系统"= 你想治理的对象（一家医院、一个 AI 模型、一支科研队伍），其行为空间的多样性为 V(D)，巨大。
- 令"简单指标"= 你的调节器 R。**一个标量 KPI 的多样性 V(R) 极低**（本质上只有"上/下"一个自由度）。
- 代入 **V(O) ≥ V(D) − V(R)**：由于 V(R) ≪ V(D)，**结果中未被控制的多样性 V(O) 几乎等于 V(D) 本身**。翻译成人话：**你以为你在用 KPI 控制系统，其实系统绝大部分行为维度仍然完全失控**；被"控住"的只有 KPI 那一个维度。系统于是自由地在**所有未被度量的维度**上漂移——而"迎合指标、牺牲未被度量者"正是 Goodhart / gaming 的定义。

**这就是 Goodhart 定律的控制论根源，也是本报告要读者拿走的最硬的一课**：Goodhart 不是"人心坏了"的道德现象，而是**必要多样性定律的必然推论**。当 V(R) ≪ V(D) 时，系统数学上**保证**存在大量"高 KPI、低真实效用"的状态；优化压力只是把系统推向这些本就存在的状态而已。所以：

> **单一 eval / 单一 KPI 无法约束一个通用能力系统——这不是"指标设计得不够好"，而是 V(R) ≥ V(D) 这个不等式在结构上无法被一个标量满足。** 你要么增大 V(R)（多样化、多维、动态的度量组合——即 Beer 的 variety engineering），要么接受系统在未度量维度上必然失控。**没有第三条路。**

这条推理同时解释了本项目 03 号文件里 Manheim & Garrabrant 的 Goodhart 四型（regressional / extremal / causal / adversarial）为何"必然"发生：它们都是 V(O) 中那份"减不掉的多样性"在不同机制下的显影。Ashby 提供的是**存在性下界**，ML 那边的 Zhuang & Hadfield-Menell（2020，代理只覆盖 J<L 个特征则无限优化必致效用任意低）提供的是**同一定理的现代重证**。

---

## 四、Deming：把"必要多样性"落进管理实务的人

W. Edwards Deming（1900–1993）从**统计过程控制**而非控制论出发，却独立抵达了同一结论：**大多数变异来自系统而非个体，因此靠"给个体设数字指标 + 奖惩"来改进系统，在统计上是错的、在心理上是有害的。**

### 4.1 《Out of the Crisis》与十四要点（尤其第 11、8、12 点）

**出处**：**W. Edwards Deming, *Out of the Crisis*, MIT Center for Advanced Engineering Study, 1986**（后由 MIT Press 再版）。书中提出 **14 Points for Management** 与 **Seven Deadly Diseases**。与度量病理最相关的：

- **第 11 点（废除数字定额/配额）**——这是题面点名的重点，Deming 把它拆成两半：
  - **11(a)**：*Eliminate work standards (quotas) on the factory floor.*（废除车间层面的工作定额/计件指标）——代之以 leadership。
  - **11(b)**：*Eliminate management by objective. Eliminate management by numbers, numerical goals.*（废除目标管理 MBO、废除以数字/数值目标进行管理）——代之以 leadership。
  - Deming 的论证：**任意设定的数字目标要么太高要么太低**；"按数字来管"本质是**在不知道该怎么做的情况下假装在管理**（"an attempt to manage without knowledge of what to do"）。定额让工人失去 pride of workmanship，并把行为锁进短期、交易性的思维。
- **第 8 点（驱除恐惧，drive out fear）**——题面点名。恐惧使人隐瞒问题、粉饰数据；只有驱除恐惧，人才敢说真话，系统才能被真实地看见。**恐惧 + 数字指标 = 系统化的数据造假**（这直接预告了第六节 Bevan & Hood 的 gaming）。
- **第 12 点（消除阻碍 pride of workmanship 的壁垒）**：明确要求**废除年度考评/绩效排名（annual rating / merit rating）与 MBO**，因为它们把系统造成的变异错误地归因并奖惩到个人头上。
- **Seven Deadly Diseases** 之一即：*"Management by use only of visible figures, with little or no consideration of figures that are unknown or unknowable."*（只用可见数字来管理，几乎不考虑那些未知、不可知的数字。）——这句直接引出 4.3 的考证。

### 4.2 System of Profound Knowledge（渊博知识体系）、红珠实验、漏斗实验

**SoPK 出处**：**W. Edwards Deming, *The New Economics for Industry, Government, Education*, MIT CAES, 1993（2nd ed. 1994）**。SoPK 由**四块相互作用的透镜**组成：**（1）appreciation for a system（对系统的理解）、（2）knowledge about variation（对变异的知识）、（3）theory of knowledge（知识论）、（4）psychology（心理学）**。它是十四要点背后的元理论：**没有对"变异"和"系统"的理解，一切数字管理都会退化为对噪声的过度反应。**

**红珠实验（Red Bead Experiment）**——教学含义直击 reactivity 的心脏：

- 装置：一个装有白珠与红珠（红珠约占 20%）的容器；"willing workers（愿意好好干的工人）"用带 50 个孔的木铲（paddle）舀珠；红珠=次品。有督导、检验员、记录员，一切照"正规管理"来。
- 结果：**红珠数纯由抽样（系统）决定，工人无论多努力都无法控制**。可每天仍会出现"最佳员工/最差员工"，管理层照例表扬、训诫、排名、甚至解雇"差的"。
- 教训：**在稳定系统里对个体绩效排名、奖优罚劣，是在对随机变异（common-cause variation）做因果解读——既不公正也无效。要改善产出，只能改系统（换掉红珠），不能改人。** 这正是对"排名反应性"最古老、最优雅的反证：**当结果由系统决定时，任何基于排名的激励都只是在奖惩运气。**

**漏斗实验（Funnel Experiment）**——教学含义是"tampering（乱调）"：

- 装置：把漏斗对准靶心投弹珠，记录落点。四条"调整规则"：
  - **Rule 1**：漏斗**不动**（信任系统）。
  - **Rule 2**：按上一次偏差量**反向**移动漏斗。
  - **Rule 3**：每次把漏斗移到"靶心 + 相对上一落点的补偿"位。
  - **Rule 4**：每次把漏斗直接移到**上一落点**上方。
- 结果：**Rule 1（不动）方差最小、最贴靶心**；Rule 2–4 这些"看似负责任的即时纠偏"全都**放大**了方差，令结果越来越糟（Rule 4 甚至发散）。
- 教训：**把 common-cause 的噪声误当成 special-cause 的信号去逐次纠偏（tampering），会系统性地把事情弄坏。** 这对 AI eval 是致命预警：**用每次 eval 分数的抖动去即时调优（把 eval 当漏斗规则 2/3/4），几乎必然放大而非缩小真实性能的方差。**

### 4.3 "最重要的数字不可测量"——这句话的考证（题面重点）

流传句：*"The most important figures are unknown and unknowable."*（最重要的数字是未知且不可知的。）

- **它确实出现在 Deming 笔下**，完整语境为：*"In my mind, if you run your company on visible figures alone, you will have neither company nor figures, given a little time. The most important figures are unknown and unknowable. That opinion comes from my good friend, Dr. Lloyd Nelson."*
- **⚠ 考证要点：Deming 明确把这个 opinion 归给他的朋友 Lloyd S. Nelson**（Nashua 公司统计方法主管）。**《Out of the Crisis》p.121** 引 Nelson 原话：*"the most important figures that one needs for management are unknown or unknowable, but successful management must nevertheless take account of them."* 所以严谨引法是："**Nelson, quoted in Deming (1986, Out of the Crisis, p.121)**"，而非把首创权直接记给 Deming。
- **⚠ 更大的讹传（必须纠正）：** 与之相反的名言 **"You can't manage what you can't measure"（不能度量就不能管理）经常被错安到 Deming（有时安到 Drucker）头上。Deming 恰恰把这句话视为谬误、并把"只靠可见数字管理"列为七大致命病之一。** 换句话说，Deming 的立场与那句流行语**完全相反**。这是度量文化里流传最广、伤害最大的一处误引，务必在报告里点破。

> **桥接：** Deming 提供了最完整的**替代方案**——不是"设计更好的 KPI"，而是**根本上把度量与激励解耦**：度量用于理解系统（区分噪声与信号），而非用于给个体排名和驱动优化。这一"解耦"直接可迁移到 AI eval（见第八节）。

---

## 五、Shirky 原则：为什么组织会保护自己要解决的问题

**Shirky 原则（Shirky Principle）**：*"Institutions will try to preserve the problem to which they are the solution."*（机构会倾向于保全那个"它正是其解决方案"的问题。）

**出处考证（题面重点）：**

- **命名者是 Kevin Kelly（《Wired》创刊主编），出处是他 2010 年在 The Technium 博客的文章 "The Shirky Principle"（kk.org/thetechnium/the-shirky-prin/）。**
- **Kelly 把这条箴言的思想归给 Clay Shirky**（NYU 学者、《Here Comes Everybody》《Cognitive Surplus》作者）——Kelly 说他是把 Shirky 在一次演讲/相关博文中的表述**提炼并冠名**为"Shirky 原则"。**因此：警句的精确措辞是 Kelly 的，命名与冠名也是 Kelly 的；Shirky 提供的是原始洞见。** 不宜把这句 aphorism 当作 Shirky 的直接原话去引。
- Kelly 的补充阐释：*"complex solutions … can become so dedicated to the problem they are the solution to, that often they inadvertently perpetuate the problem."*（复杂的解决方案会变得如此忠于它所要解决的问题，以至常常无意中把问题永久化。）

**它在本报告谱系中的作用**：Shirky 原则是 **POSIWID 在制度层面的动力学版本**。POSIWID 说"看系统实际产出什么"；Shirky 说"一个以'解决问题 X'为存在理由的机构，其可行性（借 VSM 的话：其 S5 身份）恰恰依赖 X 的持续存在，于是它会在 S1–S5 各层形成保全 X 的隐性反馈"。对度量治理的直接含义：**一个'负责治理度量病理'的机构（评测机构、审计机构、合规部门），其 de facto 目的会漂移为'维持对该机构的需求'**——这解释了为什么 eval/审计体系本身也会被 Goodhart 化。

---

## 六、英国公共管理的目标制批判：最成熟的实证战场

英国 1997 年后（Blair/New Labour）把"目标制（targets）"推到极致，也因此催生了**全世界关于度量病理最扎实的实证文献**。这是把前述控制论/统计学原理"在真实国家机器上验证"的天然实验。

### 6.1 Bevan & Hood (2006)：targets and terror、synecdoche、gaming 三型

**核心文献**：**Gwyn Bevan & Christopher Hood, "What's measured is what matters: targets and gaming in the English public health care system," *Public Administration*, 2006, 84(3): 517–538.**（DOI: 10.1111/j.1467-9299.2006.00600.x；LSE 全文见 eprints.lse.ac.uk/16211/。姊妹篇：**Hood, C. (2006), "Gaming in Targetworld," *Public Administration Review*, 66(4): 515–521**。）

三个必须掌握的概念：

1. **"targets and terror"（目标 + 恐怖）**：英国 NHS 的治理把**数字目标**与**一套惩戒机制**（点名羞辱、撤换管理层、"naming and shaming"）捆绑。Bevan & Hood 明确指出这与**苏联斯大林式指令经济**的绩效管理**同构**——同样的指标、同样的"storming（期末冲量）"、同样的 gaming。**这条类比是全文最锋利的地方**：它把"现代绩效管理"祛魅为"计划经济的指标游戏"。
2. **synecdoche（提喻）**：目标制的隐含假设是**用被测的一部分去代表未被测的整体**（part standing for the whole）。"What's measured is what matters" 这个标题本身就是一句反讽——它描述的是治理者的**错误信念**："只有被测的才重要"，于是**未被测的整体被系统性牺牲**。这与 Ashby 的 V(R) ≪ V(D) 是同一件事的政治学表述。
3. **gaming 三型（度量病理的通用词表）**：
   - **ratchet effect（棘轮效应）**：管理者按"去年绩效"定"今年目标"，于是理性的一线会**故意不超额**、压着干，以免明年目标被抬高。
   - **threshold effect（阈值效应）**：一刀切的统一目标会**把优等生拉低到及格线**（达标即止，无动力超越），同时**恶待差等生**。
   - **output distortion（产出扭曲）**：为达标的被测指标而**牺牲未被测的维度**——即 effort substitution / cream-skimming / tunnel vision / goal displacement 的统称。**这一型就是 Goodhart 的直接同义词。**
   - 三者互相纠缠：想用"按past-performance定标"压 threshold，就会加重 ratchet；想用"全系统统一标"压 ratchet，就会加重 threshold——**没有一种目标设计能同时消掉三型**（又一次 Ashby 式的不可能）。

**行为主体四型（极具教学价值）**：Bevan & Hood 按"是否认同主流目标 × 是否操纵数据"把从业者分为 **saints（圣人：公共服务伦理极高，甚至主动上报自己的短板）、honest triers（老实人：认同目标、不主动张扬失败、但也不做假）、reactive gamers（机会主义博弈者：有动机/机会就粉饰数据）、rational maniacs（理性狂人：不认同目标、系统性造假掩盖真相）**。关键论点：**多数人本是 saints/honest triers，但"targets and terror"制度会把人从前两类推向后两类**——制度本身在生产 gaming。这与 Deming 第 8 点"驱除恐惧"完全咬合：**恐惧是 gaming 的燃料。**

### 6.2 Christopher Hood 的系列工作

- **Hood (1991), "A Public Management for All Seasons?," *Public Administration*, 69(1): 3–19**：**首次命名 "New Public Management"（NPM）**，并归纳其七条教义——其中两条正是病根：*explicit standards and measures of performance*（显式的绩效标准与度量）与 *greater emphasis on output controls*（更强调产出控制）。**NPM 就是"把一切装进可量化指标"的制度化。** Bevan & Hood 的批判，可读作对 Hood 自己 1991 年所命名的运动的**十五年后的病理报告**。
- **Hood (2006), "Gaming in Targetworld"**（同上）：把 gaming 的类型学系统化，奠定后续"目标制 → gaming"研究范式。

### 6.3 John Seddon：从精益与系统思维反对目标制

**John Seddon**（职业心理学家出身，把 Toyota Production System 的系统思维引入服务业）是目标制最尖锐的实务批评者。主著 **《Systems Thinking in the Public Sector: The Failure of the Reform Regime… and a Manifesto for a Better Way》（Triarchy Press, 2008）**。要点：

- **failure demand（失败需求）**：Seddon 的原创概念——服务系统里大量的工作量，是**"上一环没把事情一次做对"而被迫产生的重复需求**。目标制（如"X 分钟内接听/结案"）**只优化了 value demand 的表面速度，却制造了海量 failure demand**，总成本反升。**这是 output distortion 的精确机制模型。**
- **反 "deliverology"、反目标、反 ISO9000 式合规、反规模经济迷信**：Seddon 主张**从"外部—顾客视角"理解系统的真实需求变异（demand variety）**，用系统改善而非指标威慑来提升绩效。他与 Deming 一脉相承（都从变异出发），并把 Bevan & Hood 的实证结论转成可操作的改造方法论。

### 6.4 tin openers vs. dials：Carter (1989) 的关键区分

**出处**：**Neil Carter (1989), "Performance indicators: 'backseat driving' or 'hands-off' control?," *Policy and Politics*, 17(2): 131–138**（后扩展为 **Carter, Klein & Day, *How Organisations Measure Success: The Use of Performance Indicators in Government*, Routledge, 1992**）。

Carter 的分类是给度量治理开的最温和也最实用的药：

- **"dials"（仪表盘/标度盘）**：假设指标能像仪表一样**给出确定读数与明确判断**（"数字=真相=该怎么办"）。**这是 NPM/目标制的隐含幻想。**
- **"tin openers"（开罐器）**：Carter 指出**绝大多数指标其实是开罐器而非仪表**——它们**打开一罐虫子（a can of worms），不给答案，只提出质询**，本身只提供不完整、不精确的图景，必须辅以进一步的解释与调查。

**这个区分是本报告给实践者的操作性结论**：**指标的正当用法是 tin-opener（触发追问、引出对系统的理解），而非 dial（直接驱动奖惩与优化）。** 它在方法论上等价于 Deming 的"度量用于理解变异，不用于排名个体"，也等价于下一节要点出的 eval 用法。

---

## 七、目标置换（goal displacement）：组织社会学的经典证据链

"目标置换"是把**手段升格为目的、以致牺牲原初目的**的一般现象。它与 Merton 的 reactivity 洞见（03 号文件已引 Merton 1936 "unanticipated consequences"）同源，构成度量病理的社会学地基。

- **Robert K. Merton (1940), "Bureaucratic Structure and Personality," *Social Forces*, 18(4): 560–568。** Merton 借 Veblen 的 **"trained incapacity（训练出来的无能）"** 指出：官僚被训练得极度遵规，以致 **"an instrumental value becomes a terminal value"（工具性价值变成了终极价值）**——遵守规则本身成了目的，反而妨碍组织真正目标的达成，极端者即 **"bureaucratic virtuoso（官僚能手）"**：一条规则都不忘、却因此帮不了任何当事人。**这是 goal displacement 的经典命名。**
- **Peter M. Blau (1955), *The Dynamics of Bureaucracy*, University of Chicago Press。** 最早的**实证**证据之一：在一家公共**就业服务机构**里，把"绩效统计"引入后，职员出现 dysfunctional consequences——**按月度配额（而非当事人真实优先级）决定先办哪个案子**；甚至为了同时把一次登记计成"一个岗位 + 一次安置"而操纵流程。**这是 Goodhart / output distortion 在 1955 年的实地记录。**
- **W. Keith Warner & A. Eugene Havens (1968), "Goal Displacement and the Intangibility of Organizational Goals," *Administrative Science Quarterly*, 12(4): 539–555。** 提出关键命题：**目标越"无形/不可捉摸（intangible）"，越容易被有形的、可度量的替代目标置换。** 因为无形目标（如"教育质量""科研卓越""模型对齐")无法直接考核，组织会本能地滑向可测的代理指标——**这正是"最重要的东西不可测量"（Nelson/Deming）与"必要多样性不足"（Ashby）在组织行为层面的合流**：可测者驱逐不可测者，如同劣币驱逐良币。

> **⚠ 讹传更正（题面重点）：** 题面所称"**Warren Thornton 的置换**"——**遍查未见任何名为 "Warren Thornton" 的学者提出 goal displacement 理论。** 最可能的情况是**"Warren Thornton" 系 "Warner & Havens (1968)" 的记忆讹误/张冠李戴**（W-arner → Warren；Havens 误记为 Thornton）。该文才是 goal-displacement 文献中与"目标无形性"直接相关的经典。报告以 Warner & Havens (1968) 为准，并把"Warren Thornton"标注为待核的疑似讹传。

---

## 八、把这一族串起来：给 AI eval 治理的可迁移教训

上述七条线看似分散（控制论、统计质量管理、制度社会学、公共管理），却指向**同一个不变式**。把它们叠起来，就得到一套对"AI eval 治理"直接可用的原理，且每一条都有硬理由，而非类比：

**（1）必要多样性 → 单一 eval 在原理上无法约束通用能力。**
Ashby 的 **V(O) ≥ V(D) − V(R)** 是硬约束。通用模型的行为多样性 V(D) 近乎无界；任何单一 benchmark/单一 Arena 分数的 V(R) 极低。因此**"未被该 eval 度量的能力维度"数学上保证大规模失控**——这正是 05 号文件里 Leaderboard Illusion、Llama-4 "实验性聊天版"、style/length gaming、sycophancy 的统一解释：不是"这个榜设计得不好"，而是**任何单标量的榜都不可能有足够 variety 去约束一个通用系统**。**对策只有一条**：把 V(R) 顶上去——**多维、异质、动态刷新、对抗生成、且互不相关的 eval 组合（Beer 的 variety engineering / attenuation 设计）**，而非追求"一个更强的总分"。**"用一个 HLE 分数代表通用智能"是一次 synecdoche 谬误（Bevan & Hood），在 Ashby 意义上注定失败。**

**（2）Deming 解耦 → eval 不该直接驱动优化。**
Deming 的红珠/漏斗给出最实操的诫命：**度量的正当功能是"理解系统、区分 common-cause 噪声与 special-cause 信号"，而非"给个体排名并即时纠偏"。** 把 eval 分数直接接进优化回路（RLHF 奖励、发布/撤回决策、排行榜竞赛），等于同时犯下**漏斗实验的 tampering（拿噪声当信号逐次调优 → 放大方差）**与**红珠实验的误归因（把系统级变异奖惩到模型/团队头上）**。**可迁移的设计原则：把"评估"与"优化"在制度上解耦**——eval 作为 **tin-opener**（触发对失败模式的追问、对系统的诊断），而非 **dial**（直接的奖惩标度盘）。这与 Gao et al. (2023) 的 reward-overoptimization"先升后降"曲线（05 号文件）是同一句话的两种证明：**一旦 proxy 被当作 dial 去用力优化，金标准必过峰而降。**

**（3）targets-and-terror → 恐惧与高利害会把 eval 变成 gaming 引擎。**
Bevan & Hood 的四型主体 + Deming 第 8 点给出制度心理学预警：**当 eval 与高利害（融资、发布、排名羞辱）强绑定时，制度会把"honest triers"（老实做 eval 的实验室）推成"reactive gamers"（私测 best-of-N、污染、benchmaxxing、撤回难看的分）。** gaming 不是坏人现象，是**制度在恐惧下的必然产物**。可迁移对策：**降低单次 eval 的 terror（去锦标赛化、匿名化、事后审计化）、驱除"必须刷榜求生"的恐惧**——否则再好的 eval 也会被制度性地玩坏。

**（4）Shirky 原则 → 连"治理 eval 的机构"也会被 Goodhart 化。**
一个以"修理 eval 病理"为存在理由的评测/审计机构，其 S5 身份依赖病理的持续存在（Shirky）。因此 eval 治理必须**自反地设计**：定期轮换、外部独立、对"评测机构自身指标"也施加 tin-opener 式质询，避免 evaluation science 变成又一个"保全自己所要解决的问题"的封闭系统。

**（5）POSIWID → 用输出的稳定模式审计 eval 体系本身。**
不要看 eval 体系**宣称**要衡量什么（"通用推理""对齐""安全"），要看它**稳定地产出**什么行为塑形。若某套 eval 稳定地产出更长、更谄媚、更爱堆 emoji 的模型（05 号文件的 LMArena 证据），那么——照 POSIWID——**这套 eval 的 de facto purpose 就包含"生产冗长与谄媚"**，无论其宣称目标多么高尚。**这是对 eval 治理最简洁的自检钩子。**

**一句话收束：** 从 Ashby 到 Deming 到 Bevan & Hood，同一条定理被三次独立证明——**低多样性的度量无法控制高多样性的系统，强行为之只会把系统在未度量维度上的失控，转化为在已度量维度上的表演。** AI eval 若想不重蹈 NHS 的覆辙，出路不在"造一个更好的分数"，而在**（a）用足够多样、动态、互不相关的 eval 组合逼近 requisite variety，（b）把 eval 从优化回路里解耦出来当 tin-opener，（c）用 POSIWID 持续审计 eval 体系自身的真实产出。**

---

## 附录 A：讹传与误引清单（misattribution flags）

1. **"only variety can *absorb* variety"** —— **讹**。Ashby (1956) 原文是 **"only variety can *destroy* variety"（§11/7, ch.11）**。"absorb" 版是 **Stafford Beer 的管理学化复述**（"variety absorbs variety"），常被错当成 Ashby 原句。题面用的是"absorb"版，特此更正。
2. **"The most important figures are unknown and unknowable"** —— **半讹**。此 opinion Deming 明确归给 **Dr. Lloyd S. Nelson**；一手锚点为 **Deming, *Out of the Crisis* (1986), p.121**。引用应写"Nelson, quoted in Deming (1986, p.121)"，而非首创权记给 Deming。
3. **"You can't manage what you can't measure"** —— **严重讹传/张冠李戴**。常被误安给 Deming（或 Drucker）。**Deming 的立场恰恰相反**：他把"只靠可见数字管理"列为七大致命病之一，并视该流行语为谬误。
4. **Shirky 原则的确切措辞** —— **命名与措辞属 Kevin Kelly (2010, The Technium)**，思想源自 Clay Shirky。不宜把 aphorism 当作 Shirky 直接原话引用。
5. **POSIWID 的"精确出处"** —— **勿指定为某书某页的 verbatim**。最稳的 verbatim 锚点是 **Beer 2001 年 Valladolid 演讲**；书面通常指 *The Heart of Enterprise* (1979)。缩略词 POSIWID 的流行有后世系统社群之功。
6. **"Warren Thornton" 的 goal displacement** —— **疑似讹传/未找到**。查无此人此说；最可能是 **Warner & Havens (1968), ASQ 12(4):539–555** 的记忆讹误。以 Warner & Havens 为准。
7. **Ashby 定律的章节号** —— 二手文献多标 **§11/7**；个别在线选段把加框 "Law" 排在 §11/11 附近。以"第 11 章 Requisite Variety"为稳妥引法（次要 caution）。

---

## 附录 B：核心参考文献与 URL

**控制论 / 系统论**
- Ashby, W. R. (1956). *An Introduction to Cybernetics*. Chapman & Hall. ch.11 "Requisite Variety", §11/7. 原文选段：http://panarchy.org/ashby/variety.1956.html ；全书 PDF：http://pespmc1.vub.ac.be/books/IntroCyb.pdf ；概念页：http://pespmc1.vub.ac.be/REQVAR.html
- Beer, S. (1972). *Brain of the Firm*; (1979) *The Heart of Enterprise*; (1985) *Diagnosing the System for Organizations*. Wiley.
- POSIWID / VSM：https://en.wikipedia.org/wiki/The_purpose_of_a_system_is_what_it_does ；https://en.wikipedia.org/wiki/Viable_system_model ；https://en.wikipedia.org/wiki/Variety_(cybernetics) ；variety engineering：https://onlinelibrary.wiley.com/doi/full/10.1002/sres.2964
- POSIWID 误用批评：https://www.astralcodexten.com/p/highlights-from-the-comments-on-posiwid ；https://notebook.nelhage.com/note/2025/04/posiwid/ ；https://antlerboy.medium.com/what-does-posiwid-mean-to-you-69a851ddd0ab

**Deming**
- Deming, W. E. (1986). *Out of the Crisis*. MIT CAES.（14 Points；Seven Deadly Diseases；p.121 Nelson 引语）
- Deming, W. E. (1993/1994). *The New Economics for Industry, Government, Education*. MIT CAES.（SoPK 四要素）
- 14 Points：https://deming.org/explore/fourteen-points/ ；SoPK：https://deming.org/explore/sopk/ ；Red Bead：https://deming.org/explore/red-bead-experiment/ ；Funnel：https://deming.org/explore/the-funnel-experiment/
- "unknown and unknowable" 考证：https://deming.org/unknown-and-unknowable-data/ ；引语页：https://deming.org/quotes/（"neither company nor figures…"）；误引辨析：https://www.leanblog.org/2017/07/conundrum-dr-deming-metrics-measures-data/

**Shirky 原则**
- Kelly, K. (2010). "The Shirky Principle." *The Technium*：https://kk.org/thetechnium/the-shirky-prin/ ；辨析：https://effectiviology.com/shirky-principle/

**英国目标制 / 公共管理**
- Bevan, G. & Hood, C. (2006). "What's measured is what matters…" *Public Administration*, 84(3): 517–538. DOI:10.1111/j.1467-9299.2006.00600.x；LSE 全文：https://eprints.lse.ac.uk/16211/ ；PDF：http://straty.com/wp-content/uploads/2018/04/Whats-Measured-is-What-Matters-Bevan-Hood-2006.pdf
- Hood, C. (1991). "A Public Management for All Seasons?" *Public Administration*, 69(1): 3–19.
- Hood, C. (2006). "Gaming in Targetworld." *Public Administration Review*, 66(4): 515–521. DOI:10.1111/j.1540-6210.2006.00612.x
- Seddon, J. (2008). *Systems Thinking in the Public Sector*. Triarchy Press.（failure demand；deliverology 批判）
- Carter, N. (1989). "Performance indicators: 'backseat driving' or 'hands-off' control?" *Policy and Politics*, 17(2): 131–138（tin openers vs dials, p.134）；扩展为 Carter, Klein & Day (1992), *How Organisations Measure Success*, Routledge. 概念解读：https://andifugard.info/tin-openers-versus-dials/

**目标置换（组织社会学）**
- Merton, R. K. (1940). "Bureaucratic Structure and Personality." *Social Forces*, 18(4): 560–568. 原文：http://media.pfeiffer.edu/lridener/courses/MERTONR2.HTML
- Blau, P. M. (1955). *The Dynamics of Bureaucracy*. University of Chicago Press.
- Warner, W. K. & Havens, A. E. (1968). "Goal Displacement and the Intangibility of Organizational Goals." *Administrative Science Quarterly*, 12(4): 539–555.

**项目内交叉引用**
- 03-goodhart-family.md / 03a-goodhart-provenance.md（Goodhart、Strathern、Campbell）
- 05-ai-evals-reactivity.md（Leaderboard Illusion、reward overoptimization、style control、sycophancy）
- 01-espeland-sauder-core.md（reactivity 的社会学奠基）
