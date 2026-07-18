export default {
  id: "K00",
  blocks: [
    { t: "prose", html: `
<p>理论讲完，看这套机制在真实世界留下的爪印。这是一个跨领域案例库，每条都有据可查，每条都标注了它体现的机制。按机制筛选，你会看到同一套逻辑在完全不同的领域一遍遍重演。</p>
<p>先给一条贯穿全库的纪律：反应性不等于纯造假。库里既有刑事定罪的造假案，也有「真实改善与博弈并存」的案例，后者恰恰是最难处理、也最诚实的一类。把所有案例一面倒讲成失败，是对证据的不忠。</p>` },

    { t: "module", module: "explorable:case-vault", title: "跨领域案例库（按机制筛选）", config: {
      mode: "cards",
      cards: [
        { tag: "大学排名", title: "Columbia 造假", html: "2022 年本校数学教授 Michael Thaddeus 揭发 Columbia 上报 U.S. News 的数据造假（班级规模、师资等），学校一度跌出榜单后承认问题。", mech: "直接造假" },
        { tag: "大学排名", title: "Temple / Porat 刑事定罪", html: "Temple 商学院多年虚报 MBA 排名数据，院长 Moshe Porat 被联邦<strong>刑事定罪</strong>，2025 年最高法院拒审终审。排名造假罕见地进了监狱。", mech: "直接造假" },
        { tag: "大学排名", title: "USC 教育学院选择性漏报", html: "Jones Day 独立调查坐实：2013 至 2021 年，USC Rossier 把分数较低的 EdD 学生 GRE 数据<strong>排除在申报之外</strong>，制造「博士项目极具选择性」的假象。2022 年永久退出该排名。", mech: "选择性披露" },
        { tag: "国家排名", title: "Doing Business 停刊", html: "世界银行营商环境排名被曝高层<strong>施压修改</strong>中国、沙特等国数据，独立调查后世行 2021 年<strong>停刊</strong>整个榜单。继任指数 B-READY 上线后，2025 年底已有政府公开质疑其评级。反应性从秘密俘获退回公开质疑，动机结构没变。", mech: "政策施压" },
        { tag: "企业", title: "Wells Fargo 假账户", html: "「交叉销售数」成为被激励的单一目标，员工开了约 350 万个未授权账户，指标替换了它本要代表的客户关系（surrogation），30 亿美元和解。", mech: "反常激励" },
        { tag: "医疗", title: "外科医生避重症", html: "公开外科医生成绩单后，医生为保住成功率<strong>拒收高风险病人</strong>，救不了最需要救的人（Dranove et al. 2003 的因果证据）。", mech: "选择效应" },
        { tag: "教育", title: "亚特兰大改卷案 (2011)", html: "为达标 NCLB 考试指标，多所学校组织教师集体涂改学生答题卡，35 人被起诉，11 人以 RICO（反勒索法）定罪。Campbell 定律的教科书现场。", mech: "直接造假" },
        { tag: "警务", title: "CompStat 犯罪降级", html: "纽约警方把重罪<strong>降级</strong>为轻罪以做出下降曲线（Eterno-Silverman 的内部人调查）。Eckhouse 2022 年的跨城因果研究：采用该体系后每城年均多出约 3500 起轻微逮捕，重罪并未真正下降。", mech: "分类操纵" },
        { tag: "公共管理", title: "NHS 等待时间（关键反证）", html: "英国 NHS 的四小时目标既催生了 clock-stopping 等操纵，<strong>也真实缩短了等待</strong>：Propper 等以苏格兰为对照的 diff-in-diff 证明英格兰长期等待比例确实下降。真实改善与 gaming 并存，这是反应性不等于纯造假的最佳教材。", mech: "混合(改善+博弈)" },
        { tag: "金融", title: "评级膨胀的因果证据", html: "2008 前 issuer-pays 结构下的评级膨胀已从叙事升级为计量：Griffin-Tang 2012 证明大量 AAA 实为 BBB 级资产支撑，Efing-Hau 2015 证明评级机构给大客户系统性开后门。", mech: "利益冲突" },
        { tag: "消费评分", title: "Yelp 因果效应", html: "Michael Luca 的研究：Yelp 评分每涨一星，餐厅营收显著上升。评分不只反映生意，评分<em>制造</em>生意，于是招来刷评产业。", mech: "自我实现" },
        { tag: "AI 评测", title: "SWE-bench 三代崩塌", html: "原版 32.67% 的「成功」补丁涉及答案泄漏；人工校验的 Verified 被查出至少 16.4% 任务缺陷、2026 年被 OpenAI 弃用；抗污染替身 Pro 不到一年也被判约 30% 损坏并撤回推荐。造新基准的速度追不上它被玩坏的速度。", mech: "过拟合+污染" },
        { tag: "计划经济", title: "苏联钉子厂", html: "按数量考核就造无数小钉子，按重量考核就造几个巨钉。<strong>注：此为寓言</strong>，无一手史料，机制真实但别当史实引用。", mech: "反常激励" },
        { tag: "殖民治理", title: "河内老鼠 (1902)", html: "法属河内凭鼠尾悬赏灭鼠，出现无尾活鼠与养鼠场（Michael Vann，有档案）。真正有史料的「眼镜蛇效应」。", mech: "反常激励" }
      ]
    } },

    { t: "callout", variant: "applied", html: `
<p><strong>把你自己的 eval 事故加进这个库。</strong>「eval 前后 skill 性能毫无区别，只是机械地 fit 了 eval」是一条一流的案例，机制标注是「过拟合加直接顶着指标优化」。它和 Columbia 造假、Wells Fargo 假账户、河内老鼠属于同一个物种。认出你的问题属于哪个机制家族，就知道该翻回哪一节找对策：直接造假查审计与验证，选择效应查风险调整，反常激励查奖励设计，混合型最难，需要先把真实改善那部分量出来再谈治理。下一节把它变成一张清单。</p>` },

    { t: "sources", items: [
      `完整案例与来源（110+ 条）见 <code>research/04-cases-across-domains.md</code> 与 <code>research/14</code>。`,
      `新增案例与因果实证（USC、亚特兰大、CompStat、NHS 对照、评级计量）见 <code>research/deep/D3</code>。`
    ] }
  ]
};
