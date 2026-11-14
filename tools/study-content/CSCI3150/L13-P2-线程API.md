# CSCI3150 L13 线程API

> 课程：CSCI3150 Introduction to Operating Systems · 2022未核
> 本讲：L13 线程API，第 2 部分 / 共 2 部分 · 原件 [L13-线程与线程API-2022未核.pptx](../旧版课件/L13-线程与线程API-2022未核.pptx) · [PDF页码副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51
> 定位：正确创建、等待线程，并使参数、返回值和锁的生命周期覆盖实际使用。
> 前后：前接 [线程与竞争](L13-P1-线程与竞争.md)；后接 [L14 锁](L14-P1-锁的实现.md)。

2026T1 新版已另写：[阅读当期伴读](L13-P2-线程API-2026T1.md)。本页保留2022未核版本的原讲解和页码。

## 逐页伴读

p.38是Part II标题。

### p.39–40：create传入的是入口与一个指针

> **p.39** How to create and control threads?
>
> thread: Used to interact with this thread.
>
> attr: Used to specify any attributes this thread might have.
>
> Stack size, Scheduling priority, …
>
> start\_routine: the function this thread start running in.
>
> arg: the argument to be passed to the function (start routine)
>
> a void pointer allows us to pass in any type of argument.

**课件程序与接口（p.39，原页片段）**

```text
#include <pthread.h>

int
pthread_create(      pthread_t*      thread,
               const pthread_attr_t* attr,
                     void*           (*start_routine)(void*),
                     void*           arg);
```

**思路分析（逐步读）**

1. thread 是输出参数，传句柄变量的地址；attr 指向属性，NULL 表示使用默认属性。
2. `void *(*start_routine)(void *)` 是函数指针：新线程执行它，接收一个 void 指针，返回一个 void 指针。
3. arg 原样传给入口函数；create 返回 0 表示成功，非零是错误编号，不能按 fork 的返回规则理解。

**课件程序与接口（p.40，原页片段）**

```text
#include <pthread.h>

typedef struct __myarg_t {
    int a;
    int b;
} myarg_t;

void *mythread(void *arg) {
    myarg_t *m = (myarg_t *) arg;
    printf(“%d %d\n”, m->a, m->b);
    return NULL;
}

int main(int argc, char *argv[]) {
    pthread_t p;
    int rc;

    myarg_t args;
    args.a = 10;
    args.b = 20;
    rc = pthread_create(&p, NULL, mythread, &args);
    …
}
```

**思路分析（逐步读）**

1. 先定义含 a、b 的结构，把 args.a、args.b 分别设为 10、20。
2. 把 `&args` 作为 void 指针传入线程，线程再转回 myarg_t 指针，通过 `m->a`、`m->b` 读成员。
3. 必须保证 args 在线程读取时仍活着，通常主线程 join 后再离开作用域；这里省略号不能替代生命周期管理。

原型为 `pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg)`。第一个参数接收线程标识，attr指定属性或NULL默认，入口接收并返回 `void *`，arg指向需要交给线程的数据。

原例定义含a、b的结构，main设置10、20后传 `&args`，worker转回结构指针后打印10和20。传地址不复制结构；main必须保证args在worker读取期间仍存在，且不能无同步地同时修改它。课件main末尾省略号不能解释为可以马上退出。

### p.41–43：join接收“返回指针”，所以多一层指针

> **p.41** thread: Specify which thread to wait for
>
> value\_ptr: A pointer to the return value
>
> Because pthread\_join() routine changes the value, the return value needs to be passed in a pointer to that value.

**课件程序与接口（p.41，原页片段）**

```text
int pthread_join(pthread_t thread, void **value_ptr);
```

**思路分析（逐步读）**

1. thread 指定等待哪个线程，join 会等它终止。
2. 第二参数是 `void **`，因为 join 要把线程返回的指针写进调用者的指针变量。
3. 不需要结果时传 NULL；成功为 0，线程返回内容不是 join 本身的整数返回值。

**课件程序与接口（p.42，原页片段）**

```text
#include <stdio.h>
 #include <pthread.h>
 #include <assert.h>
 #include <stdlib.h>

 typedef struct __myarg_t {
     int a;
     int b;
 } myarg_t;

 typedef struct __myret_t {
     int x;
     int y;
 } myret_t;

 void *mythread(void *arg) {
     myarg_t *m = (myarg_t *) arg;
     printf(“%d %d\n”, m->a, m->b);
     myret_t *r = malloc(sizeof(myret_t));
     r->x = 1;
     r->y = 2;
     return (void *) r;
 }
```

> **p.43** Example: Waiting for Thread Completion (Cont.)

**思路分析（逐步读）**

1. 先把 arg 转回参数结构指针，读取 a、b。
2. malloc 在堆上分配返回结构，令 r->x=1、r->y=2，再返回 r。
3. 堆对象不会随着线程函数返回自动消失，调用者可在 join 后使用并 free；仍须补做分配失败检查。

**课件程序与接口（p.43，原页片段）**

```text
int main(int argc, char *argv[]) {
     int rc;
     pthread_t p;
     myret_t *m;

     myarg_t args;
     args.a = 10;
     args.b = 20;
     pthread_create(&p, NULL, mythread, &args);
     pthread_join(p, (void **) &m);  // this thread has been                       // waiting inside of the                            // pthread_join() routine.
     printf(“returned %d %d\n”, m->x, m->y);
     return 0;
 }
```

**思路分析（逐步读）**

1. 主线程创建 args 并启动线程，再通过 join 等待完成。
2. `&m` 是结果指针变量的地址，join 将 worker 返回的 r 写入 m，所以之后能读取 m->x 和 m->y。
3. 读取完应该 free(m)，并检查 create/join 的返回值；片段没有展示这些收尾步骤。

原例worker用malloc创建含x、y的返回结构，设1、2后返回其指针；main执行 `pthread_join(p,(void **)&m)` 后读 `m->x,m->y`，输出returned 1 2。入口先打印10 20，join后才有main的返回值打印。

join第二参数供库写入返回的 `void *`，所以是 `void **`。**补充更清楚的写法**：用 `void *result=NULL; pthread_join(p,&result); myret_t *m=result;`，检查成功后读取，最后由约定的拥有者 `free(m)`。malloc失败和create/join失败也需要处理；原例省略这些不等于生产代码可以忽略。

**补充：把一次create/join拆成对象交接。** 调用者先建立参数对象，再把其地址交给线程；新线程何时读取由调度决定，因此create返回不表示参数已经读完。若循环里反复传同一个局部变量i的地址，随后立刻改i，多个线程可能观察到后来的同一个值，而且还可能形成数据竞争。为各线程准备独立、存活足够久的参数对象，或使用明确同步交接，才解决问题；只在create后sleep一会儿没有建立保证。

worker若返回堆对象地址，join取得的是那个地址，不是自动复制出的结构。成功join之后调用者按约定读取并free；若返回指针被多个接收者共享，还要明确唯一负责释放的人。线程的执行资源回收与应用堆对象的释放不同，join不会自动替你free所有malloc。

### p.44–45：返回局部地址与把整数塞进指针

> **p.44** Be careful with how values are returned from a thread.
>
> When the variable r returns, it is automatically de-allocated.

**课件程序与接口（p.44，原页片段）**

```text
void *mythread(void *arg) {
     myarg_t *m = (myarg_t *) arg;
     printf(“%d %d\n”, m->a, m->b);
     myret_t r; // ALLOCATED ON STACK: BAD!
     r.x = 1;
     r.y = 2;
     return (void *) &r;
 }
```

> **p.45** Example: Simpler Argument Passing to a Thread

**思路分析（逐步读）**

1. r 是线程函数栈上的局部结构，赋值只在它的生命周期内有效。
2. `&r` 取地址并不延长 r 的生命；函数一返回，局部对象已失效。
3. 调用者即使成功 join，也不能合法解引用这个悬空地址；应返回堆对象或由调用者提供的有效存储。

**课件程序与接口（p.45，原页片段）**

```text
void *mythread(void *arg) {
     int m = (int) arg;
     printf(“%d\n”, m);
     return (void *) (arg + 1);
 }

 int main(int argc, char *argv[]) {
     pthread_t p;
     int rc, m;
     pthread_create(&p, NULL, mythread, (void *) 100);
     pthread_join(p, (void **) &m);
     printf(“returned %d\n”, m);
     return 0;
 }
```

**思路分析（逐步读）**

1. 片段想把整数 100 塞进 void 指针，再在线程中加 1 传回。
2. 但 void 指针算术不是标准 C，整数和指针直接转换也不保证这种用法可移植。
3. 更严重的是把 `int m` 的地址强转为 void 双指针，join 可能按指针宽度写入而越界；宜改用参数/结果结构，不能把本例当通用模板。

p.44原例在worker栈上声明 `myret_t r; r.x=1; r.y=2; return (void *)&r;`。函数结束后r生命周期结束，join不能让这个对象复活，解引用返回指针无效。应使用生命周期足够长的对象，例如堆分配或由调用方提供存储。

p.45试图把100作为指针参数、再返回101，但 `int m=(int)arg`、`arg+1`和把 `int *`强转成 `void **` 都有可移植性或类型问题；在指针宽于int的平台尤其不能照抄。要表达一个整数，最清晰的课程练习写法是让arg指向真实整数对象，并保证其有效期；若讨论整数指针编码，也须显式说明平台约定与 `intptr_t`，不能把这里的101称作普遍可运行结果。

### p.46–48：锁先初始化，错误处理不能删掉动作

> **p.46** Provide mutual exclusion to a critical section
>
> Interface
>
> Usage (w/o lock initialization and error check)
>
> No other thread holds the lock  the thread will acquire the lock and enter the critical section.
>
> If another thread hold the lock  the thread will not return from the call until it has acquired the lock.

**课件程序与接口（p.46，原页片段）**

```text
int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
```

**思路分析（逐步读）**

1. lock/unlock 都接收同一个互斥量的地址，而不是复制锁对象。
2. lock 成功返回后，当前线程获得临界区执行资格；遇到已占用锁可能等待。
3. 访问共享数据完成后 unlock；检查返回值，且必须遵守锁的初始化及持有关系。

**课件程序与接口（p.46，原页片段）**

```text
pthread_mutex_t lock;
pthread_mutex_lock(&lock);
x = x + 1; // or whatever your critical section is
pthread_mutex_unlock(&lock);
```

> **p.47** All locks must be properly initialized.
>
> One way: using PTHREAD\_MUTEX\_INITIALIZER
>
> The dynamic way: using pthread\_mutex\_init()

**思路分析（逐步读）**

1. 先定位临界区是 `x=x+1` 的整个读改写。
2. 在它前后分别 lock 和 unlock，让所有同锁访问串行。
3. 本段只有锁变量声明，没有初始化；使用前还必须用静态初始化器或 pthread_mutex_init 完成初始化。

**课件程序与接口（p.47，原页片段）**

```text
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
```

**思路分析（逐步读）**

1. 声明 lock 的同时，用 PTHREAD_MUTEX_INITIALIZER 建立默认互斥量初始状态。
2. 后续调用统一传 `&lock`，不能复制该对象来代替共享同一把锁。
3. 这一行只是初始化，没有取得锁；进入临界区仍须调用 lock。

**课件程序与接口（p.47，原页片段）**

```text
int rc = pthread_mutex_init(&lock, NULL);
assert(rc == 0); // always check success!
```

> **p.48** Check errors code when calling lock and unlock
>
> An example wrapper

**思路分析（逐步读）**

1. `&lock` 提供待初始化对象的位置，NULL 选择默认属性。
2. 返回值 rc=0 才表示初始化成功，assert 用来在失败时终止调试示例。
3. assert 在定义 NDEBUG 的构建中可能被移除；需要可靠处理错误时应显式检查返回值。

**课件程序与接口（p.48，原页片段）**

```text
// Use this to keep your code clean but check for failures
 // Only use if exiting program is OK upon failure
 void Pthread_mutex_lock(pthread_mutex_t *mutex) {
     int rc = pthread_mutex_lock(mutex);
     assert(rc == 0);
 }
```

**思路分析（逐步读）**

1. 这是自定义大写 Pthread_mutex_lock 包装函数，内部调用真正的 pthread_mutex_lock。
2. 把返回值保存为 rc，再用断言检查为 0，让调用处更简洁。
3. 它采用失败即终止的策略，且断言可能被关闭；不要误认为大写函数是另一个标准 pthread API。

`pthread_mutex_lock`成功取得锁才返回，unlock释放。静态初始化用 `PTHREAD_MUTEX_INITIALIZER`，动态初始化用 `pthread_mutex_init(&lock,NULL)`，不可直接使用未初始化的mutex。

课件wrapper先执行函数、把返回值存rc，再 `assert(rc==0)`。这种写法至少不会因关闭assert而把加锁调用一并删掉；然而关闭assert会删去检查，真实错误处理仍需设计。锁必须覆盖所有共享不变量更新，异常或提前返回也要遵守释放规则。

**补充：必须发生的动作不能只写进断言。** 如果把 `pthread_mutex_lock(...)` 直接放在 assert 的表达式里，启用会移除断言的构建设置后，表达式可能根本不求值，获取锁这个动作随之消失。此时程序看起来只是关闭了调试检查，实际上连同步都改变了。

教学上应分开理解两件事：先执行调用并保存结果，再决定怎样处理失败。用断言检查已经取得的结果，不会使原调用随着断言被删而消失；不过正式的错误处理仍应满足程序的恢复或退出要求。create 失败后不能拿未经成功初始化的线程标识继续 join，lock 失败后也不能假装已经拥有锁进入临界区。返回码检查之所以属于同步协议，是因为后续每步都依赖前一步真的建立了它声称的状态。

### p.49–51：尝试、超时与编译

> **p.49** These two calls are also used in lock acquisition
>
> trylock: return failure if the lock is already held
>
> timelock: return after a timeout or after acquiring the lock

**课件程序与接口（p.49，原页片段）**

```text
int pthread_mutex_trylock(pthread_mutex_t *mutex);
 int pthread_mutex_timelock(pthread_mutex_t *mutex,
                            struct timespec *abs_timeout);
```

> **p.50** To compile them, you must include the header pthread.h
>
> Explicitly link with the pthreads library, by adding the –pthread flag.
>
> For more information,

**思路分析（逐步读）**

1. trylock 尝试立即获得锁，已被占用时报告忙，不像普通 lock 一直等待。
2. 定时版本只允许等到指定绝对时间，超时需要由调用者处理。
3. 片段把名称写成 pthread_mutex_timelock；标准接口名是 pthread_mutex_timedlock，示意声明不能原样照抄。

**课件程序与接口（p.50，原页片段）**

```text
prompt> gcc –o main main.c –Wall -pthread
```

> **p.51** A multi-threaded program
>
> More than one point of execution (with multiple PCs)
>
> Multiple threads share the same address space but with different stacks
>
> Race condition may occur when multiple threads  enter critical sections.
>
> Thread API
>
> Thread creation: pthread\_create
>
> Thread wait: pthread\_join()
>
> Lock & unlock:  pthread\_mutex\_lock() / pthread\_mutex\_unlock()
>
> Conditional variable: pthread\_cond\_wait() / pthread\_cond\_signal()
>
> Next: Semaphore

**思路分析（逐步读）**

1. gcc 读取 main.c，`-o main` 指定输出程序名。
2. `-Wall` 开启常用警告，`-pthread` 同时处理线程相关编译与链接配置。
3. 片段部分短横线是排版长横线，实际输入终端应使用普通 ASCII `-`，否则不会被识别为选项。

trylock拿不到时返回错误码而非无限阻塞；定时版本达到截止时刻仍未获得则返回超时。p.49把名字写成 `pthread_mutex_timelock`，正确接口名称是 `pthread_mutex_timedlock`；参数为绝对截止时间，不能随手把相对等待秒数填入。

p.50用 `gcc -o main main.c -Wall -pthread` 编译链接，源文件包含 `<pthread.h>`。课件排版的长横线应换成命令行ASCII `-`。p.51总结提到条件变量，但细节在L14；本讲先掌握create启动执行、join等结束、mutex保护共享状态三种不同关系。

:::hint 自测：计划创建4线程，第3次create失败，能否仍按4个pthread_t逐一join？

不能把未成功初始化的线程标识当作真实线程使用。记录已成功创建的数量，只对这些线程执行相应等待/清理；同时保证它们会继续正常结束，参数对象在结束前仍有效。若采用“等4人到齐”的屏障，创建失败还必须改变退出协议，否则前两个可能永久等待不存在的参与者。

pthread类接口通常直接返回错误码，不能不加区分地套用所有系统调用“返回−1再读errno”的模式。学习代码先核每个接口的错误约定，再设计部分成功后的清理路径。

:::endhint

## 本讲核心考点

- [C] 解释create四个参数和join二级指针的意义。
- [C] 判断参数与返回对象的生命周期，识别返回局部地址。
- [C] 区分互斥阻塞、trylock与定时获取，并正确初始化锁。
- [C] 从示例发现指针整数强转的可移植性问题；这是对课件代码的校正，不是已知考试范围。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[L13-线程与线程API-2022未核.pptx](../旧版课件/L13-线程与线程API-2022未核.pptx)；[PDF副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
