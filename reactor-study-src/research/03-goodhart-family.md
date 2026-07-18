# 指标失效定律家族：Goodhart、Campbell、眼镜蛇效应及其亲属的深度考证

> 本报告对"指标一旦成为目标就会失效"这一定律家族做原始出处考证与机制梳理。该领域二手讹传极多，凡属流行讹传处均以【讹传警示】标注。除特别注明外，关键引文均已对照一手文献或权威考证核验。

---

## 一、Goodhart 定律：一条"小小脚注"的诞生

### 1.1 原始出处与确切表述

Goodhart 定律的原始出处是英国经济学家 Charles A. E. Goodhart（时任英格兰银行顾问）1975 年在澳大利亚储备银行会议上提交的论文：

- **Goodhart, C. A. E. (1975). "Problems of Monetary Management: The U.K. Experience." In *Papers in Monetary Economics*, Vol. I. Sydney: Reserve Bank of Australia.**
  后收入 A. S. Courakis (ed.), *Inflation, Depression, and Economic Policy in the West* (Barnes and Noble Books, 1981, p. 116)，以及 Goodhart 的文集 *Monetary Theory and Practice: The UK Experience* (Macmillan, 1984, 约 p. 96)。
  文献记录：https://link.springer.com/chapter/10.1007/978-1-349-17295-5_4 ；https://en.wikipedia.org/wiki/Goodhart%27s_law

原始表述（最常被核引的版本）：

> "Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes."
> （任何观测到的统计规律，一旦为了控制目的对其施加压力，就会趋于崩塌。）

**考证细节与不确定性说明**：这句话在 1975 年论文中是以半开玩笑的口吻提出的——Goodhart 仿照 Murphy's Law 的戏谑笔法把它称为一条"定律"。不同的权威转引之间存在措辞微差（"collapse" vs. "break down"；"pressure is placed upon it" vs. "pressure is applied to it"，见 Rodamar, *Significance*, Dec. 2018, DOI: 10.1111/j.1740-9713.2018.01205.x）。1975 年澳储行会议文集原件与 1984 年 Macmillan 重印本均无公开电子版，本报告未能对照原书扫描件逐字校核这一句——这是本考证中唯一未能触及一手影印件的核心引文，特此声明。另一常见转述（"whenever a government seeks to rely on a previously observed statistical regularity for control purposes, that regularity will collapse"）来自对其脚注的转引（见 https://en.wikipedia.org/wiki/Charles_Goodhart ）。

### 1.2 货币政策语境：英国货币目标制的失败

这条定律不是抽象格言，而是对具体政策失败的总结。背景链条如下：

1. **Competition and Credit Control（1971）**：英格兰银行放松信贷管制后，货币总量与名义收入之间此前稳定的统计关系（货币需求函数）开始动摇。
2. **£M3 目标制**：1970 年代中后期至撒切尔政府的 **Medium Term Financial Strategy（MTFS, 1980）**，英国以广义货币 £M3 为中介目标。结果 £M3 屡屡大幅超标，而通胀路径与之脱节——金融机构创造出不计入 £M3 的替代性负债工具来规避管制，被瞄准的总量与经济活动的关系随即瓦解。
3. Goodhart 在英格兰银行（1968–1985，先在 Economic Intelligence Department，后任高级顾问）亲历了这一切；英国最终于 1985–86 年实质放弃货币目标制，Goodhart 定律常被引为其智识注脚。

对这段语境最权威的梳理是 **K. Alec Chrystal & Paul Mizen (2003), "Goodhart's Law: Its Origins, Meaning and Implications for Monetary Policy"**，收入 P. Mizen (ed.), *Central Banking, Monetary Theory and Practice: Essays in Honour of Charles Goodhart*, Vol. 1, Edward Elgar（初稿为 2001 年 11 月英格兰银行 Goodhart 荣休研讨会论文）。文献记录：https://www.semanticscholar.org/paper/0062a8e2981230185c88819776e600419ed1426d

### 1.3 Goodhart 本人如何看待定律的流行化

Goodhart 对自己因这条戏语成名颇感啼笑皆非。他写道：

> "it does feel slightly odd to have one's public reputation largely based on a minor footnote."
> （靠一条小小的脚注支撑起自己的公共声誉，感觉确实有点古怪。）
> —— Goodhart, C. (1997). "Whither Now?" *Banca Nazionale del Lavoro Quarterly Review*, 50: 385–430。（转引见 https://en.wikipedia.org/wiki/Charles_Goodhart ）

他也多次强调：如今广为流传的"When a measure becomes a target…"那句漂亮话**不是他写的**（见下节）；他本人的原始命题严格限定于货币控制语境，是后人将其推广为普适格言。

---

## 二、Strathern 版本：一条格言的三级接力

### 2.1 确切出处

- **Strathern, Marilyn (1997). "'Improving ratings': audit in the British University system." *European Review*, 5(3): 305–321.** Wiley 原始 DOI: `10.1002/(SICI)1234-981X(199707)5:3<305::AID-EURO184>3.0.CO;2-4`；现行 Cambridge Core DOI: `10.1017/S1062798700002660`。全文影印：https://gwern.net/doc/statistics/decision/1997-strathern.pdf
  该文改写自 1997 年 3 月 11 日剑桥 Girton College 的 Founders' Memorial Lecture，语境是英国大学的审计文化（RAE 科研评估、学位成绩通胀）。

原文第 308 页逐字为：

> "When a measure becomes a target, it ceases to be a good measure. The more a 2.1 examination performance becomes an expectation, the poorer it becomes as a discriminator of individual performances. Hoskin describes this as 'Goodhart's law', after the latter's observation on instruments for monetary control which lead to other devices for monetary flexibility having to be invented."

### 2.2 三级接力链：Goodhart → Hoskin → Strathern

对照一手文献可以还原一条比通行说法更精细的传播链：

1. **Goodhart (1975)**：狭义、技术性的货币经济学命题（统计规律 + 控制压力 → 崩塌）。
2. **Keith Hoskin (1996)**：管理会计学者 Hoskin 在书章 "The 'awful idea of accountability': inscribing people into the measurement of objects"（收入 R. Munro & J. Mouritsen (eds.), *Accountability: Power, Ethos and the Technologies of Managing*, International Thomson Business Press, pp. 265–282；影印 https://gwern.net/doc/statistics/decision/1996-hoskin.pdf ）开篇写道："'Goodhart's Law' – that every measure which becomes a target becomes a bad measure – is inexorably, if ruefully, becoming recognized as one of the overriding laws of our times." 是 **Hoskin 首先剥离了货币语境、把它推广为关于一切测量的普适定律**，并在脚注里坦承这是对原始表述的"更一般的重新定义"。
3. **Strathern (1997)**：读到 Hoskin 后，把他的表述重新锻造成如今那句节奏更佳、主谓分明的格言，并沿用了 Hoskin 的"Goodhart's law"命名。

【讹传警示】**"When a measure becomes a target, it ceases to be a good measure" 不是 Goodhart 的原话**，而是 Strathern 1997 年的措辞（其"泛化"这一步则归功于 Hoskin 1996）。大量文献、演讲乃至 Wikipedia 首句都把这句话直接安在 Goodhart 名下，属于典型的名实错位：定律之"名"归 Goodhart，流行之"句"归 Strathern。

**与原版的实质差异**：Goodhart 版的主语是"统计规律"（一种经验相关性），失效机制是控制压力下的行为适应，语域是宏观金融；Strathern 版的主语是"测量"本身，适用于任何考核情境（考试、KPI、评级、审计），且删去了机制表述，成为纯粹的结果性格言。泛化带来了传播力，也丢失了原版对"为什么会失效"的暗示。

---

## 三、Campbell 定律：警示指标腐蚀的人，同时是"实验社会"的旗手

### 3.1 确切出处与表述

- **Campbell, Donald T. (1979). "Assessing the impact of planned social change." *Evaluation and Program Planning*, 2(1): 67–90.** DOI: 10.1016/0149-7189(79)90048-X。https://www.sciencedirect.com/science/article/abs/pii/014971897990048X
  前史：1974 年 5 月匈牙利 Visegrád 社会心理学会议报告 → 收入 G. M. Lyons (ed.), *Social Research and Public Policies*（Dartmouth College, Public Affairs Center, 1975）→ Western Michigan University Evaluation Center **Occasional Paper #8**（1976 年 12 月，重印 Dartmouth 版）。全文影印：https://www.globalhivmeinfo.org/CapacityBuilding/Occasional%20Papers/08%20Assessing%20the%20Impact%20of%20Planned%20Social%20Change.pdf

原文（Occasional Paper 版 p. 49，小节标题 "Corrupting Effect of Quantitative Indicators"）逐字为：

> "The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor."

【讹传警示】两处细节常被抹平：其一，Campbell 原文说的是 "the following pessimistic **laws**"（复数），这句格言嵌在段落之中，**他本人从未命名"Campbell's Law"**，该名号是后人所加。其二，教育一段的流行引文常从大写 "Achievement tests may well be…" 起句，原文实为段中小写、前有 "From my own point of view," ——属无伤大雅的截引，但精确引用时应注意。

### 3.2 原始例子（均出自一手文本）

- **警务统计**：以"清案率"（clearance rates）考核警队导致双重腐蚀——不记录或延迟记录报案；辩诉交易中，被捕窃贼多认几桩悬案可换轻判，"他在帮警察提高清案率"，Campbell 引 Skolnick (1966) 指出其中很多是认了自己没犯的罪。他还点名尼克松的严打："其主要效果是腐蚀了犯罪率指标（Seidman & Couzens, 1972）——通过漏记和把罪案降格为较轻类别实现。"
- **教育测试**：Texarkana 绩效合同案（Stake, 1971）——按学生成绩涨幅付费的承包商直接教期末考题。随后是那段名言："当考试分数成为教学过程的目标时，它们既丧失了作为教育状况指标的价值，又以不良方式扭曲教育过程。……成绩测验实际上是高度可腐蚀的指标。"
- **跨国例证**：苏联工业产量指标文献（Granick 1954；Berliner 1957），以及越战 body count 与美莱村惨案（见第六.1 节）。

【讹传警示】流传的"Campbell 举了中国科举的例子"**在 1979 年原文中不存在**——全文检索无 China/Chinese/imperial examination 字样，唯一涉及考试的是关于入学考试的插句。该例子来自后人的二手演绎。

### 3.3 关键张力：Campbell 同时是"实验社会"的倡导者

Campbell 是二十世纪最重要的方法论学者之一：与 Julian Stanley 合著《Experimental and Quasi-Experimental Designs for Research》(1963)，与 Fiske 共创聚合/区分效度（1959），并以 **"Reforms as Experiments"（*American Psychologist*, 1969, 24(4): 409–429）** 和 "Methods for the Experimenting Society" 系列倡导 **Experimenting Society**——用严格测量的社会实验来指导改革。

张力在于：**同一篇 1979 年论文里**，他既号召社会大规模采用量化评估，又提出量化指标必被腐蚀的"悲观定律"。他的自我调和方案不是放弃测量，而是制度设计：引入外部评估者、让工会等利益相关方充当"看门狗"、多指标三角互证、尽量让指标远离直接奖惩回路——"我们应当研究腐败得以被揭露的社会过程，并尝试设计吸纳这些特征的社会系统"。换言之，Campbell 定律是 Experimenting Society 的内置警戒条款，而非对它的否定。这一张力使 Campbell 比多数援引者深刻：他不是"反指标主义者"，而是指标的清醒使用者。

---

## 四、Lucas 批判（1976）：宏观经济学的同构版本

- **Lucas, Robert E. Jr. (1976). "Econometric Policy Evaluation: A Critique." In K. Brunner & A. H. Meltzer (eds.), *The Phillips Curve and Labor Markets*, Carnegie-Rochester Conference Series on Public Policy, Vol. 1, pp. 19–46. North-Holland.** DOI: 10.1016/S0167-2231(76)80003-6。全文：https://people.sabanciuniv.edu/atilgan/FE500_Fall2013/2Nov2013_CevdetAkcay/LucasCritique_1976.pdf

核心命题（原文 p. 41，"single syllogism"，逐字）：

> "given that the structure of an econometric model consists of optimal decision rules of economic agents, and that optimal decision rules vary systematically with changes in the structure of series relevant to the decision maker, it follows that any change in policy will systematically alter the structure of econometric models."

即：计量模型的估计参数是理性主体最优决策规则的化约形式，政策规则一变，主体重新优化，参数随之漂移——"用当前宏观计量模型比较备选政策规则的效果是无效的，无论模型样本内拟合和短期预测表现多好"。菲利普斯曲线的瓦解是范例。（注意：原文为单数 "any change in policy"，常见复数转引 "any changes" 系误引；此句在第 7 节结语，论文没有摘要。）

**与 Goodhart 定律的关系**：两者几乎同时（1975/1976）、相互独立地表述了同一结构性洞见——被动成立的统计规律，一旦被当局用作控制杠杆便不再成立。差异在于：Lucas 提供了微观基础与 rational expectations 机制，是关于一切宏观计量关系的一般性定理，并给出"深参数"（偏好、技术）与化约参数的区分作为出路；Goodhart 是关于货币总量目标制的制度性经验概括，未建形式模型。可以说 Goodhart 定律 ≈ Lucas 批判 + 博弈规避（gaming）在货币政策语境的特例；而在时间上，Campbell 的相关表述（1969/1974–76）还略早于两者——三条定律是三个学科对同一"反身性"问题的独立发现。

---

## 五、眼镜蛇效应：一个虚构嫌疑极大的故事和一个有档案的故事

### 5.1 Horst Siebert 与术语的诞生

- **Siebert, Horst (2001). *Der Kobra-Effekt: Wie man Irrwege der Wirtschaftspolitik vermeidet*. Stuttgart/München: Deutsche Verlags-Anstalt (DVA).**
  Siebert 时任基尔世界经济研究所（IfW）所长、德国经济专家委员会成员。"Kobra-Effekt"（眼镜蛇效应）一词由此书创造并流行，书以德里眼镜蛇轶事开篇立论——**但 Siebert 未给出任何史料出处**。

### 5.2 德里眼镜蛇故事的史实性：基本可断定为无据传闻

故事版本：英属印度政府悬赏眼镜蛇尸体→民众养蛇领赏→政府废止悬赏→养殖蛇被放生→蛇患更甚。**考证结论：查无实据，极可能是层累而成的殖民时代传闻。**证据链（综合 Friends of Snakes Society 2025 年档案调查，https://friendsofsnakes.org.in/cobra-effect/ ；另见 https://en.wikipedia.org/wiki/Perverse_incentive ）：

- 现存最早的"养蛇骗赏"文字是 **1873 年 9 月 23 日《Morning Advertiser》**报道，原文措辞是 "**It was alleged** that some of the natives used to breed cobras on purpose to get the rewards"——纯属"据称"，且该报道显示悬赏收缩的真实原因是财政负担（一年支出 15,728 英镑），不是养殖骗局。
- **1887 年孟买自然史学会（Bombay Natural History Society）受政府咨询专门调查此传闻**，H. M. Phipson 的结论是 "such a thing is highly improbable"（此事极不可能）：眼镜蛇从无圈养繁殖记录；被指"养蛇"者的实际行为是保存蛇卵孵化以验明品种领赏——完全合法。
- 150 余年间**无任何起诉记录、行政档案或同时代证词**支持"养殖—放生"情节。
- Siebert 2001 年将传闻当作史实转述，未查档案。

判定：**"眼镜蛇效应"这个概念所描述的机制是真实存在的（见河内案例），但为它命名的那个故事本身是 parable（寓言）而非 history（史实）。**学术写作引用时应标注 apocryphal。

### 5.3 河内老鼠悬赏（1902）：有档案支撑的"眼镜蛇效应"

- **Vann, Michael G. (2003). "Of Rats, Rice, and Race: The Great Hanoi Rat Massacre, an Episode in French Colonial History." *French Colonial History*, 4: 191–203.** Michigan State University Press。https://muse.jhu.edu/article/42110/summary
- **Vann, Michael G. & Liz Clarke (2018). *The Great Hanoi Rat Hunt: Empire, Disease, and Modernity in French Colonial Vietnam*. New York: Oxford University Press.**

史实：1902 年法属印度支那政府为防鼠疫在河内下水道灭鼠，先按只计酬，后改为**凭鼠尾领取每条 1 分钱赏金**。不久卫生官员发现城中出现大量**无尾活鼠**——捕鼠人割尾放生，留鼠繁殖以产出下一代"鼠尾"；郊区甚至出现**养鼠场**。计划遂告废止。Vann 1995 年在普罗旺斯地区艾克斯的法国海外档案馆研究博士论文时发现标着"有害动物之消灭：老鼠"的案卷，全部细节皆有殖民档案支撑。这是指标失效家族中**证据等级最高的历史案例**，与无据的德里蛇故事恰成对照。

---

## 六、亲属定律与概念逐一考证

### 6.1 McNamara 谬误（quantitative fallacy）

【讹传警示】著名的四步引文——"The first step is to measure whatever can be easily measured. … The fourth step is to say that what can't be easily measured really doesn't exist. This is suicide."——**既不是 McNamara 说的，通行的出处（Yankelovich, *Corporate Priorities*, 1972）也是错的**。档案考证（Ryan Madden，https://ryanmadden.net/i-found-the-mcnamara-quote/ ；另见 https://en.wikipedia.org/wiki/McNamara_fallacy ）确认：该段出自社会学家 **Daniel Yankelovich 1971 年 10 月 15 日在纽约 Sales Executives Club 第十一届 Marketing Strategy Conference 的演讲 "The New Odds"**，"McNamara fallacy"一名亦由他所创。讹传主源是 **Charles Handy《The Empty Raincoat》(1994)**——Handy 把整段话误归 McNamara 本人，还拼错了 Yankelovich 的名字。

概念所指的史实背景则是真的：McNamara 任国防部长期间（1961–68）以系统分析治军，越战以 **body count（歼敌数）** 为核心进展指标，导致虚报、滥杀与战略误判——可量化的歼敌数替代了不可量化的"民心向背"，成为"把可测量者当作全部"的原型案例（Campbell 1979 亦引 body count 与美莱村为例）。

### 6.2 Kerr (1975)：奖励 A 却指望 B 的愚行

- **Kerr, Steven (1975). "On the Folly of Rewarding A, While Hoping for B." *Academy of Management Journal*, 18(4): 769–783.** DOI: 10.5465/255378。1995 年在 *Academy of Management Executive* 9(1): 7–14 重印并附回顾。

核心论点：组织普遍存在"奖励结构所奖励的行为，恰是奖励者想抑制的；而其指望的行为却得不到奖励"。原始例子：大学"希望教学好，却只奖励发表"；越战的轮换与考核制度奖励个体避险而非战争胜利；医生的两类错误不对称（误诊有病比漏诊无病代价小，故过度诊断）；MBO 的短期化。Kerr 讲的是**奖励设计错位**，是 Goodhart 家族里"制度设计者自己把靶子挂错"的分支——指标未必被博弈，而是一开始就指错了方向。

### 6.3 Surrogation：管理会计的认知机制研究

- **Choi, J., G. W. Hecht & W. B. Tayler (2012). "Lost in Translation: The Effects of Incentive Compensation on Strategy Surrogation." *The Accounting Review*, 87(4): 1135–1163.** DOI: 10.2308/accr-10273。
- **Choi, Hecht & Tayler (2013). "Strategy Selection, Surrogation, and Strategic Performance Measurement Systems." *Journal of Accounting Research*, 51(1): 105–133.**

**Surrogation** 指经理人"表现得仿佛测量指标就是所关心的构念本身"（"act as though the measures are the construct of interest"）——把"客户满意度调查分"当成"客户满意度"。心理机制是 Kahneman & Frederick 的 **attribute substitution**（属性替代）。实验发现：**把薪酬与单一指标挂钩会显著加剧 surrogation；使用多重指标可缓解**。通俗阐述见 Harris & Tayler (2019), "Don't Let Metrics Undermine Your Business", *Harvard Business Review*（以 Wells Fargo 为例）。与 Goodhart 定律的关系：surrogation 是**个体认知层面的机制**（真诚地把代理变量误当目标，无需有意作弊），Goodhart/Campbell 是**系统层面的后果**；前者解释了为什么即使没人蓄意 gaming，指标治理仍会走样。

### 6.4 Teaching to the test：NCLB 时代的实证研究

美国 **No Child Left Behind Act（2001 年通过、2002 年生效）** 建立了全国性高利害考试问责制。核心实证文献：

- **Koretz, Daniel (2017). *The Testing Charade: Pretending to Make Schools Better*. University of Chicago Press**；及其 *Measuring Up* (Harvard UP, 2008)。Koretz 的核心概念是 **score inflation**：高利害考试分数的上涨远超低利害审计性考试（如 NAEP）所显示的真实学力增长——即 Campbell 定律的教育计量学表述。
- **Koretz & Barron (1998). *The Validity of Gains in Scores on the Kentucky Instructional Results Information System (KIRIS)*. RAND MR-1014.** https://www.rand.org/pubs/monograph_reports/MR1014.html ——肯塔基 KIRIS 分数 1992–95 大涨，但同批学生 ACT 成绩纹丝不动（数学差距约 0.7 SD，阅读约 0.4 SD），坐实分数通胀。更早还有"Lake Wobegon 效应"（Cannell, 1987：各州都自称高于全国平均）。
- **Jacob, Brian & Steven Levitt (2003). "Rotten Apples: An Investigation of the Prevalence and Predictors of Teacher Cheating." *Quarterly Journal of Economics*, 118(3): 843–877.** ——用答案串模式检测，估计芝加哥小学**每年至少 4–5% 的班级存在教师/管理者改卷作弊**，且作弊率随问责压力上升。

### 6.5 苏联计划经济的指标扭曲：笑话与学术的分界

【讹传警示】"钉子工厂"故事（按吨考核→造几根巨钉；按枚考核→造百万小钉）**不是某家工厂的记录在案的史实，而是苏联讽刺画的一个真实"体裁"**：Nove 本人在《The Soviet Economic System》(1977) 第 94 页转述过一幅苏联漫画——车间里悬着一根巨钉，厂长指着它说"本月计划完成了……当然，是按吨"。该体裁通常联系到官方讽刺杂志**《Krokodil（鳄鱼）》**，但那幅著名漫画的确切刊期**从未被可靠定位**（1954/1955/1957 诸说均无一手确证，有研究者回忆见过原件却找不回出处）；西方流行版本（"厂长因吨位超额获列宁勋章、两台起重机吊一根巨钉"，如 Paul Craig Roberts 的转述）已属演绎加工。

把这则笑话变成严肃学术的是 **Alec Nove**：

- **Nove, Alec (1958). "The Problem of 'Success Indicators' in Soviet Industry." *Economica*, 25(97): 1–13**；
- **Nove (1977). *The Soviet Economic System*. London: George Allen & Unwin**（第三版 1987，Unwin Hyman）。

Nove 系统分析了 **success indicator problem**：以 **val**（валовая продукция，总产值）或实物量（吨、件、平米）考核时，"总量指标对品种、规格、质量为所欲为"。他记录的成对反例最具说服力：窗玻璃按**吨**计划就造得过厚过重，改按**平方米**计划就造得过薄——同一指标机制在相反方向上各自扭曲。配套的微观实证是 **Berliner, Joseph (1957). *Factory and Manager in the USSR*. Harvard UP**：计划博弈的全套技术——隐藏产能留"安全系数"、月末突击（shturmovshchina）、专职"催料员"（tolkach）、关系网（blat）。**结论：机制是扎实的学术，钉子是它的漫画。**

### 6.6 英国 NHS 等待时间目标："targets and terror"

- **Bevan, Gwyn & Christopher Hood (2006). "What's Measured Is What Matters: Targets and Gaming in the English Public Health Care System." *Public Administration*, 84(3): 517–538.** DOI: 10.1111/j.1467-9299.2006.00600.x。https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1467-9299.2006.00600.x ；姊妹篇 "Have targets improved performance in the English NHS?" *BMJ* 2006, 332: 419–422。

2000 年代英格兰以"星级评定 + 高管乌纱帽"（不达标即解职，故曰 **targets and terror**——作者开篇明言此制"与苏联体制有明显的相似之处"）推行等待时间目标。Bevan & Hood 记录的 gaming 谱系："hitting the target and missing the point"（p. 524）——救护车在急诊室外压车等待以延迟启动 4 小时计时（有延误重症的致死个案记录）、测量周抽调加班人手并取消手术、trolley-wait 指标博弈、以及最直观的数据操纵证据：Commission for Health Improvement (2003) 发现约三分之一的救护车信托"修正"了响应时间记录，上报分布在 8 分钟目标处出现诡异尖峰（spike）；2002/03 年 139/158 家急症信托上报"90% 患者 4 小时内看诊"，而患者调查中只有 69% 报告此体验。理论上他们区分 ratchet effects（棘轮效应）、threshold effects（门槛效应）与 output distortion 三类扭曲。但注意：**该文并未断言目标制全盘失败**（见第九节）。

### 6.7 NYPD CompStat 的犯罪统计操纵

- **Eterno, John A. & Eli B. Silverman (2012). *The Crime Numbers Game: Management by Manipulation*. Boca Raton: CRC Press.** https://www.routledge.com/9781439810316

CompStat（1994 年 Bratton/Maple 引入）以精确到辖区的犯罪数据问责指挥官。Eterno & Silverman 的两轮调查：约 2008 年对退休警监（captains）的首轮调查中，309 名应答者有 157 人知悉犯罪报告曾被事后改动，就伦理问题作答的 160 人中仅 22.5% 认为改动合乎伦理（53.8% 认为"高度不合伦理"）；2012 年对 **1,962 名各级退休警官**的扩大调查中，2002 年后退休的 871 人过半报告"亲身知悉"操纵，其中逾八成知悉三起以上。手法包括把重罪降格为轻罪（grand larceny 报成 petit larceny）、拒收报案、"unfounding"（认定报案不成立）。Adrian Schoolcraft 的布鲁克林第 81 分局录音（2010 年曝光）与 NYPD 自身质检部门的复核审计提供了独立佐证。**注意平衡**：批评者证明的是"降格操纵真实存在且受激励驱动"，并未证明纽约犯罪率下降是假象——后者规模远超任何可信的操纵量，此点存争议但主流意见认可下降为真。犯罪率既是政绩也是指标，Campbell 1979 年关于清案率的预言在数据化管理时代重演。

### 6.8 Wells Fargo 假账户丑闻：现代教科书案例

2016 年 9 月 8 日，CFPB 对 Wells Fargo 发布同意令（File No. 2016-CFPB-0015）：员工在客户不知情下开设约 **153.4 万个**存款账户、提交约 **56.5 万份**信用卡申请；2017 年 8 月 31 日银行委托的扩大复核（覆盖 2009 年 1 月起约 1.65 亿个账户）将潜在未授权账户上修至**约 350 万个**（SEC 8-K 附件）。罚款合计 **1.85 亿美元**（CFPB 1 亿 + OCC 3,500 万 + 洛杉矶市检 5,000 万），约 5,300 名员工被解雇；2018 年 2 月美联储施加资产上限，2020 年 2 月与 DOJ/SEC 达成 30 亿美元和解（附延缓起诉协议，覆盖 2002–2016 年行为）。一手文件：CFPB 同意令 https://files.consumerfinance.gov/f/documents/092016_cfpb_WFBconsentorder.pdf ；董事会独立调查报告（2017 年 4 月 10 日，Shearman & Sterling 协查，记录了内部黑话 "gaming"、"sandbagging"、"pinning"）。

机制上这是 Goodhart 家族全要素样本："每户八个产品"（"Eight is Great"）的 cross-selling 指标本是"深度客户关系"的代理变量；与薪酬、排名、解雇威胁挂钩后，指标本身成了目标——adversarial gaming（伪造账户）与 surrogation（管理层真诚地把 cross-sell 数当成健康经营）同时发生（Harris & Tayler 2019 即以此为 surrogation 的旗舰案例）。

---

## 七、形式化与分类学：Manheim & Garrabrant (2018) 的四分类

- **Manheim, David & Scott Garrabrant (2018). "Categorizing Variants of Goodhart's Law." arXiv:1803.04585.** https://arxiv.org/abs/1803.04585 （前身是 Garrabrant 2017 年 12 月在 LessWrong 发表的 "Goodhart Taxonomy"；Garrabrant 供职于 MIRI，此文是 AI alignment 社区对 reward hacking / specification gaming 的理论化。）

设定：真实目标 **G**（goal），可观测代理指标 **M**（measure/metric/proxy）；对 M 施加优化或选择压力（如选出 M 最大的样本、把 M 推过阈值 c）。论文识别出**四种彼此独立的失效机制**（下述定义为紧贴原文的转述）：

### 7.1 Regressional Goodhart（回归型）

**机制**：M = G + 噪声。即使相关性真实且稳定，选中 M 的极端值同时也选中了噪声的极端值，故被选样本的真实 G 系统性低于其 M——这是 regression to the mean 在优化语境下的必然表现，亦即 optimizer's curse / winner's curse 的同构物。**数学直觉**：E[G | M = m] < m（当 m 处于高尾时），且 M 越极端、噪声占比越大，回落越狠；"tails come apart"。**例子**：身高与篮球水平正相关，但按身高选出的最高者几乎必定不是最好的球员；按面试分录取的状元入职后普遍"不如预期"。**特性**：这是唯一**无法通过更聪明的优化来消除**的变体——只要代理不完美，超调就存在，只能校准预期（收缩估计）。

### 7.2 Extremal Goodhart（极值型）

**机制**：M 与 G 的关系在观测到的常规区间内成立，但优化把系统推入从未观测过的极端区域，那里数据生成机制本身改变（regime change），原关系断裂。**数学直觉**：相关是分布相关；优化产生分布外（out-of-distribution）样本，原联合分布对其无约束力。与回归型的区别：回归型是同一机制内的噪声回落（衰减是定量的），极值型是机制切换（衰减可以是定性的、灾难性的）。**例子**：体温与健康在常态区间正相关，把"升温"推到极端就是发烧致死；肌肉量与力量正相关，推到极端得到的是药物滥用者。

### 7.3 Causal Goodhart（因果型）

**机制**：M 与 G 相关但 M 不是 G 的原因（共因混杂，或因果方向是 G→M）。**干预** M（而非观察 M）不会改变 G——这是"相关非因果"在控制论语境下的失效形式。**数学直觉**：P(G | M=m) ≠ P(G | do(M=m))；干预切断了产生相关性的后门路径。**例子**：篮球运动员普遍高，但打篮球不会让你长高；地面湿与下雨相关，洒水不会带来降雨；提高体检指标（吃药压低胆固醇读数的作弊方式）不等于改善健康。

### 7.4 Adversarial Goodhart（对抗型）

**机制**：存在目标与监管者不同的其他 agent。一旦他们知道你以 M 为目标，就有激励把自己的目标与你的 M 相关联、或直接操纵 M，从而摧毁 M–G 相关性。这才是 Goodhart 1975 与 Campbell 1979 的原始情形（被考核者是有策略的人），也涵盖眼镜蛇/老鼠式的悬赏套利。**博弈直觉**：M 一旦成为可影响收益的公开规则，就从"测量"变成"博弈手段"；对手用其信息与优化能力专门搜索 M 高而 G 低的区域，因此对抗型的失效速度与对手能力成正比。**例子**：应试作弊、SEO 对搜索排名的污染、财报盈余管理、以及 AI alignment 中 agent 对 reward function 的 hacking。

**四分类的价值**：它把一句格言拆成四种可分别诊断、分别设防的机制——回归型要求校准（shrinkage）、极值型要求分布外警惕（保守外推）、因果型要求因果识别（干预实验）、对抗型要求机制设计（隐藏指标、多指标、审计）。Manheim 同年的姊妹篇 "Building Less Flawed Metrics"（2018，working paper/MPRA）给出缓解策略清单。

---

## 八、经济学的形式模型：为什么"强激励"会出错

### 8.1 Holmström & Milgrom (1991)：多任务模型

- **Holmström, Bengt & Paul Milgrom (1991). "Multitask Principal-Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design." *Journal of Law, Economics, & Organization*, 7 (Special Issue): 24–52.** https://academic.oup.com/jleo/article-abstract/7/special_issue/24/2194011 （全文：https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf ）

**核心逻辑**：agent 的努力要在多项任务间分配，各任务的产出可测度性不同（教学质量难测，考试分数易测），且努力在任务间是替代品——在 A 上多花一小时就少给 B 一小时。此时给易测任务上强激励，等于给"从难测任务撤出努力"定价补贴。**关键结果**：任一任务的最优激励强度不仅取决于该任务自身的噪声，还取决于**其他任务的可测度性**；当重要任务无法测量时，对可测任务的最优激励反而应当调低——甚至**完全平薪（flat wage）是最优的**，因为激励工资的功能不仅是激发总努力，更是引导努力的**方向**。配套的 **equal compensation principle**：agent 同样重视的各项活动必须提供相等的边际回报，否则边际回报低的活动会被完全放弃（角点解）。

**推论**（论文明确讨论）：为什么教师不拿计件工资（教分数会挤出教素养）；为什么公务员低强度激励是制度理性而非官僚惰性；job design 本身是激励工具——把难测任务打包给专人并配弱激励，把易测任务打包配强激励。**与 Goodhart 的关系**：Goodhart/Campbell 说"指标被瞄准后失真"，Holmström–Milgrom 给出第一个严格机制：失真未必来自作弊，而来自**理性 agent 在给定激励下的最优努力再配置**——测量了什么，就只会得到什么。这是 2016 年 Holmström 获诺奖的核心贡献之一。

### 8.2 Baker (1992)：绩效测量的"扭曲"模型

- **Baker, George P. (1992). "Incentive Contracts and Performance Measurement." *Journal of Political Economy*, 100(3): 598–614.** https://www.jstor.org/stable/2138733 （全文：https://www.edegan.com/pdfs/Baker%20(1992)%20-%20Incentive%20Contracts%20and%20Performance%20Measurement.pdf ）

**核心逻辑**：区分委托人的**真实目标 V(a, ε)**（如企业价值，不可写入合同）与**可合同化的绩效测量 P(a, φ)**。激励合同只能挂靠 P。Baker 的关键洞见：一个测量的优劣不取决于它与 V 的表面相关，而取决于 **agent 各种行动对 P 的边际产出向量与对 V 的边际产出向量是否对齐**——两个梯度之间的"夹角"。夹角为零则 P 是完美激励基础；夹角越大，agent 就越会选择"对 P 边际产出高、对 V 边际产出低"的行动组合——这正是 **gaming 的形式化定义**。**关键结果**：一个低噪声、高可控的测量仍可能是糟糕的激励基础（如果错位严重）；反之，噪声大但方向对齐的测量可能更好。传统委托代理理论只讲风险—激励权衡（噪声越大激励越弱），Baker 加入了第二个独立维度：**distortion（扭曲）**。其 2002 年续作 "Distortion and Risk in Optimal Incentive Contracts"（*Journal of Human Resources*, 37(4): 728–751）把测量正式分解为 risk 与 distortion 两个属性。

**合并解读**：Holmström–Milgrom 讲"多任务下强激励挤出未测任务"，Baker 讲"单一测量与真实目标的梯度错位"，两者共同构成 Goodhart 定律的微观经济学基础——它不需要恶意，只需要（1）代理指标与真目标不重合、（2）行为人对激励作出理性反应，失真即为均衡结果。

---

## 九、反面视角：指标管理什么时候真的有效？

若只讲失败案例，本报告自己就犯了选择偏差。以下是"指标有效"一侧的严肃证据：

### 9.1 教育问责的真实增益

- **Dee, Thomas & Brian Jacob (2011). "The impact of No Child Left Behind on student achievement." *Journal of Policy Analysis and Management*, 30(3): 418–446.** DOI: 10.1002/pam.20586 ——用州际问责时点差异做识别（此前已有后果性问责的州为弱处理组），发现 NCLB 使四年级数学在 **NAEP** 上到 2007 年提高约 **0.22 SD**（NBER WP 15531 摘要原文 "effect size = 0.22 by 2007"；八年级增益集中于低分段，边缘显著；**阅读两个年级均无效应**）。关键在于 NAEP 是**低利害审计考试**，教师没有理由为它应试，且增益遍布全部五个数学子量表（Algebra +0.26 至 Measurement +0.16）而非集中于易应试题型——数学增益因此更可能是真实学习增益而非分数通胀。这是对"问责=纯粹 Campbell 定律"叙事最有力的反例。
- **Hanushek, Eric & Margaret Raymond (2005). "Does school accountability lead to improved student performance?" *JPAM*, 24(2): 297–327** ——引入后果性问责的州，NAEP 增幅更大。
- 公平呈现：即便 Dee & Jacob 的结果，也伴随阅读无效、应试科目挤占其他课程等代价；Koretz 与 Dee/Jacob 并不矛盾——高利害分数**同时**包含真实增益与通胀成分，审计考试可以把两者分开。

### 9.2 NHS 目标制的真实成效：英格兰 vs. 苏格兰自然实验

- **Propper, Carol, Matt Sutton, Carol Whitnall & Frank Windmeijer (2008). "Did 'Targets and Terror' Reduce Waiting Times in England for Hospital Care?" *The B.E. Journal of Economic Analysis & Policy*, 8(2), Article 5.** DOI: 10.2202/1935-1682.1863 ——苏格兰拥有同构的 NHS 但未采用英格兰的目标—问责制，构成对照组。Difference-in-differences 结果：目标制显著降低了英格兰的等待比例，且**没有发现批评者担心的质量牺牲的清晰证据**（如临床优先级被普遍扭曲）。
- 值得强调：**Bevan & Hood (2006) 自己也承认**英格兰在受考核维度上的改善是真实的。他们在 *BMJ* 姊妹篇中写道："Nobody would want to return to the NHS performance before the introduction of targets, with over 20% of patients spending more than four hours in accident and emergency and patients waiting more than 18 months for elective admission."（没有人想回到目标制之前的 NHS。）他们的论点是"改善与 gaming 并存，且审计太弱、无法从公布数据中区分两者比例"，而非"目标制无效"。把 Bevan & Hood 引为"目标制失败的证明"是对该文的过度简化。Propper et al. (2008) 还发现等待时间在**未被瞄准的低段**也同步下降（而非只在目标阈值附近堆积），进一步削弱纯 gaming 解释。

### 9.3 管理实践与目标设定的一般证据

- **Bloom, Nicholas & John Van Reenen (2007). "Measuring and Explaining Management Practices Across Firms and Countries." *Quarterly Journal of Economics*, 122(4): 1351–1408.** https://academic.oup.com/qje/article-abstract/122/4/1351/1850493 ——World Management Survey 对 732 家中型企业的评分（其中大量维度就是绩效监测与目标管理）与生产率、利润率、存活率稳健正相关；后续印度纺织厂 RCT（Bloom, Eifert, Mahajan, McKenzie & Roberts 2013, "Does Management Matter? Evidence from India", *QJE* 128(1): 1–51）提供了因果证据：随机分配的管理咨询（结构化监测、标准化操作、绩效目标）使生产率显著提升（刊出版摘要报告首年约 17%，早期工作论文版估计为 11%）。
- **Locke, Edwin & Gary Latham (2002). "Building a Practically Useful Theory of Goal Setting and Task Motivation: A 35-Year Odyssey." *American Psychologist*, 57(9): 705–717**（及其 1990 年专著）——数百项实验一致显示：具体而有挑战的目标显著优于"尽力而为"，是组织心理学中最稳健的发现之一。（对照批评见 Ordóñez et al. 2009, "Goals Gone Wild", *Academy of Management Perspectives*。）

### 9.4 何时有效：条件综合

- **Muller, Jerry Z. (2018). *The Tyranny of Metrics*. Princeton University Press.** 此书虽以"暴政"为名，实为平衡之作，末章给出使用核对清单。综合 Muller、Koretz、Bevan & Hood、Holmström–Milgrom 与上述正面证据，指标管理趋于有效的条件大致是：
  1. **代理距离短**：被测量的就是（或极接近）真正想要的（等待时间本身就是患者福利的一部分，故 NHS 目标失真有限；分数只是学力的远端代理，故教育失真严重）；
  2. **存在不可博弈的审计通道**（NAEP 之于州考试；独立复核之于犯罪统计）；
  3. **提升真实产出比 gaming 更便宜**：任务单维、产出可验证时计件工资就是有效的（水果采摘、Safelite 挡风玻璃研究〔Lazear 2000, *AER*〕）；
  4. **低利害或中利害使用**：用于诊断与学习而非机械奖惩（Muller 的核心区分：measurement vs. metric fixation）；
  5. **多指标 + 人为判断兜底**，并定期轮换/更新指标以对抗适应（Manheim 的缓解清单）。

一句话总结这一节：**Goodhart 定律不是"测量无用论"，而是"代理指标 + 高压优化"这一组合的失效定律。** 拿掉高压（低利害）、缩短代理链（测真货）、或保留审计与判断，测量依然是已知最强的管理技术——Campbell 本人的"实验社会"立场正在于此。

---

## 十、流行讹传清单（汇总）

| # | 流行说法 | 考证结论 |
|---|---|---|
| 1 | "When a measure becomes a target…" 是 Goodhart 的原话 | **讹传**。Strathern (1997, p. 308) 的措辞；泛化与命名经由 Hoskin (1996)；Goodhart 1975 原话是"统计规律…控制压力…崩塌" |
| 2 | 德里眼镜蛇故事是史实 | **无据传闻**。最早文字（1873）即为"据称"；1887 年 BNHS 调查判定"极不可能"；Siebert (2001) 转述时未引任何史料。有档案的对应案例是 1902 年河内鼠尾悬赏（Vann 2003/2018） |
| 3 | McNamara 说过"第一步是测量容易测量的…" | **讹传**。Yankelovich 1971 年演讲首创（并命名 McNamara fallacy）；Handy (1994) 误归 McNamara；通行出处"Corporate Priorities, 1972"亦不确 |
| 4 | Campbell 举过中国科举的例子 | **讹传**。1979 年原文无此例；其跨国例证是苏联产量指标与越战 body count |
| 5 | "Campbell's Law" 是 Campbell 自己的命名 | **不确**。原文作"pessimistic laws"（复数），嵌于段落；名号为后人所加 |
| 6 | 苏联某钉子厂真的造过巨钉；巨钉漫画出自 1954 年《Krokodil》 | **是讽刺漫画/笑话而非工厂史实**；Nove (1977, p. 94) 用作插图，但漫画确切刊期从未被可靠定位（1954/1955/1957 诸说均无确证）；真实的是 success indicator problem 的系统性证据（Nove 1958/1977; Berliner 1957） |
| 7 | Bevan & Hood 证明了 NHS 目标制失败 | **过度简化**。该文承认受测维度真实改善；Propper et al. (2008) 的英苏对照进一步支持目标制降低了等待时间 |
| 8 | Lucas: "any change**s** in policy…" | 小误引，原文为单数（Lucas 1976, p. 41） |
| 9 | Wells Fargo 被 CFPB 罚 1.85 亿美元 | 1.85 亿为三机构合计（CFPB 1 亿 + OCC 0.35 亿 + 洛杉矶市检 0.5 亿） |

---

## 附：核心文献速查

- Goodhart 1975: *Papers in Monetary Economics* Vol. I, RBA（重印于 Courakis 1981; Goodhart 1984）
- Hoskin 1996: in Munro & Mouritsen (eds.), *Accountability*, pp. 265–282 — https://gwern.net/doc/statistics/decision/1996-hoskin.pdf
- Strathern 1997: *European Review* 5(3): 305–321 — https://gwern.net/doc/statistics/decision/1997-strathern.pdf
- Campbell 1979: *Evaluation and Program Planning* 2(1): 67–90 — https://www.globalhivmeinfo.org/CapacityBuilding/Occasional%20Papers/08%20Assessing%20the%20Impact%20of%20Planned%20Social%20Change.pdf
- Lucas 1976: *Carnegie-Rochester Conf. Series* 1: 19–46 — https://people.sabanciuniv.edu/atilgan/FE500_Fall2013/2Nov2013_CevdetAkcay/LucasCritique_1976.pdf
- Siebert 2001: *Der Kobra-Effekt*, DVA；眼镜蛇考证 — https://friendsofsnakes.org.in/cobra-effect/
- Vann 2003: *French Colonial History* 4: 191–203 — https://muse.jhu.edu/article/42110/summary ；Vann & Clarke 2018, OUP
- Yankelovich 考证 — https://ryanmadden.net/i-found-the-mcnamara-quote/
- Kerr 1975: *AMJ* 18(4): 769–783, DOI 10.5465/255378
- Choi, Hecht & Tayler 2012: *TAR* 87(4): 1135–1163, DOI 10.2308/accr-10273；2013: *JAR* 51(1): 105–133
- Koretz 2017: *The Testing Charade*, U Chicago Press；Koretz & Barron 1998: RAND MR-1014；Jacob & Levitt 2003: *QJE* 118(3): 843–877
- Nove 1958: *Economica* 25(97): 1–13；1977: *The Soviet Economic System*；Berliner 1957: Harvard UP
- Bevan & Hood 2006: *Public Administration* 84(3): 517–538, DOI 10.1111/j.1467-9299.2006.00600.x
- Eterno & Silverman 2012: *The Crime Numbers Game*, CRC Press
- Wells Fargo: CFPB 2016 — https://www.consumerfinance.gov/enforcement/actions/wells-fargo-bank-2016/
- Manheim & Garrabrant 2018: arXiv:1803.04585 — https://arxiv.org/abs/1803.04585
- Holmström & Milgrom 1991: *JLEO* 7: 24–52；Baker 1992: *JPE* 100(3): 598–614
- Dee & Jacob 2011: *JPAM* 30(3): 418–446；Propper et al. 2008: *B.E. JEAP* 8(2), DOI 10.2202/1935-1682.1863
- Bloom & Van Reenen 2007: *QJE* 122(4): 1351–1408；Locke & Latham 2002: *Am. Psychologist* 57(9): 705–717
- Muller 2018: *The Tyranny of Metrics*, Princeton UP
