# CSCI3150 L13 线程API

> 课程：CSCI3150 Introduction to Operating Systems · 2022未核
> 本讲：L13 线程API，第 2 部分 / 共 2 部分 · 原件 [L13-线程与线程API-2022未核.pptx](../课件/L13-线程与线程API-2022未核.pptx) · [PDF页码副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51
> 定位：正确创建、等待线程，并使参数、返回值和锁的生命周期覆盖实际使用。
> 前后：前接 [线程与竞争](L13-P1-线程与竞争.md)；后接 [L14 锁](L14-P1-锁的实现.md)。

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

**课件程序与接口（p.47，原页片段）**

```text
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
```

**课件程序与接口（p.47，原页片段）**

```text
int rc = pthread_mutex_init(&lock, NULL);
assert(rc == 0); // always check success!
```

> **p.48** Check errors code when calling lock and unlock
>
> An example wrapper

**课件程序与接口（p.48，原页片段）**

```text
// Use this to keep your code clean but check for failures
 // Only use if exiting program is OK upon failure
 void Pthread_mutex_lock(pthread_mutex_t *mutex) {
     int rc = pthread_mutex_lock(mutex);
     assert(rc == 0);
 }
```

`pthread_mutex_lock`成功取得锁才返回，unlock释放。静态初始化用 `PTHREAD_MUTEX_INITIALIZER`，动态初始化用 `pthread_mutex_init(&lock,NULL)`，不可直接使用未初始化的mutex。

课件wrapper先执行函数、把返回值存rc，再 `assert(rc==0)`。这种写法至少不会因关闭assert而把加锁调用一并删掉；然而关闭assert会删去检查，真实错误处理仍需设计。锁必须覆盖所有共享不变量更新，异常或提前返回也要遵守释放规则。

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

- 原件：[L13-线程与线程API-2022未核.pptx](../课件/L13-线程与线程API-2022未核.pptx)；[PDF副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
