# CSCI3150 T01 Linux与C基础

> 课程：CSCI3150 Introduction to Operating Systems · 2025T2
> 本讲：T01 Linux与C基础 · 原件 [T01-Linux-Git-GCC与C基础-2025T2.pptx](../辅导/T01-Linux-Git-GCC与C基础-2025T2.pptx) · [PDF页码副本](PDF/T01-Linux-Git-GCC与C基础-2025T2.pdf) p.1–16
> 定位：历史Spring 2026 Tutorial入门，环境要求以当期Lab01优先。
> 前后：后接 [T02 Shell行为](T02-Shell行为与框架.md)；当期实验先读 [Lab01](Lab01-P1-环境配置.md)。

## 逐页伴读

### p.1–3：先认清这是哪一期

> **p.1** Basic reviews: Linux, git, gcc, and C programming
>
> CSCI3150 Introduction to Operating Systems, Spring 2026

> **p.3** Platforms we use
>
> Piazza
>
> Question asking, discussion, announcements
>
> Note
>
> NO EMAIL due to large class size
>
> Asking TAs to code/debug for you
>
> Coding/thinking before asking
>
> Github & Github classroom
>
> Course website, course materials
>
> Assignments submission, autograding
>
> Blackboard
>
> Releasing grades

封面是2026年1月8日Spring课程，文件名按学年归2025T2。p.2图列Hong Xu及当期助教、上课与答疑安排；p.3以Piazza讨论、GitHub/Classroom交作业、Blackboard看成绩。它们帮助理解该历史资料来源，不替代2026T1的教师与平台安排。

### p.4–6：Shell作业是系统接口的练习

> **p.4** Assignment 1: Implementation of A Simple Shell
>
> Understanding how to interact with an operating system, e.g. Linux
>
> Implement a basic shell that supports
>
> Built-in commands
>
> External commands
>
> Pipe
>
> Understanding the design choices and rationales of a shell
>
> Deadline
>
> Jan. 26, 2026, 11:59 p.m.

> **p.6** Concepts: what & why
>
> What is Linux?
>
> A family of Unix-like operating systems
>
> A lot of “distributions”(“versions”, “flavors”)
>
> Ubuntu, Fedora, …
>
> Why Linux?
>
> Open-source
>
> Community support

原作业实现内建命令、外部命令和管道，截止2026年1月26日；这个截止时间已属旧学期。Linux是Unix-like系统家族，Ubuntu、Fedora是发行版；系统调用概念与某个桌面外观无关。p.5路线是Linux、Git、C复习。

### p.7–9：同一份代码可以在不同环境执行

> **p.8** Remotely accessing Linux: CSE servers (quick demo)
>
> Find a ssh client: putty, xshell, …
>
> Input command “ssh YourUnixName@gw.cse.cuhk.edu.hk” and enter your password
>
> Wait for prompt, then input “ssh linux\[code\]”, “\[code\]” could be 1~16
>
> You can use “uname –a”, “lsb\_release -a” and “gcc --version” to check for kernel version, ubuntu version and gcc version of the server.

> **p.9** Locally accessing Linux: Docker container
>
> Install Docker desktop
>
> Search for and install ubuntu image
>
> In powershell, use the following command to start your docker container using host network
>
> docker run -it --name ubuntu --net=host ubuntu:latest
>
> Install dependencies and clone your repo to start working
>
> For more tips on docker, please refer to docker official website

本地WSL、容器、VM与远程服务器都是接入Linux的方式。p.8先SSH到网关再到linux节点，截图展示的是两段会话；`uname -a`看内核，`lsb_release -a`看发行版，`gcc --version`看编译器，三者不能互相替代。

p.9的历史Docker示例用ubuntu:latest与host网络；不能拿它覆盖当期Lab01明确的Ubuntu20.04/GCC9.4.0和既有工作区。此处仅解释容器概念，不执行旧安装命令。

### p.10–12：版本控制与C三类能力

> **p.10** Concepts
>
> What is Git & Github?
>
> A version control tool
>
> An online source code hosting service that uses git
>
> Why using Git & Github & Github classroom for this course?
>
> Git & Github basics
>
> Automated CI/CD for instant feedback
>
> Version control of assignment code

> **p.11** Github classroom: https://classroom.github.com/a/YnSDVcuC

> **p.12** Github classroom for C programming examples:
>
> https://classroom.github.com/a/VWWPDShp

Git是版本控制工具，GitHub是托管服务，Classroom与CI是作业分发和自动反馈流程。提交成功只说明代码进入历史，不说明测试全面通过。

p.11–12列结构体、动态内存、文件I/O，给出两个不同Classroom邀请链接；这不是两份在幻灯片内展开的代码题，不能凭标题假装已读代码。对应能力是：结构体组织字段；malloc对象须匹配有效期与释放；文件I/O须检查返回值和实际传输长度。详解参见[L03](L03-系统调用-内存.md)、[L04](L04-系统调用-文件与目录.md)。

**补充：把编辑、编译、运行的位置逐一对齐。** 远程登录后，终端里的工作目录属于远程系统；宿主编辑器打开的文件却可能仍是另一份本地副本。先确认当前目录，再确认源文件是预期内容，最后确认编译生成的可执行文件就在将运行的位置。容器中的挂载目录可把宿主文件呈现出来，但容器可写层里另存的一份副本未必随宿主项目保留。

错误信息也有层次：找不到源文件先查路径；编译器语法错误先看首个报错及前一行；undefined reference主要发生在链接阶段，要查是否漏了目标文件或库；程序启动后才段错误，则要查运行期内存访问。看到失败就重装Linux，会把不同层的问题混成一类。

Git也分层：修改文件只改工作树；add选入暂存区；commit建立本地版本；push才把指定提交传到远端。一次commit不能证明远端CI已运行，一次CI通过也只证明那份提交在测试覆盖范围内通过。比对结果时记清实际提交，而不是只记“刚才我保存了”。

:::hint 自测：gcc --version正确，是否已经证明作业会在评分环境成功？

没有。还要检查源代码版本、构建参数、运行操作系统与架构、依赖和输入条件。编译器版本匹配只是一个条件；本课历史Tutorial版本尤其不能自动替代当期Lab说明。

:::endhint

**补充：一次“能复现”的修改应当能回到同一个输入。** 只保存源码还不能解释两次结果为什么不同：工作目录决定相对路径指向哪份输入，编译参数决定实际构建什么，运行参数决定程序走哪条路径。学习记录应把这三者和源码版本一起对齐。这样失败时才能只改一个因素，并判断结果变化来自哪里。

不要用终端最后留着的输出证明刚改的代码已经运行。若本次编译失败，目录里的旧可执行文件可能仍然存在；接着运行它，会看到一个完全真实但属于旧版本的结果。应先确认构建成功，再执行确定路径下的产物。版本管理保存的是过程中的明确状态，不能替代对构建结果与运行目标的检查。

### p.13–14：从工具准备进入Shell行为

p.13预告下一次会观察Shell并走读框架，意味着先分清用户看到的行为再选系统调用。p.14是Q&A页。

### p.15–16：旧虚拟机排障当作方法示范

> **p.15** Locally access Linux: VirtualBox as an example
>
> Download VirtualBox: https://www.virtualbox.org/wiki/Downloads
>
> Download a ubuntu 18.04 image: Ubuntu 18.04.6 LTS (Bionic Beaver)
>
> Check this guide for setting up your Linux VM: https://ubuntu.com/tutorials/how-to-run-ubuntu-desktop-on-a-virtual-machine-using-virtualbox
>
> Note: adjust the amount of resources you allocate to the VM according to the capacity of your PC to avoid host starvation

> **p.16** Problems you may encounter with VirtualBox and Ubuntu
>
> Cannot copy from host and paste in VM, VM window is too small, …
>
> Require add-on support to be manually installed(a lot of tutorials online)
>
> Cannot open terminal by clicking or keyboard shortcut(ctrl+alt+t)
>
> Use another terminal tool(i.e. xterm) and input “gnome-terminal”
>
> Check and search the error message online(stackoverflow, google, …)
>
> Account not in sudoers file
>
> Input “su -” to switch to root
>
> Other questions can be searched with google(most questions relating linux set up can actually be found on the Internet) or asked on piazza

历史补充建议Ubuntu18.04与VirtualBox，并提示复制粘贴、窗口大小、终端启动、sudo权限等问题。可迁移的方法是先收集实际错误信息、核对资源与权限；版本号和具体修复不能无核对地用于当期环境。当前课程已有[环境约定](../环境/Docker-开发约定.md)，保留并复用其匹配配置。

## 本讲核心考点

- [C] 区分Linux发行版、内核、编译器与运行位置。
- [C] 说明Git提交与自动测试各证明什么。
- [C] 按当期要求判断历史环境教程哪些可复用。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[T01-Linux-Git-GCC与C基础-2025T2.pptx](../辅导/T01-Linux-Git-GCC与C基础-2025T2.pptx)；[PDF副本](PDF/T01-Linux-Git-GCC与C基础-2025T2.pdf) p.1–16。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
