export default {
  id: "Y01",
  blocks: [
    { t: "prose", html: `
<p><strong>过拟合（overfitting）</strong>是 Goodhart 定律的统计学同构，统计学习理论只是不用 Goodhart 这个名字描述它。</p>
<p>你有一批数据，想学一个规律。你不断提高模型容量（比如多项式次数）去更好地拟合训练数据，训练误差一路下降。可在没见过的测试数据上看，误差先降后升：过了某个点，模型不再学习规律，而是开始背诵训练集的噪声。它在训练集上的完美，是拿真实泛化换来的。</p>` },

    { t: "module", module: "sim:overfit", title: "训练集就是你的 eval", config: {} },

    { t: "prose", html: `
<p>把映射写清楚，后面几节的机制都是这一条的变体：训练集 = 你优化的代理指标；真实分布 = 你真正想要的目标；模型容量 = 优化压力。「在训练集上过拟合」和「把一个 benchmark 分刷到虚高」是同一件事的两个名字。你在训练误差（proxy）上使的劲越大，它和测试误差（target）越可能分道扬镳，这正是 <code>B08</code> 里的 regressional 与 extremal Goodhart。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>关键一句：训练集就是你的 eval。</strong>机器学习为对抗过拟合发明的整套纪律（留出验证集、交叉验证、正则化、早停）正是对抗 Goodhart 的纪律。<code>Y02</code> 会讲一个更隐蔽的版本：即使从不把测试集拿去训练，只要反复看它来做模型选择，你依然在过拟合它。看，也是一种训练。该版本在经验上比理论预言温和得多，边界见 <code>Y02</code>。</p>` },

    { t: "sources", items: [
      `Vapnik, V. (1995). <em>The Nature of Statistical Learning Theory</em>；Hastie, Tibshirani & Friedman (2009). <em>The Elements of Statistical Learning</em>（偏差-方差分解、VC 维、正则化）。`,
      `见 <code>research/05, 06, 13</code>。`
    ] }
  ]
};
