export default {
  id: "C01",
  blocks: [
    { t: "prose", html: `
<p>reactivity、performativity、looping effects、legibility、audit culture 这五个概念指向的不是同一件事。区别在于谁是能动的主体：reactivity 的主体是被测量者，performativity 的主体是理论本身，looping effects 的主体是分类与被分类者构成的双向回路，legibility 的主体是要把世界读简单的中心，audit culture 的主体则是审计这套仪式。用错概念会指向错误的对策，所以这个辨析不是词汇练习。</p>` },

    { t: "module", module: "explorable:concept-map", title: "五个近邻：不是一个东西的五个名字", config: {
      mode: "matrix",
      cols: ["能动的主体", "作用方向", "独特之处"],
      rows: [
        { h: "Reactivity", cells: ["被测量者", "测量 → 行为改变", "基准概念：人因被测而改变行为" ] },
        { h: "Performativity", cells: ["理论 / 模型", "理论 → 世界向理论收敛", "主语是理论不是测量；分四档强度，且有反方向的 counter（自毁）" ] },
        { h: "Looping effects", cells: ["分类 / 人的种类", "分类 ↔ 被分类者 双向", "改变的是<em>类别本身</em>（moving target），不只是个体行为" ] },
        { h: "Legibility", cells: ["国家 / 中心", "简化测量 → 重塑世界以便测量", "强调测量的<em>前提</em>：世界要先被改造得可测" ] },
        { h: "Audit culture", cells: ["制度 / 仪式", "审计 → 组织围绕可审计性重组", "强调<em>可审计性</em>取代实质：仪式化" ] }
      ],
      note: "// 悬停一行高亮。记忆钩子：reactivity 是伞概念候选；performativity 的主语是理论；looping 追踪类别漂移；legibility 关心测量前的世界改造；audit culture 落在仪式化。"
    } },

    { t: "prose", html: `
<p>蓝色与黄色分支处理的是同一个不变式，差别在形式化语言：Goodhart 与 Campbell 把它写成指标治理下的失效定律，Holmström-Milgrom 与 Baker 写成合约理论定理，于是 surrogation 补上了它的认知微观基础，而 reward hacking 与 performative prediction 是它在梯度下降里的重演。</p>
<p>D6 报告给这个不变式写下了一句精确的表述：<strong>当你用一个低维、带噪、可被回应的指标去优化或选择一个高维、会回应的系统时，你收敛到的不是系统的真优，而是指标的不动点、博弈的均衡、选择偏差的上序统计量、或退化模型的同态像；偏离量随优化压力单调上升。</strong>契约论、优化不动点、Stackelberg 博弈、历史社会学、控制论、统计学，六种语言各自证过它一次。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这张地图的用处在诊断阶段。</strong>你的 eval 问题可能是 reactivity（模型因被测而变）、performativity（eval 在重塑整个模型生态）、或 legibility（rubric 预先决定了什么可见），三者对应三种完全不同的干预。此外还要加上一条独立于反应性的通道：选择偏差（<code>B13</code>），被测者完全诚实也会让榜首虚高。因此诊断的第一步不是找对策，是先认准机制家族。</p>` },

    { t: "sources", items: [
      `综合自 <code>00-SYNTHESIS-总纲.md §3</code> 与 <code>research/02, 14</code>。`,
      `六语言统一表述见 <code>research/deep/D6</code> 综合节。`
    ] }
  ]
};
