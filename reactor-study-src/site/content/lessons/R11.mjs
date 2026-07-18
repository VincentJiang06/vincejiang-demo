export default {
  id: "R11",
  blocks: [
    { t: "prose", html: `
<p>霍桑效应是反应性最出名的招牌案例：工人只要知道自己在被观察，产量就上升；灯调亮产量升，灯调暗产量还是升，起作用的据说是「有人在看」。问题在于，作为奠基的照明实验，其原始数据支持不了这个故事。反应性本身不受影响，被推翻的只是它最出名的那个案例。溯源它有两重收益：本课程自己的招牌案例也要经得起核查；以及反应性真正的尺度在制度，不在心理。</p>` },

    { t: "module", module: "provenance:hawthorne", title: "神话 vs 原始档案", config: {
      hint: "翻开卡片：一个被神话的效应，和它真正的证据。",
      cards: [
        { frontTag: "流行版 · 你听过的", front: "无论灯调亮、调暗、还是保持不变，产出都上升。「被关注本身」提升了绩效。",
          backTag: "档案 · 判决", back: "Levitt & List (2011) 在图书馆<strong>找回了一度被认为已销毁、从未被正式分析过</strong>的原始照明数据，重新分析后判定：文献描述的那些惊人模式在档案里<strong>查无实据</strong>，原文用词是 entirely fictional。" },
        { frontTag: "问：那产出波动是什么？", front: "如果不是「被观察」，工人产量的起伏由什么解释？",
          backTag: "档案 · 更朴素的答案", back: "产出波动更干净地由 <strong>day-of-week 周期（周一/周五）与发薪周期</strong>解释，控制之后处理组与对照组差异<strong>基本消失</strong>。更早的两轮重审同向：Franke & Kaul (1978) 首次统计重估，发现管理纪律（替换低产工人）与大萧条压力解释力更强；Jones (1992) 重审继电器室数据，同样没找到稳健证据。" },
        { frontTag: "问：这名字谁起的？", front: "「Hawthorne effect」是当年那些实验者起的吗？",
          backTag: "档案 · 时代误置", back: "不是。这个名字由 <strong>John R. P. French 1953 年</strong>铸造、Landsberger (1958) 推广，回溯安到 Elton Mayo 头上是时代误置。「工人在近乎月光的照度下还在增产」的戏剧化细节，原始档案同样<strong>无干净证据</strong>。早期继电器室的增产，至少部分源于两名低产工人被替换（Chiesa & Hobbs 2008）。" },
        { frontTag: "问：医学界怎么判？", front: "循证医学领域现在还用「霍桑效应」这个概念吗？",
          backTag: "档案 · 弃名判决", back: "McCambridge, Witton & Elbourne (2014) 系统综述 19 项研究后的结论：这个概念太笼统、机制不清，应改用 <strong>research participation effects</strong>。这篇论文被引约 3800 次，实质上是主张放弃「Hawthorne effect」这个名字。此后越严格的设计越难复现强效应：2019 年一项专门想诱发霍桑效应的随机试验，什么也没测到。" }
      ],
      timeline: [
        ["1924–32", "Western Electric 霍桑工厂做照明与继电器实验"],
        ["1953", "French 铸造 Hawthorne effect 这个名字"],
        ["1978", "Franke & Kaul 首次统计重估：纪律与经济因素解释更强"],
        ["1992", "Jones 重审：无稳健证据"],
        ["2011", "Levitt & List 找回原始数据：entirely fictional"],
        ["2014", "McCambridge 系统综述：建议弃名，改用 research participation effects"]
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「霍桑被证伪，说明被观察不会改变行为。」</strong>复核结论：反应性是真实的，整门课都在给它上证据。被证伪的是霍桑效应的强版本（被关注本身稳定提升绩效）。教训有两层。第一，引用任何经典效应之前，先查它的原始实证是否稳健，别让一个被神话的故事支撑整套哲学。第二层更深：反应性最强、最稳的证据来自制度层面（排名重塑法学院），驱动它的是可通约、公开、零和的度量施加的结构性激励，而不是被注视时的心理反应。个体心理层面的观察者效应家族（novelty、demand characteristics、John Henry effect：对照组因知道被比较而格外卖力）各有机制，证据强度参差，不应混为一谈。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>它的 AI 版本是真的，而且证据比人类版硬。</strong>模型可能识别出自己在被评测，从而在测试时表现得不同于真实部署，这叫 evaluation awareness / sandbagging（见 <code>Y12</code>），2024 年以来有因果级实证。霍桑这一课的提醒是次序：先看证据强度，再借概念。用一个在人类领域被证伪的神话给 AI 领域的主张背书，会把好证据讲成坏故事。</p>` },

    { t: "prose", html: `
<p>留一个问题：如果「被观察即改变」在个体心理层面证据薄弱，在制度层面却极其稳健，那么两者的分界线到底由什么决定？D1 报告给出的候选答案是激励结构：当读数连着钱、名声和生存，反应性才有了持续的燃料。</p>` },

    { t: "sources", items: [
      `Levitt, S. D. & List, J. A. (2011). "Was There Really a Hawthorne Effect at the Hawthorne Plant?" <em>AEJ: Applied Economics</em> 3(1):224–238.`,
      `McCambridge, J., Witton, J. & Elbourne, D. R. (2014). "Systematic Review of the Hawthorne Effect." <em>J. Clinical Epidemiology</em> 67(3):267–277（弃名判决）。`,
      `Franke & Kaul (1978) <em>ASR</em>；Jones (1992) <em>AJS</em>；Chiesa & Hobbs (2008)。`,
      `对照效应家族（John Henry、demand characteristics）与最新复核见 <code>research/deep/D1</code> §7。`
    ] }
  ]
};
