/* REACTOR · eval-overfit-lab.js (Y02) — the score is 94% illusion */
import { mount, canvas, controls, slider, toggleBank, add, readout, legend, cssvar, gauss } from "/reactor-study/modules/mod-kit.js?v=fccf0ac854";

mount("eval-overfit-lab", (body, fig) => {
  const C = n => cssvar(n, fig);
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "你反复用同一套 eval 筛选模型版本。看看榜面分数里，有多少是真实能力，有多少是幻觉。";
  body.appendChild(intro);

  const D = 200, K = 20;
  let dBench = 20, gens = 300, zeroSum = false, freshEach = false;

  function simulate() {
    // theta: true ability over D dims; q: memorized quirks of THIS test's d items
    const theta = new Float64Array(D);
    let bench = pickDims(dBench);
    let q = new Float64Array(dBench);
    const covered = new Uint8Array(D); bench.forEach(i => covered[i] = 1);
    const hist = { bench: [], true: [], trueBench: [], overfit: [] };
    const STEP = 0.05;
    for (let g = 0; g < gens; g++) {
      if (freshEach) { bench = pickDims(dBench); q = new Float64Array(dBench); }
      let best = -1e9, bTheta = null, bQ = null;
      for (let k = 0; k < K; k++) {
        const dth = new Float64Array(D); let mean = 0;
        for (let i = 0; i < D; i++) { dth[i] = gauss() * STEP; mean += dth[i]; }
        if (zeroSum) { mean /= D; for (let i = 0; i < D; i++) dth[i] -= mean; } // capacity conserved
        const dq = new Float64Array(dBench);
        let sc = 0;
        for (let j = 0; j < dBench; j++) { dq[j] = gauss() * STEP; sc += theta[bench[j]] + dth[bench[j]] + q[j] + dq[j]; }
        sc = sc / dBench + gauss() * 0.02;
        if (sc > best) { best = sc; bTheta = dth; bQ = dq; }
      }
      for (let i = 0; i < D; i++) theta[i] += bTheta[i];
      for (let j = 0; j < dBench; j++) q[j] += bQ[j];
      // record
      let tb = 0; for (let j = 0; j < dBench; j++) tb += theta[bench[j]]; tb /= dBench;
      let tot = 0; for (let i = 0; i < D; i++) tot += theta[i]; tot /= D;
      let ov = 0; for (let j = 0; j < dBench; j++) ov += q[j]; ov /= dBench;
      hist.trueBench.push(tb); hist.true.push(tot); hist.overfit.push(ov); hist.bench.push(tb + ov);
    }
    return hist;
  }
  function pickDims(d) {
    const idx = []; const used = new Set();
    while (idx.length < d) { const r = (Math.random() * D) | 0; if (!used.has(r)) { used.add(r); idx.push(r); } }
    return idx;
  }

  const ctrl = controls(body);
  add(ctrl,
    slider(body, { label: "题库大小 d（覆盖维度）", min: 10, max: 120, step: 10, value: 20, fmt: v => v }).on(v => { dBench = v; run(); }),
    slider(body, { label: "反复筛选的代数", min: 30, max: 600, step: 30, value: 300, fmt: v => v }).on(v => { gens = v; run(); })
  );
  ctrl.appendChild(toggleBank(body, {
    label: "容量约束", value: "free",
    options: [{ label: "无限（免费午餐）", value: "free" }, { label: "零和（真实容量有限）", value: "zs" }],
    onchange: v => { zeroSum = v === "zs"; run(); }
  }));
  ctrl.appendChild(toggleBank(body, {
    label: "题库策略", value: "fixed",
    options: [{ label: "固定题库反复用", value: "fixed" }, { label: "每代换新题", value: "fresh" }],
    onchange: v => { freshEach = v === "fresh"; run(); }
  }));

  const { c, ctx, resize } = canvas(body, 320);
  const out = readout(body, "");
  legend(body, [
    { c: "var(--accent)", t: "benchmark 分数（外界看到的）" },
    { c: "var(--ink-300)", t: "被测维度真实能力" },
    { c: "var(--red)", t: "全维真实能力（用户体验到的）" }
  ]);

  let hist;
  function run() { hist = simulate(); draw(); }
  function draw() {
    const { w, h } = resize();
    ctx.clearRect(0, 0, w, h);
    const pad = 36, gw = w - pad * 2, gh = h - pad * 2;
    const n = hist.bench.length;
    const maxY = Math.max(1, ...hist.bench) * 1.05;
    const X = i => pad + (i / (n - 1)) * gw;
    const Y = v => pad + gh - (v / maxY) * gh;
    const gl = C("--ink-600");
    ctx.strokeStyle = gl; ctx.strokeRect(pad, pad, gw, gh);
    // shaded gaps: bench→trueBench = 题目过拟合 ; trueBench→true = 窄化
    const band = (top, bot, color, alpha) => {
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const x = X(i), y = Y(top[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let i = n - 1; i >= 0; i--) ctx.lineTo(X(i), Y(bot[i]));
      ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1;
    };
    band(hist.bench, hist.trueBench, C("--accent"), .16);   // 题目过拟合
    band(hist.trueBench, hist.true, C("--red"), .12);             // 窄化
    const line = (arr, color, glow, dash) => {
      ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)));
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash || []);
      ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke();
      ctx.shadowBlur = 0; ctx.setLineDash([]);
    };
    line(hist.bench, C("--accent"), C("--accent-glow"));
    line(hist.trueBench, C("--ink-300"), null, [5, 4]);
    line(hist.true, C("--red"));
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace";
    ctx.fillText("能力/分数", pad + 4, pad + 12); ctx.fillText("筛选代数 →", w - pad - 60, h - 8);

    const b = hist.bench.at(-1), tr = hist.true.at(-1), tb = hist.trueBench.at(-1), ov = hist.overfit.at(-1);
    const illusion = b > 0 ? Math.max(0, (b - tr) / b * 100) : 0;
    out.innerHTML = `榜面分 <span class="big">${b.toFixed(2)}</span> = 真实 ${tr.toFixed(2)} + 窄化 ${(tb - tr).toFixed(2)} + 题目过拟合 ${ov.toFixed(2)}
      <div style="font-size:.8rem;margin-top:6px">其中 <span class="big" style="font-size:1.2rem">${illusion.toFixed(0)}%</span> 是幻觉（换题即蒸发 + 只练了被测的窄维度）。
      ${zeroSum ? "<br>⚠ 零和容量下，优化被测维度会<strong>主动挤占</strong>未测维度：模型真实地退化成 eval 的形状。" :
        freshEach ? "<br>每代换新题：题目过拟合被清零，剩下的才是真本事。" :
        "试试把「容量约束」切到零和，或把「题库策略」切到每代换新题。"}</div>`;
  }
  run();
  window.addEventListener("resize", draw);
});
