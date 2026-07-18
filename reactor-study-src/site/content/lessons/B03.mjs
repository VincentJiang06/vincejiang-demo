export default {
  id: "B03",
  blocks: [
    { t: "prose", html: `
<p>Lucas 批判（Lucas Critique）是 Goodhart 定律在宏观计量里的孪生命题，1976 年由 Robert Lucas 提出。大意是：你观察到经济变量之间有稳定的历史统计关系（比如通胀和失业的取舍），想用这个关系制定政策；但那些历史关系里的参数，本身内含了人们对旧政策的预期。你一旦改变政策，预期就变，行为就变，你据以定策的关系随之瓦解。你用来预测的规律，因为你使用它而失效。</p>` },

    { t: "module", module: "sim:policy-invariance", title: "规律一旦被用于决策，就不再成立", config: {} },

    { t: "prose", html: `
<p>它和 Goodhart 定律的关系比「雷同」更近。Chrystal 与 Mizen 2003 年的裁定原文是："It could be argued that Goodhart's Law and the Lucas Critique are essentially the same thing. If they are, Robert Lucas almost certainly said it first.「两者的分工在语域：Lucas 批判改变了宏观计量的方法论（要建立在深层参数上），Goodhart 定律改变了货币政策的设计（货币目标制退场、通胀目标制登场）。至于」谁先"，取决于把会议宣读还是正式出版算作首发：Goodhart 1975 年宣读在前，Lucas 1976 年发表在前。这桩优先权之争至今没有定论。</p>
<p>Lucas 把机制精确定位到理性预期：人是前瞻的，会根据预期到的政策调整行为，所以历史参数不是结构不变的。他的建设性主张是，模型应该建立在深层结构参数（偏好、技术、约束）之上，这些参数对政策变化不变（policy-invariant）。用本课程的语言翻译：<strong>想要不被反应性摧毁的预测，必须建立在因果结构上，而不是表层相关上。</strong>这一判断五十年后在机器学习里得到了形式化的对应结论（<code>Y10</code> 的「防博弈必须做因果建模」定理）。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「Lucas 批判证明计量经济学没用。」</strong>复核结论：批判是为了指向更好的建模，不是虚无。Lucas 的原意是把建模对象从「会随政策漂移的表层相关」换成「政策不变的深层参数」。把它读成对量化本身的否定，与把 Campbell 读成反对测量，属于同一类误读。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>把「政策」换成「你的 eval 或训练目标」。</strong>你观察到某个代理指标与真实能力相关，于是拿它当优化目标；但这个相关关系的参数，是在模型还没针对它优化时测出来的。一旦开始优化，模型行为改变，相关关系瓦解。Lucas 批判的 eval 版本一句话：不要把优化前测到的相关，当成优化后还成立的结构。</p>` },

    { t: "sources", items: [
      `Lucas, R. E. (1976). "Econometric Policy Evaluation: A Critique." <em>Carnegie-Rochester Conf. Series</em> 1:19–46.`,
      `Chrystal, K. A. & Mizen, P. D. (2003)（与 Goodhart 定律的优先权与分工裁定）。`,
      `见 <code>research/deep/D2</code> §2。`
    ] }
  ]
};
