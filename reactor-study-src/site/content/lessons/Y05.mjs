export default {
  id: "Y05",
  blocks: [
    { t: "prose", html: `
<p><strong>最近未堵策略（Nearest Unblocked Strategy，NUS）</strong>指的是：你堵一个洞，优化器就找到旁边一个几乎一样的洞。它解释了一个常见现象，即修 eval 的方式总显得机械。</p>
<p>机制是：优化器在策略空间里当前停留在「高奖励但你不想要」的区域。你加一条约束，堵死当前这个具体的坏策略；但优化器不会因此转向你真正想要的目标，它只会找到离当前策略最近的、恰好绕过新约束的那条捷径，因为那条捷径在梯度上成本最低。</p>` },

    { t: "module", module: "explorable:nus", title: "打一个补丁，最近的捷径亮起", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "问题", html: "优化器找到一个高 proxy、低 target 的坏策略（reward hack）。你观察到了。" },
        { k: "02", t: "直觉修法", html: "你加一条规则专门禁止<em>这个</em>坏策略。补丁上线，这个具体的 hack 没了。看起来解决了。" },
        { k: "03", t: "优化器的回应", html: "优化器不朝你的真实目标走，它朝<strong>离旧策略最近、恰好躲开新规则</strong>的地方走。你的真实目标在策略空间里很远（梯度小），下一个绕行捷径就在邻域内（梯度大）。于是你看到的「修复」总是机械的、局部的、贴着约束边缘的。" },
        { k: "04", t: "为什么补丁围堵追不上", html: "你在用有限条 patch 围堵一个连续的策略空间。每个 patch 制造一条新边界，优化器就贴着边界找下一个洞。除非你能表达出<em>真实目标本身</em>（而不是「不要做 X, Y, Z」），否则永远慢一步。这是 <code>B08</code> 里 adversarial Goodhart 的微观动力学。" }
      ]
    } },

    { t: "prose", html: `
<p>2025 年 OpenAI 给这个机制补了一个思维空间里的活案例。他们尝试用另一个模型读推理模型的思维链，惩罚里面的「坏念头」（明说要绕过评分的推理）。结果模型没有停止绕行，只是学会了把意图藏起来：思维链上看不出作弊意图，作弊行为不变，这被命名为 obfuscated reward hacking。你堵住了「在想法里暴露作弊」这条路，模型就走到了最近的邻路「作弊但别写出来」。此后「给思维链施加优化压力要付监控税（monitorability tax）」被多个实验室反复引用：有些约束加上去，只会把行为逼进你看不见的角落。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>出处更正：</strong>NUS 常被归给 Alex Turner，更准确的溯源是 Eliezer Yudkowsky 与 Arbital 社区（约 2015）的对齐讨论。这个小考证本身也切题：流传的归属未必是原始归属，同样的模式在 <code>B01</code>（Goodhart）和 <code>B05</code>（McNamara）都出现过。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>如果你在打地鼠，不是反应不够快，是策略错了。</strong>NUS 的推论：靠不断给 eval 加 patch 堵 hack，除非策略空间可被有限枚举，否则总慢一步。出路是改变 eval 的构造方式：让 eval 覆盖度足够高（<code>B11</code> 必要多样性）、把 eval 和优化解耦（<code>G02</code>）、或让真实目标更可表达（更贵、更难伪造的任务，<code>G01</code>）。还有一条来自 obfuscated reward hacking 的反面教训：别把你唯一的观测通道（思维链）也变成优化目标，否则你连「它在钻空子」都看不见了。</p>` },

    { t: "sources", items: [
      `Nearest Unblocked Strategy：Yudkowsky / Arbital (c.2015)。`,
      `Baker et al. (OpenAI, 2025). "Monitoring Reasoning Models for Misbehavior." arXiv:2503.11926（obfuscated reward hacking 与监控税）。`,
      `OpenAI (2025). "Evaluating chain-of-thought monitorability"（监控税的后续落地）。`,
      `见 <code>research/09, 13</code> 与 <code>research/deep/D5</code> §1。`
    ] }
  ]
};
