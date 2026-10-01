# CSCI3230 L01 · Part 3/5 Today’s AI

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2026T1
> 本讲：L01，第 3 部分 / 共 5 部分 · 原件 [L01-Introduction-2026T1.pdf](../课件/L01-Introduction-2026T1.pdf) p.36–50
> 定位：把应用名称拆成任务：系统看到了什么、要输出什么、输出为什么有用。
> 前后：上一份 [What is AI](L01-P2-什么是AI.md) · 下一份 [Fundamental concepts in AI](L01-P4-学习与评价.md)

p.36 分节页。

### AI 的应用范围（p.37–39）

图（p.37）：Scope of Artificial Intelligence。  
元素：中央 AI 向外连接图像、语言、音频、机器人、模拟、图分析、翻译和虚拟助手等标签。  
看什么：这是一张应用地图；其中既有方法名称也有应用名称，不是互斥分类树。

> **p.38** AI in healthcare is applied to clinical practice such as disease diagnosis, treatment protocol development, drug design, bioinformatics, personalized medicine, patient monitoring.

p.38 的共同点是从数据辅助形成判断或方案：诊断、治疗、药物与监测分别对应不同输出。这里描述课程中的应用，不是临床使用建议。p.39 的自动驾驶例子连接“理解环境”和“路径规划”：看懂附近有什么，是决定下一步怎么走的输入，两项能力不能混作一次图像分类。

### 机器人、科学与语言（p.40–42）

> **p.40** It studies techniques allowing a robot to acquire novel skills or adapt to its environment through learning algorithms.

p.40 的机器人学习强调适应环境与获得技能；机器人外形本身不能证明它具备学习能力。p.41 将 AI 放入数学、生物、化学、物理和金融研究，说明模型也可以是探索规律的工具。

> **p.42** how to program computers to process and analyze large amounts of natural language data.

p.42 将自然语言处理（NLP）定位为计算机与人类语言的交叉问题。**补充**：同为文本输入，输出可能是类别、翻译或新文本，因而不能因为输入形式相同就选择同一个损失和评价指标。此补充服务于 p.42 的任务理解。

### 游戏与艺术（p.43–44）

p.43 的游戏 AI 主要举 NPC 的响应、适应与智能行为；需要区分“游戏里预设的规则”和“能够根据状态选择的行动”。p.44 明确 AI 艺术既包括系统生成，也包括人机协作，不限于完全自主创作。读应用例子时，把行业名继续具体化成可观察的输出，才能与后面的模型连接。

**考试角度**：（A 级，扫描件，视觉读取：ESTR-Final-Exam-2023T1.pdf Part II Q10、ESTR-Final-Exam-2024T1.pdf Part II Q3、2025 官方节选 Part II Q2）考过列应用领域并逐一给具体例子；本节 p.38–44 提供对应素材。演练<a name="r-a1"></a>[见附录 A1](#a1)。

### 产业链图与市场资料的读法（p.45–47）

图（p.45）：AI 产业链六层。  
元素：Chips & hardware、Platform & infrastructure、Frameworks & algorithms、Enterprise Solutions、Vertical Industry solutions、Corporates。  
看什么：从芯片、算力、工具到企业和行业使用，同一种产品往往依赖多层供给；公司图标是讲义举例，不是本轮投资或产品推荐。

图（p.46）：AI 50 2024 分类图。  
元素：Apps、Infrastructure，及消费者、企业、行业、推理提供者、模型与数据算力等栏目。  
看什么：这是标有 2024 年的产业快照，不是 2026 年的实时排行。

p.47 原件给出 2023 年市场额 196.63 billion USD，以及 2024–2030 的预计年复合增长率 36.6%。前者是课件引用的估计，后者是预测，不能把预测说成已经发生的事实。

**补充·算一遍**：只演示课件增长率的含义，假设基数为 p.47 的 196.63，并连续按 36.6% 增长两期，则第一期 $196.63\times1.366=268.59558$，第二期 $268.59558\times1.366=366.90156228$，单位均为 billion USD。这是按同一增长率的复利计算，不是对某一实际年份的新增估计。

### 用户规模、职业与个人目标（p.48–50）

p.48 比较课件记录的 2023 年 11 月一亿周活与 2024 年 8 月两亿周活，后者是前者的 2 倍，增加 100%；不要把“增加一亿”与“变成一亿”混淆。其后“2 months reach 100 million user mark”未在本页明确同一统计口径，不能据此拼成一条连续周活增长曲线。

p.49 列 AI 企业、大学、制造、金融等职业方向，作用是展示知识迁移范围，不是对当下岗位供需作保证。p.50 问课程、研究、职业三种个人意义；这是反思题，没有唯一标准选择。

**补充：把应用描述改写成问题定义。** 阅读 p.38–44 时，每个行业都可以按“可观察输入 → 要求的输出 → 如何判断输出是否有效”拆开。医疗图像检测的输入是影像，输出可能是病灶区域，评价要关注漏检与误报；语言系统输入文本，输出回复，评价不能直接套用房价的平方误差；机器人输入环境观测，输出动作，还要考虑动作如何改变下一次观测。换行业只是表层差异，输出结构与反馈方式才决定后面该用什么模型。

课件 p.47–48 的市场规模、用户规模是课件引用的历史数据，不是本轮重新调查的 2026 年统计。增长率描述某一段时间的变化，不证明每家公司或每个应用都有同样增长；行业图展示参与者与层次，也不构成投资或就业保证。阅读这些页的用途是理解研究为何受到关注，不是从一张宣传图推出技术有效性。

## 本讲核心考点

- 应用回答须同时给领域与具体任务（p.38–44，A 级：2023/2024/2025 简答题）。
- 产业和用户数字按课件标注年份读取，不当实时事实（p.45–48，C 级）。

## 附录

### A1 作业/往年题演练（非讲义内容）：领域与具体例子

<a name="a1"></a>**题面**（ESTR-Final-Exam-2023T1.pdf · Part II Q10 · p.5；扫描件，视觉读取）

> **p.5** 10. State two application fields of AI and give a concrete example for each field. (4%)

先区分“领域”和“例子”：医疗是领域，CT 肺结节检测才是具体任务。按讲义 p.38 与后文 p.55，可以说明输入 CT、输出疑似结节位置；自动驾驶是第二领域，按 p.39 与 p.56，可以说明用道路图像定位行人与车辆。两例都有对象和输出，不只堆术语。

**题面**（ESTR-Final-Exam-2024T1.pdf · Part II Q3 · p.6；扫描件，视觉读取）

> **p.6** 3. State three application fields of AI and give a concrete example for each field. (6%)

三项分别沿 p.38 医疗、p.39 自动驾驶、p.42 语言展开：CT 肺结节定位、道路行人车辆识别、机器翻译。第三项的输入是源语言文本、输出是目标语言文本；因此不是把“医疗 AI、医学 AI、健康 AI”当三个领域。

**题面**（Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf · Part II Q2 · PDF p.2；扫描件，视觉读取）

> **p.2** 2. (6%) State three application fields of AI and give a concrete example for each field.

本题也要求三组一一对应关系。可以选医疗中的肺结节定位、机器人中的自动翻饼、艺术中的辅助短片创作，分别对应 p.38、p.40、p.44，具体数据与技能在 p.55、p.58 继续展开。验收一遍：每项既有独立领域，又有在该领域里能辨认的任务。ESTR 官方节选同题同文。

[回到正文：游戏与艺术](#r-a1)

## 来源与证据

- 2026-10-01 加深版：按本学期清洗后 PDF 核对；正文页码均为去除动画中间页后的 PDF 页号。 原始 PDF 90 页，阅读版 75 页；[逐页映射](核验/L01-2026页码.csv)、[清洗核验](核验/L01-2026清洗.json)。

- 原件：[L01-Introduction-2026T1.pdf](../课件/L01-Introduction-2026T1.pdf)，p.36–50；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
