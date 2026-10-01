# CSCI3230 L08 · Part 2/4 Vision Transformers

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2025T1
> 本讲：L08，第 2 部分 / 共 4 部分 · 原件 [L08-Transformers-2025T1.pdf](../课件/25/L08-Transformers-2025T1.pdf) p.30–42
> 定位：把图像切为patch，再使用序列模块。
> 前后：上一份 [Basics](L08-P1-注意力基础.md) · 下一份 [Variants of Transformers](L08-P3-变体与多模态.md)

## 图像怎样变成token

### 空间注意力的问题（p.30–32）

p.30为Part页；p.31指出图像查询也可关注相关区域，p.32问二维RGB怎么变成序列。网络需要确定每个序列元素代表什么，不能直接把“二维图像”当一个词。

### ViT结构与展开patch（p.33–35）【新】

p.33图把图像切块、展平、线性投影、加位置，再进encoder；额外class token用于汇聚分类信息。p.34每块对应一个token；若块P×P、C通道，原始向量P²C维。p.35映射到模型宽度D，投影权重(P²C)×D。图像为H×W且均整除P时，patch数(H/P)(W/P)，加class token后序列再多1。

### 与普通线性层及卷积的关系（p.36–38）

p.36–37将patch看成一张小图，用同一个线性映射处理每块。p.38可用kernel=P、stride=P、padding0、输入通道C、输出通道D的卷积实现完全相同映射。**课件措辞校正：** 这种不重叠单卷积与同权重的patch线性投影数学等价，不能仅换实现就断言“更好捕捉空间信息”；加入重叠或多层卷积才会改变映射结构。

图中96×96、32patch得到3×3=9块，每块3072维，投影到768；不要把3072与最终token宽度768混淆。

### 两道课堂选择题（p.39–40）

**题面**（L08-Transformers-2025T1.pdf · Quiz · p.39）

> **p.39** For an input RGB image of size 224×224 with patch size of 16×16. The hidden
> size of Transformer layer is 768. How should we configure the linear projection
> layer for patch embedding?
> 
> Q1: Use linear layers. Which of the following statement is NOT correct?
> A The number of tokens is 196
> B The input channel of the linear layer is 256
> C The output channel of the linear layer is 768

**题面**（L08-Transformers-2025T1.pdf · Quiz · p.40）

> **p.40** For an input RGB image of size 224×224 with patch size of 16×16. The hidden
> size of Transformer layer is 768. How should we configure the linear projection
> layer for patch embedding?
> 
> Q2: Use convolution layers. No overlapping among patches. Which of the
> following statement is NOT correct?
> A The number of tokens is 196
> B The input channel of the convolution layer is 3
> C The kernel size of the convolution layer is 16
> D The stride of the convolution layer is 1

224×224 RGB，patch16，模型宽768。14×14=196块，每块16×16×3=768维，线性层768→768。因此p.39 B“输入256”错，256只算空间没算RGB。p.40不重叠卷积输入通道3、kernel16、stride16、输出通道768；D“stride1”错。这里196按patch计，不含额外class token。

### 空间位置与规模（p.41–42）

**图：p.41位置相似度图。** 选右上、中心、左下位置，较亮邻域随查询位置移动，说明编码带有空间结构；不意味着任何训练后PE都严格随距离下降。p.42横轴计算量、纵轴ImageNet错误，模型/数据增大在所示实验中改善性能，称大规模预训练模型为foundation model。它是一组经验关系，不能把“大”当无需数据质量与计算配比的保证。

> **p.42** “large-scale pre-trained models”

## 本讲核心考点

- patch数量、展平维度、模型宽度分别算（p.34–40，C 级：课件两道quiz直接练习）。
- 不重叠patch投影可等价实现为大步长卷积（p.38，C 级）。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[L08-Transformers-2025T1.pdf](../课件/25/L08-Transformers-2025T1.pdf)，p.30–42；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
