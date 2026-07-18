# 反应性的形式理论 II：委托代理、Performative Prediction、Strategic Classification、经济学操演性、好调节器定理、选优即虚高

> **本报告的位置。** 项目既有报告已从三个方向打过反应性的形式地基：06 号（委托-代理 / Baker distortion-risk / Goodhart 分类 / Salganik）、07 号（Soros 反身性 / Merton 自我实现 / Peltzman 负反馈）、08 号（Ashby 必要多样性 / Beer VSM / Deming / Bevan-Hood）。那三份报告把"测量改变对象"证成了一个多学科定理的交汇点。本报告做的是**把交汇点上最硬的六条数学线各自挖到底、挖到最新**——尤其补上两块既有报告几乎空白、而 2020 年以来极其活跃的领域：**performative prediction（操演性预测）** 与 **strategic classification（策略性分类）**。这两块是"反应性"在机器学习里的正式再发现，把 Espeland-Sauder 的社会学叙事、Soros 的反身性、Goodhart 的民间定律，全部重写成了有收敛定理、有博弈均衡、有算法的对象。
>
> 每条一手论文给作者·年份·期刊/会议·URL（scholar 的给被引数与 PDF 直链）；关键处给精确定义与引文；逐条做讹传考证；每节末标 2024–2026 进展与开放问题。凡与 06/07/08 重复的地基（Holmström-Milgrom 的努力再配置直觉、Ashby "only variety can destroy variety"、Soros boom-bust）只作接口引用，不重复展开。

本报告细分出的六条主线：

1. **委托-代理的多任务形式化（深化）**——把 06 号的 distortion-risk 补完为完整的 LEN 模型链：Feltham-Xie 的 congruity 分解、Dewatripont-Jewitt-Tirole 的 task clustering、Ederer-Holden-Meyer 的**策略性不透明（把指标保密写成最优合同）**、Bénabou-Tirole 的 bonus culture、Holmström 2017 诺奖讲座的收束。
2. **Performative Prediction**——Perdomo-Zrnic-Mendler-Dünner-Hardt 2020 的框架：performative risk、performative stability（RRM 不动点）vs performative optimality、收敛的 Lipschitz/强凸条件；到 performative power（2022）、Wisconsin 学校实证（2025）、Hardt-Mendler-Dünner 2025 综述、Kehrenberg 2026 大综述。**这是反应性的 ML 本体。**
3. **Strategic Classification**——Hardt-Megiddo-Papadimitriou-Wootters 2016 的 Stackelberg 博弈；social cost（Milli 2019）；**gaming vs improvement 与"任何激励改进的机制都必须解一个因果推断问题"（Miller-Milli-Hardt 2020）**；causal strategic regression（Shavit 2020）；who-leads-who-follows（Zrnic 2021，连接到 performative prediction）。
4. **经济学操演性**——MacKenzie-Millo 2003 的衍生品交易所田野；MacKenzie 2006《An Engine, Not a Camera》的**四分类学（generic / effective / Barnesian / counterperformativity）**；Black-Scholes 从 Barnesian 到 1987 崩盘 counterperformativity 的翻转；Callon 1998；批评（Mäki、Brisset、Mirowski-Nik-Khah）；2024 年把 MacKenzie 与 performative prediction 正式焊接的"An engine not a camera: performative power of online search"。
5. **控制论——好调节器定理**——从 Ashby 必要多样性（08 已证）向上到 **Conant-Ashby 1970 好调节器定理"every good regulator must be a model"** 的精确内容、被过度诠释的考证（Scholten 2010）、2025 年的 Bayesian/internal-model 重释（Baltieri 等）与多尺度重述（Siegenfeld-Bar-Yam）、AI 对齐接口。
6. **选优即虚高——选择偏差的统计学**——optimizer's curse（Smith-Winkler 2006）的精确命题与 Bayes 校正；winner's curse 谱系（Capen-Clapp-Campbell 1971 → Thaler 1988）；regression to the mean；post-selection inference（Berk-Brown-Buja 2013）；garden of forking paths（Gelman-Loken）；deflated Sharpe ratio（Bailey-López de Prado 2014）；以及 **2024–2026 把它搬进 LLM 评测的最新工作（Zrnic-Fithian winner's-curse defense、Xu 等 SIREN）**。

---

## 子主线 1：委托-代理的多任务形式化（深化 06 号）

### 核心脉络

06 号已给出 Holmström-Milgrom（1991）的"努力再配置"直觉和 Baker（1992/2002）的 distortion-risk 二分。本节把这条线补完为一个**自洽的形式模型链**，让"为什么强优化一个代理指标必然牺牲不可测维度"成为可写下的方程，而非直觉。

**（a）LEN 模型：反应性的可解析骨架。** 现代多任务契约几乎都用 **LEN 模型**（Linear contract, Exponential utility, Normal noise）：产出信号 y = μ(e) + ε，ε ~ N(0, Σ)；委托人给线性合同 w = α + β′y；代理人有 CARA 效用与凸努力成本 C(e)。在此设定下最优激励强度有闭式解，核心是 **β\* = (行为响应)·(边际价值)/(1 + r·风险·噪声)**——激励强度随**风险厌恶 r 与信号噪声方差**上升而下降。这就是"信号越吵、代理人越怕险，越该弱化激励"的精确版，也是 06 号"最优合同可能是零提成"的一般机制。Holmström 在 2017 年 AER 诺奖讲座 *Pay for Performance and Beyond*（[AER 107(7):1753-1777](https://www.aeaweb.org/articles?id=10.1257/aer.107.7.1753)，被引 197）里把这条线亲自收束，并明确用 multitask extension 论证：**"当努力可在任务间替代、且某些任务测不准时，对可测任务施加高能激励会主动把努力从不可测任务抽走；此时最优 β 可能趋近于零"**——即"informativeness principle"与"equal compensation principle"。

**（b）Feltham-Xie（1994）：把"坏指标"拆成 congruity × noise 两个正交病灶。** 这是本节相对 06 号最重要的深化。出处：Feltham, G. A. & Xie, J. (1994). "Performance Measure Congruity and Diversity in Multi-Task Principal/Agent Relations." *The Accounting Review*, 69(3), 429–453，[JSTOR 248233](https://www.jstor.org/stable/248233)，被引 **1801**。他们证明了一个干净的分解（原文摘要精确措辞）：**"if the performance measure is [not] perfectly congruent... [it] induces suboptimal effort allocation across tasks, whereas performance measure noise results in suboptimal effort intensity."**（不完全 congruent 的指标→跨任务的努力**配置**扭曲；指标噪声→努力**强度**扭曲。）也就是把 Baker 的 distortion 精确定名为 **congruity 缺失**（指标向量与真实价值向量的方向不对齐→努力被分配到错的任务），把 risk 精确定名为 **noise**（努力强度被压低）。**反应性因此有了两个可分别诊断的病灶**：一个指标"被 Goodhart"的程度 = 它的 congruity 缺口；而"越优化越发散"的强度 = congruity 缺口 × 激励强度 β。这比 06 号更精细：**加权综合指标之所以危险，正因为提高任一子指标权重都在改变整个指标向量的方向，几乎不可能与高维真实价值向量对齐**（这与 06 号 A3 节 Arrow/Saisana 的"综合指数内在任意"在数学上同源）。

**（c）Dewatripont-Jewitt-Tirole（2000）：task clustering 与"焦点"。** 出处：Dewatripont, M., Jewitt, I. & Tirole, J. (2000). "Multitask agency problems: Focus and task clustering." *European Economic Review*, 44(4–6), 869–877，[ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0014292100000593)，被引 265。推论：当任务的可测性差异很大时，最优的**组织设计**是把可测性相近的任务**聚成一岗**（task clustering），而不是让同一个代理人同时背负"高度可测"与"高度不可测"的任务——否则高能激励必然掏空后者。这给反应性一个组织学处方：**别把'冲得动的指标'与'冲不动但重要的价值'塞进同一个考核对象**（对应 08 号 Beer 的 variety engineering 与"配对指标"）。

**（d）Ederer-Holden-Meyer（2018）：把"保密指标"写成最优合同——反 gaming 的形式化。** 出处：Ederer, F., Holden, R. & Meyer, M. (2018). "Gaming and strategic opacity in incentive provision." *The RAND Journal of Economics*, 49(4), 819–854，[Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/1756-2171.12253)，被引 86（工作论文 2013）。他们在多任务道德风险模型里证明：当代理人能**观察到考核规则并据此 game**（把努力堆到被加权的维度），委托人的最优反应常常是 **strategic opacity（策略性不透明）**——**故意不告诉代理人各任务的权重**，让代理人无法针对性冲量，从而被迫在所有维度上均衡投入。**这是 08 号 Bevan-Hood"引入不可预测性/随机审计/事后公布权重"的严格微观基础**：保密不是行政偷懒，而是可以从一阶条件推出的最优机制。它也预告了子主线 3（strategic classification）里"该不该向被分类者公开分类器"的博弈。

**（e）Bénabou-Tirole（2016）：bonus culture 的多任务筛选。** 出处：Bénabou, R. & Tirole, J. (2016). "Bonus Culture: Competitive Pay, Screening, and Multitasking." *Journal of Political Economy*, 124(2), 305–370，[U Chicago](https://www.journals.uchicago.edu/doi/abs/10.1086/684853)，被引 364。他们把 multitask 与劳动力市场竞争、筛选结合：竞争性高薪环境会**内生地放大对可测维度的过度投入**，把整个行业推向"重量轻质"的均衡——这是 06 号 Bénabou-Tirole 2003（动机挤出）在市场层面的续篇，也解释了金融/科技业的"KPI 军备竞赛"为何是均衡而非个体失范。

### 一手来源清单

- Holmström, B. & Milgrom, P. (1991). "Multitask Principal–Agent Analyses." *JLEO* 7(SI):24–52.（06 号已详，接口引用）
- Baker, G. (1992/2002). distortion vs. risk.（06 号已详）
- **Feltham, G. A. & Xie, J. (1994). "Performance Measure Congruity and Diversity in Multi-Task Principal/Agent Relations." *The Accounting Review* 69(3):429–453.** [JSTOR 248233](https://www.jstor.org/stable/248233)（被引 1801）
- **Dewatripont, M., Jewitt, I. & Tirole, J. (2000). "Multitask agency problems: Focus and task clustering." *European Economic Review* 44(4–6):869–877.** [链接](https://www.sciencedirect.com/science/article/pii/S0014292100000593)（被引 265）
- **Ederer, F., Holden, R. & Meyer, M. (2018). "Gaming and strategic opacity in incentive provision." *RAND J. of Economics* 49(4):819–854.** [Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/1756-2171.12253)（被引 86）
- **Bénabou, R. & Tirole, J. (2016). "Bonus Culture: Competitive Pay, Screening, and Multitasking." *JPE* 124(2):305–370.** [U Chicago](https://www.journals.uchicago.edu/doi/abs/10.1086/684853)（被引 364）
- **Holmström, B. (2017). "Pay for Performance and Beyond." *American Economic Review* 107(7):1753–1777.**（诺奖讲座）[AER](https://www.aeaweb.org/articles?id=10.1257/aer.107.7.1753)（被引 197）

### 求证与纠讹

- **"informativeness principle" 的常见误读**：常被通俗化为"能测就该纳入激励"。Holmström 的原命题恰相反——一个信号该以多大权重进入合同，取决于它对**努力**的信息量（贝叶斯充分性），而**当它对不可测维度的努力毫无信息、却对可测维度高度敏感时，纳入它反而有害**。把 informativeness 读成"多测多奖"是把定理读反了。
- **"balanced scorecard 解决了多任务问题"是被高估的宣称**：Budde（2007, *J. Accounting Research* 45(3)，[Wiley](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1475-679X.2007.00246.x)）在 LEN 框架里证明，平衡计分卡只是把 congruity 问题从"单指标"搬到"指标向量的权重选择"，并未消除它——**只要真实价值是高维隐含的，任何有限维加权指标组都存在残余 congruity 缺口**。

### 2024–2026 最新进展

- Dai, T., Ke, R. & Ryan, C. T. (2021, 持续被引). "Incentive design for operations-marketing multitasking." *Management Science*（被引 37）——把 congruity-noise 权衡搬进运营-营销跨部门场景。
- Xu, K. & Bastani, H. (2025). "Multitask learning and bandits via robust statistics." *Management Science*（被引 20）——多任务的**在线**版本，与子主线 2 的 performative 在线学习接壤。
- 一批 2024–2026 工作把 inequity aversion / network effects 加进多任务道德风险（Claveria-Mayol 2024 "Moral Hazard with Network Effects", arXiv:2406.11660），提示反应性在**同侪比较**下会被进一步放大。

### 开放问题

1. **动态多任务下的最优不透明**：Ederer-Holden-Meyer 是静态的；当委托人反复公布考核、代理人反复学习时，"保密指标"的最优程度如何随时间演化？（与子主线 2 的 RRM 收敛、子主线 3 的重复 Stackelberg 是同一问题的三种语言，尚未统一。）
2. **congruity 的可估计性**：Feltham-Xie 的 congruity 是理论量；在真实场景里如何**从数据估计**一个指标的 congruity 缺口？这直接决定能否事前判断一个 eval 会不会被 Goodhart。目前无成熟方法。

---

## 子主线 2：Performative Prediction——反应性的机器学习本体

### 核心脉络

这是本报告最重要的新增。**Performative prediction 是 Espeland-Sauder 反应性、Soros 反身性、Merton 自我实现预言在监督学习里的正式重铸**——它把"预测改变被预测对象"从社会学观察变成一个有收敛定理的优化问题。

**（a）奠基：Perdomo, Zrnic, Mendler-Dünner & Hardt（2020）。** 出处：Perdomo, J., Zrnic, T., Mendler-Dünner, C. & Hardt, M. (2020). "Performative Prediction." *ICML 2020*，[PMLR v119](https://proceedings.mlr.press/v119/perdomo20a.html)，[PDF](http://proceedings.mlr.press/v119/perdomo20a/perdomo20a.pdf)，被引 **690**。开篇的精确定义：**"When predictions support decisions they may influence the outcome they aim to predict. We call such predictions performative; the prediction influences the target."** 形式框架：

- **决策依赖的分布映射 D(θ)**：部署模型参数 θ 会诱导数据分布 D(θ)（而非固定分布 D）。这一步就是把"反应性"写进了目标函数——**分布本身是决策的函数**。
- **Performative risk**：PR(θ) = E_{z∼D(θ)} ℓ(z; θ)。注意 θ 出现两次：一次在损失里，一次在分布里。
- **两个不同的解概念（本领域的中枢）**：
  - **Performatively stable point θ_PS**：满足 θ_PS ∈ argmin_θ E_{z∼D(θ_PS)} ℓ(z; θ)——**在自己诱导的分布上是最优的**，即"重复风险最小化（Repeated Risk Minimization, RRM）"的**不动点**。它对应 Soros 的"均衡"、performativity 的"自我印证收敛点"。
  - **Performatively optimal point θ_PO**：真正最小化 PR(θ) 的点，**考虑到自己会改变分布**。
  - **关键定理：稳定 ≠ 最优。** performative stability 与 performative optimality 一般**不重合**（原文："performative stability and performative optimality need not [coincide]"）。这是整个领域的招牌反直觉结论：**天真地反复重训（RRM）会收敛到一个稳定点，但那个稳定点通常不是你真正想要的最优点**——它是被系统"拖"到的自证均衡，而非考虑了反馈之后的最优。这正是 Goodhart / 反应性的严格版：优化一个会回应你的系统，收敛到的是不动点而非真优。
- **收敛条件**：他们证明当损失 γ-强凸、分布映射 ε-Lipschitz（ε 度量"数据对模型有多敏感"，即反应性强度）且 ε 相对 γ 足够小（ε < γ/β 之类）时，**RRM 是压缩映射，指数收敛到唯一稳定点**；当 ε 太大（反应性过强），RRM 可能**不收敛**。翻译成反应性语言：**反应性强度低时，反复优化会稳定；反应性强度高时，反复优化会震荡/发散**——这与 Soros 的 far-from-equilibrium 和 08 号 Deming 漏斗实验的 tampering 发散，是同一件事的定量化。

**（b）优化真正的 performative risk：Miller-Perdomo-Zrnic（2021）"Outside the Echo Chamber"。** 出处：[PMLR v139](http://proceedings.mlr.press/v139/miller21a.html)，被引 179。RRM 只能到稳定点（"echo chamber"，回音室——你只看见自己诱导的分布）；要到 performative optimality，必须**跳出回音室**去优化考虑了分布响应的目标。他们给出 PR(θ) 凸的充分条件（"mixture dominance"）并给出优化算法。**"回音室"这个词本身就是反应性的绝妙隐喻**：天真优化者永远只在自己制造的分布里打转。

**（c）随机优化与"部署 vs. 更新"的区分。** Mendler-Dünner, Perdomo, Zrnic & Hardt (2020). "Stochastic Optimization for Performative Prediction." *NeurIPS 2020*，[链接](https://proceedings.neurips.cc/paper/2020/hash/33e75ff09dd601bbe69f351039152189-Abstract.html)，被引 199。核心洞见：**"更新参数"与"部署新模型"是两回事**——只有部署才触发分布漂移。由此有 greedy deploy（每步都部署）vs. lazy deploy 的权衡。Izzo-Ying-Zou (2021) "How to learn when data reacts to your model: performative gradient descent"（PerfGD，[PMLR](https://proceedings.mlr.press/v139/); 被引 125）进一步给出估计分布梯度的方法。

**（d）Performative Power（2022）——把 MacKenzie 的"引擎"量化。** 出处：Hardt, M., Jagadeesan, M. & Mendler-Dünner, C. (2022). "Performative Power." *NeurIPS 2022*，[链接](https://proceedings.neurips.cc/paper_files/paper/2022/hash/90e73f3cf1a6c84c723a2e8b7fb2b2c1-Abstract-Conference.html)，被引 103。定义：performative power 度量**一个厂商通过其预测/算法"steer（操舵）"参与者分布的能力**（"the extent to which the firm is able to steer participants"）。低 performative power → 厂商基本是"相机"（只反映）；高 performative power → 厂商是"引擎"（塑造）。**这是把 Soros 反身性、MacKenzie performativity 的"引擎不是相机"变成可测量的市场势力指标**，并直接接上反垄断/数字市场治理。

**（e）诚实预测的激励与"多主体混沌"。**
- Oesterheld, Treutlein, Cooper & Hudson (2023). "Incentivizing honest performative predictions with proper scoring rules." *UAI 2023*（被引 19）——当预测者知道自己的预测会改变结果时，标准 proper scoring rule **不再**诱导诚实；他们刻画了何时能恢复诚实。**这是"评测者本身也在 performative 回路里"的形式化**（对应 08 号 Shirky 原则）。
- Piliouras & Yu (2023). "Multi-agent performative prediction: From global stability and optimality to chaos." *ACM EC 2023*（被引 68）——多个学习者同时 performative 时，动力学可从收敛跌入**混沌**。这是 Soros far-from-equilibrium 的严格版。

### 精确引文/数据

- 反应性强度的形式化：**ε-Lipschitz 的分布映射**，ε 就是"数据对模型的敏感度"。RRM 收敛的充分条件本质是 **ε < γ/β**（反应性 < 曲率/光滑度之比）——**反应性一旦超过这个阈值，天真重训不再收敛**。这是"越优化越发散"第一次有了可写下的阈值。
- **稳定 vs 最优的差距**可以任意大：Perdomo et al. 证明"any distance from optimality δ > 0 can [be achieved by a stable point]"——**稳定点可以离最优点任意远**。用反应性的话说：一个自我印证的均衡可以是任意糟糕的均衡。

### 求证与纠讹

- **"performativity 是 Perdomo 等人发明的"——错。** 他们在 2020 论文开篇即承认 performativity 是"a well-studied phenomenon in policy-making that has so far been neglected in supervised learning"，并明确追溯到经济学操演性（MacKenzie）与社会学（Merton）。**ML 版是形式化，不是原创发现**——这与 07 号里 Soros 诚实追认 Knight/Keynes/Merton/Popper 是同构的诚实。
- **"performative stability = 好结果"——严重误解。** 大量应用论文把"重训收敛了"当作成功信号。原始理论恰恰警告：**收敛到稳定点几乎从不等于到达最优**；把 RRM 收敛当胜利，是 Goodhart 的教科书陷阱。

### 2024–2026 最新进展（本领域近三年爆发）

- **综述（必读）**：Hardt, M. & Mendler-Dünner, C. (2025). "Performative Prediction: Past and Future." *Statistical Science* 40(3)，[Project Euclid](https://projecteuclid.org/journals/statistical-science/volume-40/issue-3/Performative-Prediction-Past-and-Future/10.1214/25-STS986.short)，[arXiv:2310.16608](https://arxiv.org/pdf/2310.16608)，被引 **96**——领域两位奠基者的五年回顾，系统串起 stable points、retraining 收敛、performative power。
- **大综述**：Kehrenberg, T., Sanguino Bautiste, F. J. & Lozano, J. A. et al. (2026). "Dissecting Performative Prediction: A Comprehensive Survey." *ACM Computing Surveys*，[dl.acm.org](https://dl.acm.org/)（被引 1）。
- **实证（罕见且重要）**：Perdomo, J. C., Britton, T., Hardt, M. & Abebe, R. (2025). "Difficult Lessons on Social Prediction from Wisconsin Public Schools." *ACM EAAMO/FAccT 2025*，[dl.acm.org](https://dl.acm.org/doi/abs/10.1145/3715275.3732175)，被引 **63**。用威斯康星州 **Dropout Early Warning System（DEWS）十年数据**检验预测系统，发现预测**准确地按辍学风险排序了学生**，但"predictive models may provide little additional insight... beyond simply ranking students according to the aggregate performance of [their schools]"——**即预测系统在很大程度上只是在复述学校层面的既有不平等**。这是 performative prediction 少有的真实世界证据，也直击"预测系统是否只是自证既有结构"。
- **可预测性再审视**：Perdomo, J. C. (2025). "Revisiting the predictability of performative, social events." [arXiv:2503.11713](https://arxiv.org/abs/2503.11713)（被引 15）。
- **算法集体行动**（反向利用 performativity）：Hardt, Mazumdar, Mendler-Dünner et al. (2023). "Algorithmic collective action in machine learning." *ICML*（被引 56）；Sigg, Hardt & Mendler-Dünner (2025). "Decline Now: A Combinatorial Model for Algorithmic Collective Action." *CHI 2025*（被引 14）——用户**联合**改变数据以反向操舵模型，是 performative power 的对偶。
- 因果估计 performativity（无需随机化）：Cheng, Hardt & Mendler-Dünner (2024). "Causal Inference out of Control: Estimating Performativity without Treatment Randomization." *ICML 2024*（被引 7）。
- 大量理论扩展（2024–2026）：distributionally robust performative optimization（NeurIPS 2025/2026）、tight lower bounds & improved convergence（NeurIPS 2026）、performative RL（Mandal et al. 2023–2024）、nonlinear/neural performative prediction（Mofakhami 2023；Zhong-Liu-Liu 2025–2026）、statistical inference under performativity（NeurIPS 2026）。
- **哲学/伦理接口**：Khosrowi, Ahlers & van Basshuysen (2025). "When Predictions are More Than Predictions: Self-Fulfilling Performativity and the Road Towards Morally Responsible Predictive Systems." *FAccT 2025*（被引 6）；Zezulka & Genin (2025). "Prediction, Performativity, and Potential Outcomes." *ACM EAAMO*（被引 2）——把 performative prediction 与因果推断的 potential outcomes 框架对接。

### 开放问题

1. **稳定与最优之差的可控性**：现有算法能到 performative optimality 只在强假设（mixture dominance、光滑分布映射）下成立。**一般（非凸、stateful、高反应性）情形下能否高效逼近 performative optimum，仍未解**。
2. **stateful / 有记忆的 performativity**：Brown-Hod-Kalemaj (2022) 的 stateful world 里，分布不仅依赖当前模型还依赖历史——这更贴近真实社会，但收敛理论远不完整。
3. **多主体 performativity 的均衡选择**：Piliouras-Yu 证明可陷入混沌；哪些机制能把多学习者系统拉回收敛，是开放的（与子主线 3 的多主体 strategic classification 汇流）。
4. **performative power 的经验测量**：Mendler-Dünner et al. 2024 在搜索引擎上测了一次（见子主线 4），但把 performative power 变成可审计的市场指标，方法学仍处早期。

---

## 子主线 3：Strategic Classification——被评估者作为博弈对手

### 核心脉络

如果说 performative prediction 是"分布对模型的反应"，strategic classification 是它的**博弈论特例**：被分类的**个体理性地修改自己的特征**以获得有利分类。这是 Goodhart"被评估者会 game 指标"的严格博弈化。

**（a）奠基：Hardt, Megiddo, Papadimitriou & Wootters（2016）。** 出处："Strategic Classification." *ITCS 2016*，[dl.acm.org](https://dl.acm.org/)，被引 **628**。设定为 **Stackelberg 博弈**：委托人（jury）先承诺一个分类器 f；被分类者（contestant）观察 f，付出成本 c(x, x′) 把特征从 x 改到 x′ 以翻转分类。求解 jury 的最优承诺 = Stackelberg 领导者最优。**前身**：Brückner & Scheffer (2011). "Stackelberg games for adversarial prediction problems." *KDD*（被引 362）；Dalvi et al. (2004) 的对抗分类。

**（b）社会成本：Milli, Miller, Dragan & Hardt（2019）。** 出处："The Social Cost of Strategic Classification." *FAT\* 2019*，[dl.acm.org](https://dl.acm.org/doi/abs/10.1145/3287560.3287576)，被引 286。核心命题（精确）：**"any increase in institutional utility [from moving to the Stackelberg-optimal classifier] leads to a corresponding increase in social burden."** 即机构为防 gaming 而把门槛抬到 Stackelberg 最优，**必然把成本转嫁到被分类者身上**，且**弱势群体承担的 social burden 更高**（因为他们改特征的成本更高）。这是反应性的分配正义维度：**防 gaming 的收紧本身是累退的**——直接呼应 06 号 B 部分"指标是弱者武器"的反面（防作弊的技术会伤弱者）。Hu, Immorlica & Vaughan (2019). "The disparate effects of strategic manipulation." *FAT\**（被引 239）给出同向证据。

**（c）本主线的理论枢纽：gaming vs. improvement，以及"激励改进必须解因果推断"。** 这是 strategic classification 最深的结果，也是它与因果推断的焊点。
- **区分**：agent 改特征可能是 **gaming**（只改表象、不改真实结果，如刷简历关键词）或 **improvement**（真的变好，如真学会技能）。委托人当然想诱导后者。
- **不可能性/难度定理**：Miller, Milli & Hardt (2020). "Strategic Classification Is Causal Modeling in Disguise." *ICML 2020*，[PMLR v119](http://proceedings.mlr.press/v119/miller20b)，被引 180。原文结论（精确）：**"any procedure for designing classifiers that incentivize improvement must inevitably solve a non-trivial causal inference problem... much of the prior work on strategic classification is causal modeling in disguise."** 即**只要你想设计一个"诱导真改进而非刷分"的评估机制，你就不可避免地要解一个因果推断问题**（哪些特征**因果地**决定真实结果）。这把 Goodhart 提升为一条认识论定理：**分不清 gaming 与 improvement，等价于不知道特征→结果的因果结构；而后者一般不可从观测数据识别。**
- **绕过难度的办法**：Shavit, Edelman & Axelrod (2020). "Causal Strategic Linear Regression." *ICML 2020*，[PMLR v119](http://proceedings.mlr.press/v119/shavit20a.html)，被引 121——让决策者**主动测试一系列决策规则、观察 agent 响应**（即"through the decision rules perform causal interventions"），从而识别因果系数。**这等于说：要防 Goodhart，评估者必须把评估当作一连串因果实验，而非一次性打分**（对应 08 号"eval 作 tin-opener 触发追问"）。
- Bechavod, Ligett, Wu et al. (2021). "Gaming Helps! Learning from Strategic Interactions in Natural Dynamics." *AISTATS*（被引 77）——反直觉：agent 的 gaming 行为**泄露了因果信息**，反而帮助学到真正诱导改进的机制。Kleinberg & Raghavan (2020). "How Do Classifiers Induce Agents to Invest Effort Strategically?" *ACM TEAC*（被引 238）给出干净刻画：**"whenever any 'reasonable' mechanism can [incentivize real effort], a simple linear mechanism suffices"**——诱导真努力时线性机制就够，暗示复杂评分反而不必要。
- Ahmadi, Beyhaghi, Blum & Naggita (2022). "On classification of strategic agents who can both game and improve." *FORC*（被引 42）——同时含 gaming 与 improvement 的学习理论刻画。

**（d）Who leads, who follows：把 strategic classification 接回 performative prediction。** Zrnic, Mazumdar, Sastry & Jordan (2021). "Who Leads and Who Follows in Strategic Classification?" *NeurIPS 2021*，[链接](https://proceedings.neurips.cc/)，被引 103。洞见：Stackelberg 的"谁先动"取决于双方**更新速度**；当 agent 反应快于 learner 重训时，learner 事实上成了跟随者——**strategic classification 与 performative prediction 是同一博弈在不同时间尺度上的两个面**。这是两大文献的正式桥梁。

**（e）微观基础与"暗中分类"。** Jagadeesan, Mendler-Dünner & Hardt (2021). "Alternative Microfoundations for Strategic Classification." *ICML*（被引 78）——指出标准模型的"个体完全理性、成本已知"假设脆弱，群体层面的响应可能定性不同。Ghalme et al. (2021). "Strategic Classification in the Dark." *ICML*（被引 113）与 Levanon-Rosenfeld (2021). "Strategic Classification Made Practical"（被引 107）处理"分类器是否公开"（呼应子主线 1 的 Ederer-Holden-Meyer 策略性不透明）。

### 精确引文/数据

- Miller-Milli-Hardt 2020 摘要原句：**"We prove any procedure for designing classifiers that incentivize improvement must inevitably solve a non-trivial causal inference problem."**
- Milli et al. 2019：机构效用↑ ⇒ social burden↑，且弱势群体 burden 更高——**防 gaming 的收紧是累退的**。

### 求证与纠讹

- **"strategic classification = 对抗鲁棒性（adversarial robustness）"——常见混淆。** 二者数学相近但语义相反：对抗样本是**恶意扰动、不改真实标签**；strategic agent 是**理性自利、可能真改结果**。把二者等同会错过 gaming/improvement 的关键区分（Miller-Milli-Hardt 的全部要害）。
- **"防 gaming 就是把门槛抬高"——被证明是短视的。** Milli et al. 证明这条路有累退的社会成本；Shavit et al./Bechavod et al. 证明**因果化的、实验式的**机制才能真正诱导改进而非把成本转嫁。

### 2024–2026 最新进展

- **综述**：Podimata, C. (2025). "Incentive-aware machine learning; robustness, fairness, improvement & causality." *ACM SIGecom Exchanges*（被引 9）——把 strategic classification 五年成果结构化。
- **LLM 作为策略性主体**：Xie, Rauch & Zhang (2025). "How strategic agents respond: Comparing analytical models with LLM-generated responses in strategic classification." [arXiv:2501.16355](https://arxiv.org/abs/2501.16355)；Lv et al. (2026). "Beyond rational illusion: Behaviorally realistic strategic classification." arXiv——用 LLM 模拟真实（有限理性）的策略响应，发现与经典完全理性模型**定性不同**。这对 AI eval 极关键：**被评测的 AI 本身就是一个能推理评测规则的策略性主体**，比人类 agent 更善于 game。
- **效率-公平-改进的权衡**：Efthymiou, Podimata et al. (2026). "Incentivizing desirable effort profiles in strategic classification: The role of causality and uncertainty." *NeurIPS 2026*（被引 11）；Alhanouti & Naghizadeh (2024/2025). "Anticipating Gaming to Incentivize Improvement in (Fair) Strategic Classification"。
- **公共管理实证桥接**：Han, X. & Wang, W. (2023). "Does granting managerial autonomy in exchange for accountability mitigate gaming?" *Public Administration Review*（被引 14）——把 strategic gaming 的理论接回 08 号 Bevan-Hood 的真实官僚场景。
- **检测 gaming**：Chang, Warrenburg, Park et al. (2024). "Who's gaming the system? A causally-motivated approach for detecting strategic adaptation." *NeurIPS*（被引 13）。

### 开放问题

1. **有限理性 agent 的 strategic classification**：经典理论假设完全理性；LLM/人类都非如此。behaviorally realistic 模型（2026 起步）尚无成熟理论。
2. **改进 vs 刷分的可识别性边界**：Miller-Milli-Hardt 证明需要因果推断；但在**无法做干预实验**（如高利害一次性评测）的场景，能否退而用工具变量/自然实验识别？（Harris et al. 2022 "Strategic IV regression" 是起步。）
3. **AI 评测的自指难题**：当被评测者是能读懂评测规则并推理的 AI 时，strategic classification 与 performative prediction 合流成一个"评测者与被评测者互为 Stackelberg"的动态博弈，几乎无现成理论。

---

## 子主线 4：经济学操演性——从 Barnesian 到 counterperformativity

### 核心脉络

07 号已把 Soros 反身性讲透，并给出 reactivity / performativity / reflexivity 的三方对照。本节专门深挖**经济社会学的操演性纲领**（MacKenzie / Callon），它是"理论/模型塑造它所描述的市场"这一命题的最扎实的历史社会学证据链，也是子主线 2（performative power）的思想母体。

**（a）Callon（1998）：'economics performs the economy'。** 出处：Callon, M. (ed.) (1998). *The Laws of the Markets*. Oxford: Blackwell/Sociological Review。核心命题：**经济学不是对一个先在经济的描述，而是市场得以运转的构成性成分**——"the economy is embedded not in society but in economics"。市场需要 **calculative agencies（计算性行为体）** 与把外部性"框定/溢出"（framing/overflowing）的装置；经济学理论正是提供这些框定的工具。这是把波兰尼的"embeddedness"倒过来说，也是 MacKenzie 田野的理论纲领。

**（b）MacKenzie & Millo（2003）：衍生品交易所的历史社会学——操演性最硬的实证。** 出处：MacKenzie, D. & Millo, Y. (2003). "Constructing a Market, Performing Theory: The Historical Sociology of a Financial Derivatives Exchange." *American Journal of Sociology*, 109(1), 107–145，[U Chicago](https://www.journals.uchicago.edu/doi/abs/10.1086/230091)，被引 **2303**。田野对象是芝加哥期权交易所（CBOE）。发现：Black-Scholes-Merton 期权定价模型 1973 年发布时，实际市场价格**偏离**模型；但随着交易者用模型定价、用它做套利、把它印在计算器和交易单上，**市场价格逐渐向模型收敛**——到 1970s 末，模型的经验拟合度显著提高。**不是模型准确描述了市场，而是市场被模型改造得越来越像模型。**

**（c）MacKenzie（2006）：《An Engine, Not a Camera》与四分类学。** 出处：MacKenzie, D. (2006). *An Engine, Not a Camera: How Financial Models Shape Markets*. MIT Press，[Google Books](https://books.google.com/books?id=gtmGDwAAQBAJ)，被引 **4884**；浓缩为期刊文章 MacKenzie, D. (2006/2007). "Is Economics Performative? Option Theory and the Construction of Derivatives Markets." *J. of the History of Economic Thought*，[LSE PDF](https://personal.lse.ac.uk/ROBERT49/teaching/ph232/pdf/MacKenzie-Performative.pdf)，被引 960。书名取自弥尔顿·弗里德曼语境的反转——经济学不是拍摄经济的**相机**，而是驱动它的**引擎**。**四层分类学（本节最该记住的精确区分）**：

| 层级 | 定义 | 例子 |
|---|---|---|
| **Generic performativity** | 一个经济学面向被市场参与者实际**使用** | 交易员用 Black-Scholes 公式 |
| **Effective performativity** | 这种使用**造成了差别**（不用它市场会不同） | 用公式改变了定价行为 |
| **Barnesian performativity** | 使用使经济过程**更像**理论的描述（自我印证/放大） | 期权价格向 B-S 模型收敛（1973–87） |
| **Counterperformativity** | 使用使经济过程**更不像**理论的描述（自我抵消） | 组合保险 + B-S 假设助推 1987 崩盘，事后 B-S 拟合度反而变差 |

精确措辞（MacKenzie 2007）：Barnesian performativity 指 **"the practical use of an aspect of economics makes economic processes more like their depiction by economics"**；counterperformativity 则是使之**更不像**。"Barnesian" 之名取自爱丁堡学派 Barry Barnes 的自我印证社会学。

**（d）counterperformativity 的经典案例：1987 崩盘。** MacKenzie (2004). "The big, bad wolf and the rational market: portfolio insurance, the 1987 crash and the performativity of economics." *Economy and Society*, 33(3):303–334，[T&F](https://www.tandfonline.com/doi/abs/10.1080/0308514042000225680)，被引 469。论证：基于 B-S 式对冲逻辑的 **portfolio insurance（组合保险）** 被广泛采用，在 1987 年 10 月制造了自我强化的抛售螺旋，**放大**了崩盘；而崩盘后市场出现了 B-S 模型无法解释的 **volatility smile（波动率微笑）**——**模型的经验有效性被它自身的普及所摧毁**。这是 07 号"counterperformativity = 负反馈 = self-defeating prophecy"抵消轴的最锋利实证：**一个理论可以因为太多人相信它而变得不真。**

### 求证与纠讹

- **"performativity = 一切理论都自我实现"——被 MacKenzie 本人明确否定。** 他的四分类学的全部要点就是：generic ≠ effective ≠ Barnesian，而且存在方向相反的 counterperformativity。**把 performativity 读成"经济学总能自证"是把它读成了单向教条**，恰恰抹掉了它最有价值的区分（放大 vs 抵消）。这与 07 号对 Soros 的告诫、08 号对 Peltzman "完全抵消" 的降格一脉相承。
- **Mäki 的哲学纠偏："Saving Austin from MacKenzie"。** Mäki, U. (2013). *EPSA11*，[LSE PDF](https://personal.lse.ac.uk/robert49/teaching/ph232/pdf/Maki-SavingAustinFromMacKenzie.pdf)，被引 121。论点：MacKenzie 借用 Austin 的 performative utterance 概念时**用词过松**——Austin 的 performative 是"说即做"（如"我宣布你们结为夫妻"），而市场向模型收敛是一个**因果的社会过程**，不是语言学意义的 performative。Mäki 主张把"performativity"的哲学含义收紧，避免修辞滑坡。**这是对操演性最实质的分析哲学批评。**
- **Brisset 的限度论。** Brisset, N. (2016). "Economics is not always performative: some limits for performativity." *J. of Economic Methodology*, 23(2)（被引 73）；(2017) "On performativity: option theory and the resistance of financial phenomena." *JHET*（被引 23）；成书 Brisset (2018). *Economics and Performativity: Exploring Limits, Theories and Cases*. Routledge（被引 61）。核心："financial phenomena resist"——**并非任何理论都能操演成功；一个理论要 Barnesian 地自我实现，需要制度、利益、物质装置的配合，且会遇到现实的抵抗**。他给出操演成功的边界条件。
- **Mirowski & Nik-Khah 的政治经济学批评（最尖锐）。** Mirowski, P. & Nik-Khah, E. (2007). "Markets made flesh: performativity, and a problem in science studies, augmented with consideration of the FCC auctions." in *Do Economists Make Markets?*，[academia PDF](https://www.academia.edu/download/59425967/Performativity_and_a_Problem_in_Science20190528-100840-1gipxmk.pdf)，被引 317；扩展为 *The Knowledge We Have Lost in Information* (2017, Oxford UP，被引 416)。核心指控：STS 的 performativity 学者**天真地接受了新古典经济学（尤其市场设计/信息经济学）的自我叙事**，把"经济学家造市场"当成中性的社会学发现，**掩盖了市场设计背后的意识形态与权力**（如 FCC 频谱拍卖）。他们主张：不能脱离"哪一种经济学、为谁的利益"来谈 performativity。**这是把操演性从社会学观察拉回政治经济学批判的关键反声。**
- **Marti & Gond 的边界条件综合。** Marti, E. & Gond, J.-P. (2018). "When do theories become self-fulfilling? Exploring the boundary conditions of performativity." *Academy of Management Review*, 43(3)（被引 236）；(2019) "How do theories become self-fulfilling? Clarifying the process of Barnesian performativity." *AMR*（被引 31）。他们系统整理了 Barnesian 自我实现**需要满足的条件**（理论被用作行动脚本、有配套装置、无强反制），把 MacKenzie 的历史叙事提炼成可检验的命题——**这是把操演性与子主线 2 的 performative stability 条件对接的社会学侧。**

### 2024–2026 最新进展

- **操演性与 ML 的正式焊接（本报告的关键交汇）**：Mendler-Dünner, C., Carovano, G. & Hardt, M. (2024). "An Engine, Not a Camera: Measuring Performative Power of Online Search." *NeurIPS 2024*，[链接](https://proceedings.neurips.cc/)，被引 14。**标题直接取自 MacKenzie 2006**，用真实搜索引擎实验测量 performative power——**这是经济社会学的操演性与 ML 的 performative prediction 五十年后合流的标志性论文。**
- **元综述**：Ünal, S. N., Polillo, S., Çalışkan, K. & MacKenzie, D. (2025). "The modes of performativity: A meta-theoretical review." *Finance and Society*（被引 12）——由 MacKenzie 本人参与，梳理操演性的诸种模式，是该纲领近年最权威的总结。
- Leonardi, P. M. & Leavell, V. (2024). "How the map becomes the territory: prediction, performativity and the process of taking digital twins for granted." *J. of Organization Design*（被引 10）——把操演性搬到数字孪生/AI 预测。
- Svetlova, E. & Arnoldi, J. (2026). "The end of theory? AI and ignorance in financial markets." *Finance and Society*（被引 2）——AI 黑箱模型的操演性与"无知"。

### 开放问题

1. **算法操演性 ≠ 理论操演性？** MacKenzie 的案例里操演的是**可读的理论**（B-S 公式）；当操演者是**不可解释的深度模型**时，Barnesian/counter 的区分是否还适用？（Svetlova-Arnoldi 2026 提出但未解。）
2. **counterperformativity 的预测**：我们能事前判断一个模型的普及会 Barnesian（放大）还是 counter（抵消）吗？MacKenzie 只能事后叙事；子主线 2 的 ε-Lipschitz 阈值提供了一个候选判据，但两套语言尚未对接。
3. **Mirowski 之问的形式化**：performative power（子主线 2）测量了"操舵能力"，但没测"为谁的利益操舵"。把权力/分配维度纳入形式框架，仍空白。

---

## 子主线 5：控制论——从必要多样性到"好调节器定理"

### 核心脉络

08 号已把 Ashby 必要多样性定律（"only variety can destroy variety"，V(O) ≥ V(D) − V(R)）证成"单一 KPI 无法约束复杂系统"的信息论下界。本节向上追一层，到 Ashby 思想里更深、也更常被误用的一条定理——**好调节器定理**，它回答的不是"能否控制"，而是"要控制好，调节器内部必须是什么"。

**（a）Conant & Ashby（1970）：every good regulator must be a model。** 出处：Conant, R. C. & Ashby, W. R. (1970). "Every good regulator of a system must be a model of that system." *International Journal of Systems Science*, 1(2), 89–97，[Taylor & Francis](https://www.tandfonline.com/doi/abs/10.1080/00207727008920220)，被引 **2071**。**精确的数学内容（务必与流行口号区分）**：定理证明的是——一个**最优的**（使被调节系统输出的熵最小的）、**确定性的**调节器 R，其行为必然是被调节系统状态 S 的一个**映射（mapping/homomorphism）h: S → R**。换言之，**最优调节器的动作是"系统状态的函数"，这个函数关系就被称作调节器"是系统的一个模型"。**

关键在于：这里的"模型"**不是**一个丰富的、显式的、图景式的内部表征，而只是一个**同态映射**——调节器的输出被系统状态所决定。**把它读成"要控制好就必须在脑内建一个逼真的世界模型"是过度诠释。**

**（b）它为什么是反应性/度量治理的深层根据。** 把好调节器定理与必要多样性并置，得到一个比 08 号更强的结论：
- 必要多样性说：调节器的**多样性** V(R) 必须 ≥ 扰动多样性 V(D)（**够不够**的问题）。
- 好调节器定理说：即便多样性够了，调节器的动作还必须是被调节系统的**正确同态像**（**对不对**的问题）。
- 合起来：**要良好地治理一个复杂系统，你的调节器（KPI 体系）既要有足够的多样性去匹配系统，又要在结构上是系统的一个忠实模型。** 一个**标量 KPI** 在这两点上都破产：它的 V(R) ≈ 1 ≪ V(D)（多样性不足），且它作为"模型"是系统的一个**极度退化的投影**（同态像坍缩到一维）。**"用一个分数管理通用能力"= 用一个把系统压成一维的坏模型去当调节器——既不够多样，也不是忠实模型。** 这给了 08 号"synecdoche 谬误"一个更硬的控制论根据。
- 这条推理与子主线 3 的 Miller-Milli-Hardt "要诱导改进必须做因果建模" **在结构上同构**：**好的调节/评估要求你有被调节系统的（因果）模型**；scalar eval 恰恰是"没有模型的调节"。

**（c）Beer 的 VSM 与 algedonic 信号（08 已详，接口引用）。** Beer 把好调节器定理落进 VSM：管理层（S3–S5）必须内建一个环境模型（S4），且靠 algedonic（痛/快）信号绕过总量指标的平滑。见 08 号第二节。

### 求证与纠讹

- **好调节器定理最常见的三重误读**（本节核心考证）：
  1. **"model = 丰富的内部世界模型"**——错。原定理的"model"只是一个**同态映射**（system state → regulator action）。把它当作认知科学意义的"世界模型"、乃至用来论证"AGI 必须有世界模型"，是把一个关于最优确定性调节器的结构性结论过度引申。**Scholten, D. (2010). "A Primer for Conant and Ashby's Good-Regulator Theorem."**（[cadia.ru.is PDF](http://cadia.ru.is/wiki/_media/public:t-720-atai:a_primer_for_conant_and_ashby_s_good-regulator_theorem.pdf)，被引 8）专门澄清了原证明的前提与范围——他用"every good key must be a model of the lock it opens"（每把好钥匙都必须是它所开之锁的模型）作类比，强调"是模型"只在**同态**的弱意义上成立。
  2. **"定理证明了调节需要模型"**——半错。定理假设调节器已经是**最优且确定性**的；它**没有**证明"必须先建模才能调节"，而是证明"**若**调节达到最优，**则**其结构可被解读为模型"。因果方向常被讲反。
  3. **原证明有技术空隙**：Scholten (2010) 与后续（Stone & Alicea, "The Foundations of Control and Cognition: The Every Good Regulator Theorem"）指出原始证明在"确定性""最优性"假设上并不完全严密，需要补足。**引用时应带上这条 caution，而非把它当作无争议的铁律。**
- **Ashby "absorb" vs "destroy" 的讹传**（08 号已纠，此处接口）：注意本主线的搜索里又出现 Broekstra (2014) "Only variety absorbs complexity" ——**"absorb" 仍是 Beer 的管理学改写，Ashby 原文是 "destroy"**。另有 Bryant (2021) "Only behaviour can destroy behaviour" 的行为学重述，忠实保留了 "destroy"。

### 2024–2026 最新进展

- **Bayesian / internal-model-principle 重释**：Baltieri, M., Biehl, M., Capucci, M. & Virgo, N. (2025). "A Bayesian interpretation of the internal model principle." [arXiv:2503.00511](https://arxiv.org/abs/2503.00511)（被引 7）——用现代贝叶斯/范畴论语言重述好调节器定理与控制论的 internal model principle，**把"调节器是系统的模型"精确化为"调节器编码了系统的（贝叶斯）后验"**。这是该定理五十年来最实质的形式化更新，也把它接上了 active inference / free-energy 一派。
- **多尺度必要多样性**：Siegenfeld, A. F. & Bar-Yam, Y. (2025). "A Formal Definition of Scale-Dependent Complexity and the Multi-Scale Law of Requisite Variety." *Entropy*（被引 8）——把 Ashby 定律推广到**多尺度**：一个系统在不同尺度上有不同的复杂度，调节器必须在**每个相关尺度**上匹配多样性。**对 eval 的含义：一个只在'平均分'尺度上匹配的评测，必然在'个例/尾部/子群'尺度上失控**（呼应 08 号 algedonic 与子主线 6 的尾部选择偏差）。
- **热力学根据**：Boyd, Mandal & Crutchfield (2017, 持续被引). "Leveraging environmental correlations: The thermodynamics of requisite variety." *J. Statistical Physics*（被引 58）——给必要多样性一个**物理（热力学第二定律）**根据。
- **AI 对齐接口**：Aliman, N.-M. & Kester, L. (2019, 持续被引). "Requisite variety in ethical utility functions for AI value alignment." [arXiv:1907.00430](https://arxiv.org/abs/1907.00430)（被引 36）——把必要多样性用于论证**AI 的价值函数必须有足够多样性去匹配人类价值的多样性**，否则对齐必然在未覆盖维度失败。这与 06 号 Zhuang-Hadfield-Menell（代理只覆盖 J<L 特征则无限优化致效用任意低）是**同一定理的两次独立证明**（控制论侧 vs. ML 侧）。

### 开放问题

1. **好调节器定理的非最优/随机推广**：真实的评测/调节既非最优也非确定性。随机、有界理性的调节器"是系统的模型"到什么程度？Baltieri 2025 起步但未完成。
2. **"够多样"与"是忠实模型"的联合下界**：必要多样性给了 V(R) ≥ V(D)，好调节器给了结构约束，但**两者联合的定量下界**（既要多样又要忠实的最小调节器复杂度）尚无统一刻画。这正是"最少要多少维、多忠实的 eval 组合才能约束一个通用模型"的理论核心。

---

## 子主线 6：选优即虚高——选择偏差的统计学

### 核心脉络

前五条线讲"被测者会回应测量"。本节讲一个**即使被测者完全不回应、诚实静止，也依然发生**的机制：**只要你按带噪的估计值去挑选"最优者"，被挑中者的真值系统性地低于其估计值。** 这是反应性之外的第二种"排名虚高"来源，且是纯统计的、不可通过"让人别作弊"消除的。

**（a）Optimizer's Curse（优化者诅咒）：Smith & Winkler（2006）。** 出处：Smith, J. E. & Winkler, R. L. (2006). "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis." *Management Science*, 52(3), 311–322，[INFORMS](https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1050.0451)，[PDF](http://www.johncbutler.com/Curses/SmithWinkler.pdf)，被引 489。**精确命题（原文摘要）**：**"if we take these value estimates at face value and select accordingly, we should expect the value of the chosen alternative to be less than its estimate, even if the value estimates are unbiased... not because of any inherent bias in the estimates themselves, but because of the optimization-based selection process."** 即：**哪怕每个候选的估值都无偏，一旦你按估值挑最大者，被挑中者的真实价值期望低于其估值**——因为 argmax 这个操作**系统性地选中了正向噪声最大的候选**。他们提出用 **Bayesian 校正（对估值做收缩/shrinkage）** 作为"disciplined skepticism（有纪律的怀疑）"来消除事后失望。**这是 06 号 regressional Goodhart（顺序统计量直觉）的决策论正式版**，也是"按 eval 分数挑最好模型 → 该模型真实能力低于其分数"的直接根据。

**（b）Winner's Curse（赢者诅咒）：谱系考证。** 
- **起源（常被误记）**：不是拍卖理论家先提的，而是三位**石油工程师**在竞标墨西哥湾油田租约时提出的。出处：**Capen, E. C., Clapp, R. V. & Campbell, W. M. (1971). "Competitive Bidding in High-Risk Situations." *Journal of Petroleum Technology*, 23(6), 641–653.** 他们观察到中标者往往是**最高估了油田价值**的公司，故"赢了拍卖却亏了钱"。
- **进入经济学正典**：Kagel, J. H. & Levin, D. (1986). "The Winner's Curse and Public Information in Common Value Auctions." *American Economic Review*, 76(5)，[JSTOR 1816459](https://www.jstor.org/stable/1816459)（被引 1127）——实验室证据。通俗化：**Thaler, R. H. (1988). "Anomalies: The Winner's Curse." *Journal of Economic Perspectives*, 2(1), 191–202**，[AEA](https://www.aeaweb.org/articles?id=10.1257/jep.2.1.191)（被引 887）。
- **机制**：与 optimizer's curse 同源——common value 拍卖里，中标 = 估值分布的**上序统计量**，故中标者系统性高估。**"最高出价者"= "正向误差最大者"。**

**（c）Regression to the Mean（向均值回归）：Galton → Kahneman → 组织场景。** 高尔顿（1886）的原始现象：极端父母的子女趋向平均。Kahneman 在《思考，快与慢》里反复强调它被系统性忽视（表扬后表现下降、批评后上升，常被误读为奖惩的因果效应，实为回归）。**组织/选拔场景的正式化**：Harrison, J. R. (1995). "Regression to the mean, expectation inflation, and the winner's curse in organizational contexts." in *Negotiation as a Social Process*（[ResearchGate PDF](https://www.researchgate.net/profile/J-Harrison-2/publication/232586280)）——**把 regression、expectation inflation、winner's curse 三者统一**：按当期高分选中的单位，下期会向均值回归，于是"明星招进来就退步"被误判为管理失败，实为选择偏差。**这对"选出高分模型后真实表现回落"是直接的解释框架。**

**（d）Post-Selection Inference（PoSI）与多重比较：为什么"选后再推断"必须校正。**
- **Berk, R., Brown, L., Buja, A., Zhang, K. & Zhao, L. (2013). "Valid post-selection inference." *The Annals of Statistics*, 41(2), 802–837**，[JSTOR 23566582](https://www.jstor.org/stable/23566582)（被引 890）——奠定 PoSI：**先用数据选模型、再用同一数据做推断，标准置信区间/p 值失效**，必须做同时性校正。相关：Lee, Sun, Sun & Taylor (2016). "Exact post-selection inference, with application to the lasso." *Annals of Statistics*（被引 1152）；Fithian, Sun & Taylor (2014). "Optimal inference after model selection"（被引 470）。
- **Garden of Forking Paths（岔路花园）**：Gelman, A. & Loken, E. (2013/2014). "The garden of forking paths: Why multiple comparisons can be a problem, even when there is no 'fishing expedition' or 'p-hacking'." [Columbia PDF](https://sites.stat.columbia.edu/gelman/research/unpublished/p_hacking.pdf)（被引 1340）——**即使研究者没有主动 p-hacking，只要分析选择依赖于数据，隐含的多重比较就已经使名义显著性虚高。** 这是"按数据挑最显著的发现 → 该发现虚高"的最锋利陈述。
- **Ioannidis, J. P. A. (2005). "Why Most Published Research Findings Are False." *PLoS Medicine*, 2(8):e124**，[PLoS](https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0020124)（被引 **16185**）——把选择偏差、低功效、多重检验综合成"多数已发表发现为假"的贝叶斯论证。**这是"按显著性/榜单选优必然虚高"的流行病学总纲。**

**（e）金融版：Deflated Sharpe Ratio 与 False Strategy Theorem。** Bailey, D. H. & López de Prado, M. (2014). "The Deflated Sharpe Ratio: Correcting for Selection Bias, Backtest Overfitting, and Non-Normality." *Journal of Portfolio Management*, 40(5), 94–107，[PDF](https://www.pm-research.com/content/iijpormgmt%3A%3A%3A40%3A%3A%3A5%3A%3A%3A94.full.pdf)（被引 291）；López de Prado & Bailey (2021). "The False Strategy Theorem." *American Mathematical Monthly*（被引 15）。核心：**当你回测了 N 个策略只报告最好的那个，其 Sharpe ratio 因选择偏差而系统性虚高**；deflated Sharpe ratio 用极值理论校正掉"试了多少个策略"的影响。**这是"跑很多实验只报最好"在量化投资里的正式解毒剂**——与 eval 的"跑很多 checkpoint 只发布最高分"完全同构。

### 精确引文/数据

- Smith-Winkler 2006 的要害：**argmax 的期望后悔可以很大**，且**与估值本身是否无偏无关**——它纯粹来自"按估值选"这个动作。校正法：Bayesian shrinkage。
- Ioannidis 2005 的推论：**在多数关系为假、检验众多、预选择弱的领域，一个"显著"发现为真的后验概率可以远低于 50%。**

### 求证与纠讹

- **"无偏估计 → 选出来的就无偏"——这是 optimizer's curse 要打破的最核心直觉。** 单个估计无偏，但 **max(估计) 对 max(真值) 是有偏（上偏）的**。把"每个估计无偏"当作"选择结果可信"，是所有"排行榜虚高"的认识论错误起点（与 06 号操作主义"指标即构念"的错误同级）。
- **"winner's curse 是 Thaler 提出的"——不准确。** 概念源自 Capen-Clapp-Campbell 1971（石油工程师），Thaler 1988 是把它推广为经济学 anomaly 的通俗化者。
- **regression to the mean 被系统性误读为因果**（Kahneman 的核心警告）：奖惩后的表现变化常被归因于奖惩，实为回归。**"去年榜首今年跌"不需要任何'反应性'来解释——纯回归就够。** 研究者必须先扣除回归，才能主张剩余的下降是反应性/Goodhart。

### 2024–2026 最新进展（选择偏差正式进入 LLM 评测）

- **winner's curse 的现代防御**：Zrnic, T. & Fithian, W. (2024). "A Flexible Defense Against the Winner's Curse." [arXiv:2411.18569](https://arxiv.org/abs/2411.18569)（被引 7）——**注意 Zrnic 正是 performative prediction 的共同奠基者**，她把选择偏差与反应性两条线握在同一人手里。相关：Zrnic & Fithian (2024). "Locally simultaneous inference." *Annals of Statistics*（被引 21）。
- **直接搬进 LLM 评测（本节与项目主线的焊点）**：Xu, Y., Zhang, J., Sun, H. et al. (2026). "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking." [arXiv:2605.05973](https://arxiv.org/abs/2605.05973)。精确论点：**"Adaptive prompt and program search makes LLM evaluation selection-sensitive. Once benchmark items are reused inside tuning, the observed winner's score need not estimate the fresh-data performance of the full tune-then-deploy procedure."** 他们提出 **SIREN**（selection-aware repeated-split reporting）协议，用 held-out 分离 + bootstrap 给出**校正后的、诚实的**评测区间，并在 MMLU-Pro 上证明 **"winner-based reporting can be optimistic and can change deployment conclusions"**——**即天真地报告"最高分模型/prompt"会乐观虚高，甚至改变部署决策。** 这是 optimizer's curse / winner's curse 在 AI eval 里的正式落地，直接支撑项目的 eval 退化假说。
- **排名后的推断**：Petrou-Zeniou, A. & Shaikh, A. M. (2024). "Inference After Ranking with Applications to Economic Mobility." [arXiv:2410.19212](https://arxiv.org/abs/2410.19212)；Zhang, Lee & Lei (2024). "Winners with confidence: Discrete argmin inference with an application to model selection." arXiv（被引 12）——给"排名/选优之后如何做有效推断"提供新工具。
- **金融 ML 的谱系延续**：Nikolopoulos (2026). "Spurious Predictability in Financial Machine Learning"；de Prado & Lipton (2026). "Sharpe ratio inference: A new standard for decision-making and reporting." *J. of Portfolio Management*（被引 4）。

### 开放问题

1. **反应性 vs 选择偏差的分离**："榜首模型真实能力低于分数"里，多少来自 Goodhart（反应性）、多少来自 optimizer's curse（纯选择）？二者叠加，但**分离它们需要既有反应性模型又有选择偏差校正的联合框架**——目前无人做到。这可能是 eval 退化假说最需要的下一步。
2. **自适应评测的持续校正**：SIREN 是一次性校正；当榜单**持续**被用来筛选、且被筛选者会适应（strategic）时，选择偏差与反应性交织，如何持续给出诚实区间，未解。
3. **多尺度选择偏差**：Siegenfeld-Bar-Yam（子主线 5）的多尺度视角提示，选择偏差在不同粒度（总分 vs 子任务 vs 单样本）上强度不同；尾部/子群的 winner's curse 往往被平均分掩盖，尚无系统刻画。

---

## 综合：六条线是同一条定理

把六条线叠起来，会看到它们不是六个类比，而是**同一个不变式在六种数学语言里的六次证明**：

> **当你用一个（低维、带噪、可被回应的）指标去优化或选择一个（高维、会回应的）系统时，你收敛到的不是系统的真优，而是"指标的不动点 / 博弈的均衡 / 选择偏差的上序统计量 / 退化模型的同态像"——它系统性地偏离真值，且偏离量随优化压力单调上升。**

六种语言的对应：

| 线 | 语言 | "真优 ≠ 你得到的" 的名字 | 偏离的驱动量 |
|---|---|---|---|
| 1 委托代理 | 契约论 | congruity 缺口 × 激励强度 β | 激励强度、任务可替代性 |
| 2 performative prediction | 优化/不动点 | performative **stability ≠ optimality** | 反应性 ε（分布 Lipschitz 常数） |
| 3 strategic classification | Stackelberg 博弈 | gaming 均衡 ≠ improvement | agent 成本、是否公开分类器 |
| 4 经济学操演性 | 历史社会学 | Barnesian 自证 / counter 自毁 | 理论被用作行动脚本的程度 |
| 5 好调节器定理 | 控制论 | 调节器是系统的**退化同态像** | V(R)/V(D) 与模型忠实度 |
| 6 选择偏差 | 统计学 | optimizer's / winner's curse | 候选数 N、噪声方差、选择强度 |

**三个最重要的新发现/纠讹（相对既有 06/07/08）：**

1. **Performative prediction 给了反应性一个可写下的阈值。** RRM 收敛的充分条件 ε < γ/β 是"越优化越发散"第一次被定量化：**反应性强度低于阈值，反复优化会稳定；高于阈值，反复优化会震荡/发散**（与 Deming 漏斗 tampering、Soros far-from-equilibrium 精确对应）。而且 **performative stability 与 optimality 一般不重合、可任意远**——"重训收敛"绝不等于"到达真优"，这是 Goodhart 的严格版。

2. **"要防 Goodhart 就必须做因果建模"是一条定理，不是口号。** Miller-Milli-Hardt (2020) 证明：任何"诱导真改进而非刷分"的评估机制**都必须解一个非平凡的因果推断问题**；而好调节器定理（Conant-Ashby 1970）独立地证明：**任何良好的调节器都必须是被调节系统的（同态）模型**。两者合流：**scalar eval = 没有因果模型的调节 = 注定被 game。** 出路是把评估当作一连串因果干预（Shavit et al.），即 08 号"eval 作 tin-opener"的形式化。

3. **选优即虚高是独立于反应性的第二种退化源，且已正式进入 LLM 评测。** Optimizer's curse（Smith-Winkler 2006）证明：**即便被测者完全不作弊、估值完全无偏，按分数选最优者也会系统性虚高。** 2024–2026 的 Zrnic-Fithian、Xu 等 SIREN 把这套统计学直接搬进了 LLM 评测，证明 **"报告榜首分数会乐观虚高、甚至改变部署结论"**。**这意味着 eval 退化至少有两条彼此独立的通道——反应性（被评者回应）与选择偏差（评者选优）——而目前没有任何框架把二者分离并联合校正，这是项目最该继续挖的开放问题。**

**几处关键考证/纠讹小结：**
- **好调节器定理的"model"只是同态映射，不是丰富世界模型**；原证明有"最优+确定性"的前提与技术空隙（Scholten 2010）——引用时勿把它当无争议铁律。
- **MacKenzie 的操演性是四分层的（generic/effective/Barnesian/counter），且明确包含反方向的 counterperformativity**；把 performativity 读成"经济学总能自证"是抹掉其最有价值的区分（Mäki、Brisset、Mirowski-Nik-Khah 的批评都指向这一点）。
- **winner's curse 源自 Capen-Clapp-Campbell 1971（石油工程师），非 Thaler**；Thaler 1988 是通俗化者。
- **regression to the mean 足以单独解释"榜首回落"，无需反应性**——研究者须先扣除回归，才能归因于 Goodhart。
- **performativity / performative prediction 都非其提出者原创**（Perdomo et al. 明确追溯 policy-making 与 MacKenzie）——与 07 号 Soros 诚实追认先驱同构。

---

## 来源总表（按子主线分组）

**子主线 1：委托代理多任务**
- Feltham & Xie (1994), *Accounting Review* 69(3):429–453 — https://www.jstor.org/stable/248233
- Dewatripont, Jewitt & Tirole (2000), *European Economic Review* 44(4–6):869–877 — https://www.sciencedirect.com/science/article/pii/S0014292100000593
- Ederer, Holden & Meyer (2018), *RAND J. of Economics* 49(4):819–854 — https://onlinelibrary.wiley.com/doi/abs/10.1111/1756-2171.12253
- Bénabou & Tirole (2016), *JPE* 124(2):305–370 — https://www.journals.uchicago.edu/doi/abs/10.1086/684853
- Holmström (2017), *AER* 107(7):1753–1777 — https://www.aeaweb.org/articles?id=10.1257/aer.107.7.1753
- Budde (2007), *J. Accounting Research* 45(3) — https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1475-679X.2007.00246.x

**子主线 2：Performative Prediction**
- Perdomo, Zrnic, Mendler-Dünner & Hardt (2020), *ICML* — https://proceedings.mlr.press/v119/perdomo20a.html
- Mendler-Dünner, Perdomo, Zrnic & Hardt (2020), *NeurIPS* — https://proceedings.neurips.cc/paper/2020/hash/33e75ff09dd601bbe69f351039152189-Abstract.html
- Miller, Perdomo & Zrnic (2021), "Outside the Echo Chamber," *ICML* — http://proceedings.mlr.press/v139/miller21a.html
- Izzo, Ying & Zou (2021), "Performative Gradient Descent," *ICML* — https://proceedings.mlr.press/v139/
- Hardt, Jagadeesan & Mendler-Dünner (2022), "Performative Power," *NeurIPS* — https://proceedings.neurips.cc/paper_files/paper/2022/hash/90e73f3cf1a6c84c723a2e8b7fb2b2c1-Abstract-Conference.html
- Brown, Hod & Kalemaj (2022), "Performative Prediction in a Stateful World," *AISTATS*
- Oesterheld et al. (2023), "Incentivizing honest performative predictions," *UAI*
- Piliouras & Yu (2023), "Multi-agent performative prediction... to chaos," *ACM EC*
- **Hardt & Mendler-Dünner (2025), "Performative Prediction: Past and Future," *Statistical Science* 40(3)** — https://projecteuclid.org/journals/statistical-science/volume-40/issue-3/... ; https://arxiv.org/pdf/2310.16608
- **Perdomo, Britton, Hardt & Abebe (2025), "Difficult Lessons... Wisconsin Public Schools," *ACM EAAMO/FAccT*** — https://dl.acm.org/doi/abs/10.1145/3715275.3732175
- Perdomo (2025), "Revisiting the predictability of performative, social events," arXiv:2503.11713
- Kehrenberg et al. (2026), "Dissecting Performative Prediction: A Comprehensive Survey," *ACM Computing Surveys*
- Cheng, Hardt & Mendler-Dünner (2024), "Causal Inference out of Control," *ICML*
- Khosrowi, Ahlers & van Basshuysen (2025), "When Predictions are More Than Predictions," *FAccT*

**子主线 3：Strategic Classification**
- Hardt, Megiddo, Papadimitriou & Wootters (2016), "Strategic Classification," *ITCS* (cited 628)
- Brückner & Scheffer (2011), "Stackelberg games for adversarial prediction," *KDD*
- Milli, Miller, Dragan & Hardt (2019), "The Social Cost of Strategic Classification," *FAT\** — https://dl.acm.org/doi/abs/10.1145/3287560.3287576
- **Miller, Milli & Hardt (2020), "Strategic Classification Is Causal Modeling in Disguise," *ICML*** — http://proceedings.mlr.press/v119/miller20b
- Shavit, Edelman & Axelrod (2020), "Causal Strategic Linear Regression," *ICML* — http://proceedings.mlr.press/v119/shavit20a.html
- Bechavod, Ligett, Wu et al. (2021), "Gaming Helps!," *AISTATS* — https://proceedings.mlr.press/v130/bechavod21a.html
- Kleinberg & Raghavan (2020), "How Do Classifiers Induce Agents to Invest Effort Strategically?," *ACM TEAC* — https://dl.acm.org/doi/abs/10.1145/3417742
- Ahmadi, Beyhaghi, Blum & Naggita (2022), "On classification of strategic agents who can both game and improve," arXiv:2203.00124
- Zrnic, Mazumdar, Sastry & Jordan (2021), "Who Leads and Who Follows in Strategic Classification?," *NeurIPS*
- Jagadeesan, Mendler-Dünner & Hardt (2021), "Alternative Microfoundations for Strategic Classification," *ICML*
- Podimata (2025), "Incentive-aware machine learning," *ACM SIGecom Exchanges*
- Xie, Rauch & Zhang (2025), "How strategic agents respond: ... LLM-generated responses," arXiv:2501.16355
- Han & Wang (2023), "Does granting managerial autonomy... mitigate gaming?," *Public Administration Review*

**子主线 4：经济学操演性**
- Callon (ed.) (1998), *The Laws of the Markets*, Blackwell
- MacKenzie & Millo (2003), *AJS* 109(1):107–145 — https://www.journals.uchicago.edu/doi/abs/10.1086/230091
- MacKenzie (2006), *An Engine, Not a Camera*, MIT Press — https://books.google.com/books?id=gtmGDwAAQBAJ
- MacKenzie (2006/2007), "Is Economics Performative?," *JHET* — https://personal.lse.ac.uk/ROBERT49/teaching/ph232/pdf/MacKenzie-Performative.pdf
- MacKenzie (2004), "The big, bad wolf... 1987 crash," *Economy and Society* 33(3):303–334 — https://www.tandfonline.com/doi/abs/10.1080/0308514042000225680
- Callon (2007), "What does it mean to say that economics is performative," in *Do Economists Make Markets?*
- Mäki (2013), "Performativity: Saving Austin from MacKenzie," *EPSA11* — https://personal.lse.ac.uk/robert49/teaching/ph232/pdf/Maki-SavingAustinFromMacKenzie.pdf
- Brisset (2016), "Economics is not always performative," *J. Economic Methodology* 23(2); Brisset (2018), *Economics and Performativity*, Routledge
- Mirowski & Nik-Khah (2007), "Markets made flesh," in *Do Economists Make Markets?* — https://www.academia.edu/download/59425967/... ; (2017) *The Knowledge We Have Lost in Information*, Oxford UP
- Marti & Gond (2018), "When do theories become self-fulfilling?," *AMR* 43(3); (2019) "How do theories become self-fulfilling?," *AMR*
- **Mendler-Dünner, Carovano & Hardt (2024), "An Engine, Not a Camera: Measuring Performative Power of Online Search," *NeurIPS***
- Ünal, Polillo, Çalışkan & MacKenzie (2025), "The modes of performativity: A meta-theoretical review," *Finance and Society*

**子主线 5：控制论 / 好调节器定理**
- Conant & Ashby (1970), "Every good regulator of a system must be a model of that system," *Int. J. Systems Science* 1(2):89–97 — https://www.tandfonline.com/doi/abs/10.1080/00207727008920220
- Scholten (2010), "A Primer for Conant and Ashby's Good-Regulator Theorem" — http://cadia.ru.is/wiki/_media/public:t-720-atai:a_primer_for_conant_and_ashby_s_good-regulator_theorem.pdf
- Stone & Alicea, "The Foundations of Control and Cognition: The Every Good Regulator Theorem" (ResearchGate)
- **Baltieri, Biehl, Capucci & Virgo (2025), "A Bayesian interpretation of the internal model principle," arXiv:2503.00511**
- **Siegenfeld & Bar-Yam (2025), "A Formal Definition of Scale-Dependent Complexity and the Multi-Scale Law of Requisite Variety," *Entropy***
- Boyd, Mandal & Crutchfield (2017), "The thermodynamics of requisite variety," *J. Statistical Physics*
- Aliman & Kester (2019), "Requisite variety in ethical utility functions for AI value alignment," arXiv:1907.00430
- Ashby, W. R. (1956), *An Introduction to Cybernetics*, ch.11（08 号已详）；Beer, VSM（08 号已详）

**子主线 6：选择偏差统计学**
- Smith & Winkler (2006), "The Optimizer's Curse," *Management Science* 52(3):311–322 — https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1050.0451 ; http://www.johncbutler.com/Curses/SmithWinkler.pdf
- Capen, Clapp & Campbell (1971), "Competitive Bidding in High-Risk Situations," *J. Petroleum Technology* 23(6):641–653
- Kagel & Levin (1986), *AER* 76(5) — https://www.jstor.org/stable/1816459 ; Thaler (1988), *JEP* 2(1):191–202 — https://www.aeaweb.org/articles?id=10.1257/jep.2.1.191
- Harrison (1995), "Regression to the mean, expectation inflation, and the winner's curse in organizational contexts"
- Berk, Brown, Buja, Zhang & Zhao (2013), "Valid post-selection inference," *Annals of Statistics* 41(2):802–837 — https://www.jstor.org/stable/23566582
- Lee, Sun, Sun & Taylor (2016), "Exact post-selection inference... lasso," *Annals of Statistics*
- Gelman & Loken (2013/2014), "The garden of forking paths" — https://sites.stat.columbia.edu/gelman/research/unpublished/p_hacking.pdf
- Ioannidis (2005), "Why Most Published Research Findings Are False," *PLoS Medicine* 2(8):e124 — https://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0020124
- Bailey & López de Prado (2014), "The Deflated Sharpe Ratio," *J. Portfolio Management* 40(5):94–107 ; López de Prado & Bailey (2021), "The False Strategy Theorem," *American Mathematical Monthly*
- **Zrnic & Fithian (2024), "A Flexible Defense Against the Winner's Curse," arXiv:2411.18569** ; "Locally simultaneous inference," *Annals of Statistics* (2024)
- **Xu, Zhang, Sun et al. (2026), "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking," arXiv:2605.05973**（SIREN 协议）
- Petrou-Zeniou & Shaikh (2024), "Inference After Ranking," arXiv:2410.19212

**AI eval 榜单交叉引用**
- Singh, Nan, Wang, Dsouza et al. (2025/2026), "The Leaderboard Illusion," *NeurIPS D&B*（约 2M Chatbot Arena battles；见 05/08 号）
- "Position: Benchmarking is Broken — Don't Let AI be its Own Judge," *NeurIPS 2025*

> **项目内交叉引用**：本报告深化并接续 06（distortion-risk、Goodhart 分类、Salganik）、07（Soros 反身性、Merton self-defeating、Peltzman 负反馈）、08（Ashby 必要多样性、Beer VSM、Deming、Bevan-Hood、Leaderboard Illusion）。相对既有报告，本报告的主要新增是：**(i) performative prediction 与 strategic classification 两大 ML 形式化（把反应性变成有收敛定理与博弈均衡的对象）；(ii) 好调节器定理这一层控制论根据（"调节好=建模好"，scalar eval=没有模型的调节）；(iii) 选择偏差作为独立于反应性的第二种 eval 退化通道，及其 2024–2026 在 LLM 评测中的正式落地。**
