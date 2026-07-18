export default {
  id: "R01",
  blocks: [
    { t: "prose", html: `
<p>排名不只反映现实，它参与重新制造现实。这个结论出自 Wendy Espeland 与 Michael Sauder 2007 年发表在《美国社会学杂志》的研究：他们对美国法学院的院长、招生与就业负责人做了 136 个访谈，追踪 U.S. News 排名发布后各校的实际变化，并把「测量反过来改造被测对象」的现象命名为<strong>反应性（reactivity）</strong>。这也是整条红色分支的名字。</p>
<p>2007 年原文给出两个机制、三类效果。机制一，<strong>自我实现预言</strong>：排名改变申请者、雇主、捐赠者的预期，预期变成真实的申请与捐款流向，从而把最初可能只是噪声的名次差坐实成真实差距。其中最隐蔽的一条通道：给同行打声誉分的院长们对大多数学校并不了解，只能参照上一年的排名打分，于是排名反过来吞并了声誉调查本应独立测量的对象。机制二，<strong>可通约化</strong>：把使命各异的学校（一所培养原住民律师，一所办九种法律期刊）压进同一把尺子，变成第 1 名与第 99 名。被丢掉的维度不是变得不重要，而是变得不可见。三类效果依次是：资源重新分配、工作被重新定义、博弈（gaming）。</p>` },

    { t: "module", module: "sandbox:game-the-ranking", title: "当院长：在真实办学与操纵排名之间分配预算" },

    { t: "prose", html: `
<p>沙盒里的陷阱有一个正式名字：军备竞赛。只要对手在投博弈预算，你就不敢不投；一旦大家都投，名次要靠操纵才能维持，而真实办学质量在掉队。排名还在、名次还分得清清楚楚，但它测量的已经变成「谁更会操纵它」。Espeland 与 Sauder 访谈里一位院长的原话是：这是 "a self-fulfilling nightmare"。</p>
<p>2022 年 11 月，这套理论迎来一次活体检验。Yale 法学院院长 Heather Gerken 宣布退出 U.S. News 排名，称其「与本行业的使命背道而驰」；Harvard 同日跟进，Berkeley、Georgetown、Columbia、Stanford 数日内相继退出。U.S. News 并未因此消失，而是改用公开数据继续给退出者排名，同时大改方法学（下调声誉权重、增加就业与债务指标）。方法一改，名次剧烈震荡，2026 年 4 月 Stanford 把 Yale 挤下了它坐了 36 年的法学院头名（Reuters 2026-04-07）。这正是 Sauder 与 Espeland 在 2009 年论文里的判断：抵抗不是权力的对立面，而是权力运转的一部分。你不给数据，尺子就用可得数据继续量你。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「E&S 提出了四机制。」</strong>复核结论：2007 年原文只有 2 机制 + 3 效果。narrative（数字必须被讲成故事才能流通）出自 Espeland 2015 年的 "Narrating Numbers"；reverse engineering（逆向拆解排名公式）与 emotional attachments（数字激起的焦虑与认同，让规训得以内化）到 Espeland 2016 年发表在 <em>Historical Social Research</em> 41(2) 的论文才被提升为并列机制。2007 年原文里 "reverse engineer" 一词出现过，但只是 gaming 的一种手法。把四机制安在 2007 年头上，是时间错置。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「操纵排名是差学校才做的事。」</strong>恰恰相反。排名是相对的：你什么都没做错，只要对手涨了你就掉，因此精英学校同样焦虑。E&S 的访谈显示，就业统计的操纵横跨各档学校：把「就业」的定义放宽到任何有薪工作、把低分学生转入不计入中位数的夜校或试读项目、临时雇佣自己的毕业生冲就业率。得州大学法学院 1998 年因为 61 个毕业生没回就业问卷，U.S. News 按规则假定其中 75% 失业，一年从第 18 名掉到第 29 名。名次是真的，掉下去的原因是统计规则造出来的。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>排名的力量不在「它测得准」，而在「它告诉你别人会怎么看」。</strong>Esposito 与 Stark 2019 年把这层机制叫作二阶观察：申请者看排名，不是为了知道哪所学校好，而是为了知道雇主会认为哪所学校好。只要所有人都相信「别人在看排名」，排名就有支配力，测量效度反而是次要的。这解释了一个反直觉现象：明知方法学有缺陷的排名，仍然没人敢无视它。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>把「法学院」换成「你的模型」，故事结构一字不改。</strong>排行榜是那本杂志，厂商是院长；私测多个变体只发布最高分，对应把低分学生转入夜校。反应性不是社会学史的旧闻，而是你每天在跑的循环。红色分支讲这台机器的社会学，<code>Y11 排行榜幻觉</code>讲它的机器版，建议对照着看。</p>` },

    { t: "prose", html: `
<p>留一个问题：头部学校集体退出，U.S. News 仍能用公开数据强排，说明「被测者不合作」不足以终止反应性。那么反应性的真正终止条件是什么？是受众停止使用，还是替代排名接管？D1 报告把它列为本领域第一个开放问题。</p>` },

    { t: "sources", items: [
      `Espeland, W. N. & Sauder, M. (2007). "Rankings and Reactivity: How Public Measures Recreate Social Worlds." <em>American Journal of Sociology</em> 113(1):1–40.`,
      `Sauder, M. & Espeland, W. N. (2009). "The Discipline of Rankings." <em>ASR</em> 74(1):63–82.`,
      `Espeland, W. N. (2016). "Reverse Engineering and Emotional Attachments as Mechanisms Mediating the Effects of Quantification." <em>HSR</em> 41(2):280–304（四机制的真实出处）。`,
      `Esposito, E. & Stark, D. (2019). "What's Observed in a Rating?" <em>Theory, Culture & Society</em> 36(4).`,
      `退榜潮时间线与 2026 年 Stanford 超越 Yale：<code>research/deep/D1</code> §1.4；完整拆解见 <code>research/01</code>；模拟对应 <code>experiments/exp1</code>。`
    ] }
  ]
};
