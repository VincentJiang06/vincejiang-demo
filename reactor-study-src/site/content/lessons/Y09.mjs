export default {
  id: "Y09",
  blocks: [
    { t: "prose", html: `
<p><strong>表演性预测（performative prediction）</strong>指的是：你的预测本身会改变它所预测的那个分布。2020 年 Perdomo、Zrnic、Mendler-Dünner 与 Hardt 把 Espeland-Sauder 的反应性写成了这条干净的机器学习数学。</p>
<p>标准机器学习假设数据分布固定，你去拟合它。表演性预测说：你的预测本身会改变数据分布。你部署一个模型，它的输出影响世界，世界变了，产生新数据，你原来拟合的那个分布已经不在了。原文定义："When predictions support decisions they may influence the outcome they aim to predict."这正是「排名重新制造现实」的数学版。</p>` },

    { t: "module", module: "explorable:performative", title: "预测改变分布：反应性的数学化", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "分布依赖于模型", html: "数据分布 D(θ) 是模型参数 θ 的函数：换一个模型，世界给你的数据就变。信用评分改变借贷行为、推荐系统改变口味、招聘筛选改变简历。分布不再是外部给定的，是你自己造的。反应性强度被形式化为分布映射的 Lipschitz 常数 ε：数据对模型有多敏感。" },
        { k: "02", t: "两种解概念", html: "<strong>Performative stability（表演性稳定）</strong>：模型对它<em>自己造成的</em>分布最优，即重训练收敛到的不动点。<strong>Performative optimality（表演性最优）</strong>：考虑到自己会改变分布之后，真正最好的模型。<strong>关键定理：两者一般不重合，且稳定点可以离最优点任意远。</strong>一个自我印证的均衡，可以是任意糟糕的均衡。" },
        { k: "03", t: "重训练收敛到哪", html: "部署、收集新数据、重训练、再部署，循环往复（repeated risk minimization，RRM）。Perdomo 证明：当反应性 ε 低于阈值（约 ε&lt;γ/β，反应性小于损失曲率与光滑度之比）时，循环指数收敛，但收敛到的是 stability，不是 optimality；ε 超过阈值，循环震荡发散。「越优化越发散」第一次有了可写下的分界。你以为在逼近真相，实际在逼近一个自洽的幻觉。Miller 等人 2021 年的论文标题把这个困境叫作 echo chamber：你永远只看见自己诱导出来的分布。" },
        { k: "04", t: "这就是 Espeland-Sauder", html: "把「模型」换成「排名」，把「重训练」换成「学校调整行为」：排名反复更新，收敛到一个各校都已按它重塑的稳定状态。那个状态自洽、「准确」，却不是任何独立意义上的「最好」。反应性有了不动点定理。真实世界证据也有了：Perdomo 等 2025 年检验威斯康星州辍学预警系统十年数据，发现预测系统在很大程度上只是在复述学校层面的既有不平等。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「重训练收敛了，说明系统调好了。」</strong>复核结论：收敛到稳定点几乎从不等于到达最优，把 RRM 收敛当胜利，正是 Goodhart 的高发形态。另一条：performativity 不是 Perdomo 等人的发明，他们在论文开篇明确追认这是政策研究与经济社会学（MacKenzie）里研究已久的现象，ML 版是形式化不是原创。这份诚实值得学。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的 eval 若会影响你训练什么，它就是表演性的。</strong>你不是在测量固定的模型群体：eval 塑造下一代模型，下一代模型又改变 eval 该测什么。反复迭代，生态收敛到一个对当前 eval 表演性稳定的点，所有模型都擅长你的 eval，而 eval 早已不测量你最初关心的东西。这是「eval 越多越退化到 eval」的不动点表述。还有一层更深的问题：Oesterheld 等 2023 年证明，当评测者的预测本身影响结果时，标准的 proper scoring rule 不再诱导诚实。评测者自己也在回路里。</p>` },

    { t: "sources", items: [
      `Perdomo, Zrnic, Mendler-Dünner & Hardt (2020). "Performative Prediction." ICML.`,
      `Miller, Perdomo & Zrnic (2021). "Outside the Echo Chamber." ICML；Hardt & Mendler-Dünner (2025). "Performative Prediction: Past and Future." <em>Statistical Science</em>（五年综述）。`,
      `Perdomo et al. (2025). 威斯康星 DEWS 十年检验, ACM FAccT。`,
      `Oesterheld et al. (2023). "Incentivizing honest performative predictions with proper scoring rules." UAI。`,
      `深化见 <code>research/deep/D6</code> §2。`
    ] }
  ]
};
