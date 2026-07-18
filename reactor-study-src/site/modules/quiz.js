/* REACTOR · quiz.js — LED 自测 + 可复用选项组
   config = { hint?, questions:[{ q, options:[{t, ok}], explain }] }（契约不变）
   另导出 optionGroup()：quiz 自己用，也给 explorable 的「先猜一猜」环节复用。
   mode "check" = 立即判分（绿对红错）；mode "pick" = 中性选择，只记录不判分。 */
import { mount } from "/modules/mod-kit.js";

export function optionGroup(container, { q, index, options = [], explain = "", mode = "check", onpick }) {
  const block = document.createElement("div");
  block.className = "opt-group";
  if (q) {
    const head = document.createElement("div");
    head.className = "opt-q";
    head.innerHTML = (index != null ? index + ". " : "") + q;
    block.appendChild(head);
  }
  const list = document.createElement("div"); list.className = "opt-list";
  const expl = document.createElement("div"); expl.className = "opt-expl";
  let choice = null;
  options.forEach((o, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "opt";
    b.innerHTML = `<span class="led"></span><span>${o.t}</span>`;
    b.onclick = () => {
      if (choice === i) return;                       // 没变就不动 DOM
      choice = i;
      list.querySelectorAll(".opt").forEach(x => {
        x.classList.remove("ok", "no", "sel");
        x.querySelector(".led").className = "led";
      });
      b.querySelector(".led").className = "led on";
      if (mode === "check") {
        b.classList.add(o.ok ? "ok" : "no");
        expl.style.display = "block";
        expl.innerHTML = `<span class="mono ${o.ok ? "t-ok" : "t-no"}">${o.ok ? "✓ 答对了" : "✕ 不是这个，再想想"}</span> · ${explain}`;
      } else {
        b.classList.add("sel");
      }
      if (onpick) onpick(i, o);
    };
    list.appendChild(b);
  });
  block.append(list, expl);
  container.appendChild(block);
  return { el: block, get choice() { return choice; } };
}

mount("quiz", (body, fig, { config }) => {
  const qs = config.questions || [];
  const intro = document.createElement("p");
  intro.className = "label"; intro.style.marginBottom = "12px";
  intro.textContent = config.hint || "自测 · 每题选一个答案，绿灯是对，红灯是错。";
  body.appendChild(intro);

  const state = qs.map(() => null);
  qs.forEach((qq, qi) => {
    optionGroup(body, {
      q: qq.q, index: qi + 1, options: qq.options, explain: qq.explain, mode: "check",
      onpick: (i, o) => { state[qi] = !!o.ok; score(); }
    });
  });

  let strip = null, lastKey = "";
  if (qs.length > 1) {
    strip = document.createElement("div");
    strip.className = "quiz-score";
    strip.innerHTML = `<span class="leds">${qs.map(() => `<span class="led"></span>`).join("")}</span>
      <span class="mono qs-text"></span>`;
    body.appendChild(strip);
    score();
  }
  function score() {
    if (!strip) return;
    const key = state.join(",");
    if (key === lastKey) return;                      // 值没变就不更新
    lastKey = key;
    [...strip.querySelectorAll(".leds .led")].forEach((led, i) => {
      led.className = "led" + (state[i] == null ? "" : state[i] ? " on q-ok" : " on q-no");
    });
    const done = state.filter(s => s != null).length;
    const right = state.filter(Boolean).length;
    strip.querySelector(".qs-text").textContent = `已答 ${done} / ${qs.length} · 答对 ${right}`;
  }
});
