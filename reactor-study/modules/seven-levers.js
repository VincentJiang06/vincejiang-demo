/* REACTOR · seven-levers.js (C02) — reactivity strength scorecard
   W11b 升级：presets 一键载入真实案例（US News 法学院 / 商学院 / 高考 /
   Chatbot Arena / 内部诊断指标）+ miniTable 各杠杆贡献分 +
   stepper 逐根杠杆讲解（含该案例这一格为什么打这个分）。
   指数数值逻辑与原版同源：七格等权相加 ÷70 ×100，四档判词未动。 */
import { mount, controls, slider, readout, presets, stepper, miniTable } from "/modules/mod-kit.js?v=4501323cdd";
import { t, tf } from "/modules/mod-i18n.js?v=fe1fe69deb";

/* [名称, 打分口径(tooltip), 一句白话, 为什么这根杠杆重要] */
const LEVERS = [
  [t("垄断度"), t("只有一个排名，还是多家并存？（USNWR 法学院=高；商学院五家=低）"),
    t("就这一把尺子，还是有得挑"),
    t("只有一把尺子时，没人躲得开它；多家并存，被测者能挑对自己有利的那把讲故事，支配力被稀释——商学院正是这样逃过一劫的。")],
  [t("利害绑定"), t("指标连着钱/生死/发布会 PPT 的程度"),
    t("分数连着钱和前途的程度"),
    t("利害越重，被测者拼命博弈的动机越强；不痛不痒的指标没人费劲去操纵。")],
  [t("可通约化粗暴度"), t("压成一个全序名次(高) 还是保留多维仪表盘(低)"),
    t("压成一个名次，还是保留多维仪表盘"),
    t("压得越粗暴，被丢掉的维度越隐形；隐形的维度没人守，绕行就越有利可图。")],
  [t("发布节律"), t("连续/高频发布 → 永恒监视"),
    t("多久张榜一次"),
    t("发布越频繁，越像一场永不下课的监考，被测者的日常越是围着指标转。")],
  [t("零和性"), t("相对名次(高) vs 绝对分数(低)：名次制造军备竞赛"),
    t("比相对名次，还是比绝对分"),
    t("比名次意味着你什么都没做错、对手涨了你就掉——这是军备竞赛的点火器。")],
  [t("可绕行通道"), t("指标与真实目标之间可被绕行的空间有多大"),
    t("不提升真实目标也能刷高分数的空间"),
    t("指标和真实目标之间的空隙越大，「刷分不办事」的路就越多。")],
  [t("被测者反身能力"), t("被测者多会逆向工程你的公式（模型/厂商=拉满）"),
    t("被测者多会研究你的公式"),
    t("会逆向工程公式的对手，博弈打得又准又快；AI 场景这格几乎恒定拉满——模型和厂商都读得懂规则。")]
];

/* 真实案例：七根杠杆的档位 + 每格的白话理由（档位数值与原版预设同源，新增「高考」档） */
const CASES = [
  { k: "01", t: t("US News 法学院"), vals: [10, 10, 9, 8, 10, 7, 6],
    line: t("近乎垄断的年度全序名次，连着生源与捐款：教科书级的反应性极端案例（R01 的主角）。"),
    why: [t("USN 一家独大数十年，法学院无榜可挑"), t("名次直接牵动生源、捐款、院长的饭碗"), t("使命各异的学校被压成第 1 到第 199 名"),
      t("一年一放榜，整个招生周期跟着它转"), t("名次是相对的：对手涨你就掉"), t("冲分奖学金、就业统计口径都是现成通道"), t("院长们雇顾问逆向工程公式")] },
  { k: "02", t: t("商学院（五榜并存）"), vals: [3, 7, 8, 6, 8, 7, 6],
    line: t("五家榜单方法各异，垄断度这格掉下来，整体强度低一截——多重排名互相稀释。"),
    why: [t("BW/USN/FT/Economist/WSJ 五家并存，可挑着讲"), t("利害仍高：学费与生源都在赌桌上"), t("同样压成名次，粗暴度不减"),
      t("各家节律不一，张榜的声浪被稀释"), t("同样是零和名次"), t("通道与法学院类似"), t("同样会逆向工程，但火力分散到五个公式")] },
  { k: "03", t: t("高考"), vals: [9, 10, 9, 3, 10, 6, 8],
    line: t("利害与零和拉满，但一年一次的低节律和严格监考压住了部分扭曲——扭曲改道去了应试训练。"),
    why: [t("一考定位次，几乎是唯一通道"), t("直接决定人生走向，利害拉满"), t("总分一个数，压掉所有侧面"),
      t("三年备考只为一次放榜：节律低，但赌注极重"), t("按位次录取，标准的零和"), t("题型可押、套路可练：应试即绕行"), t("整个应试产业都在逆向工程考纲")] },
  { k: "04", t: t("Chatbot Arena（AI 排行榜）"), vals: [8, 9, 9, 10, 9, 8, 10],
    line: t("全天候更新 + 被测者是会读规则的模型与厂商：反身能力被推到人类场景没有的档位（Y11 细讲）。"),
    why: [t("一度是社区默认的「唯一」大模型榜"), t("发布会、融资、招聘都盯着它"), t("万千能力压成一个 Elo 分（相对胜率折算的棋类等级分）"),
      t("全天候滚动更新：永恒监考"), t("Elo 本身就是零和的相对分"), t("私测多变体、只发布最高分等通道"), t("厂商与模型都能认出考场、读懂规则")] },
  { k: "05", t: t("好的内部诊断指标"), vals: [2, 2, 3, 3, 1, 3, 4],
    line: t("不挂利害、不排名、多维仪表盘：测量安安静静地当诊断用——这是低反应性长什么样。"),
    why: [t("只是团队内部多把尺子之一"), t("不连 KPI，不连发布决策"), t("保留多维仪表盘，不排名"),
      t("按需查看，没有固定张榜日"), t("看绝对读数，不比相对名次"), t("没人有动机绕它"), t("没有公开公式可供逆向")] }
];

mount("seven-levers", (body, fig, { config }) => {
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("把七个杠杆各打个分，得到一个『反应性强度指数』。这是本课的统一框架，用来预测任何排名或评测会被扭曲得多厉害。（相对/教学工具，非绝对指数）");
  body.appendChild(intro);

  let caseIdx = null, applying = false;
  const pb = presets(body, {
    label: t("一键载入真实案例（七根杠杆拨到对应档位）"), items: CASES,
    onselect: (c, i) => {
      caseIdx = i;
      applying = true;
      c.vals.forEach((v, j) => { sliders[j].input.value = v; sliders[j].input.dispatchEvent(new Event("input")); });
      applying = false;
      caseLine.textContent = t("案例：") + c.t + " — " + c.line;
      explain(stepIdx);                            // 讲解面板切到新案例的理由
    }
  });
  const caseLine = document.createElement("p");
  caseLine.className = "label"; caseLine.style.margin = "0 0 12px";
  caseLine.textContent = t("还没选案例——点上面一键载入，或直接拖滑块自定义。");
  body.appendChild(caseLine);

  const ctrl = controls(body); ctrl.style.flexDirection = "column"; ctrl.style.alignItems = "stretch";
  const sliders = LEVERS.map(([name, desc], i) => {
    const s = slider(body, { label: name, min: 0, max: 10, step: 1, value: 5, fmt: v => v });
    s.el.style.minWidth = "100%";
    s.el.title = desc;
    s.on(() => {
      render();
      if (!applying && caseIdx != null) {          // 手动拖过就不再是那个案例
        caseIdx = null;
        pb.select(null, false);
        caseLine.textContent = t("自定义档位（不对应任何预设案例）。");
        explain(stepIdx);
      }
    });
    ctrl.appendChild(s.el); return s;
  });
  const out = readout(body, "");
  const mt = miniTable(body, {
    cols: [t("杠杆"), t("档位"), t("贡献分"), t("一句白话")], rows: [],
    note: t("七格贡献分相加 ≈ 总指数（0–100）。哪格高，失真就先从哪格开始——这也是 C03 降压时的动手顺序。")
  });

  /* —— 逐根杠杆讲解：stepper 走杠杆，表格行与对应滑块跟着点亮 —— */
  const panel = document.createElement("div");
  panel.className = "step-note";
  body.appendChild(panel);
  let stepIdx = 0;
  const st = stepper(body, {
    count: LEVERS.length, prevLabel: t("上一根"), nextLabel: t("下一根"),
    onstep: i => { stepIdx = i; explain(i); }
  });

  function explain(i) {
    mt.highlight(i);
    sliders.forEach((s, j) => s.el.classList.toggle("lever-focus", j === i));
    const c = caseIdx != null ? CASES[caseIdx] : null;
    panel.innerHTML = `<span class="label">${tf("杠杆 {}/7", i + 1)} · ${LEVERS[i][0]}</span>
      <p><strong>${t("它问的是：")}</strong>${LEVERS[i][2]}。</p>
      <p><strong>${t("为什么它是根杠杆：")}</strong>${LEVERS[i][3]}</p>
      ${c ? `<p class="case-line">${tf(`<strong>{}</strong> 这格打 <strong>{}/10</strong>：{}`, c.t, c.vals[i], c.why[i])}</p>`
          : `<p class="case-line">${t("在上面载入一个真实案例，这里会解释它这一格为什么打这个分。")}</p>`}`;
  }

  function render() {
    const vals = sliders.map(s => s.get());
    const idx = Math.round(vals.reduce((a, b) => a + b, 0) / 70 * 100);
    const band = idx > 75 ? [t("极高"), "var(--red)", t("指标几乎必然被博弈失真、且难缓冲。像 USNWR 与 AI 排行榜：认得出它，别把它当真理。")]
      : idx > 50 ? [t("高"), "var(--yellow)", t("反应性显著。需要主动的抗博弈设计（见 C03）才扛得住。")]
        : idx > 28 ? [t("中"), "var(--blue)", t("有反应性但可控。多指标制衡 + 解耦通常够用。")]
          : [t("低"), "var(--green)", t("相对安全的测量。可以放心用来做诊断，但一旦挂钩利害就别掉以轻心。")];
    out.innerHTML = `${t("反应性强度指数")} <span class="big" style="color:${band[1]}">${idx}</span>/100 &nbsp;·&nbsp; <strong style="color:${band[1]}">${band[0]}</strong>
      <div style="height:8px;border-radius:4px;background:var(--ink-700);margin:8px 0;overflow:hidden"><div style="width:${idx}%;height:100%;background:${band[1]};box-shadow:0 0 10px ${band[1]}"></div></div>
      <div style="font-size:.82rem;opacity:.9">${band[2]}</div>`;
    mt.update(vals.map((v, i) => [LEVERS[i][0], v + "/10", "+" + (v / 70 * 100).toFixed(1), LEVERS[i][2]]));
    mt.highlight(stepIdx);
  }
  render();
  explain(0);
});
