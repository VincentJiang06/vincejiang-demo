# CSCI3150 PA3 · MLFQ 实现详解

> 原题：[PA03-题目-2026T1.pdf](../项目/PA03/PA03-题目-2026T1.pdf)，PDF p.1–6；2026-11-01 从当前 Blackboard 课程 PA3 获取。
> 用途：解释已完成的调度器、事件顺序和验证结果；这是 Programming Assignment 3，不是 progress assignment。
> 提交：只交 `scheduler-impl.c`；截止 2026-11-19 23:59（UTC+8）。本次未上传或提交 Blackboard。
> 工作文件：[scheduler-impl.c](课程工作目录/CSCI3150-Lab1/PA03/scheduler-impl.c)；便于提交的副本：[scheduler-impl.c](课程工作目录/Downloads/CSCI3150-PA3/scheduler-impl.c)。
> 关联：[PA3、HW3 与最终 Project 的联系](PA03-与最终项目的联系.md)。

## 1. 这道题究竟要写什么

**题面**（PA03-题目-2026T1.pdf · 第 1 题 · p.1）

> **p.1** Implement the MLFQ (Multi-Level Feedback Queue) scheduler in Chapter 8 (Book: Operating Systems: Three Easy Pieces) by following the rules below:

**题面规则**（同一原题 · p.1–2；空白归一）

> **p.1** Rule 1: If Priority(A) > Priority(B), A runs (B doesn’t).
>
> Rule 2: If Priority(A) = Priority(B), A & B run in round-robin fashion using the time slice (quantum length) of the given queue.
>
> Rule 3: When a job enters the system, it is placed at the highest priority (the topmost queue). For the jobs arriving at the same time, schedule the job with smallest pid first.
>
> Rule 4: Once a job uses up its time allotment at a given level (regardless of how many times it has given up the CPU), its priority is reduced (i.e., it moves down one queue and will be at the tail of the target queue, which means it will be scheduled last).
>
> Rule 5: After some time period S, move all the jobs in the system to the topmost queue, and sort all the jobs by pid. The job with the smallest pid will be scheduled first.

> **p.1** a. Simultaneous events: At the same time t, apply events in this order: (1) the process whose time slice just ended finishes, or is re-enqueued/demoted; (2) newly arriving processes join the tail of the topmost queue in increasing pid order; (3) a priority boost is performed, if due; and (4) the next process is chosen.
>
> b. Arrivals do not interrupt a time slice: If a new process arrives while another process is running (even one in a lower queue), the running process continues until its time slice ends or it finishes. Only a priority boost interrupts a running process.
>
> c. Queue order: A process that uses a full time slice without exhausting its allotment returns to the tail of its current queue. If its allotment is exhausted, it joins the tail of the next lower queue. In a tie with a new arrival, the old process is re-enqueued first.
>
> d. Allotment accounting: CPU time used at a level accumulates across time slices and is not reset when the process leaves the CPU. A time slice is never shortened to fit the remaining allotment: the process runs its full time slice and is demoted after the time slice in which its usage reaches the allotment.
>
> e. Priority boost: Boosts happen at times S, 2S, 3S, . . . (measured from time 0). A boost immediately interrupts the running process, so its time slot ends at the boost time. All unfinished processes, including those arriving exactly at the boost time, move to the topmost queue in increasing pid order, and their allotment and time slice restart from the values of the topmost queue.
>
> f. Lowest queue: A process in the lowest queue (Q1) cannot be demoted further. When it uses up its allotment there, it stays in Q1, joins its tail, and continues round-robin with Q1’s time slice.

> **p.2** g. Idle CPU: If no process is ready, the CPU stays idle until the next arrival. Nothing is written to output.log for idle time.
>
> h. Workload model: Processes never block or yield the CPU voluntarily. A running process stops only when its time slice ends, it finishes, or a priority boost occurs.

**题面提交要求**（同一原题 · p.3）

> **p.3** In this Programming Assignment, you need to revise function
>
> void scheduler(Process* proc, LinkedQueue** ProcessQueue, int proc_num, int queue_num, int period);
>
> to implement the MLFQ (Multi-Level Feedback Queue) scheduler.
>
> You only need to submit scheduler-impl.c that can be compiled with the same “Makefile”.

程序是一个**离散时间模拟器**：输入给出每个进程何时到达、需要运行多久，以及各队列的时间片和 allotment；程序计算每个运行区间，写入 `output.log`。它没有启动这些 PID 对应的真实操作系统进程，也不修改 Linux 内核的调度策略。数值 PID 是模拟任务的标识。

教师已经提供读取、排序、输出函数和 Makefile。主程序先把 `proc` 按 arrival time、PID 升序排好，再调用你的 `scheduler()`。因此实现应保留函数签名，并调用已有 `outprint()`，不另写 main、不更改输入文件格式。

输出必须是：

```text
Time_slot:x-y, pid:x1, arrival-time:x2, remaining_time:x3
```

每个时间片结束、进程提前完成或 boost 截断都结束一行。即使前后两行属于同一 PID，也不能合并；空闲不写行。`arrival-time` 始终是最初的到达时刻，`remaining_time` 是本行执行结束后剩余的总工作量。

## 2. 实现保留了什么、增加了什么

工作目录 `课程工作目录/CSCI3150-Lab1/PA03` 使用现有课程容器的 `/work/PA03` 挂载。原始包和官方测试分别保存在 [项目/PA03](../项目/PA03/PA03-原始代码-2026T1.zip)。教师原包内只有 `scheduler-impl.c` 被修改；其余 10 个文件在验收时均与 ZIP 原始字节相同，包括 Makefile、头文件、读取代码和默认输入。

提交文件增加了三个私有辅助函数：`append_job()` 入队、`take_job()` 出队、`compare_pid()` 比较 PID。辅助函数和全部实现都在同一个 C 文件中，无新头文件、外部库或额外链接要求。

`ProcessQueue` 的数组下标与题目一致：下标 0 是 Q1，下标 `queue_num-1` 是最高队列。实现从这些对象读取 `time_slice`、`allotment_time`。就绪顺序用私有的索引链表保存，没有调用教师链表的动态入队/出队函数；这样每个任务只有一份状态，反复轮转时不需要不断分配节点。

| 状态 | 含义 | 何时改变 |
|---|---|---|
| `jobs[i].pid` | 进程身份 | 初始化后不变 |
| `arrival` | 原始到达时间 | 初始化后不变 |
| `remaining` | 全部工作还剩多久 | 每次运行减去区间长度 |
| `used` | 当前优先级已累计使用的 CPU 时间 | 每次运行增加；降级或 boost 清零 |
| `next` | 同队列的下一个进程下标 | 入队、出队、boost 时更新 |
| `ready[q].head/tail` | 队首与队尾下标 | 入队、出队时更新；-1 表示空队列 |
| `arriving` | 尚未入队的第一个进程下标 | 按已排序的到达顺序向后推进 |
| `now` | 模拟时钟 | 运行结束或空闲跳到下一次到达 |
| `pid_order` | 全部任务按 PID 升序排列的指针数组 | 开始时排序一次；每次 boost 按此顺序筛选 |

`used` 用 `long long` 保存累计量；PID 比较用大小关系，不用两个 PID 相减，避免大数相减溢出。输入输出接口本身使用 `int` 时刻，若时间超出该接口可表示范围，会向 stderr 报错并停止，不能把超范围日志伪装成正常结果。

## 3. 一轮循环如何决定输出

先把已经到达但未入队的任务放入最高队列。从最高到最低找第一个非空队列，取其队首。没有任何可运行任务时，把时钟直接移到下一次到达；不输出 idle 行。期间空系统的 boost 没有任务可重排，可以跳过。若到达恰逢 boost，所有新任务本就按 PID 升序进入最高队列、计数为零，与 boost 结果相同。

选择运行长度时，只取以下三个数的最小值：本队列 time slice、进程 remaining、距离下一个 boost 的时间。**不把“剩余 allotment”放进最小值。**

例如，本级 time slice=10、allotment=15。一个进程用完第一片后 used=10，第二片仍然可以跑完整 10；第二片结束时 used=20≥15，才降级。把第二片缩成 5 会改变整条时间线。实际 `nondivisible` 测试使用了这种配置，并通过独立模拟对照。

区间确定后：`remaining -= duration`，`used += duration`，调用教师 `outprint()` 写出一行。这里只使用整数时间，没有用真实睡眠等待，也没有实际消耗相应毫秒数。

## 4. 为什么到达事件分成两个循环

“到达不抢占”不等于“到达可以晚入队”。在当前区间内部到达的任务，应在自己的到达时刻排队，因此必须在本区间旧进程重新入队**之前**排入最高队列；到达时刻**等于**区间终点的任务，则按规则排在旧进程处理之后。

实现的顺序是：

1. 把 arrival < end 的新任务加入最高队列。
2. 旧进程完成就退出；否则根据累计 used 决定降级或原级回队尾。
3. 把 arrival = end 的新任务加入最高队列。
4. end 是 boost 时刻则清空队列，按 PID 升序重新排好全部已到达、未完成任务，used 清零。
5. 下一轮从最高非空队列选择。

下面是**自编并实际运行的边界测试，非教师原题**：PID 9 在 0 到达、执行 25；PID 1 在 10 到达、执行 8；Q2 时间片 10、allotment 30；Q1 时间片 40、allotment 80；boost=300。

| 区间 | PID | 剩余 | 为什么 |
|---|---:|---:|---|
|0–10|9|15|最初只有 9|
|10–20|9|5|10 时旧进程 9 先回队尾，随后新进程 1 入队；顺序为 9、1|
|20–28|1|0|20 时 9 回到 1 后面，1 只需再运行 8|
|28–33|9|0|9 只剩 5，提前完成|

如果把 PID 1 的到达改成 9，9–10 期间它已经在队列中等待，时刻 10 的顺序变成 1、9。对应的两个测试均已通过。

## 5. boost 为什么既能打断，又不丢进程

boost 的时间从 0 开始计算，不是“从第一次任务到达后过 S”。当前 now 到下一个 boost 的距离为 `period - now % period`。若距离比当前 time slice 更小，运行区间就在 boost 时刻提前结束。

重建队列时，筛选条件是“arrival≤now 且 remaining>0”。前一个条件排除未来任务，后一个条件排除刚刚完成的任务。把筛选出的任务按 PID 升序放回最高队列，清零 used；下一次派发重新得到最高队列完整的时间片。

同一段 boost 时间线上，即使旧进程刚用满 allotment、先被降级，随后也会被统一提回最高队列。该先后顺序不会漏掉旧进程，也不会把同刻新到达的任务遗漏在排序外。

**自编并实际运行的例子**：PID 4、9 在 0 到达，执行时间分别为 28、65；PID 1 在 20 到达、执行 30；最高队列 time slice=10、allotment=30；S=20。最初先运行 4，再运行 9；时刻 20 先处理 9 的时间片结束，再把 1 入队，最后 boost，顺序为 **1、4、9**。所以 20–30 必须运行 1。测试还覆盖了 58–60 这种被 boost 提前截断的区间。

## 6. 与书面 HW3 的直接对照

书面 HW3 的六进程数据不属于 PA3 默认输入，只是本次额外用来辨别规则的测试。完整对照见[关系说明](PA03-与最终项目的联系.md)。

把 HW3 数据放入 PA3 规则后，400 前相同；400 的 boost 顺序变成 **57、143、233、333、444**，不是书面题的逆序。接着运行：

| 区间 | PID | 剩余 |
|---|---:|---:|
|400–410|57|5|
|410–420|143|0|
|420–430|233|45|
|430–440|333|0|
|440–450|444|58|
|450–455|57|0|
|455–465|233|35|
|465–475|366|70|

440 时先完成 333，新到达的 366 加在队尾：**444、57、233、366**。这就是为什么 PA3 的输出不能直接与之前那份 HW3 答案比较。HW3 PDF 不应为迁就 PA3 而改动。

## 7. 验证做到了哪里

2026-11-01 实际环境：已有课程容器 `f8d059630b56`；Ubuntu 20.04.6、GCC 9.4.0、GNU Make 4.2.1、aarch64。PA3 PDF 未明确规定评分 CPU 架构。本次没有将 ARM64 称为 x86_64，也没有声称与未披露的隐藏评分环境完全等同。

| 检查 | 结果 |
|---|---|
|教师原 Makefile 编译|成功；未修改 Makefile|
|提交文件 C11 严格警告|`-Wall -Wextra -Wpedantic -Werror` 通过|
|官方 testcase1–5|5/5；分别 8、13、66、63、21 行，共 171 行，逐行一致|
|定向边界测试|16/16，与独立逐毫秒模拟一致|
|固定种子随机测试|250/250，种子 31502026；1–15 个进程、1–6 个队列，并包含非整数倍 allotment|
|内存与未定义行为检查|16 组定向测试通过 AddressSanitizer、UndefinedBehaviorSanitizer、泄漏检查|
|单文件交付范围|所有实现、类型和 helper 都在 scheduler-impl.c 内；其余教师原文件未改|

内存检查使用独立、会释放自身资源的测试驱动，只链接提交文件，以区分本实现与教师读取/链表代码的资源管理。这不是替换评分驱动：官方 5 组及 266 组扩展测试另外使用未改的教师 main 和 Makefile 构建的程序运行。

[测试汇总](核验/PA03-验证结果.json)保留结果；完整可复现脚本在 [verify_pa03.py](课程工作目录/CSCI3150-Lab1/PA03/verify_pa03.py)，用 Mac 的 `python3` 运行，脚本通过现有 Docker 容器执行 C 程序。容器内未安装 Python；不要求为作业安装新依赖。

这些检查覆盖了公开要求与多类边界，不能把公开测试通过解释成已运行教师隐藏测试。

2026-11-01 再次复核：精简解释性注释，去除注释与空白后代码 token 不变；从最终提交副本重新替换一份全新教师原包，只替换 scheduler-impl.c 即可编译。5 组官方、266 组对照测试重跑通过，另有 7 组直接手写预期轨迹的边界用例通过。

## 8. 你如何运行和提交

容器内：

```sh
cd /work/PA03
make
./Scheduler
cat output.log
```

这里的 `process.file`、`queue.cfg` 来自教师默认包；运行会正常重写工作目录的 `output.log`。扩展测试在 `checks/` 下各自运行，保留官方测试原始答案。

在 Blackboard 的 **PA3** 页面上传 [scheduler-impl.c](课程工作目录/Downloads/CSCI3150-PA3/scheduler-impl.c)，不是 Assign3，也不是 Project。不需要交 PDF、可执行文件、Makefile、测试脚本或整个工作目录。原题只要求单个 `.c` 文件，不要求压缩。

## 来源与证据

- [PA3 原题](../项目/PA03/PA03-题目-2026T1.pdf)：p.1–6 全文文本读取；p.1、p.3 视觉核对关键规则和交付要求。
- [官方源码 ZIP](../项目/PA03/PA03-原始代码-2026T1.zip)：已检查 scheduler-impl.c、scheduler-exec.c、queue.c/h、linkedlist.c/h、Makefile；5 组官方测试均实际运行。
- [Project 规格](../项目/Project/Project-题目-2026T1.pdf)、[FAQ](../项目/Project/Project-FAQ-2026T1.pdf)：用于区分最终项目；没有在本次实现最终 Project。
- Blackboard PA3 与 Project 页面于 2026-11-01 实际读取；截止时间和附件身份据此核对。
- 考试证据：读了 PA03-题目-2026T1.pdf、Project-题目-2026T1.pdf、Project-FAQ-2026T1.pdf；未识别用途的 PDF：无

### 提交版风格精简（2026-11-01）

对照 HW1 已完成代码，本次仅删除逐队列的非法配置检查，简化不必要的 size_t 转换与 boost 剩余时间类型。保留内存分配失败处理、int 时间溢出保护及两条关键规则注释。队列配置按题目的合法输入处理；不改变调度规则。最终测试与文件哈希以 `核验/PA03-验证结果.json` 为准。
