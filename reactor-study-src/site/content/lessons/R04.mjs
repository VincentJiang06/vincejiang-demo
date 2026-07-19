export default {
  id: "R04",
  blocks: [
    { t: "prose", html: `
<p>为什么排名甩不掉？组织学有个著名的老预言，叫脱耦（decoupling）：组织最擅长阳奉阴违，对外摆出合规的姿态，内部照常运转；Meyer 与 Rowan 1977 年、DiMaggio 与 Powell 1983 年的经典论文都说，为求正当性，组织做象征性顺从即可，产出难以观察的教育组织更是此中老手。照这个预言，排名来袭时法学院本该轻松把它当摆设，何况排名具备一切「该被敷衍」的特征：新来的、外部强加的、昂贵难管的、被内部精英公开鄙视的。可你在 <code>R01</code> 已经见过实况：砍助学金、追失联毕业生、两本账，没有一所学校把它当摆设。社会学的答案是：排名是一种规训权力，它不靠强制，靠让你持续可见来运作。判断一把尺子躲不躲得开，就看这几个开关。</p>
<p>这个悖论很刺眼。Sauder 与 Espeland 2009 年发现的不是缓冲成功，而是恰恰相反的紧耦合：Yale 院长斥排名为 "idiot poll"（白痴测验），Harvard 院长称其 "Mickey Mouse"（不入流），鄙视之余仍然紧盯名次。于是他们把提问倒了过来：不问组织为何能去耦，而问为什么某些环境压力比其他压力更「去耦不掉」。他们借来的解释工具，来自法国哲学家 Foucault：排名是一种规训权力（disciplinary power），原文引 "discipline is an art of rank"，纪律本身就是一种排名的艺术。它不靠鞭子，靠让对象持续可见：毛细血管式、连续、弥散，经由最平庸的日常程序运作。</p>` },

    { t: "module", module: "explorable:discipline", title: "排名如何规训：三重机制", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "监视 Surveillance", html: "三种可见性叠加：<strong>连续</strong>（年度发榜被编排成媒体事件，「五秒钟全校皆知」）；<strong>细节</strong>（院长开始追问哪笔钱能算进 instructional budget，原文称之为 a political anatomy of detail）；<strong>远距</strong>（分散、外行的受众都能看到法学院内部，实现 governing at a distance）。就业主任为追回失联毕业生，打给旧男友、打给父母、上网检索。" },
        { k: "02", t: "规范化 Normalization", html: "Foucault 的五过程（comparison、differentiation、hierarchization、homogenization、exclusion）把使命各异的学校压向单一的「最优法学院」模板，偏离者被污名化（third-tier toilet）。生师比在 USN 权重里只占 3%，学校仍为它安排教师秋季在岗、春季休假，可见规范化计较到什么程度。" },
        { k: "03", t: "内化 Internalization", html: "经三种带情感的解读达成：<strong>anxiety</strong>（排名是 status anxiety 的引擎：零和、年度更新、责任大于控制力）；<strong>resistance</strong>（抵抗不是权力的对立面而是它的构成部分，联署谴责反而让排名成为信念围绕它组织起来的参照点）；<strong>allure</strong>（想驯服排名、在脆弱中重申能动性，这个念头本身就有吸引力）。一位院长的自白：「I'm getting the disease.」" }
      ],
      predict: { q: "组织学的老预言说，组织最擅长对外做样子、内部照旧。面对排名，法学院做到了吗？", options: ["做到了，排名基本被当摆设", "没做到，连最鄙视排名的名校也被它改造", "只有排名靠后的学校被改造"], answer: 1, reveal: "Yale 院长骂它是白痴测验，Harvard 院长说它不入流，骂完仍然紧盯名次。零和排位制里你不动而对手动，你就下跌：象征性合规在数学上不存在。", plain: "能不能缓冲一把尺子，先看它是达标制还是排位制。" }
    } },

    { t: "prose", html: `
<p>缓冲为什么失败？关键在排名的四个性质：可通约、相对、广泛流通、零和。零和是决定性的一环：一所学校上升，必然有另一所下降，因此你不可能只做象征性合规，别人不合规你就掉。由此得到一条经验规律：公开的、零和的、可通约化的测量，几乎无法被组织缓冲掉。监视的三个特征在访谈里都有肉身：一位院长把发榜比作「开灯前先闭眼给蟑螂时间逃走」；另一位承认「做决定时我总盯着排名，而不是盯着对学校最好的事」。远距监视一条还借了 Scott 的概念：排名让申请人、校董、州议员这些分散的外行都能「看进」法学院内部，实现远距治理；「先把对象改造得可读，外人才看得进来」这个前置条件本身有一整课，见 <code>R05</code>。</p>
<p>规范化的五个过程是一条流水线：先把所有法学院设为同类（comparison，比较），再精确区分（differentiation，区分），再排成唯一等级（hierarchization，层级化）；等级造出一所抽象的「最优法学院」，各校向它靠拢，招生只认 LSAT 与 GPA，学生构成同质化、种族多样性受损（homogenization，同质化）；偏离模板者被排斥与污名（exclusion，排除），低排名学校即便完全符合 ABA 认证仍被判「不合格」，学生在论坛上自嘲是 "third-tier toilet"（三流厕所）出身。规训还留下了制度化石：Chun 与 Sauder 2023 年记录了「造数专长」（ranking expertise）如何长成一门新职业，学校设专岗管理报给排名的数据，组织内部的依赖关系随之重构。一种外部测量，最终以人事编制的形式住进了被测者体内。</p>
<p>内化的三种情感通道里，焦虑最结构化：排名相对、不稳、高度可见，而院长对名次「责任大于控制力」，这种处境在 Marmot 的健康社会学里恰好被认定为最伤人的一种；受访者说，即便名次升了，「你也只高兴 15 分钟」，然后开始担心明年。抵抗的悖论有先例可援：Burawoy 笔下车间工人的「making out」博弈、Covaleski 等对大会计师事务所的研究都显示，针对控制系统的博弈让人对系统投入更深。法学院的版本是 AALS 委托学者批判排名方法学、给 LSAT 考生寄联署谴责信，结果每一次公开交锋都把排名进一步变成「信念围绕它组织起来的参照点」。gaming 也一样，作者把它重释为一种看似去耦、实则加深内化的抵抗：它挑战排名作为准确表征的正当性，却因为投入更多而使排名更加自然化。原文的收束句值得整句记下：排名同时诱惑与胁迫（seduce and coerce），而这一切以平淡的数字语言进行，反而更有力。</p>` },

    { t: "prose", html: `
<p>规训力有一个关键的调节旋钮：垄断。Sauder 与 Espeland 2006 年比较过法学院与商学院，前者面对 USN 近乎垄断且全覆盖的排名，后者面对至少五家方法各异、结果不一致的榜单，学校可以挑对自己有利的那家讲故事，裁量权与松耦合空间随之恢复。排名越多，任一排名的规训力越弱。但他们同时指出一个悖论：用「造更多排名」对冲垄断，会进一步把排名确立为高等教育里正当的问责形式，抵抗手段巩固了被抵抗之物。这条线索通向 <code>R13</code> 的退出政治与 <code>G06</code> 的制度层防御。阵营内部的最新反省也落在同一点上：Chun 2025 年指出，早期研究（包括 Sauder 自己把 USN 当「闯入者」分析的 2008 年论文）过度聚焦单一支配性排名，而现实里的测量多元并存、彼此冲突、持续被争夺，规训模型需要为这种多元性重写。</p>
<p>2022 年起的退榜潮（<code>R01</code> 讲过经过）给这条规律提供了极干净的现场证据：Yale、Harvard 领头的头部法学院集体拒绝提交数据，U.S. News 改用公开数据继续排名并大改方法学，随后名次剧烈震荡。抵抗没有终结排名，只是换来了一把改了刻度的尺子，这与 2009 年论文「抵抗是权力的构成部分」的论断严丝合缝。不过要给反方留位置：Englund 与 Gerdin 2020 年提出 reactive conformance 的对立面，记录了学者在特定条件下（评价周期长、同侪支持强、替代声誉来源多）确实能暂时抑制顺从压力；Slager 与 Gond 2022 年在 ESG 评级场域观察到企业对评级同时接受与抵抗的矛盾态度（ambivalence）。反应性是政治性的、有裁量空间的过程，不是机械传动：内化很难避免，但「不可避免」说得太满。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「规训就是老大哥监控。」</strong>复核结论：规训是生产性的，它生产技能、主体性、自我扫描的习惯；而且它弥散、平庸，经由最日常的程序运作，不需要一个中央监视者。另外，Sauder 与 Espeland 不只是应用 Foucault，还批评了他忽视组织维度：规训如何在组织之间被分工、协调、评估。他们对自家阵营也有话说：当代制度理论把制度当宏观象征系统，丢掉了早期的微观取向，需要 Hallett 与 Ventresca 所谓「被居住的制度」视角把人请回来。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>缓冲失败的要害不在监视多严，而在测量的形状。</strong>可通约、相对、广泛流通、零和，四个性质里零和最致命：它把「不作为」直接定价成「下跌」。一般的制度压力是达标逻辑，做出合规姿态即可交差；零和排名是位次逻辑，你的位置由别人的行为共同决定，象征性合规在数学上就不存在。判断一把尺子能不能被组织缓冲掉，先看它是达标制还是排位制。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>公开 leaderboard 让实验室彼此可见。</strong>没人能把它当象征性合规束之高阁：你不刷榜，竞争对手刷了你就掉。每一次刷榜、甚至每一次公开批评榜单，都让它进一步成为整个领域信念组织起来的参照点，从而深化它的规训力。抵抗和顺从在这里通往同一个终点。这个论断可以检验：统计 2023 年之后批评 Chatbot Arena 的论文引用量，看它是否随批评增加而上升。这项统计尚未做。</p>` },

    { t: "prose", html: `
<p>留一个问题：既然头部退出、公开批评、方法学改革都终结不了排名，规训循环的出口在哪里？多重相互冲突的排名并存，会稀释规训力，还是只是让每所学校多挑一把对自己有利的尺子？</p>
<p><strong>一句话带走：</strong>公开、零和、人人可见的排位是一种不需要监工的权力；你骂它、玩它、退出它，都在替它上油。</p>` },

    { t: "sources", items: [
      `Sauder, M. & Espeland, W. N. (2009). "The Discipline of Rankings: Tight Coupling and Organizational Change." <em>American Sociological Review</em> 74(1):63–82.`,
      `Foucault, M. (1977). <em>Discipline and Punish</em>；对照 Meyer & Rowan (1977)、DiMaggio & Powell (1983) 的 decoupling 命题。`,
      `Sauder, M. & Espeland, W. N. (2006). "Strength in Numbers? The Advantages of Multiple Rankings." <em>Indiana Law Journal</em> 81(1):205–227（垄断这个调节变量）。`,
      `Englund, H. & Gerdin, J. (2020). "Contesting conformity." <em>AAAJ</em> 33(5)（反方：顺从可被抑制的条件）。`,
      `Slager, R. & Gond, J.-P. (2022). "The Politics of Reactivity." <em>Organization Studies</em> 43(1)（ESG 场域的矛盾态度）。`,
      `Chun, H. & Sauder, M. (2023). "The Power in Managing Numbers." <em>Higher Education</em> 86:771–790（造数专长的兴起）；Chun, H. (2025). <em>Sociology Compass</em>（从单一垄断到多元与争夺）。`,
      `退榜潮后续见 <code>research/deep/D1</code> §1.4；完整拆解 <code>research/01, 11</code>。`
    ] }
  ]
};
