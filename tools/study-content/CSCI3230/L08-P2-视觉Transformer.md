# CSCI3230 L08 · Part 2/4 Vision Transformers

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2025T1
> 本讲：L08，第 2 部分 / 共 4 部分 · 原件 [L08-Transformers-2025T1.pdf](../课件/25/L08-Transformers-2025T1.pdf) p.30–42
> 定位：把图像切为patch，再使用序列模块。
> 前后：上一份 [Basics](L08-P1-注意力基础.md) · 下一份 [Variants of Transformers](L08-P3-变体与多模态.md)

本文依据 **2025T1 旧版材料**重写，供基础学习与预习；不是 2026T1 新增要求或考试范围。补充数值例均另行标注。

## 图像怎样变成token

### 空间注意力的问题（p.30–32）

前篇处理一串词向量，现在把输入换成图片。网络接受的是一串固定宽度的向量，图片却有高、宽、颜色通道，所以真正的第一步不是“直接套Transformer”，而是先决定每个token代表哪部分图像。

p.30分隔页，p.31说明视觉中也可根据query关注相关区域，p.32提出二维RGB如何变序列。最直接的ViT做法是切成不重叠的小方块，每块叫一个patch。先用patch代表局部内容，再让各块互相读取信息。

### ViT结构与展开patch（p.33–35）【新】

p.33结构图依次是切块、展平、线性投影、加位置、Transformer encoder、分类头。额外class token不是图中切出的某个块；它是一条可学习的初始向量，经过多层读取后用来汇聚分类信息。

先做小例（补充自取）：一张4×4灰度图，按2×2切成四块。每块4个数，按固定顺序排成长度4向量。假设左上块两行为 $(1,2),(3,4)$，展平为 $(1,2,3,4)$。使用一个 $4\times2$ 投影矩阵，其四行为 $(1,0),(0,1),(1,0),(0,1)$，偏置0，输出变为 $(1+3,2+4)=(4,6)$。于是每块从4维变2维，但patch个数仍是4。若加class token，序列长度才从4变5。

一般图像高 $H$、宽 $W$、通道 $C$，patch边长 $P$，假设高宽都整除 $P$：

$$
n=\frac{H}{P}\frac{W}{P},\qquad d_{\rm patch}=P^2C.
$$

$n$ 回答有多少块，$d_{\rm patch}$ 回答一块含多少原始数。模型想要宽度 $D$ 时，每块用同一个 $P^2C\times D$ 矩阵投影。$D$ 是设计选择，不必等于原始块维度。

p.34–35实际例为96×96 RGB、patch32：横纵各3块，总共9块；每块 $32\cdot32\cdot3=3072$ 维，投影到768维。不要把9、3072、768混成同一种“维度”。

### 与普通线性层及卷积的关系（p.36–38）

p.36–37把每块看成小图，并在每块上用同一线性映射。这个“每个位置都用同一套权重”的描述，正好与卷积的共享方式吻合。

如果卷积kernel大小为 $P$、stride也为 $P$、padding0，输入通道 $C$、输出通道 $D$，一个核每次完整读一块 $P\times P\times C$，输出一个标量；$D$ 个核输出该块的 $D$ 维向量。移动步长等于块宽，恰好不重叠。

沿前节4×4灰度例，kernel2、stride2、输出通道2，卷积输出是2×2×2。把前两个空间轴排成序列，就得到4×2的token矩阵，与同权重的逐patch线性投影完全相同。权重排布方式不同，计算本质相同。

p.38称卷积能形成更好patch embedding，要限定：**仅把同一个不重叠线性投影换成等价卷积实现，不会自动提升表示能力**。改成重叠核或多层非线性卷积才真正改变结构。

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

四块内容排成一串后，网络仍需要知道它们原本是左上、右上、左下、右下。给每块加位置向量，使相同内容出现在不同地方时仍可区分；单纯切块编号而不把位置信息输入模型是不够的。

p.41位置相似图选右上、中心、左下查询位置，亮区跟着查询位置变化。它展示学得位置表示含空间结构，不证明所有模型都严格遵循“距离越远相似度越小”。

p.42给规模与性能关系：在所示实验中，较大模型、更多数据和计算可以改善性能。这是经验结果，需要训练设置支持，不能推出“参数翻倍必定准确率翻倍”。

**补充参数影响**：若图像高宽不变，把patch边长减半，横纵块数各翻倍，token数变4倍；标准全局attention的配对表从 $n^2$ 变为 $16n^2$。小patch保留更细空间信息，却显著增加计算。

小检查：图片大小不变，只把模型宽度D翻倍，patch数也翻倍吗？

:::hint 参考答案
不会。patch数由H、W、P决定；D改变每个token携带的特征数，以及投影和后续层的参数/计算。
:::endhint

## 本讲核心考点

- patch数量、展平维度、模型宽度分别算（p.34–40，C 级：课件两道quiz直接练习）。
- 不重叠patch投影可等价实现为大步长卷积（p.38，C 级）。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[L08-Transformers-2025T1.pdf](../课件/25/L08-Transformers-2025T1.pdf)，p.30–42；均为当前 PDF 页号。
- 本次重写核对本篇所列讲义页码；旧版作业/试题题面如保留，属于历史练习，不代表 2026T1 考核要求。未以未公开试题推断考试内容。
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
