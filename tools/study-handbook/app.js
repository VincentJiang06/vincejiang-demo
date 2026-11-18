"use strict";
const main = document.getElementById("main"),
  books = BOOK.articles,
  pageRows = BOOK.pages;
const modules = [
  {
    name: "程序与接口",
    hint: "从一行命令，到系统调用",
    first: 0,
    last: 4,
    color: "#e6eccd",
  },
  {
    name: "文件与设备",
    hint: "沿着文件名找到磁盘块",
    first: 5,
    last: 6,
    color: "#e6ddef",
  },
  {
    name: "资源虚拟化",
    hint: "分配处理器时间和内存",
    first: 7,
    last: 12,
    color: "#f1dfd1",
  },
  {
    name: "线程与并发",
    hint: "追踪交错，理解等待",
    first: 13,
    last: 15,
    color: "#dbe6e8",
  },
];
const questions = [
  "一段 C 程序要经过哪些步骤，才能真正跑起来？",
  "同一颗处理器怎样让四个程序看起来同时运行？",
  "fork、exec 和 wait 分别改变了什么？",
  "一块内存什么时候属于你，什么时候必须归还？",
  "程序拿到的文件描述符，究竟指向了哪里？",
  "给你路径和字节偏移，磁盘要读哪些块？",
  "发出 I/O 请求后，CPU 和设备各自在做什么？",
  "进程停下来时，系统怎样保存它的执行现场？",
  "如果短作业排在长作业后面，谁要等多久？",
  "两个进程使用相同的地址，为什么能互不干扰？",
  "怎样把一个虚拟地址拆成可查表的几个部分？",
  "TLB 命中节省了哪一步，多级页表又省在哪？",
  "页不在内存时，系统如何使原指令接着运行？",
  "为什么两次自增可能只得到一次更新？",
  "等待条件的线程为什么醒来还得再检查？",
  "怎样数许可、画等待环，判断系统能否继续？",
];
const titleFor = {
  start: "从一条命令开始",
  route: "全课程阅读路线",
  tutorials: "Tutorial 对照与演练",
  glossary: "术语与易混点",
  exercises: "分步练习册",
  practice: "课程实践手册",
};
const help = {
  route: "沿 L00–L15 逐讲学习，按先修关系进入配套材料。",
  tutorials: "从辅导题的实际情境追踪系统状态，并核对资料的学期和页码。",
  start: "从 wc 的一次执行串起 CPU、内存、文件和设备。",
  glossary: "用同一情境比较容易混淆的中英文概念。",
  exercises: "15 道自编题，可先答、取提示，再对照完整推演。",
  practice: "把课堂原理带入 Lab、作业、编程作业与 SFS 项目。",
};
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const lid = (i) => "l" + String(i).padStart(2, "0");
const short = (s) => s.replace(/[（(]p\.\s*\d+.*?[）)]/i, "").trim();
const chapterLabel = (id) => titleFor[id] || books[id]?.title || "";
const linkRead = (id, section = "") =>
  "#read/" + id + (section ? "/" + section : "");
function saved(key, fallback) {
  try {
    return (
      JSON.parse(localStorage.getItem("system-handbook.v1." + key)) ?? fallback
    );
  } catch {
    return fallback;
  }
}
function save(key, val) {
  try {
    localStorage.setItem("system-handbook.v1." + key, JSON.stringify(val));
  } catch {}
}
let done = new Set(saved("done", [])),
  last = saved("last", ""),
  activeArt = 0,
  resizeObserver = null,
  sourceEnabled = false;
function rows(numbers) {
  return numbers
    .map((i) => {
      const id = lid(i),
        a = books[id];
      return (
        '<a class="row" href="' +
        linkRead(id) +
        '"><span class="page-no">' +
        id.toUpperCase() +
        "</span><div><h3>" +
        esc(a.title) +
        "</h3><p>" +
        questions[i] +
        '</p></div><span class="meta">' +
        (done.has(id) ? '<span class="completed">✓ 已学</span> · ' : "") +
        a.count +
        " 页　↗</span></a>"
      );
    })
    .join("");
}
function header(title, desc) {
  return (
    '<div class="crumb"><a href="#home">课程总览</a> / ' +
    title +
    '</div><h1 class="page-title">' +
    title +
    '</h1><p class="intro">' +
    desc +
    "</p>"
  );
}
function home() {
  const resume =
    last && books[last] && last !== "start"
      ? '<a class="text-link" href="' + linkRead(last) + '">继续上次阅读 →</a>'
      : "";
  main.innerHTML =
    '<section class="hero"><div class="hero-copy"><div class="kicker"><i></i> CSCI3150　/　2026 T1</div><h1>操作系统<br><span>学习手册</span></h1><p>从一行命令出发，看进程怎样获得 CPU、找到文件，以及线程怎样协调对共享数据的访问。</p><div class="controls" style="margin:0"><a class="cta" href="#read/start">从头开始 <b>↗</b></a>' +
    resume +
    '</div></div><div class="hero-figure"><canvas id="board" role="img" aria-label="处理器、内存与设备控制器的分层示意图"></canvas><div class="figure-top"><span>计算机硬件剖面</span><span>CSCI / 3150</span></div><div class="figure-foot"><span class="diagram-caption" id="diagram-caption"></span><div class="figure-tabs" aria-label="查看硬件部件">' +
    ["CPU", "RAM", "I/O"]
      .map((t, i) => '<button data-art="' + i + '">' + t + "</button>")
      .join("") +
    "</div></div></div></section>" +
    '<div class="section-title"><h2>按主题学习</h2><small>4 个单元 · 16 讲</small></div><section class="modules">' +
    modules
      .map(
        (m, i) =>
          '<a class="module" style="--color:' +
          m.color +
          '" href="#module/' +
          i +
          '"><div class="mod-top"><span class="pill">' +
          lid(m.first).toUpperCase() +
          " — " +
          lid(m.last).toUpperCase() +
          '</span><span class="arrow">↗</span></div><canvas data-mini="' +
          i +
          '" aria-hidden="true"></canvas><strong>' +
          m.name +
          "</strong><small>" +
          m.hint +
          "</small></a>",
      )
      .join("") +
    "</section>" +
    '<div class="section-title"><h2>逐讲阅读</h2><a class="text-link" href="#index">按知识点查找 →</a></div><section class="catalog">' +
    rows(Array.from({ length: 16 }, (_, i) => i)) +
    "</section>" +
    '<section class="home-lab"><div><h2>把时间片缩短，会发生什么？</h2><p>用三个小任务，观察响应时间和完成顺序。</p></div><a class="cta" href="#lab/0">进入交互实验 <b>↗</b></a></section>';
  function diagram() {
    const canvas = document.getElementById("board");
    if (!canvas) return;
    drawBoard(canvas, activeArt);
    document
      .querySelectorAll("[data-mini]")
      .forEach((el) => drawMini(el, +el.dataset.mini));
    document.getElementById("diagram-caption").textContent = [
      "CPU · 取指、译码、执行",
      "RAM · 保存指令和数据",
      "I/O · 连接处理器与设备",
    ][activeArt];
    document.querySelectorAll("[data-art]").forEach((el) => {
      el.classList.toggle("active", +el.dataset.art === activeArt);
      el.setAttribute("aria-pressed", String(+el.dataset.art === activeArt));
    });
  }
  document.querySelectorAll("[data-art]").forEach(
    (el) =>
      (el.onclick = () => {
        activeArt = +el.dataset.art;
        diagram();
      }),
  );
  diagram();
  resizeObserver = new ResizeObserver(diagram);
  resizeObserver.observe(document.querySelector(".hero"));
}
function modulePage(i) {
  const m = modules[i];
  main.innerHTML =
    header(m.name, m.hint + "。每讲有执行过程、算例和理解检查。") +
    '<section class="catalog">' +
    rows(Array.from({ length: m.last - m.first + 1 }, (_, j) => j + m.first)) +
    '</section><div class="inline-nav"><a href="#home">← 全部主题</a><a href="#module/' +
    ((i + 1) % 4) +
    '">下个主题 →</a></div>';
}
function enhancedSources() {
  if (!sourceEnabled && location.protocol !== "file:") return;
  for (const el of main.querySelectorAll("[data-source]")) {
    const source = el.dataset.source;
    if (
      !source ||
      !["课件", "项目", "作业", "信息", "辅导", "study"].includes(source.split("/")[0])
    )
      continue;
    const a = document.createElement("a");
    a.href =
      (location.protocol === "file:" ? "../../" : "./course-source/") +
      source.split("/").map(encodeURIComponent).join("/");
    a.textContent = el.textContent;
    a.target = "_blank";
    a.rel = "noopener";
    el.replaceWith(a);
  }
}
function exerciseSections(a) {
  const questions = a.sections[1].html
    .split(/(?=<h3>)/)
    .filter((t) => t.startsWith("<h3>"));
  const answers = a.sections[3].html
    .split(/(?=<h3>)/)
    .filter((t) => t.startsWith("<h3>"));
  const list = document.createElement("div");
  list.innerHTML = a.sections[2].html;
  const hints = [...list.querySelectorAll("li")];
  if (questions.length !== 15 || answers.length !== 15 || hints.length !== 15)
    return null;
  return questions.map((q, i) => ({
    key: "ex" + (i + 1),
    label: q.match(/<h3>(.*?)<\/h3>/)[1],
    html:
      q.replace(/<h3>.*?<\/h3>/, "") +
      '<div class="worksheet"><details><summary>给我一个提示</summary><p>' +
      hints[i].innerHTML +
      "</p></details><details><summary>查看解析与验算</summary>" +
      answers[i].replace(/<h3>.*?<\/h3>/, "") +
      "</details></div>",
  }));
}
function reader(id, key) {
  const a = books[id],
    isLecture = /^l\d\d$/.test(id);
  const special = id === "exercises" ? exerciseSections(a) : null;
  const secs = special || a.sections.slice(1);
  if (isLecture || id === "start") {
    last = id;
    save("last", id);
  }
  const list = secs
    .map(
      (s) =>
        '<a href="' + linkRead(id, s.key) + '">' + esc(short(s.label)) + "</a>",
    )
    .join("");
  const i = isLecture ? Number(id.slice(1)) : -1;
  const prev = isLecture ? (i ? lid(i - 1) : "start") : null,
    next = isLecture
      ? i === 15
        ? "exercises"
        : lid(i + 1)
      : id === "start"
        ? "l00"
        : null;
  const labsByLecture = {
    4: 3,
    5: 3,
    7: 0,
    8: 0,
    9: 1,
    10: 1,
    11: 1,
    12: 4,
    13: 2,
    14: 2,
    15: 2,
  };
  const exercisesByLecture = [
    1, 13, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ];
  const related = isLecture
    ? '<div class="related"><strong>动手检验</strong>' +
      (labsByLecture[i] !== undefined
        ? '<a href="#lab/' +
          labsByLecture[i] +
          '">' +
          labNames[labsByLecture[i]] +
          "实验 →</a>"
        : "") +
      '<a href="#read/exercises/ex' +
      exercisesByLecture[i] +
      '">自测练习 ' +
      exercisesByLecture[i] +
      ' →</a><a href="#read/glossary">易混术语 →</a><a href="#read/tutorials">Tutorial 对照 →</a></div>'
    : "";
  const figureNav = a.figures?.length
    ? '<details class="figure-nav"><summary>本讲图解（' + a.figures.length + '）</summary><ul>' +
      a.figures.map((f) => '<li><a href="' + linkRead(id, id + '-' + f.anchor) + '">' +
        esc(f.title) + ' <small>' + esc(f.range) + '</small></a></li>').join("") + '</ul></details>'
    : "";
  const checked = done.has(id);
  main.innerHTML =
    '<div class="crumb"><a href="#home">课程总览</a> / ' +
    (isLecture
      ? modules.find((m) => m.first <= i && i <= m.last).name
      : "学习资料") +
    '</div><div class="reader"><article><div class="read-head"><span class="tag">' +
    (isLecture ? id.toUpperCase() + " · " + a.count + " 页课件" : "学习手册") +
    '</span><h1 class="page-title">' +
    esc(chapterLabel(id)) +
    "</h1>" +
    (isLecture ? '<p class="intro">' + questions[i] + "</p>" : "") +
    figureNav + '</div><div class="prose">' +
    a.sections[0].html +
    secs
      .map(
        (s) =>
          '<section id="' +
          s.key +
          '"><h2>' +
          esc(s.label) +
          "</h2>" +
          s.html +
          "</section>",
      )
      .join("") +
    "</div>" +
    related +
    '<div class="inline-nav">' +
    (prev
      ? '<a class="text-link" href="' +
        linkRead(prev) +
        '">← ' +
        esc(chapterLabel(prev)) +
        "</a>"
      : "") +
    (next
      ? '<a class="cta" href="' +
        linkRead(next) +
        '">' +
        esc(chapterLabel(next)) +
        "　→</a>"
      : '<a class="text-link" href="#resources">返回资料库 →</a>') +
    '</div></article><aside class="side"><details ' +
    (innerWidth > 880 ? "open" : "") +
    "><summary>本篇目录</summary>" +
    list +
    "</details>" +
    (isLecture
      ? '<button class="soft-btn ' +
        (checked ? "active" : "") +
        '" id="mark">' +
        (checked ? "✓ 已学完 · 撤销" : "标记本讲学完") +
        "</button>"
      : "") +
    '<button class="soft-btn" id="print">打印本篇</button></aside></div>';
  enhancedSources();
  document.getElementById("print").onclick = () => window.print();
  const mark = document.getElementById("mark");
  if (mark)
    mark.onclick = () => {
      if (done.has(id)) {
        done.delete(id);
      } else {
        done.add(id);
      }
      save("done", [...done]);
      mark.classList.toggle("active", done.has(id));
      mark.textContent = done.has(id) ? "✓ 已学完 · 撤销" : "标记本讲学完";
    };
  const target = key && document.getElementById(key);
  if (target)
    requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}
function search(term, limit) {
  const tokens = term.toLowerCase().trim().split(/\s+/).filter(Boolean),
    results = [];
  if (!tokens.length) return results;
  for (const a of Object.values(books))
    for (const s of a.sections) {
      const label = s.key === "s0" ? chapterLabel(a.id) : short(s.label);
      const h = [a.id, chapterLabel(a.id), s.label].join(" ").toLowerCase(),
        body = s.text.toLowerCase();
      if (!tokens.every((t) => (h + " " + body).includes(t))) continue;
      let score = tokens.reduce((v, t) => v + (h.includes(t) ? 10 : 1), 0);
      const pos = body.indexOf(tokens[0]),
        start = pos < 0 ? 0 : Math.max(0, pos - 20);
      let key = s.key;
      if (a.id === "exercises") key = "";
      results.push({
        href: linkRead(a.id, key),
        label: chapterLabel(a.id) + (s.key === "s0" ? "" : " / " + label),
        txt: s.text.slice(start, start + 86),
        score,
      });
    }
  const seen = new Set();
  for (const p of pageRows) {
    const h = (
        p.id +
        " p." +
        p.p +
        " " +
        p.original +
        " " +
        p.label
      ).toLowerCase(),
      k = p.id + p.section;
    if (!tokens.every((t) => h.includes(t)) || seen.has(k)) continue;
    seen.add(k);
    results.push({
      href: linkRead(p.id, p.section),
      label: p.id.toUpperCase() + " p." + p.p + " · " + p.original,
      txt: p.label,
      score: 3,
    });
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
function indexPage() {
  main.innerHTML =
    header(
      "知识索引",
      "按知识点、英文标题或原课件页号定位。每一页都对应新教材中的一段讲解。",
    ) +
    '<div class="filters"><input class="filter-input" id="filter" type="search" aria-label="筛选知识点" placeholder="例如 TLB、地址翻译、L14 p.38"><select id="filterlect" aria-label="选择讲次"><option value="">全部讲次</option>' +
    Array.from(
      { length: 16 },
      (_, i) =>
        '<option value="' +
        lid(i) +
        '">' +
        lid(i).toUpperCase() +
        " · " +
        esc(books[lid(i)].title) +
        "</option>",
    ).join("") +
    '</select></div><div id="idxresults"></div>';
  function draw() {
    const selected = document.getElementById("filterlect").value,
      q = document.getElementById("filter").value.toLowerCase().trim(),
      tokens = q.split(/\s+/);
    const hits = pageRows.filter(
      (p) =>
        (!selected || p.id === selected) &&
        tokens.every((t) =>
          /^p\.\d+$/.test(t)
            ? p.p === Number(t.slice(2))
            : (
                p.id +
                " p." +
                p.p +
                " " +
                p.label +
                " " +
                p.original +
                " " +
                chapterLabel(p.id)
              )
                .toLowerCase()
                .includes(t),
        ),
    );
    let html =
      '<div class="result-count" aria-live="polite">' +
      hits.length +
      " / " +
      pageRows.length +
      " 页</div>";
    for (const id of [...new Set(hits.map((p) => p.id))]) {
      const ps = hits.filter((p) => p.id === id);
      html +=
        '<details class="index-group" ' +
        (q || selected ? "open" : "") +
        "><summary>" +
        id.toUpperCase() +
        "　" +
        esc(chapterLabel(id)) +
        ' <small class="fine">　' +
        ps.length +
        ' 页</small></summary><div class="index-list">' +
        ps
          .map(
            (p) =>
              '<a href="' +
              linkRead(id, p.section) +
              '"><span>p.' +
              p.p +
              "</span><div>" +
              esc(p.label) +
              '<small class="muted" style="display:block">' +
              esc(p.original) +
              "</small></div></a>",
          )
          .join("") +
        "</div></details>";
    }
    document.getElementById("idxresults").innerHTML =
      html +
      (hits.length
        ? ""
        : "<p>没有匹配页。可以换一个英文词，或使用右上角搜索全文。</p>");
  }
  document.getElementById("filter").oninput = draw;
  document.getElementById("filterlect").onchange = draw;
  draw();
}
function resources() {
  main.innerHTML =
    header(
      "学习资料库",
      "导读、逐讲教材和实践资料都可以离线阅读。复习时从一个问题或一对容易混淆的术语开始。",
    ) +
    '<div class="resources-grid">' +
    ["start", "route", "tutorials", "practice", "glossary", "exercises"]
      .map(
        (id) =>
          '<a class="resource-card" href="' +
          linkRead(id) +
          '"><h2>' +
          chapterLabel(id) +
          "　↗</h2><p>" +
          help[id] +
          "</p></a>",
      )
      .join("") +
    '</div><section class="home-lab"><div><h2>下载整套中文教材</h2><p>含逐讲正文、可离线打开的图解、Tutorial 演练、分步练习和页码对照表。</p></div><a class="cta" href="./handbook.zip" download>下载 ZIP ↓</a></section><div class="section-title"><h2>收录范围</h2></div><p>以 2026T1 本地 L00–L15 的 605 页课件为主线。每个讲次保留原页号，可在<a class="text-link" href="#index">知识索引</a>反查。配套实践覆盖已取得的 Lab01–06、HW01–04、PA03–04 与 SFS 项目。辅导资料的学期、页码与本期对应关系见<a class="text-link" href="#read/tutorials">Tutorial 对照与演练</a>。</p>';
}
const dlg = document.getElementById("searchbox"),
  query = document.getElementById("query"),
  matches = document.getElementById("matches");
function drawSearch() {
  const q = query.value.trim(),
    rr = search(q, 35);
  matches.innerHTML = q
    ? rr.length
      ? rr
          .map(
            (r) =>
              '<a href="' +
              r.href +
              '">' +
              esc(r.label) +
              "<small>" +
              esc(r.txt) +
              "</small></a>",
          )
          .join("")
      : "<p>没有找到匹配内容。可以试试术语的英文名。</p>"
    : '<p class="muted">可搜索讲次标题、课件页名和讲解全文。</p>';
}
function openSearch() {
  if (!dlg.open) dlg.showModal();
  query.focus();
  query.select();
  drawSearch();
}
document.querySelector(".search-open").onclick = openSearch;
document.getElementById("close-search").onclick = () => dlg.close();
query.oninput = drawSearch;
matches.onclick = (e) => {
  if (e.target.closest("a")) dlg.close();
};
dlg.onclick = (e) => {
  if (e.target === dlg) {
    const r = dlg.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dlg.close();
  }
};
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !/input|select|textarea/i.test(e.target.tagName)) {
    e.preventDefault();
    openSearch();
  }
});
function route() {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (dlg.open) dlg.close();
  const [page = "home", id, key] = location.hash.slice(1).split("/");
  window.scrollTo(0, 0);
  document.querySelectorAll("nav a").forEach((a) => {
    if (
      a.hash ===
      "#" + (page === "module" || page === "read" || !page ? "home" : page)
    )
      a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (page === "read" && books[id]) reader(id, key);
  else if (page === "module" && /^\d$/.test(id) && modules[+id])
    modulePage(+id);
  else if (page === "lab") {
    const tab = /^[0-4]$/.test(id) ? +id : 0;
    main.innerHTML = labView(labNames[tab]);
    if (tab === 4) startMemoryLab(document.getElementById("simulation"));
    else startLab(tab);
  } else if (page === "index") indexPage();
  else if (page === "resources") resources();
  else home();
  document.title =
    (page === "read" && books[id] ? chapterLabel(id) + " · " : "") +
    "系统手册 · CSCI3150";
}
document.querySelector(".skip").onclick = (e) => {
  e.preventDefault();
  main.focus();
  main.scrollIntoView();
};
window.addEventListener("hashchange", route);
route();
if (["localhost", "127.0.0.1", "[::1]"].includes(location.hostname)) {
  fetch("./local-sources.json")
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => {
      if (j?.available) {
        sourceEnabled = true;
        enhancedSources();
      }
    })
    .catch(() => {});
}
