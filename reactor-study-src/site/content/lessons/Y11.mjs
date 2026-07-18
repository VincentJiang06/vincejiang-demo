export default {
  id: "Y11",
  blocks: [
    { t: "prose", html: `
<p>把 Espeland-Sauder 的法学院换成 AI 模型排行榜，反应性的结构一字不改，只是周期从数年缩短到数周。这一节是马太与人工市场（<code>R10</code>）和基准污染（<code>Y03</code>）的交汇。</p>
<p>Chatbot Arena（LMArena）用人类两两对战投票给模型排名，一度被广泛当作「真实能力」榜。2025 年 Cohere 团队的《The Leaderboard Illusion》系统提出质询：论文要拆开的是：这个榜的分数里，有多少是能力，有多少是对这个榜的适应。论文里最直接的数字：哪怕只拿到少量 Arena 数据做调优，也能在 Arena 分布上带来最高 112% 的相对提升。那是对榜的过拟合，不是通用质量。</p>` },

    { t: "module", module: "sim:arena", title: "发布即登顶：名次如何脱离真实能力", config: {} },

    { t: "prose", html: `
<p>拖动滑块，看真实排第 11 的模型如何被抬进前几名。指控主要有三条，模拟里都能亲手复现：</p>
<ul>
<li><strong>best-of-N 私测</strong>：厂商私下测很多变体，只公开发布分数最高的那个。这是对随机噪声的择优（<code>B13</code> 优化者诅咒），系统性抬高期望名次。据指控，Meta 为 Llama 4 私测了多达 27 个变体。</li>
<li><strong>采样不对称</strong>：大厂模型获得更多对战场次，置信区间更窄、排名更稳，还能悄悄下架表现差的变体。</li>
<li><strong>风格分</strong>：模型不提升真实能力，而是迎合投票者偏好（更长的回复、列表、热情开场、emoji）。分数上升，模型未必更好。榜方为此引入 style control 试图剥离这层。</li>
</ul>
<p>2025 到 2026 年，两条新证据把问题推得更远。其一，刷票被证明可定量攻击：Min 等人在 170 万条真实投票上模拟，利用 Bradley-Terry 模型的全局耦合性（任何一票都会影响目标模型的排名，即使那场对战与它无关），约 2 万票能把目标模型抬升 10 名，受限访问的现实设定下几百票就能升 5 名。其二，裁判商业化：LMArena 从学术项目公司化，2026 年 1 月 Series A 估值 17 亿美元。该榜由一家以此排名为核心业务的公司运营。Espeland-Sauder 的反应性此刻叠加了资本利益。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「Arena 分数全是刷出来的。」</strong>复核结论：过头了。对 Leaderboard Illusion 的幅度估计，Simon Willison 与 LMArena 官方都给出了可辩之处（开源占比统计口径、新用户涌入稀释私测偏差），刷票攻击也需要相当规模的协同投票。综合双方回应，能站住的版本是：结构性激励问题成立，具体百分比需谨慎；Arena 可被系统性博弈，其分数部分是「Arena 形状」的能力。另一条测量学脚注：Elo 假设的可传递性与单一实力维度在 LLM 成对比较里常被违反，排名的确定性被系统性高估（置信区间过窄）。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>看 Arena，优先看 style-control 后的排名和置信区间。</strong>对「发布即登顶」的新模型保留怀疑：它的分里多少是能力、多少是押题和讨好，榜单自己分不出来。这一节把整门课收束成一个你每天在看的例子：聚合型榜单一旦被宣布为目标就会失真，2025 年的新情况只是这个循环一周内就能跑完，而且裁判现在有了自己的商业动机（<code>C02</code> 七杠杆里「被测者反身能力」与「裁判利益」两根杠杆同时到顶）。</p>` },

    { t: "sources", items: [
      `Singh et al. (2025, Cohere). "The Leaderboard Illusion." arXiv:2504.20879（NeurIPS 2025 D&B）。`,
      `Min et al. (2025). "Improving Your Model Ranking on Chatbot Arena by Vote Rigging." arXiv:2501.17858（刷票攻击曲线）。`,
      `LMArena 融资：Reuters 2026-01-06（估值 17 亿美元）；平衡视角：Willison (2025-04-30) 与 LMArena 官方回应。`,
      `Elo/Bradley-Terry 假设的测量学批评（可传递性、单一维度）：见 <code>research/deep/D4</code> §4。`,
      `深化见 <code>research/deep/D4</code> §4；模拟 <code>experiments/exp2</code>。`
    ] }
  ]
};
