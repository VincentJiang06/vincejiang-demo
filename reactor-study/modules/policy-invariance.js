/* REACTOR · policy-invariance.js (B03) — Lucas critique: exploit the curve, it breaks */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss } from "/reactor-study/modules/mod-kit.js?v=fccf0ac854";

mount("policy-invariance", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "历史数据里，通胀与失业有条漂亮的负相关(Phillips 曲线)。你想靠制造通胀来降失业。拖动『政策利用强度』，看人们的预期如何调整，把这条你据以定策的关系拉平、拉断。";
  body.appendChild(intro);
  let exploit = 0;
  const ctrl = controls(body);
  add(ctrl, slider(body, { label: "政策利用强度（你多想用这条规律）", min: 0, max: 100, step: 5, value: 0, fmt: v => v + "%" }).on(v => { exploit = v / 100; draw(); }));
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--ink-300)", t: "历史观测（未被利用时）" }, { c: "var(--accent)", t: "你利用之后的新数据" }]);
  const hist = Array.from({ length: 40 }, () => { const u = 3 + Math.random() * 6; return [u, 9 - u + gauss() * 0.5]; });
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const pad = 38, gw = w - pad * 2, gh = h - pad * 2;
    const X = u => pad + (u - 2) / 8 * gw, Y = inf => pad + gh - (inf) / 10 * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    // historical points
    hist.forEach(([u, inf]) => { ctx.beginPath(); ctx.arc(X(u), Y(inf), 2.4, 0, 7); ctx.fillStyle = C("--ink-300"); ctx.globalAlpha = .7; ctx.fill(); ctx.globalAlpha = 1; });
    // new regime: expectations shift inflation up by exploit; unemployment un-moved (vertical long-run)
    const shift = exploit * 6;
    const nw = hist.map(([u, inf]) => [u + gauss() * 0.3, Math.min(9.6, inf * (1 - exploit) + (5 + gauss() * 0.7) * exploit + shift * 0.0)]);
    // as exploit→1, points collapse to a vertical band (no tradeoff): inflation high & scattered, unemployment unchanged
    const nw2 = hist.map(([u]) => [u + gauss() * 0.3, (9 - u) * (1 - exploit) + (4 + shift + gauss() * 0.8) * exploit]);
    nw2.forEach(([u, inf]) => { ctx.beginPath(); ctx.arc(X(u), Y(Math.max(0, Math.min(9.8, inf))), 2.8, 0, 7); ctx.fillStyle = C("--accent"); ctx.shadowColor = C("--accent-glow"); ctx.shadowBlur = exploit * 6; ctx.fill(); ctx.shadowBlur = 0; });
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("失业 →", pad + gw - 40, h - 8); ctx.save(); ctx.translate(12, pad + 40); ctx.rotate(-Math.PI / 2); ctx.fillText("通胀", 0, 0); ctx.restore();
    // correlation of new data
    const xs = nw2.map(p => p[0]), ys = nw2.map(p => p[1]); const mx = xs.reduce((a, b) => a + b) / xs.length, my = ys.reduce((a, b) => a + b) / ys.length;
    let cov = 0, vx = 0, vy = 0; xs.forEach((x, i) => { cov += (x - mx) * (ys[i] - my); vx += (x - mx) ** 2; vy += (ys[i] - my) ** 2; });
    const corr = cov / (Math.sqrt(vx * vy) || 1);
    out.innerHTML = `新数据里 通胀↔失业 的相关 <span class="big">${corr.toFixed(2)}</span>（历史值 ≈ −0.9）
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${exploit > 0.4 ? "关系崩了：一旦你系统性地制造通胀来买就业，人们把通胀<em>预期</em>进去，失业回到自然率，你只剩下高通胀。你用来定策的规律，因为你使用它而失效。这就是 Lucas 批判 = Goodhart 的宏观版。" : "把政策利用强度推上去，看这条你想利用的负相关如何在你眼前拉直。"}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
