# 诚实信号理论 + 抗 Goodhart 的度量设计

> 排名反应性研究项目 · 第 10 篇（建设性综合篇）
> 核心问题：既然任何指标被用作目标就必被博弈（Goodhart / Campbell / Strathern），那么**什么样的信号与评估相对更诚实、更难伪造**？本篇从两条脉络作答：(A) 进化生物学与经济学里的**昂贵/诚实信号理论**——为什么某些信号在数学上难以伪造；(B) 公共管理、绩效度量与 AI 评估里的**抗博弈度量设计**——把 (A) 的直觉翻译成可操作方法论。
>
> 撰写日期：2026-07-18。所有关键论断附确切出版信息与 URL；对流行的讹传/误归因单独标注，并在文末汇总。

---

## 0. 为什么这篇是"建设性"的：Goodhart 的三重定律作为起点

在展开诚实信号之前，先钉死"必被博弈"这个前提本身的确切来源，因为这里已经藏着一个广泛流传的讹传。

- **Goodhart 原始表述（1975）**：Charles Goodhart 在一篇关于英国货币政策的会议论文中写道："Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes."（任何被观察到的统计规律，一旦被施加控制压力，都将趋于崩溃。）他谈的是货币总量，不是绩效指标。
- **讹传订正**：如今最流行的措辞"When a measure becomes a target, it ceases to be a good measure"（当一个度量变成目标，它就不再是好度量）**并非 Goodhart 本人所写**，而是人类学家 Marilyn Strathern 在 1997 年论文里对 Goodhart 定律的转述。确切出处：M. Strathern, "'Improving ratings': audit in the British University system," *European Review* 5(3), 1997, 305–321. DOI:10.1017/S1062798700002660（<https://www.cambridge.org/core/journals/european-review/article/abs/improving-ratings-audit-in-the-british-university-system/FC2EE640C0C44E3DB87C29FB666E9AAB>）。因此严格说这句话应称"Strathern 版 Goodhart 定律"。
- **Campbell 定律（时间上更早、更直接针对社会指标）**：Donald T. Campbell, "Assessing the Impact of Planned Social Change"，最初为 1976 年 12 月的 Occasional Paper #8，后重刊为 *Evaluation and Program Planning* 2(1), 1979, 67–90（<https://ideas.repec.org/a/eee/epplan/v2y1979i1p67-90.html>）。原文："The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor." 常见讹传是把这条完全并入"Goodhart's Law"，但 Campbell 的表述在时间上更早、且直接锁定"社会指标 + 决策压力 → 腐蚀"，与本项目主题更贴合。
- **AI 语境下的细化**：Manheim & Garrabrant, "Categorizing Variants of Goodhart's Law," arXiv:1803.04585（2018 投稿，2019 修订，<https://arxiv.org/abs/1803.04585>）把 Goodhart 效应拆成四类——**Regressional（回归型）**：优化代理量时也顺带选中了"代理量与真目标之差"；**Extremal（极值型）**：代理量取极端值的世界与当初观察到相关性的普通世界大不相同；**Causal（因果型）**：代理与目标只是相关而非因果，干预代理不动目标；**Adversarial（对抗型）**：他人理解了指标并蓄意操纵——这一类才是大众想象中的"博弈"。这个四分法在第 5–10 节都会用到：不同抗博弈手段各自对应压制哪一类失效。

一个常被当作史实引用、其实**是杜撰**的例子是"眼镜蛇效应"（cobra effect）：殖民时期德里悬赏死蛇、民众改为养蛇牟利的故事。这个词由德国经济学家 Horst Siebert 于 2001 年造出，但故事本身缺乏当代史料支撑，被考据为 apocryphal（<https://en.wikipedia.org/wiki/Perverse_incentive>）。讲反常激励时可以用它作寓言，但不应作为经过验证的历史证据。

有了这个起点，问题就精确了：博弈不可避免，但博弈的**成本**可高可低。诚实信号理论恰恰研究"如何让说谎比说真话更贵"，这正是抗博弈度量设计的理论内核。

---

## A. 诚实 / 昂贵信号理论：为什么昂贵信号难伪造

### 1. Zahavi 障碍原则（Handicap Principle）：从直觉到平反再到再质疑

**原始论文。** Amotz Zahavi, "Mate selection—A selection for a handicap," *Journal of Theoretical Biology* 53(1), 1975, 205–214. DOI:10.1016/0022-5193(75)90111-3（<https://www.sciencedirect.com/science/article/abs/pii/0022519375901113>）。Zahavi 的直觉：某些通过性选择演化出的性状（最经典的是孔雀的长尾）**降低携带者的生存能力**，这个"障碍"本身正是它作为信号有用的原因——只有真正高质量的个体才付得起这个障碍还能活下来，因此雌性以障碍为可靠的质量测试。核心逻辑是**"浪费即担保"（waste as guarantee）**：信号之所以诚实，是因为它昂贵到低质量者伪造不起。Zahavi 后来与 Avishag Zahavi 合著专著 *The Handicap Principle: A Missing Piece of Darwin's Puzzle*（Oxford University Press, 1997, ISBN 0-19-512914-8，<https://academic.oup.com/book/52748>）系统化了这一思想。

**争议史（第一幕：被否定）。** Zahavi 的直觉在 1970–80 年代被主流理论生物学冷遇甚至否证。John Maynard Smith 早期用模型论证障碍机制在遗传上难以成立；Mark Kirkpatrick 1986 年论文标题直接就是"The handicap mechanism of sexual selection does not work"。当时的替代解释是 Fisher 的"失控选择"（Fisherian runaway），认为夸张性状不必诚实、只需自我强化的偏好即可。参见 Wikipedia 的争议时间线（<https://en.wikipedia.org/wiki/Handicap_principle>）。

**争议史（第二幕：被平反）。** 转折点是 Alan Grafen, "Biological signals as handicaps," *Journal of Theoretical Biology* 144(4), 1990, 517–546. DOI:10.1016/S0022-5193(05)80088-8（PubMed: <https://pubmed.ncbi.nlm.nih.gov/2402153/>；作者自存 PDF: <https://users.ox.ac.uk/~grafen/cv/hcapsig.pdf>）。Grafen 构造了一个 **ESS（evolutionarily stable strategy，演化稳定策略）** 信号博弈模型，证明在相当一般的条件下存在**诚实信号均衡**：只要 (i) 信号对信号者有成本，(ii) 相同信号强度下低质量个体付出的**边际成本更高**，(iii) 接收者据信号做出的反应对信号者有利，则"按真实质量投资信号"是演化稳定的。Maynard Smith 在 Grafen 模型发表后转而给予形式支持，公开承认障碍原则"可以成立"。这个"数学证明了直觉"的故事成为教科书叙事。

**争议史（第三幕：再质疑——一个关键讹传的订正）。** 流行叙事常被压缩成一句"**Grafen 证明了 Zahavi 障碍原则是对的**"。近十余年的理论工作认为这句话**不准确**：

- Szabolcs Számadó, "The cost of honesty and the fallacy of the handicap principle," *Animal Behaviour* 81(1), 2011, 3–10. DOI:10.1016/j.anbehav.2010.09.022（<https://www.researchgate.net/publication/222662460>）指出：**维持诚实的不是均衡时实际支付的成本，而是"作弊的潜在成本"（potential cost of cheating）**。在诚实均衡上，信号者其实可以只付很低甚至接近零的实现成本；真正起作用的是"若某低质量者谎报，它将付出高得不划算的边际成本"。换言之，**是离均衡（off-equilibrium）的边际成本差异，而非在均衡上的绝对浪费，锁定了诚实**。Számadó 借用 Getty 的区分：**efficacy cost**（传递信息本身所需的成本）与 **strategic cost**（为保证可靠性而在均衡上额外支付的成本）——障碍原则严格版要求后者为正（真有浪费），但许多诚实信号系统里 strategic cost 可以为零。
- Dustin J. Penn & Szabolcs Számadó, "The Handicap Principle: how an erroneous hypothesis became a scientific principle," *Biological Reviews* 95(1), 2020, 267–290. DOI:10.1111/brv.12563（<https://onlinelibrary.wiley.com/doi/full/10.1111/brv.12563>；开放全文镜像 <https://arvindvenkatadri.com/teaching/6-in-short-the-world/modules/50-russia-maximgorky/BRV-95-267.pdf>）更进一步主张：**Grafen 的模型支持的是 Zahavi 的"第二假说"——即雄性按自身状态/条件调节信号投资（condition-dependent signalling）——而不是严格的"障碍原则"本身（浪费才诚实）**。他们认为"障碍原则"作为"信号因昂贵而诚实"的普适命题缺乏理论与经验支持，建议"体面退休"。

**对本项目的提炼（极其重要）**：诚实信号的正确内核不是"越浪费越可信"，而是**"作弊的边际成本必须随着质量下降而急剧上升"**。这对度量设计的启示是致命的——**你要设计的不是"贵"的评估，而是"对差的被评者来说伪造起来边际成本极高、对好的被评者来说反而便宜"的评估**。单纯提高所有人的成本（纯 handicap）既低效又未必诚实；提高成本的**差异性**（cost differential）才是关键。这条订正贯穿全文。

### 2. Spence 信号理论：教育、分离均衡与文凭通胀

**原始论文。** A. Michael Spence, "Job Market Signaling," *Quarterly Journal of Economics* 87(3), 1973, 355–374. DOI:10.2307/1882010（<https://academic.oup.com/qje/article-abstract/87/3/355/1909092>；公开 PDF 如 <https://www.sfu.ca/~allen/Spence.pdf>）。Spence 因信息经济学（含此工作）获 2001 年诺贝尔经济学奖。

**机制。** 劳动市场存在**信息不对称**：求职者知道自己的生产率，雇主不知道。教育即便**不提高**生产率，只要满足一个关键条件——**获取教育的成本与能力负相关（高能力者受教育更省力/更便宜）**——就能成为可信信号。于是市场可能停在一个**分离均衡（separating equilibrium）**：高能力者选择足够高的教育水平，低能力者发现模仿不划算而选择低水平，雇主据教育水平推断能力并给出对应工资，各类型都无动机偏离。这与第 1 节 Grafen/Számadó 的结论**同构**：诚实的支柱是**成本与被信号品质负相关**（低质量者伪造的边际成本更高），而非信号内容本身有实质产出。这也是为什么 Spence 与 Grafen 常被并列——Grafen 在其 1990 论文中即明确类比了经济学的信号模型。

**信号被稀释：文凭通胀（credential/degree inflation）。** 信号均衡不是稳态天堂，它会自我侵蚀：

- **稀释机制**：当越来越多人获得某一文凭，该文凭作为分离信号的能力下降，雇主抬高门槛（要求更高学历做同样的工作），于是产生 **credential inflation**——同一岗位所需的名义学历随时间上涨，而岗位实际技能要求未变。
- **Sheepskin effect（羊皮纸效应，指"拿到那张证书"本身的溢价）**：Bryan Caplan, *The Case Against Education*（Princeton University Press, 2018，<https://en.wikipedia.org/wiki/The_Case_Against_Education>）用它论证教育主要是信号：毕业年份的收入跳升远大于同等学习年数在非毕业年份的回报，说明市场买的是"完成/合规/守规范"的信号而非累积的人力资本。
- **讹传/争议提示**：Caplan 把学历回报中很大比例（他估计约一半甚至更多）归因于纯信号，这一比例本身**在经济学界有争议**（批评认为其信号占比估计偏高，且 sheepskin effect 也可部分由人力资本的"完成度阈值"解释）。参见 To Summarise 的系统批评（<https://www.tosummarise.com/criticisms-of-the-case-against-education-by-bryan-caplan-pt-2-inflated-signalling-estimates/>）。因此"教育纯粹是信号"是**过强表述**；稳妥说法是"教育同时含人力资本与信号成分，信号成分显著且导致文凭通胀"。

**对本项目的提炼**：任何评估信号一旦被广泛采用并被优化，都会经历"文凭通胀式"稀释——被评者向门槛聚集，信号的分辨力衰减。这意味着抗博弈不是"设计一次好指标"，而是**要预算信号的衰减速率并持续更新**（直接连到第 7 节的轮换/事后指标、第 10 节的动态评估）。

### 3. Skin in the Game：把评估错误的后果加在评估者身上

**原始文本。** Nassim Nicholas Taleb, *Skin in the Game: Hidden Asymmetries in Daily Life*（Random House, 2018；Incerto 系列，<https://en.wikipedia.org/wiki/Skin_in_the_Game_(book)>）。Taleb 的论证虽风格论战化，但对"评估者是否承担评估错误后果"这一问题极为切题。核心构件：

- **对称性（symmetry）**：做决策者必须同时承担上行收益与**下行损失**。Skin in the game 不只是激励问题，而是**风险的对称暴露**：谁享受了正确的果实，谁就得吃错误的苦。缺乏对称性时，风险被"转移"给他人。
- **代理人问题（agency problem）与官僚化**：Taleb 定义"agency"为"把风险在等式里挪来挪去的能力"；官僚制的本质是"把一个人方便地与其行为后果隔离开"。评估者/预测者若不承担错判后果，就是纯粹的代理人风险来源。
- **Via negativa**：稳健性更多来自"知道该移除什么"而非"该添加什么"；删除类行动比添加类行动更稳健，因为添加往往带来看不见的复杂反馈。用于度量设计即：**先删掉会被博弈、会诱发反常行为的坏指标，而非不断堆叠新指标**。
- **Lindy 效应**：非易腐事物的预期剩余寿命与其已存活时间成正比——存活越久的越可能继续存活。**讹传提示**：Lindy effect 并非 Taleb 首创，其名源自 1964 年 Albert Goldman 关于 Lindy's Deli 喜剧演员寿命的文章，经 Benoit Mandelbrot 形式化，Taleb 加以推广。用于抗博弈：**经受住时间与对抗压力仍未崩溃的评估（老而弥坚的指标）本身就是一种诚实性证据**——一个被无数人博弈过多年却仍有区分力的信号，比一个崭新、未经对抗检验的漂亮指标更可信。

**对本项目的提炼（关键张力点）**：把 skin in the game 施加到**评估者**身上，是抗博弈度量设计里最被忽视也最有力的一招。若评估者/裁判本身对"评错了"毫无损失（错放一个不合格者、错杀一个合格者都不影响其自身），评估必然向省事、可博弈、装点门面的方向漂移。第 10 节会把"评估者 skin in the game"落成具体清单项（如：评估团队须为其放行的系统在真实部署中的失败负责、评估集的失效要追溯到评估设计者）。

### 4. Costly signaling 在制度设计中的一般教训

把 1–3 抽象为可迁移的原则，另加一条重要的经验证据线：

- **宗教/组织里的昂贵信号（承诺筛选）**：Richard Sosis & Eric Bressler, "Cooperation and Commune Longevity: A Test of the Costly Signaling Theory of Religion," *Cross-Cultural Research* 37(2), 2003, 211–239（<https://journals.sagepub.com/doi/10.1177/1069397103037002003>）；理论根基见经济学家 Laurence Iannaccone 关于"严格教会为何兴盛"的论证——**要求牺牲、禁欲、耗时仪式的高门槛，恰恰把不愿付出的搭便车者（free-riders）筛出去**，从而提升群体内的信任与合作。这为"昂贵门槛 = 承诺的诚实信号"提供了跨文化经验支持。教训：**筛选器的价值不在于门槛高，而在于门槛对"假承诺者"贵、对"真承诺者"可承受**——再次是 cost differential，不是 cost level。
- **多任务代理：为什么"奖励可测的"会主动扭曲努力**：Bengt Holmström & Paul Milgrom, "Multitask Principal-Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design," *Journal of Law, Economics, & Organization* 7(Special Issue), 1991, 24–52（<https://academic.oup.com/jleo/article-abstract/7/special_issue/24/2194011>；公开 PDF <https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf>）。核心定理：当代理人要在**可测性不同**的多项任务间分配努力时，对易测任务给强激励，会诱使努力从难测但同样重要的任务上抽走；此时**最优合约可能是固定工资（弱化甚至不用绩效付酬）**，因为激励的作用不止是"让人努力"，还在于"引导努力在任务间的分配"。这是"抗博弈"最深刻的经济学定理之一：**指标越是只覆盖任务的一部分，越强的激励越有害**——它把 Bevan & Hood 的"synecdoche（以偏概全）"问题（第 5 节）从政治学落成了数学。

**四条一般教训（贯穿 B 部分）**：
1. **诚实来自成本的差异性，不是成本的绝对高度**（Számadó/Getty）。设计评估时问："对不合格者，伪造这个信号的边际成本是否远高于对合格者？"
2. **信号会随普及而通胀**（Spence 稀释）。必须预算衰减并更新。
3. **评估者必须承担评估错误的后果**（Taleb）。无 skin in the game 的裁判是系统性偏差源。
4. **覆盖不全的指标 + 强激励 = 主动扭曲**（Holmström-Milgrom）。宁可弱激励 + 多元判断，也不要对单一可测代理下重注。

---

## B. 抗博弈的度量 / 评估设计：可操作方法论

### 5. 配对指标 / 多指标制衡：让"同时博弈两端"变得昂贵

**问题的经典刻画。** Gwyn Bevan & Christopher Hood, "What's Measured Is What Matters: Targets and Gaming in the English Public Health Care System," *Public Administration* 84(3), 2006, 517–538. DOI:10.1111/j.1467-9299.2006.00600.x（<https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9299.2006.00600.x>；LSE 全文 <https://eprints.lse.ac.uk/16211/>）。他们指出以目标治理服务隐含一个**synecdoche（提喻/以偏概全）**谬误：用被测的一部分代表未被测的整体，于是"被测的成为唯一重要的"，即使这产生扭曲、博弈或对未测重要目标的挤出。他们给出的**博弈三分法**（英国 NHS 实证）：
- **Ratchet effect（棘轮效应）**：下一期目标按上一期表现设定，于是理性的做法是"别超额完成"，故意压低当期产出以免抬高未来门槛。
- **Threshold effect（阈值效应）**：统一门槛让"刚够线"成为焦点——差的被逼到线上，好的失去超越动机，表现向门槛收敛。
- **Output distortion（产出扭曲）**：为达成被测目标牺牲未测目标（含 cream-skimming 拣选、tunnel vision 隧道视野、goal displacement 目标替换、甚至直接造假）。

**配对/制衡的解法。** 抗博弈的一个核心手段是**paired / counterbalanced metrics（配对、相互制衡的指标）**：为每个"可被单独优化的指标"配一个"会因该优化而恶化的对立指标"，形成张力，使得**只博弈一端会立刻在另一端暴露**。经典例子：只考核"接诊速度"会牺牲质量与复诊率，故把"速度"与"复诊/再入院率""并发症率""患者满意度"配对；只考核代码"关闭工单数"配"回归缺陷率 + 变更失败率"。相关实务讨论见 Dean Spitzer, *Transforming Performance Measurement*（AMACOM, 2007，<https://books.google.com/books/about/Transforming_Performance_Measurement.html?id=fyX7Frm5DeEC>）关于让度量"至少部分相互冲突"以驱动更明智权衡的论述；以及 Kaplan & Norton 的 Balanced Scorecard 传统——把领先指标（leading）与滞后指标（lagging）耦合、把因果链画出来，使"操纵一端的后果被显式表达"，从而抬高单点博弈的成本。

**为什么更难被"同时博弈"（连回 A）。** 配对指标之所以抗博弈，是因为它把博弈的**成本结构**改成了"要骗就得同时骗多个相关但不共谋的维度"。对真正合格的被评者，多个维度自然一致、成本低；对不合格者，要同时在相互制衡的维度上都造出好看的数字，边际成本急剧上升——这正是第 1 节的 **cost differential** 逻辑在度量层的复现。局限：配对指标只压制 Regressional/Adversarial Goodhart 的一部分；若两个指标被同一种作弊手段同时拉高（共谋维度选得不好），制衡失效。故**配对的质量在于选出"真正正交、且作弊手段不相通"的对立面**。

### 6. Tin openers vs Dials：指标是"开罐器"不是"仪表盘"

**原始来源。** Neil Carter, "Performance indicators: 'Backseat driving' or 'hands off' control?," *Policy & Politics* 17(2), 1989, 131–138；及 Neil Carter, Rudolf Klein & Patricia Day, *How Organisations Measure Success: The Use of Performance Indicators in Government*（Routledge, 1992/1995，<https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9299.1991.tb00783.x> 为相关 1991 论文）。Carter 的区分：
- **Dial（仪表盘）**：把指标当作可直接读数、自动判定优劣、绑定奖惩的精确刻度。**这是博弈的温床**——一旦指标被当 dial 用并接上后果，Goodhart/Campbell 立即启动。
- **Tin opener（开罐器）**：指标不给答案，而是**打开一罐虫子、引发追问**——"这个数为什么异常？背后发生了什么？"指标是调查的起点而非终点，本身提供的是不完整、不精确的画面。

**为什么这抗博弈。** 把指标当 tin opener，等于**在指标与后果之间插入了一层人的解释与追问**，斩断了"数字 → 自动奖惩"的机械链路，而正是这条机械链路让博弈有利可图。若被评者知道异常数字换来的是**深入盘问**而非自动加分，操纵单一数字的期望收益骤降（这与第 3 节 skin in the game、第 9 节结构化判断相通）。相关实务解读见 University of Strathclyde 政策博客 "Dials and Tin-openers"（<https://www.strath.ac.uk/research/internationalpublicpolicyinstitute/ourblog/july2016/dialsandtin-openersperformancetargetsinthenhs/>）与 Andi Fugard 的整理（<https://andifugard.info/tin-openers-versus-dials/>）。

**对本项目的提炼**：抗博弈的第一性原则之一是**解耦"测量"与"判决"**。指标用于**触发调查**（tin opener）而非**自动结算**（dial）。第 10 节会把它落成"eval 与优化/晋级决策解耦"。

### 7. 保密 / 轮换 / 随机审计 / 事后指标：用不可预测性抬高博弈成本

这一族手段的共同逻辑，正是 A 部分的昂贵信号：**博弈需要先知道被优化的是什么。让指标不可预测，等于强行给作弊加上高昂且不确定的成本。**

- **随机审计 / 突击检查（random & surprise audits）**：不可预测的抽查把"被抓概率"从零抬到正值，且威慑效果远超实际抽查频率所对应的成本。税收实证：Advani et al., "The Dynamic Effects of Tax Audits," *Review of Economics and Statistics* 105(3), 2023, 545–561（<https://direct.mit.edu/rest/article/105/3/545/107397>）显示审计对申报行为的影响可持续约五年；"Tax Audits as Scarecrows"（NBER WP 23631，<https://www.nber.org/system/files/working_papers/w23631>）表明**仅仅是可信的审计威慑信号**就能显著提升合规，无需真的审计每个人——即"稻草人"效应。这对应第 3 节：让"作弊被发现的潜在成本"很高，即便均衡上很少真抓。
- **保持指标（部分）保密 / 不公布权重**：若被评者不知道确切评分函数与权重，就无法针对性地过拟合。这与安全经济学里"提高攻击者的侦察成本"同构。风险与张力：保密会牺牲**透明度与可申诉性**（被评者有权知道被如何评判），且违反研究评估里"评估者也要对其指标负责"的问责要求（见第 8/9 节的 Leiden Manifesto）。故实务折中常是"**公开评估维度与方法论、但保密具体测试项与权重**"（见第 10 节 held-out）。
- **轮换 / 动态更新指标**：定期更换、刷新指标，缩短任一指标"被摸透"的窗口，对抗 Spence 式稀释与 Adversarial Goodhart。代价是纵向可比性下降、被评者认知负担上升。
- **事后指标（ex-post / retrospective metrics）**：不预先宣布考核什么，而是**事后**根据真实结果回溯评价。因为被评者在行动时不知道哪一维度会被翻旧账，难以定向博弈。局限：事后追责的公平性、可预期性差，可能抑制正当冒险。

**统一原理**：这四招都在把"博弈"从"一次性摸清规则后的确定性优化"变成"面对不确定规则的高成本赌博"。用第 1 节语言说——**它们人为制造了 cost differential：对真正做对事的人，不确定性无所谓（他不靠猜规则）；对想投机的人，不确定性是昂贵的税**。但都以牺牲透明度/可预测性/可申诉性为代价，需与问责价值权衡。

### 8. OKR / KPI 实务的抗博弈经验

- **Vanity vs actionable metrics（虚荣 vs 可行动指标）**：Eric Ries, *The Lean Startup*（Crown Business, 2011）及其早期博文（<https://tim.blog/2009/05/19/vanity-metrics-vs-actionable-metrics/>）。**Vanity metrics**（页面浏览量、注册总数、累计下载）"让你感觉良好，却不指导你该做什么"，且天然易被做大（只增不减、无因果）。**Actionable metrics** 具备清晰的因果与可复现性——"若能说清什么让它升降，它就是可行动的"。抗博弈含义：**累计型、单调递增、无对照的指标最易虚荣化也最易博弈**；应偏好**同期群（cohort）、转化率、A/B 可归因**的指标。
- **Measurement inversion（测量倒置）**：Douglas W. Hubbard, *How to Measure Anything*（Wiley, 3rd ed. 2014）提出——**一个变量的测量经济价值，往往与它实际获得的测量关注度成反比**（<https://hubbardresearch.com/the-it-measurement-inversion/>）。最该测的常是被当作"不可测的无形量"（管理有效性、真实风险）而被忽略的东西，反而是易测的成本/进度被过度测量。抗博弈含义：**博弈往往发生在"过度测量的易测代理"上；把测量资源挪向高价值的难测量，反而降低整体可博弈面**。
- **Metric fixation 与其代价**：Jerry Z. Muller, *The Tyranny of Metrics*（Princeton University Press, 2018，<https://press.princeton.edu/books/hardcover/9780691174952/the-tyranny-of-metrics>）。Muller 把"metric fixation"（迷信标准化数字可替代基于经验的判断）的博弈表现归纳为：**creaming（拣选易达标对象）、降低标准做大数字、通过遗漏/扭曲数据美化、直接作弊**——"在警务、各级教育、医疗、非营利、商业，无处不在"。其正面主张与 Holmström-Milgrom、tin opener 一致：**保留专业判断，别用数字取代它**。
- **研究评估的"负责任度量"运动**：*The Metric Tide*（James Wilsdon 等，2015，HEFCE 独立评审）提出负责任度量五维——robustness, humility, transparency, diversity, reflexivity；*Leiden Manifesto*（Hicks, Wouters, Waltman, van Eck, Rijcke，*Nature* 520, 2015, 429–431）十原则，其首要原则即"**定量评估应支持而非取代定性专家判断**"；以及 DORA（2012）反对以期刊指标（如影响因子）评价个人。这三份文件共同的抗博弈立场：**指标辅助判断，判断不外包给指标**——直接连到第 6、9 节。

**实务清单（OKR/KPI）**：
1. 用 actionable、cohort、可归因指标，弃 vanity 累计量。
2. 为每个 KPI 配一个 counterbalance（第 5 节），并明确"作弊本 KPI 会在哪个配对项暴露"。
3. 把测量预算投向高价值难测量（对抗 measurement inversion）。
4. KPI 作 tin opener（触发复盘）而非 dial（自动绩效结算）。
5. 预设指标半衰期与轮换计划（对抗稀释）。

### 9. 临床 vs 精算 / 结构化判断：与 A 的诚实信号是"张力"关系

这一节刻意与前文制造张力：前面反复说"别把判决外包给数字、保留专家判断"，但半个多世纪的证据显示——**在很多预测任务上，机械/统计规则系统性优于专家直觉判断**。两者如何调和，正是抗博弈设计的精妙处。

- **Meehl 的经典结论**：Paul E. Meehl, *Clinical versus Statistical Prediction: A Theoretical Analysis and a Review of the Evidence*（University of Minnesota Press, 1954）。综述当时约 20 项对照研究，几乎一致显示**简单精算公式的预测不劣于、通常优于临床专家的整体印象**。
- **大规模元分析确认**：William Grove, David Zald, Boyd Lebow, Beth Snitz & Chad Nelson, "Clinical Versus Mechanical Prediction: A Meta-Analysis," *Psychological Assessment* 12(1), 2000, 19–30（<https://www.researchgate.net/publication/12564746>）。汇总 136 项跨领域研究：机械预测平均更准约 10%（效应量 d≈0.12 偏向机械），且在约 33–47% 的研究中显著胜出，仅约 5% 的研究临床判断更优。
- **结构化判断的实证胜利（Kahneman 的以色列军队案例）**：Daniel Kahneman 在 *Thinking, Fast and Slow*（2011）与 *Noise*（Kahneman, Sibony & Sunstein, 2021）中回忆，1950 年代他在以色列军队把"面试官凭 20 分钟整体印象打分"改为"就责任感、社交性等若干独立特质分别客观打分再机械汇总"，预测效度大幅提升。**关键细节**：面试官抵制纯机械化，Kahneman 折中——"照标准问完、逐项记录后，闭上眼把他想象成士兵，再给 1–5 分整体印象"；结果**六项特质之和 + 最后一个直觉分**比原来的纯整体印象准得多。这即"**结构化在前、直觉在后**"：先用机械化压制噪声与博弈，再让专家判断补充规则覆盖不到的信号。
- **"Broken leg" 例外——一个被广泛误用的概念（讹传订正）**：Meehl 的"断腿"思想实验常被拿来给"临床凌驾统计（clinical override）"背书。原意：若模型预测某人周五 99% 会去跳舞，但你**知道他今早摔断了腿**，你应推翻模型——因为这是罕见、决定性、可客观核实、且在训练分布之外的事实。但 Meehl 与后续（Dawes, Faust & Meehl, "Clinical versus actuarial judgment," *Science* 243, 1989, 1668–1674）反复强调：**"断腿"极其罕见，而临床医生倾向于过度声称自己发现了断腿，结果总体准确率反而下降**。所以正确读法是"**几乎永远信规则；只在你确实掌握了规则不知道的、可核实的决定性事实时才推翻**"，而不是"专家可凭感觉随时否决模型"。

**与诚实信号的张力如何调和。** 表面矛盾："专家判断更难被博弈（主观、不可预测、有 tin opener 性质），但更主观、更噪声、且自身可能有偏"；"机械规则更客观、更省噪声，但公开固定的规则最易被 Goodhart 过拟合。" 解法是**分工而非二选一**：
- 用**机械/结构化规则**做主干，压制噪声与偏见（Meehl/Grove）；
- 用**保留的专家裁量**做两件规则做不好的事：(i) 处理罕见、分布外的"断腿"信号（规则没见过的情形）；(ii) 充当 tin opener 与随机人审，专门盯规则最易被博弈的接缝——因为**"人会不定期深挖"这件事本身不可预测、难以定向博弈**，恰是第 7 节的昂贵信号。
- 但要给专家裁量**上锁**：override 必须书面说明理由、可事后审计、并统计其命中率（防止"过度声称断腿"）。这就把 Taleb 的 skin in the game（第 3 节）加到了专家身上——**谁 override，谁为 override 的后果负责并被追踪**。

一句话：**机械规则负责"抗噪声 + 可复现"，专家裁量负责"抗博弈 + 补分布外"，二者用问责（skin in the game）与审计缝合**。

### 10. 面向 AI eval 的综合：抗博弈的 agent / skill 评估清单

把 5–9 翻译成可直接落地的评估设计清单。先给 AI 语境的证据锚点，再给清单。

**AI 语境锚点。**
- **规约博弈是 AI 的固有面**：Victoria Krakovna et al., "Specification gaming: the flip side of AI ingenuity"（DeepMind Blog, 2020-04-21，<https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/>）——智能体满足目标的**字面**规约却不达成**意图**，即 reward hacking。这就是 Adversarial/Extremal Goodhart 的机器版。
- **静态基准会被污染与饱和**：数据污染（benchmark 泄进训练语料）使 GSM8K、MATH 等饱和；构造与 GSM8k 同难度的**held-out** GSM1k 后，部分模型掉分高达约 13%（过拟合证据）。LiveBench（ICLR 2025 Spotlight，月度刷新题目、自动客观评分，<https://livebench.ai/>）用"频繁更新"保证 contamination-free。OpenAI 亦警告 SWE-Bench Verified 日益暴露于污染，SWE-Bench Pro 采取"**公开一部分、保留 held-out 集**"来监测过拟合（<https://scale.com/blog/swe-bench-pro>）。
- **裁判本身会偏**：LLM-as-judge 存在 **self-preference bias**（偏好自己/低困惑度文本）、position bias、verbosity bias（"Self-Preference Bias in LLM-as-a-Judge," arXiv:2410.21819，<https://arxiv.org/abs/2410.21819>）。裁判无 skin in the game 且有系统偏好，是评估的博弈入口。
- **能力激发不足会低估、"评估博弈"会造假达标**：METR "Guidelines for capability elicitation"（<https://metr.org/blog/2024-03-15-guidelines-for-capability-elicitation/>）指出，糟糕的 elicitation 会大幅低估能力（有案例从 5% 修正到 100%），且模型可能被调成"在特定评估任务上假装失败却保留能力"；让评估包含**主动激发努力**能抬高这种"评估博弈"的成本——正是 A 部分的昂贵信号逻辑。

**抗博弈 agent/skill 评估 checklist（可直接采用）。**

*I. 任务本身要"贵而难伪造"（对应 A 的 cost differential）*
- [ ] **Held-out + 私有测试集**：公开评估维度与方法论，但**保留一部分从不公开、从不进任何训练/调参回路的私有任务**，只用于最终裁决（第 7 节保密 + 第 2 节抗稀释）。
- [ ] **动态 / 定期刷新任务池**：像 LiveBench 一样滚动更新，缩短"被摸透"窗口；记录每套题的"服役时长"，到期轮换（第 7 节轮换 + Lindy：长期存活仍有区分度的题保留）。
- [ ] **选"作弊边际成本对差系统极高"的任务**：优先端到端、需真实执行且结果可客观验证的任务（如真跑通的代码、可复现的实验），使"记住答案"无法直接得分；对合格 agent 便宜、对不合格 agent 昂贵（第 1 节）。
- [ ] **污染审计**：主动检测测试项是否泄入训练数据（如答案可被"猜全"、换选项顺序即掉分等信号），污染项作废。

*II. 指标结构要制衡、要触发追问（对应第 5、6 节）*
- [ ] **配对/counterbalanced 指标**：每个能力指标配一个"若走捷径就恶化"的对立指标（如"任务成功率"配"有害副作用率/资源消耗/对无关状态的破坏率/幻觉率"），使单点博弈立即在配对项暴露。
- [ ] **指标作 tin opener 而非 dial**：异常高分**触发人工深挖**而非自动放行/晋级；建立"红旗即调查"的流程。
- [ ] **覆盖多任务，警惕 Holmström-Milgrom 扭曲**：不要对单一可测代理下重注（否则 agent 会把"努力"从难测但重要处抽走）；宁可多维弱聚合。

*III. 评估者要有 skin in the game、要与优化解耦（对应第 3、6、9 节）*
- [ ] **eval 与优化/训练解耦**：优化(训练/调参/选型)只能看训练/验证集，**最终评估集对优化过程完全不可见**（等价于严格 train/test 分离 + 私有 held-out）。任何"拿最终 eval 反复调"的做法都会把 eval 变成被优化的目标，触发 Goodhart。
- [ ] **评估者 skin in the game**：放行某系统的评估团队，须对该系统在真实部署中的失败负责并被追踪；评估集若被证明可被平凡绕过，追责到评估设计者（把 Taleb 的对称性加到裁判身上）。
- [ ] **不把 LLM 裁判当唯一判决**：已知 self-preference/position/verbosity 偏差 → 用多裁判 + 打乱位置 + 长度归一 + 关键样本人审来交叉校验；裁判分歧大处强制人审。

*IV. 人工抽检不可测部分 + 结构化+裁量分工（对应第 7、9 节）*
- [ ] **随机人工抽检**：对自动分不可靠或最易博弈的接缝，做**不可预测的随机抽样人审**（第 7 节 random audit 的"稻草人"威慑——不必审全部，可信的随机审计即抬高作弊期望成本）。
- [ ] **结构化在前、专家裁量在后**：用结构化 rubric + 机械聚合压制评分噪声（Kahneman/Meehl）；再由专家处理 rubric 覆盖不到的"断腿"式分布外表现，但 override 必须书面记录、可审计、并统计其命中率（防"过度声称断腿"）。
- [ ] **主动能力激发（elicitation）**：评估要投入真实的激发努力（多种 prompt/脚手架/工具）以逼近能力上限，压制"装傻式评估博弈"（METR）。

*V. 元层：把评估当会衰减的信号来运营（对应第 2、4 节）*
- [ ] **预算信号半衰期**：假设任何公开 eval 一旦被广泛用于优化就会稀释；设定复审与退役节奏。
- [ ] **via negativa 优先**：先删掉已被证明可被平凡博弈、或与真实价值脱钩的旧 eval，而非无限堆新 eval（Taleb）。
- [ ] **记录并公开"已知绕过手段"**：像安全披露一样维护 eval 的"被博弈方式"清单，使配对与刷新有的放矢。

**一句话总纲**：抗博弈 AI 评估 = **held-out + 动态**（让作弊者不知道要优化什么）× **配对制衡 + 客观可执行**（让走捷径立刻暴露）× **eval 与优化解耦**（别让评估变成被优化的目标）× **评估者/裁判有 skin in the game**（让错判有代价）× **随机人审 + 结构化裁量分工**（补机械规则的盲区且不可定向博弈）。这五条，正是把 Zahavi 的 cost differential、Spence 的抗稀释、Taleb 的对称性、Carter 的 tin opener、Meehl/Kahneman 的结构化判断，逐条落到工程清单上。

---

## 结语：诚实不是"贵"，而是"对说谎者才贵"

把两条脉络合起来，本篇的中心结论是一句被反复验证的话：**没有绝对不可博弈的指标，只有"让说谎比说真话贵得多"的评估**。这条原则的进化生物学名字叫 handicap principle，但更精确的现代版本（Számadó/Penn）不是"越浪费越诚实"，而是"**作弊的边际成本必须随质量下降而急剧上升**"（cost differential）。它的经济学名字叫 separating equilibrium（Spence），它的风险哲学名字叫 skin in the game（Taleb），它的公共管理落地叫 paired metrics + tin openers（Bevan-Hood / Carter），它的心理测量落地叫 structured judgment（Meehl/Kahneman），它的 AI 落地叫 held-out + 动态 + 解耦 + 评估者担责。

抗博弈度量设计的真正对象因此不是"指标"，而是**博弈的成本结构**：让正确者便宜、让投机者昂贵、让裁判担责、让规则不可完全预知、让判决不外包给单一数字。

---

## 附录：讹传 / 误归因订正一览

| # | 流行说法（讹传） | 更准确的事实 | 主要依据 |
|---|---|---|---|
| 1 | "Grafen(1990) 证明了 Zahavi 障碍原则（浪费即诚实）是对的。" | Grafen 证明的是**条件依赖的诚实信号可为 ESS**，支持 Zahavi 的"第二假说"；诚实由**作弊的潜在/边际成本**维持，而非均衡上的绝对浪费。严格版 handicap 缺乏理论与经验支持。 | Számadó 2011 *Anim. Behav.* 81:3–10；Penn & Számadó 2020 *Biol. Rev.* 95:267–290 |
| 2 | "'当一个度量成为目标，它就不再是好度量' 是 Goodhart 的话。" | 这是 **Marilyn Strathern (1997)** 对 Goodhart 定律的转述；Goodhart 原话(1975)讲的是货币统计规律在受控时崩溃。 | Strathern 1997 *European Review* 5(3):305–321 |
| 3 | "Goodhart 定律 = Campbell 定律，可互换。" | Campbell (1976/1979) 独立提出、**时间更早**、且直接针对"社会指标 + 决策压力 → 腐蚀"，比 Goodhart 的货币语境更贴近社会绩效。 | Campbell 1979 *Eval. Program Plann.* 2:67–90 |
| 4 | "眼镜蛇效应是殖民德里真实发生的历史。" | 故事是 **apocryphal（无当代史料支撑）**；"cobra effect"一词由 Horst Siebert 约 2001 年造出，属寓言而非史实。 | Wikipedia "Perverse incentive"；多源考据 |
| 5 | "教育回报几乎全是信号（人力资本几乎无用）。" | Caplan 的高信号占比估计**在经济学界有争议**；主流认为教育兼含人力资本与信号成分，sheepskin effect 可部分由"完成度阈值"解释。 | Caplan 2018；To Summarise 的批评综述 |
| 6 | "Meehl 的 'broken leg' 说明专家可凭判断随时否决模型。" | 原意相反：**几乎永远信规则**，仅在掌握罕见、可核实、决定性的分布外事实时才推翻；实践中临床医生**过度**声称断腿反而降低准确率。 | Meehl 1954；Dawes, Faust & Meehl 1989 *Science* 243:1668–1674；Grove et al. 2000 |
| 7 | "Lindy 效应是 Taleb 提出的。" | 概念源自 Albert Goldman(1964)，经 Mandelbrot 形式化，Taleb 仅推广并命名化使用。 | Taleb 2018；概念史 |

## 参考文献（精选，含 URL）

**A. 诚实/昂贵信号**
- Zahavi, A. (1975). Mate selection—A selection for a handicap. *Journal of Theoretical Biology* 53(1):205–214. DOI:10.1016/0022-5193(75)90111-3. <https://www.sciencedirect.com/science/article/abs/pii/0022519375901113>
- Zahavi, A. & Zahavi, A. (1997). *The Handicap Principle: A Missing Piece of Darwin's Puzzle*. Oxford University Press. <https://academic.oup.com/book/52748>
- Grafen, A. (1990). Biological signals as handicaps. *Journal of Theoretical Biology* 144(4):517–546. <https://pubmed.ncbi.nlm.nih.gov/2402153/> · PDF <https://users.ox.ac.uk/~grafen/cv/hcapsig.pdf>
- Számadó, S. (2011). The cost of honesty and the fallacy of the handicap principle. *Animal Behaviour* 81(1):3–10. <https://www.researchgate.net/publication/222662460>
- Penn, D.J. & Számadó, S. (2020). The Handicap Principle: how an erroneous hypothesis became a scientific principle. *Biological Reviews* 95(1):267–290. DOI:10.1111/brv.12563. <https://onlinelibrary.wiley.com/doi/full/10.1111/brv.12563>
- Spence, A.M. (1973). Job Market Signaling. *Quarterly Journal of Economics* 87(3):355–374. <https://www.sfu.ca/~allen/Spence.pdf>
- Caplan, B. (2018). *The Case Against Education*. Princeton University Press. <https://en.wikipedia.org/wiki/The_Case_Against_Education>
- Taleb, N.N. (2018). *Skin in the Game: Hidden Asymmetries in Daily Life*. Random House. <https://en.wikipedia.org/wiki/Skin_in_the_Game_(book)>
- Sosis, R. & Bressler, E. (2003). Cooperation and Commune Longevity. *Cross-Cultural Research* 37(2):211–239. <https://journals.sagepub.com/doi/10.1177/1069397103037002003>
- Holmström, B. & Milgrom, P. (1991). Multitask Principal-Agent Analyses. *J. Law, Economics, & Organization* 7:24–52. <https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf>

**B. 抗博弈度量/评估**
- Goodhart, C. (1975/1984). Monetary Theory and Practice. （原始表述来源）见 <https://en.wikipedia.org/wiki/Goodhart's_law>
- Campbell, D.T. (1976/1979). Assessing the Impact of Planned Social Change. *Evaluation and Program Planning* 2(1):67–90. <https://ideas.repec.org/a/eee/epplan/v2y1979i1p67-90.html>
- Strathern, M. (1997). 'Improving ratings': audit in the British University system. *European Review* 5(3):305–321. <https://www.cambridge.org/core/journals/european-review/article/abs/improving-ratings-audit-in-the-british-university-system/FC2EE640C0C44E3DB87C29FB666E9AAB>
- Manheim, D. & Garrabrant, S. (2018). Categorizing Variants of Goodhart's Law. arXiv:1803.04585. <https://arxiv.org/abs/1803.04585>
- Bevan, G. & Hood, C. (2006). What's Measured Is What Matters. *Public Administration* 84(3):517–538. <https://eprints.lse.ac.uk/16211/>
- Carter, N. (1989). Performance indicators: 'Backseat driving' or 'hands off' control? *Policy & Politics* 17(2):131–138. 及 Carter, Klein & Day (1992) *How Organisations Measure Success*, Routledge. <https://www.strath.ac.uk/research/internationalpublicpolicyinstitute/ourblog/july2016/dialsandtin-openersperformancetargetsinthenhs/>
- Ries, E. (2011). *The Lean Startup*. Crown Business.（vanity vs actionable，<https://tim.blog/2009/05/19/vanity-metrics-vs-actionable-metrics/>）
- Hubbard, D.W. (2014). *How to Measure Anything* (3rd ed.). Wiley.（measurement inversion，<https://hubbardresearch.com/the-it-measurement-inversion/>）
- Muller, J.Z. (2018). *The Tyranny of Metrics*. Princeton University Press. <https://press.princeton.edu/books/hardcover/9780691174952/the-tyranny-of-metrics>
- Wilsdon, J. et al. (2015). *The Metric Tide*. HEFCE.；Hicks et al. (2015) Leiden Manifesto, *Nature* 520:429–431.；DORA (2012). <https://sfdora.org/>
- Meehl, P.E. (1954). *Clinical versus Statistical Prediction*. University of Minnesota Press.
- Grove, W. et al. (2000). Clinical Versus Mechanical Prediction: A Meta-Analysis. *Psychological Assessment* 12(1):19–30. <https://www.researchgate.net/publication/12564746>
- Dawes, R., Faust, D. & Meehl, P. (1989). Clinical versus actuarial judgment. *Science* 243:1668–1674.
- Kahneman, D. (2011). *Thinking, Fast and Slow*；Kahneman, Sibony & Sunstein (2021). *Noise*.
- Advani, A. et al. (2023). The Dynamic Effects of Tax Audits. *Rev. Econ. Stat.* 105(3):545–561. <https://direct.mit.edu/rest/article/105/3/545/107397>

**AI 评估**
- Krakovna, V. et al. (2020). Specification gaming: the flip side of AI ingenuity. DeepMind Blog. <https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/>
- White, C. et al. (2024). LiveBench. ICLR 2025 Spotlight. <https://livebench.ai/>
- SWE-Bench Pro (Scale AI, 2025). <https://scale.com/blog/swe-bench-pro>
- Self-Preference Bias in LLM-as-a-Judge (2024). arXiv:2410.21819. <https://arxiv.org/abs/2410.21819>
- METR (2024). Guidelines for capability elicitation. <https://metr.org/blog/2024-03-15-guidelines-for-capability-elicitation/>
