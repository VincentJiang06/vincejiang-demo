/* REACTOR · winners-curse.js (B13) — optimizer's curse / best-of-N */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss } from "/modules/mod-kit.js";

mount("winners-curse", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "你从 N 个候选里挑『估计值最高』的那个。估计=真值+噪声。挑得越狠，你选中的那个真值，越低于它的估计，这就是优化者诅咒。";
  body.appendChild(intro);
  let N = 20, noise = 1.0;
  const ctrl = controls(body);
  add(ctrl,
    slider(body, { label: "候选数 N（择优强度）", min: 2, max: 200, step: 2, value: 20, fmt: v => v }).on(v => { N = v; draw(); }),
    slider(body, { label: "估计噪声 σ", min: 2, max: 30, step: 2, value: 10, fmt: v => (v / 10).toFixed(1) }).on(v => { noise = v / 10; draw(); })
  );
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "选中者的估计值（你以为的）" }, { c: "var(--red)", t: "选中者的真实值（实际拿到的）" }]);
  function trial() {
    let bestEst = -1e9, trueOfBest = 0;
    for (let i = 0; i < N; i++) { const tv = gauss(); const est = tv + gauss() * noise; if (est > bestEst) { bestEst = est; trueOfBest = tv; } }
    return [bestEst, trueOfBest];
  }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const T = 4000; let se = 0, st = 0; const ests = [], trues = [];
    for (let k = 0; k < T; k++) { const [e, t] = trial(); se += e; st += t; if (k < 600) { ests.push(e); trues.push(t); } }
    const mE = se / T, mT = st / T;
    // draw two histograms overlaid (estimate vs true of selected)
    const pad = 34, gw = w - pad * 2, gh = h - pad * 2;
    const lo = -3, hi = Math.max(4, mE + 2); const bins = 40;
    const hist = arr => { const H = new Array(bins).fill(0); arr.forEach(v => { const b = Math.floor((v - lo) / (hi - lo) * bins); if (b >= 0 && b < bins) H[b]++; }); return H; };
    const he = hist(ests), ht = hist(trues); const mx = Math.max(...he, ...ht, 1);
    const bw = gw / bins;
    const bars = (H, color, a) => { ctx.fillStyle = color; ctx.globalAlpha = a; H.forEach((v, i) => ctx.fillRect(pad + i * bw, pad + gh - v / mx * gh, bw - 1, v / mx * gh)); ctx.globalAlpha = 1; };
    bars(he, C("--accent"), .5); bars(ht, C("--red"), .5);
    const vline = (v, color) => { const x = pad + (v - lo) / (hi - lo) * gw; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gh); ctx.stroke(); };
    vline(mE, C("--accent")); vline(mT, C("--red"));
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("值 →", pad + gw - 24, h - 6);
    out.innerHTML = `选中者：平均估计 <span class="big">${mE.toFixed(2)}</span> vs 平均真值 <span class="big">${mT.toFixed(2)}</span>
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">失望缺口 <strong>${(mE - mT).toFixed(2)}</strong>。N 越大、噪声越大，你选中的赢家越是『运气好的估计』而非『真的最好』，所以要对最高分做贝叶斯收缩（别全信）。</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
