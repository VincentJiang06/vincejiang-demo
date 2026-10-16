# CSCI3150 T02 Shell行为与框架

> 课程：CSCI3150 Introduction to Operating Systems · 2025T2
> 本讲：T02 Shell行为与框架 · 原件 [T02-作业1背景与代码导读-2025T2.pptx](../辅导/T02-作业1背景与代码导读-2025T2.pptx) · [PDF页码副本](PDF/T02-作业1背景与代码导读-2025T2.pdf) p.1–17
> 定位：先观察单命令与管道的进程语义，再理解历史作业框架。
> 前后：前接 [T01](T01-Linux与C基础.md)；后接 [T03](T03-系统调用与管道.md)。

## 逐页伴读

### p.1–3：Shell本身也是进程

> **p.1** Assignment 1 Background and Code Walk
>
> CSCI3150 Introduction to Operating Systems, Spring 2026

> **p.2** Assignment 1: Implementation of A Simple Shell
>
> Implement a basic shell that supports
>
> Built-in commands
>
> External commands
>
> Pipe
>
> Aim
>
> Understanding how to interact with an operating system, e.g. Linux
>
> Understanding the design choices and rationales of a shell
>
> Before you start, what you need to know
>
> The behavior of a real (bash) shell
>
> How does the starter code we provide work?
>
> How to compile and run the program?
>
> The code logic of starter code?
>
> How to verify that your program really works?

> **p.3** What is shell?
>
> A computer program that exposes an operating system's services to a human user or other programs
>
> Each shell is a process (quick demo)
>
> Use “echo \$\$” to check the process id
>
> Use “ps –ax \| grep PID” to check the process information
>
> The shell that most people talk about on Linux is bash shell
>
> Other shells, e.g. powershell, zsh, …

封面2026年1月15日。p.2要求先懂真实Shell行为、框架与验证方式；p.3的 `echo $$`显示当前Shell相关PID，用进程列表观察其子进程。Shell把用户命令转成系统服务调用，但本身并不是内核。

### p.4–6：为什么单独cd应在主Shell执行

> **p.4** Important feature of bash shell
>
> Builtin commands: cd, echo, …
>
> External commands: ls, find, sleep …
>
> Key difference
>
> Builtin commands are executed in main process of shell
>
> External commands are executed in a child process of the shell
>
> Disclaimer: for bash shell, for single command
>
> Try to think why?
>
> Hint: are the authors of “ls” and “wc” command the same?
>
> Hint: what if a command cause segmentation fault?
>
> Hint: is shell supposed to be a “manager” or a “doer”?

> **p.6** Quick demo on builtin/external commands
>
> (In terminal 1) read -p "Press enter to continue..."
>
> This executes a builtin command that waits for user input
>
> (In terminal 2) pgrep -P \[pid of your terminal 1\]
>
> This shows all the child process of the bash shell under test

课件限定单命令：内建命令在Shell主进程处理，外部命令由子进程执行。cd需要改变后续命令继承的工作目录，若只改变短命子进程，主Shell目录不变。外部程序另起进程则隔离执行失败并允许管理等待。

p.5用help列内建命令；p.6在一个终端执行read等待输入，另一个用pgrep观察子进程，是把“阻塞”与“是否新建进程”分开验证。

### p.7–9：外部程序与管道

> **p.7** Quick demo on builtin/external commands
>
> (In terminal 1) sleep infinity
>
> This executes a builtin command that waits for user input
>
> (In terminal 2) pgrep -P \[pid of your terminal 1\]
>
> This shows all the child process of the bash shell under test

> **p.8** Binaries of external commands
>
> External commands are executed in a child process with their own pre-built binaries
>
> Where are these binaries? (quick demo)
>
> In “/bin”, “/usr/bin”, etc., they have binaries for different purposes
>
> One take-away here: your own binary can also be a command
>
> How does bash shell invoke these binaries? (next tutorial)

**课件程序与接口（p.9，原页片段）**

```text
Pipe
Shell has the following meta characters
\ / < > ! $ % ^ & * | { } [ ] " ' ` ~ ;
Pipe(|) is a feature that Linux shell provides to redirect command output to another command
Use “man 7 pipe” in your shell to check details
Some special notes (quick demo)
Space before and after pipe
In bash shells, space before and after pipe does not affect semantics (we do not require this in asg1, you only need to make sure space before&after pipe are supported)
Several pipes
Builtin commands with pipes: builtin commands will be executed in child process in this case (this behavior is required in asg1)
How does bash shell implement this feature? (next tutorial)
```

p.7执行 `sleep infinity`并观察子进程；页面沿用了“builtin等待用户输入”文字，属于错误说明：这里的sleep是外部程序且等待时间，并非read。p.8说明二进制位于PATH可搜索目录，你编译的程序也可被执行。

p.9管道将前一命令标准输出接到后一命令标准输入。真实Bash可不在竖线两侧留空格，但历史作业仅要求有空格的形式；不能由作业简化反推完整Shell语法。多级管道每一段都有自己的执行环境，内建命令处在管道中也须重新考虑所在进程。

### p.10–12：管道中的cd不改变父Shell

> **p.10** Putting things together: builtin/external commands + pipe
>
> Single command
>
> Builtin commands in the main process
>
> External commands in child processes
>
> Multiple commands linked by pipes
>
> All commands linked by pipes are executed in a child process

> **p.10** What happens for “cd .. \| ls”?  Try to think why?

> **p.11** How to compile and run
>
> Use “make” command to compile
>
> You can search by yourself how to write and use a Makefile
>
> Use “./SimpleShell” to run your compiled program

> **p.11** Note:  The source code we provided is incomplete
>
> You can successfully compile with the sources we provide, but the program only supports one command “exit”
>
> Your task is to add other commands to the incomplete framework, or implement in your own framework

> **p.12** DO NOT modify any file other than
>
> src/simple-execute.c
>
> declaration\_en.doc
>
> DO NOT implement your shell by adding new files.

原问题 `cd .. | ls`：在该课件规定的各段子进程模型中，左侧cd只改变它自己的目录，右侧ls从父Shell继承目录，不会因为左侧cd而去父目录；父Shell目录也不变。管道传字节，不传“改变另一个进程工作目录”的动作。

p.11框架make后能运行但仅支持exit；可编译不等于功能完成。p.12图限定历史提交可改src/simple-execute.c与声明文件，不新建实现文件；这是该作业的约束，不是所有课程源码的通则。

**补充：用工作目录状态表解释cd管道。** 假设父Shell当前目录为 `/work/sub`，且相应目录存在，这是自取演示路径。执行独立的 `cd ..` 时，主Shell调用chdir，自己的目录成为 `/work`，下一条子命令从它继承新的目录。若执行 `cd .. | ls`，课件模型先从父Shell创建两个子进程，双方初始仍在 `/work/sub`。

| 进程 | 初始目录 | 本段操作后目录 | 对其他进程的影响 |
|---|---|---|---|
| 父Shell | /work/sub | /work/sub | 继续解释后续输入 |
| 左段cd | /work/sub | /work | 只改变自己 |
| 右段ls | /work/sub | /work/sub | 列出自己继承的目录 |

即使让左段先执行完，右段目录也不会随之改变；这不是“调度太快导致没生效”，而是各自保存目录状态。管道传递的是stdout字节，cd通常不输出目录变更命令供右侧解释。

:::hint 自测：修复时在管道两个fork之间sleep一秒，能否让ls看到cd改变后的目录？

不能。时间等待没有改变对象归属。若chdir发生在左孩子，父Shell的目录不变，从父Shell创建的右孩子仍继承原目录。应先明确题目要求哪一个进程的状态改变，不能用延时掩盖模型错误。

:::endhint

### p.13–14：argc的约定要按本框架读取

**课件程序与接口（p.13，原页片段）**

```text
simple-execute.c
int shell_execute(char ** args, int argc);
Arguments
Args: pointer to the pointer array of parsed command
Argc: number of parsed items
For example, input “ls –l” and enter
Args = {“ls”, “-l”}
Argc = 3
Return value
0 for next loop(normal execution)
-1 for break loop(error or exit)
```

**课件程序与接口（p.13，原页片段）**

```text
/*  shell_execute - Function to execute the command with specified command content and command arguments.
*   @args   String array with command and its arguments.
*   @argc   Total number of strings including the command, its arguments and the NULL in the end
*/
int shell_execute(char ** args, int argc){

    int child_pid, wait_return, status;

    /* Execute built-in commands */
    /* exit */
    if(strcmp(args[0], "exit") == 0 ){
        return -1;
    }
    /* TODO: cd */

    /* Non-built-in commands. These commands should be executed in a child process so the parent process can continue to invoke other commands */
    /* One command without pipe */
    if((child_pid = fork()) < 0){
        printf("fork() error \n");
    }
    else if(child_pid == 0 ){
        /* TODO: execute the command and check if the command is correctly executed */
    }

    /* TODOs: arbitrary number of pipes */

    /* wait for child process to terminate */
    while((wait_return = wait(&status)) > 0);
    return 0;
}
```

> **p.14** Hint: use necessary system calls to implement these functionalities

原例输入 `ls -l`，参数数组实际应为 `{"ls","-l",NULL}`，框架把末尾NULL也计入而给argc=3。它不同于常见main的argc=2语义，遍历时不能混用。shell_execute返回0进入下一轮，-1退出循环；系统调用失败的处理与Shell退出策略也要分清。

执行职责分别是单内建在主进程、单外部在子进程、管道各段在各子进程。下一次Tutorial说明fork、exec、dup、pipe怎样支撑这些职责，本篇不替用户填作业TODO。

**补充：三个“返回”分别返回到哪里。** `shell_execute` 返回 0 或 −1，是本框架向自己的输入循环报告是否继续；fork 的返回值，是当前执行者判断自己是父亲、孩子还是创建失败；外部命令的退出状态，是孩子结束后由等待接口带回的信息。这三者所属的函数、调用者和含义都不同。

例如外部命令报错结束，并不自动等于用户要求退出 Shell。Shell 可以收取它的失败状态后继续接受下一行。只有按框架约定返回给主循环的控制值，才决定是否退出那个循环。追踪时每遇一个 return，先写它所属函数，再写控制流将回到哪个调用点；不要看到 −1 就一律画成整个终端关闭。

### p.15–17：把真实Shell当行为参考，仍需限定条件

> **p.15** Leveraging auto-grading
>
> Five test cases are provided for your reference
>
> Refer to autograding report to check test cases
>
> We will use another set of test cases for final grading

> **p.16** Is autograding always correct?
>
> How do we obtain the groundtruth?
>
> Using a real bash shell to execute the command
>
> So autograding are theoretically 100% correct
>
> You can also compare the output of a real bash shell with your program to validate
>
> Your program
>
> Our autograding system
>
> If you find any mistake without modifying any protected file/path (anything except for src/simple-execute.c), please open a discussion in piazza

提供的五个自动测试只覆盖部分情况，最终测试另有集合。p.16说用Bash产生ground truth，但“理论100%正确”不能当成对测试代码与环境的保证；工作目录、文件内容、Shell版本、排序和题目简化都可能影响比较。至少分别看stdout、stderr、退出状态和是否挂起，而不只看终端文字相似。p.17为Q&A。

## 本讲核心考点

- [C] 解释cd与外部命令为什么有不同进程职责。
- [C] 推演cd .. | ls中三个工作目录的关系。
- [C] 读清框架argc包含NULL的特殊约定。
- [C] 用相同环境和明确观测项设计行为比较。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[T02-作业1背景与代码导读-2025T2.pptx](../辅导/T02-作业1背景与代码导读-2025T2.pptx)；[PDF副本](PDF/T02-作业1背景与代码导读-2025T2.pdf) p.1–17。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
