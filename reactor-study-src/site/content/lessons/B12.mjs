export default {
  id: "B12",
  blocks: [
    { t: "prose", html: `
<p>委托代理问题给整条蓝色分支提供骨架。所有「指标失效」的故事，底下是同一个结构：一方（委托人 principal）想要某样东西，另一方（代理人 agent）替他去做，而两者目标不一致、信息不对称。指标就是委托人用来穿透不对称的探照灯，但它一旦点亮，就会被博弈。</p>` },

    { t: "module", module: "explorable:principal-agent", title: "委托代理：目标不一致、信息不对称，与两条制度出路", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "两种信息不对称", html: "<strong>道德风险（moral hazard）</strong>= 隐藏<em>行动</em>：委托人无法观测代理人是否付出努力，只能看到含运气的结果。<strong>逆向选择（adverse selection）</strong>= 隐藏<em>类型</em>：委托人事先不知道代理人属于哪种类型（Akerlof 的柠檬市场）。" },
        { k: "02", t: "informativeness principle", html: "Holmström 1979：一个信号值不值得写进合约，取决于它对「代理人是否努力」提供多少<em>增量信息</em>。注意常见误读：这条原则不是「能测就该纳入激励」，恰恰相反，一个对不可测维度毫无信息、却对可测维度高度敏感的信号，纳入合同反而有害。" },
        { k: "03", t: "坏指标的两个正交病灶", html: "Feltham 与 Xie 1994 年给出干净分解：指标与真实价值向量<strong>方向不对齐</strong>（congruity 缺失）导致努力被分配到错的任务；指标<strong>噪声</strong>导致努力强度被压低。一个指标被 Goodhart 的程度 = 它的 congruity 缺口 × 激励强度。加权综合指标之所以危险，正因为调任何权重都在改变整个向量的方向，几乎不可能与高维真实价值对齐。" },
        { k: "04", t: "两条制度出路", html: "其一，<strong>主观测量</strong>：Baker、Gibbons 与 Murphy 1994 年证明，当所有可量化指标都会被博弈，引入依赖声誉自我执行的上级判断能改善合约。其二，<strong>策略性不透明</strong>：Ederer、Holden 与 Meyer 2018 年证明，当代理人能看到考核规则并据此把投入集中到被考核的维度，委托人的最优反应常是故意不公布各维度权重，逼代理人均衡投入。保密不是管理上的怠惰，而是可从一阶条件推出的最优机制。" }
      ]
    } },

    { t: "callout", variant: "applied", html: `
<p><strong>你和你的优化器，就是一对委托代理。</strong>你想要「好用的 agent」，优化循环想要「eval 通过」。信息不对称在于：你无法直接观测「真的有用」，只能观测代理指标，而优化器有远比你充分的信息去专门满足指标的表面要求。对齐之所以难，是因为它本质上是个几十年历史的委托代理问题，只是代理人这次是优化器。两条制度出路都有 AI 对应物：主观测量对应人类专家盲评兜底，策略性不透明对应 held-out eval 与随机轮换（<code>C03</code>）。开放问题也一并继承：当「上级判断」本身被 LLM 评审替代，靠声誉自我执行的主观测量还成立吗？</p>` },

    { t: "sources", items: [
      `Holmström, B. (1979). "Moral Hazard and Observability." <em>Bell J. of Economics</em>；Ross (1973)；Jensen & Meckling (1976)。`,
      `Feltham, G. A. & Xie, J. (1994). <em>The Accounting Review</em> 69(3):429–453（congruity × noise 分解）。`,
      `Baker, Gibbons & Murphy (1994). <em>QJE</em> 109(4)（主观测量）；Ederer, Holden & Meyer (2018). <em>RAND</em>（策略性不透明）。`,
      `深化见 <code>research/deep/D6</code> §1 与 <code>research/deep/D2</code> §6。`
    ] }
  ]
};
