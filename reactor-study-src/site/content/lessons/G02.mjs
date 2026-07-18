export default {
  id: "G02",
  blocks: [
    { t: "prose", html: `
<p>如果只让你从这门课带走一条可操作的原则，是这一条：把测量和奖惩解耦，让指标只用来看趋势、做诊断，不直接挂钩利益。它有两位精神教父，来自质量管理和控制论。</p>` },

    { t: "module", module: "explorable:posiwid", title: "解耦：Deming 与 POSIWID", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "Deming：废除数字定额", html: "质量管理之父 W. Edwards Deming 的《Out of the Crisis》十四要点里直接写着「废除数字定额」和「消除恐惧」。他的红珠实验、漏斗实验都在演示：给一个受随机波动主导的系统设数字目标、按目标奖惩，只会制造恐惧和造假，摧毁对质量本身的关注。用 eval 分驱动 skill 迭代，是 1950 年代工厂用定额管工人的数字版。" },
        { k: "02", t: "两处方向相反的误引", html: "Deming 常被引「最重要的数字是未知且不可知的」，这句其实是他<strong>转引 Lloyd Nelson</strong>。而「不能度量就不能管理」常被<em>安到</em>他头上，恰恰相反，他把这句列为要破除的谬误，《The New Economics》里的原话是：认为不能测量就不能管理，是一个<strong>代价高昂的迷思</strong>。两处讹传，方向正好相反。" },
        { k: "03", t: "POSIWID（Stafford Beer）", html: "控制论家 Stafford Beer：一个系统的目的，就是它<em>实际所做的</em>（the purpose of a system is what it does），不是它宣称的意图。考证结论：这个<strong>短语确实是 Beer 的</strong>（本课程原先怀疑它是讹传，复核后予以更正），只有 POSIWID 这个缩写是后人定型的。当一个 eval 驱动的流程被博弈、实际所为背离宣称目的时，它逼你直面：这套流程真实在生产的，是绿灯，还是好产品？" },
        { k: "04", t: "解耦的处方：探针，不是仪表盘", html: "把两条合起来：<strong>eval 只做诊断，不直接驱动优化</strong>。Carter 1991 年给了这条最好的比喻：指标应当是<strong>开罐器（tin opener）</strong>，用来撬开问题、触发追问；而不是<strong>仪表盘（dial）</strong>，读数直接驱动方向盘。一旦挂钩，Goodhart 就上线。附一条自省：Shirky 原则（Kevin Kelly 2010 命名）提醒你，连 eval 基础设施本身都可能变成既得利益者，努力保存它所解决的那个问题。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>但解耦不是万灵药，它自己也会退化。</strong>Klein 2025 年对英国 NHS 的实证记录了一个诚实的失败模式：本意作为探针的指标，在制度压力下逐渐退化成仪表盘，因为「看看就好」的指标一旦进了年度考核，就自动变回了 dial。这与 <code>D7</code> 的一般结论一致：抗博弈手段自身会被 Goodhart，解耦是需要持续维护的制度纪律，不是一次性设计。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>这直接解释了你那次经历。</strong>你把 skill 迭代直接挂在 eval 上，于是 skill 优化的方向变成「让 eval 读数变绿」：尺子没变长，是被量的东西学会了踮脚。处方是把两件事拆开，用 eval 诊断「哪里可能有问题」，再用人的判断决定改什么、怎么改；并定期问一句 POSIWID 式的问题，我这套 eval 流程现在实际在生产什么。如果答案是绿灯，它就已经不是你的工具了。维护纪律的具体做法在 <code>C07</code>。</p>` },

    { t: "sources", items: [
      `Deming, W. E. <em>Out of the Crisis</em> (1982); <em>The New Economics</em> (1993)（"costly myth" 原话）。`,
      `Beer, S. <em>The Heart of Enterprise</em> (1979)（POSIWID 短语确为其所述）。`,
      `Carter, N. (1991). "Learning to Measure Performance: The Use of Indicators in Organizations." <em>Public Administration</em>（tin openers vs dials 出处）。`,
      `Shirky 原则 — Kelly (2010)。深化与订正见 <code>research/deep/D7</code> §4。`
    ] }
  ]
};
