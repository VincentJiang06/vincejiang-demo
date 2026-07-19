/* REACTOR · explorable.js (generic, config-driven) — 预测→操作→揭示 三段式引擎
   modes（旧字段照旧渲染，新字段全部可选，现有课页零改动可用）:
     "steps"   {steps:[{k,t,html,ev?}]}       — 论证链：侧栏 + 步进器（进度点/左右键），ev 是可展开的证据
     "compare" {a:{t,html}, b:{t,html}, label} — A/B 切换，新增「两个一起看」并排视图
     "cards"   {cards:[{title,tag,html,mech,detail?}]} — 可过滤卡片，detail 可展开
     "matrix"  {cols, rows:[{h,cells}], note} — 行列十字联动高亮，点击钉住一行
   三段式（可选，加在 config 顶层）:
     predict: { q:"抛给读者的问题", options:["选项文字" 或 {t, ok?}],
                answer?: 正确项下标（或在 options 里标 ok:true；都不给就是开放猜测，不判对错）,
                reveal?: "<html> 对照解说", plain?: "一句大白话：这说明什么" }
   流程：先猜一个 → 面板通电、亲手操作 → 操作过了才能对答案。 */
import { mount, stepper } from "/modules/mod-kit.js?v=49b358d492";
import { optionGroup } from "/modules/quiz.js?v=97821644bf";

mount("explorable", (body, fig, { config }) => {
  const mode = config.mode || "steps";
  const render = ({ steps, compare, cards, matrix }[mode]) || steps;
  if (!config.predict) { render(body, config, () => {}); return; }
  threePhase(body, config, render);
});

/* —— 三段式脚手架：预测(gate) → 操作(stage) → 揭示(reveal) —— */
function threePhase(body, cfg, render) {
  const P = cfg.predict;
  const opts = (P.options || []).map(o => typeof o === "string" ? { t: o } : o);
  const answer = (P.answer != null) ? P.answer : opts.findIndex(o => o.ok);
  let predicted = null, acted = false, revealed = false;

  /* 01 · 先猜一猜 */
  const gate = document.createElement("div");
  gate.className = "predict-gate";
  gate.innerHTML = `<div class="phase-tag"><span class="led on"></span>第 1 步 · 先猜一猜</div>`;
  body.appendChild(gate);
  optionGroup(gate, {
    q: P.q, options: opts, mode: "pick",
    onpick: i => { predicted = i; stage.classList.add("armed"); sync(); }
  });

  /* 02 · 亲手试（未预测前面板断电） */
  const stage = document.createElement("div");
  stage.className = "stage";
  const stageTag = document.createElement("div");
  stageTag.className = "phase-tag";
  stageTag.innerHTML = `<span class="led"></span>第 2 步 · 亲手试`;
  const inner = document.createElement("div");
  inner.className = "stage-inner";
  const shutter = document.createElement("div");
  shutter.className = "shutter";
  shutter.innerHTML = `<span class="led"></span><span>先在上面选一个你的猜测，这块面板才会亮</span>`;
  stage.append(stageTag, inner, shutter);
  body.appendChild(stage);
  render(inner, cfg, () => { if (!acted) { acted = true; sync(); } });

  /* 03 · 对答案 */
  const rev = document.createElement("div");
  rev.className = "reveal";
  rev.innerHTML = `<div class="phase-tag"><span class="led"></span>第 3 步 · 对答案</div>`;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn"; btn.textContent = "对答案"; btn.disabled = true;
  const note = document.createElement("span");
  note.className = "label"; note.style.marginLeft = "12px";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;flex-wrap:wrap;gap:4px";
  row.append(btn, note);
  const panel = document.createElement("div");
  panel.className = "reveal-panel";
  panel.style.display = "none";
  rev.append(row, panel);
  body.appendChild(rev);

  btn.onclick = () => {
    if (revealed || predicted == null) return;
    revealed = true;
    let html = `<div class="rv-row"><span class="label">你的猜测</span><span>${opts[predicted].t}</span></div>`;
    if (answer >= 0) {
      const hit = predicted === answer;
      html += `<div class="rv-row"><span class="label">实际情况</span><span>${opts[answer].t}</span></div>
        <div class="rv-verdict ${hit ? "ok" : "no"}"><span class="led on"></span>${hit ? "猜对了" : "和实际不一样，差别在下面"}</div>`;
    }
    if (P.reveal) html += `<div class="read rv-read">${P.reveal}</div>`;
    if (P.plain) html += `<div class="rv-plain"><span class="label">这说明什么</span><div class="rv-plain-body">${P.plain}</div></div>`;
    panel.innerHTML = html;
    panel.style.display = "block";
    rev.querySelector(".phase-tag .led").className = "led on";
    btn.disabled = true;
    note.textContent = "";
  };

  function sync() {
    if (revealed) return;
    stageTag.querySelector(".led").className = predicted != null ? "led on" : "led";
    btn.disabled = !(predicted != null && acted);
    note.textContent = predicted == null ? "先猜一个"
      : (acted ? "可以对答案了" : "把上面的演示走一遍，就能对答案");
  }
  sync();
}

/* —— steps：论证链（v2 用户裁决:不再步进翻页,全部阶段一次性纵向展示,
   左侧 LED 脊柱随滚动自上而下依次点亮,亮过不复暗;全部亮过=操作完成）—— */
function steps(body, cfg, onact = () => {}) {
  const items = cfg.steps || [];
  if (!items.length) return;
  const stack = document.createElement("div");
  stack.className = "steps-stack";
  items.forEach((s, i) => {
    const row = document.createElement("div");
    row.className = "step-row";
    row.innerHTML = `<span class="step-spine"><span class="led"></span></span>
      <div class="step-body">
        <div class="label step-k">${s.k || "0" + (i + 1)}${s.t ? " · " + s.t : ""}</div>
        <div class="read">${s.html}</div>
        ${s.ev ? `<div class="ev"><button type="button" class="btn ev-toggle">看证据</button><div class="ev-body">${s.ev}</div></div>` : ""}
      </div>`;
    if (s.ev) {
      const ev = row.querySelector(".ev");
      const tg = row.querySelector(".ev-toggle");
      tg.onclick = () => { tg.textContent = ev.classList.toggle("open") ? "收起证据" : "看证据"; };
    }
    stack.appendChild(row);
  });
  body.appendChild(stack);
  // 单调点亮:进入视口即亮到该行(含之前所有行),永不回退
  let lit = -1;
  const rows = [...stack.children];
  const lightTo = i => {
    if (i <= lit) return;
    for (let j = lit + 1; j <= i; j++) {
      rows[j].classList.add("lit");
      rows[j].querySelector(".led").className = "led on";
    }
    lit = i;
    if (lit === rows.length - 1) onact();
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) lightTo(rows.indexOf(e.target));
    }), { threshold: 0.35 });
    rows.forEach(r => io.observe(r));
  } else lightTo(rows.length - 1);
}

/* —— compare：A/B 切换 + 并排对照。A、B 都看过（或直接并排看）算「操作完成」 —— */
function compare(body, cfg, onact = () => {}) {
  const st = { view: "a", seen: { a: false, b: false } };
  const views = [["a", cfg.a.t || "A"], ["b", cfg.b.t || "B"], ["ab", "两个一起看"]];
  const bar = document.createElement("div"); bar.className = "controls";
  const bank = document.createElement("div"); bank.className = "toggle-bank";
  views.forEach(([v, lbl]) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = lbl;
    b.onclick = () => { if (st.view !== v) { st.view = v; render(); } };
    bank.appendChild(b);
  });
  const cwrap = document.createElement("div"); cwrap.className = "control";
  cwrap.innerHTML = `<label>${cfg.label || "对照"}</label>`;
  cwrap.appendChild(bank);
  bar.appendChild(cwrap);
  const panel = document.createElement("div");
  panel.className = "glass bolted"; panel.style.marginTop = "12px";
  const block = s => `<div><div class="label" style="color:var(--accent);margin-bottom:10px">${s.t || ""}</div><div class="read">${s.html}</div></div>`;
  function render() {
    [...bank.children].forEach((b, i) => b.setAttribute("aria-pressed", String(views[i][0] === st.view)));
    if (st.view === "ab") {
      st.seen.a = st.seen.b = true;
      panel.innerHTML = `<div class="duo-text">${block(cfg.a)}${block(cfg.b)}</div>`;
    } else {
      st.seen[st.view] = true;
      panel.innerHTML = block(cfg[st.view]);
    }
    if (st.seen.a && st.seen.b) onact();
  }
  body.append(bar, panel);
  render();
}

/* —— cards：可过滤卡片。chip 带计数，卡片可展开细节 —— */
function cards(body, cfg, onact = () => {}) {
  const items = cfg.cards || [];
  const mechs = [...new Set(items.map(c => c.mech).filter(Boolean))];
  let active = null;
  const filt = document.createElement("div");
  filt.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px";
  const chip = (lbl, m, n) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn";
    b.style.fontSize = ".66rem"; b.style.padding = ".45em .8em";
    b.innerHTML = `${lbl} <span style="opacity:.6">${n}</span>`;
    b.dataset.m = m == null ? "" : m;
    b.onclick = () => { if (active !== m) { active = m; render(); onact(); } };
    return b;
  };
  filt.appendChild(chip("全部", null, items.length));
  mechs.forEach(m => filt.appendChild(chip(m, m, items.filter(c => c.mech === m).length)));
  const grid = document.createElement("div"); grid.className = "cards";
  function render() {
    [...filt.children].forEach(c => c.style.borderColor = (c.dataset.m === (active || "")) ? "var(--accent)" : "var(--line-2)");
    grid.innerHTML = "";
    items.filter(c => !active || c.mech === active).forEach(c => {
      const el = document.createElement("div"); el.className = "card";
      el.innerHTML = `${c.tag ? `<span class="num">${c.tag}</span>` : ""}<h3>${c.title}</h3><p>${c.html}</p>`
        + (c.detail ? `<button type="button" class="card-more">展开细节 +</button><div class="card-detail">${c.detail}</div>` : "")
        + (c.mech ? `<div class="label" style="margin-top:10px;color:var(--accent)">机制 · ${c.mech}</div>` : "");
      if (c.detail) {
        const more = el.querySelector(".card-more");
        more.onclick = () => {
          more.textContent = el.classList.toggle("open") ? "收起细节" : "展开细节 +";
          onact();
        };
      }
      grid.appendChild(el);
    });
  }
  body.append(filt, grid);
  render();
}

/* —— matrix：行列十字联动高亮 + 点击钉行 —— */
function matrix(body, cfg, onact = () => {}) {
  const t = document.createElement("div"); t.className = "scroll-x";
  const tbl = document.createElement("table");
  tbl.className = "atlas-table"; tbl.style.minWidth = "560px";
  tbl.innerHTML = `<tr>${["", ...cfg.cols].map(c => `<th>${c}</th>`).join("")}</tr>` +
    cfg.rows.map(r => `<tr><th style="color:var(--accent)">${r.h}</th>${r.cells.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");
  let lastR = -1, lastC = -1, pinned = -1, actedOnce = false;
  const act = () => { if (!actedOnce) { actedOnce = true; onact(); } };
  function paint() {
    [...tbl.rows].forEach((tr, ri) => {
      tr.classList.toggle("hl-row", ri > 0 && (ri === lastR || ri === pinned));
      tr.classList.toggle("pinned", ri === pinned);
      [...tr.cells].forEach((cell, ci) => cell.classList.toggle("hl-col", ri > 0 && ci > 0 && ci === lastC));
    });
  }
  function setHL(r, c) {
    if (r === lastR && c === lastC) return;           // 值没变就不动 DOM
    lastR = r; lastC = c;
    paint();
    if (r > 0) act();
  }
  tbl.addEventListener("mouseover", e => {
    const cell = e.target.closest("td,th"); if (!cell) return;
    const tr = cell.closest("tr"); if (!tr || tr.rowIndex === 0) return;
    setHL(tr.rowIndex, cell.cellIndex);
  });
  tbl.addEventListener("mouseleave", () => setHL(-1, -1));
  tbl.addEventListener("click", e => {
    const tr = e.target.closest("tr"); if (!tr || tr.rowIndex === 0) return;
    pinned = pinned === tr.rowIndex ? -1 : tr.rowIndex;
    paint();
    act();
  });
  t.appendChild(tbl);
  body.appendChild(t);
  const n = document.createElement("p");
  n.className = "label"; n.style.marginTop = "12px";
  n.innerHTML = cfg.note || "鼠标放到格子上，同一行和同一列会一起亮；点一行可以钉住它，再点一下取消。";
  body.appendChild(n);
}
