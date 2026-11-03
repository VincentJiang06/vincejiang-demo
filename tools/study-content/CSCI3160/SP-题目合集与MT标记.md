# CSCI3160 Special Practice 题目合集 · 2024 MT 对照

> 用途：把 Special Practice 原题集中在一份 Markdown 中，按原套号、原题号做题。
> 收录：当前官方题源可取得的 13 套、63 题；Sp01–Sp08、Sp10–Sp14。
> 标记：3 道同题或直接变体，3 道换数据的同题型；其余不冒称在 2024 MT 出现。

## 使用说明与范围

题干保留英文，配中文题名；公式按原件重排，原图完整转写为边表或坐标表，因此做题不依赖外置图片。所有小问、提示、复杂度要求和题面自带的星号都保留。题面明显缺项另列备注，不把修订冒充原文。每题可跳到已有中文详解，但本文件主体不混入答案。

**今年内容的边界：** Sp01–Sp07 是 2026-10-20 核对时本学期官网已显示的 33 题，属于此前标记的 **MT review** ；Sp08、Sp10–Sp14 是同一官方题源的其余可下载练习，共 30 题，放在后半部供完整查阅，不据此扩大期中考纲。Sp09 在 2026-10-21 再次请求时仍是 HTTP 200、0 字节；本地只有 2025T1 镜像，因此遵守“只保留今年”的要求，**不将那 5 题混入本合集** 。这里不能声称取得了今年完整 14 套。

2024 MT 的年份依据你的说明，照片本身未显示年份。对照依据为[原题照片 PDF](../期中复习/期中试卷/MT-2024-原题照片.pdf)和[逐题转写与中文详解](MT-真题精讲与标准答案.md)。**“MT review”表示复习范围；“2024 MT 出现”表示在这份旧卷上逐题核对到，两者含义不同。**

## 2024 MT 出现过的题：先做这三道

| Special 题号 | 2024 MT | 对应程度 | 题面差别 |
|---|---|---|---|
| Sp02 Q2 | [Q5 · 12%](MT-真题精讲与标准答案.md) | 同题，条件略改 | 支配计数归约逆序计数；MT 明确元素互异 |
| Sp05 Q2 | [Q6 · 12%](MT-真题精讲与标准答案.md) | 等价同题 | n 是 2 的幂，平均码长上界的上取整不改变数值 |
| Sp06 Q5 | [Q7 · 11%](MT-真题精讲与标准答案.md) | 直接变体 | 相同切割费用模型；MT 要递推，本题要求二次时间 DP |

这三道对应旧卷共 **35%** 的分值，仅描述这份 2024 卷，不能据此预测今年选题。

## 同题型，但题目数据不同

| Special 题号 | 2024 MT | 相同任务 | 必须重新计算的部分 |
|---|---|---|---|
| Sp04 Q2 | [Q3 · 5%](MT-真题精讲与标准答案.md) | Prim 选边次序 | 顶点、边和权重不同 |
| Sp05 Q1 | [Q4 · 5%](MT-真题精讲与标准答案.md) | Huffman 编码 | 字符数与频率不同 |
| Sp06 Q4 | [Q2 · 6%](MT-真题精讲与标准答案.md) | 钢条切割最优值 | 价格表、长度与要求输出的范围不同 |

MT 的 Q8（最接近中位数）、Q9（区间覆盖）、Q10（幂次秩选择）在本次所收 Special 中没有找到同题。相同算法主题只在相应题旁注明“相关考点”，不列入上面两张表。

## 题组目录

- Sp01 · 5 题 · MT review
- Sp02 · 5 题 · MT review
- Sp03 · 4 题 · MT review
- Sp04 · 4 题 · MT review
- Sp05 · 5 题 · MT review
- Sp06 · 5 题 · MT review
- Sp07 · 5 题 · MT review
- Sp08 · 5 题 · 扩展题组
- Sp09：今年原件缺失，未收历史版。
- Sp10 · 6 题 · 扩展题组
- Sp11 · 4 题 · 扩展题组
- Sp12 · 5 题 · 扩展题组
- Sp13 · 5 题 · 扩展题组
- Sp14 · 5 题 · 扩展题组

## Special Practice 01

**MT review** · [原题 PDF](../作业/Sp01-题目.pdf)

### Sp01 Q1 · 常数时间实现取模

原题：Sp01 p.1 · [中文详解](exercise/Sp01-选择与加权中位数.md)

Explain how to implement the operation $x\bmod y$ in $O(1)$ time where $x$ and $y$ are positive integers.

### Sp01 Q2 · 一次选择后的子数组规模

原题：Sp01 p.1 · [中文详解](exercise/Sp01-选择与加权中位数.md)

For the $k$-selection problem, suppose that the input is an array of 12 elements: $(58,23,98,83,32,24,18,45,85,91,2,34)$. Recall that our randomized algorithm first selects a number $v$ and then recursively solves a subproblem. Suppose that $v=34$ and $k=10$. What is the size of the array for the subproblem?

### Sp01 Q3 · 用线性最坏中位数黑盒实现线性最坏选择

原题：Sp01 p.1 · [中文详解](exercise/Sp01-选择与加权中位数.md)

**对照备注：** 只属相关考点：MT Q8 使用中位数选择，Q10 使用选择与几何递减；两题的输出目标均不同，本题不标为 MT 原题。

**Textbook Exercise 9.3-5.** The median of a set $S$ of $n$ elements is the $\lfloor n/2\rfloor$ smallest element in $S$. Suppose that you are given a deterministic algorithm for finding the median of $S$ (stored in an array) in $O(n)$ worst-case time. Using this algorithm as a black box, design another deterministic algorithm for solving the $k$-selection problem (for any $k\in[1,n]$) in $O(n)$ worst-case time.

**题面备注：** 原文确实写 $\lfloor n/2\rfloor$；$n=1$ 时需单独处理。2024 MT Q8 的中位数定义写的是 $\lceil n/2\rceil$，二者不要混抄。

### Sp01 Q4 · 输出指定秩区间的全部元素

原题：Sp01 p.1 · [中文详解](exercise/Sp01-选择与加权中位数.md)

**对照备注：** 只属相关考点：MT Q8 求离中位数最近的 k 个数，Q10 求秩为 1、2、4、…、n 的数；都不同于本题的连续秩区间。

Let $S$ be a set of $n$ distinct integers, and $k_1,k_2$ be arbitrary integers satisfying $1\le k_1\le k_2\le n$. Suppose that $S$ is given in an array. Give an $O(n)$ expected time algorithm to report all the integers whose ranks in $S$ are in the range $[k_1,k_2]$. Recall that the rank of an integer $v$ in $S$ equals the number of integers in $S$ that are at most $v$.

### Sp01 Q5 · 数值同时作为权重的加权中位数

原题：Sp01 p.1 · [中文详解](exercise/Sp01-选择与加权中位数.md)

**Textbook Exercise 9-2；原题带一颗星。** We are given an array that stores a set $S$ of $n$ distinct positive integers. Set $W=\sum_{e\in S}e$. Describe an algorithm to find the element $e^{\star}\in S$ that makes both of the following hold:

$$
\sum_{e<e^{\star}}e<W/2,
\qquad
\sum_{e>e^{\star}}e\le W/2.
$$

Your algorithm should finish in $O(n)$ time ($O(n)$ expected time is acceptable).

**Hint:** First convince yourself that such $e^{\star}$ is unique, and then adapt the $k$-selection algorithm.

## Special Practice 02

**MT review** · [原题 PDF](../作业/Sp02-题目.pdf)

### Sp02 Q1 · 输出全部逆序对

原题：Sp02 p.1 · [中文详解](exercise/Sp02-分治输出与矩阵分块.md)

Given an array $A$ of size $n$, design an algorithm to output all the inversions in $A$ using $O(n\log^2n+k)$ time, where $k$ is the number of inversions reported.

### Sp02 Q2 · 用二维支配计数求逆序数

原题：Sp02 p.1 · [中文详解](exercise/Sp02-分治输出与矩阵分块.md)

**2024 MT 出现：同题，条件略改 → [MT Q5](MT-真题精讲与标准答案.md)。** MT 明确输入是互异数字；本题写整数数组，未要求互异。归约任务和时间界相同。

Prove: if you can solve the dominance counting on $n$ points in $f(n)$ time, then you can count the number of inversions in an integer array of length $n$ in $f(n)+O(n)$ time.

**Hint:** you can convert the inversion counting problem to an instance of dominance counting.

### Sp02 Q3 · 宽矩阵乘法

原题：Sp02 p.1 · [中文详解](exercise/Sp02-分治输出与矩阵分块.md)

Assuming $m\ge n$, give an algorithm to multiply an $m\times n$ matrix with an $n\times m$ matrix in $O(m^2\cdot n^{0.81})$ time.

**Hint:** apply Strassen’s algorithm to multiply $\lceil m/n\rceil^2$ pairs of order-$n$ matrices.

### Sp02 Q4 · 一般长方矩阵乘法

原题：Sp02 p.1 · [中文详解](exercise/Sp02-分治输出与矩阵分块.md)

Assuming $m\ge n\ge t$, give an algorithm to multiply an $m\times n$ matrix with an $n\times t$ matrix in $O(m\cdot n\cdot t^{0.81})$ time.

**Hint:** apply Strassen’s algorithm to multiply pairs of $t\times t$ matrices.

### Sp02 Q5 · k个有序数组的合并

原题：Sp02 p.1 · [中文详解](exercise/Sp02-分治输出与矩阵分块.md)

Let $A_1,A_2,\ldots,A_k$ be $k$ arrays, each of which has been sorted. These arrays are mutually disjoint, namely, no integer can appear in more than one array. Design an algorithm to merge the $k$ arrays into one sorted array in $O(n\log k)$ time, where $n$ is the total length of the $k$ arrays.

**Note:** these arrays may have different lengths.

## Special Practice 03

**MT review** · [原题 PDF](../作业/Sp03-题目.pdf)

### Sp03 Q1 · 运行最早结束活动选择

原题：Sp03 p.1 · [中文详解](exercise/Sp03-贪心反例与背包.md)

**对照备注：** 只属相关考点：MT Q1.5 判断活动选择最优解是否唯一；本题要求运行算法，不是同题。

If we run the activity-selection algorithm taught in the class on the following input:

$$
S=\{[1,10],[2,22],[3,23],[20,30],[25,45],[40,50],[47,62],[48,63],[60,70]\},
$$

what is the set of intervals returned?

### Sp03 Q2 · 最短活动优先不保证最优

原题：Sp03 p.1 · [中文详解](exercise/Sp03-贪心反例与背包.md)

**对照备注：** 只属相关考点：MT Q1.5 讨论最优解唯一性，本题反驳最短区间贪心；证明对象不同。

The following is another greedy algorithm for the activity selection problem. Initialize an empty $T$, and then repeat the following steps until $S$ is empty:

- (Step 1) Add to $T$ the interval $I$ with the shortest length.
- (Step 2) Remove from $S$ the interval $I$, and all the intervals overlapping with $I$.

Finally, return $T$ as the answer. Prove: the above algorithm does not always return an optimal solution.

### Sp03 Q3 · 分数背包按总价值排序会失败

原题：Sp03 p.1 · [中文详解](exercise/Sp03-贪心反例与背包.md)

**Fractional Knapsack.** Let $(w_1,v_1),(w_2,v_2),\ldots,(w_n,v_n)$ be $n$ pairs of positive real values. Given a real value $W\le\sum_{i=1}^n w_i$, we want to find $x_1,x_2,\ldots,x_n$ to maximize the objective function

$$
\sum_{i=1}^n\frac{x_i}{w_i}\cdot v_i
$$

subject to:

- $0\le x_i\le w_i$ for every $i\in[1,n]$;
- $\sum_{i=1}^n x_i\le W$.

W.l.o.g., assume that $v_1\ge v_2\ge\cdots\ge v_n$. Consider the algorithm that works as follows.

```text
1. for i ← 1 to n do
2.     x_i ← min{W, w_i}
3.     W ← W − x_i
```

Prove: the above algorithm does not always returns an optimal solution.

### Sp03 Q4 · 0/1背包按价值排序也会失败

原题：Sp03 p.1 · [中文详解](exercise/Sp03-贪心反例与背包.md)

**0-1 Knapsack.** Suppose that there are $n$ gold bricks, where the $i$-th piece weighs $p_i$ bounds and is worth $d_i$ dollars. Given a positive integer $W$, our goal is to find a set $S$ of gold bricks such that:

- the total weight of the bricks in $S$ is at most $W$, and
- the total value of the bricks in $S$ is maximized (among all the sets $S$ satisfying the first condition).

Assuming $d_1\ge d_2\ge\cdots\ge d_n$, let us consider the following greedy algorithm:

```text
1. S = ∅
2. for i = 1 to n
3.     if p_i ≤ W then
4.         add p_i to S; W ← W − p_i
```

Prove: the above algorithm does not guarantee finding the desired set $S$.

**题面备注：** 原文的 “bounds” 应指重量单位 pounds；伪代码原文 “add $p_i$ to $S$” 表示选入第 $i$ 块砖，保留原写法。

## Special Practice 04

**MT review** · [原题 PDF](../作业/Sp04-题目.pdf)

### Sp04 Q1 · 树中恰有一条简单路径

原题：Sp04 p.1 · [中文详解](exercise/Sp04-Prim演算与割性质.md)

Let $T$ be a tree. Prove: for any two distinct nodes $u,v$ in the tree, there exists one and exactly one simple path from $u$ to $v$ (a simple path is a path where no vertex appears twice).

### Sp04 Q2 · Prim 的选边顺序

原题：Sp04 p.1 · [中文详解](exercise/Sp04-Prim演算与割性质.md)

**2024 MT 同题型：更换图 → [MT Q3](MT-真题精讲与标准答案.md)。** 都要求 Prim 的选边次序；本题 7 个顶点，MT 为 6 个顶点，边与权重不同。

Consider the weighted undirected graph below. Suppose that we run Prim’s algorithm to find a minimum spanning tree (MST) of this graph. Explain the order of edges picked by the algorithm.

**原图数据（逐边转写）：** 顶点为 $\{a,b,c,d,e,f,g\}$；下表列出全部无向边，未列出的边不存在。

| 边 | ac | ae | bc | bd | cd | ce | cf | cg | de | df | eg |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 权重 | 6 | 3 | 2 | 1 | 5 | 2 | 6 | 1 | 1 | 2 | 1 |

题目没有指定初始顶点或同权边的处理规则。

### Sp04 Q3 · 每一步全部跨边如何变化

原题：Sp04 p.1 · [中文详解](exercise/Sp04-Prim演算与割性质.md)

Consider again the execution of Prim’s algorithm in Problem 2. Indicate how the cross edges change as Prim’s algorithm runs.

使用本套 Q2 给出的同一张图和同一次执行。

### Sp04 Q4 · 割性质

原题：Sp04 p.1 · [中文详解](exercise/Sp04-Prim演算与割性质.md)

**对照备注：** 只属相关考点：MT Q1.7 是最大边与 MST 的判断题；本题证明最轻跨割边的安全性，不是同题。

**The Cut-Property.** Let $G=(V,E)$ be an undirected connected graph where each edge in $E$ is associated with a positive weight. Consider any non-empty subset $S\subset V$. An edge $\{u,v\}$ in $E$ is an $S$-cross edge if $u\in S$ but $v\notin S$. Prove: if $e$ is an $S$-cross edge that has the minimum weight among all $S$-cross edges, $e$ must belong to some MST of $G$.

## Special Practice 05

**MT review** · [原题 PDF](../作业/Sp05-题目.pdf)

### Sp05 Q1 · 八字母最优前缀码

原题：Sp05 p.1 · [中文详解](exercise/Sp05-Huffman完整演算.md)

**2024 MT 同题型：更换频率 → [MT Q4](MT-真题精讲与标准答案.md)。** 都要求构造 Huffman 前缀码；本题 8 个字符，MT 为 5 个字符，频率为 80%、10%、5%、3%、2%。

Consider the alphabet $\Sigma$ with letters $a,b,c,d,e,f,g,h$ whose frequencies are 3%, 5%, 10%, 12%, 14%, 16%, 18%, and 22%, respectively. Use Huffman’s algorithm to find a prefix code on $\Sigma$ that has the smallest average length.

### Sp05 Q2 · 平均长度至多ceil(log₂ n)

原题：Sp05 p.1 · [中文详解](exercise/Sp05-Huffman完整演算.md)

**2024 MT 出现：等价同题 → [MT Q6](MT-真题精讲与标准答案.md)。** 两题均规定 $n$ 是 2 的幂；本题上界写 $\lceil\log_2 n\rceil$，MT 写 $\log_2n$，在该条件下相等。

Consider an alphabet $\Sigma$ that contains $n$ letters with their frequencies given, where $n$ is a power of 2. Prove: the prefix code constructed using Huffman’s algorithm has an average length of at most $\lceil\log_2n\rceil$.

### Sp05 Q3 · 最坏O(n log n)实现

原题：Sp05 p.1 · [中文详解](exercise/Sp05-Huffman完整演算.md)

Describe how to implement Huffman’s algorithm to ensure a worst-case time complexity of $O(n\log n)$, where $n$ is the size of the alphabet $\Sigma$.

### Sp05 Q4 · 更高频字母不能有更长最优码

原题：Sp05 p.1 · [中文详解](exercise/Sp05-Huffman完整演算.md)

Consider the alphabet $\Sigma=\{1,2,\ldots,n\}$ for some integer $n\ge1$. Suppose that the frequency of $i$ is strictly higher than the frequency of $i+1$, for any $i\in[1,n-1]$. Prove: in an optimal prefix code, for any $i\in[1,n-1]$, the codeword of $i$ cannot be longer than that of $i+1$.

### Sp05 Q5 · 等频且字母数为二次幂的最短码

原题：Sp05 p.1 · [中文详解](exercise/Sp05-Huffman完整演算.md)

Consider an alphabet $\Sigma$ with $n$ letters, all of which have exactly the same frequency. The value of $n$ is a power of 2. If we use Huffman’s algorithm to generate the codewords for all the letters in $\Sigma$, how many bits are there in the shortest codeword?

## Special Practice 06

**MT review** · [原题 PDF](../作业/Sp06-题目.pdf)

### Sp06 Q1 · 线性时间求 Fibonacci

原题：Sp06 p.1 · [中文详解](exercise/Sp06-DP表格与切割费用.md)

**对照备注：** 只属相关考点：MT Q1.6 判断朴素 Fibonacci 递归是否线性；本题要求设计线性算法，不是同题。

Define function $f(x)$ — where $x\ge0$ is an integer — as follows:

- $f(0)=0$;
- $f(1)=1$;
- $f(x)=f(x-1)+f(x-2)$.

Give an algorithm to calculate $f(n)$ in $O(n)$ time (you can assume that $f(x)$ fits in a word for all $x\le n$).

### Sp06 Q2 · 区间递推缺失相邻边界

原题：Sp06 p.1 · [中文详解](exercise/Sp06-DP表格与切割费用.md)

Let $A$ be an array of $n$ integers. Consider the following recursive function which is defined for any $i,j$ satisfying $1\le i\le j\le n$:

$$
f(i,j)=\begin{cases}
0,&\text{if }i=j,\\
A[i]\cdot A[j]+\min_{k=i+1}^{j-1}\{f(i,k)+f(k,j)\},&\text{if }i\ne j.
\end{cases}
$$

Design an algorithm to calculate $f(1,n)$ in $O(n^3)$ time.

**题面缺项：** 原件未定义 $j=i+1$ 时空集合的最小值；这里保留原式，不悄悄补成另一道题。作答时应明确相邻区间的边界约定。

### Sp06 Q3 · ABC与BDCA的全部f表

原题：Sp06 p.1 · [中文详解](exercise/Sp06-DP表格与切割费用.md)

In Lecture Notes 8, we defined function $f(i,j)$ based on strings $x=\mathrm{ABC}$ and $y=\mathrm{BDCA}$. Calculate $f(i,j)$ for all possible $i$ and $j$.

**原题所引用的课堂定义补充（[L08 p.4–5](../课件/L08-DP-03-Dependency-未核-隐藏.pdf)）：** $0\le i\le3$，$0\le j\le4$，按下式计算所有值。该公式是原题引用的课堂定义，补在这里以便独立做题。

$$
f(i,j)=\begin{cases}
0,&i=0\text{ or }j=0,\\
f(i-1,j-1)+1,&i,j>0\text{ and }x[i]=y[j],\\
\max\{f(i,j-1),f(i-1,j)\},&i,j>0\text{ and }x[i]\ne y[j].
\end{cases}
$$

### Sp06 Q4 · 长度5钢条的最大收入

原题：Sp06 p.1 · [中文详解](exercise/Sp06-DP表格与切割费用.md)

**2024 MT 同题型：更换价格与输出范围 → [MT Q2](MT-真题精讲与标准答案.md)。** 本题长度为 5，价格为 (2,6,7,9,10)；MT 价格为 (3,5,8,9,10,17,17)，要求长度 1 至 7 的全部最优值。

In the rod-cutting problem, suppose that $n=5$ and the price array $P$ is $(2,6,7,9,10)$. What is the maximum revenue achievable?

### Sp06 Q5 · 每次切割收固定费用

原题：Sp06 p.1 · [中文详解](exercise/Sp06-DP表格与切割费用.md)

**2024 MT 出现：直接变体 → [MT Q7](MT-真题精讲与标准答案.md)。** MT 要求给出计算最大净收入的递归函数；本题进一步要求 $O(n^2)$ 动态规划算法。每刀扣固定费用的模型相同。

**Textbook Problem 15.1-3.** Consider a modification of the rod-cutting problem in which, in addition to a price $P[i]$ for each length $i\in[1,n]$, each cut incurs a fixed cost of $c$. The revenue associated with a solution is now the sum of the prices of the segments minus the total cost of making the cuts. Give a dynamic-programming algorithm to solve this modified problem in $O(n^2)$ time.

## Special Practice 07

**MT review** · [原题 PDF](../作业/Sp07-题目.pdf)

### Sp07 Q1 · 两条二进制串的完整LCS表

原题：Sp07 p.1 · [中文详解](exercise/Sp07-LCS与网格最长路径.md)

Let $x$ be a string of length $n$, and $y$ a string of length $m$. Define $\operatorname{opt}(i,j)$ to be the length of an LCS of $x[1:i]$ and $y[1:j]$ for $i\in[0,n]$ and $j\in[0,m]$. Compute the values of all possible $(i,j)$ for $x=10010101$ and $y=(010110110)$.

### Sp07 Q2 · 恢复一个实际LCS

原题：Sp07 p.1 · [中文详解](exercise/Sp07-LCS与网格最长路径.md)

Find an LCS of $x$ and $y$ given in Problem 1.

### Sp07 Q3 · 最长共同子串

原题：Sp07 p.1 · [中文详解](exercise/Sp07-LCS与网格最长路径.md)

Given a string $s$ of length $n$, stored in an array of characters, we call $s[i:j]$ a substring of $s$, for all pairs of $i,j$ satisfying $1\le i\le j\le n$. Let $x$ be a string of length $n$, and $y$ a string of length $m$. Design an algorithm to find a longest common substring of $x$ and $y$ in $O(nm)$ time.

### Sp07 Q4 · 网格递增路径，排序后DP

原题：Sp07 p.1 · [中文详解](exercise/Sp07-LCS与网格最长路径.md)

**原题带一颗星。** Let $M$ be an $n\times n$ matrix where each cell $M[i,j]$ stores a distinct integer, for all $i\in[1,n]$ and $j\in[1,n]$. Define a path of length $\ell\ge1$ to be a sequence of $\ell$ cells $M[i_1,j_1],M[i_2,j_2],\ldots,M[i_\ell,j_\ell]$ satisfying both conditions below:

- for each $k\in[2,n]$, $M[i_{k-1},j_{k-1}]$ and $M[i_k,j_k]$ are neighboring cells (this means the former cell is above, below, to the left of, or to the right of the latter cell);
- for each $k\in[2,n]$, $M[i_{k-1},j_{k-1}]<M[i_k,j_k]$.

Design an algorithm that finds a path of the maximum length in $O(n^2\log n)$ time.

**Hint 1:** Find the length of longest paths starting from each cell.

**Hint 2:** To choose a topological order, sort all the cells.

**题面笔误：** 两处原文均写 $k\in[2,n]$；按长度为 $\ell$ 的路径定义，应为 $k\in[2,\ell]$。

### Sp07 Q5 · 去掉排序得到线性格子数时间

原题：Sp07 p.1 · [中文详解](exercise/Sp07-LCS与网格最长路径.md)

**原题带两颗星。** Improve the running time of your solution to Problem 4 to $O(n^2)$.

**Hint:** What is the dependency graph among the cells?

## Special Practice 08

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp08-题目.pdf)

### Sp08 Q1 · 四个键的全部区间最优值

原题：Sp08 p.1 · [中文详解](exercise/Sp08-最优与最差搜索树.md)

Consider the optimal BST problem on $S=\{1,2,3,4\}$ and the weight array $W=(10,20,30,40)$.

- Give the values of $\operatorname{optavg}(a,b)$ for all $a,b$ satisfying $1\le a\le b\le4$. Recall that $\operatorname{optavg}(a,b)$ is the smallest average cost of all BSTs on $\{a,a+1,\ldots,b\}$.
- Give the value of $\operatorname{optavg}(1,4\mid3)$. Recall that this is the smallest average cost of a BST on $\{1,2,3,4\}$ on condition that 3 must be the root of the BST.
- Show an optimal BST on $S$ with the smallest average cost.

**记号说明：** 计算采用 Q2 原题给出的递推尺度（权重和），不自行除以 100 改变题面数值尺度。

### Sp08 Q2 · 三次方计算区间最优值

原题：Sp08 p.1 · [中文详解](exercise/Sp08-最优与最差搜索树.md)

For the optimal BST problem, we have derived in the class $\operatorname{optavg}(a,b)$ as follows:

$$
\operatorname{optavg}(a,b)=\begin{cases}
0,&\text{if }a>b,\\
\displaystyle\sum_{i=a}^b W[i]+\min_{r=a}^b\{\operatorname{optavg}(a,r-1)+\operatorname{optavg}(r+1,b)\},&\text{otherwise}.
\end{cases}
$$

Give an algorithm to evaluate $\operatorname{optavg}(1,n)$ in $O(n^3)$ time.

### Sp08 Q3 · 构造树而不只输出最优值

原题：Sp08 p.1 · [中文详解](exercise/Sp08-最优与最差搜索树.md)

Continuing on the previous problem, although we are now able to compute $\operatorname{optavg}(1,n)$, we have not constructed any optimal BST yet. Describe an algorithm to do so in $O(n^3)$ time.

**原题 Hint（原文有缺词）：** “For any such $a,b$ satisfying $1\le a\le b\le n$, define $\operatorname{bestroot}(a,b)$ to be the $r\in[a,b]$ $\operatorname{optavg}(a,r-1)+\operatorname{optavg}(r+1,b)$.”

**题面备注：** 在范围和后面的式子之间，原文缺少 “minimizing” 一类连接词；按 Q2 的定义，应记录使后面的和最小的根。

### Sp08 Q4 · 最大频率作根的贪心反例

原题：Sp08 p.1 · [中文详解](exercise/Sp08-最优与最差搜索树.md)

Consider again the optimal BST problem on set $S=\{1,2,\ldots,n\}$ and a weight array $W$, as defined in the class. Prof. Goofy proposes the following greedy algorithm for finding an optimal BST $T$:

- $r=$ the integer $i\in[1,n]$ with the largest $W[i]$.
- Make $r$ the root of $T$.
- Apply the above strategy to build a tree $T_1$ on $\{1,2,\ldots,r-1\}$, and a tree $T_2$ on $\{r+1,r+2,\ldots,n\}$.
- Make the root of $T_1$ the left child of $r$, and the root of $T_2$ the right child of $r$.

Prove: the above algorithm does not always return an optimal BST.

### Sp08 Q5 · 最差BST

原题：Sp08 p.1 · [中文详解](exercise/Sp08-最优与最差搜索树.md)

Consider again the set $S=\{1,2,\ldots,n\}$ and a weight array $W$ as in the optimal BST problem. This time, we want to find instead the most terrible BST: the one with the largest average cost. Give an algorithm to do so in $O(n^3)$ time.

## Special Practice 10

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp10-题目.pdf)

### Sp10 Q1 · Dijkstra 确定顶点的次序

原题：Sp10 p.1 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

Consider the weighted directed graph below. Run Dijkstra’s algorithm starting from vertex $a$. Recall that the algorithm relaxes the outgoing edges of every other vertex in turn. Give the order of vertices by which the algorithm relaxes their edges.

**原图数据（全部有向边）：** 顶点 $\{a,b,c,d,e,f,g\}$。

| 有向边 | a→c | a→e | c→b | b→d | c→d | c→e | c→f | g→c | d→e | d→f | e→g |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 权重 | 6 | 3 | 2 | 1 | 5 | 2 | 6 | 1 | 1 | 2 | 1 |

### Sp10 Q2 · 按最后一条边分解最短距离

原题：Sp10 p.1 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

Consider a simple directed graph $G=(V,E)$ where each edge $(u,v)\in E$ carries a non-negative weight $w(u,v)$. Given two vertices $u,v\in V$, function $\operatorname{spdist}(u,v)$ represents the shortest path distance from $u$ to $v$. Given a vertex $v\in V$, denote by $IN(v)$ the set of in-neighbors of $v$. Let $s$ and $t$ be two distinct vertices in $G$. Prove:

$$
\operatorname{spdist}(s,t)=\min_{v\in IN(t)}\{\operatorname{spdist}(s,v)+w(v,t)\}.
$$

**Hint:** First prove LHS $\le$ RHS, and then prove $\ge$.

### Sp10 Q3 · Dijkstra 的负边反例

原题：Sp10 p.1 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

Give a counterexample to show that Dijkstra’s algorithm does not work if edge weights can be negative.

### Sp10 Q4 · Bellman–Ford 的每轮距离

原题：Sp10 p.1 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

Consider the weighted directed graph $G=(V,E)$ below. Set the source vertex to $a$ and run Bellman-Ford’s algorithm, which performs 4 rounds of edge relaxations. Show the $\operatorname{dist}(v)$ value of every $v\in V$ after each round.

**原图数据（全部有向边）：** 顶点 $\{a,b,c,d,e\}$。

| 有向边 | a→c | a→e | b→d | c→b | c→d | d→e | e→c |
|---|---:|---:|---:|---:|---:|---:|---:|
| 权重 | −7 | 3 | 4 | 2 | 5 | −3 | −2 |

原题未指定同一轮中边的松弛顺序；填写每轮状态时须说明执行约定。

### Sp10 Q5 · 输出最短路径树

原题：Sp10 p.1 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

The Bellman-Ford algorithm presented in the lecture computes only the shortest-path distance from the source vertex $s$ to every vertex. Extend the algorithm to output a shortest-path tree of $s$. Your modified algorithm must still terminate in $O(\lvert V\rvert\lvert E\rvert)$ time.

### Sp10 Q6 · 所有边权为1的SSSP

原题：Sp10 p.2 · [中文详解](exercise/Sp10-Dijkstra与BellmanFord演算.md)

**SSSP with Unit Weights.** Let us simplify the SSSP problem by requiring that all the edges in the input directed graph $G=(V,E)$ take the same positive weight, which we assume to be 1. Give an algorithm that solves the SSSP problem in $O(\lvert V\rvert+\lvert E\rvert)$ time.

## Special Practice 11

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp11-题目.pdf)

### Sp11 Q1 · 全部重赋权结果

原题：Sp11 p.1 · [中文详解](exercise/Sp11-Johnson与可达闭包.md)

Consider the weighted directed graph $G=(V,E)$ below. Suppose that we run Johnson’s algorithm on $G$. Recall that the algorithm re-weights all the edges to make sure that every edge should carry a non-negative weight. Give all the edge weights after the re-weighting.

**原图数据（全部有向边）：** 顶点 $\{a,b,c,d,e,f\}$。

| 有向边 | a→c | a→e | b→d | c→b | c→d | c→f | d→e | e→c | f→d |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 权重 | 6 | 3 | 4 | 2 | 7 | −6 | −3 | 2 | 10 |

### Sp11 Q2 · 所有边加同一常数不保持最短路径

原题：Sp11 p.1 · [中文详解](exercise/Sp11-Johnson与可达闭包.md)

**Textbook Exercise 25.3-4.** Recall that, given a weighted directed graph $G=(V,E)$, Johnson’s algorithm re-weights all the edges. Prof. Goofy proposes to replace Johnson’s re-weighting strategy with the following one:

- Find the smallest edge weight $z$ in $G$ (e.g., for the graph $G$ in Problem 1, $z=-6$).
- Re-weight each edge $(u,v)$ in $G$ by adding $-z$ to its weight, namely, $(u,v)$ carries the weight $w(u,v)-z$ after the re-weighting.

Let $G'$ be the resulting graph obtained by applying Prof. Goofy’s strategy. Give an example to show that the strategy does not guarantee the following property: a path $\pi$ from vertex $u$ to $v$ is a shortest path in $G$ if and only if it is a shortest path in $G'$.

### Sp11 Q3 · 任意势函数都保持负环

原题：Sp11 p.1 · [中文详解](exercise/Sp11-Johnson与可达闭包.md)

Let $G=(V,E)$ be a simple directed graph where each edge $(u,v)\in E$ carries a weight $w(u,v)$, which can be negative. Let $h:V\to\mathbb{Z}$ be an arbitrary function (mapping each vertex in $V$ to an integer). For each $(u,v)\in E$, define $w'(u,v)=w(u,v)+h(u)-h(v)$. Let $G'=(V,E)$ be the same graph as $G$, except that the edges are weighted using $w'$. Prove: $G$ has a negative cycle if and only if $G'$ does.

### Sp11 Q4 · 传递闭包

原题：Sp11 p.1 · [中文详解](exercise/Sp11-Johnson与可达闭包.md)

Let $G=(V,E)$ be a simple directed graph where $V=\{1,2,\ldots,n\}$. The transitive closure of $G$ is an $n\times n$ matrix $M$ where

$$
M[i,j]=\begin{cases}
1,&\text{if vertex }i\text{ can reach vertex }j\text{ in }G,\\
0,&\text{otherwise}.
\end{cases}
$$

Compute $M$ in $O(\lvert V\rvert(\lvert V\rvert+\lvert E\rvert))$ time.

## Special Practice 12

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp12-题目.pdf)

### Sp12 Q1 · 顶点覆盖的三问

原题：Sp12 p.1 · [中文详解](exercise/Sp12-覆盖与旅行商演算.md)

Consider the undirected graph $G$ below.

**原图数据：** 顶点 $\{a,b,c,d,e,f\}$；全部无向边为 $\{a,b\},\{a,c\},\{b,d\},\{c,d\},\{d,e\},\{d,f\},\{e,f\}$。

(a) What is the size of a smallest vertex cover of $G$?

(b) Is it possible for our vertex cover algorithm (taught in the class) to output a vertex cover of size 4?

(c) How about size 6?

### Sp12 Q2 · 任意非空独立变量子句至少一半概率为真

原题：Sp12 p.1 · [中文详解](exercise/Sp12-覆盖与旅行商演算.md)

Define “variable” and “literal” in the same way as we did for the MAX-3SAT problem. However, re-define a clause as the OR of an arbitrary number of literals subject to the constraint that all literals need to be defined on distinct variables. Prove: by independently setting each variable to 0 or 1 with 50% probability, we ensure that the clause should evaluate to 1 with probability at least 1/2.

### Sp12 Q3 · 在五点图上执行二倍TSP算法

原题：Sp12 p.1 · [中文详解](exercise/Sp12-覆盖与旅行商演算.md)

Consider the undirected graph $G$ below. Use the algorithm taught in the class to find a Hamiltonian cycle that achieves an approximation ratio of 2.

**原图数据：** 顶点 $\{a,b,c,d,e\}$；下表列出全部十条无向边。

| 边 | ab | ac | ad | ae | bc | bd | be | cd | ce | de |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 权重 | 5 | 2 | 3 | 4 | 4 | 2 | 2 | 3 | 4 | 3 |

### Sp12 Q4 · 线性时间产生树的往返游走

原题：Sp12 p.1 · [中文详解](exercise/Sp12-覆盖与旅行商演算.md)

In Step 2 of our 2-approximate algorithm for our traveling salesman problem, we need to compute a walk from the MST T computed in Step 1. Explain how to compute the walk in time proportional to the number of vertices in T .

### Sp12 Q5 · 欧氏TSP二倍近似（p.1–2）

原题：Sp12 p.1–2 · [中文详解](exercise/Sp12-覆盖与旅行商演算.md)

**Euclidean Traveling Salesman.** Let $P$ be a set of $n$ points in 2D space. Define a cycle as a sequence of $n$ line segments: $(s_1,t_1),(s_2,t_2),\ldots,(s_n,t_n)$ where

- $s_i\in P$ and $t_i\in P$ for each $i\in[1,n]$;
- $t_i=s_{i+1}$ for all $i\in[1,n-1]$ and $s_1=t_n$;
- $P=\{s_1,s_2,\ldots,s_n\}$;
- each $(s_i,t_i)$ is a segment connecting points $s_i$ and $t_i$.

The length of the cycle is the total length of all the $n$ segments. Let $OPT_P$ be the shortest length of all cycles. Design a $\operatorname{poly}(n)$-time algorithm (i.e., polynomial in $n$) that finds a cycle with length at most $2\cdot OPT_P$.

**Note:** for this problem, you can assume that the distance between any two points can be calculated in polynomial time.

## Special Practice 13

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp13-题目.pdf)

### Sp13 Q1 · 单词集合覆盖的具体输出

原题：Sp13 p.1 · [中文详解](exercise/Sp13-集合覆盖贪心与困难性.md)

**Textbook Exercise 35.3-1.** Consider $S=\{\text{arid, dash, drain, heard, lost, nose, shun, slate, snare, thread}\}$. Treat each word in $S$ as a set of letters. Run the set-cover algorithm discussed in the lecture and describe its output.

### Sp13 Q2 · 被选集合的当时收益非递增

原题：Sp13 p.1 · [中文详解](exercise/Sp13-集合覆盖贪心与困难性.md)

Recall that our set-cover algorithm in each iteration picks a set with the largest benefit. Define the characterizing benefit of a set as its benefit at the time it is picked. Prove: if we lay out the sets in the order they are picked, their characterizing benefits are non-ascending.

### Sp13 Q3 · 贪心近似比不能由2界定

原题：Sp13 p.1 · [中文详解](exercise/Sp13-集合覆盖贪心与困难性.md)

**原题带一颗星。** Give a counterexample input to show that the approximation ratio of our set-cover algorithm cannot be bounded by 2.

### Sp13 Q4 · 恰好k个集合的判定版本也难

原题：Sp13 p.1 · [中文详解](exercise/Sp13-集合覆盖贪心与困难性.md)

As mentioned in the lecture, the set cover problem is NP-hard. This means that it cannot be solved in polynomial time unless P = NP. Now consider the following decision version of the set cover problem. As before, let $\mathcal{S}$ be a collection of sets and define the universe $U=\bigcup_{S\in\mathcal{S}}S$. But now we are also given an integer $k$. The goal is to decide whether there is a set cover $C\subseteq\mathcal{S}$ such that $\lvert C\rvert=k$ and return such a $C$ if the answer is yes. Show that, unless P = NP, this decision version does not admit any polynomial-time algorithm.

### Sp13 Q5 · 列覆盖变成集合覆盖

原题：Sp13 p.1 · [中文详解](exercise/Sp13-集合覆盖贪心与困难性.md)

Let $M$ be an $n\times m$ matrix where each cell is either 0 or 1. It is guaranteed that every row of $M$ has at least one 1. A set $S$ of columns is a column cover if every row of $M$ has a 1 in at least one column of $S$. If $OPT$ is the minimize size of all column covers, describe a $\operatorname{poly}(n,m)$-time algorithm (i.e., polynomial in $n$ and $m$) that finds a column cover of size $O(OPT\cdot\log n)$.

## Special Practice 14

**扩展题组：不据此扩大期中范围** · [原题 PDF](../作业/Sp14-题目.pdf)

### Sp14 Q1 · 用集合覆盖表达单词命中

原题：Sp14 p.1 · [中文详解](exercise/Sp14-HittingSet与最远点中心.md)

Consider $S=\{\text{arid, dash, drain, heard, lost, nose, shun, slate, snare, thread}\}$. Given a set $L$ of letters, we call $L$ a hitting set if every word in $S$ uses at least one letter in $L$. Our goal is to find a hitting set of the smallest size. Re-formulate the problem as a set cover problem.

### Sp14 Q2 · 破坏所有五环的对数近似

原题：Sp14 p.1 · [中文详解](exercise/Sp14-HittingSet与最远点中心.md)

**2022 Fall Final Exam Problem（原 SP 题面自身注明的出处）。** Let $G=(V,E)$ be a simple undirected graph. A 5-cycle is a cycle with 5 edges. We say that a subset $D\subseteq E$ is a 5-cycle destroyer if removing the edges of $D$ destroys all the 5-cycles in $G$, namely, $G'=(V,E\setminus D)$ has no 5-cycles. For example, if $G$ is the graph below, there is only one 5-cycle $acbdea$; a 5-cycle destroyer is $\{\{d,e\}\}$, and so is $\{\{d,e\},\{c,d\}\}$.

**原图数据：** 顶点 $\{a,b,c,d,e\}$；全部无向边为 $ac,ae,bc,bd,cd,ce,de$。

Let $D^{\star}$ be a 5-cycle destroyer with the minimum size. Design an algorithm to find a 5-cycle destroyer of size $O(\lvert D^{\star}\rvert\cdot\log\lvert V\rvert)$ in time polynomial to $\lvert V\rvert$.

### Sp14 Q3 · k=3，首中心f时的第二、第三中心

原题：Sp14 p.1 · [中文详解](exercise/Sp14-HittingSet与最远点中心.md)

Consider the following set $P$ of points. Run the $k$-center algorithm on $P$ with $k=3$. Suppose that the first center has been chosen to be $f$. Show what are the second and third centers found by the algorithm?

**原图坐标（逐点转写）：**

| 点 | a | b | c | d | e | f | g | h | i | j |
|---|---|---|---|---|---|---|---|---|---|---|
| 坐标 | (2,2) | (3,3) | (4,2) | (4,8) | (5,6) | (6,7) | (7,4) | (8,3) | (9,4) | (9,2) |

### Sp14 Q4 · 推广到三维并证明二倍界

原题：Sp14 p.1 · [中文详解](exercise/Sp14-HittingSet与最远点中心.md)

The k-center problem we defined in the lecture is on a set P of 2D points. Extend the problem definition to 3D space and design a 2-approximate algorithm.

### Sp14 Q5 · 实现O(nk)

原题：Sp14 p.1 · [中文详解](exercise/Sp14-HittingSet与最远点中心.md)

Explain how the $k$-center algorithm can be implemented in $O(nk)$ time. You can assume that the Euclidean distance between any two points can be calculated in $O(1)$ time.

## 来源与证据

逐套读取原题 PDF：Sp01–Sp08、Sp10–Sp14 的全部页；Sp10、Sp12 为两页，其余为一页。含图题 Sp04、Sp10、Sp11、Sp12、Sp14 已视觉核对，边表、方向、权重和坐标为原图转写。Sp06 Q3 的函数定义另据本地 L08 课件 p.4–5 核对。Sp01–Sp03 原 PDF 标题误写 CSCI3610，课程身份依本学期官网题源记录。Sp14 Q2 的 2022 Fall Final 标签是当前练习原题自带的出处，保留它不表示另收入一套旧试卷。

2024 MT 对照以两张原题照片及其逐题转写为准；重复题只表示数学问题对应，不断言教师从哪份练习复制。没有匹配到同题不等于今年不考。

Sp09 原件缺失；本次合集不使用本地 2025T1 历史镜像代替。逐套原件入口位于各组标题下；题目编号、计数与对照记录见[核验记录](核验/SP合集核验-20261021.json)。

考试证据：Sp01-题目.pdf、Sp02-题目.pdf、Sp03-题目.pdf、Sp04-题目.pdf、Sp05-题目.pdf、Sp06-题目.pdf、Sp07-题目.pdf、Sp08-题目.pdf、Sp10-题目.pdf、Sp11-题目.pdf、Sp12-题目.pdf、Sp13-题目.pdf、Sp14-题目.pdf、MT-2024-原题照片.pdf。
