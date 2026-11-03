# CSCI3150 T04 pthread与读写锁

> 课程：CSCI3150 Introduction to Operating Systems · 2025T2
> 本讲：T04 pthread与读写锁 · 原件 [T04-pthread锁实现-2025T2.pptx](../项目/T04-2025T2/T04-pthread锁实现-2025T2.pptx) · [PDF页码副本](PDF/T04-pthread锁实现-2025T2.pdf) p.1–14
> 定位：用实际API把线程创建、等待、互斥和读者并发连起来。
> 前后：前接 [T03](T03-系统调用与管道.md)；后接 [T05](T05-条件变量与屏障.md)。

## 逐页伴读

### p.1–3：版本冲突保留，不改写封面

> **p.1** Lock Implementation via pthread Library in C
>
> CSCI3150 Introduction to Operating Systems, Fall 2024

> **p.2** All examples used in this tutorial:
>
> https://github.com/henryhxu/CSCI3150/tree/2026-Spring/tutorial/T04

> **p.3** The Pthread (POSIX threads) library is a powerful tool for creating and managing threads in C. It provides a standardized API to facilitate multi-threading, which is essential for developing concurrent applications.

**课件程序与接口（p.3，原页片段）**

```text
To use it:  #include <pthread.h>
Key Interfaces:
pthread_create
pthread_exit
pthread_join
```

文件来源归2025T2，封面同时出现Fall2024和Jan29,2026，因此只能称历史参考。p.2列pthread与mutex/read-write lock；p.3编译链接线程库，命令里的排版长横线应换ASCII `-`，课程Linux可使用 `gcc -Wall -pthread example1.c -o example1`。

### p.4–6：create、exit、join各控制谁

**课件程序与接口（p.4，原页片段）**

```text
int pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg);
```

> **p.4** Parameters:
>
> thread: pointer to a pthread\_t variable that will hold the thread ID.
>
> attr: thread attributes (NULL for default attributes, can specify attributes like Stack size, Scheduling priority, etc…).
>
> start\_routine: pointer to the function to be executed by the thread.
>
> arg: argument passed to the thread function (start\_routine).

**思路分析（逐步读）**

1. thread 是句柄输出地址，attr 为属性，NULL 使用默认值。
2. start_routine 是接收并返回 void 指针的线程入口函数，arg 原样传给入口。
3. create 成功返回 0，线程执行顺序由调度决定，不保证先于或晚于创建者下一句。

**课件程序与接口（p.4，原页片段）**

```text
pthread_t tid;
pthread_create(&tid, NULL, thread_function, NULL);
```

**思路分析（逐步读）**

1. 先声明 tid，用来保存新线程的句柄。
2. 传 `&tid` 让 create 写回句柄，thread_function 指定线程入口，最后的 NULL 表示不给入口额外数据。
3. 检查返回值成功后才用 tid 去 join；create 返回不表示线程已经完成。

**课件程序与接口（p.5，原页片段）**

```text
void pthread_exit(void *retval);
```

> **p.5** Parameters:
>
> retval: value returned to any joining thread.

**思路分析（逐步读）**

1. pthread_exit 接收线程要交给 join 者的结果指针。
2. 调用它会结束当前线程，而不是默认结束进程里的所有线程。
3. 结果指向的对象必须在线程退出后仍有效，不能返回线程栈上的局部对象地址。

**课件程序与接口（p.5，原页片段）**

```text
pthread_exit(NULL); // Exit thread without returning a value.
```

> **p.6** Purpose: wait for a specific thread to terminate.

**思路分析（逐步读）**

1. NULL 表示没有返回结果对象。
2. 执行 pthread_exit 后当前线程停止，后续语句不会继续。
3. 其他存活线程仍可执行；不要把它与 exit 结束整个进程混淆。

**课件程序与接口（p.6，原页片段）**

```text
int pthread_join(pthread_t thread, void **retval);
```

> **p.6** Parameters:
>
> thread: the thread ID of the thread to wait for.
>
> retval: pointer to a location where the exit status of the thread will be stored (can be NULL).

**思路分析（逐步读）**

1. thread 指定要等待的目标，retval 是用于接收返回指针的地址。
2. join 等目标结束，并完成对可连接线程的回收。
3. 成功返回 0；retval 接收到的线程结果与 join 的整数错误码不是同一个值。

**课件程序与接口（p.6，原页片段）**

```text
pthread_join(tid, NULL); // Wait for thread 'tid' to finish.
```

**思路分析（逐步读）**

1. tid 选择此前创建的线程，第二参数 NULL 表示忽略其返回对象。
2. 当前线程在 join 内等待目标终止。
3. 返回成功后再使用该线程完成的结果或销毁相关资源，不能把 join 当作对共享递增自动加锁。

create通过pthread_t指针返回新线程标识，入口与arg决定从哪里开始；pthread_exit终止**调用线程**并返回指针结果；join等指定线程结束，可用NULL忽略返回值。它们不会自动把两个worker的共享更新变为原子动作。

### p.7–9：mutex围住一整个共享操作

**课件程序与接口（p.7，原页片段）**

```text
int pthread_mutex_init(pthread_mutex_t *mutex, const pthread_mutexattr_t *attr);
```

> **p.7** Parameters:
>
> mutex: pointer to the mutex to be initialized.
>
> attr: mutex attributes (can be NULL for default attributes).

**思路分析（逐步读）**

1. mutex 参数给出待初始化互斥量的地址，attr 可选择属性。
2. attr 为 NULL 时创建默认属性的互斥量。
3. 返回 0 才算成功，必须先初始化后 lock；声明一个变量本身不完成初始化。

**课件程序与接口（p.7，原页片段）**

```text
pthread_mutex_t lock;
pthread_mutex_init(&lock, NULL); // Initialize mutex 'lock'.
```

> **p.8** Purpose: lock a mutex, blocking if it is already locked.

**思路分析（逐步读）**

1. 先为 lock 对象提供存储，再传 `&lock` 进行动态初始化。
2. NULL 选择默认属性，不表示没有锁。
3. 初始化成功后所有线程必须使用同一个 lock 对象；不再使用且无人等待时才销毁。

**课件程序与接口（p.8，原页片段）**

```text
int pthread_mutex_lock(pthread_mutex_t *mutex);
```

**思路分析（逐步读）**

1. 接口接收互斥量指针，调用者必须传已初始化锁的地址。
2. 锁空闲时取得它，已被占用时通常阻塞等待。
3. 成功返回后才能把受保护操作视为处于临界区，失败返回应显式处理。

**课件程序与接口（p.8，原页片段）**

```text
pthread_mutex_lock(&lock); // Lock the mutex 'lock'.
```

**思路分析（逐步读）**

1. `&lock` 取出共享锁的地址，不是修改变量的数值。
2. 当前线程尝试取得这把锁，成功后继续下一句。
3. 受保护的读写应放在此调用之后、对应 unlock 之前，不能只给某一个访问者加锁。

**课件程序与接口（p.9，原页片段）**

```text
int pthread_mutex_unlock(pthread_mutex_t *mutex);
```

**思路分析（逐步读）**

1. unlock 用来释放当前线程持有的互斥量。
2. 其他等待者此后可能取得锁，但不保证哪一个先获得。
3. 它不代表唤醒顺序或公平性保证，也不能用于释放自己未持有的普通锁。

**课件程序与接口（p.9，原页片段）**

```text
pthread_mutex_unlock(&lock); // Unlock the mutex 'lock'.
```

**思路分析（逐步读）**

1. 完成临界区内全部共享操作后，对同一 lock 调用 unlock。
2. 释放后不再享有独占访问资格，后续读写需要重新判断是否受保护。
3. 不要遗漏错误路径上的释放，否则其他线程可能一直等待。

先init，再成功lock，访问临界区后unlock。init不是每次加锁时都调用；锁正在使用时也不能重新初始化。unlock释放的是该互斥锁的所有权，不是退出线程。函数返回码需要检查，避免在未成功取得锁时继续访问共享对象。

### p.10–11：两线程与十线程的计数

**课件程序与接口（p.10，原页片段）**

```text
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int counter = 0;
pthread_mutex_t lock;

void* increment(void* arg) {
    pthread_mutex_lock(&lock);
    for (int i = 0; i < 1000000; i++) {
        counter++;
    }
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main() {
    pthread_t t1, t2;
    pthread_mutex_init(&lock, NULL); // initialize the mutex 'lock'.
    pthread_create(&t1, NULL, increment, NULL);
    pthread_create(&t2, NULL, increment, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("Final value of shared resource counter: %d\n", counter);
    pthread_mutex_destroy(&lock); // destroy the mutex 'lock'.
    return 0;
}
```

**思路分析（逐步读）**

1. main 先初始化锁，再创建两个 increment，最后逐个 join。
2. 每个 increment 取得锁后一次性做一百万次 counter++，整个循环期间另一线程无法进入。
3. 在各调用成功的前提下总数为两百万；join 完再销毁锁，锁保护了正确性但使两个长循环串行执行。

**课件程序与接口（p.10，原页片段）**

```text
int counter = 0;
pthread_mutex_t lock;
```

**思路分析（逐步读）**

1. counter 是需要保护的共享数据，lock 是独立的同步对象。
2. 线程要共享同一 counter，就必须也约定用同一 lock 保护竞争访问。
3. 这里只声明二者，没有初始化锁或执行加锁；后面的初始化及 lock 调用不能省略。

**课件程序与接口（p.10，原页片段）**

```text
for (int i = 0; i < 100000; i++) {
        counter++;
    }
```

**思路分析（逐步读）**

1. i 从 0 到 99999，每轮给共享 counter 加 1。
2. 这一整段是需要保护的临界区，进入前取锁、完成后释放。
3. 本片段上界为十万，而完整示例是一百万，计算总量时必须看当前代码，不能套用前段数字。

**课件程序与接口（p.10，原页片段）**

```text
pthread_mutex_lock(&lock);
```

**思路分析（逐步读）**

1. 在接触 counter 之前调用 pthread_mutex_lock。
2. 取得锁后其他遵守同锁协议的线程不能同时更新 counter。
3. 只有成功取得锁才进入临界区；它不是普通函数名 acquire 的自动替代，而是实际 pthread 调用。

**课件程序与接口（p.10，原页片段）**

> **p.10** TODO:
>
> Compare the run results with example2.c which removes lock
>
> By using mutex lock:
>
> prevent simultaneous access to counter
>
> ensure data consistency

```text
pthread_mutex_unlock(&lock);
```

**思路分析（逐步读）**

1. 完成共享修改后调用 pthread_mutex_unlock。
2. 这一步使下一位竞争者有机会进入。
3. 释放应与前面的成功加锁配对，不能把循环中途释放后续更新仍视为受保护。

**课件程序与接口（p.11，原页片段）**

```text
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int counter = 0;
pthread_mutex_t lock;

void* increment(void* arg) {
    pthread_mutex_lock(&lock);
    for (int i = 0; i < 1000000; i++) {
        counter++;
    }
    pthread_mutex_unlock(&lock);
    return NULL;
}

int main() {
    pthread_t threads[10];
    pthread_mutex_init(&lock, NULL);
    for (int i = 0; i < 10; i++) {
        pthread_create(&threads[i], NULL, increment, NULL);
    }
    for (int i = 0; i < 10; i++) {
        pthread_join(threads[i], NULL);
    }
    pthread_mutex_destroy(&lock);
    printf("Final counter value: %d\n", counter);
    return 0;
}
```

> **p.11** Simple mutex lock implementation (multiple threads)

> **p.11** By using mutex lock:
>
> only 1 thread can enter the critical region and modify counter at any time

**思路分析（逐步读）**

1. main 创建十个线程，把句柄逐一存入 threads 数组。
2. 每个线程持同一把锁做一百万次递增，因此更新不会相互覆盖。
3. 十次 join 全部成功后才销毁锁并打印，正常总数为一千万；线程数增加不代表该串行临界区更快。

原图左侧完整代码每线程循环1,000,000次，右侧解释框却写100,000，二者不一致。以完整代码为题面：初值0、所有创建成功、同一mutex保护整个循环，两线程最终2,000,000，十线程10,000,000；若按右框次数才分别200,000和1,000,000。

锁在循环外意味着一个线程做完全部增量才交给另一个，结果正确但这段工作串行。删锁后普通C共享counter有数据竞争，不能承诺固定最终值，也不能因某次恰巧正确就判定没有问题。join保证打印发生在更新结束后。

**原页两个位置的循环次数不一致**：p.10–11 左侧完整程序使用 `i < 1000000`，右侧“critical section”摘录使用 `i < 100000`。按完整程序、创建与加锁均成功来算，两个线程最终为 2,000,000，十个线程为 10,000,000；若采用右侧摘录的十万次上界，则分别变为 200,000 和 1,000,000。读者应先说明采用哪个代码块，不能把十万次的题干与百万次的答案拼在一起。

### p.12–14：读写锁允许多个读者，仍隔离写者

**课件程序与接口（p.12，原页片段）**

```text
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

int shared_data = 0;
pthread_rwlock_t rwlock;

void* reader(void* arg) {
    pthread_rwlock_rdlock(&rwlock);
    printf("Reader: %d\n", shared_data);
    pthread_rwlock_unlock(&rwlock);
    return NULL;
}

void* writer(void* arg) {
    pthread_rwlock_wrlock(&rwlock);
    shared_data++;
    pthread_rwlock_unlock(&rwlock);
    return NULL;
}
```

> **p.12** Advanced mutex lock implementation (Read/Write Locks)

**思路分析（逐步读）**

1. reader 取得读锁后读取 shared_data，多个读者可同时持读锁。
2. writer 取得写锁后递增 shared_data，写锁排斥其他读者与写者。
3. 两条路径结束都用 rwlock_unlock；读者应只读不改，否则破坏读锁的共享前提。

**课件程序与接口（p.12，原页片段）**

```text
int main() {
    pthread_t r1, r2, w1;
    pthread_rwlock_init(&rwlock, NULL);
    pthread_create(&r1, NULL, reader, NULL);
    pthread_create(&r2, NULL, reader, NULL);
    pthread_create(&w1, NULL, writer, NULL);
    pthread_join(r1, NULL);
    pthread_join(r2, NULL);
    pthread_join(w1, NULL);
    pthread_rwlock_destroy(&rwlock);
    return 0;
}
```

> **p.12** Requirements:
>
> allow multiple threads to read a shared resource concurrently
>
> only one thread can write to the resource at any given time.

> **p.12** Read lock: allow multiple readers to access shared\_data concurrently

> **p.12** Write lock: ensure exclusive access to shared\_data for the duration of the write operation.

> **p.12** Blocking Behavior:
>
> If a writer is holding a write lock, any incoming readers will be blocked until the writer releases the lock.
>
> Conversely, if there are readers holding read locks, a writer will be blocked until all readers have released their locks.

> **p.13** Pthread Documentation: pthreads(7) - Linux manual page (man7.org)
>
> Deadlock scenario: A situation where two or more threads are unable to proceed because each is waiting for the other to release resources.
>
> Non-blocking locks

**思路分析（逐步读）**

1. 先初始化 rwlock，再启动两个 reader 和一个 writer。
2. 创建顺序不保证执行顺序，读者可能看到写前的 0 或写后的 1。
3. 等待三个线程全部结束后再销毁锁；读写锁保证访问协调，不强制 writer 先执行。

**课件程序与接口（p.13，原页片段）**

```text
int pthread_mutex_trylock(pthread_mutex_t *mutex);
int pthread_mutex_timedlock(pthread_mutex_t *mutex, const struct timespec* abs_timeout);
```

**思路分析（逐步读）**

1. trylock 不能立即取得锁时返回忙，调用者可选择别的工作。
2. timedlock 允许等待到 abs_timeout 指定的绝对时间，超时返回错误编号。
3. 两者都应检查返回值，失败时不能进入临界区或调用 unlock 假装已经持锁。

原例shared_data初值0，两reader各在rdlock内打印，一writer在wrlock内加1。根据获取顺序，两个读者可能都读0、一个0一个1或都读1；已正确同步不等于打印顺序固定。最后在所有线程join后销毁锁。

p.13补充trylock与timedlock：前者立即报告能否获得，后者等待至绝对截止时间；死锁是线程相互等对方释放资源，不是所有等待都叫死锁。p.14为Q&A。对应机制详见[L14](L14-P1-锁的实现.md)及[L15读写锁](L15-P1-信号量.md)。

**补充：读锁之所以允许并行，依赖读者真的不修改受保护对象。** 函数叫 reader 不是保证；如果它在“读取”时顺便递增共享访问次数、更新缓存字段或移动共享游标，那些也是写操作，需要单独的正确保护。两个线程都持读锁时可以同时执行，所以不能用读锁为这些修改建立互斥。

原例只在读锁内取 shared_data 的值，写者则在写锁内递增。读者取得的 0 或 1 取决于与写者的先后关系，允许多种结果并不是同步失效。判断是否正确，要核“每次读取是否发生在允许的完整状态”，而不是要求所有运行的打印顺序相同。最后 destroy 之前的 join 保证这里的工作线程已不再使用这把锁；销毁动作本身不会替调用者等待使用者结束。

### 正确结果之外，再看锁内到底花了多久（补充）

原计数示例把整个百万次循环放在同一mutex内。这样两个线程虽已创建，计数工作仍是一人做完再换另一人；得到2,000,000不能证明这个算法加速。若把锁缩到每次counter++，可增加交错却可能付出百万次加解锁开销。若任务允许先在私有变量里累加，再用短临界区合并一次，可减少争用；是否允许这种重排取决于是否有人需要观察中间计数。

读写锁中的“读者”由访问行为决定，不是函数名。若reader为了统计访问次数顺便写共享counter，它就不再是只读操作；多个rdlock持有者仍能并发，那个新写入就可能竞争。对读路径的每个共享写都要重新检查，不能因外层拿了某种锁就自动安全。

:::hint 自测：两读者分别打印0和1，是否一定有数据竞争？

不一定。一个读者在writer之前取得读锁，看到0并释放；writer随后独占加到1；另一读者在writer之后取得读锁，看到1。这是合法串行关系。同步保证观察有依据，不保证所有读者在不同时刻读到同一值。

:::endhint

## 本讲核心考点

- [C] 算出给定线程数和循环次数下正确互斥的总计数。
- [C] 区分结果确定性与调度顺序不确定性。
- [C] 推演读写锁下读者能观察到的值。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[T04-pthread锁实现-2025T2.pptx](../项目/T04-2025T2/T04-pthread锁实现-2025T2.pptx)；[PDF副本](PDF/T04-pthread锁实现-2025T2.pdf) p.1–14。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
