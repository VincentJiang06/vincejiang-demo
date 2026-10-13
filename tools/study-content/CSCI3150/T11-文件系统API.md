# CSCI3150 T11 文件系统API

> 课程：CSCI3150 Introduction to Operating Systems · 2025T2
> 本讲：T11 文件系统API · 原件 [T11-文件系统API-2025T2.pptx](../辅导/T11-文件系统API-2025T2.pptx) · [PDF页码副本](PDF/T11-文件系统API-2025T2.pdf) p.1–21
> 定位：从inode元数据回到文件名、描述符与目录接口，区分删除名字和释放对象。
> 前后：演练 [L04](L04-系统调用-文件与目录.md)、[L05](L05-文件系统实现.md)；后接 [T12](T12-FAT文件系统.md)。

## 逐页伴读

### p.1–3：文件系统接口复习入口

> **p.1** Tutorial 11: File System API
>
> CSCI3150 Introduction to Operating Systems, Spring 2026

封面2026年4月2日，p.2作业发布/截止是历史信息；p.3为结构章节标题。对应主讲L04接口、L05实现。

### p.4–5：inode存属性与块索引，目录存名字关系

> **p.4** Divide the disk into blocks (Blk size is 4KB)
>
> Address from 0 to N-1
>
> Superblock: contains metadata information for a file system
>
> Bitmap: each bit indicated free (0) or in-use (1)
>
> Inode/Data Bitmap: for inode/data region
>
> Inode blocks: meta-information of a file + pointers to the data blks
>
> File/directory/link/device/socket all have inode
>
> Metadata: File size, permissions, owner, timestamps, etc.
>
> Data blocks: Store the data

> **p.5** Each level-0 or outermost inode is divided into several different fields:
>
> File attribute: most of the good stuff that ls -l reports is stored here
>
> Direct mappings: Entries containing direct forward mappings. These mappings provide a mapping from the logical block number to the location of the physical block on disk
>
> Indirect\_1 Mappings: Entries containing indirect mapping requiring one level of indirection.
>
> Indirect\_2 Mappings: Entries containing indirect mappings requiring two levels of indirection.
>
> Indirect\_3 Mappings: Entries containing mappings requiring three levels of indirection.

4KiB块示意把磁盘分superblock、位图、inode区和数据区；位图记录分配状态。inode含权限、大小、时间和数据块指针，目录项连接人类名称与底层对象标识。图p.5直接指针一次到数据块，一级间接先到索引块，二级再多经过一层；层数越多，覆盖能力越大，但冷访问所需元数据读取也增多。

### p.6–8：API表按职责读，勿把不同平台混成一个接口族

> **p.8** stat(): Show the File metadata
>
> metadata is information about each file, ex: size, permission, ..
>
> stat structure is below:

**课件程序与接口（p.8，原页片段）**

```text
struct stat {
     dev_t st_dev; /* ID of device containing file */
     ino_t st_ino; /* inode number */
     mode_t st_mode; /* protection */
     nlink_t st_nlink; /* number of hard links */
     uid_t st_uid; /* user ID of owner */
     gid_t st_gid; /* group ID of owner */
     dev_t st_rdev; /* device ID (if special file) */
     off_t st_size; /* total size, in bytes */
     blksize_t st_blksize; /* blocksize for filesystem I/O */
     blkcnt_t st_blocks; /* number of blocks allocated */
     time_t st_atime; /* time of last access */
     time_t st_mtime; /* time of last modification */
     time_t st_ctime; /* time of last status change */
};
```

p.6是API标题，p.7混列POSIX、C库、Python和Windows函数，只为比较职责。rename重命名不等于open/close，opendir/readdir属于目录访问库接口，也不宜一概称为一条独立系统调用。

p.8 stat字段：st_size逻辑字节数，st_blocks已分配块计数，st_blksize建议I/O块大小；st_mtime是内容修改时间，st_ctime是状态更改时间，不是创建时间。

**表（p.7）：课件完整字段与状态。** 下表保留原页术语和数值；读写轨迹的同一格按原页由上到下排列，空格以“—”表示。

| Feature | Description | Examples |
|---|---|---|
| File Metadata Handling | Operations to access or modify file metadata such as size, permissions, and modification date. | stat(), os.stat() |
| File Opening and Closing | Functions to open and close files for various operations like reading, writing. | open(), fopen(), CreateFile(), rename() |
| File Reading and Writing | Methods to read from and write to files in different modes (binary or text). | read(), write(), fread(), WriteFile() |
| File Positioning | Functions to manipulate the read/write pointer's position within a file (seek operations). | lseek(), fseek(), SetFilePointer() |
| File Creation and Deletion | Functions to create or delete files and directories. | unlink(), os.remove(), DeleteFile() |
| Directory Management | Tools for handling directories, including creation, deletion, and listing contents. | mkdir(), os.mkdir(), shutil.rmtree() |
| Link Creation and Deletion | Create a direct link to the same underlying file content/shortcut or pointer to another file or directory. | link(), symlink(), unlink() |

### p.9–11：大小、原子替换与unlink

**课件程序与接口（p.9，原页片段）**

```text
prompt> echo hello > file
prompt> stat file

File: ‘file’
Size: 6 Blocks: 8 IO Block: 4096 regular file
Device: 811h/2065d Inode: 67158084 Links: 1
Access: (0640/-rw-r-----) Uid: (30686/ root) Gid: (30686/ remzi)
Access: 2011-05-03 15:50:20.157594748 -0500
Modify: 2011-05-03 15:50:20.157594748 -0500
Change: 2011-05-03 15:50:20.157594748 -0500
```

**课件程序与接口（p.10，原页片段）**

```text
int fd = open("foo.txt.tmp", O_WRONLY|O_CREAT|O_TRUNC);
 write(fd, buffer, size); // write out new version of file
 fsync(fd);
 close(fd);
 rename("foo.txt.tmp", "foo.txt");
```

> **p.11** The result of strace to figure out what rm is doing.
>
> rm is Linux command to remove a file
>
> rm calls unlink() to remove a file.

**课件程序与接口（p.11，原页片段）**

```text
prompt> strace rm foo
...
unlink(“foo”)
...
prompt>
```

原例 `echo hello > file`写hello加换行，共6B；stat显示Blocks8、IO Block4096。在该Unix示例的512B计量约定下，8×512=4096B分配空间，与逻辑6B并不矛盾。

保存流程写临时文件→fsync→close→rename替换目标，读者可看到旧或新名字绑定，不应看到重命名的中间一半。原open使用O_CREAT却漏mode参数，真实代码须补，例如0600，并处理短写与错误；若讨论崩溃持久性，目录更新持久化也是额外问题，不能把原子可见性等同绝对落盘保证。

p.11 strace观察rm调用unlink，删除的是目录中的名称引用。尚有其他硬链接或打开引用时，对象可能继续存在。

### p.12–14：目录不是任意格式的文本

> **p.12** mkdir(): Make a directory
>
> When a directory is created, it is empty.
>
> Empty directory have two entries: . (itself), ..(parent)

**课件程序与接口（p.12，原页片段）**

```text
prompt> ls -al
total 8
drwxr-x--- 2 roo root 6 Apr 30 16:17 ./
drwxr-x--- 26 root root 4096 Apr 30 16:17 ../
```

> **p.13** readdir()
>
> Directory is a file, but with a specific structure.
>
> When reading a directory, we use specific system call other than read().
>
> A sample code to read directory entries.

**课件程序与接口（p.13，原页片段）**

```text
int main(int argc, char *argv[]) {
  DIR *dp = opendir("."); /* open current directory */
  assert(dp != NULL);
  struct dirent *d;
  while ((d = readdir(dp)) != NULL) { /* read one directory entry */
   printf("%d %s\n", (int) d->d_ino, d->d_name);
  }
  closedir(dp); /*close current directory */
  return 0;
 }
```

**课件程序与接口（p.14，原页片段）**

```text
struct direct {
char d_name[256]; /* filename */
ino_t d_ino; /* inode number */
off_t d_off; /* offset to the next dirent */
unsigned short d_reclen; /* length of this record */
unsigned char d_type; /* type of file */
};
```

mkdir创建目录，Unix目录示意含`.`和`..`；readdir逐个返回目录项，示例打印inode号和名字，最后closedir。返回NULL需结合错误状态区分目录末尾与失败，原assert示例只做简化。

p.14结构名写struct direct，与常用struct dirent不一致；字段具体布局按接口与平台，不能假定所有目录项都固定为课件画的C结构。d_type也可能未知，不能在所有文件系统上完全代替stat。

### p.15–17：硬链接给同一对象再添名字

> **p.15** rmdir(): Delete a directory.
>
> rmdir()requires directory be empty before it deleted.
>
> If you call rmdir()to a non-empty directory, it will fail.

> **p.16** link(): Link old file and a new file.
>
> Create hard link named file2.
>
> The result of link()
>
> Two files have same inode number, but two human name(file, file2)

**课件程序与接口（p.16，原页片段）**

```text
prompt> echo hello > file
prompt> cat file
hello
prompt> ln file file2 /* create a hard link, link file to file2 */
prompt> cat file2
hello
```

**课件程序与接口（p.16，原页片段）**

```text
prompt> ls -i file file2
67158084 file  /* inode value is 67158084 */
67158084 file2 /* inode value is 67158084 */
prompt>
```

> **p.17** How to create hard link file?
>
> Step1. Make an inode, track all information about the file.
>
> Step2. Link a human-readable name to file.
>
> Step3. Put link file into a current directory.
>
> After creating a hard link to file, old and new files have no difference.
>
> Thus, to remove a file, we call unlink().

rmdir要求目录空。原例ln file file2后两个名字都显示inode67158084，说明共享同一inode；修改数据经任一名字都作用到同一对象。p.17“Make an inode”描述若用于已有文件的新硬链接并不准确：link新增目录项并增加链接数，不为同一文件复制一份新inode。

### p.18–20：最后一个名字删除，不一定立刻释放

> **p.18** What unlink() is doing ?
>
> Check reference count within the inode number.
>
> Remove link between human-readable name and inode number.
>
> Decrease reference count.
>
> When only it reaches zero, It delete a file (free the inode and related blocks)

> **p.19** Symbolic link
>
> Special file that contains path to the source directory.
>
> Hard Link cannot create to a directory.
>
> Hard Link cannot create to a file to other partition.
>
> An example of symbolic link

**课件程序与接口（p.19，原页片段）**

```text
prompt> echo hello > file
prompt> ln –s file file2  /* option –s : create a symbolic link, */
prompt> cat file2
hello
```

> **p.20** Symbolic link is different file type.
>
> Symbolic link is subject to the dangling reference.

**课件程序与接口（p.20，原页片段）**

```text
prompt> ls -al
drwxr-x--- 2 remzi remzi 29 May 3 19:10 ./
drwxr-x--- 27 remzi remzi 4096 May 3 15:14 ../       /* directory */
-rw-r----- 1 remzi remzi 6 May 3 19:10 file          /* regular file */
lrwxrwxrwx 1 remzi remzi 4 May 3 19:10 file2 -> file /* symbolic link */
```

**课件程序与接口（p.20，原页片段）**

```text
prompt> echo hello > file
prompt> ln -s file file2
prompt> cat file2
hello
prompt> rm file
prompt> cat file2
cat: file2: No such file or directory
```

unlink减少链接数；降为0后仍需考虑打开文件的引用，最后引用释放才可回收底层存储。符号链接则是另一个文件对象，内容是目标路径；可跨文件系统，也可指目录，目标消失后可能悬空。

原例file内容6B，file2软链内容是四字符路径`file`，所以ls显示软链大小4，不是复制了6B数据。删除file后cat file2失败，证明它保存路径而非维持目标inode的硬链接引用。相对目标路径相对于软链所在目录解析（补充）。

**补充：把链接变化记成对象账本。** 设a是普通文件，先open(a)得到fd，再link(a,b)，再unlink(a)，最后unlink(b)。四步后名字数从1→2→1→0，但fd依然指向最初打开的对象。在fd关闭前，进程仍可能读写这份没有名字的文件。若此时另创建新的a，它是另一个文件对象，旧fd不会因为名字复用了就自动跳过去。

软链接另有一层路径解释。若目录 `/x` 中的软链接s保存相对路径 `../y/f`，解析依据是s所在目录 `/x`，不是运行cat时碰巧所在的工作目录。移动软链接本身到另一目录后，同一段相对路径可能指向不同位置；硬链接则直接连接同文件系统的inode，不具有这段文本路径解释。这里路径为自取示意，不涉及本地用户目录。

:::hint 自测：stat看目标文件，lstat看软链接本身时，size为何可以不同？

目标size是目标内容的逻辑字节长度；软链接size描述链接里保存的路径文本长度。它们本来是两个对象的属性。使用工具时先确认是否跟随软链接，再解释结果，不能把小的那个说成文件内容丢失了。

:::endhint

### p.21：把三个层次分开

Q&A页。名字查目录、元数据在inode、进程访问通过fd/open file description；很多判断题的错误来自把这三层混成一个“文件”。

## 本讲核心考点

- [C] 区分逻辑大小、分配块数与建议I/O块长。
- [C] 解释rename原子可见性和临时文件保存步骤。
- [C] 推演硬链接、unlink、打开引用与软链悬空。

## 附录

本份没有需要移至附录的长推导；计算过程已在对应页正文写全。

## 来源与证据

- 原件：[T11-文件系统API-2025T2.pptx](../辅导/T11-文件系统API-2025T2.pptx)；[PDF副本](PDF/T11-文件系统API-2025T2.pdf) p.1–21。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
