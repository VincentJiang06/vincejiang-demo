/* REACTOR · tree.js — the talent tree (SVG circuit edges + DOM nodes)
   两种形态，一套数据（tree-data.js）：
   - full：首页全屏树（拖动/滚轮平移，⌘/Ctrl+滚轮或双指捏合缩放，图例点击跳分支）
   - mini：课程页左侧导轨（各向异性压缩成窄条点阵图，当前节点高亮，纯点击导航）
   连线 = 正交电路走线：从前置芯片下边缘出发，借行间「走廊」水平横穿，再垂直落到
   目标芯片上边缘；同支实线、跨支虚线，默认压暗，悬停节点时相关线路点亮。 */
import { progress } from "/modules/boot.js?v=340ed36aa6";
import { TREE } from "/modules/tree-data.js?v=4e27999186";

const HALF_H = 67;         // full 模式芯片可视半高（连线端点吸附用,实际按 offsetHeight 量）
const BAND = 70;           // 行带半高：同一行芯片占据 y±BAND，行带之间即走廊
const svgNS = "http://www.w3.org/2000/svg";

document.querySelectorAll(".tree-viewport").forEach(vp =>
  init(vp, vp.dataset.mode === "mini" ? "mini" : "full"));

/* ---- 走廊：把所有行带合并后,取相邻带之间的整段区域(top/mid/bottom) ---- */
function corridors(nodes) {
  const rows = [...new Set(nodes.map(n => n.y))].sort((a, b) => a - b);
  const bands = [];
  for (const y of rows) {
    const last = bands[bands.length - 1];
    if (last && y - BAND <= last[1]) last[1] = y + BAND;
    else bands.push([y - BAND, y + BAND]);
  }
  const cors = [];
  for (let i = 1; i < bands.length; i++)
    cors.push({ top: bands[i - 1][1], bottom: bands[i][0], mid: (bands[i - 1][1] + bands[i][0]) / 2 });
  return cors;
}

function init(vp, mode) {
  const data = TREE;
  const { nodes, bounds } = data;
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const done = progress.get();
  const focusId = vp.dataset.focus || null;
  const mids = corridors(nodes);

  const isDone = id => done.has(id);
  const isAvail = n => n.prereqs.every(isDone);

  /* ---- 坐标变换：full 恒等；mini 各向异性压缩到导轨内 ---- */
  let TX, TY, halfH;
  if (mode === "mini") {
    const w = Math.max(220, vp.clientWidth), h = Math.max(400, vp.clientHeight);
    const kx = (w - 36) / (bounds.maxX - bounds.minX);
    const ky = (h - 48) / (bounds.maxY - bounds.minY);
    TX = x => (x - bounds.minX) * kx + 18;
    TY = y => (y - bounds.minY) * ky + 24;
    halfH = 7;
  } else {
    TX = x => x - bounds.minX;
    TY = y => y - bounds.minY;
    halfH = HALF_H;
  }
  const W = mode === "mini" ? vp.clientWidth : bounds.maxX - bounds.minX;
  const H = mode === "mini" ? vp.clientHeight : bounds.maxY - bounds.minY;

  const stage = document.createElement("div");
  stage.className = "tree-stage";
  stage.style.width = W + "px"; stage.style.height = H + "px";

  function routeSpec(a, b) {
    // 端点吸附芯片真实边缘;返回走线要素,水平总线段的最终 y 由车道分配统一微调
    const x1 = TX(a.x), y1 = TY(a.y) + half(a), x2 = TX(b.x), y2 = TY(b.y) - half(b);
    if (Math.abs(x2 - x1) < 1) return { d: `M${x1},${y1} L${x2},${y2}` };
    if (y2 - y1 < 18) {
      const my = (y1 + y2) / 2;
      return { d: `M${x1},${y1} C${x1},${my + 24} ${x2},${my - 24} ${x2},${y2}` };
    }
    const usable = mids.filter(c => TY(c.mid) > y1 + 6 && TY(c.mid) < y2 - 6);
    const c = usable.length ? usable[usable.length - 1] : null;
    const ym = c ? TY(c.mid) : (y1 + y2) / 2;
    return { bus: { x1, y1, x2, y2, ym,
      corTop: c ? TY(c.top) : ym - 14, corBot: c ? TY(c.bottom) : ym + 14 } };
  }
  const busPath = ({ x1, y1, x2, y2, ym }) => {
    const s = x2 > x1 ? 1 : -1;
    const r = Math.min(10, Math.abs(x2 - x1) / 2, (ym - y1) / 2, (y2 - ym) / 2);
    return `M${x1},${y1} L${x1},${ym - r} Q${x1},${ym} ${x1 + s * r},${ym}` +
           ` L${x2 - s * r},${ym} Q${x2},${ym} ${x2},${ym + r} L${x2},${y2}`;
  };

  /* ---- 节点（先渲染，才能量出芯片高度供连线吸附）---- */
  const nodeEls = {};
  for (const n of nodes) {
    const el = document.createElement(n.built ? "a" : "div");
    if (n.built) el.href = `/lesson/${n.id}.html`;
    el.dataset.branch = n.branch; el.dataset.id = n.id;
    el.style.left = TX(n.x) + "px"; el.style.top = TY(n.y) + "px";
    if (mode === "mini") {
      // 详细度分级：当前节点=发光框内嵌标号；直接前置/后继=挂标号的点；其余=素点
      const focus = focusId ? byId[focusId] : null;
      const near = focus && (focus.prereqs.includes(n.id) || n.prereqs.includes(focusId));
      el.className = "dot" + (n.id === focusId ? " current" : near ? " near" : "");
      el.title = `${n.id} ${n.zh}`;
      el.setAttribute("aria-label", `${n.id} ${n.zh}`);
      if (n.id === focusId) el.innerHTML = `<span class="dot-id">${n.id}</span>`;
      else if (near) el.innerHTML = `<span class="dot-tag">${n.id}</span>`;
    } else if (n.kind === "cap") {
      // 汇流舱:横条卡形制,与普通芯片明确异形(里程碑不放大同款,换形)
      el.className = "node node-cap";
      el.title = n.hook;
      el.innerHTML = `<span class="n-led"></span><span class="n-id">${n.id}</span>
        <span class="cap-txt"><span class="n-zh">${n.zh}</span><span class="n-en">${n.en}</span></span>`;
    } else {
      el.className = "node";
      el.title = n.hook;
      el.innerHTML = `<span class="n-led"></span>
        <span class="n-head"><span class="n-id">${n.id}</span><span>${n.built ? "" : "···"}</span></span>
        <span class="n-zh">${n.zh}</span><span class="n-en">${n.en}</span>`;
    }
    // 悬停点亮与该节点相连的线路
    el.addEventListener("mouseenter", () => edgeEls.forEach(e =>
      e.classList.toggle("hot", e.dataset.from === n.id || e.dataset.to === n.id)));
    el.addEventListener("mouseleave", () => edgeEls.forEach(e => e.classList.remove("hot")));
    updateNodeClass(el, n);
    nodeEls[n.id] = el;
    stage.appendChild(el);
  }
  vp.appendChild(stage);

  /* ---- 连线（芯片已入 DOM，可量高）---- */
  const half = n => mode === "mini" ? halfH : ((nodeEls[n.id]?.offsetHeight || HALF_H * 2) / 2 + 2);
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "tree-svg");
  svg.setAttribute("width", W); svg.setAttribute("height", H);
  // 难度分层:只留 LEVEL 标签 + 标签旁一小截刻度线(用户裁决:贯穿虚线影响阅读,撤)
  if (mode !== "mini") for (const lv of (data.levels || [])) {
    const ly = TY(lv.y);
    const tick = document.createElementNS(svgNS, "line");
    tick.setAttribute("x1", 14); tick.setAttribute("x2", 58);
    tick.setAttribute("y1", ly); tick.setAttribute("y2", ly);
    tick.setAttribute("class", "level-line");
    svg.appendChild(tick);
    const t = document.createElementNS(svgNS, "text");
    t.setAttribute("x", 14); t.setAttribute("y", ly - 10);
    t.setAttribute("class", "level-label");
    t.textContent = lv.label;
    svg.appendChild(t);
  }
  const edgeEls = [];
  const pending = [];
  for (const n of nodes) {
    for (const p of n.prereqs) {
      const a = byId[p]; if (!a) continue;
      pending.push({ a, n, spec: routeSpec(a, n) });
    }
  }
  // 等分线分配(用户裁决):把两行卡之间的走廊区域三等分(线少)或五等分(线多),
  // 横线一律落在等分线上;同一条等分线只在水平区间互不重叠时共用,
  // 优先用靠中的等分线,由内向外扩散——线自然铺满走廊而不是挤在中线。
  const groups = {};
  for (const e of pending) if (e.spec.bus) (groups[Math.round(e.spec.bus.ym / 4)] ||= []).push(e);
  for (const g of Object.values(groups)) {
    const { corTop, corBot } = g[0].spec.bus;
    const D = g.length <= 2 ? 3 : 5;                       // 三等分或五等分
    const lines = [];
    for (let k = 1; k < D; k++) lines.push({ y: corTop + (corBot - corTop) * k / D, iv: [] });
    // 靠中优先的尝试顺序:D=3→[1,0](即 2/3,1/3);D=5→[2,1,3,0,4]-1 → [1,0,2](中,上,下)…
    const order = [];
    const mid = Math.floor((lines.length - 1) / 2);
    for (let d = 0; d <= lines.length; d++) {
      if (mid - d >= 0) order.push(mid - d);
      if (d > 0 && mid + d < lines.length) order.push(mid + d);
    }
    g.sort((u, v) => (Math.abs(u.spec.bus.x2 - u.spec.bus.x1) - Math.abs(v.spec.bus.x2 - v.spec.bus.x1))
      || (u.n.id < v.n.id ? -1 : 1));                      // 短线先占中线,长线外扩
    for (const e of g) {
      const b = e.spec.bus;
      const lo = Math.min(b.x1, b.x2) - 14, hi = Math.max(b.x1, b.x2) + 14;
      let pick = null;
      for (const li of order) {
        if (!lines[li].iv.some(([a, z]) => lo < z && hi > a)) { pick = li; break; }
      }
      if (pick === null) {                                 // 全被占:选负载最轻的
        pick = order.reduce((best, li) => lines[li].iv.length < lines[best].iv.length ? li : best, order[0]);
      }
      lines[pick].iv.push([lo, hi]);
      b.ym = lines[pick].y;
    }
  }
  for (const { a, n, spec } of pending) {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", spec.d || busPath(spec.bus));
    const cross = a.branch !== n.branch && a.branch !== "root" && n.branch !== "converge";
    path.setAttribute("class", "edge" + (cross ? " cross" : ""));
    path.dataset.from = a.id; path.dataset.to = n.id; path.dataset.branch = n.branch;
    svg.appendChild(path); edgeEls.push(path);
  }
  stage.insertBefore(svg, stage.firstChild);

  function updateNodeClass(el, n) {
    el.classList.remove("locked", "available", "completed");
    if (isDone(n.id)) el.classList.add("completed");
    else if (isAvail(n)) el.classList.add("available");
    else el.classList.add("locked");
  }
  function refreshAll() {
    const d = progress.get();
    done.clear(); d.forEach(x => done.add(x));
    nodes.forEach(n => updateNodeClass(stage.querySelector(`[data-id="${n.id}"]`), n));
    edgeEls.forEach(e => e.classList.toggle("lit", done.has(e.dataset.from)));
    const ct = document.querySelector("[data-tree-count]");
    if (ct) ct.textContent = `${done.size}/${nodes.length}`;
  }
  refreshAll();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshAll(); });

  if (mode === "mini") return;   // 导轨：静态点阵，不装平移缩放

  /* ================= full 模式：平移 / 缩放 / 分支跳转 ================= */
  const rootNode = nodes.find(n => n.branch === "root") || nodes[0];
  let scale = 1, tx = 0, ty = 0;

  function apply() { stage.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; }
  function glide() {               // 带过渡的一次性视角切换
    stage.classList.add("gliding");
    setTimeout(() => stage.classList.remove("gliding"), 500);
  }
  function home() {
    const r = vp.getBoundingClientRect();
    // 桌面上首页左侧有介绍浮层：把根节点放在剩余空间的水平中心
    const intro = vp.closest(".tree-full")?.querySelector(".tree-intro");
    let left = 0;
    if (intro && getComputedStyle(intro).position === "absolute")
      left = intro.offsetLeft + intro.offsetWidth;
    // 初始视角＝俯瞰：横向在介绍浮层右侧的剩余空间里装下整棵树（纵向交给平移），
    // 但比例不低于 0.45 保住芯片可辨；放不下时靠约束保证最左芯片不藏进浮层后面
    scale = Math.max(0.38, Math.min(0.6, (r.width - left - 48) / W));
    tx = left + (r.width - left) / 2 - (W / 2) * scale;
    // 仅当浮层真在树上方悬浮时才需要「最左芯片让位」约束；
    // 移动端浮层是普通文档流（left=0），套这个约束会把根节点推出屏幕
    if (left > 0) tx = Math.max(tx, left + 68);
    ty = 72 - TY(rootNode.y) * scale;
    apply();
  }
  function fit() {
    const r = vp.getBoundingClientRect();
    // 与 home 同一套「避开介绍浮层」逻辑:在浮层右侧的剩余空间里适配
    const intro = vp.closest(".tree-full")?.querySelector(".tree-intro");
    let left = 0;
    if (intro && getComputedStyle(intro).position === "absolute")
      left = intro.offsetLeft + intro.offsetWidth;
    scale = Math.min((r.width - left - 32) / W, (r.height - 24) / H) * 0.96;
    tx = left + 16 + (r.width - left - 32 - W * scale) / 2;
    ty = (r.height - H * scale) / 2;
    glide(); apply();
  }
  function fitBranch(branch) {
    // v3：绿=防御分支本体；case/converge 各自成组
    const ns = nodes.filter(n => n.branch === branch);
    if (!ns.length) return;
    const pad = 120;
    const x0 = Math.min(...ns.map(n => TX(n.x))) - pad, x1 = Math.max(...ns.map(n => TX(n.x))) + pad;
    const y0 = Math.min(...ns.map(n => TY(n.y))) - pad, y1 = Math.max(...ns.map(n => TY(n.y))) + pad;
    const r = vp.getBoundingClientRect();
    scale = Math.min(2.2, Math.max(0.3, Math.min(r.width / (x1 - x0), r.height / (y1 - y0)) * 0.94));
    tx = (r.width - (x0 + x1) * scale) / 2;
    ty = (r.height - (y0 + y1) * scale) / 2;
    glide(); apply();
  }
  function zoomBy(f) {
    const r = vp.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
    const ns = Math.min(2.2, Math.max(0.3, scale * f));
    tx = cx - (cx - tx) * (ns / scale); ty = cy - (cy - ty) * (ns / scale);
    scale = ns; apply();
  }

  /* 拖动平移（跳过节点与浮层控件）+ 双指捏合缩放 */
  const ptrs = new Map();
  let pinch0 = null;
  vp.addEventListener("pointerdown", e => {
    if (e.target.closest(".node,.tree-intro,.tree-legend,.tree-hud,a,button")) return;
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    vp.setPointerCapture(e.pointerId);
    vp.classList.add("dragging");
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), scale };
    }
  });
  vp.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return;
    const prev = ptrs.get(e.pointerId);
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2 && pinch0) {
      const [a, b] = [...ptrs.values()];
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const r = vp.getBoundingClientRect();
      const cx = (a[0] + b[0]) / 2 - r.left, cy = (a[1] + b[1]) / 2 - r.top;
      const ns = Math.min(2.2, Math.max(0.3, pinch0.scale * d / pinch0.d));
      tx = cx - (cx - tx) * (ns / scale); ty = cy - (cy - ty) * (ns / scale);
      scale = ns; apply();
    } else if (ptrs.size === 1) {
      tx += e.clientX - prev[0]; ty += e.clientY - prev[1]; apply();
    }
  });
  const lift = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!ptrs.size) vp.classList.remove("dragging"); };
  vp.addEventListener("pointerup", lift); vp.addEventListener("pointercancel", lift);

  /* 滚轮：平移；⌘/Ctrl+滚轮（含触控板捏合）：缩放。全屏页无页面滚动，可以独占 */
  vp.addEventListener("wheel", e => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const r = vp.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const ds = Math.exp(-e.deltaY * 0.0022);
      const ns = Math.min(2.2, Math.max(0.3, scale * ds));
      tx = mx - (mx - tx) * (ns / scale); ty = my - (my - ty) * (ns / scale);
      scale = ns;
    } else { tx -= e.deltaX; ty -= e.deltaY; }
    apply();
  }, { passive: false });

  document.querySelector("[data-tree-fit]")?.addEventListener("click", fit);
  document.querySelector("[data-tree-zin]")?.addEventListener("click", () => zoomBy(1.25));
  document.querySelector("[data-tree-zout]")?.addEventListener("click", () => zoomBy(0.8));
  document.querySelector("[data-tree-reset-progress]")?.addEventListener("click", () => {
    if (confirm("重置学习进度？")) { progress.clear(); refreshAll(); }
  });
  document.querySelectorAll("[data-jump]").forEach(b =>
    b.addEventListener("click", () => fitBranch(b.dataset.jump)));

  home();
  // 只有视口尺寸真变了才回 home——boot.js 换主题时会广播 resize 让 canvas 重绘，
  // 不能借这个事件把用户拖好的视角吹回原点。
  let lw = vp.clientWidth, lh = vp.clientHeight;
  addEventListener("resize", () => {
    if (vp.clientWidth !== lw || vp.clientHeight !== lh) { lw = vp.clientWidth; lh = vp.clientHeight; home(); }
  });
}
