# CSCI3230 T02Code · Part 1/1 Gradient descent code

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：T02Code，第 1 部分 / 共 1 部分 · 原件 [T02-Gradient-Descent-Code-未核.pdf](../辅导/T02-Gradient-Descent-Code-未核.pdf) p.1–7
> 定位：逐页解释示例代码及其数值、停止条件和模型边界；未核身份保留。

先说明资料身份：这是本地文件名为“未核”的7页代码材料。本篇核对了文件里的具体代码和数据，但**没有由文件名推断发布学期或教师要求**，也没有宣称重新运行并复现随机训练结果。原件保持不动。

读代码先抓四个角色：参数是每轮变化的量；数据在训练时固定；目标把参数变成一个损失数；梯度返回与参数同形状的变化率。我们按页从一个数开始，再进入六点分类。代码检查是为了理解机制，不是让你机械复制一段程序。

### 一维更新的输出验算（p.1）

p.1 目标 $f(x)=x^2$，梯度 $2x$，学习率 `alpha = 0.4`，初值 `x = 10`，容差 `epsilon = 0.01`。此处变量 `x` 代表待优化参数，**不是机器学习数据矩阵**。原代码 `while round(abs(f(x)), 10) > epsilon` 检查的是目标值，不是参数值。

先不看输出，自己把更新式化简：

$$
x_{t+1}=x_t-0.4(2x_t)=0.2x_t.
$$

| 轮次 | 旧值 | 旧梯度 | 减去的量 | 新值 | 新目标 |
|---:|---:|---:|---:|---:|---:|
| 1 | 10 | 20 | 8 | 2 | 4 |
| 2 | 2 | 4 | 1.6 | 0.4 | 0.16 |
| 3 | 0.4 | 0.8 | 0.32 | 0.08 | 0.0064 |

第一次和第二次的新目标仍大于0.01，要继续；第三次0.0064已不超过容差，就停下。最后这个0.08是达到容差的近似解；函数精确最小点是0，不能因为程序打印“Optimal”就把近似值说成精确值。

**已核对的输出笔误**：p.1 最后打印的 `Optimal solution = 0.008` 与该页三轮表及目标 `0.0064` 不一致。应为0.08，因为 $0.08^2=0.0064$，而 $0.008^2=0.000064$。p.2 的封装示例也打印0.08，提供另一个内部核对。这个纠错只写进笔记，不改原PDF。

`round(..., 10)` 把数值舍入到10位小数，可能在靠近阈值时影响比较，因此手算讲义时先保持精度，最后展示才舍入。`x_last` 在此页虽保存旧值，循环判据却没有用它；不要因为定义了“旧值”就误以为当前算法在比较两次参数距离。

p.1原代码的可读转写如下，保留舍入、未使用的旧值和打印行为；输出笔误已在上文单独说明。无需依赖PDF截图读取缩进：

```python
import numpy as np
f = lambda x: x ** 2
```

上面只需导入NumPy，完整循环为：

```python
df = lambda x: 2 * x
epsilon = 0.01
alpha = 0.4
x = 10
x_last = np.inf * np.ones_like(x)
print('Initialize: x =', x)
print('')
iters = 0
while round(abs(f(x)), 10) > epsilon:
    x_last = x
    x = round(x - alpha * df(x), 10)
    iters += 1
    print('==> Iter %s, x=%s, f(x)=%s' %
          (iters, x, round(f(x), 10)))
print('------------- The model is converged -------------')
print('\nOptimal solution = ', x)
print('Minimum f(x) = x^2 = ', f(x))
```

`lambda`定义匿名函数，`**`是幂，`%s`将循环计数和数值填进输出；这些显示语句不参与更新。

### 抽象成函数与迭代上限（p.2–3）

p.2 的 `grad_descent` 把同一个循环抽成函数：`obj_fn` 计算损失，`grad_fn` 计算梯度，`alpha` 控制步幅，`is_converge` 判断是否停止，`init_x` 提供初始位置，`max_iters` 提供上限。原件真实参数名是 `max_iters`；核对调用时，应按这个名字查找定义。

把函数当成一个装置理解：它不懂“平方”或“分类”，只会反复调用你交给它的目标与梯度。因此换一个目标时，梯度必须一起换，停止判据也要重新考虑，不能只换函数名。

p.2 传入的停止函数虽然接收 `last, curr` 两个参数，却只使用 `abs(curr) <= epsilon`，因此仍是检查当前目标离0多近。它适用此例的原因是已知最优目标为0；若某目标最小值本来就是5，这个条件永远无法满足。接口接收了某个变量，不代表函数真的利用它。

p.3 将学习率改为1，参数10与−10来回跳，目标恒100，直到100步上限返回。返回一个数不表示优化成功。使用返回值时要同时看终止理由：满足容差，还是耗尽步数？

**补充·初始化的工程限制**：代码用无穷大参数构造 `x_last`，希望第一次比较一定开始。然而一般目标未必能接受无穷大，矩阵计算可能产生 `NaN`。更清楚的设计是先算初始损失，再做一次合法更新后比较两个有限损失。这是阅读代码的稳健性提示，不声称原件采用了该实现。

还要注意上限检查在更新后：若刚好最后一轮达到容差，原函数可能先打印达到上限而返回。停止标签与实际状态需要分开核对，不能仅看一句日志。

p.2–3共用的封装函数完整流程如下；仅整理缩进，不更改原停止逻辑：

```python
def grad_descent(obj_fn, grad_fn, alpha, is_converge,
                 init_x, max_iters=100):
    x = init_x
    x_last = np.inf * np.ones_like(init_x)
    iters = 0
    while not is_converge(obj_fn(x_last), obj_fn(x)):
        x_last = x
        x = x - alpha * grad_fn(x)
        iters += 1
        if iters >= max_iters:
            print('Not converged in %s steps' % iters)
            return x
    print('Converged in %s steps' % iters)
    print('Optimal solution = ', x)
    print('Minimum f(x) = x^2 = ', obj_fn(x))
    return x

if __name__ == '__main__':
    f = lambda x: x ** 2
    df = lambda x: 2 * x
    epsilon = 0.01
    alpha = 0.4
    x0 = 10
    converge_criterion = lambda last, curr: abs(curr) <= epsilon
    grad_descent(f, df, alpha, converge_criterion, x0)
```

`if __name__ == '__main__'`使脚本直接执行时才运行示例。p.3只把`alpha`改1，其余流程相同；按上文递推100步后仍为10，日志“Not converged in 100 steps”是上限停止。

### 六点分类与形状（p.4–5）

p.4 给两个特征列表和六个标签，用 `np.stack(..., axis=1)` 把同一索引的两个特征拼成一行。表中数据来自原件，不是自取算例。

| i | x1 | x2 | y |
|---|---:|---:|---:|
| 1 | 0.959 | 0.382 | 0 |
| 2 | 0.750 | 0.306 | 0 |
| 3 | 0.395 | 0.760 | 0 |
| 4 | 0.823 | 0.764 | 1 |
| 5 | 0.761 | 0.874 | 1 |
| 6 | 0.844 | 0.435 | 1 |

`data_X` 是 $6\times2$：6条样本、2个特征；`gt_Y[:, np.newaxis]` 把原先长度6的数组变成 $6\times1$ 列向量。为什么要认真看形状？稍后概率也是 $6\times1$，两者相减才能得到“一条样本对应一个残差”。如果标签误留成形状 `(6,)`，与 `(6,1)` 相减可能广播成 `(6,6)`，程序不一定报错，却把样本互相错配。

p.5 先按真实标签画散点：布尔掩码选择0类和1类行，再取两特征当横纵坐标。此时颜色表示人工标签，不代表模型预测正确与否；因为模型尚未训练。坐标轴的输入特征单位原件未给，不把它们擅自称为厘米或概率。

这里没有常数1列，也没有另加偏置，所以模型只有两个权重。分数为 $z=\theta_1x_1+\theta_2x_2$，零分数边界必须经过原点。**增加训练轮数无法改变这个结构限制**；若要截距需明确改变模型，而不是以为算法会自动补上。

p.4–5原数据准备和画图步骤可直接从下列转写学习：

```python
import matplotlib.pyplot as plt
raw_x1 = [0.959, 0.750, 0.395, 0.823, 0.761, 0.844]
raw_x2 = [0.382, 0.306, 0.760, 0.764, 0.874, 0.435]
raw_labels = [0, 0, 0, 1, 1, 1]
data_X = np.stack([raw_x1, raw_x2], axis=1)
gt_Y = np.array(raw_labels, dtype=np.float32)
gt_Y = gt_Y[:, np.newaxis]
print('data_X', data_X)
print('gt_Y', gt_Y)
neg_labels_idx = gt_Y[:, 0] == 0
plt.scatter(data_X[neg_labels_idx, 0], data_X[neg_labels_idx, 1])
pos_labels_idx = gt_Y[:, 0] == 1
plt.scatter(data_X[pos_labels_idx, 0], data_X[pos_labels_idx, 1])
for i, txt in enumerate(gt_Y[:, 0]):
    plt.annotate(txt, data_X[i, 0:2], fontsize=17)
plt.xlabel('$x_1$')
plt.ylabel('$x_2$')
plt.show()
```

`[:,0]`选第一列；布尔掩码按行选样本；`enumerate`同时给行号和标签；`annotate`在对应二维坐标写标签。输出数组就是上表六行，不会因画图改变训练数据。

### 概率、交叉熵与梯度（p.6）

按数据流读三个函数。`X @ Theta` 是矩阵乘法，形状 $(6\times2)(2\times1)=6\times1$，得到六个分数；sigmoid逐元素变成六个正类概率；交叉熵逐行与标签比较，最后 `np.sum` 得到一个总损失。

$$
q_i=\sigma(x_i^T\theta),\qquad
L=-\sum_{i=1}^{6}\left[y_i\ln q_i+(1-y_i)\ln(1-q_i)\right].
$$

$x_i$ 是第 $i$ 行转成的特征列向量，$\theta$ 是两个权重，$q_i$ 是一个概率。代码使用总和，不是平均。对未裁剪的sigmoid损失，梯度是

$$
\nabla_\theta L=X^T(q-y).
$$

形状 $(2\times6)(6\times1)=2\times1$，与权重一致。原代码不是直接写这一矩阵式，而是先把每行残差乘该行特征，形成 $6\times2$ 贡献表，再 `sum(axis=0)` 跨样本累加，最后转置回列。这两种写法在形状正确、损失相同的前提下等价。

**补充·用原数据做一轮人工检查，初值为教学自取**：取两个权重都为0，六个分数都是0，概率都为0.5，残差前三条为0.5、后三条为−0.5。第一特征在前三条和为2.104，后三条和为2.428，故第一梯度 $0.5(2.104)-0.5(2.428)=-0.162$。第二特征两组和为1.448与2.073，故第二梯度为−0.3125。若取学习率0.01，一步得到权重 $(0.00162,0.003125)^T$。这是可手算验证接口的补充初值，**不是原件随机训练的输出**。

下面两点必须与理想公式分开：

1. **裁剪不是数学上透明的操作。** 原件 `P` 将sigmoid输出裁到0.001和0.999之间，避免对0取对数。它的 `d_ce_loss` 也使用这个裁剪后的 `P` 来构造残差。裁剪未触发时，刚才公式成立；触发后，代码中的“裁剪残差乘特征”并不是该裁剪目标的严格导数。在严格超出裁剪范围的区域，裁剪值对分数局部不变，真正沿该计算图的导数会是0。不要误说原代码用了未裁剪概率；问题是**忽略了裁剪本身的导数**。
2. **阈值参数没有被使用。** `prob2category(prob_ls, threshold=0.5)` 接受阈值参数，但函数体两次比较都硬编码0.5。因此调用时改 `threshold` 不会如预期改变判类。读接口要核对函数体，而不只看名字。

**补充·稳定计算的思路**：理想交叉熵可从分数直接算成

$$
\ell(z,y)=\max(z,0)-yz+\ln(1+e^{-\lvert z\rvert}).
$$

这是同一个未裁剪目标的数值稳定写法，不是另换损失。$e^{-\lvert z\rvert}$ 不会指数爆炸，也不必先把概率舍入成0或1再取对数。此处只说明改进方向，没有修改或宣称重跑原代码。

p.6模型部分完整转写如下，**保留原裁剪与硬编码阈值**，以便逐行理解前述限制：

```python
sigmoid = lambda z: 1.0 / (1 + np.exp(-z))
P = lambda X, Theta: np.clip(sigmoid(X @ Theta), 1e-3, 1-1e-3)
ce_loss = lambda X, Theta, Y_true: np.sum(
    -Y_true * np.log(P(X, Theta))
    - (1.0-Y_true) * np.log(1-P(X, Theta)))
d_ce_loss = lambda X, Theta, Y_true: np.sum(
    (P(X, Theta)-Y_true) * X, axis=0, keepdims=True).T

def prob2category(prob_ls, threshold=0.5):
    prob_ls = prob_ls.copy()
    prob_ls[prob_ls >= 0.5] = 1
    prob_ls[prob_ls < 0.5] = 0
    return prob_ls

def logistic_regress(X, Y, learning_rate=0.01):
    Theta_0 = np.random.randn(X.shape[1], 1)
    converge_criterion3 = lambda last, curr: abs(last-curr) < 1e-5
    obj_f = lambda Theta: ce_loss(X, Theta, Y)
    d_obj_f = lambda Theta: d_ce_loss(X, Theta, Y)
    Theta_optim = grad_descent(
        obj_f, d_obj_f, learning_rate, converge_criterion3,
        Theta_0, max_iters=10000)
    return Theta_optim
```

此处沿用前面的`grad_descent`；p.6重复版本仅省略了成功时打印最优解和最小平方值的两行，循环和返回行为相同。`obj_f`与`d_obj_f`将固定X/Y封装进只接收Theta的函数；优化器因此不必知道数据有六行。`copy()`避免判类时把原概率数组就地改成0/1。

小检查：若把损失改成平均六条，但梯度仍用上面的总和，一次更新还与新损失的梯度相符吗？

:::hint 参考答案
不相符。平均损失的梯度也要除6。虽然最优点位置不因整体乘正数而改变，同一学习率的实际一步会改变，不能只改损失显示值而忘记更新定义。
:::endhint

**补充 · 用小扰动区分公式错与实现不配对**（通识讲解；演示数据不属于原题）。

检查梯度时，选一个有限参数，只改一个坐标，其余保持不动，比较中心差分与代码返回的该坐标梯度。先选不会触发概率裁剪的位置：这可以检验求和轴、特征顺序和sum/mean是否一致；再选严格落在裁剪平台内部的位置，便能观察“裁剪后的目标不变，残差式梯度却未归零”的配对问题。不要把跨过裁剪折点的差分当作光滑导数真值。

比较时也别只看绝对误差。梯度本身很小时，相对误差会变得不稳定；扰动太大有截断误差，太小又有浮点消减误差。可用几种适中的扰动尺度检查是否有稳定区间。这里提出的是独立核验流程，没有执行原材料里的随机训练，也没有把有限差分当成训练时更高效的替代。

### 停止与画出的直线（p.7）

p.6–7 的训练用随机初始化，学习率默认0.01，最多10000步；停止判据检查相邻损失差是否小于 $10^{-5}$。这与p.1的“损失离0小于0.01”不同。差值很小可能因为接近驻点，也可能因为学习率太小、裁剪平台或数值问题，所以它是停止线索，不单独证明全局最优。

训练完成后，用同一六点预测并画图。即使这些训练点都分对，也不能据此宣称新数据表现优秀，因为没有独立测试集。代码未固定随机种子，本笔记未重跑该随机训练，不提供捏造的最终权重或收敛轮数。

画边界来自 $\theta_1x_1+\theta_2x_2=0$。若 $\theta_2\ne0$，移项除以它，得 $x_2=-\theta_1x_1/\theta_2$，于是可给一串横坐标画纵坐标。这个除法有条件：$\theta_2=0,\theta_1\ne0$ 时边界是竖线 $x_1=0$；两权重全为0时所有点概率0.5，没有唯一分界直线。

p.7 的散点颜色基于预测标签，旁边数字注释仍是真实标签。读图要把两种信息比较，不能把注释也当作预测。图只能显示这六点及画出的范围，不证明整片特征空间预测正确。

p.7从训练到作图的完整调用：

```python
Theta_optim_1 = logistic_regress(data_X, gt_Y)
print('Theta_optim_1', Theta_optim_1)
prob_ls = P(data_X, Theta_optim_1)
pred_Y = prob2category(prob_ls)
print('pred_Y', pred_Y)
neg_labels_idx = pred_Y[:, 0] == 0
plt.scatter(data_X[neg_labels_idx, 0], data_X[neg_labels_idx, 1])
pos_labels_idx = pred_Y[:, 0] == 1
plt.scatter(data_X[pos_labels_idx, 0], data_X[pos_labels_idx, 1])
for i, txt in enumerate(gt_Y[:, 0]):
    plt.annotate(txt, data_X[i, 0:2], fontsize=17)
range_x1 = np.linspace(0.4, 1, 100)
lin_eq = lambda x1: -Theta_optim_1[0] * x1 / Theta_optim_1[1]
plt.plot(range_x1, lin_eq(range_x1))
plt.xlabel('$x_1$')
plt.ylabel('$x_2$')
plt.show()
```

`linspace(0.4,1,100)`只选择画线的100个横坐标，不是再产生100条训练数据。上面代码按课件解释而未执行随机训练；原件的输出图不能作为这台机器上的复现记录。

## 本讲核心考点

- 先用一元手算核对输出，再区分容差停止与迭代上限（p.1–3，C级通识）。
- 样本行、特征列、标签列与权重列必须形状一致（p.4–6，C级通识）。
- 原代码无截距、裁剪导数不匹配、阈值硬编码，都是理解示例的限制，不是考试承诺。
- 训练图、真实标签与测试表现不可混为一谈（p.5、7，C级通识）。

## 附录

一个不依赖随机最终结果的检查顺序：先核对第1条数据确实是 `(0.959, 0.382)`；再把权重临时在纸上设为0，六个概率应均为0.5；损失应为 $6\ln2$；残差和特征相乘的结果应为上文的两分量梯度；最后检查返回梯度是列而非意外广播矩阵。以上是手工推导的预期检查方法，不宣称本轮执行了原代码。

## 来源与证据

逐页核对 [T02-Gradient-Descent-Code-未核.pdf](../辅导/T02-Gradient-Descent-Code-未核.pdf) p.1–7，原件“未核”身份保留。已指出p.1近似解打印笔误、p.6裁剪与梯度配对限制、硬编码阈值，以及模型无截距；原PDF与任何正式作答未改。考试证据：本篇没有新增试卷证据，不由未核代码文件推断学期安排。
