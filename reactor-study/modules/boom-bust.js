/* REACTOR · boom-bust.js (R08) — Soros reflexivity: positive vs negative feedback */
import { mount, canvas, controls, slider, toggleBank, add, readout, legend, scoped, gauss } from "/reactor-study/modules/mod-kit.js?v=fccf0ac854";

mount("boom-bust", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "价格由『基本面』和『关于它的误解』共同驱动，而价格又反过来改变基本面。切换反馈符号：负反馈趋均衡，正反馈自我强化成泡沫、再自我瓦解。";
  body.appendChild(intro);
  let mis = 0.6, positive = true;
  const ctrl = controls(body);
  add(ctrl, slider(body, { label: "误解强度（认知偏离现实的程度）", min: 0, max: 100, step: 5, value: 60, fmt: v => (v / 100).toFixed(2) }).on(v => { mis = v / 100; draw(); }));
  ctrl.appendChild(toggleBank(body, { label: "反馈符号", value: "pos",
    options: [{ label: "负反馈(趋均衡)", value: "neg" }, { label: "正反馈(泡沫)", value: "pos" }],
    onchange: v => { positive = v === "pos"; draw(); } }));
  const { c, ctx, resize } = canvas(body, 290);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "市场价格" }, { c: "var(--ink-300)", t: "基本面 (fundamental)" }]);
  function sim() {
    let fund = 1, price = 1, belief = 1; const P = [price], F = [fund]; let bust = -1;
    for (let t = 1; t < 120; t++) {
      const gap = price - fund;
      if (positive) {                   // views push reality the SAME way → self-reinforcing
        fund += 0.010 * mis * belief;   // the misconception lifts the fundamental too (reflexive)
        belief += 0.03 * mis * gap;     // price rise feeds the belief
        price = fund + belief * mis * 0.9 + gauss() * 0.01;
        if (bust < 0 && gap > 0.9) bust = t;          // "moment of truth"
        if (bust > 0 && t > bust) { belief *= 0.86; fund -= 0.004 * (price - fund); price = fund + belief * mis * 0.9; } // crash
      } else {                           // negative: views corrected toward reality → equilibrium
        belief += 0.15 * (fund - price);
        price = fund + belief * 0.3 + gauss() * 0.006;
        fund += 0.002;
      }
      P.push(price); F.push(fund);
    }
    return { P, F, bust };
  }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const { P, F, bust } = sim(); const pad = 30, gw = w - pad * 2, gh = h - pad * 2;
    const hi = Math.max(...P, ...F) * 1.05, lo = Math.min(...P, ...F, 0.9);
    const X = i => pad + (i / (P.length - 1)) * gw, Y = v => pad + gh - ((v - lo) / (hi - lo)) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    const plot = (arr, color, glow) => { ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0; };
    plot(F, C("--ink-300")); plot(P, C("--accent"), C("--accent-glow"));
    if (bust > 0) { const x = X(bust); ctx.strokeStyle = C("--red"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gh); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C("--red"); ctx.font = "10px monospace"; ctx.fillText("moment of truth", x - 30, pad + 12); }
    out.innerHTML = positive
      ? `正反馈：误解与价格相互强化，冲上泡沫顶，然后在'真相时刻'反转崩溃。<div style="font-size:.8rem;margin-top:6px;opacity:.9">这一支 ≈ Barnesian 表演性 ≈ 自我实现预言的放大轴。远离均衡是内生的。</div>`
      : `负反馈：观念被现实不断校正，价格收敛到基本面附近。<div style="font-size:.8rem;margin-top:6px;opacity:.9">这一支 ≈ counterperformativity ≈ 自我否定预言的抵消轴。Soros 的贡献是把两支装进同一个模型。</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
