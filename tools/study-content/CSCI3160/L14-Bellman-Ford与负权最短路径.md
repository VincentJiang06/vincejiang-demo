# CSCI3160 L14 Bellman-Ford与负权最短路径

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L14 Bellman-Ford与负权最短路径 · 原件 [L14-Graph-04-Bellman-Ford-未核-隐藏.pdf](../课件/L14-Graph-04-Bellman-Ford-未核-隐藏.pdf) p.1–28
> 定位：允许负边，借助有限边数和多轮松弛获得最短距离。

### p.1–3：允许负数以后发生了什么【新】

p.1 为标题，p.2 换用 Bellman–Ford，p.3 允许边权正、零、负。负边本身不使问题无解；关键是能否反复经过负环降低总成本。

### p.4–6：负环使最短距离无下界

> **p.5** “This is due to the negative cycle”

p.4 距离仍是边权和，不可达为正无穷。图（p.5）：a→b→c→d→a 的环。元素：权重1、1、−2、−6，相加为−6；c→d→g 权为−2−3=−5。看什么：从 a 到 c 前可以绕上述环任意多次，每绕一次再减6，因此距离下确界是负无穷。

讲义说“有无限条边的最短路径”是直观说法；严格地说，没有一条有限路径取得最小值。p.6 定义负环为总权严格小于0；零环不会把距离推向负无穷。

### p.7–9：本讲先承诺没有负环

p.7 的输入保证无负环，只需为可达点求最短路径；p.8 重点求距离，路径可通过父指针恢复。图（p.9）：把先前 d→a 的负边改为 a→d，原来的负环被打破。元素：同一组数字配上不同方向，会改变问题是否有有限解。看什么：不能只抄权重、忽略这条反向的红边。

### p.10–12：一轮包含所有边

> **p.11** Repeat the following $\lvert V\rvert-1$ times

初始化 a=0，其他无穷；每轮松弛所有边，总共 V−1 轮。p.10 松弛公式与 Dijkstra 相同，变化的是安排顺序。p.12 为演示固定字母序：ab、ad、bc、cd、ce、dg、ed、fe、gf。采用原地更新，同轮后面的边可以使用刚写入的值；不要混用“上一轮快照”的同步版本。

### p.13–15：第一轮的前三条边

p.13 ab 令 b=1；p.14 ad 令 d=−6；p.15 bc 使用刚更新的 b=1，令 c=2。因此一轮已经能传播两条边，轮数不是“已找到的路径必须恰有这么多边”。

### p.16–18：遇到负数仍按大小比较

p.16 cd 的候选2−2=0，不如 d=−6。p.17 ce 得 e=2−1=1。p.18 dg 得 g=−6−3=−9。负距离比正距离小，不应取绝对值。

### p.19–21：一轮结束仍可能漏过新的改善

p.19 ed 的候选1+5=6，不改善 d。p.20 fe 的 f 仍无穷，不能改善 e。p.21 gf 才得到 f=−9+2=−7。但 fe 已扫描过，只能等下一轮把这条新路径传给 e。第一轮按 a,b,c,d,e,f,g 排列的距离是 (0,1,2,−6,1,−7,−9)。

### p.22–24：稳定为何允许提前停止

p.22 第二轮 fe 把 e 改为−6；p.23 第三轮没有更新。p.24 为忠实执行固定算法仍做第4、5、6轮，表不再变化。最终为 (0,1,2,−6,−6,−7,−9)。若完整一轮未变化，所有松弛不等式都已满足，继续不会再变化，可以提前结束。不是某一条边没更新就停。

### p.25–26：为什么最多只需有限轮

p.25 每轮 E 次、共 V−1 轮，时间 $O(VE)$（加初始化 $O(V)$）。

p.26 引理断言至少存在一条简单最短路径。

这里是“至少存在一条”，不是“每一条”。无负环时，从最短路中删掉重复顶点围出的非负环，长度不会增加，最终得到简单最短路；简单路至多 V−1 条边。若有零环，保留它仍可能等长，所以最短走法未必全部简单。

### p.27–28：归纳必须配上上下界

若到 v 有一条含 i 条边的最短路，前驱 p 在该路上的最短前缀含 i−1 条边。归纳假设保证前 i−1 轮之后 p 已正确，第 i 轮扫描 (p,v) 就有

$$
dist(v)\le dist(p)+w(p,v)=spdist(s,p)+w(p,v)=spdist(s,v).
$$

另一方面，每个有限候选都是某条实际走法的长度，不可能小于最短距离。上下界合起来才是等号。讲义 p.27 把 spdist 省略源点，阅读时统一理解为从 s 出发。

<a name="r-a1"></a>两份期末卷的逐轮表[见附录 A1](#a1)。负环检测是补充：V−1 轮后再扫描，若从可达点仍能严格松弛，则存在源点可达负环；若要检测全图任意负环，应加超级源点或全零初始化，不能漏掉不可达区域。

<a name="r-a2"></a>对应往年题[见附录 A2](#a2)。

## 本讲核心考点

- （A 级：Final-2025T1 Q2；Final-2024T1 Q2）按题定顺序模拟多轮松弛。
- （A 级：Final-2025T1 Q1(j)）无负环保证存在简单最短路，不保证所有最短走法都简单。
- （C 级 通识）以最短路边数归纳证明 V−1 轮足够。

## 附录

### A1 作业/往年题演练（非讲义内容）：两份期末卷的 Bellman–Ford 表

<a name="a1"></a>**题面**（Final-2025T1-题目.pdf · Q2 · p.2；扫描件，视觉读取；公式按原题重排）

> **p.2** “2. (10 points) [From special exercise.] Consider the weighted directed graph $G=(V,E)$ shown in Figure 1. Set the source vertex to a and run the Bellman-Ford algorithm, which performs 4 rounds of edge relaxations. Assume that in each round, we perform edge relaxation according to the alphabetic order of the edges in the graph: (a,c), (a,e), (b,d), (c,b), (c,d), (d,e), (e,c). Show the dist(v) value of every $v\in V$ after each round.”

图（题面，p.2）：五点七边有向图；下列逐边表之前列出全部边与权。

[Final-2025T1-题目.pdf](../考试/Final-2025T1-题目.pdf) p.2 Q2 要从 a 出发做4轮，并按 (a,c),(a,e),(b,d),(c,b),(c,d),(d,e),(e,c) 的字母序松弛。边权依次为 −7,3,4,2,5,−3,−2。以下向量均按 a,b,c,d,e 排列。

| 第1轮扫描后 | 距离向量 |
|---|---|
| 初始化 | (0,∞,∞,∞,∞) |
| ac | (0,∞,−7,∞,∞) |
| ae | (0,∞,−7,∞,3) |
| bd | (0,∞,−7,∞,3) |
| cb | (0,−5,−7,∞,3) |
| cd | (0,−5,−7,−2,3) |
| de | (0,−5,−7,−2,−5) |
| ec | (0,−5,−7,−2,−5) |

第2轮 bd 提供−1，不如 d=−2；其余候选也不能改善。第2、3、4轮末都为 (0,−5,−7,−2,−5)。对应最短路到 b 为 a→c→b，到 d 为 a→c→d，到 e 为 a→c→d→e。

**题面**（Final-2024T1-缺判断-题目.pdf · Problem 2 · p.3；扫描件，视觉读取）

> **p.3** “Problem 2 (10 marks). Consider the weighted directed graph G = (V,E) below.”
>
> “Set the source vertex to a and run the Bellman-Ford algorithm, which performs 4 rounds of edge relaxations. Show the dist(v) value of every v ∈ V after each round.”

图的七条有向边及权值与上题完全相同。本题使用同一权图并要求4轮，但没有给这条字母序约束。若明确声明采用上述原地字母序，上表也是合法解；其他顺序的中间轮可以不同，最终结果一致。不能把后一年的顺序假装成前一年题面条件。

**题面**（Final-2025T1-题目.pdf · Q1(j) · p.2；扫描件，视觉读取）

> **p.2** “(j) (2 points) Let G = (V,E) be a simple directed graph where every edge carries a weight that may be negative. Suppose that G has no negative cycles. Then, for any distinct vertices u,v ∈ V, if a shortest path from u to v exists, then this shortest path must be simple (i.e., no vertex can appear on the path more than once).”

此判断为假。补充反例（数字为演示自取）：s→a 为1，a→b、b→a 都为0，a→t 为1。s→a→b→a→t 重复 a，长度仍是最短的2；删去零环后也存在简单最短路。

[回到正文：轮数与正确性](#r-a1)

### A2 作业/往年题演练（非讲义内容）：带负边图的最短路核算

<a name="a2"></a>**题面**（Review-Quiz-2020T2-题目.pdf · Q8 · p.2；图已对照题解扫描页）

> **p.2** “8. Find a shortest (s,t)-path in the graph of Figure 3:”

图（题面，p.2）：九点加权有向图。
元素：s→a(4)、s→b(−3)、s→c(3)、a→b(−8)、a→e(−5)、b→c(6)、b→d(8)、b→e(1)、b→f(5)、c→d(1)、d→f(−4)、d→t(1)、f→e(−4)、f→t(4)、e→g(11)、e→t(7)、g→t(−3)。
看什么：f→e的负边箭头向上，不能读成e→f；两者会给出不同答案。

这个具体图是DAG，按s,a,b,c,d,f,e,g,t顺序逐点松弛就能一次完成全部依赖；Bellman–Ford也适用。距离依次为s=0，a=4，b=min(−3,4−8)=−4，c=min(3,−4+6)=2，d=min(−4+8,2+1)=3，f=min(−4+5,3−4)=−1，e=min(4−5,−4+1,−1−4)=−5，g=−5+11=6，t=min(3+1,−1+4,−5+7,6−3)=2。每格比较了全部入边，所以这不仅是一条长度2的可行路，也排除了更短候选。

记录取最小值的父边，恢复s→a→b→c→d→f→e→t，总长4−8+6+1−4−4+7=2。不能直接运行依赖非负权的Dijkstra再碰巧信其输出；选算法要先检查边权条件。

[回到正文：本讲结尾](#r-a2)

## 来源与证据

- 原件：[L14-Graph-04-Bellman-Ford-未核-隐藏.pdf](../课件/L14-Graph-04-Bellman-Ford-未核-隐藏.pdf)；页码均为 PDF 页号。
- 最新性：已从教师官网重新下载并逐字节核对，与本地原件一致。原始学期未核，不据网页学期补猜。
- 发布状态：官网链接所在行仍隐藏，按预习参考处理。
- 考试证据：读了 教师官网（2026-09-17）、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
