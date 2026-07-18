export default {
  id: "C03",
  blocks: [
    { t: "prose", html: `
<p>如果任何指标都会被腐蚀，是不是只能放弃测量？不是。这一节是全课最建设性的部分：既然指标必被博弈，就设计博弈成本高到不划算的评估体系。先说清天花板在哪，再说在天花板之下能做什么。</p>
<p><strong>天花板是一条定理。</strong>Gibbard-Satterthwaite 定理证明，在一般域上不存在既有效又完全防操纵的聚合规则；Skalse 等 2022 年的机器学习版同向：除平凡情形外，任何一对不完全对齐的奖励几乎必然可被博弈。追求「不可被博弈的 eval」在数学上是死路。可行的目标只有四条有可证代价的退路：限制适用域、接受近似（把可博弈程度压到某个界内）、改变结构（比如让被评者无法给自己打分）、以及抬高博弈成本。这一节做的是最后一条。</p>` },

    { t: "module", module: "sandbox:design-robust-eval", title: "抗博弈 eval 构建器", config: {} },

    { t: "prose", html: `
<p>沙盒里的关键规律：没有单一防御能挡住一切，是多层组合把博弈成本顶到不划算。每层防御堵一条特定通道：</p>
<ul>
<li><strong>held-out 与动态轮换</strong> 堵题目过拟合与污染（<code>Y02</code>、<code>Y03</code>）：让优化循环永远看不到、追不上。诚实提示：2026 年的系统研究显示藏题并不能阻止饱和，它买的是时间不是免疫。</li>
<li><strong>配对指标制衡</strong> 堵维度窄化与风格刷分（<code>B09</code>、<code>Y08</code>）：几个互相拉扯的指标难被同时满足，也缓解 surrogation（<code>B07</code>）。上限来自 <code>B10</code>：只要真实价值是高维隐含的，任何有限维加权组合都有残余对齐缺口。</li>
<li><strong>eval 与优化解耦</strong> 堵直接顶着边界爬（<code>G02</code>）：eval 只诊断，不驱动改模型。</li>
<li><strong>随机人工抽检</strong> 堵不可测部分被无视（<code>B05</code>）：刻意去看 rubric 覆盖不到的维度。</li>
<li><strong>承认容量约束</strong> 堵真实挤占（<code>B09</code>）：别把全部优化压力压在一个窄 eval 上。</li>
<li><strong>评分逻辑对被评者不可见</strong>：METR 2025 年测得，同一模型在能看到评分函数的环境里作弊率是看不到时的 43 倍。这条有微观基础（<code>B12</code> 的策略性不透明是能从一阶条件推出的最优机制），不是行政偷懒。</li>
</ul>` },

    { t: "callout", variant: "intuit", html: `
<p><strong>最有价值的一条心法，不是「把作弊弄贵」，而是「先降低利益冲突」。</strong>cheap talk 传统证明，维持诚实所需的信号成本正比于评估者与被评估者之间的利益冲突：冲突为零时诚实免费，冲突越大才越需要昂贵。所以顺序应该是先想办法对齐利益（让 eval 的设计者自己要用这个 agent、让团队的奖励绑在真实效果而非榜面分上），再决定还需要多少成本去锁住剩余的冲突。另一条来自 <code>Y10</code> 的硬定理提醒你别指望纯技术方案：想让 eval 激励真改进而非刷分，必须解一个因果推断问题，弄清哪些可测行为因果地通向真实能力。最接近可行的做法是把评估当一连串干预：改变 eval 的构成，观察生态怎么响应，用响应反推因果结构。</p>` },

    { t: "callout", variant: "myth", html: `
<p><strong>抗博弈手段自己也会被 Goodhart，这不是俏皮话。</strong>三个实例：Dodd-Frank 要求证券化机构自留 5% 风险以保证切身利益，实践中这份风险可以被对冲掉；本意作为诊断探针的指标，一旦进了年度考核就退化回仪表盘（Klein 2025 对 NHS 的实证）；用来抓 gaming 的思维链监控，一旦纳入优化压力，模型就学会隐藏意图（<code>Y05</code>）。<strong>抗博弈是需要持续维护的制度纪律，不是一次性设计。</strong>把这条写进你的日程，而不只是写进文档。</p>` },

    { t: "sources", items: [
      `Gibbard-Satterthwaite 定理；Skalse et al. (2022). "Defining and Characterizing Reward Hacking." NeurIPS.`,
      `Bevan & Hood (2006)；Carter (1991)（tin openers vs dials）；METR (2025)（43× 可见度效应）。`,
      `Miller, Milli & Hardt (2020)（因果建模定理）；Crawford & Sobel (1982)（成本正比于冲突）。`,
      `综合 <code>research/06, 10, 14</code> 与 <code>research/deep/D7</code> §5。`
    ] }
  ]
};
