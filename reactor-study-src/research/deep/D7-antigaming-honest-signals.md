# D7 · 抗博弈的度量设计 + 诚实信号理论（深化篇）

> 排名反应性研究项目 · 深化研究 D7
> 加深/更新对象：`research/10-honest-signals-antigaming.md`（"诚实信号理论 + 抗 Goodhart 的度量设计"）
> 撰写日期：2026-07-18。方法论遵循 `research/deep/_METHOD.md`：细分子主线、补一手文献、纠讹传、补 2024–2026 最新、标注开放问题。**本篇不复述报告 10 已充分展开的内容**（Zahavi 基本盘、Bevan-Hood 三分法、tin opener 直觉、Meehl/Kahneman 结构化判断、AI eval checklist），而是把每条线挖到"下一层"，并订正报告 10 里若干不够精确之处。

---

## 这个领域拓展出的五条更细主线

报告 10 把问题切成 A（诚实信号理论）/B（抗博弈度量）两大块。深挖后，真正有新增量、且能相互咬合的，是下面五条更细的主线：

1. **障碍原理之争的"第三幕"完整版**：诚实信号的现代内核已经从"浪费即诚实"→"差异化成本（differential cost）"→再到 2023–2026 的"**权衡（trade-offs），成本与收益都可为零**"。Penn-Számadó 与 Grafen 阵营的两方立场要讲清；订正报告 10"cost differential 是终点"的说法——它已被"trade-offs"取代。
2. **信号的成本 = 利益冲突的函数**（生物学↔经济学的真正桥梁）：Crawford-Sobel 的 cheap talk 证明"利益足够一致时，诚实是免费的"；Lachmann-Számadó-Bergstrom 证明"**维持诚实所需的成本，与冲突程度成正比**"。这是报告 10 完全缺失、却是最有操作价值的一条定理。
3. **Skin in the game 的机制化——以及 bonding 本身如何被博弈**：从 Taleb/汉谟拉比（含订正）到 Dodd-Frank 5% 风险自留这一真实的"抵押"机制，再到关键发现：**抵押品可被对冲掉，skin in the game 自身会被 Goodhart**。补 2025 的 AI-agent 质押（staking）协议。
4. **度量设计的思想史与讹传法证**：POSIWID 的 Beer 归属复核、Deming"costly myth"的精确订正、tin openers 的正确出处（订正报告 10 的引注错误）、Muller 的 10 条处方清单、Kaplan-Norton 平衡计分卡的 Nørreklit 反驳（订正报告 10 对 BSC 过于乐观的判断）。
5. **机制设计的硬定理——抗操纵度量的数学边界**：Gibbard-Satterthwaite 不可能性、impartial selection（把"不能给自己打分"变成定理）、proper scoring rules + peer prediction + BTS（处理不可验证信号）、以及 2026 的"strategyproof 排名聚合不可能"与"strategy-robust RLHF"。这条线给报告 10 的工程 checklist 补上了它缺的**数学天花板与可证明的代价**。

---

## 主线 D7-1：障碍原理之争的"第三幕"——从 differential cost 到 trade-offs

### 核心脉络

报告 10 已把故事讲到"第三幕"（Számadó 2011 / Penn-Számadó 2020：诚实由**作弊的边际成本**维持，而非均衡上的绝对浪费）。深挖后要修正一个报告 10 自己也踩到的表述：**"differential cost（成本差异）"并不是这场争论的终点，而是中途站**。2013 年以后，同一批作者（Számadó、Zachar、Penn、Bergstrom、Lachmann）把结论进一步一般化为"**权衡（trade-offs）**"：诚实既可由**差异化成本**维持，也可由**差异化收益**维持，均衡上的信号成本可以严格为零。

三条并行的现代机制（都不需要"浪费"）：

- **差异化边际成本**（differential cost）：低质量者谎报的边际成本更高（Grafen 1990 的条件依赖 ESS 属于此类）。
- **差异化收益 / 权衡**（differential benefit / trade-off）：即使信号对所有人成本相同甚至为零，只要不同质量个体从同一信号强度获得的**净收益**不同，诚实仍是 ESS（Számadó-Zachar-Czégel-Penn 2023；Számadó-Zachar-Penn 2026）。
- **指标信号（index signals）**：信号与质量之间存在**因果/物理约束**，低质者根本"造不出"高信号（如鸣叫基频受体型物理限制）。成本为零却不可伪造（Biernaskie-Grafen 等 2014；Biernaskie-Perry-Grafen 2018 把 cue→index→handicap 统一到一个连续谱）。

### 争论的两方立场（务必讲清）

这是报告 10 point-to 但没展开的部分。争论**不在数学**（各方都同意 Grafen 的条件依赖 ESS 模型是对的、均衡成本可为零），而在**语义/历史裁决**和**"成本是否还必要"**：

**A 方（Penn & Számadó：完全废弃，不是修改）。**
- 立场：Grafen 1990 的模型支持的是 Zahavi 的"第二假说"（条件依赖投资），**不是**"障碍原理"（浪费即诚实）；"障碍原理"作为普适命题在理论与经验上都无支撑，应"体面退休"。
- 关键升级（2021 明说）：在对 Frontiers in Psychology 的评论里，两人写明"**the handicap principle needs to be fully rejected, not modified**（障碍原理需要被彻底拒绝，而非修改）"——他们反对把它"改良"成条件依赖版本后继续用这个名字。
- 2023/2026 的正面主张：honesty is maintained by **trade-offs rather than costs**（连"成本"都不是必要条件，遑论"浪费"）。

**B 方（Grafen 阵营 / 温和派：这是术语之争，框架无需推翻）。**
- Biernaskie, Perry & Grafen 2018《A general model of biological signals, from cues to handicaps》：用一个统一模型把从"线索（cue）"到"障碍（handicap）"排成连续谱，**障碍只是这个谱的一端**——他们不认为"handicap"这个词毫无意义，只是把它降格为特例。
- Grose 2011《Modelling and the fall and rise of the handicap principle》（Biology & Philosophy）：从科学哲学角度给出更同情的叙事（"起落再起"）。
- 经验派的惯性：Higham 2021（Encyclopedia of Animal Cognition）、Koh & Li 2024（宗教心理学百科的"Costly signaling theory"词条）等仍把"costly signaling / handicap"当作可用的工作范式——即**理论被批倒，应用层仍在沿用**。

**中立的准确表述**：数学有共识（条件依赖诚实信号是 ESS，均衡成本可为零，诚实由离均衡的边际差异锁定）；分歧是 (i) 要不要保留"handicap"这个名字（A：不要；B：作为特例保留），以及 (ii) 差异化"成本"是否必要（A 2023+：不必要，trade-offs 足矣）。

### 一手来源清单

- **Penn, D.J. & Számadó, S. (2020).** The Handicap Principle: how an erroneous hypothesis became a scientific principle. *Biological Reviews* 95(1):267–290. cited≈154. <https://onlinelibrary.wiley.com/doi/abs/10.1111/brv.12563> · PDF <https://onlinelibrary.wiley.com/doi/pdf/10.1111%2Fbrv.12563>
  - 精确引文（摘要）："Theoretical studies have since shown that signalling costs paid at the equilibrium are neither sufficient nor necessary to maintain signal honesty, and that honesty can evolve through **differential benefits, as well as differential costs**." 以及 "…time is long overdue to usher this idea into an 'honorable retirement'."
- **Penn, D.J. & Számadó, S. (2021).** Commentary: why are no animal communication systems simple languages? *Frontiers in Psychology* 12:722685. cited≈3. <https://www.frontiersin.org/articles/10.3389/fpsyg.2021.722685/full> —"fully rejected, not modified"。
- **Számadó, S., Zachar, I., Czégel, D. & Penn, D.J. (2023).** Honesty in signalling games is maintained by trade-offs rather than costs. *BMC Biology* 21:4. cited≈34. <https://link.springer.com/article/10.1186/s12915-022-01496-9>
- **Számadó, S., Zachar, I. & Penn, D.J. (2026).** A general signalling theory: why honest signals are explained by trade-offs rather than costs or handicaps. *Journal of Evolutionary Biology* 39(2):171–…. cited≈6. <https://academic.oup.com/jeb/article-abstract/39/2/171/8362708> · PDF <https://academic.oup.com/jeb/article-pdf/39/2/171/65671347/voaf144.pdf> —**本领域 2026 最新一手综述**。
- **Biernaskie, J.M., Grafen, A. et al. (2014).** The evolution of index signals to avoid the cost of dishonesty. *Proc. R. Soc. B* 281:20140876. cited≈128. <https://pmc.ncbi.nlm.nih.gov/articles/PMC4123701/>
- **Biernaskie, J.M., Perry, J.C. & Grafen, A. (2018).** A general model of biological signals, from cues to handicaps. *Evolution Letters* 2(3):201–209. cited≈54. <https://academic.oup.com/evlett/article-abstract/2/3/201/6700585>（B 方统一框架）
- **Getty, T. (1998).** Handicap signalling: when fecundity and viability do not add up. *Animal Behaviour* 56:127–130. cited≈194.（乘法适应度批评：Grafen 隐含把生存与繁殖相加，实应相乘——这是"strategic cost 可为零"的更早根源）
- **Számadó, S. (2011).** The cost of honesty and the fallacy of the handicap principle. *Animal Behaviour* 81(1):3–10. cited≈299.（potential cost of cheating 的关键论文）
- **Huttegger, S.M., Bruner, J.P. & Zollman, K.J.S. (2015).** The handicap principle is an artifact. *Philosophy of Science* 82(5). cited≈33.（博弈论视角：把"障碍"当作建模伪影）
- **Hofbauer, J. & Pawlowitsch, C. (2025).** The evolutionary dynamics of costly signaling. *International Journal of Game Theory*. cited≈5. <https://link.springer.com/article/10.1007/s00182-025-00927-5>（2025 的动力学稳定性分析新作）

### 求证与纠讹

- **订正报告 10 自身**：报告 10 结论句"作弊的边际成本必须随质量下降而急剧上升（cost differential）"——这在 2011–2020 是准确的，但被 2023/2026 的 trade-offs 结论**超越**。更精确的现代版本是："诚实由**质量依赖的净收益差**维持；成本差是其一种、但非唯一、也非必要的实现方式。"报告 10 把 cost differential 当"终点"，应更新为"中途站"。
- **"Grafen 证明了 Zahavi 是对的"**：报告 10 已订正，此处补强——Penn-Számadó 2020 的更尖锐版本是"Grafen 的模型根本不是障碍模型（it is not a handicap model）"，连"证明了修正版障碍原理"都算高抬。
- **置信度**：数学共识（高）；"是否该废弃 handicap 一词"（有争议，两方仍在打）；"trade-offs 完全取代 cost"（较新，2023–2026，主要出自同一作者群，尚未被全领域采纳——**标为二手转述偏一手、待更广泛复核**）。

### 开放问题

- trade-offs 框架若成立，则"昂贵"对诚实既非充分也非必要——那么在**人造指标系统**里，我们到底该复制"成本差"还是"收益差"？生物学的差异化收益往往来自被信号者的内在结构（体型限制基频），人造评估里有没有等价的"结构性不可伪造"（≈ index signal）？这是把 D7-1 接到 D7-5（proper scoring / index-like 客观可执行任务）的关键缺口。

---

## 主线 D7-2：信号的成本 = 利益冲突的函数（cheap talk 与真正的桥梁）

### 核心脉络（报告 10 最大的缺口）

报告 10 讲了 Spence（分离均衡）与生物学诚实信号的"同构"，但**漏掉了整个 cheap talk 传统**，因此错过了最有操作价值的一条定理：

> **维持诚实所需的信号成本，正比于信号者与接收者之间的利益冲突。冲突为零时，诚实是免费的（cheap talk 即可）；冲突越大，需要的"昂贵"越多。**

这条定理让"昂贵信号"从"要么贵要么不诚实"的二元，变成一个**连续的、可设计的旋钮**：先想办法**对齐利益**（把冲突降下来），再决定还需要多少成本去锁住剩余的冲突。

三块拼图：

1. **Crawford & Sobel 1982《Strategic information transmission》**（Econometrica，cited≈6848）：完全无成本的 cheap talk 里，均衡是把私有信息**分区（partition）**后粗粒度传递；而且**"agents 的偏好越接近，均衡越有信息量"**。即：无成本沟通的诚实程度，由利益一致性单调决定。
   - 精确表述（摘要）："equilibrium signaling is more informative when agents' preferences are more similar."
2. **Bergstrom & Lachmann 1998《Signaling among relatives. III. Talk is cheap》**（PNAS，cited≈203）：在亲缘（利益高度一致）情形下，**cost-free 的 cheap talk 甚至优于昂贵分离信号**——浪费成本反而是净损失。标题"Talk is cheap"就是纲领。
3. **Lachmann, Számadó & Bergstrom 2001《Cost and conflict in animal signals and human language》**（PNAS，cited≈455）：把上面统一成"**成本按需**"原理——"Contrary to the 'handicap principle,' **waste is not required**"；诚实所需的成本只需覆盖"作弊者从欺骗中能得到的额外好处"，即冲突的大小。Zollman-Bergstrom-Lachmann 2013《Between cheap and costly signals》（Proc. R. Soc. B，cited≈140）进一步刻画了从 cheap 到 costly 的连续过渡与部分诚实（partially honest）均衡。

### 与 Spence 的接合、与 lying-cost 文献的补充

- **Spence 1973** 是"高冲突 + 昂贵信号 → 分离均衡"的一端；**Crawford-Sobel** 是"低冲突 + 零成本 → 仍有信息"的另一端。同一根轴。
- **说谎有小成本（costly talk / lying costs）**：Kartik, Ottaviani & Squintani 2007《Credulity, lies, and costly talk》（JET，cited≈580）与 Kartik 2009 表明——**即便只给说谎加一点点成本**（不必是 Spence 式的大障碍），也能显著改善信息传递、逼近分离。这对度量设计极重要：**抗博弈不必把门槛抬到天上，只要给"谎报"施加一个哪怕不大的、确定的边际成本**（审计概率、事后追责、声誉罚），就能把均衡往诚实推。这与 D7-1 的"trade-offs / 小的差异"完全一致。
- **均衡选择 NITS**：Chen, Kartik & Sobel 2008《Selecting cheap-talk equilibria》（Econometrica，cited≈371）给出"no incentive to separate"精化，用于挑出可信的 cheap-talk 均衡。

### 一手来源清单

- **Crawford, V.P. & Sobel, J. (1982).** Strategic Information Transmission. *Econometrica* 50(6):1431–1451. cited≈6848. PDF <http://econweb.ucsd.edu/~vcrawfor/CrawfordSobel82EMT.pdf>
- **Bergstrom, C.T. & Lachmann, M. (1998).** Signaling among relatives. III. Talk is cheap. *PNAS* 95(9):5100–5105. cited≈203. PDF <https://www.pnas.org/doi/pdf/10.1073/pnas.95.9.5100>
- **Lachmann, M., Számadó, S. & Bergstrom, C.T. (2001).** Cost and conflict in animal signals and human language. *PNAS* 98(23):13189–13194. cited≈455. PDF <https://www.pnas.org/doi/pdf/10.1073/pnas.231216498>
- **Zollman, K.J.S., Bergstrom, C.T. & Lachmann, M. (2013).** Between cheap and costly signals: the evolution of partially honest communication. *Proc. R. Soc. B* 280:20121878. cited≈140. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3574420/>
- **Farrell, J. & Rabin, M. (1996).** Cheap Talk. *Journal of Economic Perspectives* 10(3):103–118. cited≈2097. PDF <https://pubs.aeaweb.org/doi/pdf/10.1257%2Fjep.10.3.103>（最好读的入门综述）
- **Kartik, N., Ottaviani, M. & Squintani, F. (2007).** Credulity, lies, and costly talk. *Journal of Economic Theory* 134(1):93–116. cited≈580. PDF <https://navinkartik.com/Papers/Published/clct.pdf>
- **Chen, Y., Kartik, N. & Sobel, J. (2008).** Selecting cheap-talk equilibria. *Econometrica* 76(1):117–136. cited≈371.
- **Számadó, S., Czégel, D. & Zachar, I. (2019).** One problem, too many solutions: How costly is honest signalling of need? *PLoS ONE* 14(1):e0208443. cited≈18.（honest **pooling** 均衡可用 cost-free 信号）
- **Sobel, J. (2020).** Signaling Games. In *Complex Social and Behavioral Systems*, Springer. cited≈262.（权威综述，区分 cheap talk / costly signaling）

### 求证与纠讹

- **"昂贵信号是诚实的必要条件"——错**（报告 10 未明说，但通篇隐含"昂贵→诚实"）。正确：昂贵只在**利益冲突**时才需要，且需要量正比于冲突；利益对齐时，昂贵是纯损失。**这是本篇给整个项目最重要的新定理**。
- 置信度：高（Crawford-Sobel/Bergstrom-Lachmann 是各自领域的奠基一手，被引数极高，结论稳固）。

### 开放问题

- 把它翻译成度量设计：**"降低评估者与被评者的利益冲突"和"提高伪造的边际成本"哪个更划算？** 在 AI eval 里，"利益对齐"可能意味着让被评 agent 的训练目标与真实目标一致（难，正是对齐问题本身）；"提高伪造成本"则是 held-out / 审计（可操作）。冲突不可消除时，cheap-talk 传统告诉我们成本下限，但**没告诉我们上限该设多高才不至于把诚实者也误伤**（over-signaling 的社会损失，见 Yang & Harstad 2017《The welfare cost of signaling》）。这是抗博弈设计里"成本差异性"必须配一个"别把好人也拖下水"的约束——报告 10 的 handicap 逻辑单独看会诱导"成本越高越好"的错误直觉。

---

## 主线 D7-3：Skin in the game 的机制化，以及 bonding 自身如何被博弈

### 核心脉络

报告 10 把 skin in the game 当"最被忽视的一招"，但停在 Taleb 的哲学层。深挖后有两个新增量：(a) 它在金融监管里有一个**真实、可量化的落地机制**——Dodd-Frank 的 5% 风险自留（risk retention），可以拿实证说话；(b) 一个对项目主题至关重要的反讽——**bonding/skin-in-the-game 机制本身会被 Goodhart 掉**，因为抵押品可以被对冲、被名义合规掩盖。

### Taleb / 汉谟拉比（含订正）

- Taleb《Skin in the Game》(2018) 以汉谟拉比法典 §229 开篇（"建筑师造的房子倒塌压死屋主，则建筑师处死"），称之为"the best risk-management rule ever"，核心是**对称性**（symmetry）：享受上行者必须暴露于下行。相关的 §1/§3（诬告者反坐——"false accusers are to be treated as if they committed the violation themselves"）是"评估者/指控者也要担后果"的古老原型，直接对应"评估者 skin in the game"。
- **订正/纠讹**（报告 10 未涉及）：
  1. 汉谟拉比 §229 的历史动机学界认为是**限制/规定赔偿责任（liability capping）**，并非 Taleb 意义上的"把建筑师的皮绑进游戏"；把它读成现代激励设计是**回溯性诠释**。
  2. Taleb **本人承认**"死刑级别的 skin in the game 并非必要"——他要的是对称性原则，不是字面严刑。引用他时不应暗示"惩罚越重越好"（这与 D7-2 的"小成本即可"一致：需要的是**确定的下行暴露**，不是**巨大的**下行暴露）。
  3. lex talionis（以眼还眼）Taleb 自己也强调是**隐喻性**的对称，不是字面执行。
- **Lindy 效应**：报告 10 已订正（源自 Goldman 1964，非 Taleb 首创），此处不复述。

### 真实机制：Dodd-Frank 5% 风险自留——以及它被博弈

- **机制**：Dodd-Frank Act §941（加入证券交易法 §15G）要求证券化发起人**自留不低于 5% 的信用风险**，明确以"skin in the game"为立法理由，目的是缓解"发起-分销"模式的道德风险（发起人明知贷款质量差仍打包卖出）。
- **实证支持（bonding 有效的一面）**：
  - Demiroglu & James 2012（*Review of Financial Studies*，cited≈195）：发起人与证券化保荐人**有隶属关系**（即更有 skin in the game）时，MBS 违约率显著更低。
  - Chemla & Hennessy 2014（*Journal of Finance*，cited≈145）：理论上自留是缓解道德风险的最优/次优安排。
- **关键反讽（bonding 被 Goodhart 掉）**——这是本主线最重要的新发现：
  - Krahnen et al. 2021：**"investors cannot infer the effective risk retention from merely knowing that issuers comply with the 5% rule."** 名义上留了 5%，发起人可用衍生品/结构**把留下的风险对冲掉**，实际暴露远低于 5%。合规≠真有 skin。
  - Ashcraft 2019（cited≈54）：证券化方通过金融创新**降低实际风险自留**，绕过规则意图。
  - 一般教训：**skin-in-the-game 一旦被写成一个可核验的数字指标（"留 5%"），它自己就变成一个可被博弈的目标**——正是 Strathern 版 Goodhart 的又一实例。抗博弈的"抗博弈手段"不能免疫于博弈。这直接回答项目主线的一个隐藏问题："诚实信号在人造指标系统里能不能落地？"——**能落地，但落地形式（数字化的抵押要求）会重新引入可博弈面，需要配套防对冲、防名义合规的审计**。

### 2025 最新：AI-agent 的质押（staking）/ 履约保证金

- **Hu, B.A. & Rong, H. (2025).** Inter-Agent Trust Models: A Comparative Study of Brief, Claim, Proof, Stake, Reputation and Constraint in Agentic Web Protocol Design（A2A, AP2, ERC-8004…）. arXiv:2511.03434. cited≈6. <https://arxiv.org/abs/2511.03434> —— 在 agent-to-agent 协议里，让 agent **质押抵押品（collateral/stake）作为"经济 skin-in-the-game"**、用 performance bond 担保履约。这是 Taleb 对称性在 AI 系统里的直接机制化，但**继承了 D7-3 的老问题**：质押若可被廉价对冲或由第三方代付，则 skin 又被掏空。

### 一手来源清单

- **Taleb, N.N. (2018).** *Skin in the Game: Hidden Asymmetries in Daily Life*. Random House. cited≈848. <https://en.wikipedia.org/wiki/Skin_in_the_Game_(book)>
- **Demiroglu, C. & James, C. (2012).** How important is having skin in the game? Originator-sponsor affiliation and losses on MBS. *Review of Financial Studies* 25(11):3217–3258. cited≈195. <https://academic.oup.com/rfs/article-abstract/25/11/3217/1567173>
- **Chemla, G. & Hennessy, C.A. (2014).** Skin in the game and moral hazard. *Journal of Finance* 69(4):1597–1641. cited≈145. <https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.12161>
- **Ashcraft, A.B. et al. (2019).** （risk retention 被金融创新削弱）cited≈54.
- **Krahnen, J.P. et al. (2021).** （名义 5% 合规≠有效风险自留）cited≈13.
- **Flynn, S.J. Jr. (2019).** Informational Efficiency in Securitization after Dodd-Frank. cited≈34.
- **Hu, B.A. & Rong, H. (2025).** Inter-Agent Trust Models. arXiv:2511.03434.
- **Holmström, B. & Milgrom, P. (1991).** Multitask Principal-Agent Analyses. *JLEO* 7:24–52.（报告 10 已引；此处提示：多任务定理是"为什么把 skin 只绑在可测任务上会扭曲努力"的数学根据，与 bonding 被博弈是同一枚硬币）

### 开放问题

- 有没有**不可对冲的 skin in the game**？金融里几乎总能对冲；在 AI eval 里，"评估者对其放行系统的真实部署失败负责"若只是名义（换个团队、匿名化）就等于可对冲。**真正不可对冲的 skin，可能只能来自不可转移的东西（声誉、职业记录、法律责任）**——这把 D7-3 接到 D7-5 的 impartial selection（结构性地让你无法影响自己的结果）。

---

## 主线 D7-4：度量设计的思想史与讹传法证

报告 10 引了 Carter、Muller、Deming、Kaplan-Norton，但有几处引注不精确、几处过于乐观，且缺 POSIWID 的法证。逐条订正与补强。

### (1) POSIWID：Beer 归属复核——**这次不是讹传**

- **结论**：与 Goodhart/Deming 那种"张冠李戴"不同，**"the purpose of a system is what it does" 这句话确实是 Stafford Beer 的**，不属于误归因。项目此前记忆里"POSIWID 非 Beer 造"的说法**需要收窄**：
  - **短语**：确证为 Beer。最常被引的出处是他 2001 年对西班牙 Valladolid 大学的致辞、发表为 **Beer, S. (2002). "What is cybernetics?" *Kybernetes* 31(2):209–219**；文中："According to the cybernetician the purpose of a system is what it does. This is a basic dictum." 思想更早可溯到 *Brain of the Firm* 与 *Diagnosing the System for Organizations* (1985)。
  - **五字缩写"POSIWID"本身**：是否由 Beer 亲手压缩成缩写，一手证据**不足**——大量二手源（含维基）说"coined by Beer"，但我未见 Beer 亲笔写出该缩写的一手页证。**稳妥表述**：短语确为 Beer；缩写化很可能出自 Beer 本人或其直接圈子，但"缩写由谁定型"属**待考**（低置信度），不影响"核心思想是 Beer 的"这一结论。
- **更该订正的是用法，而非出处**：POSIWID 常被误用为**阴谋论工具**（"系统的隐藏目的是坏的"）。Beer 的原意是**反目的论的操作主义**——不要用"良好意图"为系统开脱，而要用**可观察的行为**判断系统"实际在做什么"。用作"揭露阴谋"是曲解。（这是比出处更实质的纠偏。）

### (2) Deming："if you can't measure it, you can't manage it" 是他**反对**的伪引

- **精确订正**（报告 10 方法论已 flag，此处给一手锚）：Deming 说的是**相反**的话——
  > **"It is wrong to suppose that if you can't measure it, you can't manage it — a costly myth."**
  > —— W. Edwards Deming, *The New Economics for Industry, Government, Education* (MIT Press, 1993/2nd ed. 1994), 第 2 章。
- **一手/权威锚点**：Deming Institute 官方"神话"页 <https://deming.org/myth-if-you-cant-measure-it-you-cant-manage-it/>；同一订正见同行评议文献 **Berenson, R.A. (2016). "If You Can't Measure Performance, Can You Improve It?" *JAMA* 315(7):645–646**（cited≈40）：明确指出"Deming actually wrote… a costly myth"。
- **补 Deming 的正面处方（报告 10 缺）**：
  - **第 11 点（Point 11 of the 14 Points）**："Eliminate work standards (quotas)… Eliminate management by objective, management by numbers, numerical goals. Substitute leadership."——**去数字配额、去纯数字目标**。
  - **"七个致命病（Seven Deadly Diseases）"第 5 条**："Running a company on visible figures alone"，并特别点名**"the most important figures… are unknown and unknowable"**（最重要的量往往不可知，正好呼应 Hubbard 的 measurement inversion）。
- 置信度：高（Deming Institute 一手 + JAMA 同行评议）。

### (3) Tin openers vs Dials：订正报告 10 的引注错误

- **报告 10 的问题**：它把出处写成"Carter, N. (1989). Performance indicators: 'Backseat driving' or 'hands off' control? *Policy & Politics* 17(2)"，并把 tin-opener 的关键论述挂在 1989。**更准确的一手是 1991 年那篇**：
  - **Carter, N. (1991). "Learning to measure performance: the use of indicators in organizations." *Public Administration* 69(1):85–101.** cited≈327. <https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9299.1991.tb00783.x> —— tin-opener/dial 对立的规范表述在此。
  - 书版：**Carter, N., Klein, R. & Day, P. (1992/1995). *How Organisations Measure Success: The Use of Performance Indicators in Government*. Routledge.**
- **补一个更早的出处线索**：多篇文献（如 Kemp 1995）把这个比喻追到 **Klein & Carter (1988)**（用 "can-openers" 一词）。即：**隐喻可能早于 1991，起于 Carter 与 Rudolf Klein 1988 年前后的合作**。报告 10 把它单挂 Carter 一人、且年份/篇目有误，应更正为"Carter 1991（规范表述）＋ Klein-Carter 1988（更早雏形）＋ Carter-Klein-Day 1992（书）"。
- **精确定义（Polzer 2010 转述 Carter）**："A tin opener is a more ambiguous PI, which by itself provides only an incomplete and inaccurate picture… do not give answers, but prompt further interrogation."
- **重要的经验后续**：Klein 本人 2025《The politics of reinvention》（*The New Politics of the NHS* 新版）承认——**"performance indicators had originally been designed as tin openers… they were now being used as dials"**：即 NHS 的历史轨迹是**tin opener 不可避免地退化成 dial**。这给报告 10 的"把指标当 tin opener"处方加了一条**警告：tin opener 是不稳定的制度状态，会向 dial 漂移**，需要持续的制度维护才能守住。

### (4) Muller《The Tyranny of Metrics》(2018) 的处方清单（报告 10 只引了诊断，没给药方）

- Muller 在**第 15 章**给出一份**处方 checklist**（多源确认为"10-point checklist"），要点（综合 Muller 2018 及其 2021 医学教育版浓缩《The perils of metric fixation》，*Medical Teacher*）：
  1. 先问**测量什么类型的信息**（标准化易测量常非最重要）；
  2. 信息**多大程度有用**——vs 只是"看起来客观"；
  3. **更多测量是否真更有用**（边际递减/负）；
  4. **不测量的代价**是什么；
  5. **为谁、为什么目的**而测（问责 vs 改进 vs 惩罚，目的不同设计不同）；
  6. 数据**如何被获取**——警惕成本与被操纵；
  7. 由**谁**开发指标、他们**对被测者了解多少**（外行强加最易被博弈）；
  8. **即便看似有用的指标也会被腐蚀/游戏**——要预判；
  9. 记住**测量不能替代基于经验的判断**（保留专业裁量）；
  10. 有时**"最好"的解决办法是承认某些东西不该被量化**——知道何时**不测**。
- 核心处方一句话："**metrics 是判断的补充，不是替代**"，与 tin opener、Leiden Manifesto 第 1 条同构。
- 一手：**Muller, J.Z. (2018). *The Tyranny of Metrics*. Princeton University Press.** cited≈1711. <https://press.princeton.edu/books/hardcover/9780691174952/the-tyranny-of-metrics> · 浓缩版 **Muller (2021). The perils of metric fixation. *Medical Teacher* 43(sup1)**. <https://www.tandfonline.com/doi/full/10.1080/0142159X.2020.1840745>

### (5) Kaplan-Norton 平衡计分卡：订正报告 10 的过度乐观

- **报告 10 的问题**：它把 Balanced Scorecard 当作抗博弈手段（"把因果链画出来，使操纵一端的后果被显式表达，从而抬高单点博弈成本"）。这个判断**过于乐观**，被经典反驳削弱：
  - **Nørreklit, H. (2000). "The balance on the balanced scorecard: a critical analysis of some of its assumptions." *Management Accounting Research* 11(1):65–88.** cited≈2638. <https://www.sciencedirect.com/science/article/pii/S104450059990121X> —— 核心批评：BSC 所声称的领先→滞后指标之间的**"因果关系"其实是逻辑/修辞关系，未经验证、且缺时间维度**。既然因果链是**假设而非证实**，"画出因果链"并不能真正抬高博弈成本，反而可能**给管理者虚假的信心**去对着未验证的代理链下重注。
  - **Meyer, M.W. (2003). *Rethinking Performance Measurement: Beyond the Balanced Scorecard*.** cited≈669：观察到"**指标越多，组织内的扭曲/博弈越多**（the more measures, the more distortion or gaming）"——多维本身不是抗博弈的保险。
  - **Smith, M.J. (2002). "Gaming nonfinancial performance measures." *Journal of Management Accounting Research* 14:119.** cited≈107：形式化了 BSC 式多维非财务指标**仍可被博弈**的路径。
- **对报告 10 的修正**：配对/多维制衡（D7 与报告 10 §5）确实能抬高**只博弈一端**的成本，但**只有当各维正交且作弊手段不相通时才成立**；BSC 把这些维度用**未验证的因果链**串起来，恰恰可能让它们**共享同一条捷径**（拉高领先指标的手段同时"解释"了滞后指标），制衡失效。**结论：BSC 是沟通/战略工具，不是可靠的抗博弈装置**；报告 10 应下调对它的评价。

### 开放问题

- tin opener → dial 的退化（Klein 2025 实证）是否**不可逆**？有没有制度设计能让指标**稳定地停在 tin-opener 态**（如：法律禁止把某指标绑定自动奖惩）？这是"解耦测量与判决"从原则到可执行制度的缺口。

---

## 主线 D7-5：机制设计的硬定理——抗操纵度量的数学边界

报告 10 的 checklist 全是工程启发式，缺**"能不能被证明抗操纵"的数学天花板**。这条线补上：哪些是**不可能**的，哪些是**可证明可行**的、代价多大。

### (1) 基本不可能性：Gibbard-Satterthwaite

- **Gibbard, A. (1973). Manipulation of Voting Schemes: A General Result. *Econometrica* 41(4):587–601.**（cited 数千）与 **Satterthwaite, M.A. (1975). Strategy-proofness and Arrow's Conditions. *Journal of Economic Theory* 10(2):187–217.** cited≈4226. <https://www.sciencedirect.com/science/article/pii/0022053175900502>
- **结论**：任何把≥3 个结果映射为单一选择、且非独裁、值域非退化的聚合规则，**必然在某处可被策略性操纵（manipulable）**。Borda 等所有位置计分法都不能幸免。
- **对项目的意义（钉死天花板）**：**"完全 strategyproof 且有意义的排名/聚合"在一般域上不存在**。所以抗博弈度量的目标不可能是"造一个不可博弈的指标"，只能是三条退路之一：(a) **限制域**（single-peaked → Moulin 1980 中位数机制可 strategyproof）；(b) **近似 strategyproof**（量化"撒谎最多能换多少好处"，见下）；(c) **改变结构**让被评者影响不了自己的结果（impartial selection，见下）。这为报告 10"没有绝对不可博弈的指标"提供了**定理级**依据，而不只是格言。

### (2) 把"不能给自己打分"变成定理：Impartial Selection

- **Holzman, R. & Moulin, H. (2013). Impartial Nominations for a Prize. *Econometrica* 81(1):173–196.** cited≈116. <https://onlinelibrary.wiley.com/doi/abs/10.3982/ECTA10079> ；独立地 **Alon, N., Fischer, F., Procaccia, A. & Tennenholtz, M. (2011). Sum of Us: Strategyproof Selection from the Selectors.** (TARK 2011).
- **概念**：**impartiality（公正性）= 一个 agent 的报告永远不能影响它自己是否被选中**。这把报告 10 反复强调的"评估者别评自己""eval 与优化解耦"从**直觉升格为可设计、可证明的机制属性**。
- **硬结果（代价与不可能）**：
  - Holzman-Moulin 证明了一批**不可能性**——impartial + 若干自然公理（如总是选出得票最多者）不可兼得；确定性 impartial 规则在最坏情况会漏掉全票候选人。
  - 落到评审：**Xu, Zhao, Shi, Zhang & Shah (2018). On Strategyproof Conference Peer Review.** cited≈62. arXiv:1806.06266；**Dhull, Jecmen, Kothari & Shah (2022). Strategyproofing Peer Assessment via Partitioning: The Price in Terms of Evaluators' Expertise.** (AAAI HCOMP). cited≈40. —— **可以**通过"分区"（把评审者与会影响其自身结果的对象隔离）实现 strategyproof，但要**付出评审专业匹配度下降的可量化代价**（"price"）。这正是报告 10"解耦"处方的**成本被定价**的版本：解耦不是免费的，它牺牲了让最懂的人评最相关对象的能力。
- **2026 最新硬结果**：**Eberl, M. & Lederer, P. (2026). The Impossibility of Strategyproof Rank Aggregation.** arXiv:2602.06582. —— 直接针对**排名聚合**证明 strategyproof 不可能，对"排名反应性"主题是定理级坏消息：**任何有意义的排名聚合都可被操纵**。

### (3) 处理"不可验证信号"：Proper Scoring Rules / Peer Prediction / BTS

当"真值"事后可得时，可用 proper scoring rule 让诚实成为最优；当**真值根本拿不到**（主观评价、同行评审、无 ground truth 的 eval）时，仍有机制能让说真话成为均衡：

- **Proper scoring rules（真值可得）**：**Gneiting, T. & Raftery, A.E. (2007). Strictly Proper Scoring Rules, Prediction, and Estimation. *JASA* 102(477):359–378.** cited≈8472. —— 严格恰当评分规则下，**报告真实概率是唯一最大化期望得分的策略**；log/Brier(quadratic)/spherical/CRPS 皆属此类。这是"让诚实=最优"的最干净数学范式，直接可用于给 AI 的**校准/置信度**打分（谎报置信必吃亏）。
- **Peer prediction（无真值，靠同行相关性）**：**Miller, N., Resnick, P. & Zeckhauser, R. (2005). Eliciting Informative Feedback: The Peer-Prediction Method. *Management Science* 51(9):1359–1373.** cited≈786. —— 用一个评审者的报告去给**另一个评审者报告的后验**打 proper score，**诚实报告是 Nash 均衡，且不需要任何外部真值**。原文明说适用于"academic reviewing and online recommender and reputation systems"。
- **Bayesian Truth Serum（无真值，主观数据）**：**Prelec, D. (2004). A Bayesian Truth Serum for Subjective Data. *Science* 306(5695):462–466.** cited≈697. —— 奖励"**比大家预测的更普遍**（surprisingly common）"的答案，使诚实对**每个人**都是最优，即便答案永远无法被验证。
- **对 AI eval 的直接价值**：这三者给了报告 10 缺的"**裁判无真值时如何仍逼出诚实**"的正面工具——LLM-as-judge / 众包标注 / 同行式模型互评都可以套 peer-prediction / BTS 结构，让"随大流乱打分"或"自我偏好"在期望上吃亏。**警告**：这些机制假设理性贝叶斯参与者，现实中人（和模型）会偏离；见 Gao et al. 关于纯优化会过度拟合任何评分规则。

### (4) 度量"抗操纵的程度"（近似 strategyproofness）

既然完美不可能，就**量化可操纵性**、把它当可优化的连续量：

- **Lubin, B. & Parkes, D.C. (2012). Quantifying the Strategyproofness of Mechanisms via Metrics on Payoff Distributions.** arXiv:1205.2630. cited≈25.
- **Deng, Lahaie, Mirrokni & Zuo (2020). A Data-Driven Metric of Incentive Compatibility.** (WWW 2020). cited≈22. —— 从**部署数据**估计一个上线机制实际有多可被操纵。
- **Berker, Conitzer, Hartman, Liu et al. (2026). How Many Votes is a Lie Worth? Measuring Strategyproofness through Resource Augmentation.** arXiv:2602.22838. —— 2026 用"资源增强"框架度量撒谎的价值。
- **Carroll, G. (2019). Robustness in Mechanism Design and Contracting. *Annual Review of Economics* 11:139–166.** cited≈168. <http://individual.utoronto.ca/carroll/survey.pdf> —— **稳健机制设计**综述：当设计者不确定参与者的信念/环境时，追求**最坏情况**下仍好的机制（dominant-strategy/strategy-proof 是达成 belief-robustness 的一条路）。这是"抗博弈"从平均情形到**对抗/最坏情形**的正式框架，正对 Manheim-Garrabrant 的 Adversarial Goodhart。

### (5) 2024–2026 的 AI 落地

- **Strategy-robust RLHF**：**Kleine Buening, Gan, Mandal et al. (2025/2026). Strategyproof Reinforcement Learning from Human Feedback.** (NeurIPS 2025). —— 让 RLHF 对**策略性标注者**稳健（标注者夸大偏好也无法把奖励模型往私利方向拽），且**不依赖金钱支付**。把 D7-5 的机制设计直接缝进对齐流水线。
- **Strategyproof ML**：**Chen, Podimata, Procaccia et al. (2018). Strategyproof Linear Regression in High Dimensions.**（对策略性数据稳健的回归）；**Balkanski & Zhu (2024). Strategyproof Learning with Advice.**
- **AI 语境的 scoring-rule 监督**：**Jiang, Feng & Mehta (2025). Incentive-Aligned Multi-Source LLM Summaries.** arXiv:2509.25184（用 scoring rule 让"诚实汇报来源"成为最优）；**Faltings (2022). Game-theoretic mechanisms for eliciting accurate information.** (IJCAI)。
- **Goodhart 在 RLHF 的实证**：**Gao, L., Schulman, J. & Hilton, J. (2023). Scaling Laws for Reward Model Overoptimization.** (ICML 2023). arXiv:2210.10760. cited≈数百 —— **对代理奖励优化越狠，真实奖励先升后降**，且遵循可预测的函数形式。这是报告 10 §10 该有的**Goodhart 定量实证锚点**（把"eval 变成被优化目标就会失效"从格言变成曲线）。配 **Skalse et al. (2022). Defining and Characterizing Reward Hacking.** (NeurIPS 2022, arXiv:2209.13085)。

### 一手来源清单（本主线）

- Gibbard 1973 *Econometrica* 41:587–601；**Satterthwaite 1975 *JET* 10:187–217** <https://www.sciencedirect.com/science/article/pii/0022053175900502>
- Moulin 1980, On strategy-proofness and single-peakedness, *Public Choice* 35:437–455. cited≈1370.
- **Holzman & Moulin 2013 *Econometrica* 81:173–196**；Alon-Fischer-Procaccia-Tennenholtz 2011 (TARK)
- Xu-Zhao-Shi-Zhang-Shah 2018 arXiv:1806.06266；**Dhull-Jecmen-Kothari-Shah 2022 (AAAI HCOMP)** <https://ojs.aaai.org/index.php/HCOMP/article/view/21987>
- **Eberl & Lederer 2026, The Impossibility of Strategyproof Rank Aggregation, arXiv:2602.06582**
- **Gneiting & Raftery 2007 *JASA* 102:359–378**（proper scoring rules）
- **Miller-Resnick-Zeckhauser 2005 *Management Science* 51:1359–1373**（peer prediction）
- **Prelec 2004 *Science* 306:462–466**（Bayesian truth serum）
- Lubin & Parkes 2012 arXiv:1205.2630；Deng et al. 2020 (WWW)；Berker et al. 2026 arXiv:2602.22838
- **Carroll 2019 *Annual Review of Economics* 11:139–166**（robust mechanism design）
- Kleine Buening et al. 2025 (NeurIPS) Strategyproof RLHF；Chen-Podimata-Procaccia 2018（strategyproof regression）
- **Gao-Schulman-Hilton 2023 arXiv:2210.10760**；Skalse et al. 2022 arXiv:2209.13085

### 开放问题（本主线，也是全项目最硬的开放问题）

- G-S 不可能性 + Eberl-Lederer 2026 排名不可能，意味着**任何有意义的排名/评估在一般域上都可被操纵**。剩下的全部工程努力（held-out、审计、配对、impartial 分区、scoring rule）都只是在**"限制域 / 近似 / 改结构 / 提高操纵成本"**四条退路上做量化取舍。**是否存在一个统一的"可操纵性预算"框架**，把 D7-2 的 cheap-talk 冲突成本、D7-5 的近似 strategyproofness、报告 10 的 held-out/审计，放进同一个"我愿意容忍多少博弈、愿意付多少代价（专业匹配度、透明度、可申诉性）"的最优化里？目前**没有**——这是 D7 指向的下一篇的核心缺口。

---

## 综合：把五条线拧成一句对项目的话

诚实信号在人造指标系统里**能不能落地**？D7 的答案比报告 10 更精确、也更冷静：

- **能，但形式受两条定理夹逼**。上界（好消息）：当利益足够对齐，诚实是免费的（cheap talk，D7-2）；且诚实所需的成本只需正比于冲突、可以很小（costly talk，D7-2；trade-offs，D7-1）——不必造昂贵障碍。下界（坏消息）：只要有冲突且域不受限，**完美 strategyproof 的排名/评估不存在**（Gibbard-Satterthwaite；Eberl-Lederer 2026，D7-5）。
- **所以落地=在四条退路上做量化取舍**：限制域、近似 strategyproof、改结构（impartial，让被评者影响不了自己的结果）、提高操纵成本（审计/held-out/scoring rule）。每条都有**可证明的代价**（impartial 牺牲专业匹配度；held-out 牺牲透明；审计牺牲效率）。
- **而且"抗博弈的手段自己会被博弈"**（D7-3：5% 风险自留被对冲掉；D7-4：tin opener 退化成 dial；D7-1：连"成本"这个抗伪造锚点都可为零）。抗博弈不是一次性设计，是**持续的制度维护 + 对抗性红队 + 信号半衰期管理**。

一句话总纲（升级报告 10 的结语）：**诚实不是"贵"，而是"对说谎者才贵"；而"对说谎者才贵"的贵，只需正比于利益冲突、且必须结构化到被评者影响不了自己的分——但任何这样的结构都有可证明的代价，且自身仍需被审计，因为抗博弈的装置也会被 Goodhart。**

---

## 附录：本篇新增 / 订正的讹传与不精确一览

| # | 说法 | 更准确的事实 | 主要依据 | 置信度 |
|---|---|---|---|---|
| 1 | （报告 10）诚实的现代内核是"作弊边际成本随质量急升（cost differential）"，这是终点。 | cost differential 只是中途站；2023–2026 一般化为 **trade-offs**——差异化**收益**同样可维持诚实，均衡成本可严格为零。 | Számadó-Zachar-Czégel-Penn 2023 *BMC Biol*；Számadó-Zachar-Penn 2026 *JEB* | 中（新，主要出自同一作者群） |
| 2 | "昂贵信号是诚实的必要条件 / 越贵越可信。" | 昂贵只在**利益冲突**时才需要，需要量正比于冲突；利益对齐时诚实免费（cheap talk）。给谎报加**小**成本即可显著改善。 | Crawford-Sobel 1982；Bergstrom-Lachmann 1998；Lachmann-Számadó-Bergstrom 2001；Kartik et al. 2007 | 高 |
| 3 | （报告 10 记忆）"POSIWID 非 Beer 造。" | **短语确为 Beer**（*Kybernetes* 2002 等），不属误归因；仅"五字缩写由谁定型"待考。更该纠的是把 POSIWID 误用成阴谋论工具——Beer 原意是反目的论的操作主义。 | Beer 2002 *Kybernetes* 31(2) | 短语=高；缩写归属=低（待考） |
| 4 | "If you can't measure it, you can't manage it" 是 Deming（或 Drucker）的话。 | Deming 说的相反："**It is wrong to suppose… — a costly myth**"（*The New Economics* 1993, ch.2）；Drucker 亦未说过。 | Deming Institute；Berenson 2016 *JAMA* 315:645 | 高 |
| 5 | （报告 10 引注）tin-opener 出处= Carter 1989 *Policy & Politics*。 | 规范表述在 **Carter 1991 *Public Administration* 69(1):85–101**；书为 Carter-Klein-Day 1992；雏形可溯 **Klein-Carter 1988**（"can-opener"）。 | Carter 1991；Kemp 1995 转述 | 高 |
| 6 | （报告 10）平衡计分卡的因果链能"抬高单点博弈成本"，是抗博弈手段。 | BSC 的因果链是**未验证的逻辑/修辞关系**，可能给虚假信心、让多维共享同一捷径；"指标越多博弈越多"。BSC 是沟通工具，非可靠抗博弈装置。 | Nørreklit 2000 *MAR* 11:65；Meyer 2003；Smith 2002 *JMAR* | 高 |
| 7 | tin opener 是稳定可采用的解法。 | tin opener 会**向 dial 退化**（NHS 实证：originally tin openers… now used as dials），是不稳定的制度态，需持续维护。 | Klein 2025《The politics of reinvention》 | 中高 |
| 8 | skin in the game（如 Dodd-Frank 5% 自留）是可靠的诚实机制。 | 名义合规≠有效 skin：抵押/自留可被**对冲**掉，规则本身被 Goodhart。 | Krahnen et al. 2021；Ashcraft 2019 | 高 |
| 9 | 汉谟拉比 §229 是"把建筑师的皮绑进游戏"的完美先例。 | 史学多认为其动机是**限制赔偿责任**；Taleb 自承死刑级 SITG 非必要、lex talionis 为隐喻。 | 二手史学考据；Taleb 2018 自陈 | 中 |
| 10 | 可以造出"不可被博弈"的排名/评估指标。 | 一般域上**不可能**（Gibbard 1973 / Satterthwaite 1975；排名聚合专门不可能：Eberl-Lederer 2026）。只能限制域/近似/改结构/提成本，各有可证代价。 | Satterthwaite 1975 *JET*；Eberl-Lederer 2026 | 高 |

---

## 来源总表（按子主线分组，含 URL）

**D7-1 障碍原理第三幕**
- Penn & Számadó 2020, *Biol. Rev.* 95:267–290. <https://onlinelibrary.wiley.com/doi/abs/10.1111/brv.12563>
- Penn & Számadó 2021, *Front. Psychol.* 12:722685. <https://www.frontiersin.org/articles/10.3389/fpsyg.2021.722685/full>
- Számadó, Zachar, Czégel & Penn 2023, *BMC Biology* 21:4. <https://link.springer.com/article/10.1186/s12915-022-01496-9>
- Számadó, Zachar & Penn 2026, *J. Evol. Biol.* 39(2):171. <https://academic.oup.com/jeb/article-abstract/39/2/171/8362708>
- Biernaskie, Grafen et al. 2014, *Proc. R. Soc. B* 281:20140876. <https://pmc.ncbi.nlm.nih.gov/articles/PMC4123701/>
- Biernaskie, Perry & Grafen 2018, *Evolution Letters* 2(3):201. <https://academic.oup.com/evlett/article-abstract/2/3/201/6700585>
- Getty 1998, *Anim. Behav.* 56:127；Számadó 2011, *Anim. Behav.* 81:3–10
- Huttegger, Bruner & Zollman 2015, *Phil. Sci.* 82(5). <https://www.cambridge.org/core/journals/philosophy-of-science/article/handicap-principle-is-an-artifact/120CE9A6A886CE554DF8B465D0EF2015>
- Grose 2011, *Biol. Phil.* <https://link.springer.com/article/10.1007/s10539-011-9275-1>
- Hofbauer & Pawlowitsch 2025, *Int. J. Game Theory*. <https://link.springer.com/article/10.1007/s00182-025-00927-5>

**D7-2 信号成本=冲突的函数**
- Crawford & Sobel 1982, *Econometrica* 50:1431. PDF <http://econweb.ucsd.edu/~vcrawfor/CrawfordSobel82EMT.pdf>
- Bergstrom & Lachmann 1998, *PNAS* 95:5100. <https://www.pnas.org/doi/abs/10.1073/pnas.95.9.5100>
- Lachmann, Számadó & Bergstrom 2001, *PNAS* 98:13189. <https://www.pnas.org/doi/abs/10.1073/pnas.231216498>
- Zollman, Bergstrom & Lachmann 2013, *Proc. R. Soc. B* 280:20121878. <https://pmc.ncbi.nlm.nih.gov/articles/PMC3574420/>
- Farrell & Rabin 1996, *JEP* 10(3):103. <https://pubs.aeaweb.org/doi/pdf/10.1257/jep.10.3.103>
- Kartik, Ottaviani & Squintani 2007, *JET* 134:93. <https://navinkartik.com/Papers/Published/clct.pdf>
- Chen, Kartik & Sobel 2008, *Econometrica* 76:117
- Számadó, Czégel & Zachar 2019, *PLoS ONE* 14:e0208443. <https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0208443>
- Sobel 2020, Signaling Games (Springer). <https://escholarship.org/content/qt5j97c79z/qt5j97c79z.pdf>

**D7-3 Skin in the game 机制化与被博弈**
- Taleb 2018, *Skin in the Game*. <https://en.wikipedia.org/wiki/Skin_in_the_Game_(book)>
- Demiroglu & James 2012, *RFS* 25:3217. <https://academic.oup.com/rfs/article-abstract/25/11/3217/1567173>
- Chemla & Hennessy 2014, *J. Finance* 69:1597. <https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.12161>
- Krahnen et al. 2021（有效风险自留 vs 名义 5%）；Ashcraft 2019；Flynn 2019, Informational Efficiency in Securitization after Dodd-Frank
- Hu & Rong 2025, Inter-Agent Trust Models, arXiv:2511.03434. <https://arxiv.org/abs/2511.03434>
- Holmström & Milgrom 1991, *JLEO* 7:24（多任务，报告 10 已引）

**D7-4 度量设计思想史与讹传法证**
- Beer 2002, "What is cybernetics?" *Kybernetes* 31(2):209–219（POSIWID 短语出处）
- Deming 1993, *The New Economics*（"costly myth"，ch.2）；Deming Institute myth 页 <https://deming.org/myth-if-you-cant-measure-it-you-cant-manage-it/>；Berenson 2016 *JAMA* 315:645 <https://jamanetwork.com/journals/jama/fullarticle/2491628>
- Carter 1991, *Public Administration* 69(1):85–101. <https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9299.1991.tb00783.x>；Carter, Klein & Day 1992, *How Organisations Measure Success*, Routledge；Klein 2025《The politics of reinvention》
- Muller 2018, *The Tyranny of Metrics*, Princeton UP. <https://press.princeton.edu/books/hardcover/9780691174952/the-tyranny-of-metrics>；Muller 2021, *Medical Teacher*. <https://www.tandfonline.com/doi/full/10.1080/0142159X.2020.1840745>
- Nørreklit 2000, *Management Accounting Research* 11:65. <https://www.sciencedirect.com/science/article/pii/S104450059990121X>；Meyer 2003, *Rethinking Performance Measurement*；Smith 2002, *JMAR* 14:119. <https://publications.aaahq.org/jmar/article-abstract/14/1/119/736>

**D7-5 机制设计硬定理**
- Gibbard 1973, *Econometrica* 41:587；Satterthwaite 1975, *JET* 10:187. <https://www.sciencedirect.com/science/article/pii/0022053175900502>
- Moulin 1980, *Public Choice* 35:437
- Holzman & Moulin 2013, *Econometrica* 81:173. <https://onlinelibrary.wiley.com/doi/abs/10.3982/ECTA10079>；Alon, Fischer, Procaccia & Tennenholtz 2011 (TARK)
- Xu et al. 2018, arXiv:1806.06266 <https://arxiv.org/abs/1806.06266>；Dhull, Jecmen, Kothari & Shah 2022 (AAAI HCOMP) <https://ojs.aaai.org/index.php/HCOMP/article/view/21987>
- Eberl & Lederer 2026, arXiv:2602.06582 <https://arxiv.org/abs/2602.06582>
- Gneiting & Raftery 2007, *JASA* 102:359. <https://www.tandfonline.com/doi/abs/10.1198/016214506000001437>
- Miller, Resnick & Zeckhauser 2005, *Management Science* 51:1359
- Prelec 2004, *Science* 306:462. <https://www.science.org/doi/10.1126/science.1102081>
- Lubin & Parkes 2012, arXiv:1205.2630；Deng, Lahaie, Mirrokni & Zuo 2020 (WWW)；Berker et al. 2026, arXiv:2602.22838
- Carroll 2019, *Ann. Rev. Econ.* 11:139. <http://individual.utoronto.ca/carroll/survey.pdf>
- Kleine Buening, Gan, Mandal et al. 2025 (NeurIPS), Strategyproof RLHF；Chen, Podimata & Procaccia 2018, Strategyproof Linear Regression (ICML)
- Gao, Schulman & Hilton 2023 (ICML), arXiv:2210.10760 <https://arxiv.org/abs/2210.10760>；Skalse et al. 2022 (NeurIPS), arXiv:2209.13085

**AI/时事锚点（2025–2026）**
- METR 2025, Recent Frontier Models Are Reward Hacking. <https://metr.org/blog/2025-06-05-recent-reward-hacking/>
- EvilGenie: A Reward Hacking Benchmark (MIT FutureTech)（held-out 单测 + LLM 裁判 + 改测试文件检测三路交叉）
- 《Why We Trust the Peacock's Tail》*The Diplomat* 2025-09（诚实信号科普）；EurekAlert 2025 "Why are some animal and human signals honest…"
- Jiang, Feng & Mehta 2025, Incentive-Aligned Multi-Source LLM Summaries, arXiv:2509.25184
