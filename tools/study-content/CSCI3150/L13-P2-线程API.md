# CSCI3150 L13 Part II：pthread 创建、返回与互斥锁

<a id="csci3150-l13-线程api"></a>
<a id="逐页伴读"></a>
<a id="p3940create传入的是入口与一个指针"></a>
<a id="p4143join接收返回指针所以多一层指针"></a>
<a id="p4445返回局部地址与把整数塞进指针"></a>
<a id="p4648锁先初始化错误处理不能删掉动作"></a>
<a id="p4951尝试超时与编译"></a>

> 课程：CSCI3150 · 2026T1
> 单元：L13 Part II；原件 [L13-线程与线程API-2026T1.pptx](../课件/L13-线程与线程API-2026T1.pptx)，对应 [PDF](../课件/L13-线程与线程API-2026T1.pdf) p.38–51。
> 定位：沿原代码解释参数、返回值、对象生命周期及锁；将省略代码和不可移植写法明确分开。
> 导航：[上一部分：线程与竞争](L13-P1-线程与竞争.md) → 本篇；后续课题为锁与条件变量。

## 分节页（p.38）

p.38 开始 Thread API。Part I 用执行轨迹说明了问题，现在通过 pthread 接口真正创建线程、取得结果，并让临界区使用同一把互斥锁。

## 创建线程的四个参数（p.39–40）【延伸 L13 p.39–40（2022未核版）】

**题面块｜L13 p.39 · Thread Creation（原接口）**

```c
int pthread_create(pthread_t *thread,
                   const pthread_attr_t *attr,
                   void *(*start_routine)(void *),
                   void *arg);
```

p.39 四个参数的方向并不相同。第一个是输出位置，库把新线程标识写到调用者的 `pthread_t` 对象中，所以传 `&p`；第二个指向属性，`NULL` 表示用默认属性；第三个是入口函数地址，函数接收一个 `void *` 并返回一个 `void *`；第四个指针值作为唯一参数交给入口函数。`pthread_create` 自己返回的 `int` 是创建操作的状态码，0表示成功，不是新线程的计算结果。

`void *(*start_routine)(void *)` 可以从名称向外读：`start_routine` 是指针，指向一个“参数为 `void *`，返回 `void *`”的函数。传 `mythread` 是指定未来执行的函数；写成 `mythread(&args)` 则是当前线程立刻调用它并把结果拿去当参数，含义完全不同。

**题面块｜L13 p.40 · Creating a Thread（原例关键行）**

```c
args.a = 10;
args.b = 20;
rc = pthread_create(&p, NULL, mythread, &args);
```

p.40 把两个整数放入 `myarg_t`，再把结构体地址作为一个参数传入。worker 将 `arg` 解释为 `myarg_t *`，通过 `m->a` 与 `m->b` 读取10、20。指针转换不复制结构体；两线程仍访问同一个对象。main 必须先初始化再创建，并确保 worker 完成读取前 `args` 仍然存在、没有无同步的修改。原例末尾的 `...` 省略了后续等待，不能直接删掉省略号就当作完整程序。

**补充核验**：成功创建后，不能保证 main 一定先继续，worker也可能先获得执行机会；从main返回会终止进程中的其他线程。因此需要明确等待和生命周期安排。[Linux man-pages：pthread_create](https://man7.org/linux/man-pages/man3/pthread_create.3.html)

## join为什么接收二级指针（p.41–43）【延伸 L13 p.41–44（2022未核版）】

**题面块｜L13 p.41 · Wait for a thread to complete**

```c
int pthread_join(pthread_t thread, void **value_ptr);
```

p.41 第一个参数直接给要等待的线程标识，不是它的地址。第二个参数用于把 worker 返回的指针写入调用者的变量：如果调用者有 `void *result`，就传 `&result`，其类型为 `void **`。只关心完成、不关心结果时传 `NULL`。join 自己的返回值仍是状态码；`result` 才是线程交出来的结果指针。

可以对照：`int rc = pthread_join(p, &result)` 中，`rc` 回答“等待是否成功”，`result` 回答“线程返回了什么”。若目标早已结束，join可直接返回；否则等待它结束。一个线程标识不是允许反复join或由多个线程随意同时join的结果容器。[Linux man-pages：pthread_join](https://man7.org/linux/man-pages/man3/pthread_join.3.html)

p.42 的 worker先读取参数10、20，然后 `malloc(sizeof(myret_t))` 分配结果结构体，把 `x=1`、`y=2`，最后返回指向它的指针。返回的是堆对象地址，不是整个结构体按值复制；线程结束后，堆对象不会像局部自动变量一样随函数返回立即结束生命周期。

p.43 的 main 保存返回指针，再打印 `returned 1 2`。完整时间关系是：main初始化参数 → 创建线程 → worker读取并构造结果 → worker返回 → join成功取得结果 → main解引用。原例没有释放结果，实际使用后应 `free`；这是补充的资源清理，不是join自动完成的操作。为避免通过强转的二级指针写入不同指针类型，附录用 `void *raw` 接收，再赋给 `myret_t *`。

**算一遍（按原例）**：输入结构体是10和20，worker输出打印这一对；返回结构体却是程序另行赋的1和2，所以main显示1和2。接口没有自动把输入相加，也没有自动将结果设为11和21；必须照实际赋值追踪。

## 返回局部地址为何在join后仍然错误（p.44–45）

**题面块｜L13 p.44 · Dangerous code（原例关键部分）**

```c
myret_t r; // ALLOCATED ON STACK: BAD!
r.x = 1;
r.y = 2;
return (void *) &r;
```

p.44 的 `r` 是worker函数内的自动对象。函数返回后，它的生命周期结束；返回的地址没有让该对象搬到堆，也没有延长寿命。main等到线程结束才用这个地址，恰恰已经晚了。join保证线程完成，不能把一个失效的局部对象重新变有效。相反，p.40传入main的栈对象在main仍停在join内时还活着，两种方向的生命周期不同。

**补充（语言规则）**：对象生命周期结束后不能继续以旧指针访问它；即便内存暂时还保留1、2，也不说明行为合法。可用worker分配的堆结果、调用者提供且活得足够久的输出对象等方式安排所有权。[C11 N1570 §6.2.4](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)

**题面块｜L13 p.45 · Simpler Argument Passing（原例关键行）**

```c
int m = (int) arg;
return (void *) (arg + 1);
/* main: */
pthread_create(&p, NULL, mythread, (void *) 100);
pthread_join(p, (void **) &m);
```

p.45 想演示“只传一个数100，返回加一结果101”，但原写法不能当作可移植C模板。这里同时存在三个问题：把整数当指针、再把指针转回int依赖实现；`arg` 是 `void *`，标准C不定义它的这种加一算术；`m` 是int对象，却让join按存放指针的方式向 `&m` 写入，类型和存储大小都不匹配。在常见64位指针、32位int环境下还可能覆盖相邻存储。

**补充（安全改写）**：只传一个数也可用真实对象地址：main定义 `int input=100`，传 `&input`；worker用 `*(int *)arg` 取数，分配一个 `int` 结果并写101；main用 `void *raw` 接收，转为 `int *` 读取后free。输入活到worker结束，结果活到main释放，整个过程中不把100伪装为地址。附录的结构体版本展示同一生命周期方法。不要为了少一行结构体声明而取消类型与寿命检查。

## 锁接口、初始化与错误检查（p.46–48）【延伸 L13 p.46–49（2022未核版）】

p.46 给出 `pthread_mutex_lock` 与 `pthread_mutex_unlock`，都接收同一个 `pthread_mutex_t` 对象的地址。普通互斥锁空闲时，成功lock后调用者持有锁，才进入临界区；被别人占用时，阻塞式lock等待取得锁。unlock释放它，使其他等待者有机会取得。不能在获取失败时仍照常操作共享数据，也不能认为调用了lock就自动保护所有没有遵守同一锁协议的访问。

原页明确说用法省略初始化和错误检查。声明 `pthread_mutex_t lock;` 只是留一块存储，不是创建一把有效可用的锁；下一页才补初始化。对counter的读取、加法、写回全在成功lock与unlock之间，才能排除Part I的交错。

p.47 的两种初始化是二选一：

```c
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
```

或先声明对象，再调用 `pthread_mutex_init(&lock, NULL)` 并检查返回码。前者以默认属性初始化，后者适合运行时初始化或提供属性。不要对已经初始化且正在使用的锁又做一次init；完成所有使用、没有持有者或等待者后再安排destroy。

p.48 将错误检查包装成 `Pthread_mutex_lock`：内部先调用真正的 `pthread_mutex_lock`，保存rc，再断言rc等于0。大写P是讲义自定义包装名，不能以为系统头文件天然提供它。包装的意义是集中处理失败，而不是让锁操作变成另一种同步机制。

**补充（C规则）**：定义 `NDEBUG` 时assert检查会消失，因此不能只靠它处理发布程序中必须处理的错误。尤其不要写 `assert(pthread_mutex_lock(&lock) == 0)`：关闭assert后连加锁调用都可能不执行。讲义先调用再assert的结构至少保留了调用，但关闭断言后仍需另行处理rc。[C11 N1570 §7.2](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf)

## 不等待、有限等待和编译方法（p.49–50）

p.49 的 `pthread_mutex_trylock` 立即尝试：拿到锁才可以进入临界区，普通锁正被占用则返回忙状态。它不负责排队等待到成功，调用者应明确决定失败后做什么。不能写“try失败也继续counter++”，否则同步目的就消失。

同页第二个接口写作 `pthread_mutex_timelock`，实际POSIX名称为 `pthread_mutex_timedlock`，多一个d。它允许等待，但受绝对截止时间 `abs_timeout` 限制；不是直接传“等待几秒”的相对时长。提前取得锁就成功返回，等到截止时间仍拿不到则超时。原课件名称保留为原文问题，实际代码应按目标平台头文件及文档使用正确接口；某些平台的可用接口也不同。[Oracle Solaris接口文档](https://docs.oracle.com/cd/E36784_01/html/E36874/pthread-mutex-timedlock-3c.html)也明确使用该函数名与绝对时间。

**补充（通识）**：以截止时间10:00:05为例，10:00:03开始调用，最多约等到截止时刻；它不是从调用时再等5秒。trylock/timedlock无论哪种，只要没有成功取得锁，就不拥有临界区的访问资格。

p.50 编译示例可按ASCII连字符写成：

```sh
gcc -o main main.c -Wall -pthread
```

`#include <pthread.h>` 让编译器知道函数与类型声明；`-pthread` 选择编译器相应的线程支持选项；`-o main` 指定程序输出名，`-Wall` 开启常见警告。`man -k pthread` 用于查相关手册条目，不是运行线程程序。附录提供的补充例子用本机编译器检查，但不把macOS宿主验证冒充课程Linux评分环境。

## 把接口重新连回问题（p.51）

p.51 汇总三件事：线程共享进程地址空间但各自有栈；共享更新可能有race condition；create、join、mutex分别解决启动、等待、互斥。它们职责不能互换：create不会自动复制参数对象；join不会保护循环中的更新或延长局部返回对象寿命；mutex也不会自动等待线程结束并释放返回结果。下一讲继续讨论锁和条件变量的机制。

## 本讲核心考点

- create的线程标识通过指针输出，函数本身返回状态码（p.39，C 级 通识）。
- 传入对象必须先初始化、保持存活，并安排同步访问（p.40，C 级 通识）。
- join的状态码与线程返回指针不同；二级指针用于输出指针（p.41–43，C 级 通识）。
- worker局部对象返回后失效；join不能修复悬空地址（p.44，C 级 通识）。
- p.45的整数伪装指针写法有可移植性与存储类型问题（p.45，C 级 通识）。
- 同一mutex先初始化，成功取得后访问，最后解锁（p.46–48，C 级 通识）。
- trylock立即尝试，timedlock使用截止时间；实际名称须拼对（p.49，C 级 通识）。

## 附录

### A1 创建、返回和释放的最小完整例子（补充代码）

这是沿p.40–44的10、20输入与1、2结果补齐的可编译版本；错误处理、`void *raw`接收和free是本篇添加，不冒充教师逐字代码。

```c
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct { int a, b; } Args;
typedef struct { int x, y; } Result;

static void check(int rc, const char *op) {
    if (rc != 0) {
        fprintf(stderr, "%s: %s\n", op, strerror(rc));
        exit(EXIT_FAILURE);
    }
}

static void *worker(void *arg) {
    const Args *a = arg;
    printf("input %d %d\n", a->a, a->b);
    Result *r = malloc(sizeof *r);
    if (r == NULL) return NULL;
    r->x = 1;
    r->y = 2;
    return r;
}

int main(void) {
    pthread_t thread;
    Args args = {10, 20};
    void *raw = NULL;
    check(pthread_create(&thread, NULL, worker, &args), "create");
    check(pthread_join(thread, &raw), "join");
    if (raw == NULL) {
        fputs("allocation failed\n", stderr);
        return EXIT_FAILURE;
    }
    Result *result = raw;
    printf("returned %d %d\n", result->x, result->y);
    free(result);
    return EXIT_SUCCESS;
}
```

正常路径打印 `input 10 20`，随后 `returned 1 2`。args在main的栈中活到join结束；result指向的堆对象活到free；worker内局部指针r消失不影响它指向的堆对象。这正好对照p.44：那里对象本身是局部变量，而这里局部的只是保存堆地址的指针。

### A2 两个线程共用一把锁（补充代码）

下面用每线程1000次递增对应p.10的小规模参数，补齐p.46–48省略的初始化与错误处理。这里没有volatile：互斥协议才是避免共享counter数据竞争的条件。

```c
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
static int counter;

static void check(int rc) {
    if (rc != 0) {
        fprintf(stderr, "pthread: %s\n", strerror(rc));
        exit(EXIT_FAILURE);
    }
}

static void *worker(void *unused) {
    (void)unused;
    for (int i = 0; i < 1000; ++i) {
        check(pthread_mutex_lock(&lock));
        ++counter;
        check(pthread_mutex_unlock(&lock));
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    check(pthread_create(&a, NULL, worker, NULL));
    check(pthread_create(&b, NULL, worker, NULL));
    check(pthread_join(a, NULL));
    check(pthread_join(b, NULL));
    printf("%d\n", counter);
    check(pthread_mutex_destroy(&lock));
    return counter == 2000 ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

两线程所有counter更新都在同一锁下，main在两次join成功后才读取。正常运行输出2000；证明依据是互斥覆盖完整更新与等待结束，不能只靠“连续运行几次都输出2000”来证明任意并发程序正确。

## 来源与证据

- 已读原件：[L13-线程与线程API-2026T1.pptx](../课件/L13-线程与线程API-2026T1.pptx) 全51页；本篇覆盖p.38–51，逐页核对图和代码。
- 补充核验：[Linux man-pages pthread_create](https://man7.org/linux/man-pages/man3/pthread_create.3.html)、[pthread_join](https://man7.org/linux/man-pages/man3/pthread_join.3.html)；[C11 N1570](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf) §6.2.4、§7.2；[Oracle pthread_mutex_timedlock](https://docs.oracle.com/cd/E36784_01/html/E36874/pthread-mutex-timedlock-3c.html)。补充资料不作为课程考题证据。
- 未读其他作业、试卷及个人/同学笔记；附录为补充示例，不是待提交作答。

考试证据：未读取考试、作业或大纲证据；考法如有说明，仅为通识（C 级）
