/* REACTOR · overopt.js (Y07) — reward-model overoptimization (Gao et al. 2023)
   W11c 升级：annot 标注层钉住 gold 曲线的峰值——「在这停手」。
   曲线数值逻辑与原版同源：proxy/gold 的公式一个字没动。 */
import { mount, canvas, controls, slider, add, readout, legend, scoped, annot } from "/modules/mod-kit.js?v=4501323cdd";
import { t, tf } from "/modules/mod-i18n.js?v=fe1fe69deb";

mount("overopt", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("你越用力优化奖励模型(proxy)，代理得分越高，但真实目标(gold)先升后降。这是 Goodhart 定律最干净的一条实验曲线。");
  body.appendChild(intro);
  let noise = 0.35, dead = 0;   // proxy noise, and optional KL "leash"
  const ctrl = controls(body);
  add(ctrl,
    slider(body, { label: t("proxy 与真实目标的错配(噪声)"), min: 5, max: 80, step: 5, value: 35, fmt: v => (v / 100).toFixed(2) }).on(v => { noise = v / 100; draw(); }),
    slider(body, { label: t("KL 约束(缰绳)：限制离初始多远"), min: 0, max: 100, step: 10, value: 0, fmt: v => v + "%" }).on(v => { dead = v / 100; draw(); })
  );
  const cv = canvas(body, 300);
  const { ctx } = cv;
  let lastW = 0, size = { w: 0, h: 300 };
  const sized = () => {                              // 尺寸真变才重设 canvas（性能红线）
    const w = body.clientWidth || 600;
    if (w !== lastW) { lastW = w; size = cv.resize(); }
    return size;
  };
  const an = annot(cv);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: t("proxy 得分（奖励模型说的）") }, { c: "var(--red)", t: t("gold 得分（真实目标）") }]);

  function draw() {
    const { w, h } = sized(); ctx.clearRect(0, 0, w, h);
    const pad = 38, gw = w - pad * 2, gh = h - pad * 2;
    // d = optimization distance (KL^0.5). proxy rises ~ a*d ; gold = proxy - noise*d^2 (overoptimization)
    const maxD = 10 * (dead ? (1 - dead * 0.85) : 1);
    const N = 120; const proxy = [], gold = [];
    for (let i = 0; i <= N; i++) { const d = (i / N) * maxD; proxy.push(1.2 * d); gold.push(1.2 * d - noise * d * d); }
    const hi = Math.max(...proxy, 1), lo = Math.min(...gold, 0);
    const X = i => pad + (i / N) * gw, Y = v => pad + gh - ((v - lo) / (hi - lo)) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    ctx.strokeStyle = C("--ink-500"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(pad + gw, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    const plot = (arr, color, glow) => { ctx.beginPath(); arr.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v))); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0; };
    plot(proxy, C("--accent"), C("--accent-glow")); plot(gold, C("--red"));
    // mark the peak of gold
    const pk = gold.indexOf(Math.max(...gold));
    ctx.fillStyle = C("--red"); ctx.beginPath(); ctx.arc(X(pk), Y(gold[pk]), 3.5, 0, 7); ctx.fill();
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText(t("优化强度 (KL 距离) →"), pad + 4, h - 8);

    /* 标注层：钉住真实目标的峰值。峰值靠右时气泡翻到左侧，免得出界 */
    an.show([{
      x: Math.round(X(pk)), y: Math.round(Y(gold[pk])),
      t: t("真实目标在这见顶——在这停手"), dir: pk > N * 0.55 ? "left" : "right"
    }]);

    const overshoot = ((proxy[N] - gold[N])).toFixed(1);
    out.innerHTML = `${tf(`真实目标在优化距离 <span class="big">{}</span> 处见顶，之后<strong>掉头向下</strong>。`, (pk / N * maxD).toFixed(1))}
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${dead ? t("KL 缰绳把你限制在近处：峰值前停手，避免过优化。") : tf("松开缰绳一路优化 proxy：终点处 proxy 与真实目标的差距达 {}。加一点 KL 约束试试。", overshoot)}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
