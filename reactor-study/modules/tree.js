/* REACTOR · tree.js — the interactive talent tree (SVG edges + DOM node chips) */
import { progress } from "/reactor-study/modules/boot.js?v=99169501ec";

const vp = document.getElementById("tree-viewport");
if (vp) init(vp);

function init(vp) {
  const data = JSON.parse(vp.dataset.tree);
  const { nodes, bounds } = data;
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const done = progress.get();

  // state: available if all prereqs done (or no prereqs); completed if in done set
  const isDone = id => done.has(id);
  const isAvail = n => n.prereqs.every(isDone);

  const W = bounds.maxX - bounds.minX, H = bounds.maxY - bounds.minY;
  const ox = -bounds.minX, oy = -bounds.minY; // offset so min → 0

  const stage = document.createElement("div");
  stage.className = "tree-stage";
  stage.style.width = W + "px"; stage.style.height = H + "px";

  // SVG edges
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "tree-svg");
  svg.setAttribute("width", W); svg.setAttribute("height", H);
  const defs = document.createElementNS(svgNS, "defs");
  defs.innerHTML = `<linearGradient id="alloy" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="var(--red)"/><stop offset="1" stop-color="var(--yellow)"/></linearGradient>`;
  svg.appendChild(defs);

  const edgeEls = [];
  for (const n of nodes) {
    for (const p of n.prereqs) {
      const a = byId[p]; if (!a) continue;
      const path = document.createElementNS(svgNS, "path");
      const x1 = a.x + ox, y1 = a.y + oy, x2 = n.x + ox, y2 = n.y + oy;
      const my = (y1 + y2) / 2;
      path.setAttribute("d", `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`);
      const alloy = a.branch !== n.branch && a.branch !== "root" && n.branch !== "converge";
      path.setAttribute("class", "edge" + (alloy ? " alloy" : ""));
      path.dataset.from = p; path.dataset.to = n.id;
      svg.appendChild(path); edgeEls.push(path);
    }
  }
  stage.appendChild(svg);

  // node chips
  for (const n of nodes) {
    const el = document.createElement(n.built ? "a" : "div");
    if (n.built) el.href = `${document.documentElement.dataset.base || ""}/lesson/${n.id}.html`;
    el.className = "node";
    el.dataset.branch = n.branch;
    el.dataset.id = n.id;
    el.style.left = (n.x + ox) + "px"; el.style.top = (n.y + oy) + "px";
    el.title = n.hook;
    el.innerHTML = `<span class="n-led"></span>
      <span class="n-head"><span class="n-id">${n.id}</span><span>${n.built ? "" : "···"}</span></span>
      <span class="n-zh">${n.zh}</span><span class="n-en">${n.en}</span>`;
    updateNodeClass(el, n);
    stage.appendChild(el);
  }

  vp.appendChild(stage);

  function updateNodeClass(el, n) {
    el.classList.remove("locked", "available", "completed");
    if (isDone(n.id)) el.classList.add("completed");
    else if (isAvail(n)) el.classList.add("available");
    else el.classList.add("locked");
  }
  function refreshAll() {
    const d = progress.get();
    done.clear(); d.forEach(x => done.add(x));
    nodes.forEach(n => updateNodeClass(stage.querySelector(`.node[data-id="${n.id}"]`), n));
    edgeEls.forEach(e => e.classList.toggle("lit", done.has(e.dataset.from)));
  }
  refreshAll();

  /* ---- pan & zoom ---- */
  const rootNode = nodes.find(n => n.branch === "root") || nodes[0];
  let scale = 1, tx = 0, ty = 0;
  // initial "home" view: readable zoom, centered horizontally on the root, top-aligned
  function home() {
    const r = vp.getBoundingClientRect();
    // fit the full branch span on screen, but never shrink below readable
    scale = Math.max(0.34, Math.min(0.62, (r.width / W) * 0.98));
    tx = r.width / 2 - (rootNode.x + ox) * scale;
    ty = 40 - (rootNode.y + oy) * scale + 30;
    apply();
  }
  // "适配" = true fit-all overview
  function fit() {
    const r = vp.getBoundingClientRect();
    scale = Math.min(r.width / W, r.height / H) * 0.94;
    tx = (r.width - W * scale) / 2;
    ty = (r.height - H * scale) / 2;
    apply();
  }
  function zoomBy(f) {
    const r = vp.getBoundingClientRect(), cx = r.width / 2, cy = r.height / 2;
    const ns = Math.min(2.2, Math.max(0.3, scale * f));
    tx = cx - (cx - tx) * (ns / scale); ty = cy - (cy - ty) * (ns / scale);
    scale = ns; apply();
  }
  function apply() { stage.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`; }

  let dragging = false, sx = 0, sy = 0;
  vp.addEventListener("pointerdown", e => {
    if (e.target.closest(".node")) return;
    dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
    vp.classList.add("dragging"); vp.setPointerCapture(e.pointerId);
  });
  vp.addEventListener("pointermove", e => { if (!dragging) return; tx = e.clientX - sx; ty = e.clientY - sy; apply(); });
  vp.addEventListener("pointerup", e => { dragging = false; vp.classList.remove("dragging"); });
  // wheel zooms ONLY with ctrl/⌘ held; otherwise let the page scroll normally
  vp.addEventListener("wheel", e => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const r = vp.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const ds = Math.exp(-e.deltaY * 0.0016);
    const ns = Math.min(2.2, Math.max(0.3, scale * ds));
    tx = mx - (mx - tx) * (ns / scale); ty = my - (my - ty) * (ns / scale);
    scale = ns; apply();
  }, { passive: false });

  vp.querySelector("[data-tree-fit]")?.addEventListener("click", fit);
  vp.querySelector("[data-tree-zin]")?.addEventListener("click", () => zoomBy(1.25));
  vp.querySelector("[data-tree-zout]")?.addEventListener("click", () => zoomBy(0.8));
  vp.querySelector("[data-tree-reset-progress]")?.addEventListener("click", () => {
    if (confirm("重置学习进度？")) { progress.clear(); refreshAll(); }
  });
  home();
  // refresh when returning to page (progress may have changed)
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshAll(); });
}
