# CSCI3160 L15 Johnson全点对最短路径

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L15 Johnson全点对最短路径 · 原件 [L15-Graph-05-Johnson-APSP-未核-隐藏.pdf](../课件/L15-Graph-05-Johnson-APSP-未核-隐藏.pdf) p.1–14
> 定位：一次 Bellman–Ford 找势函数，再反复调用非负权最短路。

### p.1–3：单源变成所有源【新】

p.1 为标题，p.2 连接此前 SSSP，p.3 要求对每一对顶点求最短路，输入允许负边但无负环。输出可为每个源点一棵可达部分的最短路径树；不可达目标的距离仍为无穷，不能凭空连进树。

### p.4–6：反复运行正确算法，却未必最快

图（p.4）：沿用 L14 的7点有向图。元素：a 可到 g 且距离−9；b 无法到 a；g 也无法到 a、b。看什么：距离矩阵一般不对称。

p.5 分别从 V 个点运行 Dijkstra，非负时总时间 $O(V(V+E)\log V)$；一般带负权若直接跑 V 次 Bellman–Ford，为 $O(V^2E)$。p.6 的目标是把负边转换掉，同时保留所有最短路径。

### p.7–9：势函数只改变端点差

> **p.7** $w\prime(u,v)=w(u,v)+h(u)-h(v).$

给每个顶点任意整数 h，边重新赋权。p.8 对整条路径求和时，中间点的 h 一正一负抵消，因此

$$
w'(P)=w(P)+h(s)-h(t).
$$

p.9 两条相同起终点的路径都增加相同常数，长度比较不变。因此任意 h 都保持最短路，但任意 h 未必使每条边非负，这两个结论不能混为一谈。把所有边统一加常数则不行，因为不同路径边数不同，增加量不同。

**补充：用三条边把望远镜相消写开。** 对路径 s→u→v→t，新权之和是

$$
\begin{aligned}
w'(P)&=w(s,u)+h(s)-h(u)\\
&\quad+w(u,v)+h(u)-h(v)\\
&\quad+w(v,t)+h(v)-h(t)\\
&=w(P)+h(s)-h(t).
\end{aligned}
$$

只有中间点抵消，起终点留了下来。因此固定 s 时，不同目标的新距离排名未必与旧排名相同；保证不变的是同一对端点的候选路径排名。

:::hint 自测：给每条负边加同一个大常数，为什么不能替代势函数？

自取 s→t 权 3，s→u 权 1，u→t 权 1。原来两边路径总长 2，比直边 3 更短；给每条边都加 2 后，直边成 5，两边路径成 6，顺序反转。统一加常数多罚了边数多的路径。势差相消则无论几条边都只增加同一个端点差。

:::endhint

### p.10–11：把原图九条边算一遍

图（p.10）：上方原权、右侧势值、下方新权。元素：h(a)=h(b)=h(c)=0，h(d)=h(e)=−6，h(f)=−7，h(g)=−9。看什么：负边变零，其他边并非全部加同一个数。

| 边 | 新权计算 | 结果 |
|---|---|---|
| a→b | 1+0−0 | 1 |
| a→d | −6+0−(−6) | 0 |
| b→c | 1+0−0 | 1 |
| c→d | −2+0−(−6) | 4 |
| c→e | −1+0−(−6) | 5 |
| d→g | −3−6−(−9) | 0 |
| e→d | 5−6−(−6) | 5 |
| f→e | 1−7−(−6) | 0 |
| g→f | 2−9−(−7) | 0 |

原路径 a→d→g 权−9，新权0；恢复为 $0-h(a)+h(g)=-9$。p.11 接下来才解释这些 h 如何找到，不能先假设它们容易得到。

### p.12–14：超级源点把不等式变成非负权

> **p.12** “Every newly added edge carries the weight 0.”

加入新点 q，向所有原点各连一条权0的出边，不加进入 q 的边。p.13 以 q 为源运行 Bellman–Ford，取 h(v)=dist(q,v)。所有点都可达，所以 h 全部有限。p.14 留给读者的证明是最短路三角不等式：

$$
h(v)\le h(u)+w(u,v),\qquad w(u,v)+h(u)-h(v)\ge0.
$$

图（p.12–13）：新增零边从左侧 q 发出。元素：q 可直接以0到 c，而到 g 还可走 q→a→d→g 得−9。看什么：h(c)=0，不是从旧源点 a 算出的2。

最后去掉 q，在重赋权图上以每个原点做 Dijkstra，再按 $dist(s,t)=dist'(s,t)-h(s)+h(t)$ 恢复距离。父指针路径本身仍正确。显式加入 V 条边时，预处理朴素界为 $O(V(E+V))$；也可将所有 h 初始化为0后只扫描原边，等价模拟零边已松弛，时间 $O(VE+V)$。合并 V 次 Dijkstra，得到讲义总界 $O(V(V+E)\log V)$。

<a name="r-a1"></a>利用同一重赋权检测零环[见附录 A1](#a1)。

## 本讲核心考点

- （C 级 通识）证明路径重赋权的端点抵消及最短路保持。
- （C 级 通识）超级源点、势函数、非负不等式、距离恢复四步。
- （A 级：Final-2024T1 Q11）无负环图中用重赋权识别零环。

## 附录

### A1 作业/往年题演练（非讲义内容）：Final-2024T1 第 11 题——零环

<a name="a1"></a>**题面**（Final-2024T1-缺判断-题目.pdf · Problem 11 · p.6；扫描件，视觉读取；公式按原题重排）

> **p.6** “Problem 11 (10 marks). Let G = (V,E) be a simple directed graph, where each edge is associated with a weight, which can be positive, zero, or negative. Define the length of a cycle as the total weights of the edges in the cycle. We know that G has no negative cycles. Give an algorithm that detects whether G has a cycle with length 0. Your algorithm must finish in $O(\lvert V\rvert\lvert E\rvert)$ time. You need to prove the correctness of your algorithm and analyze its running time.”
>
> “You get 4 marks if you can solve the special case where all the edge weights are non-negative.”

题源：[Final-2024T1-缺判断-题目.pdf](../考试/Final-2024T1-缺判断-题目.pdf) p.6 Q11。输入是有向图、边可正可零可负且没有负环；要求 $O(VE)$ 时间判断是否有总权0的环，非负权情形可得部分分。

先以全零距离初始化做 Bellman–Ford，得到等价超级源点势。对所有边重赋权后均非负。一个环的端点相同，势差完全抵消，故原环总权0当且仅当新环总权0。非负数之和为0当且仅当每一项0，所以只保留新权为0的边，再用 DFS 的灰色回边判断是否有有向环即可。

预处理 $O(VE+V)$，取零边和 DFS 为 $O(V+E)$；在通常非空且保留相关顶点的图上写作题求的 $O(VE)$，孤立点可先线性移除。若只运行普通源点 Bellman–Ford，会遗漏该源不可达的零环。若直接只保留原权0的边，会漏掉权−2与2组成的零环。

[回到正文：重赋权](#r-a1)

## 来源与证据

- 原件：[L15-Graph-05-Johnson-APSP-未核-隐藏.pdf](../课件/L15-Graph-05-Johnson-APSP-未核-隐藏.pdf)；页码均为 PDF 页号。
- 版本记录（2026-09-17）：当时从教师官网下载并逐字节核对，与本地原件一致；此日期不是本次重新联网核验。原始学期未核，不据网页学期补猜。
- 发布状态（2026-09-17 核验时）：官网链接所在行隐藏，当时按预习参考处理；不据此推断后续发布或考试范围。
- 既有考试证据记录（2026-09-17）：当时读取了教师官网、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
