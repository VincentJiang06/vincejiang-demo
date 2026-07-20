/* REACTOR · design-robust-eval.js (C03) — pick defenses, watch the attack
   W11c 升级：presets 一键载入 C02 同款案例的初始攻击面（各通道基础压力
   换成该案例的分布）+ miniTable 逐防御对账（边际贡献：拆掉它漏多少、
   勾上它还能压多少）+ 勾选防御的即时白话反馈。
   模拟数值逻辑与原版同源：挡下后残余 = round(基础×0.18)、
   真实信号 = 100 − 残余幻觉之和，公式一个字没动；默认攻击面就是原版数字。 */
import { mount, readout, scoped, presets, miniTable } from "/modules/mod-kit.js";
import { t, tf } from "/modules/mod-i18n.js";

const VECTORS = [
  { k: t("题目过拟合"), plain: t("背题"), base: 34, blockedBy: ["heldout", "rotate"] },
  { k: t("维度窄化"), plain: t("只练一面"), base: 22, blockedBy: ["paired", "cap"] },
  { k: t("直接造假"), plain: t("改数字"), base: 18, blockedBy: ["audit", "decouple"] },
  { k: t("风格/表面刷分"), plain: t("讨好评委"), base: 16, blockedBy: ["paired", "audit"] }
];
const DEFENSES = [
  ["heldout", t("隐藏测试集 (held-out)"), t("留一组优化循环永远看不到的题")],
  ["rotate", t("动态/轮换题库"), t("让博弈追不上（Dynabench/LiveBench）")],
  ["paired", t("配对指标制衡"), t("互相拉扯的指标组，难被同时博弈")],
  ["decouple", t("eval 与优化解耦"), t("eval 只诊断，不直接驱动改模型（Deming）")],
  ["audit", t("随机人工抽检"), t("抽真实会话让人读：对抗不可测部分")],
  ["cap", t("承认容量约束/限压"), t("别把全部优化压力压在一个窄 eval 上")]
];
/* C02 同款案例 → 四条攻击通道的初始压力分布（默认档=原版数字） */
const CASES = [
  { k: "00", t: t("通用 eval（默认）"), bases: [34, 22, 18, 16],
    line: t("不指定场景的平均攻击面——原版沙盒就是它。") },
  { k: "01", t: t("US News 法学院"), bases: [22, 30, 28, 10],
    line: t("冲分奖学金、就业统计口径任摆——「改数字」和「只练一面」是主通道（C02 打分：垄断+利害全高）。") },
  { k: "02", t: t("商学院（五榜并存）"), bases: [26, 22, 16, 14],
    line: t("五家榜单互相稀释，单榜支配力掉档：四条通道都比法学院温和一点，但一条也没关上。") },
  { k: "03", t: t("高考"), bases: [46, 24, 8, 12],
    line: t("题型可押、套路可练——「背题」一家独大；严格监考把「改数字」压到很低。") },
  { k: "04", t: t("Chatbot Arena"), bases: [28, 14, 10, 38],
    line: t("长回复、emoji、讨喜语气——「讨好评委」是头号通道，外加适应榜口味的「背题」（私测择优另算，见 B13/Y11）。") },
  { k: "05", t: t("好的内部诊断指标"), bases: [10, 8, 4, 6],
    line: t("不挂利害、没人有动机博弈：攻击面本来就小——这就是低反应性的样子（C02 打分全低）。") }
];

mount("design-robust-eval", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "12px";
  intro.textContent = t("勾选防御手段。系统会对你的 eval 发起一次 gaming 攻击，看还剩多少『幻觉』穿过去。目标：把真实信号占比顶上去。先用下面的案例换一套攻击面，再决定先堵哪条。");
  body.appendChild(intro);

  let bases = VECTORS.map(v => v.base);
  const on = new Set();
  /* 同一公式的纯函数版：给任意勾选组合算残余幻觉（对账表按边际用它） */
  const calc = set => VECTORS.reduce((s, v, i) =>
    s + (v.blockedBy.some(d => set.has(d)) ? Math.round(bases[i] * 0.18) : bases[i]), 0);

  const pb = presets(body, {
    label: t("一键载入 C02 打过分的案例（换一套初始攻击面）"), items: CASES, value: 0,
    onselect: c => {
      bases = c.bases.slice();
      caseLine.textContent = t("案例：") + c.t + " — " + c.line;
      feedback(tf("换到「{}」：四条通道的压力重新分布了。看红色条找最粗的那条，先堵它——这也是 C02 说的「哪格高，失真先从哪格开始」。", c.t));
      render();
    }
  });
  const caseLine = document.createElement("p");
  caseLine.className = "label"; caseLine.style.margin = "0 0 12px";
  caseLine.textContent = t("案例：") + CASES[0].t + " — " + CASES[0].line;
  body.appendChild(caseLine);

  const grid = document.createElement("div"); grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px;margin-bottom:12px";
  DEFENSES.forEach(([id, name, desc]) => {
    const b = document.createElement("button");
    b.style.cssText = "display:flex;gap:10px;align-items:flex-start;text-align:left;font:inherit;color:var(--text);background:var(--card);border:1px solid var(--line);border-radius:4px;padding:10px 12px;cursor:pointer;transition:border-color .15s";
    b.innerHTML = `<span class="led" style="margin-top:3px;flex:none"></span><span><span style="font-size:.88rem;font-weight:700">${name}</span><br><span style="font-size:.72rem;color:var(--text-2)">${desc}</span></span>`;
    b.onclick = () => {
      const before = calc(on);
      on.has(id) ? on.delete(id) : on.add(id);
      b.style.borderColor = on.has(id) ? "var(--accent)" : "var(--line)";
      b.querySelector(".led").className = on.has(id) ? "led on" : "led";
      const after = calc(on);
      const vecs = VECTORS.filter(v => v.blockedBy.includes(id)).map(v => tf("「{}（{}）」", v.k, v.plain)).join(t("和"));
      if (on.has(id)) {
        feedback(after < before
          ? tf("勾上「{}」：残余幻觉 {}% → {}%，一下挡掉 {} 个点——它堵的是 {}。", name, before, after, before - after, vecs)
          : tf("勾上「{}」：读数没动，因为它管的 {} 已经被别的防御挡住了。这不是白勾——单层防御被绕穿时，它就是备份。多层组合的冗余正是把博弈成本顶上去的方式。", name, vecs));
      } else {
        feedback(after > before
          ? tf("拆掉「{}」：残余幻觉 {}% → {}%，回升 {} 个点——{} 的通道又敞开了。缺一层，就漏一条道。", name, before, after, after - before, vecs)
          : tf("拆掉「{}」：读数没动，{} 还有别的防御顶着。但你刚拆掉的是那道备份。", name, vecs));
      }
      render();
    };
    grid.appendChild(b);
  });
  body.appendChild(grid);

  /* 即时白话反馈：只在勾选/换案例那一下写 DOM */
  const fb = document.createElement("div");
  fb.className = "step-note"; fb.style.marginTop = "0"; fb.style.marginBottom = "12px";
  body.appendChild(fb);
  function feedback(msg) { fb.innerHTML = `<span class="label">${t("刚才这一下")}</span><p>${msg}</p>`; }
  feedback(t("还没勾任何防御——四条通道全开着。先看下面哪条红色条最粗，挑一个专堵它的防御勾上，看读数怎么动。"));

  const bars = document.createElement("div"); bars.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:12px"; body.appendChild(bars);
  const out = readout(body, "");
  const mt = miniTable(body, {
    cols: [t("防御"), t("状态"), t("它堵的通道"), t("此刻的账")], rows: [],
    note: t("逐防御对账（按边际算）：已开的=此刻拆掉它幻觉回升几个点；未开的=此刻勾上还能压几个点。0 点不等于没用——通道被别的防御挡着时，它是冗余备份。")
  });

  function render() {
    let illusion = 0, total = 0;
    bars.innerHTML = "";
    VECTORS.forEach((v, i) => {
      const blocked = v.blockedBy.some(d => on.has(d));
      const base = bases[i];
      const remain = blocked ? Math.round(base * 0.18) : base;
      illusion += remain; total += base;
      const row = document.createElement("div");
      row.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:.74rem;color:var(--text-2);font-family:var(--font-mono)"><span>${tf("{}（{}）", v.k, v.plain)}</span><span style="color:${blocked ? "var(--green)" : "var(--red)"}">${blocked ? t("已挡下 ") : ""}${remain}%</span></div>
        <div style="height:7px;border-radius:4px;background:var(--ink-700);overflow:hidden;margin-top:3px"><div style="width:${remain / 50 * 100}%;height:100%;background:${blocked ? "var(--green)" : "var(--red)"}"></div></div>`;
      bars.appendChild(row);
    });
    const real = Math.max(0, 100 - illusion);
    out.innerHTML = `${tf(`残余幻觉 <span class="big" style="color:var(--red)">{}%</span> &nbsp;·&nbsp; 真实信号占比 <span class="big" style="color:var(--green)">{}%</span>`, illusion, real)}
      <div style="font-size:.82rem;margin-top:6px;opacity:.9">${real >= 80 ? t("✓ 稳了。注意：没有单一防御能挡住一切，是多层组合(尤其『解耦』+『held-out』)把博弈成本顶到不划算。") : on.size === 0 ? t("裸奔的 eval：优化压力会把这几条通道全部走满。挑几个防御勾上。") : t("还有通道敞着。看红色条：它们的 blockedBy 还没被你勾中。")}</div>`;

    mt.update(DEFENSES.map(([id, name]) => {
      const vecs = VECTORS.filter(v => v.blockedBy.includes(id)).map(v => v.plain).join(t("、"));
      if (on.has(id)) {
        const without = new Set(on); without.delete(id);
        const d = calc(without) - calc(on);
        return [name, t("已开"), vecs, d > 0 ? tf("拆掉它幻觉 +{} 点", d) : t("冗余备份（0 点）")];
      }
      const withIt = new Set(on); withIt.add(id);
      const d = calc(on) - calc(withIt);
      return [name, t("未开"), vecs, d > 0 ? tf("勾上可再压 {} 点", d) : t("此刻压不动（通道已被挡）")];
    }));
  }
  render();
});
