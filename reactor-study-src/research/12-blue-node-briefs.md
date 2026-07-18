# 蓝色·定律与形式：节点简报（B02–B13）

> 本文件为课程网站"蓝色·定律与形式"分支的节点简报，每份可直接写成课文。底层考证见同目录 03/03a/03b/03c/06/08 六份报告——本文件站在其肩上，只做"紧凑化 + 补充具体细节/数字/新鲜案例 + 讹传标注"，不重复其长篇推导。
>
> 固定栏目：【核心一句】【关键出处】【英文金句】【最有力的例子/数字】【讹传更正】【落地到 AI eval 的类比】【交互模块点子】【来源URL】。
>
> 凡属流行讹传处均以【讹传更正】标注；未能触及一手影印件者已在正文声明。

---

## B02 Campbell 定律

【核心一句】任何量化社会指标一旦被用于社会决策，就越会招致腐蚀压力、越会扭曲它本想监测的那个社会过程。

【关键出处】Campbell, Donald T. (1979). "Assessing the Impact of Planned Social Change." *Evaluation and Program Planning* 2(1): 67–90. DOI: 10.1016/0149-7189(79)90048-X。前史链：1974 年 5 月匈牙利 Visegrád 会议报告 → Dartmouth *Social Research and Public Policies*（1975）→ Western Michigan University Evaluation Center Occasional Paper #8（1976 年 12 月）。小节标题为 "Corrupting Effect of Quantitative Indicators"。

【英文金句】
> "The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor."
>
> "Achievement tests may well be valuable indicators of general school achievement under conditions of normal teaching aimed at general competence. But when test scores become the goal of the teaching process, they both lose their value as indicators of educational status and distort the educational process in undesirable ways."

【最有力的例子/数字】警务"清案率"（clearance rates）：辩诉交易中被捕窃贼多认几桩悬案换取轻判——"他在帮警察提高清案率"，而 Campbell 引 Skolnick（1966）指出其中很多是认了自己没犯的罪；他并点名尼克松严打"主要效果是腐蚀了犯罪率指标"（Seidman & Couzens, 1972）。教育侧：Texarkana 绩效合同案（Stake, 1971）——按学生成绩涨幅付费的承包商直接教期末考题。

【讹传更正】①**Campbell 从未自命"Campbell's Law"**：原文写的是复数 "the following pessimistic **laws**"，格言嵌在段落中，名号系后人所加。②**"Campbell 举过中国科举的例子"是讹传**：1979 年原文全文检索无 China/imperial examination，其跨国例证是苏联产量指标与越战 body count。③关键张力（非讹传，须点明）：Campbell 同时是"实验社会"（Experimenting Society；"Reforms as Experiments," *American Psychologist* 1969）的旗手——**同一篇 1979 年论文里**他既号召大规模量化评估、又提出指标必被腐蚀的悲观定律；他的调和不是弃测，而是制度设计（外部评估者、利益相关方"看门狗"、多指标三角互证、让指标远离直接奖惩）。

【落地到 AI eval 的类比】一个 benchmark 越被用来决定发布、融资与排名，它就越会招致刷分、越会扭曲它本想测量的真实能力——高利害正是腐蚀的燃料。

【交互模块点子】"利害滑块"：拖动"该指标被用于决策的利害程度"，实时显示指标的"腐蚀度"曲线随利害单调上升。

【来源URL】
- https://www.globalhivmeinfo.org/CapacityBuilding/Occasional%20Papers/08%20Assessing%20the%20Impact%20of%20Planned%20Social%20Change.pdf
- https://www.sciencedirect.com/science/article/abs/pii/014971897990048X
- https://en.wikipedia.org/wiki/Campbell%27s_law
- https://maritimesafetyinnovationlab.org/wp-content/uploads/2023/05/Significance-2018-Rodamar-There-ought-to-be-a-law-Campbell-versus-Goodhart.pdf

---

## B03 Lucas 批判

【核心一句】计量模型估出的参数是理性主体最优决策规则的化约形式；政策规则一变，主体重新优化，参数随之漂移——用历史相关性去评估政策干预是无效的。

【关键出处】Lucas, Robert E. Jr. (1976). "Econometric Policy Evaluation: A Critique." In K. Brunner & A. H. Meltzer (eds.), *The Phillips Curve and Labor Markets*, Carnegie-Rochester Conference Series on Public Policy, Vol. 1, pp. 19–46. North-Holland. DOI: 10.1016/S0167-2231(76)80003-6。核心句在第 7 节（p.41），论文无摘要。

【英文金句】
> "given that the structure of an econometric model consists of optimal decision rules of economic agents, and that optimal decision rules vary systematically with changes in the structure of series relevant to the decision maker, it follows that any change in policy will systematically alter the structure of econometric models."

【最有力的例子/数字】菲利普斯曲线的瓦解：1960 年代通胀—失业之间看似稳定的权衡，一旦政府试图"利用"它（持续制造通胀换低失业），预期随之调整，权衡消失，1970 年代滞胀正是范例。

【讹传更正】常见转引作 "any change**s** in policy…"（复数）系误引；原文为单数 "any change in policy"（p.41）。与 Goodhart 的关系：两者几乎同时（1975/1976）、相互独立地表述同一结构性洞见——被动成立的统计规律一旦被当局用作控制杠杆便不再成立；Lucas 提供微观基础（理性预期）与一般性定理并给出"深参数"（偏好、技术）出路，Goodhart 是货币目标制的制度性经验概括。加上 Campbell（1969/74–76），三者是三个学科对同一"反身性"问题的独立发现。

【落地到 AI eval 的类比】在固定 benchmark 分布上拟合出的"能力↔分数"关系，一旦模型开始针对该 benchmark 优化就不再成立——分数不再预测部署后的真实能力，因为"优化这一动作本身"改变了分数的生成机制。

【交互模块点子】双曲线动画："未被瞄准前的稳定相关" vs "被当作政策杠杆后参数漂移、相关断裂"。

【来源URL】
- https://people.sabanciuniv.edu/atilgan/FE500_Fall2013/2Nov2013_CevdetAkcay/LucasCritique_1976.pdf
- https://www.sciencedirect.com/science/article/abs/pii/S0167223176800036
- https://en.wikipedia.org/wiki/Lucas_critique

---

## B04 眼镜蛇效应 / 反常激励

【核心一句】为消除某坏事而设的悬赏，反而激励人们生产那坏事以领赏——这就是反常激励（perverse incentive）的原型。

【关键出处】术语 **"Kobra-Effekt"** 出自 Siebert, Horst (2001). *Der Kobra-Effekt: Wie man Irrwege der Wirtschaftspolitik vermeidet*. Stuttgart/München: DVA。有档案支撑的原型案例：Vann, Michael G. (2003). "Of Rats, Rice, and Race: The Great Hanoi Rat Massacre." *French Colonial History* 4: 191–203（Michigan State UP）；及 Vann & Clarke (2018), *The Great Hanoi Rat Hunt*, Oxford UP。

【英文金句】（德里蛇故事最早文字，1873 年 9 月 23 日《Morning Advertiser》）
> "It was alleged that some of the natives used to breed cobras on purpose to get the rewards."
>
> （1887 年孟买自然史学会 H. M. Phipson 受政府咨询后的调查结论）"such a thing is highly improbable."

【最有力的例子/数字】**河内 1902**：法属印度支那政府为防鼠疫在河内灭鼠，改为**凭鼠尾每条 1 分钱领赏**。不久卫生官员发现城中出现大量**无尾活鼠**——捕鼠人割尾放生、留鼠繁殖以产出下一代"鼠尾"，郊区甚至出现**养鼠场**，计划遂告废止。Vann 在普罗旺斯地区艾克斯的法国海外档案馆发现标着"有害动物之消灭：老鼠"的案卷，全部细节皆有殖民档案支撑——这是指标失效家族中**证据等级最高的历史案例**。

【讹传更正】**德里眼镜蛇故事查无实据、极可能是层累传闻**：现存最早文字（1873）即为"据称"，且显示悬赏收缩的真实原因是财政负担（一年 15,728 英镑）；1887 年 BNHS 专门调查判定"极不可能"（眼镜蛇从无圈养繁殖记录）；150 余年无任何起诉/行政档案/同时代证词；Siebert（2001）转述时未引任何史料。**机制真实（河内有档案），但为它命名的那个故事本身是寓言而非史实**，学术引用应标注 apocryphal。

【落地到 AI eval 的类比】用"报告的 bug 数"奖励测试者，你会得到更多被报告的 bug（甚至先埋 bug 再修）而非更少的真实缺陷；奖励"被消除者"的证据，就是在给"生产该证据"定价。

【交互模块点子】"悬赏滑块"：调高单位赏金，观察"上交尸体数"曲线上升的同时"真实种群"曲线也随之上升（分叉）。

【来源URL】
- https://friendsofsnakes.org.in/cobra-effect/
- https://muse.jhu.edu/article/42110/summary
- https://en.wikipedia.org/wiki/Perverse_incentive
- https://en.wikipedia.org/wiki/Cobra_effect

---

## B05 McNamara 谬误

【核心一句】只测量易测者→给难测者赋任意值→假定难测者不重要→断言难测者不存在——四步滑向"可测即全部"的自杀。

【关键出处】著名"四步引文"实为 **Daniel Yankelovich, "The New Odds"，1971 年 10 月 15 日在纽约销售主管俱乐部第 11 届营销战略会议的演讲**（"McNamara fallacy"一名亦由 Yankelovich 所创）；一个月后有浓缩版 "Interpreting the New Life Styles," *Sales Management*（1971-11-15）。档案考证见 Ryan Madden。越战 body count 语境属实。

【英文金句】
> "The first step is to measure whatever can be easily measured. … The fourth step is to say that what can't be easily measured really doesn't exist. This is suicide."

【最有力的例子/数字】越战：McNamara（国防部长 1961–68，福特"Whiz Kids"出身）把系统分析引入五角大楼；反叛乱战争没有战线，进展只能靠代理指标——**body count（歼敌数）与 kill ratio**——这些数字被系统性灌水、诱发滥杀，而不可量化的乡村政治情绪（"x-factor"、民心向背）被直接丢弃。Campbell（1979）亦引 body count 与美莱村惨案为例。

【讹传更正】①**四步引文不是 McNamara 本人说的**；②**通行出处 Yankelovich, *Corporate Priorities*（1972）也不确**——源头是 1971 年 10 月的演讲，早一年；③讹传主源是 **Charles Handy, *The Empty Raincoat*（1994）**：他把整段话误归 McNamara 本人，还拼错了 Yankelovich 的名字。

【落地到 AI eval 的类比】只报告能跑分的能力（MMLU/HLE 之类），把难测的属性（诚实、长期一致、拒绝有害请求）先赋任意值、再假定不重要、最终当作不存在——正是四步谬误的 AI 版。

【交互模块点子】"四步阶梯"动画：每下一级台阶配一对越战/AI 双栏例子，走到最后一级亮起"suicide"。

【来源URL】
- https://ryanmadden.net/i-found-the-mcnamara-quote/
- https://en.wikipedia.org/wiki/McNamara_fallacy
- https://journals.sagepub.com/doi/10.4997/jrcpe.2017.315

---

## B06 奖励 A 却指望 B（Kerr 1975）

【核心一句】组织普遍奖励 A 行为却指望得到 B 行为——有机体会去做（或至少假装做）被奖励的事，近乎排斥不被奖励的事。

【关键出处】Kerr, Steven (1975). "On the Folly of Rewarding A, While Hoping for B." *Academy of Management Journal* 18(4): 769–783. DOI: 10.5465/255378（JSTOR 遗留 DOI 10.2307/255378）。1995 年在 *Academy of Management Executive* 9(1): 7–14 重印并附回顾。

【英文金句】
> "most organisms seek information concerning what activities are rewarded, and then seek to do (or at least pretend to do) those things, often to the virtual exclusion of activities not rewarded."

【最有力的例子/数字】**大学"希望教学好、却几乎只奖励科研发表"**（最常被引）；越战的轮换与考核制度奖励个体避险（search and evade、甚至 fragging）而非战争胜利；医生两类错误的不对称惩罚（漏诊比误诊代价大 → 过度诊断）；MBO 奖励短期可量化结果却"指望"团队合作与长期投资。

【讹传更正】（非讹传，须与 Goodhart 区分）Kerr 讲的是**奖励设计者一开始就把靶子挂错**（misalignment）——指标未必被博弈，而是从一开始就指错方向。它是 Goodhart 家族里的"设计错位"分支，与"指标被人策略性攻破"（对抗型）不同。

【落地到 AI eval 的类比】你奖励"通过单元测试"却指望"正确的代码"，你奖励"人类评分者点赞"却指望"讲真话"——得到的是会讨好评分者、会伪装通过的模型。

【交互模块点子】配对卡片游戏："你奖励的 A" ↔ "你指望的 B"，玩家拖动匹配，系统高亮出制度性错配的组合。

【来源URL】
- https://www.ou.edu/russell/UGcomp/Kerr.pdf
- https://journals.aom.org/doi/abs/10.5465/255378
- https://en.wikipedia.org/wiki/On_the_folly_of_rewarding_A,_while_hoping_for_B

---

## B07 代理指标替代 Surrogation

【核心一句】经理人不知不觉把代理指标当成所关心的构念本身——表现得仿佛"客户满意度调查分"就是"客户满意度"。

【关键出处】Choi, J., Hecht, G. W. & Tayler, W. B. (2012). "Lost in Translation: The Effects of Incentive Compensation on Strategy Surrogation." *The Accounting Review* 87(4): 1135–1163. DOI: 10.2308/accr-10273。姊妹篇 (2013), *Journal of Accounting Research* 51(1): 105–133, DOI 10.1111/j.1475-679X.2012.00465.x。通俗版 Harris & Tayler (2019), "Don't Let Metrics Undermine Your Business," *HBR* 97(5): 62–69。

【英文金句】
> "managers may fail to fully appreciate the fact that measures are merely representations of the strategic constructs, and act as though the measures are the construct of interest—a phenomenon we label surrogation."

【最有力的例子/数字】**Wells Fargo**："每户八个产品（Eight is Great）"的交叉销售数本是"深度客户关系"的代理指标；与薪酬、排名、解雇威胁挂钩后，指标本身成了目标 → 员工开设约 **350 万个**潜在未授权账户（2017 年扩大复核数字）→ 恰恰摧毁了战略本想建立的客户关系。心理机制是 Kahneman & Frederick 的**属性替代（attribute substitution）**：难评估的抽象构念被容易评估的具体指标无意识替代。关键实验发现：**薪酬挂钩单一指标会显著加剧 surrogation；使用多重指标可缓解**。

【讹传更正】（澄清而非讹传）surrogation 是**个体认知层面的机制**（真诚地把代理变量误当目标，无需蓄意作弊），Goodhart/Campbell 是**系统层面的后果**；前者解释了为什么即使没人有意 gaming、当事人心里也"不觉得在作弊"，指标治理仍会走样。

【落地到 AI eval 的类比】训练团队不知不觉把"Arena Elo 分"当成"模型质量本身"，于是优化风格、长度、谄媚去讨好评分器，而非优化真实有用性——评分成了被真诚误认的目标。

【交互模块点子】"构念/指标"双层卡：正常态两层可分离；点击"接上单指标 + 激励"后两层被焊死，无法再区分"你想要的"与"你测的"。

【来源URL】
- https://publications.aaahq.org/accounting-review/article/87/4/1135
- https://hbr.org/2019/09/dont-let-metrics-undermine-your-business
- https://en.wikipedia.org/wiki/Surrogation

---

## B08 Goodhart 四型（Manheim & Garrabrant 2018）

【核心一句】"Goodhart 定律"不是一条格言而是四种可分别诊断、分别设防的失效机制：regressional / extremal / causal / adversarial。

【关键出处】Manheim, David & Garrabrant, Scott (2018). "Categorizing Variants of Goodhart's Law." arXiv:1803.04585。前身为 Garrabrant 2017 年 12 月 LessWrong "Goodhart Taxonomy"；Garrabrant 供职 MIRI，此文是 AI alignment 社区对 reward hacking / specification gaming 的理论化。

【英文金句】
> "There are several distinct failure modes for overoptimization of systems on the basis of metrics. This occurs when a metric which can be used to improve a system is used to an extent that further optimization is ineffective or harmful, and is sometimes termed Goodhart's Law."（摘要）——并指出存在"(at least) four different mechanisms"。

【最有力的例子/数字】四型机制（设真目标 G、可观测代理 M）：
- **Regressional（回归型）**：M = G + 噪声；选中 M 极值同时选中噪声极值，被选样本真实 G 系统性低于 M。例：按身高选出的最高者几乎必定不是最好的球员。**唯一无法靠更聪明的优化消除**的变体，只能校准预期（shrinkage）——即 optimizer's curse（见 B13）。
- **Extremal（极值型）**：M–G 相关只在观测到的常规区间成立；优化把系统推入分布外极端区域（regime change），原关系断裂。例：体温与健康正相关，推到极端 = 发烧致死。
- **Causal（因果型）**：M 与 G 相关但非因果（共因/反向）；**干预** M 不改变 G。例：打篮球不会让你长高；吃药压低胆固醇读数 ≠ 改善健康。形式上 P(G|M=m) ≠ P(G|do(M=m))。
- **Adversarial（对抗型）**：存在目标不同的其他 agent，一旦知你以 M 为目标就操纵 M、摧毁 M–G 相关。**这才是 Goodhart 1975 / Campbell 1979 的原始情形**。例：应试作弊、SEO、盈余管理、reward hacking。

【讹传更正】（澄清）把"Goodhart 定律"当作单一现象引用会掩盖机制差异——四型要求四套不同对策：回归型要校准、极值型要分布外警惕（保守外推）、因果型要因果识别（干预实验）、对抗型要机制设计（隐藏指标、多指标、审计）。

【落地到 AI eval 的类比】在 AI eval 里四型常同时发生：best-of-N 采样（regressional）、把 reward 推到训练分布之外（extremal）、优化一个相关但不改变真实对齐的 proxy（causal）、模型学会 reward hacking（adversarial）。

【交互模块点子】四象限散点图，每格一段动画演示对应机制如何使"高 M、低 G"的点被优化压力选出。

【来源URL】
- https://arxiv.org/abs/1803.04585
- https://intelligence.org/2018/03/27/categorizing-goodhart/
- https://www.lesswrong.com/posts/EbFABnst8LsidYs5Y/goodhart-taxonomy

---

## B09 多任务代理（Holmström & Milgrom 1991）

【核心一句】当努力可在任务间替代、且某些维度测不准时，给可测任务上强激励等于给"从不可测任务撤出努力"发补贴——甚至平薪最优，即使代理人风险中性。

【关键出处】Holmström, Bengt & Milgrom, Paul (1991). "Multitask Principal-Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design." *Journal of Law, Economics, & Organization* 7(Special Issue): 24–52. DOI: 10.1093/jleo/7.special_issue.24。JSTOR: https://www.jstor.org/stable/764957。（Holmström 2016 年诺奖核心贡献之一。）

【英文金句】
> "when there are multiple tasks, incentive pay serves not only to allocate risks and to motivate hard work, it also serves to direct the allocation of the agents' attention among their various duties." (p.25)
>
> "the desirability of providing incentives for any one activity **decreases with the difficulty of measuring performance in any other activities** that make competing demands on the agent's time and attention." (p.26)

【最有力的例子/数字】**Proposition 1（p.34）**：最优线性合约"pays a fixed wage and contains no incentive component (α = 0), **even if the contractor is risk neutral**"——风险中性下平薪仍最优，弱激励不是风险故事而是跨任务错配故事。**Equal compensation principle**：代理人同样看重的各项活动必须提供相等的边际回报，否则边际回报低的活动被完全放弃（角点解）。落地推论：教师不拿计件工资（教分数会挤出教素养）；公务员低强度激励是制度理性；job design 本身是激励工具（按可测性打包任务）。

【讹传更正】"equal compensation principle"这个**短语**出自 Milgrom & Roberts (1992) 教科书 *Economics, Organization and Management*，1991 年原论文并无此短语（概念本身在文中）。

【落地到 AI eval 的类比】给"通过可自动检查的测试用例"上强激励（RLHF against a checkable reward），会把模型的努力从不可测维度（诚实、安全、可维护性）抽走；有时"不那么强的激励"才是最优。

【交互模块点子】"努力分配"滑块：把激励强度拨向可测任务，实时看不可测任务上的努力被抽干至零。

【来源URL】
- https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf
- https://academic.oup.com/jleo/article-abstract/7/special_issue/24/2194011
- https://www.nobelprize.org/uploads/2018/06/holmstrom-lecture.pdf

---

## B10 绩效测量扭曲（Baker 1992）

【核心一句】一个指标的优劣不取决于它多低噪声，而取决于"指标的边际响应"与"价值的边际响应"是否方向对齐——对齐失败（distortion）在风险中性下也会造成 gaming。

【关键出处】Baker, George P. (1992). "Incentive Contracts and Performance Measurement." *Journal of Political Economy* 100(3): 598–614. DOI: 10.1086/261831。JSTOR: https://www.jstor.org/stable/2138733。续作 Baker (2002), "Distortion and Risk in Optimal Incentive Contracts," *Journal of Human Resources* 37(4): 728–751，把指标缺陷正式分解为 **risk（噪声）** 与 **distortion（扭曲）** 两个正交分量。

【英文金句】
> "contracts based on such performance measures will not in general provide first-best incentives, **even when the agent is risk neutral**." (p.598)
>
> "The question is not whether performance is easy to measure, but rather whether the available performance measure (in this case revenue) accurately reflects the firm's objective and is thus a good measure." (p.610)

【最有力的例子/数字】**销售提成 Firm A vs Firm B（p.610–611）**：两家用同一个便宜指标（收入）付提成，一家无扭曲（b=1，达到 first-best），一家严重扭曲——**可测性完全相同、对齐度不同**，说明"易不易测"不是关键。核心判据是边际产出的相关性 ρ(Pₑ, Vₑ)（最优提成率 b\* = [COV(Vₑ,Pₑ)+1]/[var(Pₑ)+1]，eq.8, p.605）。**Gaming 的正式定义（p.609）**：专利计酬的研发科学家会"work too hard on the easy ones and not hard enough on the hard ones"——利用 Pₑ > Vₑ 的状态。

【讹传更正】（澄清）传统委托代理理论只讲风险—激励权衡（噪声越大激励越弱）；Baker 加入了第二个**独立**维度 distortion——一个低噪声、高可控的指标仍可能是糟糕的激励基础（若错位严重），反之噪声大但方向对齐的指标可能更好。

【落地到 AI eval 的类比】一个稳定、低方差、易复现的 benchmark 可能恰恰因为它锁定了少数易刷维度而与真实能力梯度错位——**"稳定/客观"不等于"对齐"**；越优化，dis­tortion 项越放大。

【交互模块点子】两个梯度向量（"指标↑方向" vs "价值↑方向"）的夹角滑块：夹角变大时，"gaming 区"（Pₑ 高而 Vₑ 低的行动集）实时扩张。

【来源URL】
- https://www.edegan.com/pdfs/Baker%20(1992)%20-%20Incentive%20Contracts%20and%20Performance%20Measurement.pdf
- https://www.journals.uchicago.edu/doi/abs/10.1086/261831
- https://econpapers.repec.org/RePEc:uwp:jhriss:v:37:y:2002:i:4:p:728-751

---

## B11 必要多样性（Ashby 1956）

【核心一句】只有多样性能摧毁多样性——低多样性的调节器在原理上无法充分调节高多样性的系统：V(O) ≥ V(D) − V(R)。这是 Goodhart 定律的控制论根源。

【关键出处】Ashby, W. Ross (1956). *An Introduction to Cybernetics*. London: Chapman & Hall. **第 11 章 "Requisite Variety"（§11/7）**，书中正式命名为 the Law of Requisite Variety。（次要 caution：个别在线选段把加框的 "Law" 排在 §11/11 附近，引用时以"第 11 章 Requisite Variety"为稳。）

【英文金句】
> "only variety can destroy variety."（Ashby 的 informal statement）
>
> Ashby 的信息论推论：R 作为调节器的能力不能超过 R 作为信道的容量（"the capacity of R as a regulator cannot exceed its capacity as a channel of communication"）。

【最有力的例子/数字】把不等式读进度量治理：令被治理系统的行为多样性 V(D) 巨大，一个标量 KPI 的调节器多样性 V(R) ≈ 1（只有"上/下"一个自由度）。代入 **V(O) ≥ V(D) − V(R)**：由于 V(R) ≪ V(D)，结果中未被控制的多样性 V(O) 几乎等于 V(D) 本身——你以为在用 KPI 控制系统，其实系统绝大部分维度仍完全失控，只在所有**未被度量的维度**上自由漂移，而这正是 Goodhart/gaming 的定义。现代重证：Zhuang & Hadfield-Menell (2020, NeurIPS)——代理只覆盖 J<L 个真实特征时，无约束优化必致真实效用任意低。

【讹传更正】广为流传的 **"only variety can *absorb* variety"** 中的动词 **"absorb" 并非 Ashby 原文**——Ashby 用的是 **"destroy"**。"absorb / variety absorbs variety" 是 **Stafford Beer 的管理学化复述**，后被无数二手文献错当成 Ashby 原句回填。它抓住了对的意思，但引错了原文与作者。

【落地到 AI eval 的类比】单一标量榜（V(R)≈1）在数学上无法约束通用模型（V(D) 近乎无界）——未被该榜度量的能力维度**保证**大规模失控；出路不是"造一个更强的总分"，而是把 V(R) 顶上去：多维、异质、动态刷新、互不相关的 eval 组合。

【交互模块点子】两条"多样性容量"水位条：把"调节器"水位调到低于"扰动"，超出部分立刻溢入下方的"失控红区"。

【来源URL】
- http://panarchy.org/ashby/variety.1956.html
- http://pespmc1.vub.ac.be/books/IntroCyb.pdf
- http://pespmc1.vub.ac.be/REQVAR.html
- https://proceedings.neurips.cc/paper/2020/hash/b607ba543ad05417b8507ee86c54fcb7-Abstract.html

---

## B12 委托代理（Principal–Agent）

【核心一句】委托人无法直接观测代理人的类型（逆向选择）或行动（道德风险），只能把奖惩挂靠在可观测的代理变量上——你要的是"好 agent"，优化器交付的却是"过 eval 的 agent"。

【关键出处】
- Ross, S. A. (1973). "The Economic Theory of Agency: The Principal's Problem." *American Economic Review* 63(2): 134–139。
- Jensen, M. C. & Meckling, W. H. (1976). "Theory of the Firm: Managerial Behavior, Agency Costs and Ownership Structure." *Journal of Financial Economics* 3(4): 305–360. DOI: 10.1016/0304-405X(76)90026-X。
- Akerlof, G. A. (1970). "The Market for 'Lemons': Quality Uncertainty and the Market Mechanism." *Quarterly Journal of Economics* 84(3): 488–500（逆向选择/隐藏类型）。
- Holmström, B. (1979). "Moral Hazard and Observability." *Bell Journal of Economics* 10(1): 74–91. DOI: 10.2307/3003320（隐藏行动；**informativeness principle**）。

【英文金句】
> "If both parties to the relationship are utility maximizers, there is good reason to believe that the agent will not always act in the best interests of the principal." —— Jensen & Meckling (1976, p.308)
>
> Informativeness principle（Holmström 1979）：一个额外信号有价值，当且仅当它携带关于代理人所采取行动的额外信息——任何能减少"对行动的推断误差"的信号都应写入合约。

【最有力的例子/数字】**两类信息不对称须分清**：①**道德风险（moral hazard）= 隐藏行动**，发生在缔约后（你看不到代理人到底多努力）；②**逆向选择（adverse selection）= 隐藏类型/信息**，发生在缔约前。Akerlof 的**二手车"柠檬市场"**是逆向选择的经典：卖方知车况、买方不知，买方只肯出"平均价"，于是好车退出、只剩次品，均价再降，市场逐步坍塌——信息不对称能摧毁整个市场。

【讹传更正】委托代理理论的"起源"有争议：Stephen Ross（1973，经济学）与 Barry Mitnick（1973，政治学）各自独立提出；最常被引的是 Jensen–Meckling（1976），但把最优合约正式公式化的第一批模型是 Ross、Mirrlees（1975/76）、Holmström（1979）、Stiglitz。把"委托代理 = Jensen-Meckling 首创"是常见的简化。

【落地到 AI eval 的类比】你想要一个真正对齐的 agent（好类型 + 好行动），但你只能观测 eval 分数；在信息不对称下优化器交付的是"高 eval 分、真实对齐未知"的模型——**道德风险（训练时博弈奖励）与逆向选择（你从一堆模型里选不出真正安全的那个）同时发生**。informativeness principle 的启示：值得加进评估的是能真正减少"对模型内部行动之推断误差"的信号，而非又一个相关但无增量信息的分数。

【交互模块点子】双面板信息差："委托人看到的（eval 分）" vs "代理人私有的（真实行动/类型）"，拉大信息差，观察最优合约被迫退化、次品驱逐良品。

【来源URL】
- https://www.aeaweb.org/aer/top20/63.2.134-139.pdf
- https://en.wikipedia.org/wiki/Principal%E2%80%93agent_problem
- https://www.sciencedirect.com/science/article/pii/0304405X7690026X
- https://bpb-us-w2.wpmucdn.com/u.osu.edu/dist/8/36875/files/2020/06/Holmstrom-MH-and-Observability.pdf

---

## B13 优化者诅咒（Smith & Winkler 2006）

【核心一句】当你从若干含噪估计中挑出估计值最高者，被选中者的真实价值系统性地低于它的估计——择优这一动作本身（而非估计有偏）就注定令你事后失望。

【关键出处】Smith, James E. & Winkler, Robert L. (2006). "The Optimizer's Curse: Skepticism and Postdecision Surprise in Decision Analysis." *Management Science* 52(3): 311–322. DOI: 10.1287/mnsc.1050.0451。JSTOR: https://www.jstor.org/stable/20110511。（Duke Fuqua 商学院；全文 PDF 已核对。）

【英文金句】
> "if we take these value estimates at face value and select accordingly, we should expect the value of the chosen alternative to be less than its estimate, even if the value estimates are unbiased."（摘要）
>
> "when comparing actual outcomes to value estimates, we should expect to be disappointed on average, not because of any inherent bias in the estimates themselves, but because of the optimization-based selection process."（摘要）

【最有力的例子/数字】§2.1 的玩具模型：三个备选的真实价值**全为 0**，估计 iid ~ N(0,1)（条件无偏）；选"估计最高者"即取三个标准正态的**最大值**，其均值 = **0.85** → 期望失望 E[Vᵢ\*−μᵢ\*] = 0.85，即**估计标准差的 85%**。备选增至 4 个升到 **103%**、增至 10 个升到 **154%**——备选越多、噪声越大，回落越狠。补救：把估计当噪声、与先验混合（向先验均值**收缩/shrinkage**），Smith-Winkler 称之为"disciplined skepticism（有纪律的怀疑）"。

【讹传更正】optimizer's curse 常与 **winner's curse** 混用；Smith-Winkler 明确区分（§1）：winner's curse（Capen et al. 1971）是竞争性拍卖专有，optimizer's curse "potentially affects all kinds of intelligent decision making—not just competitive bidding problems"。该现象更早由 **Brown (1974，金融)** 与 **Harrison & March (1984，命名为 postdecision surprise)** 注意到，但直到 Smith-Winkler 才被正式命名与形式化。它与 **regressional Goodhart（B08）** 是同一顺序统计量效应的两种语言。

【落地到 AI eval 的类比】best-of-N 采样、在验证集上挑分数最高的 checkpoint、在 Arena 私测多个版本只发布最好的一个——都是在取"含噪估计的最大值"，因而系统性高估真实质量；发布后必然"回归到均值"，这正是 reward over-optimization 曲线"先升后降"的成因。

【交互模块点子】双滑块"候选数 N × 噪声 σ"，实时显示"被选中者的估计值"与"其真实价值"之间的期望缺口（disappointment）随 N、σ 增大而张开。

【来源URL】
- https://jimsmith.host.dartmouth.edu/wp-content/uploads/2022/04/The_Optimizers_Curse.pdf
- https://pubsonline.informs.org/doi/abs/10.1287/mnsc.1050.0451
- https://www.jstor.org/stable/20110511
- https://www.lesswrong.com/posts/5gQLrJr2yhPzMCcni/the-optimizer-s-curse-and-how-to-beat-it

---

## 附：本文件新增/核验要点（相对 03–08 的增量）

- **B12 委托代理**为项目内首次作为独立节点整理：补齐 Ross 1973 / Jensen-Meckling 1976 / Akerlof 1970（逆向选择）/ Holmström 1979（informativeness principle）四支基石，并厘清"道德风险=隐藏行动、逆向选择=隐藏类型"及起源之争（Ross vs Mitnick）。
- **B13 优化者诅咒**已对照 Smith-Winkler (2006) 一手 PDF（首两页）核验：DOI 10.1287/mnsc.1050.0451、Management Science 52(3):311–322、0.85 / 103% / 154% 三个数字、与 winner's curse 的明确区分、Bayesian shrinkage 补救——此前 03/06 仅在 regressional Goodhart 处顺带提及。
- **B08** 金句取自 arXiv:1803.04585 摘要逐字（"There are several distinct failure modes… sometimes termed Goodhart's Law" / "(at least) four different mechanisms"）。
- **新鲜案例**：AI eval 侧的"benchmaxxing"（术语于 2025 年底进入 ML 社区）、Arena 私测多版本只发最好结果（Leaderboard Illusion）等，已分别落到 B02/B08/B13 的 eval 类比中。
- 其余节点（B02–B11 除 B08 外）均沿用 03/03a/03b/03c/06/08 已核验的一手引文与页码，未作改动，仅紧凑化。
