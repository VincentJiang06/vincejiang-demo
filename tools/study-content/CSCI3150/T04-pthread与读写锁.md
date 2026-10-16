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

**课件程序与接口（p.4，原页片段）**

```text
pthread_t tid;
pthread_create(&tid, NULL, thread_function, NULL);
```

**课件程序与接口（p.5，原页片段）**

```text
void pthread_exit(void *retval);
```

> **p.5** Parameters:
>
> retval: value returned to any joining thread.

**课件程序与接口（p.5，原页片段）**

```text
pthread_exit(NULL); // Exit thread without returning a value.
```

> **p.6** Purpose: wait for a specific thread to terminate.

**课件程序与接口（p.6，原页片段）**

```text
int pthread_join(pthread_t thread, void **retval);
```

> **p.6** Parameters:
>
> thread: the thread ID of the thread to wait for.
>
> retval: pointer to a location where the exit status of the thread will be stored (can be NULL).

**课件程序与接口（p.6，原页片段）**

```text
pthread_join(tid, NULL); // Wait for thread 'tid' to finish.
```

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

**课件程序与接口（p.7，原页片段）**

```text
pthread_mutex_t lock;
pthread_mutex_init(&lock, NULL); // Initialize mutex 'lock'.
```

> **p.8** Purpose: lock a mutex, blocking if it is already locked.

**课件程序与接口（p.8，原页片段）**

```text
int pthread_mutex_lock(pthread_mutex_t *mutex);
```

**课件程序与接口（p.8，原页片段）**

```text
pthread_mutex_lock(&lock); // Lock the mutex 'lock'.
```

**课件程序与接口（p.9，原页片段）**

```text
int pthread_mutex_unlock(pthread_mutex_t *mutex);
```

**课件程序与接口（p.9，原页片段）**

```text
pthread_mutex_unlock(&lock); // Unlock the mutex 'lock'.
```

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

**课件程序与接口（p.10，原页片段）**

```text
shared resource:
int counter = 0;
pthread_mutex_t lock;
```

**课件程序与接口（p.10，原页片段）**

```text
critical section:
for (int i = 0; i < 100000; i++) {
        counter++;
    }
```

**课件程序与接口（p.10，原页片段）**

```text
acquire() to hold lock:
pthread_mutex_lock(&lock);
```

**课件程序与接口（p.10，原页片段）**

```text
release() to release lock:
pthread_mutex_unlock(&lock);
```

> **p.10** TODO:
>
> Compare the run results with example2.c which removes lock
>
> By using mutex lock:
>
> prevent simultaneous access to counter
>
> ensure data consistency

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

**课件程序与接口（p.13，原页片段）**

```text
int pthread_mutex_trylock(pthread_mutex_t *mutex);
int pthread_mutex_timedlock(pthread_mutex_t *mutex, const struct timespec* abs_timeout);
```

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
