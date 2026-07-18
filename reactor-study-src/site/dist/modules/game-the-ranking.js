/* REACTOR · game-the-ranking.js (R01) — you are the dean */
import { mount, canvas, controls, slider, add, readout, legend, cssvar } from "/modules/mod-kit.js?v=49b358d492";

mount("game-the-ranking", (body, fig) => {
  const C = n => cssvar(n, fig);
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "你是一所法学院院长。把每年的预算分配在「真实办学」和「操纵排名指标」之间。对手也在做同样的选择。";
  body.appendChild(intro);

  const N = 20, TMAX = 40;
  let myGaming = 0.2, quality, gaming, prevRank, t, myQ, myRank, history;
  function reset() {
    // everyone starts nearly identical — differences below are made by the game itself
    quality = Array.from({ length: N }, () => 0.55 + (Math.random() - 0.5) * 0.06);
    gaming = Array.from({ length: N }, () => 0.1 + Math.random() * 0.04);
    prevRank = null;
    t = 0; history = { rank: [], quality: [], gaming: [] };
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
    t++;
    draw();
  }

  const ctrl = controls(body);
  const s = slider(body, {
    label: "你投入 GAMING 的预算比例", min: 0, max: 90, step: 5, value: 20, unit: "%",
    fmt: v => v + "%"
  }).on(v => myGaming = v / 100);
  add(ctrl, s);
  const advBtn = document.createElement("button");
  advBtn.className = "btn btn-primary"; advBtn.textContent = "推进一年 ▸";
  advBtn.onclick = advance;
  const run5 = document.createElement("button");
  run5.className = "btn"; run5.textContent = "快进 10 年 ▸▸";
  run5.onclick = () => { for (let i = 0; i < 10; i++) advance(); };
  const rst = document.createElement("button");
  rst.className = "btn"; rst.textContent = "↺ 重置";
  rst.onclick = () => { reset(); draw(); };
  const btns = document.createElement("div"); btns.className = "control";
  btns.style.flexDirection = "row"; btns.style.gap = "8px"; btns.style.alignItems = "flex-end";
  btns.append(advBtn, run5, rst); ctrl.appendChild(btns);

  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [
    { c: "var(--accent)", t: "你的名次（越上越好）" },
    { c: "var(--ink-300)", t: "你的真实办学质量" },
    { c: "var(--red)", t: "全场平均 gaming（军备竞赛）" }
  ]);

  function draw() {
    const { w, h } = resize();
    ctx.clearRect(0, 0, w, h);
    const pad = 34, gw = w - pad * 2, gh = h - pad * 2;
    const accent = C("--accent"), gray = C("--ink-300"), red = C("--red"), gl = C("--ink-600");
    ctx.strokeStyle = gl; ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, gw, gh);
    const n = Math.max(history.rank.length, 1);
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
    ctx.fillText("第1名", pad + 4, pad + 12); ctx.fillText("第" + N + "名", pad + 4, pad + gh - 4);
    ctx.fillText("年 →", w - pad - 24, h - 8);

    const rankNow = myRank == null ? "—" : (myRank + 1);
    out.innerHTML = `第 <span class="big">${t}</span> 年 &nbsp;·&nbsp; 你的名次 <span class="big">${rankNow}</span>/${N}
      &nbsp;·&nbsp; 真实质量 <span class="big">${myQ.toFixed(2)}</span>
      <div style="font-size:.72rem;opacity:.85;margin-top:4px">
      ${history.gaming.length && history.gaming.at(-1) > 0.4
        ? "全场陷入 gaming 军备竞赛：名次要靠操纵维持，真实质量的增长被拖慢：排名还在，信息含量没了。"
        : "把预算多投真实办学，短期名次可能吃亏；多投 gaming，名次上去但你在制造一个空心的自己。"}</div>`;
  }
  draw();
  window.addEventListener("resize", draw);
});
