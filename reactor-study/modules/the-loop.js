/* REACTOR · the-loop.js (N00) — observing the data changes the data
   性能契约：空闲时零帧——rAF 只在指针悬在点阵上时运行，离开即停在最后一帧。
   （旧版无条件 rAF 循环 + 每帧重设 canvas 尺寸 + 每帧重写 innerHTML，
     静置页面烧掉 1/3 个核。canvas 尺寸只在真变时重设，读数只在值变时更新。） */
import { mount, canvas, readout, cssvar } from "/modules/mod-kit.js?v=fccf0ac854";

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
  let pts = [], observedFraction = 0, mouse = null;
  let size = { w: 0, h: 0 };
  const reset = () => {
    pts = Array.from({ length: N }, () => {
      const t = Math.random();                 // 真实值 0..1
      return { t, m: t, x: Math.random(), y: Math.random(), obs: 0 };
    });
    observedFraction = 0;
    draw();
  };

  c.addEventListener("pointermove", e => {
    const r = c.getBoundingClientRect();
    mouse = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    wake();
  });
  c.addEventListener("pointerleave", () => { mouse = null; });   // 当前帧画完自然停

  function tickPhysics() {
    if (!mouse) return;
    for (const p of pts) {
      const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (d < 0.10) {
        // 被观察 → 测量值向「讨好观察者」漂移（拉高），真实值几乎不变
        p.m = Math.min(1, p.m + 0.02);
        p.obs = Math.min(1, p.obs + 0.03);
      }
    }
  }

  let lastOut = "";
  function draw() {
    const { w, h } = size;
    if (!w) return;
    let obs = pts.reduce((s, p) => s + (p.obs > 0.2 ? 1 : 0), 0) / N;
    const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
    const mt = mean(pts.map(p => p.t)), mm = mean(pts.map(p => p.m));
    let cov = 0, vt = 0, vm = 0;
    for (const p of pts) { cov += (p.t - mt) * (p.m - mm); vt += (p.t - mt) ** 2; vm += (p.m - mm) ** 2; }
    const corr = cov / (Math.sqrt(vt * vm) || 1);

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
    // 读数只在显示值变了才碰 DOM（innerHTML 每帧重写会逼出每帧 layout）
    const html = `已观察 <span class="big">${(obs * 100).toFixed(0)}%</span> &nbsp;·&nbsp;
      测量↔真实相关 <span class="big">${corr.toFixed(2)}</span>
      <div style="font-size:.72rem;opacity:.8;margin-top:4px">观察得越多，测量值越偏离真实值：尺子读数被你的注视本身抬高了。</div>`;
    if (html !== lastOut) { out.innerHTML = html; lastOut = html; }
  }

  let running = false;
  function wake() {
    if (running) return;
    running = true;
    const step = () => {
      if (!mouse) { running = false; draw(); return; }   // 指针离开:补画一帧后停
      tickPhysics(); draw();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const fit = () => { size = resize(); draw(); };        // 尺寸只在真变时重设
  addEventListener("resize", fit);
  fit(); reset();

  const btn = document.createElement("button");
  btn.className = "btn"; btn.style.marginTop = "12px"; btn.textContent = "↺ 重置";
  btn.onclick = reset; body.appendChild(btn);
});
