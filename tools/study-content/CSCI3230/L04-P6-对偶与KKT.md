# CSCI3230 L04 · Part 6/6 ESTR3108：Lagrange multipliers and duality

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2026T1
> 本讲：L04，第 6 部分 / 共 6 部分 · 原件 [L04-Support-Vector-Machine-2026T1.pdf](../课件/L04-Support-Vector-Machine-2026T1.pdf) p.50–69
> 定位：把等式约束、弱对偶和 KKT 联系起来，并逐行消去 SVM 的原变量。
> 前后：上一份 [Summary](L04-P5-小结.md)

p.50 分节页；p.51 Outline 列拉格朗日/对偶基础及SVM推导。

### 乘子为何能编码约束（p.52–54）【新】

p.52 以约束优化为目标，p.53 对每个等式 h=0 引入自由符号乘子β，拉格朗日函数为原目标加βh。p.54 对β求导就恢复h=0，对原变量求导则平衡目标与约束梯度。

**补充**：这一般给候选驻点，还需约束资格和二阶/凸性条件；不能将任意拉格朗日驻点叫最小值，也不能无条件宣称乘子唯一。下面二次例子可直接检验。

**补充：不要把所有变量一起最小化。** 等式约束的乘子允许正负；若原变量不满足约束，让乘子朝某方向走，拉格朗日函数可能无界。因此方法不是把新增函数当作一个普通无约束碗形目标，对所有变量一齐求最小。对乘子求驻点恢复约束；在对偶构造中，又要明确先固定哪组变量、对哪组取最小或最大。

### 讲义等式约束算到底（p.55–56）

**题面**（L04-Support-Vector-Machine-2026T1.pdf · Lagrange example · p.55）

> **p.55** Consider the following constrained optimization problem:
>
> $\min_{x_1,x_2}2x_1^2+x_2^2$
>
> s.t. $x_1+x_2=1$

公式按讲义重排。取 $L=2x_1^2+x_2^2+\beta(x_1+x_2-1)$，三条驻点方程为4x1+β=0、2x2+β=0、x1+x2=1。前两式给x2=2x1，代第三式得x1=1/3、x2=2/3、β=−4/3，目标2/3。

直接验算：代x2=1−x1，目标为 $3(x_1-1/3)^2+2/3$，故确为全局最小。

图（p.56）：椭圆等高线与约束直线。  
元素：目标等高椭圆、x1+x2=1直线、切点(1/3,2/3)。  
看什么：满足约束的点只能在线上，最小等高线第一次接触它的位置就是解。

### 不等式为何需要非负乘子（p.57–59）【新】

p.57 组合g≤0与h=0；p.58 固定w后最大化乘子：若某g>0，可令其非负α无限增大，L趋向无穷；若某h≠0，自由β可选合适正负并无限增大。若全部约束成立，不等式项≤0、等式项0，取α=0使最大值回到原目标。p.59 因而把可行性编码为“可行取f，违反取∞”。

**补充·算一遍**（数字是我为演示取的，讲义没给）：f=3、g=−2时，最大化3−2α且α≥0，最大值3；若g=2，则3+2α没有有限上界。这解释非负α在方向上的必要性。

### 交换先后为何只得到下界（p.60–61）

p.60 先对原变量取最小，再对乘子取最大，叫对偶；p.61 给出 $d^{\ast}\le p^{\ast}$，满足额外条件才可能相等。**补充**：更一般使用inf/sup，避免把未达到的极限误写成已取到的最小/最大。

弱对偶的直接理由：任意可行w与α≥0，L≤f(w)；而对偶函数又≤这个L，所以任何对偶值都不超过任何可行原目标。最大化这些下界仍不会越过原问题最小值。不能随意交换min/max后声称必然相等。

**补充·用课件二次例子算出下界。** 对 p.55 的 $L=2x_1^2+x_2^2+\beta(x_1+x_2-1)$，固定 $\beta$ 后，最小点为 $x_1=-\beta/4$、$x_2=-\beta/2$。代回得

$$
q(\beta)=-\frac{3}{8}\beta^2-\beta.
$$

这个值对任意 $\beta$ 都是原问题的下界。再最大化它，导数 $-3\beta/4-1=0$ 给 $\beta=-4/3$，此时 $q=2/3$，正好等于原问题最小值。这里不是只口头交换 min/max，而是实际算出了它们何时相等。

### KKT 是四类条件一起成立（p.62–63）【新】

p.62 列驻点、原可行、对偶可行、互补；p.63 强调αg=0。若α>0，则g必须等于0；若g<0，则α必须0。这是一对单向推论，不能反推“g=0必有α>0”。

**补充·算一遍**（数字是我为演示取的，讲义没给）：α=0、g=0同样满足乘积0，所以乘积方程本身已经否定那种无条件反推。对于凸SVM，配合适当条件KKT可验证全局最优；对一般非凸问题不能仅凭列出这些式子保证最优。

**补充（来源：[Stanford CS229 第 6 章，PDF p.69–75](https://cs229.stanford.edu/notes2022fall/main_notes.pdf)）**：四类条件各排除一种错误：原可行排除不满足题目约束的点；对偶可行排除乘子符号错误；驻点排除目标与约束作用尚未平衡；互补排除“约束明明有余量却仍施加正权重”的组合。对于硬间隔 SVM，严格可分时可把参数适当放大，使所有约束严格成立；结合凸性，这解释了为何对偶和 KKT 在此有坚实依据。不要将这套结论直接推广到任意非凸训练问题。

### SVM 拉格朗日函数的逐项展开（p.64–66）

p.64 每样本一个不等式，因此只有α、没有等式乘子β；p.65 展开为

$$
L=\frac{1}{2}w^{T}w+\sum_i\alpha_i-w^{T}\sum_i\alpha_iy_ix_i-b\sum_i\alpha_iy_i.
$$

p.66 先固定α，对w与b最小化。对w导数给w=∑αyx；对b导数给∑αy=0。后一条件也可从有界性看出：若b的线性系数非零，b朝某方向无穷移动会令L趋向负无穷，不能形成有限有效下界。

### 消元、求解、恢复预测（p.67–69）

p.67 代回w后，原来的半平方项与负的一整个平方项相减，留下负半平方：

$$
\min_{w,b}L=\sum_i\alpha_i-\frac{1}{2}\left(\sum_i\alpha_iy_ix_i\right)^{T}\left(\sum_j\alpha_jy_jx_j\right).
$$

将两个和相乘，就是p.68的双重求和内积式；α非负与∑αy=0是其约束。p.68用SMO等方法求解，再恢复w、b。p.69回到预测只需非零α项，解释支持向量的计算作用。

**算一遍**：用p.27–29的α，∑α=1，w范数平方1，所以对偶值1−1/2=1/2；原目标也为1/2。原对偶值相等并满足可行、互补，验证了该例最优性。

p.69把α=0推成严格在间隔外，已在Part 2标明退化例外。按本页真正可靠的互补方向承接，

<a name="r-a1"></a>**考试角度**：（A 级：2023 卷 Part II Q6）问对偶方法、核及监督信号，演练[见附录 A1](#a1)。

**补充：双重求和为什么有两个不同索引？** 把 $a=\sum_i\alpha_i y_i x_i$ 与自身做内积时，左边的每一项必须与右边的每一项配对，所以写成 $\sum_i\sum_j\alpha_i\alpha_jy_iy_jx_i^Tx_j$。只保留 $i=j$ 会丢掉样本之间的交叉作用，变成另一道问题。外面的 $1/2$ 来自消元后的半平方，不是因为“只算一半样本”。

在线性核下，可先合成 $w$ 再预测，无需每次遍历支持向量；使用一般核时，通常直接保留非零乘子项计算核分数。两种实现共享同一数学模型，不能把“支持向量足够”误说成“所有实现都必须逐一访问原训练样本”。

## 本讲核心考点

- 原可行时拉格朗日乘子最大化还原原目标（p.58–59，C 级）。
- 弱对偶下界，强对偶需条件（p.60–61，C 级）。
- KKT 互补不能无条件双向反推（p.62–63，C 级）。
- SVM 对偶只需样本内积（p.64–69，A 级：HW02 Q1）。

## 附录

### A1 作业/往年题演练（非讲义内容）：对偶、核与分类损失

<a name="a1"></a>**题面**（ESTR-Final-Exam-2023T1.pdf · Part II Q6 · p.5；扫描件，视觉读取）

> **p.5** 6. What optimization method is used to transform SVM primal problem to a dual problem? If the data points are linearly inseparable, explain why kernel SVM can address the problem and state two commonly used typical SVM kernels. In addition, does kernel SVM belong to supervised learning or unsupervised learning? (7%)

使用拉格朗日乘子和对偶方法：将每个分类约束写入拉格朗日函数，对 $w,b$ 求最小消元后得到只含 $\alpha$ 的最大化问题，本讲 p.64–68 给出过程。核函数计算映射空间的内积，使原空间的非线性边界在特征空间成为超平面；能否得到理想分类仍取决于数据和所选核，不保证任意核都分开任意数据。典型例子为多项式核 $K(x,z)=(x^Tz+c)^d$ 和 RBF 核 $K(x,z)=\exp(-\gamma\lVert x-z\rVert^2)$。训练约束含真实标签 $y_i$，所以仍是有监督学习；映射非线性不会改变监督信号来源。

**题面**（同卷 · Part I Q2 · p.2；扫描件，视觉读取）

> **p.2** 2. (3%) For classification methods, which of the following statement is not true?
>
> A. Once a linear SVM classifier is trained, you can only rely on support vectors to make predictions for new samples.
>
> B. Soft-margin SVM aims to deal with noisy samples in training data.
>
> C. Logistic regression uses gradient descent on Hinge loss to train the classification model, because its analytical solution is difficult to obtain.
>
> D. Neural networks can address binary classification by using the softmax activation.

课程预期选择 C：logistic 回归优化交叉熵，hinge loss 对应软间隔 SVM。B 解释软间隔容忍违约的用途；D 可用两个 logits 经 softmax 表示二分类。A 在“只用支持向量就足够”意义下成立，因为零系数项没有贡献；若将 only 理解成“必须保存样本、不能用合并后的 $w,b$”，字面过强，线性模型完全可以直接计算 $w^Tx+b$。这区分了题意与实现，不额外制造一个未经证实的官方答案。

[返回正文](#r-a1)

## 来源与证据

- 2026-10-01 加深版：按本学期清洗后 PDF 核对；正文页码均为去除动画中间页后的 PDF 页号。 原始 PDF 81 页，阅读版 69 页；[逐页映射](核验/L04-2026页码.csv)、[清洗核验](核验/L04-2026清洗.json)。

- 原件：[L04-Support-Vector-Machine-2026T1.pdf](../课件/L04-Support-Vector-Machine-2026T1.pdf)，p.50–69；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
