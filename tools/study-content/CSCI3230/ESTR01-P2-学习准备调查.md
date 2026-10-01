# CSCI3230 ESTR01 · Part 2/2 Survey

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence · 2025T1
> 本讲：ESTR01，第 2 部分 / 共 2 部分 · 原件 [L01-Introduction-2025T1-ESTR扩展.pdf](../课件/25/L01-Introduction-2025T1-ESTR扩展.pdf) p.24–29
> 定位：把调查当作学习诊断；不替用户伪造个人回答。
> 前后：上一份 [Course information](ESTR01-P1-课程与文章报告.md)

### 想获得什么与已有经历（p.24–26）

> **p.25** “What do you expect to learn from this course?”

p.24 是第二部分扉页。p.25 分开问概念、算法、数学、编程、应用、研究的预期，p.26 则问 AI/ML/深度学习/数据挖掘、线性代数、优化的接触来源。两类问题分别测动机与准备度：希望多学数学，不代表已经学过优化；做过调包项目，也不代表能推导梯度。

可用一个具体任务检查自评：给六个二维点，能否分别解释分类问题、写出 logistic 模型、求交叉熵梯度并说明测试集用途？能完成哪一步，就把哪一项标作自己的已有能力；个人经历需要用户自己填写。

### 六个术语的准备度（p.27）

> **p.27** “Positive semi-definite”; “Cross-entropy”; “Gradient descent”

本页还列 L2 norm、duality、SVD，选项从能教别人到没听过。可按下列最低判据自查，而不是只凭眼熟：

|术语|能说清楚才算理解|后续入口|
|---|---|---|
|半正定|对称矩阵 $A$ 对所有 $v$ 满足 $v^TAv\ge0$；用于判断曲率|[L03 凸性](L03-P5-凸性证明.md)|
|交叉熵|二分类为 $-y\log p-(1-y)\log(1-p)$；惩罚给真实标签很小概率|[L03 优化](L03-P3-交叉熵与梯度下降.md)|
|L2 范数|$\lVert x\rVert_2=\sqrt{\sum_jx_j^2}$；范数与平方范数要区分|[L02 收缩](L02-P3-收缩方法.md)|
|对偶|把约束与乘子纳入拉格朗日函数，从另一组变量求界或求解|[L04 对偶](L04-P6-对偶与KKT.md)|
|SVD|$X=U\Sigma V^T$ 分解描述输入、输出正交方向及缩放；这里只作准备度释义|[L02 矩阵](L02-P5-矩阵与投影.md)|
|梯度下降|$\theta_{t+1}=\theta_t-\alpha\nabla L(\theta_t)$；步长决定局部近似是否可靠|[T02](T02-P1-梯度下降.md)|

### 项目兴趣与特殊需求（p.28–29）

> **p.29** “Any special requests?”

p.28 问是否有兴趣做 AI 相关项目，p.29 给额外需求留空间。可写明可投入时间、编程环境或希望加深的数学部分。这些不是有标准答案的知识测验；本伴读只解释问题的用途，不代填调查，也不提交任何信息。

## 本讲核心考点

- Survey 属于学习诊断，C 级；不能据此宣称六个术语一定出考试题。
- 数学准备不足时从 L02 的矩阵与最小二乘开始，再接 L03 的梯度。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[L01-Introduction-2025T1-ESTR扩展.pdf](../课件/25/L01-Introduction-2025T1-ESTR扩展.pdf)，p.24–29；均为当前 PDF 页号。
- 考试证据：读了 大纲-2025T1.pdf、HW01-2025T1-题目.pdf、HW02-2025T1-题目.pdf、HW03-2025T1-题目.pdf、HW04-2025T1-题目.pdf、ESTR-Final-Exam-2023T1.pdf、ESTR-Final-Exam-2024T1.pdf、Final-Exam-CSCI3230-Record-2025T1-官方节选.pdf、Final-Exam-ESTR-Record-2025T1-官方节选.pdf、Final-Exam-Example-Question-未核.pdf；未识别用途的 PDF：无
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
