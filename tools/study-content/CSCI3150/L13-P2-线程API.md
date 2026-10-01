# CSCI3150 L13 线程API

> 课程：CSCI3150 Introduction to Operating Systems · 2022未核
> 本讲：L13 线程API，第 2 部分 / 共 2 部分 · 原件 [L13-线程与线程API-2022未核.pptx](../课件/L13-线程与线程API-2022未核.pptx) · [PDF页码副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51
> 定位：正确创建、等待线程，并使参数、返回值和锁的生命周期覆盖实际使用。
> 前后：前接 [线程与竞争](L13-P1-线程与竞争.md)；后接 [L14 锁](L14-P1-锁的实现.md)。

## 逐页伴读

p.38是Part II标题。

### p.39–40：create传入的是入口与一个指针

原型为 `pthread_create(pthread_t *thread, const pthread_attr_t *attr, void *(*start_routine)(void *), void *arg)`。第一个参数接收线程标识，attr指定属性或NULL默认，入口接收并返回 `void *`，arg指向需要交给线程的数据。

原例定义含a、b的结构，main设置10、20后传 `&args`，worker转回结构指针后打印10和20。传地址不复制结构；main必须保证args在worker读取期间仍存在，且不能无同步地同时修改它。课件main末尾省略号不能解释为可以马上退出。

### p.41–43：join接收“返回指针”，所以多一层指针

原例worker用malloc创建含x、y的返回结构，设1、2后返回其指针；main执行 `pthread_join(p,(void **)&m)` 后读 `m->x,m->y`，输出returned 1 2。入口先打印10 20，join后才有main的返回值打印。

join第二参数供库写入返回的 `void *`，所以是 `void **`。**补充更清楚的写法**：用 `void *result=NULL; pthread_join(p,&result); myret_t *m=result;`，检查成功后读取，最后由约定的拥有者 `free(m)`。malloc失败和create/join失败也需要处理；原例省略这些不等于生产代码可以忽略。

### p.44–45：返回局部地址与把整数塞进指针

p.44原例在worker栈上声明 `myret_t r; r.x=1; r.y=2; return (void *)&r;`。函数结束后r生命周期结束，join不能让这个对象复活，解引用返回指针无效。应使用生命周期足够长的对象，例如堆分配或由调用方提供存储。

p.45试图把100作为指针参数、再返回101，但 `int m=(int)arg`、`arg+1`和把 `int *`强转成 `void **` 都有可移植性或类型问题；在指针宽于int的平台尤其不能照抄。要表达一个整数，最清晰的课程练习写法是让arg指向真实整数对象，并保证其有效期；若讨论整数指针编码，也须显式说明平台约定与 `intptr_t`，不能把这里的101称作普遍可运行结果。

### p.46–48：锁先初始化，错误处理不能删掉动作

`pthread_mutex_lock`成功取得锁才返回，unlock释放。静态初始化用 `PTHREAD_MUTEX_INITIALIZER`，动态初始化用 `pthread_mutex_init(&lock,NULL)`，不可直接使用未初始化的mutex。

课件wrapper先执行函数、把返回值存rc，再 `assert(rc==0)`。这种写法至少不会因关闭assert而把加锁调用一并删掉；然而关闭assert会删去检查，真实错误处理仍需设计。锁必须覆盖所有共享不变量更新，异常或提前返回也要遵守释放规则。

### p.49–51：尝试、超时与编译

trylock拿不到时返回错误码而非无限阻塞；定时版本达到截止时刻仍未获得则返回超时。p.49把名字写成 `pthread_mutex_timelock`，正确接口名称是 `pthread_mutex_timedlock`；参数为绝对截止时间，不能随手把相对等待秒数填入。

p.50用 `gcc -o main main.c -Wall -pthread` 编译链接，源文件包含 `<pthread.h>`。课件排版的长横线应换成命令行ASCII `-`。p.51总结提到条件变量，但细节在L14；本讲先掌握create启动执行、join等结束、mutex保护共享状态三种不同关系。

## 本讲核心考点

- [B] 解释create四个参数和join二级指针的意义。
- [B] 判断参数与返回对象的生命周期，识别返回局部地址。
- [B] 区分互斥阻塞、trylock与定时获取，并正确初始化锁。
- [C] 从示例发现指针整数强转的可移植性问题；这是对课件代码的校正，不是已知考试范围。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[L13-线程与线程API-2022未核.pptx](../课件/L13-线程与线程API-2022未核.pptx)；[PDF副本](PDF/L13-线程与线程API-2022未核.pdf) p.38–51。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无
