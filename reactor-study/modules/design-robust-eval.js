/* REACTOR · design-robust-eval.js (C03) — pick defenses, watch the attack */
import { mount, readout, scoped } from "/reactor-study/modules/mod-kit.js?v=fccf0ac854";

const VECTORS = [
  { k: "题目过拟合", base: 34, blockedBy: ["heldout", "rotate"] },
  { k: "维度窄化", base: 22, blockedBy: ["paired", "cap"] },
  { k: "直接造假", base: 18, blockedBy: ["audit", "decouple"] },
  { k: "风格/表面刷分", base: 16, blockedBy: ["paired", "audit"] }
];
const DEFENSES = [
  ["heldout", "隐藏测试集 (held-out)", "留一组优化循环永远看不到的题"],
  ["rotate", "动态/轮换题库", "让博弈追不上（Dynabench/LiveBench）"],
  ["paired", "配对指标制衡", "互相拉扯的指标组，难被同时博弈"],
  ["decouple", "eval 与优化解耦", "eval 只诊断，不直接驱动改模型（Deming）"],
  ["audit", "随机人工抽检", "抽真实会话让人读：对抗不可测部分"],
  ["cap", "承认容量约束/限压", "别把全部优化压力压在一个窄 eval 上"]
];

mount("design-robust-eval", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "12px";
  intro.textContent = "勾选防御手段。系统会对你的 eval 发起一次 gaming 攻击，看还剩多少『幻觉』穿过去。目标：把真实信号占比顶上去。";
  body.appendChild(intro);
  const on = new Set();
  const grid = document.createElement("div"); grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px;margin-bottom:16px";
  DEFENSES.forEach(([id, name, desc]) => {
    const b = document.createElement("button");
    b.style.cssText = "display:flex;gap:10px;align-items:flex-start;text-align:left;font:inherit;color:var(--text);background:var(--card);border:1px solid var(--line);border-radius:4px;padding:10px 12px;cursor:pointer;transition:.15s";
    b.innerHTML = `<span class="led" style="margin-top:3px;flex:none"></span><span><span style="font-size:.88rem;font-weight:700">${name}</span><br><span style="font-size:.72rem;color:var(--text-2)">${desc}</span></span>`;
    b.onclick = () => { on.has(id) ? on.delete(id) : on.add(id); b.style.borderColor = on.has(id) ? "var(--accent)" : "var(--line)"; b.querySelector(".led").className = on.has(id) ? "led on" : "led"; render(); };
    grid.appendChild(b);
  });
  body.appendChild(grid);
  const bars = document.createElement("div"); bars.style.cssText = "display:flex;flex-direction:column;gap:8px;margin-bottom:12px"; body.appendChild(bars);
  const out = readout(body, "");
  function render() {
    let illusion = 0, total = 0;
    bars.innerHTML = "";
    VECTORS.forEach(v => {
      const blocked = v.blockedBy.some(d => on.has(d));
      const remain = blocked ? Math.round(v.base * 0.18) : v.base;
      illusion += remain; total += v.base;
      const row = document.createElement("div");
      row.innerHTML = `<div style="display:flex;justify-content:space-between;font-size:.74rem;color:var(--text-2);font-family:var(--font-mono)"><span>${v.k}</span><span style="color:${blocked ? "var(--green)" : "var(--red)"}">${blocked ? "已挡下 " : ""}${remain}%</span></div>
        <div style="height:7px;border-radius:4px;background:var(--ink-700);overflow:hidden;margin-top:3px"><div style="width:${remain / 40 * 100}%;height:100%;background:${blocked ? "var(--green)" : "var(--red)"}"></div></div>`;
      bars.appendChild(row);
    });
    const real = Math.max(0, 100 - illusion);
    out.innerHTML = `残余幻觉 <span class="big" style="color:var(--red)">${illusion}%</span> &nbsp;·&nbsp; 真实信号占比 <span class="big" style="color:var(--green)">${real}%</span>
      <div style="font-size:.82rem;margin-top:6px;opacity:.9">${real >= 80 ? "✓ 稳了。注意：没有单一防御能挡住一切，是多层组合(尤其『解耦』+『held-out』)把博弈成本顶到不划算。" : on.size === 0 ? "裸奔的 eval：优化压力会把这四条通道全部走满。挑几个防御勾上。" : "还有通道敞着。看红色条：它们的 blockedBy 还没被你勾中。"}</div>`;
  }
  render();
});
