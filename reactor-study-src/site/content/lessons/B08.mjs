export default {
  id: "B08",
  blocks: [
    { t: "prose", html: `
<p>Goodhart 定律不是一条定律，而是四条。2018 年 David Manheim 和 Scott Garrabrant 把这句格言拆成四种机制上完全不同的失效模式。四型之分是可操作的：不同的 Goodhart 需要不同的对策，判错类型，补救就会用在错误的环节。</p>` },

    { t: "module", module: "sim:goodhart4", title: "四种 Goodhart，四条不同的曲线", config: {} },

    { t: "prose", html: `
<p>切换四种类型，盯住「选中者的真实目标」（红线）怎么走：</p>
<ul>
<li><strong>Regressional（回归型）</strong>：proxy = target + 噪声。按 proxy 择优，选中的 target 期望必低于 proxy（向均值回归、赢者诅咒）。最温和的一型，target 仍缓慢上升，只是没 proxy 涨得快。这就是 <code>B13 优化者诅咒</code>。</li>
<li><strong>Extremal（极值型）</strong>：proxy 与 target 只在正常范围相关。优化压力把你推进从未见过的尾部，隐藏约束被突破，target 掉头向下。</li>
<li><strong>Causal（因果型）</strong>：proxy 与 target 只是共因相关。你直接干预 proxy 而非那个共因，关联被切断：proxy 涨，target 纹丝不动。让学生背题库不会提高能力，因为分数与能力只是共因关联。</li>
<li><strong>Adversarial（对抗型）</strong>：有对手知道你的 proxy，专门制造 proxy 高、target 低的选项喂给你。压力越大，选中的 target 越差。</li>
</ul>
<p>2022 年之后，这套定性分类被机器学习一步步做成了定理与测量，值得记住五个里程碑。Pan 等 2022 年在四个误设奖励的 RL 环境里实测：能力越强的 agent，Goodhart 效应越强，且常见相变式骤跌。Skalse 等 2022 年证明可玩性（unhackability）定理：除平凡情形外，任何一对不完全对齐的奖励几乎必然可被博弈。Gao、Schulman 与 Hilton 2023 年测出过优化的标度律，真实目标随优化先升后降，曲线系数随奖励模型参数量平滑变化（细节在 <code>Y07</code>）。Karwowski 等 2024 年给出 MDP 里的几何解释和可证明避开临界点的最优早停。El-Mhamdi 与 Hoang 2024 年给出弱/强 Goodhart 的判据：过优化是无效还是有害，取决于「真目标与代理之差」的尾分布，长尾则强 Goodhart 成立。格言由此获得了可计算的形式。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>诊断你的 eval 失效，先问它是哪一型。</strong>题目过拟合大多是 regressional（择优放大噪声）；把模型推到分布外的怪异行为是 extremal；分数上升而实际能力不动，是 causal（优化的通道和能力只是共因相关）；一个会针对你评分规则专门优化的 RLHF 循环，正在制造 adversarial Goodhart。对策各不相同：regressional 靠收缩与留出集，causal 靠干预真正的因，adversarial 靠指标保密或轮换（保密的微观基础见 <code>B12</code>）。判错类型，补救就会用在错误的环节。</p>` },

    { t: "sources", items: [
      `Manheim, D. & Garrabrant, S. (2018). "Categorizing Variants of Goodhart's Law." arXiv:1803.04585.`,
      `Pan et al. (2022) ICLR；Skalse et al. (2022) NeurIPS；Gao et al. (2023) ICML；Karwowski et al. (2024) ICLR；El-Mhamdi & Hoang (2024)。`,
      `定理化浪潮见 <code>research/deep/D2</code> §5；模拟 <code>experiments/exp3</code>。`
    ] }
  ]
};
