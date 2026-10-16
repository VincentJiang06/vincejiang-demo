# CSCI3150 L11 TLB

> 课程：CSCI3150 Introduction to Operating Systems · 2022未核
> 本讲：L11 TLB，第 1 部分 / 共 2 部分 · 原件 [L11-TLB与高级分页-2022未核.pptx](../课件/L11-TLB与高级分页-2022未核.pptx) · [PDF页码副本](PDF/L11-TLB与高级分页-2022未核.pdf) p.1–18
> 定位：缓存地址转换，使页表不必在每次内存引用时重新读取。
> 前后：前接 [L10 分页](L10-P2-分页.md)；后接 [高级分页](L11-P2-高级分页.md)。

## 逐页伴读

p.1 是讲题，p.2–3 回到内存虚拟化在课程中的位置，p.4 是 Part I 标题。

### p.5–7：TLB 缓存的是翻译，不是目标数据

> **p.5** Part of the chip’s memory-management unit(MMU).
>
> A hardware cache of popular virtual-to-physical address translation.

> **p.6** (1 lines) extract the virtual page number(VPN).
>
> (2 lines) check if the TLB holds the transalation for this VPN.
>
> (5-8 lines) extract the page frame number from the relevant TLB entry, and form the desired physical address and access memory.

**课件伪代码（p.6，原页片段）**

```text
1: VPN = (VirtualAddress & VPN_MASK ) >> SHIFT
2: (Success , TlbEntry) = TLB_Lookup(VPN)
3: if(Success == Ture){ // TLB Hit
4:    if(CanAccess(TlbEntry.ProtectBit) == True ){
5:        offset = VirtualAddress & OFFSET_MASK
6:        PhysAddr = (TlbEntry.PFN << SHIFT) | Offset
7:        AccessMemory( PhysAddr )
8:    }else RaiseException(PROTECTION_ERROR)
```

> **p.7** (11-12 lines)  The hardware accesses the page table to find the translation.
>
> (16 lines) updates the TLB with the translation.

**课件伪代码（p.7，原页片段）**

```text
11:}else{ //TLB Miss
12:        PTEAddr = PTBR + (VPN * sizeof(PTE))
13:        PTE = AccessMemory(PTEAddr)
14:        (…)
15:        }else{
16:        TLB_Insert( VPN , PTE.PFN , PTE.ProtectBits)
17:        RetryInstruction()
18:        }
19:}
```

图 p.5 的入口是虚拟地址；命中 TLB 后得到物理页框，仍须访问目标内存。未命中则读取页表，校验映射，填入 TLB，再重试原指令。p.6 的命中分支也检查权限，命中不能绕开保护。

p.7 是删略伪代码，省略号不代表忽略 valid、present 或保护位。TLB miss 只说明转换没缓存；页可能早已在物理内存。Page fault 才可能需要 OS 找回缺席页，二者不是同义词。

**补充：把两种缓存的四种组合分开。** TLB 记录“虚拟页该去哪个物理框”；数据缓存记录“那个位置的内容副本”。翻译命中而数据缓存未命中时，已知道目标地址，仍要取得数据；翻译未命中而目标数据已经在缓存时，仍要先解决地址翻译与访问权限。两种“命中率”不能混加成一个指标。

本讲正常命中路径省去页表查找，不是省去访问目标内容。TLB miss 后，如果页表表示页已在 RAM，只需补翻译，未必发生磁盘 I/O；如果页表表示合法页尚未驻留，才沿缺页处理继续。做访存次数题，应先明确是否计 TLB 查询、页表层数、各级缓存与故障处理；不同题目的计数模型不一样，不能只背“一次、两次、三次”几个数。

### p.8–9：十次数组访问为什么三次 miss

**课件程序与接口（p.8，原页片段）**

```text
0:  int sum = 0 ;
1:  for( i=0; i<10; i++){
2:      sum+=a[i];
3:  }
```

> **p.9** Temporal Locality
>
> An instruction or data item that has been recently accessed will likely be re-accessed soon in the future.
>
> Spatial Locality
>
> If a program accesses memory at address x, it will likely soon access memory near x.

原图题设：页长 16 B，`int` 为 4 B，循环按顺序访问 `a[0]` 到 `a[9]`；前三个元素在 VPN6，中间四个在 VPN7，最后三个在 VPN8。只计数组数据访问，开始无这些转换且过程中不淘汰它们。

序列为 `6,6,6,7,7,7,7,8,8,8`，第一次碰到 6、7、8 各 miss 一次，其他七次 hit，命中率 $7/10=70\%$。数组没有重复访问同一元素，也能因同页邻近元素产生空间局部性。若立刻重复循环且三项仍保留，十次都可能命中，这才体现时间局部性。若把取指和其他变量也计入分母，不能继续直接引用 70%。

### p.10–11：谁填 TLB，条目包含什么

> **p.10** Hardware handle the TLB miss entirely on CISC.
>
> The hardware has to know exactly where the page tables are located in memory.
>
> The hardware would “walk” the page table, find the correct page-table entry and extract the desired translation, update and retry instruction.
>
> hardware-managed TLB.
>
> RISC have what is known as a software-managed TLB.
>
> On a TLB miss, the hardware raises exception( trap handler ).
>
> Trap handler is code within the OS that is written with the express purpose of handling TLB miss.

> **p.11** TLB is managed by Full Associative method.
>
> A typical TLB might have 32,64, or 128 entries.
>
> Hardware search the entire TLB in parallel to find the desired translation.
>
> other bits: valid bits , protection bits, address-space identifier, dirty bit

硬件管理时由页表遍历器完成；软件管理时 miss 引发异常，由 OS handler 查表并填入。课件以 CISC/RISC 作历史示例，不能推广为所有体系结构的永恒分类。

图 p.11 条目是 VPN、PFN 和状态位；全相联示意意味着可以在多个位置找匹配项。有效位表示该 TLB 条目可用，保护位检查访问，ASID 区分地址空间。课件列出的 32/64/128 项是示例规模，不是本机规格。

**补充：把一次访问的三种路径分开画。** 第一种，TLB有可用转换且权限允许：取得PFN，再访问目标数据。第二种，TLB没有该转换但PTE表明页已驻留：查页表、填TLB、继续或重试访问，不需要读盘。第三种，合法页尚未驻留：OS先安排取得页面，更新映射，再恢复执行。拒绝写只读页则是保护错误，不能通过“把页换入”修复。

假设TLB查询1ns、一次内存访问100ns、单级页表，按串行且无其他缓存的简化模型，命中用101ns，未命中但驻留用201ns；若命中率90%，平均为0.9×101+0.1×201=111ns。这是自取数字的模型，不是本机测速。它说明增加命中率省掉的是页表访问，并没有把数据访问本身省掉；若换成多级页表或重叠查询，就要重新写成本式。

### p.12–14：换进程后，同一个 VPN 会有两个答案

逐图看状态：p.12 A 访问 VPN10，缓存 10→100；p.13 切到 B，它的 VPN10 应映射到170；p.14 两条只以 VPN 匹配的记录无法区分主人。问题来自虚拟页号只在某个地址空间内有意义，不是系统全局的唯一标识。

### p.15–16：ASID 既隔离，也允许有意共享

> **p.15** Provide an address space identifier(ASID) field in the TLB.

> **p.16** Two processes share a page.
>
> Process 1 is sharing physical page 101 with Process2.
>
> P1 maps this page into the 10th page of its address space.
>
> P2 maps this page to the 50th page of its address space.

> **p.16** Sharing of physical pages is useful as it reduces the number of physical pages in use.

加 ASID 后，`(1,10)→100` 与 `(2,10)→170` 不冲突。另一种方案是切换时清空旧转换，但会付出后续冷 miss。

p.16 的共享例子改为 `(1,10)→101` 与 `(2,50)→101`。两个进程虚拟地址可以不同，仍看到同一物理页；映射相同的 PFN 才是共享的关键。ASID 区分查询键，并不要求 PFN 不同。

### p.17–18：LRU 更新“最近”，真实条目增加硬件细节

> **p.17** LRU(Least Recently Used)
>
> Evict an entry that has not recently been used.
>
> Take advantage of locality in the memory-reference stream.

> **p.18** 10 11  …                     19     …                                  31

> **p.18** All 64 bits of this TLB entry(example of MIPS R4000)

原题是容量三项、初始为空、按顺序访问 `7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1`，使用 LRU。命中也必须更新最近使用次序，不能只在 miss 时移动。完整逐步表在本节下方，得到11次 miss、6次hit，命中率 $6/17\approx35.29\%$。

p.18 用 MIPS R4000 介绍 G、ASID、C、D、V 等字段：全局共享、地址空间识别、缓存属性、修改和有效性是不同职责。旧PDF兼容图片的PFN行误显周转时间式；PPTX正文层实际为24位PFN、4KiB页，可寻址2^24×2^12=2^36B=64GiB主存。19位VPN对应此图限定的用户虚拟页范围，不能拿它直接替代PFN宽度。

:::hint 自测：页表映射改了，但旧TLB条目仍在，会怎样？ASID是否自动解决？

TLB可能继续把访问送到旧PFN，甚至沿用旧权限；缓存转换必须与映射更新保持一致。ASID只区分条目属于哪个地址空间，并不自动让同一地址空间内的旧映射失效。实际内核需按硬件协议使相关转换失效，多核还需协调可能缓存该转换的其他核。这是正确性需求，不只是命中率问题。

:::endhint

**p.18 完整字段释义（按 PPTX 正文层重排）：**

|字段|原页含义|
|---|---|
|19-bit VPN|此示例的虚拟页号，其余虚拟范围保留给内核|
|24-bit PFN|物理框号；4 KiB 页下覆盖 64 GiB|
|G|跨进程全局共享页的标记|
|ASID|区分地址空间|
|C|决定硬件如何缓存该页的缓存属性|
|D|标记该页已被写入|
|V|该条目是否含有效转换|

VPN/ASID 用来判断“是不是我要的那条转换”，PFN 回答“转到哪里”，其他位限定“是否可用及怎样使用”。64 位是图中整条 TLB 记录的宽度，不能将 64 直接代入成该例的虚拟地址位数。

<a name="lru"></a>

#### 原课件 p.17 的 LRU 全过程

| 步 | 页号 | 结果 | 淘汰 | 由最旧到最新 |
|---|---|---|---|---|
| 1 | 7 | 未命中 | — | 7 |
| 2 | 0 | 未命中 | — | 7,0 |
| 3 | 1 | 未命中 | — | 7,0,1 |
| 4 | 2 | 未命中 | 7 | 0,1,2 |
| 5 | 0 | 命中 | — | 1,2,0 |
| 6 | 3 | 未命中 | 1 | 2,0,3 |
| 7 | 0 | 命中 | — | 2,3,0 |
| 8 | 4 | 未命中 | 2 | 3,0,4 |
| 9 | 2 | 未命中 | 3 | 0,4,2 |
| 10 | 3 | 未命中 | 0 | 4,2,3 |
| 11 | 0 | 未命中 | 4 | 2,3,0 |
| 12 | 3 | 命中 | — | 2,0,3 |
| 13 | 2 | 命中 | — | 0,3,2 |
| 14 | 1 | 未命中 | 0 | 3,2,1 |
| 15 | 2 | 命中 | — | 3,1,2 |
| 16 | 0 | 未命中 | 3 | 1,2,0 |
| 17 | 1 | 命中 | — | 2,0,1 |

表中队列右端是最新访问项，故 miss 且满时淘汰左端。[回正文](#逐页伴读)。

## 本讲核心考点

- [C] 明确 TLB 缓存转换，区分 TLB miss 与缺页。
- [C] 在给定计数范围下计算数组访问命中率。
- [C] 用 ASID 解释上下文切换与共享映射。
- [C] 逐次维护 LRU，包括命中引起的顺序变化。

## 附录

完整演算已放回相应页的正文，原链接锚点继续保留。

## 来源与证据

- 原件：[L11-TLB与高级分页-2022未核.pptx](../课件/L11-TLB与高级分页-2022未核.pptx)；[PDF副本](PDF/L11-TLB与高级分页-2022未核.pdf) p.1–18。本文页码均为 PDF 页号。
- 考试证据：读了 课程大纲-2026T1.pdf、教学计划-2026T1.pdf、T08-期中参考-2025T2-题目-解答.pdf、T07-多级反馈队列-2025T2.pdf（p.13–15内嵌历史试题）；未识别用途的 PDF：无

- 2026-10-13 内容补全：保留原页顺序与版本，补入对应页的程序、接口、字段、条件和演算；原程序片段保留课件行号、拼写与省略处，不能据此视为经过编译的完整软件。本文已有运行记录属于其标注日期，本次未重新运行课程容器或提交作业。
