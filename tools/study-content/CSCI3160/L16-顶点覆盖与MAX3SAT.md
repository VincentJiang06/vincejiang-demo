# CSCI3160 L16 顶点覆盖与随机MAX-3SAT近似

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L16 顶点覆盖与随机MAX-3SAT近似 · 原件 [Approximation Algorithms 1: Vertex Cover and Max-3SAT](../课件/L17-顶点覆盖与MAX3SAT-20261128.pdf) p.1–18
> 测验范围：Quiz 3 的第 2 讲，共 4 讲。
> 定位：最小化用下界控制多花多少，最大化用期望保证至少得到多少。

### p.1–3：近似算法的目标【新】

p.1 标题；新版页脚为 1/18 至 18/18，以下按 PDF 页序阅读。p.2 介绍 P、NP 与 NP-hard；p.3 以近似求解应对难以高效精确求解的问题。原页定义 P 为确定型图灵机可在多项式时间求解的问题集合，NP 为非确定型图灵机可在多项式时间求解的问题集合；图灵机和 NP-hard 的形式定义在 CSCI3130 展开。课件指出 P 是否等于 NP 尚未解决：若 P≠NP，这些 NP-hard 问题不存在多项式时间精确算法；不能把“尚未找到”直接当成无条件不存在的证明。NP 不表示“非多项式”；近似算法也不宣称求得精确最优解。

### p.4–6：覆盖的是边

p.4 为顶点覆盖分隔页。

p.5 用每条边至少接触一个所选顶点来定义覆盖。

顶点覆盖选点，使每条边至少有一个端点被选。p.5 图中的 {a,f,c,e} 是大小4的最优解；p.6 指出该优化问题 NP-hard。图（p.5）：6点无向图。元素：全部边为 ab、ad、ae、bc、bf、cf、ce、de、df；未连边的点对为 ac、af、bd、be、cd、ef。看什么：图中 {a,d,e} 和 {b,c,f} 分别是三角形。独立集从每个三角形至多取一个点，因此覆盖的补集至多2点，覆盖至少4点；所给4点集合又覆盖所有边，上下界相等证明最优。

### p.7–9：任意选边，但两个端点都收下

p.7 最小化的近似比约定是输出大小至多 $\rho OPT$，通常 $\rho\ge1$。p.8 算法反复选尚未删除的一条边，加入两个端点，删除两端点的全部关联边。结束时每条原边都因某个已选端点而删除，故输出一定覆盖所有边。

p.8 完整算法如下。S 初始为空，E 使用可删除的副本，最终返回 S。

```text
S = 空集
当 E 非空：
  任取 {u,v} ∈ E
  S 加入 u 和 v
  从 E 删除全部与 u 或 v 相接的边
返回 S
```

每轮至少删除所选的一条边，故至多 |E| 轮。即使用每轮扫描所有边的直接实现也只是 O(|E|²)，足以说明多项式；使用标记与邻接表可以更快，但二倍证明不依赖这种优化。

图（p.9）：先选 bc，余边 ae、ad、de、df；再选 ae，余 df；最后选 df。元素：输出全6点，所挑边 M={bc,ae,df}。看什么：本例输出6、最优4，实际比1.5；2是最坏保证，不是每次都恰为2。

### p.10–11：匹配给出最优值下界

> **p.11** The edges in M do not share any vertices.

某边选中后端点的关联边全删除，所以之后选的边不能共享端点。M 是匹配。新版 p.11 将下界明确记为当前输入图的最优值 $\mathrm{OPT}_G$。每个顶点覆盖必须为 M 的每条边选至少一个不同端点，所以 $OPT\ge\lvert M\rvert$；算法恰选 $2\lvert M\rvert$ 点，于是输出不超过2OPT。这里只需极大匹配，不需先求最大匹配。

若图中只有一条边，算法取两个端点，最优只取一个，比例恰好为 2。因此仅用这一选边规则，最坏保证已经达到界限。

**补充：极大匹配与最大匹配不是同一要求。** 自取四点路径 a–b–c–d。若先挑中间边 bc，删去关联边后结束，得到只有一条边的极大匹配；它不能再加入边，但不是最大匹配，因为 `{ab,cd}` 有两条。二倍证明仍可用：只需所挑边端点互不相同，提供 $OPT\ge\lvert M\rvert$ 的下界；算法取这些端点，已覆盖所有边。不要为了证明课堂近似算法而额外调用精确最大匹配。

覆盖的可行性由“删边时已覆盖”保证，近似质量由“匹配边必须分别付一个点”保证；这两段负责不同问题。若只输出每条匹配边的一个端点，数量虽然更少，其他关联边可能未覆盖。

:::hint 自测：为何不把任意二近似覆盖取补集，宣布得到好独立集近似？

补集确实是独立集，但近似比例不会自动保留。例如只有一条边，算法覆盖取两个点，补集为空；最优独立集却有一个点，任何正的乘法近似保证都失败。最优值的加法互补不等于近似比的乘法互补。

:::endhint

<a name="r-a1"></a>

[附录 A1 · 覆盖与匹配练习](#a1)

### p.12–14：先认清变量、文字与子句

p.12 为 MAX-3SAT 分隔页。p.13 变量取0或1，literal 是变量或其否定；每个子句是三个不同变量的文字做 OR。赋值使某个文字真就满足整个子句，目标是满足尽可能多子句，不要求每个都满足。

p.14 的8个子句分为两组：前4个以 x1 为首，遍历 x2、x3 的四种正负组合；后4个以否定 x1 为首，遍历 x3、x4 的四种正负组合。全置1时仅最后一条不满足，得到7。若 x1=1，后组四条恰有一条失败；若 x1=0，前组恰有一条失败，故不可能8条全满足，OPT=7。

为能直接检验赋值，p.14 的完整输入是：

$$
\begin{aligned}
C_1&=x_1\lor x_2\lor x_3,&C_2&=x_1\lor x_2\lor\neg x_3,\\
C_3&=x_1\lor\neg x_2\lor x_3,&C_4&=x_1\lor\neg x_2\lor\neg x_3,\\
C_5&=\neg x_1\lor x_3\lor x_4,&C_6&=\neg x_1\lor x_3\lor\neg x_4,\\
C_7&=\neg x_1\lor\neg x_3\lor x_4,&C_8&=\neg x_1\lor\neg x_3\lor\neg x_4.
\end{aligned}
$$

变量集合 $X=\{x_1,x_2,x_3,x_4\}$，赋值本质上是函数 $X\to\{0,1\}$，而不是每个出现位置各抛一次硬币。一个变量重复出现时必须沿用同一个值。

### p.15–16：期望保证不是每次保证

p.15 指出 NP-hard。p.16 最大化的约定与前面相反：随机输出满足数 Z 要满足 $\mathbb E[Z]\ge\rho OPT$，通常 $0\le\rho\le1$。不要把7/8误写成输出至多7OPT/8，也不要保证每次运行都达到该比例。

### p.17–18：只需子句内独立

> **p.17** toss a fair coin

每个变量独立公平取0或1。一个含三个不同变量的子句仅在三个文字全假时失败，概率 $(1/2)^3=1/8$；有否定文字也一样，例如 x1∨x2∨否定x3 的唯一失败赋值是0,0,1。令 Ij 表示第 j 条满足，则

$$
\mathbb E[Z]=\mathbb E\left[\sum_{j=1}^{n}I_j\right]=\sum_{j=1}^{n}\mathbb E[I_j]=\frac78n\ge\frac78OPT.
$$

**补充：不同变量这一前提用在哪。** 若一条子句实际是 $x\lor x\lor x$，失败概率为 1/2，不是 1/8，因为三个出现位置由同一个随机变量控制。若子句含 $x\lor\neg x$，它总是真。课堂的“3 个不同变量”保证三个文字真假彼此独立且各有一半概率，才能直接相乘；对跨子句的依赖则不需要相乘，只用期望相加。

不同子句可共享变量，Ij 不独立也不影响期望线性性。讲义8子句的例子期望7，与最优7恰好相等；一般实例的 OPT 未必等于 n。由于最多3n个出现位置，赋值与评估均线性于输入长度。


<a name="r-a2"></a>

[附录 A2 · 随机赋值练习](#a2)

## 本讲核心考点

- 顶点覆盖要分别证明输出可行和二倍保证。匹配提供下界，每次选两个端点给出输出大小（p.5–11）。
- MAX-3SAT 先算一条子句唯一的失败赋值，再对满足指示量求期望，最后用最优满足数至多为子句数换成近似比（p.13–18）。
- 公告中的 Approximation Algorithms 1 对应本讲，范围证据为教师公告（B 级）。

## 附录


### A1 作业/往年题演练（非讲义内容）：覆盖、匹配和独立集

<a name="a1"></a>**题面**（Final-2025T1-题目.pdf · Q5 · p.3；扫描件，视觉读取）

> **p.3** “5. (5 points) Recall that we introduced a greedy algorithm that achieves an approximation ratio of ρ = 2 for the Vertex Cover problem. Prove that this approximation ratio is tight for the algorithm. That is, show that there exist at least one graph on which the algorithm cannot do better than ρ = 2.”

**题面**（同卷 · Q1(i) · p.2；扫描件，视觉读取）

> **p.2** “(i) (2 points) In an undirected graph, if a set of edges M is selected such that no two edges in M share a common vertex, the size of M can be larger than the size of the minimum vertex cover for that graph.”

[Final-2025T1-题目.pdf](../考试/Final-2025T1-题目.pdf) p.3 Q5 要证明所学顶点覆盖算法的2近似界是紧的。取只含一条边的图，算法选两个端点、OPT只需一个，比例恰2。Q1(i) 所称“匹配大小可能大于最小顶点覆盖”是错的：每条匹配边必须各用至少一个不同顶点覆盖。

**题面**（Final-2025T1-题目.pdf · Q7 · p.3；扫描件，视觉读取；集合公式按原题重排）

> **p.3** “7. (10 points) An independent set in an undirected graph G = (V,E) is a subset $I\subseteq V$ such that no two vertices in I are adjacent (i.e., for all u,v ∈ I, the edge (u,v) ∉ E). The Maximum Independent Set problem asks for an independent set of the largest possible size.”
>
> “Show that the Maximum Independent Set problem is at least as hard as the Vertex Cover problem by providing a polynomial-time reduction to reduce the Vertex Cover problem to the Maximum Independent Set problem.”

同卷 p.3 Q7 定义 independent set 为内部无邻接点的集合，要求由顶点覆盖归约到最大独立集。对同一个图，C 是覆盖当且仅当 V\C 是独立集：若补集中有边，该边未被覆盖；反之若某边未覆盖，两端都在补集中。故最大独立集 I 的补集就是最小覆盖，大小为 V−|I|。转换图无需修改，取补集线性时间。

**题面**（Final-2024T1-缺判断-题目.pdf · Problem 6 · p.4；扫描件，视觉读取；公式按原题重排）

> **p.4** “Problem 6 (5 marks). Recall that, in the vertex cover problem, we are given an undirected graph G = (V,E) and need to find a vertex cover of the minimum size. Unless P = NP, no algorithm can solve this problem with a running time that is polynomial in $n=\lvert V\rvert$.”
>
> “Prof. Goofy considers the following variant of the problem: given an integer k ≤ n, find a vertex cover of G that contains at most k vertices, or declare the absence of such vertex covers. He claims to have found an algorithm solving that problem in $O(n^2\cdot k^{100})$ time, regardless of the values of n and k. Prove: Prof. Goofy's algorithm implies P = NP.”

本题假设能在 $O(n^2k^{100})$ 找大小至多 k 的覆盖，问它意味着什么。因为 k≤n，依次试 k=1到n（空边图先处理），总界不超过 $O(n^{103})$，是多项式；可精确解 NP-hard 顶点覆盖，从而推出 P=NP。指数100很大仍是常数，不能因此称为超多项式。

[回到正文：匹配下界](#r-a1)

### A2 作业/往年题演练（非讲义内容）：Final-2025T1 第 4 题

<a name="a2"></a>**题面**（Final-2025T1-题目.pdf · Q4 · p.2–3；扫描件，视觉读取；公式按原题重排）

> **p.2** “4. (12 points) [From special exercise.] Define ‘variable’ and ‘literal’ in the same way as we did for the MAX-3SAT problem. However, instead of restricting ourselves to 3-literal clauses, we re-define a clause as the OR of an arbitrary number of literals (but subject to the same constraint that all literals within a clause need to be defined on different variables).”

> **p.3** “Prove that the following randomized algorithm achieves an expected approximation ratio of ρ = 1/2:”
>
> “Algorithm: Each variable is independently set to 0 or 1, with each value (i.e., 0 or 1) chosen with probability 50%.”
>
> “Please write out the full proof—recall that the instructor skipped one step when presenting the 7/8-approximation algorithm for MAX-3SAT and left it as an exercise for you; in this problem, you are expected to provide the complete details of that step, even. (If you do not recall the aforementioned step or did not attend that lecture, that is completely fine—just make sure that your answer is a complete and self-contained proof.)”

题源：[Final-2025T1-题目.pdf](../考试/Final-2025T1-题目.pdf) p.2–3 Q4。把 MAX-3SAT 改为每条子句可有任意数量文字，单条子句内变量不同，要求多项式时间随机算法满足数期望至少最优的一半。

仍独立公平赋值。含 r 个文字的子句失败概率 $2^{-r}$，r≥1，故满足概率至少1/2。m条子句的总期望至少m/2，而OPT≤m，故期望至少OPT/2。算法时间线性于文字总出现次数，不能只写 O(m) 而忽略子句可能很长。题面没有单独说明空子句。按通常子句非空的约定，上述推导直接成立；若也允许空子句，则它永不被满足，先从计数中剔除它，令 m 仅数非空子句，仍有 OPT≤m，故同样得到 OPT/2，结论不受影响。

[回到正文：随机赋值](#r-a2)

## 来源与证据

- 原件：[Approximation Algorithms 1: Vertex Cover and Max-3SAT](../课件/L17-顶点覆盖与MAX3SAT-20261128.pdf)，p.1–18。
- 考试证据：读了教师 2026 Fall 课程页 11 月 26 日 Quiz 3 公告；未读取考试、作业或大纲 PDF；未识别用途的 PDF：无
