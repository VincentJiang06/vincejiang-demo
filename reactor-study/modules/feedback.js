/* REACTOR · feedback.js (R02) — self-fulfilling prophecy loop
   W11b 升级：compareCanvas 并排跑「反馈=0 的世界 vs 反馈=0.8 的世界」+
   presets 换场景（课堂期望 / 信贷评分 / 排名）。
   模拟数值逻辑与原版同源：sim() 只是把反馈强度改成入参，公式一字未动。 */
import { mount, controls, slider, add, readout, legend, scoped, compareCanvas, presets } from "/modules/mod-kit.js?v=4501323cdd";
import { t, tf } from "/modules/mod-i18n.js?v=fe1fe69deb";

const SCEN = [
  {
    k: "01", t: t("课堂期望"), pair: t("学生"),
    intro: t("两个学生，真实水平完全相同。唯一的区别：开学时老师被（随机地！）告知其中一位是「潜力股」。"),
    chan: t("这里的传动装置（把信念变成现实的那条通道）是：老师的期望 → 更多提问机会、更多耐心、更高容错 → 真实成绩。")
  },
  {
    k: "02", t: t("信贷评分"), pair: t("借款人"),
    intro: t("两个人，还款能力完全相同。唯一的区别：一个的初始信用分被算高了一点点。"),
    chan: t("这里的传动装置是：分数 → 更低利率、更高额度 → 更宽松的财务处境 → 真实还款能力。")
  },
  {
    k: "03", t: t("排名"), pair: t("学校"),
    intro: t("两所学校，真实质量完全相同。唯一的区别：首次排名里，一所因为测量噪声排在了前面。"),
    chan: t("这里的传动装置是：名次 → 申请者与捐款的流向 → 办学资源 → 真实质量。")
  }
];

mount("feedback", (body, fig, { config }) => {
  const C = scoped(fig);
  let scen = SCEN[0];
  let fb = 0.8;

  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  body.appendChild(intro);

  const pb = presets(body, {
    label: t("换一个场景（机制是同一台）"), items: SCEN, value: 0,
    onselect: it => { scen = it; syncIntro(); draw(); }
  });

  const ctrl = controls(body);
  add(ctrl, slider(body, {
    label: t("右边世界的反馈强度（预言→资源→现实）"),
    min: 0, max: 100, step: 5, value: 80, fmt: v => (v / 100).toFixed(2)
  }).on(v => { fb = v / 100; draw(); }));

  const cc = compareCanvas(body, {
    a: t("反馈 = 0 的世界（预言只是说说）"),
    b: t("反馈 = 0.80 的世界（预言带来资源）"),
    h: 260
  });
  const out = readout(body, "");
  legend(body, [
    { c: "var(--accent)", t: t("被看好的一方（真实能力）") },
    { c: "var(--ink-300)", t: t("被看衰的一方（真实能力）") }
  ]);

  function syncIntro() {
    intro.textContent = scen.intro + " " + t("左边世界的反馈被剪断（=0）；右边世界预言换得动资源。拖滑块调右边的反馈强度。");
  }
  syncIntro();

  function sim(f) {
    let a = 0.5, b = 0.5; const A = [a], B = [b]; let expA = 0.55, expB = 0.45; // initial (false) prediction
    for (let t = 0; t < 60; t++) {
      a += 0.006 + f * 0.02 * (expA - 0.5);
      b += 0.006 + f * 0.02 * (expB - 0.5);
      // expectations update toward observed (which now reflects the prophecy)
      expA = 0.8 * expA + 0.2 * (a / (a + b));
      expB = 0.8 * expB + 0.2 * (b / (a + b));
      A.push(a); B.push(b);
    }
    return { A, B };
  }

  function paint(cell, S, hi, lo) {
    const { w, h } = cell.resize();               // 尺寸真变才重设（compareCanvas 内已把关）
    const x = cell.ctx; x.clearRect(0, 0, w, h);
    const pad = 30, gw = w - pad * 2, gh = h - pad * 2;
    const X = i => pad + (i / (S.A.length - 1)) * gw;
    const Y = v => pad + gh - ((v - lo) / (hi - lo)) * gh;
    x.strokeStyle = C("--ink-600"); x.lineWidth = 1; x.strokeRect(pad, pad, gw, gh);
    // 两条线之间的楔形阴影：被预言硬造出来的差距。左边世界它宽度为零——这正是要点。
    x.beginPath();
    S.A.forEach((v, i) => i ? x.lineTo(X(i), Y(v)) : x.moveTo(X(i), Y(v)));
    for (let i = S.B.length - 1; i >= 0; i--) x.lineTo(X(i), Y(S.B[i]));
    x.closePath(); x.globalAlpha = .18; x.fillStyle = C("--accent"); x.fill(); x.globalAlpha = 1;
    const plot = (arr, color, glow) => {
      x.beginPath(); arr.forEach((v, i) => i ? x.lineTo(X(i), Y(v)) : x.moveTo(X(i), Y(v)));
      x.strokeStyle = color; x.lineWidth = 2;
      x.shadowColor = glow || "transparent"; x.shadowBlur = glow ? 7 : 0; x.stroke(); x.shadowBlur = 0;
    };
    plot(S.A, C("--accent"), C("--accent-glow"));
    plot(S.B, C("--ink-300"));
    x.fillStyle = C("--ink-400"); x.font = "10px monospace";
    x.fillText(t("时间 →"), pad + gw - 40, h - 8);
    x.fillText(tf("末期真实差距 {}", (S.A.at(-1) - S.B.at(-1)).toFixed(3)), pad + 2, pad - 8);
  }

  let lastOut = "";
  function draw() {
    const ra = sim(0), rb = sim(fb);
    // 两个世界共用一把比例尺，差距才可比
    const hi = Math.max(...ra.A, ...ra.B, ...rb.A, ...rb.B), lo = 0.4;
    paint(cc.a, ra, hi, lo);
    paint(cc.b, rb, hi, lo);
    const bt = tf("反馈 = {} 的世界（预言带来资源）", fb.toFixed(2));
    if (cc.b.label.textContent !== bt) cc.b.label.textContent = bt;   // 值没变就不动 DOM
    const gap = rb.A.at(-1) - rb.B.at(-1);
    const html = `${t("左边世界末期差距")} <span class="big">${(ra.A.at(-1) - ra.B.at(-1)).toFixed(3)}</span>
      &nbsp;·&nbsp; ${t("右边世界末期差距")} <span class="big">${gap.toFixed(3)}</span>${t("（两边初始差距都是 0）")}
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${fb > 0.05
        ? `${tf("同样的两个{}，右边只多了一条传动带。", scen.pair)}${scen.chan} ${t("<strong>这说明什么：</strong>差距不是天赋造出来的，是传动带造出来的——剪断传动带（反馈=0），预言就只是空话；传动带越粗，一点噪声被坐实得越快、越大。这就是 Merton 的自我实现闭环。")}`
        : t("反馈=0 时两个世界一模一样：预言无法自我实现，它只是空话。把滑块推上去，看右边世界怎么被推开。")}</div>`;
    if (html !== lastOut) { lastOut = html; out.innerHTML = html; }   // 值没变就不动 DOM
  }
  draw();
  window.addEventListener("resize", draw);        // boot.js 主题切换也走这条广播重绘
});
