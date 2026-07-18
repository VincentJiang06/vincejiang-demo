/* REACTOR · mod-kit.js — shared helpers for interactive modules */

export function mount(name, factory) {
  document.querySelectorAll(`figure.module[data-module="${name}"]`).forEach(fig => {
    const body = fig.querySelector(".module-body");
    const cfgEl = fig.querySelector(".mod-config");
    let config = {};
    try { config = cfgEl ? JSON.parse(cfgEl.textContent) : {}; } catch {}
    const variant = fig.dataset.modname || name;
    body.innerHTML = "";
    try { factory(body, fig, { config, variant }); }
    catch (e) { body.innerHTML = `<div class="noscript-fallback">模块加载失败：${e.message}</div>`; console.error(e); }
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
