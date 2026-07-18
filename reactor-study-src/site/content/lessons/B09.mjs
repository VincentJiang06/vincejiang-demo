export default {
  id: "B09",
  blocks: [
    { t: "prose", html: `
<p>「指标会失效」在前面的节点里是经验观察和寓言，在这一节变成定理。1991 年 Bengt Holmström 与 Paul Milgrom 的多任务委托代理模型证明了一个反直觉的结论，而且它与风险无关：当努力可以在任务间替代、且有的任务测不准时，对可测任务的强激励会主动把努力从不可测任务抽走，最优合约可能是零激励的固定工资。</p>` },

    { t: "module", module: "explorable:multitask", title: "多任务模型：一条关于固定工资的定理", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "设定", html: "代理人把努力分配到多个任务，成本取决于<em>总</em>努力（各任务在成本上互为替代）。有的任务信号好、易测量（产量），有的几乎不可测（质量）。" },
        { k: "02", t: "核心机制", html: "原文：if volume of output is easy to measure but the quality is not, then a system of piece rates for output may lead agents to increase the volume at the expense of quality. 给可测任务上强激励，等于抬高不可测任务的<strong>机会成本</strong>，努力从质量流向产量。" },
        { k: "03", t: "核心结果", html: "对任一任务的激励强度，<strong>取决于其他任务的可测性</strong>。极端情形下最优合约是<strong>付固定工资、零激励</strong>，<em>即使代理人风险中性</em>。even if risk neutral 这一句是关键：弱激励不是风险故事，是纯粹的跨任务错配。" },
        { k: "04", t: "推论", html: "「教师为什么拿固定工资」有了定理级答案：教学最重要的维度不可测，任何针对可测维度的强激励都会把努力从那里抽走。组织学处方由 Dewatripont、Jewitt 与 Tirole 2000 年补齐：按可测性<strong>打包岗位</strong>（task clustering），可测的归一岗配强激励，难测的归另一岗配平薪，别让同一个人同时背两类任务。" }
      ]
    } },

    { t: "callout", variant: "intuit", html: `
<p><strong>配套的等额补偿原理结论更强。</strong>如果两个任务的努力在成本上完全替代，理性代理人会把边际回报拉平；只要有一个任务的边际奖励为零（因为不可测），其他可替代任务的激励也必须为零，否则那个无薪任务会被彻底放弃。这就是「只奖励能测的那部分」往往比「什么都不奖励」更糟的原因。Holmström 2017 年的诺奖讲座亲自把这条线收束成一句：激励设计的核心不是「多测多奖」，而是让整个激励组合与你的真实目标对齐。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这是 reward misspecification 的经济学前身。</strong>你的模型就是那个多任务代理人，它的容量有限、可替代。给一个窄 eval 上强优化压力，等于抬高所有未被 eval 覆盖维度的机会成本，能力从那里被抽走（<code>Y02</code> 的「真实挤占」分量）。定理的处方直接可用：要么降低对单一 eval 的优化强度，要么用一组覆盖多维的 eval，别让单一窄指标承担全部优化压力。</p>` },

    { t: "sources", items: [
      `Holmström, B. & Milgrom, P. (1991). "Multitask Principal-Agent Analyses." <em>JLEO</em> 7:24–52.`,
      `Dewatripont, Jewitt & Tirole (2000). <em>European Economic Review</em> 44（task clustering）。`,
      `Holmström, B. (2017). "Pay for Performance and Beyond." <em>AER</em> 107(7)（诺奖讲座收束）。深化见 <code>research/deep/D6</code> §1。`
    ] }
  ]
};
