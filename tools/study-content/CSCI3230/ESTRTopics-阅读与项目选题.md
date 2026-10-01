# CSCI3230 ESTRTopics · Part 1/1 Reading / Project Topics

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：ESTRTopics，第 1 部分 / 共 1 部分 · 原件 [ESTR-Reading-and-Project-Topics-ESTR扩展.pdf](../教材/ESTR-Reading-and-Project-Topics-ESTR扩展.pdf) p.1–25
> 定位：补齐独立的 ESTR 选题讲义；解释选题框架，不把参考文献列表当作已读论文。

### 选题列表与共同问题（p.1–3）

> **p.3** “What is the problem?”

> **p.3** “How did the scientists solve (partially solve) the problem?”

p.1 是封面；p.2 列十一方向：医疗、自动驾驶、机器人、科学、金融、语言、游戏、艺术、教育、人机协作、AI 伦理。这份独立讲义比导论的例举多出金融，不能仅用 L01 的十项列表代替它。

p.3 要求每个方向都回答问题是什么、为什么重要、AI 如何改变它、已有研究怎样部分解决，以及下一步可能做什么。第四问还明确要求方法、机制、测量、表现与验证。报告的主线应因此是“问题—方法—证据—局限”，不是照时间排列公司与模型名字。

以下逐项保留课件推荐的文章名与其标注年份，**本次只读这份选题讲义，未逐篇读取参考论文全文**。期刊简称、年份和文字均视作讲义的书目记录，不当作独立书目核验；每节的“补充·阅读切口”是学习建议，不是论文发现。

### 医疗：从任务到评价终点（p.4–5）

> **p.4** “AI in healthcare is applied to clinical practice such as disease diagnosis, treatment protocol development, drug design, bioinformatics, personalized medicine, patient monitoring.”

这些应用的输入、输出和目标不同，不能用同一个 accuracy 概括所有价值。诊断可能输出病变类别，监测可能输出随时间变化的风险；先定义任务，才知道该看哪种评价。

p.5 推荐：Intelligent surgical workflow recognition for endoscopic submucosal dissection with real-time animal study (2023)；Towards a general-purpose foundation model for computational pathology (2024)；Artificial intelligence-enhanced echocardiography in cardiovascular disease management (2025)；AI in health and medicine (2022)；Application of large language models in medicine (2025)。

**补充·阅读切口：** 查评价来自哪个数据集、是否独立验证、测的是模型指标还是使用后的实际效果；文章标题本身不能证明已改善临床结局。此处只讨论研究阅读，不提供医疗判断。

### 自动驾驶：感知与规划（p.6–7）

> **p.6** “modern AI can help autonomous vehicles understand the surroundings and perform path planning.”

“理解周围”与“选择行动路线”是不同环节：前者估计环境状态，后者按目标和约束决定行为。可以用 L09 的状态、动作、代价来整理规划问题，但真实系统的动态环境与不确定性不能由最短路三个字完全替代。

p.7 推荐：Dense reinforcement learning for safety validation of autonomous vehicles (2023)；Integrating artificial intelligence in unmanned vehicles: navigating uncertainties, risks, and the path forward for the fourth industrial revolution (2025)；Outracing champion Gran Turismo drivers with deep reinforcement learning (2022)；Learning vision-based agile flight via differentiable physics (2025)；MetaDrive: Composing Diverse Driving Scenarios for Generalizable Reinforcement Learning (2022)。

**补充·阅读切口：** 区分游戏、仿真和真实环境；检查危险或少见情况如何进入测试。某环境中表现好不直接证明可迁移到另一环境。

### 机器人：技能与环境适应（p.8–9）

> **p.8** “It studies techniques allowing a robot to acquire novel skills or adapt to its environment through learning algorithms.”

图（p.8）：不同形态机器人照片拼图。
元素：抓取物品的机械臂、夹爪、人形机器人、工业机械臂与面对人的服务机器人。
看什么：机器人形态不同，对应的动作空间、传感器与交互任务也不同；照片本身没有给出训练方法或性能结论。

p.9 推荐：Surgical embodied intelligence for generalized task autonomy in laparoscopic robot-assisted surgery (2025)；Will generative AI transform robotics? (2024)；Lifelike agility and play in quadrupedal robots using reinforcement learning and generative pre-trained models (2024)；RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control (2023)；π0: A Vision-Language-Action Flow Model for General Robot Control (2024)。

**补充·阅读切口：** 把观测、动作、训练经验与测试任务列出来，再问“新技能”是新物体、新环境还是新的动作组合。不要只依据演示视频判断泛化。

### 科学：预测、发现与验证（p.10–11）

> **p.10** “AI algorithms have helped the scientific research of biology, chemistry, physics and so on.”

这句话确定应用范围，没有给出某个方法为何有效的推导。阅读时要继续找到具体对象：例如预测一个结构，与提出一个候选材料，是不同的任务及验证过程。

p.11 推荐：Scientific discovery in the age of artificial intelligence (2023)；AI-powered omics-based drug pair discovery for pyroptosis therapy targeting triple-negative breast cancer (2024)；Highly accurate protein structure prediction with AlphaFold (2021)；Scaling deep learning for materials discovery (2023)；Autonomous chemical research with large language models (2023)。

**补充·阅读切口：** 区分计算预测、已有数据上的回顾验证与后续独立实验，逐步追踪论文证据达到哪一层，而不是直接把高预测分数写成新科学事实。

### 金融：任务与数据时间（p.12–13）

> **p.12** “Chatbots are another AI-driven tool that banks are starting to use to help with customer service.”

课件同时提客户消费习惯分析和客服，二者输出不同：一个偏行为模式，一个偏交互服务。不能只因都发生在银行，就统一写成交易预测。

p.13 推荐：Intelligent finance and change management implications (2023)；AI integration in financial services: a systematic review of trends and regulatory challenges (2025)；Revolutionizing finance with conversational AI: a focus on ChatGPT implementation and challenges (2025)；Artificial Intelligence in Finance: Valuations and Opportunities (2024)；AI in Finance: Challenges, Techniques, and Opportunities (2022)。

**补充·阅读切口：** 若任务涉及时间序列，核查训练数据是否包含测试时点之后才知道的信息；若任务是客服，评价也需围绕回答质量和任务完成。这里提供阅读问题，不给投资建议。

### 语言：从自然语言到可计算表示（p.14–15）

> **p.14** “how to program computers to process and analyze large amounts of natural language data.”

文本必须先转成模型可处理的表示，L08 与 Transformer 辅导解释 embedding、注意力及输出 logits。任务可以是分类、生成、推理等，评价需针对输出用途，而不是只比较模型参数总数。

p.15 推荐：Attention Is All You Need (2017)；Language Models are Few-Shot Learners (2020)；Improving Language Understanding by Generative Pre-Training (2018)；DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)；A Survey of Large Language Models（课件标 continuously refined）。课件的 GitHub 星数是旧快照，不能作为当前统计。

**补充·阅读切口：** 分开预训练、适配或后训练、推理时的策略；不同阶段消耗的信息与资源不同。此书目并没有提供所有论文的方法细节。

### 游戏：行动与长期回报（p.16–17）

> **p.16** “AI is used to generate responsive, adaptive or intelligent behaviors primarily in non-player characters (NPCs) similar to human-like intelligence in gaming.”

这里的行为是行动策略，可能改变后续局面。与监督分类比较，强化学习还要处理行动影响未来收益的问题；这一概念接 L01 的强化学习定义。课件也列竞技与世界模型研究，不应只限于 NPC 台词生成。

p.17 推荐：AI in Human-computer Gaming: Techniques, Challenges and Opportunities (2023)；World and Human Action Models towards gameplay ideation (2025)；Mastering Atari, Go, chess and shogi by planning with a learned model (2020)；High-accuracy model-based reinforcement learning, a survey (2023)；Grandmaster level in StarCraft II using multi-agent reinforcement learning (2019)。

**补充·阅读切口：** 查可观察信息、可用动作、奖励、对手和评测规则，再讨论结果；同样叫“游戏能力”，条件不同就未必可直接比较。

### 艺术：作品生成与人的参与（p.18–19）

> **p.18** “It includes works created autonomously by AI systems and works from a collaboration between human and AI.”

课件定义覆盖音乐、照片、视频以及人机合作。研究问题可关注生成方法、人的评价或创作过程，但三者不该混成同一种效果。

p.19 推荐：Spontaneous emergence of rudimentary music detectors in deep neural networks (2024)；Bias against AI art can enhance perceptions of human creativity (2023)；A fuzzy control algorithm based on artificial intelligence for the fusion of traditional Chinese painting and AI painting (2024)；Art and the science of generative AI (2023)；Enhancing art creation through AI-based generative adversarial networks in educational auxiliary system (2025)。

**补充·阅读切口：** 明确“好”由谁评、用什么量表、是否知道作品来源，以及实验比较是否公平。项目目录里有部分相关文章和同学资料；本轮保留原件，未把同学观点写成教师结论。

### 教育：效果是否真正迁移到学习（p.20–21）

> **p.20** “AI tutors could allow for students to get extra, one-on-one help.”

课件用 could 描述可能性。系统能给答案，与学生自己学会解决新问题，是两种指标；综述报告应保持这种区别。

p.21 推荐：Education in the AI era: a long-term classroom technology based on intelligent robotics (2024)；Exploring the impact of artificial intelligence on higher education: The dynamics of ethical, social, and educational implications (2024)；A systematic review of AI-driven intelligent tutoring systems (ITS) in K-12 education (2025)；Navigating the landscape of AI literacy education: insights from a decade of research (2014–2024) (2025)；State of the art and practice in AI in education (2022)。

**补充·阅读切口：** 检查对象年龄、课程、对照条件和学习测量时点。即时满意度、一次测验与长期保持不应写成同一个学习收益。

### 人机协作：系统整体表现（p.22–23）

> **p.22** “each agent, human or machine, is autonomously contributing to a problem solving network.”

协作问题不只评模型单独多强，还要看人如何读懂、采纳或修正模型输出。系统中的信息流和分工可以决定最后表现。

p.23 推荐：Human–AI collaboration enables more empathic conversations in text-based peer-to-peer mental health support (2023)；When combinations of humans and AI are useful: A systematic review and meta-analysis (2024)；Examining human–AI collaboration in hybrid intelligence learning environments: insight from the Synergy Degree Model (2025)；How human–AI feedback loops alter human perceptual, emotional and social judgements (2024)；AI-enhanced collective intelligence (2024)。

**补充·阅读切口：** 至少区分人单独、AI 单独与协作三种条件。协作超过人的基线，不等于超过所有单独系统；结论要与实际对照匹配。

### 伦理：行为、责任与研究边界（p.24–25）

> **p.24** “a concern with the moral behavior of humans as they design, make, use and treat artificially intelligent systems”

课件把讨论分为人的设计、制造、使用行为，以及机器行为本身。前者提醒读者把责任放回具体决策者和制度环境，后者关注系统如何行动；不能用“算法决定的”省略分析。

p.25 推荐：Unraveling the Ethical Enigma: Artificial Intelligence in Healthcare (2023)；Importance and limitations of AI ethics in contemporary society (2022)；Ethics and discrimination in artificial intelligence-enabled recruitment practices (2023)；Embedding responsibility in intelligent systems: from AI ethics to responsible AI ecosystems (2023)；The Ethics of AI Ethics: An Evaluation of Guidelines (2020)。

**补充·阅读切口：** 选一个具体冲突，写清受影响的人、决策环节、评价原则和可检验后果。不要用抽象“要公平”替代说明公平怎样定义、不同指标之间有什么取舍。

## 本讲核心考点

- p.3 的五问是所有选题共同的阅读结构，C 级授课覆盖。
- 十一方向是可选主题，不是期末必考清单；报告评分依据另见 [ESTR01](ESTR01-P1-课程与文章报告.md)。
- 参考文章清单已读，论文全文未在本轮逐篇研读；不可将书目标题当作论文结论。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[ESTR-Reading-and-Project-Topics-ESTR扩展.pdf](../教材/ESTR-Reading-and-Project-Topics-ESTR扩展.pdf)，p.1–25；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
