# CSCI3160 期中真题详细解析

本文保留已保存转录中的 10 道大题、全部判断小问、输入数据和题面自带的演示，并从题意重新推导答案。没有添加额外练习。概念的系统讲解见[详细复习](期中-全面复习稿.md)，集中回顾见[简略复习](期中-快速总结稿.md)。

当前课程目录没有这张试卷的原始照片，因此题干依据此前保存的两页转录；本次没有重新核对照片，也不能确认年份或参考答案的发布身份。以下解答是重新推导的学习答案。题干有歧义或算法与文字条件不一致的地方，会在该题中明确处理。

试卷的共同要求：

> Note 1: Write all your solutions in the answer book.
>
> Note 2: Whenever you are asked to design an algorithm, you must provide a proof of its correctness. However, you do not need to describe or analyze algorithms that have been discussed in lectures, tutorials, and regular exercises.

这意味着设计题不能只报算法名称：可以引用课堂算法作为黑盒，但要说明传入什么、取回什么、怎样据此解决本题，并证明新增步骤正确。

## Problem 1：七个判断题（14%）

<a id="q1"></a>

> Problem 1 (14%). Determine whether the following statements are true (if you think statement $i\in[1,7]$ is true, write “$i$: T” in the answer book; otherwise, write “$i$: F”):

本题的结论为：**1 T，2 F，3 T（按课程的简单图约定），4 见计数口径说明，5 F，6 F，7 T。** 第 4 问按“直到首次正面所需的总投掷次数”的通常含义为 T；如果把成功那次排除，只数此前失败次数，则为 F。

### 1.1 两个上界相加

> 1. If $f(n)=O(n^{0.95}\log n)$ and $g(n)=O(\sqrt n)$, then $f(n)+g(n)=O(n\log n)$.

**答案：T。** 需要证明的是一个上界，不要求这个上界最紧。

由题目给定的两个 $O$ 关系，存在固定常数 $c_1,c_2$，使足够大的 $n$ 满足

$$
f(n)\le c_1n^{0.95}\log n,
\qquad g(n)\le c_2\sqrt n.
$$

当 $n$ 足够大时，$n^{0.95}\le n$，且 $\sqrt n\le n\log n$。分别放大上界再相加，得到

$$
f(n)+g(n)
\le(c_1+c_2)n\log n.
$$

右边的系数与 $n$ 无关，所以符合 $O(n\log n)$ 的定义。原条件没有给出 $f,g$ 的下界，因此不能据此把最终结论改写成 $\Theta(n\log n)$。

### 1.2 两种指数增长的比较

> 2. $2^n=O(n^{\sqrt n})$.

**答案：F。** 两边都随 $n$ 很快增长，仅凭外形无法比较。把它们改写成以 $e$ 为底的指数，比较指数即可：

$$
2^n=e^{n\ln2},\qquad
n^{\sqrt n}=e^{\sqrt n\ln n}.
$$

因为 $\ln n/\sqrt n\to0$，所以 $\ln2-\ln n/\sqrt n$ 趋于正常数 $\ln2$。于是

$$
\ln\frac{2^n}{n^{\sqrt n}}
=n\ln2-\sqrt n\ln n\longrightarrow+\infty.
$$

这说明两者之比趋于无穷，不存在固定常数把 $2^n$ 压在 $n^{\sqrt n}$ 的常数倍之下。真正成立的是 $n^{\sqrt n}=O(2^n)$。

### 1.3 边数的多项式是否也是顶点数的多项式

> 3. Consider any connected graph $G=(V,E)$ (i.e., $G$ has only one connected component). If an algorithm has running time $O(\lvert E\rvert^{100})$ on $G$, then the running time is polynomial in $\lvert V\rvert$.

**答案：按本课简单图约定为 T。** 简单无向图每对顶点最多一条边，因此

$$
|E|\le\frac{|V|(|V|-1)}2=O(|V|^2).
$$

代入便得到 $O(|E|^{100})\subseteq O(|V|^{200})$。200 很大，但仍是与输入规模无关的固定指数，所以仍属于多项式时间。

这里需要的是边数的上界。连通性给出的 $|E|\ge|V|-1$ 是下界，不能用它推出此结论。若允许任意多条平行边，固定顶点数也可能有任意多条边；这时单靠“连通”不够。因此简单图的课程约定是本题成立的条件。

### 1.4 首次成功的总次数与此前失败次数

> 4. Consider a biased coin which comes up heads with probability $1/10$. Then, in expectation, you need to toss it 10 times before seeing “heads” for the first time.

令 $N$ 为直到首次正面为止的投掷总数，**包含出现正面的那一次**。每次成功概率为 $p=1/10$。第一下总要投；如果失败，后续又回到同一个等待问题：

$$
\mathbb E[N]=1+\frac9{10}\mathbb E[N],
\qquad \mathbb E[N]=10.
$$

若 $F$ 只数首次正面之前的反面次数，则 $F=N-1$，故 $\mathbb E[F]=9$。

```text
反面  反面  ...  反面  正面
└──── F 次失败 ────┘
└──────── N 次投掷 ────────┘

每次运行都有 N = F + 1
```

**按“要投多少次才首次看到正面”的通常理解，题目为 T。** 如果出题者严格把 `before` 理解为排除成功那次，只问此前投掷次数，才应判 F，并把期望写为 9。已保存题干没有更明确地区分这两个变量；原图又未能重读，因此不能把其中一种口径冒充无歧义的唯一题意。计算本身确定的是上述两个期望。

### 1.5 不同端点能否保证最优解唯一

> 5. In the activity selection problem, if all intervals have distinct start times and distinct finish times, then there can be only one optimal solution.

**答案：F。** 端点互异保证排序没有相同时间，并不能保证达到最多活动数的集合唯一。

构造三个活动 $A,B,C$，使其端点满足

$$
s_A<s_B<f_A<f_B<s_C<f_C.
$$

```text
A： [─────────]
B：      [─────────]
C：                       [────────]
```

$A$ 与 $B$ 相交，所以任何解最多从它们中选一个；$C$ 在两者之后开始，可以接在任意一个之后。因此最优活动数恰为 2，$\{A,C\}$ 和 $\{B,C\}$ 是两个不同最优解。所有开始时间互异，所有结束时间也互异，满足题目的全部条件。这一结构直接否定原命题。

### 1.6 递归调用数是否为线性

> 6. The following algorithm finishes in $O(n)$ time.

题面伪代码为：

```text
algorithm f(n)
    if n = 0 then return 0
    if n = 1 then return 1
    return f(n - 1) + f(n - 2)
```

**答案：F。** 代码没有缓存，每次调用都重新展开两个子调用。令 $C(n)$ 为包括自身在内的调用数，有

$$
C(0)=C(1)=1,\qquad
C(n)=1+C(n-1)+C(n-2).
$$

```text
                  f(n)
               /        \
          f(n-1)          f(n-2)
          /    \           /   \
     f(n-2)  f(n-3)    f(n-3)  f(n-4)
          相同参数的调用被重复展开
```

$C(n)$ 随 $n$ 非减，因此 $C(n)\ge2C(n-2)$。反复应用，得到 $C(n)\ge2^{\lfloor n/2\rfloor}$，已经足以排除线性上界。沿任一分支的深度虽然只有 $O(n)$，整棵调用树却不断分叉，不能用深度代替总调用数。

如果另加记忆化，相同参数才只计算一次，可以得到线性时间；但那是修改后的算法，不是题面给出的算法。

### 1.7 可以删除的全图最重边

> 7. Let $G$ be a connected undirected weighted graph where all edges have distinct weights. Let $e$ be the edge in $G$ with the largest weight. If $G$ remains connected even with $e$ removed, we can assert that $e$ does not belong to any MST of $G$.

**答案：T。** 设 $e$ 的两个端点为 $u,v$。删除 $e$ 后图仍连通，所以还有一条从 $u$ 到 $v$、不使用 $e$ 的简单路径。把 $e$ 接回去，便构成一个环。$e$ 是全图唯一最重边，因此也是这个环唯一最重边，按环性质不属于任何 MST。

直接交换也能说明结论：若某棵 MST 含 $e$，删除它会把树分成两部分。那条备用 $u$ 到 $v$ 路径必有另一条边 $f$ 跨过两部分。用 $f$ 替换 $e$ 仍连通且边数不变，是一棵生成树，而 $w(f)<w(e)$，总重量严格降低，与最优性矛盾。

```text
u ───────── e：全图最重 ───────── v
 ╲                               ╱
  └──── 删除 e 后仍存在的路径 ────┘

备用路径与 e 成环；可用更轻跨边替换 e
```

## Problem 2：钢条切割填表（6%）

<a id="q2"></a>

> Problem 2 (6%). For the rod cutting problem, consider the price table below:

| 长度 $i$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| $P[i]$ | 3 | 5 | 8 | 9 | 10 | 17 | 17 |

> Define $\operatorname{opt}(n)$ as the maximum revenue from selling a rod of length $n$. Give the values of $\operatorname{opt}(n)$ for all $n\in[1,7]$.

**答案：$3,6,9,12,15,18,21$。** 价格 $P[i]$ 是一整段的售价，$\operatorname{opt}(i)$ 则允许切割后求最高总收入。本题没有切割费。

先定义空钢条收入为 0。长度为 $k$ 的方案若第一段长 $i$，就由这一段的售价加上剩余长度的最优收入构成：

$$
\operatorname{opt}(0)=0,\qquad
\operatorname{opt}(k)=\max_{1\le i\le k}
\{P[i]+\operatorname{opt}(k-i)\}.
$$

```text
长度 k： | 第一段 i | 剩余 k-i |
收入：       P[i]  + opt(k-i)

逐个试完 i=1,...,k，取最大的合法收入
```

按 $k$ 从小到大计算，右侧所需状态已经得到。下表每行按第一段长度 $i=1,\ldots,k$ 列出全部候选：

| $k$ | $P[i]+\operatorname{opt}(k-i)$ 的全部候选 | $\operatorname{opt}(k)$ |
|---|---|---|
| 1 | 3 | **3** |
| 2 | 6，5 | **6** |
| 3 | 9，8，8 | **9** |
| 4 | 12，11，11，9 | **12** |
| 5 | 15，14，14，12，10 | **15** |
| 6 | 18，17，17，15，13，17 | **18** |
| 7 | 21，20，20，18，16，20，17 | **21** |

还可从题目数据验证整张表：每段长度 $i$ 的价格都满足 $P[i]\le3i$，所以任何总长度 $k$ 的切法，收入都不超过 $3k$。另一方面，切成 $k$ 段长度为 1 的钢条，确实得到 $3k$。上界与可行收入相同，因此表中答案正确。

## Problem 3：Prim 的选边顺序（5%）

<a id="q3"></a>

> Problem 3 (5%). Consider the weighted undirected graph below (the number beside each edge indicates the edge’s weight).
>
> Suppose that we run Prim’s algorithm to find a minimum spanning tree (MST) of this graph. Write down the edges of the MST in the order picked by the algorithm.

转录中的原图有六个顶点 $a,b,c,d,e,f$，全部十条无向边如下。$cd$ 是连接 $c,d$ 的边。

| 边 | $ad$ | $cd$ | $de$ | $ae$ | $ab$ | $ef$ | $bf$ | $cf$ | $bc$ | $be$ |
|---|---|---|---|---|---|---|---|---|---|---|
| 权重 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |

**按本课“先取全图最轻边”的 Prim 初始化，答案为 $ad,cd,de,ab,ef$。** 标准 Prim 也常从指定顶点开始，但题干转录没有指定顶点；这里明确采用 Lec 4 的初始化方式。

选中第一条边后，用 $S$ 表示已在树中的顶点。每轮只比较一端在 $S$、另一端在外的跨边。两个端点都在 $S$ 内的边，即使很轻，也不能再选；两个端点都在外的边也不是当前树的扩展候选。

| 轮次 | 选择前 $S$ | 当前候选边及权重 | 本轮选择 |
|---|---|---|---|
| 1 | 尚未初始化 | 全图边，最轻的是 $ad(1)$ | $ad$ |
| 2 | $\{a,d\}$ | $cd(2),de(3),ae(4),ab(5)$ | $cd$ |
| 3 | $\{a,c,d\}$ | $de(3),ae(4),ab(5),cf(8),bc(9)$ | $de$ |
| 4 | $\{a,c,d,e\}$ | $ab(5),ef(6),cf(8),bc(9),be(10)$ | $ab$ |
| 5 | $\{a,b,c,d,e\}$ | $ef(6),bf(7),cf(8)$ | $ef$ |

得到的树可重新画为：

```text
 b
 │ 5
 a
 │ 1
 d ──3── e ──6── f
 │ 2
 c
```

树包含全部六个顶点，五条边连通且无环，总权重为 $1+2+3+5+6=17$。本题最容易混淆的一步是 $ae(4)$：在加入 $e$ 以后，它的两端都在树内，所以不会因为权重比 5 小而在下一轮被选中。

## Problem 4：Huffman 编码树（5%）

<a id="q4"></a>

> Problem 4 (5%). Consider an alphabet $\Sigma$ that contains letters $a,b,c,d$, and $e$ whose frequencies are 80%, 10%, 5%, 3%, 2%, respectively. Show the code tree obtained by running Huffman’s algorithm.

Huffman 每次合并当前最小的两棵树，合并后的权重为频率之和。用百分数作为权重即可，不必先换成小数。

| 步骤 | 合并的两项 | 新权重 | 合并后仍在候选集合中的权重 |
|---|---|---|---|
| 1 | $e(2)$ 与 $d(3)$ | 5 | $c(5),(ed)(5),b(10),a(80)$ |
| 2 | $c(5)$ 与 $(ed)(5)$ | 10 | $b(10),(ced)(10),a(80)$ |
| 3 | $b(10)$ 与 $(ced)(10)$ | 20 | $(bced)(20),a(80)$ |
| 4 | $(bced)(20)$ 与 $a(80)$ | 100 | 完整树 |

**一棵合法输出树如下。** 左边标 0，右边标 1；节点旁数字为整棵子树的频率和。

```text
                 (100)
                /     \
             0 /       \ 1
             a:80      (20)
                       /   \
                    0 /     \ 1
                    b:10    (10)
                            /  \
                         0 /    \ 1
                         c:5    (5)
                                / \
                             0 /   \ 1
                             e:2   d:3
```

从根读到各字符叶子的边标签，可得 $a=0$、$b=10$、$c=110$、$e=1110$、$d=1111$。字符都在叶子上，所以没有一个码字成为另一个的前缀。

平均长度为

$$
0.80\cdot1+0.10\cdot2+0.05\cdot3
+0.02\cdot4+0.03\cdot4=1.35.
$$

也可以把每次合并的频率和相加：$0.05+0.10+0.20+1.00=1.35$。每次合并把子树内所有字符的深度增加 1，新增加权深度正好等于该子树权重，所以两种计算一致。题目只要求树；左右孩子互换会改变码字，但不改变码长和最优性。

## Problem 5：将逆序对归约为二维支配计数（12%）

<a id="q5"></a>

> Problem 5 (12%). Prove: if you can solve the dominance counting on $n$ points in $f(n)$ time, then you can solve the counting inversion problem in $f(n)+O(n)$ time.
>
> (Hint: you can convert inversion counting to dominance counting. You are reminded that the input to inversion counting is an array of $n$ distinct numbers.)

逆序对条件是 $i<j$ 且 $A[i]>A[j]$。二维支配要求两个坐标沿同一方向比较，因此把值的方向反过来：

$$
\boxed{p_i=(i,-A[i]).}
$$

为每个数组元素建立一个这样的点，调用支配计数黑盒，得到每个 $p_j$ 支配的其他点数量 $d_j$，最后返回 $\sum_jd_j$。

```text
逆序对：   i < j          A[i] > A[j]
              │              │ 取相反数
              ▼              ▼
点坐标： pᵢ.x < pⱼ.x     pᵢ.y < pⱼ.y
                       ↓
                  pⱼ 支配 pᵢ
```

正确性要证明两种计数一一对应。若 $(i,j)$ 是逆序对，则 $j>i$ 且 $-A[j]>-A[i]$，所以 $p_j$ 的两个坐标都更大，$p_j$ 支配 $p_i$，这对会计入 $d_j$。

反过来，若 $p_j$ 支配另一个点 $p_i$，则 $j\ge i$、$-A[j]\ge-A[i]$。不同点的下标不同，所以 $j>i$；题目还保证数值互异，所以第二个比较也不能取等，得到 $A[j]<A[i]$。这恰好是逆序对条件。因此黑盒统计的每一对都对应一个逆序对，没有多算。

一对逆序对只计入右端点 $j$ 的答案，求和时不会重复。建点需要 $O(n)$，黑盒需要 $f(n)$，把 $n$ 个结果相加需要 $O(n)$，总时间为 $f(n)+O(n)$。不需要先排序；排序会使额外成本变成 $O(n\log n)$，失去题目要求的归约界。

## Problem 6：Huffman 平均码长的上界（12%）

<a id="q6"></a>

> Problem 6 (12%). Consider an alphabet $\Sigma$ that contains $n$ letters with their frequencies given, where $n$ is a power of 2. Prove: the prefix code constructed using Huffman’s algorithm has an average length of at most $\log_2 n$.

本题只要求证明一个上界，不需要推算每个字符在 Huffman 树中的实际深度。**先构造一套平均长度为 $\log_2n$ 的合法前缀码，再利用 Huffman 的最优性即可。**

令 $h=\log_2n$。由于 $n$ 是 2 的幂，$h$ 是整数，长度恰为 $h$ 的二进制串共有 $2^h=n$ 个。把它们一一分配给 $n$ 个字符，得到等长编码。所有码字互异、长度相同，一个不可能是另一个的真前缀，所以这是合法前缀码。

```text
根到叶子都恰有 h 条边
              根
            /    \
           ...   ...
          / \    / \
        共 2ʰ=n 个叶子

每个字符占一个叶子，每个码字长度都是 h
```

设各字符频率归一化后为 $p_1,\ldots,p_n$，满足 $\sum_i p_i=1$。这套编码的平均长度为

$$
L_{\mathrm{equal}}=\sum_{i=1}^n p_i h
=h\sum_{i=1}^n p_i=h.
$$

Huffman 在全部合法前缀码中使平均长度最小，因此

$$
\boxed{L_{\mathrm{Huffman}}\le L_{\mathrm{equal}}=\log_2n.}
$$

这并没有说 Huffman 的每个码字都不超过 $\log_2n$，也没有说非均匀频率下等长码最优。它只说：既然一套平均长度为这个值的编码已经可行，最优编码的平均长度就不会更大。若 $n=1$，按单叶编码树的深度定义，平均码长为 0，结论也成立。

## Problem 7：切割有固定费用时的递推（11%）

<a id="q7"></a>

> Problem 7 (11%). Consider a modification of the rod-cutting problem where, in addition to a price $P[i]$ for each length $i\in[1,n]$, each cut incurs a fixed cost of $c$. The revenue is now the sum of the segments obtained from the cuts made, minus the total cost of making the cuts. Give a recursive function for computing the maximum revenue.
>
> For example, assume the price table given in Problem 2, $n=7$, and $c=1$. If we make two cuts to obtain three segments of lengths 1, 2, and 4, respectively, then the revenue is $P[1]+P[2]+P[4]-2c=15$.

题面自带的切法有三段、两刀，所以净收入是 $3+5+9-2=15$。它用于解释收费规则，并没有断言这是最优切法。

定义 $R[k]$ 为长度为 $k$ 的钢条全部出售后所能得到的最高**净收入**，其中已经扣除切割费用。$R[0]=0$。对正长度 $k$，完整方案有两类。

第一类是不切，整根卖出，收入就是 $P[k]$，不收任何费用。第二类至少切一刀，设最左边第一段长度为 $i$，则 $1\le i<k$。这段卖 $P[i]$，在它与剩余钢条之间切一刀，扣 $c$；剩余长度 $k-i$ 的最佳净收入为 $R[k-i]$，其中内部切割费已经扣过。

```text
不切： |──────────── 长度 k ────────────|
                         收入 P[k]

切割： | 第一段 i | 剩余长度 k-i         |
                  ↑
                新切一刀，扣 c

       P[i] + R[k-i] - c
       右侧内部的费用已包含在 R[k-i] 中
```

因此递推为

$$
\boxed{
\begin{aligned}
R[0]&=0,\\
R[1]&=P[1],\\
R[k]&=\max\left(P[k],\ \max_{1\le i<k}
\{P[i]+R[k-i]-c\}\right),\qquad k\ge2.
\end{aligned}}
$$

当 $k=1$ 时没有合法切分，直接取 $R[1]=P[1]$；不需要给空候选集合随意指定数值。可执行的递归写法为：

```text
Revenue(k):
    若 k = 0：返回 0
    best = P[k]
    对 i = 1, ..., k-1：
        best = max(best, P[i] + Revenue(k-i) - c)
    返回 best
```

正确性来自上述两类方案的穷尽划分。每个合法方案或者不切，或者有唯一的第一段长度 $i<k$；第二类的剩余部分收入不超过 $R[k-i]$，所以任意方案不超过递推右侧。另一方面，不切方案确实实现 $P[k]$；每个切割候选也能由第一段和剩余最优方案实现，所以右侧最大值能够达到。

收费也恰好正确：若最后得到 $t$ 段，第一次分离收一刀，剩余 $t-1$ 段内部再收 $t-2$ 刀，总共 $t-1$ 刀。不能把枚举范围仍写成 $1\le i\le k$，然后对每项一律扣 $c$，因为 $i=k$ 是没有发生切割的情况。

题目只要求递归函数。若要高效执行，给每个长度加缓存或按长度递增填表，每个状态枚举至多 $k-1$ 种切法，总时间为 $O(n^2)$、空间为 $O(n)$。

## Problem 8：找到最接近中位数的 $k$ 个数（10%）

<a id="q8"></a>

> Problem 8 (10%). Let $S$ be a set of $n$ distinct integers given in an (unsorted) array, and $k\le n$ be an integer. Describe an algorithm to find the $k$ numbers in $S$ that are closest to the median $m$ of $S$ (the median is the $\lceil n/2\rceil$-th smallest integer in $S$). Your algorithm must finish in $O(n)$ expected time. You can assume that $S$ does not have two distinct numbers $x$ and $y$ equally close to $m$, namely, $\lvert x-m\rvert=\lvert y-m\rvert$. You must analyze the running time of your algorithm.
>
> For example, suppose that $S=\{50,30,76,15,97,55,43,48,69\}$ and $k=3$; then the median is 50, and your algorithm should output 50, 55, and 48.
>
> (Hint: Use k-selection as a black box.)

距离中位数最近，比较的是 $|x-m|$，而非 $x$ 本身。算法需要解决两个选择问题：先选择中位数，再选择第 $k$ 小距离。

```text
ClosestToMedian(S, k):
    m = Select(S, ceil(n/2))
    对每个原元素 x：保存一对 (x, |x-m|)
    D = 所有这些距离组成的数组
    τ = Select(D, k)
    扫描原元素，输出全部满足 |x-m| ≤ τ 的 x
```

`Select(A,r)` 使用课堂的期望线性时间选择算法，返回数组 $A$ 的第 $r$ 小元素。对通常的 $1\le k\le n$ 按上面执行；若允许 $k=0$，直接返回空集。实现时可以把距离另存为数组，保留原元素，不因选择黑盒重排数组而丢失对应关系。

题面给出的输入中，中位数为第 5 小，即 50。相应距离为：

| 原元素 | 50 | 30 | 76 | 15 | 97 | 55 | 43 | 48 | 69 |
|---|---|---|---|---|---|---|---|---|---|
| 到 50 的距离 | 0 | 20 | 26 | 35 | 47 | 5 | 7 | 2 | 19 |

第三小距离为 5，因此输出距离为 0、2、5 的三个元素，即 50、48、55。顺序不影响题目要求。

```text
小于中位数的一侧       中位数       大于中位数的一侧
       48 ──距离 2──→ 50 ←──距离 5── 55
                       距离 0

以第 k 小距离 τ 为边界，保留边界以内的原元素
```

为什么恰好输出 $k$ 个？题目保证不同元素到 $m$ 的距离不同，因此第 $k$ 小距离 $\tau$ 前面恰有 $k-1$ 个更小距离，加上自身共 $k$ 个。所有被保留元素的距离都不大于 $\tau$，所有未保留元素的距离都更大，所以它们正是最接近中位数的 $k$ 个元素。中位数本身距离为 0，也应计入答案。

第一次选择的期望时间为 $O(n)$，建立距离数组为 $O(n)$，第二次选择为 $O(n)$，最后扫描为 $O(n)$。相加得到期望总时间 $O(n)$，额外保存距离和对应元素占 $O(n)$ 空间。无需排序整个原数组，也无需排序全部距离。

## Problem 9：最少区间覆盖的贪心证明（10%）

<a id="q9"></a>

> Problem 9 (10%). Let $\mathcal I$ be a set of $n$ intervals of the form $[x,y]$, where $x$ and $y$ are integers. The union of all the intervals in $\mathcal I$ equals $[0,U]$ (i.e., every value in $[0,U]$ is covered by at least one interval in $\mathcal I$). A subset $S\subseteq\mathcal I$ is called a solution if the union of the intervals in $S$ equals $[0,U]$. A solution is optimal if it has the smallest size among all solutions.
>
> For example, suppose that $\mathcal I=\{[10,15],[0,35],[20,50],[55,60],[5,30],[0,25],[40,60],[45,50],[25,45]\}$ and $U=60$. An optimal solution has size 3, e.g., $\{[0,35],[20,50],[40,60]\}$. Another optimal solution is $\{[0,25],[25,45],[40,60]\}$.
>
> Prove: the following algorithm returns an optimal solution.
>
> 1. Set $a=0$ and $S=\varnothing$
> 2. Let $I=[x,y]$ be the interval with the largest $y$ among all intervals in $\mathcal I$ that cover $a$
> 3. Add $I$ to $S$, and set $a=y+1$
>
> (note: $a$ is the smallest integer that has not been “covered” by $S$)
>
> 4. If $a>U$ then return $S$; otherwise, repeat from Step 2
>
> As an illustration, consider the $\mathcal I$ given in our earlier example. In the beginning, $a=0$, and Line 2 adds to $S$ the interval $[0,35]$. Then, $a=36$, and Line 2 adds to $S$ the interval $[20,50]$. Next, $a=51$, and Line 2 adds to $S$ the interval $[40,60]$.

### 先确定到底覆盖什么

原转录有一处实质不一致：文字要求覆盖 $[0,U]$ 中的每个值，这是连续区间；伪代码却把下一处未覆盖位置设为 $y+1$，对应的是整数点。**整数端点并不代表只需覆盖整数点。**

下面的参数化结构足以说明原算法对连续覆盖不成立。取任意整数 $r\ge1$，令三个输入区间为

$$
[0,r],\qquad[r,r+1],\qquad[r+1,r+2].
$$

它们的并确实是 $[0,r+2]$。算法首先选 $[0,r]$，随后令 $a=r+1$，于是选右端更远的 $[r+1,r+2]$，然后结束。然而两段之间的开区间 $(r,r+1)$ 没有被覆盖。

```text
原来的连续覆盖： [0────────r][r──r+1][r+1──r+2]
算法保留的两段： [0────────r]        [r+1──r+2]
                            ↑ 空隙 ↑

整数点没有漏掉，两个整数点之间的实数被漏掉了
```

因此，不能在保留“每个实数都被覆盖”的题意下，给这个原伪代码写出正确性证明。下面先证明它对整数点覆盖的正确性，再给出满足连续题意的修正。

### 按整数点覆盖理解时的完整交换证明

把目标明确为覆盖整数点 $0,1,\ldots,U$。设贪心已选集合为 $G$，当前 $a$ 是最小的未覆盖整数。算法保证 $0$ 到 $a-1$ 已被 $G$ 覆盖，下一步从所有覆盖 $a$ 的区间中选右端最远的 $g$。

保持如下不变式：**存在一份最少区间数的完整覆盖 $O$，包含当前全部贪心选中的区间 $G$。** 初始 $G=\varnothing$，任意最优覆盖都满足它。

假设选 $g$ 之前不变式成立。若 $g\in O$，原来的最优覆盖已包含新选择，无需修改。若 $g\notin O$，因为 $O$ 覆盖全部整数点，必有某个区间 $J\in O$ 覆盖 $a$。由于 $a$ 尚未被 $G$ 覆盖，$J$ 不属于 $G$，所以可以替换它而不删掉既有贪心选择。

令 $O'=(O-\{J\})\cup\{g\}$。需要检查替换后不会漏点：

- 对小于 $a$ 的整数点，$G$ 已经覆盖，且 $G$ 全部保留在 $O'$ 中。
- 对不小于 $a$、原本由 $J$ 覆盖的点，它们至多到 $J$ 的右端。$g$ 覆盖 $a$，且右端不短于 $J$，所以也覆盖这些点。
- 原本由其他区间覆盖的点，不受替换影响。

```text
已由 G 覆盖： 0 ───────── a-1
当前待覆盖：                  a ─────────────→
最优中的 J：               [────────]
贪心选的 g：             [────────────────]
                               右端至少一样远
```

$O'$ 仍覆盖全部整数点，区间数与 $O$ 相同，因此仍然最优，并且包含 $G\cup\{g\}$。不变式保持。

每次新选区间覆盖 $a$，右端 $y\ge a$，下一位置 $y+1>a$，所以不断前进。它在加入前不可能已被选过，否则 $a$ 已被覆盖。输入保证全部点可覆盖，因此不会出现没有候选区间的情况；至多选择 $n$ 个不同区间后结束。

结束时 $G$ 已是完整覆盖。由不变式，某份最优覆盖 $O$ 包含 $G$，于是 $|G|\le|O|$；又因为 $G$ 本身可行，最优性的定义给出 $|O|\le|G|$。两边合起来得到相等，所以贪心最优。

### 连续区间覆盖应该怎样推进

若坚持原题“覆盖每个值”的连续含义，就把状态改成**已经连续覆盖到的最右端 $r$**。初始尚未选区间，令 $r=0$；当 $r<U$ 时，在满足 $x\le r<y$ 的区间中选择右端 $y$ 最远的一段，然后令 $r\leftarrow y$。新段从当前覆盖边界之前或边界处开始，并且延伸到更右侧，所以不会留下空隙。

```text
ContinuousCover(I, U):
    若 U = 0：返回任意一个覆盖 0 的区间
    r = 0，G = 空集
    当 r < U：
        在 x ≤ r < y 的区间 [x,y] 中取 y 最大的一段 g
        G 加入 g
        r = g 的右端
    返回 G
```

原题保证所有区间并为 $[0,U]$，所以初始有区间覆盖 0，未覆盖完时也一定有区间能从当前边界继续向右延伸。严格条件 $r<y$ 排除了只接触边界却不推进的区间。

正确性仍用“存在一份最优覆盖包含已选区间”的不变式。最优覆盖必须有某段 $J$ 从 $r$ 或其左边延伸到 $r$ 右边，否则有限个区间无法覆盖紧接 $r$ 的一段实数。用右端更远的贪心段替换 $J$：$r$ 左边由已选集合覆盖，$r$ 右边原由 $J$ 覆盖的部分由新段覆盖。因此连续覆盖保持，区间数不增加；终止时同样推出最优。$U=0$ 的单点情形单独返回一段，避免空集合被误当作覆盖。

对题面自己的输入，两种口径恰好都会依次选 $[0,35],[20,50],[40,60]$，因为这三段彼此有重叠，覆盖一直连续。这次运行成功，并不能消除一般题干与原伪代码之间的差别。

## Problem 10：同时求二次幂位置的顺序统计量（15%）

<a id="q10"></a>

> Problem 10 (15%). Let $S$ be a set of $n$ distinct integers where $n$ is a power of 2. Design an algorithm to output the $i$-th smallest integer in $S$ for $i=2^0,2^1,2^2,\ldots,2^{\log_2 n}$ (namely, $1+\log_2 n$ integers to output in total). Design an algorithm to achieve the purpose in $O(n)$ expected time. You must analyze the running time of your algorithm. For example, if the input array is $(8,10,2,4,12,16,14,6)$, then your algorithm should output 2, 4, 8, and 16.
>
> (Hint: Find the numbers in descending order and geometric series is your friend.)

需要的是秩 $1,2,4,\ldots,n$，不是输出数值为这些数字的元素。如果对每个秩都在原长度 $n$ 的数组上调用一次选择，$1+\log_2n$ 次调用会得到 $O(n\log n)$，不满足要求。

**从最大的目标秩往下求，每求出一个边界，就丢掉以后不可能再需要的较大元素。** 先用一次扫描找到最大值，它就是第 $n$ 小。接着在全部元素中选择第 $n/2$ 小；求得它以后，只保留不大于它的元素。互异性保证保留的恰是原集合最小的 $n/2$ 个数。更小的目标秩仍位于这部分，而且秩不变。

```text
PowerRanks(S):
    n = |S|
    输出 (秩 n, S 的最大值)
    B = S
    r = n/2
    当 r ≥ 1：
        v = Select(B, r)
        输出 (秩 r, 值 v)
        B = {x∈B : x ≤ v}
        r = r/2
```

$n=1$ 时第一步输出唯一元素，循环不执行。题目允许输出这些元素；若需要按秩递增展示，可以先保存降序输出，再整体反转，额外花 $O(\log n)$ 时间。

```text
先输出秩 n 的最大值
       │
在 n 个数中选秩 n/2，留下最小 n/2 个
       │
在 n/2 个数中选秩 n/4，留下最小 n/4 个
       │
       ...
       │
在 2 个数中选秩 1，留下最小 1 个
```

对题面数组，执行过程为：

| 要求的原始秩 | 当前参加选择的元素 | 本轮结果 | 为后续保留的元素 |
|---|---|---|---|
| 8 | 扫描全部元素 | 16 | 全部元素 |
| 4 | $8,10,2,4,12,16,14,6$ | 8 | $8,2,4,6$ |
| 2 | $8,2,4,6$ | 4 | $2,4$ |
| 1 | $2,4$ | 2 | $2$ |

降序得到 16、8、4、2，反转后就是题面要求展示的 2、4、8、16。

正确性用集合含义归纳。进入目标秩为 $r$ 的循环时，$B$ 恰好包含原集合最小的 $2r$ 个元素，因此原集合的前 $2r$ 个秩在 $B$ 内完全不变。调用 `Select(B,r)` 返回原集合的第 $r$ 小。筛选后，$B$ 恰好变成原集合最小的 $r$ 个元素，满足下一轮目标 $r/2$ 所需的“最小 $2(r/2)$ 个”条件。初始循环 $r=n/2$ 时 $B=S$，不变式成立；最终每个要求的秩都被正确输出一次。

时间分析也必须按缩小后的集合求和。最大值扫描为 $O(n)$；之后选择加筛选的输入长度依次为 $n,n/2,n/4,\ldots,2$。课堂选择黑盒对每个固定输入都有线性期望界，筛选是确定性的线性扫描，因此

$$
\mathbb E[T(n)]
\le C_0n+C_1\left(n+\frac n2+\frac n4+\cdots+2\right)
=O(n).
$$

每轮只留下一个子问题，长度和小于 $2n$。这正是能够同时求出多个秩而仍保持期望线性时间的原因。

## 题目与课程内容的对应

| 题目 | 所用的核心知识 |
|---|---|
| 1 | 渐近上界、几何等待、递归调用树、贪心与 MST 性质 |
| 2、7 | 钢条切割的第一段分解、状态递推与费用计算 |
| 3 | Prim 的跨边选择和初始化 |
| 4、6 | Huffman 的合并过程、前缀码与最优性 |
| 5 | 逆序对和二维支配之间的一一对应 |
| 8 | 两次顺序统计量选择与距离阈值 |
| 9 | 覆盖问题的状态含义、交换论证与终止 |
| 10 | 选择、秩保持与几何级数 |

考试证据：题干沿用已保存的两页期中试卷转录；本次重新推导答案，未重新读取原始图片。
