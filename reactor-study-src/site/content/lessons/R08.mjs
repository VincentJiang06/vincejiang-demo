export default {
  id: "R08",
  blocks: [
    { t: "prose", html: `
<p>反身性（reflexivity）是 Soros 用于投资决策的哲学框架，由两条原理叠成。可错性：参与者对世界的看法从不完美对应实际状态。反身性：这些不完美的看法，又能通过参与者的行动，反过来影响它们所指涉的情境。两者合起来，Soros 称之为「人类不确定性原理」。</p>
<p>认知功能是现实塑造观念（reality → views），操纵功能是观念塑造现实（views → reality）。两者同时运行、互为输入，关系是循环递归的，结果是市场远离均衡，走 boom-bust 循环。</p>` },

    { t: "module", module: "sim:boom-bust", title: "正反馈的繁荣，负反馈的均衡", config: {} },

    { t: "prose", html: `
<p>关键在反馈的符号。负反馈让观念与现实相互靠拢，趋向均衡；正反馈让它们相互远离、自我强化，最终自我瓦解。Soros 的原话："Every bubble has two components: an underlying trend that prevails in reality and a misconception relating to that trend."一个底层趋势加一个关于它的误解，正向相互强化，直到真相时刻到来，反转崩溃。</p>
<p>把三家的语言对齐：Soros 的正反馈对应 MacKenzie 的 Barnesian 操演性、对应自我实现预言的放大轴；负反馈对应 counterperformativity、对应自我否定预言的抵消轴。Soros 的独特贡献是把两根轴装进同一个动态模型：同一场泡沫先正反馈繁荣、再负反馈崩溃，社会学诸家通常分开处理它们。</p>
<p>长期批评说反身性「有洞见但难以证伪」。这条批评在 2020 年之后有了部分回应：performative prediction（<code>Y09</code>）把「预测改变被预测对象」写成带收敛条件的优化问题，反应性强度低于阈值时反复优化会稳定，高于阈值时会震荡发散。这正是 Soros 的均衡与远离均衡两种相，第一次有了可写下的分界。多主体版本的结论更强：Piliouras 与 Yu 2023 年证明，多个学习者同时反身时，动力学可以从收敛直接跌入混沌。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「反身性是 Soros 的发明。」</strong>复核结论：他自己明确否认。2013 年论文原话 "Of course I did not discover reflexivity."，并列出先驱：Knight 的不确定性、Keynes 的选美竞赛、Merton 的自我实现预言、Popper 的俄狄浦斯效应。他的贡献是把它做成了操作性的投资框架，以及那笔著名的业绩记录。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>「AGI 临近」具备反身性泡沫的形式特征。</strong>研究者对模型能力的可错判断，影响部署与训练决策；部署又改变模型的实际能力与行业的资源流向，循环没有独立锚点。这是结构类比，不是对泡沫的实证判定：按 <code>R07</code> 给出的边界条件，它是否构成 Barnesian 自证，取决于有没有强反制力量。这个信念驱动投资、算力与能力，可能自我强化成 boom，也可能在脱离现实后瓦解成 bust。判据不是「AI 是不是真的强」，而是链条上有没有一个不受信念影响的测量点。找不到这样的测量点，判断就只能在信念内部循环。</p>` },

    { t: "prose", html: `
<p>留一个问题：Soros 只能事后讲述泡沫，performative prediction 给出了事前的收敛阈值，但两套语言还没对接。把「这场 AI 叙事处于均衡相还是远离均衡相」变成可估计的量，是这条线最值得做的事。</p>` },

    { t: "sources", items: [
      `Soros, G. (2013). "Fallibility, reflexivity, and the human uncertainty principle." <em>J. of Economic Methodology</em> 20(4):309–329.`,
      `Soros, G. (1987). <em>The Alchemy of Finance</em>.`,
      `Piliouras & Yu (2023). "Multi-agent performative prediction: From global stability and optimality to chaos." <em>ACM EC</em>。`,
      `阈值与不动点的数学见 <code>Y09</code> 与 <code>research/deep/D6</code> §2。`
    ] }
  ]
};
