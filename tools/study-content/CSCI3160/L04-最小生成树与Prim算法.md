# CSCI3160 L04 最小生成树与Prim算法

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L04 最小生成树与Prim算法 · 原件 [L04-Greedy-02-Minimum-Spanning-Trees-未核-隐藏.pdf](../课件/L04-Greedy-02-Minimum-Spanning-Trees-未核-隐藏.pdf) p.1–22
> 定位：从带权图与生成树开始，逐轮执行 Prim，再证明为什么最轻跨割边可以安全加入。

p.1 标题页。

### 图、边权与完整例图（p.2–3）【新】

> **p.2** We will denote an edge between vertices u and v in G as {u, v} — instead of (u, v) — to emphasize that the ordering of u, v does not matter.

p.2 的 $G=(V,E)$ 中，V 是顶点集合，E 是无向边集合，$w(e)$ 是边的正整数权重。无向表示 u 到 v 与 v 到 u 是同一条边。本讲输入连通，任意两点间有路径，才可能用一棵树覆盖所有点。

图（p.3）：八点无向带权图。
元素：顶点 a、b、c、d、e、f、g、h；边及权重为 ab:1、ef:2、ac:3、bc:3、cf:5、ch:6、af:7、ah:8、gh:9、be:10、gd:11、ed:12、bg:13。
看什么：几何交叉不代表有新顶点；例如 cf 与其他线段相交处没有画圆点，不能在那里换边。

### 生成树不等于任意低权边集合（p.4–5）【新】

> **p.4** Recall that a tree is defined as a connected undirected graph with no cycles.

p.4 的**生成树**（spanning tree）必须保留全部顶点，只从原图选边，并同时满足连通和无环；八点生成树恰好七条边。成本是所选边权的总和。只数到七条边还不够：也可能形成一个带环分量和一个孤立点。

图（p.5）：同一输入的三棵生成树。
元素：左树选 ab、bc、cf、ef、ch、gh、gd；中树将 bc 换成 ac；右树选 bc、ac、bg、af、ah、ef、ed。
看什么：每棵都覆盖八点且无环，但成本不同。

**算一遍**：左树成本 $1+3+5+2+6+9+11=37$；中树只把权 3 换成权 3，仍 37；右树为 $3+3+13+7+8+2+12=48$。相同的边数并不意味着相同成本。

### 最小性与非唯一性（p.6–7）

> **p.6** the goal of the minimum spanning tree (MST) problem is to find a spanning tree of the smallest cost.

p.6 在所有合法生成树中比较成本，得到**最小生成树**（minimum spanning tree，MST）。它不是从某个源点出发到每个点都最短的路径树；这两种优化目标不同。

> **p.7** Both trees in the second row are MSTs. This means that MSTs may not be unique.

p.7 的两棵树就是 p.5 前两棵。权重相同的替代边可产生多解。需要区分“存在某棵 MST 含这条边”和“每棵 MST 都含这条边”；Prim 的证明只需要前者。

### Prim 的选择范围（p.8–9）【新】

> **p.8** Greedy: The algorithm works by repeatedly taking the lightest cross edge.

p.8 把顶点分为已纳入的 S 与外部 $V\setminus S$，**跨边**（cross edge）恰有一个端点在 S。选最轻跨边会带进一个新点，连接性保持，也不可能形成环，因为新点以前不在树内。

p.9 本讲从全图最轻边 ab 开始，S 为 `{a,b}`，成本 1。候选跨边 ac 与 bc 都为 3，任选；讲义选 ac，得到 `{a,b,c}`，成本 4。**补充**：常见教材从任意单点起步；这是相容的另一初始化，本讲手算仍沿讲义从最轻边开始。

### 三轮扩张：便宜边也可能不能选（p.10–12）

图（p.10–12）：红边为当前树，蓝边为跨边。
元素：p.10 已有 ab、ac；p.11 新增 cf；p.12 再新增 ef。
看什么：p.10 的 bc 虽只有 3，两端却都在 S 内，不能选；ef 虽只有 2，在 f 尚未加入前也不是跨边。

p.10 在 `{a,b,c}` 的跨边中选 cf:5，累计 $4+5=9$。p.11 此时 f 入树，ef:2 成为候选并最轻，累计 $9+2=11$。p.12 从 `{a,b,c,f,e}` 出发选 ch:6，累计 $11+6=17$。所选边权可以从 5 降到 2，Prim 并不按全图边权单调递增扫描。

### 最后两条边与最终成本（p.13–15）

图（p.13–15）：树继续向 g、d 扩张。
元素：p.13 S 含 a、b、c、f、e、h，选 gh；p.14 只剩 d 在外部，候选 gd:11 与 ed:12；p.15 七条红边连接全部八点。
看什么：每次只比较当前跨边，加入顶点后重新界定候选范围。

p.13 选 gh:9，累计 $17+9=26$；p.14 选 gd:11，累计 $26+11=37$；p.15 没有外部顶点，停止。输出七条边，连通且无环，因此至少是一棵生成树；其**最小性**还要靠下面的证明。

### 证明的不变量与加边成环（p.16–18）【新】

> **p.16** Claim: For any $i\in[1,\lvert V\rvert-1]$, there is an MST containing all the first i edges chosen by our algorithm.

p.16 不说当前小树已经是整图 MST，而说它能扩成某棵 MST。p.17 先用树的唯一通路：在树上给 u、v 新增一条边，这条边与原来 u 到 v 的路径形成环；从这个环删另一条边，连通性仍保留。

p.18 证明第一条全图最轻边安全：取一棵不含它的 MST，加上它成环，再删环上另一条边。新边不比删边重，成本不增，因此得到另一棵含该边的 MST。这是 L03 交换思路的图版本。

### 归纳交换必须保护旧选择（p.19–21）

p.19 假设有 MST T 含此前全部选择。如果本轮边 e 已在 T 中，无事可做；否则加 e 形成环。

图（p.20）：一个环跨割两次。
元素：左边椭圆是 S，右边是其补集；e 连接 u、v，另一跨边连接 $u',v'$；虚线表示两侧树路径。
看什么：从外部沿 e 进入 S，沿环回到外部时必有另一条跨边。它不可能是此前已选的内部边。

p.20 选择这条另一跨边 $e'$ 删除。由于 e 是当前最轻跨边，$w(e)\le w(e')$。p.21 得到新树成本 $w(T)+w(e)-w(e')\le w(T)$，所以仍最优；此前选择全部保留，不变量延续。若随便删环上的边，可能删掉旧选择，归纳就断了。

### 实现问题（p.22）

> **p.22** Think: How to implement Prim’s algorithm in $O((\lvert V\rvert+\lvert E\rvert)\cdot\log\lvert V\rvert)$ time?

给每个外部顶点 v 保存连接 S 的最轻边权 `key[v]`，用最小堆取 key 最小的顶点；加入 v 后，只扫描 v 的邻边，若有更轻连接就 decrease-key。每个顶点出堆一次，每条边最多触发常数次检查，每次堆操作 $O(\log\lvert V\rvert)$，得到题目要求。具体堆维护见[T04](T04-Prim实现.md)。

**考试角度**：（A 级（扫描件，视觉读取）：Final-2025T1-题目.pdf Q8，考另一种加删边交换证明及树的连通性；演练<a name="r-a1"></a>[见附录 A1](#a1)）。

## 本讲核心考点

- Prim选择最轻跨边，不能只选全图剩余最轻边（p.8–15，C 级）。
- 不变量是已选边集包含于某棵MST（p.16，C 级）。
- 交换时删除另一跨边，保护已有选择（p.19–21，A 级：Final 2025 Q8相关证明）。
- 最小堆实现O((V+E)log V)（p.22，C 级）。

## 附录

### A1 作业/往年题演练（非讲义内容）：逆序删边求 MST

<a name="a1"></a>**题面**（Final-2025T1-题目.pdf · Q8(a)–(d) · p.3；扫描件，视觉读取）

> **p.3** 8. In this problem, we will develop a new algorithm for finding minimum spanning trees (MSTs). It is based upon the following claim:
>
> Claim 1. Pick any cycle in the graph, and let e be the heaviest edge in that cycle. Then there is a minimum spanning tree that does not contain e.
>
> (a) (5 points) Prove Claim 1.
> (b) (5 points) Algorithm 3 shows a new MST algorithm. The input is some undirected, connected graph $G=(V,E)$, with edge weights $\{w_e\}_{e\in E}$. Prove that Algorithm 3 is correct.
>
> Algorithm 3:
> 1: procedure CYCLE-MST($G=(V,E),\{w_e\}_{e\in E}$)
> 2: sort the edges in decreasing order of their weights
> 3: for each edge $e\in E$ (in sorted order) do
> 4: if e is part of a cycle in G then
> 5: remove e from G
> 6: return G
>
> (c) (5 points) On each iteration, the algorithm must check whether there is a cycle containing a specific edge e. Give a linear-time (i.e., $O(\lvert V\rvert+\lvert E\rvert)$) algorithm for this task, and justify its correctness.
> (d) (3 points) Prove that the time complexity of Algorithm 3 is $O(\lvert E\rvert^2)$.

公式按原题重排。(a) 取任意 MST T。若 e 不在 T 中，结论成立；否则删 e 把 T 分成两块。原图给定环绕过 e 的那条路径必跨这两块，因此其上存在另一边 $e'$。因为 e 是此环最重边，$w(e')\le w(e)$，替换后连通且仍有恰好 $\lvert V\rvert-1$ 条边，成为成本不增的生成树。所以它也是 MST，并且不含 e。相同权重时只能说“存在”，不能说“所有”。

(b) 每次实际删除的边都在环上；由 (a)，当前图至少还有某棵原图 MST。因此最优值不变，连通性也不变。按权重降序处理时，当前环若含此前已处理但保留的边，那条边当时应当已经在一个更大边集中的环上而被删除，矛盾；所以当前待处理边是所在环的最重边之一，(a) 可用。遍历结束不能残留任何环，否则该环最先被处理的边当时就在环上，应该已删除。最终连通且无环，是保留原最优值的一棵树。

(c) 设 e 的端点为 u、v，暂时忽略 e，从 u 用 DFS 或 BFS 搜索。若仍能到 v，该路径加 e 构成环；若到不了，e 是两侧唯一连接，不在环上。邻接表每点每边扫描常数次，耗时 $O(\lvert V\rvert+\lvert E\rvert)$。

(d) 排序 $O(E\log E)$，每条原始边至多检查一次，共 $E$ 次搜索；每次用原图的 V、E 作上界。输入连通，$V\le E+1$，总成本 $O(E\log E+E(V+E))=O(E^2)$。这不是“只检查被删除的边”：被保留的桥也需要检查，只是总次数仍至多 E。

[回到正文：实现问题（p.22）](#r-a1)

## 来源与证据

- 原件：[L04-Greedy-02-Minimum-Spanning-Trees-未核-隐藏.pdf](../课件/L04-Greedy-02-Minimum-Spanning-Trees-未核-隐藏.pdf)；页码均为 PDF 页号。
- 最新性：已从教师官网重新下载并逐字节核对，与本地原件一致。原始学期未核，不据网页学期补猜。
- 发布状态：官网链接所在行仍隐藏，按预习参考处理。
- 考试证据：读了 教师官网（2026-09-17）、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
