export default {
  id: "Y10",
  blocks: [
    { t: "prose", html: `
<p><strong>策略性分类（strategic classification）</strong>指的是：当你公布一个分类器的规则，被分类的人会照着规则改造自己，好被分到有利的一边。2016 年 Hardt、Megiddo、Papadimitriou 与 Wootters 提出这个框架，形式上是一个 Stackelberg 博弈（先行者先承诺策略，后行者观察后再最优响应）：你先承诺分类器，对方观察后付成本改特征。</p>
<p>你训练一个信用评分模型，公布了「多开几张信用卡加分」。理性的申请人就去多开卡，不是为了改善真实信用，而是为了操纵评分。分类器一旦公开，输入分布就朝「骗过分类器」的方向移动。这是把 Goodhart 放进博弈：被测者是有策略的对手。</p>` },

    { t: "module", module: "explorable:strategic-clf", title: "公布规则，人就照着改自己", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "设定", html: "分类器 f 公开。每个个体有真实特征 x 和操纵预算，只要改动成本低于「被分到好一边」的收益，就把 x 改成 x'。分类器面对的不再是固定分布，是<strong>会回应它</strong>的分布。" },
        { k: "02", t: "gaming vs improvement", html: "关键区分：有些改动是 <strong>gaming</strong>（只改信号不改实质，多开卡刷分），有些是 <strong>improvement</strong>（真的变好，还清欠款）。同一个分类器可能激励前者也可能激励后者，取决于你选哪些特征当依据。" },
        { k: "03", t: "定理：防博弈必须做因果建模", html: "Miller、Milli 与 Hardt 2020 年证明的硬结果，原文：<em>any procedure for designing classifiers that incentivize improvement must inevitably solve a non-trivial causal inference problem</em>。想设计一个诱导真改进而非刷分的评估机制，就不可避免要解一个因果推断问题：哪些特征<strong>因果地</strong>决定真实结果。分不清 gaming 与 improvement，等价于不知道特征到结果的因果结构。" },
        { k: "04", t: "两条工程出路 + 一条公平警告", html: "出路一（Shavit 等）：把评估当一连串因果干预，主动测试一系列决策规则、观察响应，从数据里识别因果系数。出路二（Bechavod 等，反直觉）：agent 的 gaming 行为本身泄漏因果信息，反而帮你学到真机制。公平警告（Milli 等）：为防 gaming 把门槛抬到 Stackelberg 最优，成本必然转嫁给被分类者，且弱势群体（改特征成本更高的人）承担更多。<strong>防博弈的收紧是累退的：成本负担更多落在改特征代价最高的人身上。</strong>" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「strategic classification 就是对抗鲁棒性。」</strong>复核结论：数学相近，语义相反。对抗样本是恶意扰动、不改真实标签；strategic agent 是理性自利、可能真的改结果。把二者等同，会错过 gaming 与 improvement 的全部要害。另一条边界：经典理论假设完全理性、成本已知的 agent，2025 年之后用 LLM 模拟真实策略响应的研究发现，有限理性 agent 的行为与经典模型定性不同，而被评测的模型能直接读取评测规则并据此推理，这是经典模型未涵盖的情形。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你一旦公开 eval 的评分标准，模型开发就变成策略性分类。</strong>公开的评分细则（rubric）、公开的 benchmark 构成，等于把分类器规则交给对手，优化循环会朝「满足 rubric 表面」移动。Miller-Milli-Hardt 定理告诉你这不是加防伪补丁能解决的：想让 eval 激励真改进，你必须知道哪些可测行为因果地通向真实能力，这本身是个研究问题。工程上最接近的做法是 Shavit 式的干预循环：改变 eval 的构成，观察生态怎么响应，用响应反推因果结构。<code>C03/C04</code> 会把这条原则做成设计清单。</p>` },

    { t: "sources", items: [
      `Hardt, Megiddo, Papadimitriou & Wootters (2016). "Strategic Classification." ITCS.`,
      `Miller, Milli & Hardt (2020). "Strategic Classification Is Causal Modeling in Disguise." ICML（核心定理）。`,
      `Milli et al. (2019). "The Social Cost of Strategic Classification." FAT*（累退警告）；Shavit et al. (2020)；Bechavod et al. (2021)。`,
      `有限理性 agent 的策略响应（2025 起，LLM 模拟）：见 <code>research/deep/D6</code> §3「2024–2026 最新进展」。`,
      `深化见 <code>research/deep/D6</code> §3。`
    ] }
  ]
};
