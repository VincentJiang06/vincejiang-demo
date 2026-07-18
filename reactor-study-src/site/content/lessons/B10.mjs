export default {
  id: "B10",
  blocks: [
    { t: "prose", html: `
<p>Holmström-Milgrom 讲跨任务的扭曲，George Baker 1992 年补上任务内的那一半，并给出一个清晰的判据：什么才算好指标。直觉说「噪声小的指标好」，Baker 证明这是错的。好指标的判据不是噪声小，而是<strong>边际产出对齐</strong>：你的行动对指标的边际影响，要与你的行动对真实价值的边际影响高度相关（记作 ρ(P′, V′)）。</p>` },

    { t: "module", module: "explorable:distortion", title: "好指标的判据不是噪声，是对齐", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "两种缺陷是正交的", html: "一个指标有两种独立的缺陷：<strong>风险（噪声）</strong>，它随机波动；<strong>扭曲（错配）</strong>，它对行动的响应方式偏离真实价值的响应方式。Baker 证明扭曲会降低激励效率，<em>即使代理人风险中性</em>。失效与风险无关，是纯粹的对齐失败。Feltham 与 Xie 1994 年给这两个病灶起了正式名字：congruity 缺失（方向不对齐，扭曲努力配置）与 noise（压低努力强度），并证明它们各自独立起作用。" },
        { k: "02", t: "同一个指标，两种结论", html: "销售提成用「收入」，成本低且易测量。Firm A（销售只影响销量）：收入的边际产出 = 价值的边际产出，无扭曲，b=1，first-best。Firm B（销售还影响单位成本）：两者不再对齐，扭曲出现，b<1。<strong>同样的可测性，相反的结论。</strong>问题从来不是好不好测，是对不对齐。" },
        { k: "03", t: "gaming 的形式定义", html: "gaming = 利用那些「指标响应 > 价值响应」的状态。按专利计酬的科学家，会在容易的专利上投入过多，在难的专利上投入过少，因为那些状态里 P′>V′。最优对策：把激励强度<strong>压到 1 以下</strong>。「不要全力优化一个有偏的代理指标」成了最优合约的性质，不是道德劝告。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「平衡计分卡解决了多任务问题。」</strong>复核结论：Budde 2007 年在同一框架里证明，平衡计分卡只是把 congruity 问题从「单指标」搬到「指标向量的权重选择」。只要真实价值是高维隐含的，任何有限维加权指标组都存在残余的对齐缺口。多指标缓解问题，不消灭问题。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>判断一个 eval 好不好，别问它噪声大不大，问它对齐不对齐。</strong>低噪声、可复现、便宜的 benchmark，如果「模型行为对它的边际影响」与「对真实效用的边际影响」不对齐，依然是坏指标，而且低噪声反而会抬高你对它的信任。Baker 的处方反直觉但直接可用：对有偏的代理指标，最优做法是别全力优化它（b 压到 1 以下）。这正是 <code>Y07</code> 里「加 KL 缰绳」的经济学理由。</p>` },

    { t: "sources", items: [
      `Baker, G. (1992). "Incentive Contracts and Performance Measurement." <em>JPE</em> 100(3):598–614；Baker (2002). <em>JHR</em>。`,
      `Feltham & Xie (1994). <em>The Accounting Review</em> 69(3)（congruity × noise 命名）。`,
      `Budde, J. (2007). <em>J. Accounting Research</em> 45(3)（平衡计分卡的限度）。深化见 <code>research/deep/D6</code> §1。`
    ] }
  ]
};
