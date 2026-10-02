# CSCI3230 ESTRTopics · Part 1/1 Reading / Project Topics

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：ESTRTopics，第 1 部分 / 共 1 部分 · 原件 [ESTR-Reading-and-Project-Topics-ESTR扩展.pdf](../教材/ESTR-Reading-and-Project-Topics-ESTR扩展.pdf) p.1–25
> 定位：补齐独立的 ESTR 选题讲义；解释选题框架，不把参考文献列表当作已读论文。

### 选题列表与共同问题（p.1–3）

这份材料是ESTR的阅读/项目方向介绍，不是CSCI3230初学者必须先读完的论文清单。PDF未在封面明确给出学期，本篇不根据其中最近的文献年份编造所属学期。p.1是封面，p.2列十一项：医疗、驾驶、机器人、科学、金融、语言、游戏、艺术、教育、人机协作、伦理。它比2025扩展导论的十项多金融，两个列表应按各自文件理解。

> **p.3** What is the problem?

> **p.3** How did the scientists solve (partially solve) the problem?

其余共同问题是为什么重要、AI怎样产生作用、接下来会怎样。第四问还具体包含方法、工作机制、测量、表现、验证。“部分解决”值得保留：阅读不要求把每篇论文说成最终答案，而是分清它解决了哪一块。

**补充贯穿示例：如何从领域走到可读问题。**“AI教育”太宽，可以先缩为“逐级提示能否帮助初学者在没有提示时完成同类题？”于是输入是学生当前步骤，输出是局部提示，评价要在撤掉帮助后进行。这样你知道该找什么研究，而不是看到任何教育AI标题都收进报告。

接着画一张很小的证据表：作者比较了什么；参与者或数据是谁；测量什么；结果支持什么；还没测什么。不要一开始就写长综述，先尝试把一项研究放进这五格。下面各方向的案例与检查问题都是补充阅读建议，不是推荐论文已经证明的结果。

**范围说明：**本篇核对的是选题PDF及其书目清单，未逐篇读取所列论文全文。保留的标题与年份按课件记录，不构成独立书目核验。不能仅凭标题补写论文机制、性能数字或结论。参考文献越新，也不自动代表证据越充分。

**补充 · 消融实验回答什么，又不能自动回答什么**（通识讲解；演示数据不属于原题）。

假设论文加入一个组件后指标提高。要支持“提高来自这个组件”，至少需要与去掉组件的版本比较，并尽可能保持数据划分、训练预算和评价流程一致；这种拆掉一部分看影响的比较叫消融。若新版本同时增加数据、训练轮数和模型大小，就无法只把变化归因于组件。

即使做了消融，一次随机运行的差异也可能受初始化或抽样影响。先看是否报告多次运行、波动范围和相同预算，再决定结论有多强。消融支持的是被比较设置下组件的作用，不自动证明作者给出的机制解释，更不证明所有任务都受益。引用时分别写“观察到了什么”和“作者如何解释”，读者才知道哪一句有直接实验支撑。

### 医疗：从任务到评价终点（p.4–5）

p.4列诊断、治疗方案、药物、生物信息、个体化医疗与监测。先停在任务层：“输入一张图像找可疑区域”和“改变病人的长期结局”不是同一个输出，验证难度也不同。

**补充拆解：**假设论文做图像检测。先找它使用什么图像、谁提供标注、模型输出位置还是类别，再找评价在哪些独立对象上进行。检测分数改善支持的首先是该测试条件下的检测表现；若要说临床使用后改善结果，还需另外的使用与结局证据。本篇不根据这个阅读例子给医疗建议。

**一个可动笔的小表：**第一列“论文实际测了什么”，第二列“我想声称什么”。若第一列只有图像准确率，第二列却写“减少所有医疗风险”，中间缺了推理和证据。先把第二列收窄，比用更多专业词填空更诚实。

p.5 推荐：Intelligent surgical workflow recognition for endoscopic submucosal dissection with real-time animal study (2023)；Towards a general-purpose foundation model for computational pathology (2024)；Artificial intelligence-enhanced echocardiography in cardiovascular disease management (2025)；AI in health and medicine (2022)；Application of large language models in medicine (2025)。

阅读这些题目时可以先选一个具体任务，不必同时覆盖全部医疗应用。书目里的foundation model等名字尚不熟悉也无妨，先读摘要确认输入、输出、验证，再决定要补哪些技术前置。

### 自动驾驶：感知与规划（p.6–7）

p.6区分理解周围与路径规划。**感知**回答“附近有什么、在哪里”，**规划**回答“现在往哪里、怎样行动”。前者输出可成为后者输入，却不是一个步骤。

**补充小场景：**路口有辆车被遮住一部分。感知输出可能不确定，规划则要在不确定信息下选择动作。论文若只在无遮挡图像上测对象识别，就不能直接证明它解决了这个路口场景。先把系统的哪一环被研究说清楚。

阅读实验时再区分游戏、仿真、真实环境。同样的“成功率90%”，如果一项来自固定仿真道路，另一项来自不同天气的真实道路，条件不同，数字不能不加说明地横向排名。90%是此处教学举例，不是下列论文结果。

p.7 推荐：Dense reinforcement learning for safety validation of autonomous vehicles (2023)；Integrating artificial intelligence in unmanned vehicles: navigating uncertainties, risks, and the path forward for the fourth industrial revolution (2025)；Outracing champion Gran Turismo drivers with deep reinforcement learning (2022)；Learning vision-based agile flight via differentiable physics (2025)；MetaDrive: Composing Diverse Driving Scenarios for Generalizable Reinforcement Learning (2022)。

**自查动作：**在论文中圈出测试环境，再列一个未覆盖但你关心的环境。把它写为待验证问题，而不是写成作者已经解决的能力。

### 机器人：技能与环境适应（p.8–9）

p.8把机器人学习定义为学习新技能或适应环境的方法。理解之前先认三样东西：**观测**是传感器当前告诉它什么，**动作**是它可以控制什么，**任务成功条件**是怎样才算做成。外形可爱或动作流畅本身都不是训练方法的证据。

**补充例子：**机械臂抓一个杯子，观测可能含相机图像与关节状态；动作可能是末端位置或关节控制量；成功可以先明确为抬起并保持，而不是“手靠近杯子”。把杯子换材质、换位置、换环境，分别改变了不同条件。说“能适应新环境”时，应说明到底新在哪里。

p.9 推荐：Surgical embodied intelligence for generalized task autonomy in laparoscopic robot-assisted surgery (2025)；Will generative AI transform robotics? (2024)；Lifelike agility and play in quadrupedal robots using reinforcement learning and generative pre-trained models (2024)；RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control (2023)；π0: A Vision-Language-Action Flow Model for General Robot Control (2024)。

不要只凭成功视频判断泛化：还要找试验次数、失败情况、训练与测试对象是否重合。一个演示可以说明存在一次成功，不自动给出成功概率。读者可以把“新物体”“新背景”“新动作组合”分三行记录，避免把一种变化的成功推广到所有变化。

### 科学：预测、发现与验证（p.10–11）

p.10提AI辅助生物、化学、物理研究。首先问模型正在输出预测，还是提出值得实验的候选；两者可能相关，但不能把推荐候选直接称为验证后的发现。

**补充小流程：**模型从已有材料数据中提出十个候选；研究者进一步计算筛选，再做独立实验。十是教学自取数字。模型筛选表现、后续计算支持、实验结果分别属于三层证据。若文章只完成第一层，报告也应停在相应层，不跳到“全部候选已经有效”。

这里容易出现一个误解：“准确率高，所以发现科学规律。”预测可利用相关性，科学解释还要看问题本身需要什么机制或验证。具体论文是否提出机制，必须读实际方法，不能仅凭AI应用领域推断。

p.11 推荐：Scientific discovery in the age of artificial intelligence (2023)；AI-powered omics-based drug pair discovery for pyroptosis therapy targeting triple-negative breast cancer (2024)；Highly accurate protein structure prediction with AlphaFold (2021)；Scaling deep learning for materials discovery (2023)；Autonomous chemical research with large language models (2023)。

**自查动作：**用不同颜色标论文中的“预测”“实验”“解释”。这些词如果被自己笔记写成同义词，就返回原文重新分开。

### 金融：任务与数据时间（p.12–13）

p.12列客户消费习惯分析与客服机器人，并不把金融AI限定为价格交易预测。前者可能发现模式，后者生成交互回答；两者所需数据和评价不同。本节是研究阅读框架，不给投资判断。

**补充时间例子：**若任务是在周一预测某一结果，输入只能包含当时可获得的信息。用周五才发布的统计值当周一特征，即使数据表按行随机划分，也泄漏了未来信息。模型分数可能很好，但并不对应真实预测场景。

若任务是客服，重点又不同：是否依据正确资料、能否完成询问、是否需要人工接手。不能拿一个交易预测的指标来概括客服质量。先辨任务，才知道论文该用哪一种对照。

p.13 推荐：Intelligent finance and change management implications (2023)；AI integration in financial services: a systematic review of trends and regulatory challenges (2025)；Revolutionizing finance with conversational AI: a focus on ChatGPT implementation and challenges (2025)；Artificial Intelligence in Finance: Valuations and Opportunities (2024)；AI in Finance: Challenges, Techniques, and Opportunities (2022)。

**自查动作：**给每个输入字段写一个“最早何时知道”的时间，再与预测时间比较；若是客服题目，则写清回答所依据的资料与评价标准。这些是核查方法，不是假设所列论文都存在相同问题。

### 语言：从自然语言到可计算表示（p.14–15）

p.14把自然语言处理放在人类语言与计算机的交叉处。第一步不是背Transformer，而是确定输出：情感类别、翻译文本、摘要、对话回复分别是不同任务。

**补充直觉：**计算机需要用数字表示词或片段，表示中哪些关系容易被模型使用，会影响后续处理。数字编号本身不等于词义：给“猫”编号7，“狗”编号8，不表示两者意义差1。后面embedding与注意力研究怎样用可学习表示处理关系；这里先知道为什么需要表示。

研究还可能改变不同阶段：预训练积累一般规律，适配或后训练调整任务行为，推理阶段决定当前怎么生成。某篇论文在哪一阶段做改进，应从方法中核对，不能把所有改进都叫“模型更大”。

p.15 推荐：Attention Is All You Need (2017)；Language Models are Few-Shot Learners (2020)；Improving Language Understanding by Generative Pre-Training (2018)；DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)；A Survey of Large Language Models（课件标 continuously refined）。课件的 GitHub 星数是旧快照，不能作为当前统计。

课件的GitHub星数是历史快照，不是模型质量指标。**自查动作：**写清论文输入、输出、训练信息、测试任务四项；若一个测试只查选择题正确率，就不要自动写成已经证明所有开放对话同样可靠。

### 游戏：行动与长期回报（p.16–17）

p.16以NPC智能行为介绍游戏AI；p.17的书目还涉及竞技、规划与学习模型。读游戏研究前，先了解玩家能观察什么、允许哪些动作、何时获得奖励、最后怎样判胜负。

**补充两步例子：**动作A先得1分，再有机会得5分；动作B立即得3分，之后结束。若目标是这两步总分且后果确定，A得6，B得3。这里用自取数字说明长期回报与立即奖励不同，并非下列论文实验。后果不确定时还要考虑相应概率；不能从这个确定例子直接推出实际最优策略。

比较模型时也要看是否拿到相同信息：一个看得到完整地图，一个只能看当前画面，任务难度可能不同。计算资源与可尝试次数也会影响公平比较。

p.17 推荐：AI in Human-computer Gaming: Techniques, Challenges and Opportunities (2023)；World and Human Action Models towards gameplay ideation (2025)；Mastering Atari, Go, chess and shogi by planning with a learned model (2020)；High-accuracy model-based reinforcement learning, a survey (2023)；Grandmaster level in StarCraft II using multi-agent reinforcement learning (2019)。

**自查动作：**把奖励规则、观察范围、对手条件写在分数旁边。脱离这三项的“某AI分数更高”，往往还不足以支持你想做的比较。

### 艺术：作品生成与人的参与（p.18–19）

p.18涵盖系统自主生成与人机协作创作，作品可为音乐、照片、视频。先区分“能生成”“人喜欢”“帮助创作者完成目标”，这三种主张需要不同证据。

**补充例子：**给两组人评价同一幅图，一组被告知来自AI，一组被告知来自人。评分差异可能涉及来源标签影响，不等于图像像素本身改变。这个例子只是帮助阅读实验设计，不断言所列某篇论文的具体结果。

若研究的是协作创作，还要看用户需要做多少选择、改写和筛选。把最终结果全部归于模型，可能漏掉人的贡献；只统计生成文件数量也不一定衡量作品质量。

p.19 推荐：Spontaneous emergence of rudimentary music detectors in deep neural networks (2024)；Bias against AI art can enhance perceptions of human creativity (2023)；A fuzzy control algorithm based on artificial intelligence for the fusion of traditional Chinese painting and AI painting (2024)；Art and the science of generative AI (2023)；Enhancing art creation through AI-based generative adversarial networks in educational auxiliary system (2025)。

**自查动作：**写清谁在评价、用什么问题或量表、是否知道作品来源、是否比较同样的任务。书目与教师材料以外的同学观点没有用作本篇学术来源。

### 教育：效果是否真正迁移到学习（p.20–21）

> **p.20** AI tutors could allow for students to get extra, one-on-one help.

could描述可能性，不是已经证明每个教学系统都有效。对这份课程笔记尤其关键的区别是：**系统给出答案**与**学生自己能做题**不是同一个成果。

**补充设计例：**学生练习时使用逐级提示，练习完成更快；之后撤掉提示，让他们做结构相近但数字不同的新题，再看能否独立解释。前一项测有帮助时的表现，后一项更接近是否学会迁移。若几天后再测，还能检查保持，而不是把即时熟悉当作长期掌握。

一个教学研究也要说明学习者基础。对熟练者有用的短提示，对第一次见公式的人可能仍然太快。阅读时找参与者、课程、比较条件与测试时点，不只看“使用AI后满意度提升”。

p.21 推荐：Education in the AI era: a long-term classroom technology based on intelligent robotics (2024)；Exploring the impact of artificial intelligence on higher education: The dynamics of ethical, social, and educational implications (2024)；A systematic review of AI-driven intelligent tutoring systems (ITS) in K-12 education (2025)；Navigating the landscape of AI literacy education: insights from a decade of research (2014–2024) (2025)；State of the art and practice in AI in education (2022)。

**小检查：**学生靠完整答案交对练习，能否单凭这一点证明已经学会？

:::hint 参考答案
不能。它证明在该帮助条件下完成了练习；独立学习效果需要撤去帮助后、最好在新的相似任务上评价。评价方式必须对应“学会”的主张。
:::endhint

### 人机协作：系统整体表现（p.22–23）

p.22关注人与机器作为多个参与者共同解决问题。模型单独强不代表组合必然强，因为人可能误读、过度相信或正确修正模型输出。研究对象是整个交互流程。

**补充数字例（自取）：**人在一项任务正确率70%，AI为80%，合作为75%。合作超过人单独，却未超过AI单独。因此“协作优于人”与“协作优于两种单独条件”是不同结论。数字本身还不提供样本量与不确定性，正式分析需继续核对实验。

这个例子也解释为什么至少需要人单独、AI单独、组合三个相关对照。若只报合作比人高，就不能进一步声称合作发挥了双方之长、超过所有替代方案。

p.23 推荐：Human–AI collaboration enables more empathic conversations in text-based peer-to-peer mental health support (2023)；When combinations of humans and AI are useful: A systematic review and meta-analysis (2024)；Examining human–AI collaboration in hybrid intelligence learning environments: insight from the Synergy Degree Model (2025)；How human–AI feedback loops alter human perceptual, emotional and social judgements (2024)；AI-enhanced collective intelligence (2024)。

**自查动作：**画出信息顺序：谁先给判断，谁看得到谁的结果，谁作最终决定。信息流不同，哪怕参与者与模型一样，也可能形成不同实验条件。

### 伦理：行为、责任与研究边界（p.24–25）

p.24把AI伦理分成人类设计、制造、使用系统的行为，以及机器行为本身。它提醒我们：结果由算法输出，也不能省略谁选择数据、谁设目标、谁决定部署的分析。

**补充具体化方法：**不要只写“AI应该公平”。先指出一个决策场景，例如筛选申请；再问谁受影响、什么错误最重要、怎样测量差异、由谁处理申诉。不同公平标准可能关注不同对象和分母，不能在没定义时把“公平分数”当一个万能数字。

研究阅读中还要分开规范主张与经验事实：“应给申诉机会”是在讨论制度原则；“提供某界面后多少人成功申诉”是可以观察的结果。一个漂亮原则不自动证明措施有效，一个统计差异也需要解释适用条件。

p.25 推荐：Unraveling the Ethical Enigma: Artificial Intelligence in Healthcare (2023)；Importance and limitations of AI ethics in contemporary society (2022)；Ethics and discrimination in artificial intelligence-enabled recruitment practices (2023)；Embedding responsibility in intelligent systems: from AI ethics to responsible AI ecosystems (2023)；The Ethics of AI Ethics: An Evaluation of Guidelines (2020)。

**自查动作：**给每段结论标“应该怎样”或“观察到什么”，再核对它依赖的理由或数据。这样讨论会比只列隐私、公平、责任三个名词更清楚。本篇没有把选题建议升级成新的课程或法律要求。

## 本讲核心考点

- p.3 的五问是所有选题共同的阅读结构，C 级授课覆盖。
- 十一方向是可选主题，不是期末必考清单；报告评分依据另见 [ESTR01](ESTR01-P1-课程与文章报告.md)。
- 参考文章清单已读，论文全文未在本轮逐篇研读；不可将书目标题当作论文结论。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[ESTR-Reading-and-Project-Topics-ESTR扩展.pdf](../教材/ESTR-Reading-and-Project-Topics-ESTR扩展.pdf)，p.1–25；均为当前 PDF 页号。
- 证据边界：本次重写核对本篇所列原课件；旧笔记保留的往年题定位仅作历史练习，不代表 2026T1 考核承诺。
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
