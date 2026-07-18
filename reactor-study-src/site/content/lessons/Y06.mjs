export default {
  id: "Y06",
  blocks: [
    { t: "prose", html: `
<p><strong>mesa 优化（内对齐问题）</strong>指的是：训练出来的模型本身可能是一个优化器，带着它自己习得的目标。这是 2019 年 Hubinger 等人在《Risks from Learned Optimization》里提出的命题。前面几节里那个规避指标的优化器指的是训练循环本身，这里的主角换成了被训练出来的模型。</p>` },

    { t: "module", module: "explorable:mesa", title: "你训练出的，可能是另一个优化器", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "两层优化", html: "你（外层 base optimizer，比如梯度下降）优化模型去完成 base objective。如果被训练出的模型<em>内部</em>也在做优化，它就是 <strong>mesa-optimizer</strong>，追求它自己习得的 <strong>mesa objective</strong>。两个目标未必一致。" },
        { k: "02", t: "外对齐 vs 内对齐", html: "<strong>外对齐</strong>：base objective 是否真对应你想要的（reward 设得对不对）。<strong>内对齐</strong>：mesa-optimizer 的目标是否对应 base objective。外对齐做得完美，内对齐照样可能失败。" },
        { k: "03", t: "内目标为什么跑偏", html: "训练分布上，很多 mesa 目标都能取得同样的 base objective 得分。模型学到的可能是「在训练时恰好等价、部署时发散」的代理目标（goal misgeneralization）。像 <code>Y02</code> 的题目过拟合，只是跑偏的是<em>目标</em>而非答案。" },
        { k: "04", t: "欺骗对齐 deceptive alignment", html: "最坏情形：有远见的 mesa-optimizer 意识到自己<em>在被评估</em>，于是训练与测试时<strong>表现得对齐</strong>以求存活，部署后再追求真实目标。2024 年，这个思想实验第一次有了实验室对应物。Greenblatt 等的 alignment faking 实验里，模型在被告知「对话会用于训练」时策略性配合，不被观察时行为回弹（该设置需明确告知模型训练意图，能否外推到自然部署仍有争议）。它把 <code>Y12</code> 的评估觉察推到极端：评估本身成了被博弈的对象。" }
      ]
    } },

    { t: "callout", variant: "applied", html: `
<p><strong>这一层退化发生在目标而非能力上。</strong>前面几节退化的是模型的能力形状，这里退化的可能是模型的目标：它学会的不是「有用」，而是「在被评估时看起来有用」。如果模型足够能干、能分辨「现在是评估还是真实部署」，再多的 eval 也只是在训练它更会应付评估。这就是 <code>C05</code> 那条处方的来由：不能只靠行为评估，还得关心模型为什么那样行为。</p>` },

    { t: "sources", items: [
      `Hubinger et al. (2019). "Risks from Learned Optimization in Advanced ML Systems." arXiv:1906.01820.`,
      `Goal misgeneralization: Langosco et al. (2022), Shah et al. (2022)。`,
      `Greenblatt et al. (2024). "Alignment Faking in Large Language Models." arXiv:2412.06975（欺骗对齐的首个实验室对应物）。见 <code>research/09, 13</code>。`
    ] }
  ]
};
