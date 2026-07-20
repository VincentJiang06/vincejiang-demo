/* REACTOR · goodhart4.js (B08) — the four variants (Manheim & Garrabrant 2018)
   W11b 升级：开局预测门「你猜哪一型最难防」（自建，复用 explorable 三段式样式）+
   tabs 一型一面板（各自的模拟画布 + 白话机制说明）+
   miniTable 逐型对账「指标涨幅 vs 真实目标涨幅」（看过的页签才填数）。
   模拟数值逻辑与原版同源：TYPES.gen / stats() / causalStats() 一字未动。 */
import { mount, readout, legend, scoped, gauss, tabs, miniTable } from "/modules/mod-kit.js";
import { optionGroup } from "/modules/quiz.js";
import { t } from "/modules/mod-i18n.js";

const TYPES = {
  regressional: { name: t("回归型 · 赢者诅咒"), gen: (n, r) => { const tv = gauss(); return [tv + gauss(), tv]; },   // tv 原名 t，与 i18n 的 t() 撞名
    note: t("proxy = target + 噪声。按 proxy 择优，选出的 target 期望必低于 proxy（向均值回归）。target 仍缓慢上升，是最温和的一型。") },
  extremal: { name: t("极值型 · 尾部崩坏"), gen: (n, r) => { const x = gauss(); return [x + gauss() * .3, x - 1.2 * Math.max(0, x - 2) ** 2]; },
    note: t("proxy 与 target 只在正常范围相关。压力把你推进从未见过的尾部，隐藏约束被突破，target 掉头向下。") },
  causal: { name: t("因果型 · 干预错节点"), gen: (n, r) => { const x = gauss(); return [x + r * 1.4, x]; },
    note: t("proxy 与 target 只是共因相关。直接干预 proxy（而非共因）会切断关联：proxy 涨，target 纹丝不动。") },
  adversarial: { name: t("对抗型 · 针对你造假"), gen: (n, r) => { const real = gauss(), fake = (0.5 * Math.log1p(n)) * Math.abs(gauss() + 1); return [real + fake + gauss() * .3, real - 0.5 * fake]; },
    note: t("对手知道你的 proxy 后，专造 proxy 高/target 低的选项。压力越大，选中的 target 越差，被压到负值。") }
};
const ORDER = ["regressional", "extremal", "causal", "adversarial"];
/* 每型一句白话故事 + 判词 + 解药（呈现层，数字全部来自下面的模拟） */
const PLAIN = {
  regressional: {
    story: t("按身高选篮球天赋：全国最高的那个人，多半不是最好的球员——他的第一名，一半靠与球技无关的成分（基因彩票）恰好拉满。"),
    verdict: t("缓涨但打折"), advice: t("解药：给估计打折扣（向平均值收缩）+ 留出集。") },
  extremal: {
    story: t("体温和健康相关，但把「升温」推向极致，得到的不是超级健康，是发烧致死——那条相关只在日常区间被验证过。"),
    verdict: t("先升后崩"), advice: t("解药：别外推到没验证过的区域，设护栏、及早收手。") },
  causal: {
    story: t("篮球运动员都很高，但让孩子打篮球不会让他长高——箭头方向反了，你推的是共因的影子。"),
    verdict: t("指标独涨，目标不动"), advice: t("解药：做干预实验，找到真正的因再动手。") },
  adversarial: {
    story: t("应试作弊、刷榜的 SEO、粉饰财报：对手知道你按什么打分，就专门生产「指标高、目标低」的东西喂你。"),
    verdict: t("越优化越糟，压到负值"), advice: t("解药：机制设计——指标保密、轮换、多指标、独立审计。") }
};

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

mount("goodhart4", (body, fig, { config }) => {
  const C = scoped(fig);

  predictGate(body, {
    q: t("先猜：四种失灵里，哪一型最难防？"),
    options: [
      { t: t("回归型：择优必然带来的「打折」") },
      { t: t("极值型：把系统推出验证过的区域") },
      { t: t("因果型：把相关当因果，推错节点") },
      { t: t("对抗型：有对手专门针对你的指标造假"), ok: true }
    ],
    reveal: t(`回归型确实「防不掉」——但它温和、可预期，事后打个折扣就能校准。对抗型的对面是会学习的人（或模型）：你改指标，他跟着改；任何一次性的补丁都会过期，只能靠机制设计（保密、轮换、多指标、独立审计）持续过招。下面的对账表也看得出来：只有对抗型把「真实目标涨幅」压成了负数——压力越大越糟。`),
    plain: t("没有对手的失灵，修一次就好；有对手的失灵，是一场不会结束的军备竞赛。诊断你的 eval 时，第一个要问的就是：有没有人在针对它优化？"),
    actHint: t("把四个页签都点开看一遍，就能对答案")
  }, buildStage);

  function buildStage(host, act) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const H = 280;
    const seen = new Set();
    const cache = {};   // type -> data（算一次，换页签/换主题只重绘）
    const panes = {};   // type -> 缓存的面板 DOM（换页签不重建）

    function buildPane(k) {
      const root = document.createElement("div");
      const story = document.createElement("p");
      story.style.cssText = "font-size:.9rem;color:var(--text-2);margin:0 0 10px;line-height:1.7";
      story.innerHTML = `<strong style="color:var(--text)">${t("白话版：")}</strong>${PLAIN[k].story}`;
      const c = document.createElement("canvas");
      root.append(story, c);
      const ro = readout(root, `<div class="big" style="font-size:1rem">${TYPES[k].name}</div>
        <div style="font-size:.8rem;margin-top:6px;opacity:.9">${TYPES[k].note}<br>${PLAIN[k].advice}</div>`);
      return { root, c, ctx: c.getContext("2d"), w: 0, ro };
    }
    function sizeCanvas(p) {                       // 尺寸真变才重设 canvas（性能红线）
      const w = p.root.clientWidth || 0;
      if (!w) return null;
      if (p.c.width !== w * dpr || p.c.height !== H * dpr) {
        p.c.width = w * dpr; p.c.height = H * dpr; p.c.style.height = H + "px";
        p.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      return { w, h: H };
    }

    let mt = null;                                 // tabs() 构造时会同步选中第 0 页，此刻表还没建好
    const tb = tabs(host, {
      items: ORDER.map(k => ({ t: TYPES[k].name, render: panel => show(k, panel) })),
      value: 0
    });
    legend(host, [
      { c: "var(--accent)", t: t("选中者的 proxy（你优化的指标）") },
      { c: "var(--red)", t: t("选中者的 target（你真正想要的）") }
    ]);
    mt = miniTable(host, {
      cols: [t("类型"), t("指标涨幅"), t("真实目标涨幅"), t("一句话判词")],
      rows: tableRows(),
      note: t("涨幅 = 优化压力从 1 加到 2048 时的变化，数字来自你刚跑的模拟。四个页签都看过，才能对答案。")
    });
    mt.highlight(0);

    function tableRows() {
      return ORDER.map(k => {
        const d = cache[k];
        if (!d) return [TYPES[k].name.split(" ")[0], "—", "—", t("还没看：点开该页签")];
        const f = v => (v >= 0 ? "+" : "") + v.toFixed(2);
        return [TYPES[k].name.split(" ")[0], f(d.at(-1)[0] - d[0][0]), f(d.at(-1)[1] - d[0][1]), PLAIN[k].verdict];
      });
    }

    function show(k, panel) {
      if (!panes[k]) panes[k] = buildPane(k);
      panel.appendChild(panes[k].root);
      if (!cache[k]) cache[k] = PRESSURES.map(n => k === "causal" ? causalStats(n) : stats(TYPES[k].gen, n));
      drawType(k);                                 // 每次选中都重绘：主题可能换过，位图不会自己变色
      if (mt) { mt.update(tableRows()); mt.highlight(ORDER.indexOf(k)); }
      seen.add(k);
      if (seen.size === ORDER.length) act();       // 四型都看过才算「亲手试过」
    }

    function drawType(k) {
      const p = panes[k];
      const size = sizeCanvas(p);
      if (!size) return;
      const { w, h } = size, ctx = p.ctx, data = cache[k];
      ctx.clearRect(0, 0, w, h);
      const pad = 38, gw = w - pad * 2, gh = h - pad * 2;
      const all = data.flat(); const lo = Math.min(...all, 0), hi = Math.max(...all, 1);
      const X = i => pad + (i / (PRESSURES.length - 1)) * gw;
      const Y = v => pad + gh - ((v - lo) / (hi - lo || 1)) * gh;
      ctx.strokeStyle = C("--ink-600"); ctx.lineWidth = 1; ctx.strokeRect(pad, pad, gw, gh);
      if (lo < 0) { ctx.strokeStyle = C("--ink-500"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(pad + gw, Y(0)); ctx.stroke(); ctx.setLineDash([]); }
      const line = (idx, color, glow) => {
        ctx.beginPath(); data.forEach((d, i) => i ? ctx.lineTo(X(i), Y(d[idx])) : ctx.moveTo(X(i), Y(d[idx])));
        ctx.strokeStyle = color; ctx.lineWidth = 2;
        ctx.shadowColor = glow || "transparent"; ctx.shadowBlur = glow ? 7 : 0; ctx.stroke(); ctx.shadowBlur = 0;
        data.forEach((d, i) => { ctx.beginPath(); ctx.arc(X(i), Y(d[idx]), 2.5, 0, 7); ctx.fillStyle = color; ctx.fill(); });
      };
      line(0, C("--accent"), C("--accent-glow"));
      line(1, C("--red"));
      ctx.fillStyle = C("--ink-400"); ctx.font = "10px monospace";
      ctx.fillText(t("优化压力（候选数 n，对数）→"), pad + 4, h - 8);
    }

    window.addEventListener("resize", () => {      // boot.js 主题切换也走这条广播重绘
      const k = ORDER[tb.index];
      if (k && panes[k]) drawType(k);
    });
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
