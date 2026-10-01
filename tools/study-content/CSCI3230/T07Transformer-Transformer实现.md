# CSCI3230 T07Transformer · Part 1/1 Transformer implementation

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：T07Transformer，第 1 部分 / 共 1 部分 · 原件 [T07-Transformer-未核.pdf](../辅导/T07-Transformer-未核.pdf) p.1–11
> 定位：用形状与信息流读完整 encoder–decoder；配套输出只是随机输入前向运行。

配套：[T07-Transformer-未核.ipynb](../辅导/T07-Transformer-未核.ipynb)。按 PDF 顺序解释；打印版裁掉的代码由 notebook 原始单元核对。来源未核的身份保留。

### 位置编码先告诉模型“在哪里”（p.1）

> **p.1** `class PositionalEncoding(nn.Module)`

注意力配对本身不会自动知道 token 的先后，位置编码把位置加到词向量。偶数、奇数维分别为

$$
PE(pos,2i)=\sin\left(pos/10000^{2i/d_{model}}\right),\quad PE(pos,2i+1)=\cos\left(pos/10000^{2i/d_{model}}\right).
$$

不同维度的频率不同，组合成位置特征。注册为 buffer 表示它随模型迁移设备、保存状态，但不是通过梯度学习的参数。代码预先存到 `max_len`，实际序列不能超过这个表；当前切片实现还隐含偶数 $d_{model}$，奇数宽度可能使余弦赋值形状不匹配。

“可构造更长位置的编码”与“模型在更长序列上可靠泛化”不同。前者来自公式，后者仍需实验，本 notebook 没有提供这类测试。

### 批、序列、模型宽度与头（p.2）

> **p.2** `d_k = d_model // num_heads`

位置编码演示输入为 $2\times10\times128$，分别是批数、长度、特征宽度；位置表前十行按批广播相加，输出形状不变。注意力类演示改用 $d_{model}=256$、8 个头，所以每头 $d_k=32$。需保证 256 可被 8 整除。

四个线性映射 $W_Q,W_K,W_V,W_O$ 都是 256 到 256，分头发生在投影之后。不是给每个头复制一份完整 256 维注意力；总特征宽度被拆成八份。

### 多头内部的配对、掩码与汇集（p.3）

> **p.3** `scores.masked_fill(mask == 0, -1e9)`

投影后从 $B\times L\times D$ reshape、transpose 成 $B\times h\times L\times d_k$。计算

$$
S=QK^T/\sqrt{d_k},\quad A=\operatorname{softmax}(S,\text{over keys}),\quad H=AV.
$$

$S$ 形状为 $B\times h\times L_q\times L_k$，每个 query 行对所有 key 分配权重。比如一行得分 $(0,\log3)$，softmax 为 $(1/4,3/4)$；若 value 分别是 2、6，输出为 $1/4\cdot2+3/4\cdot6=5$。这说明权重作用于 value，而非直接输出得分。

mask 在 softmax 前将不可见位置改成很大的负数，使其概率接近零。若整行都被填成同一个有限的 $-10^9$，softmax 反而给均匀分布，不能假定全被屏蔽的行自动输出零。应保证有效 query 至少有可读 key，并正确处理 padding。

代码对注意力权重再做 dropout，因此返回的训练态权重不再保证每行精确和为 1。最后转回 $B\times L_q\times D$，调用 `contiguous()` 后再 view，是为了处理 transpose 后的内存布局。

### 输出形状与逐位置前馈层（p.4）

> **p.4** `class FeedForward(nn.Module)`

示例 self-attention 输入 $2\times10\times256$，输出同形状，权重 $2\times8\times10\times10$。两个 10 分别对应 query 与 key；换成交叉注意力时它们可以不同。

FFN 是 $256\to1024\to256$，中间 ReLU 与 dropout。它独立处理每个位置的特征，因此扩展的是特征维度，不是把长度 10 变成 1024；输出仍是 $2\times10\times256$。跨位置混合由注意力负责，FFN 提供每位置的非线性变换。

### Encoder 的残差与归一化（p.5–6）

> **p.5** `class EncoderLayer(nn.Module)`

此实现先 self-attention，再 residual add 与 LayerNorm，然后 FFN，再 add 与 LayerNorm，是 post-norm 结构。残差相加要求两支宽度相同；LayerNorm 归一化最后的特征维，而不是把整个 batch 混合成一个均值。

输入不变的形状方便把多层堆起来，但“形状相同”不表示数值未变。每层都会重新用上下文更新表示。p.6 的演示检查输出仍为 $2\times10\times256$，随后进入 decoder。

### Decoder 的两类注意力（p.7）

> **p.7** `self.cross_attention(tgt, memory, memory, src_mask)`

第一段是目标序列 self-attention；第二段交叉注意力中，query 来自 decoder 当前目标表示，key/value 来自 encoder 的源序列表示；最后接 FFN。三段各有残差和归一化。

若目标长 8、源长 10，批为 2、头为 8，则交叉注意力权重形状 $2\times8\times8\times10$；这里第一个 8 是头数，第二个 8 是目标 query 数。单层演示直接调用 decoder 而没有传 mask，因此**该演示本身并不因类名为 decoder 就具有因果性**；因果掩码在下面的完整模型中构造。

### 完整模型的规模（p.8）

> **p.8** `class Transformer(nn.Module)`

源词表 10000、目标词表 8000，模型宽度 512、8 个头，编码器和解码器各六层，FFN 隐宽 2048。输入是整数 token ID，经两个独立 embedding 表转换为向量；词表大小与序列长度不同，一个决定可表示多少种 token，另一个决定本次放了多少位置。

模型不是图像分类的 ViT；这里是源序列到目标序列的 encoder–decoder。与 [L08](L08-P2-视觉Transformer.md) 对照时，应把 patch token 与词 token 区分，同时看到它们共享注意力与残差等组件。

### padding 与未来信息的两个屏蔽条件（p.9）

> **p.9** `torch.tril`

源 mask 形状 $B\times1\times1\times L_{src}$，屏蔽作为 key 的 padding。目标 mask 把非 padding key 条件与下三角矩阵相与，形状 $B\times1\times L_{tgt}\times L_{tgt}$。长度 3 的因果可见性为

$$
\begin{pmatrix}1&0&0\\1&1&0\\1&1&1\end{pmatrix}.
$$

第 2 个位置可读自己和第 1 个位置，不能读未来第 3 个位置。这个矩阵仍不自动把 padding query 的输出清零；训练损失还应忽略 padding 目标。模型给 ID 0 作为 padding，随机生成示例可能恰好出现 0，需要按此约定解释。

embedding 乘 $\sqrt{d_{model}}$ 后加位置编码，是调整两种信息的相对尺度。它不是注意力得分里除 $\sqrt{d_k}$ 的同一操作：发生位置与目的不同。

### 从 encoder 到词表得分（p.10）

> **p.10** `self.output_projection(dec_output)`

源表示通过六个 encoder，目标表示带掩码通过六个 decoder，最后每个目标位置从 512 映射到 8000 个 logits。代码注释若称概率分布，需要补充 softmax 才成立；返回 tensor 本身没有保证非负与和为 1。

若要训练下一 token，必须使 decoder 输入与目标标签错开一位，并在损失中忽略 padding；本页只是网络前向接口，并未提供完整训练与生成循环。没有训练就不能从随机 logits 读出翻译质量。

### 输出与 57458496 个参数如何组成（p.11）

> **p.11** “Total parameters: 57,458,496”

保存输出：源输入 $2\times10$，目标输入 $2\times8$，输出 $2\times8\times8000$。参数可按组件独立核对：

|组件|含偏置计数|总数|
|---|---|---:|
|两套 embedding|$(10000+8000)512$|9216000|
|每个 MHA|$4(512^2+512)$|1050624|
|每个 FFN|$512\cdot2048+2048+2048\cdot512+512$|2099712|
|六层 encoder|$6(1050624+2099712+2\cdot1024)$|18914304|
|六层 decoder|$6(2\cdot1050624+2099712+3\cdot1024)$|25224192|
|输出投影|$512\cdot8000+8000$|4104000|

总数将两套 embedding、六层 encoder、六层 decoder、输出投影四行相加得 **57458496**；中间 MHA/FFN 行只是分项，不再重复相加。每个 LayerNorm 有 512 个缩放和 512 个平移，共 1024。固定位置编码不是可训练参数，因此不计入。这个数与原件吻合，验证的是结构计数，不是学习效果。

## 本讲核心考点

- Q/K/V、多头维度、softmax 轴与输出形状承接主课 L08；此实现是 C 级辅导覆盖。
- 因果 mask 屏蔽未来 key；padding mask 与损失忽略 padding 配合，不能只靠层的名称推断。
- 原件仅有随机前向示例，未给出训练、完整推理循环或翻译性能证据。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[T07-Transformer-未核.pdf](../辅导/T07-Transformer-未核.pdf)，p.1–11；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
