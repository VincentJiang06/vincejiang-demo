/* REACTOR · arena.js (Y11) — how a leaderboard rank inflates (Leaderboard Illusion)
   W11c 升级：开局预测门（自建，复用 explorable 三段式样式类）+
   compareCanvas「诚实发布 vs 私测 N 变体只发最高」并排 +
   miniTable 逐策略对账（真实实力 / 发布分 / 榜上名次）。
   模拟数值逻辑与原版同源：displayScore() 的公式一个字没动，
   只是参数化成 (variants, style)，诚实一侧固定 (1, 0)。 */
import { mount, controls, slider, add, readout, legend, scoped, gauss, compareCanvas, miniTable } from "/modules/mod-kit.js";
import { optionGroup } from "/modules/quiz.js";

mount("arena", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "20 个模型，真实能力各不同。你的模型真实能力排第 11。左右两块榜单是同一个模型的两种发布策略——真实能力一模一样，只有『怎么发布』不同。";
  body.appendChild(intro);

  predictGate(body, {
    q: "先押一注：你的模型真实能力排第 11。发布前私下测 20 个变体、只把分数最高的那次挂上榜，名次大概会怎样？",
    options: [
      { t: "明显抬高：发布分掺进了『运气最好的一次』，名次能冲进前几", ok: true },
      { t: "基本不变：多测几次，噪声正负互相抵消，平均下来还是第 11" },
      { t: "反而变差：测得越多，越容易把短板暴露出来" }
    ],
    reveal: `每一次私测都是一次带噪声的抽签；「只发布最高分」= 专挑运气最好的那张签（<code>B13</code> 优化者诅咒的引擎）。噪声不会互相抵消，因为你根本没在求平均——你在取最大值。现实对照：《The Leaderboard Illusion》指控 Meta 在 Llama 4 发布前私测了多达 27 个变体只发最高；论文另一个估计是，哪怕只拿少量 Arena 对战数据去调优，也能带来最高 112% 的相对提升——不用把模型变好，学会这个榜的口味就够。`,
    plain: "看到『发布即登顶』的新闻，先问三个问题：私测了几个变体？拿到多少对战数据？看过 style control（把回答长度、排版这些风格因素扣掉）之后的名次没有？——图里那条真实能力的灰色刻度线，从头到尾没动过。",
    actHint: "拖一拖变体数/风格分，或点『再抽一次』，就能对答案"
  }, buildSim);

  function buildSim(host, act) {
    const N = 20, MYTRUE = 10; // index of "your" model when sorted; skill given below
    const skills = Array.from({ length: N }, (_, i) => (N - i) * 0.12); // model 0 best
    let variants = 10, style = 0;
    const ctrl = controls(host);
    add(ctrl,
      slider(host, { label: "私测变体数 N（只发布最高分）", min: 1, max: 30, step: 1, value: 10, fmt: v => v }).on(v => { variants = v; draw(); act(); }),
      slider(host, { label: "风格分投入（长回复/emoji 讨好评委）", min: 0, max: 20, step: 2, value: 0, fmt: v => (v / 10).toFixed(1) }).on(v => { style = v / 10; draw(); act(); })
    );
    const again = document.createElement("button");
    again.className = "btn"; again.textContent = "再抽一次 ▸";
    again.onclick = () => { draw(); act(); };
    const btnWrap = document.createElement("div"); btnWrap.className = "control";
    btnWrap.style.flexDirection = "row"; btnWrap.style.alignItems = "flex-end";
    btnWrap.appendChild(again); ctrl.appendChild(btnWrap);

    const duo = compareCanvas(host, { a: "诚实发布：测一次就发", b: "私测 N 个变体，只发最高分", h: 260 });
    const out = readout(host, "");
    legend(host, [{ c: "var(--ink-300)", t: "各模型真实能力（刻度线）" }, { c: "var(--accent)", t: "你的模型（显示分）" }]);
    const mt = miniTable(host, {
      cols: ["策略", "真实实力", "发布分", "榜上名次"], rows: [],
      note: "逐策略对账：「真实实力」两行一模一样，名次差全部来自发布策略。分数带噪声，点「再抽一次」看名次抖动。"
    });

    // display score = real skill + a strong best-of-N boost + style bonus（与原版同源）
    function displayScore(i, vN, st) {
      const base = skills[i];
      if (i === MYTRUE) {
        // best-of-N private testing = max of N noisy draws; + style bonus
        let best = -1e9; for (let k = 0; k < vN; k++) best = Math.max(best, base + gauss() * 0.25);
        return best + st * 0.5;
      }
      return base + gauss() * 0.05;
    }

    function board(vN, st) {
      const scores = skills.map((_, i) => displayScore(i, vN, st));
      const order = [...scores.keys()].sort((a, b) => scores[b] - scores[a]);
      return { scores, order, myRank: order.indexOf(MYTRUE) + 1, myScore: scores[MYTRUE] };
    }

    function drawBoard(P, B, hi) {
      const { w, h } = P.resize();
      const ctx = P.ctx;
      ctx.clearRect(0, 0, w, h);
      const pad = 26, gw = w - pad * 2, gh = h - pad * 2, bw = gw / N;
      ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
      B.order.forEach((idx, r) => {
        const s = B.scores[idx], x = pad + r * bw;
        ctx.fillStyle = idx === MYTRUE ? C("--accent") : C("--ink-500");
        if (idx === MYTRUE) { ctx.shadowColor = C("--accent-glow"); ctx.shadowBlur = 8; }
        ctx.fillRect(x + 1, pad + gh - s / hi * gh, bw - 2, s / hi * gh); ctx.shadowBlur = 0;
        // true skill tick
        // 真值刻度有的落在柱子里、有的落在面板上，两种底色对比度不同：
        // 先描一道底色描边，刻度线在哪种底上都读得出来
        const ty = pad + gh - skills[idx] / hi * gh;
        ctx.lineWidth = 3; ctx.strokeStyle = C("--bg-2");
        ctx.beginPath(); ctx.moveTo(x + 1, ty); ctx.lineTo(x + bw - 1, ty); ctx.stroke();
        ctx.lineWidth = 1; ctx.strokeStyle = C("--ink-300");
        ctx.beginPath(); ctx.moveTo(x + 1, ty); ctx.lineTo(x + bw - 1, ty); ctx.stroke();
      });
      ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("榜单名次（左=第一）→", pad + 4, h - 8);
    }

    function draw() {
      const A = board(1, 0);                       // 诚实：测一次、零风格分
      const B = board(variants, style);            // 私测择优 + 风格分
      const hi = Math.max(...A.scores, ...B.scores, ...skills) * 1.05;
      drawBoard(duo.a, A, hi);
      drawBoard(duo.b, B, hi);

      out.innerHTML = `同一个模型（真实第 <span class="big">11</span>）：诚实发布第 <span class="big">${A.myRank}</span> 名 &nbsp;·&nbsp; 私测择优第 <span class="big">${B.myRank}</span> 名
        <div style="font-size:.82rem;margin-top:6px;opacity:.9">${B.myRank < 8
          ? "『发布即登顶』：私测择优 + 风格分把名次抬了上去，真实能力那条灰线纹丝不动。看 Arena 时，优先看 Style-Control 后的排名和置信区间。"
          : "把私测变体数和风格分推上去，右边的名次会脱离真实能力往上爬，左边只能跟着运气小幅抖动。"}</div>`;

      mt.update([
        ["诚实发布：测一次就发", "第 11 名", A.myScore.toFixed(2), "第 " + A.myRank + " 名"],
        [`私测 ${variants} 个只发最高${style ? "，加风格分" : ""}`, "第 11 名", B.myScore.toFixed(2), "第 " + B.myRank + " 名"]
      ]);
      mt.highlight(1);
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
  gate.innerHTML = `<div class="phase-tag"><span class="led on"></span>第 1 步 · 先猜一猜</div>`;
  body.appendChild(gate);
  optionGroup(gate, {
    q: P.q, options: opts, mode: "pick",
    onpick: i => { predicted = i; stage.classList.add("armed"); sync(); }
  });

  const stage = document.createElement("div");
  stage.className = "stage";
  const stageTag = document.createElement("div");
  stageTag.className = "phase-tag";
  stageTag.innerHTML = `<span class="led"></span>第 2 步 · 亲手试`;
  const inner = document.createElement("div"); inner.className = "stage-inner";
  const shutter = document.createElement("div"); shutter.className = "shutter";
  shutter.innerHTML = `<span class="led"></span><span>先在上面选一个你的猜测，这块面板才会亮</span>`;
  stage.append(stageTag, inner, shutter);
  body.appendChild(stage);

  const rev = document.createElement("div");
  rev.className = "reveal";
  rev.innerHTML = `<div class="phase-tag"><span class="led"></span>第 3 步 · 对答案</div>`;
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "btn"; btn.textContent = "对答案"; btn.disabled = true;
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
    panel.innerHTML = `<div class="rv-row"><span class="label">你的猜测</span><span>${opts[predicted].t}</span></div>
      <div class="rv-row"><span class="label">实际情况</span><span>${opts[answer].t}</span></div>
      <div class="rv-verdict ${hit ? "ok" : "no"}"><span class="led on"></span>${hit ? "猜对了" : "和实际不一样，差别在下面"}</div>
      ${P.reveal ? `<div class="read rv-read">${P.reveal}</div>` : ""}
      ${P.plain ? `<div class="rv-plain"><span class="label">这说明什么</span><div class="rv-plain-body">${P.plain}</div></div>` : ""}`;
    panel.style.display = "block";
    rev.querySelector(".phase-tag .led").className = "led on";
    btn.disabled = true;
    note.textContent = "";
  };

  function sync() {
    if (revealed) return;
    stageTag.querySelector(".led").className = predicted != null ? "led on" : "led";
    btn.disabled = !(predicted != null && acted);
    note.textContent = predicted == null ? "先猜一个"
      : (acted ? "可以对答案了" : (P.actHint || "把上面的演示走一遍，就能对答案"));
  }
  sync();
  buildStage(inner, () => { if (!acted) { acted = true; sync(); } });
}
