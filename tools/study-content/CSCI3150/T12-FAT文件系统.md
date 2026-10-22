# CSCI3150 T12 FAT文件系统

> 课程：CSCI3150 Introduction to Operating Systems · 2025T2
> 本讲：T12 FAT文件系统 · 原件 [T12-FAT文件系统-2025T2.pptx](../辅导/T12-FAT文件系统-2025T2.pptx) · [PDF页码副本](PDF/T12-FAT文件系统-2025T2.pdf) p.1–16
> 定位：沿目录项的首簇进入FAT链，区分逻辑长度、分配长度与簇内浪费。
> 前后：前接 [T11](T11-文件系统API.md)，对应 [L05实现](L05-文件系统实现.md)。

## 逐页伴读

### p.1–3：最后一份历史Tutorial

> **p.1** Tutorial 12: FAT File System
>
> CSCI3150 Introduction to Operating Systems, Spring 2026

> **p.2** Assignement 4
>
> Due at 15:59:00 p.m., Apr 24
>
> Final Exam
>
> You can take a A4 cheat sheet and a calculator

封面2026年4月9日；p.2作业截止4月24日与T11的5月1日不同，应视为历史材料中的不同通知，不能拿任一日期当当期要求。允许A4纸和计算器也是该历史期末说明，不代表2026T1已获相同许可。p.3为File and Directory标题。

**备注与可见正文的版本差异**：原 PPTX slide 2 的演讲者备注另写 “December 9th at 6 p.m.”，与可见页的 4 月 24 日不同。两者属于同一文件中未同步的历史安排，不能合并为一个截止时间。本笔记只把备注作为来源差异保留，不据此改写当前学期的作业日期。

### p.4–6：FAT怎样连接名字与内容

> **p.4** File and Directory is the abstract of the hard disk drive and I/O.
>
> File
>
> One file occupy several clusters (data blocks)
>
> inode: a data structure that describes a FS object
>
> Directory
>
> A file
>
> A list of \<user-readable filename, low-level name\> pairs
>
> Directory Entry
>
> the logical unit in a directory file. A directory file has one or multiple directory entries. A directory entry is the metadata
>
> of a file and could point to a file or another directory file.

> **p.5** Simple - and common - file system
>
> Found on all Windows OS and many devices
>
> FAT12: Developed 1977 (MS Disk BASIC)
>
> FAT16: Developed 1987 (MS-DOS 3.31)
>
> FAT32: Developed 1996 (Win95 OSR2)
>
> Few data structures supported:
>
> Cluster: Basic storage unit for files
>
> Directory: Lists file name, starting cluster, and length
>
> File Allocation Table: Contains cluster status and pointer to next cluster in chain

> **p.6** Relationship between the directory entry structures, clusters, and FAT structure:

一般文件系统用目录项把名称连到底层对象，inode是前面主讲的常见结构；FAT并不要求照搬Unix的磁盘inode表。这里目录项记录名字、首簇和长度，FAT中每项记录该簇的状态或下一簇位置。

图p.6 file1.dat大小4000B、首簇34，FAT[34]指35，FAT[35]标EOF。读取先查目录得到34，再沿表到35，不靠猜“首簇后面连续就是下一块”。该图没给簇字节数，不能仅用4000与两簇反推出精确slack。

### p.7–9：两组原题分别算slack

> **p.7** File tyui.jpg:
>
> occupies clusters 2, 3, and 4.
>
> The file size is 1,400 bytes, it occupies 1,536 bytes (3 clusters) on the disk, and cluster 4 includes 136 bytes of slack space.
>
> File mes.doc:
>
> occupies clusters 5 and 6.
>
> The file size is 980 bytes, it occupies 1,024 bytes (2 clusters), and has 44 bytes of slack space in cluster 6.
>
> Clusters 7, 8, and 9 are unallocated.

> **p.9** Clusters 3, 6, and 8 are allocated; clusters 2, 4, 5, 7, and 9 are unallocated
>
> Clusters 6 and 8 are only partially filled; the unused portion is slack space
>
> File gary.txt:
>
> logical size is 1,034 bytes
>
> physical size is 2,048 bytes (slack = 1,014 B)
>
> File hello.jpg:
>
> logical size is 3,973 bytes
>
> physical size is 4,096 bytes (slack = 123 B)

p.7题设tyui.jpg为1400B，占簇2、3、4共1536B，故每簇512B，slack=1536−1400=136B；mes.doc为980B，占5、6共1024B，slack44B；7、8、9未分配。两个文件合计2380B逻辑、2560B分配，总slack180B。

p.8说明cluster由若干连续sector组成，图例sector512B；p.9另换簇2048B=4sector。gary.txt首簇6，大小1034B，只占1簇，slack1014B；hello.jpg首簇3，FAT[3]=8、FAT[8]结束，大小3973B，占2簇4096B，slack123B。合计5007B逻辑、6144B分配、slack1137B。簇3与8不连续，展示链式分配；不能把p.7的512B簇长带入p.9。

**补充：沿hello.jpg算一次文件偏移。** p.9 的簇长2048B，文件3973B，链为3→8→结束。若要读文件偏移2500处的一个字节，先做2500=1×2048+452；它属于文件的第1号逻辑簇（从0计），簇内偏移452。目录首簇3对应逻辑簇0；查FAT[3]=8，才找到逻辑簇1，因此读簇8的偏移452。不能直接取物理簇4，也不能把FAT[8]的结束标记当成数据。

读到文件末尾还要看逻辑大小。最后一个有效字节偏移3972，在第二簇中的偏移是3972−2048=1924，故第二簇实际使用1925B，剩2048−1925=123B，与原slack吻合。FAT告诉你已分配链怎么走；目录大小告诉你用户内容在哪里终止，二者一起才能避免把末簇剩余空间当成文件内容。

表（p.8，按原图展开）：FAT 的四个连续区域

| 区域 | 包含内容 | 页上给出的扇区数关系 |
|---|---|---|
| Reserved | Boot Sector、FAT32 的 FS Information Sector、可选额外保留扇区 | 保留扇区数 |
| FAT Region | FAT#1、FAT#2 等副本 | FAT 数量 × 每份 FAT 的扇区数 |
| Root Directory Region | FAT12/FAT16 的固定根目录 | 根条目数 × 32 ÷ 每扇区字节数 |
| Data Region | 普通文件及目录内容 | 簇数 × 每簇扇区数 |

p.8 将 sector 通常设为 512B，cluster 可取 1、2、4、8、16、32、64 个连续扇区，对应 512B–32KiB。读图时注意根目录区位于 FAT 区之后；备注里“right after reserved region”省略了中间的 FAT 区，与图不一致，以图示顺序逐区计算位置。根目录区的扇区数若算出小数，实际按整扇区存放必须向上取整，这是本步所需的边界补充。

表（p.9）：本题的完整 FAT 小表

| Cluster | Next |
|---:|---|
| 2 | 0 |
| 3 | 8 |
| 4 | 0 |
| 5 | 0 |
| 6 | 0xFF |
| 7 | 0 |
| 8 | 0xFF |
| 9 | 0 |

本图用 0 表示空闲、0xFF 表示本图的结束记号；并未给出完整 FAT16 编码范围。已分配簇为 3、6、8，其余列出的簇空闲。簇 6 的前 1034B 是 gary.txt，尾部 1014B 未用；hello.jpg 在簇 3 放满 2048B，在簇 8 放剩下的 1925B，留下 123B。PPTX slide 9 备注说 gary.txt 用了两个簇，与可见图及 1034B/2048B 的计算冲突；这里按可见题面算为一簇，不能把该备注直接写成答案。

### p.10–11：FAT条目不是数据本身

> **p.10** FAT contains the metadata for clusters in the filesystem
>
> In FAT16, the size of a FAT entry is 16 bit (2 bytes)
>
> Every cluster in data region will be mapped uniquely mapped to an entry in FAT table
>
> The clusters of a file may not be continuous in the data region, and the file system remembers the relationship of clusters with FAT

**p.10 图片表格：FAT16 表项的完整取值分类。** 这里读的是 `FAT[k]` 保存的值，不是下标 k。下表按该页逐行转写。

| 表项值（十六进制） | 原页含义 | 读链时怎样处理 |
|---|---|---|
| 0x0000 | Free cluster | 簇 k 空闲，不是文件正常结束标记 |
| 0x0001 | Reserved cluster | 保留值，不能当成普通后继簇号 |
| 0x0002–0xFFEF | Occupied cluster；指向下一簇 | 继续到该值所指的簇，仍须落在此卷实际数据簇范围内 |
| 0xFFF0–0xFFF6 | Reserved values | 保留编码，不能继续按普通链读取 |
| 0xFFF7 | Bad cluster | 坏簇标记，不是正常文件尾 |
| 0xFFF8–0xFFFF | The last cluster of a file | 簇 k 是链的末簇，停止跟随后继 |

**把“下标”和“内容”分开读。** 假设目录项给首簇 6，`FAT[6]=0x0008`，`FAT[8]=0xFFFF`（本段是按编码表构造的演示）。先读取数据簇 6，再由表项内容 8 找到数据簇 8；读取簇 8 后发现结束编码，链就到此为止。不是去读取“第 65535 簇”，也不是把 FAT 表里的两个字节当文件数据。末簇有多少字节属于文件，仍由目录中的文件大小决定。

若跟随一条已分配文件链却遇到 `0x0000`，不能把它当成同样正确的 EOF；这与该链应当已分配的前提冲突，需要报告或检查元数据问题。`0xFFF7` 则说明坏簇状态。区分这些分支，才能理解文件系统为什么不能只写“遇到大数就停”。p.9 用 `0xFF` 表示结束、p.11 用 0 表示结束，都是各自示意图的简写；不能替换本页 FAT16 的实际分类。

FAT16每项16bit=2B，对应一个数据簇。第k项的内容告诉“簇k后面是谁”，不要把k和内容交换。图p.11 rock.mp3从块1开始，沿中间省略段到6结束；game.exe从19经20及省略段到25结束；ubuntu.iso从7经8、后续到18，再跳26→27结束，展示可不连续。

该教学图用0表示链尾，又画出28→29→30→0的空闲链；这是抽象链表画法，不能拿它当真实FAT16磁盘编码表。真实FAT有专门空闲与结束标记，图上“块1”也不能直接套为数据簇的标准编号。省略号里的条目未逐个给出，本文不补造。

### p.12–13：目录文件的内容仍要按目录项解释

> **p.12** Directory is also a kind of file in FAT. (Directory entries)
>
> In FAT16, the length of a directory entry is 32 bytes

原FAT16目录项32B：名字11B（8字符主体+3扩展名）、属性在0x0B、首簇低位在0x1A占2B、文件大小在0x1C占4B。p.12表中写时间字段占位等，具体保留位随FAT版本与扩展变化，这里按给定布局读。

**补充演算**：若一目录数据簇2048B、每短目录项32B，可放64项；长文件名会占额外项，不能直接说一定容64个任意文件名。

p.13根目录有rock.mp3（首簇0x0002）和test目录（首簇0x0008）；test内有ubuntu.iso（首簇0x0014=20）。路径test/ubuntu.iso先在根找到test，再读其目录数据找ubuntu.iso，最后从20沿文件链读数据。该图是新示例，首簇与p.11不同，不应强行拼成一张磁盘。

表（p.12，视觉读取）：原页完整目录项布局

| 名称 | Offset | Size（B） | 原页说明 |
|---|---|---:|---|
| DIR_Name | 0x00 | 11 | 前 8 字节名字、后 3 字节扩展名 |
| DIR_Attr | 0x0B | 1 | 原页以 0x10 示目录、0x20 示文件 |
| DIR_NTRes | 0x0C | 1 | reserved |
| DIR_CrtTimeTenth | 0x0D | 1 | reserved |
| DIR_CrtTime | 0x0E | 2 | reserved |
| DIR_CrtDate | 0x10 | 2 | reserved |
| DIR_LstAccDate | 0x12 | 2 | reserved |
| DIR_FstClusHI | 0x14 | 2 | reserved |
| DIR_WrtTime | 0x16 | 2 | 最近修改时间 |
| DIR_WrtDate | 0x18 | 2 | 最近修改日期 |
| DIR_FstClusLO | 0x1A | 2 | 文件首簇号 |
| DIR_FileSize | 0x1C | 4 | 文件大小 |

**逐项检验**：最后字段从十进制 28 起，占 4 字节，覆盖 28、29、30、31，因此整个条目恰为 32B。名字字段 0–10 共 11B，属性紧接在第 11B。读取首簇时去 0x1A，读取大小时去 0x1C，两者仅差 2B，读错偏移就会把簇号当文件大小。表中 reserved 是本课件的简化写法，不意味着所有 FAT 版本都完全忽略这些时间或高位字段；0x20 也不应被推广成所有普通文件唯一的属性值。

### p.14–16：比较要落到访问成本

> **p.14** Comparing FAT and File Systems discussed in class

> **p.14** FAT File System:
>
> Advantages:
>
> Simple and easy to implement.
>
> Low overhead for small devices with limited storage.
>
> Universally compatible, supported by most operating systems.
>
> Disadvantages:
>
> Poor scalability for large storage systems.
>
> Fragmentation issues as files grow.
>
> Inefficient for managing large directories or large numbers of files.

> **p.15** Todays file system (discussed in class)
>
> Advantages:
>
> Supports large-scale file systems with hierarchical structure.
>
> Efficiently handles large directories and files.
>
> Better at minimizing fragmentation due to advanced allocation strategies.
>
> Disadvantages:
>
> More complex to implement and maintain.
>
> Higher overhead in metadata storage.
>
> Requires additional steps to access data through inodes.

FAT结构简单、广泛支持，但长链随机访问往往要沿链接寻找，扩展后可能分散。inode索引结构可通过多级索引定位文件块，也付出元数据与实现复杂度。课件的“现代系统更好”只是概述，实际性能由分配策略、缓存、文件规模和工作负载决定，不能无条件宣称任何inode系统都无碎片。

p.16为Q&A。FAT是Tutorial新展开内容，保留于本文，不把主讲未教的FAT细节默认写入Lecture课程索引。

**补充：为什么知道文件内第几个簇，不等于知道磁盘簇号。** 目录项只给起始簇。若想找文件内编号 k 的簇，在没有额外索引且从头开始的链式模型中，需要沿 FAT 后继走 k 次；k 从 0 开始，编号 0 就是起始簇，不能再多走一次。取得目标簇号之后，才把簇内偏移用于定位数据。

FAT 表已经缓存在内存时，这些跟链动作主要是内存查表，并不表示每一步必有一次磁盘 I/O；表不在缓存时又有另一套代价。顺序读取可记住刚走到的位置，下一簇只跟一次后继；每次都从头查会把程序自己的重复工作误算成格式必需成本。比较 FAT 与 inode 索引时，先固定随机还是顺序访问、缓存是否命中、是否保留当前位置，再讨论访问次数。

## 本讲核心考点

- [C] 根据目录首簇与FAT下一簇值追踪文件链。
- [C] 用向上取整算分配簇数、分配空间和slack。
- [C] 区分目录项、FAT项和数据簇。
- [C] 识别教学图的抽象结束标记与真实磁盘编码的边界。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[T12-FAT文件系统-2025T2.pptx](../辅导/T12-FAT文件系统-2025T2.pptx)；[PDF副本](PDF/T12-FAT文件系统-2025T2.pdf) p.1–16。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
