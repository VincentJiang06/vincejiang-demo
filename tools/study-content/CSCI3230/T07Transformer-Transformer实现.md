# CSCI3230 T07Transformer · Part 1/1 Transformer implementation

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：T07Transformer，第 1 部分 / 共 1 部分 · 原件 [T07-Transformer-未核.pdf](../辅导/T07-Transformer-未核.pdf) p.1–11
> 定位：用形状与信息流读完整 encoder–decoder；配套输出只是随机输入前向运行。

原 PDF 与配套 notebook 文件名均标“未核”：本文核对了二者可见内容，但材料的学期与教师身份仍待确认，不据此推定 2026T1 作业要求。未运行训练，保存输出不等于本次实验。

配套：[T07-Transformer-未核.ipynb](../辅导/T07-Transformer-未核.ipynb)。按 PDF 顺序解释；打印版裁掉的代码由 notebook 原始单元核对。来源未核的身份保留。

#### 配套原代码：单元 1

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import numpy as np

torch.manual_seed(42)
```

### 位置编码先告诉模型“在哪里”（p.1）

这份notebook把模块按顺序组装起来，最后只对随机整数输入做一次前向计算。目标是读懂轴、信息流和mask，不是证明模型已会翻译。前置是 [L08注意力的逐步手算](L08-P1-注意力基础.md)。

如果两处出现同一个token，它们的初始embedding相同；只看内容的注意力没有自动的“第几个词”概念。位置编码把位置变成同样宽度的向量再相加。这里采用固定正弦/余弦，而不是学一张位置参数表：

$$
\begin{aligned}
PE(pos,2i)&=\sin\left(\frac{pos}{10000^{2i/d_{\rm model}}}\right),\\
PE(pos,2i+1)&=\cos\left(\frac{pos}{10000^{2i/d_{\rm model}}}\right).
\end{aligned}
$$

$pos$ 从0开始数位置，$d_{\rm model}$ 是向量宽度，$i$ 为一对特征的编号，$2i$ 与 $2i+1$ 是这对偶/奇数下标。同一对用相同尺度，不同对变化快慢不同。

补充自取 $d_{\rm model}=4$：第一对除数1，第二对除数100。位置0为 $(0,1,0,1)$；位置1约 $(0.8415,0.5403,0.0100,0.99995)$。把它逐元素加到词向量，而不是把位置数字直接当词ID，也不新增序列元素。

源码把表注册为buffer：它随模型迁设备、保存状态，但不是梯度更新的参数。表只预存到max_len；超过表长不能靠一句“正弦能外推”让当前切片自动变长。公式能定义更长位置，也不证明训练模型在超长序列一定可靠。当前实现偶/奇列赋值还隐含偶数宽度，奇数宽度需另行处理形状。

#### 配套原代码：单元 2

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
class PositionalEncoding(nn.Module):
    """
    Positional Encoding: Transformers lack a recurrent structure, so we need to explicitly inform the model of token positions.

    Uses sine and cosine functions of different frequencies:
    PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
    PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

    Why this design?
    - Different frequencies encode positional information at different scales
    - The periodicity of sin/cos allows the model to learn relative positions
    - Can extrapolate to sequence lengths not seen during training
    """

    def __init__(self, d_model, max_len=5000, dropout=0.1):
        super(PositionalEncoding, self).__init__()
        self.dropout = nn.Dropout(p=dropout)

        # Create positional encoding matrix [max_len, d_model]
        pe = torch.zeros(max_len, d_model)

        # Position indices [max_len, 1]
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)

        # Frequency term: 10000^(2i/d_model)
        div_term = torch.exp(
            torch.arange(0, d_model, 2).float() *
            (-math.log(10000.0) / d_model)
        )

        # Even dimensions use sin, odd dimensions use cos
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)

        # Add batch dimension [1, max_len, d_model]
        pe = pe.unsqueeze(0)

        # Register as buffer (not a parameter, no gradient needed)
        self.register_buffer('pe', pe)

    def forward(self, x):
        """
        Args:
            x: [batch_size, seq_len, d_model]
        Returns:
            Tensor with positional encoding added
        """
        x = x + self.pe[:, :x.size(1), :]
        return self.dropout(x)

# Demonstrate positional encoding
print("\n[Demonstration] Effect of Positional Encoding")
d_model = 128
max_len = 100
pos_encoder = PositionalEncoding(d_model, max_len)

# Create a dummy input
dummy_input = torch.randn(2, 10, d_model)  # batch=2, seq_len=10
output = pos_encoder(dummy_input)

print(f"Input shape: {dummy_input.shape}")
print(f"Output shape: {output.shape}")
print(f"Positional encoding matrix shape: {pos_encoder.pe.shape}")
```

原件保存输出（非本次运行）：

```text
[Demonstration] Effect of Positional Encoding
Input shape: torch.Size([2, 10, 128])
Output shape: torch.Size([2, 10, 128])
Positional encoding matrix shape: torch.Size([1, 100, 128])
```

### 批、序列、模型宽度与头（p.2）

先给每条轴写名字，避免看到两个8就当它们是一回事。位置编码演示输入2×10×128，分别是2条序列、每条10个位置、每位置128个特征。位置表1×100×128取前10行，沿batch广播相加，输出仍2×10×128。

多头示例随后改为模型宽256、头数8。每个头宽 $d_k=256/8=32$；代码先assert能整除，避免静默丢特征。

Q、K、V、输出各有一个256→256线性映射，前三个先投影，再把最后维度拆成8×32。补充小例：一token宽8、两头时，reshape相当于把8个槽分成两组4个；这是分特征轴，不是把一半token交给某头。每头仍能读取全部允许的key。

四个投影各有独立权重。一次合并大矩阵运算可以等价承载多个头的不同投影，不代表所有头共享完全相同的4维表示。

### 多头内部的配对、掩码与汇集（p.3）

沿代码的八步顺序拆开。输入query形状为 $B\times L_q\times D$，key/value为 $B\times L_k\times D$。$B$ 是batch，$L_q$ 是要产生几个输出位置，$L_k$ 是可读取多少位置，$D$ 是总特征宽。key与value必须按位置配对，所以长度相同。

投影后view成 $B\times L\times h\times d_k$，transpose换成 $B\times h\times L\times d_k$。对每个batch、每个头独立做：

$$
S=\frac{QK^T}{\sqrt{d_k}},\qquad
A=\operatorname{softmax}(S),\qquad H=AV.
$$

$S,A$ 最后两轴是 $L_q\times L_k$，softmax沿最后一轴，即同一个query在各key之间归一化。乘V后，$L_k$ 这条求和轴消失，留下 $L_q\times d_k$。

补充自取一行缩放后得分 $(0,\ln3)$，指数为1和3，权重为1/4、3/4；若value是2和6，则输出 $2/4+18/4=5$。这是加权内容，不是输出最大分数或key编号。

mask在softmax前把不可读位置改成很大负数。若只允许第一个位置，上例第二个指数几乎0，权重接近 $(1,0)$，输出接近2。若一整行都写成有限的 $-10^9$，它们仍相等，softmax反而近似均匀；不能假定“全mask就输出0”。应保证有效query至少有可读key，并妥善处理padding。

源码在softmax后还对权重用dropout，训练态返回的权重因随机置零与缩放，不保证每行恰好和为1。合并各头时先transpose回 $B\times L_q\times h\times d_k$，`contiguous()`整理存储后再view成 $B\times L_q\times D$，最后做输出投影。reshape不学习新参数，投影才学习。

#### 配套原代码：单元 3

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
class MultiHeadAttention(nn.Module):
    """
    Multi-Head Attention Mechanism

    Core Idea:
    1. Split d_model into num_heads heads, each with dimension d_k = d_model / num_heads
    2. Each head independently computes attention: Attention(Q,K,V) = softmax(QK^T/√d_k)V
    3. Concatenate outputs of all heads and pass through a linear layer

    Why use multiple heads?
    - Different heads can focus on different types of relationships
    - Similar to multi-channel CNNs, enhances expressive power
    """

    def __init__(self, d_model, num_heads, dropout=0.1):
        super(MultiHeadAttention, self).__init__()

        assert d_model % num_heads == 0, "d_model must be divisible by num_heads"

        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads  # Dimension per head

        # Linear transformations for Q, K, V (parameters for all heads combined)
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)

        # Output linear transformation
        self.W_o = nn.Linear(d_model, d_model)

        self.dropout = nn.Dropout(dropout)

    def split_heads(self, x):
        """
        Split the last dimension into multiple heads

        Args:
            x: [batch_size, seq_len, d_model]
        Returns:
            [batch_size, num_heads, seq_len, d_k]
        """
        batch_size, seq_len, d_model = x.size()
        # Reshape to [batch_size, seq_len, num_heads, d_k]
        x = x.view(batch_size, seq_len, self.num_heads, self.d_k)
        # Transpose to [batch_size, num_heads, seq_len, d_k]
        return x.transpose(1, 2)

    def forward(self, query, key, value, mask=None):
        """
        Args:
            query: [batch_size, seq_len_q, d_model]
            key:   [batch_size, seq_len_k, d_model]
            value: [batch_size, seq_len_v, d_model]  (seq_len_k == seq_len_v)
            mask:  [batch_size, 1, 1, seq_len_k] or [batch_size, 1, seq_len_q, seq_len_k]

        Returns:
            output: [batch_size, seq_len_q, d_model]
            attention_weights: [batch_size, num_heads, seq_len_q, seq_len_k]
        """
        batch_size = query.size(0)

        # 1. Linear transformations
        Q = self.W_q(query)  # [batch_size, seq_len_q, d_model]
        K = self.W_k(key)    # [batch_size, seq_len_k, d_model]
        V = self.W_v(value)  # [batch_size, seq_len_v, d_model]

        # 2. Split into multiple heads
        Q = self.split_heads(Q)  # [batch_size, num_heads, seq_len_q, d_k]
        K = self.split_heads(K)  # [batch_size, num_heads, seq_len_k, d_k]
        V = self.split_heads(V)  # [batch_size, num_heads, seq_len_v, d_k]

        # 3. Compute attention scores: QK^T / √d_k
        # [batch_size, num_heads, seq_len_q, d_k] @ [batch_size, num_heads, d_k, seq_len_k]
        # -> [batch_size, num_heads, seq_len_q, seq_len_k]
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)

        # 4. Apply mask (optional)
        # Mask purpose:
        # - Padding mask: Ignore padding positions
        # - Look-ahead mask: Prevent seeing future information in decoder
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)

        # 5. Softmax to get attention weights
        attention_weights = F.softmax(scores, dim=-1)
        attention_weights = self.dropout(attention_weights)

        # 6. Weighted sum: attention_weights @ V
        # [batch_size, num_heads, seq_len_q, seq_len_k] @ [batch_size, num_heads, seq_len_v, d_k]
        # -> [batch_size, num_heads, seq_len_q, d_k]
        context = torch.matmul(attention_weights, V)

        # 7. Concatenate heads
        # [batch_size, num_heads, seq_len_q, d_k] -> [batch_size, seq_len_q, num_heads, d_k]
        context = context.transpose(1, 2).contiguous()
        # -> [batch_size, seq_len_q, d_model]
        context = context.view(batch_size, -1, self.d_model)

        # 8. Final linear transformation
        output = self.W_o(context)

        return output, attention_weights

# Demonstrate multi-head attention
print("\n[Demonstration] Multi-Head Attention Computation")
d_model = 256
num_heads = 8
mha = MultiHeadAttention(d_model, num_heads)

# Create input
batch_size = 2
seq_len = 10
query = torch.randn(batch_size, seq_len, d_model)
key = torch.randn(batch_size, seq_len, d_model)
value = torch.randn(batch_size, seq_len, d_model)

output, attn_weights = mha(query, key, value)

print(f"Input shape: {query.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {attn_weights.shape}")
print(f"  - batch_size: {attn_weights.shape[0]}")
print(f"  - num_heads: {attn_weights.shape[1]}")
print(f"  - seq_len_q x seq_len_k: {attn_weights.shape[2]} x {attn_weights.shape[3]}")
```

原件保存输出（非本次运行）：

```text
[Demonstration] Multi-Head Attention Computation
Input shape: torch.Size([2, 10, 256])
Output shape: torch.Size([2, 10, 256])
Attention weights shape: torch.Size([2, 8, 10, 10])
  - batch_size: 2
  - num_heads: 8
  - seq_len_q x seq_len_k: 10 x 10
```

### 输出形状与逐位置前馈层（p.4）

示例Q/K/V输入都为2×10×256，输出为2×10×256，权重为2×8×10×10。最后两个10分别是query位置和key位置；形状相同不表示它们角色相同。源码这个独立MHA演示分别随机生成query/key/value，严格说不是同一输入张量的self-attention演示；encoder调用时才明确传同一个x三次。

FFN为256→1024→256，中间ReLU和dropout。它对每个位置独立用同一组线性参数，改变的是特征宽度，不是序列长度。2×10×256在内部变2×10×1024，再回2×10×256。

补充追踪一个位置：原来256个特征，第一层产生1024种组合，ReLU保留正响应，第二层将这些组合重新混合为256维。这个过程没有直接读取邻词；邻词信息来自此前attention。若把序列长度10改20，FFN处理的行数翻倍，而每行的矩阵形状与参数量不变。

#### 配套原代码：单元 4

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
print("\n" + "="*70)
print("Part 3: Feed-Forward Network - Position-Independent Nonlinear Transformation")
print("="*70)

class FeedForward(nn.Module):
    """
    Feed-Forward Neural Network: Two-layer fully connected network

    FFN(x) = max(0, xW1 + b1)W2 + b2

    Features:
    - Applied independently to each position in the sequence (position-wise)
    - The intermediate layer is typically larger than d_model (commonly 4 times)
    - Enhances the model's nonlinear expressive power
    """

    def __init__(self, d_model, d_ff, dropout=0.1):
        super(FeedForward, self).__init__()

        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        """
        Args:
            x: [batch_size, seq_len, d_model]
        Returns:
            [batch_size, seq_len, d_model]
        """
        # x -> [batch_size, seq_len, d_ff] -> [batch_size, seq_len, d_model]
        return self.linear2(self.dropout(F.relu(self.linear1(x))))

# Demonstrate feed-forward network
print("\n[Demonstration] Feed-Forward Network")
d_model = 256
d_ff = 1024  # Typically 4 times d_model
ffn = FeedForward(d_model, d_ff)

x = torch.randn(2, 10, d_model)
output = ffn(x)

print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")
print(f"Intermediate layer dimension: {d_ff}")
```

原件保存输出（非本次运行）：

```text
======================================================================
Part 3: Feed-Forward Network - Position-Independent Nonlinear Transformation
======================================================================

[Demonstration] Feed-Forward Network
Input shape: torch.Size([2, 10, 256])
Output shape: torch.Size([2, 10, 256])
Intermediate layer dimension: 1024
```

### Encoder 的残差与归一化（p.5–6）

encoder将整个输入序列编码成上下文表示。源码先调用`self_attention(x,x,x,mask)`，再执行残差加法与LayerNorm；然后FFN，再一次残差与LayerNorm。这是post-norm顺序，不能与“先归一化再进子层”的pre-norm混写。

以一个宽度2的位置作补充自取例：输入 $x=(1,3)$，假设attention输出 $(0.5,-0.5)$，暂不考虑dropout，残差相加得 $(1.5,2.5)$。均值2，平均平方偏差0.25，暂略极小项且缩放1平移0，LayerNorm给 $(-1,1)$。实际网络宽256或512、缩放平移可训练，但“对每个位置自己的特征做归一化”的逻辑相同。

两支相加必须形状一致。残差提供保留原表示与梯度传播的路径，并不意味着该层输出等于输入。p.6的2×10×256只证实接口形状；值已经经过attention、归一化和FFN改变。把多个encoder层堆起，仍每层保持同一外部形状，才方便继续连接。

#### 配套原代码：单元 5

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
print("\n" + "="*70)
print("Part 4: Encoder Layer - Combining Components")
print("="*70)

class EncoderLayer(nn.Module):
    """
    Transformer Encoder Layer

    Structure:
    1. Multi-Head Self-Attention
    2. Add & Norm (Residual Connection + Layer Normalization)
    3. Feed-Forward Network
    4. Add & Norm

    Why Add & Norm?
    - Residual Connection: Mitigates vanishing gradients, aids deep network training
    - Layer Norm: Stabilizes training, accelerates convergence
    """

    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super(EncoderLayer, self).__init__()

        self.self_attention = MultiHeadAttention(d_model, num_heads, dropout)
        self.feed_forward = FeedForward(d_model, d_ff, dropout)

        # Layer Normalization
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        """
        Args:
            x: [batch_size, seq_len, d_model]
            mask: [batch_size, 1, 1, seq_len]
        Returns:
            [batch_size, seq_len, d_model]
        """
        # Self-Attention sublayer
        attn_output, _ = self.self_attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))  # Add & Norm

        # Feed-Forward sublayer
        ff_output = self.feed_forward(x)
        x = self.norm2(x + self.dropout(ff_output))  # Add & Norm

        return x

# Demonstrate Encoder layer
print("\n[Demonstration] Encoder Layer")
encoder_layer = EncoderLayer(d_model=256, num_heads=8, d_ff=1024)

x = torch.randn(2, 10, 256)
output = encoder_layer(x)

print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")
```

原件保存输出（非本次运行）：

```text
======================================================================
Part 4: Encoder Layer - Combining Components
======================================================================

[Demonstration] Encoder Layer
Input shape: torch.Size([2, 10, 256])
Output shape: torch.Size([2, 10, 256])
```

### Decoder 的两类注意力（p.7）

decoder比encoder多一段“向源序列查资料”。第一段对目标序列自身做attention，第二段用目标当前表示当query、encoder输出当key和value，第三段FFN。每段后都有残差与归一化。

源码实际调用为`self.cross_attention(x, encoder_output, encoder_output, src_mask)`。目标位置问“为生成下一步，源句哪些位置有关”，源表示同时提供匹配索引和读取内容。这是cross-attention，与源序列在自身内部更新不是同一次操作。

例中目标长度8、源长度10、batch2、头8，因此交叉注意力权重为2×8×8×10。第一个8是头数，第二个8是目标query个数，10是源key数。每个目标位置都会得到新表示，输出长度仍8，不因为源长10就变10。

这一单层演示调用decoder时没有传mask；类名里写decoder不自动给它因果约束。完整模型在p.9才构造掩码。读实现应看参数实际有没有传入，不能只看注释标题。

#### 配套原代码：单元 6

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
print("\n" + "="*70)
print("Part 5: Decoder Layer - Adding Cross-Attention")
print("="*70)

class DecoderLayer(nn.Module):
    """
    Transformer Decoder Layer

    Structure:
    1. Masked Multi-Head Self-Attention (prevents attending to future information)
    2. Add & Norm
    3. Multi-Head Cross-Attention (attends to Encoder output)
    4. Add & Norm
    5. Feed-Forward Network
    6. Add & Norm

    Differences from Encoder:
    - Includes Masked Self-Attention
    - Includes Cross-Attention (connects Encoder and Decoder)
    """

    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super(DecoderLayer, self).__init__()

        self.self_attention = MultiHeadAttention(d_model, num_heads, dropout)
        self.cross_attention = MultiHeadAttention(d_model, num_heads, dropout)
        self.feed_forward = FeedForward(d_model, d_ff, dropout)

        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, encoder_output, src_mask=None, tgt_mask=None):
        """
        Args:
            x: [batch_size, tgt_len, d_model] - decoder input
            encoder_output: [batch_size, src_len, d_model] - encoder output
            src_mask: [batch_size, 1, 1, src_len] - source sequence mask
            tgt_mask: [batch_size, 1, tgt_len, tgt_len] - target sequence mask
        Returns:
            [batch_size, tgt_len, d_model]
        """
        # 1. Masked Self-Attention
        attn_output, _ = self.self_attention(x, x, x, tgt_mask)
        x = self.norm1(x + self.dropout(attn_output))

        # 2. Cross-Attention (attending to encoder output)
        attn_output, _ = self.cross_attention(x, encoder_output, encoder_output, src_mask)
        x = self.norm2(x + self.dropout(attn_output))

        # 3. Feed-Forward
        ff_output = self.feed_forward(x)
        x = self.norm3(x + self.dropout(ff_output))

        return x

# Demonstrate Decoder layer
print("\n[Demonstration] Decoder Layer")
decoder_layer = DecoderLayer(d_model=256, num_heads=8, d_ff=1024)

tgt = torch.randn(2, 8, 256)  # decoder input
encoder_out = torch.randn(2, 10, 256)  # encoder output

output = decoder_layer(tgt, encoder_out)

print(f"Decoder input shape: {tgt.shape}")
print(f"Encoder output shape: {encoder_out.shape}")
print(f"Decoder output shape: {output.shape}")
```

原件保存输出（非本次运行）：

```text
======================================================================
Part 5: Decoder Layer - Adding Cross-Attention
======================================================================

[Demonstration] Decoder Layer
Decoder input shape: torch.Size([2, 8, 256])
Encoder output shape: torch.Size([2, 10, 256])
Decoder output shape: torch.Size([2, 8, 256])
```

### 完整模型的规模（p.8）

完整实例源词表10000、目标词表8000，宽度512、8头，encoder和decoder各6层，FFN内部宽2048。这里的词表大小回答“能用多少种ID”；序列长度回答“本次输入多少个位置”。两者无须相等。

源码先用两套独立embedding查表，把源ID与目标ID分别变512维向量。补充极小例：词表5种、宽3时，embedding是5×3参数表，输入ID序列 $(2,4)$ 就取第2、4行，输出2×3，并不是把数字2和4按连续大小送进回归。

此模型是序列到序列encoder–decoder，不是 [ViT图片分类](L08-P2-视觉Transformer.md)。两者共享attention、FFN等积木，但输入准备、输出头和任务不同。没有实际tokenizer、训练数据、loss循环和解码过程，只建模型类并不能直接变成可用翻译系统。

### padding 与未来信息的两个屏蔽条件（p.9）

两条不同长度的句子放进一个矩形batch，需要在短句末尾补padding。padding不是有意义词，不能让其他位置把它当正文读取。源码源mask形状为 $B\times1\times1\times L_{\rm src}$，会广播到各头及各query，屏蔽padding **key**。

目标还要防读取未来。长度3时下三角可见性为

$$
C=\begin{pmatrix}1&0&0\\1&1&0\\1&1&1\end{pmatrix}.
$$

行是提问位置，列是被读取位置。第二行允许读第一和第二位置，不允许第三。再把key非padding条件逐元素相与。

补充自取目标ID为 $(7,9,0)$，0代表padding，key有效性为 $(1,1,0)$，合并得到

$$
M=\begin{pmatrix}1&0&0\\1&1&0\\1&1&0\end{pmatrix}.
$$

第三行并没全变0，因为这份mask屏蔽的是padding作为key，不是把padding query的输出清零。训练loss仍应忽略padding标签，不能只靠attention mask处理一切。示例随机ID可能出现0，也会按padding解释。

源码还把embedding乘 $\sqrt{d_{\rm model}}$ 再加位置编码，以调节尺度。这与attention分数除 $\sqrt{d_k}$ 发生在不同地方、处理不同对象：一个是输入表示，一个是匹配得分。

### 从 encoder 到词表得分（p.10）

把整个前向按输入输出读一遍：源整数ID经embedding、位置编码、六层encoder，成为每个源位置512维的memory；目标整数ID经自己的embedding与位置编码，带mask经过六层decoder，得到每个目标位置512维表示。

最后源码是`output = self.fc_out(decoder_output)`。这个Linear把每个位置512维映射到8000个词表logits，输出形状为 $B\times L_{\rm tgt}\times8000$。旧笔记写`output_projection(dec_output)`并非实际源码标识，本次按PDF及ipynb纠正。

logits不是概率。补充自取三个候选得分 $(2,1,0)$，softmax约 $(0.665,0.245,0.090)$ 才和为1；代码返回前并没有这一步，所以原注释里的“Probability distribution”不准确。若接CrossEntropyLoss，应按接口直接传logits，不盲目补softmax。

若训练下一token预测，decoder输入和目标标签必须错开一位，否则可能让位置直接看到要预测的词。补充示意：输入“起始符、我、吃”，标签“我、吃、苹果”。因果mask负责不看未来，错位负责定义正确的预测任务，两者不可互相代替。原件没有给完整训练与生成循环，也没有翻译质量证据。

**补充 · 掩码的正确性可以用输入扰动测试**（通识讲解；演示数据不属于原题）。

只检查mask矩阵长得像下三角还不够，须确认它实际传到了分数计算。一个可执行的诊断是固定参数、关闭随机dropout、保持前缀相同，只改变较后位置的token，然后比较较早位置的输出。正确使用因果mask时，在这些条件下较早输出不应依赖被屏蔽的未来内容；若发生明显变化，优先查mask轴、广播形状或遗漏传参。

同样可保持源句非padding内容不变，改变被屏蔽padding位置的输入表示，检查有效query的cross-attention是否仍读到了它们。注意分清源码中“按ID是否为0生成mask”与“给定固定mask再扰动表示”：若把padding ID改成普通ID，mask本身也变了，那已不是同一个屏蔽条件，不能据此判断实现错误。

本段描述测试设计，不声称本次已经运行这些前向实验；原件随机前向输出只能证实当次接口形状，不能单独证明因果隔离或翻译能力。

#### 补充：用完全可复算的小注意力检查因果遮罩

以下自编标准库例只测试一个注意力汇集步骤，不是原大型模型的运行结果。固定Q/K得到的分数为全0，所以允许位置等权；只改变最后一个value，查看早先输出是否受影响。

```python
def causal_average(values):
    # 第 i 行仅允许 key 0 到 i；全零分数使有效 key 等权。
    return [sum(values[:i + 1]) / (i + 1) for i in range(len(values))]

before = causal_average([2.0, 4.0, 6.0])
after = causal_average([2.0, 4.0, 600.0])
assert before == [2.0, 3.0, 4.0]
assert after[:2] == before[:2]
assert after[2] == 202.0
```

第0行只读2，第1行只读2与4，故不受未来value改变影响；第2行可以读全部，结果从4变202。若无遮罩，所有行都读全体，前两行也会变化，测试便能区分两种行为。

这个简化测试验证的是屏蔽关系的预期语义；原模型还需另外检查Q/K分数、多个头、广播、残差路径与训练行为。尤其保持被测前缀与mask不变，并关闭随机dropout，否则输出变化可能来自别的因素。通过小例不等于57,458,496参数的完整模型已完成训练或通过全部因果测试。

### 输出与 57458496 个参数如何组成（p.11）

原件保存输出写“Model parameter count: 57,458,496”，源输入2×10、目标输入2×8、结果2×8×8000。它说明随机样本可走过所示前向，不能说明模型已经学会语言。

把大参数数拆成能独立检查的小块。宽度512的线性512→512，每个输出有512权重加1偏置，共 $512^2+512$；一个MHA有Q、K、V、O四层，所以乘4。FFN两层要分别数各自输出偏置。LayerNorm每个特征有缩放与平移，因此一层为 $2\cdot512=1024$。

|组件|含偏置计数|总数|
|---|---|---:|
|两套 embedding|$(10000+8000)512$|9216000|
|每个 MHA|$4(512^2+512)$|1050624|
|每个 FFN|$512\cdot2048+2048+2048\cdot512+512$|2099712|
|六层 encoder|$6(1050624+2099712+2\cdot1024)$|18914304|
|六层 decoder|$6(2\cdot1050624+2099712+3\cdot1024)$|25224192|
|输出投影|$512\cdot8000+8000$|4104000|

总数将两套 embedding、六层 encoder、六层 decoder、输出投影四行相加得 **57458496**；中间 MHA/FFN 行只是分项，不再重复相加。每个 LayerNorm 有 512 个缩放和 512 个平移，共 1024。固定位置编码不是可训练参数，因此不计入。这个数与原件吻合，验证的是结构计数，不是学习效果。

小检查：序列从10个词变20个词，embedding参数是否翻倍？

:::hint 参考答案
不会。embedding表由词表大小与模型宽度决定；访问更多行会增加计算/激活，表本身不自动变大。标准attention配对开销则会随序列长度明显增加。
:::endhint

#### 配套原代码：单元 7

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
print("\n" + "="*70)
print("Part 6: Complete Transformer - Assembling All Components")
print("="*70)

class Transformer(nn.Module):
    """
    Complete Transformer Model

    Structure:
    - Encoder: Stack of N EncoderLayer
    - Decoder: Stack of N DecoderLayer
    - Embedding layer
    - Positional encoding
    - Output layer (Linear + Softmax)
    """

    def __init__(self,
                 src_vocab_size,    # Source language vocabulary size
                 tgt_vocab_size,    # Target language vocabulary size
                 d_model=512,       # Model dimension
                 num_heads=8,       # Number of attention heads
                 num_layers=6,      # Number of encoder/decoder layers
                 d_ff=2048,         # Feed-forward network intermediate dimension
                 dropout=0.1,       # Dropout probability
                 max_len=5000):     # Maximum sequence length

        super(Transformer, self).__init__()

        self.d_model = d_model

        # Embedding layers (convert token ids to vectors)
        self.src_embedding = nn.Embedding(src_vocab_size, d_model)
        self.tgt_embedding = nn.Embedding(tgt_vocab_size, d_model)

        # Positional encoding
        self.pos_encoding = PositionalEncoding(d_model, max_len, dropout)

        # Encoder layers
        self.encoder_layers = nn.ModuleList([
            EncoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])

        # Decoder layers
        self.decoder_layers = nn.ModuleList([
            DecoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])

        # Output layer (project to target vocabulary)
        self.fc_out = nn.Linear(d_model, tgt_vocab_size)

        self.dropout = nn.Dropout(dropout)

    def make_src_mask(self, src, pad_idx=0):
        """
        Create source sequence mask (to ignore padding)

        Args:
            src: [batch_size, src_len]
            pad_idx: Index of padding token
        Returns:
            [batch_size, 1, 1, src_len]
        """
        src_mask = (src != pad_idx).unsqueeze(1).unsqueeze(2)
        return src_mask

    def make_tgt_mask(self, tgt, pad_idx=0):
        """
        Create target sequence mask (padding + prevent seeing future)

        Args:
            tgt: [batch_size, tgt_len]
        Returns:
            [batch_size, 1, tgt_len, tgt_len]
        """
        tgt_len = tgt.size(1)

        # Lower triangular matrix (prevents seeing future information)
        tgt_sub_mask = torch.tril(
            torch.ones(tgt_len, tgt_len, device=tgt.device)
        ).bool()

        # Padding mask
        tgt_pad_mask = (tgt != pad_idx).unsqueeze(1).unsqueeze(2)

        # Combine both masks
        tgt_mask = tgt_sub_mask & tgt_pad_mask

        return tgt_mask

    def encode(self, src, src_mask):
        """
        Encoder forward pass

        Args:
            src: [batch_size, src_len]
            src_mask: [batch_size, 1, 1, src_len]
        Returns:
            [batch_size, src_len, d_model]
        """
        # Embedding + positional encoding
        x = self.src_embedding(src) * math.sqrt(self.d_model)
        x = self.pos_encoding(x)

        # Pass through all encoder layers
        for layer in self.encoder_layers:
            x = layer(x, src_mask)

        return x

    def decode(self, tgt, encoder_output, src_mask, tgt_mask):
        """
        Decoder forward pass

        Args:
            tgt: [batch_size, tgt_len]
            encoder_output: [batch_size, src_len, d_model]
            src_mask: [batch_size, 1, 1, src_len]
            tgt_mask: [batch_size, 1, tgt_len, tgt_len]
        Returns:
            [batch_size, tgt_len, d_model]
        """
        # Embedding + positional encoding
        x = self.tgt_embedding(tgt) * math.sqrt(self.d_model)
        x = self.pos_encoding(x)

        # Pass through all decoder layers
        for layer in self.decoder_layers:
            x = layer(x, encoder_output, src_mask, tgt_mask)

        return x

    def forward(self, src, tgt):
        """
        Complete forward pass

        Args:
            src: [batch_size, src_len] - Source sequence token ids
            tgt: [batch_size, tgt_len] - Target sequence token ids
        Returns:
            [batch_size, tgt_len, tgt_vocab_size] - Probability distribution over target vocabulary for each position
        """
        # Create masks
        src_mask = self.make_src_mask(src)
        tgt_mask = self.make_tgt_mask(tgt)

        # Encoder
        encoder_output = self.encode(src, src_mask)

        # Decoder
        decoder_output = self.decode(tgt, encoder_output, src_mask, tgt_mask)

        # Project to vocabulary
        output = self.fc_out(decoder_output)

        return output

# Create a Transformer instance
print("\n[Demonstration] Complete Transformer Model")
model = Transformer(
    src_vocab_size=10000,  # Source language vocabulary size
    tgt_vocab_size=8000,   # Target language vocabulary size
    d_model=512,
    num_heads=8,
    num_layers=6,
    d_ff=2048,
    dropout=0.1
)

# Count parameters
num_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
print(f"\nModel parameter count: {num_params:,}")

# Demonstrate forward pass
batch_size = 2
src_len = 10
tgt_len = 8

src = torch.randint(0, 10000, (batch_size, src_len))  # Source sequence
tgt = torch.randint(0, 8000, (batch_size, tgt_len))   # Target sequence

output = model(src, tgt)

print(f"\nInput:")
print(f"  Source sequence src: {src.shape}")
print(f"  Target sequence tgt: {tgt.shape}")
print(f"Output:")
print(f"  logits: {output.shape}")
print(f"    - Probability distribution over target vocabulary for each position")
```

原件保存输出（非本次运行）：

```text
======================================================================
Part 6: Complete Transformer - Assembling All Components
======================================================================

[Demonstration] Complete Transformer Model

Model parameter count: 57,458,496

Input:
  Source sequence src: torch.Size([2, 10])
  Target sequence tgt: torch.Size([2, 8])
Output:
  logits: torch.Size([2, 8, 8000])
    - Probability distribution over target vocabulary for each position
```

## 本讲核心考点

- Q/K/V、多头维度、softmax 轴与输出形状承接主课 L08；此实现是 C 级辅导覆盖。
- 因果 mask 屏蔽未来 key；padding mask 与损失忽略 padding 配合，不能只靠层的名称推断。
- 原件仅有随机前向示例，未给出训练、完整推理循环或翻译性能证据。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[T07-Transformer-未核.pdf](../辅导/T07-Transformer-未核.pdf)，p.1–11；均为当前 PDF 页号。
- 本次重写核对本篇所列讲义页码；旧版作业/试题题面如保留，属于历史练习，不代表 2026T1 考核要求。未以未公开试题推断考试内容。
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
