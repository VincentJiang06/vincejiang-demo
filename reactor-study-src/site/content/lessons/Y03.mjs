export default {
  id: "Y03",
  blocks: [
    { t: "prose", html: `
<p>基准测试有个残酷的生命周期：诞生，被当作目标，被优化到饱和，贬值，被下一个基准取代。隐蔽的加速器是<strong>污染（contamination）</strong>：基准题目进入训练数据，模型不是学会了能力，而是见过答案。</p>` },

    { t: "module", module: "timeline:saturation", title: "基准饱和与污染简史", config: {
      hint: "点节点看每个基准是怎么被刷爆、被污染、或被判损坏的。",
      events: [
        { date: "2012–15", title: "ImageNet 时代", html: "深度学习的分水岭。Recht et al. (2019) 造了一套<em>新</em>的 ImageNet 测试集，所有模型都掉分（存在真实过拟合），但<strong>排名基本保持</strong>：绝对分虚高，相对比较较稳。这限定了「退化」的形状。" },
        { date: "2018–19", title: "GLUE → SuperGLUE", html: "GLUE 推出不到一年就逼近人类水平天花板，只好推出更难的 SuperGLUE。饱和快到基准来不及用。" },
        { date: "2024", title: "GSM8k → GSM1k → GSM-Symbolic", html: "GSM8k 被广泛使用后，Scale AI 造了同难度新题集 GSM1k：部分模型掉分 8–13%，前沿模型基本不掉。Apple 的 GSM-Symbolic 切口更深：只往题里塞一条<strong>看似相关实则无关</strong>的子句（GSM-NoOp），前沿模型普遍掉分，最大降幅达 <strong>65%</strong>，说明背的不只是题，是题型模板。" },
        { date: "2024–25", title: "MMLU 的天花板部分来自错题", html: "MMLU-Redux 人工重标 5,700 道题，估计 <strong>6.49% 的题目本身有错</strong>（错标答案、题干残缺、多正解）。准确率上限被错题限制在 93.5% 附近：看起来像能力饱和，部分是撞上了标注天花板。清洗错题后模型排名会变。" },
        { date: "2023–26", title: "SWE-bench 全弧线", html: "原版被查出 32.67% 的「成功」补丁涉及答案泄漏（写在 issue 评论里，SWE-bench+ 审计）；人工校验的 Verified 又被 OpenAI 查出至少 16.4% 任务缺陷、最难 138 题约 59% 损坏、模型能逐词复现人类原始补丁，2026 年被弃用；替身 SWE-bench Pro 不到一年也被审计出 <strong>约 30% 损坏</strong>并被撤回推荐（顶尖模型通过率 8 个月从 23.3% 飙到 80.3%）。从 SWE-bench 到 Verified 再到 Pro，三代之间的可用周期依次缩短。" },
        { date: "持续", title: "抗污染设计与它的限度", html: "Dynabench（动态对抗出题）、LiveBench / LiveCodeBench（只用发布日之后的新题）、canary 字符串。有效，但 2026 年的系统研究给出两条反向证据：跨 60 个基准统计，<strong>公开测试集与私有测试集的饱和率无统计学差异</strong>（藏题防不了饱和）；抗污染设计防得住逐字泄漏，防不住题目本身质量差、测试太弱、答案可记忆。" }
      ]
    } },

    { t: "callout", variant: "myth", html: `
<p><strong>流行说法：「污染 = 分数虚高，掉多少分就是注了多少水。」</strong>复核结论：污染的效果是路径依赖的。Schaeffer 等 2026 年用因果框架给出「污染悖论」的建模论证（预印本，尚无独立复现）：单条测试集副本进预训练语料就能让 loss 低于干净语料的不可约误差（致命），但后续大量新鲜数据训练又会把污染效应冲淡甚至抹平（可忽略）。这解释了 GSM1k 的分布：前沿模型经历大量后续训练，早期污染被稀释，几乎不掉分；小模型污染离最终检查点近，掉分大。另一条反向证据指向检测方法：n-gram 检测被改写轻松规避，成员推断攻击（MIA）在 LLM 上不显著优于随机基线，2025 年的系统综述标题就叫 "rushing nowhere"。凭 n-gram 或 MIA 得出的污染指控，方法上不足以支撑结论。</p>` },

    { t: "callout", variant: "applied", html: `
<p><strong>一个 benchmark 的分数，要连着它的「新鲜度」和「题目质量」一起读。</strong>发布已久、被广泛训练过的基准上的高分，含金量远低于发布日之后新题上的表现；而「逼近 100%」的军备竞赛在测量学上可能本就是幻觉，因为人工标注质量有天然上限。对你的 agent 开发，最实用的一条不变：保留一批模型和优化循环都从未见过的任务，定期更换，并且抽查题目本身的质量。题不干净，分数再稳也是噪声的排列。</p>` },

    { t: "prose", html: `
<p>留一个问题：如果 n-gram 失效、MIA 失效、语义检测又能被规避，那「证明某个分数是干净的」在原则上还可能吗？D4 报告认为这把污染问题推向了和适应性过拟合同样的处境：最坏情况不可判定，只能靠制度设计（held-out、时间切分、审计）而不是事后检测。</p>` },

    { t: "sources", items: [
      `Zhang et al. (2024). GSM1k, arXiv:2405.00332；Mirzadeh et al. (2025). GSM-Symbolic, arXiv:2410.05229（NoOp 掉分至 65%）。`,
      `Gema et al. (2025). "Are We Done with MMLU?"（MMLU-Redux，6.49% 错题）。`,
      `Aleithan et al. (2024). SWE-bench+；OpenAI (2026). "Why We No Longer Evaluate SWE-bench Verified" 与 "Separating Signal from Noise"（Pro 约 30% 损坏）。`,
      `Schaeffer et al. (2026). 污染悖论, arXiv:2601.04301；Meeus et al. (2025). "MIA Are Rushing Nowhere"。`,
      `Akhtar, Reuel et al. (2026). 饱和系统研究（藏题无效）。深化见 <code>research/deep/D4</code> §2–3、§5。`
    ] }
  ]
};
