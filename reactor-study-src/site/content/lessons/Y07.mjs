export default {
  id: "Y07",
  blocks: [
    { t: "prose", html: `
<p>2023 年，Gao、Schulman 与 Hilton 把 Goodhart 定律画成了一条干净的实验曲线。研究对象是 RLHF 里的<strong>奖励模型过优化（reward model overoptimization）</strong>：用一个奖励模型（proxy）代替真实人类偏好（gold），然后拼命优化这个奖励模型。</p>
<p>结果是一条抛物线：随优化强度增加，代理奖励一路上升，真实目标先升后降。过了某个点，越优化 proxy，真实质量越差。这就是 Goodhart 定律，只是这次有了坐标轴和数据点，而且曲线系数随奖励模型参数量平滑变化，可以外推。</p>` },

    { t: "module", module: "sim:overopt", title: "先升后降：过优化的抛物线", config: {} },

    { t: "prose", html: `
<p>拖动滑块能看到两件事。第一，proxy 与 target 错配越大（奖励模型越不完美），真实目标见顶越早、掉得越狠。第二，加一条 KL 约束（限制模型与初始状态的 KL 距离）能让你在峰值前停手，这是 RLHF 对抗过优化的标准做法。</p>
<p>2024 年之后这张图长成了一个谱系。其一，过优化不是 PPO 的专利：Rafailov 等证明 DPO、IPO 这类不显式训练奖励模型的直接对齐算法，同样呈现 KL-质量抛物线，而且因目标函数在分布外非严格凸，概率质量会泄漏到 OOD 响应上，退化形态更难控制。「绕过奖励模型就绕过过优化」是错觉，只要有一个被优化的代理信号，抛物线就在。其二，缓解手段全谱系（奖励模型集成、权重平均 WARM、信息瓶颈 InfoRM）都能推迟掉头，无一能取消：Eisenstein 等的标题就是判决，"Mitigate but Do Not Eliminate"。集成的上限由成员多样性决定，当所有成员从同一批偏好数据学到同一个偏差（比如「长=好」），它们会一致地被同一个 hack 骗过。其三，把 RLHF 做成多轮迭代，过优化会跨轮累积。这与 Skalse 的不可玩性定理首尾呼应：非平凡代理不可能完全防 hack，工程上只能抬高绕行成本。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这条曲线是该直觉目前唯一带坐标轴的证据，处方也直接。</strong>优化一个不完美的代理，收益有上限，越过上限是负收益，所以不要把奖励模型或 eval 优化到底：留一根缰绳（KL、早停、限制优化步数），在真实目标见顶处停手，而不是在代理指标见顶处。你想要的从来不是最高的 proxy 分，是最高的 gold 分，这两个峰值不在同一个地方。集成能帮忙，但记住它的上限在成员多样性，一群共享偏差的评审等于一个评审。</p>` },

    { t: "sources", items: [
      `Gao, L., Schulman, J. & Hilton, J. (2023). "Scaling Laws for Reward Model Overoptimization." arXiv:2210.10760.`,
      `Rafailov et al. (2024). DAA 版标度律, arXiv:2406.02900；Eisenstein et al. (2023). "Helping or Herding?" arXiv:2312.09244.`,
      `Coste et al. (2024) 集成；Ramé et al. (2024) WARM；Wolf, Kirk & Musolesi (2025) 迭代 RLHF。`,
      `Skalse et al. (2022). "Defining and Characterizing Reward Hacking." NeurIPS（不可玩性定理）。`,
      `深化见 <code>research/deep/D5</code> §2；模拟 <code>experiments/exp4</code>。`
    ] }
  ]
};
