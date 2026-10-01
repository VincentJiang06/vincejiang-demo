# CSCI3160 T11 NP难归约与团问题

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：T11 NP难归约与团问题 · 原件 [T11-NP难归约-未核-隐藏.pdf](../辅导/T11-NP难归约-未核-隐藏.pdf) p.1–16
> 定位：辅导；用 3-SAT 到 Clique 的完整构造理解归约方向和双向证明。

### p.1–3 先分清“难”在什么地方【新】

> **p.3** “no polynomial-time algorithms can exist unless P = NP.”

p.1 是标题页。p.2 说明这份材料照顾没有学过 CSCI3130 的读者，不假定已经会写归约。p.3 中 P 指确定型图灵机可在多项式时间解决的问题，NP 指非确定型图灵机可在多项式时间解决的问题。NP 中的 N 不是“not”，NP-hard 也不是已经证明任何多项式算法绝不可能存在；结论带着“除非 P=NP”的条件。

**补充**：对这里的判定问题，NP 可用“yes 实例有长度多项式、能在多项式时间核验的证书”理解。例如给出一个顶点集合，逐对查边就能核验它是否是团；找到证书可能很难，检查别人给的证书却很快。

### p.4–6 归约箭头必须从已知难题出发【新】

> **p.4** “Identify another problem P2 that is already known to be NP-hard.”

p.4 想证明新问题 P1 难，先找已经知道难的 P2，再说明如果有 P1 的高效黑箱，就能高效解决 P2。转换方向是 P2→P1；“把 P1 变成一个已知难题”不能得到所需结论，因为简单问题也可能被塞进复杂问题的某类特殊输入。

p.5 定义 Clique Decision：输入无向图及整数 k，问是否有至少 k 个两两相连的顶点。三点只组成一条路径不是三点团，三个点之间三条边必须齐全。讲义六点图中 a、b、c 是一个三点团；图中不存在四点团，故 k≤3 为 yes，k≥4 为 no。

p.6 的问题是固定 k 是否容易。若 k=3，枚举所有三点组，每组查三条边，总共三次方量级；固定 1000 仍是多项式，尽管无法实际使用。当 k 是输入的一部分，顶点数的 k 次方中指数随输入增长，这就不能称为多项式算法。

**考试角度**：（A 级（扫描件，视觉读取）：Final-2021T1-题解.pdf Part I Q2(e)，考的是固定团大小与输入参数的区别）该选项确实考过；<a name="r-a1"></a>[见附录 A1](#a1)。

### p.7–9 把 3-SAT 当作已知难的起点

> **p.7** “Clause: the OR of up to 3 literals.”

p.7 的 variable 是真假未知量，literal 是变量或其否定，clause 是至多三个 literal 的 OR，formula 是这些 clause 的 AND。满足公式要求每个子句至少一个 literal 为真，并不要求每个 literal 都为真。

**题面**（T11-NP难归约-未核-隐藏.pdf · 两个 Example · p.7；公式按讲义重排）

> **p.7** “The 3-SAT problem: Is there a truth assignment for the variables under which the formula evaluates to 1? Such an assignment is called a certificate.”

两个公式依次为

$$
(x_1\lor x_2\lor x_3)\land(x_2\lor x_3\lor x_4)\land(\neg x_1\lor\neg x_4),
$$

$$
(x_1)\land(\neg x_1\lor x_2)\land(\neg x_2).
$$

第一式代入 (1,1,0,0)：三个子句依次为 1、1、1，AND 为 1。第二式第一子句强制 x1=1，第三子句强制 x2=0，于是中间成为 0∨0，必为假；因此无证书。

p.8 把 3-SAT 的 NP-hard 性当作已知引理，声明不要求证明。它下面省写了“unless P=NP”，须承接 p.3 的条件，不能读成已经解决 P 与 NP。p.9 的定理行 “in time in” 文字不完整；结合上下文，所用假设是 Clique 对顶点数和 k 的多项式时间算法。

### p.10–12 构图时每个“出现位置”各造一个顶点

> **p.10** “For each clause, create a vertex in V for every literal in the clause.”

p.10 设原公式有 k 个子句。每个子句中每个 literal 的出现各造一个顶点；同样的 x2 在两个子句出现，要造两个不同顶点。两个顶点连边必须同时满足：属于不同子句，且对应 literal 不是互相否定。同子句内不连边，因此团最多从每个子句拿一个。

p.11 对上一节第一式造 3+3+2=8 个顶点。选第一子句的 x1、第二子句的 x2、第三子句的 ¬x4；它们分属三个子句，没有互相否定，因此三条边齐全，构成三点团。不能把同名的 x2 顶点合并，否则会破坏“一子句一个选择”的结构。

p.12 对第二式造四个顶点：第一组 x1，第二组 ¬x1、x2，第三组 ¬x2。边只有 x1—x2、x1—¬x2、¬x1—¬x2；无三角形，所以无三点团。先按条件逐对判断再画图，胜过凭原公式中变量是否同名随意连边。

**补充**：至多 3k 个顶点，检查每对顶点只需二次方数量的兼容性测试。原式的变量名先统一编号后，构造规模和时间都是输入长度的多项式；这一步是归约证明的一部分。

### p.13–14 两个方向都要逐项兑现

> **p.13** “If F has a certificate, then G has a k-clique.”

p.13 从满足赋值出发：每个子句选一个为真的 literal。它们来自不同子句；一对互否 literal 不可能在同一赋值中都真，所以所选任意两点都连边。恰好选出 k 点，得到团。

> **p.14** “If G has a k-clique, F has a certificate.”

p.14 反过来：同子句无边，k 点团最多从每个子句取一个；共只有 k 个子句，所以恰好每个取一个。互否 literal 间也无边，故这些 literal 可以一致地设为真，未涉及的变量任意赋值。每个子句都有一个选中的真 literal，整个公式成立。两个方向分别排除“把 no 错变 yes”和“把 yes 错变 no”，不可仅凭图看起来像就略掉。

### p.15–16 从判定难到最优化难

> **p.16** “How to prove that the maximum clique problem cannot be solved in polynomial time unless P = NP?”

p.15 的 Maximum Clique 要输出最大团大小或一个最大团；例图最大值是 3。p.16 假设能多项式时间求最大团，那么对判定输入 (G,k)，先求最大大小 r，再比较 r≥k 即可回答。调用一次优化黑箱再做一次比较，就解决已知 NP-hard 的判定问题，因此优化版同样难。无需从头再画一套 3-SAT gadget。

**考试角度**：（A 级：Review-Quiz-2020T2-题目.pdf Q9，考的是从已知难题构造新判定问题并证明双向对应）演练<a name="r-a2"></a>[见附录 A2](#a2)。

<a name="r-a3"></a>对应往年题[见附录 A3](#a3)。

## 本讲核心考点

- 证明目标问题难时，把已知难问题归约到目标，方向不能反（p.4；C 级）。
- 固定团大小可枚举，输入中的团大小不能当常数（p.6；A 级：Final-2021T1 Part I Q2(e)）。
- 3-SAT 构团需逐个 literal 出现造点，并禁止同子句边与互否边（p.10–14；C 级）。
- 优化黑箱可以回答相应判定问题（p.15–16；C 级）。

## 附录

### A1 作业/往年题演练（非讲义内容）：固定大小团

<a name="a1"></a>**题面**（Final-2021T1-题解.pdf · Part I Q2(e) · PDF p.1 右栏，印刷 p.2；扫描件，视觉读取）

> **p.1** “Determine problems solvable in polynomial time:”
>
> “(e) Find a clique of size at least 1000 in an n-vertex graph.”

本次只演练 (e)，同题其余选项涉及别的算法与输入编码。枚举全部 1000 点子集，检查其中每一对是否有边。每组只需固定的 499500 次邻接检查，候选组数不超过 n 的 1000 次方；因此是多项式。如果存在更大的团，其中任选 1000 点仍是团，故枚举恰好 1000 点不会漏掉“至少 1000”的 yes 情形。这是渐近分类，不代表算法实用。[回到正文：参数是不是常数](#r-a1)

### A2 作业/往年题演练（非讲义内容）：删点后的小分量

<a name="a2"></a>**题面**（Review-Quiz-2020T2-题目.pdf · Q9 · p.2）

> **p.2** “9. Determine values of k, l, t in the following problem to make it a classical NP-complete problem:”
>
> “Are there k vertices in graph G whose removal results in a graph with at least l components of size at most t?”

原题问的是选参数使其成为经典 NP-complete 问题，下面取 Vertex Cover 对应的参数，并解释为什么。

从 Vertex Cover 的输入 (G,k) 出发，保留原图，设置 t=1、l=n−k。若有至多 k 点覆盖全部边，删去这些点后剩余点两两无边，每点各成一个分量，至少 n−k 个；若题目要求恰好删 k 个点，再任意补删点到 k 个，留下恰 n−k 个孤点。反向，删点后所有分量大小至多 1，说明没有任何边两端都留下，所以删去的点覆盖全部原边。参数构造显然是多项式。

给定删点集合，检查其大小，再用 DFS 计数剩余连通分量及各自大小，能在图大小的多项式时间内验证。因此问题属于 NP，又由 Vertex Cover 归约得到 NP-hard，从而 NP-complete。此证明使用主讲 DFS 的线性连通性检查，不把“能验证”误当“能找到”。[回到正文：归约练习](#r-a2)

### A3 作业/往年题演练（非讲义内容）：把团大小固定为顶点数的三分之二

<a name="a3"></a>**题面**（Final-2021T1-题解.pdf · Part II Q5 · PDF p.4 右栏，印刷 p.8；扫描件，视觉读取；公式按原题重排）

> **p.4** “5. The 2/3-Clique problem is to determine whether an n-vertex graph contains a clique with at least 2n/3 vertices, and we consider the following reduction to prove that 2/3-Clique is NP-complete:”
>
> “For an instance (G,k) of Clique, add a complete graph $K_t$ on t vertices and add all possible edges between G and $K_t$ to form an instance graph G′ of 2/3-Clique.”
>
> “Determine a value of t for k < 2n/3.”

原图有n点，新图有n+t点。所有新点互连且连向全部旧点，所以最大团大小从r变成r+t。要求新阈值对应旧阈值k，令 k+t=2(n+t)/3，解得t=2n−3k。条件k<2n/3保证t为正整数，新增点边数仍多项式。

正向，旧图有k点团，加全部t个新点便达k+t=2(n+t)/3。反向，新图任何达阈值的团最多含t个新点，故至少有2(n+t)/3−t=k个旧点，这些旧点也互连。两方向都成立，阈值没有偏一。题解还接受t=2n−3k+1或+2，因为团大小取整数，向上取整后的门槛减t仍为k；选择整齐的t=2n−3k即可。

[回到正文：本讲结尾](#r-a3)

## 来源与证据

- 原件：[T11-NP难归约-未核-隐藏.pdf](../辅导/T11-NP难归约-未核-隐藏.pdf)；页码均为 PDF 页号。
- 最新性：已从教师官网重新下载并逐字节核对，与本地原件一致。原始学期未核，不据网页学期补猜。
- 发布状态：官网链接所在行仍隐藏，按预习参考处理。
- 考试证据：读了 教师官网（2026-09-17）、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
