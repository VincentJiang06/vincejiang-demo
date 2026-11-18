"use strict";
const labNames = ["CPU 轮转", "地址翻译", "线程交错", "路径查找", "页面置换"];
const labLessons = ["l08", "l10", "l14", "l05"];
function roundRobin(quantum) {
  const left = [4, 3, 1],
    queue = [0, 1, 2],
    trace = [],
    finish = [],
    first = [];
  let now = 0;
  while (queue.length) {
    const job = queue.shift(),
      used = Math.min(quantum, left[job]);
    if (first[job] === undefined) first[job] = now;
    for (let t = 0; t < used; t++) trace.push({ job, at: now++ });
    left[job] -= used;
    if (left[job]) queue.push(job);
    else finish[job] = now;
  }
  return { trace, finish, first };
}
const raceSteps = [
  [
    "初始",
    "",
    50,
    null,
    null,
    "两个线程都要给同一个计数器加一。先猜最终结果，再逐步运行。",
  ],
  ["A", "读取", 50, 50, null, "A 把共享值 50 复制到自己的寄存器。"],
  ["A", "加一", 50, 51, null, "A 在寄存器中算出 51，尚未写回内存。"],
  ["B", "读取", 50, 51, 50, "CPU 切到 B。内存仍是 50，B 因此也从 50 开始。"],
  ["B", "加一", 50, 51, 51, "两个线程的私有寄存器里各有一个 51。"],
  ["B", "写回", 51, 51, 51, "共享值第一次从 50 变为 51。"],
  [
    "A",
    "写回",
    51,
    51,
    51,
    "A 恢复后写回自己早先算出的 51。两次加法只留下了一次更新。",
  ],
];
const lockSteps = [
  ["初始", "", 50, null, null, "两方约定用同一把锁保护整个读、加、写区间。"],
  ["A", "取得锁并读取", 50, 50, null, "只有 A 可以执行受保护的更新。"],
  ["A", "加一", 50, 51, null, "B 此时若尝试取得锁，只能等待。"],
  ["A", "写回并解锁", 51, 51, null, "新值 51 已存入内存，随后 A 释放锁。"],
  ["B", "取得锁并读取", 51, 51, 51, "B 接着读到 A 写好的 51。"],
  ["B", "加一", 51, 51, 52, "B 的寄存器变为 52，共享内存仍是 51。"],
  [
    "B",
    "写回并解锁",
    52,
    51,
    52,
    "两次更新都保留。若 B 先进入，结果同样为 52。",
  ],
];
const pathSteps = [
  [
    "进程请求打开 /home/notes",
    "绝对路径从根目录 inode 开始。这里采用教学文件系统，假设目录块和 inode 最初都未缓存。",
  ],
  [
    "读取根目录 inode",
    "根目录 inode 给出自己的数据块位置；它保存的是目录本身的元数据。",
  ],
  [
    "读根目录数据块，找到 home",
    "扫描名字与 inode 编号的配对。本例中 home 对应 inode 7。此时只拿到编号。",
  ],
  [
    "读 inode 7，再读 home 的目录数据",
    "inode 7 指向 home 的目录块。查 notes 得到 inode 12，路径的最后一个名字已经匹配。",
  ],
  [
    "取 inode 12，建立打开文件状态",
    "检查对象类型和访问权限，为成功打开的文件建立状态，再将描述符交给进程。",
  ],
  [
    "read 从文件数据块取字节",
    "目标 inode 的块指针给出文件内容的位置。读完后打开文件偏移按实际读取字节推进。",
  ],
];
function labView(id) {
  const n = Math.max(0, labNames.indexOf(id));
  return (
    '<div class="crumb"><a href="#home">课程总览</a> / 交互实验</div><h1 class="page-title">交互实验台</h1><p class="intro">先预测下一步，再改变参数或切换执行顺序。这些实验使用课件示例和自编数据。</p><div class="lab-tabs">' +
    labNames
      .map(
        (v, i) =>
          '<a class="mode-btn ' +
          (i === n ? "active" : "") +
          '" href="#lab/' +
          i +
          '">' +
          v +
          "</a>",
      )
      .join("") +
    '</div><section class="sim" id="simulation"></section>'
  );
}
function startLab(id) {
  const host = document.getElementById("simulation");
  let step = 0,
    q = 2,
    mode = 0,
    address = 37;
  const names = [
    "同一颗 CPU，谁先完成？",
    "虚拟地址怎样变成物理地址？",
    "为什么两次加一只留下了一次？",
    "一个文件名怎样找到数据块？",
  ];
  const intro = [
    "A、B、C 在时间 0 同时到达，CPU 需求分别是 4、3、1 个时间单位。初始就绪顺序为 A、B、C，忽略切换开销。",
    "页大小为 16 字节，每个虚拟地址都可拆为页号和页内偏移。模型有四个虚拟页，2 号页尚未驻留。",
    "A 和 B 各给同一个计数器加一。这里逐条执行抽象的读、加、写指令并记录寄存器和内存值。实际 C 程序若用普通变量且无同步地并发读写，会产生数据竞争，语言标准不保证结果。",
    "逐次解析 /home/notes，沿途分清名字、inode 编号和实际数据块。",
  ];
  function render(outputOnly = false) {
    let controls = "",
      output = "",
      limit = 0;
    if (id === 0) {
      const r = roundRobin(q);
      limit = r.trace.length;
      const visible = r.trace.slice(0, step);
      controls =
        '<label>时间片 <select id="quantum">' +
        [1, 2, 3, 4]
          .map(
            (i) =>
              "<option " + (q === i ? "selected" : "") + ">" + i + "</option>",
          )
          .join("") +
        "</select></label>";
      output =
        '<p class="over">CPU 时间线 · 每格 1 单位</p><div class="timeline">' +
        r.trace
          .map(
            (t, i) =>
              '<b class="' +
              (i < step ? "s" + t.job : "") +
              '">' +
              (i < step ? "ABC"[t.job] : "·") +
              "</b>",
          )
          .join("") +
        "</div><p><b>时刻 " +
        step +
        "</b>　" +
        (step
          ? "刚刚运行 " + "ABC"[visible[step - 1].job] + "。"
          : "三个任务都在就绪队列。") +
        (step === limit ? "全部完成。" : "") +
        '</p><div class="sheet"><table><tr><th>任务</th><th>剩余 CPU</th><th>首次响应</th><th>周转时间</th></tr>' +
        [0, 1, 2]
          .map(
            (_, i) =>
              "<tr><td>" +
              "ABC"[i] +
              "</td><td>" +
              ([4, 3, 1][i] - visible.filter((x) => x.job === i).length) +
              "</td><td>" +
              (r.first[i] < step ? r.first[i] : "—") +
              "</td><td>" +
              (r.finish[i] <= step ? r.finish[i] : "—") +
              "</td></tr>",
          )
          .join("") +
        "</table></div><p>先看 C。缩短时间片会让它更早被选到，却也可能增加切换次数。</p>";
    } else if (id === 1) {
      const frames = [3, 1, null, 0],
        vpn = Math.floor(address / 16),
        off = address % 16,
        pfn = frames[vpn];
      controls =
        '<label>虚拟地址 <input id="address" type="number" min="0" max="63" value="' +
        address +
        '"></label><span class="fine">允许范围 0–63</span>';
      output =
        '<p class="over">页表 · 虚拟页 → 物理帧</p><div class="timeline">' +
        frames
          .map(
            (f, i) =>
              '<b class="' +
              (i === vpn ? "s1" : "") +
              '">' +
              i +
              " → " +
              (f === null ? "未驻留" : f) +
              "</b>",
          )
          .join("") +
        "</div><p>① " +
        address +
        " ÷ 16 的整数商是 <b>" +
        vpn +
        "</b>，余数是 <b>" +
        off +
        "</b>。② 查页表第 " +
        vpn +
        " 项。</p><p>" +
        (pfn === null
          ? "③ 该页合法但尚未驻留，触发缺页异常。内核要把页调入可用物理帧、更新映射，再重试访问。此刻不能给出物理地址。"
          : "③ 物理帧号是 " +
            pfn +
            "，保留页内偏移 " +
            off +
            "。物理地址为 <b>" +
            pfn +
            " × 16 + " +
            off +
            " = " +
            (pfn * 16 + off) +
            "</b>。") +
        "</p>";
    } else if (id === 2) {
      const seq = mode ? lockSteps : raceSteps;
      limit = seq.length - 1;
      const t = seq[step];
      controls =
        '<label>执行协议 <select id="protocol"><option value="0">无锁</option><option value="1" ' +
        (mode ? "selected" : "") +
        ">同一把互斥锁</option></select></label>";
      output =
        '<p class="over">第 ' +
        step +
        " 步 · " +
        t[0] +
        " " +
        t[1] +
        '</p><div class="timeline"><b class="s0">A 寄存器　' +
        (t[3] ?? "—") +
        '</b><b class="s1">共享内存　' +
        t[2] +
        '</b><b class="s2">B 寄存器　' +
        (t[4] ?? "—") +
        "</b></div><p>" +
        t[5] +
        "</p>";
    } else {
      limit = pathSteps.length - 1;
      output =
        '<p class="over">路径解析 · ' +
        (step + 1) +
        " / " +
        (limit + 1) +
        "</p><h3>" +
        pathSteps[step][0] +
        "</h3><p>" +
        pathSteps[step][1] +
        "</p>";
    }
    if (outputOnly) {
      host.querySelector(".sim-output").innerHTML = output;
      return;
    }
    const actions =
      id === 1
        ? ""
        : '<div class="controls"><button id="prevstep" class="soft-btn" ' +
          (!step ? "disabled" : "") +
          '>← 上一步</button><button id="nextstep" class="cta" ' +
          (step === limit ? "disabled" : "") +
          '>下一步 →</button><button id="resetstep" class="text-link">重新开始</button></div>';
    host.innerHTML =
      "<h2>" +
      names[id] +
      "</h2><p>" +
      intro[id] +
      '</p><div class="controls">' +
      controls +
      '</div><div class="sim-output" aria-live="polite">' +
      output +
      "</div>" +
      actions +
      '<a class="text-link" href="#read/' +
      labLessons[id] +
      '">阅读对应讲解 →</a>';
    const bind = (sel, event, fn) => {
      const el = host.querySelector(sel);
      if (el) el.addEventListener(event, fn);
    };
    bind("#quantum", "change", (e) => {
      q = +e.target.value;
      step = 0;
      render();
    });
    bind("#protocol", "change", (e) => {
      mode = +e.target.value;
      step = 0;
      render();
    });
    bind("#address", "input", (e) => {
      const el = e.target;
      const v = el.valueAsNumber;
      if (!Number.isInteger(v) || v < 0 || v > 63) {
        host.querySelector(".sim-output").textContent =
          "请输入 0 到 63 之间的整数地址。";
        return;
      }
      address = v;
      render(true);
    });
    bind("#nextstep", "click", () => {
      step = Math.min(limit, step + 1);
      render();
      host.querySelector(step === limit ? "#prevstep" : "#nextstep")?.focus();
    });
    bind("#prevstep", "click", () => {
      step = Math.max(0, step - 1);
      render();
      host.querySelector(step === 0 ? "#nextstep" : "#prevstep")?.focus();
    });
    bind("#resetstep", "click", () => {
      step = 0;
      render();
      host.querySelector("#nextstep")?.focus();
    });
  }
  render();
}
