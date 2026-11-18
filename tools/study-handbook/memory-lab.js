"use strict";

window.startMemoryLab = function startMemoryLab(host) {
  const scenarios = [
    {
      title: "刚访问的页很快又要用",
      pages: ["A", "B", "C", "A", "D", "A", "B"],
    },
    {
      title: "四页循环，只有三个页框",
      pages: ["A", "B", "C", "D", "A", "B", "C", "D"],
    },
    {
      title: "一段时间集中访问少数页",
      pages: ["A", "B", "A", "B", "A", "C", "D", "C", "D", "C"],
    },
  ];
  const policies = [
    { key: "FIFO", label: "先进先出", order: "最早装入 → 最晚装入" },
    { key: "LRU", label: "最近最少使用", order: "最久未用 → 刚刚使用" },
  ];

  function trace(pages, policy) {
    const frames = [null, null, null];
    const order = [];
    const snapshots = [
      { frames: frames.slice(), order: [], hits: 0, faults: 0 },
    ];
    let hits = 0;
    let faults = 0;
    for (const page of pages) {
      let slot = frames.indexOf(page);
      const hit = slot !== -1;
      let victim = null;
      if (hit) {
        hits += 1;
        if (policy.key === "LRU") {
          order.splice(order.indexOf(page), 1);
          order.push(page);
        }
      } else {
        faults += 1;
        slot = frames.indexOf(null);
        if (slot === -1) {
          victim = order.shift();
          slot = frames.indexOf(victim);
        }
        frames[slot] = page;
        order.push(page);
      }
      snapshots.push({
        page,
        hit,
        victim,
        slot,
        hits,
        faults,
        frames: frames.slice(),
        order: order.slice(),
      });
    }
    return snapshots;
  }

  function explain(state, policy) {
    if (!state.page)
      return "三个物理页框起初都空着。第一次碰到一个页时，需要先将它调入。";
    if (state.hit) {
      const reason =
        policy.key === "FIFO"
          ? "命中不会改变装入顺序。"
          : "这次访问把它更新为最近使用的页。";
      return (
        "页 " + state.page + " 已在框 " + state.slot + "，直接使用。" + reason
      );
    }
    if (state.victim === null) {
      return (
        "内存中找不到页 " +
        state.page +
        "。框 " +
        state.slot +
        " 还空着，直接调入即可。"
      );
    }
    const reason =
      policy.key === "FIFO"
        ? "它在当前三页中最早装入"
        : "它在当前三页中离上次访问最久";
    return (
      "三个框都满了。淘汰页 " +
      state.victim +
      "，因为" +
      reason +
      "，再将 " +
      state.page +
      " 装入腾出的框 " +
      state.slot +
      "。"
    );
  }

  function policyPanel(state, policy) {
    const cells = state.frames
      .map(
        (page, slot) =>
          '<b class="cell' +
          (state.slot === slot ? " s1" : "") +
          '">框 ' +
          slot +
          " · " +
          (page ?? "空") +
          "</b>",
      )
      .join("");
    const outcome = state.page ? (state.hit ? "命中" : "缺页") : "尚未访问";
    return (
      "<section><h3>" +
      policy.key +
      " · " +
      policy.label +
      "</h3>" +
      '<div class="timeline">' +
      cells +
      "</div>" +
      "<p><strong>" +
      outcome +
      "</strong>　累计命中 " +
      state.hits +
      " 次，缺页 " +
      state.faults +
      " 次。</p>" +
      "<p>" +
      explain(state, policy) +
      '</p><p class="fine">' +
      policy.order +
      "　" +
      (state.order.join(" → ") || "空") +
      "</p></section>"
    );
  }

  host.innerHTML =
    "<h2>内存满了，应该换出哪一页？</h2>" +
    "<p>同一进程按给定顺序访问合法的虚拟页，两种策略各有三个初始为空的页框。本例只统计是否缺页，不计算脏页写回的成本。先预测下一次访问，再前进一步。</p>" +
    '<div class="controls"><label>访问序列 <select data-case>' +
    scenarios
      .map(
        (scenario, i) =>
          '<option value="' + i + '">' + scenario.title + "</option>",
      )
      .join("") +
    '</select></label></div><div class="sim-output" aria-live="polite" aria-atomic="true"></div>' +
    '<div class="controls"><button type="button" class="soft-btn" data-prev>← 上一步</button>' +
    '<button type="button" class="cta" data-next>下一步 →</button>' +
    '<button type="button" class="text-link" data-reset>重新开始</button></div>' +
    '<a class="text-link" href="#read/l12">阅读缺页与页面置换 →</a>';

  const select = host.querySelector("[data-case]");
  const prev = host.querySelector("[data-prev]");
  const next = host.querySelector("[data-next]");
  const reset = host.querySelector("[data-reset]");
  const output = host.querySelector(".sim-output");
  let step = 0;
  let pages;
  let traces;

  function draw() {
    const path = pages
      .map((page, i) => {
        const highlight = i === step - 1 ? "s1" : i < step ? "s0" : "";
        return (
          '<b class="' +
          highlight +
          '"' +
          (i === step - 1 ? ' aria-current="step"' : "") +
          ">" +
          page +
          "</b>"
        );
      })
      .join("");
    const progress =
      step === 0
        ? "下一次访问 " + pages[0]
        : "本步访问 " +
          pages[step - 1] +
          (step < pages.length
            ? "，下一次访问 " + pages[step]
            : "，序列已结束");
    output.innerHTML =
      '<p class="over">访问进度 ' +
      step +
      " / " +
      pages.length +
      "</p>" +
      '<div class="timeline" aria-label="访问序列">' +
      path +
      "</div><p>" +
      progress +
      "。</p>" +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:18px">' +
      policies
        .map((policy, i) => policyPanel(traces[i][step], policy))
        .join("") +
      "</div>";
    prev.disabled = step === 0;
    next.disabled = step === pages.length;
    reset.disabled = step === 0;
  }

  function chooseCase() {
    pages = scenarios[Number(select.value)].pages;
    traces = policies.map((policy) => trace(pages, policy));
    step = 0;
    draw();
  }
  select.addEventListener("change", chooseCase);
  prev.addEventListener("click", () => {
    step = Math.max(0, step - 1);
    draw();
    if (prev.disabled) next.focus();
  });
  next.addEventListener("click", () => {
    step = Math.min(pages.length, step + 1);
    draw();
    if (next.disabled) prev.focus();
  });
  reset.addEventListener("click", () => {
    step = 0;
    draw();
    next.focus();
  });
  chooseCase();
};
