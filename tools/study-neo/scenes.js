// Original mechanism drawings for the eight course units. Coordinates are logical pixels.
(() => {
  'use strict';
  const W = 520;
  const C = {
    ink: '#1c3028', teal: '#26604c', green: '#dce8c9', dark: '#294a39',
    orange: '#995431', peach: '#f7e1cd', edge: '#6a796d', soft: '#e9ede2',
    white: '#fffef8', muted: '#465c4c', gold: '#a45e35'
  };
  const scenes = new Map();
  const add = (key, title, height, caption, draw) => scenes.set(key, {title, height, caption, draw});

  function pen(ctx) {
    function text(x, y, value, size = 18, opts = {}) {
      const {align = 'center', color = C.ink, weight = 560, mono = false} = opts;
      ctx.save();
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.font = weight + ' ' + size + 'px ' + (mono
        ? 'ui-monospace, Menlo, Consolas, "PingFang SC", monospace'
        : '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif');
      ctx.fillText(value, x, y);
      ctx.restore();
    }
    function rect(x, y, w, h, fill = C.white, stroke = C.edge, r = 6) {
      ctx.beginPath();
      if (r) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      if (fill) {ctx.fillStyle = fill; ctx.fill();}
      if (stroke) {ctx.lineWidth = 1.6; ctx.strokeStyle = stroke; ctx.stroke();}
    }
    function box(x, y, w, h, value, fill = C.white, size = 18) {
      rect(x,y,w,h,fill);
      text(x+w/2,y+h/2,value,size);
    }
    function line(points, {color = C.edge, width = 2, dash = [], arrow = false} = {}) {
      ctx.save();
      ctx.beginPath();
      ctx.setLineDash(dash);
      ctx.lineWidth = width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      points.forEach(([x,y],i) => i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      ctx.stroke();
      if (arrow) {
        const [x,y] = points.at(-1);
        const [u,v] = points.at(-2);
        const angle = Math.atan2(y-v,x-u);
        ctx.translate(x,y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0,0); ctx.lineTo(-9,-4.7); ctx.lineTo(-9,4.7);
        ctx.closePath(); ctx.fillStyle = color; ctx.fill();
      }
      ctx.restore();
    }
    function arrow(points, color = C.teal, extra = {}) {
      line(points, {color, arrow:true, ...extra});
    }
    function dot(x,y,r,fill,value,size = 18) {
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = C.edge;
      ctx.lineWidth = 1.6; ctx.stroke();
      if (value !== undefined) text(x,y,value,size);
    }
    function label(x,y,value) {text(x,y,value,16,{color:C.muted});}
    return {text,rect,box,line,arrow,dot,label};
  }

  add('overview/instruction','取指、译码与写回的硬件通路', 267,
    'PC 给出地址 40，内存把这条指令送入 IR。译码取得立即数 3，ALU 把它与寄存器 R 的旧值 5 相加，再把结果 8 写回 R。图中箭头表示这条指令的信息流。',
    ({rect,box,arrow,text,label}) => {
      rect(14,16,168,147,C.soft); text(98,38,'主存');
      box(26,66,144,66,'ADD R,3',C.white,20);
      label(98,149,'字节地址 40');
      rect(219,16,287,233,null); text(362,38,'处理器 CPU');
      box(250,57,96,38,'PC = 40',C.green);
      box(251,104,95,40,'IR',C.green);
      arrow([[250,75],[200,75],[200,84],[170,84]]);
      arrow([[170,119],[250,119]]);
      box(393,104,91,40,'R = 5',C.peach);
      box(310,191,102,39,'ALU  +',C.green);
      arrow([[299,145],[299,168],[335,168],[335,190]]); label(257,174,'立即数 3');
      arrow([[438,145],[438,169],[389,169],[389,189]]);
      arrow([[414,212],[493,212],[493,125],[485,125]],C.orange); label(454,228,'写回 8');
    });

  add('overview/private-address','同一虚拟地址的两条私人映射', 225,
    '进程 A 和 B 各有一个私有变量，两者的虚拟地址都是 0x1000。A 的地址映射到物理位置 P，B 的地址映射到 Q。A 写入 9 后，P 的值变为 9，Q 的值仍为 2。',
    ({box,rect,arrow,text}) => {
      text(105,26,'虚拟地址空间'); text(379,26,'物理内存');
      box(24,59,157,40,'进程 A · 0x1000',C.green);
      box(24,158,157,40,'进程 B · 0x1000',C.peach);
      rect(304,47,158,156,null);
      for (let i=0;i<5;i++) {
        const y=50+i*30;
        const highlight=i===0||i===4;
        box(310,y,146,29,highlight?(i===0?'P     9':'Q     2'):'· · ·', i===0?C.green:i===4?C.peach:C.soft,16);
      }
      arrow([[182,79],[236,79],[236,65],[308,65]]);
      arrow([[182,178],[254,178],[254,185],[308,185]],C.orange);
    });

  add('syscalls/fork','把两次 fork 画在执行流上', 239,
    '第一次成功调用把 P 的执行流分成 P 和 C1。第二次 P 产生 C2，C1 产生 C3。绿色横箭头表示同一进程继续，橙色折线表示新子进程从返回点继续。横向距离不表示实际调度时间。',
    ({box,arrow,text,label}) => {
      text(75,22,'起点'); text(238,22,'第一次返回'); text(435,22,'第二次返回');
      box(29,48,92,33,'P',C.green);
      box(189,48,97,33,'P',C.green); box(189,149,97,33,'C1',C.peach);
      [[48,'P'],[95,'C2'],[149,'C1'],[196,'C3']].forEach(([y,id],i)=>box(390,y,93,33,id,i===0?C.green:C.peach));
      arrow([[122,64],[188,64]]);
      arrow([[129,65],[165,65],[165,166],[188,166]],C.orange);
      arrow([[287,64],[389,64]]); arrow([[296,66],[335,66],[335,111],[389,111]],C.orange);
      arrow([[287,166],[389,166]]); arrow([[296,168],[335,168],[335,212],[389,212]],C.orange);
      label(73,111,'原进程'); label(148,213,'两边均继续');
    });

  add('syscalls/open-file','描述符、打开记录与文件对象', 235,
    '示例中 fd 3 和 fd 4 来自两次 open，随后用 dup(3) 得到 fd 5。fd 3 与 fd 5 共享打开记录 A，经任意一个读两字节都会把 A 的偏移推到 2。记录 B 的偏移仍是 0，两份记录引用同一文件。',
    ({box,arrow,text}) => {
      text(74,28,'进程 fd 表'); text(259,28,'内核打开记录'); text(444,28,'文件对象');
      [[62,'3'],[117,'5'],[172,'4']].forEach(([y,t],i)=>box(32,y,80,38,'fd '+t,i<2?C.green:C.peach));
      box(187,76,147,51,'A   偏移 2',C.green); box(187,166,147,51,'B   偏移 0',C.peach);
      box(390,97,107,76,'ABCDEF');
      arrow([[113,80],[148,80],[148,92],[186,92]]);
      arrow([[113,137],[154,137],[154,111],[186,111]]);
      arrow([[113,191],[186,191]],C.orange);
      arrow([[335,101],[360,101],[360,115],[389,115]]);
      arrow([[335,191],[368,191],[368,153],[389,153]],C.orange);
    });

  add('syscalls/links','名字直接指向 inode，符号链接保存路径', 231,
    'draft 和 saved 两个目录项直指 inode 30。current 先指向符号链接自己的 inode，里面存着字符串 draft。解析该字符串要回目录查名字。删除 draft 后，这一步失败，而 saved 仍能到达 inode 30。',
    ({box,arrow,text,label}) => {
      text(84,21,'目录里的名字'); text(350,21,'文件系统对象');
      box(25,53,123,34,'draft',C.green); box(25,101,123,34,'saved',C.green);
      box(25,173,123,35,'current',C.peach);
      box(289,58,194,65,'普通文件 · inode 30',C.green,17);
      box(257,168,231,45,'链接 inode · 内容 draft',C.peach,17);
      arrow([[149,70],[288,70]]);
      arrow([[149,118],[207,118],[207,105],[288,105]]);
      arrow([[149,191],[256,191]],C.orange);
      arrow([[308,166],[308,147],[14,147],[14,70],[24,70]],C.orange,{dash:[5,5]});
      label(387,147,'按字符串再查名');
    });

  add('filesystem/index-tree','逻辑块号决定要经过几层索引', 254,
    '每条横线只画目标块的一条寻址路线。逻辑块 0 走直接指针；逻辑块 12 走单间接索引的第 0 项；逻辑块 1036 先走双间接根的第 0 项，再走下一级的第 0 项。绿色终点保存文件字节。',
    ({rect,box,arrow,text,label}) => {
      text(82,25,'inode 指针'); text(275,25,'索引块'); text(449,25,'数据块');
      rect(17,45,121,179,C.soft);
      const rows=[59,115,173];
      ['直接 [0]','单间接','双间接'].forEach((s,i)=>box(27,rows[i],101,34,s,C.white,16));
      [0,12,1036].forEach((n,i)=>box(399,rows[i],103,34,'逻辑 '+n,C.green,16));
      arrow([[129,76],[398,76]]);
      box(226,115,83,34,'项 [0]',C.peach,16);
      arrow([[129,132],[225,132]]); arrow([[310,132],[398,132]]);
      box(161,173,83,34,'项 [0]',C.peach,16); box(286,173,83,34,'项 [0]',C.peach,16);
      arrow([[129,190],[160,190]]); arrow([[245,190],[285,190]]); arrow([[370,190],[398,190]]);
      label(277,234,'一个索引块可存 1024 个块号');
    });

  add('filesystem/byte-range','把读取区间叠在逻辑块边界上', 207,
    '每个宽格代表 1000 字节。阴影从逻辑块 1 的最后 80 字节开始，覆盖整个块 2，再进入块 3 的前 420 字节。映射后的数据块号依次是 7、18、51。阴影两端分别位于偏移 1920 和排他的终点 3420。',
    ({rect,box,line,arrow,text,label}) => {
      const left=39,step=146,top=74;
      [1,2,3].forEach((i,k)=>{text(left+(k+.5)*step,28,'逻辑块 '+i);rect(left+k*step,top,step,38,C.soft,C.edge,0);});
      const start=left+.92*step,stop=left+2.42*step;
      [0,1,2].forEach(k=>{
        const l=Math.max(left+k*step,start),r=Math.min(left+(k+1)*step,stop);
        if (r>l) rect(l,top+1,r-l,36,C.green,null,0);
      });
      [1,2].forEach(k=>line([[left+k*step,top],[left+k*step,top+38]]));
      [start,stop].forEach(x=>line([[x,62],[x,115]],{color:C.orange,width:2.5}));
      text(start-3,53,'1920',16); text(stop,53,'3420',16);
      [7,18,51].forEach((n,i)=>{
        const x=left+(i+.5)*step;
        arrow([[x,114],[x,143]]); box(x-49,146,98,33,'盘块 '+n,C.white,16);
      });
      label(260,195,'阴影部分共计 80 + 1000 + 420 字节');
    });

  add('devices/paths','从主系统的互连追到外设', 223,
    '这是一种简化布线。处理器可以经内存通道访问 RAM，也能经 I/O 互连访问设备控制器的接口。控制器再通过外围接口和设备交换数据。控制器框内上层是软件可见的寄存器。',
    ({rect,box,line,text,label}) => {
      box(26,44,100,49,'CPU',C.green);
      box(377,44,115,49,'主存 RAM',C.green);
      line([[127,69],[376,69]],{color:C.teal,width:4});
      label(250,48,'内存通道');
      line([[76,94],[76,162],[186,162]],{color:C.edge,width:4}); label(113,139,'I/O 互连');
      rect(186,108,161,98,C.soft); text(266,128,'设备控制器',18);
      box(196,148,141,42,'寄存器接口',C.white,17);
      line([[348,162],[408,162]],{color:C.edge,width:4});
      box(410,140,88,46,'外设',C.peach); label(389,195,'外围接口');
    });

  add('devices/dma','一次 DMA 写请求有两条不同的通路', 250,
    '虚线表示控制和通知。CPU 先设置 DMA 的地址、长度和方向，完成后可收到中断。下方粗实线表示一批批流动的 64 KiB 数据，沿 RAM、DMA、设备方向传送。',
    ({box,arrow,text,label}) => {
      box(196,15,127,42,'CPU / 驱动',C.green);
      box(20,165,112,48,'主存 RAM'); box(197,159,127,60,'DMA 引擎',C.peach);
      box(393,165,109,48,'目标设备');
      arrow([[216,58],[216,158]],C.teal,{dash:[6,5]}); label(138,95,'设置传输参数');
      arrow([[303,158],[303,58]],C.orange,{dash:[6,5]}); label(370,117,'完成中断');
      arrow([[133,189],[196,189]],C.teal,{width:5});
      arrow([[325,189],[392,189]],C.teal,{width:5});
      text(260,236,'RAM 中的 65 536 字节流向设备',16);
    });

  add('cpu/states','运行、就绪和阻塞之间的四条边', 240,
    '上方双向边表示就绪进程可以获调度开始运行，也可以因抢占回到就绪。右下边表示运行者等待 I/O 而阻塞。完成事件把阻塞者送到就绪，进程仍须获调度才能运行。',
    ({box,arrow,label}) => {
      box(31,60,121,58,'就绪',C.green); box(367,60,122,58,'运行',C.green);
      box(196,173,130,47,'阻塞',C.peach);
      arrow([[153,77],[366,77]]); label(260,58,'调度');
      arrow([[366,102],[153,102]],C.orange); label(260,127,'抢占或时间片结束');
      arrow([[427,119],[427,196],[327,196]],C.orange); label(468,160,'等待 I/O');
      arrow([[195,196],[91,196],[91,119]]); label(92,224,'I/O 完成');
    });

  add('cpu/feedback','把作业的降级画在优先级坐标上', 253,
    '每一行是一层就绪队列，横轴是时间。A 依次用满两个 4 ms 时间片，从 Q2 降到 Q1，再降到 Q0。8–9 ms 新到的 B 在 Q2 运行；B 等待输入后，A 从 Q0 接着运行。浅色虚线表示 A 已在低层等待。',
    ({box,line,arrow,text,label}) => {
      const levels=[59,120,181], time=t=>82+t*32;
      [2,1,0].forEach((q,i)=>{
        text(42,levels[i]+14,'Q'+q,19);
        line([[74,levels[i]+15],[494,levels[i]+15]],{color:'#cbd3c6',dash:[3,5]});
      });
      box(time(0),59,128,30,'A',C.green);
      arrow([[time(4),90],[time(4),119]]);
      box(time(4),120,128,30,'A',C.green);
      arrow([[time(8),151],[time(8),180]]);
      box(time(8),59,32,30,'B',C.peach,16);
      line([[time(8),196],[time(9),196]],{color:C.teal,dash:[3,4],width:3});
      box(time(9),181,96,30,'A',C.green);
      [0,4,8,9,12].forEach(t=>{
        const x=time(t); line([[x,217],[x,226]]); label(x,237,''+t);
      });
      label(453,39,'时间 / ms'); label(257,28,'从 Q2 到 Q0 优先级递减');
    });

  add('cpu/queues','一项迁移填上空核的运行位置', 225,
    '此例中 A 已完成。起初核 0 的本地队列为空，核 1 等着 B、C。迁移 B 后，每个核的队列各提供一项可运行工作。虚箭头连接 B 迁移前后的位置；任务执行时可能要在新核重新预热缓存。',
    ({rect,box,arrow,text,label}) => {
      text(102,22,'A 完成后'); text(397,22,'迁走 B 后');
      const lanes=[[57,'核 0'],[133,'核 1']];
      lanes.forEach(([y,name])=>{
        rect(18,y,176,49,C.soft); rect(326,y,176,49,C.soft);
        text(50,y+25,name,16); text(359,y+25,name,16);
      });
      text(127,82,'空',17); box(83,139,43,37,'B',C.peach); box(137,139,43,37,'C',C.green);
      box(405,63,52,37,'B',C.peach); box(405,139,52,37,'C',C.green);
      arrow([[105,137],[105,117],[261,117],[261,82],[325,82]],C.orange,{dash:[5,5]});
      label(258,145,'迁移 B'); label(258,205,'相同一组任务，不同的队列归属');
    });

  add('memory/paging','页内四位怎样原样到达物理地址', 235,
    '16 字节一页，VA 21 分成 VPN 01 和偏移 0101。页表项 1 给出页框 7，编码成 111，原先的低四位一路保留。拼接得到物理位串 1110101，即十进制 117。',
    ({rect,box,line,arrow,text,label}) => {
      const left=175,cell=44,y1=44,y2=153;
      '010101'.split('').forEach((v,i)=>box(left+i*cell,y1,cell,39,v,i<2?C.green:C.peach,20));
      '1110101'.split('').forEach((v,i)=>box(left-cell+i*cell,y2,cell,39,v,i<3?C.green:C.peach,20));
      text(94,63,'VA 21',19); text(69,173,'PA 117',19);
      label(218,23,'VPN'); label(350,23,'页内偏移');
      arrow([[219,85],[219,104]]); rect(140,104,119,29,C.soft);
      text(199,119,'页表 [1] = 7',16); arrow([[199,135],[199,152]]);
      for(let i=2;i<6;i++) {
        const x=left+(i+.5)*cell;
        arrow([[x,85],[x,151]],C.orange,{dash:[4,5]});
      }
      label(198,215,'PFN'); label(350,215,'同一页内偏移');
    });

  add('memory/tlb','一次地址翻译在哪里分成快慢两路', 280,
    '以合法、已驻留且访问权限允许的页为例。MMU 查询 TLB。命中便检查权限、拼回偏移后访问数据；未命中则走页表得到页框与权限，填入 TLB，重试原指令后走命中路径。',
    ({box,arrow,text,label}) => {
      box(35,23,123,38,'虚拟地址',C.white);
      box(233,20,188,44,'TLB 查 VPN',C.green); arrow([[160,42],[232,42]]);
      arrow([[282,65],[282,96],[138,96],[138,121]]); label(185,80,'命中');
      arrow([[367,65],[367,121]],C.orange); label(419,93,'未命中');
      box(32,124,208,44,'检查权限、拼回偏移',C.green,17);
      box(289,124,164,44,'查驻留页的页表',C.peach,17);
      arrow([[137,170],[137,205]]);
      box(53,207,169,46,'访问目标数据');
      arrow([[370,170],[370,205]],C.orange);
      box(296,207,151,46,'填入 TLB',C.peach);
      arrow([[448,230],[489,230],[489,42],[423,42]],C.orange,{dash:[6,5]});
      text(490,265,'重试',15,{align:'right',color:C.orange});
    });

  add('memory/walk','三段地址字段各自选择一个位置', 243,
    'VA 2643 的三个字段是目录下标 2、页表下标 9 和页内偏移 19。沿指针先在物理地址 648 读到二级表页框 20，再在 1316 读到数据页框 50，最后在该框内偏移 19 取地址 3219 的字节。',
    ({box,arrow,text,label}) => {
      const xs=[36,164,292],widths=[128,128,192];
      ['0010','1001','010011'].forEach((v,i)=>box(xs[i],44,widths[i],38,v,i===2?C.peach:C.green,20));
      ['目录 4 位','页表 4 位','页内 6 位'].forEach((v,i)=>label(xs[i]+widths[i]/2,23,v));
      const mx=[100,228,388];
      mx.forEach((x,i)=>{arrow([[x,83],[x,122]],i===2?C.orange:C.teal);});
      box(22,125,141,54,'目录项 [2]',C.green,17);
      box(190,125,134,54,'页表项 [9]',C.green,17);
      box(351,125,149,54,'字节 [19]',C.peach,17);
      arrow([[164,151],[189,151]]); arrow([[325,151],[350,151]]);
      label(88,202,'在地址 648'); label(255,202,'在地址 1316'); label(425,202,'在地址 3219');
      text(260,227,'表项的内容给出下一页的物理位置',16,{color:C.muted});
    });

  add('threads/address-space','两份栈内指针怎样落在同一个堆对象中', 245,
    '线程 A 和 B 属于同一进程。每个线程的调用帧都在自己的栈上，帧里各有一个局部指针 cursor。A 的 cursor 指向堆内录音块 H 的偏移 12，B 的 cursor 指向同一块 H 的偏移 30。',
    ({rect,box,arrow,line,text,label}) => {
      rect(15,11,490,223,null); text(260,32,'同一进程的虚拟地址空间');
      box(31,59,156,36,'A 的栈 · cursor',C.green,17);
      box(333,59,156,36,'B 的栈 · cursor',C.peach,17);
      const x=95,y=159,step=8.2;
      rect(x,y,step*40,32,C.soft,C.edge,1);
      [12,30].forEach((i,j)=>rect(x+i*step,y,step,32,j?C.peach:C.green,C.edge,0));
      arrow([[109,96],[109,127],[x+12.5*step,127],[x+12.5*step,158]]);
      arrow([[411,96],[411,127],[x+30.5*step,127],[x+30.5*step,158]],C.orange);
      label(x+12.5*step,208,'H + 12'); label(x+30.5*step,208,'H + 30');
      text(57,175,'堆 H',17);
    });

  add('threads/join','join 返回时，哪些对象还活着', 238,
    '沿横轴向右读，深色条表示对象可用的寿命。worker 栈内局部量到 worker 返回时结束。仍在执行的 main 可以在 join 返回后读取自己的结果槽，也可以读取 worker 分配的堆对象；后者直到显式 free 才结束。',
    ({rect,line,arrow,text,label}) => {
      const xs=[151,266,365,462];
      ['分配','worker 返回','join 返回','free'].forEach((v,i)=>{
        label(xs[i],24,v);line([[xs[i],42],[xs[i],198]],{color:'#9aa698',dash:[4,5]});
      });
      const lanes=[['worker 局部量',70,136,266,C.peach],['main 结果槽',121,136,490,C.green],['堆上结果',172,151,462,C.green]];
      lanes.forEach(([name,y,x1,x2,color])=>{
        text(119,y,name,16,{align:'right'}); rect(x1,y-9,x2-x1,18,color,C.edge,2);
      });
      arrow([[137,211],[490,211]]); text(467,230,'时间',15);
    });

  add('sync/ring','满队列的两个下标停在同一格', 254,
    '依次放 A、B，取走 A，再放 C、D 后，物理槽 0、1、2 分别存 D、B、C。读下标 r 和下一写下标 w 都是 1，n=3 表示满。下一次先取 B，之后读指针沿箭头走到槽 2。',
    ({dot,arrow,box,text,label}) => {
      const nodes=[[151,55,'0 · D'],[236,176,'1 · B'],[65,176,'2 · C']];
      arrow([[175,82],[216,141]]); arrow([[201,176],[102,176]]); arrow([[85,146],[129,83]]);
      nodes.forEach(([x,y,s],i)=>dot(x,y,34,i===1?C.peach:C.green,s,17));
      text(151,127,'n = 3',19);
      box(328,106,140,37,'读下标 r = 1',C.peach,17); box(328,174,140,37,'写下标 w = 1',C.peach,17);
      arrow([[327,125],[299,125],[299,165],[270,165]],C.orange);
      arrow([[327,193],[300,193],[300,185],[270,185]],C.orange);
      label(182,235,'槽号沿 0 → 1 → 2 → 0 循环');
    });

  add('sync/wake-target','谁改变了谓词，就通知能继续的一方', 239,
    '单槽的两个条件队列有不同的等待者。生产者放入一项后通知 not_empty 上的消费者。消费者取出一项后通知 not_full 上的生产者。被唤醒的线程还要重新取得互斥锁并在 while 中重查条件。',
    ({box,arrow,text,label}) => {
      text(116,26,'持锁改变缓冲区'); text(391,26,'被通知的等待队列');
      box(26,55,176,49,'生产者放入一项',C.green,17); box(26,146,176,49,'消费者取出一项',C.peach,17);
      box(298,55,194,49,'not_empty · 消费者',C.green,17);
      box(298,146,194,49,'not_full · 生产者',C.peach,17);
      arrow([[203,80],[297,80]]); arrow([[203,170],[297,170]],C.orange);
      label(250,60,'signal'); label(250,149,'signal');
      label(390,122,'重查 n > 0'); label(390,214,'重查 n < 1');
    });

  add('sync/philosophers','翻转一条取叉依赖，环就断开', 258,
    '节点表示叉的编号，箭头从先拿的叉指向随后要拿的叉。左图的 4→0 闭合成环。右图让最后一人先取 0 再取 4，每条边均从小号指向大号，沿箭头无法回到起点。',
    ({dot,line,arrow,text,label}) => {
      const graphs=[{cx:129,title:'人人先拿左叉'},{cx:391,title:'统一按编号递增'}];
      graphs.forEach(({cx,title},k)=>{
        text(cx,27,title,18);
        const points=Array.from({length:5},(_,i)=>[cx+72*Math.sin(i*2*Math.PI/5),131-72*Math.cos(i*2*Math.PI/5)]);
        for(let i=0;i<5;i++) {
          const reverse=k===1&&i===4;
          const a=points[reverse?0:i],b=points[reverse?4:(i+1)%5];
          const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy);
          arrow([[a[0]+dx*20/d,a[1]+dy*20/d],[b[0]-dx*21/d,b[1]-dy*21/d]],i===4?C.orange:C.teal);
        }
        points.forEach(([x,y],i)=>dot(x,y,18,i===0||i===4?C.peach:C.green,''+i));
        label(cx,231,k?'0 → 4，依赖递增':'4 → 0，回到起点');
      });
      line([[260,45],[260,226]],{color:'#c8d0c2'});
    });

  add('sync/deadlock','用箭头区分请求和持有', 237,
    '矩形是单实例锁，两个圆分别表示线程 A 和 B。沿环走，A 请求文件锁，文件锁由 B 持有。B 请求标签锁，标签锁由 A 持有。两个线程都在阻塞式取锁处等待，无法执行释放操作。',
    ({dot,box,arrow,label}) => {
      dot(122,60,29,C.green,'A'); box(304,36,132,48,'文件锁',C.peach);
      dot(371,168,29,C.green,'B'); box(56,144,132,48,'标签锁',C.peach);
      arrow([[152,60],[303,60]],C.orange,{dash:[5,4]});
      arrow([[371,85],[371,138]]); arrow([[341,168],[189,168]],C.orange,{dash:[5,4]});
      arrow([[122,143],[122,91]]);
      label(227,40,'请求'); label(408,111,'持有'); label(265,193,'请求'); label(84,118,'持有');
    });

  const mounted = new WeakMap();
  const resizeObserver = window.ResizeObserver && new ResizeObserver(entries => {
    for (const entry of entries) {
      const scene = mounted.get(entry.target);
      if (scene) paint(scene);
    }
  });

  function paint(scene) {
    const {viewport, canvas, spec, zoom} = scene;
    const available = viewport.clientWidth;
    if (available < 1) return;
    const base = Math.min(available, 680);
    const width = Math.round(zoom ? Math.max(585, base * 1.55) : base);
    const height = Math.round(width * spec.height / W);
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const pixels = Math.round(width*dpr), rows = Math.round(height*dpr);
    viewport.tabIndex = width > available ? 0 : -1;
    if (pixels === canvas.width && rows === canvas.height && scene.painted) return;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = pixels;
    canvas.height = rows;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(pixels/W,0,0,rows/spec.height,0,0);
    spec.draw(pen(ctx));
    scene.painted = true;
  }

  function mount(target, spec) {
    const domain = 'scene-' + target.dataset.scene.replace('/','-');
    const figure = document.createElement('figure');
    const heading = document.createElement('figcaption');
    const title = document.createElement('span');
    const button = document.createElement('button');
    const viewport = document.createElement('div');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('p');
    figure.className = 'course-scene';
    heading.className = 'scene-heading';
    title.textContent = spec.title;
    button.className = 'scene-scale';
    button.type = 'button';
    button.textContent = '放大图示';
    button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-controls', domain);
    viewport.className = 'scene-scroll';
    viewport.id = domain;
    viewport.setAttribute('role','region');
    viewport.setAttribute('aria-label',spec.title + '，放大后可横向滚动');
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label',spec.title);
    canvas.setAttribute('aria-describedby',domain + '-text');
    caption.className = 'scene-caption';
    caption.id = domain + '-text';
    caption.textContent = spec.caption;
    heading.append(title,button);
    viewport.append(canvas);
    figure.append(heading,viewport,caption);
    target.append(figure);
    const scene = {spec,canvas,viewport,zoom:false,painted:false};
    mounted.set(target,scene);
    mounted.set(viewport,scene);
    button.addEventListener('click', () => {
      scene.zoom = !scene.zoom;
      button.setAttribute('aria-pressed',String(scene.zoom));
      button.textContent = scene.zoom ? '适应宽度' : '放大图示';
      paint(scene);
      if (!scene.zoom) viewport.scrollLeft = 0;
    });
    if (resizeObserver) resizeObserver.observe(viewport);
    return scene;
  }

  function refresh() {
    for (const target of document.querySelectorAll('[data-scene]')) {
      const spec = scenes.get(target.dataset.scene);
      if (spec) paint(mounted.get(target) || mount(target,spec));
    }
  }
  let pending = false;
  function queueRefresh() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {pending = false; refresh();});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',queueRefresh,{once:true});
  else queueRefresh();
  window.addEventListener('load',queueRefresh,{once:true});
  window.addEventListener('resize',queueRefresh,{passive:true});
  window.addEventListener('lessonchange',queueRefresh,true);
  document.addEventListener('lessonchange',queueRefresh,true);
})();
