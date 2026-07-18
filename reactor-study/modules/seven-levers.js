/* REACTOR · seven-levers.js (C02) — reactivity strength scorecard */
import { mount, controls, slider, add, readout, scoped } from "/modules/mod-kit.js?v=fccf0ac854";

const LEVERS = [
  ["垄断度", "只有一个排名，还是多家并存？（USNWR 法学院=高；商学院五家=低）"],
  ["利害绑定", "指标连着钱/生死/发布会 PPT 的程度"],
  ["可通约化粗暴度", "压成一个全序名次(高) 还是保留多维仪表盘(低)"],
  ["发布节律", "连续/高频发布 → 永恒监视"],
  ["零和性", "相对名次(高) vs 绝对分数(低)：名次制造军备竞赛"],
  ["可绕行通道", "指标与真实目标之间可被绕行的空间有多大"],
  ["被测者反身能力", "被测者多会逆向工程你的公式（模型/厂商=拉满）"]
];
const PRESETS = {
  "USNWR 法学院": [10, 10, 9, 8, 10, 7, 6],
  "商学院(多排名)": [3, 7, 8, 6, 8, 7, 6],
  "好的内部诊断指标": [2, 2, 3, 3, 1, 3, 4],
  "AI 排行榜": [8, 9, 9, 10, 9, 8, 10]
};

mount("seven-levers", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = "把七个杠杆各打个分，得到一个『反应性强度指数』。这是本课的统一框架，用来预测任何排名或评测会被扭曲得多厉害。（相对/教学工具，非绝对指数）";
  body.appendChild(intro);

  const presetBar = document.createElement("div"); presetBar.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px";
  Object.keys(PRESETS).forEach(k => { const b = document.createElement("button"); b.className = "btn"; b.style.fontSize = ".66rem"; b.style.padding = ".45em .8em"; b.textContent = k; b.onclick = () => { PRESETS[k].forEach((v, i) => { sliders[i].input.value = v; sliders[i].input.dispatchEvent(new Event("input")); }); }; presetBar.appendChild(b); });
  body.appendChild(presetBar);

  const ctrl = controls(body); ctrl.style.flexDirection = "column"; ctrl.style.alignItems = "stretch";
  const sliders = LEVERS.map(([name, desc], i) => {
    const s = slider(body, { label: name, min: 0, max: 10, step: 1, value: 5, fmt: v => v });
    s.el.style.minWidth = "100%";
    s.el.title = desc;
    s.on(() => render());
    ctrl.appendChild(s.el); return s;
  });
  const out = readout(body, "");
  function render() {
    const vals = sliders.map(s => s.get());
    const idx = Math.round(vals.reduce((a, b) => a + b, 0) / 70 * 100);
    const band = idx > 75 ? ["极高", "var(--red)", "指标几乎必然被博弈失真、且难缓冲。像 USNWR 与 AI 排行榜：认得出它，别把它当真理。"]
      : idx > 50 ? ["高", "var(--yellow)", "反应性显著。需要主动的抗博弈设计（见 C03）才扛得住。"]
        : idx > 28 ? ["中", "var(--blue)", "有反应性但可控。多指标制衡 + 解耦通常够用。"]
          : ["低", "var(--green)", "相对安全的测量。可以放心用来做诊断，但一旦挂钩利害就别掉以轻心。"];
    out.innerHTML = `反应性强度指数 <span class="big" style="color:${band[1]}">${idx}</span>/100 &nbsp;·&nbsp; <strong style="color:${band[1]}">${band[0]}</strong>
      <div style="height:8px;border-radius:4px;background:var(--ink-700);margin:8px 0;overflow:hidden"><div style="width:${idx}%;height:100%;background:${band[1]};box-shadow:0 0 10px ${band[1]}"></div></div>
      <div style="font-size:.82rem;opacity:.9">${band[2]}</div>`;
  }
  render();
});
