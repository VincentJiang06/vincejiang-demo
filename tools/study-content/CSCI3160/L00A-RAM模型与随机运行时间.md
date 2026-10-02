# CSCI3160 L00A RAM模型与随机运行时间

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L00A RAM模型与随机运行时间 · 原件 [L00A-Warmup-01-RAM-Model-未核.pdf](../课件/L00A-Warmup-01-RAM-Model-未核.pdf) p.1–16
> 定位：先约定计算机能做什么，再把运行时间定义成操作次数。读完能区分一次随机执行的代价和它的期望。

p.1 标题页。

### 为什么先讲模型（p.2–3）【新】

> **p.2** Programming knowledge is not necessary to study algorithms.

p.2 把本课目标从“写出能运行的代码”转向“说明算法为什么正确、为什么快”。一个程序在你的机器上跑得快，并不能证明所有同规模输入上都快：机器速度、实现语言和测试数据都在变化。

> **p.3** first define a computation model, which is a simple yet accurate abstraction of a computing machine;

p.3 给出解决办法：先固定**计算模型**（computation model），即允许哪些操作、每步如何计费，再在模型里比较算法。后面所谓线性时间、对数时间，都以这个约定为基础。严谨并不是给普通句子堆符号，而是让两个人面对同一算法时能得到同一计数规则。

### 内存与八个寄存器（p.4–5）【新】

> **p.4** Every cell has an address: the first cell of memory has address 1, the second cell 2, and so on.

p.4 的**内存**（memory）是一列带地址的单元，每格保存同样多的位，记为 $w$ 位。地址回答“在哪一格”，内容回答“那格存着什么”，两者不能混为一谈。模型允许按地址直接访问，所以不必为了读取第 100 格而依次走过前 99 格。

> **p.5** Contains a fixed number—8 in this course—of registers, each of which has w bits (i.e., same as a memory cell).

图（p.5）：CPU 与内存的布局。
元素：上方梯形 CPU 里有八个寄存器；下方是一排从地址 1 开始的内存格；寄存器与内存格均标 $w$ bits。
看什么：寄存器个数固定，输入可以变大，所以不能把所有输入都假设已经放在寄存器里。

p.5 的**寄存器**（register）是 CPU 运算直接使用的少量存储位置。$w$ 是单个位置的容量，不是位置的个数；“八个寄存器”也不意味着程序最多只能处理八个数，因为数据可在内存与寄存器之间搬运。

### 初始化与整数算术（p.6–7）【新】

> **p.6** Set a register to a fixed value (e.g., 0, −1, 100, etc.), or to the content of another register.

p.6 的原子操作是不可再拆计费的一步。把寄存器设为常量和复制另一个寄存器，都属于模型直接允许的操作。这里的“复制”是覆盖目的寄存器，来源仍保留。

> **p.7** Note: a/b is “integer division”, which returns an integer.

p.7 允许对寄存器中的两个整数做加、减、乘、整除，并把结果写进寄存器。**算一遍**：讲义给出 $6/3=2$ 与 $5/3=1$；第二个不是约等于 1.67，而是模型定义的整数结果。若后续循环用整除把规模减半，奇数规模就需要另外处理取整。

**补充**：这个单位代价只针对模型允许的一字运算，不能直接把任意位数的大整数乘法当一步。超出一个字的数据要由多个字表示，再数这些字上的操作；本讲 p.12 允许通常不追究 $w$ 的具体值，并没有宣布任意精度运算免费。

### 分支与内存访问（p.8–9）【新】

> **p.8** Take the integers a, b stored in two registers, compare them, and learn which of the following is true:

p.8 的比较辨别小于、等于、大于，然后决定下一步执行哪一段。一个算法能处理不同输入，靠的正是这种数据相关的执行路径；代码行数相同，执行次数可以不同。

> **p.9** Read the content of the memory cell with address A into a designated register (overwriting the bits there).

p.9 的读内存分两层：寄存器里先有地址 $A$，再到该地址取内容。写内存则把指定寄存器的内容覆盖进该地址。它不会把“地址值”自动当成“内容值”。

**补充／算一遍**（数字是我为演示取的，讲义没给）：设地址寄存器为 7、内存第 7 格为 23。执行一次读，数据寄存器成为 23；再把数据寄存器加上已存好的 1，得到 24；执行一次写，第 7 格变为 24。这三步分别是访问、算术、访问；若最初还需初始化地址与常量，也要另外计费，不能藏进三步里。

### 随机原子操作（p.10）【新】

> **p.10** this operation returns an integer chosen uniformly at random in [x, y], and places the random integer in a register.

**均匀随机**（uniformly at random）意为每个合法整数的概率相同。闭区间两端都可选，因此共有 $y-x+1$ 个候选值，各自概率为 $1/(y-x+1)$。只知道“随机”还不够，必须知道它在哪个集合、按什么概率抽取。

**补充／算一遍**（数字是我为演示取的，讲义没给）：`RANDOM(2,5)` 可返回 2、3、4、5，每个概率 $1/4$；返回偶数有两个互斥结果，所以概率 $1/4+1/4=1/2$。不要把区间长度错算成 $5-2=3$。

### 执行、字长与算法代价（p.11–13）【新】

> **p.11** An execution is a sequence of atomic operations.

p.11 把**一次执行**（execution）看成按实际发生顺序列出的操作序列，**运行时间**就是序列长度。循环体只有三行，执行一百次，也不能只计三步。

> **p.12** A word is a sequence of w bits, where w is called the word length.

p.12 的**字**（word）就是一个寄存器或一个内存单元容纳的位串。字长 $w$ 固定了单次原子操作处理的数据宽度。本课除特别说明外不要求围绕它做位复杂度分析。

> **p.13** The space of an algorithm on an input is the largest memory address accessed by the algorithm’s execution on that input.

p.13 同时规定输入、算法和空间：输入是执行前内存与寄存器的状态；算法的描述必须使每一步都有确定含义；本讲**空间**按访问到的最大内存地址算。**补充／算一遍**（数字是我为演示取的，讲义没给）：若只访问地址 2、5、100，本讲空间是 100，不是不同地址的个数 3。通行分析有时统计额外使用的单元数；回答本讲问题应先说明采用的是讲义这个地址定义。

**补充：先画出一次循环的账本。** 假设数组地址及长度已知，要累加三个一字整数 4、1、7（数字是我为演示取的）。结果不是一条“求和”指令：需要把累加器初始化为 0，读取 4 后加到 4，读取 1 后加到 5，读取 7 后加到 12；此外还要维护地址、计数器和判断循环是否结束。具体常数随伪代码写法改变，但每轮做固定数量的允许操作，三项对应三轮，推广到 $n$ 项即线性。这里没有预设一次数组访问会随下标增大而变慢。

:::hint 自测：一个数不断乘 2，做 n 次，是不是必然只需 O(n) 时间？

提示：先检查结果能否装进模型的一个字。若初值 1，做 $n$ 次后是 $2^n$，其二进制需要 $n+1$ 位。只有模型保证这些中间数均可用一个字表示，才可直接按一次乘法一个原子操作计费；固定有限字长发生溢出时，程序已经没有算出数学上的那个整数。多字实现要另计成本。

:::endhint

### 确定性与随机性（p.14）【新】

> **p.14** On the same input, the cost of a deterministic algorithm is a fixed integer—it remains the same every time you execute the algorithm.

确定性算法不调用 `RANDOM`，所以固定输入后，执行轨迹与代价也固定。随机算法调用它，同一输入可能产生不同轨迹，运行时间因而是**随机变量**（random variable）。这里没有把输入随机化：随机的是算法自己的选择。这一区别决定下一讲“先求期望、后选最坏输入”的顺序。

### 重试直到抽到 1（p.15–16）【新】

**题面**（L00A-Warmup-01-RAM-Model-未核.pdf · Example · p.15）

> **p.15** 1. do
> 2. r = RANDOM(0, 1)
> 3. until r = 1
>
> How many times would Line 2 be executed?

p.15 不能给出每次执行都相同的次数：第一次抽到 1 就停止；先抽到三个 0 再抽到 1，就执行四次。连续失败任意多次都有可能，因此没有有限的确定次数上界。

> **p.16** The expected cost of the algorithm on the input is the expectation of X.

p.16 不再问“这一次恰好用了几步”，而问按各次执行概率加权后的平均代价。$X$ 是全部原子操作数；为了看懂含义，先算 p.15 的抽样次数 $N$。

**补充／算一遍**：按每次独立均匀抽样的模型，$P(N=1)=1/2$，$P(N=2)=1/4$，$P(N=3)=1/8$。第一次总要抽一次；一半概率失败后回到原状，所以 $E[N]=1+E[N]/2$，移项得到 $E[N]=2$。若每轮计固定的 $c$ 步，则期望轮内代价为 $2c$，不是宣称整段程序恰好两条原子操作。无限失败路径在逐次抽样模型下概率为零，“无有限上界”也不等于“以正概率永不停止”。

**考试角度**：（C 级 通识）常见考法是辨别“期望抽两次”与“最多抽两次”，并指出期望的随机性来自哪里。

## 本讲核心考点

- 运行时间数实际原子操作，不数源代码行（p.11–13，C 级）。
- 本讲空间取访问到的最大地址（p.13，C 级）。
- 固定输入上，随机算法的代价仍可变化（p.14–16，C 级）。

## 附录

本讲所需过程已在正文展开。

## 来源与证据

- 原件：[L00A-Warmup-01-RAM-Model-未核.pdf](../课件/L00A-Warmup-01-RAM-Model-未核.pdf)；页码均为 PDF 页号。
- 版本记录（2026-09-17）：当时从教师官网下载并逐字节核对，与本地原件一致；此日期不是本次重新联网核验。原始学期未核，不据网页学期补猜。
- 既有考试证据记录（2026-09-17）：当时读取了教师官网、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
