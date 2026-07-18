/* REACTOR · feedback.js (R02) — self-fulfilling prophecy loop */
import { mount, canvas, controls, slider, add, readout, legend, scoped } from "/modules/mod-kit.js";

mount("feedback", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "两个个体，真实能力完全相同。只有一点不同：一个得到了略微更好的『预言』。拖动反馈强度，看这个假差异如何被坐实成真差异。";
  body.appendChild(intro);
  let fb = 0.5;
  const ctrl = controls(body);
  add(ctrl, slider(body, { label: "反馈强度（预言→资源→现实）", min: 0, max: 100, step: 5, value: 50, fmt: v => (v / 100).toFixed(2) }).on(v => { fb = v / 100; draw(); }));
  const { c, ctx, resize } = canvas(body, 280);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "被看好的 A（真实能力）" }, { c: "var(--ink-300)", t: "被看衰的 B（真实能力）" }]);
  function sim() {
    let a = 0.5, b = 0.5; const A = [a], B = [b]; let expA = 0.55, expB = 0.45; // initial (false) prediction
    for (let t = 0; t < 60; t++) {
      a += 0.006 + fb * 0.02 * (expA - 0.5);
      b += 0.006 + fb * 0.02 * (expB - 0.5);
      // expectations update toward observed (which now reflects the prophecy)
      expA = 0.8 * expA + 0.2 * (a / (a + b));
      expB = 0.8 * expB + 0.2 * (b / (a + b));
      A.push(a); B.push(b);
    }
    return { A, B };
  }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const { A, B } = sim(); const pad = 32, gw = w - pad * 2, gh = h - pad * 2;
    const hi = Math.max(...A, ...B), lo = 0.4;
    const X = i => pad + (i / (A.length - 1)) * gw, Y = v => pad + gh - ((v - lo) / (hi - lo)) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    const plot = (arr, color, glow) => { ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0; };
    plot(A, C("--accent"), C("--accent-glow")); plot(B, C("--ink-300"));
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("时间 →", pad + gw - 40, h - 8);
    const gap = (A.at(-1) - B.at(-1));
    out.innerHTML = `末期真实能力差距 <span class="big">${gap.toFixed(2)}</span>（初始差距 = 0）
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${fb > 0.3 ? "预言把两个本来一样的个体推开了：『被看好』带来资源，资源变成真实能力，真实能力又坐实了预言，这就是 Merton 的自我实现闭环。" : "反馈接近零：预言无法自我实现，两者始终重合。把滑块推上去。"}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
