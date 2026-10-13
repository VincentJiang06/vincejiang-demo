# CSCI3150 L06 I/O Devices

> 课程：CSCI3150 Introduction to Operating Systems · 2022未核
> 本讲：L06 I/O Devices · 原件 [L06-IO设备-2022未核.pptx](../课件/L06-IO设备-2022未核.pptx) · [PDF页码副本](PDF/L06-IO设备-2022未核.pdf) p.1–26
> 定位：分清等待设备与搬运数据的开销，读懂轮询、中断、DMA时间线，并追踪一个IDE请求从入队到完成。
> 承接：#L05-07 文件读写访问路径

p.1 标题页。

## 操作系统怎样控制设备

### 从文件系统往下找设备（p.2–3）【新】

> **p.3** I/O is critical for computer systems to interact with IO systems.
>
> Issue :
>
> How should I/O be integrated into systems?
>
> What are the general mechanisms?
>
> How can we make them work efficiently?

p.2把本讲定位到Persistence中的I/O设备与存储，承接文件系统已经决定“读哪个块”之后的问题。p.3依次问设备怎样接入、通用机制是什么、怎样高效。把这三问分开，便不会把“已经能读到数据”误当成“CPU没有浪费时间”。

### 总线结构与接口边界（p.4–6）

> **p.4** CPU is attached to the main memory of the system via some kind of memory bus.
>
> Some devices are connected to the system via a general I/O bus.

> **p.5** Buses
>
> Data paths that are provided to communicate information among CPU(s), RAM, and I/O devices.
>
> I/O bus
>
> Data path that connects CPU to I/O devices.
>
> I/O device is connected to I/O bus by three hardware components: I/O ports, interfaces and device controllers.

> **p.6** Canonical Devices has two important components.
>
> Hardware interface allows the system software to control its operation.
>
> Internals which are implementation specific.

图（p.4）：典型I/O体系结构
元素：CPU与Memory接在Memory Bus；General I/O Bus连接图形设备；Peripheral I/O Bus连接多个外设；总线之间有连线。
看什么：不同设备经过不同通路与系统交换信息，不必让所有设备直接占用同一种高速内存接口。

p.5把总线定义为CPU、RAM与设备间的信息通路，设备经端口、接口、控制器接入。p.6把一个设备分成对外硬件接口与内部实现；软件只需按协议读写接口寄存器，不必了解每颗内部芯片。

图（p.6）：规范设备模型
元素：上层三个寄存器Status、Command、Data；虚线以下是微控制器、设备内存及特有硬件。
看什么：接口是双方约定，内部可以随设备实现变化。

### 状态、命令、数据与一次交互（p.7–8）

> **p.7** status register
>
> See the current status of the device
>
> command register
>
> Tell the device to perform a certain task
>
> data register
>
> Pass data to the device, or get data from the device

> **p.7** By reading and writing above three registers,
>
> the operating system can control device behavior.

> **p.8** Hardware interface of Canonical Device (Cont.)

**课件程序与接口（p.8，原页片段）**

```text
while ( STATUS == BUSY)
    ; //wait until device is not busy
write data to data register
write command to command register
    Doing so starts the device and executes the command
while ( STATUS == BUSY)
    ; //wait until device is done with your request
```

p.7的status用来观察当前状态，command指定要做什么，data搬运要写或读出的内容。p.8先等待设备不忙，再写数据与命令，最后等待该请求完成。前一次等待防止设备仍忙就塞入新请求，后一次等待防止把“已发命令”误当成“已经完成”。

```text
读取状态，忙则继续检查
向数据接口提供本次数据
向命令接口写入操作
再次检查状态，直到请求完成
```

**算一遍（补充；数字是我为演示取的，讲义没给）**：若设备依次报告busy=1、1、0，前置检查读3次才可下命令；命令后状态为1、0，再读2次完成，总计5次状态读取。即使没有新有用数据，CPU仍在执行这些检查。

## 等待与搬运是两个不同开销

### 轮询和中断的时间线（p.9–11）【新】

> **p.9** Operating system waits until the device is ready by repeatedly reading the status register.
>
> Positive aspect: Simple and it works.
>
> However, it wastes CPU time just waiting for the device.
>
> Switching to another ready process may better utilize the CPU.

> **p.10** Put the I/O request process to sleep and context switch to another.
>
> When the device is finished, wake the process waiting for the I/O by interrupt.
>
> Positive aspect is to allow CPU and the disk are properly utilized.

> **p.11** However, “interrupts is not always the best solution”
>
> If device performs very quickly, interrupt will “slow down” the system.
>
> Because context switch is expensive (switching to another process)

p.9的**轮询**（polling）让CPU反复读状态。图中任务1运行5格，设备工作5格时CPU也轮询5格，再恢复任务1运行5格。**算一遍**：按图的等宽格子，15格CPU时间中10格执行任务、5格只检查设备，有用任务比例10/15=2/3。

p.10改为提交I/O后让请求进程睡眠，CPU运行任务2；设备完成以中断通知系统，使任务1重新可运行。图中的5个P变成5个2，磁盘服务本身没有变快，却利用了原本只等待的CPU时间。

图（p.9–10）：等待区间的不同用途
元素：CPU和Disk两条时间线，p.9中等待段为P，p.10为任务2；设备均在中间5格处理任务1。
看什么：中断优化的是等待期间CPU的利用，并非消除I/O延迟。

p.11提醒中断并不总优。设备若很快，切换与中断处理成本可能超过短暂忙等成本。**补充算例（数字是我为演示取的，讲义没给）**：若等设备需1微秒而切出切回共5微秒，立刻睡眠可能不划算；若设备需1000微秒，同样5微秒开销通常更易摊薄。实际选择还要考虑是否有其他可运行工作。

### DMA把数据复制从CPU上移开（p.12–13）【新】

> **p.12** CPU wastes a lot of time to copy a large chunk of data from memory to the device.

> **p.13** Copy data in memory by knowing “where the data lives in memory, how much data to copy”
>
> When completed, DMA raises an interrupt, I/O begins on Disk.

p.12即使已经使用中断，CPU仍要逐项搬数据，图中3格C占着CPU。p.13用**DMA**（Direct Memory Access）执行搬运，CPU提供数据位置与长度后可继续其他任务；图中3格C移到DMA时间线上，CPU多运行3格任务2。

图（p.12–13）：复制开销的转移
元素：p.12 CPU上有3格C；p.13新增DMA行，3格C位于该行，随后Disk处理5格；CPU对应位置换成任务2。
看什么：DMA降低CPU逐字搬运负担，不表示数据传输不占总线或不耗时。

**算一遍**：按p.12图，CPU15格中3格搬运，12格执行任务；p.13同样15格全部可给任务执行（忽略图未画出的设置及中断开销）。课件说DMA完成后触发中断、磁盘开始I/O，这是该图的阶段模型；**补充**：具体设备可能有不同传输与完成通知时序，不应推广成所有DMA总在磁盘I/O之前结束。

**补充：一笔 I/O 的两种时间不要混算。** 延迟是请求者从发出到可用结果之间等了多久；CPU 开销是处理器为了这笔请求实际执行了多少工作。中断可以把等待时段让给其他任务，却未必缩短设备服务时间；DMA 可以减少 CPU 逐字复制，却仍会占用内存/设备传输通路。

设数据搬运需要 3 个时间单位、设备处理需要 5 个单位（沿用 p.12–13 的阶段数，不含图中省略的设置成本）。在顺序阶段模型下，请求完成至少要经历 3+5=8；用 DMA 后，这 8 不会因为 CPU 空出来就自动变成 5。受益的是 CPU 可以在那 3 个搬运单位做别的工作。若某设备能重叠搬运和处理，则需另一条时间线，不能从这张顺序图擅自扣减。

调试慢 I/O 时先看问题属于哪一类：设备本身服务慢、请求排队久、CPU 忙于轮询、CPU 忙于复制，还是完成已经到达但进程尚未被调度。针对不同原因，换中断、DMA、调度策略的效果不同。

## 访问设备与隐藏差异

### I/O指令和内存映射I/O（p.14–15）

> **p.14** How the OS communicates with the device?
>
> Solutions
>
> I/O instructions: a way for the OS to send data to specific device registers.
>
> Ex) in and out instructions on x86
>
> memory-mapped I/O
>
> Device registers available as if they were memory locations.
>
> The OS load (to read) or store (to write) to the device instead of main memory.

**课件程序与接口（p.15，原页片段）**

```text
Device interaction (Cont.)
```

> **p.15** How does the OS interact with different specific interfaces?
>
> Ex) We’d like to build a file system that worked on top of SCSI disks, IDE disks, USB keychain drivers, and so on.
>
> Solutions: Abstraction
>
> Abstraction encapsulate any specifics of device interaction.

p.14给两种访问接口：专用I/O指令，如x86的in/out；或将设备寄存器映射到地址空间，用load/store访问。**内存映射I/O**是“像访存一样访问设备”，并不是访问普通RAM，也不同于给应用程序映射文件内容。

p.15提出SCSI、IDE、USB等设备协议不同。若文件系统自己理解所有设备寄存器，新增设备就要修改文件系统；用抽象接口把“读某块”交给驱动翻译，可隔离这种变化。

### 通用块层的收益与代价（p.16–17）

> **p.16** File system specifics of which disk class it is using.
>
> Ex) It issues block read and write request to the generic block layer.

> **p.16** Specific Block Interface \[protocol-specific read/write\]

> **p.17** If there is a device having many special capabilities, these capabilities will go unused in the generic interface layer.
>
> Over 70% of OS code is found in device drivers.
>
> Any device drivers are needed because you might plug it to your system.
>
> They are primary contributor to kernel crashes, making more bugs.

图（p.16）：文件系统软件栈
元素：Application→POSIX API→File System→Generic Block Interface→Generic Block Layer→Specific Block Interface→Device Driver；用户/内核虚线位于应用与文件系统之间。
看什么：应用请求文件字节，文件系统请求块，驱动再发具体协议命令；不同层使用不同粒度。

p.17指出通用接口可能表达不了设备独有能力；抽象便于复用，却可能丢失专门优化机会。讲义“Over70%”是该材料给出的驱动代码量背景，不作为当前所有OS的实测比例。驱动与硬件交互多且复杂，错误可能波及内核，故设备支持多不自动等于可靠性高。

## 把一个IDE请求走完

### 寄存器地址与状态位（p.18–20）

> **p.19** Control Register:
>
> Address 0x3F6 = 0x80 (0000 1RE0): R=reset, E=0 means "enable interrupt”
>
> Command Block Registers:
>
> Address 0x1F0 = Data Port
>
> Address 0x1F1 = Error
>
> Address 0x1F2 = Sector Count
>
> Address 0x1F3 = LBA low byte
>
> Address 0x1F4 = LBA mid byte
>
> Address 0x1F5 = LBA hi byte
>
> Address 0x1F6 = 1B1D TOP4LBA: B=LBA, D=drive
>
> Address 0x1F7 = Command/status

> **p.20** Status Register (Address 0x1F7):
>
> 7 	6 	5 	4 	3 	2 	1 	0
>
> BUSY READY 	FAULT 	SEEK 	DRQ 	CORR 	IDDEX 	ERROR
>
> Error Register (Address 0x1F1): (check when Status ERROR==1)
>
> 7 	6 	5 	4 	3 	2 	1 	0
>
> BBK 	UNC 	MC 	IDNF 	MCR 	ABRT 	T0NF 	AMNF
>
> BBK = Bad Block
>
> UNC = Uncorrectable data error
>
> MC = Media Changed
>
> IDNF = ID mark Not Found
>
> MCR = Media Change Requested
>
> ABRT = Command aborted
>
> T0NF = Track 0 Not Found
>
> AMNF = Address Mark Not Found

p.18进入简化IDE驱动，用in/out访问控制、命令、状态和错误寄存器。p.19地址表如下。

表（p.19）：命令块寄存器

| 地址 | 作用 |
|---|---|
| 0x3F6 | 控制，涉及复位与中断使能 |
| 0x1F0 | 数据端口 |
| 0x1F1 | 错误 |
| 0x1F2 | 扇区数 |
| 0x1F3 | LBA低字节 |
| 0x1F4 | LBA中字节 |
| 0x1F5 | LBA高字节 |
| 0x1F6 | 驱动器与LBA最高4位 |
| 0x1F7 | 命令/状态 |

表（p.20）：状态与错误寄存器位，按原页从7到0

| 位 | 7 | 6 | 5 | 4 | 3 | 2 | 1 | 0 |
|---|---|---|---|---|---|---|---|---|
| 状态 | BUSY | READY | FAULT | SEEK | DRQ | CORR | IDDEX | ERROR |
| 错误 | BBK | UNC | MC | IDNF | MCR | ABRT | T0NF | AMNF |

p.20先检查状态ERROR，置位才读错误寄存器区分坏块、不可纠正数据、介质改变、标识未找到、介质改变请求、命令中止、轨道0未找到、地址标记未找到。**补充**：这些是课件的旧IDE协议示例，不是可以在任意现代设备上照写的地址配置。

表（p.19）：IDE 教学例子的寄存器地址

| 地址 | 页上名称 | 请求中的作用 |
|---|---|---|
| 0x3F6 | Control | 控制复位与中断；R 表示 reset，E=0 表示 enable interrupt |
| 0x1F0 | Data Port | 传输扇区数据 |
| 0x1F1 | Error | 状态出错时读取错误细节 |
| 0x1F2 | Sector Count | 本次扇区数 |
| 0x1F3 | LBA low byte | 块地址低 8 位 |
| 0x1F4 | LBA mid byte | 块地址中间 8 位 |
| 0x1F5 | LBA hi byte | 块地址再高 8 位 |
| 0x1F6 | 1B1D TOP4LBA | LBA 模式、设备选择和最高 4 位地址 |
| 0x1F7 | Command/status | 写命令、读状态 |

表（p.20）：从位 7 到位 0 的原页标记

| 寄存器 | bit7 | bit6 | bit5 | bit4 | bit3 | bit2 | bit1 | bit0 |
|---|---|---|---|---|---|---|---|---|
| Status | BUSY | READY | FAULT | SEEK | DRQ | CORR | IDDEX | ERROR |
| Error | BBK | UNC | MC | IDNF | MCR | ABRT | T0NF | AMNF |

错误标记依次为坏块、不可纠正的数据错误、介质已改变、未找到 ID 标记、请求改变介质、命令中止、未找到磁道 0、未找到地址标记。程序先读 Status；ERROR 置位时再读 Error。把 0x1F7 读出的数直接当“错误编号”会混淆状态位组合与错误细节。

### 等待就绪与下发请求（p.21–23）

> **p.21** Wait for drive to be ready. Read Status Register (0x1F7) until drive is not busy and READY.
>
> Write parameters to command registers. Write the sector count, logical block address (LBA) of the sectors to be accessed, and drive number (master=0x00 or slave=0x10, as IDE permits just two drives) to command registers (0x1F2-0x1F6).
>
> Start the I/O by issuing read/write to command register. Write READ—WRITE command to command register (0x1F7).
>
> Data transfer (for writes): Wait until drive status is READY and DRQ (drive request for data); write data to data port.
>
> Handle interrupts. In the simplest case, handle an interrupt for each sector transferred; more complex approaches allow batching and thus one final interrupt when the entire transfer is complete.
>
> Error handling. After each operation, read the status register. If the ERROR bit is on, read the error register for details.

**课件程序与接口（p.22，原页片段）**

```text
static int ide_wait_ready() {
    while (((int r = inb(0x1f7)) & IDE_BSY) ||
            !(r & IDE_DRDY))
    ; // loop until drive isn’t busy
}
```

**课件程序与接口（p.23，原页片段）**

```text
static void ide_start_request(struct buf *b) {
ide_wait_ready();
outb(0x3f6, 0); // generate interrupt
outb(0x1f2, 1); // how many sectors?
outb(0x1f3, b->sector & 0xff); // LBA goes here ...
outb(0x1f4, (b->sector >> 8) & 0xff); // ... and here
outb(0x1f5, (b->sector >> 16) & 0xff); // ... and here!
outb(0x1f6, 0xe0 | ((b->dev&1)<<4) | ((b->sector>>24)&0x0f));
if(b->flags & B_DIRTY){
outb(0x1f7, IDE_CMD_WRITE); // this is a WRITE
outsl(0x1f0, b->data, 512/4); // transfer data too!
} else {
outb(0x1f7, IDE_CMD_READ); // this is a READ (no data)
}
}
```

p.21的顺序是等待不忙且READY，配置扇区数/LBA/驱动器，写读或写命令，按协议传数据，处理完成中断，并检查错误。p.22的循环条件是busy为真“或”ready为假就继续，只有busy=0且ready=1才退出；把或改成且会放过不满足条件的设备。

p.23把b->sector拆成低8位、中8位、高8位和最高4位。**算一遍（补充；数字是我为演示取的，讲义没给）**：LBA=0x01234567时，各部分为0x67、0x45、0x23、0x01，分别送到对应寄存器；不是把十进制数字一位位拆开。写分支向0x1F7发WRITE，再经outsl传512/4=128个4字节单位，共512字节；读分支先发READ，数据等完成路径再取。

**逐步读 p.23 的位运算**：`& 0xff` 留下最低 8 位；右移 8 或 16 位后再取低 8 位，分别把扇区号拆给 0x1F4、0x1F5；`(sector >> 24) & 0x0f` 留下最高 4 位。`(dev & 1) << 4` 把设备选择放到 bit4。页上 `outb(0x1f2,1)` 表示传 1 个扇区，而 `outsl(...,512/4)` 以每次 4 字节的单位传 128 次，总计 512 字节；128 不是扇区数。

**本页展开的分支**：B_DIRTY 为真表示缓冲区有待写数据，发 WRITE 后向数据端口输出；否则发 READ，数据在设备就绪后的中断路径读回来。p.21 的顺序还包括写入前检查 READY/DRQ、每次操作后检查 ERROR，以及可以按扇区中断或聚合成一次完成中断。p.23 的短代码只展示主路径，不能因正文没有逐行实现这些检查就把它们从协议中删掉。

### 排队睡眠与完成中断（p.24–26）

**课件程序与接口（p.24，原页片段）**

```text
void ide_rw(struct buf *b) {
   acquire(&ide_lock);
   for (struct buf **pp = &ide_queue; *pp; pp=&(*pp)->qnext)
   ; // walk queue
   *pp = b; // add request to end
   if (ide_queue == b) // if q is empty
      ide_start_request(b); // send req to disk
   while ((b->flags & (B_VALID|B_DIRTY)) != B_VALID)
      sleep(b, &ide_lock); // wait for completion
   release(&ide_lock);
}
```

**课件程序与接口（p.25，原页片段）**

```text
void ide_intr() {
   struct buf *b;
   acquire(&ide_lock);
   if (!(b->flags & B_DIRTY) && ide_wait_ready(1) >= 0)
      insl(0x1f0, b->data, 512/4); // if READ: get data
   b->flags |= B_VALID;
   b->flags &= ˜B_DIRTY;
   wakeup(b); // wake waiting process
   if ((ide_queue = b->qnext) != 0) // start next request
      ide_start_request(ide_queue); // (if one exists)
   release(&ide_lock);
}
```

> **p.26** IO Devices
>
> IO system architecture
>
> General mechanisms
>
> Device interactions and software development
>
> Next: Virtualizing CPU – Process
>
> Chapter 4
>
> Chapter 6

p.24先取得ide_lock，把请求追加到队尾；若它就是队头，启动设备。完成条件为B_VALID置位且B_DIRTY清除，未达到就sleep并配合锁等待。**补充**：这里的sleep接口具有释放锁并进入等待的协调语义，普通“先解锁再随便睡一下”不能代替它，否则可能丢失完成通知。

p.25中断路径完成读数据（若是读请求），设置VALID、清DIRTY、唤醒等待者，再启动下一请求。课件代码片段没有完整展示b如何取队头，且ide_wait_ready的签名与p.22示意不同；本伴读解释请求生命周期，不把片段当可编译的完整驱动。

**算一遍（补充；数字是我为演示取的，讲义没给）**：队列原为A→B，A在设备上运行，B睡眠。A完成后更新A的标志并wakeup(A)，队头移动到B并启动B；唤醒A不等于让A立即占CPU，也不能在A仍是队头时再次启动它。p.26把总线、通用机制、设备接口三条线收束，并转向CPU虚拟化。

**考试角度**：（C 级 通识）常见考法是比较轮询、中断、DMA分别减少哪一种CPU开销，或按状态位推断请求能否进入下一步。

### 请求何时才算真正交还给调用者（补充，教材通识）

请求的生命周期是“准备缓冲区→入队→交设备→完成处理→调用者消费结果”。在设备仍可能访问缓冲区时，调用者不能提前释放或挪走它；仅仅发出命令没有转移“可以立刻复用这块内存”的权利。完成中断也不等于每个等待进程立即运行，驱动应先更新可检查的完成状态，再唤醒等待者。

这解释 p.24 的等待为什么检查条件而不是只数通知：通知发生时调用者可能尚未被调度，甚至多个等待者争用同一资源。醒来后仍须确认自己的请求已成功完成；错误状态也要成为可观察的终态，否则设备报错而进程仍永久等待“成功位”，就形成另一种卡死。

:::hint 自测：中断次数增加，是否必然意味着设备更快？

不必然。相同数据量拆成更多请求就可能产生更多完成通知；中断处理也会占 CPU。需要同时比较传输字节数、请求完成时间、CPU 开销和错误重试，单一计数不能确定性能改善。

:::endhint

## 本讲核心考点

- Status/Command/Data分别用于观察、发命令和传数据（p.6–8，C 级通识考法）。
- 中断改善等待期间CPU利用，快设备可能适合轮询（p.9–11，C 级通识考法）。
- DMA移走CPU逐字复制负担（p.12–13，C 级通识考法）。
- I/O指令与MMIO是两种设备寄存器访问方式（p.14，C 级通识考法）。
- 请求排队、睡眠、完成更新与唤醒必须配合（p.21–25，C 级通识考法）。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[L06-IO设备-2022未核.pptx](../课件/L06-IO设备-2022未核.pptx)；[PDF副本](PDF/L06-IO设备-2022未核.pdf) p.1–26。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
