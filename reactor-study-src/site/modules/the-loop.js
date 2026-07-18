/* REACTOR · the-loop.js (N00) — observing the data changes the data */
import { mount, canvas, readout, cssvar } from "/modules/mod-kit.js";

mount("the-loop", (body, fig) => {
  const C = n => cssvar(n, fig);
  const hint = document.createElement("p");
  hint.className = "label";
  hint.style.marginBottom = "12px";
  hint.textContent = "把光标移到点阵上 = 观察它。看看会发生什么。";
  body.appendChild(hint);

  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  const N = 220;
  let pts = [];
  const reset = () => {
    pts = Array.from({ length: N }, () => {
      const t = Math.random();                 // 真实值 0..1
      return { t, m: t, x: Math.random(), y: Math.random(), obs: 0 };
    });
    observedFraction = 0;
  };
  let observedFraction = 0, mouse = null;
  reset();

  c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    mouse = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  });
  c.addEventListener("pointerleave", () => mouse = null);

  function step() {
    const { w, h } = resize();
    if (mouse) {
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 0.10) {
          // 被观察 → 测量值向"讨好观察者"漂移（拉高），真实值几乎不变
          p.m = Math.min(1, p.m + 0.02);
          p.obs = Math.min(1, p.obs + 0.03);
        }
      }
    }
    // metrics
    let obs = pts.reduce((s, p) => s + (p.obs > 0.2 ? 1 : 0), 0) / N;
    // correlation between m and t
    const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
    const mt = mean(pts.map(p => p.t)), mm = mean(pts.map(p => p.m));
    let cov = 0, vt = 0, vm = 0;
    for (const p of pts) { cov += (p.t - mt) * (p.m - mm); vt += (p.t - mt) ** 2; vm += (p.m - mm) ** 2; }
    const corr = cov / (Math.sqrt(vt * vm) || 1);

    // draw
    ctx.clearRect(0, 0, w, h);
    const accent = C("--accent"), glow = C("--accent-glow"), line = C("--ink-500");
    for (const p of pts) {
      const px = p.x * w, py = p.y * h;
      const lit = p.obs > 0.2;
      ctx.beginPath();
      ctx.arc(px, py, lit ? 3.2 : 2, 0, 7);
      if (lit) { ctx.fillStyle = accent; ctx.shadowColor = glow; ctx.shadowBlur = 8; }
      else { ctx.fillStyle = line; ctx.shadowBlur = 0; }
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    if (mouse) {
      ctx.strokeStyle = accent; ctx.globalAlpha = .4;
      ctx.beginPath(); ctx.arc(mouse.x * w, mouse.y * h, 0.10 * w, 0, 7); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    out.innerHTML = `已观察 <span class="big">${(obs * 100).toFixed(0)}%</span> 的点 &nbsp;·&nbsp;
      测量↔真实相关 <span class="big">${corr.toFixed(2)}</span>
      <div style="font-size:.72rem;opacity:.8;margin-top:4px">观察得越多，测量值越偏离真实值：尺子读数被你的注视本身抬高了。</div>`;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  const btn = document.createElement("button");
  btn.className = "btn"; btn.style.marginTop = "12px"; btn.textContent = "↺ 重置";
  btn.onclick = reset; body.appendChild(btn);
});
