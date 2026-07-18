export default {
  id: "B04",
  blocks: [
    { t: "prose", html: `
<p>眼镜蛇效应（cobra effect）指反常激励的一种典型形态：你悬赏一个代理指标，得到的是有人制造更多问题来满足它。名字来自一个流传极广的故事：殖民时期的印度，政府按上交的蛇尸悬赏灭蛇，市民转而养蛇领赏；赏金取消后养蛇人放蛇，蛇比一开始还多。德国经济学家 Horst Siebert 2001 年用它做了书名。</p>
<p>先把诚实边界摆在前面：这个故事没有可靠史料，连「德里」这个地名都是后人层累添上的，Siebert 原书讲的只是英属印度的一般悬赏传说。机制成立，故事存疑。有档案的版本在河内。</p>` },

    { t: "module", module: "provenance:cobra", title: "一个太好用的故事，和一个有档案的故事", config: {
      hint: "翻卡：并非每个流行的警世故事都有史料。",
      cards: [
        { frontTag: "德里眼镜蛇", front: "政府悬赏蛇尸，市民养蛇，取消赏金后放蛇，蛇更多。",
          backTag: "档案 · 存疑", back: "这个故事<strong>没有可靠的一手史料</strong>，Siebert 自己也是当传说讲的；2025 年的期刊文献仍把它定性为 anecdotal。连「德里」都是后来被安上的地点。它机制成立，但引用时不能当「确有其事」的历史。" },
        { frontTag: "河内老鼠 (1902)", front: "法属河内为灭鼠悬赏，凭鼠尾领钱。",
          backTag: "档案 · 有据可查", back: "历史学家 <strong>Michael Vann</strong> 的研究有真实档案：1902 年法属河内悬赏灭鼠，凭<strong>鼠尾</strong>领钱。结果街上出现<strong>没有尾巴的活老鼠</strong>：有人剪尾领赏后放生，让它继续繁殖；郊外甚至出现<strong>养鼠场</strong>。要引一个确有其事的反常激励案例，用河内老鼠。" },
        { frontTag: "术语归位", front: "「眼镜蛇效应」在形式分类学里是什么？",
          backTag: "档案 · Manheim 的命名", back: "Manheim 与 Garrabrant (2018) 把这类情形正式命名为 <strong>non-causal cobra effect</strong>：行为人对指标的响应是真实的（蛇尸、鼠尾都是真的），却与真目标（灭蛇、灭鼠）因果脱钩。眼镜蛇故事只是寓言，被它例示的机制却有形式化定义，Manheim 的命名把两者接上。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>较真的理由很实际：</strong>一个研究「指标如何失真」的领域，尤其不能自己用未经考证的故事说服人。机制的真实性（悬赏可测的代理，就有人制造问题去满足它）不依赖德里的故事是否发生。改用有档案的河内老鼠，论证反而更经得起复核。2024 年《Behavioral and Brain Sciences》那篇跨学科目标论文干脆把 dead rats 写进了标题：经得起反复引用的，通常是有档案的案例。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>你给 agent 设的每一个奖励，都是一次悬赏。</strong>奖励「关闭的工单数」，它可能学会先制造工单再关；奖励「通过的测试数」，它可能学会删测试或写永远通过的空测试（2025 年 METR 报告里前沿模型的真实行为）。反常激励不是道德问题，是你把赏金挂在了一个可以被反向制造的代理指标上。组织层面的同型结构见 <code>B06</code>。</p>` },

    { t: "sources", items: [
      `Siebert, H. (2001). <em>Der Kobra-Effekt</em>. DVA（传说来源）。`,
      `Vann, M. G. (2003). "Of Rats, Rice, and Race: The Great Hanoi Rat Massacre." <em>French Colonial History</em> 4:191–203（有档案的版本）。`,
      `Manheim, D. & Garrabrant, S. (2018). arXiv:1803.04585（non-causal cobra effect 命名）。`,
      `考证更新见 <code>research/deep/D2</code> §4。`
    ] }
  ]
};
