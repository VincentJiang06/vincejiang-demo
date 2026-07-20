/* REACTOR · game-the-ranking.js (R01) — you are the dean
   W11b 升级：开局预测门（自建，复用 explorable.js 的三段式样式类）+
   presets 三档人设 + miniTable 逐年对账（预算去向 vs 名次 vs 真实质量）。
   模拟数值逻辑与原版同源：metric()/advance() 的公式一个字没动。 */
import { mount, canvas, controls, slider, add, readout, legend, cssvar, presets, miniTable } from "/modules/mod-kit.js";
import { optionGroup } from "/modules/quiz.js";
import { t, tf } from "/modules/mod-i18n.js";

mount("game-the-ranking", (body, fig) => {
  const C = n => cssvar(n, fig);
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("你是一所法学院院长。把每年的预算分配在「真实办学」和「操纵排名指标」之间。对手也在做同样的选择。");
  body.appendChild(intro);

  predictGate(body, {
    q: t("上任先押一注：如果把预算几乎全砸在操纵指标上，「名次」和「真实办学质量」谁先有明显反应？"),
    options: [
      { t: t("名次先动：一两年就蹿上去，真实质量的亏空要好几年才显形"), ok: true },
      { t: t("真实质量先动：立刻塌下去，名次反应要慢半拍") },
      { t: t("两个同时、同速变化") }
    ],
    reveal: t(`榜单的公式是：榜面分 = 真实质量 + 1.2×指标投入 + 噪声。指标投入是<strong>当年到账</strong>的，名次立刻反应；而真实质量每年只挪一小步（增长 0.02×办学投入），亏空要好几年才看得出来。下面的逐年对账表能亲手对出这个时间差：「名次」一列先变，「真实质量」一列慢慢掉。`),
    plain: t("操纵的回报是即时的，代价是慢性的。这正是每个院长都忍不住动手、军备竞赛必然点燃的原因——等亏空显形时，全场都在操纵，名次早已退不回去。"),
    actHint: t("把年份推进几年，就能对答案")
  }, buildSim);

  function buildSim(host, act) {
    const N = 20, TMAX = 40;
    /* 年份计数原名 t，与 i18n 的 t() 撞名（会把 t 遮成数字），改名 yr；纯改名，模拟不动 */
    let myGaming = 0.2, quality, gaming, prevRank, yr, myQ, myRank, history;
    function reset() {
      // everyone starts nearly identical — differences below are made by the game itself
      quality = Array.from({ length: N }, () => 0.55 + (Math.random() - 0.5) * 0.06);
      gaming = Array.from({ length: N }, () => 0.1 + Math.random() * 0.04);
      prevRank = null;
      yr = 0; history = { rank: [], quality: [], gaming: [], mine: [] };
      myQ = quality[0]; myRank = null;
    }
    reset();

    // observable metric: real quality + a STRONG immediate boost from gaming + noise
    function metric(i) { return quality[i] + 1.2 * gaming[i] + (Math.random() - 0.5) * 0.12; }
    function advance() {
      gaming[0] = myGaming;                       // your slider drives BOTH your metric and your quality
      const M = quality.map((_, i) => metric(i));
      const order = [...M.keys()].sort((a, b) => M[b] - M[a]);
      const rank = Array(N); order.forEach((idx, r) => rank[idx] = r);
      for (let i = 0; i < N; i++) {
        const g = i === 0 ? myGaming : gaming[i];
        // investing in real quality (1-g) grows it; gaming starves it
        quality[i] += 0.02 * (1 - g) - 0.008 * quality[i];
        // rivals run an arms race: ratchet gaming up if they slipped, relax slightly if they rose
        if (i !== 0 && prevRank) {
          gaming[i] = Math.min(0.85, Math.max(0.05,
            gaming[i] + (rank[i] > prevRank[i] ? 0.05 : -0.02)));
        }
      }
      prevRank = rank;
      myRank = rank[0]; myQ = quality[0];
      history.rank.push(rank[0]);
      history.quality.push(quality[0]);
      history.gaming.push(gaming.reduce((s, x) => s + x, 0) / N);
      history.mine.push(myGaming);                // 记账用：这一年你押了多少（呈现层，不参与模拟）
      yr++;
      act();
      draw();
    }

    const ctrl = controls(host);
    /* 三档人设：一键把「押指标比例」拨到典型档位。中途改弦更张也行——
       模拟不重置，正好观察策略切换的滞后效果。 */
    const PERSONA = [
      { k: "A", t: t("老实办学"), g: 5, note: t("预算 95% 投真实办学，只留 5% 应付指标") },
      { k: "B", t: t("精明经营"), g: 35, note: t("拿三分之一预算喂指标，其余照常办学") },
      { k: "C", t: t("全押指标"), g: 85, note: t("预算几乎全部砸向指标，办学靠惯性") }
    ];
    let applying = false;
    const pb = presets(ctrl, {
      label: t("一键换人设（中途改也行）"), items: PERSONA,
      onselect: p => { applying = true; s.input.value = p.g; s.input.dispatchEvent(new Event("input")); applying = false; }
    });
    const s = slider(host, {
      label: t("你投入 GAMING 的预算比例"), min: 0, max: 90, step: 5, value: 20, unit: "%",
      fmt: v => v + "%"
    }).on(v => {
      myGaming = v / 100;
      if (!applying && pb.index != null) pb.select(null, false);   // 手动拖过就不再是那个人设
    });
    add(ctrl, s);
    const advBtn = document.createElement("button");
    advBtn.className = "btn btn-primary"; advBtn.textContent = t("推进一年 ▸");
    advBtn.onclick = advance;
    const run5 = document.createElement("button");
    run5.className = "btn"; run5.textContent = t("快进 10 年 ▸▸");
    run5.onclick = () => { for (let i = 0; i < 10; i++) advance(); };
    const rst = document.createElement("button");
    rst.className = "btn"; rst.textContent = t("↺ 重置");
    rst.onclick = () => { reset(); draw(); };
    const btns = document.createElement("div"); btns.className = "control";
    btns.style.flexDirection = "row"; btns.style.gap = "8px"; btns.style.alignItems = "flex-end";
    btns.append(advBtn, run5, rst); ctrl.appendChild(btns);

    const cv = canvas(host, 300);
    const { ctx } = cv;
    let lastW = 0;
    const sized = () => {                          // 尺寸真变才重设 canvas（性能红线）
      const w = host.clientWidth || 600;
      if (w !== lastW) { lastW = w; return cv.resize(); }
      return { w: lastW, h: 300 };
    };
    const out = readout(host, "");
    legend(host, [
      { c: "var(--accent)", t: t("你的名次（越上越好）") },
      { c: "var(--ink-300)", t: t("你的真实办学质量") },
      { c: "var(--red)", t: t("全场平均 gaming（军备竞赛）") }
    ]);
    /* 逐年对账：钱去了哪、名次怎么走、真实质量怎么走 */
    const mt = miniTable(host, {
      cols: [t("年"), t("你押指标"), t("名次"), t("真实质量"), t("全场平均押注")], rows: [],
      note: t("逐年对账（最近 10 年）。对着看：「你押指标」一变，「名次」当年就反应；「真实质量」要过几年才显形。")
    });

    function draw() {
      const { w, h } = sized();
      ctx.clearRect(0, 0, w, h);
      const pad = 34, gw = w - pad * 2, gh = h - pad * 2;
      const accent = C("--accent"), gray = C("--ink-300"), red = C("--red"), gl = C("--ink-600");
      ctx.strokeStyle = gl; ctx.lineWidth = 1;
      ctx.strokeRect(pad, pad, gw, gh);
      const X = i => pad + (i / Math.max(TMAX - 1, 1)) * gw;
      // rank (invert: rank 0 = top)
      const Yr = r => pad + (r / (N - 1)) * gh;
      const Yq = q => pad + gh - Math.min(1, Math.max(0, (q - 0.4) / 0.8)) * gh;
      const line = (pts, color, glow) => {
        if (pts.length < 1) return;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.shadowColor = glow || color; ctx.shadowBlur = glow ? 8 : 0; ctx.stroke(); ctx.shadowBlur = 0;
      };
      line(history.rank.map((r, i) => ({ x: X(i), y: Yr(r) })), accent, C("--accent-glow"));
      line(history.quality.map((q, i) => ({ x: X(i), y: Yq(q) })), gray);
      line(history.gaming.map((g, i) => ({ x: X(i), y: pad + gh - g * gh })), red);
      // axis labels
      ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace";
      ctx.fillText(t("第1名"), pad + 4, pad + 12); ctx.fillText(tf("第{}名", N), pad + 4, pad + gh - 4);
      ctx.fillText(t("年 →"), w - pad - 24, h - 8);

      const rankNow = myRank == null ? "—" : (myRank + 1);
      out.innerHTML = `${tf(`第 <span class="big">{}</span> 年 &nbsp;·&nbsp; 你的名次 <span class="big">{}</span>/{}`, yr, rankNow, N)}
        &nbsp;·&nbsp; ${t("真实质量")} <span class="big">${myQ.toFixed(2)}</span>
        <div style="font-size:.72rem;opacity:.85;margin-top:4px">
        ${history.gaming.length && history.gaming.at(-1) > 0.4
          ? t("全场陷入 gaming 军备竞赛：名次要靠操纵维持，真实质量的增长被拖慢：排名还在，信息含量没了。")
          : t("把预算多投真实办学，短期名次可能吃亏；多投 gaming，名次上去但你在制造一个空心的自己。")}</div>`;

      const rows = history.rank.map((r, i) => [
        tf("第{}年", i + 1),
        Math.round(history.mine[i] * 100) + "%",
        tf("第{}名", r + 1),
        history.quality[i].toFixed(2),
        Math.round(history.gaming[i] * 100) + "%"
      ]).slice(-10);
      mt.update(rows);
      mt.highlight(rows.length - 1);
    }
    draw();
    window.addEventListener("resize", draw);       // boot.js 主题切换也走这条广播重绘
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
