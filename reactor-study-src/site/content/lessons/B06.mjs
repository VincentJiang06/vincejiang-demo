export default {
  id: "B06",
  blocks: [
    { t: "prose", html: `
<p>1975 年，组织行为学家 Steven Kerr 写了一篇标题就是全部论点的论文：《On the Folly of Rewarding A, While Hoping for B》，奖励 A 却指望得到 B 的愚行。它是 Goodhart 定律在组织与激励设计中的对应命题。</p>
<p>他的观察是：奖励系统常常付钱奖励一种行为（A，容易测量、容易兑付的那个），却指望员工去做另一种行为（B，真正想要的那个）。理性的人当然做被奖励的 A，不做被指望的 B。</p>` },

    { t: "module", module: "explorable:reward-b-prime", title: "你奖励的 A，和你指望的 B", config: {
      mode: "matrix",
      cols: ["你嘴上希望的 B", "你实际奖励的 A", "于是你得到"],
      rows: [
        { h: "大学", cells: ["老师教得好", "论文发得多", "教学被科研挤到边缘"] },
        { h: "医疗", cells: ["医生做正确的判断", "不出「把病人误判为健康」的错(Type 2)", "过度检查、过度干预(宁可误判为病)"] },
        { h: "越战", cells: ["士兵完成任务", "服从命令的表面证据", "「搜索并回避」、甚至 fragging"] },
        { h: "企业", cells: ["长期、协作、创新", "短期可量化的个人业绩(MBO)", "短视、抢功、不投长期"] }
      ],
      note: "每一行是同一个结构：想要的 B 难测、未被奖励；易测的 A 被奖励，于是挤占 B。"
    } },

    { t: "prose", html: `
<p>Kerr 的清单里最经典的是大学：社会希望教授不荒废教学，却几乎只奖励论文发表，于是理性的教授把精力投向发表。不是因为他们坏，而是奖励结构就这么设的。医生的例子更微妙：社会对「把病人误判为健康」（漏诊）的惩罚远重于「把健康人误判为病」（过诊），于是理性的医生倾向过度检查、过度干预。</p>
<p>二十多年后，Gibbons 1998 年在《Journal of Economic Perspectives》的综述把 Kerr 的清单接上了严格的经济学：多任务委托代理理论证明：只要 B 难测、A 可测，且两项任务的努力在成本上互为替代，对 A 的高强度激励就会把努力从 B 抽走。这不是管理失误，是可以从一阶条件推出来的均衡（数学在 <code>B09</code>）。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的优化器就是那个理性的员工。</strong>它不怀恶意，只是忠实地做被奖励的 A，而不是你心里指望的 B。你指望「有用的 agent」，但 reward 和 eval 实际奖励的是「eval 通过」，于是你得到一个精通 eval、在真实任务上平庸的模型。Kerr 的结论是：系统交付的是它奖励的行为，不是它指望的行为。当事人为何往往意识不到 A 与 B 已经脱钩，见 <code>B07</code> 的 surrogation。</p>` },

    { t: "sources", items: [
      `Kerr, S. (1975). "On the Folly of Rewarding A, While Hoping for B." <em>Academy of Management Journal</em> 18(4):769–783.`,
      `Gibbons, R. (1998). "Incentives in Organizations." <em>JEP</em> 12(4):115–132（经济学收束）。`,
      `见 <code>research/03c</code> 与 <code>research/deep/D2</code> §6。`
    ] }
  ]
};
