export default {
  id: "B07",
  blocks: [
    { t: "prose", html: `
<p><strong>surrogation（代理指标替代）</strong>指人们把衡量战略的指标当成战略本身。管理会计学者 Choi、Hecht 与 Tayler 2012 年给出定义：人们 "act as though the measures are the construct of interest"。指标本来只是构念的代理，却在人脑中悄悄替换了构念。</p>
<p>它填的是前几节留下的心理学缺口：Goodhart、Campbell、Kerr 讲的博弈里，当事人多数并不认为自己在规避规则，一个认真的人可以心安理得地追逐一个明知失真的指标。</p>` },

    { t: "module", module: "explorable:attribute-substitution", title: "指标如何在你脑中替换掉目标", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "认知机制：属性替代", html: "Kahneman 与 Frederick 的属性替代：面对难评估的目标属性（抽象的「战略」「质量」「能力」），人会无意识地用容易评估的属性（具体的指标数字）替代，然后<strong>回答那个更容易的问题</strong>。surrogation 就是这个替代用在「战略 vs 指标」上。" },
        { k: "02", t: "关键实验发现", html: "把<strong>激励和单一指标</strong>挂钩，会显著<em>加剧</em> surrogation：付钱让你盯一个数字，你就越容易把它当成目标本身。<strong>多个指标</strong>并用能缓解，几个数字在暗示「没有哪一个就是战略」。" },
        { k: "03", t: "现实代价：Wells Fargo", html: "「交叉销售数」本是「长期客户关系」的代理。当它成为被激励的单一目标，员工脑中它<em>就是</em>目标，于是开了约 350 万个未授权账户，摧毁了它本要建立的客户关系。指标替换了构念。" }
      ]
    } },

    { t: "prose", html: `
<p>机制的地基是 Kahneman 与 Frederick 的属性替代（attribute substitution）：面对一个难评估的属性（这家公司的战略执行得好不好），认知系统会悄悄换上一个容易评估的属性（这季度的调查分是多少），然后回答那个更容易的问题，而当事人自始至终以为自己回答的还是原问题。替代的全程没有决策点，没有一个可以被良心拦住的瞬间，这正是它与作弊的分界：作弊者知道自己换了目标，surrogation 的当事人不知道。属性替代原是判断与决策研究里的一般机制，Choi 等人的贡献在于指认：面对指标的管理者正处在该机制的理想触发条件下，构念抽象难评，数字具体易得，替代随手可得且无人察觉。</p>
<p>Choi、Hecht 与 Tayler 的贡献是把这个机制放进受控实验，并测出了它的开关。2012 年《The Accounting Review》与 2013 年《Journal of Accounting Research》的两组实验给出一对关键发现：把薪酬与单一指标挂钩，会显著加剧 surrogation，付钱让你盯一个数字，这个数字就加速在你脑中变成目标本身；改用多重指标，替代显著缓解，几个并排的数字在持续暗示「没有哪一个就是战略」。留意处方的杠杆点在认知而非监督：多指标起效不是因为更难作弊，而是因为它拆掉了「指标即构念」这个错觉的认知条件。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>surrogation 是 Goodhart 的心理学地基。</strong>Goodhart 描述系统层面的后果（指标一旦成为目标就崩坏），surrogation 解释个体层面的原因（当事人为什么不觉得自己在作弊）。一旦替代在认知上完成，优化指标而牺牲真实目标，对当事人来说不像作弊，像在努力工作。这就是最真诚的人同样会落入其中的原因。</p>` },

    { t: "prose", html: `
<p>Wells Fargo 是这个概念的旗舰案例，数字都有案卷。银行的战略构念是「深度客户关系」，代理指标是交叉销售数，口号「Eight is Great」，每户八个产品；指标与薪酬、内部排名、解雇威胁层层挂钩。2016 年 9 月 8 日，消费者金融保护局（CFPB）的同意令揭出：员工在客户不知情下开设约 153.4 万个存款账户、提交约 56.5 万份信用卡申请；2017 年 8 月，银行委托的扩大复核（覆盖 2009 年以来约 1.65 亿个账户）把潜在未授权账户上修到约 350 万个。罚款合计 1.85 亿美元（CFPB 一亿、OCC 三千五百万、洛杉矶市检五千万），约 5,300 名员工被解雇；2018 年美联储对其施加资产上限，2020 年再与司法部和证交会达成 30 亿美元和解。指标追逐的直接产出，是摧毁了它本要代理的那个构念：客户关系。</p>
<p>这个案子的教学价值在于双层结构。一线是对抗型博弈：伪造账户，内部黑话管这些手法叫 gaming、sandbagging、pinning，董事会 2017 年 4 月的独立调查报告原样记录了这些词。管理层是 surrogation：把交叉销售数真诚地当成健康经营的证据，Harris 与 Tayler 2019 年在《Harvard Business Review》即以此为 surrogation 的旗舰案例。同一个指标，同时驱动了作弊的人与真诚的人，两种腐蚀叠加，这正是 <code>B01</code> 里那句「指标会悄悄替换掉你脑子里的目标」的完整企业版。</p>
<p>实验与案卷在这里互为证词。实验室一侧证明，替代不需要坏人：被试只是接受了「按这个数字发钱」的设定，几轮之后，战略在其判断里就等于那个数字。案卷一侧证明，替代经得起放大：Wells Fargo 把同一个认知开关接到了成千上万员工的薪酬、排名与去留上，错觉于是有了工业规模。2020 年和解所附的延缓起诉协议覆盖 2002 至 2016 年的行为，这场「指标即战略」的集体错觉，维持了十四年。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行叙事把这类丑闻讲成「坏人蓄意造假」。复核结论：蓄意只解释了一半，另一半是无人自觉的认知替代。</strong>surrogation 的定义就排除了故意：当事人真诚地把代理指标当成了目标本身，优化指标在其主观体验里就是努力工作。这解释了为什么同类治理失败反复发生在自认清白的组织里，也解释了为什么「加强职业道德教育」对它基本无效，错觉不归道德管。顺带纠一个数字讹传：「Wells Fargo 被 CFPB 罚 1.85 亿美元」不准确，1.85 亿是三家机构的合计，CFPB 的部分是一亿。</p>` },

    { t: "prose", html: `
<p>缓解手段在同一支文献里被陆续测出来。多指标并用是第一条，出处即 2012 年的原实验。Bentley 2019 年在《The Accounting Review》补了第二条：要求用叙事性汇报（写句子解释业绩，而不只报数字）能减少扭曲与 surrogation；数字容易顶替构念，句子迫使汇报者重新接触构念本身。Black、Meservy、Tayler 与 Williams 2021 年在《JMAR》的后续沿这条线继续推进。翻译到指标治理：别让任何单一数字独占激励，别让汇报退化成报数。第三条藏在第一组发现的反面：既然「激励挂钩单一指标」是加剧开关，把奖惩从指标上拆下来就是把开关拨回去，Campbell 的「让指标远离直接奖惩回路」（<code>B02</code>）与这里在同一条证据链上会师（这组实验证据是 <code>G04</code> 多指标制衡的地基之一，<code>G02</code> 的解耦则直接拆掉「指标连着奖惩」这个加剧条件）。</p>
<p>在家族分工里，surrogation 补的是心理学那一格：Goodhart 与 Campbell 描述系统层面的后果，Kerr 描述设计端的错位（<code>B06</code>），surrogation 解释执行端的心智，为什么理性而真诚的人会成为失真的载体。委托代理模型（<code>B12</code>）假设 agent 清楚自己在最优化什么，surrogation 提醒你连这个假设都嫌乐观：很多时候 agent 以为自己在优化 B，手上优化的已经是 A。这一格补齐之后，家族叙事才完整：即使没有任何人蓄意博弈，指标治理仍会走样，因为走样可以完全发生在真诚的认知里。再推一步就到了训练现场：人发生替代时至少还存有一个可被唤回的构念，优化器从头到尾只见过代理指标，对它而言替代不是风险，是出厂设置。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你盯着 eval 分数看得越久，越容易对它发生 surrogation。</strong>当「提高 benchmark 分」在团队日常里反复出现、还连着 KPI，它就会在集体认知里替换掉「造一个真正有用的模型」；同理，训练团队会不知不觉把 Arena 的 Elo 当成「模型质量本身」，于是优化风格、长度与讨好去迎合评分器。缓解处方来自同一组实验：别用单一指标加激励，用一组互相制衡的指标，让任何一个数字都冒充不了目标本身。这是 <code>C03</code>（反 Goodhart 设计实验室）的核心原则之一。</p>` },

    { t: "prose", html: `
<p>留一个问题，取自 Bentley 的发现：为什么改用句子汇报能削弱替代？如果答案是「叙事迫使人重新接触构念」，那么当汇报的句子也开始由模型代写、而汇报者只负责过目时，这道防线还剩多少？替代最怕的是接触，最擅长的是省略接触。</p>` },

    { t: "sources", items: [
      `Choi, J., Hecht, G. & Tayler, W. B. (2012). "Lost in Translation: The Effects of Incentive Compensation on Strategy Surrogation." <em>The Accounting Review</em> 87(4):1135–1163；(2013). <em>Journal of Accounting Research</em> 51(1):105–133。`,
      `Harris & Tayler (2019). "Don't Let Metrics Undermine Your Business." <em>HBR</em> 97(5):62–69（Wells Fargo 案）。`,
      `Wells Fargo 案卷：CFPB 同意令（2016-09-08）；董事会独立调查报告（2017-04-10）；扩大复核（2017-08）。`,
      `Bentley (2019). <em>The Accounting Review</em> 94(3):27–55（叙事性汇报）；Black, Meservy, Tayler & Williams (2021). <em>JMAR</em> 34(1):9–29。`,
      `见 <code>research/03c</code> §3、<code>research/03</code> §6.8 与 <code>research/12</code>。`
    ] }
  ]
};
