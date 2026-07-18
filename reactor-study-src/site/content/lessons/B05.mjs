export default {
  id: "B05",
  blocks: [
    { t: "prose", html: `
<p>McNamara 谬误（McNamara fallacy）指一条四步滑坡：从「先测容易测的」开始，滑到「测不了的不存在」为止。名字来自越战期间的美国国防部长 Robert McNamara。他从福特汽车带来系统分析方法，面对一场没有战线的战争，选了尸体计数（body count）做进展指标：敌方死亡人数、杀伤比，可测、可汇报、每天有数字。前线各级系统性地虚报这些数字，而无法量化的维度（乡村政治情绪、民心向背）则被排除在视野之外。</p>` },

    { t: "module", module: "provenance:mcnamara", title: "四步谬误，和它真正的作者", config: {
      hint: "翻卡：最有名的那段引文，其实不是 McNamara 说的。",
      cards: [
        { frontTag: "四步谬误 · 第一步", front: "「先测量能轻易测量的。」这一步没问题。",
          backTag: "后三步的滑落", back: "第二步：无视测不了的，或给它一个随意的量值（人为、误导）。第三步：假定测不了的不重要（这是盲目）。第四步：断言测不了的不存在（这是自杀）。" },
        { frontTag: "问：这段话谁写的？", front: "这段四步引文是 McNamara 本人说的吗？",
          backTag: "档案 · 真正的作者", back: "<strong>不是。</strong>它出自民意研究者 <strong>Daniel Yankelovich 1971 年的演讲</strong>（The New Odds）。Charles Handy 1994 年在书里把它误归给 McNamara（还拼错了名字），这段引文才和他绑定流传。谬误以他命名，是因为他<em>示范</em>了这套失败模式，不是因为他写了这段话。" },
        { frontTag: "越战语境", front: "body count 真的失灵了吗？",
          backTag: "档案 · 属实", back: "属实。没有战线的反叛乱战争里，进展只能靠代理指标；body count 被逐级灌水上报，制造出「我们在赢」的幻觉，而真正决定战争走向、无法量化的政治维度被排除在视野之外。McNamara 谬误是可通约化（把异质事物压进同一把尺子）加 Goodhart 的战场版。" }
      ]
    } },

    { t: "callout", variant: "applied", html: `
<p><strong>「测不了的就当它不存在」，这是 eval 覆盖之外的能力被系统性无视的方式。</strong>你的 agent 有很多重要品质测不了：长程后果、恰当的克制、在该停手时停手。于是第三步「它们不重要」、第四步「它们不存在」悄悄发生。McNamara 谬误的提醒只有一句：一个能力有没有被你的 eval 覆盖，和它重不重要，是两件相互独立的事。</p>` },

    { t: "sources", items: [
      `Yankelovich, D. (1971). "The New Odds"（四步引文原始出处）。`,
      `Handy, C. (1994). <em>The Empty Raincoat</em>（误归来源）。`,
      `考证见 <code>research/03c</code> 与 <code>research/deep/D2</code> §9。`
    ] }
  ]
};
