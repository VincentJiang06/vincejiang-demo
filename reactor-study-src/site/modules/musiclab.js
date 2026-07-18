/* REACTOR · musiclab.js (R10) — Salganik, Dodds & Watts 2006 artificial market */
import { mount, canvas, controls, slider, add, readout, legend, scoped } from "/modules/mod-kit.js";

mount("musiclab", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "48 首歌，各有内在吸引力。听众顺序到达。拖动『社会影响』：看得到排行榜时，赢家通吃更极端，而谁封王变得几乎全看运气。";
  body.appendChild(intro);
  const N = 48, LISTENERS = 2600, WORLDS = 6;
  let social = 1.0;
  const appeal = Array.from({ length: N }, () => (Math.random() - 0.5) * 2);
  const pdl = appeal.map(a => 1 / (1 + Math.exp(-(a - 0.4))));
  const ctrl = controls(body);
  add(ctrl, slider(body, { label: "社会影响强度（榜单可见度）", min: 0, max: 20, step: 2, value: 10, fmt: v => (v / 10).toFixed(1) }).on(v => { social = v / 10; run(); }));

  function world(seed) {
    const dl = new Float64Array(N);
    for (let t = 0; t < LISTENERS; t++) {
      let probs;
      if (social > 0.01) {
        const order = [...dl.keys()].sort((a, b) => dl[b] - dl[a]);
        const pos = new Float64Array(N); order.forEach((idx, r) => pos[idx] = r + 1);
        let s = 0; probs = new Float64Array(N);
        for (let i = 0; i < N; i++) { probs[i] = Math.pow(pos[i], -social); s += probs[i]; }
        for (let i = 0; i < N; i++) probs[i] /= s;
      } else { probs = new Float64Array(N).fill(1 / N); }
      let r = Math.random(), j = 0, acc = 0; for (; j < N; j++) { acc += probs[j]; if (r < acc) break; }
      if (Math.random() < pdl[Math.min(j, N - 1)]) dl[Math.min(j, N - 1)]++;
    }
    return dl;
  }
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "各平行世界的市场份额（点）" }, { c: "var(--ink-300)", t: "无社会影响时的平均（≈真实质量）" }]);
  let worlds;
  function run() { worlds = Array.from({ length: WORLDS }, (_, s) => world(s)); draw(); }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const pad = 38, gw = w - pad * 2, gh = h - pad * 2;
    const order = [...appeal.keys()].sort((a, b) => appeal[b] - appeal[a]); // best → worst on x
    const shares = worlds.map(dl => { const s = dl.reduce((a, b) => a + b, 0) || 1; return [...dl].map(x => x / s); });
    const hi = Math.max(...shares.flat(), 0.1);
    const X = i => pad + (i / (N - 1)) * gw, Y = v => pad + gh - (v / hi) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    // baseline = pure appeal share
    const base = pdl.map(p => p); const bs = base.reduce((a, b) => a + b, 0);
    ctx.beginPath(); order.forEach((idx, i) => { const y = Y(base[idx] / bs); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); }); ctx.strokeStyle = C("--ink-300"); ctx.lineWidth = 1.5; ctx.stroke();
    shares.forEach(sh => order.forEach((idx, i) => { ctx.beginPath(); ctx.arc(X(i), Y(sh[idx]), 2.4, 0, 7); ctx.fillStyle = C("--accent"); ctx.globalAlpha = .55; ctx.fill(); ctx.globalAlpha = 1; }));
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("歌曲（按真实质量排序，左=最好）→", pad + 4, h - 8);
    // gini + best-song rank spread
    const gini = a => { const s = [...a].sort((x, y) => x - y), n = s.length, sum = s.reduce((p, q) => p + q, 0) || 1; return (s.reduce((p, q, i) => p + (2 * (i + 1) - n - 1) * q, 0)) / (n * sum); };
    const g = shares.map(gini).reduce((a, b) => a + b, 0) / WORLDS;
    const best = appeal.indexOf(Math.max(...appeal));
    const ranks = worlds.map(dl => [...dl.keys()].sort((a, b) => dl[b] - dl[a]).indexOf(best) + 1);
    out.innerHTML = `不平等 Gini <span class="big">${g.toFixed(2)}</span> &nbsp;·&nbsp; 最好那首歌在 ${WORLDS} 个世界的名次：<span class="big">${ranks.join(" ")}</span>
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${social > 0.6 ? "看得到榜单：赢家通吃，且同一首歌的命运在平行世界间天差地别：早期噪声被放大成永久差距。" : "没有社会影响：份额平缓、可预测，基本就是真实质量的样子。"}</div>`;
  }
  run(); window.addEventListener("resize", draw);
});
