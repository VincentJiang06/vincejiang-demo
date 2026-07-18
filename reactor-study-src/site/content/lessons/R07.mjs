export default {
  id: "R07",
  blocks: [
    { t: "prose", html: `
<p>操演性（performativity）的命题是：经济理论不是被动拍摄市场的相机，而是驱动市场的引擎。Donald MacKenzie 把书名定为《An Engine, Not a Camera》。更早提出这个词的是 Michel Callon，1998 年的原话："Economics... performs, shapes and formats the economy, rather than observing how it functions."</p>
<p>它与自我实现预言是近亲，但主语换了：这里能动的是理论与模型，不是人的期望。MacKenzie 的贡献是把「理论塑造现实」拆成强度不同的四档，避免它沦为万能口号。</p>` },

    { t: "module", module: "explorable:performativity", title: "操演性的强度谱系", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "generic", html: "理论只是被实际使用了，最弱的一档。人们谈论它、教它，但它未必改变什么。" },
        { k: "02", t: "effective", html: "使用确实造成差别：模型进入实践，改变了计算方式与决策方式。" },
        { k: "03", t: "Barnesian", html: "最强的一档：使用把过程<strong>拉向更符合理论</strong>的样子。市场价格向模型收敛，模型因此「越来越真」。这是操演性的自我实现版本，得名自爱丁堡学派的 Barry Barnes。" },
        { k: "04", t: "counterperformativity", html: "反向：使用反而<strong>削弱</strong>了理论所描述过程的成立，表述把自己变假。一个理论可以因为太多人相信它而变得不真。" }
      ]
    } },

    { t: "prose", html: `
<p>最硬的实证是 Black–Scholes 期权定价。MacKenzie 与 Millo 2003 年对芝加哥期权交易所的历史社会学研究（AJS，被引超过 2300）给出了完整弧线。模型 1973 年发表时，市场价格偏离模型；交易者随身带着 Black 印的定价活页表，照着模型定价、套利，价格逐渐向模型收敛，1973 到 1987 年间拟合越来越好，跨执行价的隐含波动率近乎平坦。不是模型准确描述了市场，而是市场被模型改造得越来越像模型。</p>
<p>然后是断裂。1987 年 10 月 19 日道指单日暴跌 22.6%，基于同一套对冲逻辑的组合保险放大了抛售螺旋；崩盘后出现持久的波动率微笑，低执行价看跌期权的隐含波动率显著翘起，市场学会了预期崩盘，这个 skew 此后再没消失。模型的广泛使用，最终摧毁了它自己的经验有效性。这就是 counterperformativity 的教科书案例。</p>
<p>分析哲学一侧，Mäki 2013 年指出 MacKenzie 借 Austin 的 performative 概念用词过松：市场向模型收敛是因果的社会过程，不是「说即做」的语言行为。Brisset 2016 年给出限度论：并非任何理论都能操演成功，Barnesian 自证需要制度、利益、物质装置配合，现实会抵抗。Mirowski 与 Nik-Khah 的政治经济学批评最尖锐：不能脱离「哪一种经济学、为谁的利益」来谈操演性。Marti 与 Gond 2018 年把这些收束成可检验的边界条件：理论要自我实现，需要被当作行动脚本、有配套装置、且无强反制。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「操演性证明经济学总能自证。」</strong>复核结论：这恰恰抹掉了 MacKenzie 四分类学的全部要点。generic 不等于 effective，更不等于 Barnesian，而且存在方向相反的 counterperformativity。另一条诚实边界：文献里「价格向模型收敛」的精确百分比说法不一，稳妥的主张只有两条硬事实：拟合先改善，1987 后断裂。别为了故事漂亮去虚构一个收敛数字。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这是 Goodhart 的社会学镜像，而且已经和 ML 正式合流。</strong>一个被广泛采用的 eval（reward model、LLM-judge）一旦成为训练目标，生态会向它收敛（Barnesian），分数越来越好看；优化过头之后，优化本身破坏它要测量的能力（counter）。2024 年 NeurIPS 上一篇论文标题直接叫 "An Engine, Not a Camera: Measuring Performative Power of Online Search"，用真实搜索引擎实验测量平台「操舵」用户分布的能力。五十年的社会学叙事，正在变成可测量的指标。<code>Y09</code> 给出它的数学形式。</p>` },

    { t: "prose", html: `
<p>留一个问题：MacKenzie 的案例里被操演的是可读的理论（一条定价公式）。当操演者换成不可解释的深度模型，Barnesian 与 counter 的区分还适用吗？能不能在事前判断一个模型的普及会放大还是抵消它自己？这两问 D6 报告都标为未解。</p>` },

    { t: "sources", items: [
      `MacKenzie, D. & Millo, Y. (2003). "Constructing a Market, Performing Theory." <em>AJS</em> 109(1):107–145.`,
      `MacKenzie, D. (2006). <em>An Engine, Not a Camera</em>. MIT Press（四分类学）。`,
      `Mäki (2013)；Brisset (2016)；Mirowski & Nik-Khah (2007)；Marti & Gond (2018)（边界条件）。`,
      `Mendler-Dünner, Carovano & Hardt (2024). "An Engine, Not a Camera: Measuring Performative Power of Online Search." <em>NeurIPS</em>。深化见 <code>research/deep/D6</code> §4。`
    ] }
  ]
};
