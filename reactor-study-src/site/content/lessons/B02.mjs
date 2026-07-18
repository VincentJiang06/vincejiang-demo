export default {
  id: "B02",
  blocks: [
    { t: "prose", html: `
<p>Campbell 定律是这个家族里社会科学的一支，来自教育测试与社会项目评估的田野。Donald Campbell 的表述比 Goodhart 多说了一层，强调腐蚀的必然性：</p>
<p class="pullquote">"The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor."<span class="src">Campbell, 1976/1979</span></p>
<p>指标不只是失效，它还会反过来腐蚀它本要监测的过程本身。测高考分，不只是分数失去意义，教育本身被应试改造了。原始例子就是标准化测试的应试化与警务犯罪统计的操纵，两者后来都有了成规模的实证（见 <code>K00</code> 案例库：Atlanta 改卷案、CompStat 降级）。这句话出自小节标题就叫「量化指标的腐蚀效应」的一节，Campbell 写下它时用的字眼是复数的 pessimistic laws：他给出的是一组悲观定律，后人只记住了这一条。</p>` },

    { t: "module", module: "explorable:corruption-pressure", title: "Campbell 的张力：他既提出腐蚀定律，也主张实验社会", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "定律本身", html: "指标越被用于高利害的社会决策，越容易受腐蚀压力，也越会扭曲它本要监测的过程。原始例子：标准化测试的应试化、警务犯罪统计的操纵。" },
        { k: "02", t: "关键张力", html: "定律常被读成反对量化。原文立场相反：他是「实验社会（experimenting society）」最有力的倡导者，主张用严格的实地实验改进社会政策。提出定律的人，正是最相信测量的人。" },
        { k: "03", t: "为什么重要", html: "这个张力划定了本枝的批判边界：批判指标不等于反对测量。目标不是废除尺子，而是知道哪把尺子在什么条件下会腐蚀它所测的东西。" }
      ]
    } },

    { t: "prose", html: `
<p>1979 年论文里的例子都带着案卷气。警务一侧是「清案率」：以破案比例考核警队，产生双重腐蚀。先是报案端，案件被不记录、延迟记录或降格为较轻类别，Campbell 点名尼克松的严打，说其主要效果是腐蚀了犯罪率指标（Seidman 与 Couzens 1972）；再是破案端，辩诉交易里被捕的窃贼多认几桩悬案换取轻判，「他在帮警察提高清案率」，而 Campbell 引 Skolnick 1966 年的研究指出，其中不少人认下的是自己没犯的罪。清案率越好看，档案离真相越远。教育一侧是 Texarkana 绩效合同案（Stake 1971）：按学生成绩涨幅付费的承包商，直接把期末考题拿来教。随后才是那段最常被引的话：在以一般能力为目标的正常教学下，成绩测验可能是不错的学业指标；一旦分数成为教学过程的目标，它既丧失指标价值，又以不良方式扭曲教育过程。他的跨国例证是苏联产量指标的文献（Granick 1954、Berliner 1957）与越战的歼敌数：body count 与美莱村惨案在他笔下是同一条定律的战场形态（<code>B05</code>）。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>三处考证。</strong>其一，"Campbell 1976"与"Campbell 1979"是同一文本：1974 年会议宣读，1975 年入 Dartmouth 文集，1976 年西密歇根大学以 Occasional Paper #8 重印，1979 年才在《Evaluation and Program Planning》正式刊出，措辞一致。两个年份指同一段话，不是两个命题。其二，"Campbell's law"不是他自己起的名，引用时宜写「后来被称为 Campbell 定律的腐蚀命题」。其三，「中国科举导致八股文」的例子是后人附会，不在原文里。另按 Rodamar 2018 年的梳理：Campbell 的核心思想 1969 年已见于 "Reforms as Experiments"，在「社会指标腐蚀」这个主题上，他的优先权强于 Goodhart。</p>` },

    { t: "prose", html: `
<p>这段话的出版旅程值得单独记一笔，因为它解释了文献里年份混乱的来源，也顺带演示了引用如何漂移。1974 年 5 月在匈牙利 Visegrád 的社会心理学会议上宣读；1975 年收入 Dartmouth 的《Social Research and Public Policies》文集；1976 年 12 月由西密歇根大学评估中心作为 Occasional Paper #8 重印；1979 年在《Evaluation and Program Planning》正式刊出，此版被引超过 1600 次；2011 年《Journal of MultiDisciplinary Evaluation》再度重印。五次登台，措辞一致，所以「Campbell 1976」与「Campbell 1979」引的是同一段话，年份只取决于作者手边是哪个版本。漂移至今仍在发生：2025 年还有工作论文一边署 1976、一边写「社会科学家 Campbell 宣称他的定律」，仿佛命名出自本人。一个研究指标如何在使用中变形的定律，自己的引用史就在持续变形，这一点它与 Goodhart 定律（<code>B01</code> 的措辞谱系）算是同病相怜。</p>` },

    { t: "prose", html: `
<p>这个定律最容易被读错的地方，是把它当成反对量化的檄文。Campbell 的学术身份恰好相反：他与 Stanley 合著的实验与准实验设计教材是评估方法论的奠基文本，1969 年的《Reforms as Experiments》号召把社会改革当成实验来做、用严格测量指导政策，他是「实验社会」最有力的旗手。张力在于，同一篇 1979 年论文里，他既号召大规模量化评估，又断言量化指标必被腐蚀。他的调和方案不是弃测，而是制度设计：引入外部评估者；让工会等利益相关方充当看门狗；多指标三角互证；尽量让指标远离直接奖惩回路。他的原话是，我们应当研究腐败得以被揭露的社会过程，并尝试设计吸纳这些特征的社会系统。定律因此是实验社会的内置警戒条款，不是对它的否定；这条思路后来长成了整条防御分支（<code>G04</code> 的多指标制衡、<code>G06</code> 的制度层防御）。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>定律的语法本身就是机制：它说的不是「用了指标就腐蚀」，而是「越用于决策、越受腐蚀」。</strong>腐蚀压力随利害程度单调上升，是一条剂量反应曲线：低利害时指标大体诚实，因为没人有理由花成本去扭曲它；利害每加一档，扭曲的期望收益就抬高一档，直到操纵指标比改善实事更划算。所以同一份成绩测验，用于诊断时是不错的指标，用于发钱和摘乌纱帽时立刻变质。腐蚀的燃料不是测量，是挂在测量上的利害。</p>` },

    { t: "prose", html: `
<p>把 Campbell 与 Goodhart 并排读，分工清晰。Goodhart 的主语是统计规律：指标与目标之间的相关性在控制压力下崩塌，损失发生在测量端。Campbell 的主语是社会过程：教学、警务、审判这些被测量的活动本身被指标重塑，损失发生在世界端。前者说尺子会失准，后者说尺子会改写被测物。这也是 Campbell 选用「腐蚀」而非「失真」的原因：失真还可以校准，腐蚀改变的是产生数据的那个组织本身。课程把这半步之差当作蓝红两支的接口：蓝支处理尺子与目标的形式关系，红支（从 <code>R01</code> 反应性起）处理尺子对世界的改造。</p>
<p>反方证据同样要摆上桌，这是本课程与警世故事集的分界。Dee 与 Jacob 2011 年利用美国各州引入问责的时间差检验 No Child Left Behind：到 2007 年，四年级数学在 NAEP 上提高约 0.22 个标准差，且增益遍布全部五个数学子量表，并非集中在易应试的题型。关键在于 NAEP 是低利害的审计性考试，教师没有理由为它应试，所以这部分增益更可能是真实学习而非分数通胀。公平起见：同一研究里阅读两个年级均无效应，应试科目挤占其他课程的代价也有记录。通胀那一侧的画面更早就有：Cannell 1987 年的调查发现，各州在自家高利害州考上都宣称高于全国平均，统计上不可能人人达标，「Lake Wobegon 效应」由此得名。合并的读法是，高利害分数同时包含真实增益与通胀成分，Campbell 定律断言的是后者必然存在，而不是前者必然为零；一条不可博弈的审计通道可以把两者分开。定律的完整边界条件在 <code>B14</code>，教育战场的全量证据（肯塔基 KIRIS 的分数通胀、芝加哥 4% 到 5% 班级的教师改卷检测）在 <code>K01</code>。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的 eval 不只是会失准，它会腐蚀你的开发过程。</strong>这是 Campbell 比 Goodhart 更进一层的地方。当一个 benchmark 分数成为团队的高利害目标，它不只是分数虚高：研究方向、数据配比、模型选择的整个过程都会被它扭曲，迎合可测的那一小块，牺牲不可测却更重要的能力。测量腐蚀的不是数字，是造数字的人的判断力。2026 年 OpenAI 弃用 SWE-bench Verified 的复盘（<code>Y03</code>）就是这条定律的工业级现场。</p>` },

    { t: "prose", html: `
<p>留一个问题：Campbell 的处方依赖看门狗与外部评估者，但看门狗自己也要被考核，审计通道自己也是一个指标。是什么防止揭露腐蚀的通道在第二轮被腐蚀？这个递归问题在 <code>R09</code>（审计社会）与 <code>G06</code>（制度层防御）各有半个答案。</p>` },

    { t: "sources", items: [
      `Campbell, D. T. (1979). "Assessing the impact of planned social change." <em>Evaluation and Program Planning</em> 2(1):67–90（=1976 Occasional Paper #8；1974 年宣读）。`,
      `Skolnick (1966)、Seidman & Couzens (1972)、Stake (1971)、Granick (1954)、Berliner (1957)：均为 Campbell 原文所引例证的出处。`,
      `Campbell, D. T. (1969). "Reforms as Experiments." <em>American Psychologist</em> 24(4):409–429（实验社会纲领）。`,
      `Rodamar, J. (2018). "There ought to be a law! Campbell versus Goodhart." <em>Significance</em>（优先权梳理）。`,
      `Dee, T. & Jacob, B. (2011). "The impact of No Child Left Behind on student achievement." <em>JPAM</em> 30(3):418–446（反方证据）。`,
      `考证与反方证据见 <code>research/03</code> §3、§9 与 <code>research/deep/D2</code> §3。`
    ] }
  ]
};
