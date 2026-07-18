/* REACTOR · overfit.js (Y01) — classic train/test overfitting */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss } from "/modules/mod-kit.js?v=fccf0ac854";

mount("overfit", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "同一批数据拟合一条多项式。提高次数(模型容量)，训练误差一路降；但测试误差先降后升：模型开始背训练集的噪声。训练集就是你的 eval。";
  body.appendChild(intro);
  // fixed data
  const truth = x => Math.sin(x * 3) * 0.6;
  const rng = () => Math.random();
  const train = Array.from({ length: 12 }, () => { const x = rng(); return [x, truth(x) + gauss() * 0.18]; });
  const test = Array.from({ length: 40 }, () => { const x = rng(); return [x, truth(x) + gauss() * 0.18]; });
  let deg = 3;
  const ctrl = controls(body);
  add(ctrl, slider(body, { label: "多项式次数（模型容量）", min: 1, max: 11, step: 1, value: 3, fmt: v => v }).on(v => { deg = v; draw(); }));
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--ink-300)", t: "训练点" }, { c: "var(--accent)", t: "拟合曲线" }, { c: "var(--red)", t: "测试点" }]);

  function fit(d) { // least squares polynomial via normal equations (small d)
    const n = d + 1, X = train.map(([x]) => Array.from({ length: n }, (_, k) => x ** k)), y = train.map(p => p[1]);
    const XtX = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => X.reduce((s, r) => s + r[i] * r[j], 0)));
    const Xty = Array.from({ length: n }, (_, i) => X.reduce((s, r, k) => s + r[i] * y[k], 0));
    // solve XtX w = Xty (gaussian elim with tiny ridge for stability)
    for (let i = 0; i < n; i++) XtX[i][i] += 1e-6;
    const M = XtX.map((r, i) => [...r, Xty[i]]);
    for (let i = 0; i < n; i++) { let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;[M[i], M[p]] = [M[p], M[i]]; for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; } }
    // r 是一整行，r[i] 已经是对角元；写成 r[i][i] 会在数字上取下标得到 undefined，
    // 整条解全变 NaN（读出屏一直显示"训练误差 NaN"）
    return M.map((r, i) => r[n] / r[i]);
  }
  const evalP = (w, x) => w.reduce((s, c, k) => s + c * x ** k, 0);
  const mse = (w, set) => set.reduce((s, [x, y]) => s + (evalP(w, x) - y) ** 2, 0) / set.length;
  function draw() {
    const { w: W, h } = resize(); ctx.clearRect(0, 0, W, h);
    const wt = fit(deg); const pad = 30, gw = W - pad * 2, gh = h - pad * 2;
    const X = x => pad + x * gw, Y = y => pad + gh / 2 - y * gh * 0.42;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    ctx.beginPath(); for (let i = 0; i <= 100; i++) { const x = i / 100, y = evalP(wt, x); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); } ctx.strokeStyle = C("--accent"); ctx.lineWidth = 2; ctx.shadowColor = C("--accent-glow"); ctx.shadowBlur = 6; ctx.stroke(); ctx.shadowBlur = 0;
    test.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 2, 0, 7); ctx.fillStyle = C("--red"); ctx.globalAlpha = .5; ctx.fill(); ctx.globalAlpha = 1; });
    train.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 3, 0, 7); ctx.fillStyle = C("--ink-300"); ctx.fill(); });
    const tr = mse(wt, train), te = mse(wt, test);
    out.innerHTML = `训练误差 <span class="big">${tr.toFixed(3)}</span> &nbsp;·&nbsp; 测试误差 <span class="big">${te.toFixed(3)}</span>
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${deg >= 8 ? "高次：训练误差趋零，曲线扭曲去穿过每个训练点，测试误差反弹。这就是 Goodhart 的统计学同构。" : deg <= 2 ? "太简单：欠拟合，两个误差都高。" : "刚好：泛化最好的甜点区。再往上加次数就开始过拟合。"}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
