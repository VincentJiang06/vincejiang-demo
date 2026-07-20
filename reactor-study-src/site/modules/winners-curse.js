/* REACTOR · winners-curse.js (B13) — optimizer's curse / best-of-N
   W11c 升级：开局预测门（自建，复用 explorable 三段式样式类）+
   presets 三档候选数（3/20/100）+ annot 在直方图上标「估计值均线 vs
   真实值均线」的落差区。对答案时用同一台模拟器重跑 Smith–Winkler
   玩具模型（真值全 0、σ=1），亲手对出课文里的 0.85σ/103%/154%。
   模拟数值逻辑与原版同源：trial()/draw() 的公式一个字没动。 */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss, presets, annot } from "/modules/mod-kit.js";
import { optionGroup } from "/modules/quiz.js";
import { t, tf } from "/modules/mod-i18n.js";

mount("winners-curse", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("你从 N 个候选里挑『估计值最高』的那个。估计=真值+噪声。挑得越狠，你选中的那个真值，越低于它的估计，这就是优化者诅咒。");
  body.appendChild(intro);

  /* Smith–Winkler 玩具模型：真值全部为 0、只剩噪声，
     落差 = N 个噪声抽样最大值的期望，单位是噪声自己的 σ（课文 0.85σ 的 σ）。
     用同一个 gauss() 跑出来、再按它实测的均值/σ 标准化——mod-kit 的
     轻量 gauss 实际 σ≈1.008，不标准化会整体虚高 2%，对不上课文数字。 */
  function toyGap(n, T = 20000) {
    let s = 0, m = 0, q = 0, c = 0;
    for (let k = 0; k < T; k++) {
      let best = -1e9;
      for (let i = 0; i < n; i++) { const e = gauss(); m += e; q += e * e; c++; if (e > best) best = e; }
      s += best;
    }
    const mu = m / c, sd = Math.sqrt(q / c - mu * mu) || 1;
    return (s / T - mu) / sd;
  }

  predictGate(body, {
    q: t("先押一注：候选从 3 个加到 100 个，你选中的那个『赢家』，真实水平相对它的估计值会怎样？"),
    options: [
      { t: t("落差越拉越大：挑的动作专门捞『运气好的估计』，候选越多捞得越准"), ok: true },
      { t: t("落差不变：每个估计都是无偏的（平均不高估也不低估），挑多少个都一样") },
      { t: t("落差缩小：候选池大了，总有真货冒头，选中的反而更可信") }
    ],
    reveal: () => {
      const rows = [[3, "0.85σ", toyGap(3).toFixed(2) + "σ"],
        [4, "103%", Math.round(toyGap(4) * 100) + "%"],
        [10, "154%", Math.round(toyGap(10) * 100) + "%"]];
      return `${t("「取最大值」是个偏心的算子：估计里运气成分越大的候选，越容易排到最前面被你选中。单个估计无偏，不等于「按估计选出的最大者」无偏。为了对账，刚才用<strong>同一台模拟器</strong>重跑了课文里 Smith–Winkler 的玩具模型：把候选的真值全部设成 0（根本不存在更好的那个）、噪声 σ=1，各跑 2 万次，看选中者平均虚高多少：")}
      <table class="mini-table" style="margin-top:8px"><thead><tr><th>${t("候选数")}</th><th>${t("课文里的数字")}</th><th>${t("本模拟器跑出")}</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${tf("{} 个", r[0])}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table>
      <div class="label" style="margin-top:8px">${t("上面主面板的 N 和 σ 拨得更大时，「失望缺口」按同一个机制继续放大。")}</div>`;
    },
    plain: t("冠军的分数里永远掺着运气，候选越多、噪声越大，掺得越多。所以选完要打折（学名叫贝叶斯收缩）：不是惩罚冠军，是请它归还借来的运气——而且这一切发生时，没有任何人作弊。"),
    actHint: t("拨一拨候选数（或点上面三档），再对答案")
  }, buildSim);

  function buildSim(host, act) {
    let N = 20, noise = 1.0;
    const ctrl = controls(host);
    /* 三档择优强度：从「挑外卖」到「挑 checkpoint」 */
    const SCALES = [
      { k: "A", t: t("3 个候选"), n: 3, note: t("三家外卖店里挑评分最高的那家") },
      { k: "B", t: t("20 个候选"), n: 20, note: t("一轮面试里挑分数最高的候选人") },
      { k: "C", t: t("100 个候选"), n: 100, note: t("一批 checkpoint 里挑 eval 最高分的那个") }
    ];
    let applying = false;
    const pb = presets(ctrl, {
      label: t("一键换择优强度"), items: SCALES,
      onselect: p => { applying = true; sN.input.value = p.n; sN.input.dispatchEvent(new Event("input")); applying = false; }
    });
    const sN = slider(host, { label: t("候选数 N（择优强度）"), min: 2, max: 200, step: 1, value: 20, fmt: v => v }).on(v => {
      N = v;
      if (!applying && pb.index != null) pb.select(null, false);   // 手动拖过就不再是那一档
      draw(); act();
    });
    const sS = slider(host, { label: t("估计噪声 σ"), min: 2, max: 30, step: 2, value: 10, fmt: v => (v / 10).toFixed(1) }).on(v => { noise = v / 10; draw(); act(); });
    add(ctrl, sN, sS);

    const cv = canvas(host, 300);
    const { ctx } = cv;
    let lastW = 0, size = { w: 0, h: 300 };
    const sized = () => {                            // 尺寸真变才重设 canvas（性能红线）
      const w = host.clientWidth || 600;
      if (w !== lastW) { lastW = w; size = cv.resize(); }
      return size;
    };
    const an = annot(cv);
    const out = readout(host, "");
    legend(host, [{ c: "var(--accent)", t: t("选中者的估计值（你以为的）") }, { c: "var(--red)", t: t("选中者的真实值（实际拿到的）") }]);

    function trial() {
      let bestEst = -1e9, trueOfBest = 0;
      for (let i = 0; i < N; i++) { const tv = gauss(); const est = tv + gauss() * noise; if (est > bestEst) { bestEst = est; trueOfBest = tv; } }
      return [bestEst, trueOfBest];
    }
    function draw() {
      const { w, h } = sized(); ctx.clearRect(0, 0, w, h);
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
      ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText(t("值 →"), pad + gw - 24, h - 6);

      /* 标注层：两条均线 + 中间的落差区（选中点的估计值 vs 真实值） */
      const xT = Math.round(pad + (mT - lo) / (hi - lo) * gw);
      const xE = Math.round(pad + (mE - lo) / (hi - lo) * gw);
      an.show([
        { kind: "box", x: xT, y: pad, w: Math.max(6, xE - xT), h: gh, t: tf("落差 {}：选中者平均被高估这么多", (mE - mT).toFixed(2)) },
        { x: xT, y: pad + 20, t: tf("实际拿到的：真值均线 {}", mT.toFixed(2)), dir: "left" },
        { x: xE, y: pad + 48, t: tf("你以为的：估计均线 {}", mE.toFixed(2)), dir: "left" }
      ]);

      out.innerHTML = `${tf(`选中者：平均估计 <span class="big">{}</span> vs 平均真值 <span class="big">{}</span>`, mE.toFixed(2), mT.toFixed(2))}
        <div style="font-size:.8rem;margin-top:6px;opacity:.9">${tf(`失望缺口 <strong>{}</strong>。N 越大、噪声越大，你选中的赢家越是『运气好的估计』而非『真的最好』，所以要对最高分做贝叶斯收缩（别全信）。`, (mE - mT).toFixed(2))}</div>`;
    }
    draw(); window.addEventListener("resize", () => { draw(); });   // boot.js 主题切换也走这条广播重绘
  }
});

/* —— 预测门（自建，参考 explorable.js 的 predict 范式与样式类）——
   流程：先猜一个 → 面板通电、亲手操作 → 操作过了才能对答案。
   reveal 可以是函数：对答案那一刻才计算（这里用来现跑玩具模型）。 */
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
    const revealHtml = typeof P.reveal === "function" ? P.reveal() : P.reveal;
    panel.innerHTML = `<div class="rv-row"><span class="label">${t("你的猜测")}</span><span>${opts[predicted].t}</span></div>
      <div class="rv-row"><span class="label">${t("实际情况")}</span><span>${opts[answer].t}</span></div>
      <div class="rv-verdict ${hit ? "ok" : "no"}"><span class="led on"></span>${hit ? t("猜对了") : t("和实际不一样，差别在下面")}</div>
      ${revealHtml ? `<div class="read rv-read">${revealHtml}</div>` : ""}
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
