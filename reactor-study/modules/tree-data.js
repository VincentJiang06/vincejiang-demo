/* REACTOR · tree-data.js — 天赋树唯一数据源（节点/坐标/前置/分支）。
   首页全屏树与课程页左侧迷你树共用。改节点即改这里。 */
export const TREE = {
 "nodes": [
  {
   "id": "N00",
   "zh": "测量即干预",
   "en": "To Measure Is To Intervene",
   "branch": "root",
   "x": 0,
   "y": 0,
   "prereqs": [],
   "hook": "你以为你在读数，其实读数在读你。",
   "built": true
  },
  {
   "id": "R01",
   "zh": "反应性",
   "en": "Reactivity",
   "branch": "red",
   "x": -830,
   "y": 210,
   "prereqs": [
    "N00"
   ],
   "hook": "排名不只反映现实，它参与重新制造现实。",
   "built": true
  },
  {
   "id": "R02",
   "zh": "自我实现预言",
   "en": "Self-Fulfilling Prophecy",
   "branch": "red",
   "x": -662,
   "y": 210,
   "prereqs": [
    "N00"
   ],
   "hook": "一个假定义，如何长成真事实。",
   "built": true
  },
  {
   "id": "R11",
   "zh": "霍桑效应及其证伪",
   "en": "Hawthorne & Its Debunking",
   "branch": "red",
   "x": -494,
   "y": 210,
   "prereqs": [
    "N00"
   ],
   "hook": "连反应性的招牌案例都没通过原始数据检验。",
   "built": true
  },
  {
   "id": "R03",
   "zh": "可通约化",
   "en": "Commensuration",
   "branch": "red",
   "x": -830,
   "y": 374,
   "prereqs": [
    "R01"
   ],
   "hook": "三页纸总结全美法学教育。",
   "built": true
  },
  {
   "id": "R04",
   "zh": "规训与监视",
   "en": "Discipline & Surveillance",
   "branch": "red",
   "x": -662,
   "y": 374,
   "prereqs": [
    "R01"
   ],
   "hook": "为什么组织缓冲不掉排名。",
   "built": true
  },
  {
   "id": "R05",
   "zh": "可读性",
   "en": "Legibility",
   "branch": "red",
   "x": -494,
   "y": 374,
   "prereqs": [
    "R02"
   ],
   "hook": "国家为了看清你，先把你改简单。",
   "built": true
  },
  {
   "id": "R06",
   "zh": "循环效应",
   "en": "Looping Effects",
   "branch": "red",
   "x": -746,
   "y": 466,
   "prereqs": [
    "R02"
   ],
   "hook": "分类会改变被分类的人。",
   "built": true
  },
  {
   "id": "R08",
   "zh": "反身性",
   "en": "Reflexivity (Soros)",
   "branch": "red",
   "x": -578,
   "y": 466,
   "prereqs": [
    "R02"
   ],
   "hook": "价格反映基本面，也塑造基本面。",
   "built": true
  },
  {
   "id": "R10",
   "zh": "马太效应与人工市场",
   "en": "Matthew & MusicLab",
   "branch": "red",
   "x": -494,
   "y": 630,
   "prereqs": [
    "R02"
   ],
   "hook": "最好的歌，命运却看运气。",
   "built": true
  },
  {
   "id": "R07",
   "zh": "表演性",
   "en": "Performativity",
   "branch": "red",
   "x": -830,
   "y": 630,
   "prereqs": [
    "R03",
    "R06"
   ],
   "hook": "理论不是照相机，是发动机。",
   "built": true
  },
  {
   "id": "R09",
   "zh": "审计社会",
   "en": "Audit Society",
   "branch": "red",
   "x": -662,
   "y": 630,
   "prereqs": [
    "R03",
    "R04"
   ],
   "hook": "让组织可审计，本身成了目的。",
   "built": true
  },
  {
   "id": "B01",
   "zh": "Goodhart 定律",
   "en": "Goodhart's Law",
   "branch": "blue",
   "x": 0,
   "y": 210,
   "prereqs": [
    "N00"
   ],
   "hook": "一条小小脚注如何统治了世界。",
   "built": true
  },
  {
   "id": "B02",
   "zh": "Campbell 定律",
   "en": "Campbell's Law",
   "branch": "blue",
   "x": -168,
   "y": 374,
   "prereqs": [
    "B01"
   ],
   "hook": "警示指标的人，本是测量的旗手。",
   "built": true
  },
  {
   "id": "B03",
   "zh": "Lucas 批判",
   "en": "Lucas Critique",
   "branch": "blue",
   "x": 0,
   "y": 374,
   "prereqs": [
    "B01"
   ],
   "hook": "你一用规律，人就改行为。",
   "built": true
  },
  {
   "id": "B04",
   "zh": "眼镜蛇效应",
   "en": "Cobra Effect",
   "branch": "blue",
   "x": 168,
   "y": 374,
   "prereqs": [
    "B01"
   ],
   "hook": "悬赏捕蛇，市民开始养蛇。",
   "built": true
  },
  {
   "id": "B05",
   "zh": "McNamara 谬误",
   "en": "McNamara Fallacy",
   "branch": "blue",
   "x": -168,
   "y": 466,
   "prereqs": [
    "B01"
   ],
   "hook": "不能测量的，最后被宣布不存在。",
   "built": true
  },
  {
   "id": "B08",
   "zh": "Goodhart 四型",
   "en": "Goodhart Taxonomy",
   "branch": "blue",
   "x": 0,
   "y": 466,
   "prereqs": [
    "B01"
   ],
   "hook": "同一句格言，四种完全不同的机制。",
   "built": true
  },
  {
   "id": "B11",
   "zh": "必要多样性",
   "en": "Requisite Variety",
   "branch": "blue",
   "x": 168,
   "y": 466,
   "prereqs": [
    "B01"
   ],
   "hook": "只有多样性能消灭多样性。",
   "built": true
  },
  {
   "id": "B06",
   "zh": "奖励A却指望B",
   "en": "Rewarding A, Hoping for B",
   "branch": "blue",
   "x": -252,
   "y": 630,
   "prereqs": [
    "B04"
   ],
   "hook": "希望教学好，却只奖励发表。",
   "built": true
  },
  {
   "id": "B07",
   "zh": "代理指标替代",
   "en": "Surrogation",
   "branch": "blue",
   "x": -84,
   "y": 630,
   "prereqs": [
    "B06"
   ],
   "hook": "为什么当事人不觉得自己在作弊。",
   "built": true
  },
  {
   "id": "B12",
   "zh": "委托代理",
   "en": "Principal-Agent",
   "branch": "blue",
   "x": 84,
   "y": 630,
   "prereqs": [
    "B04"
   ],
   "hook": "你要好 agent，优化器只要 eval 通过。",
   "built": true
  },
  {
   "id": "B13",
   "zh": "优化者诅咒",
   "en": "Optimizer's Curse",
   "branch": "blue",
   "x": 252,
   "y": 630,
   "prereqs": [
    "B08"
   ],
   "hook": "选中的那个，真值期望低于它的估计。",
   "built": true
  },
  {
   "id": "B09",
   "zh": "多任务代理",
   "en": "Multitask Agency",
   "branch": "blue",
   "x": -84,
   "y": 840,
   "prereqs": [
    "B06"
   ],
   "hook": "教师为什么拿固定工资：一条定理。",
   "built": true
  },
  {
   "id": "B10",
   "zh": "绩效测量扭曲",
   "en": "Baker Distortion",
   "branch": "blue",
   "x": 84,
   "y": 840,
   "prereqs": [
    "B09"
   ],
   "hook": "便宜、低噪、可控，仍可能是坏指标。",
   "built": true
  },
  {
   "id": "Y01",
   "zh": "过拟合",
   "en": "Overfitting",
   "branch": "yellow",
   "x": 662,
   "y": 210,
   "prereqs": [
    "N00"
   ],
   "hook": "训练集就是你的 eval。",
   "built": true
  },
  {
   "id": "Y02",
   "zh": "自适应过拟合",
   "en": "Adaptive Overfitting",
   "branch": "yellow",
   "x": 494,
   "y": 420,
   "prereqs": [
    "Y01"
   ],
   "hook": "你反复看同一个测试集，就已经在训练它。",
   "built": true
  },
  {
   "id": "Y03",
   "zh": "基准污染与饱和",
   "en": "Contamination & Saturation",
   "branch": "yellow",
   "x": 662,
   "y": 420,
   "prereqs": [
    "Y01"
   ],
   "hook": "题被吃进训练集，题本身也可能是坏的。",
   "built": true
  },
  {
   "id": "Y04",
   "zh": "奖励破解",
   "en": "Reward Hacking",
   "branch": "yellow",
   "x": 830,
   "y": 420,
   "prereqs": [
    "B01"
   ],
   "hook": "划船 AI 不跑圈，原地打转刷分。",
   "built": true
  },
  {
   "id": "Y05",
   "zh": "最近未堵策略",
   "en": "Nearest Unblocked Strategy",
   "branch": "yellow",
   "x": 494,
   "y": 584,
   "prereqs": [
    "Y04"
   ],
   "hook": "修 eval 的方式为什么总是机械的。",
   "built": true
  },
  {
   "id": "Y06",
   "zh": "内对齐与 mesa 优化",
   "en": "Mesa-Optimization",
   "branch": "yellow",
   "x": 662,
   "y": 584,
   "prereqs": [
    "Y04"
   ],
   "hook": "你训练出的，可能是另一个优化器。",
   "built": true
  },
  {
   "id": "Y07",
   "zh": "奖励模型过优化",
   "en": "RM Overoptimization",
   "branch": "yellow",
   "x": 830,
   "y": 584,
   "prereqs": [
    "Y04",
    "B08"
   ],
   "hook": "Goodhart 定律最干净的一条实验曲线。",
   "built": true
  },
  {
   "id": "Y10",
   "zh": "策略性分类",
   "en": "Strategic Classification",
   "branch": "yellow",
   "x": 494,
   "y": 676,
   "prereqs": [
    "B12",
    "Y01"
   ],
   "hook": "公布评分规则，人就照着改自己。",
   "built": true
  },
  {
   "id": "Y11",
   "zh": "排行榜幻觉",
   "en": "Leaderboard Illusion",
   "branch": "yellow",
   "x": 662,
   "y": 676,
   "prereqs": [
    "Y03",
    "R10"
   ],
   "hook": "发布即登顶，分里有多少是押题？",
   "built": true
  },
  {
   "id": "Y12",
   "zh": "评估觉察",
   "en": "Evaluation Awareness",
   "branch": "yellow",
   "x": 830,
   "y": 676,
   "prereqs": [
    "R11",
    "Y04"
   ],
   "hook": "被观察的模型，不是真实的模型。",
   "built": true
  },
  {
   "id": "Y08",
   "zh": "谄媚",
   "en": "Sycophancy",
   "branch": "yellow",
   "x": 578,
   "y": 840,
   "prereqs": [
    "Y07"
   ],
   "hook": "奖励人类满意，得到讨好。",
   "built": true
  },
  {
   "id": "Y09",
   "zh": "表演性预测",
   "en": "Performative Prediction",
   "branch": "yellow",
   "x": 746,
   "y": 840,
   "prereqs": [
    "R07",
    "Y04"
   ],
   "hook": "预测改变分布：反应性的数学化。",
   "built": true
  },
  {
   "id": "C06",
   "zh": "案例库",
   "en": "Cross-Domain Case Vault",
   "branch": "converge",
   "x": 0,
   "y": 1050,
   "prereqs": [
    "R01",
    "B04"
   ],
   "hook": "从 US News 到 Doing Business 到刷单。",
   "built": true
  },
  {
   "id": "C01",
   "zh": "概念地图：五个近邻",
   "en": "Concept Map",
   "branch": "converge",
   "x": -168,
   "y": 1260,
   "prereqs": [
    "R07",
    "R08",
    "R09"
   ],
   "hook": "不是一个东西的五个名字。",
   "built": true
  },
  {
   "id": "C04",
   "zh": "诚实信号",
   "en": "Honest & Costly Signals",
   "branch": "converge",
   "x": 0,
   "y": 1260,
   "prereqs": [
    "B12",
    "B01"
   ],
   "hook": "难伪造的信号才诚实，但「昂贵」够吗？",
   "built": true
  },
  {
   "id": "C05",
   "zh": "解耦：Deming 与 POSIWID",
   "en": "Decoupling",
   "branch": "converge",
   "x": 168,
   "y": 1260,
   "prereqs": [
    "B11",
    "R09"
   ],
   "hook": "别让 eval 分数直接驱动迭代。",
   "built": true
  },
  {
   "id": "C02",
   "zh": "统一框架：七个杠杆",
   "en": "The Seven Levers",
   "branch": "converge",
   "x": -84,
   "y": 1470,
   "prereqs": [
    "R01",
    "B01",
    "Y04"
   ],
   "hook": "预测任何排名/评测的失真强度。",
   "built": true
  },
  {
   "id": "C03",
   "zh": "反 Goodhart 设计实验室",
   "en": "Anti-Goodhart Lab",
   "branch": "converge",
   "x": 84,
   "y": 1470,
   "prereqs": [
    "B11",
    "C02"
   ],
   "hook": "既然指标必被博弈，怎么设计才扛得住。",
   "built": true
  },
  {
   "id": "C07",
   "zh": "你的 Eval 事后剖析",
   "en": "Your Eval Postmortem",
   "branch": "converge",
   "x": 0,
   "y": 1680,
   "prereqs": [
    "C03",
    "C04",
    "Y02"
   ],
   "hook": "你发现 eval 前后毫无区别，这个发现比多数 eval 值钱。",
   "built": true
  }
 ],
 "bounds": {
  "minX": -950,
  "maxX": 950,
  "minY": -90,
  "maxY": 1790
 },
 "branchLabel": {
  "root": "ROOT",
  "red": "社会学谱系",
  "blue": "定律与形式",
  "yellow": "机器与前沿",
  "converge": "汇流"
 }
};
