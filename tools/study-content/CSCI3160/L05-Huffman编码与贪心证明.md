# CSCI3160 L05 Huffman编码与贪心证明

> 课程：CSCI3160 Design and Analysis of Algorithms
> 本讲：L05 Huffman编码与贪心证明 · 原件 [L05-Greedy-03-Huffman-Codes-未核-隐藏.pdf](../课件/L05-Greedy-03-Huffman-Codes-未核-隐藏.pdf) p.1–23
> 定位：先理解前缀码为何可即时解码，再逐轮合并最小权节点，并用交换与收缩证明最优性。

p.1 标题页。

### 变长编码省在哪里（p.2–3）【新】

> **p.2** an encoding is a function that maps each letter in $\Sigma$ to a binary string, called a codeword.

p.2 的字母表 $\Sigma$ 是允许出现的符号集合，**码字**（codeword）是某个符号对应的位串。讲义定长编码 a=000、b=001、c=010、d=011、e=100、f=101，所以 bed 拼成 `001100011`，三个字母共九位。

p.3 利用频率缩短常见字母：a、b、c、d、e、f 的频率依次为 10%、20%、13%、9%、40%、8%；变长码依次为 100、111、101、1101、0、1100。

**算一遍**：平均每字母位数为 $0.30+0.60+0.39+0.36+0.40+0.32=2.37$。频率已归一化为和为 1 的比例，所以这是平均值；若使用百分数 10、20，则求得的是 237，要再除以 100。

### 不歧义的前缀条件（p.4–5）【新】

**题面**（L05-Greedy-03-Huffman-Codes-未核-隐藏.pdf · 解码例题 · p.4）

> **p.4** What is wrong with the encoding e = 0, b = 1, c = 00, a = 01, d = 10, f = 11? Ambiguity in decoding! For example, does the string 10 mean “be” or “d”?

位串 10 可以切成 1 与 0，即 be，也可以整体当 d，接收方无法判定。于是要求没有一个符号码字是另一个符号码字的前缀；满足条件的叫**前缀码**（prefix code）。这个名字意为“禁止码字互为前缀”，不是“所有码字有共同前缀”。

**题面**（同原件 · 解码练习 · p.4）

> **p.4** Example: The encoding a = 100, b = 111, c = 101, d = 1101, e = 0, f = 1100 is a prefix code. Just for fun, try decoding the following binary string.
> 10011010100110011100

逐个读位，到达某个完整码字即输出并重新开始：`100 / 1101 / 0 / 100 / 1100 / 111 / 0 / 0`，结果是 **adeafbee**，末尾两个 0 各自是一整个 e，不能漏掉第二个。

p.5 的目标函数为 $\sum_{\sigma\in\Sigma}\mathrm{freq}(\sigma)\mathrm{len}(\sigma)$。每个字母的频率乘码长后相加，优化的是期望码长，不是最长码字的长度。

### 码树把码长变成叶子深度（p.6–8）【新】

> **p.6** Every leaf node of T corresponds to a unique letter in $\Sigma$; every letter in $\Sigma$ corresponds to a unique leaf node in T.

p.6 在二叉树左边标 0、右边标 1，沿根到字母叶子的路线读出码字。为什么必为前缀码？一个完整码字在叶子结束；叶子没有后代，不可能再延伸成另一个码字。

p.7 的反向结论也成立：把所有码字按公共前缀插入一棵二进制树；前缀条件保证任何字母所在节点不会同时有别的字母后代，因而字母都在叶子。

图（p.7–8）：讲义变长码的编码树。
元素：根左叶 e，根右子树包含 a、c、f、d、b；路径分别为 e:0、a:100、c:101、f:1100、d:1101、b:111。
看什么：边数就是位数；p.8 对应深度 1、3、3、4、4、3。

p.8 把目标改写为最小加权平均叶深。用原频率乘这些深度，仍得到 2.37。树形状决定深度，左右交换只会改变具体比特，不改变平均长度。

### 每轮合并两个最小权根（p.9–11）【新】

> **p.10** Remove from S two nodes $u_1$ and $u_2$ with the smallest frequencies.

p.9 为每个字母建立独立叶子，当前集合 S 装的是这些树的根。p.10 取最轻两个根，把它们接到一个新父节点下；父节点权重为两者之和，再放回 S。新节点参与后续比较，不能一直只在原始字母中选最小项。

p.11 初始权重为 8(f)、9(d)、10(a)、13(c)、20(b)、40(e)，全体和为 100。每合并一次，根的个数减少 1，但总权重不变。

### 原例的前三次合并（p.12–14）

图（p.12–14）：三个局部子树逐步形成。
元素：p.12 合并 f 与 d 得 $u_1=17$；p.13 合并 a 与 c 得 $u_2=23$；p.14 合并 $u_1$ 与 b 得 $u_3=37$。
看什么：第三次比较的是 17、20、23、40，故选 17 与 20，不能把刚合成的 23 默认再与下一项合并。

**算一遍**：p.12 后根权为 10、13、17、20、40；p.13 后为 17、20、23、40；p.14 后为 23、37、40。每次完整更新候选集合，才能保证贪心规则真正执行。

### 最后合并与实现（p.15–17）

图（p.15–16）：完成的 Huffman 树。
元素：p.15 将 23 与 37 接到 60 下，p.16 将 40 与 60 接到根 100 下；40 是叶 e，60 的两子树分别含 a,c 与 f,d,b。
看什么：最早合并的 f、d 最深，最频繁的 e 只有一层。

p.15 得 60，p.16 得 100，输出码长与 p.3 相同。**补充／核对**：每次合并让该子树所有叶深增加 1，所以合并权之和等于加权路径总长：$17+23+37+60+100=237$，除以 100 得 2.37。

p.17 的实现用最小堆：每轮两次取最小、一次插入，共 $n-1$ 轮，每轮 $O(\log n)$，总计 $O(n\log n)$。存树节点为 $O(n)$，不需要每轮复制所有码字。

**考试角度**：（A 级：Review-Quiz-2020T2-题目.pdf Q2，考按频率构造最优前缀树；演练<a name="r-a1"></a>[见附录 A1](#a1)）。

### 两个结构性质（p.18–19）

> **p.18** In an optimal code tree, every internal node of T must have two children.

p.18 若某内部节点只有一个孩子，可收缩那条唯一边，让其下所有叶码长减 1而保持前缀性；正频率下平均码长严格下降，故原树不最优。

> **p.19** There exists an optimal code tree where $\sigma_1$ and $\sigma_2$ have the same parent.

p.19 指频率最小的两个字母。取最深内部节点，它的两个孩子都是最深叶子；把最小频率字母交换到这两个位置。频率小的字母放得更深不会增大目标。**补充／算一遍**（数字是我为演示取的，讲义没给）：频率 0.1、0.3 原先深度 2、4，贡献为 $0.1\cdot2+0.3\cdot4=1.4$；交换为 $0.1\cdot4+0.3\cdot2=1.0$。一般差为 $(f_{small}-f_{large})(d_{deep}-d_{shallow})\le0$。

### 收缩后用归纳法（p.20–21）

> **p.20** Huffman’s algorithm produces an optimal prefix code.

p.20 基本情形两个字母各用一位。p.21 借 p.19 选一棵最优树 T，使最轻两个字母成为兄弟；Huffman 第一步也将它们合并，因此两棵树都能收缩这一对。

这里 p.22–23 的推导单列如下，仍接续 p.21：

### 收缩的成本差完全相同（p.22–23）

p.22 将两个最轻字母替换为频率之和的新字母，得到规模少 1 的问题。收缩后两个叶深各减少 1，所以原树比收缩树多出的成本恰为两者频率之和。p.23 用归纳假设，Huffman 在缩小问题上不差于任何其他码树；给两边都加回同一常数，原问题仍不差。因此是全局最优。不是“合并最小看起来合理”就直接宣布最优；交换性质和收缩等式缺一不可。

用讲义第一对 0.08 与 0.09，收缩去掉的期望码长为 $0.08+0.09=0.17$；原树 2.37，收缩树 2.20。还原时两棵候选树都加同一个 0.17，大小关系不变。

<a name="r-a2"></a>补充对应的往年题演练[见附录 A2](#a2)。

## 本讲核心考点

- 前缀码用叶子代表字母，码长等于深度（p.4–8，C 级）。
- 每次合并当前两个最小权根（p.9–17，A 级：Review Quiz Q2）。
- 最优性由兄弟交换性质与收缩归纳共同保证（p.18–23，C 级）。

## 附录

### A1 作业/往年题演练（非讲义内容）：六个频率的码树

<a name="a1"></a>**题面**（Review-Quiz-2020T2-题目.pdf · Q2 · p.1）

> **p.1** 2. Construct an optimal prefix code tree for the following frequencies:
> {a : 2, b : 2, c : 6, d : 3, e : 3, f : 5}.

先合并 a:2 与 b:2 得 4；集合变为 3、3、4、5、6。合并 d:3 与 e:3 得 6；集合为 4、5、6(c)、6(de)。合并 4 与 f:5 得 9；合并两个 6 得 12；最后合并 9 与 12 得 21。

取根左为 9、右为 12，9 左为 ab、右为 f，12 左为 c、右为 de。一组码字为 a:000、b:001、f:01、c:10、d:110、e:111。没有一个码字是另一个的前缀，验证可行。

加权总长度为 $2\cdot3+2\cdot3+5\cdot2+6\cdot2+3\cdot3+3\cdot3=52$，也等于合并权和 $4+6+9+12+21=52$。频率总和 21，若要平均码长则为 $52/21$，约 2.476 位。按讲义已证定理，这一树最优；同权时的左右排列可以不同，不必与某张解答图逐位一致。

[回到正文：最后合并与实现（p.15–17）](#r-a1)

### A2 作业/往年题演练（非讲义内容）：编码总长度与反推频率

<a name="a2"></a>**题面**（Final-2021T1-题解.pdf · Part II Q2 · PDF p.3 右栏，印刷 p.6；扫描件，视觉读取）

> **p.3** “2. Let F be a file consisting of 2900 characters with frequencies B:300, R:100, G:500, Y:1000, P:700, W:300. Determine the number of bits in the encoded file F by Huffman encoding.”

按最小两项合并：100+300=400；300+400=700；500+700=1200；700+1000=1700；1200+1700=2900。等权700可以任选，总代价不变。每次合并使它包含的所有字符码长加1，所以总编码位数等于内部节点权重和：400+700+1200+1700+2900=6900。若用 B 与 R 先合并，码长分别 B4、R4、W3、G2、P2、Y2；加权总和1200+400+900+1000+1400+2000=6900，再次核对。

**题面**（Final-2024T1-缺判断-题目.pdf · Problem 9 · p.6；扫描件，视觉读取）

> **p.6** “Problem 9 (10 marks). Suppose that Prof. Goofy runs Huffman's algorithm on the alphabet of {a,b,c,d,e} and obtains the following code tree:”
>
> “Recall that the algorithm assumes that each letter is associated with a frequency, and all letters' frequencies add up to 100%. Prof. Goofy tells us that the frequencies of a and b are both 1/8 (namely, 12.5%). What are the frequencies of c, d, and e? You must justify your answers.”

图（题面，p.6）：五叶梳状二叉树。
元素：a、b 最先成为兄弟，其父节点依次与 c、d、e 合并；各叶深度4、4、3、2、1。
看什么：树规定了合并顺序，从“每轮取最小两个”推不等式，不能只用概率和。

设三未知频率为 c、d、e。第一轮选 a=b=1/8，要求 c,d,e≥1/8，合并权为1/4。第二轮选1/4与c，要求 d,e≥1/4 且 d,e≥c。第三轮将1/4+c与d合并，故 e≥1/4+c。又 c+d+e=3/4，于是

$$
\frac34=c+d+e\ge c+\frac14+\left(\frac14+c\right)=\frac12+2c.
$$

得 c≤1/8，与第一轮下界合并，c=1/8。要让总和恰为3/4，刚才两处下界也都必须取等号，所以 d=1/4、e=3/8。核验合并序列为1/4、3/8、5/8、1，与给定树相符；并列最小的选择可产生这棵树。

[回到正文：本讲正文](#r-a2)

## 来源与证据

- 原件：[L05-Greedy-03-Huffman-Codes-未核-隐藏.pdf](../课件/L05-Greedy-03-Huffman-Codes-未核-隐藏.pdf)；页码均为 PDF 页号。
- 最新性：已从教师官网重新下载并逐字节核对，与本地原件一致。原始学期未核，不据网页学期补猜。
- 发布状态：官网链接所在行仍隐藏，按预习参考处理。
- 考试证据：读了 教师官网（2026-09-17）、Midterm-2021T1-题目.pdf、Midterm-2021T1-题解.pdf、Review-Quiz-2020T2-题目.pdf、Review-Quiz-2020T2-题解.pdf、Quiz-01-2025T1-题解.pdf、Midterm-A-2025T1-缺题干-解答.pdf、Quiz-02-2025T1-缺题干-解答.pdf、Quiz-03-2025T1-缺题干-解答.pdf、Final-2021T1-题解.pdf、Final-2024T1-缺判断-题目.pdf、Final-2025T1-题目.pdf、Final-2025T1-缺题干-解答.pdf；未识别用途的 PDF：无
- 缺题干解答卷仅用于核对已取得的题面，不由答案反推题目。
