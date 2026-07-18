export default {
  id: "R05",
  blocks: [
    { t: "prose", html: `
<p>可读性（legibility）是比反应性更上游的概念，出自 James Scott 的《Seeing Like a State》。前现代国家在关键方面是部分失明的：它对臣民的财富、田产、收成、位置甚至身份所知甚少，而看不清的社会无法征税、征兵、管制。于是国家把复杂、地方性、多样的社会简化成可清点、可标准化、可俯瞰的形式。这就是可读性。全书的核心是一句话：<span class="pullquote">"Legibility is a condition of manipulation."<span class="src">Scott, Seeing Like a State, 1998</span></span>要改造什么，先得让它可读；而为被看见而简化的过程本身，已经在重塑社会。</p>` },

    { t: "module", module: "explorable:legibility", title: "把世界改简单，好看清它", config: {
      mode: "compare", label: "国家之眼",
      a: { t: "被读之前", html: "杂树混生的天然林、盘根错节多重叠加的地方地权、随情境浮动的地方度量衡、没有世袭姓氏的村民。丰富、有韧性、充满 <strong>metis</strong>（在具体情境里长出来的默会实践智慧），但对中央<strong>不可读</strong>。" },
      b: { t: "被读之后", html: "等距排列的单一树种人工林（Normalbaum）、标准地块的地籍图、统一度量衡、强制的永久姓氏把每个人可追踪地绑定到税册兵册。<strong>可测、可管、可俯瞰</strong>，代价是 metis 被连根拔起。普鲁士科学林业第二轮就因土壤耗竭大面积死亡，德语为此留下一个词：<strong>Waldsterben（森林死亡）</strong>。" }
    } },

    { t: "prose", html: `
<p>Scott 的悲剧公式是四者叠加：high modernism（对「按科学法则设计社会」的过度自信）、legibility（简化的技术）、威权国家（无视民间抵抗）、孱弱的公民社会。苏联集体化、巴西利亚、坦桑尼亚的强制并村都是这个公式的产物，每一次被碾碎的都是 metis。</p>
<p>这本被引约 3.6 万次的书也积累了扎实的反方。档案研究给出两类修正：Schneider 2007 年用坦桑尼亚档案证明，Scott 对乌贾马并村的解读过度倚重「可读性动机」，低估了意识形态承诺、政治恩庇与地方能动性；Loo 2016 年的加拿大案例显示，高现代主义方案在现实中远比 Scott 的模型碎裂，被协商、被在地改写，「成功/失败」的二分过于干净。另一类批评指向浪漫化：metis 被理想化成无害的地方智慧，可地方知识本身也可能压迫、排外。Scott 2021 年给出两点澄清：他承认可读性工程最先施用于国家自身机构（军队、王室领地），并强调自己反对的不是简化本身，而是「威权化加无视 metis」的组合。另一条新扩展来自 Coyne 等 2025 年：可读性不是国家专利，市场与私人组织同样把世界「读简单」，把病理专门归给国家是范畴错误。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「Scott 反对一切量化。」</strong>复核结论：他明说 legibility 本身中性、常常必要，防疫、赈灾都离不开它；危险只在它与高度现代主义、威权、弱公民社会叠加并碾碎 metis 时爆发。把 Scott 读成「测量皆恶」是稻草人，他 2021 年的自我澄清可作直接反证。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你的评分 rubric 就是 AI 世界的 legibility。</strong>要评估模型，你得先把「好回答」标准化成可打分的 schema：多选、pairwise 偏好、rubric。这套 schema 让评估成为可能，也预先决定了什么被看见。那些 metis 式的细微得体、语境判断、恰到好处的克制，因为不可读，被抹平为零分或不计。你能评的，永远只是你先让它可读的那部分。</p>` },

    { t: "prose", html: `
<p>留一个问题：Scott 讲的是「为看见而简化」，Espeland 讲的是「被看见后反应」，两者合起来才是完整循环，但至今没人把它们正式缝合。如果市场和平台的 legibility 与国家同构（Coyne 2025），那么「简化必然侵蚀 metis」这个悲观命题，在非国家场景还成立吗？</p>` },

    { t: "sources", items: [
      `Scott, J. C. (1998). <em>Seeing Like a State</em>. Yale University Press.`,
      `Scott, J. C. (2021). "Further Reflections on <em>Seeing Like a State</em>." <em>Polity</em> 53(3)（自我修正）。`,
      `Schneider, L. (2007). <em>African Studies</em> 66(1)（坦桑尼亚档案反证）；Loo, T. (2016). <em>Canadian Historical Review</em> 97(1)。`,
      `Coyne, Goodman & Quintas (2025). <em>European Economic Review</em>（市场也 legible）。深化见 <code>research/deep/D1</code> §3。`
    ] }
  ]
};
