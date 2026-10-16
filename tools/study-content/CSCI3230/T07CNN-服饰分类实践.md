# CSCI3230 T07CNN · Part 1/1 CNN on FashionMNIST

> 课程：CSCI3230 (ESTR3108) Fundamentals of Artificial Intelligence
> 本讲：T07CNN，第 1 部分 / 共 1 部分 · 原件 [T07-CNN-FashionMNIST-未核.pdf](../辅导/T07-CNN-FashionMNIST-未核.pdf) p.1–15
> 定位：按打印版顺序读配套 notebook；数值来自原件保存输出，本次未训练。

原 PDF 与配套 notebook 文件名均标“未核”：本文核对了二者可见内容，但材料的学期与教师身份仍待确认，不据此推定 2026T1 作业要求。未运行训练，保存输出不等于本次实验。

配套可执行原件：[T07-CNN-FashionMNIST-未核.ipynb](../辅导/T07-CNN-FashionMNIST-未核.ipynb)。PDF 中裁掉的长代码行以 notebook 源码核对；“未核”指来源身份仍未确认，不因本次阅读自动改成官方或确定学期。

#### 配套原代码：单元 3

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report
import time

# Set random seed to make sure the experiment results can be reproduced.
torch.manual_seed(42)
np.random.seed(42)

# detect whether GPU device is available.
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f'Device available: {device}')
```

原件保存输出（非本次运行）：

```text
Device available: cuda
```

原导入包含绘图、混淆矩阵与分类报告工具，其中`classification_report`在后续没有使用。原`visualize_samples`虽接受`n_samples`，实际仍固定画2×5张；设置Torch与NumPy种子42只能约束相关随机数，不能自动保证跨设备逐位重现。网络设计原页的三个问题是：需要多少卷积块、除卷积还需什么模块、如何设置各块维度；下面沿这三个问题展开。

### 数据、类别与输入（p.1–2）

这篇重点不是抄出一个CNN，而是学会审计一次实验：模型读了哪些数据，更新了多少步，最后数字究竟能证明什么。只要会 [T06实践的形状链](T06-P3-手写数字实践.md)，就能开始读，不需先认识所有Python库。

任务是28×28灰度服饰分类，不是MNIST手写数字。十类按ID顺序为T-shirt/top、Trouser、Pullover、Dress、Coat、Sandal、Shirt、Sneaker、Bag、Ankle boot；ID只是类别编号，数字大小不表示相似度。数据声明训练60000张、测试10000张。

像素先经ToTensor变为0到1，再用均值0.5、标准差0.5变换：$x'=(x-0.5)/0.5=2x-1$。补充手算：黑0变−1、中灰0.5变0、白1变1。显示图片时反变换 $x=x'/2+0.5$，不然颜色解释会错。p.2的2×5样本图只能检查输入和类别是否对上，不能替全数据统计。

batch128表示每批最多128张。原件训练和测试都`shuffle=False`，后面又提前退出，这两个设置结合起来会影响实际覆盖数据。

自定义Dataset部分只是骨架：`os.listdir`给文件名，打开时还需与目录拼接；从文件名取出的标签字符串要映射为训练所需整数。示例骨架不等于已适配任何目录的完整数据加载器。此处只说明问题，不改原notebook。

#### 配套原代码：单元 5

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
# Define data transfromation method
# basic transformation method
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# load Fashion-MNIST
train_dataset = datasets.FashionMNIST(
    root='./data',
    train=True,
    download=True,
    transform=transform
)

test_dataset = datasets.FashionMNIST(
    root='./data',
    train=False,
    download=True,
    transform=transform
)

# build data loader
batch_size = 128
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

# Fashion-MNIST category labels
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
               'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

print(f"training set size: {len(train_dataset)}")
print(f"test set size: {len(test_dataset)}")
print(f"batch size: {batch_size}")
print(f"category numbers: {len(class_names)}")

# visualization
def visualize_samples(dataset, n_samples=10):
    fig, axes = plt.subplots(2, 5, figsize=(12, 5))
    for i, ax in enumerate(axes.flat):
        img, label = dataset[i]
        img = img.squeeze() * 0.5 + 0.5
        ax.imshow(img, cmap='gray')
        ax.set_title(f'{class_names[label]}')
        ax.axis('off')
    plt.tight_layout()
    plt.show()

print("\nVisualizations：")
visualize_samples(train_dataset)
```

原件保存输出（非本次运行）：

```text
training set size: 60000
test set size: 10000
batch size: 128
category numbers: 10

Visualizations：
```

#### 配套原代码：单元 6

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
# if you want to define your own dataset, follow:
from torch.utils.data import Dataset
import os
from PIL import Image
class yourdataset(Dataset):
  def __init__(self, data_dir, transform=None):
    self.data_dir = data_dir
    self.transform = transform
    self.datas = os.listdir(data_dir)

  def __len__(self):
    return len(self.datas)

  def __getitem__(self, idx):
    # depends on how you save your data
    img_name = self.datas[idx]
    label = img_name.split('_')[0] # suppose the data is saved as 'label_id.jpg'
    image = Image.open(img_name)

    if self.transform:
      image = self.transform(image)

    return image, label
```

### BasicCNN：形状与参数（p.3）

网络先在局部找特征，再压缩空间，最后分类。把批量轴 $B$ 单独留在最前面，它不参与每张图的展平。

|步骤|批形状|读法|
|---|---|---|
|输入|B×1×28×28|B张灰度图|
|卷积1与ReLU|B×32×28×28|32种响应图|
|池化1|B×32×14×14|空间各减半|
|卷积2与ReLU|B×64×14×14|综合32通道产生64通道|
|池化2|B×64×7×7|再减半|
|展平|B×3136|每图$64\cdot7\cdot7$个数|
|全连接1、ReLU、dropout|B×128|提炼成128维表示|
|全连接2|B×10|十类logits|

卷积均3×3、stride1、padding1，所以不缩高宽。分类头的`Linear(64*7*7,128)`是在声明“每行应有3136个特征”，若上游尺寸变了，不能只祈祷view自动解决。

参数按“每输出需要几个权重和偏置”算：Conv1为 $(9+1)32=320$；Conv2为 $(9\cdot32+1)64=18496$；FC1为 $(3136+1)128=401536$；FC2为 $(128+1)10=1290$；总421642。第一全连接占约95.2%，因此瓶颈并非必然在卷积。

dropout参数0.3在本代码表示丢弃概率，训练随机屏蔽、评价关闭。它不减少以上参数数，也不把128维永久改成约90维。最后的logits未经softmax，直接交给CrossEntropyLoss。

#### 配套原代码：单元 8

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
class BasicCNN(nn.Module):
    def __init__(self):
        super(BasicCNN, self).__init__()
        # Conv1: 1@28x28 -> 32@28x28 -> 32@14x14 (after pooling)
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.pool1 = nn.MaxPool2d(2, 2)

        # Conv2: 32@14x14 -> 64@14x14 -> 64@7x7 (after pooling)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.pool2 = nn.MaxPool2d(2, 2)

        # Fully Connected Layers
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10)

        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.pool2(F.relu(self.conv2(x)))

        x = x.view(-1, 64 * 7 * 7)

        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

def count_parameters(model):
    return sum(p.numel() for p in model.parameters() if p.requires_grad)

print("\nNetwork structure")
basic_model = BasicCNN()

print(f"\nBasicCNN parameters: {count_parameters(basic_model):,}")

print("\nbasic CNN structure：")
print(basic_model)
```

原件保存输出（非本次运行）：

```text
Network structure

BasicCNN parameters: 421,642

basic CNN structure：
BasicCNN(
  (conv1): Conv2d(1, 32, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
  (pool1): MaxPool2d(kernel_size=2, stride=2, padding=0, dilation=1, ceil_mode=False)
  (conv2): Conv2d(32, 64, kernel_size=(3, 3), stride=(1, 1), padding=(1, 1))
  (pool2): MaxPool2d(kernel_size=2, stride=2, padding=0, dilation=1, ceil_mode=False)
  (fc1): Linear(in_features=3136, out_features=128, bias=True)
  (fc2): Linear(in_features=128, out_features=10, bias=True)
  (dropout): Dropout(p=0.3, inplace=False)
)
```

### 训练循环实际上看了多少数据（p.4）

每批按“清梯度→前向→loss→反向→更新”运行。`backward()`求梯度，`step()`才更新权重；`zero_grad()`清梯度而不是清模型。这个主循环没有新算法，但有一个会改变实验含义的控制流：计数器加1，达到100就break。

因此一轮只处理 $100\cdot128=12800$ 张，而非60000。又因为不打乱，每轮读同一段前12800张。十轮总计1000个优化步、128000次样本呈现，但独立训练样本覆盖仍只有这12800张，不是128000张不同图片。

补充比喻：一本600页的书，每次读前128页就停，读十次并不等于全书读十遍。epoch字样不能代替实际数据覆盖核验。

代码注释写让使用者移除这一演示限制；本篇不替用户修改源程序，只把保存实验到底做了什么说清。若与另一“十轮完整数据”的实验比较，必须先统一优化步数或样本呈现次数，否则改善可能来自多训练而非结构。

### 评价与学习率选择（p.5）

评价用`eval()`切换层行为，用`no_grad()`不记录反向图，输出argmax为预测标签。它把各batch平均loss乘该批大小后再求总平均，避免最后小batch权重过大。准确率也用总正确数除总样本数。

Adam起始学习率0.01，ReduceLROnPlateau在监控损失多轮无改善时降低步幅，factor0.5表示乘一半，patience2是容忍坏轮数设置。学习率是在控制参数更新尺度，不是模型对某类的置信度。补充自取：0.01减半成0.005，但不意味着所有权重恰好少变化一半，因为Adam状态也参与更新。

这里监控的是 **test loss**，因此测试数据已反馈到训练策略中。虽然没有对test batch直接反传，它仍影响何时改学习率，已承担验证集角色。较严谨的设计是从训练集分出验证集，依据它调参，保留最终测试集不参与选择。

这个区别关系到数字解释：保存的测试分数反映该实验过程，但不应宣传成“完全独立测试得到的无偏最终性能”。

#### 配套原代码：单元 10

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
def train_epoch(model, train_loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    n = 0 # remove this in your code
    for inputs, labels in train_loader:
        inputs, labels = inputs.to(device), labels.to(device)

        # forward propogation
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)

        # backward propogation and update the network
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

        # remove this in your code
        n += 1
        if n == 100:
          break

    epoch_loss = running_loss / total
    epoch_acc = 100. * correct / total
    return epoch_loss, epoch_acc

def evaluate(model, test_loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for inputs, labels in test_loader:
            inputs, labels = inputs.to(device), labels.to(device)
            outputs = model(inputs)
            loss = criterion(outputs, labels)

            running_loss += loss.item() * inputs.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()

    epoch_loss = running_loss / total
    epoch_acc = 100. * correct / total
    return epoch_loss, epoch_acc

def train_model(model, train_loader, test_loader, epochs=10, lr=0.01):
    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    # optimizer scheduler, helps you automatically adjust the learning rate.
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode='min', factor=0.5, patience=2
    )

    history = {
        'train_loss': [], 'train_acc': [],
        'test_loss': [], 'test_acc': []
    }

    print(f"\nStart Training (epochs={epochs}, lr={lr})...")
    start_time = time.time()

    for epoch in range(epochs):
        # training
        train_loss, train_acc = train_epoch(
            model, train_loader, criterion, optimizer, device
        )

        # evaluation
        test_loss, test_acc = evaluate(model, test_loader, criterion, device)

        # adjust lr
        scheduler.step(test_loss)

        # record
        history['train_loss'].append(train_loss)
        history['train_acc'].append(train_acc)
        history['test_loss'].append(test_loss)
        history['test_acc'].append(test_acc)

        print(f'Epoch {epoch+1}/{epochs} - '
              f'Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}% | '
              f'Test Loss: {test_loss:.4f}, Test Acc: {test_acc:.2f}%')

    training_time = time.time() - start_time
    print(f'\nSuccess! Running Time: {training_time:.2f}s')
    print(f'Best Test Accuracy: {max(history["test_acc"]):.2f}%')

    return history
```

#### 补充：最优验证轮次需要保存当时的权重

自编三轮验证损失依次0.8、0.5、0.6。如果要交付验证损失最小的模型，应保留第二轮权重；第三轮结束时内存里的当前模型不一定还是它。只记录 `best_loss=0.5` 却没有对应参数快照，会出现日志说“最佳0.5”，实际评价的是第三轮模型的情况。

存快照还要注意独立副本：一个普通变量指向可变模型对象，后续更新可能连同所谓“最佳模型”一起变化。若保存的是权重映射，也要确认张量是否独立复制，或直接保存当时的持久化检查点。重新载入后，在相同确定性评价设置和同一数据上复算对应指标，才完成从选择到恢复的闭环。

想继续原训练轨迹，还可能需要优化器状态、调度器状态、轮次和随机状态；只为推理通常不需要这些训练状态。两种保存目的不同。验证集用来选择最佳轮次，最终保留测试集用于评价；不能反复按测试分数挑快照，再把它当作完全独立的最终评估。

### 保存的基线结果与曲线（p.6–7）

原件记录第一轮训练69.34%、测试79.38%；第十轮训练88.72%、测试85.84%；测试最高85.85%出现在第九轮。它们是保存输出，本次没有运行训练或复现时间。

为什么最初测试还高于训练？训练统计来自参数在变化时的各batch，且有dropout；测试是在该轮更新完成后、关闭dropout时做的，数据也不同。因此两条曲线不是在完全同一条件下对同一模型副本测量。测试略高不自动证明数据泄漏，仍需检查流程。

图（p.7）：左为loss，右为accuracy，蓝训练、橙测试，横轴是此notebook定义的十轮。
看什么：训练loss继续降，测试loss有反弹；训练拟合改善不必等于泛化改善。第十轮并非最佳测试轮。loss还能反映置信度，accuracy只记最大类是否正确，两者不必每一步同向变化。

代码用`max(history['test_acc'])`报告最高值，等于又用测试集选了轮次。85.85%不是“预先指定第十轮”的成绩。区分最后一轮、最佳一轮和多次运行平均，是读实验的基本习惯。

**补充 · 曲线里的最佳值不等于内存中的当前模型**（通识讲解；演示数据不属于原题）。

原训练函数每轮更新同一个模型，并把指标追加到history；最后打印历史最高准确率，不会因此自动把参数退回最高分那一轮。假设第3轮最高、之后又训练到第10轮，history中仍保留第3轮数字，但当前model通常是第10轮参数。若要使用最佳轮，需要在改善时保存独立状态，并在评价前明确恢复。

只保存一个指向可变对象的引用，也可能随之后训练一起改变；检查的是数值状态是否真正留存。复现实验时应把“报哪一轮的指标、用哪一轮的参数、怎样选择该轮”一起说明。这里仅按官方notebook控制流解释状态变化，不在本轮运行、改写或生成原训练产物。

#### 配套原代码：单元 11

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
basic_model = BasicCNN()
basic_history = train_model(basic_model, train_loader, test_loader, epochs=10)
```

原件保存输出（非本次运行）：

```text
Start Training (epochs=10, lr=0.01)...
Epoch 1/10 - Train Loss: 0.8423, Train Acc: 69.34% | Test Loss: 0.5612, Test Acc: 79.38%
Epoch 2/10 - Train Loss: 0.4990, Train Acc: 81.69% | Test Loss: 0.4455, Test Acc: 83.45%
Epoch 3/10 - Train Loss: 0.4642, Train Acc: 82.83% | Test Loss: 0.4628, Test Acc: 83.15%
Epoch 4/10 - Train Loss: 0.4269, Train Acc: 84.09% | Test Loss: 0.4441, Test Acc: 83.93%
Epoch 5/10 - Train Loss: 0.4001, Train Acc: 85.09% | Test Loss: 0.4083, Test Acc: 84.73%
Epoch 6/10 - Train Loss: 0.3779, Train Acc: 85.51% | Test Loss: 0.4328, Test Acc: 84.24%
Epoch 7/10 - Train Loss: 0.3735, Train Acc: 85.87% | Test Loss: 0.4124, Test Acc: 84.85%
Epoch 8/10 - Train Loss: 0.3583, Train Acc: 86.68% | Test Loss: 0.4413, Test Acc: 84.79%
Epoch 9/10 - Train Loss: 0.3119, Train Acc: 88.34% | Test Loss: 0.3816, Test Acc: 85.85%
Epoch 10/10 - Train Loss: 0.2946, Train Acc: 88.72% | Test Loss: 0.3981, Test Acc: 85.84%

Success! Running Time: 47.73s
Best Test Accuracy: 85.85%
```

#### 配套原代码：单元 12

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
def plot_training_history(history, title='Training History'):
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

    # Loss
    ax1.plot(history['train_loss'], label='Train Loss', marker='o')
    ax1.plot(history['test_loss'], label='Test Loss', marker='s')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Loss')
    ax1.set_title(f'{title} - Loss')
    ax1.legend()
    ax1.grid(True, alpha=0.3)

    # Accuracy
    ax2.plot(history['train_acc'], label='Train Accuracy', marker='o')
    ax2.plot(history['test_acc'], label='Test Accuracy', marker='s')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Accuracy (%)')
    ax2.set_title(f'{title} - Accuracy')
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.show()

plot_training_history(basic_history, 'Basic CNN')
```

### 混淆矩阵、卷积核与激活（p.8–9）

总准确率告诉你整体错多少，混淆矩阵告诉你错成什么。p.8纵轴True Label、横轴Predicted Label，所以先找真实类的行，再找预测类的列。

例：Coat行、Shirt列182，表示182件真coat被报成shirt；反向Shirt行、Coat列52，含义相反。矩阵不要求对称。该Coat行合计1000，所以“真coat中误报shirt”的比例为182/1000=18.2%；它不是“报shirt的所有样本中18.2%来自coat”，后者分母应是Shirt列总数。

原图完整混淆矩阵如下，列顺序与行顺序都按类别ID 0–9。每行合计1000；对角线总和8584，对应最后一轮85.84%，不是最高轮85.85%。

|真实\预测|T-shirt|Trouser|Pullover|Dress|Coat|Sandal|Shirt|Sneaker|Bag|Boot|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|T-shirt|817|1|13|26|2|4|127|0|10|0|
|Trouser|1|969|0|21|4|0|3|0|2|0|
|Pullover|20|0|723|10|111|1|133|0|2|0|
|Dress|57|26|9|825|17|0|63|0|3|0|
|Coat|1|3|52|35|726|0|182|0|1|0|
|Sandal|0|0|0|0|0|970|0|21|2|7|
|Shirt|154|1|56|23|52|0|704|0|10|0|
|Sneaker|0|0|0|0|0|23|0|957|2|18|
|Bag|5|2|0|3|3|7|15|2|962|1|
|Boot|0|0|0|0|0|15|0|53|1|931|

样本展示图的十个标签按从左到右、从上到下为Ankle boot、T-shirt/top、T-shirt/top、Dress、T-shirt/top、Pullover、Sneaker、Pullover、Sandal、Sandal，展示的是前十个样本而非每类各取一个。四组训练曲线的全部数值已随保存输出写在对应代码之后；图横轴从0到9，打印轮数从1到10，两者相差一个起始编号。

核可视化显示第一层32组3×3权重。这些是训练得到的参数，每个核各自min–max缩放到显示范围；若A核绝对值比B大，分别缩放后仍可能看起来一样亮，不能跨核直接比较强度。全常数核还要防最大减最小为0。

p.9的forward hook挂在conv1，捕获卷积输出，位置在ReLU之前，所以可能含负数。`detach()`让用于观察的结果不再连接反向图；它不修改模型权重。反复运行注册hook会积累回调，实际使用需要移除旧hook。

小检查：换一张图片，哪种图通常直接改变，核图还是激活图？

:::hint 参考答案
激活图。推理时参数固定，核图不因单纯换输入而变；激活是输入与参数共同计算的响应。
:::endhint

#### 配套原代码：单元 14

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
def get_predictions(model, data_loader, device):
    model.eval()
    all_preds = []
    all_labels = []

    with torch.no_grad():
        for inputs, labels in data_loader:
            inputs = inputs.to(device)
            outputs = model(inputs)
            _, predicted = outputs.max(1)

            all_preds.extend(predicted.cpu().numpy())
            all_labels.extend(labels.numpy())

    return np.array(all_preds), np.array(all_labels)

def plot_confusion_matrix(model, test_loader, class_names, device):
    preds, labels = get_predictions(model, test_loader, device)
    cm = confusion_matrix(labels, preds)

    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=class_names, yticklabels=class_names)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.show()

plot_confusion_matrix(basic_model, test_loader, class_names, device)
```

#### 配套原代码：单元 15

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
def visualize_conv_filters(model, layer_name='conv1'):
    if layer_name == 'conv1':
        weights = model.conv1.weight.data.cpu()
    else:
        return

    n_filters = min(32, weights.size(0))
    fig, axes = plt.subplots(4, 8, figsize=(12, 6))

    for i, ax in enumerate(axes.flat):
        if i < n_filters:
            kernel = weights[i, 0]
            kernel = (kernel - kernel.min()) / (kernel.max() - kernel.min())
            ax.imshow(kernel, cmap='gray')
            ax.set_title(f'Filter {i+1}')
        ax.axis('off')

    plt.suptitle(f'{layer_name.upper()} Filters (3x3 kernels)')
    plt.tight_layout()
    plt.show()

visualize_conv_filters(basic_model, 'conv1')

def visualize_feature_maps(model, image, label, device):
    model.eval()
    image = image.unsqueeze(0).to(device)

    activation = {}
    def get_activation(name):
        def hook(model, input, output):
            activation[name] = output.detach()
        return hook

    model.conv1.register_forward_hook(get_activation('conv1'))

    with torch.no_grad():
        _ = model(image)

    feature_maps = activation['conv1'].squeeze(0).cpu()
    n_features = min(16, feature_maps.size(0))

    fig, axes = plt.subplots(4, 5, figsize=(12, 10))

    axes[0, 0].imshow(image.squeeze().cpu() * 0.5 + 0.5, cmap='gray')
    axes[0, 0].set_title(f'Input: {class_names[label]}')
    axes[0, 0].axis('off')

    for i in range(1, 17):
        row = i // 5
        col = i % 5
        if i <= n_features:
            axes[row, col].imshow(feature_maps[i-1], cmap='viridis')
            axes[row, col].set_title(f'Feature {i}')
        axes[row, col].axis('off')

    plt.suptitle('Feature Maps from Conv1 Layer')
    plt.tight_layout()
    plt.show()

sample_img, sample_label = test_dataset[0]
visualize_feature_maps(basic_model, sample_img, sample_label, device)
```

### 特征图与更深的网络（p.10–11）

p.10左上是ankle boot，旁边16张图是不同通道响应。某些突出鞋底或轮廓，只能说这个输入在这些区域产生较强响应；不能把一个通道宣布为永远专门识别鞋底。最后空白坐标框是绘图排版剩余，不是学得空特征。

ImprovedCNN把每一组变深：通道依次1→32→32，池化后32→64→64，再池化后64→128→128。最后第三组没有再池化，故空间仍7×7，展平为6272，接256再接10。

|部分|可训练参数（含卷积/线性偏置）|
|---|---:|
|六个卷积|286432|
|六个BatchNorm2d|896|
|FC1：6272→256|1605888|
|BatchNorm1d：256|512|
|FC2：256→10|2570|
|总计|1896298|

六个卷积逐项为320、9248、18496、36928、73856、147584，合计286432。BatchNorm每通道有一个缩放和一个平移，所以六层共 $2(32+32+64+64+128+128)=896$。运行均值和方差是状态，不作为这份可训练参数计数。总数与原件1896298一致，约为基线4.5倍。

BatchNorm利用当前batch统计来归一化训练表示，评价时使用运行统计，因此`train()`/`eval()`的区别在这个模型中尤为重要。它不是把网络输出强制变成类别概率。

### 结构与学习率的保存结果（p.12–13）

原件ImprovedCNN初始学习率0.01，最高测试89.55%，最后一轮训练94.84%、测试89.07%。把起始学习率改为0.001后，最高测试90.55%，最后训练99.79%、测试90.55%。这都是原件保存记录，不是本次实测。

从99.79%与90.55%的差距可知，几乎记住所用训练子集并不等于在保留数据上全会。更低学习率可能帮助当前设置更细地优化，也可能需要更多步；单次结果不能推出0.001对所有网络最优。

同时比较Basic与Improved时，深度、通道、BatchNorm、分类头大小都变了。不能只看提升后就归因于“加深”一个因素。做可解释实验时，先保持其他条件，单独改一个因素，再做重复运行，使用验证集而非测试集选方案。

补充自查动作：把实验名、数据覆盖、初始学习率、步数、是否增强写成一行，再比较数值。这样能先排除“同名epoch其实训练量不同”的误会。

#### 配套原代码：单元 18

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
#deeper model with BN
# deeperCNN with batchnorm
class ImprovedCNN(nn.Module):
    def __init__(self):
        super(ImprovedCNN, self).__init__()

        # Conv1: 1@28x28 -> 32@28x28 -> 32@14x14
        self.conv1_1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.bn1_1 = nn.BatchNorm2d(32)
        self.conv1_2 = nn.Conv2d(32, 32, kernel_size=3, padding=1)
        self.bn1_2 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)

        # Conv2: 32@14x14 -> 64@14x14 -> 64@7x7
        self.conv2_1 = nn.Conv2d(32, 64, kernel_size=3, padding=1)
        self.bn2_1 = nn.BatchNorm2d(64)
        self.conv2_2 = nn.Conv2d(64, 64, kernel_size=3, padding=1)
        self.bn2_2 = nn.BatchNorm2d(64)
        self.pool2 = nn.MaxPool2d(2, 2)

        # Conv3: 64@7x7 -> 128@7x7
        self.conv3_1 = nn.Conv2d(64, 128, kernel_size=3, padding=1)
        self.bn3_1 = nn.BatchNorm2d(128)
        self.conv3_2 = nn.Conv2d(128, 128, kernel_size=3, padding=1)
        self.bn3_2 = nn.BatchNorm2d(128)

        # Fully Connected Layers
        self.fc1 = nn.Linear(128 * 7 * 7, 256)
        self.bn_fc = nn.BatchNorm1d(256)
        self.fc2 = nn.Linear(256, 10)

        self.dropout = nn.Dropout(0.3)

    def forward(self, x):
        x = F.relu(self.bn1_1(self.conv1_1(x)))
        x = F.relu(self.bn1_2(self.conv1_2(x)))
        x = self.pool1(x)

        x = F.relu(self.bn2_1(self.conv2_1(x)))
        x = F.relu(self.bn2_2(self.conv2_2(x)))
        x = self.pool2(x)

        x = F.relu(self.bn3_1(self.conv3_1(x)))
        x = F.relu(self.bn3_2(self.conv3_2(x)))

        x = x.view(-1, 128 * 7 * 7)

        x = F.relu(self.bn_fc(self.fc1(x)))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

improved_model = ImprovedCNN()
print(f"ImprovedCNN parameters: {count_parameters(improved_model):,}")
improved_history = train_model(improved_model, train_loader, test_loader, epochs=10)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(basic_history['test_loss'], label='Basic CNN', marker='o')
ax1.plot(improved_history['test_loss'], label='Improved CNN', marker='s')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Test Loss')
ax1.set_title('Model Comparison - Loss')
ax1.legend()
ax1.grid(True, alpha=0.3)

ax2.plot(basic_history['test_acc'], label='Basic CNN', marker='o')
ax2.plot(improved_history['test_acc'], label='Improved CNN', marker='s')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Test Accuracy (%)')
ax2.set_title('Model Comparison - Accuracy')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Basic CNN - Best: {max(basic_history['test_acc']):.2f}%")
print(f"Improved CNN - Best: {max(improved_history['test_acc']):.2f}%")
```

原件保存输出（非本次运行）：

```text
ImprovedCNN parameters: 1,896,298

Start Training (epochs=10, lr=0.01)...
Epoch 1/10 - Train Loss: 0.6067, Train Acc: 77.78% | Test Loss: 0.5908, Test Acc: 79.82%
Epoch 2/10 - Train Loss: 0.3753, Train Acc: 86.42% | Test Loss: 0.4471, Test Acc: 84.55%
Epoch 3/10 - Train Loss: 0.3014, Train Acc: 89.00% | Test Loss: 0.3839, Test Acc: 86.81%
Epoch 4/10 - Train Loss: 0.2578, Train Acc: 90.31% | Test Loss: 0.5330, Test Acc: 82.91%
Epoch 5/10 - Train Loss: 0.2361, Train Acc: 91.07% | Test Loss: 0.3740, Test Acc: 87.49%
Epoch 6/10 - Train Loss: 0.2053, Train Acc: 92.30% | Test Loss: 0.3638, Test Acc: 88.08%
Epoch 7/10 - Train Loss: 0.1842, Train Acc: 92.94% | Test Loss: 0.3323, Test Acc: 89.55%
Epoch 8/10 - Train Loss: 0.1567, Train Acc: 94.20% | Test Loss: 0.3764, Test Acc: 89.29%
Epoch 9/10 - Train Loss: 0.1496, Train Acc: 94.27% | Test Loss: 0.3757, Test Acc: 88.76%
Epoch 10/10 - Train Loss: 0.1351, Train Acc: 94.84% | Test Loss: 0.3745, Test Acc: 89.07%

Success! Running Time: 59.34s
Best Test Accuracy: 89.55%
Basic CNN - Best: 85.85%
Improved CNN - Best: 89.55%
```

#### 配套原代码：单元 19

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
#with smaller learning rate 0.001
improved_model = ImprovedCNN()
improved_history_2 = train_model(improved_model, train_loader, test_loader, epochs=10, lr=0.001)

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

ax1.plot(basic_history['test_loss'], label='Basic CNN', marker='o')
ax1.plot(improved_history['test_loss'], label='Improved CNN', marker='s')
ax1.plot(improved_history_2['test_loss'], label='Improved CNN v2', marker='s')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Test Loss')
ax1.set_title('Model Comparison - Loss')
ax1.legend()
ax1.grid(True, alpha=0.3)

ax2.plot(basic_history['test_acc'], label='Basic CNN', marker='o')
ax2.plot(improved_history['test_acc'], label='Improved CNN', marker='s')
ax2.plot(improved_history_2['test_acc'], label='Improved CNN v2', marker='s')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Test Accuracy (%)')
ax2.set_title('Model Comparison - Accuracy')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Basic CNN - Best: {max(basic_history['test_acc']):.2f}%")
print(f"Improved CNN - Best: {max(improved_history['test_acc']):.2f}%")
print(f"Improved CNN v2 - Best: {max(improved_history_2['test_acc']):.2f}%")
```

原件保存输出（非本次运行）：

```text
Start Training (epochs=10, lr=0.001)...
Epoch 1/10 - Train Loss: 0.4857, Train Acc: 83.45% | Test Loss: 0.3846, Test Acc: 86.60%
Epoch 2/10 - Train Loss: 0.2874, Train Acc: 89.77% | Test Loss: 0.3320, Test Acc: 88.25%
Epoch 3/10 - Train Loss: 0.2177, Train Acc: 92.16% | Test Loss: 0.3138, Test Acc: 88.54%
Epoch 4/10 - Train Loss: 0.1749, Train Acc: 93.50% | Test Loss: 0.3552, Test Acc: 87.87%
Epoch 5/10 - Train Loss: 0.1399, Train Acc: 94.91% | Test Loss: 0.3922, Test Acc: 87.84%
Epoch 6/10 - Train Loss: 0.1194, Train Acc: 95.63% | Test Loss: 0.4004, Test Acc: 87.29%
Epoch 7/10 - Train Loss: 0.0746, Train Acc: 97.30% | Test Loss: 0.3404, Test Acc: 89.39%
Epoch 8/10 - Train Loss: 0.0418, Train Acc: 98.79% | Test Loss: 0.3273, Test Acc: 90.25%
Epoch 9/10 - Train Loss: 0.0212, Train Acc: 99.48% | Test Loss: 0.3652, Test Acc: 89.90%
Epoch 10/10 - Train Loss: 0.0119, Train Acc: 99.79% | Test Loss: 0.3572, Test Acc: 90.55%

Success! Running Time: 59.29s
Best Test Accuracy: 90.55%
Basic CNN - Best: 85.85%
Improved CNN - Best: 89.55%
Improved CNN v2 - Best: 90.55%
```

### 数据增强及可比较范围（p.14–15）

本段使用`RandomResizedCrop(size=28, scale=(0.95,1.0))`：随机选接近整图的面积区域再缩放回28×28，后续再ToTensor和归一化。scale指采样面积比例范围，不是把宽高分别固定乘0.95；裁剪的具体长宽还受变换设置影响。

它假定轻微裁剪不改变服饰类别，让模型别只依赖固定边缘位置。裁得太狠若去掉关键特征，这个假定就可能失效。增强是改变每次看到的图，不是增加分类头参数。

本实验重新建的是BasicCNN，默认学习率0.01，最高测试86.98%；对应基线是85.85%，不是更大模型的90.55%。否则会把网络差异和增强差异混在一起。训练仍不shuffle，仍每轮100批，测试参与调度与挑最好轮的限制仍在。

p.15只有页尾，没有新实验。读完应能说清“代码声称训练几轮”和“实际看多少样本”、“保存的最好测试分数”和“独立最终测试”之间的差别。

#### 配套原代码：单元 20

以下保留原代码与原注释，注释的局限按正文解释；依单元顺序运行，下载和训练只在自行执行时发生。

```python
# Transform with Augmentation
transform_augmented = transforms.Compose([
    transforms.RandomResizedCrop(size=28, scale=(0.95, 1.0)),  # random crop and resize
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
])

train_dataset_aug = datasets.FashionMNIST(
    root='./data',
    train=True,
    download=True,
    transform=transform_augmented
)

train_loader_aug = DataLoader(
    train_dataset_aug, batch_size=batch_size, shuffle=False
)

print("\ntraining with data augmentation...")
model_with_aug = BasicCNN()
aug_history = train_model(model_with_aug, train_loader_aug, test_loader, epochs=10)

plt.figure(figsize=(10, 5))
plt.plot(basic_history['test_acc'], label='Without Augmentation', marker='o')
plt.plot(aug_history['test_acc'], label='With Augmentation', marker='s')
plt.xlabel('Epoch')
plt.ylabel('Test Accuracy (%)')
plt.title('Data Augmentation Effect')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
```

原件保存输出（非本次运行）：

```text
training with data augmentation...

Start Training (epochs=10, lr=0.01)...
Epoch 1/10 - Train Loss: 0.8606, Train Acc: 69.14% | Test Loss: 0.5064, Test Acc: 80.77%
Epoch 2/10 - Train Loss: 0.5019, Train Acc: 81.10% | Test Loss: 0.4564, Test Acc: 83.42%
Epoch 3/10 - Train Loss: 0.4533, Train Acc: 83.08% | Test Loss: 0.4284, Test Acc: 84.61%
Epoch 4/10 - Train Loss: 0.4088, Train Acc: 84.98% | Test Loss: 0.3871, Test Acc: 85.74%
Epoch 5/10 - Train Loss: 0.3826, Train Acc: 85.77% | Test Loss: 0.3903, Test Acc: 85.90%
Epoch 6/10 - Train Loss: 0.3756, Train Acc: 86.24% | Test Loss: 0.3804, Test Acc: 86.37%
Epoch 7/10 - Train Loss: 0.3548, Train Acc: 86.85% | Test Loss: 0.3918, Test Acc: 85.69%
Epoch 8/10 - Train Loss: 0.3494, Train Acc: 87.02% | Test Loss: 0.3757, Test Acc: 86.12%
Epoch 9/10 - Train Loss: 0.3392, Train Acc: 87.16% | Test Loss: 0.3652, Test Acc: 86.73%
Epoch 10/10 - Train Loss: 0.3284, Train Acc: 87.49% | Test Loss: 0.3627, Test Acc: 86.98%

Success! Running Time: 75.60s
Best Test Accuracy: 86.98%
```

## 本讲核心考点

- CNN 张量形状、参数量、训练/评价模式承接 [L07](L07-P1-卷积基础.md)，此 notebook 为 C 级辅导证据。
- 读懂每轮实际样本数、测试集是否参与选择，才能解释准确率。
- 混淆矩阵按行条件读；权重图与激活图对象不同。

## 附录

本部分没有需要另展的推导或题目演练。

## 来源与证据

- 原件：[T07-CNN-FashionMNIST-未核.pdf](../辅导/T07-CNN-FashionMNIST-未核.pdf)，p.1–15；均为当前 PDF 页号。
- 本次重写核对本篇所列讲义页码；旧版作业/试题题面如保留，属于历史练习，不代表 2026T1 考核要求。未以未公开试题推断考试内容。
- 往年卷仅证明相应年份考过；2024 卷及 2025 节选未公开的选择题不作推断。
