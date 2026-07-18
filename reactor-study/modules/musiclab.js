/* REACTOR · musiclab.js (R10) — Salganik, Dodds & Watts 2006 artificial market
   W11c 升级：stepper 按真实实验的两轮走一遍（2006 独立世界 → 2006 社会
   影响世界 → 2008 倒置榜单），换步时自动把「社会影响」拨到对应档位。
   市场模拟数值逻辑与原版同源：world() 的公式一个字没动。 */
import { mount, canvas, controls, slider, add, readout, legend, scoped, stepper } from "/modules/mod-kit.js?v=49b358d492";

mount("musiclab", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "48 首歌，各有内在吸引力。听众顺序到达。拖动『社会影响』：看得到排行榜时，赢家通吃更极端，而谁封王变得几乎全看运气。下面的分步导览按当年真实实验的两轮走。";
  body.appendChild(intro);
  const N = 48, LISTENERS = 2600, WORLDS = 6;
  let social = 1.0;
  const appeal = Array.from({ length: N }, () => (Math.random() - 0.5) * 2);
  const pdl = appeal.map(a => 1 / (1 + Math.exp(-(a - 0.4))));
  const ctrl = controls(body);
  const sl = slider(body, { label: "社会影响强度（榜单可见度）", min: 0, max: 20, step: 2, value: 10, fmt: v => (v / 10).toFixed(1) }).on(v => { social = v / 10; run(); });
  add(ctrl, sl);

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
  const cv = canvas(body, 300);
  const { ctx } = cv;
  let lastW = 0, size = { w: 0, h: 300 };
  const sized = () => {                              // 尺寸真变才重设 canvas（性能红线）
    const w = body.clientWidth || 600;
    if (w !== lastW) { lastW = w; size = cv.resize(); }
    return size;
  };
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "各平行世界的市场份额（点）" }, { c: "var(--ink-300)", t: "无社会影响时的平均（≈真实质量）" }]);
  let worlds;
  function run() { worlds = Array.from({ length: WORLDS }, (_, s) => world(s)); draw(); }
  function draw() {
    const { w, h } = sized(); ctx.clearRect(0, 0, w, h);
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

  /* —— 分步导览：按真实实验的两轮走，换步自动拨「社会影响」档位 —— */
  const note = document.createElement("div");
  note.className = "step-note";
  body.appendChild(note);
  const setSocial = v => { sl.input.value = v; sl.input.dispatchEvent(new Event("input")); };
  const STEPS = [
    { t: "开场", html: `这台模拟重演的是社会学里最著名的真人实验之一：MusicLab。点「下一幕」按当年实验的两轮走一遍（换幕会自动拨上面的滑块）；也可以随时直接拖滑块自己玩。` },
    { t: "第一轮（2006）· 独立世界", v: 0, html: `14,341 名真人听 48 首无名乐队的歌。「独立世界」里谁也看不到别人的下载数，只凭耳朵——滑块已自动拨到 0。看图：各世界的点几乎贴着灰线（真实质量），Gini 低、名次稳。这条灰线就是每首歌的质量基准。` },
    { t: "第一轮（2006）· 社会影响世界", v: 10, html: `另外 8 个平行世界能看到实时下载榜——滑块已拨到 1.0。两件事同时发生：Gini 升（更不平等），同一首歌在不同世界的名次天差地别（更不可预测）。信息更多、结果反而更难预测，说明榜单信号里混进了会被放大的早期噪声。作者的总结：最好的歌很少垫底，最差的歌很少夺冠，中间的一切皆有可能。` },
    { t: "第二轮（2008）· 倒置榜单", v: 20, html: `续作《Leading the Herd Astray》（12,207 人）更狠：研究者直接造假，把真实最不受欢迎的歌显示为最热门。结果分两层——假流行短期真的自我实现了（R02 的实验室铁证）；但最好的那批歌长期恢复了人气，而且市场整体下载量下降：操纵榜单不只重排名次，还损耗整个市场。这个模拟没做倒置，滑块替你拉到了 2.0（最强羊群），感受同一机制的极端档：信号越强，早期运气滚得越大。` }
  ];
  const renderStep = i => {
    const s = STEPS[i];
    if (s.v != null) setSocial(s.v);
    note.innerHTML = `<span class="label">${i ? `第 ${i}/3 幕 · ` : ""}${s.t}</span><p>${s.html}</p>`;
  };
  stepper(body, {
    count: STEPS.length, prevLabel: "上一幕", nextLabel: "下一幕",
    onstep: renderStep
  });
  renderStep(0);

  run(); window.addEventListener("resize", draw);
});
