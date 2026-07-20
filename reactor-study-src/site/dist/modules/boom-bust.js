/* REACTOR · boom-bust.js (R08) — Soros reflexivity: positive vs negative feedback
   W11c 升级：compareCanvas 正反馈世界 vs 负反馈世界并排（原版靠拨杆二选一，
   现在两种相位同屏对照）+ presets 三个场景（房价/币价/排名）+
   stepper 走「预期 → 价格 → 基本面」循环链的逐步旁白。
   模拟数值逻辑与原版同源：sim() 两支的公式一个字没动，只是把
   positive 从模块级开关变成了参数，两块画布各跑一支。 */
import { mount, controls, slider, add, readout, legend, scoped, gauss, presets, stepper, compareCanvas } from "/modules/mod-kit.js?v=4501323cdd";
import { t, tf } from "/modules/mod-i18n.js?v=fe1fe69deb";

mount("boom-bust", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("价格由『基本面』和『关于它的误解』共同驱动，而价格又反过来改变基本面。左右两个世界用同一套参数，只差反馈的符号：负反馈互相纠偏、趋向均衡；正反馈互相点火、吹成泡沫、再自我瓦解。");
  body.appendChild(intro);

  let mis = 0.6;
  /* 三个场景：同一台机器换三种材料。只改「误解强度」，公式不动 */
  const SCENES = [
    { k: "01", t: t("房价"), m: 55, line: t("价格=房价，基本面=居住价值和租金。『房价永远涨』让买房人推高价格，高价又吸引信贷和开发，把基本面也真的抬了一段——直到收入撑不住月供，真相时刻到来。") },
    { k: "02", t: t("币价"), m: 90, line: t("价格=币价，基本面=真实使用价值。信念几乎就是全部基本面，误解强度拉满：冲得最高，塌得也最干脆。") },
    { k: "03", t: t("排名"), m: 65, line: t("价格=榜面分数，基本面=真实质量。『登顶』带来生源、用户和投资，确实反哺质量一阵子——但榜面冲得比质量快，拉开的缺口就是那次真相时刻（Y11 的现场）。") }
  ];
  let applying = false;
  const pb = presets(body, {
    label: t("一键换场景（只改误解强度，机器不变）"), items: SCENES,
    onselect: s => {
      applying = true; sl.input.value = s.m; sl.input.dispatchEvent(new Event("input")); applying = false;
      sceneLine.textContent = t("场景：") + s.t + " — " + s.line;
    }
  });
  const sceneLine = document.createElement("p");
  sceneLine.className = "label"; sceneLine.style.margin = "0 0 12px";
  sceneLine.textContent = t("上面挑一个场景，或直接拖『误解强度』。同一套参数喂给左右两个世界。");
  body.appendChild(sceneLine);

  const ctrl = controls(body);
  const sl = slider(body, { label: t("误解强度（认知偏离现实的程度）"), min: 0, max: 100, step: 5, value: 60, fmt: v => (v / 100).toFixed(2) }).on(v => {
    mis = v / 100;
    if (!applying && pb.index != null) { pb.select(null, false); sceneLine.textContent = t("自定义误解强度（不对应任何预设场景）。"); }
    draw();
  });
  add(ctrl, sl);

  const duo = compareCanvas(body, { a: t("正反馈世界（互相点火 → 泡沫）"), b: t("负反馈世界（互相纠偏 → 均衡）"), h: 260 });
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: t("市场价格") }, { c: "var(--ink-300)", t: t("基本面 (fundamental)") }]);

  function sim(positive) {
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

  function drawWorld(cell, R) {
    const { w, h } = cell.resize(); const ctx = cell.ctx;
    ctx.clearRect(0, 0, w, h);
    const { P, F, bust } = R; const pad = 26, gw = w - pad * 2, gh = h - pad * 2;
    const hi = Math.max(...P, ...F) * 1.05, lo = Math.min(...P, ...F, 0.9);
    const X = i => pad + (i / (P.length - 1)) * gw, Y = v => pad + gh - ((v - lo) / (hi - lo)) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    const plot = (arr, color, glow) => { ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0; };
    plot(F, C("--ink-300")); plot(P, C("--accent"), C("--accent-glow"));
    if (bust > 0) { const x = X(bust); ctx.strokeStyle = C("--red"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, pad + gh); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C("--red"); ctx.font = "10px monospace"; ctx.fillText(t("moment of truth"), Math.max(pad, x - 30), pad + 12); }
  }

  function draw() {
    const pos = sim(true), neg = sim(false);
    drawWorld(duo.a, pos);
    drawWorld(duo.b, neg);
    out.innerHTML = `${pos.bust > 0
      ? tf(`正反馈世界在第 <span class="big">{}</span> 步撞上「真相时刻」（红虚线）`, pos.bust)
      : t("正反馈世界还没撞上「真相时刻」——误解太弱，点不着火")} &nbsp;·&nbsp; ${t("负反馈世界全程贴着基本面走")}
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${t("同一套参数，只差反馈符号：右边观念被现实不断校正，价格收敛到基本面附近（≈ 自我否定预言的抵消轴）；左边误解与价格互相强化，冲上泡沫顶再反转崩溃（≈ 自我实现预言的放大轴）。误解强度越大，泡沫越陡、真相时刻来得越早。Soros 的贡献是把这两支装进同一个模型。")}</div>`;
  }

  /* —— 循环链逐步旁白：预期 → 价格 → 基本面 —— */
  const note = document.createElement("div");
  note.className = "step-note";
  body.appendChild(note);
  const CHAIN = [
    [t("预期：你相信要涨"), t(`一切从一个不完美的判断开始——「这东西要涨」。在左边的正反馈世界里，价格每比基本面高出一截，这份相信就再加一分（模拟里那行是 <code>belief += 0.03×误解×(价格−基本面)</code>）：涨价本身成了「我判断对了」的证据。右边的负反馈世界恰好相反：价格一旦高过基本面，观念就被现实往回拽（<code>belief += 0.15×(基本面−价格)</code>）。`)],
    [t("价格：相信变成买卖"), t(`预期不是空想，它会下单。价格 = 基本面 + 信念×误解（外加一点噪声）：你越信、误解越强，价格被顶得越高。到这一步还只是普通的「炒作」——真正让 Soros 出圈的是下一步。`)],
    [t("基本面：价格反过来改写现实"), t(`最反直觉的一环：<code>基本面 += 0.010×误解×belief</code>——涨价带来真金白银的信贷、生源、投资，基本面<strong>真的</strong>变好了一点，所以泡沫早期总有「你看，是真的在变好」的实感。但基本面爬得慢、价格冲得快，缺口越拉越大；缺口超过阈值的那一刻，就是左图的红虚线「真相时刻」：现实撑不住预期，信念反转，循环倒着跑一遍。环路闭合——这就是反身性：观念改变现实，被改变的现实又喂养下一轮观念。`)]
  ];
  stepper(body, {
    count: 3, prevLabel: t("上一环"), nextLabel: t("下一环"),
    onstep: i => { note.innerHTML = `<span class="label">${tf("循环链 {}/3", i + 1)} · ${CHAIN[i][0]}</span><p>${CHAIN[i][1]}</p>`; }
  });
  note.innerHTML = `<span class="label">${tf("循环链 {}/3", 1)} · ${CHAIN[0][0]}</span><p>${CHAIN[0][1]}</p>`;

  draw(); window.addEventListener("resize", draw);   // boot.js 主题切换也走这条广播重绘
});
