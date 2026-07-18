export default {
  id: "R03",
  blocks: [
    { t: "prose", html: `
<p>可通约化（commensuration）指把异质的「质」压成共享同一把标尺的「量」。Yale 法学院排第 1，新墨西哥大学排第 99，两所使命完全不同的学校之间的差异，从此被表达为一个数字：98。</p>
<p>Espeland 与 Stevens 在 1998 年的纲领性论文里点破了反直觉的一层：可通约化不是去发现事物之间既有的相似性，而是主动创造可比性。它先把本来不可比的东西假定为同类，再在它们之间安放精确的量化间隔。原文的表述是 "Commensuration transforms qualities into quantities, difference into magnitude"：把质变成量，把差异变成大小。他们进一步把它定性为一种权力模式（a mode of power），因为它决定什么与什么相关、什么从此不可见。</p>` },

    { t: "module", module: "explorable:flatten", title: "通约化的四个分析面", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "动机", html: "为什么要通约：降低不确定性、缓和冲突、跨距离协调、给决策赋予正当性。有时是被排斥者主动要求「被算进去」：通约既是压迫，也可能是入场券。" },
        { k: "02", t: "技术形式", html: "用什么把质转成量：Thévenot 所谓的 investment in forms，即聚合、赋权重、标准化工序。USNWR 把 LSAT、GPA、声誉调查、就业率打包加权成一个数，就是一次巨大的形式投资。" },
        { k: "03", t: "效果", html: "通约重新分配<strong>注意力</strong>：它让某些差异变得无关、不可见（Yale 办 9 份学生法律期刊、新墨西哥培养全美最多的原住民律师，这些在标尺上都看不见），同时凸显另一些差异。它既统一又区分它涵盖的对象。" },
        { k: "04", t: "抵抗", html: "人们通过宣称某物<strong>不可通约</strong>来划定道德边界：把爱、生命、圣地置于交易之外。这不是非理性，而是一种正当的政治行动。拒绝为某物标价，本身就构成并表达了那种关系（Raz 的 constitutive incommensurability）。" }
      ]
    } },

    { t: "prose", html: `
<p>最锋利的例子来自 Espeland 自己的田野。美国垦务局要在两河交汇处建 Orme 大坝，将淹没 Yavapai 原住民的祖居圣地。技术官僚用成本效益分析，试图把圣地和「其他土地加一笔补偿金」放进同一把尺子。Yavapai 拒绝为圣地定价。这正是 constitutive incommensurability 的含义：某些关系，恰恰由「拒绝为它标价」这个行为所构成。成本效益分析给「一条统计生命值多少钱」定价，是同一套逻辑的另一副面孔。</p>
<p>这个概念后来长出了两条值得注意的修正。其一，Nelken 2021 年用 COVID 排名案例主张区分「比较」与「可通约化」：很多所谓指标只是弱比较，并不满足「共享同一基数度量」的强条件。若此说成立，反应性可能只在强通约（真正的共同基数）下才最猛烈，这给「一切指标都危险」的泛化画了边界。其二，Van Bommel 等 2023 年在可持续报告领域实证了通约化对道德的挤出（crowding out of morality）：把价值观换算成分数之后，人们讨论的对象从「该不该」变成了「多少分」。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「通约化只是中性的单位换算。」</strong>复核结论：Espeland 与 Stevens 的核心论点恰恰相反，它是一种权力模式，先决定什么相关、什么被抹去，技术细节其次。一把尺子最大的权力不在它测了什么，而在它让什么变得不可见。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>一个 leaderboard 分数就是一次通约化。</strong>把有用、安全、诚实、无害压成单一榜单分数，让跨模型比较成为可能，同时把无法量化的维度（长程危害、文化语境、审议成本）默默判为无关。当你设计 eval 的打分 rubric，你不只是在测量，你在决定这个领域从此看得见什么、看不见什么。</p>` },

    { t: "prose", html: `
<p>留一个问题：传统通约化假定人读得懂那把尺子。深度模型的评分是不可读的黑箱，这会不会产生一种新的「黑箱可通约化」：被评者连逆向工程的机会都没有，只能盲目迎合？D1 报告把它列为本线的开放问题。</p>` },

    { t: "sources", items: [
      `Espeland, W. N. & Stevens, M. L. (1998). "Commensuration as a Social Process." <em>Annual Review of Sociology</em> 24:313–343.`,
      `Espeland, W. N. (1998). <em>The Struggle for Water</em>（Orme Dam 案例）。`,
      `Nelken, D. (2021). "Between comparison and commensuration." <em>Int'l J. of Law in Context</em>（比较不等于通约）。`,
      `Van Bommel et al. (2023). "From values to value." <em>Organization & Environment</em>。深化见 <code>research/deep/D1</code> §2。`
    ] }
  ]
};
