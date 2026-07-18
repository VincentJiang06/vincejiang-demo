export default {
  id: "B13",
  blocks: [
    { t: "prose", html: `
<p>优化者诅咒（optimizer's curse）是一个连「没人作弊、估计也无偏」时都成立的效应，Smith 与 Winkler 2006 年给了它干净的形式。设想你有很多候选（投资项目、模型变体、招聘对象），对每个的价值有无偏估计：估计 = 真值 + 均值为零的噪声。你理性地挑估计值最高的那个。结论是：你选中的那个，真值的期望必然低于它的估计值。候选越多、噪声越大，你选中的越可能是「运气好的高估」，而不是「真的最好」。</p>` },

    { t: "module", module: "sim:winners-curse", title: "选中的那个，真值期望低于它的估计值", config: {} },

    { t: "prose", html: `
<p>机制一句话：取最大值这个操作，专门偏爱正向噪声大的候选。估计里运气成分越大的，越容易排到最前而被选中，所以选择本身引入系统性的乐观偏差。它就是 <code>B08</code> 里 regressional Goodhart 的另一个名字，与拍卖里的赢者诅咒是近亲（赢者诅咒是多人竞价，优化者诅咒是单人从多选项择优）。一条出处考证：赢者诅咒不是行为经济学家 Thaler 提出的，概念源自 1971 年三位石油工程师 Capen、Clapp 与 Campbell 对墨西哥湾油田竞标的观察，中标者往往是最高估油田价值的公司；Thaler 1988 年是把它推广成经济学 anomaly 的通俗化者。</p>
<p>优化者诅咒是独立于反应性的第二条 eval 退化通道。反应性需要被测者作出回应，选择偏差不需要：即便被测者完全诚实、行为不变，按分数择优这一动作本身就会制造虚高。方法论推论跟着来：去年榜首今年跌，不需要任何反应性来解释，纯回归就够（Kahneman 反复强调的向均值回归误读）。想主张「榜首回落是 Goodhart」，先扣掉回归那部分。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>best-of-N 就是优化者诅咒的引擎。</strong>从 N 个 checkpoint 里挑 eval 分最高的、厂商从 N 个私测变体里只发布最高分的（<code>Y11</code> 的核心指控）、对一批 prompt 采样 N 次取最优，每一次都在放大正向噪声。修正有名字：贝叶斯收缩，对最高的估计打折，N 越大、噪声越大，折扣越大。2026 年这套统计学正式进了 LLM 评测：SIREN 协议（selection-aware repeated-split reporting）给出证据表明「报告榜首分数会乐观虚高、甚至改变部署结论」，并给出校正后的诚实区间（2026 年单篇新近结果）。贝叶斯收缩不是保守，而是对选择偏差的校正。</p>` },

    { t: "prose", html: `
<p>留一个问题：「榜首模型真实能力低于分数」这件事里，多少来自反应性（被评者回应），多少来自选择偏差（评者选优）？两条通道叠加，但目前没有任何框架能把它们分离并联合校正。D6 报告认为这是 eval 退化研究最缺的下一步。</p>` },

    { t: "sources", items: [
      `Smith, J. E. & Winkler, R. L. (2006). "The Optimizer's Curse." <em>Management Science</em> 52(3):311–322.`,
      `Capen, Clapp & Campbell (1971). "Competitive Bidding in High-Risk Situations." <em>J. Petroleum Technology</em> 23(6)（赢者诅咒真正的起点）。`,
      `Xu et al. (2026). "Towards Reliable LLM Evaluation: Correcting the Winner's Curse in Adaptive Benchmarking"（SIREN）。`,
      `深化见 <code>research/deep/D6</code> §6。`
    ] }
  ]
};
