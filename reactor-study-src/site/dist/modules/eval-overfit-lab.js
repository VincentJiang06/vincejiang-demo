/* REACTOR · eval-overfit-lab.js (Y02) — the score is 94% illusion
   W11b 升级：开局预测门（自建，复用 explorable 三段式样式）+
   stepper 分步论证链「首测→反复筛选→榜面分裂三条线」+
   annot 在曲线分叉点打气泡。模拟数值逻辑与原版同源：simulate() 一字未动。 */
import { mount, canvas, controls, slider, toggleBank, add, readout, legend, cssvar, gauss, stepper, annot } from "/modules/mod-kit.js?v=4501323cdd";
import { optionGroup } from "/modules/quiz.js?v=b664eb3a7c";
import { t, tf } from "/modules/mod-i18n.js?v=fe1fe69deb";

mount("eval-overfit-lab", (body, fig) => {
  const C = n => cssvar(n, fig);
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("你反复用同一套 eval 筛选模型版本。看看榜面分数里，有多少是真实能力，有多少是幻觉。");
  body.appendChild(intro);

  predictGate(body, {
    q: t("先猜：用同一套题反复筛选模型几百代之后，榜面分数和用户真实体验到的能力，最可能是什么关系？"),
    options: [
      { t: t("基本同步上涨：分数涨了就是真变强了") },
      { t: t("榜面涨得多，真实也在涨，只是慢一半") },
      { t: t("榜面一路飙升，真实几乎不动：大头是幻觉"), ok: true }
    ],
    reveal: t(`默认参数跑到底，榜面分里约九成是幻觉。幻觉有两种成分：一是「记住了这套题」（术语叫题目过拟合）——把「题库策略」切到每代换新题，它当场蒸发；二是「只练了被测的那 10% 维度」（窄化）——练的是被路灯照到的地方。全维真实能力（红线，用户真正体验到的）几乎是水平的。`),
    plain: t("一把反复用来做选择的尺子，读数会越来越好看、也越来越不代表真实。分数是尺子的读数，不是能力本身。"),
    actHint: t("把下面的三步论证走到底，就能对答案")
  }, buildLab);

  function buildLab(host, act) {
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

    const ctrl = controls(host);
    add(ctrl,
      slider(host, { label: t("题库大小 d（覆盖维度）"), min: 10, max: 120, step: 10, value: 20, fmt: v => v }).on(v => { dBench = v; run(); }),
      slider(host, { label: t("反复筛选的代数"), min: 30, max: 600, step: 30, value: 300, fmt: v => v }).on(v => { gens = v; run(); })
    );
    ctrl.appendChild(toggleBank(host, {
      label: t("容量约束"), value: "free",
      options: [{ label: t("无限（免费午餐）"), value: "free" }, { label: t("零和（真实容量有限）"), value: "zs" }],
      onchange: v => { zeroSum = v === "zs"; run(); }
    }));
    ctrl.appendChild(toggleBank(host, {
      label: t("题库策略"), value: "fixed",
      options: [{ label: t("固定题库反复用"), value: "fixed" }, { label: t("每代换新题"), value: "fresh" }],
      onchange: v => { freshEach = v === "fresh"; run(); }
    }));

    const cv = canvas(host, 320);
    const { ctx } = cv;
    const an = annot(cv);
    let lastW = 0;
    const sized = () => {                          // 尺寸真变才重设 canvas（性能红线）
      const w = host.clientWidth || 600;
      if (w !== lastW) { lastW = w; return cv.resize(); }
      return { w: lastW, h: 320 };
    };
    const out = readout(host, "");
    legend(host, [
      { c: "var(--accent)", t: t("benchmark 分数（外界看到的）") },
      { c: "var(--ink-300)", t: t("被测维度真实能力") },
      { c: "var(--red)", t: t("全维真实能力（用户体验到的）") }
    ]);

    /* —— 三步论证链：每一步只放出曲线的一段，看幻觉怎么长出来 —— */
    const STEPS = [
      { t: t("首测"), frac: 0.08, cap: t("第一次测：三条线几乎贴在一起。这时候的分数还算老实——榜面 ≈ 真实，幻觉还没长出来。") },
      { t: t("反复筛选"), frac: 0.45, cap: t("每一代都从 20 个随机变体里挑「这套题上分数最高」的那个。挑中的既有真进步，也有「恰好蒙对这套题」的运气——运气被一代代攒下来，榜面开始离开真实。") },
      { t: t("榜面分裂三条线"), frac: 1, cap: t("跑到底：榜面（亮线）拆成三份 = 全维真实（红线）+ 窄化 + 题目过拟合。两片色带就是幻觉——上面那片换题即蒸发，下面那片是只练被测维度攒出的偏科。现在动动上面的参数，看幻觉怎么涨缩。") }
    ];
    let view = 0;
    const cap = document.createElement("div");
    cap.className = "step-note";
    cap.textContent = STEPS[0].cap;
    host.appendChild(cap);
    stepper(host, {
      count: STEPS.length,
      onstep: i => {
        view = i;
        cap.textContent = STEPS[i].cap;
        draw();
        if (i === STEPS.length - 1) act();          // 走完论证链才算「亲手试过」
      }
    });

    let hist;
    function run() { hist = simulate(); draw(); }
    function draw() {
      const { w, h } = sized();
      ctx.clearRect(0, 0, w, h);
      const pad = 36, gw = w - pad * 2, gh = h - pad * 2;
      const n = hist.bench.length;
      const k = Math.max(2, Math.round(n * STEPS[view].frac));   // 本步放出的代数
      const maxY = Math.max(1, ...hist.bench) * 1.05;            // 坐标轴按完整曲线定，步进间不跳
      const X = i => pad + (i / (n - 1)) * gw;
      const Y = v => pad + gh - (v / maxY) * gh;
      const gl = C("--ink-600");
      ctx.strokeStyle = gl; ctx.strokeRect(pad, pad, gw, gh);
      // shaded gaps: bench→trueBench = 题目过拟合 ; trueBench→true = 窄化
      const band = (top, bot, color, alpha) => {
        ctx.beginPath();
        for (let i = 0; i < k; i++) { const x = X(i), y = Y(top[i]); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        for (let i = k - 1; i >= 0; i--) ctx.lineTo(X(i), Y(bot[i]));
        ctx.closePath(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1;
      };
      band(hist.bench, hist.trueBench, C("--accent"), .16);   // 题目过拟合
      band(hist.trueBench, hist.true, C("--red"), .12);       // 窄化
      const line = (arr, color, glow, dash) => {
        ctx.beginPath();
        for (let i = 0; i < k; i++) { i ? ctx.lineTo(X(i), Y(arr[i])) : ctx.moveTo(X(i), Y(arr[i])); }
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash || []);
        ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke();
        ctx.shadowBlur = 0; ctx.setLineDash([]);
      };
      line(hist.bench, C("--accent"), C("--accent-glow"));
      line(hist.trueBench, C("--ink-300"), null, [5, 4]);
      line(hist.true, C("--red"));
      ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace";
      ctx.fillText(t("能力/分数"), pad + 4, pad + 12); ctx.fillText(t("筛选代数 →"), w - pad - 60, h - 8);

      /* —— 标注层：分叉点气泡 + 两片色带的名字 —— */
      const gapEnd = hist.bench[n - 1] - hist.true[n - 1];
      let div = -1;
      for (let i = 0; i < n; i++) {
        if (hist.bench[i] - hist.true[i] > Math.max(0.05, gapEnd * 0.12)) { div = i; break; }
      }
      const pins = [];
      if (div >= 0 && div < k) {
        pins.push({
          x: Math.round(X(div)), y: Math.round(Y(hist.bench[div])),
          t: t("从这里起，榜面和真实分道"), dir: X(div) < pad + gw * 0.55 ? "right" : "left"
        });
      }
      if (view === STEPS.length - 1) {
        const i2 = Math.min(n - 1, Math.round(n * 0.8));
        pins.push({
          x: Math.round(X(i2)), y: Math.round((Y(hist.bench[i2]) + Y(hist.trueBench[i2])) / 2),
          t: t("题目过拟合：换题即蒸发"), dir: "left"
        });
        pins.push({
          x: Math.round(X(i2)), y: Math.round((Y(hist.trueBench[i2]) + Y(hist.true[i2])) / 2),
          t: t("窄化：只练被测的窄维度"), dir: "left"
        });
      }
      an.show(pins);                                // 内容没变就不动 DOM

      const b = hist.bench[k - 1], tr = hist.true[k - 1], tb = hist.trueBench[k - 1], ov = hist.overfit[k - 1];
      const illusion = b > 0 ? Math.max(0, (b - tr) / b * 100) : 0;
      out.innerHTML = `${tf(`筛到第 {}/{} 代 · 榜面分 <span class="big">{}</span> = 真实 {} + 窄化 {} + 题目过拟合 {}`, k, n, b.toFixed(2), tr.toFixed(2), (tb - tr).toFixed(2), ov.toFixed(2))}
        <div style="font-size:.8rem;margin-top:6px">${tf(`其中 <span class="big" style="font-size:1.2rem">{}%</span> 是幻觉（换题即蒸发 + 只练了被测的窄维度）。`, illusion.toFixed(0))}
        ${zeroSum ? t("<br>⚠ 零和容量下，优化被测维度会<strong>主动挤占</strong>未测维度：模型真实地退化成 eval 的形状。") :
          freshEach ? t("<br>每代换新题：题目过拟合被清零，剩下的才是真本事。") :
          t("试试把「容量约束」切到零和，或把「题库策略」切到每代换新题。")}</div>`;
    }
    run();
    window.addEventListener("resize", draw);       // boot.js 主题切换也走这条广播重绘
  }
});

/* —— 预测门（自建，参考 explorable.js 的 predict 范式与样式类）—— */
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
