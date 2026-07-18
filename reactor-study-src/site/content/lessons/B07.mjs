export default {
  id: "B07",
  blocks: [
    { t: "prose", html: `
<p><strong>surrogation（代理指标替代）</strong>指人们把衡量战略的指标当成战略本身。管理会计学者 Choi、Hecht 与 Tayler 2012 年给出定义：人们 "act as though the measures are the construct of interest"。指标本来只是构念的代理，却在人脑中悄悄替换了构念。</p>
<p>它填的是前几节留下的心理学缺口：Goodhart、Campbell、Kerr 讲的博弈里，当事人多数并不认为自己在规避规则，一个认真的人可以心安理得地追逐一个明知失真的指标。</p>` },

    { t: "module", module: "explorable:attribute-substitution", title: "指标如何在你脑中替换掉目标", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "认知机制：属性替代", html: "Kahneman 与 Frederick 的属性替代：面对难评估的目标属性（抽象的「战略」「质量」「能力」），人会无意识地用容易评估的属性（具体的指标数字）替代，然后<strong>回答那个更容易的问题</strong>。surrogation 就是这个替代用在「战略 vs 指标」上。" },
        { k: "02", t: "关键实验发现", html: "把<strong>激励和单一指标</strong>挂钩，会显著<em>加剧</em> surrogation：付钱让你盯一个数字，你就越容易把它当成目标本身。<strong>多个指标</strong>并用能缓解，几个数字在暗示「没有哪一个就是战略」。" },
        { k: "03", t: "现实代价：Wells Fargo", html: "「交叉销售数」本是「长期客户关系」的代理。当它成为被激励的单一目标，员工脑中它<em>就是</em>目标，于是开了约 350 万个未授权账户，摧毁了它本要建立的客户关系。指标替换了构念。" }
      ]
    } },

    { t: "callout", variant: "intuit", html: `
<p><strong>surrogation 是 Goodhart 的心理学地基。</strong>Goodhart 描述系统层面的后果（指标一旦成为目标就崩坏），surrogation 解释个体层面的原因（当事人为什么不觉得自己在作弊）。一旦替代在认知上完成，优化指标而牺牲真实目标，对当事人来说不像作弊，像在努力工作。这就是最真诚的人同样会落入其中的原因。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你盯着 eval 分数看得越久，越容易对它发生 surrogation。</strong>当「提高 benchmark 分」在团队日常里反复出现、还连着 KPI，它就会在集体认知里替换掉「造一个真正有用的模型」。缓解处方来自同一组实验：别用单一指标加激励，用一组互相制衡的指标，让任何一个数字都冒充不了目标本身。这是 <code>C03 抗博弈设计</code>的核心原则之一。</p>` },

    { t: "sources", items: [
      `Choi, J., Hecht, G. & Tayler, W. B. (2012). "Lost in Translation: The Effects of Incentive Compensation on Strategy Surrogation." <em>The Accounting Review</em> 87(4):1135–1163.`,
      `Harris & Tayler (2019). <em>HBR</em>（Wells Fargo 案）。见 <code>research/03c, 12</code>。`
    ] }
  ]
};
