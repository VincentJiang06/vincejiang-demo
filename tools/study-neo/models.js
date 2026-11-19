"use strict";
(() => {
  const S = (label, note, cells) => ({ label, note, cells });
  const cell = (name, value, status = "") => ({ name, value: String(value), status });
  const models = {
    overview: {
      title: "一条指令究竟改变哪里？", intro: "这台简化机器的三条指令依次读数、加 2、写回。PC 是下一条要取的指令地址，R 是用于计算的寄存器。",
      options: ["输入为 4", "输入为 9"], run(v) {
        const n = v ? 9 : 4;
        const states = [
          ["启动", "PC 指向第一条指令。地址 24 保存输入，地址 25 还没有结果。",0,"—","—"],
          ["LOAD R, [24]", "CPU 从地址 24 读取一个数，复制到 R；读取不会清空输入位置。",1,n,"—"],
          ["ADD R, 2", "加法器只更新寄存器 R，主存中的两个位置没有变化。",2,n+2,"—"],
          ["STORE [25], R", "处理器把 R 的值写入地址 25。下一条指令从 PC 指定的位置取。",3,n+2,n+2]
        ];
        return states.map(([label,note,pc,r,out],i)=>S(label,note,[cell("PC",pc,"focus"),cell("寄存器 R",r,i===1||i===2?"live":""),cell("内存 [24]",n),cell("内存 [25]",out,i===3?"live":"")]));
      }
    },
    syscalls: {
      title:"为什么管道已经空了，读者还不结束？",intro:"进程 W 已写入两个字节。R 是唯一读者，父进程也曾继承一个写端。观察写端引用数与管道内容。",
      options:["父进程关闭多余写端","父进程一直保留写端"],run(v){
        return [
          S("生产者完成写入","W 和父进程各持一个写端引用；内核缓冲区有两个字节。",[cell("W 的写端","打开"),cell("父的写端","打开"),cell("缓冲区","x y","live"),cell("写端引用",2)]),
          S("父进程处理写端",v?"父进程虽然不写数据，打开的引用仍被计数。":"父进程关闭不用的写端；W 仍可继续写。",[cell("W 的写端","打开"),cell("父的写端",v?"打开":"关闭","focus"),cell("缓冲区","x y"),cell("写端引用",v?2:1)]),
          S("W 关闭写端","缓冲区里的字节仍可读出；关闭一个写端不会清空数据。",[cell("W 的写端","关闭","focus"),cell("父的写端",v?"打开":"关闭"),cell("缓冲区","x y"),cell("写端引用",v?1:0)]),
          S("R 读走两个字节","假设这次 read 成功读完两个字节。接下来这个管道已空。",[cell("R 的返回值",2,"live"),cell("读到","x y"),cell("缓冲区","空"),cell("写端引用",v?1:0)]),
          S("R 再请求读 1 字节",v?"在这个阻塞式管道上，父进程仍可能写入。没有数据时 R 继续等待。":"缓冲区已空，最后一个写端也已关闭。read 返回 0，表示输入结束。",[cell("缓冲区","空"),cell("写端引用",v?1:0),cell("R 的结果",v?"阻塞":"返回 0","live")])
        ];
      }
    },
    filesystem: {
      title:"一个字节偏移会把磁盘带向哪里？",intro:"本例每块 64 字节。inode 有两个直接指针，分别指向物理块 7、15；一级间接指针指向物理块 4，那里依次存着 21、9。文件长度恰好为 256 字节。",
      options:["偏移 79","偏移 136","偏移 255","偏移 256"],run(v){
        const offset=[79,136,255,256][v], b=Math.floor(offset/64), pos=offset%64;
        const steps=[S("先检查长度","本实验读取 1 字节，且文件内容和长度不再变化。",[cell("请求偏移",offset,"focus"),cell("文件长度","256 B"),cell("目标字节",offset<256?"存在":"在 EOF")])];
        if(offset===256){steps.push(S("到达文件末尾","偏移等于文件长度，读取返回 0。逻辑块 4 不属于这个文件。",[cell("有效偏移","0…255"),cell("数据块访问","无需"),cell("read 返回",0,"live")]));return steps;}
        steps.push(S("拆开偏移","取整得到从文件开头数的逻辑块号；除法余数是要访问的块内位置。",[cell("逻辑块",b,"live"),cell("块内位置",pos),cell("验算",b+" × 64 + "+pos)]));
        const addr=[7,15,21,9][b];
        if(b>=2)steps.push(S("再查一级索引","先跳过两个直接块，再用剩下的序号读索引块 4。",[cell("索引块",4),cell("表项下标",b-2,"focus"),cell("表项值",addr,"live")]));
        steps.push(S("定位数据","此例以块 0 开头作为磁盘字节 0。若块内数据未缓存，需要读含有目标字节的数据块。",[cell("寻址方式",b<2?"直接":"一级间接"),cell("物理块",addr,"live"),cell("块内位置",pos),cell("磁盘字节偏移",addr*64+pos)]));return steps;
      }
    },
    devices: {
      title:"谁负责搬运这四个字？",intro:"一次设备读取有四个机器字。两个方案都用中断报告就绪或完成；改变搬运方式，观察 CPU 在哪里工作。",
      options:["程序控制 I/O（PIO）","直接内存访问（DMA）"],run(v){
        const st=[S("设置读取","驱动检查设备状态，安排读取并选定接收缓冲区。",[cell("设备","接到请求","focus"),cell("CPU","设置命令"),cell("已入主存","0 / 4")])];
        if(!v)st.push(S("数据就绪，发出中断","本例假定四个字都已就绪。处理器进入驱动的中断处理路径。",[cell("设备端口","可读"),cell("CPU","处理中断","focus"),cell("已入主存","0 / 4")]));
        for(let i=1;i<=4;i++)st.push(S("传输第 "+i+" 个字",v?"DMA 控制逻辑按约定的地址和长度写主存。CPU 可运行其他就绪工作，内存总线仍可能发生竞争。":"CPU 读取设备数据端口，再把这个字写入主存缓冲区。每个字都需要处理器参与。",[cell("负责传输",v?"DMA":"CPU","live"),cell("CPU",v?"可处理其他工作":"读端口、写主存"),cell("已入主存",i+" / 4","focus")]));
        st.push(S("结束请求",v?"本例的 DMA 传输完成后产生中断。驱动核对状态并通知等待者。":"驱动已拷完四个字，核对状态并通知等待者。",[cell("缓冲区","数据就绪","live"),cell("驱动","处理完成"),cell("等待者","可以重新就绪")]));return st;
      }
    },
    cpu: {
      title:"同样的工作，换个调度规则会怎样？",intro:"A 在时刻 0 到达，需 4 个 CPU 时间单位；B 在时刻 1 到达，需 2 个；C 在时刻 2 到达，需 1 个。单核，无 I/O，忽略切换成本。",
      options:["先来先服务","轮转 · 片长 1","轮转 · 片长 2","最短剩余时间优先"],run(v){
        const left=[4,2,1],arr=[0,1,2],names=["A","B","C"],first=[null,null,null],fin=[null,null,null],q=[0],hist=[];
        let cur=null,budget=0;
        const frame=(name,note,t)=>({...S(name,note,names.map((n,i)=>cell(n+" 剩余",t<arr[i]?"未到":left[i],hist.at(-1)===n?"live":""))),track:hist.slice()});
        const st=[frame("就绪队列以 A 开始","时间从左向右流动，每格恰好表示一个 CPU 时间单位。",0)];
        for(let t=0;t<7;t++){
          if(v===3)cur=left.map((n,i)=>({n,i})).filter(x=>x.n>0&&arr[x.i]<=t).sort((a,b)=>a.n-b.n||a.i-b.i)[0].i;
          else if(cur===null){cur=q.shift();budget=v===0?Infinity:v;}
          const j=cur;if(first[j]===null)first[j]=t;hist.push(names[j]);left[j]--;budget--;
          for(let i=1;i<3;i++)if(arr[i]===t+1&&v!==3)q.push(i);
          if(!left[j]){fin[j]=t+1;cur=null;}else if(v!==3&&budget===0){q.push(j);cur=null;}
          const note=v===3?"每个整数时刻比较已到作业的剩余时间；相同则取较早到达者。":v===0?"一旦开始，任务持续运行至完成。":"时间片末先登记同刻到达的任务，再将未完成的当前任务放回队尾。";
          st.push(frame("["+t+", "+(t+1)+")　运行 "+names[j],note,t+1));
        }
        st.push({...S("计算响应和周转","响应时间 = 首次得到 CPU 的时刻 − 到达时刻；周转时间 = 完成时刻 − 到达时刻。",names.map((n,i)=>cell(n+" 响应 / 周转",(first[i]-arr[i])+" / "+(fin[i]-arr[i]),"live"))),track:hist.slice()});return st;
      }
    },
    memory: {
      title:"一次访存先查缓存，还是先找磁盘？",intro:"页长 16 字节，按字节编址。TLB 最初仅缓存 VPN 2 → PFN 5。页 0 已驻留在框 4，页 1 合法但未驻留；页 2 可读不可写。",
      options:["读 VA 37","读 VA 7","读 VA 21","写 VA 37"],run(v){
        const a=[37,7,21,37][v],vpn=Math.floor(a/16),off=a%16;
        const st=[S("拆分虚拟地址",a+" ÷ 16 得到整数商 "+vpn+" 和余数 "+off+"。两者分别标识页与页内位置。",[cell("VA",a),cell("VPN",vpn,"focus"),cell("偏移",off,"live")])];
        st.push(S("查询 TLB",vpn===2?"已有此页的翻译，同时取得其访问权限。":"缓存里没有此页的翻译，下一步查当前进程的页表。",[cell("VPN",vpn),cell("TLB",vpn===2?"命中":"未命中","focus"),cell("请求",v===3?"写":"读")]));
        if(v===3){st.push(S("触发保护异常","TLB 命中也要检查权限。程序请求写入只读页，处理器不会执行这次写入。",[cell("页面权限","只读"),cell("实际操作","写"),cell("结局","保护异常","live")]));return st;}
        if(vpn!==2)st.push(S("读页表项",vpn===0?"页 0 驻留且可读，补入该翻译即可，无需读磁盘。":"页 1 属于此进程，但页表显示未驻留，产生缺页异常。",[cell("映射","合法"),cell("驻留",vpn===0?"是":"否","focus"),cell("下一步",vpn===0?"装填 TLB":"进入缺页处理")]));
        if(vpn===1)st.push(S("处理缺页并重试","假定该页有后备副本且框 3 空闲。内核读入页面，更新页表，然后重新执行原访问。",[cell("物理框",3,"live"),cell("驻留位",1),cell("原指令","重试")]));
        const f=[4,3,5][vpn];st.push(S("得到物理地址",f+" × 16 + "+off+" = "+(f*16+off)+"。翻译改变页号部分，保留原来的页内偏移。",[cell("PFN",f),cell("偏移",off),cell("物理地址",f*16+off,"live")]));return st;
      }
    },
    threads: {
      title:"切走一个线程，需要带走哪些状态？",intro:"线程 A、B 在一个进程内执行，各自要让计数器增加 1。下面是可交错的抽象机器指令；未同步的普通 C 变量会产生数据竞争，语言标准不保证这样的执行结果。",
      options:["先读后交错","依次完成两次更新"],run(v){
        const order=v?["Ar","Aa","Aw","Br","Ba","Bw"]:["Ar","Aa","Br","Ba","Bw","Aw"];
        const regs={A:"—",B:"—"};let count=8;
        const cells=(who)=>[cell("A 寄存器",regs.A,who==="A"?"focus":""),cell("共享计数器",count,"live"),cell("B 寄存器",regs.B,who==="B"?"focus":"")];
        const st=[S("计数器初值为 8","每个线程依次读、加、写。被暂停线程的私有寄存器值在恢复时仍属于它。",cells())];
        for(const [who,op] of order){let action,why;if(op==="r"){regs[who]=count;action="读共享内存";why="把当前共享值复制到自己的寄存器。";}else if(op==="a"){regs[who]++;action="寄存器加 1";why="只改变这个线程的寄存器，尚未写回。";}else{count=regs[who];action="写回共享内存";why="把自己先前计算的值写入共享位置。";}st.push(S(who+" · "+action,why,cells(who)));}
        st.push(S("检查最终结果",v?"这是一个恰好串行的执行次序。它展示一个可能结果，不能作为无锁程序总正确的证据。":"两个线程都曾读到 8，分别算出 9。后一次写回覆盖同一个值，丢失一次更新。",cells()));return st;
      }
    },
    sync: {
      title:"被叫醒的消费者一定能取到货吗？",intro:"容量为 1 的缓冲区。两个消费者 C1、C2 与一个生产者 P 使用同一把互斥锁；唤醒 C1 后，调度器允许 C2 先取得锁。",
      options:["用 while 复查","仅用 if 检查一次"],run(v){
        const t=(a,b,c,d,e)=>S(a,b,[cell("槽内数量",c,"live"),cell("锁的持有者",d,"focus"),cell("C1",e)]);
        return [t("C1 检查空槽","C1 持锁看到数量为 0，准备调用条件等待。",0,"C1","检查"),
          t("C1 调用 wait","加入等待并释放锁相对于通知方是原子的。C1 暂时不消耗 CPU。",0,"无","等待"),
          t("P 放入一件并通知","P 持锁更新数量，通知一个消费者，再解锁。通知本身不把锁或货物交给 C1。",1,"无","被唤醒，待重获锁"),
          t("C2 先取走一件","C2 先获锁，发现有货，取走后解锁。",0,"无","仍待重获锁"),
          t("C1 的 wait 返回","C1 重新持有同一把锁。它上一次检查条件时看到的事实早已失效。",0,"C1","已持锁"),
          t(v?"C1 错误地尝试取货":"C1 再次等待",v?"if 的检查已经执行过。返回后程序直接尝试从空槽取货，违反缓冲区不变量。":"while 重新读取数量，发现仍为 0，于是再次释放锁并等待后续通知。",0,v?"C1":"无",v?"错误取货":"等待")];
      }
    }
  };
  function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e;}
  for(const host of document.querySelectorAll("[data-model]")){
    const model=models[host.dataset.model];if(!model)continue;let pos=0, states=model.run(0);
    host.replaceChildren();const h=el("h2","",model.title),intro=el("p","lab-intro",model.intro);host.append(h,intro);
    const label=el("label","model-select","实验条件　"),select=el("select");model.options.forEach((v,i)=>{const o=el("option","",v);o.value=i;select.append(o);});label.append(select);host.append(label);
    const panel=el("div","model-frame");panel.setAttribute("aria-live","polite");host.append(panel);
    const buttons=el("div","model-controls"), back=el("button","","← 上一步"),next=el("button","hot","下一步 →"),reset=el("button","","回到起点");buttons.append(back,next,reset);host.append(buttons);
    function draw(){
      const s=states[pos];panel.replaceChildren();panel.append(el("span","stepnum","状态 "+(pos+1)+" / "+states.length),el("h3","",s.label));
      const rack=el("div","cell-rack");for(const x of s.cells){const item=el("div","model-cell "+x.status);item.append(el("small","",x.name),el("strong","",x.value));rack.append(item);}panel.append(rack);
      if(s.track){const tape=el("div","job-tape");tape.setAttribute("aria-label","CPU 时间线");for(let i=0;i<7;i++){const n=s.track[i];tape.append(el("span",n?"job-"+n:"",n||"·"));}panel.append(tape);}
      panel.append(el("p","",s.note));back.disabled=pos===0;next.disabled=pos===states.length-1;reset.disabled=pos===0;
    }
    back.onclick=()=>{pos--;draw();};next.onclick=()=>{pos++;draw();};reset.onclick=()=>{pos=0;draw();};select.onchange=()=>{pos=0;states=model.run(+select.value);draw();};draw();
  }
})();
