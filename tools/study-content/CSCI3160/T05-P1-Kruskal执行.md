# CSCI3160 T05 · Part 1/2 Kruskal执行

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：T05，第 1 部分 / 共 2 部分 · 原件 [T05-Kruskal算法-未核-隐藏.pdf](../辅导/T05-Kruskal算法-未核-隐藏.pdf) p.1–13
> 定位：手动运行Kruskal的合并与跳边，再用权值分层理解历年MST图题。
> 前后：下一份 [Part 2](T05-P2-Kruskal正确性.md)

本讲按原件提纲分为：

- [Part 1：Kruskal执行](T05-P1-Kruskal执行.md)（p.1–13）
- [Part 2：Kruskal正确性](T05-P2-Kruskal正确性.md)（p.14–20）

### p.1–3：先算法，再正确性【新】

p.1 列出Kruskal与证明两个部分，页脚从2开始，本文仍用实际PDF页。p.2 回顾MST定义，p.3 沿用八点图，两个最优树权37，另一个生成树48。相同总权的树可以有不同边，所以证明应是“存在一个最优解包含已选边”。

### p.4–6：维护森林

> **p.4** “repeatedly taking the lightest cross edge.”

每点最初一棵树，跨边是端点在不同树的边；选最轻跨边合并两树。p.5 初始8棵树，所有边都是跨边；p.6 先选ab1，合并a,b，还剩7棵。图（p.6）：红边是已选边，表中删除线标已合并的旧记录。看什么：被划掉的b行不是另一个仍存在的独立分量。

### p.7–9：不必与上一条选边相连

p.7 选ef2形成另一棵树；p.8 在ac3与bc3中选ac，bc因此成为内部边，不能再选；p.9 选cf5连接{a,b,c}与{e,f}，af7、be10同时失去跨边资格。Kruskal可以同时成长多个分量，与Prim始终维护一棵已选树不同。

### p.10–12：顺序扫描时跳过会成环的边

p.10 选ch6，ah8变内部边；p.11 选gh9，bg13变内部边；p.12 选gd11，ed12变内部边。按照全局升序扫描时，遇bc3、af7、ah8、be10时都因同分量而跳过；不能仅取全图最小的V−1条边。

### p.13：森林只剩一棵树

p.13 的示例完成，全部顶点被合并进同一棵树，七条边的权为1、2、3、5、6、9、11，总成本37。下一页才开始正确性证明。

<a name="r-a1"></a>对应往年题[见附录 A1](#a1)。

## 本讲核心考点

- 每次选连接不同分量的最轻边，维护森林（p.4–13；C 级）。
- 相同权值需按收缩图保留独立选择，不能当成唯一MST（A 级：Midterm-2021T1 Q6、Review-Quiz-2020T2 Q7）。

## 附录

### A1 作业/往年题演练（非讲义内容）：三个 MST 图题

<a name="a1"></a>**题面**（Midterm-2021T1-题目.pdf · Q6 · p.2；图已对照题解扫描页）

> **p.2** “6. [4 points] Determine the number of distinct minimum spanning trees in graph G:”

图（题面，p.2）：三行四列网格，以下自行命名仅用于讲解。
元素：顶行A,B,C,D；中行E,F,G,H；底行I,J,K,L。权1边AB、AE、EB、BG、FG、CG、CH、HL、KL、IJ；权2边BC、CD、EI、JK、GL；其余图示边EF、BF、FJ、GH、DH、GK、EJ均权3。
看什么：先处理所有权1边形成的分量，再在收缩图数选择，不逐一枚举整树。

权1图内，A,B,E构成三角形，必须取其中两边，有3种；其余权1边全为相应分量的桥。收缩后有三个点X={A,B,C,E,F,G,H,K,L}、Y={D}、Z={I,J}。权2的CD是连接Y的唯一轻边，必须选；Z到X可选EI或JK，恰2种。BC与GL已在X内，不能另选。故总数3×2=6。每种都由9条权1边与2条权2边构成，成本13；跳过某个能连接分量的权1边再改用更重边不会更优。

**题面**（Review-Quiz-2020T2-题目.pdf · Q7 · p.2；图已对照题解扫描页）

> **p.2** “7. For the purpose of counting the number t of distinct minimum spanning trees in the graph of Figure 2, construct the reduced graph and determine t.”

图（题面，p.2）：同样按三行四列A至L命名。
元素：权1边EB、EI、IJ、JF、FG、CG、GK、JK、KL、DH、HL、KH；权2边AB、AE、BC、CD、EF、GH、JG；权3边BF、BG、EJ、CH。
看什么：低权边形成一个四环和一个三角形，其余是桥；顶点A还需接入。

除A外，权1图已经连通。四环J–F–G–K–J要删恰一边，有4种；三角形K–H–L–K要删恰一边，有3种；其余权1边必须保留。A可通过AB或AE的权2边接入，有2种。每个选择互不妨碍，因此t=4×3×2=24。把相同两收缩点之间的平行边合并成一条会错漏这最后的2种。

**题面**（Final-2021T1-题解.pdf · Part II Q3 · PDF p.4 左栏，印刷 p.7；扫描件，视觉读取）

> **p.4** “3. Find the weight of a minimum spanning tree of the graph in Figure 1.”

图（题面，p.4）：十三个未标名顶点，原图仍是题面的一部分。
元素：为说明计算，令最左点A；上方从左到右B,C,D；中排从左到右E,F,G；左下点H；底排从左到右I,L；下方内部点J；中央小点K；右下点M。权3边CD、HI、IL、GM；权4边AE、AH、HE、CF；权5边IJ、JK。更高权连通所需可取LM=6、EC=7、BA=8。
看什么：依权值层看连通分量数下降，判断各层必须收多少边。

从13个孤点开始，权3的四条边全连接不同分量，取4条后剩9个分量；权4中AE、AH、HE构成三角形，只取2条，再取CF，共3条后剩6个分量；权5的IJ、JK均连接不同分量，取2条后剩4个分量。权6只再连接一对分量，取LM后剩3个；权7取EC后剩2个；权8取BA接入B，剩1个。故最小权重为4×3+3×4+2×5+6+7+8=55。这里已列出12条合法取边（权4任选AE、AH），有13点且每步连接不同分量，所以确为生成树；分量逐层下降也证明没有更便宜的方案。

[回到正文：本讲结尾](#r-a1)

## 来源与证据

- 原件：[T05-Kruskal算法-未核-隐藏.pdf](../辅导/T05-Kruskal算法-未核-隐藏.pdf)，本部分 p.1–13；页码均为 PDF 页号。
- 最新性：已从教师官网重新下载并逐字节核对，与本地原件一致。原始学期未核，不据网页学期补猜。
- 发布状态：官网链接所在行仍隐藏，按预习参考处理。
- 考试证据：读了 教师官网（2026-09-17）、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
