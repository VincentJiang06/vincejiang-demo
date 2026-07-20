/* REACTOR · the-loop.js (N00) — observing the data changes the data
   性能契约：空闲时零帧——rAF 只在指针悬在点阵上时运行，离开即停在最后一帧。
   （旧版无条件 rAF 循环 + 每帧重设 canvas 尺寸 + 每帧重写 innerHTML，
     静置页面烧掉 1/3 个核。canvas 尺寸只在真变时重设，读数只在值变时更新。）
   W11c 升级：stepper 三步教学化（观察前的世界 → 你开始观察 → 相关性崩塌）。
   旁白只在换步时写一次 DOM；步进跟着你的动作自动走（开始悬停→第 2 步，
   相关掉穿 0.8→第 3 步亮起白话揭示）。点阵物理与原版同源，一个字没动。 */
import { mount, canvas, readout, cssvar, stepper } from "/modules/mod-kit.js";
import { t, tf } from "/modules/mod-i18n.js";

/* 逐帧读数用的固定片段：模块加载时查一次表，draw() 里不再进 t()（性能红线） */
const T_OBSERVED = t("已观察");
const T_CORR = t("测量↔真实相关");
const T_READ_NOTE = t("观察得越多，测量值越偏离真实值：尺子读数被你的注视本身抬高了。");

mount("the-loop", (body, fig) => {
  const C = n => cssvar(n, fig);
  const hint = document.createElement("p");
  hint.className = "label";
  hint.style.marginBottom = "12px";
  hint.textContent = t("把光标移到点阵上 = 观察它。看看会发生什么。（下面有三步小导览，跟着走就行）");
  body.appendChild(hint);

  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  const N = 220;
  let pts = [], observedFraction = 0, mouse = null;
  let size = { w: 0, h: 0 };
  let lastCorr = 1, lastObs = 0;                     // 给旁白读的最近值（只在换步时用）
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
    if (st.index === 0) st.go(1);                    // 一开始悬停，导览自动走到「你开始观察」
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
    lastCorr = corr; lastObs = obs;

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
    const html = `${T_OBSERVED} <span class="big">${(obs * 100).toFixed(0)}%</span> &nbsp;·&nbsp;
      ${T_CORR} <span class="big">${corr.toFixed(2)}</span>
      <div style="font-size:.72rem;opacity:.8;margin-top:4px">${T_READ_NOTE}</div>`;
    if (html !== lastOut) { out.innerHTML = html; lastOut = html; }
    // 观察够多、相关掉穿 0.8 → 导览自动亮起第 3 步（go 到同步号是空操作，零成本）
    if (st.index === 1 && obs > 0.3 && corr < 0.8) st.go(2);
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

  /* —— 三步小导览：旁白只在换步那一下写 DOM，不参与逐帧循环 —— */
  const note = document.createElement("div");
  note.className = "step-note";
  body.appendChild(note);
  function renderNote(i) {
    if (i === 0) note.innerHTML = `<span class="label">${t("第 1 步 / 3 · 观察前的世界")}</span>
      <p>${t("这 220 个点各有一个「真实值」——可以想成 220 个学生各自真实的水平。现在还没有人看它们，所以屏幕上的「测量值」和「真实值」完全一致：上面读数里的「相关」是 1.00。（相关＝两组数字步调一致的程度，1 是完全同步，0 是各走各的。）")}</p>
      <p>${t("什么都还没发生。这就是尺子举起来之前的世界。")}</p>`;
    else if (i === 1) note.innerHTML = `<span class="label">${t("第 2 步 / 3 · 你开始观察")}</span>
      <p>${t("把光标移进点阵——那圈光晕就是你的「注视」。被罩住的点算「被你观察」：它会变亮、读数往上飘一点，像学生知道老师在看，答题姿势立刻变了。")}</p>
      <p>${t("多扫几圈，同时盯着上面两个数字：「已观察」在涨，「测量↔真实相关」在掉。")}</p>`;
    else note.innerHTML = `<span class="label">${t("第 3 步 / 3 · 相关性崩塌")}</span>
      <p>${tf("你刚才亲手做了一遍这门课要讲的事：<strong>观察本身改变了被观察的东西</strong>。被你看过的点，测量值被抬高了，真实值几乎没动——「读数」和「真实」开始各说各话，相关从 1.00 掉到了 {}（已观察 {}%，想看它继续掉就再多扫几圈）。", lastCorr.toFixed(2), (lastObs * 100).toFixed(0))}</p>
      <p>${t("<strong>这说明什么：</strong>考试、医院排名、AI 模型评测，都是这个小把戏的放大版——尺子一举起来，被量的对象就开始朝尺子表演，你测到的就不再是原来那个东西。这个现象叫「反应性」，这门课后面的每一课，讲的都是它的一个变种。点「↺ 重置」可以回到无人观察的世界再来一遍。")}</p>`;
  }
  const st = stepper(body, {
    count: 3, prevLabel: t("上一步"), nextLabel: t("下一步"),
    onstep: i => { if (i === 0) reset(); renderNote(i); }
  });

  const fit = () => { size = resize(); draw(); };        // 尺寸只在真变时重设
  addEventListener("resize", fit);
  fit(); reset();
  renderNote(0);

  const btn = document.createElement("button");
  btn.className = "btn"; btn.style.marginTop = "12px"; btn.textContent = t("↺ 重置");
  btn.onclick = () => { if (st.index === 0) reset(); else st.go(0); };   // 回到第 1 步顺带重置
  body.appendChild(btn);
});
