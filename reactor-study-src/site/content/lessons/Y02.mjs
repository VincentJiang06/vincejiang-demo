export default {
  id: "Y02",
  blocks: [
    { t: "prose", html: `
<p>自适应过拟合（adaptive overfitting）是这样一个现象：你从来没把测试集拿去训练，只是反复看它、用它筛选模型，可「反复看同一个测试集来做选择」这个动作本身，就在把测试集的特异性灌进你的模型。</p>
<p>它对应你最切身的那个经历：搭一套 eval 衡量 agent 好不好，反复用它筛选、调参、挑最优版本，eval 分数漂亮地涨了；放到真实使用里，前后毫无区别。模型只是学会了严丝合缝地拟合你那套 eval。</p>` },

    { t: "module", module: "sim:eval-overfit-lab", title: "Eval 过拟合实验室：解剖榜面分数" },

    { t: "prose", html: `
<p>默认设置跑到底，榜面分数（发光那条）一路飙升，「全维真实能力」（红线，用户真正体验到的）几乎不动。中间那片发光的空隙就是幻觉，由两部分组成：</p>
<ul>
<li><strong>题目过拟合</strong>：模型记住了这一套具体题目的套路、巧合、措辞。换一批新题，这部分瞬间蒸发。把「题库策略」切到「每代换新题」，你会看到它当场清零。现实对应是基准污染：GSM8K 的题被吃进训练集，换成 GSM1k 新题，一批模型掉分。</li>
<li><strong>维度窄化</strong>：模型确实变强了，但只在 eval 覆盖的那一小部分维度上（模拟默认值 10%）。它是合法但片面的，你练的是被路灯照到的地方。</li>
</ul>
<p>再把「容量约束」切到零和，这是后果最重的一档。现实里模型容量、数据配比、RL 算力都有限，投给被测维度的就得从别处抽走。你会看到未测维度的能力真实地变成负数：模型不只是没在别处进步，它在主动退化，被 eval 的形状重新塑形。这是「eval 越多，AI 越退化到 eval」最干净的一张图。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>「只看不训练」同样会污染测试集。</strong>在有噪声的测试集上，从 20 个随机变体里挑分数最高的那个，你挑中的多半是「恰好在这套题的噪声上运气好」的那个（<code>B13</code> 的优化者诅咒）。重复几百代，你就是在沿着测试集的噪声做梯度上升，哪怕一次都没反向传播过它。查询次数越多、题库越小，幻觉涨得越快。这有严格的统计上界：Blum 与 Hardt 的 Ladder、Dwork 等人的可重用 holdout，本质都是给「看测试集」记账收费。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「反复刷同一个榜，必然严重过拟合。」</strong>复核结论：理论警告的是最坏情况，经验裁决温和得多。Roelofs 与 Recht 等人 2019 年复核了一百多场 Kaggle 竞赛（公榜私榜天然对照），原文结论是 "little evidence of substantial overfitting"；Mania 等人给出机制：候选模型彼此高度相似，对测试集的有效独立查询数远小于提交次数，过拟合预算消耗得慢。ImageNet 十年重测也显示绝对分虚高但相对排名稳定。<strong>命题的准确版本：经典测试集重用的退化被模型相似性稀释得很弱；退化真正凶猛的场景，是优化压力高度集中于单一、可记忆目标的时候（RLHF、agentic coding 记忆补丁）。</strong>这条边界是 D4 报告画出来的。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>防御手段的效力在图上一眼可见：</strong><br>
① <strong>留出集（held-out）</strong>：留一组优化循环永远看不到的题，题目过拟合无处藏。<br>
② <strong>动态轮换题库</strong>：让博弈追不上（Dynabench、LiveBench 的抗污染设计）。<br>
③ <strong>把 eval 和优化循环解耦</strong>：eval 只做诊断、不直接驱动改模型，Deming 的老处方（<code>C05</code>）。<br>
④ <strong>承认容量约束</strong>：别把所有优化压力压在一个窄 eval 上。<br>
完整的抗博弈 eval 清单见 <code>C07</code>。</p>` },

    { t: "prose", html: `
<p>一句实话作结：你能发现「eval 前后毫无区别」，这个发现本身比那套 eval 值钱。在第一层，eval 绿灯全亮而产品质量没有变化，容易被读成进步；第二层是看见测量本身的失效。第三层是建一套从一开始就知道自己会被博弈、并为此做了设计的评估体系。</p>` },

    { t: "sources", items: [
      `Blum & Hardt (2015). "The Ladder." <em>ICML</em>；Dwork et al. (2015) 可重用 holdout。`,
      `Roelofs, Shankar, Recht et al. (2019). "A Meta-Analysis of Overfitting in Machine Learning." <em>NeurIPS</em>（Kaggle 百场裁决）。`,
      `Mania et al. (2019). "Model Similarity Mitigates Test Set Overuse." <em>NeurIPS</em>（机制解释）。`,
      `Recht et al. (2019)；GSM1k (Zhang et al. 2024)。深化见 <code>research/deep/D4</code> §1；模拟对应 <code>experiments/exp4</code>。`
    ] }
  ]
};
