/* REACTOR · mod-kit.js — shared helpers for interactive modules */
import { t, tf } from "/modules/mod-i18n.js";

export function mount(name, factory) {
  document.querySelectorAll(`figure.module[data-module="${name}"]`).forEach(fig => {
    const body = fig.querySelector(".module-body");
    const cfgEl = fig.querySelector(".mod-config");
    let config = {};
    try { config = cfgEl ? JSON.parse(cfgEl.textContent) : {}; } catch {}
    const variant = fig.dataset.modname || name;
    body.innerHTML = "";
    try { factory(body, fig, { config, variant }); }
    catch (e) { body.innerHTML = `<div class="noscript-fallback">${t("模块加载失败：")}${e.message}</div>`; console.error(e); }
  });
}
/* branch-scoped CSS var reader bound to a module element */
export function scoped(fig) { return n => cssvar(n, fig); }

/* slider control → returns {el, input, get, on} */
export function slider(body, { label, min, max, step = 1, value, unit = "", fmt }) {
  const wrap = document.createElement("div");
  wrap.className = "control";
  const id = "c" + Math.random().toString(36).slice(2, 7);
  const format = fmt || (v => v + unit);
  wrap.innerHTML = `<label for="${id}">${label}<span class="val">${format(value)}</span></label>
    <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  const input = wrap.querySelector("input");
  const val = wrap.querySelector(".val");
  const api = {
    el: wrap, input,
    get: () => +input.value,
    on(cb) { input.addEventListener("input", () => { val.textContent = format(+input.value); cb(+input.value); }); return api; }
  };
  return api;
}

export function toggleBank(body, { label, options, value, onchange }) {
  const wrap = document.createElement("div");
  wrap.className = "control";
  wrap.innerHTML = `<label>${label}</label>`;
  const bank = document.createElement("div"); bank.className = "toggle-bank";
  options.forEach(o => {
    const b = document.createElement("button");
    b.textContent = o.label; b.dataset.v = o.value;
    b.setAttribute("aria-pressed", String(o.value === value));
    b.onclick = () => {
      bank.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true"); onchange(o.value);
    };
    bank.appendChild(b);
  });
  wrap.appendChild(bank);
  return wrap;
}

export function controls(body) {
  const c = document.createElement("div"); c.className = "controls";
  body.appendChild(c); return c;
}
export function add(parent, ...els) { els.forEach(e => parent.appendChild(e.el || e)); return parent; }

export function canvas(body, h = 320) {
  const c = document.createElement("canvas");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const resize = () => {
    const w = body.clientWidth || 600;
    c.width = w * dpr; c.height = h * dpr; c.style.height = h + "px";
    const ctx = c.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  };
  body.appendChild(c);
  const ctx = c.getContext("2d");
  return { c, ctx, resize, dpr };
}

export function readout(body, html) {
  const r = document.createElement("div"); r.className = "readout";
  r.innerHTML = html; body.appendChild(r); return r;
}
export function legend(body, items) {
  const l = document.createElement("div"); l.className = "legend";
  l.innerHTML = items.map(i => `<span class="k" style="--_k:${i.c}"><span></span>${i.t}</span>`).join("");
  body.appendChild(l); return l;
}

/* read a CSS custom property; pass the module element to honor branch scope */
export function cssvar(name, el) {
  return getComputedStyle(el || document.documentElement).getPropertyValue(name).trim() || "#888";
}
export const rng = (seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)(12345);
export function gauss() { let u = 0, v = 0; while (!u) u = rng(); while (!v) v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/* ============================================================
   W11a 扩容——以下全部是新增导出，向后兼容，不改上面的任何签名。
   ============================================================ */

/* presets — 场景预设 chip 组。一键把一组参数换成典型场景。
   items:[{k?,t,note?,...任意负载}] → {el, select(i, fire?), index}
   select(i,false) 只改高亮不触发回调（初始化用）。 */
export function presets(body, { label = t("一键换场景"), items = [], value = null, onselect }) {
  const wrap = document.createElement("div");
  wrap.className = "control";
  wrap.innerHTML = `<label>${label}</label>`;
  const bank = document.createElement("div");
  bank.className = "preset-bank";
  let idx = null;
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.innerHTML = `${it.k ? `<span class="pk">${it.k}</span>` : ""}<span>${it.t}</span>`;
    b.setAttribute("aria-pressed", "false");
    if (it.note) b.title = it.note;
    b.onclick = () => select(i, true);
    bank.appendChild(b);
  });
  function select(i, fire = true) {
    if (i === idx) return;
    idx = i;
    [...bank.children].forEach((c, j) => c.setAttribute("aria-pressed", String(j === i)));
    if (fire && onselect) onselect(items[i], i);
  }
  if (value != null) select(value, false);
  wrap.appendChild(bank);
  body.appendChild(wrap);
  return { el: wrap, select, get index() { return idx; } };
}

/* stepper — 分步演示器：上一步/下一步 + 进度点 + 计数 + 键盘左右键。
   {count, value?, onstep(i, dir)} → {el, go(i), next(), prev(), index}
   go 到相同步号是空操作，因此和别的导航（侧栏、点击）互相同步不会循环触发。 */
export function stepper(body, { count, value = 0, onstep, prevLabel = t("上一步"), nextLabel = t("下一步") }) {
  const bar = document.createElement("div");
  bar.className = "stepper-bar";
  bar.tabIndex = 0;
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", t("分步演示，可用左右方向键切换"));
  const mkBtn = (t, dir) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn step-btn";
    b.textContent = t;
    b.onclick = () => go(i + dir);
    return b;
  };
  const prev = mkBtn(prevLabel, -1), next = mkBtn(nextLabel, 1);
  const dots = document.createElement("div"); dots.className = "step-dots";
  for (let d = 0; d < count; d++) {
    const dot = document.createElement("button");
    dot.type = "button"; dot.className = "dot";
    dot.setAttribute("aria-label", tf("跳到第 {} 步", d + 1));
    dot.onclick = ((n) => () => go(n))(d);
    dots.appendChild(dot);
  }
  const counter = document.createElement("span"); counter.className = "step-counter mono";
  let i = -1;
  function go(n, fire = true) {
    n = Math.max(0, Math.min(count - 1, n));
    if (n === i) return;
    const dir = n > i ? 1 : -1;
    i = n;
    [...dots.children].forEach((d, j) => {
      d.classList.toggle("done", j < i);
      d.classList.toggle("cur", j === i);
    });
    prev.disabled = i === 0;
    next.disabled = i === count - 1;
    counter.textContent = `${String(i + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
    if (fire && onstep) onstep(i, dir);
  }
  bar.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { go(i - 1); e.preventDefault(); }
    if (e.key === "ArrowRight") { go(i + 1); e.preventDefault(); }
  });
  bar.append(prev, dots, counter, next);
  body.appendChild(bar);
  go(value, false);
  return { el: bar, go, next: () => go(i + 1), prev: () => go(i - 1), get index() { return i; } };
}

/* tabs — 面板切换。items:[{t, html? 或 render?(panel,i)}] → {el, bar, panel, select(i), index} */
export function tabs(body, { items = [], value = 0, onchange }) {
  const wrap = document.createElement("div"); wrap.className = "tabs";
  const bar = document.createElement("div"); bar.className = "tab-bar"; bar.setAttribute("role", "tablist");
  const panel = document.createElement("div"); panel.className = "tab-panel";
  let idx = -1;
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.setAttribute("aria-selected", "false");
    b.textContent = it.t;
    b.onclick = () => select(i);
    bar.appendChild(b);
  });
  function select(i) {
    if (i === idx) return;
    idx = i;
    [...bar.children].forEach((c, j) => c.setAttribute("aria-selected", String(j === i)));
    const it = items[i];
    if (it.render) { panel.innerHTML = ""; it.render(panel, i); }
    else if (it.html != null) panel.innerHTML = it.html;
    if (onchange) onchange(i, panel);
  }
  wrap.append(bar, panel);
  body.appendChild(wrap);
  if (items.length) select(value);
  return { el: wrap, bar, panel, select, get index() { return idx; } };
}

/* compareCanvas — A/B 并排双画布（窄屏自动上下堆叠）。
   {a?,b?,h?} → {el, a:{c,ctx,resize,label}, b:{同}, resize()}
   resize 只在尺寸真变时重设 canvas（性能红线）。 */
export function compareCanvas(body, { a = "A", b = "B", h = 260 } = {}) {
  const grid = document.createElement("div"); grid.className = "compare-duo";
  body.appendChild(grid);
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const mk = t => {
    const cell = document.createElement("div"); cell.className = "duo-cell";
    const lab = document.createElement("div"); lab.className = "label"; lab.textContent = t;
    const c = document.createElement("canvas");
    cell.append(lab, c); grid.appendChild(cell);
    const ctx = c.getContext("2d");
    const resize = () => {
      const w = cell.clientWidth || 300;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr; c.height = h * dpr; c.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return { w, h };
    };
    return { c, ctx, resize, label: lab };
  };
  const A = mk(a), B = mk(b);
  return { el: grid, a: A, b: B, resize: () => ({ a: A.resize(), b: B.resize() }) };
}

/* annot — canvas 上的标注层（气泡 pin / 高亮框）。
   传 canvas() 或 compareCanvas().a 的返回值（或 canvas 元素本身）。
   show(pins)：pins=[{x,y,t,dir?:"right"|"left"|"up"|"down"}]
              或 {kind:"box", x,y,w,h,t?}，坐标用 CSS 像素（和绘图坐标一致）。
   内容没变就不动 DOM（性能红线）。 */
export function annot(cv) {
  const c = cv.c || cv;
  const wrap = document.createElement("div"); wrap.className = "annot-wrap";
  c.parentNode.insertBefore(wrap, c);
  wrap.appendChild(c);
  const layer = document.createElement("div"); layer.className = "annot-layer";
  wrap.appendChild(layer);
  let last = "";
  function show(pins = []) {
    const key = JSON.stringify(pins);
    if (key === last) return;
    last = key;
    layer.innerHTML = "";
    pins.forEach(p => {
      if (p.kind === "box") {
        const b = document.createElement("div"); b.className = "annot-box";
        b.style.left = p.x + "px"; b.style.top = p.y + "px";
        b.style.width = (p.w || 40) + "px"; b.style.height = (p.h || 24) + "px";
        if (p.t) b.innerHTML = `<span class="annot-tag">${p.t}</span>`;
        layer.appendChild(b);
      } else {
        const pin = document.createElement("div");
        pin.className = "annot-pin " + (p.dir || "right");
        pin.style.left = p.x + "px"; pin.style.top = p.y + "px";
        pin.innerHTML = `<span class="led on"></span><span class="annot-bubble">${p.t}</span>`;
        layer.appendChild(pin);
      }
    });
  }
  return { el: layer, show, clear: () => show([]) };
}

/* miniTable — 紧凑数据表 readout。{cols, rows, note?} → {el, update(rows), highlight(ri)}
   update 只在数据真变时重建行；highlight(-1) 取消高亮。 */
export function miniTable(body, { cols = [], rows = [], note } = {}) {
  const wrap = document.createElement("div"); wrap.className = "mini-table-wrap scroll-x";
  const tbl = document.createElement("table"); tbl.className = "mini-table";
  tbl.innerHTML = `<thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody></tbody>`;
  const tbody = tbl.querySelector("tbody");
  wrap.appendChild(tbl);
  if (note) {
    const n = document.createElement("div");
    n.className = "label"; n.style.marginTop = "8px"; n.innerHTML = note;
    wrap.appendChild(n);
  }
  body.appendChild(wrap);
  let last = "", hi = -1;
  function update(rs) {
    const key = JSON.stringify(rs);
    if (key === last) return;
    last = key;
    tbody.innerHTML = rs.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
    if (hi >= 0) paint();
  }
  function paint() { [...tbody.children].forEach((tr, j) => tr.classList.toggle("hi", j === hi)); }
  function highlight(ri) { if (ri === hi) return; hi = ri; paint(); }
  update(rows);
  return { el: wrap, update, highlight };
}
