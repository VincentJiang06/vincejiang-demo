export default {
  id: "B02",
  blocks: [
    { t: "prose", html: `
<p>Campbell 定律是这个家族里社会科学的一支，来自教育测试与社会项目评估的田野。Donald Campbell 的表述比 Goodhart 多说了一层，强调腐蚀的必然性：</p>
<p class="pullquote">"The more any quantitative social indicator is used for social decision-making, the more subject it will be to corruption pressures and the more apt it will be to distort and corrupt the social processes it is intended to monitor."<span class="src">Campbell, 1976/1979</span></p>
<p>指标不只是失效，它还会反过来腐蚀它本要监测的过程本身。测高考分，不只是分数失去意义，教育本身被应试改造了。原始例子就是标准化测试的应试化与警务犯罪统计的操纵，两者后来都有了成规模的实证（见 <code>K00</code> 案例库：Atlanta 改卷案、CompStat 降级）。</p>` },

    { t: "module", module: "explorable:corruption-pressure", title: "Campbell 的张力：他既提出腐蚀定律，也主张实验社会", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "定律本身", html: "指标越被用于高利害的社会决策，越容易受腐蚀压力，也越会扭曲它本要监测的过程。原始例子：标准化测试的应试化、警务犯罪统计的操纵。" },
        { k: "02", t: "关键张力", html: "定律常被读成反对量化。原文立场相反：他是「实验社会（experimenting society）」最有力的倡导者，主张用严格的实地实验改进社会政策。提出定律的人，正是最相信测量的人。" },
        { k: "03", t: "为什么重要", html: "这个张力划定了本枝的批判边界：批判指标不等于反对测量。目标不是废除尺子，而是知道哪把尺子在什么条件下会腐蚀它所测的东西。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>三处考证。</strong>其一，"Campbell 1976"与"Campbell 1979"是同一文本：1974 年会议宣读，1975 年入 Dartmouth 文集，1976 年西密歇根大学以 Occasional Paper #8 重印，1979 年才在《Evaluation and Program Planning》正式刊出，措辞一致。两个年份指同一段话，不是两个命题。其二，"Campbell's law"不是他自己起的名，引用时宜写「后来被称为 Campbell 定律的腐蚀命题」。其三，「中国科举导致八股文」的例子是后人附会，不在原文里。另按 Rodamar 2018 年的梳理：Campbell 的核心思想 1969 年已见于 "Reforms as Experiments"，在「社会指标腐蚀」这个主题上，他的优先权强于 Goodhart。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的 eval 不只是会失准，它会腐蚀你的开发过程。</strong>这是 Campbell 比 Goodhart 更进一层的地方。当一个 benchmark 分数成为团队的高利害目标，它不只是分数虚高：研究方向、数据配比、模型选择的整个过程都会被它扭曲，迎合可测的那一小块，牺牲不可测却更重要的能力。测量腐蚀的不是数字，是造数字的人的判断力。2026 年 OpenAI 弃用 SWE-bench Verified 的复盘（<code>Y03</code>）就是这条定律的工业级现场。</p>` },

    { t: "sources", items: [
      `Campbell, D. T. (1979). "Assessing the impact of planned social change." <em>Evaluation and Program Planning</em> 2(1):67–90（=1976 Occasional Paper #8）。`,
      `Rodamar, J. (2018). "There ought to be a law! Campbell versus Goodhart." <em>Significance</em>（优先权梳理）。`,
      `出版考据见 <code>research/deep/D2</code> §3。`
    ] }
  ]
};
