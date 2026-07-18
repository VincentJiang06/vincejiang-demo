export default {
  id: "G01",
  blocks: [
    { t: "prose", html: `
<p>抗博弈的关键常被概括为「把作弊成本拉高」。这一节给它一个理论根基，并把这句概括本身修正掉。理论来自一个意想不到的地方：生物学。</p>
<p>孔雀为什么长着累赘的大尾巴？Zahavi 1975 年的<strong>障碍原理（handicap principle）</strong>说：正因为尾巴昂贵、是负担，它才是诚实信号，只有真正健康的个体负担得起，代价本身就是质量的证明。这个直觉太漂亮，Grafen 1990 年用博弈论做了形式化，教科书从此奉它为诚实信号的一般原理。故事的第二幕和第三幕，教科书大多没跟上。</p>` },

    { t: "module", module: "explorable:handicap", title: "诚实不来自贵，而来自「对说谎者才贵」", config: {
      mode: "steps",
      steps: [
        { k: "01", t: "第一幕 · 流行版：昂贵=诚实", html: "Zahavi：昂贵、难伪造的信号是诚实的，因为弱者伪造不起。文凭之所以曾是能力信号（Spence 1973），是因为对能力差的人来说拿到它成本过高。孔雀尾、名校文凭、烧钱的广告，都被解释成「贵所以可信」。" },
        { k: "02", t: "第二幕 · 成本差（2011–2020）", html: "Penn 与 Számadó 2020 年的系统重审：均衡上的信号成本<strong>既不充分也不必要</strong>；「Grafen 证明了障碍原理」这个说法不准确，他的模型支持的是条件依赖投资，不是「浪费即诚实」。更准的表述：诚实不来自<em>绝对</em>的贵，而来自<strong>成本差</strong>，作弊的边际成本必须随质量下降而陡增。信号可以很便宜，只要它<em>对说谎者特别贵</em>。" },
        { k: "03", t: "第三幕 · 权衡（2023–2026，本课程的更新）", html: "同一批作者把结论再推一步：诚实由<strong>权衡（trade-offs）</strong>维持，成本差只是其中一种实现。即使信号对所有人成本相同甚至为零，只要不同质量个体从同一信号强度获得的<strong>净收益</strong>不同，诚实仍然稳定。还有第三条路：<strong>指标信号（index signal）</strong>，信号与质量之间有物理因果约束，低质者根本造不出来（鸣叫基频受体型限制），成本为零却不可伪造。<strong>结论：不是「贵」，而是「质量依赖的净收益差」。</strong>" },
        { k: "04", t: "另一条腿 · Skin in the Game", html: "让信号发出者<strong>承担信号错误的后果</strong>。评估者如果要自己用这个 agent 干活、要为误判买单，评估质量会立刻不同。别听那些不吃自己做的饭的人，这是把诚实内建进制度的最古老办法。注意它也会被博弈：Dodd-Frank 要求证券化机构自留 5% 风险，实践中这份「切身利益」可以被对冲掉。抗博弈手段本身也需要抗博弈。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「孔雀尾巴可信是因为太昂贵。」</strong>复核结论：这是第一幕的版本，学界已走到第三幕。均衡成本可以为零，诚实由质量依赖的净收益差锁定。争论仍有两方：Penn 与 Számadó 主张"handicap"这个名字应彻底废弃而非修改；Grafen 一系（Biernaskie 等 2018）用一个统一模型把从线索到障碍排成连续谱，把障碍降格为特例保留。数学上双方共识，分歧在命名与「成本是否必要」。置信度提示：trade-offs 取代 cost 的表述较新（2023–2026，主要出自同一作者群），尚未被全领域采纳。</p>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>最有操作价值的一条定理，来自 cheap talk 传统而非生物学：维持诚实所需的信号成本，正比于信号者与接收者之间的利益冲突。</strong>Crawford 与 Sobel 1982 年证明，完全无成本的沟通里，双方偏好越接近，均衡越有信息量；Lachmann 等 2001 年把它推到生物学，标题就是判决："waste is not required"。这把「昂贵信号」从二元选择变成一个连续旋钮：<strong>先想办法对齐利益（把冲突降下来），再决定还需要多少成本去锁住剩余的冲突。</strong>利益一致时，昂贵是纯损失。还有一条补充：Kartik 等证明，即便只给谎报加一点点确定的边际成本（审计概率、事后追责、声誉罚），也能显著改善信息传递，门槛不必抬到天上。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>翻译成 agent eval，三条可直接用：</strong>其一，设计任务让「真解决」和「刷分」之间的净收益差最大化。需要真实多步推理、真实环境交互、长链条后果的任务，骗子刷不动；单点可模式匹配的断言，骗子几乎零成本刷满。其二，优先找 index 型判据：那些由任务结构决定、低能力模型物理上做不到的东西（真跑通的程序、可复现的实验结果），比任何「昂贵」的评分都稳。其三，先降冲突再加成本：让 eval 的设计者自己要用这个 agent（skin in the game），比把 eval 修得更严更有效。这三条是 <code>C07</code> 清单的支柱。</p>` },

    { t: "sources", items: [
      `Zahavi (1975)；Grafen (1990)；Penn, D. J. & Számadó, S. (2020). <em>Biological Reviews</em> 95(1):267–290.`,
      `Számadó, Zachar, Czégel & Penn (2023). <em>BMC Biology</em> 21:4；Számadó, Zachar & Penn (2026). <em>J. Evolutionary Biology</em> 39(2)（trade-offs 框架）。`,
      `Crawford & Sobel (1982). <em>Econometrica</em>；Lachmann, Számadó & Bergstrom (2001). <em>PNAS</em>（waste is not required）。`,
      `Spence (1973)；Taleb, <em>Skin in the Game</em>。深化见 <code>research/deep/D7</code> §1–3。`
    ] }
  ]
};
