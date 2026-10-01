# CSCI3230 L01 · Part 2/5 What is AI

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2026T1
> 本讲：L01，第 2 部分 / 共 5 部分 · 原件 [L01-Introduction-2026T1.pdf](../课件/L01-Introduction-2026T1.pdf) p.24–35
> 定位：区分 AI、机器学习与深度学习，理解“智能”定义为何同时涉及目标、行为和学习能力。
> 前后：上一份 [Course information](L01-P1-课程安排.md) · 下一份 [Today’s AI](L01-P3-AI应用.md)

p.24 分节页。

### 从“表现得聪明”到智能体（p.25–27）【新】

> **p.25** AI is a system that acts intelligently: What it does is appropriate for its circumstances and its goal

p.25 的关键是 **circumstances 与 goal**：评价行为需同时知道环境和目标。只看输出像不像人，不能判断它是否解决任务。“智能体”指能在环境中作出行动的计算对象，研究既包括造出它，也包括分析其行为。

> **p.26** What we want is a machine that can learn from experience,

p.26 借 Turing 的话把注意力转向经验：程序不是每遇到一个新样本就由人追加一条规则，而是让过去的经验影响后续行为。p.27 的 Dartmouth 描述进一步列出语言、抽象、概念、解决问题及自我改进；AI 的研究目标因此远宽于单一预测任务。这些引文在这里是讲义观点的锚，不把课件二手引文当作本轮独立史料考证。

**补充：环境、目标、行为为什么缺一不可。** 同样一个“向左转”的输出，在道路左侧有障碍时可能很差，在右侧有障碍时可能合理。评价它需要环境信息；即使环境相同，“尽快到达”和“尽量少耗电”也可能选择不同路线，所以还需要目标。智能体不一定长得像机器人：接收输入、依据内部机制产生行动的程序也能放入这个概念。这里不是给“智能程度”设一个万能分数，而是说明不能脱离任务评价行为。

“学习经验”还需要区分**程序结构**与**程序中可调整的参数**。例如训练算法的步骤可由人写死，但其中的权重由样本决定；权重变化会改变下一次预测。因而“没有逐条手写预测规则”并不等于“没有人写程序”，也不等于“计算机自己决定了所有目标”。

### 研究愿景（p.28–29）

p.28 引用“work on it together for a summer”，呈现早期研究者的乐观。p.29 的 Hinton 引语强调借鉴大脑计算；这是一种研究路线，不等于 AI 的定义要求复制生物大脑。

### 不同能力与应用愿景（p.30–31）

图（p.30）：Bengio 演讲截图中的 System 1 / System 2。  
元素：左框列直觉、快、无意识；右框列慢、逻辑、序列、有意识、规划和推理。  
看什么：图把快速模式识别与逐步推理作概念区分，并展示截图当时对深度学习发展方向的看法；它不是两类算法的完备数学分类。

图（p.31）：LeCun 演讲截图 Benefits of AI。  
元素：Education、Connecting People、Science & Mathematics、Arts 四组例子。  
看什么：同一类计算技术可以服务多个目标，“AI 的能力”与“采用 AI 的行业”属于不同层次。

p.30 的快与慢是在比较处理方式：快速辨认熟悉模式，和有步骤地维持中间状态、检查约束，不是同一件事。读这张图时要分开“截图作者当时对研究方向的判断”与“任何具体系统今天的能力”。这张历史截图本身不能证明当下某个模型只会一种能力；本伴读也不借截图推断最新产品表现。

p.31 则换了另一个问题：技术被用于什么社会活动。教育、翻译、科学、艺术是应用目的，不是四种互不相交的模型结构。把两页连起来看，前页讨论能力，后页讨论用途；同一种模型可以服务不同用途，同一种用途也可能组合多种模型。

### 专用能力、通用能力与包含关系（p.32–33）【新】

> **p.32** Ability of an intelligent agent to understand or learn any intellectual task that a human-being can.

p.32 用这句话描述 **人工通用智能（AGI）**，并把视觉、语言、医疗、驾驶、机器人等具体任务放在 narrow intelligence 下。判别关键是任务范围：某项任务做得好，并不能单凭这一点证明能学习所有人类智力任务。

> **p.33** Machine learning is a branch of AI, ML algorithms build a model based on “training data” in order to make predictions without being explicitly programmed to do so.

p.33 给出包含关系：AI 最大，ML 是其中通过训练数据构造模型的一支，DL 是 ML 中以神经网络为形式的一类模型。“without being explicitly programmed”针对逐条预测规则，不表示训练程序、模型结构和目标函数不需要设计。

示意图（p.33，我画的，非讲义原图）：范围关系

```text
AI
└─ Machine learning
   └─ Deep learning
```

**考试角度**：（C 级 通识）常见考法是判断“所有 AI 都依赖深度学习”是否成立；包含关系只允许从 DL 推到 ML、再推到 AI，不能反推。

**补充：包含关系不等于能力排行榜。** “属于 DL”只说明模型家族，不自动推出它比所有非 DL 方法更准确或更适合小数据。AI 是上位研究范围；ML 是利用数据学习规律的方法范围；DL 是其中的一类表示与模型。若一个系统把搜索和神经网络结合起来，整个系统仍是 AI，但不能要求其每一部分都必须是深度学习。

ANI 与 AGI 讨论的又是**能力覆盖范围**，与上述方法分类是不同坐标轴。一个识别肺结节的深度网络可以在其任务上很好，但这并不构成它能够学习所有人类智力任务的证据。记这两套分类时，前者问“怎么做”，后者问“能覆盖多少种任务”；不要把“深”误读成“通用”。

### 历史线索与发展条件（p.34–35）

> **p.34** 1956: Dartmouth meeting: “Artificial Intelligence” adopted

p.34 按早期探索、乐观期、知识系统、统计方法、深度学习热潮串联发展。学习重点是每个阶段依靠什么方法，而不是把历史理解成后一种方法完全消灭前一种方法。课件将 Dartmouth 放在 1956 年；对应往年题的定位与演练<a name="r-a1"></a>[见附录 A1](#a1)。

图（p.35）：AI 发展时间图。  
元素：横轴时间，纵轴热点；曲线经历高峰和低谷，旁列专家系统、计算资源、互联网、大数据与深度学习。  
看什么：这是一幅定性历史示意，不应把曲线高度读成精确性能或投资额。p.35 强调数据量与计算能力推动新一波发展。

**考试角度**：（A 级，扫描件，视觉读取：Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf，Part II Q1，PDF p.2）考过 Dartmouth 年份，直接对应本节 p.34。

## 本讲核心考点

- AI、ML、DL 的包含方向（p.33，C 级）。
- ANI 与 AGI 按任务范围区分（p.32，C 级）。
- Dartmouth 年份 1956（p.34，A 级：2025 官方节选 Part II Q1）。

## 附录

### A1 作业/往年题演练（非讲义内容）：Dartmouth 年份

<a name="a1"></a>**题面**（Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf · Part II Q1 · PDF p.2；扫描件，视觉读取）

> **p.2** 1. (2%) In which year was the Dartmouth Conference held, an event commonly recognized as marking the origin of artificial intelligence?

题目问的是会议年份，不是图灵文章年份或第一台计算机年份。定位讲义 p.34 的 Dartmouth meeting，得到 **1956**。同目录 ESTR 官方节选此题相同，不重复统计为两道不同题。

[回到正文：历史线索与发展条件](#r-a1)

## 来源与证据

- 2026-10-01 加深版：按本学期清洗后 PDF 核对；正文页码均为去除动画中间页后的 PDF 页号。 原始 PDF 90 页，阅读版 75 页；[逐页映射](核验/L01-2026页码.csv)、[清洗核验](核验/L01-2026清洗.json)。

- 原件：[L01-Introduction-2026T1.pdf](../课件/L01-Introduction-2026T1.pdf)，p.24–35；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
