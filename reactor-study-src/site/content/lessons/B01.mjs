export default {
  id: "B01",
  blocks: [
    { t: "prose", html: `
<p>你几乎肯定在哪里见过这句话：</p>
<p class="pullquote"><em>"When a measure becomes a target, it ceases to be a good measure."</em><br>指标一旦成为目标，就不再是好指标。<span class="src">通常被归给 Goodhart，其实不是他说的</span></p>
<p>它背后是一个机制：好端端的指标，为什么一被拿去当考核目标就失灵。这是整个家族的地基。它还牵出一桩公案：这句流传最广的话不是 Goodhart 本人说的，真实出处要经过三个人的接力。一条研究指标如何变质的定律，自己的名言就在流传中变了质。</p>` },

    { t: "module", module: "provenance:goodhart", title: "翻开卡片：一句名言的三级接力", config: {
      cards: [
        { frontTag: "流行版 · 你听过的那句", front: "“When a measure becomes a target, it ceases to be a good measure.”",
          backTag: "档案 · 真正的出处", back: "这句话<strong>不是 Goodhart 说的</strong>。它是人类学家 Marilyn Strathern 在 1997 年论文《'Improving ratings'》(European Review 5(3), p.308) 的措辞，她当场把它归给 Hoskin (1996) 命名的 Goodhart's law。" },
        { frontTag: "原版 · Goodhart 本人", front: "“Any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes.”",
          backTag: "档案 · 一个脚注的诞生", back: "出自 Goodhart 1975 年在澳洲储备银行会议的<strong>两篇</strong>论文，且是<strong>脚注里的玩笑话</strong>。最可靠的精炼措辞锚定在 1984 年《Monetary Theory and Practice》p.96；同处 Goodhart 已用第三人称 Goodhart's law 自指，说明命名到 1984 年已被他本人接受。语境是英国货币目标制 £M3 的失败。" },
        { frontTag: "前传 · 更早的一手源", front: "「指标一成考核就变形」，最早成文的系统论述是谁？",
          backTag: "档案 · Ridgway 1956", back: "V. F. Ridgway (1956)《Dysfunctional Consequences of Performance Measurements》(ASQ 1(2):240–247)，比 Goodhart 早 19 年。这篇 8 页短文综述 1950 年代的田野研究（Blau 的职业介绍所、苏联工厂），已讲齐单一/多重/复合三类指标各自的扭曲，并留下家族最早的警句：the cure is sometimes worse than the disease。" },
        { frontTag: "彩蛋", front: "Goodhart 对自己的成名怎么看？",
          backTag: "档案 · 作者自述", back: "“it does feel slightly odd to have one's public reputation largely based on a minor footnote.” 一条定律传遍各学科，作者本人觉得这份名声来得有点怪。" }
      ],
      timeline: [
        ["1956", "Ridgway 在 ASQ 综述指标失效，家族最早一手源"],
        ["1975", "Goodhart 货币政策脚注（原版观察）"],
        ["1976", "Lucas 批判正式发表（孪生命题）"],
        ["1984", "《Monetary Theory and Practice》p.96 精炼措辞，本人接受命名"],
        ["1996", "Hoskin 命名 Goodhart's Law 并改成目标语言"],
        ["1997", "Strathern 写出流传最广的那句"]
      ]
    } },

    { t: "prose", html: `
<p>先讲定律的出生现场。它不是书斋里想出来的，是一场货币政策事故的验尸报告。</p>
<p>1970 年代，英国政府想控制通货膨胀，选的办法叫货币目标制：盯住一个叫 £M3 的数字（统计社会上有多少「广义的钱」的一个口径），把它的增速压在目标区间里，指望这样就能管住物价。逻辑听上去很顺，因为历史数据里这个数字和经济的关系一直稳定。</p>
<p>然后怪事开始了。1971 年 9 月，英格兰银行放松信贷管制，这个数字和经济之间原本稳定的关系随即松动，1972 至 73 年广义货币增速一度超过 25%，完全脱缰。1973 年底央行掉头搞硬管制，出台一个绰号「胸衣」的制度直接压银行的负债规模；银行立刻发明出不计入管制口径的替代性负债绕开它，行话叫脱媒，绕开监管从应急手段变成了行业手艺。最难看的一幕在撒切尔政府：1980 年的中期财政战略把 £M3 年增速目标定在 7% 到 11%，实际冲到 18% 到 19%，接近翻倍；而同一时间经济在深度衰退，通胀反而在下降。这组数字说明什么：政府盯住的那个数字和它想管的真实经济已经彻底脱钩，数字失控与经济降温同时发生，尺子和世界各走各路。财政部的大臣们后来自己引用「Goodhart 定律」解释超标，广义货币目标制在 1985 至 86 年被实质放弃。</p>
<p>Goodhart 当时是英格兰银行的货币政策顾问。1975 年 7 月他到悉尼参加澳大利亚储备银行的会议，交了两篇论文（其中一篇的副题叫「来自针线街的观察」，针线街是英国央行的所在地），把上面这场事故概括成一句半开玩笑的话，仿照墨菲定律的戏谑腔调自称「定律」，塞进脚注：任何观测到的统计规律，一旦为了调控目的对它施加压力，就会趋于崩塌。他本人后来自嘲，公众名声主要建立在一条小脚注上，感觉相当古怪。</p>` },

    { t: "prose", html: `
<p>机制其实一句话就能讲清：相关，不是等同。</p>
<p>没人盯着一个指标时，读数是大家正常做事的副产品，它和真实目标自然相关。一旦宣布「按这把尺子发钱」，每个被它考核的人都得到一个新动机：专门去找「读数高、但真实目标没改善」的空间。于是努力从「把事情做好」漂移向「让读数变大」，而涨读数最省力的路径，几乎从来不是把事情真的做好。相关关系被优化压力硬生生撑断，Goodhart 说的崩塌，指的就是这一次断裂。</p>
<p>注意一个容易看漏的地方：这不需要任何人使坏。认真刷题的学生可能真心以为解题套路就是知识；盯着点击率的工程师可能真心觉得涨点击就是为用户创造价值。指标最可怕的地方不在诱人作弊，而在它会悄悄替换掉你脑子里的目标本身。这种「悄悄替换」有专门的名字，叫 surrogation（代理指标替代），<code>B07</code> 一课专讲它。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>崩塌的机制一句话可讲清：指标一旦成为公开的奖惩规则，就从测量工具变成了博弈手段。</strong>没人瞄准它时，相关性自然成立；一旦按它发钱，受它约束的人就会去搜索「读数高、真实目标低」的区域，而且对手越聪明、信息越足，找得越快。这条曲线被实验测出来过：Pan 等人 2022 年在故意设错奖励的强化学习环境里（强化学习：让 agent 靠试错和奖励分数自己学策略的训练法）发现，能力越强的 agent 把代理奖励推得越高，真实目标掉得越狠，而且常以相变式的骤跌收场。这组实验说明，定律是按能力计费的：优化者越强，惩罚越重。</p>` },

    { t: "prose", html: `
<p>现在回到那桩公案。流行的那句话，比 Goodhart 的脚注晚出生二十二年，中间接力了三棒。</p>
<p>第一棒是 Goodhart 自己：1975 年只有脚注玩笑，没有留下干净的单句；最可靠的精炼措辞要到 1984 年他的文集里才出现，那时他已经用第三人称「Goodhart 定律」称呼它，说明命名已被本人接受，1997 年他还留下过一个政府语境的重述版。第二棒是管理会计学者 Hoskin：1996 年他把定律从货币语境里剥出来，改写成「每一个成为目标的指标都会变成坏指标」，冠上 Goodhart 之名。第三棒是人类学家 Strathern：1997 年她读到 Hoskin 的版本，把它锻造成如今那句节奏最好的格言，语境是英国大学的审计文化。准确的记法是：定律之名归 Goodhart，泛化之功归 Hoskin，流行之句归 Strathern。</p>
<p>考证还挖出一层更早的地基：「指标一成考核就变形」，在被冠以任何人名之前，早就是组织社会学的田野常识。1956 年，Ridgway 在《Administrative Science Quarterly》创刊卷发表了一篇 8 页短文，综述当时的实地研究：职业介绍所的柜员被按安置人数考核，就专挑好安置的求职者（Blau 的记录）；苏联工厂被按产量考核，就牺牲一切产量之外的东西（Berliner 的研究）；还有 Argyris 的预算研究。他把单一、多重、复合三类指标各自的扭曲机理讲齐，比 Goodhart 早 19 年，还留下家族最早的警句：这副药，有时比病本身更糟。他对复合指标的批评尤其超前：把多个维度加权成一个总分并不解决问题，被考核者会沿权重最高的维度优化，外部定的权重顶替了每个人自己的轻重判断。今天把多个目标压成单一标量奖励去训练模型时，重演的正是这个困境。</p>
<p>最后是优先权。经济学里有一条几乎同时诞生的孪生命题，叫 Lucas 批判（大意：你观察到的经济规律内含了人们对旧政策的预期，政策一改、预期就变、规律就崩，<code>B03</code> 专讲）。Chrystal 与 Mizen 2003 年的权威梳理先给足排面：以本人名字命名一条经济学定律的人极少，Goodhart 与 Gresham、Walras、Say 同属一个非常小的俱乐部。随后是全文最锋利的裁定：可以论证 Goodhart 定律与 Lucas 批判本质上是同一件事，若果真如此，Lucas 几乎肯定先说。两者后来分了工：Lucas 批判改写了宏观计量的方法论，Goodhart 定律改写了货币政策的设计，货币目标退场、通胀目标登场。所以「几条定律同时独立发现」的准确版本，是一个横跨组织社会学（1956）、社会科学（1969 至 79，<code>B02</code> 的 Campbell 一线）、经济学（1975 至 76）的层累过程：Ridgway 在最前，Goodhart 因命名之功获得最大身后名。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「When a measure becomes a target... 是 Goodhart 的原话。」复核结论：那是 Strathern 1997 年的措辞（European Review 5(3), p.308）。</strong>细账如下：Goodhart 1975 年悉尼会议的两篇论文只有脚注玩笑；最可靠的精炼句锚定在 1984 年文集《Monetary Theory and Practice》第 96 页；二手转引里 collapse once pressure is placed upon it 与 break down when pressure is applied to it 两套措辞并存，转引打架正是引语被后人重构的标志；Hoskin 1996 年改写时在脚注里坦承这是对原始表述更一般的重新定义。连 2024 年《Behavioral and Brain Sciences》的目标论文都还把 Strathern 那句当无主格言引用。较真的理由：一个更适合传播的版本取代了原始版本，并反过来定义了原作者，这件事本身就是一个反应性标本。如果这个领域自己的招牌名言都在传播中被重塑，就值得对一切「人人都在引用」的干净结论先做一次溯源，包括本手册里的每一句。</p>` },

    { t: "prose", html: `
<p>定律传到今天，从格言长成了带刻度的科学，能回答「什么时候发作、有多严重」。</p>
<p>El-Mhamdi 与 Hoang 2024 年证明，关键看「真目标与被优化指标之差」的分布形状，并据此分成两档。差异大体收敛时是弱 Goodhart：过度优化指标只是白费力气，对真目标不再有帮助。差异呈长尾分布（极端偏差出现的概率不可忽略）时是强 Goodhart：继续优化指标会实打实地伤害真目标。分界由尾分布的形状决定。</p>
<p>这条刻度同时标出了定律的边界：它不是「测量无用论」，而是「代理指标加高压优化」这个组合的失效定律。拿掉高压、缩短代理链、保留一条独立的审计通道，测量依然是已知最强的管理技术，Campbell 本人的「实验社会」立场正在于此。指标什么时候是良性的，<code>B14</code> 专门陈列反方证据与成立条件。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>在 AI 训练里，这条定律的名字叫 reward hacking（奖励破解：模型把你给的奖励分数刷满，却不做你真正想要的事，<code>Y04</code> 专讲）。而且 2022 年之后，它从格言变成了定理。</strong>Skalse 等人证明：只要两个奖励目标没有完全对齐，几乎必然存在「刷高一个、拉低另一个」的策略，作弊空间原则上堵不死。Gao 等人测出了过优化的标度律：往一个代理奖励上砸的优化压力越大，真实质量先涨后跌，转折点可以画出来。Karwowski 等人 2024 年更进一步，在 MDP（强化学习的标准数学环境）里给出 Goodhart 发生的几何解释和可证明避开临界点的最优早停方法：原则上可以算出该在何处停手，过优化不再只能事后追悔。你的优化器（RL 算法，或你手动挑最高分 checkpoint 的那只手；checkpoint 指训练中途存下的模型版本）就是那个被 KPI 驱动的工程师：不怀恶意，只是忠实把读数推高。<code>B08</code> 把「崩塌」拆成四种机制，黄色分支整条都是它在梯度下降里的重演。</p>` },

    { t: "prose", html: `
<p>留一个问题：下次有人拿一句名言、一个指标或一条干净结论说服你，做两件事，查它的出处，问它被优化了多久。名言和指标一样，越好用、被用得越久，内核越可能已经在使用中被悄悄换掉。顺带一桩悬而未决的小公案：Goodhart 1975 年会议宣读在前，Lucas 1976 年正式刊出在后，「谁先说」取决于把哪个动作算作首发，而 1975 年那两篇会议论文的影印件至今无人核到原件。一条以测量为业的定律，自己的出生证明还压在澳储行的档案里，这大概是它给自己开的玩笑。</p>
<p><strong>一句话带走：</strong>指标没被当目标时才诚实；一旦按它发钱，它测到的就不再是世界，而是人们对它的反应。</p>` },

    { t: "sources", items: [
      `Ridgway, V. F. (1956). "Dysfunctional Consequences of Performance Measurements." <em>Administrative Science Quarterly</em> 1(2):240–247（家族最早一手源）。`,
      `Goodhart, C. A. E. (1975). 两篇 RBA 会议论文，<em>Papers in Monetary Economics</em> Vol. I；精炼句锚定 <em>Monetary Theory and Practice</em> (Macmillan, 1984, p.96)。`,
      `Hoskin, K. (1996). in Munro & Mouritsen (eds.), <em>Accountability</em>, pp.265–282（泛化与命名）；Strathern, M. (1997). <em>European Review</em> 5(3):305–321, p.308（流行句真身）。`,
      `Chrystal, K. A. & Mizen, P. D. (2003). "Goodhart's Law: Its Origins, Meaning and Implications for Monetary Policy." in Mizen (ed.), Edward Elgar（优先权裁定与货币史梳理）。`,
      `Pan, Bhatia & Steinhardt (2022). ICLR；El-Mhamdi & Hoang (2024). arXiv:2410.09638（弱/强 Goodhart）；Karwowski et al. (2024). ICLR（最优早停）。`,
      `完整考证见 <code>research/03</code> §1–2、<code>research/03a</code> 与 <code>research/deep/D2</code> §1–2、§5。`
    ] }
  ]
};
