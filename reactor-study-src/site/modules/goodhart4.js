/* REACTOR · goodhart4.js (B08) — the four variants (Manheim & Garrabrant 2018) */
import { mount, canvas, controls, slider, toggleBank, add, readout, legend, scoped, gauss } from "/modules/mod-kit.js";

const TYPES = {
  regressional: { name: "回归型 · 赢者诅咒", gen: (n, r) => { const t = gauss(); return [t + gauss(), t]; },
    note: "proxy = target + 噪声。按 proxy 择优，选出的 target 期望必低于 proxy（向均值回归）。target 仍缓慢上升，是最温和的一型。" },
  extremal: { name: "极值型 · 尾部崩坏", gen: (n, r) => { const x = gauss(); return [x + gauss() * .3, x - 1.2 * Math.max(0, x - 2) ** 2]; },
    note: "proxy 与 target 只在正常范围相关。压力把你推进从未见过的尾部，隐藏约束被突破，target 掉头向下。" },
  causal: { name: "因果型 · 干预错节点", gen: (n, r) => { const x = gauss(); return [x + r * 1.4, x]; },
    note: "proxy 与 target 只是共因相关。直接干预 proxy（而非共因）会切断关联：proxy 涨，target 纹丝不动。" },
  adversarial: { name: "对抗型 · 针对你造假", gen: (n, r) => { const real = gauss(), fake = (0.5 * Math.log1p(n)) * Math.abs(gauss() + 1); return [real + fake + gauss() * .3, real - 0.5 * fake]; },
    note: "对手知道你的 proxy 后，专造 proxy 高/target 低的选项。压力越大，选中的 target 越差，被压到负值。" }
};

mount("goodhart4", (body, fig, { config }) => {
  const C = scoped(fig);
  let type = "regressional";
  const ctrl = controls(body);
  ctrl.appendChild(toggleBank(body, { label: "Goodhart 类型", value: type,
    options: Object.entries(TYPES).map(([k, v]) => ({ label: v.name.split(" ")[0], value: k })),
    onchange: v => { type = v; draw(); } }));
  const { c, ctx, resize } = canvas(body, 300);
  const out = readout(body, "");
  legend(body, [{ c: "var(--accent)", t: "选中者的 proxy（你优化的指标）" }, { c: "var(--red)", t: "选中者的 target（你真正想要的）" }]);

  const PRESSURES = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
  function stats(gen, n) {
    let sp = 0, st = 0, T = 1200;
    for (let t = 0; t < T; t++) {
      let bp = -1e9, bt = 0;
      for (let i = 0; i < n; i++) { const [p, tg] = gen(n, 0); if (p > bp) { bp = p; bt = tg; } }
      sp += bp; st += bt;
    }
    return [sp / T, st / T];
  }
  function causalStats(n) { // causal: effort e goes into proxy directly
    const e = Math.log1p(n); let sp = 0, st = 0, T = 1500;
    for (let t = 0; t < T; t++) { const x = gauss(); sp += x + e; st += x; }
    return [sp / T, st / T];
  }
  function draw() {
    const { w, h } = resize(); ctx.clearRect(0, 0, w, h);
    const data = PRESSURES.map(n => type === "causal" ? causalStats(n) : stats(TYPES[type].gen, n));
    const pad = 38, gw = w - pad * 2, gh = h - pad * 2;
    const all = data.flat(); const lo = Math.min(...all, 0), hi = Math.max(...all, 1);
    const X = i => pad + (i / (PRESSURES.length - 1)) * gw;
    const Y = v => pad + gh - ((v - lo) / (hi - lo || 1)) * gh;
    ctx.strokeStyle = C("--ink-600"); ctx.strokeRect(pad, pad, gw, gh);
    if (lo < 0) { ctx.strokeStyle = C("--ink-500"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(pad + gw, Y(0)); ctx.stroke(); ctx.setLineDash([]); }
    const line = (idx, color, glow) => { ctx.beginPath(); data.forEach((d, i) => i ? ctx.lineTo(X(i), Y(d[idx])) : ctx.moveTo(X(i), Y(d[idx]))); ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0; data.forEach((d, i) => { ctx.beginPath(); ctx.arc(X(i), Y(d[idx]), 2.5, 0, 7); ctx.fillStyle = color; ctx.fill(); }); };
    line(0, C("--accent"), C("--accent-glow")); line(1, C("--red"));
    ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace"; ctx.fillText("优化压力（候选数 n，对数）→", pad + 4, h - 8);
    out.innerHTML = `<div class="big" style="font-size:1rem">${TYPES[type].name}</div><div style="font-size:.8rem;margin-top:6px;opacity:.9">${TYPES[type].note}</div>`;
  }
  draw(); window.addEventListener("resize", draw);
});
