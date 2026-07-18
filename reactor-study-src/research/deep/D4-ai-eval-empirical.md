# D4：AI 评测反应性的实证与测量侧——加深与更新

> 本文加深 `research/05-ai-evals-reactivity.md` 的**实证/测量**部分，不复述其理论骨架（Goodhart 形式化、performative prediction、reward 过优化曲线等仍以 05 为准）。这里只做一件事：把"eval 越多→AI 退化到 eval"这个命题**逐条落到可测的数字上**，看每一种机制到底有多强、被高估了多少、2024–2026 又发生了什么。
>
> 拓展出的五条更细主线：
> 1. **适应性过拟合的经验裁决**——理论说"反复用同一 holdout 会退化"，但 Kaggle 百场竞赛的大规模复核发现退化**弱得惊人**；为什么（模型相似性假说）。
> 2. **污染到底解释了多少虚高**——从 GSM1k/GSM-Symbolic 的剂量-反应，到检测方法的系统性失效，到"污染悖论"（同一次泄漏既可致命又可忽略）。
> 3. **基准出错与饱和的量化**——MMLU 6.49% 错题、MMLU-Pro/Redux、饱和率随基准年龄的实测曲线（以及"饱和在加速"这一说法被打的折扣）。
> 4. **Arena 的可玩性实测**——从"刷票能刷几名"到 LMArena 变成 17 亿美元估值公司后的治理冲突。
> 5. **前沿基准的自我崩塌**——SWE-bench 全弧线的最新一章：连"抗污染替身"SWE-bench Pro 都在一年内被 OpenAI 判定 ~30% 损坏。

贯穿全文的一个总判断：**"退化到 eval"在"单一目标被高强度定向优化"（RLHF、reward、agentic coding 记忆 gold patch）时是实锤，但在"经典意义的测试集反复重用"上，经验强度远低于理论恐慌**——这条界线正是 2024–2026 的实证文献反复画出来的。

---

## 子主线 1：适应性过拟合的经验裁决——理论很吓人，实测很温和

### 核心脉络
"eval 用得越多越退化"的最字面版本是**适应性过拟合（adaptive overfitting）**：每次"在同一 holdout 上比较若干模型、留最好的"都是一次适应性查询，反复如此，被选中的模型会过拟合到该测试集的噪声。理论侧（05 已述）由 Dwork 等的"差分隐私⇒泛化"与 Blum–Hardt 的 Ladder 给出漂亮的**信息论定价**：看测试集是花预算，看得越多透支越狠。但 2018–2020 一批**大规模经验复核**给出了几乎相反的裁决——在真实公开排行榜上，这种退化**弱得出奇**。这是对读者假说最重要的一处经验限定，05 只提到 Recht 的 ImageNet/CIFAR，实际证据链更完整。

**关键机制文献（Ladder / reusable holdout）。**
- **Blum & Hardt (2015), "The Ladder: A Reliable Leaderboard for Machine Learning Competitions"**（ICML，arXiv:1502.04585，被引 191）：只在提交分数**显著优于历史最好**时才更新公开分，把每次提交泄漏的信息量卡死，从而在完全适应性攻击下仍保证 leaderboard 精度。原文点破排行榜的病灶就是"participants are allowed to repeatedly evaluate their submissions on the leaderboard, they may begin to overfit"。
- **Dwork, Feldman, Hardt, Pitassi, Reingold, Roth (2015)**：STOC 版 *Preserving Statistical Validity in Adaptive Data Analysis*（arXiv:1411.2664，被引 487）、Science 版 *The reusable holdout*（Science 349:636，被引 ~474）、以及 NeurIPS 版 *Generalization in Adaptive Data Analysis and Holdout Reuse*（被引 312）。核心：用差分隐私机制（Thresholdout）中介 holdout 访问，可支持**指数级多次**适应性查询而不失效。

### 一手来源清单（本节的新增重点）
- **Roelofs, Shankar, Recht, Fridovich-Keil, Hardt, Miller, Schmidt (2019), "A Meta-Analysis of Overfitting in Machine Learning"**（NeurIPS，arXiv:1902.03570，被引 **344**）。PDF: proceedings.neurips.cc/paper/2019/file/ee39e503b6bedf0c98c388b7e8589aca-Paper.pdf
- **Mania, Miller, Schmidt, Hardt, Recht (2019), "Model Similarity Mitigates Test Set Overuse"**（NeurIPS，被引 71）。
- **Miller, Krauth, Recht, Schmidt (2020), "The Effect of Natural Distribution Shift on Question Answering Models"**（ICML，被引 212）。
- Recht, Roelofs, Schmidt, Shankar (2018/2019) CIFAR-10 / ImageNet 复制研究（arXiv:1806.00451；arXiv:1902.10811，被引 3111）——05 已引，这里作对照。

### 精确数据与引文
- **Kaggle 百场竞赛的裁决**：Roelofs et al. 复核了 **一百多场** Kaggle 竞赛（每场都有公开榜 public leaderboard + 私有榜 private test set 的天然对照）。结论原文："**somewhat surprisingly, little evidence of substantial overfitting**"；公榜与私榜分差主要由随机波动解释，而非系统性适应性过拟合。作者据此说这"speaks to the robustness of the holdout method across different data domains, loss functions, model classes, and human analysts"。**这是对"反复刷榜→过拟合"最大规模的直接反驳。**
- **机制解释（为什么这么弱）**：Mania et al. (2019) 证明**模型相似性**大幅削弱测试集重用的危害——因为候选模型彼此高度相关，它们对测试集的"有效独立查询数"远小于提交次数，于是过拟合预算的消耗慢得多。这补上了"理论预测很糟、经验却很好"之间缺的那块。
- **QA 场景复核**：Miller et al. (2020) 在 SQuAD 等问答基准上"**find no evidence of adaptive overfitting**"，掉分几乎全部来自新测试集的自然分布漂移。
- **ImageNet/CIFAR（对照）**：新测试集上准确率普遍掉 ~3–15%（ImageNet ~10%），但**相对排名几乎完好**，说明退化来自"新集稍难"的分布漂移，**不是**十年刷同一测试集的适应性过拟合。

### 求证与纠讹
- **纠"刷榜必然过拟合"的直觉**：这是本项目框架里一处需要显式打折的地方。理论（Dwork/Blum-Hardt）保证的是"**最坏情况**下 holdout 会退化"；经验（Roelofs/Mania/Miller）显示"**平均情况**下退化被模型相似性稀释到几乎测不到"。把二者混为一谈，会把"eval 越多越退化"当成无条件定律——**在经典测试集重用的意义上，它并不成立**。
- 与 05 第五节结论一致，但证据更硬：05 只引了 Recht 的图像结果，这里补上了 **Kaggle 百场（跨领域、跨损失、跨人类分析师）+ QA + 模型相似性机制**三块，把"适应性过拟合弱"从单一领域的观察升级为跨域的稳健结论。

### 2024–2026 最新进展
- 竞赛过拟合仍有零星理论/仿真跟进：Qiu, Xu, Yu (2024), *On Overfitting in Machine Learning Contests*（SSRN 5012282）给博弈均衡刻画；Karunanayaka (2026), *A Simulation Framework for Evaluating Public Leaderboard Mitigations under Adaptivity*（techrxiv）用仿真度量"Top-1 Overfit Risk"，量化 Ladder 类缓解措施——但都未推翻 2019 的经验裁决。
- Hardt 把这条线收进了 2026 的 *The Emerging Science of Machine Learning Benchmarks*（mlbenchmarks.org，被引 ~50）——一个把"benchmark 当作可研究对象的科学"的纲领。

### 开放问题
- **模型相似性假说是不是全部？** 当整个社区都蒸馏同几个强模型时，模型相似性还会更高——这到底是"保护 holdout"（有效查询数更少），还是"生态同质化"（05 第八节的 model collapse）？同一现象在这两条线上符号相反，值得专门厘清。
- **LLM 时代还成立吗？** Kaggle 结论来自 2019 前的监督学习竞赛。在 LLM 上，"模型选择"不再是提交预测、而是调 prompt/脚手架/后训练，适应性查询的形态完全变了——经典裁决能否外推，尚无同等规模的复核。

---

## 子主线 2：污染到底解释了多少虚高——从剂量-反应到"污染悖论"

### 核心脉络
污染是"退化到 eval"最字面的机制：测试题进了训练集，分数度量记忆而非能力。05 已给出最干净的 **GSM1k**（Zhang et al., Scale AI, 2024, arXiv:2405.00332）：重制 1000 道同风格新题后，Phi/Mistral 系统性掉分近 10%（部分 8–13%），而 GPT/Claude/Gemini 前沿模型几乎不掉，且"能逐词吐出原题的概率"与掉分正相关（Spearman r²≈0.36）。本节把这条线**往测量方法与"到底解释了多少"两个方向挖深**，这正是 05 标注的头号开放问题。

### 一手来源清单
**剂量-反应与机制**
- **Mirzadeh, Alizadeh, Shahrokhi, Tuzel, Bengio, Farajtabar (Apple, 2025), "GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning in LLMs"**（ICLR，arXiv:2410.05229，被引 **1023**）。
- Shojaee, Mirzadeh, Horton et al. (Apple, 2026), *The Illusion of Thinking*（NeurIPS，被引 654）——同组后续，把"换表述/加干扰就崩"从算术推到推理模型的谜题任务。
- Jiang, Liu, Zhong, Schaeffer et al. (2024), *Investigating Data Contamination for Pre-training LMs*（arXiv:2401.06059，被引 100）。

**检测方法及其失效**
- Yang, Chiang, Zheng, Gonzalez et al. (2023), *Rethinking Benchmark and Contamination... with Rephrased Samples*（arXiv:2311.04850，被引 175）——即 **LLM Decontaminator**。
- Dong, Jiang, Liu, Jin, Gu et al. (2024), *Generalization or Memorization: Data Contamination and Trustworthy Evaluation*（ACL Findings，被引 286）——CDD/TED。
- Duan, Suri, Mireshghallah, Min, Shi et al. (2024), *Do Membership Inference Attacks Work on LLMs?*（arXiv:2402.07841，被引 194）。
- Meeus, Shilov, Jain, Faysse et al. (2025), *SoK: Membership Inference Attacks on LLMs Are Rushing Nowhere (and How to Fix It)*（IEEE SaTML，被引 64）。
- Dekoninck, Müller, Baader, Fischer et al. (2024), *Evading Data Contamination Detection for LMs Is (Too) Easy*（arXiv:2402.02823，被引 34）。
- Liu, Min, Zettlemoyer, Choi et al. (2024), *Infini-gram*（arXiv:2401.17377，被引 91）——n-gram 污染排查的基础设施。

**"到底解释了多少"（本节最关键的新增）**
- **Schaeffer, Kazdan, Abbasi, Liu, Miranda et al. (2026), "Quantifying the Effect of Test Set Contamination on Generative Evaluations"**（arXiv:2601.04301）及配套短文 *The Contamination Paradox: Why Test Set Leakage Can Be Both Potent and Negligible* / *Causally Quantifying the Effect of Test Set Contamination on Generative Benchmarks*（openreview）。
- 综述：Xu, Guan, Greene, Kechadi (2024), *Benchmark Data Contamination of LLMs: A Survey*（arXiv:2406.04244，被引 191）；Cheng, Chang, Wu (2025)（arXiv:2502.14425，被引 56）。

### 精确数据与引文
- **GSM-Symbolic 的剂量-反应**（arXiv:2410.05229）：仅改**数值**就使多数模型分数显著下滑；难度升级（加子句 P1/P2）后逐级恶化；最刺眼的是 **GSM-NoOp**——只往题里塞**一条看似相关、实则无关**的子句，"causes significant performance drops—**up to 65%** across all state-of-the-art models"。作者据此主张模型"replicate reasoning steps from their training data"而非真做逻辑推理。这把"污染/记忆"从"背原题"扩展到"背题型模板"，是比 GSM1k 更细的机制证据。
- **n-gram 检测的失效**：Yang et al. (2023) 证明**改写/翻译**后的测试题能骗过 n-gram overlap、embedding 相似度等标准去污方法而仍严重抬分——因此需要 LLM 级语义比对（LLM Decontaminator）。Dekoninck et al. (2024) 更进一步："evading contamination detection is **(too) easy**"，攻击方可低成本规避几乎所有现有检测。
- **MIA 的信度危机**：Duan et al. (2024) 系统显示成员推断攻击在 LLM 上**几乎不比随机猜测强**（因训练数据海量、单样本影响被稀释）；Meeus et al. (2025) 直接把这一整支叫作"**rushing nowhere**"，指出很多"检测出污染"的论文其分辨力来自**时间分布偏移**（成员/非成员来自不同时间）而非真的记忆信号。**这意味着一大批"某模型污染了某基准"的指控，方法上站不住。**
- **污染悖论（对头号开放问题的正面回答）**：Schaeffer et al. (2026) 用因果框架量化后发现，测试集泄漏的实际抬分**高度受生命周期调制**——单条测试集副本进预训练语料就能让 loss 低于"干净语料的不可约误差"（**potent**）；但**继续用新鲜数据大量训练会把污染效应冲淡甚至抹平**，SFT 阶段则可能增可能减，取决于此前污染程度（**negligible**）。结论：**同一次泄漏，既可能致命也可能被洗掉**，取决于它在训练时间线上的位置和后续训练量。这恰好解释了 GSM1k 的观察——**前沿模型经历海量后续训练，早期污染被稀释，所以几乎不掉分；而小模型/特定家族污染离最终检查点更近，掉分更大。**

### 求证与纠讹
- **纠"污染 = 分数虚高"的线性直觉**：naïve 版本是"模型见过测试集→分数注水→掉分等于注水量"。Schaeffer 的因果量化说明这是错的——**污染的可玩性是路径依赖的、常被后续训练洗掉**。这既救回了"前沿模型分数大体可信"的一面，也提醒"用一次污染检测阳性就宣判某分数造假"是过度推断。
- **纠"检测出污染"的可信度**：Meeus/Duan 的工作应当让读者对"某论文检测到 X 基准被 Y 模型污染"保持怀疑——先问它用的是不是 MIA、有没有把时间偏移当成记忆。
- **对读者假说的净效应**：污染**是**"退化到 eval"的真实机制，但它的经验强度**不是**"eval 越多越污染越退化"的单调函数，而是被训练动态强烈调制的、家族/尺寸异质的现象。

### 2024–2026 最新进展
- 检测综述与新方法密集涌现：Ravaut et al. (2024, arXiv:2404.00699)、Chen et al. (2025, *From Static to Dynamic Evaluation*, arXiv:2502.17521) 系统梳理"静态检测→动态生成"的范式迁移。
- 记忆研究基础设施：Wei et al. (2025), *Hubble: A Model Suite to Advance the Study of LLM Memorization*（arXiv:2510.19811）；Shilov, Meeus, de Montjoye (2026), *The Mosaic Memory of LLMs*（Nature Communications，被引 14）。
- 2026 出现"soft contamination"概念：Spiesberger et al. (2026), *Soft Contamination Means Benchmarks Test Shallow Generalization*（arXiv:2602.12413）——即使没有逐字泄漏，训练分布与测试分布过近也让基准只测浅层泛化。

### 开放问题
- **前沿模型虚高中污染占比到底几何？** Schaeffer 给了"取决于生命周期"的机制答案，但缺一个跨基准、跨厂商的**方差分解**：虚高里多少是污染、多少是脚手架、多少是真能力，至今没有公认的量化。
- **改写型污染无法根治？** 若 n-gram 失效、MIA 失效、LLM 检测又能被规避，那"证明某分数干净"在原则上是否可能？这把污染问题推向和适应性过拟合类似的"最坏情况不可判定"处境。

---

## 子主线 3：基准出错与饱和的量化——"错题率 6.49%"与"饱和在加速"的折扣

### 核心脉络
反应性度量的一个宏观指纹是**基准寿命越来越短**（05 引 AI Index 2025：MMMU/GPQA/SWE-bench 一年内分别飙 18.8/48.9/67.3 个百分点）。但把镜头拉近，会看到两个被 05 一笔带过的实证细节：其一，主流基准本身**含有大量错题**，"饱和"部分是撞上了标注天花板而非能力天花板；其二，"饱和在加速"这一流行叙事，在系统性研究里只得到**温和**支持。

### 一手来源清单
- **Gema, Leang, Hong, Devoto et al. (2024/2025), "Are We Done with MMLU?"**（NAACL 2025，arXiv:2406.04127，被引 **214**）——即 **MMLU-Redux**。
- **Wang et al. (2024), "MMLU-Pro: A More Robust and Challenging Multi-Task Language Understanding Benchmark"**（arXiv:2406.01574，被引 ~2000）。
- Zhao, Huang, Lv, Cui, Sun et al. (2025), *MMLU-CF: A Contamination-Free Multi-task Language Understanding Benchmark*（ACL，被引 50）。
- Molfese, Moroni, Gioffré, Scirè et al. (2025), *Right Answer, Wrong Score: Uncovering the Inconsistencies of LLM Evaluation in MCQA*（ACL Findings，被引 32）。
- Vendrow, Vendrow, Beery et al. (2024/2025), *Do Large Language Model Benchmarks Test Reliability?*（Platinum Benchmarks）。
- Truong, Tu, Hardy et al. (2026), *Fantastic Bugs and Where to Find Them in AI Benchmarks*（NeurIPS，被引 7）。
- **Akhtar, Reuel, Soni et al. (2026), "A Systematic Study of Benchmark Saturation"**（arXiv:2602.16763）。
- Kiela et al. (2021), *Dynabench*（arXiv:2104.14337）——05 已引，动态对抗造题的原型。

### 精确数据与引文
- **MMLU 错题率**：MMLU-Redux 人工重标注了 **5,700** 道题（覆盖全部 57 学科），估计 **6.49% 的 MMLU 题目含错误**（错标答案、题干残缺、多正解等）；用干净子集重测后，模型相对排名出现**显著变动**——即原始 MMLU 榜单部分是被错题噪声搅乱的。
- **MMLU-Pro 的残余错误**：即便是精修的 MMLU-Pro（选项从 4 增到 10、加重推理），其错误剖析仍显示约 **4% Errors + 2% Generation + 2% Annotation + 1% Extraction** 的残余问题——**"更难的基准"并不等于"更干净的基准"**。
- **错题不是 MMLU 独有**：Jin et al. 的 Text-to-SQL 基准审计发现，121 道开源 gold SQL 里 **66.1% 标注有误**，严重误估模型能力——提示"基准出错"是跨领域的系统性问题。
- **"饱和在加速"被打折**：Akhtar/Reuel et al. (2026) 系统分析 **60 个**来自主流厂商技术报告的基准，定义饱和为"顶尖模型间失去可统计区分的分辨力"。结果：饱和比例从"发布 <24 个月"的 **42.9%** 升到">60 个月"的 **54.5%**——**随年龄上升，但趋势被作者形容为"modest"而非陡增**；更反直觉的是，**公开测试集 vs 私有/隐藏测试集在饱和率上"no statistically meaningful difference"**——"藏题"一旦被广泛采用，并不能阻止饱和。这对"私测/held-out 就能续命"是一记冷水。

### 求证与纠讹
- **纠"饱和 = 模型太强"**：至少一部分饱和是**撞上标注天花板**——当 6.49% 的题本身有错，模型准确率的上限就被钉死在 ~93.5%，再强也"过不去"，看起来像饱和实则是数据脏。Gema et al. 的贡献就是把这两种"天花板"分开。
- **纠"饱和越来越快"的强叙事**：AI Index 2025 的单点飙升（一年 +67 个百分点）容易被读成"饱和在指数加速"，但 Akhtar/Reuel 的跨基准回归只给出**温和**的年龄相关，且否定了"藏题续命"。两者不矛盾（前者是个别新基准的初期陡升，后者是全体基准的长期趋势），但把它们分清可避免夸大。
- **纠"排名稳定"**：MMLU-Redux 显示清洗错题后排名会变——这与子主线 1 的"排名很稳"不冲突：分布漂移（换新集）保排名，而**修正系统性错误**（去错题）会动排名。

### 2024–2026 最新进展
- 产业侧对饱和的直接回应：2026 年 Artificial Analysis **推翻自家 Intelligence Index**，用"real-world"任务替换已饱和的流行基准（VentureBeat 报道）；Stanford HAI 专文 *AI Benchmarks Hit Saturation*。
- 一批"抗饱和"新基准继续出（HLE、ARC-AGI-2、FrontierMath，见子主线 5），但设计者自己也承认寿命短（HLE 作者预测 2025 年底就可能被破 50%）。

### 开放问题
- **基准的错题率有没有下限？** 人工标注质量存在天然上限，是否意味着**任何**大规模知识基准的可测天花板都在 ~95% 附近？若是，则"逼近 100%"的军备竞赛在测量学上本就是幻觉。
- **"饱和加速"到底是不是真的？** AI Index 的单点观察与系统研究的温和趋势需要一个统一口径（按能力维度归一、控制新基准初期陡升）才能定论。

---

## 子主线 4：Arena 的可玩性实测——刷票能刷几名，以及裁判变成 17 亿美元公司

### 核心脉络
05 已把 **The Leaderboard Illusion**（Singh et al., Cohere Labs, 2025, arXiv:2504.20879；现已收入 **NeurIPS 2025 Datasets & Benchmarks Track**，被引 82）、Llama 4 Maverick 事件、style control、GPT-4o 谄媚回滚讲透。本节补两块 05 没有的**实证/治理**证据：(a) Arena 投票**可被主动操纵**到什么程度的定量攻击；(b) 运营方 LMArena 已**商业化为独角兽**，把"裁判即产品"的利益冲突推到明面。

### 一手来源清单
- **Min, Pang, Du, Liu, Cheng, Lin (2025), "Improving Your Model Ranking on Chatbot Arena by Vote Rigging"**（arXiv:2501.17858）。
- Ameli et al. (Berkeley Stat), *A Statistical Framework for Ranking LLM-Based Chatbots*（被引 16）——对 Arena Elo 的统计学批评。
- *Investigating Non-Transitivity in LLM-as-a-Judge*（OpenReview）——Elo 假设的可传递性被违反。
- Singh et al. (2025), *The Leaderboard Illusion*（arXiv:2504.20879）——05 主引，这里补其正式发表与"过拟合到 Arena 分布可带来高达 112% 相对提升"的核心数字。
- 平衡视角：Simon Willison, *Understanding the Recent Criticism of the Chatbot Arena*（2025-04-30，simonwillison.net）；LMArena 官方 *Our Response*（arena.ai/blog）。
- 商业化事实：Reuters / TechCrunch / SiliconAngle（2026-01-06）关于 LMArena 融资的报道。

### 精确数据与引文
- **刷票的可玩性**（Min et al. 2025）：在 **170 万**条真实历史 Arena 投票上模拟两类攻击。**Target-only rigging**（只操纵目标模型参与的对战）效率低，需 **>1 万票**才升一名；但**Omnipresent rigging**——利用 Bradley-Terry 的全局耦合性，"**any new vote... can influence the ranking of a target model, even if it is not directly involved**"，配合去匿名分类器——效率翻倍：约 **2 万票升 ~10 名**，在受限访问的现实设定下**几百票就能升 5 名**。这把"Arena 分数可被主动博弈"从定性指控变成了**票数-名次的定量攻击曲线**，与子主线 1"厂商私测撤分"的被动博弈互补。
- **过拟合到 Arena 分布**（Leaderboard Illusion）：哪怕只拿到少量 Arena 数据，也能在 Arena 分布上带来**高达 112% 的相对性能提升**——但这是"过拟合到 Arena 特有动态"，未必是通用质量。此句几乎是读者假说的逐字复述。
- **裁判商业化**（治理冲突的新事实）：LMArena 2025-05 完成 **1 亿美元种子轮**（估值约 6 亿美元，a16z 领投）；**2026-01-06 再融 1.5 亿美元 Series A，估值跳到 17 亿美元**（Reuters："triples its valuation to $1.7 billion"）。也就是说，**当今最有影响力的"活榜"由一家风投支持、其核心产品就是这个排名的公司运营**——这把 Espeland–Sauder 的反应性推到治理层：**打分机构与被打分者之间不再只有信息不对称，还叠加了资本利益**。

### 求证与纠讹
- **保持平衡（避免把 Arena 说成一无是处）**：Simon Willison（2025-04-30）与 LMArena 官方回应都指出 Leaderboard Illusion 的**幅度估计可辩**（如开源占比论文可能漏算 Llama/Gemma；新用户持续涌入会稀释私测选择偏差）。Karpathy 等社区共识是：**结构性激励问题成立，但具体百分比需谨慎**。刷票攻击（Min et al.）也需要相当规模的协同投票，非任意个人可轻易实施。因此正确表述是"Arena **可被系统性博弈**、其分数**部分**是'Arena 形状'的能力"，而非"Arena 分数全是刷出来的"。
- **纠"Elo 是客观真值"**：Ameli et al. 与非传递性研究指出 Bradley-Terry/Elo 假设（可传递、单一潜在实力维度）在 LLM 成对比较中常被违反——Arena Score 的置信区间与排名稳定性被高估。

### 2024–2026 最新进展
- LMArena 从 lmsys.org 学术项目正式公司化（域名迁至 arena.ai），推出细分榜（如 Factuality Leaderboard）与 API/评测产品——进一步把"排名"变成可售卖的服务。
- 学界继续给出"Arena 之外"的替代评测框架（Cohere *Elo Ratings Beyond Arena-Style Evaluations*、Auto-Arena 等），核心动机都是绕开人类偏好投票的风格/长度/可玩性偏差。

### 开放问题
- **商业化后的活榜还能自我纠偏吗？** style control（05 已述）证明运营方**有能力**把被优化出来的形状显式扣除；但当运营方本身是估值 17 亿、靠榜单公信力变现的公司，其纠偏激励是否可持续、是否会向大客户倾斜，无外部审计可证。
- **刷票攻击的真实发生率？** Min et al. 证明"可行"，但公开数据里**实际发生过多少**协同刷票，无人能测——这是反应性的暗数字。

---

## 子主线 5：前沿基准的自我崩塌——SWE-bench 全弧线的最新一章

### 核心脉络
05 讲了 SWE-bench 的弧线：原版（Jimenez et al., 2023, arXiv:2310.06770）→ 人审的 **Verified**（OpenAI, 2024-08, 500 题）→ 因污染被 OpenAI 弃用 → 转向 Scale AI 的 **SWE-bench Pro**。本节把这条弧线**更新到 2026-07**，并纠正一处来源混淆——结论是：**连"抗污染替身"Pro 都在不到一年内被判定 ~30% 损坏，"另造新版"的军备竞赛正在原地打转。**

### 一手来源清单
- Aleithan, Xue, Mohajer, Nnorom et al. (2024), *SWE-bench+: Enhanced Coding Benchmark for LLMs*（arXiv:2410.06992，被引 102）。
- Zhou, Weyssow, Widyasari, Zhang et al. (2025), *LessLeak-Bench: A First Investigation of Data Leakage in LLMs Across 83 Software Engineering Benchmarks*（arXiv:2502.06215，被引 54）。
- Prathifkumar, Mathews, Nagappan (2025), *Does SWE-Bench-Verified Test Agent Ability or Model Memory?*（arXiv:2512.10218，被引 41）。
- Deng, Da, Pan, He, Ide, Garg et al. (Scale AI, 2025), *SWE-bench Pro: Can AI Agents Solve Long-Horizon Software Engineering Tasks?*（arXiv:2509.16941，被引 148）。
- **OpenAI (2026), *Why We No Longer Evaluate SWE-bench Verified***（openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/）。
- **OpenAI (2026-07), *Separating Signal from Noise in Coding Evaluations***（openai.com/index/separating-signal-from-noise-coding-evaluations/）——对 SWE-bench Pro 的审计。
- 抗污染设计对照：Jain et al. (2025), *LiveCodeBench*（ICLR，arXiv:2403.07974，被引 1824）；White et al. (2024), *LiveBench*（arXiv:2406.19314，被引 ~298）；Badertdinov et al. (2026), *SWE-rebench*（NeurIPS，被引 105）；Zhang et al. (2026), *SWE-bench Goes Live!*（被引 82）。

### 精确数据与引文
- **SWE-bench+ 的污染剖析**（Aleithan et al. 2024）：审计发现 **32.67% 的"成功"补丁涉及 solution leakage**——修复方案直接写在 issue 正文或评论里，模型只是"抄答案"；另有 **31.08% 的通过补丁因测试太弱而可疑**。清洗后，**SWE-Agent+GPT-4 的解决率从 12.47% 暴跌到 3.97%**。
- **Verified 的记忆问题**（OpenAI *Why We No Longer Evaluate...*，据 openai.com 原帖及多方二手复核）：**至少 16.4% 的全部任务测试用例有缺陷**；在最能区分前沿模型的**最难 138 题**中，**约 59% 存在实质缺陷**（测试太窄/太松）；且各前沿模型几乎能**逐词复现人类原始 gold patch**——"交回人类已写好的修复"是记忆而非推理。
- **Pro 也塌了（本节最新的一章）**（OpenAI *Separating Signal from Noise*，约 2026-07-08）：审计 SWE-bench Pro 的 **731** 道公开任务，**约 30% 损坏**——自动化流水线判定 **27.4% 有缺陷**，人工判定 **34.1%**；且顶尖模型通过率在 **8 个月内从 23.3% 飙到 80.3%**，缺陷类型归为"过度规定的测试/含糊指令/测试覆盖不足/误导性 prompt"四类。OpenAI 据此**撤回对 SWE-bench Pro 的推荐**，转而呼吁"由资深软件工程师专为 AI 评测设计的新基准"。
- **弧线总结**：原版 → Verified（抗噪）→ 弃用 → Pro（抗污染/私有 held-out）→ **Pro 也被判 ~30% 损坏并撤回推荐**。**每一代"修好"的基准都在被优化到失去区分度后另造新版，而新版的寿命越来越短。** 这是"benchmaxxing 与反-benchmaxxing 军备竞赛"最完整的产业级实证。

### 求证与纠讹
- **纠一处来源混淆（重要）**：05 在"SWE-bench 弃用"段把"**约 32.67% 的成功补丁涉及 solution leakage**"与 OpenAI 的 Verified 弃用帖并列，读起来像是 OpenAI 的审计数字。实际上 **32.67% 出自 SWE-bench+（Aleithan et al. 2024, arXiv:2410.06992）**，而 OpenAI Verified 帖自己给的是"**≥16.4% 任务测试有缺陷 + 最难 138 题中 59% 损坏 + 逐词复现 gold patch**"。两者都成立、都指向记忆/污染，但**出处不同、数字不同**，应分开引用。
- **纠"抗污染基准 = 干净"**：LiveCodeBench/LiveBench 用"训练截止日之后才存在的题"契约式防污染，但连它们也报告**部分模型在截止前的题上分数偏高**（疑似污染的时间指纹）。加上 Pro 的崩塌，说明"抗污染设计"缓解的是**逐字泄漏**，缓解不了**题目本身质量差、测试太弱、gold patch 可记忆**这些更深的病。
- **对读者假说的净效应**：在 agentic coding 这条线上，"退化到 eval"是**实锤**——模型学会的相当一部分是"复现人类已写好的补丁/抄 issue 里的答案"，而非独立解题。这与子主线 1（经典过拟合弱）形成鲜明对比：**区别就在于优化压力是否高度集中于单一、可记忆的目标**。

### 2024–2026 最新进展
- 一整个"动态/去污染 SWE 基准"子产业涌现：SWE-rebench（自动采集+去污染，NeurIPS 2026，被引 105）、SWE-bench Goes Live!（被引 82）、SWE-MERA、SWE-Factory、Saving SWE-Bench（变异法）、SWE-bench Pro/Multimodal/Mobile 等十余个变体——本身就是反应性的直接产物：**基准被玩坏的速度快到需要一个持续造新基准的流水线来追赶。**
- 数学侧对应事件：FrontierMath 的 **OpenAI 资助+独家题目访问争议**（05 已述，TechCrunch 2025-01）仍是"抗污染基准公信力被出资方-被测方利益不对称侵蚀"的标志性案例；o3 借它宣布 25%（前代 2%）。
- 产业已公开承认"最难的不是造模型而是造评测"：多家（OpenAI *GDPval*、Artificial Analysis 改版、Anthropic 资助第三方 eval）转向"real-world/专家设计"评测。

### 开放问题
- **"持续造新基准"是对冲还是徒劳？** 05 第八节把"不断造更多、更抗污染的新 eval"列为对退化的**对冲**；但 Pro 在一年内崩塌说明，若新基准仍从"人类协作用的 GitHub issue"这类**本就不为 AI 评测设计**的材料里造，它继承的缺陷会让对冲效果大打折扣。真正的解药可能是"为 AI 评测从零设计任务"，但这极其昂贵且规模受限。
- **agentic coding 的"记忆 vs 推理"占比？** 前沿模型在 SWE-bench 上的成功里，多少来自复现 gold patch/抄 issue、多少来自真实推理？OpenAI 的定性观察需要一个可量化的分解——这是把子主线 2 的"污染占比"问题落到 coding 域的具体版本。

---

## 来源总表（按子主线分组）

### 子主线 1：适应性过拟合
- Blum & Hardt 2015, *The Ladder* — arXiv:1502.04585 — https://proceedings.mlr.press/v37/blum15
- Dwork, Feldman, Hardt, Pitassi, Reingold, Roth 2015, *Preserving Statistical Validity in Adaptive Data Analysis* — arXiv:1411.2664（STOC）；*The reusable holdout* — Science 349:636；*Generalization in Adaptive Data Analysis and Holdout Reuse*（NeurIPS）— https://proceedings.neurips.cc/paper/2015/hash/bad5f33780c42f2588878a9d07405083-Abstract.html
- **Roelofs, Shankar, Recht et al. 2019, *A Meta-Analysis of Overfitting in Machine Learning* — arXiv:1902.03570 —** https://proceedings.neurips.cc/paper/2019/hash/ee39e503b6bedf0c98c388b7e8589aca-Abstract.html
- **Mania, Miller, Schmidt, Hardt, Recht 2019, *Model Similarity Mitigates Test Set Overuse* —** https://proceedings.neurips.cc/paper/2019/hash/48237d9f2dea8c74c2a72126cf63d933-Abstract.html
- **Miller, Krauth, Recht, Schmidt 2020, *The Effect of Natural Distribution Shift on Question Answering Models* —** https://proceedings.mlr.press/v119/miller20a.html
- Recht et al. 2018/2019, CIFAR-10 / ImageNet — arXiv:1806.00451；arXiv:1902.10811
- Hardt 2026, *The Emerging Science of ML Benchmarks* — mlbenchmarks.org

### 子主线 2：污染
- Zhang et al. (Scale AI) 2024, GSM1k — arXiv:2405.00332
- **Mirzadeh et al. (Apple) 2025, GSM-Symbolic — arXiv:2410.05229**（GSM-NoOp 掉分 up to 65%）
- Shojaee et al. (Apple) 2026, *The Illusion of Thinking*（NeurIPS）
- Yang et al. 2023, *Rethinking Benchmark and Contamination / LLM Decontaminator* — arXiv:2311.04850
- Dong et al. 2024, *Generalization or Memorization*（ACL Findings）
- Duan et al. 2024, *Do MIAs Work on LLMs?* — arXiv:2402.07841
- Meeus et al. 2025, *SoK: MIA on LLMs Are Rushing Nowhere*（IEEE SaTML）
- Dekoninck et al. 2024, *Evading Data Contamination Detection Is (Too) Easy* — arXiv:2402.02823
- Liu et al. 2024, *Infini-gram* — arXiv:2401.17377
- **Schaeffer et al. 2026, *Quantifying the Effect of Test Set Contamination on Generative Evaluations* / *The Contamination Paradox* — arXiv:2601.04301**
- Xu et al. 2024 综述 — arXiv:2406.04244；Cheng et al. 2025 — arXiv:2502.14425
- Spiesberger et al. 2026, *Soft Contamination* — arXiv:2602.12413；Wei et al. 2025, *Hubble* — arXiv:2510.19811

### 子主线 3：基准出错与饱和
- **Gema et al. 2024/2025, *Are We Done with MMLU?* / MMLU-Redux — arXiv:2406.04127**（错题率 6.49%，5700 重标注）
- Wang et al. 2024, *MMLU-Pro* — arXiv:2406.01574
- Zhao et al. 2025, *MMLU-CF*（ACL）
- Molfese et al. 2025, *Right Answer, Wrong Score*（ACL Findings）
- Vendrow et al. 2024/2025, *Do LLM Benchmarks Test Reliability?*（Platinum Benchmarks）
- **Akhtar, Reuel, Soni et al. 2026, *A Systematic Study of Benchmark Saturation* — arXiv:2602.16763**（饱和 42.9%→54.5%；藏题无助于防饱和）
- Stanford HAI, *AI Benchmarks Hit Saturation* — https://hai.stanford.edu/news/ai-benchmarks-hit-saturation
- VentureBeat 2025/2026, Artificial Analysis 改版 Intelligence Index

### 子主线 4：Arena 可玩性与治理
- Singh et al. 2025, *The Leaderboard Illusion* — arXiv:2504.20879（NeurIPS 2025 D&B）
- **Min, Pang, Du, Liu, Cheng, Lin 2025, *Improving Your Model Ranking on Chatbot Arena by Vote Rigging* — arXiv:2501.17858**
- Ameli et al., *A Statistical Framework for Ranking LLM-Based Chatbots*（Berkeley）
- Simon Willison 2025-04-30, *Understanding the Recent Criticism of the Chatbot Arena* — https://simonwillison.net/2025/Apr/30/criticism-of-the-chatbot-arena/
- LMArena 官方回应 — https://arena.ai/blog/our-response/
- **LMArena 融资**：Reuters 2026-01-06《triples its valuation to $1.7 billion》— https://www.reuters.com/technology/ai-startup-lmarena-triples-its-valuation-17-billion-latest-fundraise-2026-01-06/；TechCrunch 2026-01-06

### 子主线 5：前沿基准自我崩塌（SWE-bench 弧线）
- Jimenez et al. 2023, *SWE-bench* — arXiv:2310.06770
- Aleithan et al. 2024, *SWE-bench+* — arXiv:2410.06992（32.67% solution leakage；解决率 12.47%→3.97%）
- Zhou et al. 2025, *LessLeak-Bench* — arXiv:2502.06215
- Prathifkumar et al. 2025, *Does SWE-Bench-Verified Test Agent Ability or Model Memory?* — arXiv:2512.10218
- Deng et al. (Scale AI) 2025, *SWE-bench Pro* — arXiv:2509.16941
- **OpenAI 2026, *Why We No Longer Evaluate SWE-bench Verified* —** https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/（≥16.4% 任务缺陷；最难 138 题 59% 损坏；记忆 gold patch）
- **OpenAI 2026-07, *Separating Signal from Noise in Coding Evaluations* —** https://openai.com/index/separating-signal-from-noise-coding-evaluations/（SWE-bench Pro ~30% 损坏，撤回推荐）
- Jain et al. 2025, *LiveCodeBench* — arXiv:2403.07974；White et al. 2024, *LiveBench* — arXiv:2406.19314
- Badertdinov et al. 2026, *SWE-rebench*；Zhang et al. 2026, *SWE-bench Goes Live!*

---

### 与既有 05 报告的接口（给主线整合者）
- 本文**不改** 05 的理论结论（Goodhart 四型、Gao 过优化抛物线、Perdomo 稳定≠最优、Skalse 不可玩性），只把**实证强度**细化为：**经典测试集重用→弱（子主线1）；污染→路径依赖、常被洗掉（子主线2）；基准出错/饱和→部分是数据脏与标注天花板，"饱和加速"被打折（子主线3）；Arena→可主动博弈且裁判已商业化（子主线4）；agentic coding→记忆 gold patch 的实锤且替身也在崩（子主线5）**。
- **一处应回填 05 的纠讹**：05 "SWE-bench 弃用"段的 32.67% solution leakage 应改注为出自 **SWE-bench+（Aleithan 2024）**，与 OpenAI Verified 帖的 16.4%/59% 分列。
