export default {
  id: "R10",
  blocks: [
    { t: "prose", html: `
<p>马太效应（Matthew Effect）指累积优势：初始的微小优势会自我放大成巨大的不平等。Robert Merton 1968 年在《Science》上把它铸成术语，取名自马太福音 25:29「凡有的，还要加给他」。一个已经出名的科学家，同样的成果会得到更多认可；荣誉流向已经有荣誉的人。</p>
<p>这篇论文自带一个反身注脚：它本身就是马太效应的例证。Merton 的经验材料大量来自 Harriet Zuckerman 的诺奖得主访谈，他后来多次公开表示此文本应署名 Zuckerman–Merton 合著。资深者以单独署名占据合作信用，恰好演示了论文要讲的机制。Rossiter 1993 年补上了被 Merton 忽略的下半句，命名为 Matilda effect：女性科学家的贡献被系统性转记到男同事名下。谁能积累优势，本身就有结构性偏向。</p>
<p>累积优势的起点差异本身未必真实。2006 年 Salganik、Dodds 与 Watts 用一个真人实验测了这一点，叫 MusicLab。</p>` },

    { t: "module", module: "sim:musiclab", title: "人工音乐市场：质量只设边界，不定名次", config: {} },

    { t: "prose", html: `
<p>实验招募 14,341 名真人，听 48 首无名乐队的歌。设计的关键是平行世界：一个独立世界里听众看不到任何社会信息，只凭自己判断；另外 8 个社会影响世界里听众能看到别人的下载数，且各自独立演化。结果：社会影响越强，成功越不平等（Gini 上升），同时越不可预测，同一首歌在 8 个平行世界里命运迥异。</p>
<p>2008 年的续作把条件推得更极端：实验者人为倒置真实排名，把最不受欢迎的歌显示为最热门。多数歌的假流行真的自我实现了；但市场整体没有被反转带走，最好的那批歌在长期恢复了人气。两次实验合起来的精确结论是：质量决定可能的区间（最好的很少垫底、最差的很少夺冠），社会影响决定区间内谁胜出，并同时放大不平等与不可预测性。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「MusicLab 证明成功纯属随机、质量无关。」</strong>复核结论：这是对实验最常见的误读。2008 年反转实验恰恰证明质量设定边界，最好的歌能从人为打压中恢复。社会影响放大的是中间地带的偶然性。同理，马太效应讲的是分配机制的偏向，不是「努力无用」。另一条方法论警告来自 DiPrete 与 Eirich 2006 年的综述：许多被归为「累积优势」的现象其实是未观测异质性，把稳定的初始差异误读成了动态放大。归因给马太之前，先排除这一条。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>一个模型早期登榜，就可能重演 MusicLab 的动力学。</strong>它被更多采用、引用、蒸馏，于是真的变强，这是累积优势；榜单的排序信号（下载数、star 数、SOTA 标签）又会像 MusicLab 一样，把早期噪声反身放大成「公认最佳」，让真实质量的微小差异被排名的巨大差异掩盖。你看到的不是能力榜，而是被社会影响放大过的早期随机波动。<code>Y11 排行榜幻觉</code>是这个机制的 AI 现场。</p>` },

    { t: "prose", html: `
<p>留一个问题：「最好的歌会恢复」依赖可辨识的真实质量。模型的「质量」在多大程度上可辨识、有共识？如果各家模型的强项本就不可通约，长期恢复的力量可能根本不存在，榜单噪声就会永久固化。这是把 MusicLab 外推到 AI 排行榜时最该盯住的前提。</p>` },

    { t: "sources", items: [
      `Merton, R. K. (1968). "The Matthew Effect in Science." <em>Science</em> 159(3810):56–63（Zuckerman 合著权自陈见 1988 续篇与 Garfield 2004）。`,
      `Rossiter, M. W. (1993). "The Matthew Matilda Effect in Science." <em>Social Studies of Science</em> 23(2):325–341.`,
      `Salganik, Dodds & Watts (2006). <em>Science</em> 311:854–856；Salganik & Watts (2008). <em>SPQ</em> 71(4):338–355（反转实验）。`,
      `DiPrete & Eirich (2006). <em>Annual Review of Sociology</em> 32（未观测异质性警告）。深化见 <code>research/deep/D1</code> §6；模拟 <code>experiments/exp5</code>。`
    ] }
  ]
};
