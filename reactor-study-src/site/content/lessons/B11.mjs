export default {
  id: "B11",
  blocks: [
    { t: "prose", html: `
<p>必要多样性（requisite variety）是整个 Goodhart 家族最深的控制论根源，1956 年由 W. Ross Ashby 提出。原话是 "only variety can destroy variety"：只有多样性能消灭多样性。流行的 absorb 版本（「只有多样性能吸收多样性」）是 Stafford Beer 的管理学改写，Ashby 原文用的是 destroy。</p>
<p>定律的意思是：一个控制器要把系统稳定在目标状态，它能采取的不同应对动作的种类数（控制器的多样性 V），必须至少匹配系统可能遭遇的不同扰动的种类数（扰动的多样性 D）。写成不等式：V(输出) ≥ V(扰动) − V(调节器)。控制器多样性不够，多出来的扰动无论如何都会漏过去。</p>` },

    { t: "module", module: "sim:variety", title: "只有多样性能消灭多样性", config: {} },

    { t: "prose", html: `
<p>为什么这是 Goodhart 的根源？因为单一指标就是一个多样性极低的控制器。你想用一个数字驾驭一个复杂系统（一所大学、一个模型、一个经济体），而系统能给你的扰动（各种真实情况、各种规避指标的方式）远比一个数字能区分的多。V(R) 远小于 V(D)，大量真实情况从控制里漏走：要么不被指标看见，要么被针对性规避。Goodhart 说的崩塌，在 Ashby 这里是控制器多样性不足的必然结果。</p>
<p>Ashby 思想里还有一条更深的定理，回答的不是「够不够」而是「对不对」。Conant 与 Ashby 1970 年证明：每个好的调节器都必须是被调节系统的一个模型（every good regulator of a system must be a model of that system）。要小心三重流行误读：这里的「模型」只是一个同态映射（调节器的动作是系统状态的函数），不是认知科学意义的丰富世界模型；定理证的是「若调节最优，则结构可解读为模型」，因果方向常被讲反；原证明在「最优、确定性」假设上有技术空隙（Scholten 2010 有专文澄清）。把两条定理合起来用才有力：单一 KPI 既多样性不足（V 约等于 1），又是系统的一个极度退化的投影。用一个分数管理通用能力，等于用一个把系统压成一维的坏模型当调节器，既不够多样，也不忠实。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「好调节器定理证明 AGI 必须有世界模型。」</strong>复核结论：过度引申。定理的"model"是同态映射的弱含义，前提是最优且确定性的调节器，且原证明本身有待补足的空隙。它能支撑的结论是方向性的：调节质量与「调节器多少反映了系统结构」正相关。拿它当「必须内建丰富世界模型」的铁证，是把一个结构性结论读成了认知断言。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>单个 benchmark 无法约束一个通用模型的行为空间。</strong>通用模型的行为多样性 V(D) 是天文数字，任何单一 eval 的 V(R) 都低若干个数量级，所以总有大量行为在 eval 视野之外自由漂移，包括你不想要的那些。2025 年的多尺度扩展（Siegenfeld 与 Bar-Yam）把这一结论再收紧一档：只在「平均分」尺度上匹配的评测，在个例、尾部、子群的尺度上就失去约束力（Siegenfeld 与 Bar-Yam 2025，单篇新近结果）。推论直接可用：想更好地约束模型，你需要的不是一个更好的 eval，而是一组在多个尺度上多样性更高的 eval。这条线通往 <code>C03</code> 的多指标制衡。</p>` },

    { t: "sources", items: [
      `Ashby, W. R. (1956). <em>An Introduction to Cybernetics</em>, ch. 11.`,
      `Conant, R. C. & Ashby, W. R. (1970). "Every good regulator of a system must be a model of that system." <em>Int. J. Systems Science</em> 1(2):89–97.`,
      `Scholten, D. (2010). "A Primer for Conant and Ashby's Good-Regulator Theorem"（三重误读澄清）。`,
      `Siegenfeld & Bar-Yam (2025). <em>Entropy</em>（多尺度必要多样性）。深化见 <code>research/deep/D6</code> §5。`
    ] }
  ]
};
