/* REACTOR · explorable.js (generic, config-driven)
   modes:
     "steps"   {steps:[{k,t,html}]}            — stepper with LED rail (default)
     "compare" {a:{t,html}, b:{t,html}, label} — A/B toggle
     "cards"   {cards:[{title,tag,html,mech}], filters?}  — filterable card grid
     "matrix"  {cols:[...], rows:[{h, cells:[...]}], note} — hover-highlight table
*/
import { mount, scoped } from "/modules/mod-kit.js?v=fccf0ac854";

mount("explorable", (body, fig, { config }) => {
  const mode = config.mode || "steps";
  ({ steps, compare, cards, matrix }[mode] || steps)(body, config);
});

function steps(body, cfg) {
  const items = cfg.steps || [];
  const wrap = document.createElement("div");
  wrap.style.cssText = "display:grid;grid-template-columns:minmax(120px,180px) 1fr;gap:20px;align-items:start";
  const rail = document.createElement("div");
  rail.style.cssText = "display:flex;flex-direction:column;gap:6px";
  const panel = document.createElement("div");
  panel.className = "glass bolted"; panel.style.minHeight = "150px";
  items.forEach((s, i) => {
    const b = document.createElement("button");
    b.style.cssText = "display:flex;align-items:center;gap:8px;text-align:left;font:inherit;color:var(--text-2);background:transparent;border:0;border-left:2px solid var(--line);padding:8px 10px;cursor:pointer;transition:.15s";
    b.innerHTML = `<span class="led"></span><span style="font-family:var(--font-mono);font-size:.72rem;letter-spacing:.05em">${s.k || "0" + (i + 1)}</span><span style="font-size:.82rem">${s.t || ""}</span>`;
    b.onclick = () => sel(i);
    rail.appendChild(b);
  });
  function sel(i) {
    [...rail.children].forEach((c, j) => {
      c.style.borderLeftColor = j === i ? "var(--accent)" : "var(--line)";
      c.style.color = j === i ? "var(--text)" : "var(--text-2)";
      c.querySelector(".led").className = j <= i ? "led on" : "led";
    });
    const s = items[i];
    panel.innerHTML = `<div class="label" style="color:var(--accent);margin-bottom:10px">${s.k || "0" + (i + 1)} · ${s.t || ""}</div><div class="read">${s.html}</div>`;
  }
  wrap.append(rail, panel); body.appendChild(wrap); sel(0);
}

function compare(body, cfg) {
  const st = { on: false };
  const bar = document.createElement("div"); bar.className = "controls";
  const bank = document.createElement("div"); bank.className = "toggle-bank";
  const mk = (lbl, v) => { const b = document.createElement("button"); b.textContent = lbl; b.setAttribute("aria-pressed", String(v === st.on)); b.onclick = () => { st.on = v; render(); }; return b; };
  bank.append(mk(cfg.a.t || "A", false), mk(cfg.b.t || "B", true));
  const cwrap = document.createElement("div"); cwrap.className = "control";
  cwrap.innerHTML = `<label>${cfg.label || "对照"}</label>`; cwrap.appendChild(bank);
  bar.appendChild(cwrap);
  const panel = document.createElement("div"); panel.className = "glass bolted"; panel.style.marginTop = "12px";
  function render() {
    bank.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-pressed", String(!!i === st.on)));
    const s = st.on ? cfg.b : cfg.a;
    panel.innerHTML = `<div class="label" style="color:var(--accent);margin-bottom:10px">${s.t || ""}</div><div class="read">${s.html}</div>`;
  }
  body.append(bar, panel); render();
}

function cards(body, cfg) {
  const items = cfg.cards || [];
  const mechs = [...new Set(items.map(c => c.mech).filter(Boolean))];
  let active = null;
  const filt = document.createElement("div");
  filt.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px";
  const allBtn = chip("全部", null);
  filt.appendChild(allBtn);
  mechs.forEach(m => filt.appendChild(chip(m, m)));
  function chip(lbl, m) {
    const b = document.createElement("button"); b.className = "btn"; b.style.fontSize = ".66rem"; b.style.padding = ".45em .8em";
    b.textContent = lbl; b.onclick = () => { active = m; render(); }; return b;
  }
  const grid = document.createElement("div"); grid.className = "cards";
  function render() {
    [...filt.children].forEach(c => c.style.borderColor = (c.textContent === (active || "全部")) ? "var(--accent)" : "var(--line-2)");
    grid.innerHTML = "";
    items.filter(c => !active || c.mech === active).forEach(c => {
      const el = document.createElement("div"); el.className = "card";
      el.innerHTML = `${c.tag ? `<span class="num">${c.tag}</span>` : ""}<h3>${c.title}</h3><p>${c.html}</p>${c.mech ? `<div class="label" style="margin-top:10px;color:var(--accent)">机制 · ${c.mech}</div>` : ""}`;
      grid.appendChild(el);
    });
  }
  body.append(filt, grid); render();
}

function matrix(body, cfg) {
  const t = document.createElement("div"); t.className = "scroll-x";
  const tbl = document.createElement("table"); tbl.className = "atlas-table"; tbl.style.minWidth = "560px";
  tbl.innerHTML = `<tr>${["", ...cfg.cols].map(c => `<th>${c}</th>`).join("")}</tr>` +
    cfg.rows.map(r => `<tr><th style="color:var(--accent)">${r.h}</th>${r.cells.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
  tbl.querySelectorAll("tr").forEach(tr => tr.addEventListener("mouseenter", () => {
    tbl.querySelectorAll("tr").forEach(x => x.style.background = "");
    tr.style.background = "color-mix(in srgb,var(--accent) 8%,transparent)";
  }));
  t.appendChild(tbl); body.appendChild(t);
  if (cfg.note) { const n = document.createElement("p"); n.className = "label"; n.style.marginTop = "12px"; n.innerHTML = cfg.note; body.appendChild(n); }
}
