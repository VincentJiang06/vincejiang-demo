# CSCI3160 Exercise 快速复习入口

**题目合集：** [全部可取得的 Special 原题与 2024 MT 标记](SP-题目合集与MT标记.md) · 13 套、63 题；Sp09 今年链接为空，未混入 2025 版。

> 更新：2026-10-20，已访问本学期官网并重新请求全部 40 条 exercise PDF 链接。
> 范围：Regular 1–13 共 68 题；Special 1–14 共 68 题；合计 27 组、136 题。各题保留题意、解题过程、证明或执行表和复杂度。
> 版本：26 组按当前可下载官方题源核对；Special 9 使用已实际下载的 2025T1 教师镜像，不能据此确认当前缺失版本。
> 阅读：从本页点 Q 号可直接进入相应题目；英文题干和原图用各行 PDF 对照。中文题意为重述，题解为学习用解析。

## MT review：官网已显示的 14 套

**标记范围：Regular 1–7（37 题）及 Special 1–7（33 题），共 70 题。** 已按你的要求统一标注为 **MT review**；核对时间为 2026-10-20 15:24（北京时间）。[标注依据](核验/MT标注-20261020.json)。

官网 10 月 14 日公告将期中范围定为 **Warm Up 1 至 Dynamic Programming 4**。同页当前可见 Regular 1–7 与 Special 1–7，合计 **70 题**。官网还说明期中和期末约 35% 分数取自 Special 题目；这不是保证某一道题一定出现。[本学期官网](https://www.cse.cuhk.edu.hk/~taoyf/course/3160/26-fall%20/index.html)

如果这次是为期中快速复习，建议先完成下面的 Special，再读对应 Regular 的证明。以下顺序是学习建议，不把“网页已显示”当成每题均在考纲内的证明。Regular 6 的 DAG 题、Regular 7 的矩阵链以及 Special 7 的网格题，可作为动态规划迁移练习。

| 阅读顺序 | 先看完整演算 | 再读证明与设计题 | 合上解析后应能复现 |
|---|---|---|---|
| 1. 选择与概率 | [Special 1，5 题](exercise/Sp01-选择与加权中位数.md) | [Ex01 Q1](exercise/Ex01-随机算法与期望分析.md)、[Ex01 Q2](exercise/Ex01-随机算法与期望分析.md)、[Ex01 Q5](exercise/Ex01-随机算法与期望分析.md) | 拒绝后仍均匀；成功概率决定期望；子问题秩怎样减 |
| 2. 分治 | [Special 2，5 题](exercise/Sp02-分治输出与矩阵分块.md) | [Regular 2，5 题](exercise/Ex02-分治与线性合并.md) | 左、右、跨区怎样不重不漏；有序结果怎样让合并线性 |
| 3. 活动选择与背包 | [Special 3，4 题](exercise/Sp03-贪心反例与背包.md) | [Ex03 Q1](exercise/Ex03-贪心选择与交换证明.md)、[Ex03 Q4](exercise/Ex03-贪心选择与交换证明.md)、[Ex03 Q5](exercise/Ex03-贪心选择与交换证明.md) | 明确贪心规则；交换仍可行；反例算出两种方案的差距 |
| 4. 最小生成树 | [Special 4，4 题](exercise/Sp04-Prim演算与割性质.md) | [Ex04 Q3](exercise/Ex04-树与最小生成树.md)、[Ex04 Q5](exercise/Ex04-树与最小生成树.md)、[Ex04 Q6](exercise/Ex04-树与最小生成树.md)、[Ex05 Q2](exercise/Ex05-Kruskal与前缀编码.md) | 逐轮跨边；加边成环、删合适边；所有已选边同时安全 |
| 5. Huffman | [Special 5，5 题](exercise/Sp05-Huffman完整演算.md) | [Ex05 Q3](exercise/Ex05-Kruskal与前缀编码.md)、[Ex05 Q4](exercise/Ex05-Kruskal与前缀编码.md)、[Ex05 Q5](exercise/Ex05-Kruskal与前缀编码.md) | 合并最小频率；读出码字；交换与收缩为什么最优 |
| 6. DP 与恢复方案 | [Special 6，5 题](exercise/Sp06-DP表格与切割费用.md) | [Ex06 Q1](exercise/Ex06-DP依赖与方案恢复.md)、[Ex06 Q2](exercise/Ex06-DP依赖与方案恢复.md)、[Ex06 Q4](exercise/Ex06-DP依赖与方案恢复.md) | 状态依赖与填表顺序；保存决策；滚动行保留什么 |
| 7. LCS 与序列问题 | [Special 7，5 题](exercise/Sp07-LCS与网格最长路径.md) | [Regular 7，5 题](exercise/Ex07-序列与区间动态规划.md) | 填表、回溯；子序列与子串区别；区间和网格 DP |

只剩一轮短复习时，先亲手重做 **Sp04 Q2–3、Sp05 Q1、Sp06 Q3–5、Sp07 Q1–2** 的表格或执行步骤；再用 Ex03 Q1、Ex04 Q5、Ex05 Q2、Ex06 Q1 各复述一遍证明。读完结论后，遮住过程重写“为什么这个选择覆盖全部可能、为什么这一步安全、时间怎么加起来”，比反复浏览答案更能暴露卡点。

## 本次必须注意的变化与原题问题

- **[Ex06 Q1](exercise/Ex06-DP依赖与方案恢复.md) 新增 O(2ⁿ) 上界要求。** 旧稿只有调用次数给出的下界；现已补完整紧界证明：总调用数 2ⁿ，全部循环次数 2ⁿ−1，故总时间 Θ(2ⁿ)。题目和答案两个官网链接现在返回同一份三页合卷。
- **[Ex03 Q4](exercise/Ex03-贪心选择与交换证明.md) 的九区间反例仍需说清平局。** 当前官方答案去掉了旧版的一个强断言，但选择不同的并列最小冲突区间，仍可能分别得到 3 或 4 个活动。解析提供了无首步平局的十一区间反例。
- **[Ex06 Q3](exercise/Ex06-DP依赖与方案恢复.md) 与 [Sp06 Q2](exercise/Sp06-DP表格与切割费用.md) 缺相邻区间边界。** 已按原 PDF 图像复核；先写出缺的条件，再给带边界参数的完整 DP。不要把空集合的最小值擅自当成零。
- **[Sp07 Q4](exercise/Sp07-LCS与网格最长路径.md) 约束应作用于路径的每一步。** 原题用 n 写逐步范围，但路径长度另记为 ℓ；解析明确这个题面问题，并按全路径严格递增求解。
- **[Ex09 Q6](exercise/Ex09-最短路证明与负环.md) 的单源初始化不能检测不可达分量的负环。** 反例、失败轨迹与全零初始化修正均已写出；本题属于后续图算法练习。
- **[Special 9](exercise/Sp09-强连通分量历史题解.md) 已有可离线阅读的历史原件。** 现行链接仍为空；本次找到 2025 Fall 教师网站的 Yufei Tao 原题 PDF，逐题核对了 5 道 SCC 题。

完整条件和边界集中见[勘误与阅读说明](exercise/勘误与阅读说明.md)。后续的最优 BST、SCC、最短路、近似算法等题也已列入以下全量导航，可按学期后续进度继续练习。

## Regular：13 组、68 题

| List | 题数 | 直接跳到解题过程 | 原题来源 | 答案身份 | 2026-10-20 状态 |
|---|---:|---|---|---|---|
| [Ex01](exercise/Ex01-随机算法与期望分析.md) | 5 | [Q1](exercise/Ex01-随机算法与期望分析.md) · [Q2](exercise/Ex01-随机算法与期望分析.md) · [Q3](exercise/Ex01-随机算法与期望分析.md) · [Q4](exercise/Ex01-随机算法与期望分析.md) · [Q5](exercise/Ex01-随机算法与期望分析.md) | [题目 PDF](../作业/Ex01-题目.pdf) | [官方答案](../作业/Ex01-答案.pdf) | **MT review** · 当前页面可见 |
| [Ex02](exercise/Ex02-分治与线性合并.md) | 5 | [Q1](exercise/Ex02-分治与线性合并.md) · [Q2](exercise/Ex02-分治与线性合并.md) · [Q3](exercise/Ex02-分治与线性合并.md) · [Q4](exercise/Ex02-分治与线性合并.md) · [Q5](exercise/Ex02-分治与线性合并.md) | [题目 PDF](../作业/Ex02-题目.pdf) | [官方答案](../作业/Ex02-答案.pdf) | **MT review** · 当前页面可见 |
| [Ex03](exercise/Ex03-贪心选择与交换证明.md) | 5 | [Q1](exercise/Ex03-贪心选择与交换证明.md) · [Q2](exercise/Ex03-贪心选择与交换证明.md) · [Q3](exercise/Ex03-贪心选择与交换证明.md) · [Q4](exercise/Ex03-贪心选择与交换证明.md) · [Q5](exercise/Ex03-贪心选择与交换证明.md) | [题目 PDF](../作业/Ex03-题目.pdf) | [官方答案](../作业/Ex03-答案-20261020.pdf) | **MT review** · 当前页面可见 |
| [Ex04](exercise/Ex04-树与最小生成树.md) | 6 | [Q1](exercise/Ex04-树与最小生成树.md) · [Q2](exercise/Ex04-树与最小生成树.md) · [Q3](exercise/Ex04-树与最小生成树.md) · [Q4](exercise/Ex04-树与最小生成树.md) · [Q5](exercise/Ex04-树与最小生成树.md) · [Q6](exercise/Ex04-树与最小生成树.md) | [题目 PDF](../作业/Ex04-题目.pdf) | [官方答案](../作业/Ex04-答案.pdf) | **MT review** · 当前页面可见 |
| [Ex05](exercise/Ex05-Kruskal与前缀编码.md) | 5 | [Q1](exercise/Ex05-Kruskal与前缀编码.md) · [Q2](exercise/Ex05-Kruskal与前缀编码.md) · [Q3](exercise/Ex05-Kruskal与前缀编码.md) · [Q4](exercise/Ex05-Kruskal与前缀编码.md) · [Q5](exercise/Ex05-Kruskal与前缀编码.md) | [题目 PDF](../作业/Ex05-题目.pdf) | [官方答案](../作业/Ex05-答案.pdf) | **MT review** · 当前页面可见 |
| [Ex06](exercise/Ex06-DP依赖与方案恢复.md) | 6 | [Q1](exercise/Ex06-DP依赖与方案恢复.md) · [Q2](exercise/Ex06-DP依赖与方案恢复.md) · [Q3](exercise/Ex06-DP依赖与方案恢复.md) · [Q4](exercise/Ex06-DP依赖与方案恢复.md) · [Q5](exercise/Ex06-DP依赖与方案恢复.md) · [Q6](exercise/Ex06-DP依赖与方案恢复.md) | [现行题解合卷](../作业/Ex06-题解-20261020.pdf) | [官方答案](../作业/Ex06-题解-20261020.pdf) | **MT review** · 当前页面可见 |
| [Ex07](exercise/Ex07-序列与区间动态规划.md) | 5 | [Q1](exercise/Ex07-序列与区间动态规划.md) · [Q2](exercise/Ex07-序列与区间动态规划.md) · [Q3](exercise/Ex07-序列与区间动态规划.md) · [Q4](exercise/Ex07-序列与区间动态规划.md) · [Q5](exercise/Ex07-序列与区间动态规划.md) | [题目 PDF](../作业/Ex07-题目.pdf) | [官方答案](../作业/Ex07-答案.pdf) | **MT review** · 当前页面可见 |
| [Ex08](exercise/Ex08-强连通分量与缩点DP.md) | 5 | [Q1](exercise/Ex08-强连通分量与缩点DP.md) · [Q2](exercise/Ex08-强连通分量与缩点DP.md) · [Q3](exercise/Ex08-强连通分量与缩点DP.md) · [Q4](exercise/Ex08-强连通分量与缩点DP.md) · [Q5](exercise/Ex08-强连通分量与缩点DP.md) | [题目 PDF](../作业/Ex08-题目.pdf) | [官方答案](../作业/Ex08-答案.pdf) | 源码隐藏链接 |
| [Ex09](exercise/Ex09-最短路证明与负环.md) | 8 | [Q1](exercise/Ex09-最短路证明与负环.md) · [Q2](exercise/Ex09-最短路证明与负环.md) · [Q3](exercise/Ex09-最短路证明与负环.md) · [Q4](exercise/Ex09-最短路证明与负环.md) · [Q5](exercise/Ex09-最短路证明与负环.md) · [Q6](exercise/Ex09-最短路证明与负环.md) · [Q7](exercise/Ex09-最短路证明与负环.md) · [Q8](exercise/Ex09-最短路证明与负环.md) | [题目 PDF](../作业/Ex09-题目.pdf) | [官方答案](../作业/Ex09-答案.pdf) | 源码隐藏链接 |
| [Ex10](exercise/Ex10-顶点覆盖与随机割.md) | 4 | [Q1](exercise/Ex10-顶点覆盖与随机割.md) · [Q2](exercise/Ex10-顶点覆盖与随机割.md) · [Q3](exercise/Ex10-顶点覆盖与随机割.md) · [Q4](exercise/Ex10-顶点覆盖与随机割.md) | [题目 PDF](../作业/Ex10-题目.pdf) | [官方答案](../作业/Ex10-答案.pdf) | 源码隐藏链接 |
| [Ex11](exercise/Ex11-TSP近似与归约.md) | 4 | [Q1](exercise/Ex11-TSP近似与归约.md) · [Q2](exercise/Ex11-TSP近似与归约.md) · [Q3](exercise/Ex11-TSP近似与归约.md) · [Q4](exercise/Ex11-TSP近似与归约.md) | [题目 PDF](../作业/Ex11-题目.pdf) | [官方答案](../作业/Ex11-答案.pdf) | 源码隐藏链接 |
| [Ex12](exercise/Ex12-集合覆盖与区间刺点.md) | 4 | [Q1](exercise/Ex12-集合覆盖与区间刺点.md) · [Q2](exercise/Ex12-集合覆盖与区间刺点.md) · [Q3](exercise/Ex12-集合覆盖与区间刺点.md) · [Q4](exercise/Ex12-集合覆盖与区间刺点.md) | [题目见官方合卷](../作业/Ex12-答案.pdf) | [官方答案](../作业/Ex12-答案.pdf) | 源码隐藏链接 |
| [Ex13](exercise/Ex13-对偶覆盖与k中心.md) | 6 | [Q1](exercise/Ex13-对偶覆盖与k中心.md) · [Q2](exercise/Ex13-对偶覆盖与k中心.md) · [Q3](exercise/Ex13-对偶覆盖与k中心.md) · [Q4](exercise/Ex13-对偶覆盖与k中心.md) · [Q5](exercise/Ex13-对偶覆盖与k中心.md) · [Q6](exercise/Ex13-对偶覆盖与k中心.md) | [题目 PDF](../作业/Ex13-题目.pdf) | [官方答案](../作业/Ex13-答案.pdf) | 源码隐藏链接 |

## Special：14 组、68 题

| List | 题数 | 直接跳到解题过程 | 原题来源 | 答案身份 | 2026-10-20 状态 |
|---|---:|---|---|---|---|
| [Sp01](exercise/Sp01-选择与加权中位数.md) | 5 | [Q1](exercise/Sp01-选择与加权中位数.md) · [Q2](exercise/Sp01-选择与加权中位数.md) · [Q3](exercise/Sp01-选择与加权中位数.md) · [Q4](exercise/Sp01-选择与加权中位数.md) · [Q5](exercise/Sp01-选择与加权中位数.md) | [题目 PDF](../作业/Sp01-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp02](exercise/Sp02-分治输出与矩阵分块.md) | 5 | [Q1](exercise/Sp02-分治输出与矩阵分块.md) · [Q2](exercise/Sp02-分治输出与矩阵分块.md) · [Q3](exercise/Sp02-分治输出与矩阵分块.md) · [Q4](exercise/Sp02-分治输出与矩阵分块.md) · [Q5](exercise/Sp02-分治输出与矩阵分块.md) | [题目 PDF](../作业/Sp02-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp03](exercise/Sp03-贪心反例与背包.md) | 4 | [Q1](exercise/Sp03-贪心反例与背包.md) · [Q2](exercise/Sp03-贪心反例与背包.md) · [Q3](exercise/Sp03-贪心反例与背包.md) · [Q4](exercise/Sp03-贪心反例与背包.md) | [题目 PDF](../作业/Sp03-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp04](exercise/Sp04-Prim演算与割性质.md) | 4 | [Q1](exercise/Sp04-Prim演算与割性质.md) · [Q2](exercise/Sp04-Prim演算与割性质.md) · [Q3](exercise/Sp04-Prim演算与割性质.md) · [Q4](exercise/Sp04-Prim演算与割性质.md) | [题目 PDF](../作业/Sp04-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp05](exercise/Sp05-Huffman完整演算.md) | 5 | [Q1](exercise/Sp05-Huffman完整演算.md) · [Q2](exercise/Sp05-Huffman完整演算.md) · [Q3](exercise/Sp05-Huffman完整演算.md) · [Q4](exercise/Sp05-Huffman完整演算.md) · [Q5](exercise/Sp05-Huffman完整演算.md) | [题目 PDF](../作业/Sp05-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp06](exercise/Sp06-DP表格与切割费用.md) | 5 | [Q1](exercise/Sp06-DP表格与切割费用.md) · [Q2](exercise/Sp06-DP表格与切割费用.md) · [Q3](exercise/Sp06-DP表格与切割费用.md) · [Q4](exercise/Sp06-DP表格与切割费用.md) · [Q5](exercise/Sp06-DP表格与切割费用.md) | [题目 PDF](../作业/Sp06-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp07](exercise/Sp07-LCS与网格最长路径.md) | 5 | [Q1](exercise/Sp07-LCS与网格最长路径.md) · [Q2](exercise/Sp07-LCS与网格最长路径.md) · [Q3](exercise/Sp07-LCS与网格最长路径.md) · [Q4](exercise/Sp07-LCS与网格最长路径.md) · [Q5](exercise/Sp07-LCS与网格最长路径.md) | [题目 PDF](../作业/Sp07-题目.pdf) | 独立推导；无官方答案 | **MT review** · 当前页面可见 |
| [Sp08](exercise/Sp08-最优与最差搜索树.md) | 5 | [Q1](exercise/Sp08-最优与最差搜索树.md) · [Q2](exercise/Sp08-最优与最差搜索树.md) · [Q3](exercise/Sp08-最优与最差搜索树.md) · [Q4](exercise/Sp08-最优与最差搜索树.md) · [Q5](exercise/Sp08-最优与最差搜索树.md) | [题目 PDF](../作业/Sp08-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |
| [Sp09](exercise/Sp09-强连通分量历史题解.md) | 5 | [Q1](exercise/Sp09-强连通分量历史题解.md) · [Q2](exercise/Sp09-强连通分量历史题解.md) · [Q3](exercise/Sp09-强连通分量历史题解.md) · [Q4](exercise/Sp09-强连通分量历史题解.md) · [Q5](exercise/Sp09-强连通分量历史题解.md) | [2025T1 教师镜像](../作业/Sp09-题目-2025T1.pdf) | 独立推导；无官方答案 | 当前链接为空；使用历史镜像 |
| [Sp10](exercise/Sp10-Dijkstra与BellmanFord演算.md) | 6 | [Q1](exercise/Sp10-Dijkstra与BellmanFord演算.md) · [Q2](exercise/Sp10-Dijkstra与BellmanFord演算.md) · [Q3](exercise/Sp10-Dijkstra与BellmanFord演算.md) · [Q4](exercise/Sp10-Dijkstra与BellmanFord演算.md) · [Q5](exercise/Sp10-Dijkstra与BellmanFord演算.md) · [Q6](exercise/Sp10-Dijkstra与BellmanFord演算.md) | [题目 PDF](../作业/Sp10-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |
| [Sp11](exercise/Sp11-Johnson与可达闭包.md) | 4 | [Q1](exercise/Sp11-Johnson与可达闭包.md) · [Q2](exercise/Sp11-Johnson与可达闭包.md) · [Q3](exercise/Sp11-Johnson与可达闭包.md) · [Q4](exercise/Sp11-Johnson与可达闭包.md) | [题目 PDF](../作业/Sp11-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |
| [Sp12](exercise/Sp12-覆盖与旅行商演算.md) | 5 | [Q1](exercise/Sp12-覆盖与旅行商演算.md) · [Q2](exercise/Sp12-覆盖与旅行商演算.md) · [Q3](exercise/Sp12-覆盖与旅行商演算.md) · [Q4](exercise/Sp12-覆盖与旅行商演算.md) · [Q5](exercise/Sp12-覆盖与旅行商演算.md) | [题目 PDF](../作业/Sp12-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |
| [Sp13](exercise/Sp13-集合覆盖贪心与困难性.md) | 5 | [Q1](exercise/Sp13-集合覆盖贪心与困难性.md) · [Q2](exercise/Sp13-集合覆盖贪心与困难性.md) · [Q3](exercise/Sp13-集合覆盖贪心与困难性.md) · [Q4](exercise/Sp13-集合覆盖贪心与困难性.md) · [Q5](exercise/Sp13-集合覆盖贪心与困难性.md) | [题目 PDF](../作业/Sp13-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |
| [Sp14](exercise/Sp14-HittingSet与最远点中心.md) | 5 | [Q1](exercise/Sp14-HittingSet与最远点中心.md) · [Q2](exercise/Sp14-HittingSet与最远点中心.md) · [Q3](exercise/Sp14-HittingSet与最远点中心.md) · [Q4](exercise/Sp14-HittingSet与最远点中心.md) · [Q5](exercise/Sp14-HittingSet与最远点中心.md) | [题目 PDF](../作业/Sp14-题目.pdf) | 独立推导；无官方答案 | 源码隐藏链接 |

## 写解题过程时怎样核对自己

算法设计题先明确状态或不变量，再写可执行步骤；正确性解释“所有合法方案都被枚举到”或“交换后不会变差”，最后按真实操作次数分析复杂度。计算题则把每轮状态、平局规则和最终结果一起写出。

- **概率题**：均匀性与期望代价分开证明；期望常数不等于最多两次。
- **贪心题**：交换掉谁、加入谁、为什么仍可行、目标怎么比较，四件事都要写。反例须核算法规则和平局。
- **DP 题**：先说状态精确代表什么；写边界、转移、顺序，再记录恢复指针。状态数乘每状态工作量才是时间界。
- **图题**：区分有向与无向、边数与点数、可达与不可达、非负边与无负环；邻接表才支持常见线性扫描界。
- **近似题**：先给最优值的下界，再把算法代价与该下界连接。一个可行解一般只给最优值的上界。

## 来源与证据

本次读取 27 组原题的全部题目内容，其中 Special 9 是标明版本的历史教师镜像；对关键公式和 8 页图形作视觉核对。13 份 Regular 官方答案均重新下载并比对版本；中文解析逐篇阅读全文核题号、要求与推理，Special 不存在官方答案可供逐字对照。

- [官网原始页面](https://www.cse.cuhk.edu.hk/~taoyf/course/3160/26-fall%20/index.html)：可见组号、隐藏属性、期中范围公告与题目链接。
- [2025T1 教师镜像课程页](https://xiao-liang.github.io/Resources/Courses/CSCI3160-25Fall/CSCI3160-25Fall.html)：Special 9 的历史来源。
- [本次来源、逐篇变更和验算报告](核验/Exercise复核-20261020.md)：具体到文件的读取范围、已执行计算、仍存在的来源限制。
- [完整逐题导航](exercise/README.md) · [课程学习入口](README.md)。

未把历史题目、隐藏链接或本解析的自取算例冒充当期已发布考题；Special 9 当前原件仍待官网恢复，Regular 12 的独立题目链接仍为空，但现行官方答案合卷已经包含全部四题。
