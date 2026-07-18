/* REACTOR · arena.js (Y11) — how a leaderboard rank inflates (Leaderboard Illusion) */
import { mount, canvas, controls, slider, add, readout, legend, scoped, gauss } from "/reactor-study/modules/mod-kit.js?v=fccf0ac854";

mount("arena", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "20 个模型，真实能力各不同。你的模型真实能力排第 11。看三种手段如何把它的『榜上名次』抬高，而真实能力一点没变。";
  body.appendChild(intro);
  const N = 20, MYTRUE = 10; // index of "your" model when sorted; skill given below
  const skills = Array.from({ length: N }, (_, i) => (N - i) * 0.12); // model 0 best
  let variants = 1, style = 0, battles = 200;
  const ctrl = controls(body);
  add(ctrl,
    slider(body, { label: "私测变体数 N（只发布最高分）", min: 1, max: 30, step: 1, value: 1, fmt: v => v }).on(v => { variants = v; draw(); }),
    slider(body, { label: "风格分投入（长回复/emoji 讨好评委）", min: 0, max: 20, step: 2, value: 0, fmt: v => (v / 10).toFixed(1) }).on(v => { style = v / 10; draw(); })
  );
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--ink-300)", t: "各模型真实能力" }, { c: "var(--accent)", t: "你的模型（显示分）" }]);
  function displayScore(i) {
    const base = skills[i];
    if (i === MYTRUE) {
      // best-of-N private testing = max of N noisy draws; + style bonus
      let best = -1e9; for (let k = 0; k < variants; k++) best = Math.max(best, base + gauss() * 0.25);
      return best + style * 0.5;
    }
    return base + gauss() * 0.05;
  }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const scores = skills.map((_, i) => displayScore(i));
    const order = [...scores.keys()].sort((a, b) => scores[b] - scores[a]);
    const myRank = order.indexOf(MYTRUE) + 1;
    const pad = 34, gw = w - pad * 2, gh = h - pad * 2, bw = gw / N;
    const hi = Math.max(...scores, ...skills) * 1.05;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    order.forEach((idx, r) => {
      const s = scores[idx], x = pad + r * bw;
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
    out.innerHTML = `你的真实能力排第 <span class="big">11</span>，榜上却显示第 <span class="big">${myRank}</span>
      <div style="font-size:.82rem;margin-top:6px;opacity:.9">${myRank < 8 ? "『发布即登顶』：私测择优 + 风格分把名次抬了上去，真实能力那条灰线纹丝不动。看 Arena 时，优先看 Style-Control 后的排名和置信区间。" : "把私测变体数和风格分推上去，名次会脱离真实能力往上爬。"}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
