# CSCI3150 Lab01 GCC与Makefile

> 课程：CSCI3150 Introduction to Operating Systems · 2026T1
> 本讲：Lab01 GCC与Makefile，第 2 部分 / 共 2 部分 · 原件 [Lab01-环境配置与编译-2026T1.pdf](../项目/Lab01/Lab01-环境配置与编译-2026T1.pdf) · [PDF页码副本](../项目/Lab01/Lab01-环境配置与编译-2026T1.pdf) p.15–22
> 定位：从单命令编译到依赖驱动构建，理解练习要求而保留作答。
> 前后：前接 [环境配置](Lab01-P1-环境配置.md)；课程主题回到 [阅读导航](阅读导航.md)。

## 逐页伴读

### p.15–16：源文件、对象文件、可执行文件

`gcc -o hello_world hello.c`指定输出名；省略-o通常生成a.out。多个C文件可一起编译链接，例如 `gcc main.c add.c sub.c -o calc`。-Wall开启一组常用警告，-g保留调试信息，-O0到-O3调整优化级别；警告不是运行时验证，优化也不负责修正未定义行为。

课件大小写 `Gcc`与排版长横线应校正为 `gcc`和ASCII连字符。**补充**：`gcc -c main.c`只生成对象文件main.o，没有完成最终链接；这是后续增量构建的基础。

### p.17–18：Makefile是一张依赖图

原规则结构是 `target: prerequisites`，下一行recipe前用Tab。make比较目标是否存在及依赖是否更新，决定执行命令，不能简单当成每次从上到下全部执行的shell脚本。

p.18原例hellomake.c调用 `myPrintHelloMake()`，hellofunc.c定义它，hellomake.h声明它；编译命令 `gcc -o hellomake hellomake.c hellofunc.c -I .`。两个.c都必须参与链接，否则调用方只有声明，没有函数实现。-I .把当前目录加入头文件查找路径，头文件本身不是拿来独立链接的对象。

**p.18 的三个文件完整写出。** 原图中的排版引号与换行已规范为 C 源码排版；函数名、调用关系和输出文字保持一致。

`hellomake.c`：

```c
#include "hellomake.h"
int main() {
    /* call a function in another file */
    myPrintHelloMake();
    return 0;
}
```

**思路分析（逐步读）**

1. include 读取函数声明，让编译器知道 myPrintHelloMake 如何调用。
2. main 调用该函数，实际函数体由另一源文件提供。
3. 函数返回后 main 返回 0；链接时必须把含实现的目标文件一起加入，否则会出现未定义引用。

`hellofunc.c`：

```c
#include <stdio.h>
#include <hellomake.h>
void myPrintHelloMake(void) {
    printf("Hello makefiles!\n");
    return;
}
```

**思路分析（逐步读）**

1. stdio.h 提供 printf 声明，函数定义的 void 参数列表表示不接收参数。
2. 调用 printf 输出固定文字和换行，再用 return 结束这个无返回值函数。
3. hellomake.h 是本地头文件时通常用双引号，尖括号写法需确保编译器搜索路径能找到它。

`hellomake.h`：

```c
void myPrintHelloMake(void);
```

**思路分析（逐步读）**

1. 这是函数声明，分号表示这里没有函数体。
2. 前面的 void 表示无返回值，括号中的 void 表示无参数。
3. 调用者依靠此声明进行类型检查，真正执行内容由另一个源文件中的定义提供。

执行链是 main → myPrintHelloMake → printf → 返回 main → 返回 0。头文件让调用方先知道参数和返回类型；链接器再把调用连接到另一 `.c` 中的定义。第二个文件用尖括号引入本地头文件，原命令的 `-I .` 正是使该写法能够找到头文件的条件。

### p.19–21：直接构建、隐式对象、显式对象

p.19直接规则在任一.c变化时重编整个可执行文件。p.20目标改依赖两个.o，通过make隐式规则生成对象；链接时把对象组合起来。p.21显式写出每个.o由哪个.c以-c编译，便于控制参数。

原示例的依赖列表没列头文件；若只改hellomake.h，make可能认为无需重编，这是依赖声明缺漏，不是头文件改变无效。**补充判断练习**：两个对象均依赖同一头文件时，改该.h应重建两个.o并重链接；仅改hellofunc.c则只重建hellofunc.o再链接。

clean规则删除生成物，应明确只针对对象与可执行文件；将clean声明为`.PHONY`可避免同名普通文件阻止其执行。本次没有执行清理命令。

**补充：沿一次头文件修改追依赖边。** 假设main.c与stats.c都包含stats.h，format.c不包含它。修改stats.h后，需要重新编译main.o、stats.o，因为这两个翻译单元所见声明可能变了；format.o可以保持；最终可执行文件依赖已变化的对象，所以再链接。若Makefile漏掉main.o→stats.h这条边，make看不见真实依赖，旧main.o可能继续保留过时声明。

| 变化 | 应重新编译 | 应重新链接 | 原因 |
|---|---|---|---|
| 只改stats.c实现 | stats.o | 是 | 实现内容变了 |
| 改两个文件都包含的stats.h | main.o、stats.o | 是 | 两个翻译单元输入变了 |
| 不改任何输入且目标已存在 | 无 | 通常无 | 依赖比目标更新的条件未成立 |

这是解释用依赖关系，实际以每个.c真实include为准。clean后每次都能成功，仍可能掩盖增量依赖漏项，因为它强制丢掉所有旧对象；所以干净构建与增量构建要分别看。

:::hint 自测：为什么头文件声明了函数，却仍会出现undefined reference？

声明只让编译器知道调用方式，不提供函数机器代码。需要把含定义的实现编译成对象并参加最终链接；还需检查名称和链接参数是否一致。把头文件加进include搜索路径与把实现加进链接输入，是两种不同动作。

:::endhint

**三版 Makefile 的完整内容（p.19–21，去掉截图行号）。** 命令行开头为 Tab，不能用普通空格替代。

p.19 直接构建：

```makefile
CC = gcc
CFLAGS = -Wall -g

hellomake: hellomake.c hellofunc.c
	$(CC) $(CFLAGS) -o hellomake hellomake.c hellofunc.c

clean:
	rm -f hellomake
```

**思路分析（逐步读）**

1. CC 和 CFLAGS 保存编译器与选项，目标 hellomake 依赖两个 .c 文件。
2. 任一依赖较新时，用一条 gcc 命令编译并链接生成 hellomake；配方行需要 Tab 开头。
3. make clean 执行删除目标文件的配方，通常还应声明 `.PHONY: clean`，防止同名文件影响清理。

p.20 借助对象文件与 make 隐式规则：

```makefile
CC=gcc
CFLAGS=-Wall

hellomake: hellomake.o hellofunc.o
	$(CC) $(CFLAGS) -o hellomake hellomake.o hellofunc.o
clean:
	rm -f *.o hellomake
```

**思路分析（逐步读）**

1. 目标改为依赖两个 .o 文件，最后一条 gcc 只负责链接。
2. 缺少 .o 时 make 可使用内建隐式规则从同名 .c 编译，但这依赖隐式规则启用。
3. clean 删除 .o 与可执行文件，下一次 make 会重建；头文件依赖仍需补全才能可靠增量构建。

p.21 显式声明对象构建：

```makefile
CC=gcc
CFLAGS=-Wall
hellomake: hellomake.o hellofunc.o
	$(CC) $(CFLAGS) -o hellomake hellomake.o hellofunc.o

hellomake.o: hellomake.c
	$(CC) $(CFLAGS) -c hellomake.c

hellofunc.o: hellofunc.c
	$(CC) $(CFLAGS) -c hellofunc.c

clean:
	rm -f *.o hellomake
```

**思路分析（逐步读）**

1. 先根据依赖图判断哪一个 .o 过期，对应配方用 `-c` 单独编译。
2. 再把两个目标文件链接为 hellomake，未变化的 .c 不必重复编译。
3. clean 删除构建产物；若头文件变化也应触发重建，依赖列表还需要包含相应头文件。

**连起来检查。** p.18 的 hellofunc.c 使用 `<hellomake.h>`，而这三版截图没有保留 `-I .`。若按这组文件实际练习，要给编译命令补 `-I .`，或把本地头文件改为双引号包含；这属于使示例组合一致的修正，不是原图已有的参数。`.h` 依赖缺失也是原例的教学简化；完整依赖应让两个对象都依赖 hellomake.h。

**补充：沿三个文件判断哪些目标需要重建。** hellomake.c 调用函数，hellofunc.c 定义函数，两者通过 hellomake.h 共享声明。若仅改变 hellofunc.c 的函数体，在依赖已正确声明的对象文件构建中，只需重编它对应的对象，再重新链接最终程序；另一个未变的对象可以复用。

若改变头文件中的函数声明，凡依赖该声明的源文件都必须重新编译，不能只重新链接已有对象，因为链接器不会替你重新检查旧对象当时采用的 C 类型。Makefile 如果没有把头文件列入对应依赖，就可能认为旧对象仍然新鲜。于是“make 没报错”有两种可能：最新源码真的构建成功，或错误依赖使它根本没构建该重建的对象。依赖图的意义就是让源码变化能准确传播到必须更新的目标。

### p.22：把题目要求变成依赖关系

原题给main.c，以及stats/stats.c和format/format.c；main调用两模块，stats计算数组和与最大值，format打印报告。要求补全exercise中的Makefile，生成lab1_report，仅提交Makefile。

因此要检查三个实现都参加构建、头文件变化能触发必要重编、输出名准确、从exercise执行make能找到相对路径。可以用“干净构建→无改动再make→修改一个源文件→修改一个头文件”观察依赖是否合理。这里解释判据，不写入或覆盖已完成的Makefile；原始材料仍在[Lab01](../项目/Lab01)。

## 本讲核心考点

- [C] 区分编译-c与链接，解释-o、-I、-g、-Wall。
- [C] 根据依赖与时间戳判断哪些对象需要重建。
- [C] 识别漏写头文件依赖和错误输出名。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[Lab01-环境配置与编译-2026T1.pdf](../项目/Lab01/Lab01-环境配置与编译-2026T1.pdf)；[PDF副本](../项目/Lab01/Lab01-环境配置与编译-2026T1.pdf) p.15–22。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
