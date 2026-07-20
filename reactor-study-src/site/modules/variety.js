/* REACTOR · variety.js (B11) — Ashby's Law of Requisite Variety */
import { mount, controls, slider, add, readout, scoped } from "/modules/mod-kit.js";
import { t, tf } from "/modules/mod-i18n.js";

mount("variety", (body, fig, { config }) => {
  const C = scoped(fig);
  const intro = document.createElement("p"); intro.className = "label"; intro.style.marginBottom = "10px";
  intro.textContent = t("系统会遇到 D 种不同扰动。你的控制器只有 V 种应对动作。Ashby：只有多样性能消灭多样性。V < D 时，多出来的扰动无论如何都会漏过去。");
  body.appendChild(intro);
  let D = 16, V = 6;
  const ctrl = controls(body);
  add(ctrl,
    slider(body, { label: t("扰动的多样性 D（系统有多复杂）"), min: 4, max: 30, step: 1, value: 16, fmt: v => v }).on(v => { D = v; draw(); }),
    slider(body, { label: t("控制器的多样性 V（你的指标/手段有多少）"), min: 1, max: 30, step: 1, value: 6, fmt: v => v }).on(v => { V = v; draw(); })
  );
  const gridWrap = document.createElement("div");
  gridWrap.style.cssText = "display:flex;flex-wrap:wrap;gap:5px;margin:10px 0;max-width:520px";
  body.appendChild(gridWrap);
  const out = readout(body, "");
  function draw() {
    gridWrap.innerHTML = "";
    const covered = Math.min(V, D);
    for (let i = 0; i < D; i++) {
      const cell = document.createElement("div");
      const ok = i < covered;
      cell.style.cssText = `width:26px;height:26px;border-radius:3px;border:1px solid ${ok ? "var(--accent)" : "var(--red)"};
        background:${ok ? "color-mix(in srgb,var(--accent) 22%,transparent)" : "color-mix(in srgb,var(--red) 14%,transparent)"};
        box-shadow:${ok ? "0 0 8px var(--accent-glow)" : "none"};display:flex;align-items:center;justify-content:center;
        font-family:var(--font-mono);font-size:.6rem;color:${ok ? "var(--accent)" : "var(--red)"}`;
      cell.textContent = ok ? "✓" : "✕";
      gridWrap.appendChild(cell);
    }
    const leak = Math.max(0, D - V);
    out.innerHTML = `${tf(`控制器能中和 <span class="big">{}</span>/{} 种扰动，<strong style="color:var(--red)">{}</strong> 种漏过（红）。`, Math.min(V, D), D, leak)}
      <div style="font-size:.8rem;margin-top:6px;opacity:.9">${leak > 0 ? t("V(O) ≥ V(D) − V(R)：想把结果的方差压到零，控制器的多样性至少要匹配扰动的多样性。一个单一指标（V 很小）永远约束不住一个复杂系统，这就是 Goodhart 的控制论根源。") : t("V ≥ D：控制器足够多样，每种扰动都有对应动作。但现实里 D 通常远大于任何指标能提供的 V。")}</div>`;
  }
  draw();
});
