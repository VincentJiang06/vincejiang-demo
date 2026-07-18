export default {
  id: "R04",
  blocks: [
    { t: "prose", html: `
<p>新制度主义有一个著名预言：组织会把「给外界看的仪式性合规」与「实际运作」脱耦（decouple），学校尤其擅长。照这个预言，排名来袭时法学院本该轻松缓冲掉它。Sauder 与 Espeland 2009 年发现的恰恰相反：出现了紧耦合。连最鄙视排名的精英都无法忽视它，Yale 院长斥之为 "idiot poll"，Harvard 院长称其 "Mickey Mouse"，鄙视之余仍然紧盯名次。</p>
<p>缓冲失败的原因，他们借 Foucault 来解释：排名是一种规训权力（disciplinary power），原文引 "discipline is an art of rank"。它不靠强制，靠让组织持续可见来运作。</p>` },

    { t: "module", module: "explorable:discipline", title: "排名如何规训：三重机制", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "监视 Surveillance", html: "三种可见性叠加：<strong>连续</strong>（年度发榜被编排成媒体事件，「五秒钟全校皆知」）；<strong>细节</strong>（院长开始追问哪笔钱能算进 instructional budget，原文称之为 a political anatomy of detail）；<strong>远距</strong>（分散、外行的受众都能看到法学院内部，实现 governing at a distance）。就业主任为追回失联毕业生，打给旧男友、打给父母、上网检索。" },
        { k: "02", t: "规范化 Normalization", html: "Foucault 的五过程（comparison、differentiation、hierarchization、homogenization、exclusion）把使命各异的学校压向单一的「最优法学院」模板，偏离者被污名化（third-tier toilet）。生师比在 USN 权重里只占 3%，学校仍为它安排教师秋季在岗、春季休假，可见规范化计较到什么程度。" },
        { k: "03", t: "内化 Internalization", html: "经三种带情感的解读达成：<strong>anxiety</strong>（排名是 status anxiety 的引擎：零和、年度更新、责任大于控制力）；<strong>resistance</strong>（抵抗不是权力的对立面而是它的构成部分，联署谴责反而让排名成为信念围绕它组织起来的参照点）；<strong>allure</strong>（想驯服排名、在脆弱中重申能动性，这个念头本身就有吸引力）。一位院长的自白：「I'm getting the disease.」" }
      ]
    } },

    { t: "prose", html: `
<p>关键在排名的四个性质：可通约、相对、广泛流通、零和。零和是决定性的一环：一所学校上升，必然有另一所下降，因此你不可能只做象征性合规，别人不合规你就掉。由此得到一条经验规律：公开的、零和的、可通约化的测量，几乎无法被组织缓冲掉。</p>
<p>2022 年起的退榜潮给这条规律提供了极干净的现场证据。Yale、Harvard 领头的头部法学院集体拒绝提交数据，U.S. News 改用公开数据继续排名并大改方法学，随后名次剧烈震荡（细节见 <code>R01</code>）。抵抗没有终结排名，只是换来了一把改了刻度的尺子。这与 2009 年论文「抵抗是权力的构成部分」的论断严丝合缝。不过要给反方留位置：Englund 与 Gerdin 2020 年提出 reactive conformance 的对立面，记录了学者在特定条件下（评价周期长、同侪支持强、替代声誉来源多）确实能暂时抑制顺从压力。内化很难避免，但「不可避免」说得太满。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「规训就是老大哥监控。」</strong>复核结论：规训是生产性的，它生产技能、主体性、自我扫描的习惯；而且它弥散、平庸，经由最日常的程序运作，不需要一个中央监视者。另外，Sauder 与 Espeland 不只是应用 Foucault，还批评了他忽视组织维度：规训如何在组织之间被分工、协调、评估。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>公开 leaderboard 让实验室彼此可见。</strong>没人能把它当象征性合规束之高阁：你不刷榜，竞争对手刷了你就掉。每一次刷榜、甚至每一次公开批评榜单，都让它进一步成为整个领域信念组织起来的参照点，从而深化它的规训力。抵抗和顺从在这里通往同一个终点。这个论断可以检验：统计 2023 年之后批评 Chatbot Arena 的论文引用量，看它是否随批评增加而上升。本课程尚未做这项统计。</p>` },

    { t: "prose", html: `
<p>留一个问题：既然头部退出、公开批评、方法学改革都终结不了排名，规训循环的出口在哪里？多重相互冲突的排名并存，会稀释规训力，还是只是让每所学校多挑一把对自己有利的尺子？</p>` },

    { t: "sources", items: [
      `Sauder, M. & Espeland, W. N. (2009). "The Discipline of Rankings: Tight Coupling and Organizational Change." <em>American Sociological Review</em> 74(1):63–82.`,
      `Foucault, M. (1977). <em>Discipline and Punish</em>；对照 Meyer & Rowan (1977) 的 decoupling。`,
      `Englund, H. & Gerdin, J. (2020). "Contesting conformity." <em>AAAJ</em> 33(5)（反方：顺从可被抑制的条件）。`,
      `退榜潮后续见 <code>research/deep/D1</code> §1.4；完整拆解 <code>research/01, 11</code>。`
    ] }
  ]
};
