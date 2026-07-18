export default {
  id: "R09",
  blocks: [
    { t: "prose", html: `
<p>1980 年代以来，审计从财务领域溢出，蔓延到几乎一切：医疗审计、环境审计、质量审计、教学审计。Michael Power 把这叫审计爆炸（audit explosion），他 1997 年那本书被引超过 1.3 万次，副标题是 <em>Rituals of Verification</em>：核验的仪式。</p>
<p>核心洞见：在这场爆炸里，组织开始重塑自己以变得「可审计」（making things auditable）。审计生产的与其说是实质保证，不如说是合法性叙事和一种安心感。审计的规范期望与它的操作能力「不安地共存」，而可审计性逐渐取代了实质。</p>` },

    { t: "module", module: "explorable:auditability", title: "逐层加审计，会发生什么", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "审计爆炸", html: "财务审计之外，医疗/环境/质量/教学审计层出不穷。Power 的判断是，「让一切可审计」已成为现代治理的默认动作。根源是问责的政治诉求，不是效率。" },
        { k: "02", t: "making things auditable", html: "为迎合审计的凝视，组织长出<strong>合规部门、文档系统、指标体系</strong>。真正的工作被「生产可审计的证据」挤占：大学为科研评估（RAE/REF）重排内部结构、生产大批合规文档。" },
        { k: "03", t: "operational–normative gap", html: "审计<em>实际能提供的保证</em>与它<em>承诺的保证</em>之间有一道裂缝，两者不安地共存。仪式做足了，实质未必在。" },
        { k: "04", t: "可审计性取代实质", html: "可测的代理指标压过真正想保障的东西。审计的凝视<strong>塑造</strong>被审计对象：组织变成「为了通过审计而存在」的样子。2026 年 Kongsgaard 的街头官僚研究记录了另一面：一线机构自建「秘密电子表格」，把真实工作和上报指标分成两本账。" }
      ]
    } },

    { t: "prose", html: `
<p>Power 本人做过自我修正：2000 与 2003 年的回顾里他承认早期论述过于悲观、过于功能主义，呼吁看审计的在地变异；2022 年他与合作者转向研究「会计如何自我瓦解、终结」，给「审计只会扩张」的叙事补了反向一笔。人类学一侧由 Shore 与 Wright 接棒：1999 年提出 audit culture 概念，2015 年在《Current Anthropology》把排名与评级正式并入审计文化，2024 年收束成专著《Audit Culture: How Indicators and Rankings are Reshaping the World》。这条线是「审计社会」与「排名反应性」两大文献的枢纽。</p>
<p>顺带一笔考证：本课程反复出现的名言 "When a measure becomes a target, it ceases to be a good measure"，正是 Marilyn Strathern 在分析英国大学审计文化的 1997 年论文里写定并使之流传的（她自己追溯给 Hoskin 1996）。它诞生于审计社会的语境，不是 Goodhart 的货币经济学原文，考证细节在 <code>B01</code>。名言本身也经历了一次审计社会式的命运：可传播性取代了原意。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>安全审计、red-team 报告、model card、合规评估，生产的可能是安心感而不是实质安全。</strong>这是审计社会对 AI 治理最尖锐的提问。当组织为了通过 eval 而重塑自己变得可审计，可测的代理指标就会压过真正想保障的东西。你的模型正在长成「能通过安全评估的样子」，而这未必等于安全。Power 的对策方向也适用：把审计当探针（触发追问），别当仪表盘（直接驱动决策），细节在 <code>C05</code>。</p>` },

    { t: "prose", html: `
<p>留一个问题：审计文化的反效果证据大多是案例式的。有没有审计真正改善了结果的稳健证据？D1 报告把它列为本线尚未补齐的反方证据：并非所有问责都退化，缺的是边界条件。</p>` },

    { t: "sources", items: [
      `Power, M. (1997). <em>The Audit Society: Rituals of Verification</em>. Oxford UP；(2000; 2003) 自我修正两篇。`,
      `Shore, C. & Wright, S. (2015). "Audit Culture Revisited." <em>Current Anthropology</em> 56(3)；(2024) <em>Audit Culture</em>. Pluto Press.`,
      `Strathern, M. (1997). "'Improving ratings': audit in the British University system." <em>European Review</em> 5(3):305–321.`,
      `Kongsgaard, L. T. (2026). "Outnumbered." <em>PAR</em>（秘密电子表格）。深化见 <code>research/deep/D1</code> §5。`
    ] }
  ]
};
