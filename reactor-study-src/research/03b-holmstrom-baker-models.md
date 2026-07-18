# 附录 03b：绩效测量扭曲的两大形式模型（子代理原始报告，英文）

> 本文件是精读子代理的原始输出（两篇论文均整篇读完，引文为逐字摘录）。
> 一句话总结：Goodhart 定律在这两篇论文里**是定理而不是格言**——
> 且失效的根源不是风险/噪声，而是纯粹的对齐失败（misalignment），
> 在代理人风险中性时依然成立。

## PART 1 — Holmström & Milgrom (1991), the Multitask Model

- **Title:** "Multitask Principal-Agent Analyses: Incentive Contracts, Asset Ownership, and Job Design"
- *Journal of Law, Economics, & Organization*, Vol. 7, Special Issue, pp. 24–52. DOI: 10.1093/jleo/7.special_issue.24. JSTOR: https://www.jstor.org/stable/764957

### Setup
Agent supplies effort vector t = (t₁,…,tₘ)；成本取决于总努力 C(t₁+…+tₘ)——这是承重假设：它使各任务的努力在成本上互为替代，"an increase in an agent's compensation in any one task will cause some reallocation of attention away from other tasks" (p.26)。有的任务信号好（x = tᵢ + ε），有的不可测（σ² → ∞）。

> "when there are multiple tasks, incentive pay serves not only to allocate risks and to motivate hard work, it also serves to direct the allocation of the agents' attention among their various duties." (p.25)

### 机制
> "if volume of output is easy to measure but the quality is not, then a system of piece rates for output may lead agents to increase the volume of output at the expense of quality." (p.25)

最优激励向量 α = (I + r[C_ij]Σ)⁻¹ B′ (eq.5, p.31)。教师案例（基础技能可测、高阶思维不可测，eq.7, p.32）：

> "when inputs are substitutes, incentives for any given activity tᵢ can be provided either by rewarding that activity or by reducing its opportunity cost (by reducing the incentives for the other activities). Here, t₂ cannot be measured at all, so the only way to provide incentives for t₂ is to reduce α₁" (p.32–33).

### 核心结果
> "the desirability of providing incentives for any one activity **decreases with the difficulty of measuring performance in any other activities** that make competing demands on the agent's time and attention." (p.26)

**Proposition 1 (p.34):** "the efficient linear compensation rule pays a fixed wage and contains no incentive component (α = 0), **even if the contractor is risk neutral**."
—— 风险中性下平薪仍最优：弱激励不是风险故事，是跨任务错配故事。

### Equal compensation principle
完全替代时激励约束强制 α₁ = α₂；若任务 2 不可测（激励为 0），则所有可替代任务的激励都必须为 0，否则无薪任务被彻底放弃 (p.33)。该名称由 Milgrom & Roberts (1992) 教科书 *Economics, Organization and Management* 提出（1991 论文原文无此短语）。

### 应用
- 教师/公务员平薪的正式辩护 (p.24–25)
- 质量不可测时不用计件工资；"piece-rate schemes may be especially dysfunctional in large hierarchies" (p.34)
- **工作设计按可测性打包** (p.27)：可测任务集中给一人配强激励，难测任务集中给另一人配平薪
- 资产所有权理论雏形：特许经营 vs 直营店经理 (p.26–27)
- "Constraints are substitutes for performance incentives." (p.27)

## PART 2 — Baker (1992), Performance Measurement and Distortion

- **Title:** "Incentive Contracts and Performance Measurement"
- *Journal of Political Economy*, Vol. 100, No. 3, pp. 598–614. DOI: 10.1086/261831. JSTOR: https://www.jstor.org/stable/2138733

### Setup 与核心区分
委托人真实目标 V(e, ε) **不可缔约**；合约只能写在绩效测量 P(e, ε) 上：payoff = S + bP。代理人先观察状态 ε 再行动——计件率是在"告诉代理人做什么"，且说得不准。

> "contracts based on such performance measures will not in general provide first-best incentives, **even when the agent is risk neutral**." (abstract, p.598)

### 核心结果——对齐而非噪声
好指标的判据是 **边际产出的相关性** ρ(Pₑ, Vₑ)，不是 P 与 V 的相关性：

> **b\* = [COV(Vₑ, Pₑ) + 1] / [var(Pₑ) + 1]** (eq.8, p.605)

> "value could be much more variable than the performance measure … **as long as these factors do not affect the optimal actions of the agent**… any performance measure that responds to an employee's actions in exactly the same way that value responds to these actions can be used to write a first-best incentive contract for a risk-neutral agent." (p.605)

> "The question is not whether performance is easy to measure, but rather whether the available performance measure (in this case revenue) accurately reflects the firm's objective and is thus a good measure." (p.610)

### Distortion vs risk
> "the agent is not averse to variations in income but is averse to variations in effort … the contract based on P gives the agent inaccurate information about how hard to work." (p.606)

### 应用
- **Gaming 的正式定义 (p.609)：** 专利计酬的研发科学家 "work too hard on the easy ones and not hard enough on the hard ones. To reduce the amount of gaming that the scientist does, the firm reduces the piece rate." Gaming = 利用 Pₑ > Vₑ 的状态。
- **销售提成 Firm A vs Firm B (p.610–611)：** 同一个便宜指标（收入），一家无扭曲（b=1 first-best），一家扭曲——可测性相同、对齐度不同。
- **相对绩效评估 (p.611)：** P = V − R 仅当 Rₑ = 0 时无扭曲。
- Baker 對現象的定义 (p.600)：actions "that increase payouts from the incentive contract without improving actual performance" —— Goodhart 定律的比较静态版。

### Baker (2002)
"Distortion and Risk in Optimal Incentive Contracts," *Journal of Human Resources* 37(4): 728–751. DOI: 10.2307/3069615。把指标缺陷干净地分解为 **risk（噪声）** 与 **distortion（错配）** 两个正交分量，两者进入最优合约的方式不同。

## Synthesis

两篇论文互引且等价：Baker 的状态依存行动模型 ≡ HM 的向量努力模型（Baker p.603 fn6；HM p.34 fn11）。

- **Holmström–Milgrom：跨任务的扭曲**——可测任务的强激励把可替代努力从未测任务抽走；最优对策是弱化激励或按可测性重新打包工作。
- **Baker：任务内跨状态的扭曲**——指标的边际响应偏离价值的边际响应；最优对策是把计件率压到 1 以下。
- 共同的非平凡结论：**失效与风险无关**，在风险中性下依然成立，是"你能支付的对象"与"你真正想要的东西"之间的纯对齐失败。

## Source URLs
- HM 1991 全文: https://people.duke.edu/~qc2/BA532/1991%20JLEO%20Holmstrom%20Milgrom.pdf 或 https://www.sfu.ca/~allen/HolmstromMilgrom.pdf
- Baker 1992 全文: https://www.edegan.com/pdfs/Baker%20(1992)%20-%20Incentive%20Contracts%20and%20Performance%20Measurement.pdf
- Baker 2002: https://econpapers.repec.org/RePEc:uwp:jhriss:v:37:y:2002:i:4:p:728-751
