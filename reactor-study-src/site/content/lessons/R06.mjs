export default {
  id: "R06",
  blocks: [
    { t: "prose", html: `
<p>哲学家 Ian Hacking（1936–2023）把事物分成两类。电子、硫、水是 indifferent kinds（无差别的类）：你怎么给它们分类、命名，它们毫不在乎。「人的类别」不同：被分类的人会意识到自己被这样归类，从而改变自我理解和行为，这又反过来改变类别本身。他称之为 interactive kinds（互动的类）。</p>
<p>由此产生一个不会停的反馈：标签改变人，人改变标签。Hacking 叫它 looping effect（循环效应），后果是人的类别成了 moving targets（移动的靶子）。</p>` },

    { t: "module", module: "explorable:looping", title: "两种类：石头 vs 人", config: {
      mode: "compare", label: "分类会改变它吗？",
      a: { t: "Indifferent kind（电子 / 石头）", html: "你叫它「夸克」、给它任何理论范畴，它无动于衷。自然类不回应分类，因此可以放心假设：测量之前和之后，被测对象是同一个。这是自然科学能「客观」的底气。" },
      b: { t: "Interactive kind（人）", html: "自闭症的诊断边界和被诊断者的<strong>生活体验</strong>在过去六十年剧烈变动：从 Kanner 的窄定义，到 Asperger，到 DSM 的「谱系」，再到 neurodiversity 运动对这个类别的反向改写。今天被诊断的「自闭症」，已经不是命名它之前的那个自闭症。原文：The disability we call autism has changed its contours... That is the moving target." }
    } },

    { t: "prose", html: `
<p>Hacking 把这套机制叫 making up people（制造人）：新分类开辟出新的「为人的可能性空间」。他给了五要素框架（分类、人、制度、知识、专家），要素彼此拉扯，让类别和人同时地、相互地涌现，他称之为 dynamic nominalism（动态唯名论）。多动症、多重人格是同类案例；Haslam 2016 年把 looping 接到 concept creep 命题上，解释 harm、trauma 这类概念为何不断外扩。</p>
<p>Cooper 2004 年的著名反驳指出：interactive/indifferent 的二分撑不起 Hacking 想要的自然类/人类类之分，很多人的类别（某些遗传病）其成员并不知道自己被分类，却仍是 human kind。Tsou 2007 与 2025 年进一步主张：精神疾病可以同时是互动的类和有稳定生物基础的自然类。对本课程的含义是：<strong>被测者会反应，不代表被测的东西没有独立实在。</strong>排名既反映又重塑，「重新制造」不等于「无中生有」。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「looping 证明分类都是人为的、不真实的。」</strong>复核结论：Hacking 本人在《The Social Construction of What?》里明确反对这个读法。互动的类既是被建构的又是真实的，儿童虐待既被「制造」为一个类别，又指向真实的伤害。借 looping 论证「排名纯属人为、毫无实在依托」，是对 Hacking 的误读，也会把反应性理论推到它守不住的阵地。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>研究者给模型行为发明的每个标签，都是一次 making up people。</strong>越狱、谄媚、涌现能力、欺骗对齐：这些标签一旦进入训练数据、RLHF 目标和研究议程，就改变了模型和研究者的行为，让类别成为移动的靶子。今天你测的「谄媚」，已经不是你命名它之前的那个谄媚。你的 eval 分类，正在制造它要测量的对象。一个待检验的推论：被「AI 安全」类别标注过的模型，会不会因为训练数据里含有这些类别而回望并改变行为？这是 looping 在机器上的开放问题。</p>` },

    { t: "sources", items: [
      `Hacking, I. (1986). "Making Up People"; (2007). "Kinds of People: Moving Targets." <em>Proc. British Academy</em> 151:285–318.`,
      `Cooper, R. (2004). "Why Hacking is Wrong about Human Kinds." <em>BJPS</em> 55(1)（最有名的反驳）。`,
      `Tsou, J. Y. (2007; 2025). looping 与自然类可以并存。`,
      `Hacking 逝世于 2023-05-10（Misak 2024 讣告）。深化见 <code>research/deep/D1</code> §4。`
    ] }
  ]
};
