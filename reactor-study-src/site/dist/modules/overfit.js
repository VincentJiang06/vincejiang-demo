/* REACTOR · overfit.js (Y01) — classic train/test overfitting
   W11c 升级：开局预测门（自建，复用 explorable 三段式样式类）。
   拟合/误差的数值逻辑与原版同源：fit()/mse() 的公式一个字没动。 */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss } from "/modules/mod-kit.js?v=4501323cdd";
import { optionGroup } from "/modules/quiz.js?v=b664eb3a7c";
import { t } from "/modules/mod-i18n.js?v=fe1fe69deb";

mount("overfit", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("同一批数据拟合一条多项式。提高次数(模型容量)，训练误差一路降；但测试误差先降后升：模型开始背训练集的噪声。训练集就是你的 eval。");
  body.appendChild(intro);

  predictGate(body, {
    q: t("先押一注：把「多项式次数」从 1 一路推到 11，训练误差和测试误差各会怎么走？"),
    options: [
      { t: t("训练误差一路降到底；测试误差先降后升"), ok: true },
      { t: t("两个都一路下降——模型越灵活，学得越好") },
      { t: t("两个都先降后升——太复杂了连训练集都拟合不好") }
    ],
    reveal: t(`训练误差是模型能直接优化的分数，容量越大压得越低，永远单调向下；可你真正在乎的是新数据上的表现。过了某个点，模型不再学规律，开始背这批训练点特有的巧合和噪声——曲线扭着身子穿过每一个训练点、在点与点之间剧烈振荡，训练误差趋零、测试误差反弹。就像那个把往年真题背得滚瓜烂熟的学生：模拟考回回满分，新卷子当场垮掉。`),
    plain: t("训练集就是你的 eval。在例题上的完美是可以买的，代价是新题上的真实——所以「eval 分数一路上涨」本身不说明变好，得有一批它从没见过的题来对质（这正是 held-out 测试集的意义）。"),
    actHint: t("把次数推到 8 以上、再拉回 2 以下，两头都看过就能对答案")
  }, buildSim);

  function buildSim(host, act) {
    // fixed data
    const truth = x => Math.sin(x * 3) * 0.6;
    const rng = () => Math.random();
    const train = Array.from({ length: 12 }, () => { const x = rng(); return [x, truth(x) + gauss() * 0.18]; });
    const test = Array.from({ length: 40 }, () => { const x = rng(); return [x, truth(x) + gauss() * 0.18]; });
    let deg = 3;
    const ctrl = controls(host);
    add(ctrl, slider(host, { label: t("多项式次数（模型容量）"), min: 1, max: 11, step: 1, value: 3, fmt: v => v }).on(v => { deg = v; draw(); act(); }));
    const cv = canvas(host, 300);
    const { ctx } = cv;
    let lastW = 0, size = { w: 0, h: 300 };
    const sized = () => {                            // 尺寸真变才重设 canvas（性能红线）
      const w = host.clientWidth || 600;
      if (w !== lastW) { lastW = w; size = cv.resize(); }
      return size;
    };
    const out = readout(host, "");
    legend(host, [{ c: "var(--ink-300)", t: t("训练点") }, { c: "var(--accent)", t: t("拟合曲线") }, { c: "var(--red)", t: t("测试点") }]);

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
      const { w: W, h } = sized(); ctx.clearRect(0, 0, W, h);
      const wt = fit(deg); const pad = 30, gw = W - pad * 2, gh = h - pad * 2;
      const X = x => pad + x * gw, Y = y => pad + gh / 2 - y * gh * 0.42;
      ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
      ctx.beginPath(); for (let i = 0; i <= 100; i++) { const x = i / 100, y = evalP(wt, x); i ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); } ctx.strokeStyle = C("--accent"); ctx.lineWidth = 2; ctx.shadowColor = C("--accent-glow"); ctx.shadowBlur = 6; ctx.stroke(); ctx.shadowBlur = 0;
      test.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 2, 0, 7); ctx.fillStyle = C("--red"); ctx.globalAlpha = .5; ctx.fill(); ctx.globalAlpha = 1; });
      train.forEach(([x, y]) => { ctx.beginPath(); ctx.arc(X(x), Y(y), 3, 0, 7); ctx.fillStyle = C("--ink-300"); ctx.fill(); });
      const tr = mse(wt, train), te = mse(wt, test);
      out.innerHTML = `${t("训练误差")} <span class="big">${tr.toFixed(3)}</span> &nbsp;·&nbsp; ${t("测试误差")} <span class="big">${te.toFixed(3)}</span>
        <div style="font-size:.8rem;margin-top:6px;opacity:.9">${deg >= 8 ? t("高次：训练误差趋零，曲线扭曲去穿过每个训练点，测试误差反弹。这就是 Goodhart 的统计学同构。") : deg <= 2 ? t("太简单：欠拟合，两个误差都高。") : t("刚好：泛化最好的甜点区。再往上加次数就开始过拟合。")}</div>`;
    }
    draw(); window.addEventListener("resize", draw);   // boot.js 主题切换也走这条广播重绘
  }
});

/* —— 预测门（自建，参考 explorable.js 的 predict 范式与样式类）——
   流程：先猜一个 → 面板通电、亲手操作 → 操作过了才能对答案。 */
function predictGate(body, P, buildStage) {
  const opts = P.options;
  const answer = P.answer != null ? P.answer : opts.findIndex(o => o.ok);
  let predicted = null, acted = false, revealed = false;

  const gate = document.createElement("div");
  gate.className = "predict-gate";
  gate.innerHTML = `<div class="phase-tag"><span class="led on"></span>${t("第 1 步 · 先猜一猜")}</div>`;
  body.appendChild(gate);
  optionGroup(gate, {
    q: P.q, options: opts, mode: "pick",
    onpick: i => { predicted = i; stage.classList.add("armed"); sync(); }
  });

  const stage = document.createElement("div");
  stage.className = "stage";
  const stageTag = document.createElement("div");
  stageTag.className = "phase-tag";
  stageTag.innerHTML = `<span class="led"></span>${t("第 2 步 · 亲手试")}`;
  const inner = document.createElement("div"); inner.className = "stage-inner";
  const shutter = document.createElement("div"); shutter.className = "shutter";
  shutter.innerHTML = `<span class="led"></span><span>${t("先在上面选一个你的猜测，这块面板才会亮")}</span>`;
  stage.append(stageTag, inner, shutter);
  body.appendChild(stage);

  const rev = document.createElement("div");
  rev.className = "reveal";
  rev.innerHTML = `<div class="phase-tag"><span class="led"></span>${t("第 3 步 · 对答案")}</div>`;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn"; btn.textContent = t("对答案"); btn.disabled = true;
  const note = document.createElement("span");
  note.className = "label"; note.style.marginLeft = "12px";
  const row = document.createElement("div");
  row.style.cssText = "display:flex;align-items:center;flex-wrap:wrap;gap:4px";
  row.append(btn, note);
  const panel = document.createElement("div");
  panel.className = "reveal-panel"; panel.style.display = "none";
  rev.append(row, panel);
  body.appendChild(rev);

  btn.onclick = () => {
    if (revealed || predicted == null) return;
    revealed = true;
    const hit = predicted === answer;
    panel.innerHTML = `<div class="rv-row"><span class="label">${t("你的猜测")}</span><span>${opts[predicted].t}</span></div>
      <div class="rv-row"><span class="label">${t("实际情况")}</span><span>${opts[answer].t}</span></div>
      <div class="rv-verdict ${hit ? "ok" : "no"}"><span class="led on"></span>${hit ? t("猜对了") : t("和实际不一样，差别在下面")}</div>
      ${P.reveal ? `<div class="read rv-read">${P.reveal}</div>` : ""}
      ${P.plain ? `<div class="rv-plain"><span class="label">${t("这说明什么")}</span><div class="rv-plain-body">${P.plain}</div></div>` : ""}`;
    panel.style.display = "block";
    rev.querySelector(".phase-tag .led").className = "led on";
    btn.disabled = true;
    note.textContent = "";
  };

  function sync() {
    if (revealed) return;
    stageTag.querySelector(".led").className = predicted != null ? "led on" : "led";
    btn.disabled = !(predicted != null && acted);
    note.textContent = predicted == null ? t("先猜一个")
      : (acted ? t("可以对答案了") : (P.actHint || t("把上面的演示走一遍，就能对答案")));
  }
  sync();
  buildStage(inner, () => { if (!acted) { acted = true; sync(); } });
}
