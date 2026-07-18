export default {
  id: "B01",
  blocks: [
    { t: "prose", html: `
<p>Goodhart 定律是反应性最出名的一句格言，你几乎肯定听过它的流行版：</p>
<p class="pullquote"><em>"When a measure becomes a target, it ceases to be a good measure."</em><br>指标一旦成为目标，就不再是好指标。<span class="src">通常被归给 Goodhart，其实不是他说的</span></p>
<p>这句话流传极广，只有一个问题：不是 Goodhart 说的。</p>` },

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
<p>真实的故事比传说更有层次，也更技术化。1975 年 7 月，在英格兰银行任货币政策顾问的经济学家 Charles Goodhart 到悉尼参加澳大利亚储备银行的会议，提交了两篇论文，一篇谈货币关系（副题「来自针线街的观察」），一篇谈英国的货币管理难题。他观察到英国货币目标制的怪事：政府一旦盯住某个货币总量（£M3）调控，这个总量和经济之间原本稳定的关系就崩了。他把观察写成一句半开玩笑的话，仿照墨菲定律的戏谑笔法自称「定律」，塞进会议论文的脚注。</p>
<p>玩笑背后是一连串具体的政策失败，每个环节都有数字。1971 年 9 月，英格兰银行推行 Competition and Credit Control 放松信贷管制，货币总量与名义收入之间此前稳定的统计关系随即动摇，1972 至 73 年广义货币增速一度超过 25%。1973 年底重新祭出直接管制（绰号「胸衣」的补充特别存款制度），银行立刻造出不计入管制口径的替代性负债绕开它，脱媒成了行业手艺。撒切尔政府 1980 年的中期财政战略把 £M3 年增速目标定在 7% 到 11%，实际冲到 18% 到 19%，同期经济深度衰退、通胀反而在下降：被瞄准的总量与经济活动的关系彻底瓦解。财政部的大臣们后来自己引用「Goodhart 定律」解释超标，广义货币目标制在 1985 至 86 年被实质放弃。这条定律不是书斋格言，是一场货币政策实验的验尸报告。</p>
<p>措辞的家谱同样查得清。1975 年只有脚注玩笑，没有干净单句；最可靠的精炼句锚定在 1984 年文集《Monetary Theory and Practice》第 96 页，同处 Goodhart 已用第三人称「Goodhart's law」自指，说明命名此时已被本人接受；1997 年他又留下政府语境的重述版。二手转引里 collapse once pressure is placed upon it 与 break down when pressure is applied to it 两套措辞并存，转引打架正是引语被后人重构的标志。流行句的诞生还要再等二十年：管理会计学者 Hoskin 1996 年先把定律从货币语境里剥出来，改写成 every measure which becomes a target becomes a bad measure，冠以 Goodhart 之名，并在脚注里坦承这是对原始表述更一般的重新定义；人类学家 Strathern 1997 年读到 Hoskin，把它锻造成如今那句节奏更佳的格言，语境是英国大学的审计文化。定律之名归 Goodhart，泛化之功归 Hoskin，流行之句归 Strathern。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>较真的理由：这件事本身就是一个反应性标本。</strong>一个更适合传播的版本取代了原始版本，并反过来定义了原作者。连 2024 年《Behavioral and Brain Sciences》的目标论文都还把 Strathern 那句当无主格言引用。如果这个领域自己的招牌名言都在传播中被重塑，就值得对一切「人人都在引用」的干净结论先做一次溯源，包括本手册里的每一句。溯源不是学究气，是这门学问的自我一致性要求。</p>` },

    { t: "prose", html: `
<p>考证还揭出两层被流行叙事抹平的结构。第一层，家谱要前推近二十年。V. F. Ridgway 1956 年在《Administrative Science Quarterly》创刊卷发表 8 页短文《Dysfunctional Consequences of Performance Measurements》，综述 1950 年代的田野研究（Blau 记录的职业介绍所柜员为凑安置指标而挑客、Argyris 的预算研究、Berliner 的苏联工厂），把单一、多重、复合三类指标各自的扭曲机理讲齐，还留下家族最早的警句：滥用指标如同把青霉素当万灵药，the cure is sometimes worse than the disease。他对复合指标的批评尤其超前：把多个维度加权成一个总分并不解决问题，被考核者会沿权重最高的维度优化，外部权重顶替了个体自己的轻重判断，这正是今天把多目标压成单一标量奖励时重演的困境。换句话说，「指标一成考核就变形」在被冠以任何人名之前，已是组织社会学的田野常识。</p>
<p>第二层，优先权要收紧。Chrystal 与 Mizen 2003 年的权威梳理先给足排面：以本人名字命名一条经济学定律的人极少，Goodhart 与 Gresham、Walras、Say 同属一个非常小的俱乐部。随后是全文最锋利的裁定：可以论证 Goodhart 定律与 Lucas 批判本质上是同一件事，「若果真如此，Robert Lucas 几乎肯定先说」。两者是分工不同的孪生命题：Lucas 批判改变了宏观计量的方法论，Goodhart 定律改变了货币政策的设计，货币目标退场、通胀目标登场（这桩公案在 <code>B03</code> 展开）。于是「几条定律同时独立发现」的说法，准确版本是一个横跨组织社会学（1956）、社会科学（1969 至 79）、经济学（1975 至 76）的层累过程：Ridgway 在最前，Campbell 的腐蚀命题成文更早（<code>B02</code>），Goodhart 因命名之功获得最大身后名。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>崩塌的机制一句话可讲清：指标一旦成为公开的奖惩规则，就从测量变成了博弈手段。</strong>没人瞄准它时，读数是行为的副产品，相关性自然成立；一旦按它发钱，每个受它约束的人都获得了专门搜索「读数高、真实目标低」区域的动机，对手的信息与优化能力越强，相关性崩得越快。Pan 等人 2022 年在误设奖励的强化学习环境里测到的正是这条剂量曲线：能力越强的 agent，代理奖励推得越高，真实奖励掉得越狠，且常以相变式的骤跌收场。定律的严酷在于它按能力计费：优化者越强，惩罚越重。</p>` },

    { t: "prose", html: `
<p>抛开出处，定律成立的机制仍是根节点那句话：相关，不是等同。在无人针对指标优化时，代理指标与真实目标稳定相关；一旦宣布「按这把尺子发钱」，所有人的努力就从「把事情做好」漂移向「让读数变大」，而最省力的涨读数方式通常是操纵尺子，不是改善它本该反映的东西。相关关系被优化压力撑断，Goodhart 说的 collapse 指的就是这一次断裂。</p>
<p>注意一个微妙之处：这不需要任何人怀有恶意。认真备考的学生可能真以为刷题技巧就是知识；被 KPI 驱动的工程师可能真心觉得优化点击率就是为用户创造价值。指标的可怕不在诱人作弊，而在它会悄悄替换掉你脑子里的目标本身。这个认知替换有专门的名字，叫 surrogation（见 <code>B07</code>）。</p>
<p>定律的强度如今也有了解析刻度。El-Mhamdi 与 Hoang 2024 年证明，Goodhart 效应是否发生、有多严重，取决于「真目标与被优化指标之差」的尾分布，并据此分出两档：弱 Goodhart，过度优化指标对真目标不再有用；强 Goodhart，过度优化指标对真目标造成伤害；分界由尾分布的形状决定，差异呈长尾时定律成立。这同时标出了边界条件的位置：定律不是「测量无用论」，而是「代理指标加高压优化」这一组合的失效定律。拿掉高压、缩短代理链、保留独立的审计通道，测量依然是已知最强的管理技术，Campbell 本人的「实验社会」立场正在于此。指标什么时候是良性的，<code>B14</code> 专门陈列反方证据与成立条件。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这也是 reward hacking 与 eval 退化的源头命题，而且 2022 年之后它从格言变成了定理。</strong>Skalse 等人证明，除平凡情形外，任何一对不完全对齐的奖励几乎必然可被博弈；Gao 等人测出了过优化的标度律。你的优化器（RL，或你手动挑 checkpoint 的那只手）就是那个被 KPI 驱动的工程师：它不怀恶意，只是忠实地把读数推高，而推高读数最省力的路径几乎从不是「变得更强」。Karwowski 等人 2024 年更进一步，在 MDP 里给出 Goodhart 发生的几何解释和可证明避开临界点的最优早停方法：过优化不再只能事后追悔，原则上可以算出该在何处停手。<code>B08</code> 把「崩塌」拆成四种机制，黄色分支是它在梯度下降里的重演。</p>` },

    { t: "prose", html: `
<p>留一个问题：下次有人拿一句名言、一个指标或一条干净结论说服你，做两件事，查它的出处，问它被优化了多久。名言和指标一样，越是好用、被反复使用，内核越可能已经在使用中被悄悄换掉。顺带一桩悬而未决的小公案：Goodhart 1975 年会议宣读在前，Lucas 1976 年正式刊出在后，「谁先说」取决于把哪个动作算作首发，而 1975 年那两篇会议论文的影印件至今无人核到原件。一条以测量为业的定律，自己的出生证明还压在澳储行的档案里，这大概是它给自己开的玩笑。</p>` },

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
